import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Link } from '@adonisjs/inertia/react'

type PageProps = InertiaProps<{ movie: Data.Movie }>

export default function MovieShow({ movie }: PageProps) {
  return (
    <article className="movie-detail">
      {movie.backdropUrl && (
        <div className="backdrop">
          <img src={movie.backdropUrl} alt="" />
        </div>
      )}

      <div className="movie-detail-body">
        {movie.posterUrl && <img className="poster" src={movie.posterUrl} alt={movie.title} />}

        <div>
          <Link route="movies.index" className="back-link">
            ‹ Retour aux films
          </Link>

          <h1>{movie.title}</h1>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="original-title">Titre original : {movie.originalTitle}</p>
          )}

          <ul className="meta">
            <li>{movie.releaseDate ?? 'Date inconnue'}</li>
            <li>
              {movie.voteAverage.toFixed(1)}/10 ({movie.voteCount} votes)
            </li>
            {movie.originalLanguage && <li>{movie.originalLanguage.toUpperCase()}</li>}
          </ul>

          <p className="overview">{movie.overview || 'Aucun synopsis disponible.'}</p>
        </div>
      </div>
    </article>
  )
}