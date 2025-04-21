export const ellipsifyText = (text: string, first: number, last: number) =>
  `${text.slice(0, first)}...${text.slice(-last)}`;
