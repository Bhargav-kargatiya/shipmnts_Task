import express from "express";
import { createStudent, getStudentClassrooms, getStudentClassroomTasks } from "../controllers/Student.js";



const studentRoutes = express.Router();
studentRoutes.post('/create', createStudent);
studentRoutes.get('/:studentId/classrooms', getStudentClassrooms);
studentRoutes.get('/:studentId/classrooms/:classroomId/tasks', getStudentClassroomTasks);



export default studentRoutes  