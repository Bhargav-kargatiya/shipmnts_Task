import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
    submissions: [{
        student: { type: Schema.Types.ObjectId, ref: 'Student' },
        status: { type: String, enum: ['submitted', 'pending'], default: 'pending' }
    }]
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
