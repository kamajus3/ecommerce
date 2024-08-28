import { COUNTRIES } from '@/constants/countries'

export function formatPhotoUrl(photoUrl: string, updateAt: string) {
  photoUrl = photoUrl + '?timestamp=' + updateAt
  return photoUrl
}

export function formatPhoneNumber(
  phone?: string,
  includeDDD: boolean = true,
): string {
  if (!phone) {
    return ''
  }

  // Remove all spaces from the phone number
  phone = phone.replaceAll(' ', '')

  // Try to find the country by the DDD (country code)
  const country = COUNTRIES.find((c) => phone.startsWith(`+${c.ddd}`))

  let formattedNumber
  let localNumber

  if (country) {
    const dddLength = country.ddd.length
    const numberLength = country.numberLength

    // Extract the local number without the DDD
    localNumber = phone.slice(dddLength + 1)

    // Format the number based on whether the DDD should be included
    if (includeDDD) {
      formattedNumber =
        `+${country.ddd} ` +
        `${localNumber.slice(0, numberLength / 3)} ` +
        `${localNumber.slice(numberLength / 3, (2 * numberLength) / 3)} ` +
        `${localNumber.slice((2 * numberLength) / 3)}`
    } else {
      formattedNumber =
        `${localNumber.slice(0, numberLength / 3)} ` +
        `${localNumber.slice(numberLength / 3, (2 * numberLength) / 3)} ` +
        `${localNumber.slice((2 * numberLength) / 3)}`
    }
  } else {
    // If the DDD is not found, assume the number does not have a DDD
    localNumber = phone

    // Estimate the length of the number (without DDD)
    const numberLength = localNumber.length

    // Format the number without any country code
    formattedNumber =
      `${localNumber.slice(0, numberLength / 3)} ` +
      `${localNumber.slice(numberLength / 3, (2 * numberLength) / 3)} ` +
      `${localNumber.slice((2 * numberLength) / 3)}`
  }

  return formattedNumber
}

export function formatMoney(
  amount: number,
  decimalCount = 2,
  decimal = ',',
  thousands = '.',
) {
  try {
    decimalCount = Math.abs(decimalCount)
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount

    const negativeSign = amount < 0 ? '-' : ''

    let [integerPart, decimalPart] = Math.abs(Number(amount) || 0)
      .toFixed(decimalCount)
      .split('.')

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousands)

    return (
      negativeSign +
      integerPart +
      (decimalCount ? decimal + decimalPart.slice(0, decimalCount) : '') +
      ' €'
    )
  } catch (e) {
    console.log(e)
  }
}
