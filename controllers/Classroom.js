import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
import Task from "../models/Task.js";
import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";


export const createClassroom = asyncHandler(async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { classroomName } = req.body;
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Check if classroom already exists
        const existingClassroom = await Classroom.findOne({ name: classroomName, teacher: teacherId });
        if (existingClassroom) {
            return res.status(400).json({ message: 'Classroom already exists' });
        }

        const newClassroom = new Classroom({
            name: classroomName,
            teacher: teacherId
        });
        const savedClassroom = await newClassroom.save();
        teacher.classrooms.push(savedClassroom._id);
        await teacher.save();
        res.status(201).json({
            classroomId: savedClassroom._id,
            classroomName: savedClassroom.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export const addStudentToClassroom = asyncHandler(async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { studentId } = req.body;
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        if (classroom.students.includes(studentId)) {
            return res.status(400).json({ message: 'Student already in the classroom' });
        }

        classroom.students.push(studentId);
        await classroom.save();
        student.classrooms.push(classroomId);
        await student.save();
        res.status(200).json({ message: 'Student added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export const deleteStudentFromClassroom = asyncHandler(async (req, res) => {
    try {
        const { classroomId, studentId } = req.params;
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        const studentIndex = classroom.students.indexOf(studentId);
        if (studentIndex === -1) {
            return res.status(404).json({ message: 'Student not found in the classroom' });
        }
        classroom.students.splice(studentIndex, 1);
        await classroom.save();
        const student = await Student.findById(studentId);
        if (student) {
            const classroomIndex = student.classrooms.indexOf(classroomId);
            if (classroomIndex !== -1) {
                student.classrooms.splice(classroomIndex, 1);
                await student.save();
            }
        }
        res.status(200).json({ message: 'Student removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const assignTaskToClassroom = asyncHandler(async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { title, description, dueDate } = req.body;
        const classroom = await Classroom.findById(classroomId).populate('students');
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            classroom: classroomId
        });
        const savedTask = await newTask.save();
        classroom.tasks.push(savedTask._id);
        await classroom.save();
        for (let student of classroom.students) {
            student.tasks.push({ task: savedTask._id, status: 'pending' });
            await student.save();
        }
        res.status(201).json({
            taskId: savedTask._id,
            title: savedTask.title,
            description: savedTask.description,
            dueDate: savedTask.dueDate.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const editClassroom = asyncHandler(async (req, res) => {
    try {
        const { classroomId } = req.params;
        const { name } = req.body;


        // Find and update the classroom
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            classroomId,
            { name },
            { new: true }
        );
        if (!updatedClassroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }
        res.status(200).json({
            message: 'Classroom updated successfully.',
            classroomName: updatedClassroom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



