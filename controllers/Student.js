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



