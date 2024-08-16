import express from "express";
import { createStudent } from "../controllers/Student.js";



const studentRoutes = express.Router();
studentRoutes.post('/create', createStudent);



export default studentRoutes  