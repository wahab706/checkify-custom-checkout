import {
  Page,
  Layout,
  Card,
  Stack,
  Button,
  Checkbox,
  RadioButton,
  TextField,
  Text,
  Tabs,
  Scrollable,
  Tag,
  Toast,
  Spinner,
  Avatar,
  TextContainer,
  Modal,
} from "@shopify/polaris";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import chekifyLogo from "../../assets/checkout/chekifyLogo.svg";
import paypalFullLogo from "../../assets/checkout/paypalFullLogo.svg";
import paypalRedirect from "../../assets/checkout/paypalRedirect.svg";
import lock from "../../assets/checkout/lock.svg";
import cardPay from "../../assets/checkout/cardPay.svg";
import achLogo from "../../assets/checkout/achLogo.svg";
import gpayLogo from "../../assets/checkout/gpayLogo.svg";
import giftCard from "../../assets/checkout/giftCard.svg";
import applePay from "../../assets/checkout/applePay.svg";
import cashPay from "../../assets/checkout/cashPay.svg";
import afterPay from "../../assets/checkout/afterPay.png";
import cashLogo from "../../assets/icons/cashLogo.svg";
import {
  ShippingForm,
  BillingForm,
  Loader,
  PaymentLoader,
} from "../../components";
import axios from "axios";
import {
  Ach,
  Afterpay,
  ApplePay,
  CashAppPay,
  CreditCard,
  GiftCard,
  GooglePay,
  PaymentForm,
} from "react-square-web-payments-sdk";

import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/checkoutForms/CheckoutForm";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";

export function Checkout() {
  const navigate = useNavigate();
  const API_URL = "https://ecommercehack.com";
  let defaultFavicon = "https://ecommercehack.com/fav-checkout.png";
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cartUuid, setCartUuid] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [shopDetails, setShopDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [policiesDetails, setPoliciesDetails] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState([]);
  const [customization, setCustomization] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [shippingRates, setShippingRates] = useState([]);
  const [shopifyShippingRates, setShopifyShippingRates] = useState([]);
  const [aboutUs, setaboutUs] = useState([]);
  const [additionalOffers, setAdditionalOffers] = useState([]);
  const [selectedAddtionalOffers, setSelectedAddtionalOffers] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [cartSummary, setCartSummary] = useState();
  const [getCurrentCountryToggle, setGetCurrentCountryToggle] = useState(false);

  const [currencyConversion, setCurrencyConversion] = useState({
    rate: 1,
    currency: "",
  });

  const [cartPrice, setCartPrice] = useState({
    subTotal: 0,
    vat: "",
    vatType: "",
    discount: 0,
    discountType: "",
  });

  let cash = null;
  let stripe = null;
  let paypal = null;
  let square = null;
  cash = paymentMethods.find((obj) => obj.variant === "cash");
  stripe = paymentMethods.find((obj) => obj.variant === "stripe");
  paypal = paymentMethods.find((obj) => obj.variant === "paypal");
  square = paymentMethods.find((obj) => obj.variant === "square");

  const stripePromise = loadStripe(stripe?.publicKey);
  const [clientSecret, setClientSecret] = useState();
  const [secretId, setSecretId] = useState("null");
  const [stripeIntentLoading, setStripeIntentLoading] = useState(true);
  const [secretLoading, setSecretLoading] = useState(true);
  const [clientSecretError, setClientSecretError] = useState(false);
  const [clientSecretErrorMsg, setClientSecretErrorMsg] = useState();

  const [squarePaymentMethods, setSquarePaymentMethods] = useState({
    square_card: true,
    square_gift_card: false,
    square_ach: false,
    square_google_pay: false,
    square_after_pay: false,
    square_apple_pay: false,
    square_ach_holder_name: "",
    square_ach_redirect_url: "",
    square_ach_transaction_id: "",
  });

  const [paymentOptionCountry, setPaymentOptionCountry] = useState({
    cash: true,
    paypal: true,
    stripe: true,
    square: true,
  });

  const [signUpExclusive, setSignUpExclusive] = useState(false);
  const [isBillingAddressSame, setIsBillingAddressSame] = useState(true);
  const [shippingOptionsValue, setShippingOptionsValue] = useState("rate0");
  const [discountCode, setDiscountCode] = useState("");
  const [discountCodeInvalid, setDiscountCodeInvalid] = useState(false);
  const [discountBtnDisabled, setDiscountBtnDisabled] = useState(false);
  const [paymentOptionsValue, setPaymentOptionsValue] = useState("cash");
  const [paymentSelectedTab, setPaymentSelectedTab] = useState(0);
  const [squarePaymentSelectedTab, setSquarePaymentSelectedTab] = useState(0);
  const [headerPanelStatus, setHeaderPanelStatus] = useState(false);
  const [cartTimer, setCartTimer] = useState(true);
  const [toggleFormDataSubmit, setToggleFormDataSubmit] = useState(false);
  const [toggleGetTax, setToggleGetTax] = useState(false);
  const [toggleCalculation, setToggleCalculation] = useState(true);

  const [policiesModal, setPoliciesModal] = useState(false);
  const [policyModalValue, setPolicyModalValue] = useState("");

  const handlePoliciesModal = (value) => {
    setPolicyModalValue(value);
    setPoliciesModal(true);
  };

  const handlePoliciesModalClose = () => {
    setPoliciesModal(false);
    setPolicyModalValue("");
  };

  function checkPolicyModalValue(type) {
    let value = "";
    let body = "";
    if (policyModalValue == "refund") {
      value = "Refund policy";
      body = policiesDetails?.refund_policy;
    } else if (policyModalValue == "privacy") {
      value = "Privacy policy";
      body = policiesDetails?.privacy_policy;
    } else if (policyModalValue == "shipping") {
      value = "Shipping policy";
      body = policiesDetails?.shipping_policy;
    } else if (policyModalValue == "terms") {
      value = "Terms of service";
      body = policiesDetails?.terms_of_service;
    } else if (policyModalValue == "contact") {
      value = "Contact information";
      body = policiesDetails?.contact_information;
    }

    if (type == "label") {
      return value;
    } else if (type == "body") {
      return body;
    }
  }

  const [errorToast, setErrorToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const handleSignUpExclusive = useCallback(
    (newChecked) => setSignUpExclusive(newChecked),
    []
  );
  const handlePaymentTabChange = useCallback(
    (selectedTabIndex) => setPaymentSelectedTab(selectedTabIndex),
    []
  );
  const handleSqaurePaymentTabChange = useCallback(
    (squarePaymentSelectedTab) =>
      setSquarePaymentSelectedTab(squarePaymentSelectedTab),
    []
  );
  const handleShippingOptionsValue = useCallback((_checked, newValue) => {
    setShippingOptionsValue(newValue), setToggleFormDataSubmit(true);
  });

  const handleAddtionalOffers = (id, value) => {
    setSelectedAddtionalOffers({ ...selectedAddtionalOffers, [id]: value });
    setToggleFormDataSubmit(true);
  };

  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    phone: "",
    experience: "It's great :)",
    countryName: "",
    stateName: "",
  });

  const [shippingFormErrors, setShippingFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    address: false,
    city: false,
    country: false,
    state: false,
    zipCode: false,
    phone: false,
    experience: false,
  });

  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  const [billingFormErrors, setBillingFormErrors] = useState({
    firstName: false,
    lastName: false,
    address: false,
    city: false,
    country: false,
    state: false,
    phone: false,
    zipCode: false,
  });

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiration: "",
    cvc: "",
  });

  function convertBooleanToNumber(value) {
    let booleanValue;
    if (value === true) {
      booleanValue = 1;
    } else {
      booleanValue = 0;
    }

    return booleanValue;
  }

  function convertNumberToBoolean(value) {
    let booleanValue;
    if (value === 1) {
      booleanValue = true;
    } else {
      booleanValue = false;
    }
    return booleanValue;
  }

  useEffect(() => {
    if (toggleCalculation?.length) {
      setToggleFormDataSubmit(true);
      if (toggleCalculation == "country" || toggleCalculation == "state") {
        setToggleGetTax(true);
      }
    }
  }, [toggleCalculation]);

  function getCountryNameCode(type, value) {
    if (type == "code") {
      let country = countriesList.find((obj) => obj.id == value);
      return country?.code;
    } else if (type == "name") {
      let country = countriesList.find((obj) => obj.id == value);
      return country?.name;
    }
  }

  function ShippingRatesChecks(rates, cart) {
    let shipping_rates = [];
    rates?.map((item) => {
      let itemsMin = Number(item.itemsMin ? item.itemsMin : 0);
      let itemsMax = Number(item.itemsMax ? item.itemsMax : Infinity);
      let subtotalMin = Number(item.subtotalMin ? item.subtotalMin : 0);
      let subtotalMax = Number(item.subtotalMax ? item.subtotalMax : Infinity);
      let weightMin = Number(item.weightMin ? item.weightMin : 0);
      let weightMax = Number(item.weightMax ? item.weightMax : Infinity);

      if (
        cart?.quantity <= itemsMax &&
        cart?.quantity >= itemsMin &&
        cart?.price <= subtotalMax &&
        cart?.price >= subtotalMin &&
        cart?.weight <= weightMax &&
        cart?.weight >= weightMin
      ) {
        shipping_rates.push(item);
      }
    });
    return shipping_rates;
  }

  function ShopifyShippingRatesCheck(
    shopifyShippingRates,
    cartSummary,
    countryCode,
    stateName
  ) {
    let rates = [];
    let found = false;
    shopifyShippingRates?.map((item) => {
      let country = item.countries?.find((obj) => obj.code == countryCode);
      if (country) {
        if (country?.provinces?.length) {
          item.countries?.map((item2) => {
            let state = item2.provinces?.find((obj) => obj.name == stateName);
            if (state) {
              found = true;
              if (item?.weight_based_shipping_rates?.length) {
                item?.weight_based_shipping_rates?.map((item2) => {
                  let valid = true;
                  if (item2.weight_low != null) {
                    if (cartSummary?.weight < item2.weight_low) {
                      valid = false;
                    }
                  }
                  if (item2.weight_high != null) {
                    if (cartSummary?.weight > item2.weight_high) {
                      valid = false;
                    }
                  }
                  if (valid) {
                    rates.push({
                      id: item2.id,
                      name: item2.name,
                      price: Number(item2.price),
                      description: null,
                    });
                  }
                });
              }
              if (item?.price_based_shipping_rates?.length) {
                item?.price_based_shipping_rates?.map((item2) => {
                  let valid = true;
                  if (item2.min_order_subtotal != null) {
                    if (cartSummary?.price < item2.min_order_subtotal) {
                      valid = false;
                    }
                  }
                  if (item2.max_order_subtotal != null) {
                    if (cartSummary?.price > item2.max_order_subtotal) {
                      valid = false;
                    }
                  }
                  if (valid) {
                    rates.push({
                      id: item2.id,
                      name: item2.name,
                      price: Number(item2.price),
                      description: null,
                    });
                  }
                });
              }
            }
          });
        } else {
          found = true;
          if (item?.weight_based_shipping_rates?.length) {
            item?.weight_based_shipping_rates?.map((item2) => {
              let valid = true;
              if (item2.weight_low != null) {
                if (cartSummary?.weight < item2.weight_low) {
                  valid = false;
                }
              }
              if (item2.weight_high != null) {
                if (cartSummary?.weight > item2.weight_high) {
                  valid = false;
                }
              }
              if (valid) {
                rates.push({
                  id: item2.id,
                  name: item2.name,
                  price: Number(item2.price),
                  description: null,
                });
              }
            });
          }
          if (item?.price_based_shipping_rates?.length) {
            item?.price_based_shipping_rates?.map((item2) => {
              let valid = true;
              if (item2.min_order_subtotal != null) {
                if (cartSummary?.price < item2.min_order_subtotal) {
                  valid = false;
                }
              }
              if (item2.max_order_subtotal != null) {
                if (cartSummary?.price > item2.max_order_subtotal) {
                  valid = false;
                }
              }
              if (valid) {
                rates.push({
                  id: item2.id,
                  name: item2.name,
                  price: Number(item2.price),
                  description: null,
                });
              }
            });
          }
        }
      }
    });
    if (!found) {
      shopifyShippingRates?.map((item) => {
        let country = item.countries?.find((obj) => obj.code == "*");
        if (country) {
          if (item?.weight_based_shipping_rates?.length) {
            item?.weight_based_shipping_rates?.map((item2) => {
              let valid = true;
              if (item2.weight_low != null) {
                if (cartSummary?.weight < item2.weight_low) {
                  valid = false;
                }
              }
              if (item2.weight_high != null) {
                if (cartSummary?.weight > item2.weight_high) {
                  valid = false;
                }
              }
              if (valid) {
                rates.push({
                  id: item2.id,
                  name: item2.name,
                  price: Number(item2.price),
                  description: null,
                });
              }
            });
          }
          if (item?.price_based_shipping_rates?.length) {
            item?.price_based_shipping_rates?.map((item2) => {
              let valid = true;
              if (item2.min_order_subtotal != null) {
                if (cartSummary?.price < item2.min_order_subtotal) {
                  valid = false;
                }
              }
              if (item2.max_order_subtotal != null) {
                if (cartSummary?.price > item2.max_order_subtotal) {
                  valid = false;
                }
              }
              if (valid) {
                rates.push({
                  id: item2.id,
                  name: item2.name,
                  price: Number(item2.price),
                  description: null,
                });
              }
            });
          }
        }
      });
    }

    return rates;
    // setShippingRates(rates)
  }

  useEffect(() => {
    if (!loading && countriesList?.length) {
      let cash = false;
      let paypal = false;
      let stripe = false;
      let square = false;
      let cash_Countries = paymentMethods.find(
        (obj) => obj.variant === "cash"
      )?.countries;
      let paypal_Countries = paymentMethods.find(
        (obj) => obj.variant === "paypal"
      )?.countries;
      let stripe_Countries = paymentMethods.find(
        (obj) => obj.variant === "stripe"
      )?.countries;
      let square_Countries = paymentMethods.find(
        (obj) => obj.variant === "square"
      )?.countries;

      if (cash_Countries) {
        if (cash_Countries.find((obj) => obj.id == shippingDetails.country)) {
          cash = true;
        }
      }
      if (paypal_Countries) {
        if (paypal_Countries.find((obj) => obj.id == shippingDetails.country)) {
          paypal = true;
        }
      }
      if (stripe_Countries) {
        if (stripe_Countries.find((obj) => obj.id == shippingDetails.country)) {
          stripe = true;
        }
      }
      if (square_Countries) {
        if (square_Countries.find((obj) => obj.id == shippingDetails.country)) {
          square = true;
        }
      }

      setPaymentOptionCountry({
        cash: cash,
        paypal: paypal,
        stripe: stripe,
        square: square,
      });
    }
  }, [shippingDetails.country, loading, countriesList]);

  const handleShippingDetails = async (e) => {
    if (
      convertNumberToBoolean(customization?.zipValidate) &&
      e.target.name == "zipCode"
    ) {
      setShippingDetails({
        ...shippingDetails,
        [e.target.name]: e.target.value,
      });
      let resp = await ValidateZipCode("shipping", e.target.value);
      if (resp) {
        setShippingFormErrors({
          ...shippingFormErrors,
          [e.target.name]: false,
        });
      } else {
        setShippingFormErrors({ ...shippingFormErrors, [e.target.name]: true });
      }
    } else {
      if (e.target.name == "country") {
        setShippingDetails({
          ...shippingDetails,
          [e.target.name]: e.target.value,
          state: "",
          zipCode: "",
        });
        setShippingFormErrors({
          ...shippingFormErrors,
          [e.target.name]: false,
          state: false,
          zipCode: false,
        });
        getCurrencyConversion(
          getCountryNameCode("code", e.target.value),
          userDetails?.currency
        );
      } else {
        setShippingDetails({
          ...shippingDetails,
          [e.target.name]: e.target.value,
        });
        setShippingFormErrors({
          ...shippingFormErrors,
          [e.target.name]: false,
        });
      }

      if (e.target.name == "country" || e.target.name == "state") {
        setToggleCalculation(true);
        setToggleGetTax(true);
      }

      if (e.target.name == "country" || e.target.name == "state") {
        setShippingOptionsValue("rate0");
        let countryCode = "";
        let stateName = "";
        if (e.target.name == "country") {
          countryCode = getCountryNameCode("code", e.target.value);
        } else {
          countryCode = getCountryNameCode("code", shippingDetails.country);
        }
        if (e.target.name == "state") {
          countriesList?.map((item) => {
            let state = item.states?.find((obj) => obj.id == e.target.value);
            if (state) {
              stateName = state.name;
            }
          });
        }

        if (convertNumberToBoolean(customization?.isNativeShippingRateEnable)) {
          setShippingRates(
            ShopifyShippingRatesCheck(
              shopifyShippingRates,
              cartSummary,
              countryCode,
              stateName
            )
          );
        }
      }
    }
  };

  const handleBillingDetails = async (e) => {
    if (
      convertNumberToBoolean(customization?.zipValidate) &&
      e.target.name == "zipCode"
    ) {
      setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
      if (await ValidateZipCode("billing", e.target.value)) {
        setBillingFormErrors({ ...billingFormErrors, [e.target.name]: false });
      } else {
        setBillingFormErrors({ ...billingFormErrors, [e.target.name]: true });
      }
    } else {
      setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
      setBillingFormErrors({ ...billingFormErrors, [e.target.name]: false });
      setToggleFormDataSubmit(true);
    }
  };

  const handleCardDetails = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePaymentOptionsValue = useCallback((_checked, newValue) => {
    setPaymentOptionsValue(newValue),
      setPaymentSelectedTab(0),
      setToggleFormDataSubmit(true);
  });

  const handleIsBillingAddressSame = (newChecked) => {
    setIsBillingAddressSame(newChecked);
    setToggleFormDataSubmit(true);
  };

  const handleDiscountCode = (newValue) => {
    setDiscountCode(newValue);
    setDiscountCodeInvalid(false);
    setDiscountBtnDisabled(false);
  };

  const removeDiscountTag = () => {
    setDiscountCode("");
    setDiscountBtnDisabled(false);
    setCartPrice({
      ...cartPrice,
      discount: 0,
    });
    setToggleFormDataSubmit(true);
  };

  function getPriceCalculate(type) {
    let subTotal = cartPrice.subTotal;
    let vat = 0;
    let vatType = cartPrice.vatType;
    let discount = cartPrice.discount && Number(cartPrice.discount);
    let tax = 0;
    let shipping =
      shippingRates?.length > 0
        ? shippingRates[shippingOptionsValue.replace("rate", "")]?.price
        : 0;
    let total = 0;
    let extraOfferTotal = 0;
    let taxableExtraOffer = 0;
    if (cartPrice.vat) {
      vat = Number(cartPrice.vat);
    }

    additionalOffers?.map((item) => {
      if (selectedAddtionalOffers[item?.id]) {
        extraOfferTotal = extraOfferTotal + Number(item.price);
        if (convertNumberToBoolean(item.isRequiresShipping)) {
          taxableExtraOffer = taxableExtraOffer + Number(item.price);
        }
      }
    });

    if (convertNumberToBoolean(customization?.taxCharge)) {
      if (vatType) {
        if (vatType == "percentage") {
          tax = ((subTotal + taxableExtraOffer - discount) * vat) / 100;
        } else {
          tax = vat;
        }
      }
    }

    total = subTotal - discount + tax + Number(shipping) + extraOfferTotal;

    if (type == "subTotal") {
      return userDetails?.currency_symbol + " " + subTotal.toFixed(2);
    } else if (type == "vat") {
      if (vatType == "percentage") {
        return vat.toFixed(2) + "%";
      } else {
        return userDetails?.currency_symbol + " " + vat.toFixed(2);
      }
    } else if (type == "discount") {
      return "-" + userDetails?.currency_symbol + " " + discount.toFixed(2);
    } else if (type == "tax") {
      return userDetails?.currency_symbol + " " + tax.toFixed(2);
    } else if (type == "total") {
      return total.toFixed(2);
    } else if (type == "subTotal2") {
      return subTotal.toFixed(2);
    } else if (type == "discount2") {
      return discount.toFixed(2);
    } else if (type == "tax2") {
      return tax.toFixed(2);
    }
  }

  function ValidateEmail(input) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {
      return false;
    } else {
      return true;
    }
  }

  const ValidateZipCode = async (value, zip) => {
    let countryCode = "";
    if (value == "shipping") {
      let country = countriesList.find(
        (obj) => obj.id == shippingDetails?.country
      );
      countryCode = country?.code;
    } else if (value == "billing") {
      let country = countriesList.find(
        (obj) => obj.id == billingDetails?.country
      );
      countryCode = country?.code;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/zip/${countryCode}/${zip}`
      );
      // console.log('validateZip response: ', response.data);
      return true;
    } catch (error) {
      console.warn("validateZip Api Error", error.response);
      return false;
    }
  };

  const getCurrencyConversion = async (code, currency) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/currency/conversion?from=${currency}&to=${code}`
      );
      // console.log('Currency Conversion response: ', response.data);
      if (!response?.data?.errors) {
        setCurrencyConversion({
          currency: response.data?.country?.currency_code,
          rate: Number(response?.data?.data?.rate),
        });
      }
    } catch (error) {
      console.warn("Currency Conversion Api Error", error);
    }
  };

  function handleFormErrors() {
    let isFormValid = true;
    if (convertNumberToBoolean(customization?.isPhone)) {
      if (!shippingDetails.phone) {
        setShippingFormErrors({ ...shippingFormErrors, phone: true });
        window.scrollTo(0, 250);
        return false;
      }
    } else {
      if (ValidateEmail(shippingDetails.email)) {
        setShippingFormErrors({ ...shippingFormErrors, email: true });
        window.scrollTo(0, 250);
        return false;
      }
    }
    if (!shippingDetails.firstName) {
      setShippingFormErrors({ ...shippingFormErrors, firstName: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (!shippingDetails.lastName) {
      setShippingFormErrors({ ...shippingFormErrors, lastName: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (!shippingDetails.address) {
      setShippingFormErrors({ ...shippingFormErrors, address: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (!shippingDetails.country) {
      setShippingFormErrors({ ...shippingFormErrors, country: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (!shippingDetails.state) {
      setShippingFormErrors({ ...shippingFormErrors, state: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (shippingDetails.zipCode?.length == 0) {
      setShippingFormErrors({ ...shippingFormErrors, zipCode: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (shippingFormErrors?.zipCode) {
      window.scrollTo(0, 250);
      return false;
    }
    if (!shippingDetails.city) {
      setShippingFormErrors({ ...shippingFormErrors, city: true });
      window.scrollTo(0, 250);
      return false;
    }
    if (convertNumberToBoolean(customization?.isPhoneFieldRequired)) {
      if (!shippingDetails.phone) {
        setShippingFormErrors({ ...shippingFormErrors, phone: true });
        window.scrollTo(0, 250);
        return false;
      }
    }
    if (!isBillingAddressSame) {
      if (!billingDetails.firstName) {
        setBillingFormErrors({ ...billingFormErrors, firstName: true });
        window.scrollTo(0, 1200);
        return false;
      }
      if (!billingDetails.lastName) {
        setBillingFormErrors({ ...billingFormErrors, lastName: true });
        window.scrollTo(0, 1200);
        return false;
      }
      if (!billingDetails.address) {
        setBillingFormErrors({ ...billingFormErrors, address: true });
        window.scrollTo(0, 1200);
        return false;
      }
      if (!billingDetails.country) {
        setBillingFormErrors({ ...billingFormErrors, country: true });
        window.scrollTo(0, 1250);
        return false;
      }
      if (!billingDetails.state) {
        setBillingFormErrors({ ...billingFormErrors, state: true });
        window.scrollTo(0, 1250);
        return false;
      }
      if (!billingDetails.city) {
        setBillingFormErrors({ ...billingFormErrors, city: true });
        window.scrollTo(0, 1300);
        return false;
      }
      if (billingDetails.zipCode?.length == 0) {
        setBillingFormErrors({ ...billingFormErrors, zipCode: true });
        window.scrollTo(0, 1320);
        return false;
      }
      if (billingFormErrors?.zipCode) {
        window.scrollTo(0, 1320);
        return false;
      }
      if (!billingDetails.phone) {
        setBillingFormErrors({ ...billingFormErrors, phone: true });
        window.scrollTo(0, 1350);
        return false;
      }
    }

    return true;
  }

  const handlePaymentSubmit = () => {
    if (handleFormErrors()) {
      if (paymentOptionsValue == "paypal" || paymentOptionsValue == "cash") {
        document.getElementById("completePurchaseBtn").click();
      } else if (paymentOptionsValue == "stripe") {
        document.getElementById("stripePayBtn").click();
      }
    }
  };

  let squarePaymentTabs = [
    {
      id: "0",
      content: (
        <span>
          <img src={cardPay} alt="Card" className="Tab-Icon" />
          <Text variant="headingSm" as="h6">
            Card
          </Text>
        </span>
      ),
    },
    {
      id: "1",
      content: (
        <span>
          <img src={giftCard} alt="Gift" className="Tab-Icon" />
          <Text variant="headingSm" as="h6">
            Gift Card
          </Text>
        </span>
      ),
    },
    {
      id: "2",
      content: (
        <span>
          <img src={gpayLogo} alt="GPay" className="Tab-Icon" />
          <Text variant="headingSm" as="h6">
            Google Pay
          </Text>
        </span>
      ),
    },
    {
      id: "3",
      content: (
        <span>
          <img src={achLogo} alt="ACH" className="Tab-Icon" />
          <Text variant="headingSm" as="h6">
            Direct debit (ACH)
          </Text>
        </span>
      ),
    },
    // {
    //     id: '4',
    //     content: (
    //         <span>
    //             <img src={afterPay} alt="After Pay" className='Tab-Icon' />
    //             <Text variant="headingSm" as="h6">
    //                 After Pay
    //             </Text>
    //         </span>
    //     ),
    // },
    // {
    //     id: '5',
    //     content: (
    //         <span>
    //             <img src={applePay} alt="Apple pay" className='Tab-Icon' />
    //             <Text variant="headingSm" as="h6">
    //                 Applepay
    //             </Text>
    //         </span>
    //     ),
    // },
    // {
    //     id: '6',
    //     content: (
    //         <span>
    //             <img src={cashPay} alt="Cash Pay" className='Tab-Icon' />
    //             <Text variant="headingSm" as="h6">
    //                 Cash Pay
    //             </Text>
    //         </span>
    //     ),
    // },
  ];

  const paymentDetailTabs = [
    {
      id: "1",
      content: (
        <span>
          <svg
            className="Tab-Icon"
            role="presentation"
            fill="var(--colorIcon)"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 4a2 2 0 012-2h12a2 2 0 012 2H0zm0 2v6a2 2 0 002 2h12a2 2 0 002-2V6H0zm3 5a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1z"
            ></path>
          </svg>
          <Text variant="headingSm" as="h6">
            Card
          </Text>
        </span>
      ),
    },
    // {
    //     id: '2',
    //     content: (
    //         <span>
    //             <svg viewBox="0 0 16 16" className='Tab-Icon' fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
    //                 <path d="M0 2.564A2.562 2.562 0 0 1 2.563 0h10.875A2.562 2.562 0 0 1 16 2.564v10.872A2.563 2.563 0 0 1 13.437 16H2.563A2.563 2.563 0 0 1 0 13.437V2.564Z" fill="#fff"></path><path d="M2.563 0A2.562 2.562 0 0 0 0 2.564v10.873A2.563 2.563 0 0 0 2.563 16h10.874A2.563 2.563 0 0 0 16 13.437v-.111c-.048-.02-4.158-1.735-6.248-2.74-1.41 1.735-3.227 2.787-5.115 2.787-3.192 0-4.276-2.793-2.764-4.632.33-.401.89-.784 1.76-.998 1.36-.335 3.527.208 5.557.878.365-.672.673-1.413.901-2.202H3.835v-.634h3.226V4.65H3.154v-.634H7.06v-1.62s0-.274.277-.274h1.577v1.894h3.863v.634H8.915v1.136h3.153a12.897 12.897 0 0 1-1.335 3.373c.957.346 1.816.674 2.456.889 2.135.714 2.734.801 2.811.81V2.565A2.562 2.562 0 0 0 13.438 0H2.563Zm1.755 8.669a4.773 4.773 0 0 0-.414.023c-.4.04-1.15.216-1.56.58-1.23 1.072-.494 3.032 1.995 3.032 1.447 0 2.893-.925 4.028-2.406-1.464-.714-2.725-1.244-4.05-1.23Z"
    //                     fill="#00A1E9">
    //                 </path>
    //             </svg>
    //             <Text variant="headingSm" as="h6">
    //                 Alipay
    //             </Text>
    //         </span>
    //     ),
    // },
    // {
    //     id: '3',
    //     content: (
    //         <span>
    //             <svg viewBox="0 0 22 16" className='Tab-Icon' fill="none" xmlns="http://www.w3.org/2000/svg" role="presentation" focusable="false">
    //                 <path fillRule="evenodd" clipRule="evenodd" d="M8.34 13.09a1.817 1.817 0 0 1-1.147.407H1.817C.8 13.497 0 12.647 0 11.659V6.254c0-.896.645-1.62 1.48-1.777a.897.897 0 0 1-.11-.42v-.765C1.423 1.62 2.817.3 4.504.3 6.223.3 7.64 1.67 7.64 3.389v.669c0 .157-.043.3-.11.42.843.16 1.48.905 1.48 1.79l-.001.6a3.552 3.552 0 0 1 2.898-1.504c1.237 0 2.32.635 2.957 1.594a2.5 2.5 0 0 1 2.326-1.594h3.538v2.808h-.047c.518.463.844 1.137.844 1.88 0 1.354-1.091 2.507-2.46 2.527H11.17V15.7H8.34v-2.61Z" fill="#fff"></path><path d="M19.054 8.237c.974.014 1.771.83 1.771 1.814 0 .985-.797 1.814-1.77 1.828h-5.291c.66-.276.986-.826 1.321-1.47h3.944a.364.364 0 0 0 .376-.36.374.374 0 0 0-.376-.374h-1.84c-.99 0-1.796-.812-1.796-1.805 0-.994.806-1.806 1.797-1.806h2.838v1.408H17.19a.39.39 0 0 0-.376.391c0 .208.169.374.376.374h1.864Zm-7.147-2.173c1.58 0 2.86 1.297 2.86 2.896 0 1.6-1.283 2.919-2.863 2.919h-1.433V15H9.04V8.965c0-1.599 1.287-2.9 2.867-2.9Zm0 4.346a1.44 1.44 0 0 0 1.442-1.45c0-.81-.647-1.469-1.442-1.469-.795 0-1.436.66-1.436 1.47v1.449h1.436Z" fill="#5F6360"></path><path d="M4.511 11.879h3.782c-.09.52-.549.918-1.1.918H1.817c-.615 0-1.117-.52-1.117-1.138V6.254a1.11 1.11 0 0 1 1.117-1.108h5.376c.614 0 1.117.506 1.117 1.123l-.006 4.14H4.511c-.581 0-1.085-.275-1.334-.764h4.22v-.702a2.9 2.9 0 0 0-2.892-2.895c-1.35 0-2.486.94-2.796 2.203 0 0-.085.423-.085.698 0 .276.09.695.09.695.307 1.266 1.444 2.235 2.797 2.235Zm-.006-4.457c.579 0 1.082.356 1.332.815H3.172c.25-.459.754-.815 1.333-.815ZM6.94 3.389v.669c0 .086-.075.17-.163.17h-.896c-.088 0-.159-.084-.159-.17v-.67c0-.658-.545-1.194-1.217-1.194s-1.218.536-1.218 1.195v.669c0 .086-.077.17-.164.17h-.896c-.088 0-.157-.084-.157-.17v-.735C2.105 2.034 3.18 1 4.504 1 5.85 1 6.94 2.07 6.94 3.389Z"
    //                     fill="#A41760">
    //                 </path>
    //             </svg>
    //             <Text variant="headingSm" as="h6">
    //                 EPS
    //             </Text>
    //         </span>
    //     ),
    // },
  ];

  function changeBGColor(color) {
    var cols = document.getElementsByClassName("Polaris-Frame");
    for (let i = 0; i < cols.length; i++) {
      cols[i].style.backgroundColor = `${color}`;
    }
  }

  //=======Timer Coundown=====//
  useEffect(() => {
    function countdown(elementName, minutes, seconds) {
      var element, endTime, hours, mins, msLeft, time;

      function twoDigits(n) {
        return n <= 9 ? "0" + n : n;
      }

      function updateTimer() {
        msLeft = endTime - +new Date();
        if (msLeft < 1000) {
          setCartTimer(false);
        } else {
          time = new Date(msLeft);
          hours = time.getUTCHours();
          mins = time.getUTCMinutes();
          if (element) {
            element.innerHTML =
              (hours ? hours + ":" + twoDigits(mins) : mins) +
              ":" +
              twoDigits(time.getUTCSeconds());
            setTimeout(updateTimer, time.getUTCMilliseconds() + 500);
          }
        }
      }

      element = document.getElementById(elementName);
      endTime = +new Date() + 1000 * (60 * minutes + seconds) + 500;
      updateTimer();
    }

    if (!loading) {
      countdown("timer-countdown1", 10, 0);
      countdown("timer-countdown2", 10, 0);
    }
  }, [loading]);

  const PaymentMethodInfo = ({ name, logo }) => {
    return (
      <div className="Subdued-Card-Section">
        <Card sectioned>
          <img src={logo} alt={logo} />
          <p>{name}.</p>
          <hr />
          <p className="Payment-Option-Guide">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 40"
              role="presentation"
            >
              <path
                opacity=".6"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 1a4 4 0 00-4 4v30a4 4 0 004 4h18a4 4 0 004-4v-9a1 1 0 10-2 0v9a2 2 0 01-2 2H9a2 2 0 01-2-2V14a2 2 0 012-2h18a2 2 0 012 2v2a1 1 0 102 0V5a4 4 0 00-4-4H9zm26.992 15.409L39.583 20H24a1 1 0 100 2h15.583l-3.591 3.591a1 1 0 101.415 1.416l5.3-5.3a1 1 0 000-1.414l-5.3-5.3a1 1 0 10-1.415 1.416zM7 8.5A1.5 1.5 0 018.5 7h19a1.5 1.5 0 010 3h-19A1.5 1.5 0 017 8.5zM23 3a1 1 0 100 2 1 1 0 000-2zm-8 1a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 30a1 1 0 100 2h6a1 1 0 100-2h-6z"
              ></path>
            </svg>
            After submission, you will be redirected to securely complete next
            steps.
          </p>
        </Card>
      </div>
    );
  };

  const AboutUsSection = () => {
    return (
      <>
        {aboutUs?.length > 0 && (
          <div className="Test-Section">
            <Card sectioned>
              <Stack vertical>
                {aboutUs?.map((item) => {
                  return (
                    <div className="Test-Grids" key={item.id}>
                      <div className="Test-Logo-Section">
                        <img
                          src={item.imgUrl}
                          alt="gift"
                          className="Test-Img"
                        />
                      </div>
                      <div>
                        <h1 className="Checikfy-Heading">{item.title}</h1>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </Stack>
            </Card>
          </div>
        )}

        <div className="Footer-Section">
          <Stack>
            {policiesDetails?.refund_policy && (
              <span
                className="Footer-Item"
                onClick={() => handlePoliciesModal("refund")}
              >
                {localizations?.FL_ReturnsPolicy}
              </span>
            )}

            {policiesDetails?.shipping_policy && (
              <span
                className="Footer-Item"
                onClick={() => handlePoliciesModal("shipping")}
              >
                {localizations?.FL_ShippingPolicy}
              </span>
            )}

            {policiesDetails?.privacy_policy && (
              <span
                className="Footer-Item"
                onClick={() => handlePoliciesModal("privacy")}
              >
                {localizations?.FL_PrivacyPolicy}
              </span>
            )}

            {policiesDetails?.terms_of_service && (
              <span
                className="Footer-Item"
                onClick={() => handlePoliciesModal("terms")}
              >
                {localizations?.FL_TermsAndConditions}
              </span>
            )}

            {policiesDetails?.contact_information && (
              <span
                className="Footer-Item"
                onClick={() => handlePoliciesModal("contact")}
              >
                Contact Information
              </span>
            )}
          </Stack>
        </div>
      </>
    );
  };

  const ExtraOffers = () => {
    return (
      <>
        {additionalOffers?.map((item) => {
          return (
            <Card sectioned>
              <Checkbox
                label={
                  <div className="Order-Product-Details">
                    <Stack>
                      <div className="Order-Product-Image-Section">
                        <div className="Order-Product-Image">
                          <img src={item?.imageUrl} alt={item?.title} />
                        </div>
                      </div>
                      <div className="Order-Product-Detail-Section">
                        <div className="Product-Title-Section">
                          <span className="Product-Title">
                            {item?.title}
                            <p className="Product-Extras">
                              {item?.description}
                            </p>
                          </span>
                          <p className="Product-Title">
                            {userDetails?.currency_symbol}
                            {item?.price && Number(item?.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Stack>
                  </div>
                }
                checked={selectedAddtionalOffers[item?.id]}
                onChange={(e) => handleAddtionalOffers(item?.id, e)}
              />
            </Card>
          );
        })}
      </>
    );
  };

  const Announement = () => {
    return (
      <div className="Strong-Demand-Announcement">
        <Card sectioned>
          <div>
            <p>{localizations?.M_StrongDemand}</p>
          </div>
        </Card>
      </div>
    );
  };

  const PaymentMethodNotAvailable = () => {
    return (
      <div className="Subdued-Card-Section">
        <Card sectioned>
          <br />
          <span className="Payment-Option-Guide">
            <Text
              variant="bodyMd"
              as="p"
              fontWeight="medium"
              alignment="center"
            >
              {localizations?.VE_LocationPayError}
            </Text>
          </span>
          <br />
        </Card>
      </div>
    );
  };

  const PaymentMethodMissing = () => {
    return (
      <div className="Subdued-Card-Section">
        <Card sectioned>
          <br />
          <span className="Payment-Option-Guide">
            <Text
              variant="bodyMd"
              as="p"
              fontWeight="medium"
              alignment="center"
            >
              {localizations?.PM_NoPaymentMethodsTitle}
            </Text>
          </span>
          <br />
        </Card>
      </div>
    );
  };

  const StripePaymentMethodError = () => {
    return (
      <div className="Subdued-Card-Section">
        <Card sectioned>
          <br />
          <span className="Payment-Option-Guide">
            <Text
              variant="bodyMd"
              as="p"
              fontWeight="medium"
              alignment="center"
            >
              {clientSecretErrorMsg
                ? clientSecretErrorMsg
                : localizations?.VE_GeneralError}
              {/* {localizations?.VE_GeneralError} */}
            </Text>
          </span>
          <br />
        </Card>
      </div>
    );
  };

  function getCountryNameFromId() {
    let value = "";
    let country = countriesList.find(
      (obj) => obj.id == shippingDetails?.country
    );
    if (country?.code == "US") {
      value = localizations?.OS_TaxUs;
    } else if (country?.code == "CA") {
      value = localizations?.OS_TaxCa;
    } else if (country?.code == "AU" || country?.code == "IN") {
      value = localizations?.OS_TaxAuIn;
    } else {
      value = localizations?.OS_TaxOther;
    }
    return value;
  }

  function checkSquarePaymentActive() {
    let value = true;
    if (squarePaymentSelectedTab == 0 && squarePaymentMethods.square_card) {
      value = false;
    }
    if (
      squarePaymentSelectedTab == 1 &&
      squarePaymentMethods.square_gift_card
    ) {
      value = false;
    }
    if (
      squarePaymentSelectedTab == 2 &&
      squarePaymentMethods.square_google_pay
    ) {
      value = false;
    }
    if (squarePaymentSelectedTab == 3 && squarePaymentMethods.square_ach) {
      value = false;
    }
    if (
      squarePaymentSelectedTab == 4 &&
      squarePaymentMethods.square_after_pay
    ) {
      value = false;
    }
    if (
      squarePaymentSelectedTab == 5 &&
      squarePaymentMethods.square_apple_pay
    ) {
      value = false;
    }

    return value;
  }

  function timerStringFilter(value) {
    let label = value?.replace("{{MM:SS}}", "");
    return label;
  }

  const getCountriesList = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/countries`);

      // console.log('getCountriesList response: ', response.data);
      setCountriesList(response.data);
    } catch (error) {
      console.warn("getCountriesList Api Error", error.response);
    }
  };

  function getSystemLanguage() {
    let lang = "";
    let userLang = navigator.language || navigator.systemLanguage;
    if (
      userLang == "en-US" ||
      userLang == "en-us" ||
      userLang == "en-gb" ||
      userLang == "en-GB" ||
      userLang == "en" ||
      userLang == "en-au" ||
      userLang == "en-ca" ||
      userLang == "en-nz" ||
      userLang == "en-ie" ||
      userLang == "en-za" ||
      userLang == "en-jm" ||
      userLang == "en-bz" ||
      userLang == "en-tt"
    ) {
      lang = "en";
    } else if (
      userLang == "ar" ||
      userLang == "ar-sa" ||
      userLang == "ar-iq" ||
      userLang == "ar-eg" ||
      userLang == "ar-ly" ||
      userLang == "ar-dz" ||
      userLang == "ar-ma" ||
      userLang == "ar-tn" ||
      userLang == "ar-om" ||
      userLang == "ar-ye" ||
      userLang == "ar-sy" ||
      userLang == "ar-jo" ||
      userLang == "ar-lb" ||
      userLang == "ar-kw" ||
      userLang == "ar-ae" ||
      userLang == "ar-bh" ||
      userLang == "ar-qa"
    ) {
      lang = "ar";
    } else if (
      userLang == "zh-CN" ||
      userLang == "zh-cn" ||
      userLang == "zh-tw" ||
      userLang == "zh-hk" ||
      userLang == "zh-sg"
    ) {
      lang = "zh-cn";
    } else if (
      userLang == "fr" ||
      userLang == "fr-be" ||
      userLang == "fr-ca" ||
      userLang == "fr-ch" ||
      userLang == "fr-lu"
    ) {
      lang = "fr";
    } else if (
      userLang == "de" ||
      userLang == "de-ch" ||
      userLang == "de-at" ||
      userLang == "de-lu" ||
      userLang == "de-li"
    ) {
      lang = "de";
    } else if (userLang == "ru" || userLang == "ru-mo") {
      lang = "ru";
    } else if (userLang == "it" || userLang == "it-ch") {
      lang = "it";
    } else if (userLang == "ur") {
      lang = "ur";
    } else if (userLang == "hi") {
      lang = "hi";
    } else if (userLang == "ja") {
      lang = "ja";
    }

    return lang;
  }

  const getLocalizations = async (user) => {
    let selectedLanguage = getSystemLanguage();
    try {
      let response = "";
      if (selectedLanguage) {
        response = await axios.get(
          `${API_URL}/api/localizations/${selectedLanguage}?storeName=${user?.shopifyShopDomainName}`
        );
      }
      // console.log('getLocalizations response: ', response.data);

      setLocalizations(response?.data);
    } catch (error) {
      console.warn("getLocalizations Api Error", error.response);
    }
  };

  const getCurrentCountry = async () => {
    try {
      const response = await axios.get("https://ecommercehack.com/api/geoip");
      // console.log('getCurrentCountry response: ', response.data);

      let country = "";
      if (countriesList?.find((obj) => obj.code == response.data[0]?.country)) {
        country = countriesList?.find(
          (obj) => obj.code == response.data[0]?.country
        );
        setShippingDetails({ ...shippingDetails, country: country?.id });
      }
      setGetCurrentCountryToggle(false);
    } catch (error) {
      console.warn("getCurrentCountry Api Error", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (countriesList) {
        if (getCurrentCountryToggle) {
          getCurrentCountry();
        }
      }
    }
  }, [loading, countriesList, getCurrentCountryToggle]);

  const getCartDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/checkout?id=${id}`);
      // console.log('getCartDetails response: ', response.data);

      if (convertNumberToBoolean(response.data?.checkout?.isPaid)) {
        navigate(`/thank-you-page?id=${id}`);
      } else {
        setShopDetails(response.data?.shop?.body?.shop);
        setCartDetails(response.data?.cart);
        setUserDetails(response.data?.user);
        setLocalizations(response.data?.localization);
        setCustomization(response.data?.customization);
        setPoliciesDetails(response.data?.policies);
        setCheckoutDetails(response.data?.checkout);
        setaboutUs(response.data?.about_us);
        setAdditionalOffers(response.data?.additional_offers);
        setPaymentMethods(response.data?.payment_method);
        setLineItems(response.data?.cart?.line_items);
        setCartSummary(response.data?.cart_summary);

        if (!response.data?.shop_shipping_zones?.errors) {
          setShopifyShippingRates(
            response.data?.shop_shipping_zones?.body?.shipping_zones
          );
        }

        if (
          convertNumberToBoolean(
            response.data?.customization?.isNativeShippingRateEnable
          )
        ) {
          if (
            !response.data?.shop_shipping_zones?.errors &&
            response.data?.cart_summary
          ) {
            let shopify_rates =
              response.data?.shop_shipping_zones?.body?.shipping_zones;
            let cart_summary = response.data?.cart_summary;
            let shipping_details = "";
            if (response.data?.checkout?.oldCountryData) {
              shipping_details = JSON.parse(
                response.data?.checkout?.oldCountryData
              );
            }
            let countryCode = shipping_details[0]?.countryCode;
            let stateName = shipping_details[0]?.stateName;
            setShippingRates(
              ShopifyShippingRatesCheck(
                shopify_rates,
                cart_summary,
                countryCode,
                stateName
              )
            );
          }
        } else {
          if (
            response.data?.shipping_rates?.length > 0 &&
            response.data?.cart_summary
          ) {
            if (
              ShippingRatesChecks(
                response.data?.shipping_rates,
                response.data?.cart_summary
              )?.length > 0
            ) {
              setShippingRates(
                ShippingRatesChecks(
                  response.data?.shipping_rates,
                  response.data?.cart_summary
                )
              );
            }
          }
        }

        setCartPrice({
          ...cartPrice,
          subTotal: response.data?.cart_summary?.price,
          discount: Number(response.data?.checkout?.oldDiscountedValue),
          vat: Number(response.data?.taxes?.value),
          vatType: response.data?.taxes?.type,
        });

        response.data?.payment_method?.map((item) => {
          if (item.variant == "square") {
            setSquarePaymentMethods({
              square_card: convertNumberToBoolean(item.square_card),
              square_gift_card: convertNumberToBoolean(item.square_gift_card),
              square_ach: convertNumberToBoolean(item.square_ach),
              square_google_pay: convertNumberToBoolean(item.square_google_pay),
              square_after_pay: convertNumberToBoolean(item.square_after_pay),
              square_apple_pay: convertNumberToBoolean(item.square_apple_pay),
              square_ach_holder_name: item.square_ach_holder_name,
              square_ach_redirect_url: item.square_ach_redirect_url,
              square_ach_transaction_id: item.square_ach_transaction_id,
            });
          }
        });

        setDiscountCode(response.data?.checkout?.oldDiscountCode);
        setIsBillingAddressSame(
          convertNumberToBoolean(
            response.data?.checkout?.oldIsBillingAddressSame
          )
        );
        if (Number(response.data?.checkout?.oldDiscountedValue) > 0) {
          setDiscountBtnDisabled(true);
        }
        if (response.data?.checkout?.oldPaymentSelectedTab) {
          setPaymentOptionsValue(
            response.data?.checkout?.oldPaymentSelectedTab
          );
        }

        if (response.data?.checkout?.oldShippingFormDetails) {
          setShippingDetails(
            JSON.parse(response.data?.checkout?.oldShippingFormDetails)
          );
        } else {
          setGetCurrentCountryToggle(true);
        }
        if (response.data?.checkout?.oldBillingFormDetails) {
          setBillingDetails(
            JSON.parse(response.data?.checkout?.oldBillingFormDetails)
          );
        }
        if (
          !convertNumberToBoolean(
            response.data?.customization?.showShippingOptions
          )
        ) {
          if (response.data?.checkout?.oldShippingOptionName) {
            setShippingOptionsValue(
              response.data?.checkout?.oldShippingOptionName
            );
          }
        }

        let offers = {};
        response.data?.additional_offers?.map((item) => {
          offers = {
            ...offers,
            [item?.id]: convertNumberToBoolean(item?.selected),
          };
        });

        if (response.data?.checkout?.oldSelectedOfferValue) {
          let arr = response.data?.checkout?.oldSelectedOfferValue.split(",");
          arr?.map((item) => {
            offers = { ...offers, [item]: true };
          });
        }
        setSelectedAddtionalOffers(offers);

        if (
          convertNumberToBoolean(
            response.data?.customization?.showCountryCurrency
          )
        ) {
          if (response.data?.checkout?.oldCountryData) {
            let data = JSON.parse(response.data?.checkout?.oldCountryData);
            let code = data[0]?.countryCode;
            getCurrencyConversion(code, response.data?.user?.currency);
          }
        }

        if (
          convertNumberToBoolean(response.data?.customization?.transByDevice)
        ) {
          getLocalizations(response.data?.user);
        }

        if (response.data?.custom_script) {
          response.data?.custom_script?.map((item) => {
            let head = document.getElementsByTagName("head")[0];
            let body = document.getElementsByTagName("body")[0];

            if (item.page == "checkout" || item.page == "all") {
              let xmlString = item.script;
              let doc = new DOMParser().parseFromString(xmlString, "text/xml");
              let script = doc.querySelector("script");
              let noscript = doc.querySelector("noscript");
              let style = doc.querySelector("style");
              if (script) {
                // let newScript = document.createElement('script');
                // newScript.type = doc.querySelector('script').getAttribute('type');
                // newScript.src = doc.querySelector('script').getAttribute('src');

                if (item.type == "header") {
                  head.appendChild(script);
                } else if (item.type == "footer") {
                  body.appendChild(script);
                }
              }
              if (noscript) {
                if (item.type == "header") {
                  head.appendChild(noscript);
                } else if (item.type == "footer") {
                  body.appendChild(noscript);
                }
              }
              if (style) {
                if (item.type == "header") {
                  head.appendChild(style);
                } else if (item.type == "footer") {
                  body.appendChild(style);
                }
              }
            }
          });
        }

        setTimeout(() => {
          setToggleFormDataSubmit(true);
        }, 2000);
        setLoading(false);
      }
    } catch (error) {
      console.warn("getCartDetails Api Error", error);
      setToastMsg("Invalid Token");
      setErrorToast(true);
      window.location.replace("https://ecommercehack.com/login");
    }
  };

  useEffect(() => {
    let id = location.search.replace("?id=", "");
    getCartDetails(id);
    setCartUuid(id);
    getCountriesList();
  }, []);

  const getTaxDetails = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/checkout?id=${id}&type=calculation`
      );
      // console.log('getTaxDetails response: ', response?.data);
      setToggleGetTax(false);

      if (!convertNumberToBoolean(customization?.isNativeShippingRateEnable)) {
        if (response.data?.shipping_rates) {
          if (
            ShippingRatesChecks(response.data?.shipping_rates, cartSummary)
              ?.length > 0
          ) {
            setShippingRates(
              ShippingRatesChecks(response.data?.shipping_rates, cartSummary)
            );
          } else {
            setShippingRates([]);
          }
        } else {
          setShippingRates([]);
        }
      }

      if (response.data?.tax != null) {
        setCartPrice({
          ...cartPrice,
          vat: Number(response.data?.tax?.value),
          vatType: response.data?.tax?.type,
        });
      } else {
        setCartPrice({
          ...cartPrice,
          vat: 0,
          vatType: "",
        });
      }

      setTimeout(() => {
        setToggleFormDataSubmit(true);
      }, 2000);
    } catch (error) {
      console.warn("getTaxDetails Api Error", error);
      setToastMsg("Server Error, Reload page");
      setErrorToast(true);
      setToggleGetTax(false);
    }
  };

  useEffect(() => {
    if (toggleGetTax) {
      if (!toggleFormDataSubmit && !toggleCalculation) {
        getTaxDetails(cartUuid);
      }
    }
  }, [toggleGetTax, toggleFormDataSubmit, toggleCalculation]);

  function accentColorShadow(value) {
    let color = "";
    if (value) {
      color = value.concat("33");
    }
    return color;
  }

  useEffect(() => {
    changeBGColor(customization?.backgroundColor);
    document.documentElement.style.setProperty(
      "--form-input-error-color",
      customization?.errorColor
    );
    document.documentElement.style.setProperty(
      "--checkify-btn-color",
      customization?.buttonsColor
    );
    document.documentElement.style.setProperty(
      "--checkify-accent-color",
      customization?.accentColor
    );
    document.documentElement.style.setProperty(
      "--checkify-accent-light-color",
      accentColorShadow(customization?.accentColor)
    );
    document.documentElement.style.setProperty(
      "--checkify-card-color",
      customization?.cardColor
    );
    document.documentElement.style.setProperty(
      "--checkify-text-color",
      customization?.textColor
    );
    document.documentElement.style.setProperty(
      "--checkify-font-title",
      customization?.fontText
    );
    document.documentElement.style.setProperty(
      "--checkify-font-body",
      customization?.fontBody
    );
    document.documentElement.style.setProperty(
      "--checkify-font-btn",
      customization?.fontButton
    );
    document.documentElement.style.setProperty(
      "--strong-demand-announcement-bg-color",
      customization?.motivatorBackgroundColor
    );
    document.documentElement.style.setProperty(
      "--strong-demand-announcement-text-color",
      customization?.motivatorTextColor
    );

    if (customization?.acceptsMarketing) {
      setSignUpExclusive(true);
    }

    setTimeout(() => {
      if (
        !loading &&
        shippingDetails?.country?.length > 1 &&
        countriesList?.length
      ) {
        if (
          convertNumberToBoolean(customization?.zipValidate) &&
          shippingDetails?.zipCode?.length > 0
        ) {
          CheckZipValidation();
        }
      }
    }, 4000);
  }, [customization]);

  async function CheckZipValidation() {
    let resp = await ValidateZipCode("shipping", shippingDetails?.zipCode);
    if (resp) {
      setShippingFormErrors({ ...shippingFormErrors, zipCode: false });
    } else {
      setShippingFormErrors({ ...shippingFormErrors, zipCode: true });
    }

    if (!isBillingAddressSame) {
      if (await ValidateZipCode("billing", billingDetails?.zipCode)) {
        setBillingFormErrors({ ...billingFormErrors, zipCode: false });
      } else {
        setBillingFormErrors({ ...billingFormErrors, zipCode: true });
      }
    }
  }

  const applyDiscount = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["discountBtn"]) {
        toggleId = { ["discountBtn"]: false };
      } else {
        toggleId = { ["discountBtn"]: true };
      }
      return { ...toggleId };
    });

    let data = {
      checkout_id: checkoutDetails?.id,
      has_discount: discountCode,
    };
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/apply-discount`,
        data
      );
      // console.log('applyDiscount response: ', response.data);
      if (response.data.error == "true") {
        setDiscountCodeInvalid(true);
        setBtnLoading(false);
      } else {
        if (response.data?.discount_value) {
          let discount_value = response.data?.discount_value.replaceAll(
            ",",
            ""
          );
          setCartPrice({
            ...cartPrice,
            discount: discount_value ? Number(discount_value) : 0,
            discountType: response.data?.discount_type,
          });
          setDiscountBtnDisabled(true);
          setToggleFormDataSubmit(true);
        }
        setBtnLoading(false);
      }
    } catch (error) {
      console.warn("applyDiscount Api Error", error);
      setBtnLoading(false);
      setToastMsg("Server Error, Try Again");
      setErrorToast(true);
    }
  };

  const submitFormData = async () => {
    let selectedOffers = [];
    let selecetdOffersId = [];

    additionalOffers?.map((item) => {
      if (selectedAddtionalOffers[item?.id]) {
        selectedOffers.push(item);
        selecetdOffersId.push(item.id);
      }
    });

    let oldCountryData = [];
    let countryCode = getCountryNameCode("code", shippingDetails.country);
    let countryName = getCountryNameCode("name", shippingDetails.country);
    let billingCountryName = getCountryNameCode("name", billingDetails.country);
    let stateName = "";
    let billingStateName = "";
    countriesList?.map((item) => {
      let state = item.states?.find((obj) => obj.id == shippingDetails.state);
      if (state) {
        stateName = state.name;
      }

      let billingState = item.states?.find(
        (obj) => obj.id == billingDetails.state
      );
      if (billingState) {
        billingStateName = billingState.name;
      }
    });
    oldCountryData.push({
      countryCode: countryCode,
      stateName: stateName,
    });

    let thank_you_page_data = [];
    thank_you_page_data.push({
      countryName: countryName,
      stateName: stateName,
      billingCountryName:
        billingCountryName == undefined ? "" : billingCountryName,
      billingStateName: billingStateName == undefined ? "" : billingStateName,
      paymentMethod: paymentOptionsValue,
      discountValue: Number(getPriceCalculate("discount2")),
      discountCode: discountCode,
      subTotal: Number(getPriceCalculate("subTotal2")),
      taxValue: getPriceCalculate("vat"),
      taxTotal: Number(getPriceCalculate("tax2")),
      totalValue: Number(getPriceCalculate("total")),
      localCurrency: currencyConversion.currency,
      localRate: currencyConversion.rate && Number(currencyConversion.rate),
      shippingName:
        shippingRates[shippingOptionsValue.replace("rate", "")]?.name,
      shippingDescription:
        shippingRates[shippingOptionsValue.replace("rate", "")]?.description,
      shippingValue:
        shippingRates[shippingOptionsValue.replace("rate", "")]?.price,
    });

    let data = {
      id: checkoutDetails?.id,
      oldIsBillingAddressSame: convertBooleanToNumber(isBillingAddressSame),
      oldEmailAddress: shippingDetails?.email,
      oldPaymentSelectedTab: paymentOptionsValue,
      oldDiscountCode: discountCode,
      oldDiscountType: cartPrice.discountType,
      oldDiscountedValue: getPriceCalculate("discount2"),
      oldSubTotalValue: getPriceCalculate("subTotal2"),
      oldTaxValue: getPriceCalculate("tax2"),
      oldTotalValue: getPriceCalculate("total"),
      oldShippingOptionName: shippingOptionsValue,
      oldShippingValue:
        shippingRates[shippingOptionsValue.replace("rate", "")]?.price,
      oldCurrencyCode: userDetails?.currency_symbol,
      oldSelectedOffer: JSON.stringify(selectedOffers),
      oldSelectedOfferValue: selecetdOffersId.toString(),
      oldShippingFormDetails: JSON.stringify(shippingDetails),
      oldBillingFormDetails: JSON.stringify(billingDetails),
      oldCountryData: JSON.stringify(oldCountryData),
      oldThankYouPageData: JSON.stringify(thank_you_page_data),
    };
    try {
      const response = await axios.post(`${API_URL}/api/checkout/update`, data);
      // console.log('submitFormData response: ', response.data);
      setToggleFormDataSubmit(false);
      setToggleCalculation(false);
    } catch (error) {
      console.warn("submitFormData Api Error", error);
      // setToggleFormDataSubmit(false)
      // setToastMsg('Server Error, Reload page')
      // setErrorToast(true)
    }
  };

  useEffect(() => {
    if (!loading) {
      submitFormData();
    }
  }, [shippingDetails]);

  useEffect(() => {
    if (toggleFormDataSubmit) {
      submitFormData();
    }
  }, [toggleFormDataSubmit, shippingDetails]);

  const paymentSubmit = async (e) => {
    e.preventDefault();
    setToggleFormDataSubmit(true);
    if (paymentOptionsValue == "cash") {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev["paymentSubmitBtn"]) {
          toggleId = { ["paymentSubmitBtn"]: false };
        } else {
          toggleId = { ["paymentSubmitBtn"]: true };
        }
        return { ...toggleId };
      });
    } else if (paymentOptionsValue == "paypal") {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev["paypalPaymentSubmitBtn"]) {
          toggleId = { ["paypalPaymentSubmitBtn"]: false };
        } else {
          toggleId = { ["paypalPaymentSubmitBtn"]: true };
        }
        return { ...toggleId };
      });
    }

    let paymentId = paymentMethods.find(
      (obj) => obj.variant === paymentOptionsValue
    ).id;

    let data = {
      id: cartUuid,
      payment_type_id: paymentId,
    };

    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${API_URL}/api/checkout/apply-charge`,
          data
        );
        // console.log('paymentSubmit response: ', response);

        if (response.data?.errors) {
          setToastMsg("Something went wrong, please Try Again");
          setErrorToast(true);
        } else {
          window.location.replace(response.data?.message);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("paymentSubmit Api Error", error);
        setBtnLoading(false);
        setToastMsg("Something went wrong, please Try Again");
        setErrorToast(true);
      }
    }, 1500);
  };

  const squarePaymentSubmit = async (token) => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["paymentSubmitBtn"]) {
        toggleId = { ["paymentSubmitBtn"]: false };
      } else {
        toggleId = { ["paymentSubmitBtn"]: true };
      }
      return { ...toggleId };
    });

    let paymentId = paymentMethods.find(
      (obj) => obj.variant === paymentOptionsValue
    ).id;

    let data = {
      locationId: square?.publicKey,
      sourceId: token,
      checkout_id: cartUuid,
      payment_type_id: paymentId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/square/pay`,
        data
      );
      // console.log('paymentResponse response: ', response);
      setBtnLoading(false);

      if (response.data?.errors) {
        setToastMsg("Something went wrong, please Try Again");
        setErrorToast(true);
      } else {
        window.location.replace(response.data?.message);
      }
    } catch (error) {
      console.warn("paymentResponse Api Error", error.response);
      setBtnLoading(false);
      setToastMsg("Something went wrong, please Try Again");
      setErrorToast(true);
    }
  };

  const handleSqaurePayment = () => {
    if (handleFormErrors()) {
      if (squarePaymentSelectedTab == 0) {
        // card pay button
        // document.getElementsByClassName('c-jWYnUm')[0].click()
        document.getElementById("rswp-card-button").click();
      } else if (squarePaymentSelectedTab == 1) {
        // giftcard button
        // document.getElementsByClassName('c-jWYnUm')[0].click()
        document.getElementById("rswp-gift-card-button").click();
      } else if (squarePaymentSelectedTab == 2) {
        // gpay button
        document.getElementsByClassName("gpay-card-info-container")[0].click();
      } else if (squarePaymentSelectedTab == 3) {
        // Ach button
        document.getElementsByClassName("c-laXeHc")[0].click();
      } else if (squarePaymentSelectedTab == 4) {
        // AfterPay button
        // document.getElementsByClassName('sq-ap__button')[0].click()
        document.getElementById("rswps-afterpay-button").click();
      }
      // else if (squarePaymentSelectedTab == 5) {
      //     console.log('apple pay selected');
      // }
      // else if (squarePaymentSelectedTab == 6) {
      //     let cashPay = document.getElementById('cash_app_pay_v1_element').querySelector('div')
      //     console.log(cashPay.shadowRoot.querySelector('[data-testid="cap-btn"]'));
      //     cashPay.shadowRoot.querySelector('[data-testid="cap-btn"]').click()
      // }
    }
  };

  const stripePaymentSubmit = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["paymentSubmitBtn"]) {
        toggleId = { ["paymentSubmitBtn"]: false };
      } else {
        toggleId = { ["paymentSubmitBtn"]: true };
      }
      return { ...toggleId };
    });

    let paymentId = paymentMethods.find(
      (obj) => obj.variant === paymentOptionsValue
    ).id;

    let data = {
      id: cartUuid,
      payment_type_id: paymentId,
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/apply-charge`,
        data
      );
      console.log("paymentSubmit response: ", response);

      if (response.data?.errors) {
        setToastMsg("Server Error, Try Again");
        setErrorToast(true);
      } else {
        // window.location.replace(response.data?.message);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("paymentSubmit Api Error", error);
      setBtnLoading(false);
      setToastMsg("Server Error");
      setErrorToast(true);
    }
  };

  const handleStripeSubmit = async (event, elements, stripe) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    stripe
      .createToken(cardElement)
      .then((resp) => {
        console.log("resp", resp);
        // stripePaymentSubmit(resp?.id)
      })
      .catch((error) => {
        console.log("error", error);
      });

    // const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    // if (error) {
    //     setToastMsg('Incorrect/Missing Details')
    //     setErrorToast(true)
    // } else {
    //     const orderData = {
    //         payment: {
    //             gateway: 'stripe',
    //             stripe: {
    //                 payment_method_id: paymentMethod.id,
    //             },
    //         },
    //     };

    //     console.log('orderData', orderData);
    // }
  };

  const appearance = {
    theme: "stripe",

    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: `${customization?.textColor}`,
      colorDanger: `${customization?.errorColor}`,
    },

    rules: {
      ".Tab": {
        border: "1px solid #cfd8dc",
      },

      ".Tab:hover": {
        color: "var(--colorText)",
      },

      ".Tab--selected": {
        color: "var(--colorTextSecondary)",
        border: `1px solid ${customization?.accentColor}`,
        borderColor: `${customization?.accentColor}`,
        boxShadow: `${accentColorShadow(
          customization?.accentColor
        )} 0 0 0 0.2rem`,
      },

      ".Tab--selected:hover": {
        color: "var(--colorTextSecondary)",
      },

      ".Tab--selected:focus": {
        color: "var(--colorTextSecondary)",
        borderColor: `${customization?.accentColor}`,
        boxShadow: `${accentColorShadow(
          customization?.accentColor
        )} 0 0 0 0.2rem`,
      },

      ".Input--invalid": {
        boxShadow:
          "0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)",
      },

      ".Input:focus": {
        borderColor: `${customization?.accentColor}`,
        boxShadow: `${accentColorShadow(
          customization?.accentColor
        )} 0 0 0 0.2rem`,
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  const getStripeIntent = async () => {
    setStripeIntentLoading(true);
    let paymentId = paymentMethods.find(
      (obj) => obj.variant === paymentOptionsValue
    ).id;
    let data = {
      payment_type_id: paymentId,
      storeName: userDetails?.shopifyShopDomainName,
      checkout_id: checkoutDetails?.id,
      secret_id: secretId,
      amount: getPriceCalculate("total"),
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/paymentSystem`,
        data
      );
      // console.log('getStripeIntent response: ', response);

      if (response?.data?.client_secret) {
        setSecretId(response?.data?.id);
        setClientSecret(response?.data?.client_secret);
        setClientSecretError(false);
      } else {
        setClientSecretError(true);
      }

      setSecretLoading(false);
      setStripeIntentLoading(false);

      if (response?.data) {
        let msg = response?.data.split(".")[0];
        if (msg) {
          if (msg == "Amount must convert to at least 50 cents") {
            let amount = response?.data.split("approximately ")[1];
            let error = `For using this payment method, total amount should be more than $0.50. Your's total is ${amount}`;
            setClientSecretErrorMsg(error);
          } else {
            setClientSecretErrorMsg();
          }
        }
      }
    } catch (error) {
      console.warn("getStripeIntent Api Error", error);
      setSecretLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (paymentOptionsValue === "stripe") {
        getStripeIntent();
      } else {
        setSecretLoading(true);
        setClientSecretError(false);
        setClientSecretErrorMsg();
      }
    }
  }, [getPriceCalculate("total"), paymentOptionsValue]);

  return (
    <>
      <Helmet>
        <title>
          {localizations?.CP_CheckoutPageName
            ? localizations?.CP_CheckoutPageName
            : "Checkout Page"}
        </title>
        <link
          rel="icon"
          type="image/png"
          href={
            customization?.favicons && customization?.favicons != "null"
              ? customization?.favicons
              : defaultFavicon
          }
        />
      </Helmet>

      {loading ? (
        <Loader />
      ) : (
        <div className="container Checkout-Page">
          <Modal
            open={policiesModal}
            onClose={handlePoliciesModalClose}
            title={checkPolicyModalValue("label")}
          >
            <Modal.Section>
              <TextContainer>
                <div
                  className="Policies-Content"
                  dangerouslySetInnerHTML={{
                    __html: checkPolicyModalValue("body"),
                  }}
                ></div>
              </TextContainer>
            </Modal.Section>
          </Modal>

          <Page fullWidth>
            <div className="Logo-Container">
              {(!customization?.rightImageUrl ||
                customization?.rightImageUrl == "null") && <span></span>}

              {customization?.leftImageUrl &&
              customization?.leftImageUrl != "null" ? (
                customization?.logoUrl ? (
                  <a href={customization?.logoUrl}>
                    {" "}
                    <img src={customization?.leftImageUrl} alt="logo" />
                  </a>
                ) : (
                  <img src={customization?.leftImageUrl} alt="logo" />
                )
              ) : (
                <span></span>
              )}
              {customization?.rightImageUrl &&
              customization?.rightImageUrl != "null" ? (
                <img src={customization?.rightImageUrl} alt="logo" />
              ) : (
                <span></span>
              )}
            </div>
            <Layout>
              <Layout.Section>
                {convertNumberToBoolean(
                  customization?.isCustomTextBarShowed
                ) && (
                  <div className="Announcement-Top">
                    <Announement />
                  </div>
                )}

                {convertNumberToBoolean(customization?.displayTimer) &&
                  cartTimer && (
                    <div className="Cart-Timer-Section">
                      <div className="Cart-Timer-Section-Info">
                        {timerStringFilter(localizations?.M_CartReservation)}
                        <span id="timer-countdown1"></span>
                      </div>
                    </div>
                  )}

                {/* <div className='PayButton LinkButton'>
                                    <Card sectioned>
                                        <Button>
                                            <div className='LinkButton-content'>
                                                <span className='LinkButton-logo'>
                                                    <svg className="LinkButton-logoSvg" focusable="false" viewBox="0 0 250 113.3" fill="none">
                                                        <path fill="#1D3944" d="M39.8 1.7C41.5.6 43.4 0 45.5 0c2.7 0 5.3 1.1 7.2 3 1.9 1.9 3 4.5 3 7.2 0 2-.6 4-1.7 5.7-1.1 1.7-2.7 3-4.6 3.8-1.9.8-3.9 1-5.9.6-2-.4-3.8-1.4-5.2-2.8-1.4-1.4-2.4-3.3-2.8-5.2-.4-2-.2-4 .6-5.9.7-2 2-3.5 3.7-4.7zM0 1.1h18.3v110.6H0V1.1zM247.2 32.7c-6.3 13.6-13.8 26.6-22.3 38.9l25.1 40h-21.6L213 87c-15.5 17.7-30.8 26.3-45.6 26.3-18 0-25.4-12.9-25.4-27.5V75.3c0-19.3-2-24.8-8.6-23.9-12.5 1.7-31.6 30.2-44 60.3H72.3v-79h18.3v39.5c10.4-17.6 20-32.7 35.4-38.5 8.9-3.4 16.5-1.9 20.4-.2 14.2 6.3 14.2 21.5 14 42v8.7c0 7.4 2.1 10.7 7.1 11.2 3 .3 6-.4 8.6-1.9V1.1h18.3v79.2s15.9-14.5 32.6-47.5h20.2zM54.6 32.8H36.3v78.9h18.3V32.8z">
                                                        </path>
                                                    </svg>
                                                </span>

                                                <span className='LinkButton-text'>
                                                    <div className='LinkButton-textDivider'></div>
                                                    <span>Pay faster</span>
                                                    <svg className="LinkButton-lock" focusable="false" viewBox="0 0 13 16" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M1.5 7V5a5 5 0 0 1 10 0v2h.5a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8a1 1 0 0 1 1-1h.5Zm5 2.5a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1Zm3-2.5V5a3 3 0 0 0-6 0v2h6Z" fill="#1D3944">
                                                        </path>
                                                    </svg>
                                                </span>

                                            </div>
                                        </Button>
                                    </Card>
                                </div>

                                <div className='PayButton PaypalButton'>
                                    <Card sectioned>
                                        <Button>
                                            <div className='PaypalButton-content'>
                                                <img src={paypalLogo} alt="paypal-logo" />
                                                <span> Buy Now</span>
                                            </div>
                                        </Button>
                                    </Card>
                                </div>

                                <div className='Pay-Another-Way'>
                                    <span>Or Pay Another Way Below</span>
                                </div> */}

                <div className="Shipping-Details">
                  {!convertNumberToBoolean(customization?.hideShipping) && (
                    <h1 className="Checikfy-Heading">
                      {localizations?.SD_ShippingDetails}
                    </h1>
                  )}

                  {convertNumberToBoolean(
                    customization?.isCustomTextBarShowed
                  ) && (
                    <div className="Announcement-Bottom">
                      <Announement />
                    </div>
                  )}

                  <Card sectioned>
                    <ShippingForm
                      shippingDetails={shippingDetails}
                      handleShippingDetails={handleShippingDetails}
                      shippingFormErrors={shippingFormErrors}
                      paymentSubmit={paymentSubmit}
                      countriesList={countriesList}
                      customization={customization}
                      localizations={localizations}
                      convertNumberToBoolean={convertNumberToBoolean}
                      shippingRates={shippingRates}
                    />
                  </Card>

                  {/* <Card sectioned>
                                        <Checkbox
                                            label={localizations?.M_MarketingAcceptance}
                                            checked={signUpExclusive}
                                            onChange={handleSignUpExclusive}
                                        />
                                    </Card> */}
                </div>

                {!convertNumberToBoolean(
                  customization?.showShippingOptions
                ) && (
                  <div className="Shipping-Options">
                    {!convertNumberToBoolean(
                      customization?.hideShippingOption
                    ) && (
                      <h1 className="Checikfy-Heading">
                        {localizations?.SO_ShippingOptions}
                      </h1>
                    )}
                    {toggleGetTax ? (
                      <Spinner />
                    ) : shippingRates?.length ? (
                      <Card sectioned>
                        <Stack vertical>
                          {shippingRates?.map((item, index) => {
                            return (
                              <RadioButton
                                key={index}
                                label={
                                  <span className="Shipping-Options-Description">
                                    <span className="Shipping-Options-Title">
                                      {item.name}
                                      {item.description && (
                                        <small>({item.description})</small>
                                      )}
                                    </span>
                                    {item.price > 0 ? (
                                      <span>
                                        {userDetails?.currency_symbol}
                                        {item.price &&
                                          Number(item.price).toFixed(2)}
                                      </span>
                                    ) : (
                                      <span className="Shipping-Options-NoPrice">
                                        {localizations?.SO_Free}
                                      </span>
                                    )}
                                  </span>
                                }
                                id={`rate${index}`}
                                checked={shippingOptionsValue == `rate${index}`}
                                name={`rate${index}`}
                                onChange={handleShippingOptionsValue}
                              />
                            );
                          })}
                        </Stack>
                      </Card>
                    ) : (
                      <span className="Test-Section">
                        <Card subdued sectioned>
                          <span className="No-Payment-Method">
                            <Text
                              variant="headingSm"
                              as="h6"
                              alignment="center"
                            >
                              {localizations?.SO_NoShippingOptionsTitle}
                            </Text>
                          </span>
                        </Card>
                      </span>
                    )}
                  </div>
                )}

                {!convertNumberToBoolean(customization?.hideBillingForm) && (
                  <div className="Billing-Address">
                    {!convertNumberToBoolean(customization?.hideBilling) && (
                      <h1 className="Checikfy-Heading">
                        {localizations?.BD_BillingDetails}
                      </h1>
                    )}

                    <Card sectioned>
                      <Checkbox
                        label={localizations?.BD_BillingAddressIsSame}
                        checked={isBillingAddressSame}
                        onChange={handleIsBillingAddressSame}
                      />

                      <div>
                        <span
                          className={`${
                            !isBillingAddressSame ? " " : "visually-hidden"
                          }`}
                        >
                          <BillingForm
                            billingDetails={billingDetails}
                            handleBillingDetails={handleBillingDetails}
                            billingFormErrors={billingFormErrors}
                            countriesList={countriesList}
                            localizations={localizations}
                            customization={customization}
                            convertNumberToBoolean={convertNumberToBoolean}
                          />
                        </span>
                      </div>
                    </Card>
                  </div>
                )}

                <div className="Test-Section-Desktop">
                  <AboutUsSection />
                </div>
              </Layout.Section>

              <Layout.Section secondary>
                <div className="Order-Summary">
                  <div
                    className="Header-Mobile"
                    onClick={() => setHeaderPanelStatus(!headerPanelStatus)}
                  >
                    <div className="Panel-Status">
                      <h1>
                        {" "}
                        {headerPanelStatus
                          ? localizations?.OS_HideOrderSummary
                          : localizations?.OS_ShowOrderSummary}{" "}
                      </h1>
                      <svg
                        focusable="false"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {headerPanelStatus ? (
                          <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
                        ) : (
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path>
                        )}
                      </svg>
                    </div>

                    {convertNumberToBoolean(
                      customization?.showCountryCurrency
                    ) &&
                      userDetails?.currency != currencyConversion.currency &&
                      shippingDetails?.country && (
                        <span className="Total-Price-Local">
                          {`(~ ${currencyConversion?.currency}
                                                        ${(
                                                          Number(
                                                            getPriceCalculate(
                                                              "total"
                                                            )
                                                          ) *
                                                          currencyConversion?.rate
                                                        ).toFixed(2)})`}
                        </span>
                      )}

                    <div className="Total-Price">
                      {userDetails?.currency_symbol}{" "}
                      {getPriceCalculate("total")}
                    </div>
                  </div>
                  {!convertNumberToBoolean(customization?.hideSummary) && (
                    <h1 className="Checikfy-Heading">
                      {localizations?.OS_OrderSummary}
                    </h1>
                  )}

                  {convertNumberToBoolean(customization?.displayTimer) &&
                    cartTimer && (
                      <div className="Cart-Timer-Section">
                        <div className="Cart-Timer-Section-Info">
                          {timerStringFilter(localizations?.M_CartReservation)}
                          <span id="timer-countdown2"></span>
                        </div>
                      </div>
                    )}

                  <span
                    className={`${
                      !headerPanelStatus && "Order-Summary-Hidden"
                    }`}
                  >
                    <Card sectioned>
                      <div className="Subdued-Card-Section">
                        <Card sectioned>
                          <Scrollable
                            style={{
                              height: lineItems?.length == 1 ? "75px" : "150px",
                            }}
                          >
                            {lineItems?.map((item) => {
                              return (
                                <div
                                  className="Order-Product-Details"
                                  key={item.id}
                                >
                                  <Stack>
                                    <div className="Order-Product-Image-Section">
                                      <div className="Order-Product-Image">
                                        <img
                                          src={item.product_images[0]?.src}
                                          alt={item.title}
                                        />
                                      </div>

                                      <div className="Order-Quantity">
                                        {item.quantity}
                                      </div>
                                    </div>
                                    <div className="Order-Product-Detail-Section">
                                      <div className="Product-Title-Section">
                                        <h2 className="Product-Title">
                                          {item.title}
                                        </h2>
                                        <h2 className="Product-Title">
                                          {userDetails?.currency_symbol}
                                          {item.price &&
                                            Number(item.price).toFixed(2)}
                                        </h2>
                                      </div>
                                      {/* <h2 className='Product-Extras'>Old</h2> */}
                                    </div>
                                  </Stack>
                                </div>
                              );
                            })}
                          </Scrollable>

                          {!convertNumberToBoolean(
                            customization?.hideDiscountMobile
                          ) && (
                            <span className="Discount-Mobile">
                              {DiscountCode(
                                discountCode,
                                handleDiscountCode,
                                discountCodeInvalid,
                                discountBtnDisabled,
                                btnLoading,
                                removeDiscountTag,
                                applyDiscount,
                                localizations
                              )}
                            </span>
                          )}

                          {!convertNumberToBoolean(
                            customization?.hideDiscountDesktop
                          ) && (
                            <span className="Discount-Input-Desktop">
                              {DiscountCode(
                                discountCode,
                                handleDiscountCode,
                                discountCodeInvalid,
                                discountBtnDisabled,
                                btnLoading,
                                removeDiscountTag,
                                applyDiscount,
                                localizations
                              )}
                            </span>
                          )}
                        </Card>
                      </div>

                      {toggleGetTax ? (
                        <Spinner />
                      ) : (
                        <span>
                          <div className="Order-Prices-Section">
                            <Stack>
                              <span>{localizations?.OS_Subtotal}</span>
                              <span>{getPriceCalculate("subTotal")}</span>
                            </Stack>

                            {discountBtnDisabled && (
                              <Stack>
                                <span className="Order-Prices-Dual">
                                  {localizations?.OS_Discount}
                                  <span className="Discount-Code">
                                    <svg
                                      focusable="false"
                                      viewBox="0 0 24 24"
                                      aria-hidden="true"
                                    >
                                      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"></path>
                                    </svg>
                                    {discountCode}
                                  </span>
                                </span>
                                <span>{getPriceCalculate("discount")}</span>
                              </Stack>
                            )}

                            {convertNumberToBoolean(customization?.taxCharge) &&
                              cartPrice?.vat > 0 && (
                                <Stack>
                                  <span className="Order-Prices-Dual">
                                    {/* {localizations?.OS_TaxUs} */}
                                    {getCountryNameFromId()}
                                    <span className="Order-Prices-Percentage">
                                      {getPriceCalculate("vat")}
                                    </span>
                                  </span>
                                  <span>{getPriceCalculate("tax")}</span>
                                </Stack>
                              )}

                            {shippingRates?.length > 0 ? (
                              <Stack>
                                <span className="Order-Prices-Dual">
                                  {
                                    shippingRates[
                                      shippingOptionsValue.replace("rate", "")
                                    ]?.name
                                  }
                                  <span className="Order-Prices-Percentage">
                                    {
                                      shippingRates[
                                        shippingOptionsValue.replace("rate", "")
                                      ]?.description
                                    }
                                  </span>
                                </span>
                                {shippingRates[
                                  shippingOptionsValue.replace("rate", "")
                                ]?.price > 0 ? (
                                  <span>
                                    {userDetails?.currency_symbol}
                                    {shippingRates[
                                      shippingOptionsValue.replace("rate", "")
                                    ]?.price &&
                                      Number(
                                        shippingRates[
                                          shippingOptionsValue.replace(
                                            "rate",
                                            ""
                                          )
                                        ]?.price
                                      ).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="Shipping-Options-NoPrice">
                                    {localizations?.OS_Free}
                                  </span>
                                )}
                              </Stack>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="Subdued-Card-Section Warranty-Options">
                            <span className="Warranty-Options-Mobile">
                              {additionalOffers?.map((item) => {
                                return (
                                  <>
                                    {selectedAddtionalOffers[item?.id] && (
                                      <Card sectioned>
                                        <Checkbox
                                          label={
                                            <div className="Order-Product-Details">
                                              <Stack>
                                                <div className="Order-Product-Image-Section">
                                                  <div className="Order-Product-Image">
                                                    <img
                                                      src={item?.imageUrl}
                                                      alt={item?.title}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="Order-Product-Detail-Section">
                                                  <div className="Product-Title-Section">
                                                    <span className="Product-Title">
                                                      {item?.title}
                                                      <p className="Product-Extras">
                                                        {item?.description}
                                                      </p>
                                                    </span>
                                                    <p className="Product-Title">
                                                      {
                                                        userDetails?.currency_symbol
                                                      }
                                                      {item?.price &&
                                                        Number(
                                                          item?.price
                                                        ).toFixed(2)}
                                                    </p>
                                                  </div>
                                                </div>
                                              </Stack>
                                            </div>
                                          }
                                          checked={
                                            selectedAddtionalOffers[item?.id]
                                          }
                                          onChange={(e) =>
                                            handleAddtionalOffers(item?.id, e)
                                          }
                                        />
                                      </Card>
                                    )}
                                  </>
                                );
                              })}
                            </span>

                            <span className="Warranty-Options-Desktop">
                              <ExtraOffers />
                            </span>
                          </div>

                          <div className="Order-Total-Section">
                            <p>{localizations?.OS_Total}</p>
                            <p>
                              <span className="Order-Price-Currency">
                                {userDetails?.currency_symbol}
                              </span>
                              <span className="Order-Price">
                                {getPriceCalculate("total")}
                              </span>
                              {convertNumberToBoolean(
                                customization?.showCountryCurrency
                              ) &&
                                userDetails?.currency !=
                                  currencyConversion.currency &&
                                shippingDetails?.country && (
                                  <span className="Order-Price-Currency">
                                    {`(~ ${currencyConversion?.currency}
                                                                        ${(
                                                                          Number(
                                                                            getPriceCalculate(
                                                                              "total"
                                                                            )
                                                                          ) *
                                                                          currencyConversion?.rate
                                                                        ).toFixed(
                                                                          2
                                                                        )})`}
                                  </span>
                                )}
                            </p>
                          </div>
                        </span>
                      )}
                    </Card>
                  </span>
                </div>

                <div className="Product-Offers-Mobile">
                  <h1 className="Checikfy-Heading">
                    {localizations?.PO_ProductOptions}
                  </h1>

                  <div className="Subdued-Card-Section Warranty-Options">
                    <ExtraOffers />
                  </div>
                </div>

                {convertNumberToBoolean(customization?.showDiscountMobile) && (
                  <div className="Discount-Mobile">
                    {!convertNumberToBoolean(customization?.hideDiscount) && (
                      <h1 className="Checikfy-Heading">
                        {localizations?.OS_DiscountCode}
                      </h1>
                    )}
                    <Card sectioned>
                      {DiscountCode(
                        discountCode,
                        handleDiscountCode,
                        discountCodeInvalid,
                        discountBtnDisabled,
                        btnLoading,
                        removeDiscountTag,
                        applyDiscount,
                        localizations
                      )}
                    </Card>
                  </div>
                )}

                <div className="Payment-Section">
                  {!convertNumberToBoolean(customization?.hidePayment) && (
                    <h1 className="Checikfy-Heading">
                      {localizations?.PM_PaymentMethod}
                    </h1>
                  )}

                  <Card sectioned subdued={!paymentMethods?.length}>
                    {paymentMethods?.length > 0 ? (
                      <Stack vertical>
                        {cash != null && (
                          <div className="Payment-Option-Cash">
                            <RadioButton
                              label={localizations?.COD_CashOnDelivery}
                              checked={paymentOptionsValue === "cash"}
                              id="cash"
                              name="cash"
                              onChange={handlePaymentOptionsValue}
                            />

                            <span
                              className={`${
                                paymentOptionsValue === "cash"
                                  ? "Subdued-Card-Section"
                                  : "visually-hidden Subdued-Card-Section"
                              }`}
                            >
                              {paymentOptionCountry.cash ? (
                                <Card sectioned>
                                  <Text
                                    variant="headingSm"
                                    as="h6"
                                    alignment="center"
                                  >
                                    {localizations?.COD_RedirectInfo}
                                  </Text>
                                </Card>
                              ) : (
                                <PaymentMethodNotAvailable />
                              )}
                            </span>
                          </div>
                        )}

                        {stripe != null && (
                          <div className="Payment-Option-Card">
                            <RadioButton
                              label={localizations?.PM_PaymentDetails}
                              checked={paymentOptionsValue === "stripe"}
                              id="stripe"
                              name="stripe"
                              onChange={handlePaymentOptionsValue}
                            />
                            <span
                              className={`${
                                paymentOptionsValue === "stripe"
                                  ? " "
                                  : "visually-hidden"
                              }`}
                            >
                              {paymentOptionCountry.stripe ? (
                                <div className="Stripe-Elements">
                                  {secretLoading ? (
                                    <PaymentLoader />
                                  ) : clientSecretError ? (
                                    <StripePaymentMethodError />
                                  ) : (
                                    clientSecret && (
                                      <Elements
                                        options={options}
                                        stripe={stripePromise}
                                      >
                                        <CheckoutForm
                                          setBtnLoading={setBtnLoading}
                                          API_URL={API_URL}
                                          localizations={localizations}
                                          accordion={convertNumberToBoolean(
                                            customization?.stripeType
                                          )}
                                        />
                                      </Elements>
                                    )
                                  )}
                                </div>
                              ) : (
                                <PaymentMethodNotAvailable />
                              )}
                            </span>

                            {/* <span className={`${paymentOptionsValue === 'stripe' ? ' ' : 'visually-hidden'}`}>
                                                            <div className='Stripe-Elements'>
                                                                <Elements stripe={stripePromise}>
                                                                    <ElementsConsumer>{({ elements, stripe }) => (
                                                                        <form onSubmit={(e) => handleStripeSubmit(e, elements, stripe)}>
                                                                            <CardElement options={cardStyle} />

                                                                            <button type="submit" hidden disabled={!stripe} id='stripePayBtn'>
                                                                                Pay
                                                                            </button>
                                                                        </form>
                                                                    )}
                                                                    </ElementsConsumer>
                                                                </Elements>
                                                            </div>
                                                        </span>  */}
                          </div>
                        )}

                        {paypal != null && (
                          <div className="Payment-Option-Paypal">
                            <RadioButton
                              label={
                                <span className="Payment-Options-Paypal-Label">
                                  {localizations?.PP_PayPal}
                                  <img src={paypalFullLogo} alt="paypal" />
                                </span>
                              }
                              checked={paymentOptionsValue === "paypal"}
                              id="paypal"
                              name="paypal"
                              onChange={handlePaymentOptionsValue}
                            />

                            <span
                              className={`${
                                paymentOptionsValue === "paypal"
                                  ? "Subdued-Card-Section"
                                  : "visually-hidden Subdued-Card-Section"
                              }`}
                            >
                              {paymentOptionCountry.paypal ? (
                                <Card sectioned>
                                  <img
                                    src={paypalRedirect}
                                    alt="Paypal Redirect"
                                  />
                                  <Text
                                    variant="headingSm"
                                    as="h6"
                                    alignment="center"
                                  >
                                    {localizations?.PP_PayPalTerms}
                                  </Text>
                                </Card>
                              ) : (
                                <PaymentMethodNotAvailable />
                              )}
                            </span>
                          </div>
                        )}

                        {square != null && (
                          <div className="Payment-Option-Sqaure Payment-Option-Card">
                            <RadioButton
                              label="Square"
                              checked={paymentOptionsValue === "square"}
                              id="square"
                              name="square"
                              onChange={handlePaymentOptionsValue}
                            />

                            <span
                              className={`${
                                paymentOptionsValue === "square"
                                  ? "Subdued-Card-Section"
                                  : "visually-hidden Subdued-Card-Section"
                              }`}
                            >
                              {paymentOptionCountry.square ? (
                                <PaymentForm
                                  applicationId={square?.applicationId}
                                  cardTokenizeResponseReceived={async (
                                    token,
                                    verifiedBuyer
                                  ) => {
                                    squarePaymentSubmit(token.token);
                                  }}
                                  locationId={square?.publicKey}
                                  createPaymentRequest={() => ({
                                    countryCode: shopDetails?.country_code,
                                    currencyCode: userDetails?.currency,
                                    total: {
                                      amount: getPriceCalculate("total"),
                                      label: "Total",
                                    },
                                    pickupContact: {
                                      addressLines: shopDetails?.address1,
                                      city: shopDetails?.city,
                                      countryCode: shopDetails?.country_code,
                                      email: shopDetails?.customer_email,
                                      familyName: shopDetails?.shop_owner,
                                      givenName: shopDetails?.shop_owner,
                                      phone: shopDetails?.phone,
                                      postalCode: shopDetails?.zip,
                                      state: shopDetails?.province_code,
                                    },
                                    shippingContact: {
                                      addressLines: shopDetails?.address1,
                                      city: shopDetails?.city,
                                      countryCode: shopDetails?.country_code,
                                      email: shopDetails?.customer_email,
                                      familyName: shopDetails?.shop_owner,
                                      givenName: shopDetails?.shop_owner,
                                      phone: shopDetails?.phone,
                                      postalCode: shopDetails?.zip,
                                      state: shopDetails?.province_code,
                                    },
                                  })}
                                >
                                  <Tabs
                                    tabs={squarePaymentTabs}
                                    selected={squarePaymentSelectedTab}
                                    onSelect={handleSqaurePaymentTabChange}
                                    fitted
                                    disclosureText="More"
                                  >
                                    {(() => {
                                      switch (squarePaymentSelectedTab) {
                                        case 0:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_card ? (
                                                <CreditCard
                                                  includeInputLabels
                                                  buttonProps={{
                                                    // isLoading: true,
                                                    css: {
                                                      backgroundColor:
                                                        customization?.buttonsColor,
                                                      fontSize: "15px",
                                                      color: "#fff",
                                                      "&:hover": {
                                                        backgroundColor:
                                                          customization?.buttonsColor,
                                                        opacity: 0.7,
                                                      },

                                                      "&:disabled": {
                                                        "&:hover": {
                                                          backgroundColor:
                                                            "rgba(0, 0, 0, 0.05)",
                                                          opacity: 1,
                                                        },
                                                      },
                                                    },
                                                  }}
                                                >
                                                  Complete Purchase
                                                </CreditCard>
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );
                                        case 1:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_gift_card ? (
                                                <GiftCard />
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );
                                        case 2:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_google_pay ? (
                                                <span>
                                                  <GooglePay />
                                                  <PaymentMethodInfo
                                                    name="GPay selected"
                                                    logo={gpayLogo}
                                                  />
                                                </span>
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );
                                        case 3:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_ach ? (
                                                <span>
                                                  <Ach
                                                    accountHolderName="john"
                                                    redirectURI="https:example.com"
                                                    transactionId="124"
                                                  />
                                                  <PaymentMethodInfo
                                                    name="ACH selected"
                                                    logo={achLogo}
                                                  />
                                                </span>
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );
                                        case 4:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_after_pay ? (
                                                <span>
                                                  <Afterpay />
                                                  <PaymentMethodInfo
                                                    name="After Pay selected"
                                                    logo={afterPay}
                                                  />
                                                </span>
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );
                                        case 5:
                                          return (
                                            <div className="">
                                              {squarePaymentMethods.square_apple_pay ? (
                                                // <span>
                                                //     <ApplePay />
                                                //     <PaymentMethodInfo
                                                //         name='After Pay selected'
                                                //         logo={afterPay}
                                                //     />
                                                // </span>
                                                <PaymentMethodMissing />
                                              ) : (
                                                <PaymentMethodMissing />
                                              )}
                                            </div>
                                          );

                                        default:
                                          break;
                                      }
                                    })()}
                                  </Tabs>
                                </PaymentForm>
                              ) : (
                                <PaymentMethodNotAvailable />
                              )}
                            </span>
                          </div>
                        )}

                        {paymentOptionsValue == "cash" ? (
                          <Button
                            onClick={handlePaymentSubmit}
                            loading={btnLoading["paymentSubmitBtn"]}
                            disabled={
                              toggleGetTax ||
                              !shippingRates?.length ||
                              !lineItems?.length ||
                              toggleFormDataSubmit ||
                              !paymentOptionCountry.cash
                            }
                          >
                            {localizations?.PM_CompletePurchase}
                          </Button>
                        ) : (
                          ""
                        )}

                        {paymentOptionsValue == "paypal" ? (
                          <Button
                            onClick={handlePaymentSubmit}
                            loading={btnLoading["paypalPaymentSubmitBtn"]}
                            disabled={
                              toggleGetTax ||
                              !shippingRates?.length ||
                              !lineItems?.length ||
                              toggleFormDataSubmit ||
                              !paymentOptionCountry.paypal
                            }
                          >
                            {localizations?.PM_CompletePurchase}
                          </Button>
                        ) : (
                          ""
                        )}

                        {paymentOptionsValue == "stripe" ? (
                          <Button
                            onClick={handlePaymentSubmit}
                            loading={btnLoading["paymentSubmitBtn"]}
                            disabled={
                              toggleGetTax ||
                              !shippingRates?.length ||
                              clientSecretError ||
                              !lineItems?.length ||
                              toggleFormDataSubmit ||
                              !clientSecret ||
                              stripeIntentLoading ||
                              !paymentOptionCountry.stripe
                            }
                          >
                            {localizations?.PM_CompletePurchase}
                          </Button>
                        ) : (
                          ""
                        )}

                        {paymentOptionsValue == "square" ? (
                          <Button
                            onClick={handleSqaurePayment}
                            loading={btnLoading["paymentSubmitBtn"]}
                            disabled={
                              checkSquarePaymentActive() ||
                              toggleGetTax ||
                              !shippingRates?.length ||
                              !lineItems?.length ||
                              toggleFormDataSubmit ||
                              !paymentOptionCountry.square
                            }
                          >
                            {localizations?.PM_CompletePurchase}
                          </Button>
                        ) : (
                          ""
                        )}
                      </Stack>
                    ) : (
                      <span className="No-Payment-Method">
                        <div>
                          <Text variant="headingSm" as="h6" alignment="center">
                            {localizations?.PM_NoPaymentMethodsTitle}
                          </Text>
                          <Text
                            variant="bodyMd"
                            as="p"
                            alignment="center"
                            color="subdued"
                          >
                            {localizations?.PM_NoPaymentMethodsSubtitle}
                          </Text>
                        </div>
                      </span>
                    )}
                  </Card>

                  <div className="Payment-Section-Footer">
                    {paymentMethods?.length > 0 ? (
                      <div className="Payment-Footer-Left">
                        <img src={lock} alt="lock" />
                        <span>{localizations?.PM_TransactionSecured}</span>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {!convertNumberToBoolean(userDetails?.checkifyBranding) && (
                      <div className="Payment-Footer-Right">
                        <span>©️ </span>
                        <img src={chekifyLogo} alt="checkify" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="Test-Section-Mobile">
                  <AboutUsSection />
                </div>
              </Layout.Section>
            </Layout>
          </Page>

          {btnLoading["paymentSubmitBtn"] && (
            <div className="Payment-Processing">
              <PaymentLoader />
              <p> {localizations?.PM_OrderProcessing}</p>
            </div>
          )}
        </div>
      )}
      {toastErrorMsg}
    </>
  );
}

function DiscountCode(
  discountCode,
  handleDiscountCode,
  discountCodeInvalid,
  discountBtnDisabled,
  btnLoading,
  removeDiscountTag,
  applyDiscount,
  localizations
) {
  return (
    <div className="Discount-Input-Section">
      <div className="Discount-Input-Section-Inner Discount-Input-Invalid">
        <div className="Discount-Input">
          <TextField
            type="text"
            placeholder={localizations?.OS_DiscountCode}
            value={discountCode}
            onChange={handleDiscountCode}
            autoComplete="off"
            verticalContent={
              discountBtnDisabled && (
                <Tag onRemove={removeDiscountTag}>{discountCode}</Tag>
              )
            }
            error={discountCodeInvalid && localizations?.VE_DiscountCodeInvalid}
          />
        </div>

        <Button
          onClick={applyDiscount}
          disabled={!discountCode || discountBtnDisabled}
          loading={btnLoading["discountBtn"]}
        >
          {localizations?.OS_ApplyCode}
        </Button>
      </div>
    </div>
  );
}

// function ProductWarrantyOption1(oneYearwarranty, handleOneYearWarraty) {
//     return (
//         <>
//             <Checkbox
//                 label={
//                     <div className='Order-Product-Details'>
//                         <Stack>
//                             <div className='Order-Product-Image-Section'>
//                                 <div className='Order-Product-Image'>
//                                     <img src="https://cdn.shopify.com/s/files/1/0516/2831/0707/files/Extended-Warranty-1year-widcare.png?v=1660557379&width=100" alt="product" />
//                                 </div>
//                             </div>
//                             <div className='Order-Product-Detail-Section'>
//                                 <div className='Product-Title-Section'>
//                                     <span className='Product-Title'>
//                                         1 Year Extended Warranty
//                                         <p className='Product-Extras'>This limited warranty applies to any repair or replacement item.</p>
//                                     </span>
//                                     <p className='Product-Title'>€4.99</p>
//                                 </div>

//                             </div>
//                         </Stack>
//                     </div>
//                 }
//                 checked={oneYearwarranty}
//                 onChange={handleOneYearWarraty}
//             />
//         </>
//     )
// }

function ProductWarrantyOption2(buy1Get1warranty, handleBuy1Get1warranty) {
  return (
    <>
      <Checkbox
        label={
          <div className="Order-Product-Details">
            <Stack>
              <div className="Order-Product-Image-Section">
                <div className="Order-Product-Image">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0516/2831/0707/products/14-1.jpg?v=1665588654&width=40&width=100"
                    alt="product"
                  />
                </div>
              </div>
              <div className="Order-Product-Detail-Section">
                <div className="Product-Title-Section">
                  <span className="Product-Title">
                    Buy 1 Get 2 - Aglaonema Plant
                    <p className="Product-Extras">Special offer for you</p>
                  </span>
                  <p className="Product-Title">Free</p>
                </div>
              </div>
            </Stack>
          </div>
        }
        checked={buy1Get1warranty}
        onChange={handleBuy1Get1warranty}
      />
    </>
  );
}
