import { Form, Link } from '@adonisjs/inertia/react'

export default function Login() {
  return (
    <div className="auth">
      <div className="form-container">
        <div>
          <span className="eyebrow">Bon retour</span>
          <h1>Connexion</h1>
          <p>Connectez-vous pour suivre les sorties de vos films.</p>
        </div>

        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="username"
                  data-invalid={errors.email ? 'true' : undefined}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <button type="submit" className="button-block">
                Se connecter
              </button>
            </>
          )}
        </Form>

        <p className="form-footer">
          Pas encore de compte ? <Link route="new_account.create">Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}
