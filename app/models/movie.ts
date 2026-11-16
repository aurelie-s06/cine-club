import env from '#start/env'
import { DateTime } from 'luxon'
import { MovieSchema } from '#database/schema'

/**
 * Les dates de sortie TMDB sont des jours calendaires (sans heure) : on les
 * compare au « jour courant » vu de France, pas à l'heure UTC du serveur.
 */
export const RELEASE_TIMEZONE = 'Europe/Paris'

export default class Movie extends MovieSchema {
  /**
   * Le jour courant au format ISO (AAAA-MM-JJ), dans le fuseau des sorties.
   */
  static today(): string {
    return DateTime.now().setZone(RELEASE_TIMEZONE).toISODate()!
  }

  get posterUrl(): string | null {
    return this.posterPath ? `${env.get('TMDB_IMAGE_BASE_URL')}/w500${this.posterPath}` : null
  }

  get backdropUrl(): string | null {
    return this.backdropPath ? `${env.get('TMDB_IMAGE_BASE_URL')}/w1280${this.backdropPath}` : null
  }

  get releaseYear(): number | null {
    return this.releaseDate ? this.releaseDate.year : null
  }

  /**
   * Un film « à venir » a une date de sortie connue et strictement future :
   * c'est la seule condition pour pouvoir le suivre.
   */
  get isUpcoming(): boolean {
    const releaseDate = this.releaseDate?.toISODate()
    return !!releaseDate && releaseDate > Movie.today()
  }
}
