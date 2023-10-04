import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
  Page, Layout, Badge, Card, Button, Icon, Tabs, Text, Stack, Toast, TextContainer, Loading,
  Modal, Sheet, Form, FormLayout, Scrollable, Checkbox
} from '@shopify/polaris';
import {
  HorizontalDotsMinor, MobileCancelMajor, ArrowLeftMinor,
  ExternalMinor, ChevronUpMinor, ChevronDownMinor, EditMinor
} from '@shopify/polaris-icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  SkeltonPaymentPage, getAccessToken, CheckBox, CustomBadge, InputField, CustomSelect, NotifyBanner
} from '../../components'
import { AppContext } from '../../components/providers/ContextProvider'
import { useAuthState } from '../../components/providers/AuthProvider'
import axios from "axios";
import cashLogo from '../../assets/icons/cashLogo.svg'
import SquareLogo from '../../assets/icons/SquareLogo.svg'
import paypalLogo from '../../assets/icons/paypalLogo.svg'
import stripeLogo from '../../assets/icons/stripeLogo.svg'
import paypalLargeLogo from '../../assets/paypalLargeLogo.svg'
import debitLargeLogo from '../../assets/debitLargeLogo.svg'
import applePay from '../../assets/icons/StripeLogos/applePay.svg'
import gPay from '../../assets/icons/StripeLogos/gPay.svg'
import microsoft from '../../assets/icons/StripeLogos/microsoft.svg'
import link from '../../assets/icons/StripeLogos/link.svg'
import others from '../../assets/icons/StripeLogos/others.svg'
import EmptyCheckBox from '../../assets/icons/EmptyCheckBox.png'
import FillCheckBox from '../../assets/icons/FillCheckBox.png'

import CheckboxTree from 'react-checkbox-tree';

export function PaymentMethods() {
  const { apiUrl } = useContext(AppContext);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [toggleLoadData, setToggleLoadData] = useState(true)
  const [selectedTab, setSelectedTab] = useState(0);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('')


  const [paymentSheet, setPaymentSheet] = useState({
    extraFeeType: 'fixedPrice',
    extraFee: '',
    publicKey: '',
    secretKey: '',
    applicationId: '',
    additionalPaymentGatewayEnabled: false,
    additionalPaymentGatewayStripe: false,
    additionalPaymentGatewayPayPalCard: false,
    additionalPaymentGatewayPayPalExpress: false,
    square_card: true,
    square_gift_card: false,
    square_ach: false,
    square_google_pay: false,
    square_after_pay: false,
    square_apple_pay: false,
  })
  const [paymentOptionsId, setPaymentOptionsId] = useState({
    stripe: '',
    paypal: '',
    cash: '',
    square: '',
  })
  const [paymentOptions, setPaymentOptions] = useState([])
  const [connectedPaymentOptions, setConnectedPaymentOptions] = useState([])
  const [selectedPaymentOption, setSelectedPaymentOption] = useState()
  const [isPaymentEdit, setIsPaymentEdit] = useState(true)
  const [paymentOptionSheet, setPaymentOptionSheet] = useState(false);

  const handlePaymentOptionSheet = () => {
    setPaymentOptionSheet(!paymentOptionSheet)
    setSelectedPaymentOption()
    selectAllCountries()
    setCountriesModal(false)
    setTimeout(() => {
      setIsPaymentEdit(true)
    }, 500);
    setPaymentSheet({
      extraFeeType: 'fixedPrice',
      extraFee: '',
      publicKey: '',
      secretKey: '',
      applicationId: '',
      additionalPaymentGatewayEnabled: false,
      additionalPaymentGatewayStripe: false,
      additionalPaymentGatewayPayPalCard: false,
      additionalPaymentGatewayPayPalExpress: false,
      square_card: true,
      square_gift_card: false,
      square_ach: false,
      square_google_pay: false,
      square_after_pay: false,
      square_apple_pay: false,
    })
  }

  let cash = paymentOptions.find(obj => obj.variant === 'cash');
  let stripe = paymentOptions.find(obj => obj.variant === 'stripe');
  let paypal = paymentOptions.find(obj => obj.variant === 'paypal');
  let square = paymentOptions.find(obj => obj.variant === 'square');



  // =================Countries Modal Code Start Here================
  const [countriesModal, setCountriesModal] = useState(false)
  const [allCountriesChecked, setAllCountriesChecked] = useState(true);
  const [expandedContinent, setExpandedContinent] = useState([])
  const [continentsList, setContinentsList] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [checkedCountries, setCheckedCountries] = useState([])
  const [previousCheckedCountries, setPreviousCheckedCountries] = useState([])



  const handleAllCountriesChecked = (newChecked) => {
    setAllCountriesChecked(newChecked)
    if (newChecked == true) {
      selectAllCountries()
    }
    else {
      setCheckedCountries([])
    }
  }

  const handleSelectCountriesModal = () => {
    setCountriesModal(true)
  }

  const handleCountriesCancelModal = () => {
    setCountriesModal(false)
    setCheckedCountries(previousCheckedCountries)
  }

  const handleCountriesSaveModal = () => {
    if (checkedCountries?.length > 0) {
      setCountriesModal(false)
      setPreviousCheckedCountries(checkedCountries)
    }
    else {
      setToastMsg('Atleast one country should be selected!')
      setErrorToast(true)
    }
  }

  function selectAllCountries() {
    let arr = []
    continentsList?.map((continent) => {
      continent?.children?.map((countries) => {
        arr.push(countries.value)
      })
    })
    setCheckedCountries(arr)
    setPreviousCheckedCountries(arr)
  }

  function getFirstSelectedCountry(val, countries) {
    let value = ''

    if (countries?.length > 0) {
      if (val == 'sheet') {
        value = allCountries.find(obj => obj.code == countries[0]).name
      }
      else if (val == 'table') {
        value = allCountries.find(obj => obj.code == countries[0].code).name
      }
    }

    return value;
  }

  useEffect(() => {
    setContinentsList(groupCountries(allCountries))
    if (checkedCountries?.length < allCountries?.length) {
      setAllCountriesChecked(false)
    }
    else {
      setAllCountriesChecked(true)
    }
  }, [checkedCountries])

  function countrySelected(arr, region) {
    let countries = [];
    arr?.map((item) => {
      if (region != 'Other') {
        if (item.continent == region) {
          countries.push({ value: item.code, label: item.name })
        }
      }
      else {
        if (item.continent == 'Other' || item.continent == null) {
          countries.push({ value: item.code, label: item.name })
        }
      }
    })
    return countries;
  }

  function getSelectedCountriesLength(region) {
    let number = 0
    allCountries?.map((item2) => {
      if (region != 'Other') {
        if (item2.continent == region) {
          if (checkedCountries.find(obj => obj == item2.code)) {
            number = number + 1
          }
        }
      }
      else {
        if (item2.continent == 'Other' || item2.continent == null) {
          if (checkedCountries.find(obj => obj == item2.code)) {
            number = number + 1
          }
        }
      }
    })
    return number;
  }


  function groupCountries(array) {
    let list = []
    list.push({
      value: 'Asia',
      label: <>
        <span>Asia</span>
        <span>{getSelectedCountriesLength('Asia')} countries selected</span>
      </>,
      children: countrySelected(array, 'Asia'),
    })
    list.push({
      value: 'Europe',
      label: <>
        <span>Europe</span>
        <span>{getSelectedCountriesLength('Europe')} countries selected</span>
      </>,
      children: countrySelected(array, 'Europe'),
    })
    list.push({
      value: 'Africa',
      label: <>
        <span>Africa</span>
        <span>{getSelectedCountriesLength('Africa')} countries selected</span>
      </>,
      children: countrySelected(array, 'Africa'),
    })
    list.push({
      value: 'Central_America',
      label: <>
        <span>Central America</span>
        <span>{getSelectedCountriesLength('Central America')} countries selected</span>
      </>,
      children: countrySelected(array, 'Central America'),
    })
    list.push({
      value: 'South_America',
      label: <>
        <span>South America</span>
        <span>{getSelectedCountriesLength('South America')} countries selected</span>
      </>,
      children: countrySelected(array, 'South America'),
    })
    list.push({
      value: 'North_America',
      label: <>
        <span>North America</span>
        <span>{getSelectedCountriesLength('North America')} countries selected</span>
      </>,
      children: countrySelected(array, 'North America'),
    })
    list.push({
      value: 'Oceania',
      label: <>
        <span>Oceania</span>
        <span>{getSelectedCountriesLength('Oceania')} countries selected</span>
      </>,
      children: countrySelected(array, 'Oceania'),
    })
    list.push({
      value: 'Other',
      label: <>
        <span>Other</span>
        <span>{getSelectedCountriesLength('Other')} countries selected</span>
      </>,
      children: countrySelected(array, 'Other'),
    })
    return list;

  }

  // =================Countries Modal Code Ends Here================



  // ---------------------Tabs Code Start Here----------------------
  const tabs = [
    {
      id: '1',
      content: (
        <span>
          All <Badge status="success">{paymentOptions?.length}</Badge>
        </span>
      ),
    },
    {
      id: '2',
      content: (
        <span>
          Connected <Badge status="success">{connectedPaymentOptions?.length}</Badge>
        </span>
      ),
    },
  ];

  // function handleFilterDiscounts(value) {
  //   let filteredData = []
  //   allDiscounts.filter((curElem) => {
  //     if (curElem.status === value) {
  //       filteredData.push(curElem)
  //     }
  //   });

  //   setFilteredDiscounts(filteredData)
  //   setTabLoading(false)
  // }

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    // if (selectedTabIndex === 1) {
    //   handleFilterDiscounts('active')
    // }
    // else {
    //   setTabLoading(false)
    // }
  }


  // ------------------------Toasts Code start here------------------
  const toggleErrorMsgActive = useCallback(() => setErrorToast((errorToast) => !errorToast), []);
  const toggleSuccessMsgActive = useCallback(() => setSucessToast((sucessToast) => !sucessToast), []);

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  const handlePaymentSheet = (e) => {
    setPaymentSheet({ ...paymentSheet, [e.target.name]: e.target.value })
  }

  const handlePaymentSheetCheckbox = (e) => {
    setPaymentSheet({ ...paymentSheet, [e.target.name]: e.target.checked })
  }

  const handleConnectPayment = (variant) => {
    if (variant == 'stripe') {
      setSelectedPaymentOption(1)
    }
    else if (variant == 'paypal') {
      setSelectedPaymentOption(2)
    }
    else if (variant == 'cash') {
      setSelectedPaymentOption(3)
    }
    else if (variant == 'square') {
      setSelectedPaymentOption(4)
    }
    setIsPaymentEdit(false)
    setPaymentOptionSheet(true)
  }

  function setPaymentEditData(variantId) {
    paymentOptions?.map((item) => {
      if (item.id == variantId) {
        setPaymentSheet({
          extraFeeType: item.extraFeeType,
          extraFee: item.extraFee,
          publicKey: item.publicKey,
          applicationId: item.applicationId,
          secretKey: item.secretKey,
          additionalPaymentGatewayEnabled: convertNumberToBoolean(item.additionalPaymentGatewayEnabled),
          additionalPaymentGatewayStripe: convertNumberToBoolean(item.additionalPaymentGatewayStripe),
          additionalPaymentGatewayPayPalCard: convertNumberToBoolean(item.additionalPaymentGatewayPayPalCard),
          additionalPaymentGatewayPayPalExpress: convertNumberToBoolean(item.additionalPaymentGatewayPayPalExpress),
          square_card: convertNumberToBoolean(item.square_card),
          square_gift_card: convertNumberToBoolean(item.square_gift_card),
          square_ach: convertNumberToBoolean(item.square_ach),
          square_google_pay: convertNumberToBoolean(item.square_google_pay),
          square_after_pay: convertNumberToBoolean(item.square_after_pay),
          square_apple_pay: convertNumberToBoolean(item.square_apple_pay),
        })

        let myArray = []
        item.countries?.map((item) => {
          myArray.push(item.code)
        })
        setCheckedCountries(myArray)
        setPreviousCheckedCountries(myArray)
      }
    })
  }

  const handleEditPayment = (variant) => {
    if (variant == 'stripe') {
      setSelectedPaymentOption(1)
      setPaymentEditData(paymentOptionsId.stripe)
    }
    else if (variant == 'paypal') {
      setSelectedPaymentOption(2)
      setPaymentEditData(paymentOptionsId.paypal)
    }
    else if (variant == 'cash') {
      setSelectedPaymentOption(3)
      setPaymentEditData(paymentOptionsId.cash)
    }
    else if (variant == 'square') {
      setSelectedPaymentOption(4)
      setPaymentEditData(paymentOptionsId.square)
    }
    setPaymentOptionSheet(true)
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

  const handleUpdatePayment = () => {
    if (selectedPaymentOption == 4) {
      if (!paymentSheet.square_card && !paymentSheet.square_ach && !paymentSheet.square_after_pay && !paymentSheet.square_apple_pay
        && !paymentSheet.square_gift_card && !paymentSheet.square_google_pay) {
        setToastMsg('Check atleast one square payment option')
        setErrorToast(true)
      }
      else {
        document.getElementById('updatePayment').click();
      }
    }
    else {
      document.getElementById('updatePayment').click();
    }
  }

  const getCountriesList = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/countries`)

      // console.log('getCountriesList response: ', response.data);
      setContinentsList(groupCountries(response.data))
      let myArray = []
      response.data?.map((item) => {
        myArray.push(item.code)
      })
      setAllCountries(response.data)
      setCheckedCountries(myArray)
      setPreviousCheckedCountries(myArray)

    } catch (error) {
      console.warn('getCountriesList Api Error', error.response);
    }
  }

  useEffect(() => {
    getCountriesList()
  }, [])

  const getPaymentMethods = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/payment_method`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('getPaymentMethods response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        let connectedOptions = []
        let cashId = '';
        let stripeId = '';
        let paypalId = '';
        let squareId = '';
        setPaymentOptions(response.data.data)
        response.data.data?.map((item) => {
          if (item.variant == 'cash' && item.extraFeeType != null) {
            connectedOptions.push(item)
          }
          else if (item.variant == 'stripe' && item.publicKey != null) {
            connectedOptions.push(item)
          }
          else if (item.variant == 'paypal' && item.publicKey != null) {
            connectedOptions.push(item)
          }

          else if (item.variant == 'square' && item.publicKey != null) {
            connectedOptions.push(item)
          }

          if (item.variant == 'stripe') {
            stripeId = item.id;
          }
          if (item.variant == 'paypal') {
            paypalId = item.id;
          }
          if (item.variant == 'cash') {
            cashId = item.id;
          }
          if (item.variant == 'square') {
            squareId = item.id;
          }
        })
        setConnectedPaymentOptions(connectedOptions)
        setPaymentOptionsId({
          stripe: stripeId,
          paypal: paypalId,
          cash: cashId,
          square: squareId,
        })

        setLoading(false)
      }

      setToggleLoadData(false)
    } catch (error) {
      console.warn('getPaymentMethods Api Error', error.response);
      setLoading(false)
      setToggleLoadData(false)
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message)
      }
      else {
        setToastMsg('Server Error')
      }
      setErrorToast(true)
    }
  }

  const handleEnablePayment = async (id, variant, value) => {
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
      offerStatus = 'Payment Enabled'
    }
    else {
      enableValue = 0;
      offerStatus = 'Payment Disabled'
    }

    let data = {
      variant: variant,
      isEnabled: enableValue,
    }
    try {
      const response = await axios.put(`${apiUrl}/api/payment_method/${id}/update`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('EnablePayment response: ', response.data);
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
      console.warn('EnablePayment Api Error', error.response);
      setToastMsg(error.response.data?.message?.message)
      setErrorToast(true)
      setBtnLoading(false)
    }
  }

  const updatePayment = async () => {
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
    let paymentId = '';
    let variant = '';
    let extraFeeType = '';
    let extraFee = '';
    let publicKey = '';
    let applicationId = '';
    let secretKey = '';
    let additionalPaymentGatewayEnabled = '';
    let additionalPaymentGatewayStripe = '';
    let additionalPaymentGatewayPayPalCard = '';
    let additionalPaymentGatewayPayPalExpress = '';
    let square_card = 0;
    let square_gift_card = 0;
    let square_ach = 0;
    let square_google_pay = 0;
    let square_after_pay = 0;
    let square_apple_pay = 0;


    if (selectedPaymentOption == 1) {
      paymentId = paymentOptionsId.stripe;
      variant = 'stripe';
      extraFeeType = null;
      extraFee = null;
      publicKey = paymentSheet.publicKey;
      secretKey = paymentSheet.secretKey;
      additionalPaymentGatewayEnabled = convertBooleanToNumber(paymentSheet.additionalPaymentGatewayEnabled);
      additionalPaymentGatewayStripe = convertBooleanToNumber(paymentSheet.additionalPaymentGatewayStripe);
      additionalPaymentGatewayPayPalExpress = 0;
      additionalPaymentGatewayPayPalCard = 0;
    }
    else if (selectedPaymentOption == 2) {
      paymentId = paymentOptionsId.paypal;
      variant = 'paypal';
      extraFeeType = null;
      extraFee = null;
      publicKey = paymentSheet.publicKey;
      secretKey = paymentSheet.secretKey;
      additionalPaymentGatewayEnabled = 0;
      additionalPaymentGatewayStripe = 0;
      additionalPaymentGatewayPayPalExpress = convertBooleanToNumber(paymentSheet.additionalPaymentGatewayPayPalExpress);
      additionalPaymentGatewayPayPalCard = convertBooleanToNumber(paymentSheet.additionalPaymentGatewayPayPalCard);
    }
    else if (selectedPaymentOption == 3) {
      paymentId = paymentOptionsId.cash;
      variant = 'cash';
      extraFeeType = paymentSheet.extraFeeType;
      extraFee = paymentSheet.extraFee;
      publicKey = null;
      secretKey = null;
      additionalPaymentGatewayEnabled = 0;
      additionalPaymentGatewayStripe = 0;
      additionalPaymentGatewayPayPalExpress = 0;
      additionalPaymentGatewayPayPalCard = 0;
    }
    else if (selectedPaymentOption == 4) {
      paymentId = paymentOptionsId.square;
      variant = 'square';
      extraFeeType = null;
      extraFee = null;
      publicKey = paymentSheet.publicKey;
      secretKey = paymentSheet.secretKey;
      applicationId = paymentSheet.applicationId;
      additionalPaymentGatewayEnabled = 0;
      additionalPaymentGatewayStripe = 0;
      additionalPaymentGatewayPayPalExpress = 0;
      additionalPaymentGatewayPayPalCard = 0;
      square_card = convertBooleanToNumber(paymentSheet.square_card);
      square_gift_card = convertBooleanToNumber(paymentSheet.square_gift_card);
      square_ach = convertBooleanToNumber(paymentSheet.square_ach);
      square_google_pay = convertBooleanToNumber(paymentSheet.square_google_pay);
      square_after_pay = convertBooleanToNumber(paymentSheet.square_after_pay);
      square_apple_pay = convertBooleanToNumber(paymentSheet.square_apple_pay);
    }

    let data = {
      variant: variant,
      extraFeeType: extraFeeType,
      extraFee: extraFee,
      publicKey: publicKey,
      secretKey: secretKey,
      applicationId: applicationId,
      additionalPaymentGatewayEnabled: additionalPaymentGatewayEnabled,
      additionalPaymentGatewayStripe: additionalPaymentGatewayStripe,
      additionalPaymentGatewayPayPalCard: additionalPaymentGatewayPayPalCard,
      additionalPaymentGatewayPayPalExpress: additionalPaymentGatewayPayPalExpress,
      square_card: square_card,
      square_gift_card: square_gift_card,
      square_ach: square_ach,
      square_google_pay: square_google_pay,
      square_after_pay: square_after_pay,
      square_apple_pay: square_apple_pay,
      countries: checkedCountries.toString()
    }

    if (isPaymentEdit) {
      offerStatus = 'Payment Updated Sucessfully'
    }
    else {
      offerStatus = 'Payment Connected Sucessfully'
    }

    try {
      const response = await axios.put(`${apiUrl}/api/payment_method/${paymentId}/update`, data, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      // console.log('updatePayment response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        handlePaymentOptionSheet()
        setToastMsg(offerStatus)
        setSucessToast(true)
        setToggleLoadData(true)
      }
      setBtnLoading(false)

    } catch (error) {
      console.warn('updatePayment Api Error', error.response);
      if (error.response.status == 404) {
        setToastMsg('Invalid Api Key or Secret')
      }
      else {
        setToastMsg(error.response.data?.message)
      }
      setErrorToast(true)
      setBtnLoading(false)
    }
  }

  const deletePayment = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[3]) {
        toggleId = { [3]: false };
      } else {
        toggleId = { [3]: true };
      }
      return { ...toggleId };
    });

    let paymentId = '';
    if (selectedPaymentOption == 1) {
      paymentId = paymentOptionsId.stripe;
    }
    else if (selectedPaymentOption == 2) {
      paymentId = paymentOptionsId.paypal;
    }
    else if (selectedPaymentOption == 3) {
      paymentId = paymentOptionsId.cash;
    }
    else if (selectedPaymentOption == 4) {
      paymentId = paymentOptionsId.square;
    }

    try {
      const response = await axios.delete(`${apiUrl}/api/payment_method/${paymentId}/delete`, {
        headers: { "Authorization": `Bearer ${getAccessToken()}` }
      })

      console.log('disconnectPayment response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message)
        setErrorToast(true)
      }
      else {
        handlePaymentOptionSheet()
        setToastMsg('Payment Option Disconnected')
        setSucessToast(true)
        setToggleLoadData(true)
      }
      setBtnLoading(false)

    } catch (error) {
      console.warn('disconnectPayment Api Error', error.response);
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
      getPaymentMethods()
    }
  }, [toggleLoadData])

  // useEffect(() => {
  //   console.log('paymentSheet', paymentSheet)
  // }, [paymentSheet])

  // useEffect(() => {
  //   console.log('selectedPaymentOption', selectedPaymentOption)
  // }, [selectedPaymentOption])

  return (
    <div className='Payment-Methods-Page'>
      <Modal
        open={countriesModal}
        onClose={handleCountriesCancelModal}
        title="Select Countries"
        primaryAction={{
          content: 'Save',
          onAction: handleCountriesSaveModal,
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCountriesCancelModal,
          },
        ]}
      >
        <Modal.Section>
          <div className='Countries-Modal-Section'>
            <Checkbox
              label="Select all countries"
              checked={allCountriesChecked}
              onChange={handleAllCountriesChecked}
            />

            <CheckboxTree
              nodes={continentsList}
              checked={checkedCountries}
              expanded={expandedContinent}
              onCheck={checked => setCheckedCountries(checked)}
              onExpand={expanded => setExpandedContinent(expanded)}

              icons={{
                check: <img src={FillCheckBox} alt="checkbox" />,
                halfCheck: <span className='Polaris-Icon-Half-Check'><svg viewBox="0 0 20 20" className="Polaris-Icon__Svg" focusable="false" aria-hidden="true"><path d="M14.167 9h-8.334c-.46 0-.833.448-.833 1s.372 1 .833 1h8.334c.46 0 .833-.448.833-1s-.373-1-.833-1"></path> </svg></span>,
                uncheck: <img src={EmptyCheckBox} alt="checkbox" />,
                expandClose: <Icon source={ChevronDownMinor} />,
                expandOpen: <Icon source={ChevronUpMinor} />,
              }}
            />
          </div>
        </Modal.Section>
      </Modal>

      <Sheet
        open={paymentOptionSheet}
        onClose={handlePaymentOptionSheet}
        accessibilityLabel="Payment Methods"
      >
        <Form onSubmit={updatePayment}>
          <div className='Sheet-Container Payment-Sheet'>

            <div className='Sheet-Header'>
              <div className='Flex Align-Center'>
                <Button
                  accessibilityLabel="Cancel"
                  icon={ArrowLeftMinor}
                  onClick={handlePaymentOptionSheet}
                  disabled={btnLoading[2] || btnLoading[3] || countriesModal}
                />

                {selectedPaymentOption == 1 &&
                  <>
                    <img src={stripeLogo} alt="logo" />
                    <div className='Payment-Sheet-Heading'>
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        Stripe
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Bank cards, Mobile wallets
                      </Text>
                    </div>
                  </>
                }

                {selectedPaymentOption == 2 &&
                  <>
                    <img src={paypalLogo} alt="logo" />

                    <div className='Payment-Sheet-Heading'>
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        PayPal
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Web transfers, Bank cards
                      </Text>
                    </div>
                  </>
                }

                {selectedPaymentOption == 3 &&
                  <>
                    <img src={cashLogo} alt="logo" />

                    <div className='Payment-Sheet-Heading'>
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        Cash on Delivery
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Manual payments
                      </Text>
                    </div>
                  </>
                }

                {selectedPaymentOption == 4 &&
                  <>
                    <img src={SquareLogo} alt="logo" />

                    <div className='Payment-Sheet-Heading'>
                      <Text variant="bodyMd" as="p" fontWeight="semibold">
                        Square
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Web transfers, Bank cards
                      </Text>
                    </div>
                  </>
                }

              </div>
              {/* <Button>
                <a 
                // href="https://help.checkify.pro/en/articles/5405170-understanding-cash-on-delivery-cod"
                  target="_blank" rel="noopener noreferrer" className='Flex Align-Center'>
                  Helpdesk <Icon source={ExternalMinor}></Icon>
                </a>
              </Button> */}
            </div>

            <Scrollable className='Sheet-Scrollable'>
              <FormLayout>

                <span className='VisuallyHidden'>
                  <Button submit id='updatePayment'>Submit</Button>
                </span>

                {selectedPaymentOption == 1 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      Add live API keys
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      {`You can find credentials of your Stripe in Developers > API keys.`}
                    </Text>
                  </span>
                }

                {selectedPaymentOption == 1 &&
                  <>
                    <InputField
                      type='text'
                      label='Publishable Key'
                      name='publicKey'
                      value={paymentSheet.publicKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='pk_live_xxxxxxxxxxxxxxx'
                    />
                    <InputField
                      marginTop
                      type='text'
                      label='Secret Key'
                      name='secretKey'
                      value={paymentSheet.secretKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='sk_live_xxxxxxxxxxxxxxx'
                    />
                  </>
                }

                {selectedPaymentOption == 1 &&
                  <div className='Payment-Sheet-Stack Payment-Stripe-Stack'>
                    <br />
                    {/* <span>
                      <Text variant="headingMd" as="h6">
                        Instant checkout
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Important: you must enable Apple Pay / Google Pay / Microsoft Pay in {''}
                        <a href="https://dashboard.stripe.com/settings/payments"
                          target="_blank" className='href-css'
                          rel="noopener noreferrer">Stripe Dashboard</a>
                        to use them with Checkify. And for Link Payments in {''}
                        <a href="https://dashboard.stripe.com/settings/link"
                          target="_blank" className='href-css'
                          rel="noopener noreferrer"> Link Settings.</a>
                      </Text>
                    </span>

                    <Stack>
                      <span>
                        <img src={applePay} alt="ApplePay" />
                        <img src={gPay} alt="GPay" />
                        <img src={microsoft} alt="Microsoft" />
                        <img src={link} alt="Link" />
                      </span>
                      <span className='Modal-Select'>
                        <input
                          id='additionalPaymentGatewayEnabled'
                          type="checkbox"
                          name='additionalPaymentGatewayEnabled'
                          className="tgl tgl-light"
                          checked={paymentSheet.additionalPaymentGatewayEnabled}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='additionalPaymentGatewayEnabled' className='tgl-btn'></label>
                      </span>
                    </Stack> */}

                    <span>
                      <Text variant="headingMd" as="h6">
                        Alternative payment methods
                      </Text>
                      <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                        Important: you must enable available alternative payment methods in {''}
                        <a href="https://dashboard.stripe.com/settings/payments"
                          target="_blank" className='href-css'
                          rel="noopener noreferrer">Stripe Dashboard</a>
                        {''} to use them with Checkout Republic.
                      </Text>
                    </span>

                    <Stack>
                      <span>
                        <img src={others} alt="ApplePay" />
                      </span>
                      <span className='Modal-Select'>
                        <input
                          id='additionalPaymentGatewayStripe'
                          type="checkbox"
                          name='additionalPaymentGatewayStripe'
                          className="tgl tgl-light"
                          checked={paymentSheet.additionalPaymentGatewayStripe}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='additionalPaymentGatewayStripe' className='tgl-btn'></label>
                      </span>
                    </Stack>
                  </div>
                }

                {selectedPaymentOption == 2 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      Add live API keys
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      {`You can find credentials of your PayPal in PayPal Developer > My Apps & Credentials (LIVE API CREDENTIALS).`}
                    </Text>
                  </span>
                }

                {selectedPaymentOption == 2 &&
                  <>
                    <InputField
                      type='text'
                      label='Paypal Client Id'
                      name='publicKey'
                      value={paymentSheet.publicKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='Paypal Client Id'
                    />
                    <InputField
                      marginTop
                      type='text'
                      label='Paypal Client Secret'
                      name='secretKey'
                      value={paymentSheet.secretKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='Paypal Client Secret'
                    />
                  </>
                }

                {/* {selectedPaymentOption == 2 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      PayPal express checkout buttons
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      You can learn more about how PayPal express checkout buttons works in our {''}
                      <a href="https://help.checkify.pro/en/articles/4367168-how-to-connect-paypal"
                        target="_blank" rel="noopener noreferrer" className='href-css'>guide.</a>
                    </Text>
                  </span>
                }

                {selectedPaymentOption == 2 &&
                  <div className='Payment-Sheet-Stack'>
                    <Stack>
                      <img src={paypalLargeLogo} alt="paypalLargeLogo" />
                      <span className='Modal-Select'>
                        <input
                          id='additionalPaymentGatewayPayPalCard'
                          type="checkbox"
                          name='additionalPaymentGatewayPayPalCard'
                          className="tgl tgl-light"
                          checked={paymentSheet.additionalPaymentGatewayPayPalCard}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='additionalPaymentGatewayPayPalCard' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    <Stack>
                      <img src={debitLargeLogo} alt="debitLargeLogo" />
                      <span className='Modal-Select'>
                        <input
                          id='additionalPaymentGatewayPayPalExpress'
                          type="checkbox"
                          name='additionalPaymentGatewayPayPalExpress'
                          className="tgl tgl-light"
                          checked={paymentSheet.additionalPaymentGatewayPayPalExpress}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='additionalPaymentGatewayPayPalExpress' className='tgl-btn'></label>
                      </span>
                    </Stack>
                  </div>
                } */}

                {selectedPaymentOption == 3 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      Payment fee
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      Set an extra charge for COD if you want to push your customers towards online payments.
                    </Text>
                  </span>
                }
                {selectedPaymentOption == 3 &&
                  <FormLayout.Group>
                    <CustomSelect
                      label='Extra Fee Option'
                      name='extraFeeType'
                      value={paymentSheet.extraFeeType}
                      onChange={handlePaymentSheet}
                      options={[
                        { label: 'Fixed Price', value: 'fixedPrice' },
                        { label: 'Per Percentage', value: 'percentage' },
                        { label: 'Without Extra Fee', value: 'noFee' },
                      ]}

                    />

                    {paymentSheet.extraFeeType != 'noFee' &&
                      <InputField
                        type="number"
                        label="Value"
                        name='extraFee'
                        value={paymentSheet.extraFee}
                        onChange={handlePaymentSheet}
                        autoComplete="off"
                        required
                        prefix={paymentSheet.extraFeeType == 'percentage' ? '%' : `${user?.currency_symbol}`}
                        placeholder='Value'
                      />
                    }

                  </FormLayout.Group>
                }

                {selectedPaymentOption == 4 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      Add Square App Details
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      {`You can find credentials of your Square App in Sqaure Dashboard.`}
                    </Text>
                  </span>
                }

                {selectedPaymentOption == 4 &&
                  <>
                    <InputField
                      type='text'
                      label='Square App Id'
                      name='applicationId'
                      value={paymentSheet.applicationId}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='App Id'
                    />
                    <InputField
                      marginTop
                      type='text'
                      label='Square App Access Token'
                      name='secretKey'
                      value={paymentSheet.secretKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='Access Token'
                    />
                    <InputField
                      marginTop
                      type='text'
                      label='Square App Location Id'
                      name='publicKey'
                      value={paymentSheet.publicKey}
                      onChange={handlePaymentSheet}
                      required
                      autoComplete='off'
                      placeholder='Location Id'
                    />
                  </>
                }

                {selectedPaymentOption == 4 &&
                  <span>
                    <Text variant="headingMd" as="h6">
                      Square checkout buttons
                    </Text>
                    <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                      You can learn more about how square checkout buttons works in {''}
                      <a href="https://developer.squareup.com/docs/web-payments/overview"
                        target="_blank" rel="noopener noreferrer" className='href-css'>guide.</a>
                    </Text>
                  </span>
                }

                {selectedPaymentOption == 4 &&
                  <div className='Payment-Sheet-Stack Payment-Square-Stack'>
                    <Stack>
                      <label htmlFor='square_card'>Credit or Debit Card</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_card'
                          type="checkbox"
                          name='square_card'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_card}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_card' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    <Stack>
                      <label htmlFor='square_ach'>Direct Debit (ACH)</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_ach'
                          type="checkbox"
                          name='square_ach'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_ach}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_ach' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    <Stack>
                      <label htmlFor='square_google_pay'>Google Pay</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_google_pay'
                          type="checkbox"
                          name='square_google_pay'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_google_pay}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_google_pay' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    <Stack>
                      <label htmlFor='square_gift_card'>Gift Card</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_gift_card'
                          type="checkbox"
                          name='square_gift_card'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_gift_card}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_gift_card' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    <Stack>
                      <label htmlFor='square_after_pay'>After Pay</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_after_pay'
                          type="checkbox"
                          name='square_after_pay'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_after_pay}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_after_pay' className='tgl-btn'></label>
                      </span>
                    </Stack>

                    {/* <Stack>
                      <label htmlFor='square_apple_pay'>Apple Pay</label>
                      <span className='Modal-Select'>
                        <input
                          id='square_apple_pay'
                          type="checkbox"
                          name='square_apple_pay'
                          className="tgl tgl-light"
                          checked={paymentSheet.square_apple_pay}
                          onChange={handlePaymentSheetCheckbox}
                        />
                        <label htmlFor='square_apple_pay' className='tgl-btn'></label>
                      </span>
                    </Stack> */}
                  </div>
                }

                <div className='Countries-Section'>
                  <Text variant="headingMd" as="h6">
                    Countries
                  </Text>
                  <Text variant="bodyMd" as="p" fontWeight="regular" color='subdued'>
                    Select specific countries or regions for which this shipping options will be displayed.
                  </Text>

                  <Stack>

                    {checkedCountries?.length < allCountries?.length ?
                      checkedCountries?.length == 1 ?
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedCountries)}
                          </span>
                        </Text> :
                        <Text variant="headingMd" as="h6">
                          <span>
                            {getFirstSelectedCountry('sheet', checkedCountries)}
                          </span>
                          &nbsp;
                          <small>
                            {`+ ${checkedCountries?.length - 1} others`}
                          </small>
                        </Text>
                      :
                      <Text variant="headingMd" as="h6">
                        <span>🌍</span>
                        &nbsp;
                        <span>All countries</span>
                      </Text>
                    }

                    <Button onClick={handleSelectCountriesModal}>Edit Countries</Button>
                  </Stack>
                </div>

              </FormLayout>

            </Scrollable>

            <div className='Sheet-Footer'>
              {isPaymentEdit ?
                <>
                  <Button
                    destructive
                    disabled={btnLoading[2] || countriesModal}
                    loading={btnLoading[3]}
                    onClick={deletePayment}
                  >
                    Disconnect
                  </Button>
                  <Button
                    primary
                    loading={btnLoading[2]}
                    disabled={btnLoading[3] || countriesModal}
                    onClick={handleUpdatePayment}
                  >
                    Save Changes
                  </Button>
                </>
                :
                <>
                  <Button onClick={handlePaymentOptionSheet} disabled={btnLoading[2] || countriesModal}>
                    Cancel
                  </Button>
                  <Button primary loading={btnLoading[2]} onClick={handleUpdatePayment} disabled={countriesModal}>
                    Connect
                  </Button>
                </>
              }
            </div>

          </div>
        </Form>

      </Sheet>

      {/* {loading ?
        <span>
          <Loading />
          <SkeltonPaymentPage />
        </span> : */}
      {loading && <Loading />}

      <Page
        title='Payment Methods'
        fullWidth

      >
         <NotifyBanner/>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {loading ? <SkeltonPaymentPage /> :
            <>
              {(() => {
                switch (selectedTab) {
                  case 0:
                    return (
                      <div className='All-Methods-Tab'>

                        <Layout>
                          {stripe &&
                            <Layout.Section oneThird>
                              <Card
                                subdued={btnLoading[stripe.id]}
                                sectioned
                                actions={
                                  stripe.publicKey == null || paymentOptionSheet ?
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                    }] :
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                      onAction: () => handleEditPayment(stripe.variant)
                                    }]
                                }
                              >
                                <Stack>
                                  <span>
                                    <img src={stripe.imageUrl} alt={stripe.title} />
                                  </span>
                                  <Stack vertical>
                                    <Text variant="headingMd" as="h6">
                                      {stripe.title}
                                    </Text>
                                    <Text variant="bodySm" as="p">
                                      {stripe.sub_title}
                                    </Text>
                                  </Stack>
                                </Stack>

                                <div className='Card-Description'>
                                  <Text variant="bodyMd" as="p">
                                    {stripe.description}
                                  </Text>
                                </div>

                                <div className='Card-Active'>
                                  {
                                    stripe.publicKey == null ?
                                      <Button size='slim' onClick={() => handleConnectPayment(stripe.variant)}>
                                        Connect
                                      </Button> :
                                      <>
                                        <span>
                                          <input id={stripe.id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(stripe.isEnabled)}
                                            onChange={() => handleEnablePayment(stripe.id, stripe.variant, stripe.isEnabled)}
                                          />
                                          <label htmlFor={stripe.id} className='tgl-btn'></label>
                                        </span>
                                        <Text variant="bodyMd" as="p" fontWeight='medium'>
                                          Active
                                        </Text>
                                      </>
                                  }
                                </div>

                              </Card>
                            </Layout.Section>
                          }
                          {paypal &&
                            <Layout.Section oneThird>
                              <Card
                                subdued={btnLoading[paypal.id]}
                                sectioned
                                actions={
                                  paypal.publicKey == null || paymentOptionSheet ?
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                    }] :
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                      onAction: () => handleEditPayment(paypal.variant)
                                    }]
                                }
                              >
                                <Stack>
                                  <span>
                                    <img src={paypal.imageUrl} alt={paypal.title} />
                                  </span>
                                  <Stack vertical>
                                    <Text variant="headingMd" as="h6">
                                      {paypal.title}
                                    </Text>
                                    <Text variant="bodySm" as="p">
                                      {paypal.sub_title}
                                    </Text>
                                  </Stack>
                                </Stack>

                                <div className='Card-Description'>
                                  <Text variant="bodyMd" as="p">
                                    {paypal.description}
                                  </Text>
                                </div>

                                <div className='Card-Active'>
                                  {
                                    paypal.publicKey == null ?
                                      <Button size='slim' onClick={() => handleConnectPayment(paypal.variant)}>
                                        Connect
                                      </Button> :
                                      <>
                                        <span>
                                          <input id={paypal.id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(paypal.isEnabled)}
                                            onChange={() => handleEnablePayment(paypal.id, paypal.variant, paypal.isEnabled)}
                                          />
                                          <label htmlFor={paypal.id} className='tgl-btn'></label>
                                        </span>
                                        <Text variant="bodyMd" as="p" fontWeight='medium'>
                                          Active
                                        </Text>
                                      </>
                                  }
                                </div>

                              </Card>
                            </Layout.Section>
                          }
                          {square &&
                            <Layout.Section oneThird>
                              <Card
                                subdued={btnLoading[square.id]}
                                sectioned
                                actions={
                                  square.publicKey == null || paymentOptionSheet ?
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                    }] :
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                      onAction: () => handleEditPayment(square.variant)
                                    }]
                                }
                              >
                                <Stack>
                                  <span>
                                    <img src={SquareLogo} alt={square.title} />
                                  </span>
                                  <Stack vertical>
                                    <Text variant="headingMd" as="h6">
                                      {square.title}
                                    </Text>
                                    <Text variant="bodySm" as="p">
                                      {square.sub_title}
                                    </Text>
                                  </Stack>
                                </Stack>

                                <div className='Card-Description'>
                                  <Text variant="bodyMd" as="p">
                                    {square.description}
                                  </Text>
                                </div>

                                <div className='Card-Active'>
                                  {
                                    square.publicKey == null ?
                                      <Button size='slim' onClick={() => handleConnectPayment(square.variant)}>
                                        Connect
                                      </Button> :
                                      <>
                                        <span>
                                          <input id={square.id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(square.isEnabled)}
                                            onChange={() => handleEnablePayment(square.id, square.variant, square.isEnabled)}
                                          />
                                          <label htmlFor={square.id} className='tgl-btn'></label>
                                        </span>
                                        <Text variant="bodyMd" as="p" fontWeight='medium'>
                                          Active
                                        </Text>
                                      </>
                                  }
                                </div>

                              </Card>
                            </Layout.Section>
                          }
                          {cash &&
                            <Layout.Section oneThird>
                              <Card
                                subdued={btnLoading[cash.id]}
                                sectioned
                                actions={
                                  cash.extraFeeType == null || paymentOptionSheet ?
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                    }] :
                                    [{
                                      content: <Icon source={EditMinor} color="subdued"></Icon>,
                                      onAction: () => handleEditPayment(cash.variant)
                                    }]
                                }
                              >
                                <Stack>
                                  <span>
                                    <img src={cash.imageUrl} alt={cash.title} />
                                  </span>
                                  <Stack vertical>
                                    <Text variant="headingMd" as="h6">
                                      {cash.title}
                                    </Text>
                                    <Text variant="bodySm" as="p">
                                      {cash.sub_title}
                                    </Text>
                                  </Stack>
                                </Stack>

                                <div className='Card-Description'>
                                  <Text variant="bodyMd" as="p">
                                    {cash.description}
                                  </Text>
                                </div>

                                <div className='Card-Active'>
                                  {cash.extraFeeType == null ?
                                    <Button size='slim' onClick={() => handleConnectPayment(cash.variant)}>
                                      Connect
                                    </Button> :
                                    <>
                                      <span>
                                        <input id={cash.id}
                                          type="checkbox"
                                          className="tgl tgl-light"
                                          checked={convertNumberToBoolean(cash.isEnabled)}
                                          onChange={() => handleEnablePayment(cash.id, cash.variant, cash.isEnabled)}
                                        />
                                        <label htmlFor={cash.id} className='tgl-btn'></label>
                                      </span>
                                      <Text variant="bodyMd" as="p" fontWeight='medium'>
                                        Active
                                      </Text>
                                    </>
                                  }
                                </div>

                              </Card>
                            </Layout.Section>
                          }
                        </Layout>
                      </div>
                    )

                  case 1:
                    return (
                      <div className='Connected-Methods-Tab'>
                        <Layout>
                          {connectedPaymentOptions?.map((item) => {
                            return (
                              <Layout.Section oneThird key={item.id}>
                                <Card
                                  subdued={btnLoading[item.id]}
                                  sectioned
                                  // actions={[
                                  //   {
                                  //     content: <Icon source={HorizontalDotsMinor} color="subdued"></Icon>,
                                  //     onAction: () => handleEditPayment(item.variant)
                                  //   }
                                  // ]}
                                  actions={
                                    paymentOptionSheet ?
                                      [{
                                        content: <Icon source={EditMinor} color="subdued"></Icon>,
                                      }] :
                                      [{
                                        content: <Icon source={EditMinor} color="subdued"></Icon>,
                                        onAction: () => handleEditPayment(item.variant)
                                      }]
                                  }
                                >
                                  <Stack>
                                    <span>
                                      <img src={item.imageUrl} alt={item.title} />
                                    </span>
                                    <Stack vertical>
                                      <Text variant="headingMd" as="h6">
                                        {item.title}
                                      </Text>
                                      <Text variant="bodySm" as="p">
                                        {item.sub_title}
                                      </Text>
                                    </Stack>
                                  </Stack>

                                  <div className='Card-Description'>
                                    <Text variant="bodyMd" as="p">
                                      {item.description}
                                    </Text>
                                  </div>

                                  <div className='Card-Active'>
                                    <span>
                                      <input id={item.id}
                                        type="checkbox"
                                        className="tgl tgl-light"
                                        checked={convertNumberToBoolean(item.isEnabled)}
                                        onChange={() => handleEnablePayment(item.id, item.variant, item.isEnabled)}
                                      />
                                      <label htmlFor={item.id} className='tgl-btn'></label>
                                    </span>
                                    <Text variant="bodyMd" as="p" fontWeight='medium'>
                                      Active
                                    </Text>
                                  </div>

                                </Card>
                              </Layout.Section>
                            )
                          })}
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
