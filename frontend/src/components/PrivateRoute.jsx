import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-4">Loading...</div>;

    return user && allowedRoles.includes(user.role) ? (
        <Outlet />
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;
