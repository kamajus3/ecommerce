'use client'

import Header from '@/app/components/Header'
import { ProductItem } from '@/@types'
import Image from 'next/image'
import Modal from '@/app/components/Modal'
import { useEffect, useState } from 'react'
import * as z from 'zod'
import { toast, Bounce } from 'react-toastify'
import useMoneyFormat from '@/hooks/useMoneyFormat'
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
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { database, storage } from '@/lib/firebase/config'
import { randomBytes } from 'crypto'
import { URLtoFile, publishedSince } from '@/functions'
import DataState from '@/app/components/DataState'
// import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/app/components/Button'
import Field from '@/app/components/Field'

interface FormData {
  name: string
  quantity: number
  price: number
  category: string
  description: string
  photo: Blob
}

interface FilterFormData {
  search: string
  orderBy: string
}

interface TableRowProps {
  product: ProductItem
  deleteProduct(): void
  editProduct(data: FormData, oldProduct?: ProductItem): Promise<void>
}

function TableRow({ product, deleteProduct, editProduct }: TableRowProps) {
  const money = useMoneyFormat()
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  return (
    <tr className="border-y border-gray-200 border-y-[#dfdfdf]">
      <td className="p-3">
        <div className="flex items-center justify-center">
          <Image
            width={70}
            height={70}
            src={product.photo}
            alt={product.name}
            draggable={false}
            className="select-none"
          />
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">{product.name}</div>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">
          {product.category}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {money.format(product.price)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {product.quantity}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(product.createdAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(product.updatedAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenDeleteModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-red-500 font-medium">Apagar</span>
          </button>
        </div>
        <Modal.Dialog
          title="Apagar producto"
          description="Você tem certeza que queres apagar esse producto difinitivamente?"
          actionTitle="Apagar"
          mainColor="#dc2626"
          action={deleteProduct}
          isOpen={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center">
          <button
            onClick={() => setOpenEditModal(true)}
            className="text-gray-700 p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            <span className="text-violet-600 font-medium">Editar</span>
          </button>
        </div>
        <Modal.Product
          title="Editar producto"
          actionTitle="Editar"
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={editProduct}
          defaultProduct={{ ...product }}
        />
      </td>
    </tr>
  )
}

const schema = z.object({
  search: z.string().trim(),
  orderBy: z.string().trim(),
})

function reverseData(obj: Record<string, ProductItem>) {
  const newObj: Record<string, ProductItem> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function ProductPage() {
  const [productData, setProductData] = useState<Record<string, ProductItem>>(
    {},
  )
  const [loading, setLoading] = useState(true)

  const [newModal, setNewModal] = useState(false)

  const { register, watch } = useForm<FilterFormData>({
    defaultValues: {
      orderBy: 'updatedAt',
    },
    resolver: zodResolver(schema),
  })
  // const searchValue = watch('search')
  const orderByValue = watch('orderBy')

  function postProduct(data: FormData) {
    const postId = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/products/${postId}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)
        set(ref(database, 'products/' + postId), {
          name: data.name,
          nameLowerCase: data.name.toLocaleLowerCase(),
          quantity: data.quantity,
          price: data.price,
          category: data.category,
          description: data.description,
          photo,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
          .then(() => {
            toast.success(`Producto postada com sucesso`, {
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
            toast.error(`Erro a fazer a postagem`, {
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
        toast.error(`Erro a fazer a postagem`, {
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

  async function editProduct(data: FormData, oldProduct?: ProductItem) {
    if (oldProduct && oldProduct.id) {
      const reference = storageRef(storage, `/products/${oldProduct.id}`)
      const oldPhoto = await URLtoFile(oldProduct.photo)

      if (oldPhoto !== data.photo) {
        await uploadBytes(reference, data.photo)
      }

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
          toast.success(`Producto editado com sucesso`, {
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
          toast.error(`Erro a fazer a postagem`, {
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
      toast.error(`Erro a editar o produto`, {
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

  async function deleteProduct(
    id: string,
    promotion?: {
      id: string
      title: string
      reduction: number
    },
  ) {
    const databaseReference = ref(database, `products/${id}`)
    const storageReference = storageRef(storage, `products/${id}`)

    try {
      await remove(databaseReference)
      await deleteObject(storageReference)

      if (promotion) {
        get(child(ref(database), `promotions/${promotion.id}`)).then(
          (snapshot) => {
            if (snapshot.exists()) {
              set(ref(database, `promotions/${promotion.id}`), {
                ...snapshot.val(),
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
      const results: Record<string, ProductItem> = {}
      snapshot.forEach(function (child) {
        results[child.key] = child.val()
      })

      setProductData(reverseData(results))
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
              backgroundColor: '#00A4C7',
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

      <article className="container mx-auto mt-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(productData).length}
          loading={loading}
          noDataMessage="Os productos cadastrados aparecerão aqui"
        >
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-[#dddddd]">
              <thead>
                <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Foto
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Nome
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Categória
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Preço
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Quantidade
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Data de criação
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Data de atualização
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    -
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    -
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {Object.entries(productData).map(([id, product]) => (
                  <TableRow
                    key={id}
                    product={{
                      ...product,
                      id,
                    }}
                    deleteProduct={() => {
                      deleteProduct(id, product?.promotion)
                    }}
                    editProduct={editProduct}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </DataState>
      </article>
      <Modal.Product
        title="Novo producto"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={postProduct}
      />
    </section>
  )
}
