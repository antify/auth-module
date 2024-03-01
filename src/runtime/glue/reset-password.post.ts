import {
  notBlankRule,
  Types,
  isTypeOfRule,
  useValidator,
  emailRule,
} from '@antify/validate';

export type Response = {
  default?: {};
  badRequest?: {
    errors: string[];
  };
};

export type Input = {
  token: string;
  password: string;
};

export const validator = useValidator({
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  repeatPassword: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
  ],
});

export const serverValidator = useValidator({
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  code: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
