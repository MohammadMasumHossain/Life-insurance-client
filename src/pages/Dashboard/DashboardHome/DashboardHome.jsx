import React from 'react';
import useUserRole from '../../../hooks/useUserRole';
import CustomerDashboard from './CustomerDashboard'
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './AdminDashboard';
import Forbidden from '../../Forbideen/Forbideen';





const DashboardHome = () => {
    const { role, roleLoading } = useUserRole();

    if (roleLoading) {
        return <div> <span className="loading loading-spinner loading-xl"></span></div>
    }

    if(role === 'customer'){
        return <CustomerDashboard></CustomerDashboard>
    }
    else if(role === 'agent'){
        return <AgentDashboard></AgentDashboard>
    }
    else if(role ==='admin'){
        return <AdminDashboard></AdminDashboard>
    }
    else {
        return <Forbidden></Forbidden>
    }

};

export default DashboardHome;