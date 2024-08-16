import express from "express";
import { addStudentToClassroom, createClassroom, deleteStudentFromClassroom } from "../controllers/Classroom.js";




const classroomRoutes = express.Router();
classroomRoutes.post('/create', createClassroom);
classroomRoutes.post('/:classroomId/students', addStudentToClassroom);
classroomRoutes.post('/:classroomId/students/:studentId', deleteStudentFromClassroom);


export default classroomRoutes  