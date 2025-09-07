import pool from "../config/db.js";
import bcrypt from 'bcrypt';

//register super admin only once
export const registerSuperAdminSystemUserModel = async (pswd, employee_id) => {
  const [result] = await pool.query(
    "INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)",
    [pswd, "super_admin", "active", employee_id]
  );
  return result[0];
};

//register emplyoee
export const registerEmployeeModel = async (pswd, employee_id) => {
  const [result] = await pool.query(
    "INSERT INTO systemuser (password, role, status, employee_id) VALUES (?, ?, ?, ?)",
    [pswd, "employees", "active", employee_id]
  );
  return result[0];
};

// Get employees & system users by email or phone
export const getUserByUserEmailORPswdModel = async (credential) => {
    console.log(typeof (credential))
    const [result] = await pool.query(
        'SELECT id, password, user_role, email, refresh_token FROM employees WHERE email = ? OR phone = ?',
        [credential, parseInt(credential, 10) || 0]
        //[credential, credential]
    );
  console.log("User Found;;;;;;;;;;;;;;:", result[0]);
  if (result.length === 0) return null; // Prevent accessing undefined index

  return result[0];
};

export const getEmployeeByEmailModel = async (email) => {
  const [result] = await pool.query("select * from employees where email = ?", [
    email,
  ]);
  console.log(result[0]);
  return result[0];
};

//get employees by phone
export const getEmployeeByPhoneModel = async (phone) => {
    const [result] = await pool.query(
        'select * from employees where phone = ?',
        [phone]
    );

  return result[0];
}

//get system user by employeeId
export const getSystemUserByEmpIdModel = async (empId) => {
  const [result] = await pool.query(
    "select * from systemuser where employee_id = ?",
    [empId]
  );
  console.log(result[0]);
  return result[0];
};

//register employees
export const addEmployeeModel = async (name, phone, email, password) => {
  const hireDate = new Date().toISOString().split("T")[0];
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO employees (name, phone, email, hire_date, created_at, user_role, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, phone, email , hireDate, hireDate, 'employee', hashedPassword]
  );
  return result[0];
};

//update user role
export const updateUserRoleModel = async (userId, role) => {
    const [result] = await pool.query(
        'UPDATE systemuser SET role = ? WHERE user_id = ? AND status = ? ',
        [role, userId, 'active']
    );
    return result[0];
}

//check user is active ?
export const checkUserIsActive = async (userId) => {
  const [result] = await pool.query(
    "SELECT status FROM systemuser WHERE user_id = ?",
    [userId]
  );
  return result[0];
};

//get employees
export const getEmployeeModel = async () => {

    const [result] = await pool.query(
        'SELECT id, name, phone, email, DATE_FORMAT(bod, "%Y-%m-%d") AS bod, salary, service_charge_precentage, DATE_FORMAT(hire_date, "%Y-%m-%d") AS hire_date FROM employees'
    );
    return result;
}

//get employees by id
export const getEmployeeByuserIdModel = async (employee_id) => {
    const [result] = await pool.query(
        'SELECT id, name, phone, email, DATE_FORMAT(bod, "%Y-%m-%d") AS bod, salary, service_charge_precentage, DATE_FORMAT(hire_date, "%Y-%m-%d") AS hire_date FROM employees WHERE id = ?',
        [employee_id]
    );
    return result[0];
};

//update employees
export const updateEmployeesModel = async (employee_id, name, phone, email, bod, salary, service_charge_precentage, hire_date) => {
    const [result] = await pool.query(
        'UPDATE employees SET name = ?, phone = ?, email = ?, bod = ?, salary = ?, service_charge_precentage = ?, hire_date =?  WHERE employee_id = ?',
        [name, phone, email, bod, salary, service_charge_precentage, hire_date, employee_id]
    );
    return result[0];
};

//delete employees
export const deleteEmployeesModel = async (employee_id) => {
  const [result] = await pool.query(
    "DELETE FROM employees WHERE employee_id = ?",
    [employee_id]
  );
  return result[0];
};

//update employees(systemuser) status
export const updateEmployeesStatusModel = async (employee_id, status) => {
    const [result] = await pool.query(
        'UPDATE systemuser SET status = ? WHERE employee_id = ?',
        [status, employee_id]

    ); return result[0];
};

//get employees by status
export const getEmployeesByStatusModel = async (status) => {
    console.log(status);
    const [result] = await pool.query(

        'SELECT e.* FROM employees e JOIN systemuser su ON e.employee_id = su.employee_id WHERE su.status = ?',
        [status]
    );
    //console.log(result[0]);
    return result;
};

//get active employees
export const getActiveEmployeeModel = async () => {
  const [result] = await pool.query(
    `SELECT e.employee_id, e.name FROM employees e JOIN systemuser s ON e.employee_id = s.employee_id WHERE s.status = ?`,
    ['active']
  );
  return result;
}


export const updatePasswordByEmail = async (newPassword, email, table) => {
  console.log(newPassword, email, table);
  let result;
  if (table === "employees") {
    [result] = await pool.query(
      `UPDATE systemuser s 
             JOIN employees e ON e.employee_id = s.employee_id 
             SET s.password = ? 
             WHERE e.email = ?`,
      [newPassword, email]
    );
  } else if (table === "customers") {
    [result] = await pool.query(
      `UPDATE customers 
             SET pasword = ? 
             WHERE email = ?`,
      [newPassword, email]
    );
  }
  return result.affectedRows; // Returns the number of rows affected
};
