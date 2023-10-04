import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Card, Text, Toast, Select, Loading, Stack, Scrollable
} from '@shopify/polaris';
import { Link } from 'react-router-dom';
import {
    ExternalMinor, DeleteMinor
} from '@shopify/polaris-icons';
import axios from "axios";
import {
    SkeltonPage, getAccessToken, InputField, CustomSelect
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider';
import { useAuthState, useAuthDispatch } from '../../components/providers/AuthProvider'


export function Localization() {
    const { apiUrl } = useContext(AppContext);
    const { user } = useAuthState();
    const dispatch = useAuthDispatch();
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('')

    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const [activeStatus, setActiveStatus] = useState(true)
    const [selectedLanguage, setSelectedLanguage] = useState('')
    const handleLanguageChange = (value) => {
        if (value == user?.lang_field) {
            setActiveStatus(true)
        }
        else {
            setActiveStatus(false)
        }
        setSelectedLanguage(value)
        setToggleLoadData(true)
    }
    const options = [
        { label: 'English', value: 'en' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Russian', value: 'ru' },
        { label: 'Chinese', value: 'zh-cn' },
        { label: 'Japanese', value: 'ja' },
        { label: 'Italian', value: 'it' },
        { label: 'Arabic', value: 'ar' },
        { label: 'Urdu', value: 'ur' },
        { label: 'Hindi', value: 'hi' },
    ];
    const [localizationSettings, setLocalizationSettings] = useState([])

    const handleLocalizationSettings = (e) => {
        setLocalizationSettings({ ...localizationSettings, [e.target.name]: e.target.value })
    };
    useEffect(() => {
        console.log(user);
    }, [user])


    const getLocalizations = async () => {
        try {
            let response = ''
            if (selectedLanguage) {
                response = await axios.get(`${apiUrl}/api/localizations/${selectedLanguage}?storeName=${user?.shopifyShopDomainName}`)
            }
            else {
                response = await axios.get(`${apiUrl}/api/localizations?storeName=${user?.shopifyShopDomainName}`)
            }

            // console.log('getLocalizations response: ', response.data);

            setLocalizationSettings(response?.data)
            setSelectedLanguage(response?.data?.lang)
            setLoading(false)
            setToggleLoadData(false)

        } catch (error) {
            console.warn('getLocalizations Api Error', error.response);
            setLoading(false)
            setToggleLoadData(false)
            setToastMsg('Server Error')
            setErrorToast(true)
        }
    }

    const updateLocalizations = async () => {
        setBtnLoading(true)

        try {
            const response = await axios.post(`${apiUrl}/api/localizations/${selectedLanguage}?storeName=${user?.shopifyShopDomainName}`, localizationSettings)

            // console.log('updateLocalizations response: ', response.data);
            setLocalizationSettings(response?.data)
            setBtnLoading(false)
            setToastMsg('Localization Updated')
            setSucessToast(true)



        } catch (error) {
            console.warn('updateLocalizations Api Error', error.response);
            setBtnLoading(false)
            setToastMsg('Server Error')
            setErrorToast(true)
        }
    }

    const changeLocalizationStatus = async () => {
        // setBtnLoading((prev) => {
        //     let toggleId;
        //     if (prev['storeStatus']) {
        //         toggleId = { ['storeStatus']: false };
        //     } else {
        //         toggleId = { ['storeStatus']: true };
        //     }
        //     return { ...toggleId };
        // });

        let language = ''
        if (activeStatus) {
            language = 'en'
        }
        else {
            language = selectedLanguage
        }
        let data = {
            type: 'lang',
            lang_field: language,
        }

        try {
            const response = await axios.post(`${apiUrl}/api/store/minor`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('change Localization Status response: ', response.data);
            if (!response?.data?.errors) {
                setToastMsg(response.data?.data ? response.data?.data : 'Settings Updated')
                setSucessToast(true)
                setActiveStatus(!activeStatus)

                dispatch({
                    user: response.data?.user,
                });
            }
            setBtnLoading(false)

        } catch (error) {
            console.warn('change Localization Status Api Error', error.response);
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

    useEffect(() => {
        if (toggleLoadData) {
            getLocalizations()
        }
    }, [toggleLoadData])


    return (
        <div className='Localization-Page'>
            {loading ?
                <span>
                    <Loading />
                    <SkeltonPage />
                </span>
                :
                <Page
                    fullWidth
                    title="Localization"
                    primaryAction={{
                        content: 'Save Changes',
                        onAction: updateLocalizations,
                        loading: btnLoading
                    }}
                    secondaryActions={
                        <Stack>
                            <span>
                                <input
                                    id='checkifyActive'
                                    type="checkbox"
                                    name='checkifyActive'
                                    className="tgl tgl-light"
                                    checked={activeStatus}
                                    onClick={changeLocalizationStatus}
                                />
                                <label htmlFor='checkifyActive' className='tgl-btn'></label>
                            </span>
                            <Text variant="bodyMd" as="p" fontWeight="semibold">
                                Active
                            </Text>

                        </Stack>
                    }
                >
                    <Layout>
                        <Layout.Section secondary>
                            <Scrollable shadow style={{ height: 'calc(100vh - 150px)' }}>
                                <Card>
                                    <Card.Section>
                                        <Text variant="headingMd" as="h6">
                                            Checkout language
                                        </Text>
                                        <br />
                                        <Select
                                            options={options}
                                            onChange={handleLanguageChange}
                                            value={selectedLanguage}
                                        />
                                        <br />
                                        <Text variant="bodyMd" as="p" color='subdued'>
                                            {'You can change the text that the customer sees on your checkout. '}
                                            <a href="https://help.checkify.pro/en/articles/5326857-how-to-translate-your-checkout"
                                                target="_blank" rel="noopener noreferrer" className='href-css'>
                                                Learn more
                                            </a>
                                            {' about localizations.'}
                                        </Text>
                                    </Card.Section>

                                    <Card.Section>
                                        <Stack vertical>
                                            <a href='#checkout-page'>Checkout page</a>
                                            <a href='#shipping-details'>Shipping details</a>
                                            <a href='#shipping-options'>Shipping options</a>
                                            <a href='#billing-details'>Billing details</a>
                                            <a href='#motivators'>Motivators</a>
                                            <a href='#order-summary'>Order summary</a>
                                            <a href='#tipping'>Tipping</a>
                                            <a href='#payment-methods'>Payment methods</a>
                                            <a href='#paypal'>Paypal</a>
                                            <a href='#cash-on-delivery'>Cash on Delivery</a>
                                            <a href='#footer-links'>Footer links</a>
                                            <a href='#thank-you-page'>Thank You page</a>
                                            <a href='#errors'>Errors</a>
                                            <a href='#product-offers'>Product offers</a>
                                        </Stack>
                                    </Card.Section>

                                </Card>
                            </Scrollable>
                        </Layout.Section>

                        <Layout.Section>
                            <Scrollable shadow style={{ height: 'calc(100vh - 150px)' }}>
                                <div className='Localization-Card' id='checkout-page'>
                                    <Card sectioned title='Checkout page'>
                                        <InputField
                                            label="Checkout Page Title"
                                            placeholder='Checkout Page'
                                            name='CP_CheckoutPageName'
                                            value={localizationSettings?.CP_CheckoutPageName}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Text Below Express Checkout Buttons"
                                            placeholder='Or Pay Another Way Below'
                                            name='CP_PayAnotherWay'
                                            value={localizationSettings?.CP_PayAnotherWay}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Email Helper Text'
                                            placeholder='We`ll send you an order receipt and recurring shipping updates via Email. Message frequency varies. View our Privacy policy and Terms of service.'
                                            name='CP_EmailHelperText'
                                            multiline={2}
                                            value={localizationSettings?.CP_EmailHelperText}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Phone Helper Text'
                                            placeholder='We`ll send you an order receipt and recurring shipping updates via text message. Reply STOP to unsubscribe. Reply HELP for help. Message frequency varies. View our Privacy policy and Terms of service.'
                                            name='CP_PhoneHelperText'
                                            multiline={2}
                                            value={localizationSettings?.CP_PhoneHelperText}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='shipping-details'>
                                    <Card sectioned title='Shipping details'>
                                        <InputField
                                            label="Shipping Details"
                                            placeholder='Shipping Details'
                                            name='SD_ShippingDetails'
                                            value={localizationSettings?.SD_ShippingDetails}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Email Address"
                                            placeholder='Email Address'
                                            name='SD_EmailAddress'
                                            value={localizationSettings?.SD_EmailAddress}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="First Name"
                                            placeholder='First Name'
                                            name='SD_FirstName'
                                            value={localizationSettings?.SD_FirstName}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Last Name"
                                            placeholder='Last Name'
                                            name='SD_LastName'
                                            value={localizationSettings?.SD_LastName}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Phone"
                                            placeholder='Phone'
                                            name='SD_Phone'
                                            value={localizationSettings?.SD_Phone}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Address"
                                            placeholder='Address'
                                            name='SD_Address'
                                            value={localizationSettings?.SD_Address}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="City"
                                            placeholder='City'
                                            name='SD_City'
                                            value={localizationSettings?.SD_City}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Zip Code"
                                            placeholder='Zip Code'
                                            name='SD_ZipCode'
                                            value={localizationSettings?.SD_ZipCode}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Country"
                                            placeholder='Country'
                                            name='SD_Country'
                                            value={localizationSettings?.SD_Country}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Additional Address"
                                            placeholder='Apartment, suit, etc.'
                                            name='SD_AdditionalAddress'
                                            value={localizationSettings?.SD_AdditionalAddress}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Company"
                                            placeholder='Company'
                                            name='SD_Company'
                                            value={localizationSettings?.SD_Company}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="County"
                                            placeholder='County'
                                            name='SD_County'
                                            value={localizationSettings?.SD_County}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Emirate"
                                            placeholder='Emirate'
                                            name='SD_Emirate'
                                            value={localizationSettings?.SD_Emirate}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Governorate"
                                            placeholder='Governorate'
                                            name='SD_Governorate'
                                            value={localizationSettings?.SD_Governorate}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Prefecture"
                                            placeholder='Prefecture'
                                            name='SD_Prefecture'
                                            value={localizationSettings?.SD_Prefecture}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Province"
                                            placeholder='Province'
                                            name='SD_Province'
                                            value={localizationSettings?.SD_Province}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Region"
                                            placeholder='Region'
                                            name='SD_Region'
                                            value={localizationSettings?.SD_Region}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="State And Territory"
                                            placeholder='State And Territory'
                                            name='SD_StateAndTerritory'
                                            value={localizationSettings?.SD_StateAndTerritory}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="State"
                                            placeholder='State'
                                            name='SD_State'
                                            value={localizationSettings?.SD_State}
                                            onChange={handleLocalizationSettings}
                                        />

                                    </Card>
                                </div>

                                <div className='Localization-Card' id='shipping-options'>
                                    <Card sectioned title='Shipping options'>
                                        <InputField
                                            label="Shipping Options"
                                            placeholder='Shipping Options'
                                            name='SO_ShippingOptions'
                                            value={localizationSettings?.SO_ShippingOptions}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Shipping Method'
                                            placeholder='Shipping Method'
                                            name='SO_ShippingMethod'
                                            value={localizationSettings?.SO_ShippingMethod}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Free'
                                            placeholder='Free'
                                            name='SO_Free'
                                            value={localizationSettings?.SO_Free}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Shipping Options Error'
                                            placeholder='Shipping options are not available'
                                            name='SO_NoShippingOptionsTitle'
                                            value={localizationSettings?.SO_NoShippingOptionsTitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Shipping Options Error Description'
                                            placeholder='The store owner did not provide shipping options for your location. Check if the shipping address is correct.'
                                            name='SO_NoShippingOptionsSubtitle'
                                            multiline={2}
                                            value={localizationSettings?.SO_NoShippingOptionsSubtitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='billing-details'>
                                    <Card sectioned title='Billing details'>
                                        <InputField
                                            label="Billing Details"
                                            placeholder='Billing Details'
                                            name='BD_BillingDetails'
                                            value={localizationSettings?.BD_BillingDetails}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Billing address is the same as shipping'
                                            placeholder='Billing address is the same as shipping'
                                            name='BD_BillingAddressIsSame'
                                            value={localizationSettings?.BD_BillingAddressIsSame}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='motivators'>
                                    <Card sectioned title='Motivators'>
                                        <InputField
                                            label="Marketing Opt-In Checkbox"
                                            placeholder='Sign up for exclusive offers and news'
                                            name='M_MarketingAcceptance'
                                            value={localizationSettings?.M_MarketingAcceptance}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Bar with Custom Text'
                                            placeholder="🔥 Strong demand! Complete your order before it's too late!"
                                            name='M_StrongDemand'
                                            value={localizationSettings?.M_StrongDemand}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Scarcity Timer'
                                            placeholder='Your cart is reserved for {{MM:SS}}'
                                            name='M_CartReservation'
                                            multiline={2}
                                            value={localizationSettings?.M_CartReservation}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='order-summary'>
                                    <Card sectioned title='Order summary'>
                                        <InputField
                                            label="Order Summary"
                                            placeholder='Order Summary'
                                            name='OS_OrderSummary'
                                            value={localizationSettings?.OS_OrderSummary}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Show Order Summary (Mobile Version)'
                                            placeholder='Show Order Summary'
                                            name='OS_ShowOrderSummary'
                                            value={localizationSettings?.OS_ShowOrderSummary}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Hide Order Summary(Mobile Version)'
                                            placeholder='Hide Order Summary'
                                            name='OS_HideOrderSummary'
                                            value={localizationSettings?.OS_HideOrderSummary}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Message Checkbox'
                                            placeholder='Add message to seller'
                                            name='OS_MessageTitle'
                                            value={localizationSettings?.OS_MessageTitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Message Placeholder'
                                            placeholder='Your message'
                                            name='OS_MessageDescription'
                                            value={localizationSettings?.OS_MessageDescription}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Message Character Limit'
                                            placeholder='250 characters max'
                                            name='OS_MessageCharacters'
                                            value={localizationSettings?.OS_MessageCharacters}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='SubTotal'
                                            placeholder='Subtotal'
                                            name='OS_Subtotal'
                                            value={localizationSettings?.OS_Subtotal}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Total'
                                            placeholder='Total'
                                            name='OS_Total'
                                            value={localizationSettings?.OS_Total}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Payment Fee'
                                            placeholder='Payment Fee'
                                            name='OS_PaymentFee'
                                            value={localizationSettings?.OS_PaymentFee}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Payment Fee - Per Percentage'
                                            placeholder='Payment Fee - Per Percentage'
                                            name='OS_PaymentFeePercentage'
                                            value={localizationSettings?.OS_PaymentFeePercentage}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Payment Fee - Fixed Price'
                                            placeholder='Payment Fee - Fixed Price'
                                            name='OS_PaymentFeeFixed'
                                            value={localizationSettings?.OS_PaymentFeeFixed}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Free'
                                            placeholder='Free'
                                            name='OS_Free'
                                            value={localizationSettings?.OS_Free}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Discount'
                                            placeholder='Discount'
                                            name='OS_Discount'
                                            value={localizationSettings?.OS_Discount}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Discount Code'
                                            placeholder='Discount Code'
                                            name='OS_DiscountCode'
                                            value={localizationSettings?.OS_DiscountCode}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Apply Code'
                                            placeholder='Apply Code'
                                            name='OS_ApplyCode'
                                            value={localizationSettings?.OS_ApplyCode}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='All options'
                                            placeholder='All options'
                                            name='OS_AllOptions'
                                            value={localizationSettings?.OS_AllOptions}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Hide options'
                                            placeholder='Hide options'
                                            name='OS_HideOptions'
                                            value={localizationSettings?.OS_HideOptions}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Show more products'
                                            placeholder='Show more products'
                                            name='OS_ShowMoreProducts'
                                            value={localizationSettings?.OS_ShowMoreProducts}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Hide products'
                                            placeholder='Hide products'
                                            name='OS_HideProducts'
                                            value={localizationSettings?.OS_HideProducts}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Taxes Relevant in Australia, India'
                                            placeholder='Tax (GST)'
                                            name='OS_TaxAuIn'
                                            value={localizationSettings?.OS_TaxAuIn}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Taxes Relevant in Canada'
                                            placeholder='Tax (GST/HST)'
                                            name='OS_TaxCa'
                                            value={localizationSettings?.OS_TaxCa}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Taxes Relevant in USA'
                                            placeholder='Sales Tax'
                                            name='OS_TaxUs'
                                            value={localizationSettings?.OS_TaxUs}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Taxes Relevant in the whole other countries'
                                            placeholder='VAT'
                                            name='OS_TaxOther'
                                            value={localizationSettings?.OS_TaxOther}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='tipping'>
                                    <Card sectioned title='Tipping'>
                                        <InputField
                                            label="Block Title"
                                            placeholder='Add Tip'
                                            name='T_TipTitle'
                                            value={localizationSettings?.T_TipTitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Description - Motivators'
                                            placeholder='Show your support for the team of our shop'
                                            name='T_TipDescription'
                                            value={localizationSettings?.T_TipDescription}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Title of Tipping in Cart'
                                            placeholder='Tip'
                                            name='T_TipInCart'
                                            value={localizationSettings?.T_TipInCart}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Without Tips on Checkout'
                                            placeholder='None'
                                            name='T_TipNone'
                                            value={localizationSettings?.T_TipNone}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='payment-methods'>
                                    <Card sectioned title='Payment methods'>
                                        <InputField
                                            label="Payment Method"
                                            placeholder='Payment Method'
                                            name='PM_PaymentMethod'
                                            value={localizationSettings?.PM_PaymentMethod}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Payment Card"
                                            placeholder='Card'
                                            name='PM_PayCard'
                                            value={localizationSettings?.PM_PayCard}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Card Details"
                                            placeholder='Card Details'
                                            name='PM_CardDetails'
                                            value={localizationSettings?.PM_CardDetails}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Payment Details"
                                            placeholder='Payment Details'
                                            name='PM_PaymentDetails'
                                            value={localizationSettings?.PM_PaymentDetails}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Complete Purchase"
                                            placeholder='Complete Purchase'
                                            name='PM_CompletePurchase'
                                            value={localizationSettings?.PM_CompletePurchase}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Loader Before Create Order"
                                            placeholder='Your order is being processed, please wait'
                                            name='PM_OrderProcessing'
                                            value={localizationSettings?.PM_OrderProcessing}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Payment Inducement"
                                            placeholder='Transaction secured'
                                            name='PM_TransactionSecured'
                                            value={localizationSettings?.PM_TransactionSecured}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Payment Methods Errors"
                                            placeholder='Payment methods are not available'
                                            name='PM_NoPaymentMethodsTitle'
                                            value={localizationSettings?.PM_NoPaymentMethodsTitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Payment Methods Error Description"
                                            placeholder='Sorry, we do not accept payments from your country.'
                                            name='PM_NoPaymentMethodsSubtitle'
                                            value={localizationSettings?.PM_NoPaymentMethodsSubtitle}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Success Message After Redirect'
                                            placeholder='Your payment was successfully authorized. Now we are waiting for the capture request which is submitted by the payment gateway.'
                                            name='PM_PaySucceeded'
                                            multiline={2}
                                            value={localizationSettings?.PM_PaySucceeded}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Message About Cancel Payment After Redirect"
                                            placeholder='Your payment was canceled'
                                            name='PM_PayCanceled'
                                            value={localizationSettings?.PM_PayCanceled}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Message About Pending Status After Redirect"
                                            placeholder='Your payment is pending'
                                            name='PM_PayPending'
                                            value={localizationSettings?.PM_PayPending}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Message About Failed Status After Redirect"
                                            placeholder='Your payment was failed'
                                            name='PM_PayFailed'
                                            value={localizationSettings?.PM_PayFailed}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='paypal'>
                                    <Card sectioned title='Paypal'>
                                        <InputField
                                            label="PayPal"
                                            placeholder='PayPal'
                                            name='PP_PayPal'
                                            value={localizationSettings?.PP_PayPal}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='PayPal Description'
                                            placeholder='After clicking the Complete Purchase you will be redirected to a PayPal payment window.'
                                            name='PP_PayPalTerms'
                                            value={localizationSettings?.PP_PayPalTerms}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='cash-on-delivery'>
                                    <Card sectioned title='Cash on Delivery'>
                                        <InputField
                                            label="Cash on Delivery"
                                            placeholder='Cash on Delivery'
                                            name='COD_CashOnDelivery'
                                            value={localizationSettings?.COD_CashOnDelivery}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Cash on Delivery Description'
                                            placeholder='By clicking the Complete Purchase you will place your order without online transaction and will be able to make offline payment later. Please note that you may be charged an additional fee for using this payment method.'
                                            name='COD_RedirectInfo'
                                            multiline={2}
                                            value={localizationSettings?.COD_RedirectInfo}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='footer-links'>
                                    <Card sectioned title='Footer links'>
                                        <InputField
                                            label="Refund policy"
                                            placeholder='Refund policy'
                                            name='FL_ReturnsPolicy'
                                            value={localizationSettings?.FL_ReturnsPolicy}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Shipping policy'
                                            placeholder='Shipping policy'
                                            name='FL_ShippingPolicy'
                                            value={localizationSettings?.FL_ShippingPolicy}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Privacy policy'
                                            placeholder='Privacy policy'
                                            name='FL_PrivacyPolicy'
                                            value={localizationSettings?.FL_PrivacyPolicy}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Terms of service'
                                            placeholder='Terms of service'
                                            name='FL_TermsAndConditions'
                                            value={localizationSettings?.FL_TermsAndConditions}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='thank-you-page'>
                                    <Card sectioned title='Thank You page'>
                                        <InputField
                                            label="Thank You Page Title"
                                            placeholder='Thank You Page'
                                            name='TYP_ThankYouPageName'
                                            value={localizationSettings?.TYP_ThankYouPageName}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label="Purchase Completed"
                                            placeholder='Purchase Completed'
                                            name='TYP_PurchaseCompleted'
                                            value={localizationSettings?.TYP_PurchaseCompleted}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Custom Text on Thank You Page'
                                            placeholder='Please check carefully that your shipping address and contact info is correct. Otherwise, contact our customer service at {{support_email}} as soon as possible.'
                                            name='TYP_ThankYouPageText'
                                            multiline={4}
                                            value={localizationSettings?.TYP_ThankYouPageText}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='errors'>
                                    <Card sectioned title='Errors'>
                                        <InputField
                                            label="Invalid Discount Code"
                                            placeholder="The code you have applied isn't valid."
                                            name='VE_DiscountCodeInvalid'
                                            value={localizationSettings?.VE_DiscountCodeInvalid}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Invalid Email'
                                            placeholder='Email is invalid'
                                            name='VE_EmailInvalid'
                                            value={localizationSettings?.VE_EmailInvalid}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Invalid Phone Number'
                                            placeholder='Please double-check that'
                                            name='VE_PhoneNumberInvalid'
                                            value={localizationSettings?.VE_PhoneNumberInvalid}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='General Payment Error'
                                            placeholder='There is a problem with your payment method. Please use another one or check if the shipping address is correct.'
                                            name='VE_GeneralPaymentError'
                                            value={localizationSettings?.VE_GeneralPaymentError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Local Payment Method Error'
                                            placeholder='This payment method is unavailable for your location. Please try another payment method.'
                                            name='VE_LocationPayError'
                                            value={localizationSettings?.VE_LocationPayError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='General Input Error'
                                            placeholder="isn`t valid"
                                            name='VE_GeneralInputError'
                                            value={localizationSettings?.VE_GeneralInputError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='General Phone Error'
                                            placeholder='We have some trouble with create order with this phone number. Please use another one.'
                                            name='VE_GeneralPhoneError'
                                            value={localizationSettings?.VE_GeneralPhoneError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='General Order Error'
                                            placeholder='Order was already paid, please contact with our support'
                                            name='VE_GeneralOrderError'
                                            value={localizationSettings?.VE_GeneralOrderError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='General Error'
                                            placeholder='Something went wrong, please try another payment method'
                                            name='VE_GeneralError'
                                            value={localizationSettings?.VE_GeneralError}
                                            onChange={handleLocalizationSettings}
                                        />
                                        <InputField
                                            marginTop
                                            label='Card Details Incomplete'
                                            placeholder='Your card details is incomplete'
                                            name='VE_ErrorCard'
                                            value={localizationSettings?.VE_ErrorCard}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>

                                <div className='Localization-Card' id='product-offers'>
                                    <Card sectioned title='Product offers'>
                                        <InputField
                                            label="Product Offers"
                                            placeholder='Product Offers'
                                            name='PO_ProductOptions'
                                            value={localizationSettings?.PO_ProductOptions}
                                            onChange={handleLocalizationSettings}
                                        />
                                    </Card>
                                </div>
                            </Scrollable>
                        </Layout.Section>
                    </Layout>
                </Page >
            }

            {toastErrorMsg}
            {toastSuccessMsg}
        </div >
    )
}


