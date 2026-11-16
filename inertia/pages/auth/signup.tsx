import { Form, Link } from '@adonisjs/inertia/react'

export default function Signup() {
  return (
    <div className="auth">
      <div className="form-container">
        <div>
          <span className="eyebrow">Rejoindre le club</span>
          <h1>Inscription</h1>
          <p>Créez votre compte pour être alerté des sorties.</p>
        </div>

        <Form route="new_account.store">
          {({ errors }) => (
            <>
              <div className="form-row">
                <div>
                  <label htmlFor="firstName">
                    Prénom <small>(facultatif)</small>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    data-invalid={errors.firstName ? 'true' : undefined}
                  />
                  {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                </div>

                <div>
                  <label htmlFor="lastName">
                    Nom <small>(facultatif)</small>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    data-invalid={errors.lastName ? 'true' : undefined}
                  />
                  {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                </div>
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
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
                  autoComplete="new-password"
                  data-invalid={errors.password ? 'true' : undefined}
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                  data-invalid={errors.passwordConfirmation ? 'true' : undefined}
                />
                {errors.passwordConfirmation && (
                  <div className="field-error">{errors.passwordConfirmation}</div>
                )}
              </div>

              <button type="submit" className="button-block">
                Créer mon compte
              </button>
            </>
          )}
        </Form>

        <p className="form-footer">
          Déjà inscrit ? <Link route="session.create">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
