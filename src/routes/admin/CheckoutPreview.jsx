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
// import chekifyLogo from "../../assets/checkout/chekifyLogo.svg";
import chekifyLogo from '../../assets/republic_checkout.png'
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

let cart_line_items = [
  {
    id: 7,
    user_id: null,
    shopify_id: "43981968539886",
    cart_id: "6",
    properties: null,
    quantity: "1",
    variant_id: "43981968539886",
    key: "43981968539886:da6785603473a07dc7ca73f7baa38b88",
    discounted_price: "12.00",
    discounts: null,
    gift_card: "0",
    grams: "0",
    line_price: "12.00",
    original_line_price: "12.00",
    original_price: "12.00",
    price: "12.00",
    product_id: "8001969946862",
    sku: "277 103.663500",
    taxable: "1",
    title: "1000ml Classic Refill Bubbles",
    total_discount: "0",
    vendor: "Flare Direct",
    discounted_price_set: null,
    line_price_set: null,
    original_line_price_set: null,
    price_set: null,
    total_discount_set: null,
    created_at: "2023-01-27T12:44:45.000000Z",
    updated_at: "2023-01-27T12:44:45.000000Z",
    product_images: [
      {
        id: 3,
        shopify_id: "38721615528174",
        shopify_product_id: "8001969946862",
        shopify_variant_id: null,
        position: "1",
        src: "https://cdn.shopify.com/s/files/1/0608/1983/3070/products/277_103.663500_-Extra_Classic_Refill18.png?v=1674566261",
        created_at: "2023-01-27T12:44:46.000000Z",
        updated_at: "2023-01-27T12:44:46.000000Z",
      },
    ],
    variant_image: null,
  },
];

export function CheckoutPreview() {
  const navigate = useNavigate();
  const API_URL = "https://app.checkoutrepublic.com";
  let defaultFavicon = "https://app.checkoutrepublic.com/fav-checkout.png";
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cartUuid, setCartUuid] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [shopDetails, setShopDetails] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState([]);
  const [customization, setCustomization] = useState([]);
  const [localizations, setLocalizations] = useState([]);
  const [policiesDetails, setPoliciesDetails] = useState([]);
  const [shippingRates, setShippingRates] = useState([]);
  const [shopifyShippingRates, setShopifyShippingRates] = useState([]);
  const [aboutUs, setaboutUs] = useState([]);
  const [additionalOffers, setAdditionalOffers] = useState([]);
  const [selectedAddtionalOffers, setSelectedAddtionalOffers] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [lineItems, setLineItems] = useState(cart_line_items);
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
  }

  useEffect(() => {
    if (!loading && countriesList?.length) {
      getCurrencyConversion(
        getCountryNameCode("code", shippingDetails.country),
        userDetails?.currency
      );

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
  }, [shippingDetails.country, countriesList, loading]);

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
    }
  };

  const handleBillingDetails = async (e) => {
    setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    setBillingFormErrors({ ...billingFormErrors, [e.target.name]: false });
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
    let discount = cartPrice.discount;
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
      const response = await axios.get("https://app.checkoutrepublic.com/api/geoip");
      // console.log('getCurrentCountry response: ', response.data);

      let country = "";
      if (countriesList?.find((obj) => obj.code == response.data[0]?.country)) {
        country = countriesList?.find(
          (obj) => obj.code == response.data[0]?.country
        );
        setShippingDetails({ ...shippingDetails, country: country?.id });
      }
    } catch (error) {
      console.warn("getCurrentCountry Api Error", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (countriesList) {
        getCurrentCountry();
      }
    }
  }, [loading, countriesList]);

  const getCartDetails = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/checkout/preview?storeName=${id}`
      );
      // console.log('getCartDetails response: ', response.data);

      setShopDetails(response.data?.shop?.body?.shop);
      setUserDetails(response.data?.user);
      setLocalizations(response.data?.localization);
      setCustomization(response.data?.customization);
      setPoliciesDetails(response.data?.policies);
      setaboutUs(response.data?.about_us);
      setAdditionalOffers(response.data?.additional_offers);
      setPaymentMethods(response.data?.payment_method);
      setCartSummary(response.data?.cart_summary);

      if (!response.data?.shop_shipping_zones?.errors) {
        setShopifyShippingRates(
          response.data?.shop_shipping_zones?.body?.shipping_zones
        );
      }

      setCartPrice({
        ...cartPrice,
        subTotal: response.data?.cart_summary?.price,
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

      let offers = {};
      response.data?.additional_offers?.map((item) => {
        offers = {
          ...offers,
          [item?.id]: convertNumberToBoolean(item?.selected),
        };
      });
      setSelectedAddtionalOffers(offers);

      if (convertNumberToBoolean(response.data?.customization?.transByDevice)) {
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

      if (response?.data?.stripe_instant) {
        setClientSecret(response?.data?.stripe_instant?.client_secret);
        setClientSecretError(false);
      } else {
        setClientSecretError(true);
      }

      setLoading(false);
    } catch (error) {
      console.warn("getCartDetails Api Error", error);
      setToastMsg("Invalid Token");
      setErrorToast(true);
      window.location.replace("https://app.checkoutrepublic.com/login");
    }
  };

  useEffect(() => {
    let id = location.search.replace("?storeName=", "");
    getCartDetails(id);
    setCartUuid(id);
    getCountriesList();
  }, []);

  const getTaxDetails = async (id) => {
    setToggleGetTax(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/checkout/preview?storeName=${id}&country_id=${shippingDetails.country}&state_id=${shippingDetails.state}`
      );
      // console.log('getTaxDetails response: ', response?.data);
      setToggleGetTax(false);

      if (convertNumberToBoolean(customization?.isNativeShippingRateEnable)) {
        let countryCode = "";
        let stateName = "";
        if (getCountryNameCode("code", shippingDetails.country)) {
          countryCode = getCountryNameCode("code", shippingDetails.country);
        }
        countriesList?.map((item) => {
          let state = item.states?.find(
            (obj) => obj.id == shippingDetails.state
          );
          if (state) {
            stateName = state.name;
          }
        });

        if (
          ShopifyShippingRatesCheck(
            shopifyShippingRates,
            cartSummary,
            countryCode,
            stateName
          )?.length > 0
        ) {
          setShippingRates(
            ShopifyShippingRatesCheck(
              shopifyShippingRates,
              cartSummary,
              countryCode,
              stateName
            )
          );
        } else {
          setShippingRates([]);
        }
      } else {
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

      if (response.data?.taxes != null) {
        setCartPrice({
          ...cartPrice,
          vat:
            response.data?.taxes?.value && Number(response.data?.taxes?.value),
          vatType: response.data?.taxes?.type,
        });
      } else {
        setCartPrice({
          ...cartPrice,
          vat: 0,
          vatType: "",
        });
      }
    } catch (error) {
      console.warn("getTaxDetails Api Error", error);
      setToastMsg("Server Error, Reload page");
      setErrorToast(true);
      setToggleGetTax(false);
    }
  };

  useEffect(() => {
    if (!loading && countriesList?.length) {
      getTaxDetails(cartUuid);
    }
  }, [shippingDetails.country, shippingDetails.state, loading, countriesList]);

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
  }, [customization]);

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

    setTimeout(() => {
      setCartPrice({
        ...cartPrice,
        discount: 1.0,
      });
      setDiscountBtnDisabled(true);
      setBtnLoading(false);
    }, 1000);
  };

  const paymentSubmit = async (e) => {
    e.preventDefault();

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

    setTimeout(() => {
      setBtnLoading(false);
      window.location.replace(`/preview/thank-you-page?storeName=${cartUuid}`);
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

    setTimeout(() => {
      if (token) {
        setBtnLoading(false);
        window.location.replace(
          `/preview/thank-you-page?storeName=${cartUuid}`
        );
      } else {
        setToastMsg(localizations?.VE_GeneralError);
        setErrorToast(true);
      }
    }, 4000);
  };

  const handleSqaurePayment = () => {
    if (handleFormErrors()) {
      if (squarePaymentSelectedTab == 0) {
        document.getElementById("rswp-card-button").click();
      } else if (squarePaymentSelectedTab == 1) {
        document.getElementById("rswp-gift-card-button").click();
      } else if (squarePaymentSelectedTab == 2) {
        document.getElementsByClassName("gpay-card-info-container")[0].click();
      } else if (squarePaymentSelectedTab == 3) {
        document.getElementsByClassName("c-laXeHc")[0].click();
      } else if (squarePaymentSelectedTab == 4) {
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

                  <Card sectioned>
                    <Checkbox
                      label={localizations?.M_MarketingAcceptance}
                      checked={signUpExclusive}
                      onChange={handleSignUpExclusive}
                    />
                  </Card>
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
                                  {clientSecretError ? (
                                    <StripePaymentMethodError />
                                  ) : (
                                    clientSecret && (
                                      <Elements
                                        options={options}
                                        stripe={stripePromise}
                                      >
                                        <CheckoutForm
                                          cartUuid={cartUuid}
                                          preview={true}
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
                              !clientSecret ||
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
                        <img src={chekifyLogo} alt="Checkout Republic" />
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
