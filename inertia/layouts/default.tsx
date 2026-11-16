import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, flash } = usePage()
  const user = children.props.user

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  })

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link route="home" className="logo" aria-label="Ciné-club, accueil">
            <span className="logo-mark" aria-hidden="true">
              C
            </span>
            <span className="logo-text">Ciné-club</span>
          </Link>

          <nav className="site-nav">
            <Link route="movies.index" className={url.startsWith('/movies') ? 'current' : ''}>
              Films
            </Link>
            {user ? (
              <div className="user-menu">
                <span className="avatar" title={user.fullName ?? undefined}>
                  {user.initials}
                </span>
                <Form route="session.destroy">
                  <button type="submit" className="secondary">
                    Déconnexion
                  </button>
                </Form>
              </div>
            ) : (
              <>
                <Link route="session.create">Connexion</Link>
                <Link route="new_account.create" className="button">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        {children}

        <footer className="site-footer">
          <div className="container">
            <span>Ciné-club · TP R5.06, BUT MMI 3</span>
            <span>
              Données fournies par{' '}
              <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
                TMDB
              </a>
            </span>
          </div>
        </footer>
      </main>

      <Toaster position="top-center" theme="dark" richColors />
    </>
  )
}
