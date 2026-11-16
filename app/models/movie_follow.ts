import { MovieFollowSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Movie from '#models/movie'
import User from '#models/user'

export default class MovieFollow extends MovieFollowSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Movie)
  declare movie: BelongsTo<typeof Movie>
}
