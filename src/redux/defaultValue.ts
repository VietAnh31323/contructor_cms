import { BLACK, GREEN, ORANGE, PRIMARY, RED, WHITE } from '@/helper/colors'
import { ButtonConfig, CompanyConfig, CurrentOrg, FontConfig, TableConfig, ThemeColorConfig } from '@/redux/type'

const themeColorDefaultConfig: ThemeColorConfig = {
  layout: 'layout1',
  theme: 'THEME_1',
  firstMainColor: PRIMARY,
  secondMainColor: BLACK,
  thirdMainColor: '#E2E2E2',
  fourthMainColor: '#E2E2E2',
  successColor: GREEN,
  errorColor: RED,
  warningColor: ORANGE,
}

const fontDefaultConfig: FontConfig = {
  typeFont: 'Be Vietnam Pro',

  h1Color: '#242424',
  h1Font: 'Be Vietnam Pro',
  h1Size: 2.4,

  h2Color: '#242424',
  h2Font: 'Be Vietnam Pro',
  h2Size: 2,

  h3Color: '#242424',
  h3Font: 'Be Vietnam Pro',
  h3Size: 1.8,

  h4Color: '#242424',
  h4Font: 'Be Vietnam Pro',
  h4Size: 1.4,

  h5Color: '#242424',
  h5Font: 'Be Vietnam Pro',
  h5Size: 1.2,

  h6Color: '#242424',
  h6Font: 'Be Vietnam Pro',
  h6Size: 1,

  subtitle1Color: '#242424',
  subtitle1Font: 'Be Vietnam Pro',
  subtitle1Size: 0.8,

  subtitle2Color: '#242424',
  subtitle2Font: 'Be Vietnam Pro',
  subtitle2Size: 0.75,

  body1Color: '#242424',
  body1Font: 'Be Vietnam Pro',
  body1Size: 0.8,

  body2Color: '#242424',
  body2Font: 'Be Vietnam Pro',
  body2Size: 0.75,

  captionColor: '#242424',
  captionFont: 'Be Vietnam Pro',
  captionSize: 0.5,
}

const buttonDefaultConfig: ButtonConfig = {
  submitButton: {
    textColor: PRIMARY,
    hoverTextColor: WHITE,
    backgroundColor: WHITE,
    backgroundHoverColor: PRIMARY,
    borderColor: PRIMARY,
    borderHoverColor: PRIMARY,
  },
  draftButton: {
    textColor: '#747475',
    hoverTextColor: '#747475',
    backgroundColor: WHITE,
    backgroundHoverColor: WHITE,
    borderColor: '#DFE0EB',
    borderHoverColor: '#DFE0EB',
  },
  rejectButton: {
    textColor: '#fc0303',
    hoverTextColor: WHITE,
    backgroundColor: WHITE,
    backgroundHoverColor: '#fc0303',
    borderColor: '#fc0303',
    borderHoverColor: '#fc0303',
  },
  resetButton: {
    textColor: '#747475',
    hoverTextColor: '#747475',
    backgroundColor: WHITE,
    backgroundHoverColor: WHITE,
    borderColor: '#DFE0EB',
    borderHoverColor: '#DFE0EB',
  },
}

const companyConfig: CompanyConfig = {
  id: 0,
  username: '',
  timezone: '',
  symbol: '',
  domain: '',
  currency: 'VND',
  position: 'RIGHT',
  language: 'vn',
  decimalSeparator: 'COMMA',
  thousandSeparator: 'DOTS',
  floatRounding: 2,
  dateType: 'DD/MM/YYYY',
  code: '',
  name: '',
  countryId: 0,
  country: '',
  languageId: 0,
  languageCode: '',
  activated: true,
  parentId: null,
  parent: null,
  description: '',
  currencyId: 0,
  logo: '',
  phone: '',
  email: '',
  taxCode: '',
  address: '',
  firstName: '',
  lastName: '',
  typeOfOrganization: '',
}

const tableConfig: TableConfig = []

const orgDefault: CurrentOrg = {
  id: 0,
  name: '',
}

const defaultValue = {
  themeColorDefaultConfig,
  fontDefaultConfig,
  buttonDefaultConfig,
  companyConfig,
  tableConfig,
  orgDefault,
}

export default defaultValue
