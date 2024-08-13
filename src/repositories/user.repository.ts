import { IUser } from '@/@types'

import { BaseRepository } from './base.repository'

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super('/users/')
  }
}
