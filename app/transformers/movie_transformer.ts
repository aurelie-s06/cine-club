import type Movie from '#models/movie'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class MovieTransformer extends BaseTransformer<Movie> {
  /**
   * Lightweight payload used by the listing page
   */
  toSummary() {
    return {
      id: this.resource.id,
      title: this.resource.title,
      posterUrl: this.resource.posterUrl,
      releaseYear: this.resource.releaseYear,
      voteAverage: this.resource.voteAverage,
    }
  }

  toObject() {
    return {
      ...this.toSummary(),
      tmdbId: this.resource.tmdbId,
      originalTitle: this.resource.originalTitle,
      overview: this.resource.overview,
      backdropUrl: this.resource.backdropUrl,
      releaseDate: this.resource.releaseDate?.toISODate() ?? null,
      voteCount: this.resource.voteCount,
      originalLanguage: this.resource.originalLanguage,
    }
  }
}