const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    classrooms: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }],
    tasks: [{
        task: { type: Schema.Types.ObjectId, ref: 'Task' },
        status: { type: String, enum: ['submitted', 'pending'], default: 'pending' }
    }]
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
