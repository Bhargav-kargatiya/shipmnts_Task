import express from "express";
import createClassroom from "../controllers/Classroom.js";




const classroomRoutes = express.Router();
classroomRoutes.post('/create', createClassroom);


export default classroomRoutes  