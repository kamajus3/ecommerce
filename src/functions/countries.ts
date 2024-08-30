'use server'

import { getTranslations } from 'next-intl/server'

import { COUNTRIES } from '@/constants/countries'

export interface ICountry {
  name: string
  code: string
  ddd: string
}

export async function getAllCountries() {
  const countries: ICountry[] = []
  const t = await getTranslations('countries')

  for (const country of COUNTRIES) {
    countries.push({ ...country, name: t(country.code) })
  }

  return countries
}
