import express from 'express';
const router = express.Router();
import { 
    createStudent, 
    getAllStudents, 
    getStudentsWithDetails 
} from '../controllers/studentController.js';

// Route POST /students
router.post('/', createStudent);

// Route GET /students
router.get('/', getAllStudents);

// Route GET /students/details
router.get('/details', getStudentsWithDetails);

export default router;