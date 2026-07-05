import { mockUsersService } from '@/mocks/services/users.mock'
import { pickService } from '@/services/service-factory'
import { realUsersService } from './users.service'

export const usersService = pickService(realUsersService, mockUsersService)

export * from './users.types'
export type { UsersService } from './users.contract'
export { userKeys } from './users.keys'
export * from './users.hooks'
