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
import Profile from './pages/Profile';
import SuperAdminHome from './pages/superAdmin/SuperAdminHome';
import EmployeeRegistration from './pages/EmployeeRegistration';
import CustomerRegistration from './pages/CustomerRegistration';
import CustomerEventPlanning from './pages/customers/CustomerEventPlanning';
import EventHome from './pages/customers/EventHome';
import DisplayEvents from './pages/customers/DisplayEvents';
import EventServiceForm from './components/events/EventServiceForm';


import ResetPassword from './pages/VerifyOtp';
import ForgotPswdSuccess from './pages/ForgotPswdSuccess';
import UpdatePassword from './pages/UpdatePassword';
import CustomerMenuListSelection from './components/CustomerMenuListSelection';
import CustomerMenuTypeSelection from './components/CustomerMenuTypeSelection';
import AdminMenuOrdersPage from './pages/superAdmin/AdminViewMenuOrders';
import AdminCorrectMenuSelections from './pages/superAdmin/AdminCorrectMenuSelections';
import CustomerMenuSummaryPage from './pages/customers/MenuSummaryReport';
import PopularMenuSelections from './components/PopularMenus';
import MenuCorrectionpage from './pages/superAdmin/MenuCorrection';


import About from './pages/About';
import Contact from './pages/Contact';
import Service from './pages/Service';

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
            <Route path="/profile" element={<ProtectedRoute name="customers"><Profile /></ProtectedRoute>} />
            <Route path="/eventHome/:bookingId/:customerID" element={<ProtectedRoute name="customers"><EventHome /></ProtectedRoute>} />
            <Route path="/superAdmin" element={<ProtectedRoute name="super_admin"><SuperAdminDB /></ProtectedRoute>} />
            <Route path="/subAdmin" element={<ProtectedRoute name="sub_admin"><SubAdminDB /></ProtectedRoute>} />
            <Route path="/employees" element={<ProtectedRoute name="employees"><EmployeeDB /></ProtectedRoute>} />
            <Route path="/superAdminHome" element={<ProtectedRoute name="customers"> <SuperAdminHome /> </ProtectedRoute>} />
            <Route path="/registration/register-employees" element={<EmployeeRegistration />} />
            <Route path="/registration/register-customers" element={<CustomerRegistration />} />
            <Route path="/forgot-password" element={<ResetPassword />} />
            <Route path="/forgot-password/success" element={<ForgotPswdSuccess />} />
            <Route path="/forgot-password/update" element={<UpdatePassword />} />

            <Route path="/event-services/create" element={<EventServiceForm />} />
            <Route path="/event-services/edit/:id" element={<EventServiceForm />} />

            <Route path="/menu-listtype/:menuListTypeId" element={<CustomerMenuListSelection />} />
            <Route path="/menu-types/:menuListTypeId" element={<CustomerMenuTypeSelection />} />
            
            <Route path="/admin-menu-orders" element={<AdminMenuOrdersPage />} />
            <Route path="/admin-correct-menu-selections" element={<AdminCorrectMenuSelections />} />
            <Route path="/menu-summary/:bookingId" element={<CustomerMenuSummaryPage />} />
            <Route path="/popular-menus" element={<PopularMenuSelections />} />
            <Route path="menu-correction" element={<MenuCorrectionpage/>}/>


            {/* Customer Event Planning */}
        

          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;

