import Teacher from "../models/Teacher.js";
import asyncHandler from "express-async-handler";

export const createTeacher = asyncHandler(async (req, res) => {
    try {

        const { name, email } = req.body;

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: 'Teacher already exists' });
        }

        const newTeacher = new Teacher({
            name,
            email
        });
        const savedTeacher = await newTeacher.save();
        res.status(201).json({
            teacherId: savedTeacher._id,
            teacherName: savedTeacher.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
export default createTeacher;

export const viewClassrooms = asyncHandler(async (req, res) => {
    try {
        const { teacherId } = req.params;  // Extract teacherId from the URL parameters

        // Find the teacher and populate their classrooms
        const teacher = await Teacher.findById(teacherId).populate('classrooms');
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Return the list of classrooms
        res.status(200).json(teacher.classrooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
