const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Connect to MongoDB and create a database
mongoose.connect("");

// Define the Todo schema
const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup' }, // Add reference to Signup
    reminder: { type: Date, default: null }, // Optional reminder date
    reminderTime: { type: String, default: null }, // Optional time in HH:mm format
    image: { type: String, default: null }, // Optional image URL
    labels: { type: [String], default: [] }, // Optional array of labels
});

const Todo = mongoose.model('todos', todoSchema);

// Define the signup schema
const signupSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
});

// Hash the password before saving the user
signupSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            this.password = await bcrypt.hash(this.password, 10); // Hash the password
        } catch (err) {
            return next(err);
        }
    }
    next();
});

// Method to compare passwords using bcrypt
signupSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password); // Compare the password using bcrypt
};

// Middleware to delete all todos when a user is deleted
signupSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        await Todo.deleteMany({ user: this._id }); // Delete all todos associated with this user
        next();
    } catch (err) {
        next(err); // Handle errors
    }
});

const Signup = mongoose.model('Signup', signupSchema);

// Export both models
module.exports = {
    Todo,
    Signup
};
