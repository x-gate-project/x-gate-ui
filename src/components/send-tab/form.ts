import { IsNotEmpty, Matches } from 'class-validator';
import { TFunction } from 'next-i18next';
import { validateObject } from '~/common/validator/class-validator-helper';

export class FormValues {
  @IsNotEmpty({
    context: {
      i18n: {
        key: 'form_validation.isNotEmpty',
      },
    },
  })
  @Matches(/^\d+$/, {
    message: 'Only whole numbers are allowed',
    context: {
      i18n: {
        key: 'form_validation.isInteger',
      },
    },
  })
  from: string;
}

export const initialValues: FormValues = {
  from: '0',
};

export const validateForm = (t: TFunction) => async (values: any) =>
  await validateObject(t, Object.assign(new FormValues(), values));
