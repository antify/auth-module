import { readBody } from '#imports'
import { getDatabaseClient, SingleConnectionClient } from '@antify/database'
import { Input, validator, Response } from '../../glue/forgot-password.post'
import { extendSchemas } from '../datasources/schema.extensions'
import { Accounts } from '../datasources/schemas/accounts'
import { MailTemplateId } from '../mailTemplates'
import { useMailer } from '#mailerModule'

export default defineEventHandler<Response>(async (event) => {
  const requestData = await readBody<Input>(event)

  validator.validate(requestData)

  if (validator.hasErrors()) {
    throw new Error(
      `Error while validating input: ${validator.getErrors()[0]}`
    )
  }

  const { mainProviderId } = useRuntimeConfig().authModule
  const client = await (getDatabaseClient(mainProviderId) as SingleConnectionClient).connect()
  extendSchemas(client)

  const UserModel = client.getModel<Accounts>('users')
  const user = await UserModel.findOne({ email: requestData.email })

  if (!user) {
    return {
      notFound: 'There exist no user with this email'
    }
  }

  // TODO:: save forgot password request
  user.forgotPassword = {
    code: '0815',
    sendAt: new Date()
  }

  await user.save()
  await useMailer(event)
    .sendMail(MailTemplateId.FORGOT_PASSWORD, requestData.email)

  return {
    success: true
  }
})
