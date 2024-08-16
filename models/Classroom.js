import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema({
    name: { type: String, required: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);
export default Classroom;
