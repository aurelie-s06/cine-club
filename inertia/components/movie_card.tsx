import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

export default function MovieCard({ movie }: { movie: Data.Movie.Variants['toSummary'] }) {
  return (
    <Link route="movies.show" routeParams={{ id: movie.id }} className="movie-card">
      <div className="movie-card-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt="" loading="lazy" />
        ) : (
          <div className="poster-placeholder">{movie.title}</div>
        )}
        {movie.voteAverage > 0 && (
          <span
            className="rating-badge"
            aria-label={`Note : ${movie.voteAverage.toFixed(1)} sur 10`}
          >
            ★ {movie.voteAverage.toFixed(1)}
          </span>
        )}
      </div>
      <h3>{movie.title}</h3>
      <p>{movie.releaseYear ?? 'Date inconnue'}</p>
    </Link>
  )
}
