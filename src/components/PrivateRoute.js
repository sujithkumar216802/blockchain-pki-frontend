import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ Component, isAuthenticated }) {
    console.log('PrivateRoute: isAuthenticated: ', isAuthenticated);
    console.log('PrivateRoute: component: ', Component);
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) return <Component />;
        return navigate('/login');
    });
}

export default PrivateRoute;
