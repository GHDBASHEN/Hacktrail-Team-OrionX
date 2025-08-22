import express from 'express';
import { superAdmin } from '../middleware/Super_admin.js';
import { subAdmin } from '../middleware/Sub_admin.js';
import { customers } from '../middleware/Customer.js';
import { 
    addEmployee, 
    changeUserRole, 
    addCustomer ,
    updateEmployees,
    deleteEmployees,
    getEmployee,
    updateEmployeesStatus,
    getEmployeesByStatus,
    getEmployeeById,
    getAllCustomers,
    updateCustomer,
    getActiveEmployee,
    GetCustomerName
} from '../controllers/userController.js';

const router = express.Router();

router.post('/addEmployee', addEmployee);
router.post('/addCustomer', addCustomer);



router.post('/changeUserRole', superAdmin, changeUserRole);
router.delete('/deleteEmployee',superAdmin,deleteEmployees);
router.put('/updateStatus', updateEmployeesStatus);
router.get('/getCusName/:id', GetCustomerName);

router.get('/getActiveEmployees',getActiveEmployee);
router.get('/getEmployeeById/:id', superAdmin,getEmployeeById); // New route to get employees by ID
router.get('/getEmployees', superAdmin,getEmployee);//chage get employees
router.put('/updateEmployee',superAdmin,updateEmployees);// same
router.get('/getEmployeesByStatus', superAdmin,getEmployeesByStatus);
router.get('/getEmployeesByStatus/:status',superAdmin, getEmployeesByStatus);

// Add new routes
router.get('/getAllCustomers', superAdmin, getAllCustomers);
router.put('/updateCustomer/:customerId', superAdmin, updateCustomer);

export default router;