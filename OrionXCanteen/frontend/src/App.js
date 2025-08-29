import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from "./components/Header";
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import SuperAdminDB from './pages/SuperAdminDB';
import { SubAdminDB } from './pages/SubAdminDB';
import EmployeeDB from './pages/EmployeeDB';
import { AuthProvider } from './context/Authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import Menus from './pages/Menus';
import SuperAdminHome from './pages/superAdmin/SuperAdminHome';
import EmployeeRegistration from './pages/EmployeeRegistration';
import CustomerRegistration from './pages/CustomerRegistration';


import ResetPassword from './pages/VerifyOtp';
import ForgotPswdSuccess from './pages/ForgotPswdSuccess';
import UpdatePassword from './pages/UpdatePassword';


import About from './pages/About';
import Contact from './pages/Contact';
import Service from './pages/Service';
import CustomerOrders from './pages/Customer/CustomerOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        {/* <main className=' px-20'> */}
        <main> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Menus" element={<ProtectedRoute name="customer"><Menus /></ProtectedRoute>} />
            <Route path="/superAdmin" element={<ProtectedRoute name="admin"><SuperAdminDB /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute name="employee"><EmployeeDB /></ProtectedRoute>} />
            <Route path="/superAdminHome" element={<ProtectedRoute name="customer"> <SuperAdminHome /> </ProtectedRoute>} />
            <Route path="/registration/register-employees" element={<EmployeeRegistration />} />
            <Route path="/registration/register-customers" element={<CustomerRegistration />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/forgot-password/success" element={<ForgotPswdSuccess />} />
            <Route path="/forgot-password/update" element={<UpdatePassword />} />
            <Route path="/order" element={<ProtectedRoute name="customer"><CustomerOrders /></ProtectedRoute>} />
            {/* Customer Event Planning */}


          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

