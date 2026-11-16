import MovieCard from '~/components/movie_card'
import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

type MovieRailProps = {
  title: string
  movies: Data.Movie.Variants['toSummary'][]
}

export default function MovieRail({ title, movies }: MovieRailProps) {
  if (movies.length === 0) {
    return null
  }

  return (
    <section className="rail">
      <div className="rail-header">
        <h2>{title}</h2>
        <Link route="movies.index">Tout voir ›</Link>
      </div>

      <ul className="movie-grid">
        {movies.map((movie) => (
          <li key={movie.id}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </section>
  )
}