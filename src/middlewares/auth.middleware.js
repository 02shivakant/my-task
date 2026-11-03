const authenticateUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    // Validate user ID and role
    if (!userId || !userRole) {
        return res.status(401).json({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'User ID and role are required'
        });
    }

    // Validate allowed roles
    if (!['recruiter', 'candidate'].includes(userRole)) {
        return res.status(401).json({
            success: false,
            code: 'UNAUTHORIZED',
            message: 'Invalid user role'
        });
    }

    // Attach user information to request
    req.user = {
        id: userId,
        role: userRole
    };

    next();
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                code: 'FORBIDDEN',
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

module.exports = {
    authenticateUser,
    authorizeRoles
};