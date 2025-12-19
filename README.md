# backend-node.js# 
API Système de Gestion Mixte (Bibliothèque & Académique)

## Présentation du sujet
Ce projet est une API REST développée avec **Node.js**, **Express** et **MongoDB**. Elle propose une solution backend complète pour gérer trois secteurs d'activité :
1.  **Gestion de Bibliothèque** : Administration des auteurs, livres, éditeurs et articles.
2.  **Gestion Académique** : Suivi des étudiants et de leur affectation dans des classes.
3.  **Gestion Commerciale** : Système de commandes avec calcul dynamique des montants et statistiques de dépenses par utilisateur.

Le projet met l'accent sur l'utilisation avancée des relations NoSQL, la validation de données et les opérations d'agrégation complexes.

---

## Architecture du Projet
Le projet suit l'architecture **MVC (Modèle-Vue-Contrôleur)** pour une séparation claire de la logique :

* **`models/`** : Définit les schémas Mongoose (Book, Author, Student, Order, etc.).
* **`controllers/`** : Contient la logique métier (calculs, agrégations).
* **`routes/`** : Définit les points d'entrée de l'API et les lie aux contrôleurs.
* **`middlewares/`** : Gère les erreurs (404 et 500) et la sécurité.
* **`index.js`** : Point d'entrée principal qui initialise le serveur et la base de données.

---

## Modèle des données
Les relations sont gérées par **références (`ObjectId`)** pour permettre une intégrité des données optimale :

* **Book** : Titre, ISBN, Prix, Auteurs (ref), Éditeur (ref), Catégories (ref).
* **Student** : Nom, Âge, Classe (ref).
* **Order** : Utilisateur (ref), Articles (liste de livres + quantités), Montant calculé, Statut.
* **Class** : Nom de la classe, Niveau, Professeur.
* **User** : Nom et Email (pour les statistiques de commande).

## 4. Exemples d’appels API

### Gestion Académique
* **POST** `/api/students` : Inscrire un nouvel étudiant.
    ```json
    { "name": "Jean Dupont", "age": 22, "class_id": "ID_DE_LA_CLASSE" }
    ```
* **GET** `/api/students/details` : Récupère la liste des étudiants avec les détails complets de leur classe via une agrégation `$lookup`.

### Bibliothèque & Recherche
* **GET** `/api/books?search=miserables` : Recherche textuelle de livres par titre ou résumé avec pagination.
* **GET** `/api/books/stats/top-authors` : Agrégation identifiant les 5 auteurs ayant le plus grand catalogue.

### Commandes & Statistiques
* **POST** `/api/orders` : Créer une commande. Le serveur récupère automatiquement le prix des livres en base pour calculer le `amount`.
    ```json
    {
      "userId": "ID_USER",
      "items": [{ "bookId": "ID_BOOK", "quantity": 2 }]
    }
    ```
* **GET** `/api/orders/stats` : Agrégation affichant pour chaque utilisateur son nom, le nombre total de commandes et le montant total dépensé.

---

## Description des Routes & Appels API

### 1. Gestion des Étudiants 
* **POST** `/api/students` : Créer un étudiant (vérifie si la classe existe).
* **GET** `/api/students` : Liste simple de tous les étudiants.
* **GET** `/api/students/details` : **Agrégation** qui fusionne les données de l'étudiant avec les détails complets de sa classe.

### 2. Gestion des Livres et Auteurs
* **POST** `/api/authors` : Création d'un auteur avec validation des champs.
* **GET** `/api/books` : Recherche avancée avec pagination et filtres.
* **GET** `/api/books/stats/top-authors` : **Agrégation** identifiant les 5 auteurs ayant écrit le plus de livres.

### 3. Gestion des Commandes
* **POST** `/api/orders` : Création d'une commande (le prix total est calculé automatiquement en consultant le prix unitaire des livres en base).
* **GET** `/api/orders` : Liste des commandes avec filtrage possible par `userId`.
* **GET** `/api/orders/stats` : **Agrégation avancée** affichant par utilisateur le montant total dépensé et l'historique de ses commandes.

---

## Instructions d'installation

### Prérequis
* **Node.js** (v16 ou supérieur)
* **MongoDB** (Instance locale ou cluster MongoDB Atlas)

### Procédure
1.  **Cloner le projet** :
    ```bash
    git clone 'https://github.com/naura84/backend-node.git'
    cd backend-node
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

3.  **Configurer l'environnement** :
    Créez un fichier `.env` à la racine et renseignez vos identifiants :
    ```env
    PORT=3000
    MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ma_base
    ```

4.  **Lancer l'application** :
    ```bash
    # Mode production
    npm start

    # Mode développement (avec redémarrage automatique)
    npm run dev
    ```

L'API est maintenant accessible sur `http://localhost:3000`.