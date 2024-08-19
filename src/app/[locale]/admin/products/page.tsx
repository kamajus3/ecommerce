'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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

import { IProduct, IProductCampaign } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import constants from '@/constants'
import { publishedSince } from '@/functions'
import { formatMoney, formatPhotoUrl } from '@/functions/format'
import { CampaignRepository } from '@/repositories/campaign.repository'
import { ProductRepository } from '@/repositories/product.repository'
import { storage } from '@/services/firebase/config'
import { zodResolver } from '@hookform/resolvers/zod'

interface IFormData {
  name: string
  quantity: number
  price: number
  category: string
  description: string
  photo: Blob
}

interface IFilterData {
  search: string
  orderBy: string
}

interface ITableRow {
  product: IProduct
  _delete(): void
  _edit(data: IFormData, oldProduct?: IProduct): Promise<void>
}

function TableRow({ product, _delete, _edit }: ITableRow) {
  const t = useTranslations()

  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <Table.R inside="body">
      <Table.D>
        <Image
          width={70}
          height={70}
          src={formatPhotoUrl(product.photo, product.updatedAt)}
          alt={product.name}
          draggable={false}
          className="select-none"
        />
      </Table.D>
      <Table.D>{product.name}</Table.D>
      <Table.D>{t(`categories.labels.${product.category}`)}</Table.D>
      <Table.D>{formatMoney(product.price)}</Table.D>
      <Table.D>{product.quantity}</Table.D>
      <Table.D>{publishedSince(product.createdAt)}</Table.D>
      <Table.D>{publishedSince(product.updatedAt)}</Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          {t('admin.campaign.table.content.delete.action')}
        </Button>
        <Modal.Dialog
          title={t('admin.campaign.table.content.delete.title')}
          description={t('admin.campaign.table.content.delete.description')}
          actionTitle={t('admin.campaign.table.content.delete.action')}
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
          {t('admin.campaign.table.content.edit.action')}
        </Button>
        <Modal.Product
          title={t('admin.campaign.table.content.edit.title')}
          actionTitle={t('admin.campaign.table.content.edit.action')}
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={_edit}
          defaultProduct={{ ...product }}
        />
      </Table.D>
    </Table.R>
  )
}

const schema = z.object({
  search: z.string().trim(),
  orderBy: z.string().trim(),
})

export default function ProductPage() {
  const [productData, setProductData] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)

  const [newModal, setNewModal] = useState(false)

  const { register, watch } = useForm<IFilterData>({
    defaultValues: {
      orderBy: 'updatedAt',
    },
    resolver: zodResolver(schema),
  })

  const t = useTranslations('admin.product')

  const orderByValue = watch('orderBy')

  const productRepository = useMemo(() => new ProductRepository(), [])
  const campaignRepository = useMemo(() => new CampaignRepository(), [])

  function _create(data: IFormData) {
    const id = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/products/${id}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)

        productRepository
          .create(
            {
              name: data.name,
              nameLowerCase: data.name.toLocaleLowerCase(),
              quantity: data.quantity,
              price: data.price,
              category: data.category,
              views: 0,
              description: data.description,
              photo,
            },
            id,
          )
          .then((data) => {
            setProductData((previousData) => [data, ...previousData])
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

  async function _edit(data: IFormData, oldProduct?: IProduct) {
    if (oldProduct && oldProduct.id) {
      const reference = storageRef(storage, `/products/${oldProduct.id}`)

      await uploadBytes(reference, data.photo)
      productRepository
        .update(
          {
            name: data.name,
            nameLowerCase: data.name.toLocaleLowerCase(),
            quantity: data.quantity,
            price: data.price,
            category: data.category,
            description: data.description,
            photo: oldProduct.photo,
          },
          oldProduct.id,
        )
        .then((data) => {
          if (data) {
            setProductData((previousData) => [
              data,
              ...previousData.filter((d) => d.id !== oldProduct.id),
            ])
            toast.success(t('table.content.edit.successful'))
          } else {
            toast.error(t('table.content.edit.error'))
          }
        })
        .catch(() => {
          toast.error(t('table.content.edit.error'))
        })
    } else {
      toast.error(t('table.content.edit.error'))
    }
  }

  async function _delete(id: string, campaign?: IProductCampaign) {
    const storageReference = storageRef(storage, `products/${id}`)

    try {
      await productRepository.deleteById(id)
      await deleteObject(storageReference)

      if (campaign) {
        campaignRepository.findById(id).then((campaign) => {
          if (campaign?.products) {
            campaignRepository.update(
              {
                products: campaign.products.filter((p: string) => p !== id),
              },
              id,
            )
          }
        })
      }
      toast.success(t('table.content.delete.successful'))
    } catch (error) {
      toast.error(t('table.content.delete.error'))
    }
  }

  const getProducts = useCallback(async () => {
    const products = await productRepository.find({
      orderBy: orderByValue,
    })

    setProductData(products)
  }, [orderByValue, productRepository])

  useEffect(() => {
    ;(async function () {
      await getProducts().finally(() => {
        setLoading(false)
      })
    })()
  }, [getProducts])

  return (
    <section className="bg-white min-h-screen pb-12">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <h2 className="text-black font-semibold text-3xl p-9">{t('title')}</h2>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <Button
            style={{
              padding: '14px 18px 14px 18px',
              backgroundColor: constants.colors.secondary,
            }}
            className="w-auto max-sm:w-full mt-2"
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
                value: 'name',
                label: t('orderBy.name'),
              },
            ]}
          />
        </div>
      </article>

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={productData.length}
          loading={loading}
          noDataMessage={t('noDataMessage')}
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>{t('table.header.photo')}</Table.H>
                <Table.H>{t('table.header.name')}</Table.H>
                <Table.H>{t('table.header.category')}</Table.H>
                <Table.H>{t('table.header.price')}</Table.H>
                <Table.H>{t('table.header.quantity')}</Table.H>
                <Table.H>{t('table.header.createdDate')}</Table.H>
                <Table.H>{t('table.header.updatedDate')}</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
              {productData.length > 0 &&
                productData.map((product) => (
                  <TableRow
                    key={product.id}
                    product={product}
                    _delete={() => {
                      _delete(product.id, product?.campaign)
                    }}
                    _edit={_edit}
                  />
                ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
      <Modal.Product
        title={t('addNew')}
        actionTitle={t('action-new')}
        isOpen={newModal}
        setOpen={setNewModal}
        action={_create}
      />
    </section>
  )
}
