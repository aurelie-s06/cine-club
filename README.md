# 🎬 Ciné-club

> **Projet pédagogique** — TP réalisé dans le cadre de ma **3ᵉ année de BUT MMI** (Métiers du Multimédia et de l'Internet), ressource **R5.06 – Développement Back avancé**.
>
> Ce projet n'est pas une création originale : j'ai suivi pas à pas les TP proposés par l'enseignant, disponibles ici : [github.com/batosai/mmi3](https://github.com/batosai/mmi3). Il me sert de support d'apprentissage et de trace de mon travail.

## Présentation

Ciné-club est une application web de catalogue de films. Les films sont importés depuis l'API [TMDB](https://www.themoviedb.org/). On peut les parcourir, les rechercher et créer un compte pour se connecter.

### Fonctionnalités

- Import des films populaires depuis l'API TMDB (seeder)
- Page d'accueil avec des sélections (à la une, populaires, récents, mieux notés)
- Liste des films avec **recherche** et **pagination**
- Fiche détaillée d'un film
- Inscription, connexion et déconnexion des utilisateurs

## Stack technique

| Côté | Technologies |
| --- | --- |
| Back-end | [AdonisJS 7](https://adonisjs.com/), Lucid ORM, VineJS (validation), Auth (sessions) |
| Front-end | [Inertia.js](https://inertiajs.com/) + React 19, Vite |
| Base de données | SQLite (`better-sqlite3`) |
| API externe | TMDB, appelée avec le client HTTP `ky` |

## Ce que j'ai appris

- Structurer une application MVC avec AdonisJS (routes, contrôleurs, modèles, transformers)
- Créer des migrations et des seeders idempotents (`updateOrCreateMany`)
- Consommer une API REST externe et protéger les clés avec `Env.schema.secret()`
- Relier un back-end AdonisJS à un front React grâce à Inertia
- Paginer et filtrer des résultats côté serveur
- Mettre en place une authentification par session

Mes notes et réponses aux questions du TP sont dans [r_sum_du_tp_et_questions.md](r_sum_du_tp_et_questions.md).

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) **24 ou plus**
- Une clé d'API TMDB (gratuite) : [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-utilisateur>/cine-club.git
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
