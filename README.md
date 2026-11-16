# 🎬 Ciné-club

> **Projet pédagogique** — TP réalisé dans le cadre de ma **3ᵉ année de BUT MMI** (Métiers du Multimédia et de l'Internet), ressource **R5.06 – Développement Back avancé**.
>
> Ce projet n'est pas une création originale : j'ai suivi pas à pas les TP proposés par l'enseignant, disponibles ici : [github.com/batosai/mmi3](https://github.com/batosai/mmi3). Il me sert de support d'apprentissage et de trace de mon travail.

## Présentation

Ciné-club est une application web de catalogue de films. Les films sont importés depuis l'API [TMDB](https://www.themoviedb.org/). On peut les parcourir, les rechercher et créer un compte pour se connecter.

### Fonctionnalités

- Import des films depuis l'API TMDB : populaires, à l'affiche et prochaines sorties
- **Mise à jour automatique** du catalogue toutes les 6 heures (nouveaux films, notes, dates de sortie)
- Page d'accueil avec des sélections (à la une, populaires, dernières sorties, prochainement, mieux notés)
- Liste des films avec **recherche** et **pagination**
- Fiche détaillée d'un film
- Inscription, connexion et déconnexion des utilisateurs
- **Alerte de sortie** : suivre un film pas encore sorti et recevoir un email le jour de sa sortie

## Stack technique

| Côté | Technologies |
| --- | --- |
| Back-end | [AdonisJS 7](https://adonisjs.com/), Lucid ORM, VineJS (validation), Auth (sessions) |
| Front-end | [Inertia.js](https://inertiajs.com/) + React 19, Vite |
| Base de données | SQLite (`better-sqlite3`) |
| API externe | TMDB, appelée avec le client HTTP `ky` |
| Emails & tâches | `@adonisjs/mail` (SMTP), `@adonisjs/queue` (file d'attente + tâches planifiées) |

## Ce que j'ai appris

- Structurer une application MVC avec AdonisJS (routes, contrôleurs, modèles, transformers)
- Créer des migrations et des seeders idempotents (`updateOrCreateMany`)
- Consommer une API REST externe et protéger les clés avec `Env.schema.secret()`
- Relier un back-end AdonisJS à un front React grâce à Inertia
- Paginer et filtrer des résultats côté serveur
- Mettre en place une authentification par session
- Envoyer des emails en arrière-plan avec une file d'attente et une tâche planifiée (cron)

Mes notes et réponses aux questions du TP sont dans [r_sum_du_tp_et_questions.md](r_sum_du_tp_et_questions.md).

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) **24 ou plus**
- Une clé d'API TMDB (gratuite) : [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/aurelie-s06/cine-club.git
cd cine-club

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env

# 4. Générer la clé de l'application
node ace generate:key
```

Ouvrez ensuite le fichier `.env` et renseignez vos identifiants TMDB :

```env
TMDB_API_KEY=votre_cle_api
TMDB_READ_ACCESS_TOKEN=votre_jeton_de_lecture
```

```bash
# 5. Créer la base de données
node ace migration:run

# 6. Importer les films depuis TMDB
node ace db:seed

# 7. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur [http://localhost:3333](http://localhost:3333).

### Emails et alertes de sortie

Les emails partent d'un **second processus**, le worker, jamais de la requête HTTP. Pour les recevoir en développement, lancez un serveur SMTP de test comme [Mailpit](https://mailpit.axllent.org/) (interface sur [http://localhost:8025](http://localhost:8025)) :

```bash
# Terminal 1 : capture les emails sur localhost:1025
mailpit

# Terminal 2 : le serveur web
npm run dev

# Terminal 3 : le worker qui exécute les tâches (dont l'envoi des emails)
node ace queue:work
```

## Mise à jour automatique du catalogue

Toutes les 6 heures (0 h, 6 h, 12 h et 18 h, heure de Paris), la tâche planifiée `SyncMovies` ([start/scheduler.ts](start/scheduler.ts)) interroge TMDB et lit trois listes : **films populaires**, **films à l'affiche** et **prochaines sorties** en France. Les nouveaux films sont ajoutés, et ceux qui existent déjà sont mis à jour (note, popularité, date de sortie). Grâce à `updateOrCreateMany` sur `tmdb_id`, une synchro relancée ne crée jamais de doublon.

Le passage de 6 h a lieu avant les alertes de 8 h, qui travaillent donc avec des dates de sortie à jour. Comme pour les emails, c'est le **worker** (`node ace queue:work`) qui exécute la tâche.

Pour lancer la mise à jour à la main :

```bash
node ace movies:sync          # dépose la tâche dans la file (le worker la traite)
node ace movies:sync --sync   # synchronise immédiatement
```

Le seeder (`node ace db:seed`) utilise la même synchro pour remplir le catalogue la première fois.

## Alerte de sortie : comment ça marche

1. Sur la fiche d'un film **pas encore sorti**, un utilisateur connecté clique sur « M'alerter à la sortie ». La requête enregistre une ligne dans `movie_follows` et répond tout de suite, **sans envoyer d'email**.
2. Tous les matins à 8 h (heure de Paris), la tâche planifiée `DispatchReleaseAlerts` ([start/scheduler.ts](start/scheduler.ts)) cherche les films qui sortent ce jour-là.
3. Elle dépose un job `SendReleaseAlert` **par destinataire** dans la file. Le worker envoie l'email, puis note la date d'envoi (`notified_at`) : un email ne part jamais deux fois, et un échec est retenté jusqu'à 3 fois sans renvoyer les autres.

Pour déclencher l'envoi à la main sans attendre 8 h :

```bash
node ace movies:release-alerts          # dépose la tâche dans la file (le worker la traite)
node ace movies:release-alerts --sync   # prépare les envois immédiatement
```

## Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production |
| `npm start` | Lance le build de production |
| `npm run typecheck` | Vérification TypeScript (back et front) |
| `npm run lint` | Analyse du code avec ESLint |
| `npm test` | Lance les tests |

## Crédits

- Sujet des TP : [batosai/mmi3](https://github.com/batosai/mmi3)
- Données des films : [The Movie Database (TMDB)](https://www.themoviedb.org/). *Ce produit utilise l'API TMDB mais n'est ni approuvé ni certifié par TMDB.*
