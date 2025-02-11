import { validate, ValidatorOptions } from 'class-validator';
import { FormikErrors } from 'formik';
import { TFunction } from 'next-i18next';

export async function validateObject<T>(
  t: TFunction,
  object: Record<string, any>,
  validatorOptions?: ValidatorOptions,
): Promise<FormikErrors<T>> {
  const errors = await validate(object, validatorOptions);
  const resultErrors: FormikErrors<T> = {};
  // errors is an array of validation errors
  if (errors.length > 0) {
    errors.forEach((error) => {
      const keys = Object.keys(error.constraints!);
      const errorString = keys[0];
      const i18nOptions =
        error.contexts && error.contexts[errorString] && error.contexts[errorString].i18n;
      resultErrors[error.property] = i18nOptions
        ? t(i18nOptions.key, i18nOptions.args)
        : error.constraints![errorString];
    });
  }
  return resultErrors;
}
