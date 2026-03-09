const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    let token;

    // The token is expected to be in the 'Authorization' header, formatted as "Bearer [token]"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the same secret key it was signed with
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user associated with the token's ID and attach them to the request object.
            //    We exclude the password for security.
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                 return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 4. If everything is successful, pass control to the next middleware or the route's controller
            next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is found in the header, deny access
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = authMiddleware;