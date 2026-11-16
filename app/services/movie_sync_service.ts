import { DateTime } from 'luxon'
import Movie from '#models/movie'
import tmdb, { type TmdbMovie } from '#services/tmdb_service'

/**
 * Nombre de pages lues par liste TMDB (20 films par page).
 */
const PAGES = {
  popular: 5,
  nowPlaying: 3,
  upcoming: 3,
}

export type SyncResult = {
  created: number
  updated: number
}

/**
 * Importe et met à jour le catalogue depuis TMDB : films populaires, films
 * actuellement à l'affiche et prochaines sorties. Utilisé par le seeder, la
 * tâche planifiée et la commande `movies:sync`.
 */
export class MovieSyncService {
  async sync(): Promise<SyncResult> {
    const movies = await this.#fetchAll()
    if (movies.size === 0) {
      return { created: 0, updated: 0 }
    }

    const tmdbIds = [...movies.keys()]
    const existing = await Movie.query().whereIn('tmdbId', tmdbIds).select('tmdbId')
    const existingIds = new Set(existing.map((movie) => movie.tmdbId))

    /**
     * Idempotent : un film déjà en base est mis à jour (note, popularité,
     * date de sortie qui a pu bouger…), les autres sont créés.
     */
    await Movie.updateOrCreateMany('tmdbId', [...movies.values()].map(toAttributes))

    return {
      created: tmdbIds.filter((id) => !existingIds.has(id)).length,
      updated: existingIds.size,
    }
  }

  /**
   * Un même film peut apparaître dans plusieurs listes, ou sur deux pages
   * d'une même liste si le classement bouge entre deux appels : on les
   * dédoublonne par identifiant TMDB, qui est la clé unique en base.
   */
  async #fetchAll(): Promise<Map<number, TmdbMovie>> {
    const movies = new Map<number, TmdbMovie>()
    const sources = [
      { fetch: (page: number) => tmdb.popular(page), pages: PAGES.popular },
      { fetch: (page: number) => tmdb.nowPlaying(page), pages: PAGES.nowPlaying },
      { fetch: (page: number) => tmdb.upcoming(page), pages: PAGES.upcoming },
    ]

    for (const source of sources) {
      for (let page = 1; page <= source.pages; page++) {
        for (const movie of await source.fetch(page)) {
          movies.set(movie.id, movie)
        }
      }
    }

    return movies
  }
}

function toAttributes(movie: TmdbMovie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview || null,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date ? DateTime.fromISO(movie.release_date) : null,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    originalLanguage: movie.original_language,
  }
}
