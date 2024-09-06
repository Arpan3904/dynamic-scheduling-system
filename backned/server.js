const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User'); 

// Body parser middleware
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/register', async (req, res) => {
    const { email } = req.query;  // Extract email from req.body
    console.log(req.query);       // Check if the request body is received correctly
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new User({ email });
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.get('/login', async (req, res) => {
    const { email } = req.query;  // Extract email from query parameters
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
