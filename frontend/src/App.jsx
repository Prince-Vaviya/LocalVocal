import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceDetails from './pages/ServiceDetails';
import BookingList from './pages/BookingList';
import CustomerProfileLayout from './pages/CustomerProfileLayout';
import Chat from './pages/Chat';
import ProviderLayout from './pages/ProviderLayout';
import ProviderServices from './pages/ProviderServices';
import ProviderBookings from './pages/ProviderBookings';
import ProviderHistory from './pages/ProviderHistory';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProviders from './pages/AdminProviders';
import AdminReports from './pages/AdminReports';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service/:id" element={<ServiceDetails />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['customer', 'provider', 'admin']} />}>
          <Route path="/profile" element={<CustomerProfileLayout />}>
            <Route index element={<Navigate to="bookings" replace />} />
            <Route path="bookings" element={<BookingList />} />
          </Route>
          {/* Redirect old bookings route if needed or just keep above for simplicity */}
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
        </Route>
        {/* Provider Routes */}
        <Route element={<PrivateRoute allowedRoles={['provider', 'admin']} />}>
          <Route path="/provider" element={<ProviderLayout />}>
            <Route index element={<Navigate to="services" replace />} />
            <Route path="services" element={<ProviderServices />} />
            <Route path="bookings" element={<ProviderBookings />} />
            <Route path="history" element={<ProviderHistory />} />
          </Route>
          <Route path="/provider-dashboard" element={<Navigate to="/provider/services" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="providers" element={<AdminProviders />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
