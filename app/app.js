import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import createClassroom from "../controllers/CreateClassroom.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post("/teachers/{teacherId}/classrooms", createClassroom);

export default app