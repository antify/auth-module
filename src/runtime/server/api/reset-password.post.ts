import { readBody, defineEventHandler } from '#imports'
import {
  Input,
  serverValidator as validator,
  Response
} from '../../glue/reset-password.post'

export default defineEventHandler<Response>(async (event) => {
  const requestData = await readBody<Input>(event)

  validator.validate(requestData)

  if (validator.hasErrors()) {
    throw new Error(
      `Error while validating input: ${validator.getErrors()[0]}`
    )
  }

  // TODO:: check token to be valid and still in time
  console.log('Token', requestData.token)

  // TODO:: update password in database
  console.log('New password', requestData.password)

  // TODO:: return success message?
  return {
    default: {}
  }
})
