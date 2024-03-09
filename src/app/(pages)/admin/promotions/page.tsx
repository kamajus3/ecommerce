'use client'

import Header from '@/app/components/Header'
import { ProductInputProps, PromotionItemEdit } from '@/@types'
import Modal from '@/app/components/Modal'
import { useEffect, useState } from 'react'
import { toast, Bounce } from 'react-toastify'
import * as z from 'zod'
import {
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
import { getProduct } from '@/lib/firebase/database'
import { useInformation } from '@/hooks/useInformation'
import DataState from '@/app/components/DataState'
// import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface FormData {
  title: string
  reduction: number
  startDate: string
  finishDate: string
  description: string
  fixed: boolean
  products: ProductInputProps[]
  photo: Blob
}

interface TableRowProps {
  data: PromotionItemEdit
  deletePromotion(): void
  editPromotion(data: FormData, oldData?: PromotionItemEdit): Promise<void>
}

interface FilterFormData {
  search: string
  orderBy: string
}

function TableRow({ data, deletePromotion, editPromotion }: TableRowProps) {
  const [openEditModal, setOpenEditModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const { informationsData } = useInformation()

  return (
    <tr className="border-y border-gray-200 border-y-[#dfdfdf]">
      <td className="p-3">
        <div className="text-center text-black font-medium">{data.title}</div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(data.startDate)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(data.finishDate)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(data.createdAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-[#919298] font-medium">
          {publishedSince(data.updatedAt)}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">
          {data.products.length}
        </div>
      </td>
      <td className="p-3">
        <div className="text-center text-black font-medium">
          {informationsData.promotionFixed === data.id ? 'sim' : 'não'}
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
          title="Apagar a campanha"
          description="Você tem certeza que queres apagar essa campanha?"
          actionTitle="Apagar"
          mainColor="#dc2626"
          action={deletePromotion}
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
        <Modal.Promotion
          title="Editar campanha"
          actionTitle="Editar"
          isOpen={openEditModal}
          setOpen={setOpenEditModal}
          action={editPromotion}
          defaultData={{ ...data }}
        />
      </td>
    </tr>
  )
}

const schema = z.object({
  search: z.string().trim(),
  orderBy: z.string().trim(),
})

function reverseData(obj: Record<string, PromotionItemEdit>) {
  const newObj: Record<string, PromotionItemEdit> = {}
  const revObj = Object.keys(obj).reverse()
  revObj.forEach(function (i) {
    newObj[i] = obj[i]
  })
  return newObj
}

export default function PromotionPage() {
  const [promotionData, setPromotionData] = useState<
    Record<string, PromotionItemEdit>
  >({})
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

  const { informationsData } = useInformation()

  function postPromotion(data: FormData) {
    const postId = randomBytes(20).toString('hex')
    const reference = storageRef(storage, `/promotions/${postId}`)

    uploadBytes(reference, data.photo)
      .then(async () => {
        const photo = await getDownloadURL(reference)
        update(ref(database, 'promotions/' + postId), {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          finishDate: data.finishDate,
          reduction: data.reduction,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          products: data.products.map((p) => p.id),
          photo,
        })
          .then(() => {
            data.products.map(async (p) => {
              const product = await getProduct(p.id)

              update(ref(database, 'products/' + p.id), {
                ...product,
                promotion: {
                  id: postId,
                  title: data.title,
                  reduction: data.reduction,
                  startDate: data.startDate,
                  finishDate: data.finishDate,
                },
              })
            })

            if (data.fixed) {
              update(ref(database, 'informations/'), {
                promotionFixed: postId,
              })
            }

            toast.success(`Campanha postada com sucesso`, {
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
            toast.error('Erro criar a campanha', {
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
        toast.error('Erro a criar campanha', {
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

  async function editPromotion(data: FormData, oldData?: PromotionItemEdit) {
    if (oldData && oldData.id) {
      const reference = storageRef(storage, `/promotions/${oldData.id}`)
      const oldPhoto = await URLtoFile(oldData.photo)

      if (oldPhoto !== data.photo) {
        await uploadBytes(reference, data.photo)
      }

      const oldDataProductsId = oldData.products
      const newDataProductsId = data.products.map((p) => p.id)

      update(ref(database, `/promotions/${oldData.id}`), {
        title: data.title,
        reduction: data.reduction,
        description: data.description,
        startDate: data.startDate,
        finishDate: data.finishDate,
        products: newDataProductsId,
        photo: oldData.photo,
        updatedAt: new Date().toISOString(),
      })
        .then(() => {
          if (newDataProductsId !== oldDataProductsId) {
            const deletedProducts = oldDataProductsId.filter(
              (id) => !newDataProductsId.includes(id),
            )

            data.products.map(async (p) => {
              const product = await getProduct(p.id)

              if (deletedProducts.includes(p.id)) {
                await set(ref(database, 'products/' + p.id), {
                  ...product,
                  promotion: null,
                })
              } else {
                await set(ref(database, 'products/' + p.id), {
                  ...product,
                  promotion: {
                    id: oldData.id,
                    title: data.title,
                    reduction: data.reduction,
                    startDate: data.startDate,
                    finishDate: data.finishDate,
                  },
                })
              }
            })
          }

          if (data.fixed) {
            set(ref(database, 'informations/'), {
              promotionFixed: oldData.id,
            })
          }

          if (informationsData.promotionFixed === oldData.id && !data.fixed) {
            set(ref(database, 'informations/'), {
              promotionFixed: null,
            })
          }

          toast.success(`Campanha editada com sucesso`, {
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
          toast.error(`Erro ao criar a campanha`, {
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
      toast.error(`Erro a editar a campanha`, {
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

  async function deletePromotion(id: string, products: string[]) {
    const databaseReference = ref(database, `promotions/${id}`)
    const storageReference = storageRef(storage, `promotions/${id}`)

    try {
      await remove(databaseReference)
      await deleteObject(storageReference)

      products.map(async (id) => {
        const product = await getProduct(id)

        await set(ref(database, 'products/' + id), {
          ...product,
          promotion: null,
        })
      })

      toast.success(`Campanha eliminada com sucesso`, {
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
      toast.error(`Erro a apagar a campanha`, {
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
    const reference = ref(database, 'promotions/')
    const promotionQuery = query(reference, orderByChild(orderByValue))

    onValue(promotionQuery, (snapshot) => {
      const results: Record<string, PromotionItemEdit> = {}
      snapshot.forEach(function (child) {
        results[child.key] = child.val()
      })

      setPromotionData(reverseData(results))
      setLoading(false)
    })
  }, [orderByValue])

  return (
    <section className="bg-white min-h-screen pb-12">
      <Header.Admin />

      <article className="mb-2 mt-12">
        <h1 className="text-black font-semibold text-3xl p-9">
          Minhas campanhas
        </h1>

        <div className="mb-10 px-8 gap-y-5 gap-x-4 flex flex-wrap items-center">
          {/* <div className="max-sm:w-full rounded-lg bg-white p-3 px-4 border flex items-center gap-2">
            <Search size={15} color="#6B7280" />
            <input
              type="text"
              placeholder="Pesquisar pelo título"
              {...register('search')}
              className="max-sm:w-full text-gray-500 bg-white outline-none"
            />
          </div> */}

          <button
            onClick={() => {
              setNewModal(true)
            }}
            className="max-sm:w-full border rounded-md border-gray-300 p-3 px-4 bg-main text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 select-none"
          >
            Criar campanha
          </button>

          <select
            {...register('orderBy')}
            className="max-sm:w-full rounded-lg bg-neutral-100 p-3 px-4 text-gray-500 bg-transparent outline-none border"
          >
            <option value="updatedAt">Ordernar pela data de atualização</option>
            <option value="createdAt">Ordernar pela data de criação</option>
            <option value="name">Ordernar pelo título</option>
          </select>
        </div>
      </article>

      <article className="container mx-auto mt-8 max-sm:p-9">
        <DataState
          dataCount={Object.entries(promotionData).length}
          loading={loading}
          noDataMessage="As suas promoções aparecerão aqui"
        >
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-[#dddddd]">
              <thead>
                <tr className="bg-[#F9FAFB] text-gray-600 uppercase text-sm">
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Título
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Início
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Fim
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Data de criação
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Data de atualização
                  </th>
                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    <span className="max-sm:hidden">Nº de productos</span>
                    <span className="hidden max-sm:inline">Productos</span>
                  </th>

                  <th className="p-3 normal-case font-semibold text-base text-[#111827]">
                    Fixada
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
                {Object.entries(promotionData).map(([id, promotion]) => (
                  <TableRow
                    key={id}
                    data={{
                      ...promotion,
                      id,
                    }}
                    deletePromotion={() => {
                      deletePromotion(id, promotion.products)
                    }}
                    editPromotion={editPromotion}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </DataState>
      </article>
      <Modal.Promotion
        title="Nova campanha"
        actionTitle="Postar"
        isOpen={newModal}
        setOpen={setNewModal}
        action={postPromotion}
      />
    </section>
  )
}
