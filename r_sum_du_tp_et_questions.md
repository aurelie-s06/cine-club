# Résumé et Questions - TP Importation de films avec l'API TMDB

Ce document rassemble les questions clés du TP, leurs réponses détaillées, ainsi que l'essentiel à retenir pour votre projet AdonisJS.

---

## 🔗 Lien du TP
Retrouvez les instructions originales du TP sur GitHub :
[https://github.com/batosai/mmi3/blob/main/step-03/td-import.md](https://github.com/batosai/mmi3/blob/main/step-03/td-import.md)

---

## 💡 Les points importants à retenir

1. **Sécurité des variables d'environnement** : 
   - Utilisez toujours `Env.schema.secret()` pour les clés d'API et jetons sensibles afin d'éviter qu'ils ne fuitent accidentellement dans les logs.
   - Ne poussez **jamais** votre fichier `.env` sur Git (utilisez `.env.example` sans les vraies valeurs).

2. **Le client HTTP `ky`** :
   - Plus moderne et léger qu'`axios`, il s'intègre parfaitement avec des objets de configuration et gère proprement les préfixes d'URL et les en-têtes d'authentification (`Bearer Token`).

3. **Idempotence des Seeders (`updateOrCreateMany`)** :
   - Pour éviter les doublons ou les erreurs de contrainte unique lors de l'insertion de données distantes récurrentes, l'utilisation de `updateOrCreateMany` associée à une clé unique (comme `tmdbId`) est indispensable.

4. **Gestion dynamique des URLs (Getters)** :
   - Stocker uniquement les chemins relatifs (ex: `poster_path`) en base de données combiné à des getters sur le modèle permet une flexibilité totale si l'URL de base ou la taille des images (CDN) venait à changer.

---

## ❓ Questions de fin de TP et Réponses

### 1. Pourquoi déclarer `TMDB_READ_ACCESS_TOKEN` avec `Env.schema.secret()` plutôt qu'avec `Env.schema.string()` ?
* **Réponse :** Parce que `Env.schema.secret()` retourne un objet de type `Secret` dont la valeur est automatiquement masquée (`[REDACTED]`) lorsqu'on l'affiche dans la console ou dans les journaux d'erreurs (logs), garantissant ainsi la sécurité de la donnée.

### 2. Que se passerait-il si on relançait le seeder en remplaçant `updateOrCreateMany` par `createMany` ? Et si la colonne `tmdb_id` n'avait pas de contrainte `unique` ?
* **Avec `createMany` et une contrainte `unique` :** L'application plantera à la deuxième exécution en raison d'une violation de contrainte unique (tentative d'insérer un `tmdb_id` déjà présent).
* **Sans contrainte `unique` :** Le seeder insérerait à nouveau tous les films à chaque exécution, créant de nombreux **doublons** dans la base de données.

### 3. Pourquoi stocker `poster_path` plutôt que l'URL complète de l'image ?
* **Réponse :** L'API TMDB ne renvoie que le chemin relatif de l'image. Stocker uniquement ce chemin permet de centraliser la base URL des images via l'environnement (`TMDB_IMAGE_BASE_URL`), ce qui facilite grandement la maintenance (changement de CDN, modification de la taille des images à la volée, etc.).

### 4. Requêtes en parallèle vs séquentielles
* **Exemple de parallélisation (avec `Promise.all`) :**
  ```ts
  const pages = [1, 2, 3, 4, 5]
  const results = await Promise.all(pages.map((page) => tmdb.popular(page)))
  const allMovies = results.flat()
  ```
* **Risque vis-à-vis d'une API externe :** Lancer toutes les requêtes en même temps peut déclencher le mécanisme de protection contre le spam ou la surcharge de l'API (le **rate limiting**), provoquant des erreurs `429 Too Many Requests` ou un blocage temporaire.