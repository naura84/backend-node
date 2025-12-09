const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Class = require('./models/Class');

const app = express();
const PORT = 3000;
const MONGO_URI = "mongodb://localhost:27017/bibliotheque_db"; // Modifiez si nécessaire

// Middleware pour parser le JSON dans le corps des requêtes
app.use(express.json());

// --- Connexion à MongoDB ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Erreur de connexion à MongoDB :', err));


// --- Fonction d'initialisation (Pour avoir des données de test) ---
async function initializeData() {
    try {
        if (await Class.countDocuments() === 0) {
            const initialClass = await Class.create({
                name: "Littérature Avancée",
                level: "Master 1",
                professor: "Dr. Jean Valjean"
            });
            console.log(`Classe de test créée avec l'ID: ${initialClass._id}`);

            // Création d'un étudiant de test lié à cette classe
            await Student.create({
                name: "Alice Dupont",
                age: 20,
                class_id: initialClass._id
            });
            await Student.create({
                name: "Bernard Lavigne",
                age: 22,
                class_id: initialClass._id
            });
            console.log('Étudiants de test créés.');
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation des données:", error);
    }
}
initializeData();


// =========================================================
//                  LES 3 ROUTES PRINCIPALES
// =========================================================


// --- 1. Route d’écriture : Créer un nouvel étudiant (POST /students) ---
app.post('/students', async (req, res) => {
    try {
        const { name, age, class_id } = req.body;

        // 1. Vérification de l'existence de la classe
        if (!mongoose.Types.ObjectId.isValid(class_id)) {
            return res.status(400).json({ message: "L'ID de classe fourni n'est pas un format valide (ObjectId)." });
        }
        const existingClass = await Class.findById(class_id);
        if (!existingClass) {
            return res.status(404).json({ message: `Classe avec l'ID ${class_id} non trouvée.` });
        }

        // 2. Création de l'étudiant
        const newStudent = new Student({ name, age, class_id });
        await newStudent.save();

        res.status(201).json(newStudent);
    } catch (error) {
        // Gère les erreurs de validation Mongoose ou autres erreurs serveur
        res.status(500).json({ message: error.message });
    }
});


// --- 2. Route de lecture : Récupérer la liste complète des étudiants (GET /students) ---
app.get('/students', async (req, res) => {
    try {
        // Le sort({ name: 1 }) trie par le champ 'name' par ordre alphabétique croissant
        const students = await Student.find().sort({ name: 1 });
        
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// --- 3. Route d’agrégation avancée : Étudiants avec détails de la classe (GET /students/details) ---
app.get('/students/details', async (req, res) => {
    try {
        const pipeline = [
            {
                // Étape 1: $lookup (Jointure)
                // Joindre la collection 'students' (implicite) avec la collection 'classes'
                "$lookup": {
                    "from": "classes",        // Nom de la collection cible (doit être le nom *pluriel* de votre modèle Mongoose)
                    "localField": "class_id", // Le champ dans le document étudiant
                    "foreignField": "_id",    // Le champ correspondant dans la collection 'classes'
                    "as": "class_details"     // Nom du champ de sortie (sera un tableau)
                }
            },
            {
                // Étape 2: $unwind (Déroulement)
                // Convertit le tableau 'class_details' en un seul objet.
                "$unwind": "$class_details"
            },
            {
                // Étape 3: $project (Projection)
                // Permet de sélectionner et de renommer les champs pour la réponse finale.
                "$project": {
                    "_id": 0,           // Exclut l'ID de l'étudiant
                    "name": 1,          // Inclut le nom
                    "age": 1,           // Inclut l'âge
                    "class_details": { // Projection des champs de la classe dans l'objet 'class_details'
                        "name": "$class_details.name",
                        "level": "$class_details.level",
                        "professor": "$class_details.professor"
                    }
                }
            }
        ];

        // Exécution du pipeline d'agrégation
        const studentsWithDetails = await Student.aggregate(pipeline);

        res.status(200).json(studentsWithDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
    console.log('Utilisez les routes /students (POST/GET) et /students/details (GET)');
});