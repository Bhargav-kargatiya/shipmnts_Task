import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import teacherRoutes from "../routes/teacherRoute.js";
import dbConnect from "../config/dbConnect.js";
import dotenv from 'dotenv';
import classroomRoutes from "../routes/classroomRoute.js";


dotenv.config();
dbConnect();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/teachers', teacherRoutes);
app.use('/classrooms', classroomRoutes);


export default app