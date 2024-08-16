const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    classrooms: [{ type: Schema.Types.ObjectId, ref: 'Classroom' }]
});

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
