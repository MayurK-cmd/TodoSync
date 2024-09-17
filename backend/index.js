const express = require("express");
const { createTodo, updateTodo, createSignup } = require("./types"); // Added createSignup import
const { Todo, Signup } = require("./db"); // Import both models
const cors = require("cors");
const jwt = require("jsonwebtoken"); // Import JWT
const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = "your_secret_key"; // Use a strong secret key in production

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "You need to sign up or log in first" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token. Please log in again" });
        }
        req.user = user; // Attach user information to request
        next();
    });
}


// Signup route
app.post('/signup', async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createSignup.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(400).json({
            msg: "Invalid inputs",
            errors: parsedPayload.error.errors,
        });
    }

    try {
        const user = new Signup(createPayload);
        await user.save();
        
        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ msg: "Account signup successful!", token });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.username) {
            return res.status(400).json({ msg: "Username already in use" });
        }
        res.status(500).json({ message: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }

    try {
        const user = await Signup.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "Username does not match" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ msg: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Delete a user
// Delete user and all associated todos
app.delete("/username/:username", authenticateToken, async (req, res) => {
    const { username } = req.params;
    const { password } = req.body;

    // Ensure the authenticated user can only delete their own account
    if (req.user.username !== username) {
        return res.status(403).json({ message: "You are not authorized to delete this user" });
    }

    try {
        const user = await Signup.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Compare provided password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }

        // Delete all todos related to the user
        await Todo.deleteMany({ user: user._id });

        // Delete the user
        await user.deleteOne();

        res.json({ message: "User and their todos deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: error.message });
    }
});

// Creates a todo (user must be authenticated)
app.post("/todo", authenticateToken, async function (req, res) {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);

    if (!parsedPayload.success) {
        return res.status(400).json({
            msg: "You sent the wrong inputs",
        });
    }

    try {
        await Todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false,
            user: req.user._id // Associate the todo with the user
        });

        res.json({
            msg: "Todo created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Gets all todos (user must be authenticated)
app.get("/todos", authenticateToken, async function (req, res) {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Updates a todo by title (user must be authenticated)
app.put("/todos/title/:title", authenticateToken, async (req, res) => {
    const { title } = req.params;
    const { newTitle, description, completed } = req.body;

    // Create an update object, including only the fields that are provided
    const updateFields = {};
    if (newTitle !== undefined) updateFields.title = newTitle;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;

    try {
        const updatedTodo = await Todo.findOneAndUpdate(
            { title },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Marks a todo as completed (user must be authenticated)
app.put("/completed", authenticateToken, async function (req, res) {
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);

    if (!parsedPayload.success) {
        return res.status(400).json({
            msg: "Invalid inputs",
            errors: parsedPayload.error.errors,
        });
    }

    try {
        const updated = await Todo.findByIdAndUpdate(
            req.body.id,
            { completed: true },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({
            msg: "Todo marked as completed",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deletes a todo by title (user must be authenticated)
app.delete("/todos/title/:title", authenticateToken, async (req, res) => {
    const { title } = req.params;

    try {
        const deletedTodo = await Todo.findOneAndDelete({ title });

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ message: "Todo deleted successfully", deletedTodo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is up on port 3000");
});
