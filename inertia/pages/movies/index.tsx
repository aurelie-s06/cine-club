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
    <div className="listing container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1>Films</h1>
          <p>
            {search
              ? `${total} résultat${total > 1 ? 's' : ''} pour « ${search} »`
              : `${total} films au catalogue`}
          </p>
        </div>

        <form method="get" action="/movies" className="search-form" role="search">
          <div className="search-field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path
                d="m20 20-3.5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              name="search"
              placeholder="Rechercher un film"
              aria-label="Rechercher un film"
              defaultValue={search}
            />
          </div>
          <button type="submit">Rechercher</button>
        </form>
      </div>

      {movies.data.length === 0 ? (
        <div className="empty">
          <strong>Aucun film trouvé</strong>
          Essayez un autre titre, ou{' '}
          <Link route="movies.index" className="text-link">
            parcourez tout le catalogue
          </Link>
          .
        </div>
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
        <nav className="pagination" aria-label="Pagination">
          {currentPage > 1 && (
            <Link route="movies.index" qs={qs(currentPage - 1)} className="button secondary">
              ← Précédent
            </Link>
          )}
          <span>
            Page {currentPage} sur {lastPage}
          </span>
          {currentPage < lastPage && (
            <Link route="movies.index" qs={qs(currentPage + 1)} className="button secondary">
              Suivant →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
