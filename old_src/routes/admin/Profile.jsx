import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Button, Toast, Card, Icon, Tabs, Text, Form, FormLayout,
    Stack, Modal, TextContainer, Loading, ButtonGroup
} from '@shopify/polaris';
import { PromoteMinor } from '@shopify/polaris-icons';
import TimezoneSelect from 'react-timezone-select'
import axios from "axios";
import { SkeltonTabsLayoutSecondary, InputField, ShowPassword, HidePassword, getAccessToken } from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import clipBoard from '../../assets/icons/clipBoard.svg'
import FillCheckBox from '../../assets/icons/FillCheckBox.png'

const scopes = [
    {
        id: 'read_products',
        title: 'Products',
        desc: null,
        firstScope: 'read_products',
        secondScope: 'write_products',
    },
    {
        id: 'read_customers',
        title: 'Customers',
        desc: 'sometimes called Clients',
        firstScope: 'read_customers',
        secondScope: 'write_customers',
    },
    {
        id: 'read_discounts',
        title: 'Discounts',
        desc: null,
        firstScope: 'read_discounts',
        secondScope: 'write_discounts',
    },
    {
        id: 'read_fulfillments',
        title: 'Fulfillment services',
        desc: 'sometimes called Order Processing Service',
        firstScope: 'read_fulfillments',
        secondScope: null,
    },
    {
        id: 'read_gdpr_data_request',
        title: 'GDPR data requests',
        desc: null,
        firstScope: 'read_gdpr_data_request',
        secondScope: null,
    },
    {
        id: 'read_gift_cards',
        title: 'Gift cards',
        desc: null,
        firstScope: 'read_gift_cards',
        secondScope: null,
    },
    {
        id: 'read_inventory',
        title: 'Inventory',
        desc: null,
        firstScope: 'read_inventory',
        secondScope: 'write_inventory',
    },
    {
        id: 'read_order_edits',
        title: 'Order editing',
        desc: 'sometimes called Editing Order',
        firstScope: 'read_order_edits',
        secondScope: 'write_order_edits',
    },
    {
        id: 'read_orders',
        title: 'Orders',
        desc: null,
        firstScope: 'read_orders',
        secondScope: 'write_orders',
    },
    {
        id: 'read_price_rules',
        title: 'Price rules',
        desc: 'sometimes called Pricing rules',
        firstScope: 'read_price_rules',
        secondScope: 'write_price_rules',
    },
    {
        id: 'read_product_listings',
        title: 'Product listings',
        desc: 'sometimes called Product Pages',
        firstScope: 'read_product_listings',
        secondScope: null,
    },
    {
        id: 'read_script_tags',
        title: 'Script tags',
        desc: 'sometimes called Script Tag',
        firstScope: 'read_script_tags',
        secondScope: 'write_script_tags',
    },
    {
        id: 'read_shipping',
        title: 'Shipping',
        desc: null,
        firstScope: 'read_shipping',
        secondScope: null,
    },
    {
        id: 'read_themes',
        title: 'Themes',
        desc: null,
        firstScope: 'read_themes',
        secondScope: 'write_themes',
    },

]


export function Profile() {
    const [selectedTab, setSelectedTab] = useState(0);
    const { apiUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [toggleLoadProfile, setToggleLoadProfile] = useState(true)

    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')

    const [selectedTimezone, setSelectedTimezone] = useState({})
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
        {
            id: 'tab3',
            content: 'Store',
        },
    ];


    const handleTabChange = (selectedTabIndex) => {
        if (selectedTabIndex != selectedTab) {
            setSelectedTab(selectedTabIndex)
            setStoreDetails({
                ...storeDetails,
                accessToken: '',
                publicKey: '',
                privateKey: '',
            })
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
                setStoreDetails({
                    ...storeDetails,
                    domainName: user?.shopifyShopDomainName,
                })

                if (user?.enabled_shopify == 0) {
                    setStoreActive(false)
                }
                if (user?.custom_timezone) {
                    setSelectedTimezone(user?.custom_timezone)
                }
                else {
                    setSelectedTimezone({})
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


    //============================Store Tab============================

    function copyTextToClipboard(id) {
        var textArea = document.createElement("textarea");

        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = 0;
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = id;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successfully' : 'unsuccessful';
            document.getElementById(id).style.display = 'block';

            setTimeout(() => {
                document.getElementById(id).style.display = 'none';
            }, 1500);



        } catch (err) {
            alert('unable to copy');
        }

        document.body.removeChild(textArea);
    }

    const changeStoreDetails = async (e) => {
        e.preventDefault();
        setBtnLoading((prev) => {
            let toggleId;
            if (prev['store']) {
                toggleId = { ['store']: false };
            } else {
                toggleId = { ['store']: true };
            }
            return { ...toggleId };
        });

        let data = {
            shopifyAccessToken: storeDetails.accessToken,
            shopifyApiPublicKey: storeDetails.publicKey,
            shopifyApiSecretKey: storeDetails.privateKey,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/store/update`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('Store Connect Api response: ', response.data);
            setBtnLoading(false)

        } catch (error) {
            console.warn('Store Connect Api Error', error.response);
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

    const changeStoreStatus = async () => {
        setBtnLoading((prev) => {
            let toggleId;
            if (prev['storeStatus']) {
                toggleId = { ['storeStatus']: false };
            } else {
                toggleId = { ['storeStatus']: true };
            }
            return { ...toggleId };
        });
        let enableValue = '';

        if (storeActive == true) {
            enableValue = 0;
        }
        else {
            enableValue = 1;
        }
        let data = {
            type: 'enableSettings',
            enabled_shopify: enableValue,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/store/minor`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('Store Connect Api response: ', response.data);

            if (storeActive) {
                setStoreActive(false)
            }
            else {
                setStoreActive(true)
            }
            setBtnLoading(false)
            setModalStoreStatus(false)
            setToastMsg(response.data?.data && response.data?.data)
            setSucessToast(true)

        } catch (error) {
            console.warn('Store Connect Api Error', error.response);
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



    return (
        <div className='Customization-Page'>

            <Modal
                small
                open={modalStoreStatus}
                onClose={handleStoreStatusModal}
                title="Pause Checkify checkout?"
                loading={btnLoading['storeStatus']}
                primaryAction={{
                    content: 'Pause Checkout',
                    destructive: true,
                    disabled: btnLoading['storeStatus'],
                    onAction: changeStoreStatus,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        disabled: btnLoading['storeStatus'],
                        onAction: handleStoreStatusModal,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        <Text variant="bodyMd" as="p" color='subdued'>
                            Temporarily roll back to the default Shopify checkout without paying for the next period.
                            Please note that payment for the current billing period (week) is not refundable.
                        </Text>
                    </TextContainer>
                </Modal.Section>
            </Modal>

            <Page
                fullWidth
                title="Account"
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
                                    // case 0:
                                    //     return (
                                    //         <div className='Billing-Tab'>
                                    //             <Layout>
                                    //                 <Layout.Section secondary>
                                    //                     <Text variant="headingMd" as="h6">
                                    //                         Billing Method
                                    //                     </Text>

                                    //                     <Text variant="bodyMd" as="p">
                                    //                         Manage how you pay for Checkify.
                                    //                     </Text>

                                    //                     <Text variant="bodyMd" as="p">
                                    //                         We won’t see and store your payment details. Payment processing and data sending are completed via the highly secured Stripe system.
                                    //                     </Text>

                                    //                 </Layout.Section>

                                    //                 <Layout.Section >
                                    //                     <Card >
                                    //                         <Card.Section>
                                    //                             <Text variant="bodyMd" as="p">
                                    //                                 You don't have connected payment cards
                                    //                             </Text>
                                    //                         </Card.Section>
                                    //                         <Card.Section>
                                    //                             <Button primary>Add payment method</Button>
                                    //                         </Card.Section>

                                    //                     </Card>
                                    //                 </Layout.Section>
                                    //             </Layout>

                                    //             <Layout>
                                    //                 <Layout.Section secondary>
                                    //                     <Text variant="headingMd" as="h6">
                                    //                         Plan details
                                    //                     </Text>

                                    //                     <Text variant="bodyMd" as="p">
                                    //                         Your current subscription has a 7-day billing cycle. The weekly bill includes your fixed charge and transaction fees, if applicable.
                                    //                     </Text>

                                    //                     <Text variant="bodyMd" as="p">
                                    //                         <a href="https://help.checkify.pro/en/articles/4367158-understand-checkify-billing" target="_blank" rel="noopener noreferrer">Learn more</a>
                                    //                         {' about billing'}
                                    //                     </Text>

                                    //                 </Layout.Section>

                                    //                 <Layout.Section >
                                    //                     <Card >
                                    //                         <Card.Section>
                                    //                             <span>
                                    //                                 <ResourceList
                                    //                                     resourceName={{ singular: 'offer', plural: 'offers' }}
                                    //                                     items={InducementsData}
                                    //                                     renderItem={(item) => {
                                    //                                         const { id, url, avatarSource, name, location } = item;

                                    //                                         return (
                                    //                                             <ResourceItem
                                    //                                                 id={id}
                                    //                                                 media={
                                    //                                                     <Avatar
                                    //                                                         customer
                                    //                                                         shape='square'
                                    //                                                         size="medium"
                                    //                                                         name={name}
                                    //                                                         source={avatarSource}
                                    //                                                     />
                                    //                                                 }
                                    //                                                 accessibilityLabel={`View details for ${name}`}
                                    //                                                 name={name}
                                    //                                             >
                                    //                                                 <div>
                                    //                                                     <Text variant="bodyMd" fontWeight="bold" as="h3">
                                    //                                                         {name}
                                    //                                                     </Text>
                                    //                                                     <span>{location}</span>
                                    //                                                 </div>
                                    //                                                 <Badge>Awaiting subscription start</Badge>

                                    //                                             </ResourceItem>

                                    //                                         );
                                    //                                     }}
                                    //                                 />

                                    //                             </span>
                                    //                             <br />
                                    //                             <Text variant="bodyMd" as="p">
                                    //                                 1% transaction fee, Up to 100 Additional offers, Up to 100 Thank You page offers, Cash on Delivery, Custom domain
                                    //                             </Text>
                                    //                             <br />
                                    //                             <ButtonGroup>
                                    //                                 <Button primary>Change plan</Button>
                                    //                                 <Button destructive>Delete Checkify account</Button>
                                    //                             </ButtonGroup>
                                    //                         </Card.Section>

                                    //                     </Card>
                                    //                 </Layout.Section>
                                    //             </Layout>
                                    //         </div>
                                    //     )

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

                                    case 1:
                                        return (
                                            <div className='Store-Tab'>

                                                <Card>
                                                    <Card.Section>
                                                        <Stack alignment="center">
                                                            <Stack.Item fill>
                                                                <Stack vertical>

                                                                    <Text variant="headingMd" as="h6">
                                                                        Your shopify store
                                                                    </Text>
                                                                    <Stack alignment="center">
                                                                        <a href={`https://${storeDetails.domainName}`}
                                                                            target='_blank' className='store-domain'>
                                                                            {storeDetails.domainName}
                                                                        </a>
                                                                        <Icon
                                                                            source={PromoteMinor}
                                                                            color="interactive"
                                                                        />
                                                                    </Stack>
                                                                </Stack>
                                                            </Stack.Item>

                                                            <Stack.Item>
                                                                <Stack>
                                                                    <span>
                                                                        <input
                                                                            id='checkifyActive'
                                                                            type="checkbox"
                                                                            name='checkifyActive'
                                                                            className="tgl tgl-light"
                                                                            checked={storeActive}
                                                                            onClick={storeActive ? handleStoreStatusModal : changeStoreStatus}
                                                                        />
                                                                        <label htmlFor='checkifyActive' className='tgl-btn'></label>
                                                                    </span>
                                                                    <Text variant="bodyMd" as="p" fontWeight="semibold">
                                                                        Active
                                                                    </Text>

                                                                </Stack>
                                                            </Stack.Item>
                                                        </Stack>
                                                    </Card.Section>

                                                    <Card.Section>
                                                        <Layout>
                                                            <Layout.Section secondary>
                                                                <Text variant="bodySm" as="p" fontWeight="regular" color='subdued'>
                                                                    If you want to reconnect, please insert the new keys.
                                                                    They will not be seen in your interface after saving.
                                                                </Text>

                                                                <Form onSubmit={changeStoreDetails}>
                                                                    <FormLayout>
                                                                        <br />
                                                                        <Text variant="bodyMd" fontWeight='semibold' as="h6">
                                                                            Admin API access token from Shopify
                                                                        </Text>
                                                                        <InputField
                                                                            value={storeDetails.accessToken}
                                                                            name='accessToken'
                                                                            onChange={handleStoreDetails}
                                                                            type="text"
                                                                            placeholder='Enter Admin Api Access Token'
                                                                            required
                                                                        />

                                                                        <Text variant="bodyMd" fontWeight='semibold' as="h6">
                                                                            API key from Shopify
                                                                        </Text>
                                                                        <InputField
                                                                            value={storeDetails.publicKey}
                                                                            name='publicKey'
                                                                            onChange={handleStoreDetails}
                                                                            type="text"
                                                                            placeholder='Enter Api Public Key'
                                                                            required
                                                                        />

                                                                        <Text variant="bodyMd" fontWeight='semibold' as="h6">
                                                                            API secret key from Shopify
                                                                        </Text>
                                                                        <InputField
                                                                            value={storeDetails.privateKey}
                                                                            name='privateKey'
                                                                            onChange={handleStoreDetails}
                                                                            type="text"
                                                                            placeholder='Enter Api Private Key'
                                                                            required
                                                                        />
                                                                        <Button primary submit loading={btnLoading['store']}>Reconnect store</Button>
                                                                    </FormLayout>
                                                                </Form>
                                                            </Layout.Section>

                                                            <Layout.Section>
                                                                <Text variant="headingMd" as="h6">
                                                                    Check your Shopify Admin API access scopes
                                                                </Text>
                                                                <Card subdued>
                                                                    {scopes?.map((item) => {
                                                                        return (
                                                                            <Card.Section>
                                                                                <Stack>
                                                                                    <Stack.Item fill>
                                                                                        <Stack vertical={item.desc}>
                                                                                            <Text variant="bodyMd" fontWeight='semibold' as="h6">
                                                                                                {item.title}
                                                                                            </Text>
                                                                                            {item.desc &&
                                                                                                <Text variant="bodySm" as="p" fontWeight="regular" color='subdued'>
                                                                                                    {item.desc}
                                                                                                </Text>
                                                                                            }
                                                                                        </Stack>
                                                                                    </Stack.Item>
                                                                                    <Stack.Item>
                                                                                        <div className='Scopes-Section'>
                                                                                            <Stack alignment='center'>
                                                                                                <Stack vertical>
                                                                                                    <Text variant="bodySm" as="p" fontWeight="regular">
                                                                                                        <img src={FillCheckBox} alt="checkbox" />
                                                                                                        {item.firstScope}
                                                                                                    </Text>
                                                                                                    {item.secondScope &&
                                                                                                        <Text variant="bodySm" as="p" fontWeight="regular">
                                                                                                            <img src={FillCheckBox} alt="checkbox" />
                                                                                                            {item.secondScope}
                                                                                                        </Text>
                                                                                                    }
                                                                                                </Stack>
                                                                                                <span className='Custom-Clipboard'>
                                                                                                    <p id={item.id}>Copied</p>
                                                                                                    <Button onClick={() =>
                                                                                                        copyTextToClipboard(item.id)}>
                                                                                                        <img src={clipBoard} alt="clipboard" />
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </Stack>
                                                                                        </div>
                                                                                    </Stack.Item>
                                                                                </Stack>
                                                                            </Card.Section>
                                                                        )
                                                                    })}

                                                                </Card>
                                                            </Layout.Section>
                                                        </Layout>
                                                    </Card.Section>
                                                </Card>

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


