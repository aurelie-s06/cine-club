import MovieCard from '~/components/movie_card'
import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Link } from '@adonisjs/inertia/react'

type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

type PageProps = InertiaProps<{
  movies: {
    data: Data.Movie.Variants['toSummary'][]
    metadata: PaginationMeta
  }
  search: string
}>

export default function MoviesIndex({ movies, search }: PageProps) {
  const currentPage = Number(movies.metadata.currentPage)
  const lastPage = Number(movies.metadata.lastPage)
  const { total } = movies.metadata
  const qs = (page: number) => (search ? { page, search } : { page })

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Films</h1>
          <p>{total} films au catalogue</p>
        </div>

        <form method="get" action="/movies" className="search-form">
          <input
            type="search"
            name="search"
            placeholder="Rechercher un film"
            defaultValue={search}
          />
          <button type="submit">Rechercher</button>
        </form>
      </div>

      {movies.data.length === 0 ? (
        <p className="empty">Aucun film ne correspond à cette recherche.</p>
      ) : (
        <ul className="movie-grid">
          {movies.data.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </ul>
      )}

      {lastPage > 1 && (
        <nav className="pagination">
          {currentPage > 1 && (
            <Link route="movies.index" qs={qs(currentPage - 1)}>
              ‹ Précédent
            </Link>
          )}
          <span>
            Page {currentPage} sur {lastPage}
          </span>
          {currentPage < lastPage && (
            <Link route="movies.index" qs={qs(currentPage + 1)}>
              Suivant ›
            </Link>
          )}
        </nav>
      )}
    </>
  )
}
