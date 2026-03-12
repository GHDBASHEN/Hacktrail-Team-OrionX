import jwt from 'jsonwebtoken';

export const userRole = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid auth header' });
    }

    const decoded = jwt.decode(token);
    const role = decoded?.role;

    const allowedRoles = ['super_admin', 'sub_admin', 'employee'];
    if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ message: 'You are not authorized.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};
