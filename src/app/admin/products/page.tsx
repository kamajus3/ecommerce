'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { randomBytes } from 'crypto'
import {
  child,
  get,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
  set,
  update,
} from 'firebase/database'
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { useForm } from 'react-hook-form'
import { Bounce, toast } from 'react-toastify'
import * as z from 'zod'

import { IProduct } from '@/@types'
import Button from '@/components/ui/Button'
import DataState from '@/components/ui/DataState'
import Field from '@/components/ui/Field'
import Header from '@/components/ui/Header'
import Modal from '@/components/ui/Modal'
import Table from '@/components/ui/Table'
import contants from '@/constants'
import { publishedSince } from '@/functions'
import useMoneyFormat from '@/hooks/useMoneyFormat'
import { database, storage } from '@/lib/firebase/config'
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
  const money = useMoneyFormat()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <Table.R inside="body">
      <Table.D>
        <Image
          width={70}
          height={70}
          src={product.photo}
          alt={product.name}
          draggable={false}
          className="select-none"
        />
      </Table.D>
      <Table.D>{product.name}</Table.D>
      <Table.D>{product.category}</Table.D>
      <Table.D>{money.format(product.price)}</Table.D>
      <Table.D>{product.quantity}</Table.D>
      <Table.D>{publishedSince(product.createdAt)}</Table.D>
      <Table.D>{publishedSince(product.updatedAt)}</Table.D>
      <Table.D>
        <Button
          variant="no-background"
          className="mx-auto text-red-500"
          onClick={() => setOpenDeleteModal(true)}
        >
          Apagar
        </Button>
        <Modal.Dialog
          title="Apagar producto"
          description="Você tem certeza que queres apagar esse producto difinitivamente?"
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
        <Modal.Product
          title="Editar producto"
          actionTitle="Editar"
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

function reverseData(obj: Record<string, IProduct>) {
  const newObj: Record<string, IProduct> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function ProductPage() {
  const [productData, setProductData] = useState<Record<string, IProduct>>({})
  const [loading, setLoading] = useState(true)

  const [newModal, setNewModal] = useState(false)

  const { register, watch } = useForm<IFilterData>({
    defaultValues: {
      orderBy: 'updatedAt',
    },
    resolver: zodResolver(schema),
  })

  const orderByValue = watch('orderBy')

  function _create(data: IFormData) {
    const id = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/products/${id}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)
        set(ref(database, `products/${id}`), {
          name: data.name,
          nameLowerCase: data.name.toLocaleLowerCase(),
          quantity: data.quantity,
          price: data.price,
          category: data.category,
          description: data.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          photo,
        })
          .then(() => {
            toast.success('Producto postada com sucesso', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            })
          })
          .catch(() => {
            toast.error('Erro a fazer a postagem', {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Bounce,
            })
          })
      })
      .catch(() => {
        toast.error('Erro a fazer a postagem', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        })
      })
  }

  async function _edit(data: IFormData, oldProduct?: IProduct) {
    if (oldProduct && oldProduct.id) {
      const reference = storageRef(storage, `/products/${oldProduct.id}`)

      await uploadBytes(reference, data.photo)
      update(ref(database, `/products/${oldProduct.id}`), {
        name: data.name,
        nameLowerCase: data.name.toLocaleLowerCase(),
        quantity: data.quantity,
        price: data.price,
        category: data.category,
        description: data.description,
        photo: oldProduct.photo,
        updatedAt: new Date().toISOString(),
      })
        .then(() => {
          toast.success('Producto editado com sucesso', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
        })
        .catch(() => {
          toast.error('Erro a fazer a postagem', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
          })
        })
    } else {
      toast.error('Erro a editar o produto', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  async function _delete(
    id: string,
    campaign?: {
      id: string
      title: string
      reduction?: string
    },
  ) {
    const databaseReference = ref(database, `products/${id}`)
    const storageReference = storageRef(storage, `products/${id}`)

    try {
      await remove(databaseReference)
      await deleteObject(storageReference)

      if (campaign) {
        get(child(ref(database), `campaigns/${campaign.id}`)).then(
          (snapshot) => {
            if (snapshot.exists()) {
              update(ref(database, `campaigns/${campaign.id}`), {
                products: snapshot
                  .val()
                  .products.filter((p: string) => p !== id),
              })
            }
          },
        )
      }

      toast.success('Produto apagado com sucesso', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    } catch (error) {
      toast.error('Erro a apagar o produto', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    }
  }

  useEffect(() => {
    const reference = ref(database, 'products/')
    const productQuery = query(reference, orderByChild(orderByValue))

    onValue(productQuery, (snapshot) => {
      const results: Record<string, IProduct> = {}
      if (snapshot.exists()) {
        snapshot.forEach(function (child) {
          results[child.key] = child.val()
        })
        setProductData(reverseData(results))
      }

      setLoading(false)
    })
  }, [orderByValue])

  return (
    <section className="bg-white min-h-screen pb-12">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <h2 className="text-black font-semibold text-3xl p-9">
          Meus productos
        </h2>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          <Button
            style={{
              padding: '14px 18px 14px 18px',
              backgroundColor: contants.colors.secondary,
            }}
            className="w-auto max-sm:w-full mt-2"
            onClick={() => {
              setNewModal(true)
            }}
          >
            Adicionar novo
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
                label: 'Ordernar pelo nome',
              },
            ]}
          />
        </div>
      </article>

      <article className="px-8 mx-auto mb-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(productData).length}
          loading={loading}
          noDataMessage="Os productos cadastrados aparecerão aqui"
        >
          <Table.Root>
            <thead>
              <Table.R inside="head">
                <Table.H>Foto</Table.H>
                <Table.H>Nome</Table.H>
                <Table.H>Categória</Table.H>
                <Table.H>Preço</Table.H>
                <Table.H>Quantidade</Table.H>
                <Table.H>Data de criação</Table.H>
                <Table.H>Data de atualização</Table.H>
                <Table.H>-</Table.H>
                <Table.H>-</Table.H>
              </Table.R>
            </thead>
            <Table.Body>
              {Object.entries(productData).map(([id, product]) => (
                <TableRow
                  key={id}
                  product={{
                    ...product,
                    id,
                  }}
                  _delete={() => {
                    _delete(id, product?.campaign)
                  }}
                  _edit={_edit}
                />
              ))}
            </Table.Body>
          </Table.Root>
        </DataState>
      </article>
      <Modal.Product
        title="Novo producto"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={_create}
      />
    </section>
  )
}
