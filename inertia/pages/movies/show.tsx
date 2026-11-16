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

export default function MovieShow({ movie, releaseAlert, user }: PageProps) {
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

          {releaseAlert.canFollow && (
            <div className="release-alert">
              {!user ? (
                <p>
                  <Link route="session.create">Connectez-vous</Link> pour être prévenu par email le
                  jour de la sortie.
                </p>
              ) : releaseAlert.isFollowing ? (
                <Form route="movies.follow.destroy" routeParams={{ movie_id: movie.id }}>
                  <p>Vous recevrez un email le jour de la sortie.</p>
                  <button type="submit" className="secondary">
                    Ne plus suivre
                  </button>
                </Form>
              ) : (
                <Form route="movies.follow.store" routeParams={{ movie_id: movie.id }}>
                  <button type="submit">M’alerter à la sortie</button>
                </Form>
              )}
            </div>
          )}

          <p className="overview">{movie.overview || 'Aucun synopsis disponible.'}</p>
        </div>
      </div>
    </article>
  )
}
