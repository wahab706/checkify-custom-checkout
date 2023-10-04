import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Button, Toast, Card, Icon, Tabs, Text, Form, FormLayout, Loading, ButtonGroup
} from '@shopify/polaris';
import TimezoneSelect from 'react-timezone-select'
import axios from "axios";
import { SkeltonTabsLayoutSecondary, InputField, ShowPassword, HidePassword, getAccessToken } from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'


export function Account() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { apiUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [toggleLoadProfile, setToggleLoadProfile] = useState(true)

    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')

    const [selectedTimezone, setSelectedTimezone] = useState(null)
    const [hidePassword, setHidePassword] = useState(true)
    const [passwordErrorMsg, setPasswordErrorMsg] = useState(null)
    const [accountInfo, setAccountInfo] = useState({
        fName: '',
        lName: '',
        email: '',
        fullName: '',
    })

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    const handleTimeZone = (timeZone) => {
        setSelectedTimezone(timeZone?.value)
    }

    function handleAutoDetectTimeZone() {
        setSelectedTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    }

    const handleAccountInfo = (e) => {
        setAccountInfo({ ...accountInfo, [e.target.name]: e.target.value })
    }

    const handlePassword = (e) => {
        setPasswordErrorMsg(null)
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const [storeActive, setStoreActive] = useState(true);
    const [modalStoreStatus, setModalStoreStatus] = useState(false)
    const [storeDetails, setStoreDetails] = useState({
        domainName: '',
        accessToken: '',
        publicKey: '',
        privateKey: '',
    })

    const handleStoreStatusModal = () => {
        setModalStoreStatus(!modalStoreStatus)
    }

    const handleStoreDetails = (e) => {
        setStoreDetails({ ...storeDetails, [e.target.name]: e.target.value })
    }


    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const tabs = [
        // {
        //     id: 'tab1',
        //     content: 'Billing',
        // },
        {
            id: 'tab2',
            content: 'Your Profile',
        },
    ];


    const handleTabChange = (selectedTabIndex) => {
        if (selectedTabIndex != selectedTab) {
            setSelectedTab(selectedTabIndex)
            setPassword({
                current: '',
                new: '',
                confirm: '',
            })
            setPasswordErrorMsg(null)
            setHidePassword(true)
        }

    }


    //============================Profile Tab============================

    const getProfileInfo = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/profile`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getProfileInfo Api response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                let user = response.data?.data
                setAccountInfo({
                    fName: user?.name,
                    lName: user?.last_name,
                    email: user?.email,
                    fullName: user?.full_name,
                })

                if (user?.custom_timezone) {
                    setSelectedTimezone(user?.custom_timezone)
                }
                else {
                    setSelectedTimezone(null)
                }

                setBtnLoading(false)
                setToggleLoadProfile(false)
                setLoading(false)
            }

        } catch (error) {
            console.warn('getProfileInfo Api Error', error.response);
            setBtnLoading(false)
            setLoading(false)
            if (error.response?.data?.message) {
                setToastMsg(error.response?.data?.message)
            }
            else {
                setToastMsg('Server Error')
            }
            setErrorToast(true)
        }

    }

    const updateProfileInfo = async (e) => {
        e.preventDefault();
        setBtnLoading((prev) => {
            let toggleId;
            if (prev['updateProfile']) {
                toggleId = { ['updateProfile']: false };
            } else {
                toggleId = { ['updateProfile']: true };
            }
            return { ...toggleId };
        });

        let data = {
            name: accountInfo.fName,
            last_name: accountInfo.lName,
            full_name: accountInfo.fullName,
            email: accountInfo.email,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/profile-update`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('updateProfileInfo Api response: ', response.data);
            setToastMsg('Account Updated Sucessfully')
            setSucessToast(true)
            setToggleLoadProfile(true)
            setBtnLoading(false)

        } catch (error) {
            console.warn('updateProfileInfo Api Error', error.response);
            setBtnLoading(false)

            if (error.response?.data?.errors && error.response?.data?.message?.message) {
                setToastMsg(error.response?.data?.message?.message)
            }
            else {
                setToastMsg('Server Error')
            }
            setErrorToast(true)
        }

    }

    const updatePassword = async (e) => {
        e.preventDefault();
        if (password.new?.length < 8) {
            setPasswordErrorMsg('Password must be 8 digits long')
        }

        else {
            if (password.new != password.confirm) {
                setPasswordErrorMsg('Password must match')
            }
            else {
                setBtnLoading((prev) => {
                    let toggleId;
                    if (prev['updatePassword']) {
                        toggleId = { ['updatePassword']: false };
                    } else {
                        toggleId = { ['updatePassword']: true };
                    }
                    return { ...toggleId };
                });

                let data = {
                    oldPassword: password.current,
                    password: password.new,
                    password_confirmation: password.confirm,
                }

                try {
                    const response = await axios.post(`${apiUrl}/api/password-update`, data, {
                        headers: { "Authorization": `Bearer ${getAccessToken()}` }
                    })

                    // console.log('updatePassword Api response: ', response.data);
                    setToastMsg('Password Changed')
                    setPassword({
                        current: '',
                        new: '',
                        confirm: '',
                    })
                    setSucessToast(true)
                    setBtnLoading(false)

                } catch (error) {
                    console.warn('updatePassword Api Error', error.response);
                    setBtnLoading(false)
                    if (error.response?.data?.errors && error.response?.data?.message?.message) {
                        setToastMsg(error.response?.data?.message?.message)
                    }
                    else {
                        setToastMsg('Server Error')
                    }
                    setErrorToast(true)

                }
            }
        }

    }

    const changeTimeZone = async () => {
        if (selectedTimezone == {} || selectedTimezone == [] || selectedTimezone == null || selectedTimezone == '') {
            setToastMsg('Select TimeZone')
            setErrorToast(true)
        }
        else {
            setBtnLoading((prev) => {
                let toggleId;
                if (prev['timeZone']) {
                    toggleId = { ['timeZone']: false };
                } else {
                    toggleId = { ['timeZone']: true };
                }
                return { ...toggleId };
            });

            let data = {
                type: 'setTimeZone',
                custom_timezone: selectedTimezone,
            }


            try {
                const response = await axios.post(`${apiUrl}/api/store/minor`, data, {
                    headers: { "Authorization": `Bearer ${getAccessToken()}` }
                })

                // console.log('changeTimeZone Api response: ', response.data);

                setBtnLoading(false)
                setToastMsg(response.data?.data && response.data?.data)
                setSucessToast(true)

            } catch (error) {
                console.warn('changeTimeZone Api Error', error.response);
                setBtnLoading(false)
                if (error.response?.data?.errors && error.response?.data?.message?.message) {
                    setToastMsg(error.response?.data?.message?.message)
                }
                else {
                    setToastMsg('Server Error')
                }
                setErrorToast(true)
            }
        }
    }

    useEffect(() => {
        if (toggleLoadProfile) {
            getProfileInfo()
        }
    }, [toggleLoadProfile])




    return (
        <div className='Customization-Page'>

            <Page
                fullWidth
                title="Account & Billing"
            >
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    {loading ?
                        <span>
                            <Loading />
                            <SkeltonTabsLayoutSecondary />
                        </span> :
                        <>
                            {(() => {
                                switch (selectedTab) {
                                    case 0:
                                        return (
                                            <div className='Profile-Tab'>
                                                <Layout>
                                                    <Layout.Section secondary>
                                                        <Text variant="headingMd" as="h6">
                                                            Account Information
                                                        </Text>
                                                        <Text variant="bodyMd" as="p">
                                                            Your name will be used to personalize our emails and answers from support agents.
                                                        </Text>
                                                        <Text variant="bodyMd" as="p">
                                                            If you change your email address, we will automatically send a confirmation link.
                                                        </Text>
                                                    </Layout.Section>

                                                    <Layout.Section>
                                                        <Card sectioned>
                                                            <InputField
                                                                type="text"
                                                                label="First Name"
                                                                name='fName'
                                                                value={accountInfo.fName}
                                                                onChange={handleAccountInfo}
                                                                autoComplete="off"
                                                                placeholder='Enter First Name'
                                                            />
                                                            <InputField
                                                                marginTop
                                                                type="text"
                                                                label="Last Name"
                                                                name='lName'
                                                                value={accountInfo.lName}
                                                                onChange={handleAccountInfo}
                                                                autoComplete="off"
                                                                placeholder='Enter Last Name'
                                                            />
                                                            <InputField
                                                                marginTop
                                                                type="email"
                                                                label="Email Address"
                                                                name='email'
                                                                value={accountInfo.email}
                                                                onChange={handleAccountInfo}
                                                                autoComplete="off"
                                                                placeholder='Enter Email Address'
                                                            />
                                                            <InputField
                                                                marginTop
                                                                type="text"
                                                                label="Your Full Name Or Business Name (Optional For Invoices)"
                                                                name='fullName'
                                                                value={accountInfo.fullName}
                                                                onChange={handleAccountInfo}
                                                                autoComplete="off"
                                                                placeholder='Enter Full Name or Business Name'
                                                            />
                                                            <br />
                                                            <Button
                                                                submit
                                                                primary
                                                                onClick={updateProfileInfo}
                                                                loading={btnLoading['updateProfile']}
                                                            >
                                                                Save Changes
                                                            </Button>

                                                        </Card>
                                                    </Layout.Section>
                                                </Layout>

                                                <Layout>
                                                    <Layout.Section secondary>
                                                        <Text variant="headingMd" as="h6">
                                                            Password
                                                        </Text>
                                                        <Text variant="bodyMd" as="p">
                                                            To help keep your account secure, we recommend creating a strong password that you don't reuse on other websites.
                                                        </Text>
                                                    </Layout.Section>

                                                    <Layout.Section>
                                                        <Card sectioned>
                                                            <Form onSubmit={updatePassword}>
                                                                <FormLayout>
                                                                    <div className='Icon-TextFiled'>
                                                                        <InputField
                                                                            type={hidePassword ? "password" : "text"}
                                                                            label="Current Password"
                                                                            name='current'
                                                                            value={password.current}
                                                                            onChange={handlePassword}
                                                                            required
                                                                        />
                                                                        <span onClick={() => setHidePassword(!hidePassword)} className='Icon-Section'>
                                                                            {hidePassword ?
                                                                                <Icon source={HidePassword} color="subdued" /> :
                                                                                <Icon source={ShowPassword} color="subdued" />
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <InputField
                                                                        type="text"
                                                                        label="New Password"
                                                                        name='new'
                                                                        value={password.new}
                                                                        onChange={handlePassword}
                                                                        autoComplete="off"
                                                                        required
                                                                        error={passwordErrorMsg}
                                                                    />
                                                                    <InputField
                                                                        type="text"
                                                                        label="Confirm Password"
                                                                        name='confirm'
                                                                        value={password.confirm}
                                                                        onChange={handlePassword}
                                                                        autoComplete="off"
                                                                        required
                                                                        error={passwordErrorMsg}
                                                                    />

                                                                    <Button primary submit loading={btnLoading['updatePassword']}>Change Password</Button>
                                                                </FormLayout>
                                                            </Form>
                                                        </Card>
                                                    </Layout.Section>
                                                </Layout>

                                                <Layout>
                                                    <Layout.Section secondary>
                                                        <Text variant="headingMd" as="h6">
                                                            Timezone
                                                        </Text>
                                                        <Text variant="bodyMd" as="p">
                                                            Set timezone so you can plan marketing activities according to your customers' daily schedule.
                                                            If you are selling on a foreign market, you should select timezone of your customers.
                                                        </Text>
                                                    </Layout.Section>

                                                    <Layout.Section>
                                                        <Card sectioned>
                                                            <div className='TimeZone-Section'>
                                                                <Text variant="bodyMd" as="p">
                                                                    Your Timezone
                                                                </Text>
                                                                <TimezoneSelect
                                                                    value={selectedTimezone}
                                                                    onChange={(timeZone) => handleTimeZone(timeZone)}
                                                                />

                                                                <ButtonGroup>
                                                                    <Button
                                                                        primary
                                                                        loading={btnLoading['timeZone']}
                                                                        onClick={changeTimeZone}
                                                                    >
                                                                        Save TimeZone
                                                                    </Button>

                                                                    <Button
                                                                        disabled={btnLoading['timeZone']}
                                                                        onClick={handleAutoDetectTimeZone}
                                                                    >
                                                                        AutoDetect
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </div>
                                                        </Card>
                                                    </Layout.Section>
                                                </Layout>
                                            </div>
                                        )

                                    default:
                                        break
                                }

                            })()}
                        </>
                    }
                </Tabs>
            </Page>

            {toastErrorMsg}
            {toastSuccessMsg}
        </div>
    )
}


