import {
    Page, Layout, Card, Stack, Button, Scrollable,
} from '@shopify/polaris';
import React, { useState, useEffect, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import tickIcon from '../../assets/icons/tickIcon.svg'
import { Loader } from '../../components'
import axios from "axios";


export function ThankYouPage() {
    const API_URL = 'https://ecommercehack.com'
    let defaultFavicon = "https://ecommercehack.com/fav-checkout.png"
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [countriesList, setCountriesList] = useState([])
    const [headerPanelStatus, setHeaderPanelStatus] = useState(false)
    const [userDetails, setUserDetails] = useState([])
    const [customization, setCustomization] = useState([])
    const [localizations, setLocalizations] = useState([])
    const [additionalOffers, setAdditionalOffers] = useState([])
    const [lineItems, setLineItems] = useState([])
    const [checkOutDetails, setCheckOutDetails] = useState([])
    const [thankYouPageOffers, setThankYouPageOffers] = useState([])
    const [thankYouPageData, setThankYouPageData] = useState([])
    const [cashPrice, setCashPrice] = useState(0)


    const [shippingDetails, setShippingDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        country: 'Pakistan',
        state: '',
        zipCode: '',
        experience: "It's great :)",
    })

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

    const ThankYouPageExtraOffers = () => {
        return (
            <>
                {thankYouPageOffers?.map((item) => {
                    return (
                        <div className='LearnMore-Section ThankYouPage-Offers'>
                            <Card subdued sectioned>
                                <div className='Order-Product-Details'>
                                    <Stack>
                                        <div className='Order-Product-Image-Section'>
                                            <div className='Order-Product-Image'>
                                                <img src={item.imageUrl} alt={item.title} />
                                            </div>
                                        </div>
                                        <div className='Order-Product-Detail-Section'>
                                            <div className='Product-Title-Section'>
                                                <h2 className='Product-Title'>{item.title} </h2>
                                                {item.price &&
                                                    <h2 className='Product-Title'>{userDetails?.currency_symbol}
                                                        {item?.price && Number(item?.price).toFixed(2)}</h2>
                                                }
                                            </div>
                                            <span className='Product-Extras'>
                                                <p>
                                                    {item.description}
                                                </p>
                                                <a href={item.buttonUrl ? item.buttonUrl : checkOutDetails?.originUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer">
                                                    <Button primary>{item.buttonText ? item.buttonText : 'Buy Now'}</Button>
                                                </a>
                                            </span>
                                        </div>
                                    </Stack>
                                </div>
                            </Card>
                        </div>
                    )
                })}
            </>
        )
    }

    const ExtraOffers = () => {
        return (
            <>
                {additionalOffers?.map((item) => {
                    return (
                        <Card sectioned>
                            <div className='Order-Product-Details'>
                                <Stack>
                                    <div className='Order-Product-Image-Section'>
                                        <div className='Order-Product-Image'>
                                            <img src={item?.imageUrl} alt={item?.title} />
                                        </div>
                                    </div>
                                    <div className='Order-Product-Detail-Section'>
                                        <div className='Product-Title-Section'>
                                            <span className='Product-Title'>
                                                {item?.title}
                                                <p className='Product-Extras'>{item?.description}</p>
                                            </span>
                                            <p className='Product-Title'>{userDetails?.currency_symbol}
                                                {item?.price && Number(item?.price).toFixed(2)}</p>
                                        </div>

                                    </div>
                                </Stack>
                            </div>
                        </Card>
                    )
                })}
            </>
        )
    }

    function changeBGColor(color) {
        var cols = document.getElementsByClassName('Polaris-Frame');
        for (let i = 0; i < cols.length; i++) {
            cols[i].style.backgroundColor = `${color}`;
        }
    }

    function getCountryNameFromId() {
        let value = ''
        let country = countriesList.find(obj => obj.id == shippingDetails?.country)
        if (country?.code == 'US') {
            value = localizations?.OS_TaxUs
        }
        else if (country?.code == 'CA') {
            value = localizations?.OS_TaxCa
        }
        else if (country?.code == 'AU' || country?.code == 'IN') {
            value = localizations?.OS_TaxAuIn
        }
        else {
            value = localizations?.OS_TaxOther
        }
        return value
    }

    function stringFilter(value) {
        let label = value.replace('{{support_email}}', 'info@checkify.pro')
        return label;
    }

    const getCountriesList = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/countries`)
            // console.log('getCountriesList response: ', response.data);
            setCountriesList(response.data)

        } catch (error) {
            console.warn('getCountriesList Api Error', error.response);
        }
    }

    function getSystemLanguage() {
        let lang = ''
        let userLang = navigator.language || navigator.systemLanguage;
        if (userLang == 'en-US' || userLang == 'en-us' || userLang == 'en-gb' || userLang == 'en-GB' || userLang == 'en'
            || userLang == 'en-au' || userLang == 'en-ca' || userLang == 'en-nz' || userLang == 'en-ie' || userLang == 'en-za'
            || userLang == 'en-jm' || userLang == 'en-bz' || userLang == 'en-tt') {
            lang = 'en'
        }
        else if (userLang == 'ar' || userLang == 'ar-sa' || userLang == 'ar-iq' || userLang == 'ar-eg' || userLang == 'ar-ly'
            || userLang == 'ar-dz' || userLang == 'ar-ma' || userLang == 'ar-tn' || userLang == 'ar-om' || userLang == 'ar-ye'
            || userLang == 'ar-sy' || userLang == 'ar-jo' || userLang == 'ar-lb' || userLang == 'ar-kw' || userLang == 'ar-ae'
            || userLang == 'ar-bh' || userLang == 'ar-qa') {
            lang = 'ar'
        }
        else if (userLang == 'zh-CN' || userLang == 'zh-cn' || userLang == 'zh-tw' || userLang == 'zh-hk' || userLang == 'zh-sg') {
            lang = 'zh-cn'
        }
        else if (userLang == 'fr' || userLang == 'fr-be' || userLang == 'fr-ca' || userLang == 'fr-ch' || userLang == 'fr-lu') {
            lang = 'fr'
        }
        else if (userLang == 'de' || userLang == 'de-ch' || userLang == 'de-at' || userLang == 'de-lu' || userLang == 'de-li') {
            lang = 'de'
        }
        else if (userLang == 'ru' || userLang == 'ru-mo') {
            lang = 'ru'
        }
        else if (userLang == 'it' || userLang == 'it-ch') {
            lang = 'it'
        }
        else if (userLang == 'ur') {
            lang = 'ur'
        }
        else if (userLang == 'hi') {
            lang = 'hi'
        }
        else if (userLang == 'ja') {
            lang = 'ja'
        }

        return lang;
    }

    const getLocalizations = async (user) => {
        let selectedLanguage = getSystemLanguage()
        try {
            let response = ''
            if (selectedLanguage) {
                response = await axios.get(`${API_URL}/api/localizations/${selectedLanguage}?storeName=${user?.shopifyShopDomainName}`)
            }
            // console.log('getLocalizations response: ', response.data);

            setLocalizations(response?.data)

        } catch (error) {
            console.warn('getLocalizations Api Error', error.response);
        }
    }

    const getCartDetails = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/api/checkout?id=${id}`)
            // console.log('getCartDetails response: ', response.data);

            if (!convertNumberToBoolean(response.data?.checkout?.isPaid)) {
                navigate(`/checkout?id=${id}`)
            }
            else {
                setUserDetails(response.data?.user)
                setCustomization(response.data?.customization)
                setLocalizations(response.data?.localization)
                setLineItems(response.data?.cart?.line_items)
                setCheckOutDetails(response.data?.checkout)
                setThankYouPageOffers(response.data?.thankyou_offers)
                let totalPrice = 0;
                response.data?.cart?.line_items?.map((item) => {
                    totalPrice = totalPrice + (item.original_price * item.quantity)
                })

                if (response.data?.checkout?.oldShippingFormDetails) {
                    setShippingDetails(JSON.parse(response.data?.checkout?.oldShippingFormDetails))
                }
                if (response.data?.checkout?.oldThankYouPageData) {
                    setThankYouPageData(JSON.parse(response.data?.checkout?.oldThankYouPageData))
                }
                if (response.data?.checkout?.oldSelectedOffer) {
                    setAdditionalOffers(JSON.parse(response.data?.checkout?.oldSelectedOffer))
                }
                if (response.data?.checkout?.oldPaymentSelectedTab == 'cash') {
                    if (response.data?.checkout?.CODPrice) {
                        setCashPrice(Number(response.data?.checkout?.CODPrice))
                    }
                }

                if (convertNumberToBoolean(response.data?.customization?.transByDevice)) {
                    getLocalizations(response.data?.user)
                }


                if (response.data?.custom_script) {
                    response.data?.custom_script?.map((item) => {
                        let head = document.getElementsByTagName('head')[0];
                        let body = document.getElementsByTagName('body')[0];

                        if (item.page == 'thankYouPage' || item.page == 'all') {
                            let xmlString = item.script;
                            let doc = new DOMParser().parseFromString(xmlString, "text/xml");
                            let script = doc.querySelector('script');
                            let noscript = doc.querySelector('noscript');
                            let style = doc.querySelector('style');
                            if (script) {
                                if (item.type == 'header') {
                                    head.appendChild(script);
                                }
                                else if (item.type == 'footer') {
                                    body.appendChild(script);
                                }
                            }
                            if (noscript) {
                                if (item.type == 'header') {
                                    head.appendChild(noscript);
                                }
                                else if (item.type == 'footer') {
                                    body.appendChild(noscript);
                                }
                            }
                            if (style) {
                                if (item.type == 'header') {
                                    head.appendChild(style);
                                }
                                else if (item.type == 'footer') {
                                    body.appendChild(style);
                                }
                            }
                        }
                    })
                }

                setLoading(false)
            }
        } catch (error) {
            console.warn('getCartDetails Api Error', error);
            window.location.replace('https://ecommercehack.com/login');
        }
    }


    useEffect(() => {
        let id = location.search.replace('?id=', '')
        getCartDetails(id)
        getCountriesList()
    }, [])

    useEffect(() => {
        changeBGColor(customization.backgroundColor)
        document.documentElement.style.setProperty('--form-input-error-color', customization?.errorColor);
        document.documentElement.style.setProperty('--checkify-btn-color', customization?.buttonsColor);
        document.documentElement.style.setProperty('--checkify-accent-color', customization?.accentColor);
        document.documentElement.style.setProperty('--checkify-stripe-color', customization?.cardColor);
        document.documentElement.style.setProperty('--checkify-text-color', customization?.textColor);

        document.documentElement.style.setProperty('--checkify-font-title', customization?.fontText);
        document.documentElement.style.setProperty('--checkify-font-body', customization?.fontBody);
        document.documentElement.style.setProperty('--checkify-font-btn', customization?.fontButton);

    }, [customization])

    const AboutUsSection = () => {
        return (
            <>
                <div className='Order-Product-Detail-Section'>
                    <Card sectioned>
                        <Stack>
                            <p className='Heading'>{localizations?.SD_ShippingDetails}</p>
                            <div>
                                <p className='Content'>{shippingDetails?.firstName} {shippingDetails?.lastName}</p>
                                <p className='Content'>{shippingDetails?.email}</p>
                                <p className='Content'>{thankYouPageData[0]?.countryName}</p>
                                <p className='Content'>{shippingDetails?.address}</p>
                                <p className='Content'>{shippingDetails?.city} {thankYouPageData[0]?.stateName}, {shippingDetails?.zipCode}</p>
                                <p className='Content'>{shippingDetails?.experience}</p>
                            </div>
                        </Stack>

                        <Stack>
                            <p className='Heading'>{localizations?.PM_PaymentMethod}</p>
                            <div>
                                <p className='Content'>{thankYouPageData[0]?.paymentMethod}</p>
                            </div>
                        </Stack>
                        {thankYouPageData[0]?.shippingName ?
                            <Stack>
                                <p className='Heading'>{localizations?.SO_ShippingMethod}</p>
                                <div>
                                    <p className='Content'>
                                        {thankYouPageData[0]?.shippingName}
                                    </p>
                                    <p className='Content-Small'>
                                        {thankYouPageData[0]?.shippingDescription}
                                    </p>
                                </div>
                            </Stack>
                            : ''
                        }
                    </Card>
                </div>

                <div className='Footer-Section'>
                    <Stack>
                        {customization?.returnsPolicyUrl &&
                            <span className='Footer-Item'>
                                <a className="jss142" href={customization?.returnsPolicyUrl} target="_blank" rel="noreferrer">{localizations?.FL_ReturnsPolicy}</a>
                            </span>
                        }

                        {customization?.shippingPolicyUrl &&
                            <span className='Footer-Item'>
                                <a className="jss142" href={customization?.shippingPolicyUrl} target="_blank" rel="noreferrer">{localizations?.FL_ShippingPolicy}</a>
                            </span>
                        }

                        {customization?.privacyPolicyUrl &&
                            <span className='Footer-Item'>
                                <a className="jss142" href={customization?.privacyPolicyUrl} target="_blank" rel="noreferrer">{localizations?.FL_PrivacyPolicy}</a>
                            </span>
                        }

                        {customization?.termsAndConditionsUrl &&
                            <span className='Footer-Item'>
                                <a className="jss142" href={customization?.termsAndConditionsUrl} target="_blank" rel="noreferrer">{localizations?.FL_TermsAndConditions}</a>
                            </span>
                        }

                    </Stack>
                </div>

            </>
        )
    }

    return (
        <>
            {loading ? <Loader /> :
                <div className='container Checkout-Page Thank-You-Page'>
                    <Helmet>
                        <title>{localizations?.TYP_ThankYouPageName ? localizations?.TYP_ThankYouPageName : 'Thank You Page'}</title>
                        <link rel="icon" type="image/png" href={(customization?.favicons && customization?.favicons != 'null')
                            ? customization?.favicons : defaultFavicon} />
                    </Helmet>

                    <Page fullWidth>
                        <div className='Logo-Container'>
                            {(!customization?.rightImageUrl || customization?.rightImageUrl == 'null') && <span></span>}

                            {(customization?.leftImageUrl && customization?.leftImageUrl != 'null') ?
                                customization?.logoUrl ?
                                    <a href={customization?.logoUrl}> <img src={customization?.leftImageUrl} alt="logo" /></a> :
                                    <img src={customization?.leftImageUrl} alt="logo" /> :
                                <span></span>
                            }
                            {(customization?.rightImageUrl && customization?.rightImageUrl != 'null') ?
                                <img src={customization?.rightImageUrl} alt="logo" /> :
                                <span></span>
                            }
                        </div>
                        <Layout>
                            <Layout.Section>
                                <div className='Purchase-Complete'>
                                    <Card subdued sectioned>
                                        <div className='Order-Product-Details'>
                                            <Stack>
                                                <div className='Order-Product-Image-Section'>
                                                    <div className='Order-Product-Image'>
                                                        <img src={tickIcon} alt='thankyou' />
                                                    </div>
                                                </div>
                                                <div className='Order-Product-Detail-Section'>
                                                    <div className='Product-Title-Section'>
                                                        <h2 className='Product-Title'>{localizations?.TYP_PurchaseCompleted}</h2>
                                                    </div>
                                                    <span className='Product-Extras'>{stringFilter(localizations?.TYP_ThankYouPageText)}</span>
                                                </div>
                                            </Stack>
                                        </div>
                                    </Card>
                                </div>
                                <ThankYouPageExtraOffers />

                                <div className='Test-Section Test-Section-Desktop'>
                                    <AboutUsSection />
                                </div>

                            </Layout.Section>

                            <Layout.Section secondary>

                                <div className='Order-Summary'>
                                    <div className='Header-Mobile' onClick={() => setHeaderPanelStatus(!headerPanelStatus)}>
                                        <div className='Panel-Status'>
                                            <h1> {headerPanelStatus ? localizations?.OS_HideOrderSummary : localizations?.OS_ShowOrderSummary} </h1>
                                            <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                {headerPanelStatus ?
                                                    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path> :
                                                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                                                }
                                            </svg>
                                        </div>
                                        {convertNumberToBoolean(customization?.showCountryCurrency) && userDetails?.currency != thankYouPageData[0]?.localCurrency &&
                                            <span className='Total-Price-Local'>
                                                {`(~ ${thankYouPageData[0]?.localCurrency}
                                                    ${thankYouPageData[0]?.totalValue &&
                                                    (Number((thankYouPageData[0]?.totalValue + cashPrice) * thankYouPageData[0]?.localRate).toFixed(2))
                                                    })`
                                                }
                                            </span>
                                        }
                                        <div className='Total-Price'>
                                            {userDetails?.currency_symbol}
                                            {thankYouPageData[0]?.totalValue &&
                                                Number(thankYouPageData[0]?.totalValue + cashPrice).toFixed(2)
                                            }
                                        </div>
                                    </div>
                                    {!convertNumberToBoolean(customization?.hideSummary) &&
                                        <h1 className='Checikfy-Heading'>{localizations?.OS_OrderSummary}</h1>
                                    }

                                    <span className={`${!headerPanelStatus && 'Order-Summary-Hidden'}`}>
                                        <Card sectioned>
                                            <div className='Subdued-Card-Section'>

                                                <Card sectioned>
                                                    <Scrollable style={{ height: lineItems?.length == 1 ? '70px' : '130px' }}>
                                                        {lineItems?.map((item) => {
                                                            return (
                                                                <div className='Order-Product-Details' key={item.id}>
                                                                    <Stack>
                                                                        <div className='Order-Product-Image-Section'>
                                                                            <div className='Order-Product-Image'>
                                                                                <img src={item.product_images[0]?.src} alt={item.title} />
                                                                            </div>

                                                                            <div className='Order-Quantity'>{item.quantity}</div>
                                                                        </div>
                                                                        <div className='Order-Product-Detail-Section'>
                                                                            <div className='Product-Title-Section'>
                                                                                <h2 className='Product-Title'>{item.title}</h2>
                                                                                <h2 className='Product-Title'>
                                                                                    {userDetails?.currency_symbol}
                                                                                    {item.price && Number(item.price).toFixed(2)}
                                                                                </h2>
                                                                            </div>
                                                                        </div>
                                                                    </Stack>
                                                                </div>
                                                            )
                                                        })}
                                                    </Scrollable>
                                                </Card>
                                            </div>

                                            <div className='Order-Prices-Section'>
                                                <Stack>
                                                    <span>{localizations?.OS_Subtotal}</span>
                                                    <span>
                                                        {userDetails?.currency_symbol}
                                                        {thankYouPageData[0]?.subTotal && Number(thankYouPageData[0]?.subTotal).toFixed(2)}
                                                    </span>
                                                </Stack>

                                                {thankYouPageData[0]?.discountValue && thankYouPageData[0]?.discountValue > 0 ?
                                                    <Stack>
                                                        <span className='Order-Prices-Dual'>
                                                            {localizations?.OS_Discount}
                                                            <span className='Discount-Code'>
                                                                <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true">
                                                                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z">
                                                                    </path>
                                                                </svg>
                                                                {thankYouPageData[0]?.discountCode}
                                                            </span>
                                                        </span>
                                                        <span>
                                                            -{userDetails?.currency_symbol}
                                                            {thankYouPageData[0]?.discountValue && Number(thankYouPageData[0]?.discountValue).toFixed(2)}
                                                        </span>
                                                    </Stack>
                                                    : ''
                                                }

                                                {thankYouPageData[0]?.taxTotal && thankYouPageData[0]?.taxTotal > 0 ?
                                                    <Stack>
                                                        <span className='Order-Prices-Dual'>
                                                            {getCountryNameFromId()}
                                                            <span className='Order-Prices-Percentage'>{thankYouPageData[0]?.taxValue}</span>
                                                        </span>
                                                        <span>
                                                            {userDetails?.currency_symbol}
                                                            {thankYouPageData[0]?.taxTotal && Number(thankYouPageData[0]?.taxTotal).toFixed(2)}
                                                        </span>
                                                    </Stack>
                                                    : ''
                                                }

                                                {thankYouPageData[0]?.shippingName ?
                                                    <Stack>
                                                        <span className='Order-Prices-Dual'>
                                                            {thankYouPageData[0]?.shippingName}
                                                            <span className='Order-Prices-Percentage'>
                                                                {thankYouPageData[0]?.shippingDescription}
                                                            </span>
                                                        </span>
                                                        {thankYouPageData[0]?.shippingValue > 0 ?
                                                            <span>
                                                                {userDetails?.currency_symbol}
                                                                {thankYouPageData[0]?.shippingValue && Number(thankYouPageData[0]?.shippingValue).toFixed(2)}
                                                            </span>
                                                            :
                                                            <span className='Shipping-Options-NoPrice'>
                                                                {localizations?.OS_Free}
                                                            </span>
                                                        }
                                                    </Stack>
                                                    : ''
                                                }

                                                {thankYouPageData[0]?.paymentMethod == 'cash' &&
                                                    <Stack>
                                                        <span>Payment Fee COD</span>
                                                        <span>
                                                            {userDetails?.currency_symbol}
                                                            {cashPrice && cashPrice.toFixed(2)}
                                                        </span>
                                                    </Stack>
                                                }
                                            </div>

                                            <div className='Subdued-Card-Section Warranty-Options'>
                                                <span className='Warranty-Options-Mobile'>
                                                    <ExtraOffers />
                                                </span>

                                                <span className='Warranty-Options-Desktop'>
                                                    <ExtraOffers />
                                                </span>
                                            </div>

                                            <div className='Order-Total-Section'>
                                                <p>{localizations?.OS_Total}</p>
                                                <p>
                                                    <span className='Order-Price-Currency'>{userDetails?.currency_symbol}</span>
                                                    <span className='Order-Price'>
                                                        {thankYouPageData[0]?.totalValue &&
                                                            (Number(thankYouPageData[0]?.totalValue + cashPrice).toFixed(2))
                                                        }
                                                    </span>
                                                    {convertNumberToBoolean(customization?.showCountryCurrency) && userDetails?.currency != thankYouPageData[0]?.localCurrency &&
                                                        <span className='Order-Price-Currency'>
                                                            {`(~ ${thankYouPageData[0]?.localCurrency}
                                                                ${thankYouPageData[0]?.totalValue &&
                                                                (Number((thankYouPageData[0]?.totalValue + cashPrice) * thankYouPageData[0]?.localRate).toFixed(2))
                                                                })`
                                                            }
                                                        </span>
                                                    }
                                                </p>
                                            </div>
                                        </Card>
                                    </span>

                                </div>

                                <div className='Test-Section Test-Section-Mobile'>
                                    <AboutUsSection />
                                </div>
                            </Layout.Section>
                        </Layout>
                    </Page>
                </div>
            }
        </>
    );
}




