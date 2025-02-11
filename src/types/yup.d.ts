import * as Yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    numberString(msg?: string): this;
    halfWidth(msg?: string): this;
    kana(msg?: string): this;
    sameOrBeforeDate(date: Date | string, msg?: string): this;
    date(msg?: string): this;
  }
}
