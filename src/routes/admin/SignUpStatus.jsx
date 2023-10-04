import React, { useState, useEffect, useCallback, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
    Page, Layout, Card, Form, FormLayout, Checkbox, Button, Text, Stack, Icon, Modal, TextContainer, Toast,
} from '@shopify/polaris';
import checkifyLogo from '../../assets/checkifyLogo.svg';
import axios from "axios";
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthDispatch } from '../../components/providers/AuthProvider'
import { getAccessToken, ShowPassword, HidePassword, setAccessToken } from '../../components'


export function SignUpStatus() {
    const navigate = useNavigate();
    const { apiUrl } = useContext(AppContext);
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')
    const [email, setEmail] = useState('')
    const [time, setTime] = useState(0);




    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;



    const hanldeEmailConfirmation = async () => {
        setBtnDisabled(true)
        let data = {}
        try {
            const response = await axios.post(`${apiUrl}/api/email/verification-notification`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })
            // console.log('SignUp response: ', response.data);
            setToastMsg(response?.data.message)
            setSucessToast(true)
            setTime(60)
            setTimeout(() => {
                setBtnDisabled(false)
            }, 60000);


        } catch (error) {
            console.warn('SignUp Api Error', error);
            setBtnDisabled(false)
            if (error.response?.message) {
                setToastMsg(error.response?.message)
                setErrorToast(true)
            }
            else {
                setToastMsg('Server Error')
                setErrorToast(true)
            }
        }
    }

    useEffect(() => {
        let id = location.search.replace('?email=', '')
        setEmail(id)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime - 1);
        }, 1000);

        // Clear interval on unmount
        return () => clearInterval(interval);
    }, []);




    return (
        <div className='Login-Page SignUp-Status-Page '>
            <Page>

                <Layout>
                    <Card sectioned>
                        <div className='Form-Heading'>
                            <Text variant="headingLg" as="h6" fontWeight="semibold" alignment='center'>
                                Check your inbox to complete registration.
                            </Text>
                            <br />
                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued' alignment='center'>
                                {`A confirmation url is sent to your email.`}
                            </Text>
                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued' alignment='center'>
                                {`If you find our e-mail in "Spam" or "Promotion" tabs, please drag it to the "Primary tab".`}
                            </Text>
                        </div>

                        <Text variant="bodyMd" as="h6" fontWeight="semibold" alignment='center'>
                            {email}
                        </Text>

                        <div className='Form-Btns'>
                            <Stack>
                                <Button
                                    primary
                                    disabled={btnDisabled}
                                    onClick={hanldeEmailConfirmation}
                                >
                                    {btnDisabled ?
                                        time > 0 ?
                                            `Resend in ${time}` :
                                            'Resend Confirmation Link' :
                                        'Resend Confirmation Link'
                                    }
                                </Button>
                            </Stack>
                        </div>

                        <div className='Form-Footer '>
                            <p>
                                <Link to='/login'>Sign In</Link>
                            </p>
                            <p>
                                <Link to='/sign-up'>Sign Up</Link>
                            </p>
                        </div>


                    </Card>
                </Layout>

                {toastErrorMsg}
                {toastSuccessMsg}
            </Page>
        </div>
    )
}
