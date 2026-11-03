const express = require('express');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
const {
    authenticateUser,
    authorizeRoles
} = require('./middlewares/auth.middleware');

const errorhandler = require('./middlewares/error.middleware');


// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Interview Slot Booking API is running'
    });
});

app.get(
    '/test-auth',
    authenticateUser,
    authorizeRoles('recruiter'),
    (req, res) => {
        res.status(200).json({
            success: true,
            user: req.user
        });
    }
);
app.use(errorhandler)
module.exports = app;
