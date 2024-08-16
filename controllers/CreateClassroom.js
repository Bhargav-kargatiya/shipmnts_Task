import Classroom from "../models/Classroom.js";
import Teacher from "../models/Teacher.js";



const createTeacher = async (req, res) => {
    try {
        const { teacherName, teacherEmail } = req.body;
        const newTeacher = new Teacher({
            name: teacherName,
            email: teacherEmail
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

const createClassroom = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { classroomName } = req.body;
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
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
};
export default createClassroom;
