import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

export default function MovieCard({ movie }: { movie: Data.Movie.Variants['toSummary'] }) {
  return (
    <Link route="movies.show" routeParams={{ id: movie.id }}>
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt={movie.title} loading="lazy" />
      ) : (
        <div className="poster-placeholder">Pas d&apos;affiche</div>
      )}
      <h3>{movie.title}</h3>
      <p>
        {movie.releaseYear ?? '—'} · {movie.voteAverage.toFixed(1)}/10
      </p>
    </Link>
  )
}