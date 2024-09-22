const zod = require("zod");

// Schema for creating a Todo
const createTodo = zod.object({
    title: zod.string().nonempty("Title is required"), // Title is required
    description: zod.string().nonempty("Description is required"), // Description is required
    reminder: zod.string().optional(), // Optional reminder field
    reminderTime: zod.string().optional(), // Optional reminder time field
    image: zod.string().url("Invalid image URL").optional(), // Optional image URL
    labels: zod.array(zod.string()).optional(), // Optional array of labels
});

// Schema for updating a Todo
const updateTodo = zod.object({
    id: zod.string().nonempty("ID is required"), // Required ID for updating
    title: zod.string().optional(), // Optional field for updating title
    description: zod.string().optional(), // Optional field for updating description
    completed: zod.boolean().optional(), // Optional field for updating completion status
    reminder: zod.string().optional(), // Optional reminder field
    reminderTime: zod.string().optional(), // Optional reminder time field
    image: zod.string().url("Invalid image URL").optional(), // Optional image URL
    labels: zod.array(zod.string()).optional() // Optional array of labels
});

// Schema for user signup
const createSignup = zod.object({
    firstName: zod.string().nonempty("First name is required"), // First name is required
    lastName: zod.string().nonempty("Last name is required"), // Last name is required
    contactNumber: zod.string()
        .regex(/^[0-9]+$/, "Contact number must contain only digits") // Only digits allowed
        .nonempty("Contact number is required"), // Contact number is required
    username: zod.string().nonempty("Username is required"), // Username is required
    email: zod.string().email("Invalid email format"), // Email must be valid
    password: zod.string().min(6, "Password must be at least 6 characters long") // Password must be at least 6 characters long
});

module.exports = {
    createSignup,
    createTodo,
    updateTodo
};
