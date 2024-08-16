import express from "express";
import createTeacher from "../controllers/Teacher.js";
import createClassroom from "../controllers/Classroom.js";



const teacherRoutes = express.Router();
teacherRoutes.post('/create', createTeacher);
teacherRoutes.post('/:teacherId/classrooms', createClassroom);


export default teacherRoutes  