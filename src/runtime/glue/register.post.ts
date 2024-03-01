import {
  useValidator,
  notBlankRule,
  emailRule,
  isTypeOfRule,
  Types,
} from '@antify/validate';

export type Response = {
  default?: {
    token: string;
  };
  badRequest?: {
    errors: string[];
  };
  invalidCredentials?: {
    errors: string[];
  };
};

export type Input = {
  email: string;
  password: string;
  code: string;
};

export const validator = useValidator({
  email: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
    emailRule,
  ],
  password: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
  repeatPassword: [
    (val: unknown) => isTypeOfRule(val, Types.STRING),
    notBlankRule,
  ],
  code: [(val: unknown) => isTypeOfRule(val, Types.STRING), notBlankRule],
});
