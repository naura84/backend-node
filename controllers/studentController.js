import Student from '../models/Students.js';
import Class from '../models/Class.js';
import mongoose from 'mongoose';

// 1. Logique pour créer un étudiant
export const createStudent = async (req, res) => {
    try {
        const { name, age, class_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(class_id)) {
            return res.status(400).json({ message: "Le format de l'ID de classe est invalide." });
        }

        const existingClass = await Class.findById(class_id);
        if (!existingClass) {
            return res.status(404).json({ message: `La classe avec l'ID ${class_id} n'existe pas.` });
        }

        const newStudent = new Student({ name, age, class_id });
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Logique pour récupérer tous les étudiants
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Logique pour l'agrégation avancée (détails de la classe)
export const getStudentsWithDetails = async (req, res) => {
    try {
        const pipeline = [
            {
                "$lookup": {
                    "from": "classes", // Nom de la collection en BD
                    "localField": "class_id",
                    "foreignField": "_id",
                    "as": "class_info"
                }
            },
            { "$unwind": "$class_info" },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "age": 1,
                    "class_details": {
                        "name": "$class_info.name",
                        "level": "$class_info.level",
                        "professor": "$class_info.professor"
                    }
                }
            }
        ];
        const results = await Student.aggregate(pipeline);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};