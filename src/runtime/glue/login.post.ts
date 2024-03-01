import {
	emailRule,
	notBlankRule,
	Types,
	isTypeOfRule,
	useValidator,
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
	banned?: {
		errors: string[];
	};
};
export type Input = {
	email: string;
	password: string;
	inviteToken?: string;
};
export const validator = useValidator({
	email: {
		readableName: 'E-Mail',
		rules: [
			{
				rule: (val: unknown) => isTypeOfRule(val, Types.STRING),
				groups: 'server',
			},
			{
				rule: notBlankRule,
				groups: ['server', 'client'],
			},
			{
				rule: emailRule,
				groups: ['server', 'client'],
			}
		]
	},
	password: {
		readableName: 'Passwort',
		rules: [
			{
				rule: (val: unknown) => isTypeOfRule(val, Types.STRING),
				groups: 'server',
			},
			{
				rule: notBlankRule,
				groups: ['server', 'client'],
			}
		]
	},
});
