import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Form, Link } from '@adonisjs/inertia/react'

type PageProps = InertiaProps<{
  movie: Data.Movie
  releaseAlert: {
    canFollow: boolean
    isFollowing: boolean
  }
}>

function formatDate(isoDate: string | null) {
  if (!isoDate) return 'Date inconnue'
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function MovieShow({ movie, releaseAlert, user }: PageProps) {
  return (
    <article className="movie-detail">
      {movie.backdropUrl && (
        <div className="backdrop">
          <img src={movie.backdropUrl} alt="" />
        </div>
      )}

      <div className="movie-detail-body container">
        {movie.posterUrl && <img className="poster" src={movie.posterUrl} alt={movie.title} />}

        <div className="movie-detail-info">
          <Link route="movies.index" className="back-link">
            ← Retour aux films
          </Link>

          <h1>{movie.title}</h1>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="original-title">{movie.originalTitle}</p>
          )}

          <ul className="meta">
            {movie.voteAverage > 0 && (
              <li className="rating">
                ★ {movie.voteAverage.toFixed(1)}
                <span className="votes">({movie.voteCount} votes)</span>
              </li>
            )}
            <li>{formatDate(movie.releaseDate)}</li>
            {movie.originalLanguage && (
              <li className="chip">{movie.originalLanguage.toUpperCase()}</li>
            )}
          </ul>

          {releaseAlert.canFollow && (
            <div className="release-alert">
              {!user ? (
                <p>
                  <strong>Pas encore sorti</strong>
                  <Link route="session.create">Connectez-vous</Link> pour être prévenu par email le
                  jour de la sortie.
                </p>
              ) : releaseAlert.isFollowing ? (
                <Form route="movies.follow.destroy" routeParams={{ movie_id: movie.id }}>
                  <p>
                    <strong>Alerte activée</strong>
                    Vous recevrez un email le jour de la sortie.
                  </p>
                  <button type="submit" className="secondary">
                    Ne plus suivre
                  </button>
                </Form>
              ) : (
                <Form route="movies.follow.store" routeParams={{ movie_id: movie.id }}>
                  <p>
                    <strong>Pas encore sorti</strong>
                    Recevez un email le jour de sa sortie.
                  </p>
                  <button type="submit">M’alerter à la sortie</button>
                </Form>
              )}
            </div>
          )}

          <h2 className="section-title">Synopsis</h2>
          <p className="overview">{movie.overview || 'Aucun synopsis disponible.'}</p>
        </div>
      </div>
    </article>
  )
}
