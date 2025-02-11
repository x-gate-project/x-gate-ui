import { registerDecorator, ValidationOptions } from 'class-validator';
import * as EthereumJsUtils from 'ethereumjs-util';

export function IsEthAddress(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEthAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return EthereumJsUtils.isValidAddress(value);
        },
        defaultMessage: () => `${propertyName} must be an Ethereum address`,
      },
    });
  };
}
