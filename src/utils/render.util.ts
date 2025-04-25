import Decimal from 'decimal.js';

export const renderTokenBalance = (
  balance: string | number | Decimal,
  options: {
    decimals?: number;
    displayDecimals?: number;
  } = {},
) => {
  const { displayDecimals = 18 } = options;

  if (balance instanceof Decimal) {
    balance = balance.toString();
  }

  const formatted = new Decimal(balance).toDecimalPlaces(displayDecimals, Decimal.ROUND_DOWN);
  return formatted.toString();
};

export const renderCommaNumber = (num: number | string = '0') => {
  num = String(num).replace(/[^0-9.-]/g, '');

  const [integerPartRaw, fractionalPartRaw] = num.split('.');
  const integerPart = integerPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fractionalPart = fractionalPartRaw || '';

  let result = fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
  result = result.replace(/\.?0+$/, '');
  return result;
};
