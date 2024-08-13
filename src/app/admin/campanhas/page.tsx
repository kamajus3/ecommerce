'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { randomBytes } from 'crypto'
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { ICampaign, IProductInput } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import contants from '@/constants'
import { publishedSince } from '@/functions'
import { CampaignRepository } from '@/repositories/campaign.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { storage } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  title: string
  default: boolean
  fixed: boolean
  description: string
  reduction?: string
  startDate?: string
  finishDate?: string
  products?: IProductInput[]
  photo: Blob
}

interface ITableRow {
  data: ICampaign
  _delete(): void
  _edit(data: IFormData, oldData?: ICampaign): Promise<void>
}

interface IFilterData {
  search: string
  orderBy: string
}

function TableRow({ data, _delete, _edit }: ITableRow) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <Table.R inside="body">
      <Table.D>{data.title}</Table.D>
      <Table.D>{data.startDate ? publishedSince(data.startDate) : '-'}</Table.D>
      <Table.D>
        {data.finishDate ? publishedSince(data.finishDate) : '-'}
      </Table.D>
      <Table.D>{publishedSince(data.createdAt)}</Table.D>
      <Table.D>{publishedSince(data.updatedAt)}</Table.D>
      <Table.D>{data.products ? data.products.length : '-'}</Table.D>
      <Table.D>{data.default ? 'Sim' : 'Não'}</Table.D>
      <Table.D>{data.fixed ? 'Sim' : 'Não'}</Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          Apagar
        </Button>
        <Modal.Dialog
          title="Apagar a campanha"
          description="Você tem certeza que queres apagar essa campanha?"
          actionTitle="Apagar"
          themeColor={contants.colors.error}
          action={_delete}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-violet-600"
          onClick={() => setOpenEditModal(true)}
        >
          Editar
        </Button>
        <Modal.Campaign
          title="Editar campanha"
          actionTitle="Editar"
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={_edit}
          defaultData={{ ...data }}
        />
      </Table.D>
    </Table.R>
  )
}

const schema = z.object({
  search: z.string().trim(),
  orderBy: z.string().trim(),
})

export default function PromotionPage() {
  const productRepository = useMemo(() => new ProductRepository(), [])
  const campaignRepository = useMemo(() => new CampaignRepository(), [])

  const [campaignData, setCampaignData] = useState<ICampaign[]>([])
  const [loading, setLoading] = useState(true)

  const [newModal, setNewModal] = useState(false)

  const { register, watch } = useForm<IFilterData>({
    defaultValues: {
      orderBy: 'updatedAt',
    },
    resolver: zodResolver(schema),
  })

  const orderByValue = watch('orderBy')

  function _post(data: IFormData) {
    const id = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/campaigns/${id}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)

        campaignRepository
          .create(
            {
              title: data.title,
              description: data.description,
              default: data.default,
              fixed: data.fixed,
              reduction: data.reduction,
              startDate: data.startDate,
              finishDate: data.finishDate,
              products: data.products && data.products.map((p) => p.id),
              photo,
            },
            id,
          )
          .then(async (data) => {
            setCampaignData((previousData) => [
              data,
              ...previousData.filter((d) => d.id !== id),
            ])
            if (data.products) {
              data.products.map(async (productId) => {
                productRepository.update(
                  {
                    campaign: {
                      id,
                      title: data.title,
                      reduction: data.reduction,
                      startDate: data.startDate,
                      finishDate: data.finishDate,
                    },
                  },
                  productId,
                )
              })
            }

            toast.success('Campanha postada com sucesso')
          })
          .catch(() => {
            toast.error('Erro criar a campanha')
          })
      })
      .catch(() => {
        toast.error('Erro a criar campanha')
      })
  }

  async function _edit(data: IFormData, oldData?: ICampaign) {
    if (oldData && oldData.id) {
      const reference = storageRef(storage, `/campaigns/${oldData.id}`)
      await uploadBytes(reference, data.photo)

      const oldDataProductsId = oldData.products
      const newDataProductsId = data.products && data.products.map((p) => p.id)

      campaignRepository
        .update(
          {
            title: data.title,
            description: data.description,
            default: data.default,
            fixed: data.fixed,
            reduction: data.reduction,
            startDate: data.startDate,
            finishDate: data.finishDate,
            products: newDataProductsId,
            photo: oldData.photo,
          },
          oldData.id,
        )
        .then(async () => {
          if (oldData.default === false && data.default) {
            const campaignProducts = await productRepository.find({
              filterBy: {
                'campaign/id': oldData.id,
              },
            })
            campaignProducts.map(async (p) => {
              await productRepository.update(
                {
                  campaign: undefined,
                },
                p.id,
              )
            })
          }

          if (data.products) {
            if (newDataProductsId && newDataProductsId !== oldDataProductsId) {
              const deletedProducts =
                newDataProductsId && oldDataProductsId
                  ? oldDataProductsId.filter(
                      (id) => !newDataProductsId.includes(id),
                    )
                  : []

              newDataProductsId.map(async (id) => {
                if (deletedProducts.includes(id) || data.default) {
                  await productRepository.update(
                    {
                      campaign: undefined,
                    },
                    id,
                  )
                } else {
                  await productRepository.update(
                    {
                      campaign: {
                        id: oldData.id,
                        title: data.title,
                        reduction: data.reduction,
                        startDate: data.startDate,
                        finishDate: data.finishDate,
                      },
                    },
                    id,
                  )
                }
              })
            }
          }

          toast.success('Campanha editada com sucesso')
        })
        .catch(() => {
          toast.error('Erro a editar a campanha')
        })
    } else {
      toast.error('Erro a editar a campanha')
    }
  }

  async function _delete(id: string) {
    const storageReference = storageRef(storage, `campaigns/${id}`)

    try {
      await campaignRepository.deleteById(id)
      await deleteObject(storageReference)

      const campaignProducts = await productRepository.find({
        filterBy: {
          'campaign/id': id,
        },
      })

      if (campaignProducts) {
        Object.entries(campaignProducts).map(async ([id]) => {
          await productRepository.update(
            {
              campaign: undefined,
            },
            id,
          )
        })
      }

      toast.success('Campanha apagada com sucesso')
    } catch {
      toast.error('Erro ao apagar a campanha')
    }
  }

  const getCampaigns = useCallback(async () => {
    const campaigns = await campaignRepository.find({
      orderBy: orderByValue,
    })

    setCampaignData(campaigns)
  }, [campaignRepository, orderByValue])

  useEffect(() => {
    setLoading(true)
    ;(async function () {
      await getCampaigns().finally(() => {
        setLoading(false)
      })
    })()
  }, [getCampaigns])

  return (
    <section className="bg-white min-h-screen pb-12">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <h1 className="text-black font-semibold text-3xl p-9">
          Minhas campanhas
        </h1>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <Button
            style={{
              padding: '14px 18px 14px 18px',
              backgroundColor: '#8B6CEF',
            }}
            className="w-auto max-sm:w-full mt-2"
            onClick={() => {
              setNewModal(true)
            }}
          >
            Criar campanha
          </Button>

          <Field.Select
            {...register('orderBy')}
            style={{
              padding: '13px 18px 13px 18px',
            }}
            className="w-auto max-sm:w-full"
            options={[
              {
                value: 'updatedAt',
                label: 'Ordernar pela data de atualização',
              },
              {
                value: 'createdAt',
                label: 'Ordernar pela data de criação',
              },
              {
                value: 'name',
                label: 'Ordernar pelo título',
              },
            ]}
          />
        </div>
      </article>

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(campaignData).length}
          loading={loading}
          noDataMessage="As suas campanhas aparecerão aqui"
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>Título</Table.H>
                <Table.H>Início</Table.H>
                <Table.H>Fim</Table.H>
                <Table.H>Data de criação</Table.H>
                <Table.H>Data de atualização</Table.H>
                <Table.H>Productos</Table.H>
                <Table.H>Padrão</Table.H>
                <Table.H>Fixado</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
              {Object.entries(campaignData).map(([id, campaign]) => (
                <TableRow
                  key={id}
                  data={{
                    ...campaign,
                    id,
                  }}
                  _delete={() => {
                    _delete(id)
                  }}
                  _edit={_edit}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
      <Modal.Campaign
        title="Nova campanha"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={_post}
      />
    </section>
  )
}
