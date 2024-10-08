import express from "express";
import { addStudentToClassroom, assignTaskToClassroom, createClassroom, deleteClassroom, deleteStudentFromClassroom, editClassroom, getTaskSubmissionStatus } from "../controllers/Classroom.js";




const classroomRoutes = express.Router();
classroomRoutes.post('/create', createClassroom);
classroomRoutes.post('/:classroomId/students', addStudentToClassroom);
classroomRoutes.delete('/:classroomId/students/:studentId', deleteStudentFromClassroom);
classroomRoutes.post('/:classroomId/tasks', assignTaskToClassroom);
classroomRoutes.put('/:classroomId', editClassroom);
classroomRoutes.delete('/:classroomId', deleteClassroom);
classroomRoutes.get('/:classroomId/tasks/:taskId/submissions', getTaskSubmissionStatus);


export default classroomRoutes  