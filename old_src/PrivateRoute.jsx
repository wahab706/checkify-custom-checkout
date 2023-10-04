import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "./components/providers/AuthProvider";
import { Loader, getAccessToken } from './components'

function PrivateRoute({ component: Component, ...rest }) {
    const { user } = useAuthState();
    const [isStoreConnected, setIsStoreConnected] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            // setIsStoreConnected(true)
            setLoading(false)
        }, 1000);
    }, [])


    return (
        <>
            {loading ? <Loader /> :
                isStoreConnected ? <Outlet /> : <Navigate to="/admin/store-connect" />
            }
        </>
    );
}

export default PrivateRoute;
