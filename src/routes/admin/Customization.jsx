import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Layout,
  Button,
  ButtonGroup,
  Card,
  Icon,
  Tabs,
  Text,
  Form,
  FormLayout,
  TextContainer,
  PageActions,
  Stack,
  ResourceList,
  ResourceItem,
  Avatar,
  EmptyState,
  Toast,
  Modal,
  Sheet,
  Scrollable,
  Loading,
  Thumbnail,
  DropZone,
  EmptySearchResult,
} from "@shopify/polaris";
import { Link } from "react-router-dom";
import {
  ExternalMinor,
  DeleteMinor,
  EditMinor,
  MobileCancelMajor,
  NoteMinor,
  CancelMinor,
} from "@shopify/polaris-icons";
import axios from "axios";
import {
  SkeltonTabsLayoutSecondary,
  SkeltonTabsWithThumbnail,
  SkeltonPageForTable,
  getAccessToken,
  InputField,
  NotifyBanner,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";

export function Customization() {
  const { apiUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [imageError, setImageError] = useState(false);
  const [userDetails, setUserDetails] = useState();

  const [inducementsData, setInducementsData] = useState([]);
  const [inducementId, setInducementId] = useState();
  const [modalDeleteInducement, setModalDeleteInducement] = useState(false);
  const [inducementSheet, setInducementSheet] = useState(false);
  const [editInducementToggle, setEditInducementToggle] = useState(false);

  const [inducement, setInducement] = useState({
    title: "",
    description: "",
    imgUrl: "",
  });

  const [customizationSettings, setCustomizationSettings] = useState({
    buttonsColor: "#696EFF",
    accentColor: "#25D38A",
    errorColor: "#FF5A50",
    backgroundColor: "#FAFAFA",
    cardColor: "#FFFFFF",
    textColor: "#000000",
    motivatorTextColor: "#FF5A50",
    motivatorBackgroundColor: "#FFE7D1",

    fontText: "Roboto",
    fontBody: "Roboto",
    fontButton: "Roboto",

    leftImageUrl: "",
    rightImageUrl: "",
    favicons: "",

    logoUrl: "",
    returnsPolicyUrl: "",
    shippingPolicyUrl: "",
    privacyPolicyUrl: "",
    termsAndConditionsUrl: "",

    isNativeShippingRateEnable: true, //use default shopify shipping rates instead of checkify created rates
    isPhoneFieldHidden: true, //handle 2 bottom states, if one is true other will remian disabled
    isPhoneFieldRequired: false,
    isPhone: false,
    emailText: false,
    phoneText: false,

    hideDiscountMobile: false, //if this is true then (showDiscountMobile) state will show otherwise hidden
    showDiscountMobile: true,
    hideDiscountDesktop: false,

    transByIp: false,
    transByDevice: false,

    zipValidate: false,

    taxCharge: false,

    showCountryCurrency: false,

    emailOrderConfirm: false,
    customerInvite: false,
    acceptsMarketing: false,

    billing: false,
    defaultCollapsed: false,
    stripeType: false,

    showNativeCountry: false,
    displayTimer: false,
    isCustomTextBarShowed: false,
    hideShipping: false,
    hideShippingOption: false,
    hideBilling: false,
    hideSummary: false,
    hidePayment: false,
    hideProductOption: false,
    hideDiscount: false,

    showShippingOptions: false,
    hideBillingForm: false,
  });

  const [urlError, setUrlError] = useState({
    logoUrl: false,
    privacyPolicyUrl: false,
    returnsPolicyUrl: false,
    shippingPolicyUrl: false,
    termsAndConditionsUrl: false,
  });

  const [file, setFile] = useState();
  const [file2, setFile2] = useState();
  const [file3, setFile3] = useState();
  const [file4, setFile4] = useState();

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile((file) => acceptedFiles[0]),
    []
  );

  const handleDropZoneDrop2 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile2((file2) => acceptedFiles[0]),
    []
  );

  const handleDropZoneDrop3 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile3((file3) => acceptedFiles[0]),
    []
  );

  const handleDropZoneDrop4 = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFile4((file4) => acceptedFiles[0]),
    []
  );

  const handleRemoveImage = (type) => {
    if (type == "leftImageUrl") {
      setFile();
      setCustomizationSettings({ ...customizationSettings, [type]: null });
    } else if (type == "rightImageUrl") {
      setFile2();
      setCustomizationSettings({ ...customizationSettings, [type]: null });
    } else if (type == "favicons") {
      setFile3();
      setCustomizationSettings({ ...customizationSettings, [type]: null });
    } else if (type == "imgUrl") {
      setFile4();
      setInducement({ ...inducement, imgUrl: "" });
    }
  };

  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/svg",
  ];

  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toggleSuccessMsgActive = useCallback(
    () => setSucessToast((sucessToast) => !sucessToast),
    []
  );

  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const toastSuccessMsg = sucessToast ? (
    <Toast content={toastMsg} onDismiss={toggleSuccessMsgActive} />
  ) : null;

  const handleDeleteInducementModal = () => {
    setModalDeleteInducement(!modalDeleteInducement);
    setInducementId();
  };

  const handleInducementSheet = () => {
    setInducementSheet(!inducementSheet);
    setEditInducementToggle(false);
    setInducementId();
    setImageError(false);
    setFile4();
    setInducement({
      title: "",
      description: "",
      imgUrl: "",
    });
  };

  const handleDeleteInducement = (id) => {
    setInducementId(id);
    setModalDeleteInducement(true);
  };

  const handleInducement = (e) => {
    if (e.target.name == "imgUrl") {
      setImageError(false);
    }
    setInducement({ ...inducement, [e.target.name]: e.target.value });
  };

  const handleCustomizeSettings = (e) => {
    setCustomizationSettings({
      ...customizationSettings,
      [e.target.name]: e.target.value,
    });

    if (e.target.name == "logoUrl") {
      setUrlError({ ...urlError, logoUrl: false });
    } else if (e.target.name == "returnsPolicyUrl") {
      setUrlError({ ...urlError, returnsPolicyUrl: false });
    } else if (e.target.name == "privacyPolicyUrl") {
      setUrlError({ ...urlError, privacyPolicyUrl: false });
    } else if (e.target.name == "shippingPolicyUrl") {
      setUrlError({ ...urlError, shippingPolicyUrl: false });
    } else if (e.target.name == "termsAndConditionsUrl") {
      setUrlError({ ...urlError, termsAndConditionsUrl: false });
    }
  };

  const handleCustomizeSettingsCheckbox = (e) => {
    setCustomizationSettings({
      ...customizationSettings,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDesignReset = (value) => {
    if (value === "color") {
      setCustomizationSettings({
        ...customizationSettings,
        buttonsColor: "#696EFF",
        accentColor: "#25D38A",
        errorColor: "#FF5A50",
        backgroundColor: "#FAFAFA",
        cardColor: "#FFFFFF",
        textColor: "#000000",
        motivatorTextColor: "#FF5A50",
        motivatorBackgroundColor: "#FFE7D1",
      });
    } else if (value === "font") {
      setCustomizationSettings({
        ...customizationSettings,
        fontText: "Roboto",
        fontBody: "Roboto",
        fontButton: "Roboto",
      });
    } else if (value === "brand") {
      setCustomizationSettings({
        ...customizationSettings,
        leftImageUrl: null,
        rightImageUrl: null,
        favicons: null,
      });
    } else if (value === "links") {
      setCustomizationSettings({
        ...customizationSettings,
        logoUrl: "",
        returnsPolicyUrl: "",
        shippingPolicyUrl: "",
        privacyPolicyUrl: "",
        termsAndConditionsUrl: "",
      });

      setUrlError({
        logoUrl: false,
        privacyPolicyUrl: false,
        returnsPolicyUrl: false,
        shippingPolicyUrl: false,
        termsAndConditionsUrl: false,
      });
    }
  };

  const tabs = [
    {
      id: "1",
      content: "General Settings",
    },
    {
      id: "2",
      content: "Design Settings",
    },
    {
      id: "3",
      content: "Inducements",
    },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    setToggleLoadData(true);
  };

  const EmptyCard = ({ value }) => {
    return (
      <div className="Empty-State-Card">
        <Card sectioned>
          {value === "inducements" && (
            <EmptyState
              heading="You don't have any inducements yet"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Inducement — additional information to convince customers to
                make a purchase (reviews, satisfaction warranties, etc.) that is
                located at the bottom of the checkout page.
              </p>
              <Button primary onClick={handleInducementSheet}>
                Create Inducement
              </Button>
            </EmptyState>
          )}
        </Card>
      </div>
    );
  };

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

  function checkImageURL(url) {
    if (typeof url !== "string") return false;
    return (
      url.match(
        /^http[^\?]*.(jpeg|jpg|gif|png|svg|tiff|bmp|JPG|PNG|GIF|JPEG|SVG|TIFF|BMP)(\?(.*))?$/gim
      ) != null
    );
  }

  const getCustomizationSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/customization`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log('getGeneralSettings response: ', response.data.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setUserDetails(response?.data?.user);
        setCustomizationSettings({
          buttonsColor: response?.data?.data?.buttonsColor,
          accentColor: response?.data?.data?.accentColor,
          errorColor: response?.data?.data?.errorColor,
          backgroundColor: response?.data?.data?.backgroundColor,
          cardColor: response?.data?.data?.cardColor,
          textColor: response?.data?.data?.textColor,
          motivatorTextColor: response?.data?.data?.motivatorTextColor,
          motivatorBackgroundColor:
            response?.data?.data?.motivatorBackgroundColor,

          fontText: response?.data?.data?.fontText,
          fontBody: response?.data?.data?.fontBody,
          fontButton: response?.data?.data?.fontButton,

          leftImageUrl: response?.data?.data?.leftImageUrl,
          rightImageUrl: response?.data?.data?.rightImageUrl,
          favicons: response?.data?.data?.favicons,

          logoUrl: response?.data?.data?.logoUrl,
          returnsPolicyUrl: response?.data?.data?.returnsPolicyUrl,
          shippingPolicyUrl: response?.data?.data?.shippingPolicyUrl,
          privacyPolicyUrl: response?.data?.data?.privacyPolicyUrl,
          termsAndConditionsUrl: response?.data?.data?.termsAndConditionsUrl,

          isNativeShippingRateEnable: convertNumberToBoolean(
            response?.data?.data?.isNativeShippingRateEnable
          ),
          isPhoneFieldHidden: convertNumberToBoolean(
            response?.data?.data?.isPhoneFieldHidden
          ),
          isPhoneFieldRequired: convertNumberToBoolean(
            response?.data?.data?.isPhoneFieldRequired
          ),
          isPhone: convertNumberToBoolean(response?.data?.data?.isPhone),
          emailText: convertNumberToBoolean(response?.data?.data?.emailText),
          phoneText: convertNumberToBoolean(response?.data?.data?.phoneText),

          hideDiscountMobile: convertNumberToBoolean(
            response?.data?.data?.hideDiscountMobile
          ),
          showDiscountMobile: convertNumberToBoolean(
            response?.data?.data?.showDiscountMobile
          ),
          hideDiscountDesktop: convertNumberToBoolean(
            response?.data?.data?.hideDiscountDesktop
          ),

          transByIp: convertNumberToBoolean(response?.data?.data?.transByIp),
          transByDevice: convertNumberToBoolean(
            response?.data?.data?.transByDevice
          ),

          zipValidate: convertNumberToBoolean(
            response?.data?.data?.zipValidate
          ),

          taxCharge: convertNumberToBoolean(response?.data?.data?.taxCharge),

          showCountryCurrency: convertNumberToBoolean(
            response?.data?.data?.showCountryCurrency
          ),

          emailOrderConfirm: convertNumberToBoolean(
            response?.data?.data?.emailOrderConfirm
          ),
          customerInvite: convertNumberToBoolean(
            response?.data?.data?.customerInvite
          ),
          acceptsMarketing: convertNumberToBoolean(
            response?.data?.data?.acceptsMarketing
          ),

          billing: convertNumberToBoolean(response?.data?.data?.billing),
          defaultCollapsed: convertNumberToBoolean(
            response?.data?.data?.defaultCollapsed
          ),
          stripeType: convertNumberToBoolean(response?.data?.data?.stripeType),

          showNativeCountry: convertNumberToBoolean(
            response?.data?.data?.showNativeCountry
          ),
          displayTimer: convertNumberToBoolean(
            response?.data?.data?.displayTimer
          ),
          isCustomTextBarShowed: convertNumberToBoolean(
            response?.data?.data?.isCustomTextBarShowed
          ),
          hideShipping: convertNumberToBoolean(
            response?.data?.data?.hideShipping
          ),
          hideShippingOption: convertNumberToBoolean(
            response?.data?.data?.hideShippingOption
          ),
          hideBilling: convertNumberToBoolean(
            response?.data?.data?.hideBilling
          ),
          hideSummary: convertNumberToBoolean(
            response?.data?.data?.hideSummary
          ),
          hidePayment: convertNumberToBoolean(
            response?.data?.data?.hidePayment
          ),
          hideProductOption: convertNumberToBoolean(
            response?.data?.data?.hideProductOption
          ),
          hideDiscount: convertNumberToBoolean(
            response?.data?.data?.hideDiscount
          ),

          showShippingOptions: convertNumberToBoolean(
            response?.data?.data?.showShippingOptions
          ),
          hideBillingForm: convertNumberToBoolean(
            response?.data?.data?.hideBillingForm
          ),
        });

        setToggleLoadData(false);
        setLoading(false);
      }
    } catch (error) {
      console.warn("getGeneralSettings Api Error", error.response);
      setToggleLoadData(false);
      setLoading(false);
      if (error.response?.status == 401) {
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
      } else {
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
      }
    }
  };

  function checkHttpUrl(string) {
    let givenURL;
    try {
      givenURL = new URL(string);
    } catch (error) {
      return false;
    }
    return givenURL.protocol === "http:" || givenURL.protocol === "https:";
  }

  function validateUrl() {
    let valid = true;
    let logoUrl = false;
    let returnsPolicyUrl = false;
    let privacyPolicyUrl = false;
    let shippingPolicyUrl = false;
    let termsAndConditionsUrl = false;
    if (customizationSettings.logoUrl) {
      if (!checkHttpUrl(customizationSettings.logoUrl)) {
        valid = false;
        logoUrl = true;
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
    if (customizationSettings.returnsPolicyUrl) {
      if (!checkHttpUrl(customizationSettings.returnsPolicyUrl)) {
        valid = false;
        returnsPolicyUrl = true;
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
    if (customizationSettings.privacyPolicyUrl) {
      if (!checkHttpUrl(customizationSettings.privacyPolicyUrl)) {
        valid = false;
        privacyPolicyUrl = true;
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
    if (customizationSettings.shippingPolicyUrl) {
      if (!checkHttpUrl(customizationSettings.shippingPolicyUrl)) {
        valid = false;
        shippingPolicyUrl = true;
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
    if (customizationSettings.termsAndConditionsUrl) {
      if (!checkHttpUrl(customizationSettings.termsAndConditionsUrl)) {
        valid = false;
        termsAndConditionsUrl = true;
        window.scrollTo(0, document.body.scrollHeight);
      }
    }

    setUrlError({
      logoUrl: logoUrl,
      privacyPolicyUrl: privacyPolicyUrl,
      returnsPolicyUrl: returnsPolicyUrl,
      shippingPolicyUrl: shippingPolicyUrl,
      termsAndConditionsUrl: termsAndConditionsUrl,
    });

    return valid;
  }

  const submitCustomizationSettings = async () => {
    // if (validateUrl()) {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[1]) {
        toggleId = { [1]: false };
      } else {
        toggleId = { [1]: true };
      }
      return { ...toggleId };
    });

    const formData = new FormData();
    formData.append("buttonsColor", customizationSettings?.buttonsColor);
    formData.append("accentColor", customizationSettings.accentColor);
    formData.append("errorColor", customizationSettings.errorColor);
    formData.append("backgroundColor", customizationSettings.backgroundColor);
    formData.append("cardColor", customizationSettings.cardColor);
    formData.append("textColor", customizationSettings.textColor);
    formData.append(
      "motivatorTextColor",
      customizationSettings.motivatorTextColor
    );
    formData.append(
      "motivatorBackgroundColor",
      customizationSettings.motivatorBackgroundColor
    );

    formData.append("fontText", customizationSettings.fontText);
    formData.append("fontBody", customizationSettings.fontBody);
    formData.append("fontButton", customizationSettings.fontButton);

    formData.append(
      "leftImageUrl",
      file ? file : customizationSettings.leftImageUrl
    );
    formData.append(
      "rightImageUrl",
      file2 ? file2 : customizationSettings.rightImageUrl
    );
    formData.append("favicons", file3 ? file3 : customizationSettings.favicons);

    formData.append(
      "logoUrl",
      customizationSettings.logoUrl ? customizationSettings.logoUrl : ""
    );
    formData.append(
      "returnsPolicyUrl",
      customizationSettings.returnsPolicyUrl
        ? customizationSettings.returnsPolicyUrl
        : ""
    );
    formData.append(
      "shippingPolicyUrl",
      customizationSettings.shippingPolicyUrl
        ? customizationSettings.shippingPolicyUrl
        : ""
    );
    formData.append(
      "privacyPolicyUrl",
      customizationSettings.privacyPolicyUrl
        ? customizationSettings.privacyPolicyUrl
        : ""
    );
    formData.append(
      "termsAndConditionsUrl",
      customizationSettings.termsAndConditionsUrl
        ? customizationSettings.termsAndConditionsUrl
        : ""
    );

    formData.append(
      "isNativeShippingRateEnable",
      convertBooleanToNumber(customizationSettings.isNativeShippingRateEnable)
    );
    formData.append(
      "isPhoneFieldHidden",
      convertBooleanToNumber(customizationSettings.isPhoneFieldHidden)
    );
    formData.append(
      "isPhoneFieldRequired",
      convertBooleanToNumber(customizationSettings.isPhoneFieldRequired)
    );
    formData.append(
      "isPhone",
      convertBooleanToNumber(customizationSettings.isPhone)
    );
    formData.append(
      "emailText",
      convertBooleanToNumber(customizationSettings.emailText)
    );
    formData.append(
      "phoneText",
      convertBooleanToNumber(customizationSettings.phoneText)
    );

    formData.append(
      "hideDiscountMobile",
      convertBooleanToNumber(customizationSettings.hideDiscountMobile)
    );
    formData.append(
      "showDiscountMobile",
      convertBooleanToNumber(customizationSettings.showDiscountMobile)
    );
    formData.append(
      "hideDiscountDesktop",
      convertBooleanToNumber(customizationSettings.hideDiscountDesktop)
    );

    formData.append(
      "transByIp",
      convertBooleanToNumber(customizationSettings.transByIp)
    );
    formData.append(
      "transByDevice",
      convertBooleanToNumber(customizationSettings.transByDevice)
    );

    formData.append(
      "zipValidate",
      convertBooleanToNumber(customizationSettings.zipValidate)
    );

    formData.append(
      "taxCharge",
      convertBooleanToNumber(customizationSettings.taxCharge)
    );

    formData.append(
      "showCountryCurrency",
      convertBooleanToNumber(customizationSettings.showCountryCurrency)
    );

    formData.append(
      "emailOrderConfirm",
      convertBooleanToNumber(customizationSettings.emailOrderConfirm)
    );
    formData.append(
      "customerInvite",
      convertBooleanToNumber(customizationSettings.customerInvite)
    );
    formData.append(
      "acceptsMarketing",
      convertBooleanToNumber(customizationSettings.acceptsMarketing)
    );

    formData.append(
      "billing",
      convertBooleanToNumber(customizationSettings.billing)
    );
    formData.append(
      "defaultCollapsed",
      convertBooleanToNumber(customizationSettings.defaultCollapsed)
    );
    formData.append(
      "stripeType",
      convertBooleanToNumber(customizationSettings.stripeType)
    );

    formData.append(
      "showNativeCountry",
      convertBooleanToNumber(customizationSettings.showNativeCountry)
    );
    formData.append(
      "displayTimer",
      convertBooleanToNumber(customizationSettings.displayTimer)
    );
    formData.append(
      "isCustomTextBarShowed",
      convertBooleanToNumber(customizationSettings.isCustomTextBarShowed)
    );
    formData.append(
      "hideShipping",
      convertBooleanToNumber(customizationSettings.hideShipping)
    );
    formData.append(
      "hideShippingOption",
      convertBooleanToNumber(customizationSettings.hideShippingOption)
    );
    formData.append(
      "hideBilling",
      convertBooleanToNumber(customizationSettings.hideBilling)
    );
    formData.append(
      "hideSummary",
      convertBooleanToNumber(customizationSettings.hideSummary)
    );
    formData.append(
      "hidePayment",
      convertBooleanToNumber(customizationSettings.hidePayment)
    );
    formData.append(
      "hideProductOption",
      convertBooleanToNumber(customizationSettings.hideProductOption)
    );
    formData.append(
      "hideDiscount",
      convertBooleanToNumber(customizationSettings.hideDiscount)
    );

    formData.append(
      "showShippingOptions",
      convertBooleanToNumber(customizationSettings.showShippingOptions)
    );
    formData.append(
      "hideBillingForm",
      convertBooleanToNumber(customizationSettings.hideBillingForm)
    );

    try {
      const response = await axios.post(
        `${apiUrl}/api/customization/update?_method=PUT`,
        formData,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('customization update response: ', response.data);
      setBtnLoading(false);
      setToggleLoadData(true);
    } catch (error) {
      console.warn("customization update  Error", error.response);
      setBtnLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const getInducements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/customization/about-us`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log('getInducements response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setInducementsData(response.data.data);
        setLoading(false);
        setToggleLoadData(false);
      }
    } catch (error) {
      console.warn("getInducements Api Error", error.response);
      setToggleLoadData(false);
      setLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const deleteInducement = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[2]) {
        toggleId = { [2]: false };
      } else {
        toggleId = { [2]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.delete(
        `${apiUrl}/api/customization/about-us/${inducementId}/delete`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('deleteInducement response: ', response.data);
      setBtnLoading(false);
      setToastMsg("Inducement Deleted");
      setSucessToast(true);
      handleDeleteInducementModal();
      setToggleLoadData(true);
    } catch (error) {
      console.warn("deleteInducement Api Error", error.response);
      setBtnLoading(false);
      handleDeleteInducementModal();
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const createInducement = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", inducement.title);
    formData.append("description", inducement.description);
    formData.append("imgUrl", file4 ? file4 : inducement.imgUrl);

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
      const response = await axios.post(
        `${apiUrl}/api/customization/about-us/store`,
        formData,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('createInducement response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        handleInducementSheet();
        setToastMsg("Inducement Created Sucessfully");
        setSucessToast(true);
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("createInducement Api Error", error.response);
      if (error.response?.status == 422) {
        setToastMsg("Image field is required");
        setErrorToast(true);
      } else if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
    }
  };

  const editInducement = async (id) => {
    setResourceLoading(true);
    setBtnLoading((prev) => {
      let toggleId;
      if (prev[id]) {
        toggleId = { [id]: false };
      } else {
        toggleId = { [id]: true };
      }
      return { ...toggleId };
    });

    try {
      const response = await axios.get(
        `${apiUrl}/api/customization/about-us/${id}/edit`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('editInducement response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setInducement({
          title: response?.data?.data?.title,
          description: response?.data?.data?.description,
          imgUrl: response?.data?.data?.imgUrl,
        });
        setInducementId(id);
        setEditInducementToggle(true);
        setInducementSheet(true);
      }
      setBtnLoading(false);
      setResourceLoading(false);
    } catch (error) {
      console.warn("editInducement Api Error", error.response);
      setBtnLoading(false);
      setResourceLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const updateInducement = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", inducement.title);
    formData.append("description", inducement.description);
    formData.append("imgUrl", file4 ? file4 : inducement.imgUrl);

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
      const response = await axios.post(
        `${apiUrl}/api/customization/about-us/${inducementId}/update?_method=PUT`,
        formData,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('updateInducement response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        handleInducementSheet();
        setEditInducementToggle(false);
        setToastMsg("Inducement Updated Sucessfully");
        setSucessToast(true);
        setToggleLoadData(true);
      }
      setBtnLoading(false);
    } catch (error) {
      console.warn("updateInducement Api Error", error.response);
      if (error.response?.status == 422) {
        setToastMsg("Image field is required");
        setErrorToast(true);
      } else if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
    }
  };

  useEffect(() => {
    if (toggleLoadData) {
      switch (selectedTab) {
        case 0:
          getCustomizationSettings();
          break;

        case 1:
          getCustomizationSettings();
          break;

        case 2:
          getInducements();
          break;

        default:
          setSelectedTab(0);
          getCustomizationSettings();
          break;
      }
    }
  }, [toggleLoadData]);

  return (
    <div className="Customization-Page">
      <Modal
        small
        open={modalDeleteInducement}
        onClose={handleDeleteInducementModal}
        title="Delete inducement?"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading[2],
          onAction: deleteInducement,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleDeleteInducementModal,
          },
        ]}
      >
        <Modal.Section>
          <TextContainer>
            <p>Are you sure? This action can not be undone.</p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      <Sheet
        open={inducementSheet}
        onClose={handleInducementSheet}
        accessibilityLabel="Add Inducement"
      >
        <Form
          onSubmit={editInducementToggle ? updateInducement : createInducement}
        >
          <div className="Sheet-Container">
            <div className="Sheet-Header">
              <Text variant="headingMd" as="h2">
                {editInducementToggle ? "Edit Inducement " : "Add Inducement "}
              </Text>
              <Button
                accessibilityLabel="Cancel"
                icon={MobileCancelMajor}
                onClick={handleInducementSheet}
                plain
              />
            </div>

            <Scrollable className="Sheet-Scrollable">
              <FormLayout>
                <InputField
                  type="text"
                  label="Inducement title"
                  name="title"
                  value={inducement.title}
                  onChange={handleInducement}
                  autoComplete="off"
                  required
                  placeholder="Enter Inducement title"
                />

                <InputField
                  type="text"
                  label="Inducement description"
                  name="description"
                  value={inducement.description}
                  onChange={handleInducement}
                  autoComplete="off"
                  required
                  placeholder="Enter Inducement Description"
                />

                {/* <InputField
                  type="text"
                  label="Inducement image"
                  name='imgUrl'
                  value={inducement.imgUrl}
                  onChange={handleInducement}
                  autoComplete="off"
                  required
                  error={imageError && 'Invalid URL'}
                  placeholder='Enter Inducement Image Url'
                /> */}

                <div style={{ width: 114, height: 114 }}>
                  <DropZone
                    allowMultiple={false}
                    onDrop={handleDropZoneDrop4}
                    accept="image/*"
                    type="image"
                  >
                    {(!inducement.imgUrl || inducement.imgUrl == "null") &&
                      !file4 && (
                        <DropZone.FileUpload actionTitle={"Add Image"} />
                      )}
                    {inducement.imgUrl &&
                      inducement.imgUrl != "null" &&
                      !file4 && (
                        <span>
                          <Thumbnail
                            size="large"
                            alt={"header-img"}
                            source={inducement.imgUrl}
                          />
                        </span>
                      )}
                    {file4 && (
                      <span>
                        <Thumbnail
                          size="large"
                          alt={file4.name}
                          source={
                            validImageTypes.includes(file4.type)
                              ? window.URL.createObjectURL(file4)
                              : NoteMinor
                          }
                        />
                      </span>
                    )}
                  </DropZone>
                </div>

                {(inducement.imgUrl && inducement.imgUrl != "null") || file4 ? (
                  <span className="Image-Remove">
                    <Button plain onClick={() => handleRemoveImage("imgUrl")}>
                      Remove
                    </Button>
                  </span>
                ) : (
                  ""
                )}
              </FormLayout>
            </Scrollable>

            <div className="Sheet-Footer">
              <Button onClick={handleInducementSheet}>Cancel</Button>
              <Button primary submit loading={btnLoading[3]}>
                {editInducementToggle
                  ? "Update Inducement "
                  : "Create Inducement "}
              </Button>
            </div>
          </div>
        </Form>
      </Sheet>
      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForTable />
        </span>
      ) : (
        <Page
          fullWidth
          title="Customization"
          secondaryActions={
            <ButtonGroup>
              <a
                href={`${apiUrl}/preview/thank-you-page?storeName=${userDetails?.shopifyShopDomainName}`}
                target="_blank"
              >
                <Button>
                  {" "}
                  Thank You Page preview <Icon source={ExternalMinor}></Icon>
                </Button>
              </a>
              <a
                href={`${apiUrl}/preview/checkout?storeName=${userDetails?.shopifyShopDomainName}`}
                target="_blank"
              >
                <Button>
                  Checkout preview <Icon source={ExternalMinor}></Icon>{" "}
                </Button>
              </a>
              {/* <a
                href="https://help.checkify.pro/en/articles/4367163-general-customization-settings"
                target="_blank"
              >
                <Button>
                  Explore the guide <Icon source={ExternalMinor}></Icon>
                </Button>
              </a> */}
            </ButtonGroup>
          }
        >
           <NotifyBanner/>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
            {loading ? (
              selectedTab == 2 ? (
                <span>
                  <SkeltonTabsWithThumbnail />
                </span>
              ) : (
                <span>
                  <SkeltonTabsLayoutSecondary />
                </span>
              )
            ) : (
              <>
                {(() => {
                  switch (selectedTab) {
                    case 0:
                      return (
                        <div className="Customization-Tab1">
                          <Layout>
                            <Layout.Section secondary>
                              <Text variant="headingMd" as="h6">
                                General Settings
                              </Text>

                              <Text variant="bodyMd" as="p">
                                Configure a few optional settings to make the
                                checkout process the right fit for your
                                business.
                              </Text>

                              <Text variant="bodyMd" as="p">
                                {`You can change the wording of all enabled motivators on the `}
                                <Link to="/admin/localization">
                                  Localization tab.
                                </Link>
                              </Text>
                            </Layout.Section>

                            <Layout.Section>
                              <div className="Customization-Save-Action">
                                <Text variant="headingMd" as="h6">
                                  Phone Number & Email Options
                                </Text>

                                <Button
                                  primary
                                  loading={btnLoading[1]}
                                  onClick={submitCustomizationSettings}
                                >
                                  {" "}
                                  Save Changes{" "}
                                </Button>
                              </div>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Add a “Phone number” field to the checkout
                                    (only for Default form)
                                  </p>
                                  <span>
                                    <input
                                      id="isPhoneFieldRequired"
                                      type="checkbox"
                                      name="isPhoneFieldRequired"
                                      className="tgl tgl-light"
                                      disabled={customizationSettings.isPhone}
                                      checked={
                                        customizationSettings.isPhoneFieldRequired
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="isPhoneFieldRequired"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    {" "}
                                    Add a “Phone number” field to the checkout
                                    and replace “Email” field (only for Default
                                    form)
                                  </p>
                                  <span>
                                    <input
                                      id="isPhone"
                                      type="checkbox"
                                      name="isPhone"
                                      className="tgl tgl-light"
                                      disabled={
                                        customizationSettings.isPhoneFieldRequired
                                      }
                                      checked={customizationSettings.isPhone}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="isPhone"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Add helper text below the “Email” field. It
                                    can be edited in Localization section
                                  </p>
                                  <span>
                                    <input
                                      id="emailText"
                                      type="checkbox"
                                      name="emailText"
                                      className="tgl tgl-light"
                                      checked={customizationSettings.emailText}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="emailText"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Add helper text below the “Phone” field. It
                                    can be edited in Localization section
                                  </p>
                                  <span>
                                    <input
                                      id="phoneText"
                                      type="checkbox"
                                      name="phoneText"
                                      className="tgl tgl-light"
                                      checked={customizationSettings.phoneText}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="phoneText"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Discount Input Fields
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Hide discount code field from the shopping
                                    card on mobile
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideDiscountMobile"
                                      name="hideDiscountMobile"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideDiscountMobile
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideDiscountMobile"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                {customizationSettings.hideDiscountMobile && (
                                  <Card.Section>
                                    <p>
                                      Display discount code field outside the
                                      shopping card on mobile
                                    </p>
                                    <span>
                                      <input
                                        type="checkbox"
                                        id="showDiscountMobile"
                                        name="showDiscountMobile"
                                        className="tgl tgl-light"
                                        checked={
                                          customizationSettings.showDiscountMobile
                                        }
                                        onChange={
                                          handleCustomizeSettingsCheckbox
                                        }
                                      />
                                      <label
                                        htmlFor="showDiscountMobile"
                                        className="tgl-btn"
                                      ></label>
                                    </span>
                                  </Card.Section>
                                )}

                                <Card.Section>
                                  <p>
                                    Hide discount code field from the shopping
                                    card on desktop
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideDiscountDesktop"
                                      name="hideDiscountDesktop"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideDiscountDesktop
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideDiscountDesktop"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Shipping Zone
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Use default shopify shipping rates on
                                    checkout page
                                    <br />
                                    (IMPORTANT: If this option is enabled then
                                      Checkout Republic shipping rates will not be apply on
                                    checkout page)
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="isNativeShippingRateEnable"
                                      name="isNativeShippingRateEnable"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.isNativeShippingRateEnable
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="isNativeShippingRateEnable"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Translation options - Select only one option
                                (Auto)
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>Translation by IP country</p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="transByIp"
                                      name="transByIp"
                                      className="tgl tgl-light"
                                      disabled={
                                        customizationSettings.transByDevice
                                      }
                                      checked={customizationSettings.transByIp}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="transByIp"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>Translation by browser language</p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="transByDevice"
                                      name="transByDevice"
                                      className="tgl tgl-light"
                                      disabled={customizationSettings.transByIp}
                                      checked={
                                        customizationSettings.transByDevice
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="transByDevice"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Address Validation Options (Auto)
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    ZIP code (Postal code) automatical
                                    validation
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="zipValidate"
                                      name="zipValidate"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.zipValidate
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="zipValidate"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                VAT/ TAX Options (Auto)
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Enable VAT/Sales Tax charge. You can add
                                    taxes to orders on checkout
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="taxCharge"
                                      name="taxCharge"
                                      className="tgl tgl-light"
                                      checked={customizationSettings.taxCharge}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="taxCharge"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Currency Conversion Function (Auto)
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Display of the total value of the order
                                    additionally in buyer's local currency. The
                                    conversion will take place automatically.
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="showCountryCurrency"
                                      name="showCountryCurrency"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.showCountryCurrency
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="showCountryCurrency"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              {/* <Text variant="headingMd" as="h6">
                              Shopify Settings
                            </Text> */}

                              {/* <Card >
                              <Card.Section>
                                <p>Send default order confirmation email</p>
                                <span>
                                  <input
                                    type="checkbox"
                                    id='emailOrderConfirm'
                                    name='emailOrderConfirm'
                                    className="tgl tgl-light"
                                    checked={customizationSettings.emailOrderConfirm}
                                    onChange={handleCustomizeSettingsCheckbox}
                                  />
                                  <label htmlFor='emailOrderConfirm' className='tgl-btn'></label>
                                </span>
                              </Card.Section>

                              <Card.Section>
                                <p>Creating a customer with send email invite to create account</p>
                                <span>
                                  <input
                                    type="checkbox"
                                    id='customerInvite'
                                    name='customerInvite'
                                    className="tgl tgl-light"
                                    checked={customizationSettings.customerInvite}
                                    onChange={handleCustomizeSettingsCheckbox}
                                  />
                                  <label htmlFor='customerInvite' className='tgl-btn'></label>
                                </span>
                              </Card.Section>

                              <Card.Section>
                                <p>Preselect the email/sms marketing opt-in</p>
                                <span>
                                  <input
                                    type="checkbox"
                                    id='acceptsMarketing'
                                    name='acceptsMarketing'
                                    className="tgl tgl-light"
                                    checked={customizationSettings.acceptsMarketing}
                                    onChange={handleCustomizeSettingsCheckbox}
                                  />
                                  <label htmlFor='acceptsMarketing' className='tgl-btn'></label>
                                </span>
                              </Card.Section>

                            </Card> */}

                              <Text variant="headingMd" as="h6">
                                Payment Settings
                              </Text>

                              <Card>
                                {/* <Card.Section>
                                <p>Stripe: Use value from Shipping address form in alternative payment methods</p>
                                <span>
                                  <input
                                    type="checkbox"
                                    id='billing'
                                    name='billing'
                                    className="tgl tgl-light"
                                    checked={customizationSettings.billing}
                                    onChange={handleCustomizeSettingsCheckbox}
                                  />
                                  <label htmlFor='billing' className='tgl-btn'></label>
                                </span>
                              </Card.Section>

                              <Card.Section>
                                <p>Stripe: Initial collapse payment methods</p>
                                <span>
                                  <input
                                    type="checkbox"
                                    id='defaultCollapsed'
                                    name='defaultCollapsed'
                                    className="tgl tgl-light"
                                    checked={customizationSettings.defaultCollapsed}
                                    onChange={handleCustomizeSettingsCheckbox}
                                  />
                                  <label htmlFor='defaultCollapsed' className='tgl-btn'></label>
                                </span>
                              </Card.Section> */}

                                <Card.Section>
                                  <p>
                                    Stripe: To display payment methods
                                    vertically using an accordion
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="stripeType"
                                      name="stripeType"
                                      className="tgl tgl-light"
                                      checked={customizationSettings.stripeType}
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="stripeType"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Page Settings
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Display the country name in local language
                                    in the appropriate dropdown on the checkout
                                    page. For example, the country name “Japan“
                                    will be displayed as “日本“.
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="showNativeCountry"
                                      name="showNativeCountry"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.showNativeCountry
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="showNativeCountry"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Display a cart reservation timer (countdown)
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="displayTimer"
                                      name="displayTimer"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.displayTimer
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="displayTimer"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>Enable custom text bar</p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="isCustomTextBarShowed"
                                      name="isCustomTextBarShowed"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.isCustomTextBarShowed
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="isCustomTextBarShowed"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Hide “Shipping Details“ label (block named)
                                    on the checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideShipping"
                                      name="hideShipping"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideShipping
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideShipping"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Shipping Options“ label (block named)
                                    on the checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideShippingOption"
                                      name="hideShippingOption"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideShippingOption
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideShippingOption"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Billing Details“ label (block named)
                                    on the checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideBilling"
                                      name="hideBilling"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideBilling
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideBilling"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Order Summary“ label (block named) on
                                    the checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideSummary"
                                      name="hideSummary"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideSummary
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideSummary"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Payment Method“ label (block named) on
                                    the checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hidePayment"
                                      name="hidePayment"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hidePayment
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hidePayment"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Product Options“ label (block named)
                                    on the checkout page, if present
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideProductOption"
                                      name="hideProductOption"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideProductOption
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideProductOption"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide “Discount Code“ label (block named) on
                                    the checkout page, if present
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideDiscount"
                                      name="hideDiscount"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideDiscount
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideDiscount"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>

                              <Text variant="headingMd" as="h6">
                                Advanced Options
                              </Text>

                              <Card>
                                <Card.Section>
                                  <p>
                                    Hide shipping options block on checkout page
                                    <br />
                                    (IMPORTANT: before enabling this option you
                                    need to create at least one shipping rate)
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="showShippingOptions"
                                      name="showShippingOptions"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.showShippingOptions
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="showShippingOptions"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>

                                <Card.Section>
                                  <p>
                                    Hide billing address fields block on
                                    checkout page
                                  </p>
                                  <span>
                                    <input
                                      type="checkbox"
                                      id="hideBillingForm"
                                      name="hideBillingForm"
                                      className="tgl tgl-light"
                                      checked={
                                        customizationSettings.hideBillingForm
                                      }
                                      onChange={handleCustomizeSettingsCheckbox}
                                    />
                                    <label
                                      htmlFor="hideBillingForm"
                                      className="tgl-btn"
                                    ></label>
                                  </span>
                                </Card.Section>
                              </Card>
                            </Layout.Section>
                          </Layout>

                          {/* <Layout>
                          <Layout.Section secondary>
                            <Text variant="headingMd" as="h6">
                              Checkout links
                            </Text>

                            <Text variant="bodyMd" as="p">
                              Add links to your pages that will be displayed on the checkout and thank you page.
                            </Text>
                          </Layout.Section>

                          <Layout.Section>
                            <div className='Customize-Links'>
                              <Card sectioned>
                                <InputField
                                  type="text"
                                  label="URL In Logo Header Image"
                                  name='logoUrl'
                                  value={customizationSettings.logoUrl}
                                  onChange={handleCustomizeSettings}
                                  autoComplete="off"
                                  error={urlError.logoUrl && 'Invalid Url'}
                                  placeholder='e.g. https://www.google.com'
                                />

                                <InputField
                                  type="text"
                                  label="Refund Policy URL"
                                  name='returnsPolicyUrl'
                                  value={customizationSettings.returnsPolicyUrl}
                                  onChange={handleCustomizeSettings}
                                  autoComplete="off"
                                  error={urlError.returnsPolicyUrl && 'Invalid Url'}
                                  placeholder='e.g. https://www.google.com'
                                />

                                <InputField
                                  type="text"
                                  label="Shipping Policy URL"
                                  name='shippingPolicyUrl'
                                  value={customizationSettings.shippingPolicyUrl}
                                  onChange={handleCustomizeSettings}
                                  autoComplete="off"
                                  error={urlError.shippingPolicyUrl && 'Invalid Url'}
                                  placeholder='e.g. https://www.google.com'
                                />

                                <InputField
                                  type="text"
                                  label="Privacy Policy URL"
                                  name='privacyPolicyUrl'
                                  value={customizationSettings.privacyPolicyUrl}
                                  onChange={handleCustomizeSettings}
                                  autoComplete="off"
                                  error={urlError.privacyPolicyUrl && 'Invalid Url'}
                                  placeholder='e.g. https://www.google.com'
                                />

                                <InputField
                                  type="text"
                                  l label="Terms of Service URL"
                                  name='termsAndConditionsUrl'
                                  value={customizationSettings.termsAndConditionsUrl}
                                  onChange={handleCustomizeSettings}
                                  autoComplete="off"
                                  error={urlError.termsAndConditionsUrl && 'Invalid Url'}
                                  placeholder='e.g. https://www.google.com'
                                />

                                <PageActions
                                  primaryAction={{
                                    content: 'Save Changes',
                                    loading: btnLoading[1],
                                    onAction: submitCustomizationSettings
                                  }}
                                  secondaryActions={[
                                    {
                                      content: 'Clear',
                                      onAction: () => handleDesignReset('links')
                                    },
                                  ]}
                                />

                              </Card>
                            </div>
                          </Layout.Section>
                        </Layout> */}
                        </div>
                      );

                    case 1:
                      return (
                        <div className="Customization-Tab2 Custom-PageActions">
                          <Layout>
                            <Layout.Section secondary>
                              <Text variant="headingMd" as="h6">
                                Color options
                              </Text>

                              <Text variant="bodyMd" as="p">
                                Color customization allows you to change the
                                look of your checkout page to perfectly match
                                your brand.
                              </Text>
                            </Layout.Section>

                            <Layout.Section>
                              <Card>
                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Buttons color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The color of all buttons on the checkout
                                    page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.buttonsColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.buttonsColor
                                          }
                                          name="buttonsColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {customizationSettings.buttonsColor}
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Accent color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The color of all selectors, product quantity
                                    labels, labels "Free", and background of the
                                    countdown.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.accentColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.accentColor
                                          }
                                          name="accentColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {customizationSettings.accentColor}
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Error color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The color of highlighting incorrectly filled
                                    or empty but required fields on the checkout
                                    page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.errorColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.errorColor
                                          }
                                          name="errorColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {customizationSettings.errorColor}
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Background color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The color of background on the checkout page
                                    and thank you page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.backgroundColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.backgroundColor
                                          }
                                          name="backgroundColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {
                                            customizationSettings.backgroundColor
                                          }
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Card color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The background color of all cards on the
                                    checkout page and thank you page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.cardColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.cardColor
                                          }
                                          name="cardColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {customizationSettings.cardColor}
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Text color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The color of texts/titles/headlines on the
                                    checkout page and thank you page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.textColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.textColor
                                          }
                                          name="textColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {customizationSettings.textColor}
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Motivator text color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The text color of motivator on the checkout
                                    page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.motivatorTextColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.motivatorTextColor
                                          }
                                          name="motivatorTextColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {
                                            customizationSettings.motivatorTextColor
                                          }
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Motivator background color
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    The background color of motivator on the
                                    checkout page.
                                  </Text>

                                  <div className="Color-Inputs">
                                    <Stack>
                                      <label
                                        className="Color-Circle Color-Circle-Border"
                                        style={{
                                          backgroundColor:
                                            customizationSettings.motivatorBackgroundColor,
                                        }}
                                      >
                                        <input
                                          type="color"
                                          value={
                                            customizationSettings.motivatorBackgroundColor
                                          }
                                          name="motivatorBackgroundColor"
                                          onChange={handleCustomizeSettings}
                                        />
                                      </label>

                                      <span className="Color-Property">
                                        <Text
                                          variant="headingSm"
                                          as="h6"
                                          fontWeight="medium"
                                        >
                                          {
                                            customizationSettings.motivatorBackgroundColor
                                          }
                                        </Text>
                                      </span>
                                    </Stack>
                                  </div>
                                </Card.Section>

                                <Card.Section>
                                  <PageActions
                                    primaryAction={{
                                      content: "Save Changes",
                                      loading: btnLoading[1],
                                      onAction: submitCustomizationSettings,
                                    }}
                                    secondaryActions={[
                                      {
                                        content: "Set Default",
                                        onAction: () =>
                                          handleDesignReset("color"),
                                      },
                                    ]}
                                  />
                                </Card.Section>
                              </Card>
                            </Layout.Section>
                          </Layout>

                          <Layout>
                            <Layout.Section secondary>
                              <Text variant="headingMd" as="h6">
                                Font options
                              </Text>

                              <Text variant="bodyMd" as="p">
                                Font customization allows you to change fonts
                                family on your checkout page. We recommend you
                                to use the standard font family.
                              </Text>

                              <Text variant="bodyMd" as="p">
                                <a
                                  href="https://fonts.google.com/"
                                  target="_blank"
                                >
                                  Google Fonts
                                </a>
                              </Text>
                            </Layout.Section>

                            <Layout.Section>
                              <Text variant="headingMd" as="h6">
                                Advanced Options
                              </Text>
                              <Card>
                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Font titles
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    You can change the font family for all the
                                    titles and name of products. Put only the
                                    name of the font, without a separator,
                                    quotes and only one font per field. To get
                                    an example of the format, you can click the
                                    "Set default" button.
                                  </Text>

                                  <br />
                                  <InputField
                                    type="text"
                                    label="Font Family"
                                    name="fontText"
                                    value={customizationSettings.fontText}
                                    onChange={handleCustomizeSettings}
                                    autoComplete="off"
                                    placeholder="e.g. Roboto"
                                  />
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Font other text blocks
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    You can change the font family all the other
                                    text blocks. Put only the name of the font,
                                    without a separator, quotes and only one
                                    font per field. To get an example of the
                                    format, you can click the "Set default"
                                    button.
                                  </Text>

                                  <br />
                                  <InputField
                                    type="text"
                                    label="Font Family"
                                    name="fontBody"
                                    value={customizationSettings.fontBody}
                                    onChange={handleCustomizeSettings}
                                    autoComplete="off"
                                    placeholder="e.g. Roboto"
                                  />
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Font buttons
                                  </Text>

                                  <Text variant="bodyMd" as="p">
                                    You can change the font family for the
                                    buttons. Put only the name the font, without
                                    a separator, quotes and only one font per
                                    field. To get an example of the format, you
                                    can click the "Set default" button.
                                  </Text>

                                  <br />

                                  <InputField
                                    type="text"
                                    label="Font Family"
                                    name="fontButton"
                                    value={customizationSettings.fontButton}
                                    onChange={handleCustomizeSettings}
                                    autoComplete="off"
                                    placeholder="e.g. Roboto"
                                  />
                                </Card.Section>

                                <Card.Section>
                                  <PageActions
                                    primaryAction={{
                                      content: "Save Changes",
                                      loading: btnLoading[1],
                                      onAction: submitCustomizationSettings,
                                    }}
                                    secondaryActions={[
                                      {
                                        content: "Set Default",
                                        onAction: () =>
                                          handleDesignReset("font"),
                                      },
                                    ]}
                                  />
                                </Card.Section>
                              </Card>
                            </Layout.Section>
                          </Layout>

                          <Layout>
                            <Layout.Section secondary>
                              <Text variant="headingMd" as="h6">
                                Brand images
                              </Text>

                              <Text variant="bodyMd" as="p">
                                {
                                  "Add your store logo and trust badges on the top of your checkout. We recommend you to upload images in 4:1 ratio and use "
                                }
                                <a
                                  href="https://www.shopify.com/admin/settings/files"
                                  target="_blank"
                                >
                                  {" "}
                                  Shopify hosting.
                                </a>
                              </Text>
                            </Layout.Section>

                            <Layout.Section>
                              <Card>
                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Logo header image
                                  </Text>

                                  {/* <Text variant="bodyMd" as="p">
                                  The image URL must end with its format (for example, .jpg).
                                </Text> */}

                                  <br />
                                  <div style={{ width: 114, height: 114 }}>
                                    <DropZone
                                      allowMultiple={false}
                                      onDrop={handleDropZoneDrop}
                                      accept="image/*"
                                      type="image"
                                    >
                                      {(!customizationSettings.leftImageUrl ||
                                        customizationSettings.leftImageUrl ==
                                          "null") &&
                                        !file && (
                                          <DropZone.FileUpload
                                            actionTitle={"Add Image"}
                                          />
                                        )}
                                      {customizationSettings.leftImageUrl &&
                                        customizationSettings.leftImageUrl !=
                                          "null" &&
                                        !file && (
                                          <span>
                                            <Thumbnail
                                              size="large"
                                              alt={"header-img"}
                                              source={
                                                customizationSettings.leftImageUrl
                                              }
                                            />
                                          </span>
                                        )}
                                      {file && (
                                        <span>
                                          <Thumbnail
                                            size="large"
                                            alt={file.name}
                                            source={
                                              validImageTypes.includes(
                                                file.type
                                              )
                                                ? window.URL.createObjectURL(
                                                    file
                                                  )
                                                : NoteMinor
                                            }
                                          />
                                        </span>
                                      )}
                                    </DropZone>
                                  </div>

                                  {(customizationSettings?.leftImageUrl &&
                                    customizationSettings?.leftImageUrl !=
                                      "null") ||
                                  file ? (
                                    <span className="Image-Remove">
                                      <Button
                                        plain
                                        onClick={() =>
                                          handleRemoveImage("leftImageUrl")
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Right header image
                                  </Text>

                                  {/* <Text variant="bodyMd" as="p">
                                  The image URL must end with its format (for example, .jpg).
                                </Text> */}

                                  <br />
                                  <div style={{ width: 114, height: 114 }}>
                                    <DropZone
                                      allowMultiple={false}
                                      onDrop={handleDropZoneDrop2}
                                      accept="image/*"
                                      type="image"
                                    >
                                      {(!customizationSettings.rightImageUrl ||
                                        customizationSettings.rightImageUrl ==
                                          "null") &&
                                        !file2 && (
                                          <DropZone.FileUpload
                                            actionTitle={"Add Image"}
                                          />
                                        )}

                                      {customizationSettings.rightImageUrl &&
                                        customizationSettings.rightImageUrl !=
                                          "null" &&
                                        !file2 && (
                                          <Thumbnail
                                            size="large"
                                            alt={"header-img"}
                                            source={
                                              customizationSettings.rightImageUrl
                                            }
                                          />
                                        )}
                                      {file2 && (
                                        <Thumbnail
                                          size="large"
                                          alt={file2.name}
                                          source={
                                            validImageTypes.includes(file2.type)
                                              ? window.URL.createObjectURL(
                                                  file2
                                                )
                                              : NoteMinor
                                          }
                                        />
                                      )}
                                    </DropZone>
                                  </div>
                                  {(customizationSettings?.rightImageUrl &&
                                    customizationSettings?.rightImageUrl !=
                                      "null") ||
                                  file2 ? (
                                    <span className="Image-Remove">
                                      <Button
                                        plain
                                        onClick={() =>
                                          handleRemoveImage("rightImageUrl")
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </Card.Section>

                                <Card.Section>
                                  <Text variant="headingMd" as="h6">
                                    Favicon
                                  </Text>

                                  {/* <Text variant="bodyMd" as="p">
                                  The Favicon URL must end with format .png and will be minimum recommend size 180x180.
                                </Text> */}

                                  <br />
                                  <div style={{ width: 114, height: 114 }}>
                                    <DropZone
                                      allowMultiple={false}
                                      onDrop={handleDropZoneDrop3}
                                      accept="image/*"
                                      type="image"
                                    >
                                      {(!customizationSettings.favicons ||
                                        customizationSettings.favicons ==
                                          "null") &&
                                        !file3 && (
                                          <DropZone.FileUpload
                                            actionTitle={"Add Image"}
                                          />
                                        )}
                                      {customizationSettings.favicons &&
                                        customizationSettings.favicons !=
                                          "null" &&
                                        !file3 && (
                                          <Thumbnail
                                            size="large"
                                            alt={"header-img"}
                                            source={
                                              customizationSettings.favicons
                                            }
                                          />
                                        )}
                                      {file3 && (
                                        <Thumbnail
                                          size="large"
                                          alt={file3.name}
                                          source={
                                            validImageTypes.includes(file3.type)
                                              ? window.URL.createObjectURL(
                                                  file3
                                                )
                                              : NoteMinor
                                          }
                                        />
                                      )}
                                    </DropZone>
                                  </div>
                                  {(customizationSettings?.favicons &&
                                    customizationSettings?.favicons !=
                                      "null") ||
                                  file3 ? (
                                    <span className="Image-Remove">
                                      <Button
                                        plain
                                        onClick={() =>
                                          handleRemoveImage("favicons")
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </Card.Section>

                                <Card.Section>
                                  <PageActions
                                    primaryAction={{
                                      content: "Save Changes",
                                      loading: btnLoading[1],
                                      onAction: submitCustomizationSettings,
                                    }}
                                    secondaryActions={[
                                      {
                                        content: "Clear",
                                        onAction: () =>
                                          handleDesignReset("brand"),
                                      },
                                    ]}
                                  />
                                </Card.Section>
                              </Card>
                            </Layout.Section>
                          </Layout>
                        </div>
                      );

                    case 2:
                      return (
                        <div className="Customization-Tab3 Custom-ResourceList">
                          {inducementsData?.length > 0 ? (
                            <span>
                              <ResourceList
                                loading={resourceLoading}
                                resourceName={{
                                  singular: "inducement",
                                  plural: "inducements",
                                }}
                                items={inducementsData}
                                renderItem={(item) => {
                                  const { id, imgUrl, title, description } =
                                    item;

                                  return (
                                    <Card>
                                      <ResourceItem
                                        id={id}
                                        media={
                                          <Avatar
                                            customer
                                            size="medium"
                                            name={title}
                                            source={imgUrl}
                                          />
                                        }
                                        accessibilityLabel={`View details for ${title}`}
                                        name={title}
                                      >
                                        <div>
                                          <Text
                                            variant="bodyMd"
                                            fontWeight="bold"
                                            as="h3"
                                          >
                                            {title}
                                          </Text>
                                          <span>{description}</span>
                                        </div>

                                        <ButtonGroup>
                                          <Button
                                            onClick={() => editInducement(id)}
                                          >
                                            <Icon source={EditMinor}></Icon>
                                          </Button>

                                          <Button
                                            onClick={() =>
                                              handleDeleteInducement(id)
                                            }
                                          >
                                            <Icon source={DeleteMinor}></Icon>
                                          </Button>
                                        </ButtonGroup>
                                      </ResourceItem>
                                    </Card>
                                  );
                                }}
                              />
                              {inducementsData?.length < 3 && (
                                <PageActions
                                  primaryAction={{
                                    content: "Create Inducement",
                                    // disabled: inducementsData?.length >= 3,
                                    onAction: handleInducementSheet,
                                  }}
                                />
                              )}
                            </span>
                          ) : (
                            <EmptyCard value="inducements" />
                          )}
                        </div>
                      );

                    default:
                      break;
                  }
                })()}
              </>
            )}
          </Tabs>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
