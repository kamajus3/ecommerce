import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import clsx from 'clsx'
import { ChevronDown, Search } from 'lucide-react'
import { FieldError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { COUNTRIES } from '@/constants/countries'
import { getAllCountries, ICountry } from '@/functions/countries'
import { formatPhoneNumber } from '@/functions/format'

import '@root/node_modules/flag-icons/css/flag-icons.min.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string
  defaultValue?: string
}

interface IFieldPhone {
  error?: FieldError
  numberProps: InputProps

  ddd?: string
  changeDDDValue: (value: string) => void

  phone?: string
  changeNumberValue: (value: string) => void
}

function CustomInput(
  {
    error,
    numberProps,

    ddd,
    changeDDDValue,

    phone,
    changeNumberValue,
  }: IFieldPhone,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [openModal, setOpenModal] = useState(false)
  const [countries, setCountries] = useState<ICountry[]>()

  // Find the current country based on the DDD
  const currentCountry = COUNTRIES.find((c) =>
    ddd ? c.ddd === ddd : c.ddd === '93',
  )
  const maxLength = currentCountry ? currentCountry.numberLength : 15

  useEffect(() => {
    getAllCountries().then((data) => {
      setCountries(data)
    })
  }, [])

  function onClose(selectedDDD?: string) {
    setOpenModal(false)
    if (selectedDDD) {
      changeDDDValue(selectedDDD)
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const numericValue = value.replace(/[^0-9]/g, '')

    const truncatedValue = numericValue.slice(0, maxLength)
    changeNumberValue(truncatedValue)
  }

  function SearchCountry() {
    const t = useTranslations('search')

    const [searchTerm, setSearchTerm] = useState('')
    const [filteredCountries, setFilteredCountries] = useState<ICountry[]>([])

    const modalRef = useRef<HTMLDivElement>(null)

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }, [])

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [handleClickOutside])

    useEffect(() => {
      if (countries) {
        setFilteredCountries(
          countries.filter((country) =>
            searchTerm.startsWith('+')
              ? country.ddd.includes(searchTerm.replace('+', ''))
              : country.name.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
      }
    }, [searchTerm])

    return (
      <div
        ref={modalRef}
        className="absolute top-0 left-0 z-[999] shadow-lg rounded-t w-80 bg-neutral-100 border-t border-l border-r sm:col-span-2 sm:col-start-1"
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <Search color="#9ca3af" />
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-500 placeholder:text-gray-400 h-full w-full outline-none border-none bg-transparent disabled:text-disabledText"
          />
        </div>
        <div className="px-3 py-2 w-full max-h-44 overflow-y-scroll border rounded-b flex flex-col gap-4">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                type="button"
                key={country.code}
                className="flex justify-between"
                onClick={() => onClose(country.ddd)}
              >
                <div className="flex gap-2">
                  <span className={`fi fi-${country.code.toLowerCase()}`} />
                  <abbr
                    className={clsx('text-gray-500 no-underline', {
                      'text-gray-600 font-medium': ddd === country.ddd,
                    })}
                    title={country.name}
                  >
                    {country.name.length > 25
                      ? country.name.slice(0, 25) + '...'
                      : country.name}
                  </abbr>
                </div>
                <span
                  className={clsx('text-gray-500', {
                    'text-gray-600 font-medium': ddd === country.ddd,
                  })}
                >
                  +{country.ddd}
                </span>
              </button>
            ))
          ) : (
            <div className="text-gray-500">{t('notFound')}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={twMerge(
        clsx(
          'relative rounded-lg bg-neutral-100 px-3 py-2 mt-2 flex items-center gap-2 border sm:col-span-1 sm:col-start-1',
          {
            'border-red-500': error,
          },
        ),
      )}
    >
      <button
        type="button"
        onClick={() => setOpenModal(true)}
        className="flex gap-1 cursor-pointer"
      >
        <span className={`fi fi-${currentCountry?.code.toLowerCase()}`} />
        <ChevronDown size={15} color="#000" />
      </button>
      <input
        className="text-gray-500 h-full w-full outline-none border-none bg-transparent disabled:text-disabledText"
        type="tel"
        ref={ref}
        value={formatPhoneNumber(phone, false)}
        {...numberProps}
        onChange={handleChange}
      />
      {openModal && <SearchCountry />}
    </div>
  )
}

const FieldPhone = forwardRef(CustomInput)
export default FieldPhone
