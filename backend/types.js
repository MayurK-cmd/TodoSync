const zod = require("zod");

// Schema for creating a Todo
const createTodo = zod.object({
    title: zod.string().nonempty("Title is required"),
    description: zod.string().nonempty("Description is required")
});

// Schema for updating a Todo
const updateTodo = zod.object({
    id: zod.string().nonempty("ID is required"),
    title: zod.string().optional(), // Optional field for updating title
    description: zod.string().optional(), // Optional field for updating description
    completed: zod.boolean().optional() // Optional field for updating completion status
});

// Schema for user signup
const createSignup = zod.object({
    firstName: zod.string().nonempty("First name is required"),
    lastName: zod.string().nonempty("Last name is required"),
    contactNumber: zod.string()
        .regex(/^[0-9]+$/, "Contact number must contain only digits")
        .nonempty("Contact number is required"),
    username: zod.string().nonempty("Username is required"),
    email: zod.string().email("Invalid email format"),
    password: zod.string().min(6, "Password must be at least 6 characters long")
});

module.exports = {
    createSignup,
    createTodo,
    updateTodo
};

