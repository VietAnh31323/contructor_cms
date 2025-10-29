// import { useAppSelector } from '@/redux/hook'
//
// export const useNumber = () => {
//   const { thousandSeparator, floatRounding } = useAppSelector(
//     (state) => state.companyConfigData,
//   )
//
//   const type = thousandSeparator === 'COMMA' ? 'en-US' : 'de-DE'
//
//   const formatNumberIntl = new Intl.NumberFormat(type, {
//     maximumFractionDigits: floatRounding ?? 2,
//   })
//
//
//   const formatStringToNumber = (value: string): number => {
//     if (thousandSeparator === 'COMMA') {
//       return parseFloat(value.replace(/,/g, ''))
//     }
//     return parseFloat(value.replace(/\./g, '').replace(',', '.'))
//   }
//
//
//   return {
//     formatNumberIntl,
//     formatStringToNumber,
//   }
//
//
// }
