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

        // Find the student and populate the classrooms field
        const student = await Student.findById(studentId).populate('classrooms');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Map the populated classrooms to the desired response format
        const classrooms = student.classrooms.map(classroom => ({
            classroomId: classroom._id.toString(),
            classroomName: classroom.name
        }));

        // Return the list of classrooms
        res.status(200).json(classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



