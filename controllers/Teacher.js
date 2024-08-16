import Teacher from "../models/Teacher.js";


const createTeacher = async (req, res) => {

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
};
export default createTeacher;