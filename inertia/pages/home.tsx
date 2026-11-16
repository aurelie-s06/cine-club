import MovieRail from '~/components/movie_rail'
import { type Data } from '@generated/data'
import { type InertiaProps } from '~/types'
import { Link } from '@adonisjs/inertia/react'

type MovieSummary = Data.Movie.Variants['toSummary']

type PageProps = InertiaProps<{
  featured: Data.Movie | null
  popular: MovieSummary[]
  newest: MovieSummary[]
  topRated: MovieSummary[]
}>

export default function Home({ featured, popular, newest, topRated }: PageProps) {
  return (
    <>
      {featured && (
        <section className="featured">
          {featured.backdropUrl && (
            <img className="featured-backdrop" src={featured.backdropUrl} alt="" />
          )}

          <div className="featured-content">
            <span className="eyebrow">À l&apos;affiche</span>
            <h1>{featured.title}</h1>
            <p className="featured-meta">
              {featured.releaseYear ?? '—'} · {featured.voteAverage.toFixed(1)}/10
            </p>
            {featured.overview && <p className="featured-overview">{featured.overview}</p>}
            <Link className="button" route="movies.show" routeParams={{ id: featured.id }}>
              Découvrir le film
            </Link>
          </div>
        </section>
      )}

      <MovieRail title="Populaires en ce moment" movies={popular} />
      <MovieRail title="Dernières sorties" movies={newest} />
      <MovieRail title="Les mieux notés" movies={topRated} />
    </>
  )
}