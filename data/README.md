Seed script pour créer une base MongoDB de gestion de bibliothèque (library_db).

Prérequis:
- Node.js installé
- MongoDB accessible (par défaut mongodb://localhost:27017)
- Installer le driver mongodb: `npm install mongodb`

Exécution:
1. Placez-vous dans le dossier racine du projet (contenant package.json) ou où vous voulez.
2. Installez le driver si nécessaire: npm install mongodb
3. Lancez le script:
   node data/seed-library.js

Le script supprime la base library_db (dropDatabase) puis insère de nombreuses collections:
- authors, publishers, categories, branches, books, copies, members, staff, loans, reservations, fines, reviews

Vous pouvez changer la variable d'environnement MONGO_URI si votre instance MongoDB n'est pas en localhost:
  export MONGO_URI="mongodb://user:pass@host:27017" && node data/seed-library.js
(sur PowerShell : $env:MONGO_URI="mongodb://..." ; node .\data\seed-library.js)
