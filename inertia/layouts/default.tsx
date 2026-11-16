import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, flash } = usePage()
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
      <header>
        <div>
          <div>
            <Link route="home" className="logo">
              Ciné-club
            </Link>
          </div>
          <div>
            <nav>
              <Link route="movies.index">Movies</Link>
              {children.props.user ? (
                <>
                  <span>{children.props.user.initials}</span>
                  <Form route="session.destroy">
                    <button type="submit"> Logout </button>
                  </Form>
                </>
              ) : (
                <>
                  <Link route="new_account.create">Signup</Link>
                  <Link route="session.create">Login</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
