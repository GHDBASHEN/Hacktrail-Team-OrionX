import nodemailer from 'nodemailer';

export const sendIdToEmp = async (req, res) => {
    const { name, subject, email, message } = req.body;
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Replace with your SMTP server
            port: parseInt(process.env.MAIL_PORT), // Replace with your SMTP port
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ADDRESS, // Replace with your email
                pass: process.env.MAIL_PSWD // Replace with your email password
            }
        });

        // Set up email data
        const mailOptions = {
            from: `"Deandra" <${process.env.MAIL_ADDRESS}>`, // Replace with your name and email
            to: email, // Recipient's email
            subject: subject,
            text: `Hello ${name},\n\n${message}`, // Plain text body
            html: `<p>Hello ${name},</p><p>${message}</p>` // HTML body
        };

        // Send email
        await transporter.sendMail(mailOptions);
        //await sgMail.send(mailOptions);

        res.status(200).json({ message: 'Email sent successfully' });

    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }

}

export const sendIdToUserMethod = async (name, subject, email, message, url) => {
    //const {name, subject, email, message} = req.body;
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST, // Replace with your SMTP server
            port: parseInt(process.env.MAIL_PORT), // Replace with your SMTP port
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ADDRESS, // Replace with your email
                pass: process.env.MAIL_PSWD // Replace with your email password
            }
        });

        const mailOptions = {
            from: `"Deandra" <noreply@deandrabolgoda.lk>`, // Use a domain-based email
            to: email,
            subject: subject,
            text: `Hello ${name},\n\nID: ${message}\n\nBest regards,\nDeandra`,
            html: `<html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                background-color: #f9f9f9;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                background: #ffffff;
                                padding: 20px;
                                margin: auto;
                                border-radius: 10px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            .header {
                                text-align: center;
                                font-size: 22px;
                                font-weight: bold;
                                color: #4A90E2;
                                padding-bottom: 15px;
                                border-bottom: 2px solid #ddd;
                            }
                            .content {
                                padding: 20px;
                                line-height: 1.6;
                                font-size: 16px;
                            }
                            .footer {
                                text-align: center;
                                padding: 15px;
                                font-size: 14px;
                                color: #777;
                                border-top: 2px solid #ddd;
                            }
                            .btn {
                                display: inline-block;
                                background-color: #4A90E2;
                                color: #fff;
                                padding: 10px 15px;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                            }
                            .btn:hover {
                                background-color: #357ABD;
                            }
                            .unsubscribe {
                                text-align: center;
                                margin-top: 10px;
                                font-size: 12px;
                                color: #999;
                            }
                            .unsubscribe a {
                                color: #FF5733;
                                text-decoration: none;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">Deandra Notification</div>
                            <div class="content">
                                <p>Hello <strong>${name}</strong>,</p>
                                <p>Your requested ID is: <strong>${message}</strong></p>
                                <p>Use the following Link to register & use this id${message}:</p>
                                <a href="${url}" class="btn">link</a>
                            </div>
                            <div class="footer">
                                Best regards,<br>Deandra Team
                            </div>
                        </div>
                    </body>
                  </html>`
        };

        // Send email
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log('Mail Server error...' );
    }
}

export const sendOtpEmail = async (email, otp) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            //host: process.env.MAIL_HOST, // Replace with your SMTP server
            host: process.env.MAIL_HOST, // Use environment variable for host
            port: parseInt(process.env.MAIL_PORT), // Replace with your SMTP port
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ADDRESS, // Replace with your email
                pass: process.env.MAIL_PSWD // Replace with your email password
            }
        });

        const mailOptions = {
            from: `"Deandra" <noreply@deandrabolgoda.lk>`, // Use a domain-based email
            to: email,
            subject: 'Your OTP Code',
            text: `Hello, Your OTP is: ${otp} Best regards,Deandra`,
            html: `<html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                color: #333;
                                background-color: #f9f9f9;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                background: #ffffff;
                                padding: 20px;
                                margin: auto;
                                border-radius: 10px;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            .header {
                                text-align: center;
                                font-size: 22px;
                                font-weight: bold;
                                color: #4A90E2;
                                padding-bottom: 15px;
                                border-bottom: 2px solid #ddd;
                            }
                            .content {
                                padding: 20px;
                                line-height: 1.6;
                                font-size: 16px;
                            }
                            .footer {
                                text-align: center;
                                padding: 15px;
                                font-size: 14px;
                                color: #777;
                                border-top: 2px solid #ddd;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">Deandra Notification</div>
                            <div class="content">
                                <p>Hello,</p>
                                <p>Your OTP is: <strong>${otp}</strong></p>
                                <p>Please use this OTP to complete your verification process.</p>
                            </div>
                            <div class="footer">
                                Best regards,<br>Deandra Team
                            </div>
                        </div>
                    </body>
                  </html>`
        };

        // Send email
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Mail Server error');
    }
};