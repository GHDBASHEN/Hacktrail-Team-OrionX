import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
    getUserByUserEmailORPswdModel,
    getSystemUserByEmpIdModel,
    registerEmployeeModel,
    updatePasswordByEmail
} from '../models/userModel.js';
import { saveSystemuserRefreshTokenModel, isRefreshTokenValidModel, saveCustomerRefreshTokenModel, checkEmailModel } from '../models/authModule.js';
import { registerCustomerModel, getCustomerByEmailORPswdModel } from '../models/customerModel.js';

//Register employees 
export const registerEmp = async (req, res) => {
    const { pswd, employee_id } = req.body;
    try {
        const userAlreadyExist = await getSystemUserByEmpIdModel(employee_id);
        if (userAlreadyExist) return res.status(400).json({ message: 'This User already exist...' });

        const hashedPassword = await bcrypt.hash(pswd, 10);
        //await registerSuperAdminSystemUserModel(hashedPassword, employee_id);
        await registerEmployeeModel(hashedPassword, employee_id);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error register employees.', error });
    }
}

//Register customers 
export const registerCus = async (req, res) => {
    const { password, customer_id } = req.body;
    try {
        //const userAlreadyExist = await getCustomersByCusIdModel(customer_id);
        //if (userAlreadyExist) return res.status(400).json({ message: 'This User already exist...' });
        //console.log('Registering customers with ID:', customer_id);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerCustomerModel(hashedPassword, customer_id);
        res.status(201).json({ message: 'Customer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'error register customers.', error });
    }
}

//Register customers 
// export const updateCustomerPswd = async (req, res) => {
//     const { password, customer_id } = req.body;
//     try {
//         const userAlreadyExist = await getCustomersByCusIdModel(customer_id);
//         if (!userAlreadyExist) return res.status(400).json({ message: 'This User does not exist...' });
//         const hashedPassword = await bcrypt.hash(password, 10);
//         await registerCustomerModel(hashedPassword, customer_id);
//         res.status(201).json({ message: 'Customer password updated successfully' });
//         console.log('Updating customers password for ID:', customer_id, password);
//     } catch (error) {
//         res.status(500).json({ message: 'error updating customers password.', error });
//     }
// }

// For login
export const login = async (req, res) => {
    const { credential, password } = req.body;

    try {
        // Try finding the user in customers model first
        let user = await getCustomerByEmailORPswdModel(credential);
        console.log("User Found:", user);
        // If not found, try the system user model
        if (!user) {
            user = await getUserByUserEmailORPswdModel(credential);
        }
        console.log("User Found:2", user);

        // If still not found, return error
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password not matched.' });
        }

        if (user.user_role == 'customer') {
            const token = jwt.sign({ userId: user.id, userEmail: user.email, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '2m' });
            const refreshToken = jwt.sign({ userId: user.id, userEmail: user.email, role: user.user_role }, process.env.JWT_REFRESH, { expiresIn: '2h' });

            await saveCustomerRefreshTokenModel(refreshToken, user.id);
            res.status(200).json({ message: 'Login successful', userEmail: user.email, id: user.id, role: user.user_role, token, refreshToken });
        } else {
            const token = jwt.sign({ userId: user.id, userEmail: user.email, role: user.user_role }, process.env.JWT_SECRET, { expiresIn: '2m' });
            const refreshToken = jwt.sign({ userId: user.id, userEmail: user.email, role: user.user_role }, process.env.JWT_REFRESH, { expiresIn: '2h' });

            await saveSystemuserRefreshTokenModel(refreshToken, user.id);
            res.status(200).json({ message: 'Login successful', userEmail: user.email, id: user.id, role: user.user_role, token, refreshToken });
        }

    } catch (error) {
        res.status(500).json({ msg: 'Error during login', error });
    }
};

export const refresh = async (req, res) => {
    const refreshToken = req.body.refreshKey;

    if (!refreshToken) return res.sendStatus(401);

    // Assuming you have a way to get the user ID from the refresh token
    const decodedRToken = jwt.decode(refreshToken);
    const userId = decodedRToken?.useId;
    if (await isRefreshTokenValidModel(userId, refreshToken)) {
        console.error('Invalid refresh token');
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, user) => {
        if (err) return res.status(403).json({ message: "Refresh token not verified." });

        // Access user.id and user.role from the decoded token
        const { useId, userEmail, role } = user;

        const token = jwt.sign({ useId: useId, userEmail: userEmail, role: role }, process.env.JWT_SECRET, { expiresIn: '2m' });

        res.status(200).json({ message: 'Token refreshed', userEmail: user.email, id: user.id, role: user.roles, token });
    });

}

export const checkEmail = async (req, res) => {
    const { email } = req.query;
    try {
        const response = await checkEmailModel(email);
        if (!response) {
            return res.status(404).json({ message: 'Email not found' });
        }

        res.status(200).json({ message: 'Email validated', email: response.email, source_table: response.source_table });
    } catch (error) {
        res.status(500).json({ message: 'Error validating email', error });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '3m' });

    try {
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
};

export const validateOtp = async (req, res) => {
    const { token, otp } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        res.status(200).json({ message: 'OTP validated successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
};

export const updateUserPassword = async (req, res) => {
    const {password, email, table } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePasswordByEmail(hashedPassword, email, table);
        res.status(201).json({ message: 'User update successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
};
