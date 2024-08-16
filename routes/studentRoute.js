import express from "express";
import { createStudent, getStudentClassrooms } from "../controllers/Student.js";



const studentRoutes = express.Router();
studentRoutes.post('/create', createStudent);
studentRoutes.get('/:studentId/classrooms', getStudentClassrooms);



export default studentRoutes  