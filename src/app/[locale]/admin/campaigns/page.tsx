'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { randomBytes } from 'crypto'
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { Check, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as z from 'zod'

import { ICampaign, IProductInput, LocaleKey } from '@/@types'
import Button from '@/components/Button'
import DataState from '@/components/DataState'
import Field from '@/components/Field'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import constants from '@/constants'
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
  endDate?: string
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
  const t = useTranslations('admin.campaign')
  const locale = useLocale() as LocaleKey

  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <Table.R inside="body">
      <Table.D>{data.title}</Table.D>
      <Table.D>
        {data.startDate
          ? publishedSince({
              lng: locale,
              date: data.startDate,
            })
          : '-'}
      </Table.D>
      <Table.D>
        {data.endDate
          ? publishedSince({
              lng: locale,
              date: data.endDate,
            })
          : '-'}
      </Table.D>
      <Table.D>
        {publishedSince({
          lng: locale,
          date: data.createdAt,
        })}
      </Table.D>
      <Table.D>
        {publishedSince({
          lng: locale,
          date: data.updatedAt,
        })}
      </Table.D>
      <Table.D>{data.products ? data.products.length : '-'}</Table.D>
      <Table.D>
        {data.default ? (
          <Check className="inline" size={15} />
        ) : (
          <X className="inline" size={15} />
        )}
      </Table.D>
      <Table.D>
        {data.fixed ? (
          <Check className="inline" size={15} />
        ) : (
          <X className="inline" size={15} />
        )}
      </Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          {t('table.content.delete.action')}
        </Button>
        <Modal.Dialog
          title={t('table.content.delete.title')}
          description={t('table.content.delete.description')}
          actionTitle={t('table.content.delete.action')}
          themeColor={constants.colors.error}
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
          {t('table.content.edit.action')}
        </Button>
        <Modal.Campaign
          title={t('table.content.edit.title')}
          actionTitle={t('table.content.edit.action')}
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

export default function CampaignPage() {
  const t = useTranslations('admin.campaign')

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
              endDate: data.endDate,
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
                      endDate: data.endDate,
                    },
                  },
                  productId,
                )
              })
            }

            toast.success(t('successful'))
          })
          .catch(() => {
            toast.error(t('error'))
          })
      })
      .catch(() => {
        toast.error(t('error'))
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
            endDate: data.endDate,
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
                        endDate: data.endDate,
                      },
                    },
                    id,
                  )
                }
              })
            }
          }

          toast.success(t('table.content.edit.successful'))
        })
        .catch(() => {
          toast.error(t('table.content.edit.error'))
        })
    } else {
      toast.error(t('table.content.edit.error'))
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
        campaignProducts.map(async (c) => {
          await productRepository.update(
            {
              campaign: undefined,
            },
            c.id,
          )
        })
      }

      toast.success(t('table.content.delete.successful'))
    } catch (error) {
      toast.error(t('table.content.delete.error'))
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
        <h1 className="text-black font-semibold text-3xl p-9">{t('title')}</h1>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <Button
            style={{
              padding: '14px 18px 14px 18px',
            }}
            className="w-auto max-sm:w-full mt-2 bg-secondary"
            onClick={() => {
              setNewModal(true)
            }}
          >
            {t('addNew')}
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
                label: t('orderBy.updatedAt'),
              },
              {
                value: 'createdAt',
                label: t('orderBy.createdAt'),
              },
              {
                value: 'title',
                label: t('orderBy.title'),
              },
            ]}
          />
        </div>
      </article>

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={campaignData.length}
          loading={loading}
          noDataMessage={t('noDataMessage')}
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>{t('table.header.title')}</Table.H>
                <Table.H>{t('table.header.startDate')}</Table.H>
                <Table.H>{t('table.header.endDate')}</Table.H>
                <Table.H>{t('table.header.createdDate')}</Table.H>
                <Table.H>{t('table.header.updatedDate')}</Table.H>
                <Table.H>{t('table.header.products')}</Table.H>
                <Table.H>{t('table.header.default')}</Table.H>
                <Table.H>{t('table.header.fixed')}</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
              {campaignData.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  data={campaign}
                  _delete={() => {
                    _delete(campaign.id)
                  }}
                  _edit={_edit}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
      <Modal.Campaign
        title={t('addNew')}
        actionTitle={t('action-new')}
        isOpen={newModal}
        setOpen={setNewModal}
        action={_post}
      />
    </section>
  )
}
