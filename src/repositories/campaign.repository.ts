import { ICampaign } from '@/@types'

import { BaseRepository } from './base.repository'

export class CampaignRepository extends BaseRepository<ICampaign> {
  constructor() {
    super('/campaigns/')
  }
}
