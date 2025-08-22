import jwt from 'jsonwebtoken';

export const customers = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No token provided' }); // Ensure no `next()` call
    }

    //assign the refreshtoken
    const token = req.headers.authorization.split(' ')[1];

    //check user role is customers?
    const decoded = jwt.decode(token);
    const userRole = decoded?.role;
    if(userRole !== 'customers'){
        return res.status(403).json({ message: 'You are not authorized customers' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next(); // Call next only when everything is valid
    });
};