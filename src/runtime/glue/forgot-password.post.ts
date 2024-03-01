import {
  emailRule,
  notBlankRule,
  Types,
  isTypeOfRule,
  useValidator,
} from '@antify/validate';

export type Response = {
  default?: {};
  badRequest?: {
    errors: string[];
  };
};

export type Input = {
  email: string;
};

export const validator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
});
