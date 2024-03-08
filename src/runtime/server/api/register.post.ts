import { getDatabaseClientFromRequest } from '@antify/kit'
import { readBody } from '#imports'
import { handleCreateToken, hashRawPassword } from '../utils/tokenUtil'
import { Response, Input, validator } from '../../glue/register.post'
import { extendSchemas } from '../datasources/schema.extensions'
import { Accounts } from '../../../../src/runtime/server/datasources/schemas/accounts'

// TODO:: rename to magic link. It is not a register logic
export default defineEventHandler<Response>(async (event) => {
  // const requestData = await readBody<Input>(event)
  //
  // validator.validateProperty('email', requestData?.email)
  // validator.validateProperty('password', requestData?.password)
  // validator.validateProperty('code', requestData?.code)
  //
  // if (validator.hasErrors()) {
  //   throw new Error(
  //     `Error while validating input: ${validator.getErrors()[0]}`
  //   )
  // }
  //
  // const client = await getDatabaseClientFromRequest(
  //   event,
  //   useRuntimeConfig().authModule.providers,
  //   extendSchemas
  // )
  //
  // const UserModel = client.getModel<Accounts>('users')
  // const alreadyExistingUser = await UserModel.findOne({
  //   email: requestData.email
  // })
  //
  // // TODO:: check
  // if (alreadyExistingUser) {
  //   return {
  //     alreadyExists: 'There already exists an account with this email. Try forgot password function to reset your password.'
  //   }
  // }

  // const user = await new UserModel({
  //   email: requestData.email,
  //   password: await hashRawPassword(requestData.password, event)
  // }).save()

  // await client.getModel('user_tenant_accesses').insertMany([
  //   {
  //     user: user.id,
  //     tenant: '63fdc9dde547cb35aff5b79b',
  //     pending: true,
  //   },
  // ]);
  return {}
  // return {
  //   default: {
  //     token: await handleCreateToken(
  //       event,
  //       requestData.email,
  //       requestData.password
  //     )
  //   }
  // }
})
