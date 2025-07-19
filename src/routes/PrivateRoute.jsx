import React, { use } from 'react';

import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../contexts/AuthContexts/AuthContext';

const PrivateRoute = ({children}) => {
    const {user,loading}= use(AuthContext);
    const location= useLocation();

    if(loading ){
        return <span className="loading loading-ring loading-lg"></span>
    }
    if(!user){
       return <Navigate to="/login" state={location.pathname}></Navigate>
    }
    return children;
};

export default PrivateRoute;