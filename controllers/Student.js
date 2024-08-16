import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import asyncHandler from "express-async-handler";

//create Student
export const createStudent = asyncHandler(async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const newStudent = new Student({
            name,
            email
        });
        const savedStudent = await newStudent.save();
        res.status(201).json({
            studentId: savedStudent._id,
            studentName: savedStudent.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export const getStudentClassrooms = asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId).populate('classrooms');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        const classrooms = student.classrooms.map(classroom => ({
            classroomId: classroom._id.toString(),
            classroomName: classroom.name
        }));
        res.status(200).json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const getStudentClassroomTasks = asyncHandler(async (req, res) => {
    try {
        const { studentId, classroomId } = req.params;
        const student = await Student.findById(studentId).populate({
            path: 'classrooms',
            match: { _id: classroomId },
            populate: 'tasks'
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const classroom = student.classrooms[0];
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found or student is not enrolled' });
        }
        const tasks = classroom.tasks.map(task => ({
            taskId: task._id.toString(),
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toISOString().split('T')[0]
        }));
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export const submitTask = asyncHandler(async (req, res) => {
    try {
        const { studentId, classroomId, taskId } = req.params;
        const { document } = req.files;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const dueDate = new Date(task.dueDate);
        if (new Date() > dueDate) {
            return res.status(400).json({ message: 'Task submission is closed as the due date has passed' });
        }
        const student = await Student.findById(studentId);
        const classroom = await Classroom.findById(classroomId);

        if (!student || !classroom) {
            return res.status(404).json({ message: 'Student or classroom not found' });
        }
        if (!student.classrooms.includes(classroomId)) {
            return res.status(403).json({ message: 'Student is not enrolled in this classroom' });
        }
        const studentTask = student.tasks.find(t => t.task.toString() === taskId);
        if (studentTask && studentTask.status === 'submitted') {
            return res.status(400).json({ message: 'Task already submitted' });
        }
        if (studentTask) {
            studentTask.status = 'submitted';
            studentTask.document = document;
        } else {
            student.tasks.push({ task: taskId, status: 'submitted', document });
        }
        await student.save();
        res.status(200).json({
            taskId: task._id.toString(),
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


