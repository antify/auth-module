import { MailTemplateConfiguration } from '#mailerModule';

export enum MailTemplateId {
  FORGOT_PASSWORD = 'FORGOT_PASSWORD'
}

export const mailTemplates: MailTemplateConfiguration[] = [
  {
    mailTemplateId: MailTemplateId.FORGOT_PASSWORD,
    title: 'Set a new password',
    content: 'With this link you can set a new password'
  }
];
