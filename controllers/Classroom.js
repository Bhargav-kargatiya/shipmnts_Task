import Classroom from "../models/Classroom.js";
import Student from "../models/Student.js";
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
        const { classroomId, studentId } = req.params;  // Extract classroomId and studentId from the URL parameters

        // Check if the classroom exists
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Check if the student is in the classroom
        const studentIndex = classroom.students.indexOf(studentId);
        if (studentIndex === -1) {
            return res.status(404).json({ message: 'Student not found in the classroom' });
        }

        // Remove the student from the classroom
        classroom.students.splice(studentIndex, 1);
        await classroom.save();

        // Remove the classroom from the student's list of classrooms
        const student = await Student.findById(studentId);
        if (student) {
            const classroomIndex = student.classrooms.indexOf(classroomId);
            if (classroomIndex !== -1) {
                student.classrooms.splice(classroomIndex, 1);
                await student.save();
            }
        }

        // Return the response
        res.status(200).json({ message: 'Student removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


