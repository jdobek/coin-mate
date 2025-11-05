/**
 * Supported currencies in the app
 */
export interface Currency {
  code: string;
  name: string;
  flagAsset: string;
}

export const CURRENCIES: Currency[] = [
  {
    code: 'PLN',
    name: 'Polish Złoty',
    flagAsset: require('@/assets/images/flag-PLN.svg'),
  },
  {
    code: 'USD',
    name: 'United States Dollar',
    flagAsset: require('@/assets/images/flag-USD.svg'),
  },
  {
    code: 'EUR',
    name: 'Euro',
    flagAsset: require('@/assets/images/flag-EUR.svg'),
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    flagAsset: require('@/assets/images/flag-JPY.svg'),
  },
  {
    code: 'GBP',
    name: 'British Pound',
    flagAsset: require('@/assets/images/flag-GBP.svg'),
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    flagAsset: require('@/assets/images/flag-CHF.svg'),
  },
];

export const DEFAULT_CURRENCY = 'PLN';

