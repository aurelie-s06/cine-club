export default function ServerError() {
  return (
    <div className="error-page">
      <span className="code">500</span>
      <h1>Panne de projecteur</h1>
      <p>Une erreur est survenue de notre côté. Réessayez dans quelques instants.</p>
      <a href="/" className="button">
        Retour à l’accueil
      </a>
    </div>
  )
}
