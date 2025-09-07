import api from './Api';
//import axios from 'axios';
// ...existing code...
 
 

export const getEmployees = async () => {
    const response = await api.get('/user/getEmployees');
    return response.data; 
}; 

//updateEmployee_link
export const updateEmployee = async (employeeId, data) => {
    const datat = { id:employeeId, name: data.name, phone:data.phone, email:data.email, bod:data.bod, salary:data.salary, service_charge_precentage:data.service_charge_precentage, hire_date:data.hire_date  };
    const response = await api.put("/user/updateEmployee/", datat);
     
    return response.data;
};

// Get employees by ID
export const getEmployeeById = async (employeeId) => {
    const response = await api.get(`/user/getEmployeeById/${employeeId}`);
    return response.data;
};

export const addEmployees = async (employeeData) => {
    const response = await api.post(`/user/addEmployee/`, employeeData);
    return response.data;
};

export const deleteEmployees = async (employeeId) => {
    const response = await api.delete(`/user/deleteEmployee/`, employeeId);
    return response.data;
};

export const updateEmployeesStatus = async (employee_Id, status) => {
    const data = { employee_Id, status };
    const response = await api.put("/user/updateStatus/",data);
    return response.data;
};

export const getEmployeesByStatus = async (status) => {
    const response = await api.get(`/user/getEmployeesByStatus/${status}`);
    return response.data;
};




export const serviceChargeService = {
    calculateCharges: async () => {
      try {
        const response = await api.post('/user/service-charges/calculate');
        return {
          success: true,
          message: response.data.message,
          affectedRows: response.data.affectedRows
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Calculation failed',
          error: error.message
        };
      }
    },
  
    getAllCharges: async () => {
      try {
        const response = await api.get('/user/service-charges');
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch charges',
          error: error.message
        };
      }
    },
        getEmployeeCharges: async (employeeId) => {
      try {
        const response = await api.get(`/user/service-charges/employees/${employeeId}`);
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0
        };
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to fetch charges',
          error: error.message
        };
      }
    }
  };

 
 
 // Deduction Service.......................
 

export const deductionService = {
  createDeduction: async (data) => {
    try {
      const response = await api.post('/user/deductions', {
        calculation_date: data.calculation_date,
        description: data.description,
        employee_id: data.employee_id,
        amount: data.amount
      });
      return {
        success: true,
        data: response.data,
        message: 'Deduction created successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create deduction',
        error: error.message
      };
    }
  },

  //updateDeduction.................
  updateDeduction: async (id, data) => {
    try {
      const response = await api.put(`/user/deduction-entries/${id}`, { // Correct endpoint
        calculation_date: data.calculation_date,
        description: data.description,
        employee_id: data.employee_id,
        amount: data.amount
      });
      return { success: true, data: response.data };
    } catch (error) {
      // ... existing code ...
    }
  },
  
  //getall........................
  getAllDeductionEntries: async () => {
    try {
      const response = await api.get('/user/deduction-entries');
      return {
        success: true,
        data: response.data.data || [],
        message: 'Deductions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch deductions',
        error: error.message
      };
    }
  },

 
deleteDeduction: async (id) => {
  try {
    const response = await api.delete(`/user/deduction-entries/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete deduction',
      error: error.message
    };
  }
},

  // Calculate monthly deduction
  calculateMonthlyDeduction: async (employeeId, monthYear) => {
    try {
      const response = await api.post('/user/monthly/calculate', {
        employee_id: employeeId,
        month_year: monthYear,
      });
      return {
        success: true,
        data: response.data,
        message: 'Monthly deduction calculated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to calculate monthly deduction',
        error: error.message,
      };
    }
  },

  // Save monthly deduction
  saveMonthlyDeduction: async (data) => {
    try {
      const response = await api.post('/user/monthly/save', {
        employee_id: data.employee_id,
        month_year: data.month_year,
        total_deduction: data.total_deduction,
      });
      return {
        success: true,
        data: response.data,
        message: 'Monthly deduction saved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to save monthly deduction',
        error: error.message,
      };
    }
  },
 
  calculateAndSaveMonthlyDeduction: async (employeeId, monthYear) => {
    try {
        const response = await api.post('/user/monthly/calculate', {
            employee_id: employeeId,
            month_year: monthYear,
        });
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to calculate and save monthly deduction',
            error: error.message,
        };
    }
},

//.......................

// In userServices.js
 
getMonthlyDeductionEntriesByEmployeeAndDate: async (employeeId, date) => {
  try {
    const response = await api.get(`/user/monthly/entries/${employeeId}/${date}`);
    return {
      success: true,
      data: response.data?.data || []  // Adjust based on your API response structure
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch monthly entries',
      data: []
    };
  } 

}
};

export const calculatePay = async (date) => {
    try {
        const response = await api.post('/user/calculate', { calculation_date: date });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to calculate payroll');
    }
};

export const getPayEntries = async (date) => {
    try {
        const response = await api.get(`/user/entries/${date}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to load pay entries');
    }
};
//huuuuuuuuuuuuuuuuuuuuuuuuuu
export const updatePayStatus = async (employeeId, date, status) => {
    const response = await api.put(`/user/entries/${employeeId}/${date}`, { status });
    console.log(response.data);
    return response.data;
};



// export const notifyEmployees = async (payData) => {
//   // Replace with your actual API call
//   const response = await fetch("/api/notify-employees", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ payData }),
//   });
//   if (!response.ok) throw new Error("Failed to notify employees");
//   return response.json();
// };


// export const notifyPayroll = async (date) => {
//   try {
//     const response = await api.post('/user/payroll/notify', { date });
//     return {
//       success: true,
//       data: response.data,
//       message: response.data.message || 'Notifications sent successfully'
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: error.response?.data?.error || 'Failed to send notifications',
//       error: error.message
//     };
//   }
// };

// ... (other imports and functions remain the same) ...

export const sendIdToEmp = async (data) => {
  try {
    const response = await api.post('/user/send-id-to-emp', data);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to send ID',
      error: error.message
    };
  }
};

// Notify employees about payroll
export const notifyPayroll = async (date) => {
  try {
    const response = await api.post('/user/payroll/notify', { date });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to notify payroll',
      error: error.message
    };
  }
};

// Notify single employees about payroll
export const notifyEmployeePayroll = async (date, employeeId) => {
  
  try {
    const response = await api.post('/user/payroll/notify-employees', { date, employeeId });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to notify employees',
      error: error.message
    };
  }
};


// Add this to your services
export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/user/payment-history');
    return {
      success: true,
      data: response.data.data || [],
      message: 'Payment history retrieved successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch payment history',
      error: error.message,
      data: []
    };
  }
};


export const getActiveEmployees = async () => {
  try {
    const response = await api.get('/user/getActiveEmployees');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch active employees',
      error: error.message,
      data: []
    };
  }
};