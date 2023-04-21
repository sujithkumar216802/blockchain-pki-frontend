import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ Component }) {
    const isAuthenticated = window.ethereum !== undefined && window.ethereum.isMetaMask;
    console.log('PrivateRoute: isAuthenticated: ', isAuthenticated);
    console.log('PrivateRoute: component: ', Component);
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
    });
    if (isAuthenticated) return Component;
}

export default PrivateRoute;
