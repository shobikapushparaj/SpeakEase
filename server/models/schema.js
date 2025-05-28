const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UserModel = mongoose.model("Signup_details", UserSchema);

const TaskSchema = new mongoose.Schema({
    taskname: String,
    date: Date,
    time: String,
    status: String,
    notistatus: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Signup_details'
    }
});

const TaskModel = mongoose.model("task_details", TaskSchema);

module.exports = {
    UserModel: UserModel,
    TaskModel: TaskModel
};





