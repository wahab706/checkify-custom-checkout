import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Page, Layout, Banner, Card, ButtonGroup, Button, Icon, Tabs, Text, TextField, Toast,
    Stack, Badge, Form, FormLayout, Loading, Sheet, Scrollable
} from '@shopify/polaris';
import { HorizontalDotsMinor, ArrowLeftMinor, ExternalMinor } from '@shopify/polaris-icons';
import klaviyoLogo from '../../assets/icons/klaviyoLogo.svg'
import trackifyLogo from '../../assets/icons/trackifyLogo.svg'
import hotjarLogo from '../../assets/icons/hotjarLogo.svg'
import bingLogo from '../../assets/icons/bingLogo.svg'
import quoraLogo from '../../assets/icons/quoraLogo.svg'
import redditLogo from '../../assets/icons/redditLogo.svg'
import omnisendLogo from '../../assets/icons/omnisendLogo.svg'
import SMSBumpLogo from '../../assets/icons/SMSBumpLogo.svg'


import axios from "axios";
import {
    SkeltonPaymentPage, getAccessToken, InputField, CustomSelect
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'

export function Integrations() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [integrationBanner, setIntegrationBanner] = useState(true)
    const { apiUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true)
    const [btnLoading, setBtnLoading] = useState(false)
    const [toggleLoadData, setToggleLoadData] = useState(true)
    const [errorToast, setErrorToast] = useState(false);
    const [sucessToast, setSucessToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');


    const [integrationsData, setIntegrationsData] = useState([])
    const [selectedIntegrationOption, setSelectedIntegrationOption] = useState()
    const [isIntegrationEdit, setIsIntegrationEdit] = useState(true)
    const [integrationOptionSheet, setIntegrationOptionSheet] = useState(false);
    const [selectedIntegrationId, setSelectedIntegrationId] = useState()


    const [integrationValue, setIntegrationValue] = useState({
        FACEBOOK_PIXEL_API: '',
        FACEBOOK_CONVERSIONS_API__ACCESS_Token: '',
        FACEBOOK_CONVERSIONS_API__PIXEL_ID: '',
        GOOGLE_ANALYTICS__ID: '',
        GOOGLE_ANALYTICS__SCRIPT: '',
        GOOGLE_ADS__ID: '',
        GOOGLE_ADS__CHECKOUT_LABEL: '',
        GOOGLE_ADS__PURCHASE_LABEL: '',
        GOOGLE_TAG_MANAGER__ID: '',
        KLAVIYO__API_KEY: '',
        TIKTOK__ID: '',
        PINTEREST__ID: '',
        SNAPCHAT__ID: '',
        TWITTERT__ID: '',
        TWITTERT__CHECKOUT_ID: '',
        TWITTERT__PURCHASE_ID: '',
        TABOOLA__ID: '',
        OUTBRAIN__ID: '',
        BING_MICROSOFT_ADS__ID: '',
        GOOGLE_PLACES__ID: '',
        HOTJAR__ID: '',
        SMSBUMP__APP_KEY: '',
        SMSBUMP__SECRET_KEY: '',
        SMSBUMP__LIST_ID: '',
        OMNISEND__API_KEY: '',
        REDDIT__ID: '',
        QUORA__ID: '',
        POSTSCRIPT__PRIVATE_KEY: '',
        POSTSCRIPT__KEYWORD: '',
    })

    const handleTabChange = useCallback((selectedTabIndex) => setSelectedTab(selectedTabIndex), [],);

    const tabs = [
        {
            id: 'tab1',
            content: (
                <span>
                    All Integrations <Badge status="success">21</Badge>
                </span>
            ),
        },
        {
            id: 'tab2',
            content: (
                <span>
                    Google Services <Badge status="success">4</Badge>
                </span>
            ),
        },
        {
            id: 'tab3',
            content: (
                <span>
                    Marketing Platforms <Badge status="success">12</Badge>
                </span>
            ),
        },
        {
            id: 'tab4',
            content: (
                <span>
                    Email & SMS Senders <Badge status="success">4</Badge>
                </span>
            ),
        },
        {
            id: 'tab5',
            content: (
                <span>
                    Tracking Tools <Badge status="success">3</Badge>
                </span>
            ),
        },
    ];

    const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
    const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

    const toastErrorMsg = errorToast ? (
        <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
    ) : null;

    const toastSuccessMsg = sucessToast ? (
        <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
    ) : null;

    const handleIntegrationValue = (e) => {
        setIntegrationValue({ ...integrationValue, [e.target.name]: e.target.value })
    }

    const handleIntegrationOptionSheet = () => {
        setIntegrationOptionSheet(!integrationOptionSheet)
        setSelectedIntegrationOption()
        setSelectedIntegrationId()
        setTimeout(() => {
            setIsIntegrationEdit(true)
        }, 500);
        setIntegrationValue({
            FACEBOOK_PIXEL_API: '',
            FACEBOOK_CONVERSIONS_API__ACCESS_Token: '',
            FACEBOOK_CONVERSIONS_API__PIXEL_ID: '',
            GOOGLE_ANALYTICS__ID: '',
            GOOGLE_ANALYTICS__SCRIPT: '',
            GOOGLE_ADS__ID: '',
            GOOGLE_ADS__CHECKOUT_LABEL: '',
            GOOGLE_ADS__PURCHASE_LABEL: '',
            GOOGLE_TAG_MANAGER__ID: '',
            KLAVIYO__API_KEY: '',
            TIKTOK__ID: '',
            PINTEREST__ID: '',
            SNAPCHAT__ID: '',
            TWITTERT__ID: '',
            TWITTERT__CHECKOUT_ID: '',
            TWITTERT__PURCHASE_ID: '',
            TABOOLA__ID: '',
            OUTBRAIN__ID: '',
            BING_MICROSOFT_ADS__ID: '',
            GOOGLE_PLACES__ID: '',
            HOTJAR__ID: '',
            SMSBUMP__APP_KEY: '',
            SMSBUMP__SECRET_KEY: '',
            SMSBUMP__LIST_ID: '',
            OMNISEND__API_KEY: '',
            REDDIT__ID: '',
            QUORA__ID: '',
            POSTSCRIPT__PRIVATE_KEY: '',
            POSTSCRIPT__KEYWORD: '',
        })
    }

    function convertBooleanToNumber(value) {
        let booleanValue;
        if (value === true) {
            booleanValue = 1;
        }
        else {
            booleanValue = 0;
        }

        return booleanValue;
    }

    function convertNumberToBoolean(value) {
        let booleanValue;
        if (value === 1) {
            booleanValue = true;
        }
        else {
            booleanValue = false;
        }
        return booleanValue;
    }

    const handleConnectIntegration = (variant) => {
        if (variant == 'FACEBOOK_PIXEL') {
            setSelectedIntegrationOption(1)
            setSelectedIntegrationId(integrationsData?.FACEBOOK_PIXEL?.id)
        }
        else if (variant == 'FACEBOOK_CONVERSIONS_API') {
            setSelectedIntegrationOption(2)
            setSelectedIntegrationId(integrationsData?.FACEBOOK_CONVERSIONS_API?.id)
        }
        else if (variant == 'GOOGLE_ANALYTICS') {
            setSelectedIntegrationOption(3)
            setSelectedIntegrationId(integrationsData?.GOOGLE_ANALYTICS?.id)
        }
        else if (variant == 'GOOGLE_ADS') {
            setSelectedIntegrationOption(4)
            setSelectedIntegrationId(integrationsData?.GOOGLE_ADS?.id)
        }
        else if (variant == 'GOOGLE_TAG_MANAGER') {
            setSelectedIntegrationOption(5)
            setSelectedIntegrationId(integrationsData?.GOOGLE_TAG_MANAGER?.id)
        }
        else if (variant == 'KLAVIYO') {
            setSelectedIntegrationOption(6)
            setSelectedIntegrationId(integrationsData?.KLAVIYO?.id)
        }
        else if (variant == 'TIKTOK') {
            setSelectedIntegrationOption(7)
            setSelectedIntegrationId(integrationsData?.TIKTOK?.id)
        }
        else if (variant == 'PINTEREST') {
            setSelectedIntegrationOption(8)
            setSelectedIntegrationId(integrationsData?.PINTEREST?.id)
        }
        else if (variant == 'SNAPCHAT') {
            setSelectedIntegrationOption(9)
            setSelectedIntegrationId(integrationsData?.SNAPCHAT?.id)
        }
        else if (variant == 'TWITTER') {
            setSelectedIntegrationOption(10)
            setSelectedIntegrationId(integrationsData?.TWITTER?.id)
        }
        else if (variant == 'TABOOLA') {
            setSelectedIntegrationOption(11)
            setSelectedIntegrationId(integrationsData?.TABOOLA?.id)
        }
        else if (variant == 'OUTBRAIN') {
            setSelectedIntegrationOption(12)
            setSelectedIntegrationId(integrationsData?.OUTBRAIN?.id)
        }
        else if (variant == 'BING_MICROSOFT_ADS') {
            setSelectedIntegrationOption(13)
            setSelectedIntegrationId(integrationsData?.BING_MICROSOFT_ADS?.id)
        }
        else if (variant == 'GOOGLE_PLACES') {
            setSelectedIntegrationOption(14)
            setSelectedIntegrationId(integrationsData?.GOOGLE_PLACES?.id)
        }
        else if (variant == 'HOTJAR') {
            setSelectedIntegrationOption(15)
            setSelectedIntegrationId(integrationsData?.HOTJAR?.id)
        }
        else if (variant == 'TRACKIFY') {
            setSelectedIntegrationOption(16)
            setSelectedIntegrationId(integrationsData?.TRACKIFY?.id)
        }
        else if (variant == 'SMSBUMP') {
            setSelectedIntegrationOption(17)
            setSelectedIntegrationId(integrationsData?.SMSBUMP?.id)
        }
        else if (variant == 'OMNISEND') {
            setSelectedIntegrationOption(18)
            setSelectedIntegrationId(integrationsData?.OMNISEND?.id)
        }
        else if (variant == 'REDDIT') {
            setSelectedIntegrationOption(19)
            setSelectedIntegrationId(integrationsData?.REDDIT?.id)
        }
        else if (variant == 'QUORA') {
            setSelectedIntegrationOption(20)
            setSelectedIntegrationId(integrationsData?.QUORA?.id)
        }
        else if (variant == 'POSTSCRIPT') {
            setSelectedIntegrationOption(21)
            setSelectedIntegrationId(integrationsData?.POSTSCRIPT?.id)
        }


        setIsIntegrationEdit(false)
        setIntegrationOptionSheet(true)
    }

    const handleEditIntegration = (variant) => {
        if (variant == 'FACEBOOK_PIXEL') {
            setSelectedIntegrationOption(1)
            setSelectedIntegrationId(integrationsData?.FACEBOOK_PIXEL?.id)
            setIntegrationValue(JSON.parse(integrationsData?.FACEBOOK_PIXEL?.params))
        }
        else if (variant == 'FACEBOOK_CONVERSIONS_API') {
            setSelectedIntegrationOption(2)
            setSelectedIntegrationId(integrationsData?.FACEBOOK_CONVERSIONS_API?.id)
            setIntegrationValue(JSON.parse(integrationsData?.FACEBOOK_CONVERSIONS_API?.params))
        }
        else if (variant == 'GOOGLE_ANALYTICS') {
            setSelectedIntegrationOption(3)
            setSelectedIntegrationId(integrationsData?.GOOGLE_ANALYTICS?.id)
            setIntegrationValue(JSON.parse(integrationsData?.GOOGLE_ANALYTICS?.params))
        }
        else if (variant == 'GOOGLE_ADS') {
            setSelectedIntegrationOption(4)
            setSelectedIntegrationId(integrationsData?.GOOGLE_ADS?.id)
            setIntegrationValue(JSON.parse(integrationsData?.GOOGLE_ADS?.params))
        }
        else if (variant == 'GOOGLE_TAG_MANAGER') {
            setSelectedIntegrationOption(5)
            setSelectedIntegrationId(integrationsData?.GOOGLE_TAG_MANAGER?.id)
            setIntegrationValue(JSON.parse(integrationsData?.GOOGLE_TAG_MANAGER?.params))
        }
        else if (variant == 'KLAVIYO') {
            setSelectedIntegrationOption(6)
            setSelectedIntegrationId(integrationsData?.KLAVIYO?.id)
            setIntegrationValue(JSON.parse(integrationsData?.KLAVIYO?.params))
        }
        else if (variant == 'TIKTOK') {
            setSelectedIntegrationOption(7)
            setSelectedIntegrationId(integrationsData?.TIKTOK?.id)
            setIntegrationValue(JSON.parse(integrationsData?.TIKTOK?.params))
        }
        else if (variant == 'PINTEREST') {
            setSelectedIntegrationOption(8)
            setSelectedIntegrationId(integrationsData?.PINTEREST?.id)
            setIntegrationValue(JSON.parse(integrationsData?.PINTEREST?.params))
        }
        else if (variant == 'SNAPCHAT') {
            setSelectedIntegrationOption(9)
            setSelectedIntegrationId(integrationsData?.SNAPCHAT?.id)
            setIntegrationValue(JSON.parse(integrationsData?.SNAPCHAT?.params))
        }
        else if (variant == 'TWITTER') {
            setSelectedIntegrationOption(10)
            setSelectedIntegrationId(integrationsData?.TWITTER?.id)
            setIntegrationValue(JSON.parse(integrationsData?.TWITTER?.params))
        }
        else if (variant == 'TABOOLA') {
            setSelectedIntegrationOption(11)
            setSelectedIntegrationId(integrationsData?.TABOOLA?.id)
            setIntegrationValue(JSON.parse(integrationsData?.TABOOLA?.params))
        }
        else if (variant == 'OUTBRAIN') {
            setSelectedIntegrationOption(12)
            setSelectedIntegrationId(integrationsData?.OUTBRAIN?.id)
            setIntegrationValue(JSON.parse(integrationsData?.OUTBRAIN?.params))
        }
        else if (variant == 'BING_MICROSOFT_ADS') {
            setSelectedIntegrationOption(13)
            setSelectedIntegrationId(integrationsData?.BING_MICROSOFT_ADS?.id)
            setIntegrationValue(JSON.parse(integrationsData?.BING_MICROSOFT_ADS?.params))
        }
        else if (variant == 'GOOGLE_PLACES') {
            setSelectedIntegrationOption(14)
            setSelectedIntegrationId(integrationsData?.GOOGLE_PLACES?.id)
            setIntegrationValue(JSON.parse(integrationsData?.GOOGLE_PLACES?.params))
        }
        else if (variant == 'HOTJAR') {
            setSelectedIntegrationOption(15)
            setSelectedIntegrationId(integrationsData?.HOTJAR?.id)
            setIntegrationValue(JSON.parse(integrationsData?.HOTJAR?.params))
        }
        else if (variant == 'TRACKIFY') {
            setSelectedIntegrationOption(16)
            setSelectedIntegrationId(integrationsData?.TRACKIFY?.id)
            setIntegrationValue(JSON.parse(integrationsData?.TRACKIFY?.params))
        }
        else if (variant == 'SMSBUMP') {
            setSelectedIntegrationOption(17)
            setSelectedIntegrationId(integrationsData?.SMSBUMP?.id)
            setIntegrationValue(JSON.parse(integrationsData?.SMSBUMP?.params))
        }
        else if (variant == 'OMNISEND') {
            setSelectedIntegrationOption(18)
            setSelectedIntegrationId(integrationsData?.OMNISEND?.id)
            setIntegrationValue(JSON.parse(integrationsData?.OMNISEND?.params))
        }
        else if (variant == 'REDDIT') {
            setSelectedIntegrationOption(19)
            setSelectedIntegrationId(integrationsData?.REDDIT?.id)
            setIntegrationValue(JSON.parse(integrationsData?.REDDIT?.params))
        }
        else if (variant == 'QUORA') {
            setSelectedIntegrationOption(20)
            setSelectedIntegrationId(integrationsData?.QUORA?.id)
            setIntegrationValue(JSON.parse(integrationsData?.QUORA?.params))
        }
        else if (variant == 'POSTSCRIPT') {
            setSelectedIntegrationOption(21)
            setSelectedIntegrationId(integrationsData?.POSTSCRIPT?.id)
            setIntegrationValue(JSON.parse(integrationsData?.POSTSCRIPT?.params))
        }


        setIsIntegrationEdit(true)
        setIntegrationOptionSheet(true)
    }

    const handleUpdateIntegration = () => {
        document.getElementById('updateIntegration').click();
    }

    function getIntegrationValue(response) {

        function filterArray(value) {
            let res = response.find(item => item.type == value)
            return res
        }

        setIntegrationsData({
            FACEBOOK_PIXEL: filterArray('FACEBOOK_PIXEL'),
            FACEBOOK_CONVERSIONS_API: filterArray('FACEBOOK_CONVERSIONS_API'),
            GOOGLE_ANALYTICS: filterArray('GOOGLE_ANALYTICS'),
            GOOGLE_ADS: filterArray('GOOGLE_ADS'),
            GOOGLE_TAG_MANAGER: filterArray('GOOGLE_TAG_MANAGER'),
            KLAVIYO: filterArray('KLAVIYO'),
            TIKTOK: filterArray('TIKTOK'),
            PINTEREST: filterArray('PINTEREST'),
            SNAPCHAT: filterArray('SNAPCHAT'),
            TWITTER: filterArray('TWITTER'),
            TABOOLA: filterArray('TABOOLA'),
            OUTBRAIN: filterArray('OUTBRAIN'),
            BING_MICROSOFT_ADS: filterArray('BING_MICROSOFT_ADS'),
            GOOGLE_PLACES: filterArray('GOOGLE_PLACES'),
            HOTJAR: filterArray('HOTJAR'),
            TRACKIFY: filterArray('TRACKIFY'),
            SMSBUMP: filterArray('SMSBUMP'),
            OMNISEND: filterArray('OMNISEND'),
            REDDIT: filterArray('REDDIT'),
            QUORA: filterArray('QUORA'),
            POSTSCRIPT: filterArray('POSTSCRIPT'),
        })
    }

    const getIntegrationsData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${apiUrl}/api/integration`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('getIntegrationsData response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                getIntegrationValue(response.data?.data)

                // setIntegrationsData(response.data?.data)
                setToggleLoadData(false)
                setLoading(false)
            }

        } catch (error) {
            console.warn('getIntegrationsData Api Error', error.response);
            setToggleLoadData(false)
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

    const handleEnableIntegration = async (id, value) => {
        setBtnLoading((prev) => {
            let toggleId;
            if (prev[id]) {
                toggleId = { [id]: false };
            } else {
                toggleId = { [id]: true };
            }
            return { ...toggleId };
        });

        let enableValue = '';
        let offerStatus = ''
        if (value == 0) {
            enableValue = 1;
            offerStatus = 'Enabled'
        }
        else {
            enableValue = 0;
            offerStatus = 'Disabled'
        }

        let data = {
            isEnabled: enableValue,
        }
        try {
            const response = await axios.put(`${apiUrl}/api/integration/${id}/update`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('EnableIntegration response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                setToastMsg(offerStatus)
                setSucessToast(true)
                setToggleLoadData(true)
            }
            setBtnLoading(false)

        } catch (error) {
            console.warn('EnableIntegration Api Error', error.response);
            setToastMsg(error.response.data?.message?.message)
            setErrorToast(true)
            setBtnLoading(false)
        }
    }

    const updateIntegration = async () => {
        setBtnLoading((prev) => {
            let toggleId;
            if (prev[2]) {
                toggleId = { [2]: false };
            } else {
                toggleId = { [2]: true };
            }
            return { ...toggleId };
        });

        let offerStatus = '';

        let data = {
            params: JSON.stringify(integrationValue),
        }

        if (isIntegrationEdit) {
            offerStatus = 'Integration Updated Sucessfully'
        }
        else {
            offerStatus = 'Integration Connected Sucessfully'
        }

        try {
            const response = await axios.put(`${apiUrl}/api/integration/${selectedIntegrationId}/update`, data, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('updateIntegration response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                handleIntegrationOptionSheet()
                setToastMsg(offerStatus)
                setSucessToast(true)
                setToggleLoadData(true)
            }
            setBtnLoading(false)

        } catch (error) {
            console.warn('updateIntegration Api Error', error.response);
            if (error.response.data?.message) {
                setToastMsg(error.response.data?.message)
            }
            else {
                setToastMsg('Server Error')
            }
            setErrorToast(true)
            setBtnLoading(false)
        }

    }

    const disableIntegration = async () => {
        setBtnLoading((prev) => {
            let toggleId;
            if (prev[3]) {
                toggleId = { [3]: false };
            } else {
                toggleId = { [3]: true };
            }
            return { ...toggleId };
        });

        try {
            const response = await axios.delete(`${apiUrl}/api/integration/${selectedIntegrationId}/delete`, {
                headers: { "Authorization": `Bearer ${getAccessToken()}` }
            })

            // console.log('disableIntegration response: ', response.data);
            if (response.data.errors) {
                setToastMsg(response.data.message)
                setErrorToast(true)
            }
            else {
                handleIntegrationOptionSheet()
                setToastMsg('Integration Disconnected')
                setSucessToast(true)
                setToggleLoadData(true)
            }
            setBtnLoading(false)

        } catch (error) {
            console.warn('disableIntegration Api Error', error.response);
            if (error.response?.data?.message) {
                setToastMsg(error.response?.data?.message)
            }
            else {
                setToastMsg('Server Error')
            }
            setErrorToast(true)
            setBtnLoading(false)
        }
    }

    useEffect(() => {
        if (toggleLoadData) {
            getIntegrationsData()
        }
    }, [toggleLoadData])

    const SheetHeader = () => {
        const Content = ({ logo, title, desc }) => {
            return (
                <>
                    {logo}
                    <div className='Payment-Sheet-Heading'>
                        <Text variant="bodyMd" as="p" fontWeight="semibold">
                            {title}
                        </Text>
                        <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                            {desc}
                        </Text>
                    </div>
                </>
            )
        }
        return (
            <>
                {(() => {
                    switch (selectedIntegrationOption) {
                        case 1:
                            return (
                                <Content
                                    title='Facebook Pixel'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                            <rect width="42" height="42" rx="10" fill="#3B5998" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 21.5586C11 26.7789 14.7914 31.1197 19.75 32V24.4164H17.125V21.5H19.75V19.1664C19.75 16.5414 21.4414 15.0836 23.8336 15.0836C24.5914 15.0836 25.4086 15.2 26.1664 15.3164V18H24.825C23.5414 18 23.25 18.6414 23.25 19.4586V21.5H26.05L25.5836 24.4164H23.25V32C28.2086 31.1197 32 26.7798 32 21.5586C32 15.7513 27.275 11 21.5 11C15.725 11 11 15.7513 11 21.5586Z" fill="white" />
                                        </svg>
                                    }
                                />
                            )

                        case 2:
                            return (
                                <Content
                                    title='Facebook Conversions API'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                            <rect width="42" height="42" rx="10" fill="#3B5998" />
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 21.5586C11 26.7789 14.7914 31.1197 19.75 32V24.4164H17.125V21.5H19.75V19.1664C19.75 16.5414 21.4414 15.0836 23.8336 15.0836C24.5914 15.0836 25.4086 15.2 26.1664 15.3164V18H24.825C23.5414 18 23.25 18.6414 23.25 19.4586V21.5H26.05L25.5836 24.4164H23.25V32C28.2086 31.1197 32 26.7798 32 21.5586C32 15.7513 27.275 11 21.5 11C15.725 11 11 15.7513 11 21.5586Z" fill="white" />
                                        </svg>
                                    }
                                />
                            )

                        case 3:
                            return (
                                <Content
                                    title='Google Analytics'
                                    desc='Analytics Tool'
                                    logo={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                            <rect width="42" height="42" rx="10" fill="#FFF2CD" />
                                            <path d="M30.2634 11H26.4741C25.5509 11 24.793 11.7579 24.793 12.6811V31.9445H30.2634C31.1866 31.9445 31.9445 31.1867 31.9445 30.2635V12.6811C31.9445 11.758 31.1866 11 30.2634 11Z" fill="#F57C00" />
                                            <path d="M17.6141 19.2675V24.7792H12.6535C11.7441 24.7793 11 25.5234 11 26.4329V30.291C11 31.2005 11.744 31.9445 12.6535 31.9445H24.7794V17.614H19.2676C18.3581 17.614 17.6141 18.358 17.6141 19.2675Z" fill="#FFC107" />
                                            <path d="M24.7793 17.614V31.9445H30.2497C31.1729 31.9445 31.9308 31.1866 31.9308 30.2634V24.7792L24.7793 17.614Z" fill="url(#paint0_linear)" />
                                            <defs>
                                                <linearGradient id="paint0_linear" x1="21.2311" y1="21.231" x2="33.2413" y2="24.2221" gradientUnits="userSpaceOnUse">
                                                    <stop stopColor="#BF360C" stopOpacity="0.2" />
                                                    <stop offset="1" stopColor="#BF360C" stopOpacity="0.02" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 4:
                            return (
                                <Content
                                    title='Google Ads'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                            <rect width="42" height="42" rx="10" fill="#E9F2FF" />
                                            <g clipPath="url(#clip0)">
                                                <path d="M11.4826 25.6503L18.4546 13.7144C19.3402 14.2357 23.806 16.7072 24.5272 17.1772L17.5552 29.1138C16.7928 30.1212 10.5166 27.179 11.4826 25.6497V25.6503V25.6503Z" fill="#FBBC04" />
                                                <path d="M31.5149 25.6502L24.5429 13.7149C23.5683 12.0929 21.4691 11.5034 19.7449 12.4614C18.0206 13.4195 17.4956 15.4832 18.4703 17.1777L25.4423 29.1144C26.417 30.7358 28.5163 31.3252 30.2405 30.3672C31.8893 29.4091 32.4896 27.2722 31.5149 25.6516V25.6502V25.6502Z" fill="#4285F4" />
                                                <path d="M14.4998 30.8283C16.4327 30.8283 17.9996 29.3004 17.9996 27.4155C17.9996 25.5307 16.4327 24.0027 14.4998 24.0027C12.5669 24.0027 11 25.5307 11 27.4155C11 29.3004 12.5669 30.8283 14.4998 30.8283Z" fill="#34A853" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect width="21" height="18.8672" fill="white" transform="translate(11, 12)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 5:
                            return (
                                <Content
                                    title='Google Tag Manager'
                                    desc='Analytics Tool'
                                    logo={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                            <rect width="42" height="42" rx="10" fill="#E9F2FF" />
                                            <g clipPath="url(#clip0)">
                                                <path d="M11.4826 25.6503L18.4546 13.7144C19.3402 14.2357 23.806 16.7072 24.5272 17.1772L17.5552 29.1138C16.7928 30.1212 10.5166 27.179 11.4826 25.6497V25.6503V25.6503Z" fill="#FBBC04" />
                                                <path d="M31.5149 25.6502L24.5429 13.7149C23.5683 12.0929 21.4691 11.5034 19.7449 12.4614C18.0206 13.4195 17.4956 15.4832 18.4703 17.1777L25.4423 29.1144C26.417 30.7358 28.5163 31.3252 30.2405 30.3672C31.8893 29.4091 32.4896 27.2722 31.5149 25.6516V25.6502V25.6502Z" fill="#4285F4" />
                                                <path d="M14.4998 30.8283C16.4327 30.8283 17.9996 29.3004 17.9996 27.4155C17.9996 25.5307 16.4327 24.0027 14.4998 24.0027C12.5669 24.0027 11 25.5307 11 27.4155C11 29.3004 12.5669 30.8283 14.4998 30.8283Z" fill="#34A853" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect width="21" height="18.8672" fill="white" transform="translate(11, 12)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 6:
                            return (
                                <Content
                                    title='Klaviyo'
                                    desc='Email & SMS Sender'
                                    logo={
                                        <img src={klaviyoLogo} alt="klaviyoLogo" />
                                    }
                                />
                            )

                        case 7:
                            return (
                                <Content
                                    title='TikTok'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#010101" />
                                            <g clipPath="url(#clip0)">
                                                <path d="M21.459 10.5175C22.6052 10.5 23.7427 10.5087 24.8802 10.5C24.9502 11.8387 25.4315 13.2038 26.4115 14.1488C27.3915 15.12 28.774 15.5663 30.1215 15.715V19.2412C28.8615 19.1975 27.5927 18.935 26.4465 18.3925C25.9477 18.165 25.484 17.8763 25.029 17.5788C25.0202 20.1338 25.0377 22.6888 25.0115 25.235C24.9415 26.46 24.539 27.6763 23.8302 28.6825C22.684 30.3625 20.6977 31.4562 18.659 31.4912C17.4077 31.5612 16.1565 31.22 15.089 30.59C13.3215 29.5487 12.079 27.6412 11.8952 25.5938C11.8777 25.1562 11.869 24.7188 11.8865 24.29C12.044 22.6275 12.8665 21.035 14.144 19.95C15.5965 18.69 17.6265 18.0862 19.5252 18.445C19.5427 19.74 19.4902 21.035 19.4902 22.33C18.624 22.05 17.609 22.1288 16.8477 22.6538C16.2965 23.0125 15.8765 23.5638 15.6577 24.185C15.474 24.6313 15.5265 25.1212 15.5352 25.5938C15.7452 27.0287 17.1277 28.2363 18.5977 28.105C19.5777 28.0963 20.514 27.5275 21.0215 26.6963C21.1877 26.4075 21.3715 26.11 21.3802 25.7688C21.4677 24.2025 21.4327 22.645 21.4415 21.0788C21.4502 17.5525 21.4327 14.035 21.459 10.5175V10.5175Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect x="10.5" y="10.5" width="21" height="21" rx="10" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 8:
                            return (
                                <Content
                                    title='Pinterest'
                                    desc='Analytics Tool'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#CB1F27" />
                                            <g clipPath="url(#clip0)">
                                                <path d="M10.5 21.0002C10.5 25.2998 13.0855 28.9935 16.7852 30.6174C16.7556 29.8842 16.7799 29.004 16.9679 28.2063C17.1698 27.3539 18.319 22.4848 18.319 22.4848C18.319 22.4848 17.9835 21.8143 17.9835 20.8235C17.9835 19.2674 18.8854 18.1053 20.0086 18.1053C20.9637 18.1053 21.4251 18.8226 21.4251 19.6817C21.4251 20.6418 20.8127 22.0779 20.4978 23.408C20.2347 24.5218 21.0563 25.4303 22.1551 25.4303C24.1445 25.4303 25.4844 22.8752 25.4844 19.8477C25.4844 17.5464 23.9344 15.8239 21.1153 15.8239C17.9301 15.8239 15.9459 18.1992 15.9459 20.8524C15.9459 21.7672 16.2156 22.4123 16.6381 22.9119C16.8323 23.1413 16.8593 23.2336 16.789 23.4971C16.7386 23.6903 16.623 24.1554 16.5751 24.3397C16.5052 24.6057 16.2897 24.7008 16.0493 24.6026C14.5823 24.0037 13.899 22.3971 13.899 20.5911C13.899 17.6083 16.4146 14.0318 21.4034 14.0318C25.4123 14.0318 28.0508 16.9327 28.0508 20.0467C28.0508 24.1657 25.7608 27.243 22.3853 27.243C21.2517 27.243 20.1853 26.6302 19.8201 25.9342C19.8201 25.9342 19.2105 28.3534 19.0814 28.8206C18.8587 29.6302 18.423 30.4393 18.0246 31.07C18.9907 31.3557 19.9929 31.5007 21.0004 31.5006C26.7987 31.5006 31.5001 26.7994 31.5001 21.0002C31.5001 15.2011 26.7987 10.5 21.0004 10.5C15.2015 10.5 10.5 15.2011 10.5 21.0002Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect x="10.5" y="10.5" width="21" height="21" rx="10" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 9:
                            return (
                                <Content
                                    title='Snapchat'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#FFFC00" />
                                            <path d="M21.2028 10C22.1928 10 25.5497 10.2774 27.1342 13.822C27.6641 15.0148 27.5372 17.0421 27.4327 18.6702L27.4302 18.7286C27.4166 18.9102 27.4078 19.0744 27.4004 19.2386C27.5233 19.304 27.6617 19.335 27.8009 19.3281C28.1006 19.3119 28.4601 19.2087 28.8344 19.0284C28.9785 18.957 29.1376 18.9212 29.2983 18.9239C29.4799 18.9239 29.6578 18.9525 29.807 19.0134C30.256 19.1627 30.5408 19.4923 30.5408 19.8517C30.557 20.3007 30.1516 20.6913 29.3282 21.0196C29.2399 21.0482 29.118 21.0955 28.9849 21.139C28.5334 21.2746 27.8444 21.4984 27.6504 21.9487C27.5608 22.1738 27.5894 22.4723 27.7723 22.8156L27.7872 22.8317C27.8469 22.9673 29.3145 26.308 32.5806 26.8478C32.7004 26.8671 32.809 26.9294 32.8862 27.023C32.9633 27.1167 33.0037 27.2352 32.9997 27.3565C32.9997 27.4311 32.9836 27.5045 32.955 27.5816C32.7149 28.15 31.6826 28.5704 29.8083 28.8515C29.7498 28.9423 29.6889 29.2271 29.6441 29.4224C29.6167 29.6015 29.5695 29.7818 29.511 29.9746C29.4352 30.2457 29.2411 30.3788 28.9563 30.3788H28.9265C28.7451 30.3704 28.5649 30.3459 28.3879 30.3054C27.9694 30.2151 27.5424 30.1701 27.1143 30.1711C26.8158 30.1711 26.5173 30.186 26.2039 30.2457C25.6032 30.3502 25.0796 30.7096 24.4801 31.1288C23.6256 31.727 22.653 32.4173 21.1854 32.4173C21.1257 32.4173 21.066 32.4024 21.0038 32.4024H20.8558C19.3869 32.4024 18.4292 31.727 17.576 31.1139C16.9778 30.6935 16.4691 30.3353 15.8684 30.2296C15.5615 30.1837 15.252 30.1588 14.9418 30.1549C14.4007 30.1549 13.9828 30.2445 13.6694 30.3042C13.458 30.3477 13.2789 30.3776 13.1284 30.3776C12.9972 30.3875 12.8667 30.351 12.7599 30.2743C12.653 30.1977 12.5765 30.0858 12.5438 29.9584C12.4841 29.7669 12.4555 29.5691 12.4107 29.3913C12.3635 29.2097 12.305 28.8987 12.2453 28.8216C10.3262 28.599 9.29391 28.1786 9.05511 27.5953C9.02213 27.5246 9.00352 27.4481 9.00038 27.3702C8.9956 27.2487 9.03568 27.1297 9.11298 27.0359C9.19028 26.9421 9.29939 26.88 9.41953 26.8615C12.6844 26.3217 14.152 22.9822 14.2129 22.8417L14.2291 22.8131C14.4094 22.4686 14.453 22.1663 14.3485 21.9437C14.1545 21.5096 13.4642 21.2858 13.0177 21.1353C12.8989 21.1053 12.7828 21.0653 12.6707 21.0159C11.5637 20.5806 11.4133 20.0856 11.4742 19.7423C11.5637 19.2647 12.1471 18.95 12.6421 18.95C12.7876 18.95 12.912 18.9786 13.0252 19.0246C13.4443 19.2174 13.8149 19.3244 14.1296 19.3244C14.2908 19.3303 14.4508 19.2938 14.5935 19.2187L14.5425 18.649C14.443 17.0234 14.3162 14.9986 14.8497 13.8121C16.387 10.2848 19.7364 10.0137 20.7252 10.0137L21.1418 10H21.2028Z" fill="white" />
                                            <path d="M20.9894 11.2811C24.2105 11.2822 26.8936 13.9638 26.8975 17.1927C26.8984 17.949 26.9217 18.6454 26.9644 19.287C26.9908 19.6828 27.32 19.9761 27.6975 19.9761C27.7531 19.9761 27.8097 19.9698 27.8666 19.9564L28.8757 19.7199C28.9186 19.7098 28.9617 19.705 29.0043 19.705C29.2606 19.705 29.4965 19.8801 29.5541 20.1394C29.6354 20.5059 29.4301 20.8762 29.0749 21.0008L27.5432 21.6191C27.1565 21.7752 26.9488 22.196 27.0577 22.5986C28.2866 27.1417 31.7189 26.6692 31.7189 27.2611C31.7189 28.0043 29.1318 28.1093 28.8981 28.3431C28.6644 28.5769 28.888 29.7114 28.3657 29.931C28.2673 29.9724 28.1274 29.9868 27.9568 29.9868C27.5635 29.9868 27.0072 29.91 26.4208 29.91C25.9122 29.91 25.381 29.9678 24.914 30.1835C23.6751 30.7558 22.4807 31.8248 21 31.8248C19.5194 31.8248 18.3249 30.7558 17.086 30.1835C16.6189 29.9677 16.0879 29.91 15.5792 29.91C14.9929 29.91 14.4365 29.9868 14.0432 29.9868C13.8727 29.9868 13.7327 29.9724 13.6343 29.931C13.1121 29.7114 13.3357 28.5769 13.102 28.3431C12.8682 28.1093 10.2811 28.0043 10.2811 27.261C10.2811 26.6691 13.7135 27.1416 14.9423 22.5986C15.0512 22.196 14.8435 21.7752 14.4568 21.619L12.9251 21.0007C12.5699 20.8762 12.3645 20.5059 12.4459 20.1394C12.5035 19.88 12.7394 19.7049 12.9957 19.7049C13.0383 19.7049 13.0814 19.7097 13.1243 19.7198L14.1334 19.9564C14.1903 19.9697 14.2469 19.9761 14.3025 19.9761C14.68 19.9761 15.0092 19.6827 15.0356 19.2869C15.0783 18.6454 15.1016 17.949 15.1026 17.1927C15.1064 13.9638 17.7682 11.2823 20.9894 11.2811ZM20.9898 10H20.9893H20.9889C20.0274 10.0003 19.0908 10.1935 18.2052 10.5743C17.3551 10.9397 16.59 11.4607 15.9312 12.123C15.2733 12.7843 14.7555 13.5521 14.3922 14.4051C14.0146 15.292 13.8225 16.2293 13.8213 17.1912C13.8208 17.6634 13.811 18.1217 13.7921 18.5605L13.4167 18.4725C13.279 18.4402 13.1373 18.4238 12.9958 18.4237C12.5872 18.4237 12.1842 18.5618 11.861 18.8126C11.5237 19.0742 11.2872 19.4469 11.1951 19.8618C10.976 20.8494 11.5213 21.8465 12.4664 22.1971L13.5905 22.6509C12.8461 24.9357 11.4735 25.3735 10.5492 25.6684C10.304 25.7467 10.0921 25.8143 9.89043 25.9144C9.08676 26.3133 9 26.989 9 27.261C9 27.782 9.24659 28.2575 9.69442 28.5998C9.91739 28.7702 10.1936 28.9108 10.5388 29.0297C11.0093 29.1916 11.5547 29.2944 11.9979 29.3768C12.0194 29.5411 12.0508 29.7175 12.1037 29.8953C12.3235 30.6338 12.7873 30.9645 13.1377 31.1118C13.4702 31.2517 13.8137 31.2678 14.0432 31.2678C14.2677 31.2678 14.5049 31.2502 14.7561 31.2316C15.0256 31.2117 15.3043 31.1911 15.5792 31.1911C16.0053 31.1911 16.3224 31.2419 16.5488 31.3464C16.8596 31.49 17.1892 31.6836 17.5382 31.8886C18.5097 32.4591 19.6108 33.1058 21 33.1058C22.3893 33.1058 23.4903 32.4591 24.4618 31.8886C24.8108 31.6836 25.1404 31.49 25.4513 31.3464C25.6776 31.2418 25.9948 31.1911 26.4208 31.1911C26.6957 31.1911 26.9744 31.2117 27.2439 31.2316C27.4951 31.2502 27.7323 31.2678 27.9568 31.2678C28.1863 31.2678 28.5298 31.2517 28.8623 31.1118C29.2127 30.9645 29.6765 30.6338 29.8963 29.8953C29.9492 29.7175 29.9807 29.5411 30.0021 29.3768C30.4453 29.2944 30.9908 29.1916 31.4612 29.0297C31.8065 28.9108 32.0826 28.7702 32.3056 28.5998C32.7534 28.2575 33 27.782 33 27.261C33 26.989 32.9132 26.3133 32.1095 25.9144C31.9078 25.8143 31.6959 25.7467 31.4507 25.6685C30.5264 25.3736 29.1538 24.9357 28.4094 22.6509L29.5335 22.1972C30.4785 21.8465 31.0239 20.8494 30.8048 19.8618C30.7127 19.4469 30.4762 19.0742 30.1389 18.8126C29.8157 18.5619 29.4128 18.4237 29.0043 18.4237C28.8628 18.4237 28.7212 18.4401 28.5833 18.4724L28.2078 18.5605C28.189 18.1217 28.1792 17.6634 28.1786 17.1911C28.1774 16.2285 27.9838 15.2902 27.6031 14.4021C27.2377 13.5496 26.7171 12.782 26.0559 12.1206C25.3946 11.4593 24.6274 10.9388 23.7756 10.5736C22.8882 10.1933 21.951 10.0004 20.9898 10Z" fill="#050505" />
                                        </svg>
                                    }
                                />
                            )

                        case 10:
                            return (
                                <Content
                                    title='Twitter'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#1DA1F2" />
                                            <path d="M34 13.3089C33.1169 13.7005 32.1679 13.9651 31.1719 14.0842C32.1887 13.4748 32.9693 12.5098 33.3369 11.3601C32.3704 11.9336 31.3129 12.3377 30.2103 12.5549C29.312 11.598 28.0324 11 26.6162 11C23.8968 11 21.6921 13.2046 21.6921 15.9237C21.6921 16.3097 21.7357 16.6855 21.8196 17.0459C17.7274 16.8405 14.0993 14.8803 11.6707 11.9013C11.247 12.6285 11.0042 13.4744 11.0042 14.3767C11.0042 16.085 11.8735 17.592 13.1946 18.4751C12.4127 18.4506 11.648 18.2394 10.9643 17.8591C10.964 17.8797 10.964 17.9004 10.964 17.9211C10.964 20.3067 12.6613 22.2969 14.9137 22.7492C14.1886 22.9464 13.4281 22.9753 12.6902 22.8336C13.3167 24.7898 15.1352 26.2133 17.2897 26.2531C15.6046 27.5737 13.4814 28.3609 11.1746 28.3609C10.7771 28.3609 10.3852 28.3376 10 28.2921C12.179 29.6892 14.7672 30.5043 17.5478 30.5043C26.6047 30.5043 31.5573 23.0014 31.5573 16.4948C31.5573 16.2812 31.5526 16.0689 31.543 15.8577C32.507 15.1609 33.339 14.2978 34 13.3089Z" fill="white" />
                                        </svg>
                                    }
                                />
                            )

                        case 11:
                            return (
                                <Content
                                    title='Taboola'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#004B7A" />
                                            <g clipPath="url(#clip0)">
                                                <path d="M15.4403 15.2692C13.7365 15.261 13.5001 16.9159 13.4919 18.1632C13.4838 19.4105 13.7039 21.0898 15.4077 21.1061C17.1115 21.1143 17.3479 19.4349 17.3561 18.1877C17.3642 16.9404 17.1441 15.2773 15.4403 15.2692ZM15.3914 24.3752C10.9648 24.3425 8.9838 21.4078 9.0001 18.1387C9.0164 14.8697 11.03 11.9757 15.4566 12.0002C19.8833 12.0246 21.8642 14.9431 21.8479 18.2121C21.8316 21.4811 19.818 24.3996 15.3914 24.3752Z" fill="white" />
                                                <path d="M26.5925 15.2692C24.8968 15.261 24.6604 16.9159 24.6522 18.1632C24.6441 19.4105 24.8642 21.0898 26.568 21.1061C28.2718 21.1143 28.5082 19.4349 28.5164 18.1877C28.5164 16.9404 28.2963 15.2773 26.5925 15.2692ZM26.5436 24.3752C22.1169 24.3507 20.1359 21.4078 20.1604 18.1387C20.1767 14.8697 22.1903 11.9757 26.6169 12.0002C31.0436 12.0246 33.0245 14.9431 33.0082 18.2121C32.9838 21.4811 30.9702 24.3996 26.5436 24.3752Z" fill="white" />
                                                <path d="M10.6879 24.3755C13.8754 25.8021 17.1933 26.438 20.7966 26.4543C24.5874 26.4787 27.4651 25.7614 31.1009 24.3755L31.0765 28.3048C27.8156 29.919 24.2857 30.7912 20.764 30.7668C16.9243 30.7423 14.1607 29.9597 10.6553 28.3048L10.6879 24.3755Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0">
                                                    <rect width="24" height="18.7663" fill="white" transform="translate(9 12)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 12:
                            return (
                                <Content
                                    title='Outbrain'
                                    desc='Ads Tracking'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="42" height="42" rx="10" fill="#F18421" />
                                            <path d="M32.0791 16.1442C31.4651 14.693 30.6279 13.4372 29.5395 12.3767C28.4512 11.3163 27.1953 10.4791 25.7442 9.89302C24.293 9.27907 22.7023 9 21 9C19.2977 9 17.707 9.30698 16.2558 9.89302C14.8047 10.507 13.5209 11.3163 12.4605 12.3767C11.3721 13.4372 10.5349 14.693 9.92093 16.1442C9.30698 17.5954 9 19.1581 9 20.8326C9 22.507 9.30698 24.0698 9.92093 25.5209C10.5349 26.9721 11.3721 28.2279 12.4605 29.2884C13.5488 30.3488 14.8047 31.186 16.2558 31.7721C17.707 32.386 19.2977 32.6651 21 32.6651C22.7023 32.6651 24.293 32.3581 25.7442 31.7721C27.1953 31.1581 28.4791 30.3488 29.5395 29.2884C30.6279 28.2279 31.4651 26.9721 32.0791 25.5209C32.693 24.0698 33 22.507 33 20.8326C33 19.1581 32.693 17.5954 32.0791 16.1442ZM13.8 19.9674C15.1395 19.5209 16.9256 18.9628 16.9256 18.9628C20.8326 17.707 21.3628 16.2558 21.3628 16.2558C21.3628 16.2558 22.1721 17.7349 25.0186 18.6837C25.0186 18.6837 26.5814 19.186 28.0326 19.7163C28.1163 19.8558 28.1721 19.9953 28.2558 20.1628C28.507 20.7767 28.6744 21.3907 28.786 22.0605H26.7767V22.0326C26.6372 21.6977 26.4419 21.3907 26.1628 21.1395C25.9116 20.8884 25.6047 20.693 25.2698 20.5535C24.9349 20.414 24.5442 20.3302 24.1535 20.3302C23.7349 20.3302 23.3721 20.414 23.0372 20.5535C22.7023 20.693 22.3953 20.8884 22.1442 21.1395C21.893 21.3907 21.6977 21.6977 21.5302 22.0326C21.4744 22.1442 21.4465 22.2558 21.4186 22.3674H20.6651C20.6372 22.2558 20.6093 22.1442 20.5535 22.0326C20.414 21.6977 20.2186 21.3907 19.9395 21.1395C19.6884 20.8884 19.3814 20.693 19.0465 20.5535C18.7116 20.414 18.3209 20.3302 17.9302 20.3302C17.5116 20.3302 17.1488 20.414 16.814 20.5535C16.4791 20.693 16.1721 20.8884 15.9209 21.1395C15.6698 21.3907 15.4744 21.6977 15.307 22.0326C15.307 22.0326 15.307 22.0605 15.2791 22.0605H13.2698C13.3535 21.3907 13.5488 20.7488 13.8 20.1628C13.7442 20.107 13.7721 20.0512 13.8 19.9674ZM25.8279 23.1767C25.8279 23.4279 25.7721 23.6233 25.6884 23.8465C25.6047 24.0419 25.493 24.2372 25.3256 24.3767C25.186 24.5163 24.9907 24.6558 24.7953 24.7395C24.6 24.8233 24.3767 24.8791 24.1256 24.8791C23.8744 24.8791 23.6512 24.8233 23.4558 24.7395C23.2605 24.6558 23.0651 24.5442 22.9256 24.3767C22.786 24.2372 22.6465 24.0419 22.5628 23.8465C22.4791 23.6512 22.4233 23.4279 22.4233 23.1767C22.4233 22.9535 22.4791 22.7302 22.5628 22.507C22.6465 22.3116 22.7581 22.1163 22.9256 21.9767C23.0651 21.8372 23.2605 21.6977 23.4558 21.614C23.6512 21.5302 23.8744 21.4744 24.1256 21.4744C24.3767 21.4744 24.6 21.5302 24.7953 21.614C24.9907 21.6977 25.186 21.8093 25.3256 21.9767C25.4651 22.1163 25.6047 22.3116 25.6884 22.507C25.7721 22.7023 25.8279 22.9256 25.8279 23.1767ZM19.5488 23.1767C19.5488 23.4279 19.493 23.6233 19.4093 23.8465C19.3256 24.0419 19.214 24.2372 19.0465 24.3767C18.8791 24.5163 18.7116 24.6558 18.5163 24.7395C18.3209 24.8233 18.0977 24.8791 17.8465 24.8791C17.5953 24.8791 17.3721 24.8233 17.1767 24.7395C16.9814 24.6558 16.786 24.5442 16.6465 24.3767C16.507 24.2372 16.3674 24.0419 16.2837 23.8465C16.2 23.6512 16.1442 23.4279 16.1442 23.1767C16.1442 22.9535 16.2 22.7302 16.2837 22.507C16.3674 22.3116 16.4791 22.1163 16.6465 21.9767C16.786 21.8372 16.9814 21.6977 17.1767 21.614C17.3721 21.5302 17.5953 21.4744 17.8465 21.4744C18.0977 21.4744 18.3209 21.5302 18.5163 21.614C18.7116 21.6977 18.907 21.8093 19.0465 21.9767C19.186 22.1163 19.3256 22.3116 19.4093 22.507C19.493 22.7023 19.5488 22.9256 19.5488 23.1767ZM26.5814 28.786C25.8837 29.4837 25.0465 30.014 24.0977 30.4326C23.1488 30.8233 22.1163 31.0186 21 31.0186C19.8837 31.0186 18.8512 30.8233 17.9023 30.4326C16.9535 30.0419 16.1163 29.4837 15.4186 28.786C14.7209 28.0884 14.1628 27.2791 13.7442 26.3302C13.3535 25.4093 13.1581 24.4326 13.1302 23.3721H15.0279C15.0558 23.707 15.1116 24.014 15.2512 24.293C15.3907 24.6279 15.586 24.9349 15.8651 25.186C16.1163 25.4372 16.4233 25.6326 16.7581 25.7721C17.093 25.9116 17.4837 25.9953 17.8744 25.9953C18.293 25.9953 18.6558 25.9116 18.9907 25.7721C19.3256 25.6326 19.6326 25.4372 19.8837 25.186C20.1349 24.9349 20.3302 24.6279 20.4977 24.293C20.5814 24.0698 20.6651 23.8186 20.693 23.5674H21.307C21.3349 23.8186 21.3907 24.0698 21.5023 24.293C21.6419 24.6279 21.8372 24.9349 22.1163 25.186C22.3674 25.4372 22.6744 25.6326 23.0093 25.7721C23.3442 25.9116 23.7349 25.9953 24.1256 25.9953C24.5442 25.9953 24.907 25.9116 25.2419 25.7721C25.5767 25.6326 25.8837 25.4372 26.1349 25.186C26.386 24.9349 26.5814 24.6279 26.7488 24.293C26.8605 24.014 26.9442 23.707 26.9721 23.3721H28.8698C28.8698 24.4326 28.6465 25.4372 28.2837 26.3302C27.8651 27.2791 27.307 28.1163 26.5814 28.786Z" fill="white" />
                                        </svg>
                                    }
                                />
                            )

                        case 13:
                            return (
                                <Content
                                    title='Bing Microsoft Ads'
                                    desc='Ads Tracking'
                                    logo={
                                        <img src={bingLogo} alt="bingLogo" />
                                    }
                                />
                            )

                        case 14:
                            return (
                                <Content
                                    title='Google Places'
                                    desc='Address Autofill'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_929_249)">
                                                <path d="M399.883 0H0.117188C0.0524666 0 0 0.0524666 0 0.117188V399.883C0 399.948 0.0524666 400 0.117188 400H399.883C399.948 400 400 399.948 400 399.883V0.117188C400 0.0524666 399.948 0 399.883 0Z" fill="white" />
                                                <path d="M0 400V0H400L0 400Z" fill="#35A85B" />
                                                <path d="M200 225L25 400H375L200 225Z" fill="#5881CA" />
                                                <path d="M225 200L400 25V375L225 200Z" fill="#C1C0BE" />
                                                <path d="M0 400L400 0Z" fill="black" />
                                                <path d="M0 400L400 0" stroke="#FADB2A" strokeWidth="71" />
                                                <path d="M136.719 135.156H175.781C175.386 144.807 171.937 154.018 166.009 161.252C160.082 168.486 152.035 173.304 143.214 174.9C134.393 176.497 125.331 174.776 117.544 170.025C109.756 165.274 103.714 157.78 100.427 148.796C97.1407 139.812 96.8081 129.882 99.4853 120.665C102.163 111.449 107.687 103.503 115.137 98.1566C122.586 92.8102 131.509 90.3867 140.414 91.291C149.319 92.1953 157.667 96.3726 164.062 103.125" stroke="#F2F2F2" strokeWidth="22" />
                                                <path d="M275.781 66.4062C275.781 51.9022 281.543 37.9922 291.799 27.7363C302.055 17.4805 315.965 11.7188 330.469 11.7188C344.973 11.7188 358.883 17.4805 369.139 27.7363C379.395 37.9922 385.156 51.9022 385.156 66.4062C385.156 121.094 330.469 121.094 330.469 189.062C330.469 121.094 275.781 121.094 275.781 66.4062Z" fill="#DE3738" />
                                                <path d="M330.469 89.0625C341.256 89.0625 350 80.3181 350 69.5312C350 58.7444 341.256 50 330.469 50C319.682 50 310.938 58.7444 310.938 69.5312C310.938 80.3181 319.682 89.0625 330.469 89.0625Z" fill="#7D2426" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_929_249">
                                                    <rect width="400" height="400" rx="90" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    }
                                />
                            )

                        case 15:
                            return (
                                <Content
                                    title='Hotjar'
                                    desc='Analytics & Tracking Tool'
                                    logo={
                                        <img src={hotjarLogo} alt="hotjarLogo" />
                                    }
                                />
                            )

                        case 16:
                            return (
                                <Content
                                    title='Trackify'
                                    desc='Analytics & Ads Tracking'
                                    logo={
                                        <img src={trackifyLogo} alt="trackifyLogo" />
                                    }
                                />
                            )

                        case 17:
                            return (
                                <Content
                                    title='SMSBump'
                                    desc='SMS Sender'
                                    logo={
                                        <img src={SMSBumpLogo} alt="SMSBumpLogo" />
                                    }
                                />
                            )

                        case 18:
                            return (
                                <Content
                                    title='Omnisend'
                                    desc='Email & SMS Sender'
                                    logo={
                                        <img src={omnisendLogo} alt="omnisendLogo" />
                                    }
                                />
                            )

                        case 19:
                            return (
                                <Content
                                    title='Reddit'
                                    desc='Ads Tracking'
                                    logo={
                                        <img src={redditLogo} alt="redditLogo" />
                                    }
                                />
                            )

                        case 20:
                            return (
                                <Content
                                    title='Quora'
                                    desc='Ads Trackingr'
                                    logo={
                                        <img src={quoraLogo} alt="quoraLogo" />
                                    }
                                />
                            )

                        case 21:
                            return (
                                <Content
                                    title='Postscript'
                                    desc='SMS Sender'
                                    logo={
                                        <svg width="42" height="42" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="400" height="400" rx="100" fill="#3598D3" />
                                            <path d="M110.576 12.9476C136.037 2.54531 163.444 -1.68612 190.851 0.605906C192.619 0.782216 194.21 1.13484 195.802 1.48745C186.961 3.95579 177.943 5.36627 169.456 8.71615C164.858 9.95032 160.438 11.1845 155.841 12.2424C94.1316 24.4077 42.1473 73.5982 24.4655 133.544C23.2278 136.893 21.8133 140.243 20.5756 143.593C9.78974 165.279 5.36928 189.434 3.42429 213.236C1.83293 207.946 0.948848 202.481 0.772031 197.015C-2.76432 158.579 5.89974 119.791 25.7033 86.6451C45.1532 53.6751 75.0353 27.7576 110.576 12.9476ZM205.703 1.48745C249.908 -4.15446 295.88 9.95033 330.89 37.4547C369.259 67.6036 393.837 112.034 398.965 160.519C401.44 185.379 399.672 210.944 391.538 234.569V233.159C391.538 227.869 391.715 222.58 392.069 217.291C393.837 166.161 373.149 114.149 335.134 79.5927C332.128 76.4191 328.945 73.4218 325.939 70.2483C311.263 52.2647 292.874 37.631 272.01 27.405C264.76 23.5262 257.511 19.8237 250.084 16.2975C236.293 8.53985 220.556 6.0715 205.703 1.13483M4.13155 223.109C7.31426 231.395 9.43611 240.035 12.7956 248.145C20.3988 267.363 31.1846 284.994 44.7995 300.509C56.2927 312.851 68.6699 324.84 83.5226 332.95L89.1807 337.71C101.381 351.815 117.118 362.923 133.385 371.738C164.682 388.311 200.399 395.011 235.585 390.956C182.54 409.292 120.654 399.242 75.9194 365.391C37.1964 336.3 11.7347 292.928 5.19246 244.971C4.66201 237.919 3.42428 230.514 4.13155 223.109ZM322.226 329.071C353.346 308.619 376.155 277.06 389.24 242.679C381.813 289.049 356.352 330.482 318.513 358.339C300.831 371.385 280.851 380.906 259.633 386.548C253.621 388.311 247.432 389.545 241.244 390.074C251.499 384.785 262.285 380.73 272.01 374.383C289.338 363.451 305.428 350.052 317.452 333.479C319.043 332.068 320.635 330.658 322.226 329.071Z" fill="#3598D3" />
                                            <path d="M132.855 156.464C140.458 147.119 153.012 143.064 164.682 145.003C178.12 146.414 189.613 155.935 195.802 167.571C199.868 175.858 201.636 185.202 200.929 194.37C200.752 208.122 194.564 220.993 183.955 229.632C173.699 237.742 160.084 240.034 147.707 235.979C141.872 233.687 136.745 229.632 133.031 224.519C133.031 243.032 133.031 261.544 133.031 280.233H104.564C104.564 235.45 104.564 190.491 104.564 145.709C114.112 145.709 123.66 145.709 133.208 145.709C133.031 149.235 133.031 152.937 132.855 156.464Z" fill="white" />
                                            <path d="M149.299 169.334C144.701 170.216 140.458 172.684 137.452 176.387C132.501 182.558 132.324 191.021 133.739 198.426C136.214 209.886 150.006 217.291 160.615 211.825C170.693 207.417 174.23 194.899 171.578 184.85C169.456 174.624 159.731 167.748 149.299 169.334Z" fill="white" />
                                            <path d="M219.141 156.111C228.159 146.414 242.128 143.946 254.858 144.827C265.821 145.356 277.491 149.059 284.741 157.874C288.807 162.634 290.222 168.805 290.929 174.8C281.381 174.8 271.656 174.8 262.108 174.8C260.87 172.508 260.693 169.334 258.041 168.1C253.09 165.984 247.255 165.984 242.304 168.276C239.652 169.687 238.768 172.86 240.006 175.329C240.359 176.034 241.067 176.739 241.774 177.268C247.963 181.676 255.919 181.147 262.815 183.263C269.711 185.378 277.137 187.142 283.149 191.549C292.521 198.954 293.405 213.941 286.509 223.285C279.613 232.629 267.413 237.213 255.919 237.742C243.719 238.448 230.458 235.979 221.086 227.693C215.075 222.58 212.776 214.822 211.892 207.417H240.536C242.481 217.114 256.803 218.525 262.462 211.472C264.23 209.18 263.876 205.654 261.578 203.891C261.224 203.538 260.693 203.362 260.34 203.186C247.609 197.191 232.049 198.602 220.556 189.962C209.593 182.381 210.124 164.926 219.141 156.111Z" fill="white" />
                                            <path d="M169.456 8.71613C177.943 5.36624 187.137 3.77946 195.802 1.48743C198.984 1.13481 202.344 1.13481 205.526 1.31112C220.379 6.2478 236.116 8.71613 249.908 16.4738C240.713 15.0633 232.049 11.8897 222.855 10.6555C205.173 7.12934 187.314 8.36351 169.456 8.71613ZM24.4655 133.543C41.9704 73.5981 94.1316 24.4077 155.841 12.2423C151.244 15.2396 146.469 17.8842 141.519 20.3526C119.77 31.6364 100.674 47.5043 85.8211 67.0747L80.6935 71.6587C68.1394 79.24 57.7072 89.8186 47.8054 100.574C38.7877 110.623 31.8918 122.26 24.4655 133.543ZM272.01 27.5813C292.874 37.8072 311.263 52.441 325.939 70.4246C320.104 67.251 314.623 63.3722 308.965 60.0223C307.373 58.6118 305.782 57.3776 304.191 55.9672C294.642 45.036 282.619 37.102 272.01 27.5813ZM335.134 79.769C373.149 114.326 393.837 166.337 392.069 217.467C391.715 222.756 391.538 228.046 391.538 233.335C391.185 236.508 390.477 239.858 389.416 242.856C376.155 277.236 353.523 308.972 322.226 329.247C324.525 325.016 327 320.961 329.652 316.906C340.261 301.214 346.273 283.054 352.108 265.247C359.711 250.261 363.955 234.04 366.961 217.643C369.082 206.888 368.552 195.957 368.552 185.202C369.259 153.466 359.534 122.083 343.621 94.9316C340.261 89.9949 337.432 85.0583 335.134 79.769ZM3.42427 213.236C5.36926 189.257 9.78971 165.103 20.5756 143.593C18.8074 155.935 16.6856 168.277 15.9783 180.795C15.9783 198.778 17.2161 216.762 21.6365 234.216C30.1237 266.657 47.275 297.159 72.383 319.727C76.6266 323.782 80.3398 328.366 83.6993 333.126C68.8467 325.016 56.4695 313.027 44.9763 300.685C31.3614 285.17 20.5755 267.363 12.9724 248.321C9.61287 240.211 7.49107 231.572 4.30836 223.285C3.60109 219.759 3.24745 216.585 3.42427 213.236ZM292.344 345.997C301.008 342.471 308.965 337.181 317.629 333.302C305.428 349.876 289.338 363.275 272.01 374.206C262.285 380.553 251.499 384.609 241.244 389.898C239.475 390.427 237.53 390.956 235.762 391.132C200.576 395.187 164.858 388.487 133.562 371.914C117.118 363.099 101.558 351.991 89.3575 337.887C99.2593 341.942 108.631 347.055 118.532 351.11C134.269 360.102 152.128 363.98 169.809 366.978C180.242 368.212 190.851 367.507 201.46 367.683C217.904 367.683 233.994 363.451 249.554 358.867C264.23 355.87 278.906 352.344 292.344 345.997Z" fill="#0764B1" />
                                            <path d="M155.841 12.2421C160.438 11.1842 165.035 9.95007 169.456 8.71591C187.314 8.36329 205.173 7.12912 222.855 10.479C232.049 11.7132 240.713 15.0631 249.908 16.2972C257.334 19.6471 264.76 23.3496 271.833 27.4047C282.442 36.9255 294.466 44.8594 304.014 55.6143C277.491 40.0991 246.725 31.1072 215.782 31.8125C192.796 31.1072 169.456 32.8703 147.354 39.9227C137.629 43.2726 128.257 47.5041 118.709 51.3829C106.862 54.7328 96.4302 61.0799 85.6443 66.8981C100.497 47.5041 119.416 31.4599 141.342 20.176C146.469 17.884 151.244 15.2394 155.841 12.2421ZM308.788 59.8458C314.446 63.1956 319.927 67.0744 325.762 70.248C328.768 73.4216 331.951 76.4189 334.957 79.5924C337.255 84.8817 340.261 89.8184 343.621 94.4025C359.534 121.731 369.259 153.114 368.552 184.673C368.375 195.428 368.906 206.359 366.961 217.114C363.955 233.511 359.711 249.908 352.108 264.718C352.638 260.839 352.815 257.136 353.523 253.258C359.711 233.687 363.778 213.235 363.071 192.783C363.424 175.505 359.711 158.227 354.23 141.83C349.456 127.901 342.206 115.031 335.487 101.984C329.652 86.4685 318.513 73.5979 308.788 59.8458ZM47.8054 100.573C57.7072 89.8184 68.1394 79.2398 80.6934 71.6585C76.4498 80.474 69.9076 87.879 66.7249 97.2234C60.5363 107.449 53.8172 117.499 48.8663 128.607C35.9587 157.874 31.7151 190.315 36.6659 221.874C37.9037 231.219 40.7327 240.211 42.6777 249.379C45.33 266.833 52.049 283.23 60.1826 298.922C63.719 306.151 68.6698 312.674 72.383 319.903C47.275 297.335 30.1237 266.833 21.6365 234.392C17.0392 216.938 15.8015 198.954 15.9783 180.971C16.8624 168.453 18.9842 156.111 20.7524 143.769C22.1669 140.419 23.4046 137.069 24.6423 133.72C31.8918 122.436 38.7877 110.799 47.8054 100.573ZM118.709 351.11C139.22 356.575 160.438 362.041 181.833 359.572C193.149 359.749 204.466 359.22 215.605 359.572C226.921 361.336 238.414 358.867 249.731 358.691C234.171 363.275 218.08 367.506 201.636 367.506C191.027 367.33 180.418 368.035 169.986 366.801C152.304 363.98 134.446 360.101 118.709 351.11Z" fill="#0C4EA2" />
                                            <path d="M147.354 40.099C169.456 33.0466 192.796 31.2835 215.782 31.9887C226.568 34.6334 237.884 35.3386 248.493 39.0411C268.297 46.0935 287.746 55.438 303.837 69.1901C315.507 79.0635 325.409 90.6999 335.134 102.336C341.853 115.383 349.102 128.254 353.876 142.182C359.357 158.579 362.894 175.681 362.717 192.96C363.424 213.588 359.358 234.04 353.169 253.434C345.566 271.77 335.664 289.401 322.403 304.211C310.025 318.316 295.173 330.129 278.729 339.12C259.456 350.757 237.177 356.046 215.251 359.572C203.935 359.22 192.619 359.572 181.479 359.572C170.517 357.633 159.377 355.87 148.768 352.52C135.153 348.112 122.069 342.118 110.045 334.36C100.32 328.366 92.0098 320.784 83.5226 313.379C69.0235 298.393 56.2927 281.467 48.1591 262.073C46.3909 257.842 44.4459 253.61 42.5009 249.379C40.7327 240.211 37.7269 231.219 36.4891 221.874C31.5383 190.315 35.7819 158.05 48.6895 128.607C53.6404 117.675 60.3595 107.626 66.5481 97.2234C72.0294 91.2288 76.8035 84.3527 82.9921 79.0635C90.9488 72.0111 98.9056 64.9587 108.1 59.3168C111.813 57.0247 115.35 54.3801 118.709 51.5591C128.257 47.6803 137.805 43.4489 147.354 40.099ZM133.031 156.64C133.031 152.937 133.031 149.411 133.031 145.709C123.483 145.709 113.935 145.709 104.387 145.709C104.387 190.491 104.387 235.45 104.387 280.233H132.855C132.855 261.72 132.855 243.208 132.855 224.519C136.568 229.632 141.695 233.687 147.53 235.979C159.908 240.211 173.523 237.742 183.778 229.632C194.564 220.993 200.752 207.946 200.752 194.194C201.46 185.026 199.692 175.681 195.625 167.395C189.613 155.758 177.943 146.238 164.505 144.827C153.012 143.064 140.458 147.119 133.031 156.64ZM219.141 156.111C210.124 165.103 209.77 182.557 220.556 190.315C232.226 198.778 247.786 197.367 260.34 203.538C263.169 204.772 264.407 207.946 263.169 210.591C262.992 211.12 262.815 211.472 262.462 211.825C256.803 218.877 242.481 217.467 240.536 207.77H211.715C212.599 215.175 214.898 222.932 220.91 228.045C230.281 236.332 243.542 238.8 255.743 238.095C267.236 237.566 279.259 233.158 286.332 223.638C293.405 214.117 292.344 199.307 282.972 191.902C277.137 187.494 269.711 185.731 262.638 183.615C255.566 181.499 247.609 181.852 241.597 177.621C239.122 176.034 238.591 172.684 240.183 170.216C240.713 169.51 241.42 168.805 242.128 168.453C247.079 166.161 252.737 166.161 257.864 168.276C260.517 169.334 260.693 172.684 261.931 174.976C271.479 174.976 281.204 174.976 290.752 174.976C290.045 168.981 288.454 162.811 284.564 158.05C277.314 149.235 265.821 145.532 254.682 145.003C242.128 144.122 227.982 146.59 219.141 156.111ZM149.299 169.51C159.731 167.924 169.633 174.623 171.754 185.026C174.23 195.075 170.87 207.593 160.792 212.001C150.183 217.467 136.214 210.062 133.915 198.602C132.501 191.197 132.678 182.734 137.629 176.563C140.458 172.86 144.524 170.392 149.299 169.51Z" fill="#282979" />
                                            <path d="M215.959 31.9888C246.725 31.2836 277.668 40.2754 304.191 55.7906C305.782 57.2011 307.373 58.6116 308.965 59.8458C318.69 73.4216 329.829 86.4686 335.487 102.336C325.762 90.7 315.86 79.0635 304.191 69.1902C287.923 55.6143 268.65 46.0936 248.67 39.0412C238.061 35.3387 226.745 34.6335 215.959 31.9888ZM85.8211 67.2508C96.4302 61.2562 107.039 55.0854 118.886 51.7355C115.526 54.5565 111.99 57.0248 108.277 59.4932C99.2593 65.1351 91.3025 72.3638 83.1689 79.2399C76.9803 84.5291 72.2062 91.4052 66.7249 97.3998C69.9076 88.0553 76.4498 80.6503 80.6935 71.8348L85.8211 67.2508ZM42.6777 249.379C44.4459 253.61 46.5677 257.842 48.3359 262.073C56.4695 281.291 69.2003 298.393 83.6993 313.379C92.1865 320.784 100.674 328.366 110.222 334.36C122.245 342.118 135.33 348.112 148.945 352.52C159.554 356.046 170.693 357.633 181.656 359.572C160.261 362.041 139.043 356.575 118.532 351.11C108.631 347.054 99.0824 341.942 89.3575 337.886L83.6993 333.126C80.3398 328.189 76.6266 323.782 72.383 319.726C68.6699 312.674 63.719 305.974 60.1826 298.746C52.049 283.23 45.33 266.657 42.6777 249.379ZM322.756 304.388C336.018 289.577 345.919 271.946 353.523 253.61C352.992 257.313 352.638 261.192 352.108 265.07C346.273 282.878 340.261 301.038 329.652 316.729C327 320.784 324.348 324.839 322.226 329.071C320.635 330.481 319.043 331.892 317.629 333.302C309.141 337.181 301.185 342.294 292.344 345.82C278.906 351.991 264.23 355.517 249.731 358.515C238.414 358.691 226.921 361.159 215.605 359.396C237.53 355.87 259.809 350.581 279.082 338.944C295.526 330.129 310.379 318.492 322.756 304.388Z" fill="#253C97" />
                                        </svg>
                                    }
                                />
                            )





                        default:
                            break
                    }

                })()}
            </>
        )
    }


    return (
        <div className='Integrations-Page'>

            <Sheet
                open={integrationOptionSheet}
                onClose={handleIntegrationOptionSheet}
                accessibilityLabel="Payment Methods"
            >
                <Form onSubmit={updateIntegration}>
                    <div className='Sheet-Container Payment-Sheet'>

                        <div className='Sheet-Header'>
                            <div className='Flex Align-Center'>
                                <Button
                                    accessibilityLabel="Cancel"
                                    icon={ArrowLeftMinor}
                                    onClick={handleIntegrationOptionSheet}
                                    disabled={btnLoading[2] || btnLoading[3]}
                                />
                                <SheetHeader />
                            </div>
                            <Button>
                                <a href="https://help.checkify.pro/en/articles/5405170-understanding-cash-on-delivery-cod"
                                    target="_blank" rel="noopener noreferrer" className='Flex Align-Center'>
                                    Helpdesk <Icon source={ExternalMinor}></Icon>
                                </a>
                            </Button>
                        </div>

                        <Scrollable className='Sheet-Scrollable'>
                            <FormLayout>

                                <span className='VisuallyHidden'>
                                    <Button submit id='updateIntegration'>Submit</Button>
                                </span>

                                <>
                                    {(() => {
                                        switch (selectedIntegrationOption) {
                                            case 1:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                To connect Facebook via Conversion API please assign your Pixel to the system user and generate Access Token. For more detailed instruction please {''}
                                                                <a href="https://help.checkify.pro/en/articles/5195508-setting-up-facebook-conversions-api"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />
                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Facebook Pixel Id'
                                                            name='FACEBOOK_PIXEL_API'
                                                            value={integrationValue.FACEBOOK_PIXEL_API}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 2:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                To connect Facebook via Conversion API please assign your Pixel to the system user and generate Access Token. For more detailed instruction please {''}
                                                                <a href="https://help.checkify.pro/en/articles/5195508-setting-up-facebook-conversions-api"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Access Token'
                                                            name='FACEBOOK_CONVERSIONS_API__ACCESS_Token'
                                                            value={integrationValue.FACEBOOK_CONVERSIONS_API__ACCESS_Token}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Facebook Pixel Id'
                                                            name='FACEBOOK_CONVERSIONS_API__PIXEL_ID'
                                                            value={integrationValue.FACEBOOK_CONVERSIONS_API__PIXEL_ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 3:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To integrate Google Analytics please go to your GA account > Settings (Admin tab) > Property Settings > Tracking ID or Measurement ID (GA4). For more detailed instruction please`} {' '}
                                                                <a href="https://help.checkify.pro/en/articles/4966060-connecting-google-services#h_5a5a027a5b"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='GA-Id'
                                                            name='GOOGLE_ANALYTICS__ID'
                                                            value={integrationValue.GOOGLE_ANALYTICS__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='ADDITIONAL GOOGLE ANALYTICS SCRIPT (OPTIONAL)'
                                                            name='GOOGLE_ANALYTICS__SCRIPT'
                                                            value={integrationValue.GOOGLE_ANALYTICS__SCRIPT}
                                                            onChange={handleIntegrationValue}
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 4:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To find your Conversion ID and Conversion labels please go to your Google Ads admin panel > Tools and Settings > Measurement > Conversions. For more detailed instruction please `}
                                                                {' '}
                                                                <a href="https://help.checkify.pro/en/articles/4966060-connecting-google-services#h_d5f6b8e166"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Google Ads Conversion Id'
                                                            name='GOOGLE_ADS__ID'
                                                            value={integrationValue.GOOGLE_ADS__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Google Ads – "Begin Checkout" Conversion Label'
                                                            name='GOOGLE_ADS__CHECKOUT_LABEL'
                                                            value={integrationValue.GOOGLE_ADS__CHECKOUT_LABEL}
                                                            onChange={handleIntegrationValue}
                                                            autoComplete='off'
                                                            required
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Google Ads – "Purchase" Conversion Label'
                                                            name='GOOGLE_ADS__PURCHASE_LABEL'
                                                            value={integrationValue.GOOGLE_ADS__PURCHASE_LABEL}
                                                            onChange={handleIntegrationValue}
                                                            autoComplete='off'
                                                            required
                                                        />
                                                    </>
                                                )

                                            case 5:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To connect your Google Tag Manager please visit your admin panel and copy GTM ID from the top bar. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/4966060-connecting-google-services#h_ca8c9bc90f"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Google Tag Manager ID'
                                                            name='GOOGLE_TAG_MANAGER__ID'
                                                            value={integrationValue.GOOGLE_TAG_MANAGER__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 6:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate Klaviyo integration you should create a Public API Key from your Klaviyo admin panel. Just go to Klaviyo > Account >Settings > API Keys > Public API Key. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/4954632-how-to-connect-klaviyo"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Klaviyo Public Api Key'
                                                            name='KLAVIYO__API_KEY'
                                                            value={integrationValue.KLAVIYO__API_KEY}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 7:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your TikTok Pixel ID in TikTok Ads Manager > Assets > Event > Website Pixel > Manage. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/4998042-how-to-connect-tiktok-pixel"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Tiktok Pixel Id'
                                                            name='TIKTOK__ID'
                                                            value={integrationValue.TIKTOK__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 8:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Pinterest Tag ID in Pinterest Ads Manager > Ads > Conversions > Add code to website (Tag ID will be displayed in the right upper corner). For more detailed information, please`}
                                                                {''}
                                                                <a href="https://help.checkify.pro/en/articles/4998050-how-to-connect-pinterest-tag"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Pinterest Tag ID'
                                                            name='PINTEREST__ID'
                                                            value={integrationValue.PINTEREST__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 9:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Snap Pixel ID in Snapchat Ads Manager > Assets > Snap Pixel > Manage Pixel > Setup Pixel. For more detailed instruction, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/4998049-how-to-connect-snap-pixel"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Snap Pixel Id'
                                                            name='SNAPCHAT__ID'
                                                            value={integrationValue.SNAPCHAT__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 10:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Website Tag ID in Twitter Ads > Tools > Conversion Tracking > (Tag ID will be displayed on the Purchase conversion event, right under its name). For more detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/5152046-how-to-connect-twitter-pixel"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Twitter Pixel Id'
                                                            name='TWITTERT__ID'
                                                            value={integrationValue.TWITTERT__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Checkout Initiated Event Id'
                                                            name='TWITTERT__CHECKOUT_ID'
                                                            value={integrationValue.TWITTERT__CHECKOUT_ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Purchase Event Id'
                                                            name='TWITTERT__PURCHASE_ID'
                                                            value={integrationValue.TWITTERT__PURCHASE_ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 11:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Account ID at the end of the URL (website address) when in your Backstage account (https://backstage.taboola.com/backstage/XXXXXX). For more detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/5152048-how-to-connect-taboola-pixel"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Taboola Account Id'
                                                            name='TABOOLA__ID'
                                                            value={integrationValue.TABOOLA__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 12:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Pixel ID in Conversions > Outbrain Pixel (Pixel ID will be displayed as a value of OB_ADV_ID variable). For more detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/5469412-connecting-outbrain-pixel"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Outbrain Pixel Id'
                                                            name='OUTBRAIN__ID'
                                                            value={integrationValue.OUTBRAIN__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 13:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Bing Tag in Conversions Tracking > UET Tag (ID will be shown when you click 'View tag' or generate new one). For detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/5901315-how-to-connect-bing-microsoft-ads"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Bing Tag Id'
                                                            name='BING_MICROSOFT_ADS__ID'
                                                            value={integrationValue.BING_MICROSOFT_ADS__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 14:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You can find your Google API key in Your project > Credentials (click Show Key in section API Keys or generate new one). For more detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6569579-google-places-address-autofill"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Google Api Key'
                                                            name='GOOGLE_PLACES__ID'
                                                            value={integrationValue.GOOGLE_PLACES__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 15:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You could find the Site ID when you go to Settings menu > Sites & Organizations list > Get ID of the site you want. For more detailed information, please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6531537-hotjar"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Site Id'
                                                            name='HOTJAR__ID'
                                                            value={integrationValue.HOTJAR__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 16:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`You need to have Trackify installed on your store in order for this integration to work. For more detailed information, please `}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6808580-trackify"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        {/* <InputField
                                        type='text'
                                        label='Site Id'
                                        name='HOTJAR__ID'
                                        value={integrationValue.HOTJAR__ID}
                                        onChange={handleIntegrationValue}
                                        required
                                        autoComplete='off'
                                    /> */}

                                                        <input type="text" hidden required />

                                                    </>
                                                )

                                            case 17:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate SMSBump integration you should take your API Credentials and List ID from your SMSBump account. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6842114-smsbump-integration"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='App Key'
                                                            name='SMSBUMP__APP_KEY'
                                                            value={integrationValue.SMSBUMP__APP_KEY}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Secret Key'
                                                            name='SMSBUMP__SECRET_KEY'
                                                            value={integrationValue.SMSBUMP__SECRET_KEY}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='List Id'
                                                            name='SMSBUMP__LIST_ID'
                                                            value={integrationValue.SMSBUMP__LIST_ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                    </>
                                                )

                                            case 18:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate Omnisend integration you should take your API Key from your Omnisend account. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6842115-omnisend-integration"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Api Key'
                                                            name='OMNISEND__API_KEY'
                                                            value={integrationValue.OMNISEND__API_KEY}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 19:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate Reddit integration you should take your Advertiser ID from your Reddit Ad account. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6892722-reddit-integration"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Reddit Advertiser Id'
                                                            name='REDDIT__ID'
                                                            value={integrationValue.REDDIT__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 20:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate Quora integration you should take your Quora Pixel ID from your Quora Ad account. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6892727-quora-integration"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Quora Pixel Id'
                                                            name='QUORA__ID'
                                                            value={integrationValue.QUORA__ID}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            case 21:
                                                return (
                                                    <>
                                                        <span>
                                                            <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                                                                {`To activate Postscript integration you should take your Private Key and Keyword from your Postscript account. For more detailed instruction please`}
                                                                {'  '}
                                                                <a href="https://help.checkify.pro/en/articles/6892731-postscript-integration"
                                                                    target="_blank" rel="noopener noreferrer" className='href-css'>check our guide</a>
                                                            </Text>
                                                        </span>

                                                        <br />

                                                        <InputField
                                                            type='text'
                                                            label='Private Key'
                                                            name='POSTSCRIPT__PRIVATE_KEY'
                                                            value={integrationValue.POSTSCRIPT__PRIVATE_KEY}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />

                                                        <InputField
                                                            marginTop
                                                            type='text'
                                                            label='Keyword'
                                                            name='POSTSCRIPT__KEYWORD'
                                                            value={integrationValue.POSTSCRIPT__KEYWORD}
                                                            onChange={handleIntegrationValue}
                                                            required
                                                            autoComplete='off'
                                                        />
                                                    </>
                                                )

                                            default:
                                                break
                                        }

                                    })()}
                                </>

                            </FormLayout>

                        </Scrollable>

                        <div className='Sheet-Footer'>
                            {isIntegrationEdit ?
                                <>
                                    <Button
                                        destructive
                                        disabled={btnLoading[2]}
                                        loading={btnLoading[3]}
                                        onClick={disableIntegration}
                                    >
                                        Disconnect
                                    </Button>
                                    <Button
                                        primary
                                        loading={btnLoading[2]}
                                        disabled={btnLoading[3]}
                                        onClick={handleUpdateIntegration}
                                    >
                                        Save Changes
                                    </Button>
                                </>
                                :
                                <>
                                    <Button onClick={handleIntegrationOptionSheet} disabled={btnLoading[2]}>
                                        Cancel
                                    </Button>
                                    <Button primary loading={btnLoading[2]} onClick={handleUpdateIntegration}>
                                        Connect
                                    </Button>
                                </>
                            }
                        </div>

                    </div>
                </Form>

            </Sheet>


            {loading && <Loading />}
            <Page
                title='Integrations'
                fullWidth
                secondaryActions={
                    <ButtonGroup>
                        <a href='https://help.checkify.pro/en/articles/4367163-general-customization-settings' target='_blank'>
                            <Button>Explore the guide <Icon source={ExternalMinor}></Icon></Button>
                        </a>
                    </ButtonGroup>
                }
            >
                <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
                    {loading ? <SkeltonPaymentPage /> :
                        <>
                            <div className='Integrations-Tab'>
                                {!integrationBanner &&
                                    <Banner
                                        title="Welcome to Integrations!"
                                        action={{ content: 'Learn more', url: '' }}
                                        secondaryAction={
                                            {
                                                content: 'Don’t show this again',
                                                onAction: () => setIntegrationBanner(!integrationBanner)
                                            }
                                        }
                                        status="info"
                                        onDismiss={() => setIntegrationBanner(!integrationBanner)}
                                    >
                                        <p>Some third-party eCom apps that are widely used with Shopify require data from the checkout page.</p>
                                        <p>To continue using your favorite applications, set up their integration with Checkify here.</p>
                                    </Banner>
                                }

                                <Layout>

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.FACEBOOK_PIXEL?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('FACEBOOK_PIXEL')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                                            <rect width="42" height="42" rx="10" fill="#ECF1FC" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 21.5586C11 26.7789 14.7914 31.1197 19.75 32V24.4164H17.125V21.5H19.75V19.1664C19.75 16.5414 21.4414 15.0836 23.8336 15.0836C24.5914 15.0836 25.4086 15.2 26.1664 15.3164V18H24.825C23.5414 18 23.25 18.6414 23.25 19.4586V21.5H26.05L25.5836 24.4164H23.25V32C28.2086 31.1197 32 26.7798 32 21.5586C32 15.7513 27.275 11 21.5 11C15.725 11 11 15.7513 11 21.5586Z" fill="#3B5998" />
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Facebook Pixel
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                            {/* <Badge status="success"> Domain Required</Badge> */}
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Facebook Pixel is a basic tool for tracking conversions coming from Facebook Ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.FACEBOOK_PIXEL?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('FACEBOOK_PIXEL')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.FACEBOOK_PIXEL?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.FACEBOOK_PIXEL?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.FACEBOOK_PIXEL?.id, integrationsData?.FACEBOOK_PIXEL?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.FACEBOOK_PIXEL?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.FACEBOOK_CONVERSIONS_API?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('FACEBOOK_CONVERSIONS_API')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                                            <rect width="42" height="42" rx="10" fill="#3B5998" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M11 21.5586C11 26.7789 14.7914 31.1197 19.75 32V24.4164H17.125V21.5H19.75V19.1664C19.75 16.5414 21.4414 15.0836 23.8336 15.0836C24.5914 15.0836 25.4086 15.2 26.1664 15.3164V18H24.825C23.5414 18 23.25 18.6414 23.25 19.4586V21.5H26.05L25.5836 24.4164H23.25V32C28.2086 31.1197 32 26.7798 32 21.5586C32 15.7513 27.275 11 21.5 11C15.725 11 11 15.7513 11 21.5586Z" fill="white" />
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Facebook Conversions API
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        The Conversions API is an advanced type of Facebook Pixel integration.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.FACEBOOK_CONVERSIONS_API?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('FACEBOOK_CONVERSIONS_API')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.FACEBOOK_CONVERSIONS_API?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.FACEBOOK_CONVERSIONS_API?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.FACEBOOK_CONVERSIONS_API?.id, integrationsData?.FACEBOOK_CONVERSIONS_API?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.FACEBOOK_CONVERSIONS_API?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 1 || selectedTab == 4 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.GOOGLE_ANALYTICS?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('GOOGLE_ANALYTICS')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                                            <rect width="42" height="42" rx="10" fill="#FFF2CD" />
                                                            <path d="M30.2634 11H26.4741C25.5509 11 24.793 11.7579 24.793 12.6811V31.9445H30.2634C31.1866 31.9445 31.9445 31.1867 31.9445 30.2635V12.6811C31.9445 11.758 31.1866 11 30.2634 11Z" fill="#F57C00" />
                                                            <path d="M17.6141 19.2675V24.7792H12.6535C11.7441 24.7793 11 25.5234 11 26.4329V30.291C11 31.2005 11.744 31.9445 12.6535 31.9445H24.7794V17.614H19.2676C18.3581 17.614 17.6141 18.358 17.6141 19.2675Z" fill="#FFC107" />
                                                            <path d="M24.7793 17.614V31.9445H30.2497C31.1729 31.9445 31.9308 31.1866 31.9308 30.2634V24.7792L24.7793 17.614Z" fill="url(#paint0_linear)" />
                                                            <defs>
                                                                <linearGradient id="paint0_linear" x1="21.2311" y1="21.231" x2="33.2413" y2="24.2221" gradientUnits="userSpaceOnUse">
                                                                    <stop stopColor="#BF360C" stopOpacity="0.2" />
                                                                    <stop offset="1" stopColor="#BF360C" stopOpacity="0.02" />
                                                                </linearGradient>
                                                            </defs>
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Google Analytics
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Analytics Tool
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Gather visitors insights and measures your conversions rate.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.GOOGLE_ANALYTICS?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('GOOGLE_ANALYTICS')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.GOOGLE_ANALYTICS?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.GOOGLE_ANALYTICS?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.GOOGLE_ANALYTICS?.id, integrationsData?.GOOGLE_ANALYTICS?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.GOOGLE_ANALYTICS?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 1 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.GOOGLE_ADS?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('GOOGLE_ADS')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                                            <rect width="42" height="42" rx="10" fill="#E9F2FF" />
                                                            <g clipPath="url(#clip0)">
                                                                <path d="M11.4826 25.6503L18.4546 13.7144C19.3402 14.2357 23.806 16.7072 24.5272 17.1772L17.5552 29.1138C16.7928 30.1212 10.5166 27.179 11.4826 25.6497V25.6503V25.6503Z" fill="#FBBC04" />
                                                                <path d="M31.5149 25.6502L24.5429 13.7149C23.5683 12.0929 21.4691 11.5034 19.7449 12.4614C18.0206 13.4195 17.4956 15.4832 18.4703 17.1777L25.4423 29.1144C26.417 30.7358 28.5163 31.3252 30.2405 30.3672C31.8893 29.4091 32.4896 27.2722 31.5149 25.6516V25.6502V25.6502Z" fill="#4285F4" />
                                                                <path d="M14.4998 30.8283C16.4327 30.8283 17.9996 29.3004 17.9996 27.4155C17.9996 25.5307 16.4327 24.0027 14.4998 24.0027C12.5669 24.0027 11 25.5307 11 27.4155C11 29.3004 12.5669 30.8283 14.4998 30.8283Z" fill="#34A853" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0">
                                                                    <rect width="21" height="18.8672" fill="white" transform="translate(11, 12)" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Google Ads
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Setup conversion events and monitor conversions coming from Google Ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.GOOGLE_ADS?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('GOOGLE_ADS')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.GOOGLE_ADS?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.GOOGLE_ADS?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.GOOGLE_ADS?.id, integrationsData?.GOOGLE_ADS?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.GOOGLE_ADS?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 1 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.GOOGLE_TAG_MANAGER?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('GOOGLE_TAG_MANAGER')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                                            <rect width="42" height="42" rx="10" fill="#E5F7FF" />
                                                            <g clipPath="url(#clip0)">
                                                                <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="11" y="10" width="21" height="22">
                                                                    <path d="M31.5795 20.4859L22.5139 11.4203C21.9533 10.8596 21.0467 10.8596 20.4861 11.4203L11.4205 20.4859C10.8598 21.0465 10.8598 21.9531 11.4205 22.5137L20.4861 31.5793C21.0467 32.14 21.9533 32.14 22.5139 31.5793L31.5795 22.5137C32.1402 21.9531 32.1402 21.0465 31.5795 20.4859V20.4859ZM21.5 23.8855L19.1143 21.4998L21.5 19.1141L23.8857 21.4998L21.5 23.8855Z" fill="white" />
                                                                </mask>
                                                                <g mask="url(#mask0)">
                                                                    <path d="M31.5557 20.4974L28.2263 17.1681L25.8482 14.79L21.508 19.1301L23.8862 21.5082L21.5081 23.8862L17.168 28.2264L20.4974 31.5558C21.0562 32.1146 21.9599 32.1146 22.5187 31.5558L25.8481 28.2264L28.2262 25.8483L31.5556 22.5189C32.1145 21.9601 32.1145 21.0563 31.5556 20.4974H31.5557Z" fill="#4285F4" />
                                                                    <path d="M25.8478 14.79L22.5184 11.4606C21.9596 10.9018 21.0559 10.9018 20.4971 11.4606L17.1677 14.79L14.7896 17.1681L11.4601 20.4975C10.9013 21.0564 10.9013 21.9601 11.4601 22.5189L14.7895 25.8483L17.1676 28.2264L21.5077 23.8864L19.1296 21.5083L21.5077 19.1301L25.8478 14.79V14.79Z" fill="#4FC3F7" />
                                                                    <mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="11" y="11" width="21" height="21">
                                                                        <path d="M31.5554 20.4975L22.5183 11.4606C21.9595 10.9018 21.0558 10.9018 20.497 11.4606L11.4601 20.4975C10.9013 21.0564 10.9013 21.9601 11.4601 22.5189L20.4971 31.5558C21.0559 32.1147 21.9596 32.1147 22.5184 31.5558L31.5554 22.5189C32.1143 21.9601 32.1143 21.0564 31.5554 20.4975ZM21.5077 23.8864L19.1296 21.5083L21.5077 19.1301L23.8859 21.5082L21.5078 23.8863L21.5077 23.8864Z" fill="white" />
                                                                    </mask>
                                                                    <g mask="url(#mask1)">
                                                                        <path opacity="0.2" d="M20.4978 11.5795C21.0566 11.0207 21.9603 11.0207 22.5191 11.5795L31.5561 20.6164C31.8178 20.878 31.9604 21.2227 31.9723 21.5676C31.9842 21.1871 31.8534 20.7947 31.5561 20.4974L22.5191 11.4606C21.9603 10.9018 21.0566 10.9018 20.4978 11.4606L11.4608 20.4975C11.1636 20.7948 11.0328 21.1873 11.0447 21.5677C11.0566 21.2228 11.1993 20.878 11.4608 20.6164L20.4978 11.5795Z" fill="white" />
                                                                    </g>
                                                                    <mask id="mask2" mask-type="alpha" maskUnits="userSpaceOnUse" x="11" y="11" width="21" height="21">
                                                                        <path d="M31.5554 20.4975L22.5183 11.4606C21.9595 10.9018 21.0558 10.9018 20.497 11.4606L11.4601 20.4975C10.9013 21.0564 10.9013 21.9601 11.4601 22.5189L20.4971 31.5558C21.0559 32.1147 21.9596 32.1147 22.5184 31.5558L31.5554 22.5189C32.1143 21.9601 32.1143 21.0564 31.5554 20.4975ZM21.5077 23.8864L19.1296 21.5083L21.5077 19.1301L23.8859 21.5082L21.5078 23.8863L21.5077 23.8864Z" fill="white" />
                                                                    </mask>
                                                                    <g mask="url(#mask2)">
                                                                        <path opacity="0.2" d="M31.5551 22.4L22.5181 31.4369C21.9593 31.9957 21.0555 31.9957 20.4967 31.4369L11.4599 22.4C11.1983 22.1383 11.0556 21.7935 11.0437 21.4487C11.0318 21.8292 11.1627 22.2216 11.4599 22.5188L20.4968 31.5557C21.0556 32.1146 21.9594 32.1146 22.5182 31.5557L31.5551 22.5188C31.8524 22.2216 31.9833 21.8411 31.9714 21.4487C31.9595 21.7935 31.8167 22.1384 31.5551 22.4Z" fill="#1A237E" />
                                                                    </g>
                                                                    <mask id="mask3" mask-type="alpha" maskUnits="userSpaceOnUse" x="11" y="11" width="21" height="21">
                                                                        <path d="M31.5554 20.4975L22.5183 11.4606C21.9595 10.9018 21.0558 10.9018 20.497 11.4606L11.4601 20.4975C10.9013 21.0564 10.9013 21.9601 11.4601 22.5189L20.4971 31.5558C21.0559 32.1147 21.9596 32.1147 22.5184 31.5558L31.5554 22.5189C32.1143 21.9601 32.1143 21.0564 31.5554 20.4975ZM21.5077 23.8864L19.1296 21.5083L21.5077 19.1301L23.8859 21.5082L21.5078 23.8863L21.5077 23.8864Z" fill="white" />
                                                                    </mask>
                                                                    <g mask="url(#mask3)">
                                                                        <path d="M21.508 23.8863L17.168 28.2263L20.4974 31.5557C21.0562 32.1145 21.9599 32.1145 22.5187 31.5557L25.8481 28.2263L21.508 23.8862V23.8863Z" fill="url(#paint0_linear)" />
                                                                        <path d="M31.5554 20.4975L22.5183 11.4606C21.9595 10.9018 21.0558 10.9018 20.497 11.4606L11.4601 20.4975C10.9013 21.0564 10.9013 21.9601 11.4601 22.5189L20.4971 31.5558C21.0559 32.1147 21.9596 32.1147 22.5184 31.5558L31.5554 22.5189C32.1143 21.9601 32.1143 21.0564 31.5554 20.4975ZM21.5077 23.8864L19.1296 21.5083L21.5077 19.1301L23.8859 21.5082L21.5078 23.8863L21.5077 23.8864Z" fill="url(#paint1_linear)" />
                                                                        <path d="M21.5482 23.9058L23.3739 25.7289L18.8736 29.9104L17.209 28.2458L21.5482 23.9058Z" fill="url(#paint2_linear)" fillOpacity="0.8" />
                                                                        <path d="M25.847 14.8115L27.6728 16.6346L23.1724 20.8161L21.5078 19.1515L25.847 14.8115Z" fill="url(#paint3_linear)" fillOpacity="0.8" />
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <defs>
                                                                <linearGradient id="paint0_linear" x1="19.3112" y1="26.0236" x2="23.3289" y2="30.6505" gradientUnits="userSpaceOnUse">
                                                                    <stop stopColor="#1A237E" stopOpacity="0.2" />
                                                                    <stop offset="1" stopColor="#1A237E" stopOpacity="0.02" />
                                                                </linearGradient>
                                                                <linearGradient id="paint1_linear" x1="16.0975" y1="16.098" x2="26.9869" y2="26.9874" gradientUnits="userSpaceOnUse">
                                                                    <stop stopColor="white" stopOpacity="0.1" />
                                                                    <stop offset="1" stopColor="white" stopOpacity="0" />
                                                                </linearGradient>
                                                                <linearGradient id="paint2_linear" x1="19.7472" y1="25.7654" x2="20.7849" y2="26.795" gradientUnits="userSpaceOnUse">
                                                                    <stop stopOpacity="0.2" />
                                                                    <stop offset="1" stopColor="#D8D8D8" stopOpacity="0" />
                                                                </linearGradient>
                                                                <linearGradient id="paint3_linear" x1="24.0461" y1="16.6711" x2="25.3668" y2="17.9796" gradientUnits="userSpaceOnUse">
                                                                    <stop stopOpacity="0.2" />
                                                                    <stop offset="1" stopColor="#D8D8D8" stopOpacity="0" />
                                                                </linearGradient>
                                                                <clipPath id="clip0">
                                                                    <rect width="21" height="21" fill="white" transform="translate(11 11)" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Google Tag Manager
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Analytics Tool
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Manage and deploy marketing tags on your website without code modifying.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.GOOGLE_TAG_MANAGER?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('GOOGLE_TAG_MANAGER')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.GOOGLE_TAG_MANAGER?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.GOOGLE_TAG_MANAGER?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.GOOGLE_TAG_MANAGER?.id, integrationsData?.GOOGLE_TAG_MANAGER?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.GOOGLE_TAG_MANAGER?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 3 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.KLAVIYO?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('KLAVIYO')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={klaviyoLogo} alt="klaviyoLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Klaviyo
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Email & SMS Sender
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Connect Klaviyo to set up flows with "Abandoned Cart" event.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.KLAVIYO?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('KLAVIYO')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.KLAVIYO?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.KLAVIYO?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.KLAVIYO?.id, integrationsData?.KLAVIYO?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.KLAVIYO?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.TIKTOK?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('TIKTOK')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#010101" />
                                                            <g clipPath="url(#clip0)">
                                                                <path d="M21.459 10.5175C22.6052 10.5 23.7427 10.5087 24.8802 10.5C24.9502 11.8387 25.4315 13.2038 26.4115 14.1488C27.3915 15.12 28.774 15.5663 30.1215 15.715V19.2412C28.8615 19.1975 27.5927 18.935 26.4465 18.3925C25.9477 18.165 25.484 17.8763 25.029 17.5788C25.0202 20.1338 25.0377 22.6888 25.0115 25.235C24.9415 26.46 24.539 27.6763 23.8302 28.6825C22.684 30.3625 20.6977 31.4562 18.659 31.4912C17.4077 31.5612 16.1565 31.22 15.089 30.59C13.3215 29.5487 12.079 27.6412 11.8952 25.5938C11.8777 25.1562 11.869 24.7188 11.8865 24.29C12.044 22.6275 12.8665 21.035 14.144 19.95C15.5965 18.69 17.6265 18.0862 19.5252 18.445C19.5427 19.74 19.4902 21.035 19.4902 22.33C18.624 22.05 17.609 22.1288 16.8477 22.6538C16.2965 23.0125 15.8765 23.5638 15.6577 24.185C15.474 24.6313 15.5265 25.1212 15.5352 25.5938C15.7452 27.0287 17.1277 28.2363 18.5977 28.105C19.5777 28.0963 20.514 27.5275 21.0215 26.6963C21.1877 26.4075 21.3715 26.11 21.3802 25.7688C21.4677 24.2025 21.4327 22.645 21.4415 21.0788C21.4502 17.5525 21.4327 14.035 21.459 10.5175V10.5175Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0">
                                                                    <rect x="10.5" y="10.5" width="21" height="21" rx="10" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            TikTok
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Add TikTok Pixel to track the performance of your TikTok ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.TIKTOK?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('TIKTOK')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.TIKTOK?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.TIKTOK?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.TIKTOK?.id, integrationsData?.TIKTOK?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.TIKTOK?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.PINTEREST?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('PINTEREST')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#CB1F27" />
                                                            <g clipPath="url(#clip0)">
                                                                <path d="M10.5 21.0002C10.5 25.2998 13.0855 28.9935 16.7852 30.6174C16.7556 29.8842 16.7799 29.004 16.9679 28.2063C17.1698 27.3539 18.319 22.4848 18.319 22.4848C18.319 22.4848 17.9835 21.8143 17.9835 20.8235C17.9835 19.2674 18.8854 18.1053 20.0086 18.1053C20.9637 18.1053 21.4251 18.8226 21.4251 19.6817C21.4251 20.6418 20.8127 22.0779 20.4978 23.408C20.2347 24.5218 21.0563 25.4303 22.1551 25.4303C24.1445 25.4303 25.4844 22.8752 25.4844 19.8477C25.4844 17.5464 23.9344 15.8239 21.1153 15.8239C17.9301 15.8239 15.9459 18.1992 15.9459 20.8524C15.9459 21.7672 16.2156 22.4123 16.6381 22.9119C16.8323 23.1413 16.8593 23.2336 16.789 23.4971C16.7386 23.6903 16.623 24.1554 16.5751 24.3397C16.5052 24.6057 16.2897 24.7008 16.0493 24.6026C14.5823 24.0037 13.899 22.3971 13.899 20.5911C13.899 17.6083 16.4146 14.0318 21.4034 14.0318C25.4123 14.0318 28.0508 16.9327 28.0508 20.0467C28.0508 24.1657 25.7608 27.243 22.3853 27.243C21.2517 27.243 20.1853 26.6302 19.8201 25.9342C19.8201 25.9342 19.2105 28.3534 19.0814 28.8206C18.8587 29.6302 18.423 30.4393 18.0246 31.07C18.9907 31.3557 19.9929 31.5007 21.0004 31.5006C26.7987 31.5006 31.5001 26.7994 31.5001 21.0002C31.5001 15.2011 26.7987 10.5 21.0004 10.5C15.2015 10.5 10.5 15.2011 10.5 21.0002Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0">
                                                                    <rect x="10.5" y="10.5" width="21" height="21" rx="10" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Pinterest
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Analytics Tool
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Use Pinterest Ads Tag to measure performance of your Pinterest ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.PINTEREST?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('PINTEREST')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.PINTEREST?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.PINTEREST?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.PINTEREST?.id, integrationsData?.PINTEREST?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.PINTEREST?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.SNAPCHAT?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('SNAPCHAT')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#FFFC00" />
                                                            <path d="M21.2028 10C22.1928 10 25.5497 10.2774 27.1342 13.822C27.6641 15.0148 27.5372 17.0421 27.4327 18.6702L27.4302 18.7286C27.4166 18.9102 27.4078 19.0744 27.4004 19.2386C27.5233 19.304 27.6617 19.335 27.8009 19.3281C28.1006 19.3119 28.4601 19.2087 28.8344 19.0284C28.9785 18.957 29.1376 18.9212 29.2983 18.9239C29.4799 18.9239 29.6578 18.9525 29.807 19.0134C30.256 19.1627 30.5408 19.4923 30.5408 19.8517C30.557 20.3007 30.1516 20.6913 29.3282 21.0196C29.2399 21.0482 29.118 21.0955 28.9849 21.139C28.5334 21.2746 27.8444 21.4984 27.6504 21.9487C27.5608 22.1738 27.5894 22.4723 27.7723 22.8156L27.7872 22.8317C27.8469 22.9673 29.3145 26.308 32.5806 26.8478C32.7004 26.8671 32.809 26.9294 32.8862 27.023C32.9633 27.1167 33.0037 27.2352 32.9997 27.3565C32.9997 27.4311 32.9836 27.5045 32.955 27.5816C32.7149 28.15 31.6826 28.5704 29.8083 28.8515C29.7498 28.9423 29.6889 29.2271 29.6441 29.4224C29.6167 29.6015 29.5695 29.7818 29.511 29.9746C29.4352 30.2457 29.2411 30.3788 28.9563 30.3788H28.9265C28.7451 30.3704 28.5649 30.3459 28.3879 30.3054C27.9694 30.2151 27.5424 30.1701 27.1143 30.1711C26.8158 30.1711 26.5173 30.186 26.2039 30.2457C25.6032 30.3502 25.0796 30.7096 24.4801 31.1288C23.6256 31.727 22.653 32.4173 21.1854 32.4173C21.1257 32.4173 21.066 32.4024 21.0038 32.4024H20.8558C19.3869 32.4024 18.4292 31.727 17.576 31.1139C16.9778 30.6935 16.4691 30.3353 15.8684 30.2296C15.5615 30.1837 15.252 30.1588 14.9418 30.1549C14.4007 30.1549 13.9828 30.2445 13.6694 30.3042C13.458 30.3477 13.2789 30.3776 13.1284 30.3776C12.9972 30.3875 12.8667 30.351 12.7599 30.2743C12.653 30.1977 12.5765 30.0858 12.5438 29.9584C12.4841 29.7669 12.4555 29.5691 12.4107 29.3913C12.3635 29.2097 12.305 28.8987 12.2453 28.8216C10.3262 28.599 9.29391 28.1786 9.05511 27.5953C9.02213 27.5246 9.00352 27.4481 9.00038 27.3702C8.9956 27.2487 9.03568 27.1297 9.11298 27.0359C9.19028 26.9421 9.29939 26.88 9.41953 26.8615C12.6844 26.3217 14.152 22.9822 14.2129 22.8417L14.2291 22.8131C14.4094 22.4686 14.453 22.1663 14.3485 21.9437C14.1545 21.5096 13.4642 21.2858 13.0177 21.1353C12.8989 21.1053 12.7828 21.0653 12.6707 21.0159C11.5637 20.5806 11.4133 20.0856 11.4742 19.7423C11.5637 19.2647 12.1471 18.95 12.6421 18.95C12.7876 18.95 12.912 18.9786 13.0252 19.0246C13.4443 19.2174 13.8149 19.3244 14.1296 19.3244C14.2908 19.3303 14.4508 19.2938 14.5935 19.2187L14.5425 18.649C14.443 17.0234 14.3162 14.9986 14.8497 13.8121C16.387 10.2848 19.7364 10.0137 20.7252 10.0137L21.1418 10H21.2028Z" fill="white" />
                                                            <path d="M20.9894 11.2811C24.2105 11.2822 26.8936 13.9638 26.8975 17.1927C26.8984 17.949 26.9217 18.6454 26.9644 19.287C26.9908 19.6828 27.32 19.9761 27.6975 19.9761C27.7531 19.9761 27.8097 19.9698 27.8666 19.9564L28.8757 19.7199C28.9186 19.7098 28.9617 19.705 29.0043 19.705C29.2606 19.705 29.4965 19.8801 29.5541 20.1394C29.6354 20.5059 29.4301 20.8762 29.0749 21.0008L27.5432 21.6191C27.1565 21.7752 26.9488 22.196 27.0577 22.5986C28.2866 27.1417 31.7189 26.6692 31.7189 27.2611C31.7189 28.0043 29.1318 28.1093 28.8981 28.3431C28.6644 28.5769 28.888 29.7114 28.3657 29.931C28.2673 29.9724 28.1274 29.9868 27.9568 29.9868C27.5635 29.9868 27.0072 29.91 26.4208 29.91C25.9122 29.91 25.381 29.9678 24.914 30.1835C23.6751 30.7558 22.4807 31.8248 21 31.8248C19.5194 31.8248 18.3249 30.7558 17.086 30.1835C16.6189 29.9677 16.0879 29.91 15.5792 29.91C14.9929 29.91 14.4365 29.9868 14.0432 29.9868C13.8727 29.9868 13.7327 29.9724 13.6343 29.931C13.1121 29.7114 13.3357 28.5769 13.102 28.3431C12.8682 28.1093 10.2811 28.0043 10.2811 27.261C10.2811 26.6691 13.7135 27.1416 14.9423 22.5986C15.0512 22.196 14.8435 21.7752 14.4568 21.619L12.9251 21.0007C12.5699 20.8762 12.3645 20.5059 12.4459 20.1394C12.5035 19.88 12.7394 19.7049 12.9957 19.7049C13.0383 19.7049 13.0814 19.7097 13.1243 19.7198L14.1334 19.9564C14.1903 19.9697 14.2469 19.9761 14.3025 19.9761C14.68 19.9761 15.0092 19.6827 15.0356 19.2869C15.0783 18.6454 15.1016 17.949 15.1026 17.1927C15.1064 13.9638 17.7682 11.2823 20.9894 11.2811ZM20.9898 10H20.9893H20.9889C20.0274 10.0003 19.0908 10.1935 18.2052 10.5743C17.3551 10.9397 16.59 11.4607 15.9312 12.123C15.2733 12.7843 14.7555 13.5521 14.3922 14.4051C14.0146 15.292 13.8225 16.2293 13.8213 17.1912C13.8208 17.6634 13.811 18.1217 13.7921 18.5605L13.4167 18.4725C13.279 18.4402 13.1373 18.4238 12.9958 18.4237C12.5872 18.4237 12.1842 18.5618 11.861 18.8126C11.5237 19.0742 11.2872 19.4469 11.1951 19.8618C10.976 20.8494 11.5213 21.8465 12.4664 22.1971L13.5905 22.6509C12.8461 24.9357 11.4735 25.3735 10.5492 25.6684C10.304 25.7467 10.0921 25.8143 9.89043 25.9144C9.08676 26.3133 9 26.989 9 27.261C9 27.782 9.24659 28.2575 9.69442 28.5998C9.91739 28.7702 10.1936 28.9108 10.5388 29.0297C11.0093 29.1916 11.5547 29.2944 11.9979 29.3768C12.0194 29.5411 12.0508 29.7175 12.1037 29.8953C12.3235 30.6338 12.7873 30.9645 13.1377 31.1118C13.4702 31.2517 13.8137 31.2678 14.0432 31.2678C14.2677 31.2678 14.5049 31.2502 14.7561 31.2316C15.0256 31.2117 15.3043 31.1911 15.5792 31.1911C16.0053 31.1911 16.3224 31.2419 16.5488 31.3464C16.8596 31.49 17.1892 31.6836 17.5382 31.8886C18.5097 32.4591 19.6108 33.1058 21 33.1058C22.3893 33.1058 23.4903 32.4591 24.4618 31.8886C24.8108 31.6836 25.1404 31.49 25.4513 31.3464C25.6776 31.2418 25.9948 31.1911 26.4208 31.1911C26.6957 31.1911 26.9744 31.2117 27.2439 31.2316C27.4951 31.2502 27.7323 31.2678 27.9568 31.2678C28.1863 31.2678 28.5298 31.2517 28.8623 31.1118C29.2127 30.9645 29.6765 30.6338 29.8963 29.8953C29.9492 29.7175 29.9807 29.5411 30.0021 29.3768C30.4453 29.2944 30.9908 29.1916 31.4612 29.0297C31.8065 28.9108 32.0826 28.7702 32.3056 28.5998C32.7534 28.2575 33 27.782 33 27.261C33 26.989 32.9132 26.3133 32.1095 25.9144C31.9078 25.8143 31.6959 25.7467 31.4507 25.6685C30.5264 25.3736 29.1538 24.9357 28.4094 22.6509L29.5335 22.1972C30.4785 21.8465 31.0239 20.8494 30.8048 19.8618C30.7127 19.4469 30.4762 19.0742 30.1389 18.8126C29.8157 18.5619 29.4128 18.4237 29.0043 18.4237C28.8628 18.4237 28.7212 18.4401 28.5833 18.4724L28.2078 18.5605C28.189 18.1217 28.1792 17.6634 28.1786 17.1911C28.1774 16.2285 27.9838 15.2902 27.6031 14.4021C27.2377 13.5496 26.7171 12.782 26.0559 12.1206C25.3946 11.4593 24.6274 10.9388 23.7756 10.5736C22.8882 10.1933 21.951 10.0004 20.9898 10Z" fill="#050505" />
                                                        </svg>

                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Snapchat
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Activate Snap Pixel to track conversions coming from Snapchat Ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.SNAPCHAT?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('SNAPCHAT')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.SNAPCHAT?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.SNAPCHAT?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.SNAPCHAT?.id, integrationsData?.SNAPCHAT?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.SNAPCHAT?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>
                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.TWITTER?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('TWITTER')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#1DA1F2" />
                                                            <path d="M34 13.3089C33.1169 13.7005 32.1679 13.9651 31.1719 14.0842C32.1887 13.4748 32.9693 12.5098 33.3369 11.3601C32.3704 11.9336 31.3129 12.3377 30.2103 12.5549C29.312 11.598 28.0324 11 26.6162 11C23.8968 11 21.6921 13.2046 21.6921 15.9237C21.6921 16.3097 21.7357 16.6855 21.8196 17.0459C17.7274 16.8405 14.0993 14.8803 11.6707 11.9013C11.247 12.6285 11.0042 13.4744 11.0042 14.3767C11.0042 16.085 11.8735 17.592 13.1946 18.4751C12.4127 18.4506 11.648 18.2394 10.9643 17.8591C10.964 17.8797 10.964 17.9004 10.964 17.9211C10.964 20.3067 12.6613 22.2969 14.9137 22.7492C14.1886 22.9464 13.4281 22.9753 12.6902 22.8336C13.3167 24.7898 15.1352 26.2133 17.2897 26.2531C15.6046 27.5737 13.4814 28.3609 11.1746 28.3609C10.7771 28.3609 10.3852 28.3376 10 28.2921C12.179 29.6892 14.7672 30.5043 17.5478 30.5043C26.6047 30.5043 31.5573 23.0014 31.5573 16.4948C31.5573 16.2812 31.5526 16.0689 31.543 15.8577C32.507 15.1609 33.339 14.2978 34 13.3089Z" fill="white" />
                                                        </svg>

                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Twitter
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Link your Twitter Ads account and track purchases coming from this platform.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.TWITTER?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('TWITTER')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.TWITTER?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.TWITTER?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.TWITTER?.id, integrationsData?.TWITTER?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.TWITTER?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.TABOOLA?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('TABOOLA')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#004B7A" />
                                                            <g clipPath="url(#clip0)">
                                                                <path d="M15.4403 15.2692C13.7365 15.261 13.5001 16.9159 13.4919 18.1632C13.4838 19.4105 13.7039 21.0898 15.4077 21.1061C17.1115 21.1143 17.3479 19.4349 17.3561 18.1877C17.3642 16.9404 17.1441 15.2773 15.4403 15.2692ZM15.3914 24.3752C10.9648 24.3425 8.9838 21.4078 9.0001 18.1387C9.0164 14.8697 11.03 11.9757 15.4566 12.0002C19.8833 12.0246 21.8642 14.9431 21.8479 18.2121C21.8316 21.4811 19.818 24.3996 15.3914 24.3752Z" fill="white" />
                                                                <path d="M26.5925 15.2692C24.8968 15.261 24.6604 16.9159 24.6522 18.1632C24.6441 19.4105 24.8642 21.0898 26.568 21.1061C28.2718 21.1143 28.5082 19.4349 28.5164 18.1877C28.5164 16.9404 28.2963 15.2773 26.5925 15.2692ZM26.5436 24.3752C22.1169 24.3507 20.1359 21.4078 20.1604 18.1387C20.1767 14.8697 22.1903 11.9757 26.6169 12.0002C31.0436 12.0246 33.0245 14.9431 33.0082 18.2121C32.9838 21.4811 30.9702 24.3996 26.5436 24.3752Z" fill="white" />
                                                                <path d="M10.6879 24.3755C13.8754 25.8021 17.1933 26.438 20.7966 26.4543C24.5874 26.4787 27.4651 25.7614 31.1009 24.3755L31.0765 28.3048C27.8156 29.919 24.2857 30.7912 20.764 30.7668C16.9243 30.7423 14.1607 29.9597 10.6553 28.3048L10.6879 24.3755Z" fill="white" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0">
                                                                    <rect width="24" height="18.7663" fill="white" transform="translate(9 12)" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Taboola
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Enable this integration to track conversions of your Taboola leads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.TABOOLA?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('TABOOLA')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.TABOOLA?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.TABOOLA?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.TABOOLA?.id, integrationsData?.TABOOLA?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.TABOOLA?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>
                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.OUTBRAIN?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('OUTBRAIN')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="42" height="42" rx="10" fill="#F18421" />
                                                            <path d="M32.0791 16.1442C31.4651 14.693 30.6279 13.4372 29.5395 12.3767C28.4512 11.3163 27.1953 10.4791 25.7442 9.89302C24.293 9.27907 22.7023 9 21 9C19.2977 9 17.707 9.30698 16.2558 9.89302C14.8047 10.507 13.5209 11.3163 12.4605 12.3767C11.3721 13.4372 10.5349 14.693 9.92093 16.1442C9.30698 17.5954 9 19.1581 9 20.8326C9 22.507 9.30698 24.0698 9.92093 25.5209C10.5349 26.9721 11.3721 28.2279 12.4605 29.2884C13.5488 30.3488 14.8047 31.186 16.2558 31.7721C17.707 32.386 19.2977 32.6651 21 32.6651C22.7023 32.6651 24.293 32.3581 25.7442 31.7721C27.1953 31.1581 28.4791 30.3488 29.5395 29.2884C30.6279 28.2279 31.4651 26.9721 32.0791 25.5209C32.693 24.0698 33 22.507 33 20.8326C33 19.1581 32.693 17.5954 32.0791 16.1442ZM13.8 19.9674C15.1395 19.5209 16.9256 18.9628 16.9256 18.9628C20.8326 17.707 21.3628 16.2558 21.3628 16.2558C21.3628 16.2558 22.1721 17.7349 25.0186 18.6837C25.0186 18.6837 26.5814 19.186 28.0326 19.7163C28.1163 19.8558 28.1721 19.9953 28.2558 20.1628C28.507 20.7767 28.6744 21.3907 28.786 22.0605H26.7767V22.0326C26.6372 21.6977 26.4419 21.3907 26.1628 21.1395C25.9116 20.8884 25.6047 20.693 25.2698 20.5535C24.9349 20.414 24.5442 20.3302 24.1535 20.3302C23.7349 20.3302 23.3721 20.414 23.0372 20.5535C22.7023 20.693 22.3953 20.8884 22.1442 21.1395C21.893 21.3907 21.6977 21.6977 21.5302 22.0326C21.4744 22.1442 21.4465 22.2558 21.4186 22.3674H20.6651C20.6372 22.2558 20.6093 22.1442 20.5535 22.0326C20.414 21.6977 20.2186 21.3907 19.9395 21.1395C19.6884 20.8884 19.3814 20.693 19.0465 20.5535C18.7116 20.414 18.3209 20.3302 17.9302 20.3302C17.5116 20.3302 17.1488 20.414 16.814 20.5535C16.4791 20.693 16.1721 20.8884 15.9209 21.1395C15.6698 21.3907 15.4744 21.6977 15.307 22.0326C15.307 22.0326 15.307 22.0605 15.2791 22.0605H13.2698C13.3535 21.3907 13.5488 20.7488 13.8 20.1628C13.7442 20.107 13.7721 20.0512 13.8 19.9674ZM25.8279 23.1767C25.8279 23.4279 25.7721 23.6233 25.6884 23.8465C25.6047 24.0419 25.493 24.2372 25.3256 24.3767C25.186 24.5163 24.9907 24.6558 24.7953 24.7395C24.6 24.8233 24.3767 24.8791 24.1256 24.8791C23.8744 24.8791 23.6512 24.8233 23.4558 24.7395C23.2605 24.6558 23.0651 24.5442 22.9256 24.3767C22.786 24.2372 22.6465 24.0419 22.5628 23.8465C22.4791 23.6512 22.4233 23.4279 22.4233 23.1767C22.4233 22.9535 22.4791 22.7302 22.5628 22.507C22.6465 22.3116 22.7581 22.1163 22.9256 21.9767C23.0651 21.8372 23.2605 21.6977 23.4558 21.614C23.6512 21.5302 23.8744 21.4744 24.1256 21.4744C24.3767 21.4744 24.6 21.5302 24.7953 21.614C24.9907 21.6977 25.186 21.8093 25.3256 21.9767C25.4651 22.1163 25.6047 22.3116 25.6884 22.507C25.7721 22.7023 25.8279 22.9256 25.8279 23.1767ZM19.5488 23.1767C19.5488 23.4279 19.493 23.6233 19.4093 23.8465C19.3256 24.0419 19.214 24.2372 19.0465 24.3767C18.8791 24.5163 18.7116 24.6558 18.5163 24.7395C18.3209 24.8233 18.0977 24.8791 17.8465 24.8791C17.5953 24.8791 17.3721 24.8233 17.1767 24.7395C16.9814 24.6558 16.786 24.5442 16.6465 24.3767C16.507 24.2372 16.3674 24.0419 16.2837 23.8465C16.2 23.6512 16.1442 23.4279 16.1442 23.1767C16.1442 22.9535 16.2 22.7302 16.2837 22.507C16.3674 22.3116 16.4791 22.1163 16.6465 21.9767C16.786 21.8372 16.9814 21.6977 17.1767 21.614C17.3721 21.5302 17.5953 21.4744 17.8465 21.4744C18.0977 21.4744 18.3209 21.5302 18.5163 21.614C18.7116 21.6977 18.907 21.8093 19.0465 21.9767C19.186 22.1163 19.3256 22.3116 19.4093 22.507C19.493 22.7023 19.5488 22.9256 19.5488 23.1767ZM26.5814 28.786C25.8837 29.4837 25.0465 30.014 24.0977 30.4326C23.1488 30.8233 22.1163 31.0186 21 31.0186C19.8837 31.0186 18.8512 30.8233 17.9023 30.4326C16.9535 30.0419 16.1163 29.4837 15.4186 28.786C14.7209 28.0884 14.1628 27.2791 13.7442 26.3302C13.3535 25.4093 13.1581 24.4326 13.1302 23.3721H15.0279C15.0558 23.707 15.1116 24.014 15.2512 24.293C15.3907 24.6279 15.586 24.9349 15.8651 25.186C16.1163 25.4372 16.4233 25.6326 16.7581 25.7721C17.093 25.9116 17.4837 25.9953 17.8744 25.9953C18.293 25.9953 18.6558 25.9116 18.9907 25.7721C19.3256 25.6326 19.6326 25.4372 19.8837 25.186C20.1349 24.9349 20.3302 24.6279 20.4977 24.293C20.5814 24.0698 20.6651 23.8186 20.693 23.5674H21.307C21.3349 23.8186 21.3907 24.0698 21.5023 24.293C21.6419 24.6279 21.8372 24.9349 22.1163 25.186C22.3674 25.4372 22.6744 25.6326 23.0093 25.7721C23.3442 25.9116 23.7349 25.9953 24.1256 25.9953C24.5442 25.9953 24.907 25.9116 25.2419 25.7721C25.5767 25.6326 25.8837 25.4372 26.1349 25.186C26.386 24.9349 26.5814 24.6279 26.7488 24.293C26.8605 24.014 26.9442 23.707 26.9721 23.3721H28.8698C28.8698 24.4326 28.6465 25.4372 28.2837 26.3302C27.8651 27.2791 27.307 28.1163 26.5814 28.786Z" fill="white" />
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Outbrain
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Install Outbrain Pixel to track customers attracted by Outbrain ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.OUTBRAIN?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('OUTBRAIN')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.OUTBRAIN?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.OUTBRAIN?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.OUTBRAIN?.id, integrationsData?.OUTBRAIN?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.OUTBRAIN?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.BING_MICROSOFT_ADS?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('BING_MICROSOFT_ADS')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={bingLogo} alt="bingLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Bing Microsoft Ads
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Connect Bing Tag to track customers attracted by Microsoft ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.BING_MICROSOFT_ADS?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('BING_MICROSOFT_ADS')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.BING_MICROSOFT_ADS?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.BING_MICROSOFT_ADS?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.BING_MICROSOFT_ADS?.id, integrationsData?.BING_MICROSOFT_ADS?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.BING_MICROSOFT_ADS?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 1 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.GOOGLE_PLACES?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('GOOGLE_PLACES')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_929_249)">
                                                                <path d="M399.883 0H0.117188C0.0524666 0 0 0.0524666 0 0.117188V399.883C0 399.948 0.0524666 400 0.117188 400H399.883C399.948 400 400 399.948 400 399.883V0.117188C400 0.0524666 399.948 0 399.883 0Z" fill="white" />
                                                                <path d="M0 400V0H400L0 400Z" fill="#35A85B" />
                                                                <path d="M200 225L25 400H375L200 225Z" fill="#5881CA" />
                                                                <path d="M225 200L400 25V375L225 200Z" fill="#C1C0BE" />
                                                                <path d="M0 400L400 0Z" fill="black" />
                                                                <path d="M0 400L400 0" stroke="#FADB2A" strokeWidth="71" />
                                                                <path d="M136.719 135.156H175.781C175.386 144.807 171.937 154.018 166.009 161.252C160.082 168.486 152.035 173.304 143.214 174.9C134.393 176.497 125.331 174.776 117.544 170.025C109.756 165.274 103.714 157.78 100.427 148.796C97.1407 139.812 96.8081 129.882 99.4853 120.665C102.163 111.449 107.687 103.503 115.137 98.1566C122.586 92.8102 131.509 90.3867 140.414 91.291C149.319 92.1953 157.667 96.3726 164.062 103.125" stroke="#F2F2F2" strokeWidth="22" />
                                                                <path d="M275.781 66.4062C275.781 51.9022 281.543 37.9922 291.799 27.7363C302.055 17.4805 315.965 11.7188 330.469 11.7188C344.973 11.7188 358.883 17.4805 369.139 27.7363C379.395 37.9922 385.156 51.9022 385.156 66.4062C385.156 121.094 330.469 121.094 330.469 189.062C330.469 121.094 275.781 121.094 275.781 66.4062Z" fill="#DE3738" />
                                                                <path d="M330.469 89.0625C341.256 89.0625 350 80.3181 350 69.5312C350 58.7444 341.256 50 330.469 50C319.682 50 310.938 58.7444 310.938 69.5312C310.938 80.3181 319.682 89.0625 330.469 89.0625Z" fill="#7D2426" />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_929_249">
                                                                    <rect width="400" height="400" rx="90" fill="white" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Google Places
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Address Autofill
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Use Google Places to enable address autofill for your customers.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.GOOGLE_PLACES?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('GOOGLE_PLACES')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.GOOGLE_PLACES?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.GOOGLE_PLACES?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.GOOGLE_PLACES?.id, integrationsData?.GOOGLE_PLACES?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.GOOGLE_PLACES?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 4 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.HOTJAR?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('HOTJAR')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={hotjarLogo} alt="hotjarLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Hotjar
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Analytics & Tracking Tool
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Monitor shopper behaviour during checkout with Hotjar recordings
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.HOTJAR?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('HOTJAR')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.HOTJAR?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.HOTJAR?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.HOTJAR?.id, integrationsData?.HOTJAR?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.HOTJAR?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 4 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.TRACKIFY?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('TRACKIFY')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={trackifyLogo} alt="trackifyLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Trackify
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Analytics & Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Manage Multiple Facebook Pixels, Feed and Facebook Audiences In One App
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.TRACKIFY?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('TRACKIFY')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.TRACKIFY?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.TRACKIFY?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.TRACKIFY?.id, integrationsData?.TRACKIFY?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.TRACKIFY?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 3 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.SMSBUMP?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('SMSBUMP')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={SMSBumpLogo} alt="SMSBumpLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            SMSBump
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            SMS Sender
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Connect SMSBump to set up flows with new subscribers.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.SMSBUMP?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('SMSBUMP')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.SMSBUMP?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.SMSBUMP?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.SMSBUMP?.id, integrationsData?.SMSBUMP?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.SMSBUMP?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 3 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.OMNISEND?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('OMNISEND')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={omnisendLogo} alt="omnisendLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Omnisend
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Email & SMS Sender
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Connect Omnisend to set up flows with new subscribers.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.OMNISEND?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('OMNISEND')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.OMNISEND?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.OMNISEND?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.OMNISEND?.id, integrationsData?.OMNISEND?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.OMNISEND?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.REDDIT?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('REDDIT')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={redditLogo} alt="redditLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Reddit
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Activate Reddit Pixel to track conversions coming from Reddit Ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.REDDIT?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('REDDIT')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.REDDIT?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.REDDIT?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.REDDIT?.id, integrationsData?.REDDIT?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.REDDIT?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>

                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 2 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.QUORA?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('QUORA')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <img src={quoraLogo} alt="quoraLogo" />
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Quora
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            Ads Tracking
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Activate Quora Pixel to track conversions coming from Quora Ads.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.QUORA?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('QUORA')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.QUORA?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.QUORA?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.QUORA?.id, integrationsData?.QUORA?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.QUORA?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>
                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                    {selectedTab == 0 || selectedTab == 3 ?
                                        <Layout.Section oneThird>
                                            <Card sectioned
                                                actions={
                                                    integrationsData?.POSTSCRIPT?.params == null ? '' : integrationOptionSheet ?
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                        }] :
                                                        [{
                                                            content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                                            onAction: () => handleEditIntegration('POSTSCRIPT')
                                                        }]
                                                }
                                            >
                                                <Stack>
                                                    <span>
                                                        <svg width="42" height="42" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="400" height="400" rx="100" fill="#3598D3" />
                                                            <path d="M110.576 12.9476C136.037 2.54531 163.444 -1.68612 190.851 0.605906C192.619 0.782216 194.21 1.13484 195.802 1.48745C186.961 3.95579 177.943 5.36627 169.456 8.71615C164.858 9.95032 160.438 11.1845 155.841 12.2424C94.1316 24.4077 42.1473 73.5982 24.4655 133.544C23.2278 136.893 21.8133 140.243 20.5756 143.593C9.78974 165.279 5.36928 189.434 3.42429 213.236C1.83293 207.946 0.948848 202.481 0.772031 197.015C-2.76432 158.579 5.89974 119.791 25.7033 86.6451C45.1532 53.6751 75.0353 27.7576 110.576 12.9476ZM205.703 1.48745C249.908 -4.15446 295.88 9.95033 330.89 37.4547C369.259 67.6036 393.837 112.034 398.965 160.519C401.44 185.379 399.672 210.944 391.538 234.569V233.159C391.538 227.869 391.715 222.58 392.069 217.291C393.837 166.161 373.149 114.149 335.134 79.5927C332.128 76.4191 328.945 73.4218 325.939 70.2483C311.263 52.2647 292.874 37.631 272.01 27.405C264.76 23.5262 257.511 19.8237 250.084 16.2975C236.293 8.53985 220.556 6.0715 205.703 1.13483M4.13155 223.109C7.31426 231.395 9.43611 240.035 12.7956 248.145C20.3988 267.363 31.1846 284.994 44.7995 300.509C56.2927 312.851 68.6699 324.84 83.5226 332.95L89.1807 337.71C101.381 351.815 117.118 362.923 133.385 371.738C164.682 388.311 200.399 395.011 235.585 390.956C182.54 409.292 120.654 399.242 75.9194 365.391C37.1964 336.3 11.7347 292.928 5.19246 244.971C4.66201 237.919 3.42428 230.514 4.13155 223.109ZM322.226 329.071C353.346 308.619 376.155 277.06 389.24 242.679C381.813 289.049 356.352 330.482 318.513 358.339C300.831 371.385 280.851 380.906 259.633 386.548C253.621 388.311 247.432 389.545 241.244 390.074C251.499 384.785 262.285 380.73 272.01 374.383C289.338 363.451 305.428 350.052 317.452 333.479C319.043 332.068 320.635 330.658 322.226 329.071Z" fill="#3598D3" />
                                                            <path d="M132.855 156.464C140.458 147.119 153.012 143.064 164.682 145.003C178.12 146.414 189.613 155.935 195.802 167.571C199.868 175.858 201.636 185.202 200.929 194.37C200.752 208.122 194.564 220.993 183.955 229.632C173.699 237.742 160.084 240.034 147.707 235.979C141.872 233.687 136.745 229.632 133.031 224.519C133.031 243.032 133.031 261.544 133.031 280.233H104.564C104.564 235.45 104.564 190.491 104.564 145.709C114.112 145.709 123.66 145.709 133.208 145.709C133.031 149.235 133.031 152.937 132.855 156.464Z" fill="white" />
                                                            <path d="M149.299 169.334C144.701 170.216 140.458 172.684 137.452 176.387C132.501 182.558 132.324 191.021 133.739 198.426C136.214 209.886 150.006 217.291 160.615 211.825C170.693 207.417 174.23 194.899 171.578 184.85C169.456 174.624 159.731 167.748 149.299 169.334Z" fill="white" />
                                                            <path d="M219.141 156.111C228.159 146.414 242.128 143.946 254.858 144.827C265.821 145.356 277.491 149.059 284.741 157.874C288.807 162.634 290.222 168.805 290.929 174.8C281.381 174.8 271.656 174.8 262.108 174.8C260.87 172.508 260.693 169.334 258.041 168.1C253.09 165.984 247.255 165.984 242.304 168.276C239.652 169.687 238.768 172.86 240.006 175.329C240.359 176.034 241.067 176.739 241.774 177.268C247.963 181.676 255.919 181.147 262.815 183.263C269.711 185.378 277.137 187.142 283.149 191.549C292.521 198.954 293.405 213.941 286.509 223.285C279.613 232.629 267.413 237.213 255.919 237.742C243.719 238.448 230.458 235.979 221.086 227.693C215.075 222.58 212.776 214.822 211.892 207.417H240.536C242.481 217.114 256.803 218.525 262.462 211.472C264.23 209.18 263.876 205.654 261.578 203.891C261.224 203.538 260.693 203.362 260.34 203.186C247.609 197.191 232.049 198.602 220.556 189.962C209.593 182.381 210.124 164.926 219.141 156.111Z" fill="white" />
                                                            <path d="M169.456 8.71613C177.943 5.36624 187.137 3.77946 195.802 1.48743C198.984 1.13481 202.344 1.13481 205.526 1.31112C220.379 6.2478 236.116 8.71613 249.908 16.4738C240.713 15.0633 232.049 11.8897 222.855 10.6555C205.173 7.12934 187.314 8.36351 169.456 8.71613ZM24.4655 133.543C41.9704 73.5981 94.1316 24.4077 155.841 12.2423C151.244 15.2396 146.469 17.8842 141.519 20.3526C119.77 31.6364 100.674 47.5043 85.8211 67.0747L80.6935 71.6587C68.1394 79.24 57.7072 89.8186 47.8054 100.574C38.7877 110.623 31.8918 122.26 24.4655 133.543ZM272.01 27.5813C292.874 37.8072 311.263 52.441 325.939 70.4246C320.104 67.251 314.623 63.3722 308.965 60.0223C307.373 58.6118 305.782 57.3776 304.191 55.9672C294.642 45.036 282.619 37.102 272.01 27.5813ZM335.134 79.769C373.149 114.326 393.837 166.337 392.069 217.467C391.715 222.756 391.538 228.046 391.538 233.335C391.185 236.508 390.477 239.858 389.416 242.856C376.155 277.236 353.523 308.972 322.226 329.247C324.525 325.016 327 320.961 329.652 316.906C340.261 301.214 346.273 283.054 352.108 265.247C359.711 250.261 363.955 234.04 366.961 217.643C369.082 206.888 368.552 195.957 368.552 185.202C369.259 153.466 359.534 122.083 343.621 94.9316C340.261 89.9949 337.432 85.0583 335.134 79.769ZM3.42427 213.236C5.36926 189.257 9.78971 165.103 20.5756 143.593C18.8074 155.935 16.6856 168.277 15.9783 180.795C15.9783 198.778 17.2161 216.762 21.6365 234.216C30.1237 266.657 47.275 297.159 72.383 319.727C76.6266 323.782 80.3398 328.366 83.6993 333.126C68.8467 325.016 56.4695 313.027 44.9763 300.685C31.3614 285.17 20.5755 267.363 12.9724 248.321C9.61287 240.211 7.49107 231.572 4.30836 223.285C3.60109 219.759 3.24745 216.585 3.42427 213.236ZM292.344 345.997C301.008 342.471 308.965 337.181 317.629 333.302C305.428 349.876 289.338 363.275 272.01 374.206C262.285 380.553 251.499 384.609 241.244 389.898C239.475 390.427 237.53 390.956 235.762 391.132C200.576 395.187 164.858 388.487 133.562 371.914C117.118 363.099 101.558 351.991 89.3575 337.887C99.2593 341.942 108.631 347.055 118.532 351.11C134.269 360.102 152.128 363.98 169.809 366.978C180.242 368.212 190.851 367.507 201.46 367.683C217.904 367.683 233.994 363.451 249.554 358.867C264.23 355.87 278.906 352.344 292.344 345.997Z" fill="#0764B1" />
                                                            <path d="M155.841 12.2421C160.438 11.1842 165.035 9.95007 169.456 8.71591C187.314 8.36329 205.173 7.12912 222.855 10.479C232.049 11.7132 240.713 15.0631 249.908 16.2972C257.334 19.6471 264.76 23.3496 271.833 27.4047C282.442 36.9255 294.466 44.8594 304.014 55.6143C277.491 40.0991 246.725 31.1072 215.782 31.8125C192.796 31.1072 169.456 32.8703 147.354 39.9227C137.629 43.2726 128.257 47.5041 118.709 51.3829C106.862 54.7328 96.4302 61.0799 85.6443 66.8981C100.497 47.5041 119.416 31.4599 141.342 20.176C146.469 17.884 151.244 15.2394 155.841 12.2421ZM308.788 59.8458C314.446 63.1956 319.927 67.0744 325.762 70.248C328.768 73.4216 331.951 76.4189 334.957 79.5924C337.255 84.8817 340.261 89.8184 343.621 94.4025C359.534 121.731 369.259 153.114 368.552 184.673C368.375 195.428 368.906 206.359 366.961 217.114C363.955 233.511 359.711 249.908 352.108 264.718C352.638 260.839 352.815 257.136 353.523 253.258C359.711 233.687 363.778 213.235 363.071 192.783C363.424 175.505 359.711 158.227 354.23 141.83C349.456 127.901 342.206 115.031 335.487 101.984C329.652 86.4685 318.513 73.5979 308.788 59.8458ZM47.8054 100.573C57.7072 89.8184 68.1394 79.2398 80.6934 71.6585C76.4498 80.474 69.9076 87.879 66.7249 97.2234C60.5363 107.449 53.8172 117.499 48.8663 128.607C35.9587 157.874 31.7151 190.315 36.6659 221.874C37.9037 231.219 40.7327 240.211 42.6777 249.379C45.33 266.833 52.049 283.23 60.1826 298.922C63.719 306.151 68.6698 312.674 72.383 319.903C47.275 297.335 30.1237 266.833 21.6365 234.392C17.0392 216.938 15.8015 198.954 15.9783 180.971C16.8624 168.453 18.9842 156.111 20.7524 143.769C22.1669 140.419 23.4046 137.069 24.6423 133.72C31.8918 122.436 38.7877 110.799 47.8054 100.573ZM118.709 351.11C139.22 356.575 160.438 362.041 181.833 359.572C193.149 359.749 204.466 359.22 215.605 359.572C226.921 361.336 238.414 358.867 249.731 358.691C234.171 363.275 218.08 367.506 201.636 367.506C191.027 367.33 180.418 368.035 169.986 366.801C152.304 363.98 134.446 360.101 118.709 351.11Z" fill="#0C4EA2" />
                                                            <path d="M147.354 40.099C169.456 33.0466 192.796 31.2835 215.782 31.9887C226.568 34.6334 237.884 35.3386 248.493 39.0411C268.297 46.0935 287.746 55.438 303.837 69.1901C315.507 79.0635 325.409 90.6999 335.134 102.336C341.853 115.383 349.102 128.254 353.876 142.182C359.357 158.579 362.894 175.681 362.717 192.96C363.424 213.588 359.358 234.04 353.169 253.434C345.566 271.77 335.664 289.401 322.403 304.211C310.025 318.316 295.173 330.129 278.729 339.12C259.456 350.757 237.177 356.046 215.251 359.572C203.935 359.22 192.619 359.572 181.479 359.572C170.517 357.633 159.377 355.87 148.768 352.52C135.153 348.112 122.069 342.118 110.045 334.36C100.32 328.366 92.0098 320.784 83.5226 313.379C69.0235 298.393 56.2927 281.467 48.1591 262.073C46.3909 257.842 44.4459 253.61 42.5009 249.379C40.7327 240.211 37.7269 231.219 36.4891 221.874C31.5383 190.315 35.7819 158.05 48.6895 128.607C53.6404 117.675 60.3595 107.626 66.5481 97.2234C72.0294 91.2288 76.8035 84.3527 82.9921 79.0635C90.9488 72.0111 98.9056 64.9587 108.1 59.3168C111.813 57.0247 115.35 54.3801 118.709 51.5591C128.257 47.6803 137.805 43.4489 147.354 40.099ZM133.031 156.64C133.031 152.937 133.031 149.411 133.031 145.709C123.483 145.709 113.935 145.709 104.387 145.709C104.387 190.491 104.387 235.45 104.387 280.233H132.855C132.855 261.72 132.855 243.208 132.855 224.519C136.568 229.632 141.695 233.687 147.53 235.979C159.908 240.211 173.523 237.742 183.778 229.632C194.564 220.993 200.752 207.946 200.752 194.194C201.46 185.026 199.692 175.681 195.625 167.395C189.613 155.758 177.943 146.238 164.505 144.827C153.012 143.064 140.458 147.119 133.031 156.64ZM219.141 156.111C210.124 165.103 209.77 182.557 220.556 190.315C232.226 198.778 247.786 197.367 260.34 203.538C263.169 204.772 264.407 207.946 263.169 210.591C262.992 211.12 262.815 211.472 262.462 211.825C256.803 218.877 242.481 217.467 240.536 207.77H211.715C212.599 215.175 214.898 222.932 220.91 228.045C230.281 236.332 243.542 238.8 255.743 238.095C267.236 237.566 279.259 233.158 286.332 223.638C293.405 214.117 292.344 199.307 282.972 191.902C277.137 187.494 269.711 185.731 262.638 183.615C255.566 181.499 247.609 181.852 241.597 177.621C239.122 176.034 238.591 172.684 240.183 170.216C240.713 169.51 241.42 168.805 242.128 168.453C247.079 166.161 252.737 166.161 257.864 168.276C260.517 169.334 260.693 172.684 261.931 174.976C271.479 174.976 281.204 174.976 290.752 174.976C290.045 168.981 288.454 162.811 284.564 158.05C277.314 149.235 265.821 145.532 254.682 145.003C242.128 144.122 227.982 146.59 219.141 156.111ZM149.299 169.51C159.731 167.924 169.633 174.623 171.754 185.026C174.23 195.075 170.87 207.593 160.792 212.001C150.183 217.467 136.214 210.062 133.915 198.602C132.501 191.197 132.678 182.734 137.629 176.563C140.458 172.86 144.524 170.392 149.299 169.51Z" fill="#282979" />
                                                            <path d="M215.959 31.9888C246.725 31.2836 277.668 40.2754 304.191 55.7906C305.782 57.2011 307.373 58.6116 308.965 59.8458C318.69 73.4216 329.829 86.4686 335.487 102.336C325.762 90.7 315.86 79.0635 304.191 69.1902C287.923 55.6143 268.65 46.0936 248.67 39.0412C238.061 35.3387 226.745 34.6335 215.959 31.9888ZM85.8211 67.2508C96.4302 61.2562 107.039 55.0854 118.886 51.7355C115.526 54.5565 111.99 57.0248 108.277 59.4932C99.2593 65.1351 91.3025 72.3638 83.1689 79.2399C76.9803 84.5291 72.2062 91.4052 66.7249 97.3998C69.9076 88.0553 76.4498 80.6503 80.6935 71.8348L85.8211 67.2508ZM42.6777 249.379C44.4459 253.61 46.5677 257.842 48.3359 262.073C56.4695 281.291 69.2003 298.393 83.6993 313.379C92.1865 320.784 100.674 328.366 110.222 334.36C122.245 342.118 135.33 348.112 148.945 352.52C159.554 356.046 170.693 357.633 181.656 359.572C160.261 362.041 139.043 356.575 118.532 351.11C108.631 347.054 99.0824 341.942 89.3575 337.886L83.6993 333.126C80.3398 328.189 76.6266 323.782 72.383 319.726C68.6699 312.674 63.719 305.974 60.1826 298.746C52.049 283.23 45.33 266.657 42.6777 249.379ZM322.756 304.388C336.018 289.577 345.919 271.946 353.523 253.61C352.992 257.313 352.638 261.192 352.108 265.07C346.273 282.878 340.261 301.038 329.652 316.729C327 320.784 324.348 324.839 322.226 329.071C320.635 330.481 319.043 331.892 317.629 333.302C309.141 337.181 301.185 342.294 292.344 345.82C278.906 351.991 264.23 355.517 249.731 358.515C238.414 358.691 226.921 361.159 215.605 359.396C237.53 355.87 259.809 350.581 279.082 338.944C295.526 330.129 310.379 318.492 322.756 304.388Z" fill="#253C97" />
                                                        </svg>
                                                    </span>
                                                    <Stack vertical>
                                                        <Text variant="headingMd" as="h6">
                                                            Postscript
                                                        </Text>
                                                        <Text variant="bodySm" as="p">
                                                            SMS Sender
                                                        </Text>
                                                    </Stack>
                                                </Stack>

                                                <div className='Card-Description'>
                                                    <Text variant="bodyMd" as="p">
                                                        Connect Postscript to set up flows with new subscribers.
                                                    </Text>
                                                </div>

                                                <div className='Card-Active'>
                                                    {integrationsData?.POSTSCRIPT?.params == null ?
                                                        <Button primary onClick={() => handleConnectIntegration('POSTSCRIPT')}>Connect</Button> :
                                                        <>
                                                            <span>
                                                                <input
                                                                    id={integrationsData?.POSTSCRIPT?.id}
                                                                    type="checkbox"
                                                                    className="tgl tgl-light"
                                                                    checked={convertNumberToBoolean(integrationsData?.POSTSCRIPT?.isEnabled)}
                                                                    onChange={() =>
                                                                        handleEnableIntegration(integrationsData?.POSTSCRIPT?.id, integrationsData?.POSTSCRIPT?.isEnabled)
                                                                    }
                                                                />
                                                                <label htmlFor={integrationsData?.POSTSCRIPT?.id} className='tgl-btn'></label>
                                                            </span>
                                                            <Text variant="bodyMd" as="p" fontWeight='medium'>
                                                                Active
                                                            </Text>
                                                        </>
                                                    }
                                                </div>
                                            </Card>
                                        </Layout.Section>
                                        : ''
                                    }

                                </Layout>
                            </div>
                        </>
                    }

                </Tabs>
            </Page>
            {toastErrorMsg}
            {toastSuccessMsg}
        </div>

    )
}
