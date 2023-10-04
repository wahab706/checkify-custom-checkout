import React, { useState, useCallback, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {
  Page, Layout, Card, Form, FormLayout, Checkbox, Button, Text, Stack, Icon, Modal, TextContainer, Toast,
} from '@shopify/polaris';
import checkifyLogo from '../../assets/checkifyLogo.svg';
import axios from "axios";
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthDispatch } from '../../components/providers/AuthProvider'
import { InputField, CheckBox, ShowPassword, HidePassword, setAccessToken } from '../../components'


export function SignUp() {
  const navigate = useNavigate();
  const { apiUrl } = useContext(AppContext);
  const [accepted, setAccepted] = useState(false);
  const [hidePassword, setHidePassword] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('')
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('')


  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cPassword: '',
  })

  const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  const handleAcceptedChange = useCallback(
    (value) => setAccepted(value),
    [],
  );

  const clearFormValues = () => {
    setFormValues({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      cPassword: '',
    })
  }

  const handleFormValue = (e) => {
    setPasswordErrorMsg('')
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formValues.password.length < 8) {
      setPasswordErrorMsg('Password must be 8 digits long')
    }

    else {
      if (formValues.password != formValues.cPassword) {
        setPasswordErrorMsg('Password must match')
      }
      else {
        setBtnLoading(true)
        let data = {
          name: formValues.firstName,
          last_name: formValues.lastName,
          email: formValues.email,
          password: formValues.password,
          c_password: formValues.cPassword,
        }

        try {
          const response = await axios.post(`${apiUrl}/api/register`, data)
          // console.log('SignUp response: ', response.data);
          setBtnLoading(false)
          if (!response.data.errors) {
            setAccessToken(response.data.data.token)
            clearFormValues()
            setToastMsg(response.data.message)
            setSucessToast(true)

            setTimeout(() => {
              navigate(`/sign-up-status?email=${formValues.email}`)
            }, 1000);

          }
          else {
            setToastMsg(response.data.message)
            setErrorToast(true)
            setFormValues({ ...formValues, ['password']: '', ['cPassword']: '', ['email']: '' })
          }

        } catch (error) {
          console.warn('SignUp Api Error', error);
          setBtnLoading(false)
          if (error.response.data.data?.email) {
            setToastMsg('Email already in use, plaese use another one')
          }
          else {
            if (error.response?.data?.message) {
              setToastMsg(error.response?.data?.message)
            }
            else {
              setToastMsg('Server Error')
            }
          }
          setErrorToast(true)
          setFormValues({ ...formValues, ['password']: '', ['cPassword']: '' })
        }
      }
    }
  }


  return (
    <div className='Login-Page SignUp-Page Login-Page-Centered'>
      <Page>

        <Layout>
          <Card sectioned>
            <div className='Logo-Container'>
              <img src={checkifyLogo} alt="logo" />
            </div>

            <div className='Form-Heading'>
              <Text variant="headingLg" as="h6" fontWeight="semibold" alignment='center'>
                Sign up to Checkify
              </Text>
            </div>

            <Form onSubmit={handleFormSubmit}>
              <FormLayout>
                <FormLayout.Group>
                  <InputField
                    value={formValues.firstName}
                    name='firstName'
                    onChange={handleFormValue}
                    label="First Name"
                    type="text"
                    autoComplete="given-name"
                    placeholder='Enter First Name'
                    required
                  />

                  <InputField
                    value={formValues.lastName}
                    name='lastName'
                    onChange={handleFormValue}
                    label="Last Name"
                    placeholder='Enter Last Name'
                    type="text"
                    autoComplete="family-name"
                    required
                  />
                </FormLayout.Group>

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
                      error={passwordErrorMsg}
                    />
                    <span onClick={() => setHidePassword(!hidePassword)} className='Icon-Section'>
                      {hidePassword ?
                        <Icon source={HidePassword} color="subdued" /> :
                        <Icon source={ShowPassword} color="subdued" />
                      }
                    </span>
                  </div>
                </FormLayout.Group>

                <FormLayout.Group>
                  <div className='Icon-TextFiled'>
                    <InputField
                      value={formValues.cPassword}
                      name='cPassword'
                      onChange={handleFormValue}
                      label="Confirm Password"
                      type={hidePassword ? "password" : "text"}
                      autoComplete="password"
                      placeholder='Enter Confirm Password'
                      required
                      error={passwordErrorMsg}
                    />
                    <span onClick={() => setHidePassword(!hidePassword)} className='Icon-Section'>
                      {hidePassword ?
                        <Icon source={HidePassword} color="subdued" /> :
                        <Icon source={ShowPassword} color="subdued" />
                      }
                    </span>
                  </div>
                </FormLayout.Group>

                <FormLayout.Group>
                  <CheckBox
                    label={
                      <span className='Form-Terms'>
                        {'By signing up, I accept the '}
                        <a href="https://checkify.pro/en/terms-of-use" target="_blank" rel="noopener noreferrer">Terms of Service </a>
                        {' and the '}
                        <a href="https://checkify.pro/en/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                      </span>
                    }
                    required
                    checked={accepted}
                    onChange={handleAcceptedChange}
                  />
                </FormLayout.Group>


                <div className='Form-Btns'>
                  <Stack>
                    <Button
                      submit
                      primary
                      loading={btnLoading}
                      disabled={!accepted}
                    >
                      SignUp
                    </Button>
                  </Stack>
                </div>

                <div className='Form-Footer '>
                  <p>
                    {"Already have an account? "}
                    <Link to='/login'>Sign in</Link>
                  </p>
                </div>
              </FormLayout>
            </Form>

          </Card>
        </Layout>

        {toastErrorMsg}
        {toastSuccessMsg}
      </Page>
    </div>
  )
}
