import React, { useState, useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Page, Card, Form, FormLayout, Button, Toast, Banner, List,
} from '@shopify/polaris';
import axios from "axios";
import { AppContext } from '../../components/providers/ContextProvider'
import { InputField, getAccessToken } from '../../components'

export function StoreConnect() {
  const navigate = useNavigate();
  const { apiUrl } = useContext(AppContext);
  const [btnLoading, setBtnLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('')

  const [formValues, setFormValues] = useState({
    domainName: '',
    accessToken: '',
    publicKey: '',
    privateKey: '',
  })

  const handleFormValue = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true)

    let data = {
      shopifyShopDomainName: formValues.domainName,
      shopifyAccessToken: formValues.accessToken,
      shopifyApiPublicKey: formValues.publicKey,
      shopifyApiSecretKey: formValues.privateKey,
    }

    try {
      const response = await axios.post(`${apiUrl}/api/store`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('Store Connect Api response: ', response.data);
      setBtnLoading(false)
      navigate('/')

    } catch (error) {
      console.warn('Store Connect Api Error', error.response);
      setBtnLoading(false)
      if (error.response?.status == 401 && error.response?.data?.message == 'Unauthorized') {
        setToastMsg('Session Expire, Please Login Again')
        setErrorToast(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000);
      }
      else if (error.response?.status == 409) {
        setToastMsg('This shopify domain name has already been used.')
        setErrorToast(true)
      }
      else if (error.response?.status == 500) {
        setToastMsg('Shopify host not found! Try Again')
        setErrorToast(true)
      }
      else {
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message)
        }
        else {
          setToastMsg('Server Error')
        }
        setErrorToast(true)
      }
    }
  }

  return (
    <div className='Login-Page Store-Connect-page'>
      <Page
        fullWidth
        title='Add your store'
      >
        <Banner
          title="To connect your Shopify store, please provide your myshopify domain."
          status="warning"
        >
          <List>
            <List.Item>
              Checkify does not support other eCom platforms yet.
            </List.Item>
          </List>
        </Banner>

        <div className='Store-Form'>
          <Card sectioned>
            <Form onSubmit={handleFormSubmit}>
              <FormLayout>

                <FormLayout.Group>
                  <InputField
                    value={formValues.domainName}
                    name='domainName'
                    onChange={handleFormValue}
                    label="Domain Name"
                    type="text"
                    // suffix='.myshopify.com'
                    placeholder="e.g.  test.myshopify.com"
                    // helpText="Domain Name can't be changed"
                    required
                  />

                  <InputField
                    value={formValues.accessToken}
                    name='accessToken'
                    onChange={handleFormValue}
                    label="Api Access Token"
                    type="text"
                    placeholder='Enter Admin Api Access Token'
                    required
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <InputField
                    value={formValues.publicKey}
                    name='publicKey'
                    onChange={handleFormValue}
                    label="Api Public Key"
                    type="text"
                    placeholder='Enter Api Public Key'
                    required
                  />

                  <InputField
                    value={formValues.privateKey}
                    name='privateKey'
                    onChange={handleFormValue}
                    label="Api Private Key"
                    type="text"
                    placeholder='Enter Api Private Key'
                    required
                  />
                </FormLayout.Group>

                <div className='Form-Btns'>
                  <Button
                    submit
                    primary
                    loading={btnLoading}
                  >
                    Connect Store
                  </Button>
                </div>

              </FormLayout>
            </Form>

          </Card>
        </div>
        {toastErrorMsg}
      </Page>
    </div>
  )
}
