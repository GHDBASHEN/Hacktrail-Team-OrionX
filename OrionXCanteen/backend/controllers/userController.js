
dotenv.config();
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  addEmployeeModel,
  getEmployeeByEmailModel,
  getEmployeeByPhoneModel,
  getEmployeeModel,
  updateUserRoleModel,
  updateEmployeesModel,
  getEmployeeByuserIdModel,
  getEmployeesByStatusModel,
  deleteEmployeesModel,
  updateEmployeesStatusModel,
  getActiveEmployeeModel
} from "../models/userModel.js";

import {
  getCustomerByEmailModel,
  getCustomerByPhoneModel,
  addCustomerModel,
  getAllCustomersModel,
  updateCustomerModel,
  getCusName,
} from "../models/customerModel.js";


// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PSWD,
  },
});

// Send ID to employees
export const sendIdToEmp = async (req, res) => {
  const { name, subject, email, message } = req.body;

  try {
    const mailOptions = {
      from: `"Deandra" <${process.env.MAIL_ADDRESS}>`,
      to: email,
      subject,
      text: `Hello ${name},\n\n${message}`,
      html: `<p>Hello ${name},</p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      msg: 'Failed to send email',
      error: error.message 
    });
  }
};


//add employees (employees add to system by admin)
export const addEmployee = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const checkPhone = await getEmployeeByPhoneModel(phone);
    if (checkPhone)
      return res.status(400).json({ message: "Phone already exist..." });

    const checkEmail = await getEmployeeByEmailModel(email);
    if (checkEmail)
      return res.status(400).json({ message: "Email already exist..." });

    await addEmployeeModel(name, phone, email, password);

    res
      .status(201)
      .json({
        message: `User registered successfully for : ${email}`,
      });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// add new customers
export const addCustomer = async (req, res) => {
    const { name, contact, email, password } = req.body;
    try {
        const checkPhone = await getCustomerByPhoneModel(contact);
        if (checkPhone) return res.status(400).json({ message: 'Phone already exist...' });

        const checkEmail = await getCustomerByEmailModel(email);
        if (checkEmail) return res.status(400).json({ message: 'Email already exist...' });
      
        const customers = await addCustomerModel(name, email, contact, password);

        const user = await getCustomerByEmailModel(email);
        res.status(201).json({ message: `User registered successfully for this '${email}' email.` });

    } catch (error) {
        res.status(500).json({ msg: 'Server error...', error });
    }
}

// change user role
export const changeUserRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    const userStatus = await checkU4serIsActive(userId);
    if (userStatus && userStatus.status === "active") {
      await updateUserRoleModel(userId, role);
      res.status(200).json({ message: "User role updated successfully" });
    } else {
      res.status(400).json({ message: "User is not active or does not exist" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

//get employees data
export const getEmployee = async (req, res) => {
    try{
        const result = await getEmployeeModel();
        result.forEach(employees => console.log(employees.bod));
        res.status(201).json({ employees: result });
        
    }catch(error){
        res.status(500).json({ msg: 'Server error...', error });
    } 
}


// delete employees
export const deleteEmployees = async (req, res) => {
  const { employee_id } = req.body;
  try {
    const checkUserId = await getEmployeeByuserIdModel(employee_id);
    if (checkUserId.employee_id !== employee_id)
      return res.status(400).json({ message: "User ID does not exist" });

    await deleteEmployeesModel(employee_id);

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// update employees(systemuser) status
export const updateEmployeesStatus = async (req, res) => {
  const { employee_Id, status } = req.body;

  try {
    const checkUserId = await getEmployeeByuserIdModel(employee_Id);
    if (!checkUserId) {
      return res.status(400).json({ message: "User ID does not exist" });
    }

    await updateEmployeesStatusModel(employee_Id, status);

    res.status(200).json({ message: "Employee status updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// Get employees by ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const employees = await getEmployeeByuserIdModel(id);
    if (!employees)
      return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// update employees details
export const updateEmployees = async (req, res) => {
  const {
    id,
    name,
    phone,
    email,
    bod,
    salary,
    service_charge_precentage,
    hire_date,
  } = req.body;
  try {
    await updateEmployeesModel(
      id,
      name,
      phone,
      email,
      bod,
      salary,
      service_charge_precentage,
      hire_date
    );

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};

// Get employees by status
export const getEmployeesByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const employees = await getEmployeesByStatusModel(status);
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
};


export const GetCustomerName = async(req,res) =>{
  const { id } = req.params;

  console.log("sssssssid", id)
  try {
    const customer = await getCusName(id);
    res.status(200).json({ customer });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
}

//get active employees

export const getActiveEmployee = async(req,res) =>{
  const { status } = req.params;
  try {
    const employees = await getActiveEmployeeModel(status);
    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ msg: "Server error...", error });
  }
}


// Add new controller methods
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await getAllCustomersModel();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { name, email, phone, address, staus } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updateData = {
      name,
      email,
      phone,
      address: address || '',
      staus: staus || 'active'
    };

    const updatedCustomer = await updateCustomerModel(customerId, updateData);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update customers' });
  }
};


