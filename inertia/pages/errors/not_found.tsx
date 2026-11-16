import { Link } from '@adonisjs/inertia/react'

export default function NotFound() {
  return (
    <div className="error-page">
      <span className="code">404</span>
      <h1>Cette bobine est introuvable</h1>
      <p>La page que vous cherchez n’existe pas ou a été déplacée.</p>
      <Link route="home" className="button">
        Retour à l’accueil
      </Link>
    </div>
  )
}
