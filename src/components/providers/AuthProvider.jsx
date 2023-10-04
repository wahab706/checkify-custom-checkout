import React, { useState, useEffect, useContext, createContext, useReducer, useCallback } from 'react';
import { useNavigate, Navigate, useLocation, Route } from "react-router-dom";
import { Toast, Frame, Button, } from '@shopify/polaris';
import { Loader, getAccessToken } from '../../components'
import axios from "axios";
import getUser from "./UserApi";


const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

function reducer(currentState, newState) {
    return { ...currentState, ...newState };
}

function useAuthState() {
    const context = useContext(AuthStateContext);
    if (!context) throw new Error("useAuthState must be used in AuthProvider");

    return context;
}

function useAuthDispatch() {
    const context = useContext(AuthDispatchContext);
    if (!context) throw new Error("useAuthDispatch must be used in AuthProvider");

    return context;
}

const initialState = {
    user: null,
    userToken: '',
    isNotifyBanner:false
};

function AuthProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true)

    const [errorToast, setErrorToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} duration={300000} />
    ) : null;

    const handleReloadPage = () => {
        window.location.reload(true);
    }

    const ErrorPage = () => {
        return (
            <>
                <p>Something went wrong, please {''}
                    <a onClick={handleReloadPage} className='href-css-underline href-css-pointer'>reload</a>
                    {''} the page</p>
            </>
        )
    }


    const AuthCheck = async () => {

        try {
            const response = await axios.get(`${props.apiUrl}/api/store/check`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('AuthCheck response: ', response?.data);

            if (response.data.errors) {
                alert(response.data.message)
            }
            else {
                if (response.data.user?.email_verified_at == null) {
                    navigate(`/sign-up-status?email=${response.data.user?.email}`)
                }
                else {
                    dispatch({
                        user: response.data.user,
                        isNotifyBanner:response.data?.user?.isNotifyBanner==1
                    });

                    if (location.pathname == '/login' || location.pathname == '/sign-up'
                        || location.pathname == '/sign-up-status' || location.pathname == '/reset-password'
                        | location.pathname == '/change-passwords' || location.pathname == '/admin/store-connect'
                    ) {
                        navigate('/')
                    }
                }
                setLoading(false)
            }

        } catch (error) {
            console.warn('AuthCheck Api Error', error.response?.data);
            if (location.pathname == '/sign-up') {
                setLoading(false)
                navigate('/sign-up')
            }
            else if (location.pathname == '/reset-password') {
                setLoading(false)
                navigate('/reset-password')
            }
            else if (location.pathname == '/change-password') {
                setLoading(false)
                navigate(`/change-password${location.search}`)
            }
            else {
                if (error.response?.status == 401) {
                    setLoading(false)
                    navigate('/login')
                }
                else if (error.response?.status == 403) {
                    setLoading(false)
                    navigate(`/sign-up-status?email=${error.response?.data?.data?.user?.email}`)
                }
                else if (error.response?.status == 402) {
                    setLoading(false)
                    navigate('/admin/store-connect')
                }
                else {
                    if (error.response?.data?.message) {
                        setToastMsg(error.response?.data?.message)
                    }
                    else {
                        setToastMsg(<ErrorPage />)
                    }
                    setErrorToast(true)
                }
            }
        }
    }

    useEffect(() => {
        // if (location.pathname == '/login' || location.pathname == '/checkout' || location.pathname == '/thank-you-page' ||
        //     location.pathname == '/sign-up' || location.pathname == '/reset-password') {
        //     setLoading(false)
        // }
        if (location.pathname == '/checkout' || location.pathname == '/thank-you-page'
            || location.pathname == '/preview/checkout' || location.pathname == '/preview/thank-you-page') {
            setLoading(false)
        }
        else {
            AuthCheck()
        }
    }, [])


    return (
        <Frame>
            {loading ? <Loader /> :
                <AuthStateContext.Provider value={state}>
                    <AuthDispatchContext.Provider value={dispatch}>
                        {props.children}
                    </AuthDispatchContext.Provider>
                </AuthStateContext.Provider>
            }
            {toastErrorMsg}
        </Frame>
    );
}


export { AuthProvider, useAuthState, useAuthDispatch };

