/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.get('/', [controllers.Home, 'index']).as('home')

router.resource('movies', controllers.Movies).only(['index', 'show'])
router.resource('movies.reviews', controllers.Reviews).only(['index', 'store'])

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    // Alerte de sortie : suivre / ne plus suivre un film à venir
    router
      .post('movies/:movie_id/follow', [controllers.MovieFollows, 'store'])
      .as('movies.follow.store')
    router
      .delete('movies/:movie_id/follow', [controllers.MovieFollows, 'destroy'])
      .as('movies.follow.destroy')
  })
  .use(middleware.auth())
