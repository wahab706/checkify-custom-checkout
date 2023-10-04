import React, { useState, useCallback, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
    Page, Card, Form, FormLayout, Button, Text, Stack, Modal, TextContainer, Toast, Icon
} from '@shopify/polaris';
import axios from "axios";
// import checkifyLogo from '../../assets/checkifyLogo.svg';
import checkifyLogo from '../../assets/republic_checkout.png'
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthDispatch } from '../../components/providers/AuthProvider'
import { InputField, ShowPassword, HidePassword, setAccessToken } from '../../components'



export function Login() {
    const navigate = useNavigate();
    const dispatch = useAuthDispatch();
    const { apiUrl, setLocationChange } = useContext(AppContext);
    const [hidePassword, setHidePassword] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    })


    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;


    const handleFormValue = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const clearFormValues = () => {
        setFormValues({
            email: '',
            password: '',
        })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true)

        let data = {
            email: formValues.email,
            password: formValues.password,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/login`, data)

            // console.log('Login response: ', response.data);
            setBtnLoading(false)
            if (!response.data.errors) {
                clearFormValues()
                setToastMsg(response.data.message)
                setSucessToast(true)
                setAccessToken(response.data.data.token)
                dispatch({
                    user: response.data.user,
                    userToken: response.data.data.token,
                    isNotifyBanner:response.data?.user?.isNotifyBanner==1
                });
                setLocationChange('/')

                if (response.data.user?.email_verified_at == null) {
                    navigate(`/sign-up-status?email=${response.data.user?.email}`)
                }
                else {
                    if (response.data.user?.shopifyConnected) {
                        setTimeout(() => {
                            navigate('/')
                        }, 1000);
                    }
                    else {
                        setTimeout(() => {
                            navigate('/admin/store-connect')
                        }, 1000);
                    }
                }

            }
            else {
                clearFormValues()
                setToastMsg(response.data.message)
                setErrorToast(true)
            }


        } catch (error) {
            console.warn('Login Api Error', error.response);
            setBtnLoading(false)
            setFormValues({ ...formValues, ['password']: '' })
            if (error.response?.data?.data?.error && error.response?.data?.data?.error == "Unauthorised") {
                setToastMsg('Your email or password is incorrect.')
                setErrorToast(true)
            }
            else if (error.response?.data?.data?.error) {
                setToastMsg(error.response?.data?.data?.error)
                setErrorToast(true)
            }
            else {
                setToastMsg('Server Error')
                setErrorToast(true)
            }

        }

    }


    return (
        <div className='Login-Page Login-Page-Centered'>

            <Page>
                <Card sectioned>
                    <div className='Logo-Container'>
                        <img src={checkifyLogo} alt="logo" />
                    </div>

                    <div>
                        <Text variant="headingLg" as="h6" fontWeight="semibold" alignment='center'>
                            Sign in to Checkout Republic
                        </Text>

                        <Form onSubmit={handleFormSubmit}>
                            <FormLayout>

                                <FormLayout.Group>
                                    <InputField
                                        value={formValues.email}
                                        name='email'
                                        onChange={handleFormValue}
                                        label="Email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder='Enter Email'
                                        required
                                    />
                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <div className='Icon-TextFiled'>
                                        <InputField
                                            value={formValues.password}
                                            name='password'
                                            onChange={handleFormValue}
                                            label="Password"
                                            type={hidePassword ? "password" : "text"}
                                            autoComplete="password"
                                            placeholder='Enter Password'
                                            required
                                        />
                                        <span onClick={() => setHidePassword(!hidePassword)} className='Icon-Section'>
                                            {hidePassword ?
                                                <Icon source={HidePassword} color="subdued" /> :
                                                <Icon source={ShowPassword} color="subdued" />
                                            }
                                        </span>
                                    </div>
                                </FormLayout.Group>

                                <div className='Form-Btns'>
                                    <Stack vertical>
                                        <Button
                                            submit
                                            primary
                                            loading={btnLoading}
                                        >
                                            Login
                                        </Button>
                                        <Link to='/reset-password'>Forgot the password?</Link>
                                    </Stack>
                                </div>


                                <div className='Form-Footer'>
                                    <p>
                                        {"Don't have an account? "}
                                        <Link to='/sign-up'>Sign up</Link>
                                    </p>
                                </div>


                            </FormLayout>
                        </Form>


                    </div>
                </Card>
                {toastErrorMsg}
                {toastSuccessMsg}
            </Page>
        </div>
    )
}
