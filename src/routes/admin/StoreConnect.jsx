import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Card,
  Form,
  FormLayout,
  Button,
  Toast,
  Banner,
  List,
  Columns,
  Text,
  Layout,
  TextField,
  Stack,
} from "@shopify/polaris";
import axios from "axios";
import { AppContext } from "../../components/providers/ContextProvider";
import { InputField, getAccessToken, setAccessToken } from "../../components";
import "../../styles/storeConnect.css";
// import checkifyLogo from "../../assets/CheckifyWhiteLogo.svg";
import checkifyLogo from "../../assets/republic_checkout.png";
import shopifyLogo from "../../assets/shopifyLogo.svg";

import FillCheckBox from "../../assets/icons/FillCheckBox.png";
import clipBoard from "../../assets/icons/clipBoard.svg";
import { useEffect } from "react";
import { useAuthDispatch } from "../../components/providers/AuthProvider";

export function StoreConnect() {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const { apiUrl, setLocationChange } = useContext(AppContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [getStage, setStage] = useState("stage1");

  const [formValues, setFormValues] = useState({
    domainName: "",
    accessToken: "",
    publicKey: "",
    privateKey: "",
  });

  const handleFormValue = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const toggleErrorMsgActive = useCallback(
    () => setErrorToast((errorToast) => !errorToast),
    []
  );
  const toastErrorMsg = errorToast ? (
    <Toast content={toastMsg} error onDismiss={toggleErrorMsgActive} />
  ) : null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    let data = {
      shopifyShopDomainName: formValues.domainName,
      shopifyAccessToken: formValues.accessToken,
      shopifyApiPublicKey: formValues.publicKey,
      shopifyApiSecretKey: formValues.privateKey,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/store`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log('Store Connect Api response: ', response.data);
      setBtnLoading(false);
      setToastMsg("Store connected successfully!");
      setSucessToast(true);
      setLocationChange("/");
      dispatch({
        user: response.data?.user,
        isNotifyBanner: response.data?.user?.isNotifyBanner == 1,
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.warn("Store Connect Api Error", error.response);
      setBtnLoading(false);
      if (
        error.response?.status == 401 &&
        error.response?.data?.message == "Unauthorized"
      ) {
        setToastMsg("Session Expire, Please Login Again");
        setErrorToast(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error.response?.status == 409) {
        setToastMsg("This shopify domain name has already been used.");
        setErrorToast(true);
      } else if (error.response?.status == 500) {
        setToastMsg("Shopify host not found! Try Again");
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
  const handleLogout = async () => {
    console.log("clicked");
    let data = {};
    try {
      const response = await axios.post(`${apiUrl}/api/logout`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log('AuthCheck response: ', response.data);
      if (!response?.data?.errors) {
        setAccessToken("");
        dispatch({
          user: null,
          userToken: "",
        });
        navigate("/login");
      }
    } catch (error) {
      console.warn("AuthCheck Api Error", error);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const FirstStage = () => {
    return (
      <>
        <div className="sc-content">
          <div className="sc-content-main">
            <Text variant="headingXl" as={"h1"} color="text-inverse">
              Add your store
            </Text>
            <br />
            <Text variant="headingSm" as="p" color="text-inverse">
              To connect your Shopify store, please provide your{" "}
              <span className="text-mark">myshopify domain</span>. Checkout
              Republic does not support other eCom platforms yet.
            </Text>
            <br />

            <Card sectioned>
              <div className="sc-card-content">
                <div className="sc-card-content-heading">
                  TO GET STARTED YOU NEED:
                </div>
                <br />
                <List type="number">
                  <List.Item>Shopify account</List.Item>
                  <List.Item>Correct myshopify domain</List.Item>
                </List>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const SecondStage = () => {
    return (
      <>
        <div className="sc-content">
          <div className="sc-content-main">
            <Text variant="headingXl" as={"h1"} color="text-inverse">
              Create a custom app
            </Text>
            <br />
            <Text variant="headingSm" as="p" color="text-inverse">
              Checkout Republic is an custom Shopify app that needs a number of
              permissions to interact with your store.
            </Text>
            <br />
            <Text variant="headingSm" as="p" color="text-inverse">
              Please go to{" "}
              <span className="text-mark">
                {" "}
                Apps and sales channels {">"} Develop apps (in Settings menu){" "}
                {">"} Create an app{" "}
              </span>{" "}
              and configurate this feature. Next, configure the according to the
              instructions below.
            </Text>
            <br />

            <Card sectioned>
              <div className="sc-card-content">
                <div className="sc-card-content-heading">
                  HOW TO SET UP CUSTOM APPS CORRECTLY
                </div>
                <br />
                <List type="number">
                  <List.Item>
                    Create a Custom app.
                    <br />
                    <a
                      target="_blank"
                      href="https://www.shopify.com/admin/settings/apps"
                    >
                      <Button primary size="slim">
                        Go to Apps on Shopify
                      </Button>
                    </a>
                  </List.Item>
                  <List.Item>
                    Copy Custom app name to corresponding field in Application
                    details section.
                  </List.Item>
                  <List.Item>
                    Scroll to Admin API permissions section.
                    <br />
                    {/*<a target="_blank"*/}
                    {/*//  href="https://help.checkify.pro/en/articles/4367154-checkify-installation-instructions"*/}
                    {/* >*/}
                    {/*<Button primary size="slim">*/}
                    {/*  Go to our Artical*/}
                    {/*</Button>*/}
                    {/*</a>*/}
                  </List.Item>
                  <List.Item>
                    In Shopify choose Configure Admin API scopes section.
                  </List.Item>
                  <List.Item>
                    Set custom app permissions as listed here.
                  </List.Item>
                  <List.Item>
                    Save your changes in custom app on Shopify.
                  </List.Item>
                  <List.Item>
                    Click Install your custom app on Shopify, after this you get
                    credential for the next step.
                  </List.Item>
                </List>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const ThirdStage = () => {
    return (
      <>
        <div className="sc-content">
          <div className="sc-content-main">
            <Text variant="headingXl" as={"h1"} color="text-inverse">
              Add your API keys
            </Text>
            <br />
            <Text variant="headingSm" as="p" color="text-inverse">
              Now that you've saved the app, Shopify has generated API
              credentials. If all app permissions have been set correctly,
              Checkout Republic will be installed on your store.
            </Text>
            <br />

            <Card sectioned>
              <div className="sc-card-content">
                <div className="sc-card-content-heading">
                  HOW CAN YOU DO THIS?
                </div>
                <br />
                <List type="number">
                  <List.Item>
                    Select the API credentials tab in your custom Shopify app.
                  </List.Item>
                  <List.Item>
                    Copy the required data from Shopify to Checkout Republic.
                  </List.Item>
                  <List.Item>
                    Click button "Connect store" so that we can check
                    permissions.
                  </List.Item>
                </List>
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const scopes = [
    {
      id: "read_products",
      title: "Products",
      desc: null,
      firstScope: "read_products",
      secondScope: "write_products",
    },
    {
      id: "read_customers",
      title: "Customers",
      desc: "sometimes called Clients",
      firstScope: "read_customers",
      secondScope: "write_customers",
    },
    {
      id: "read_discounts",
      title: "Discounts",
      desc: null,
      firstScope: "read_discounts",
      secondScope: "write_discounts",
    },
    {
      id: "read_fulfillments",
      title: "Fulfillment services",
      desc: "sometimes called Order Processing Service",
      firstScope: "read_fulfillments",
      secondScope: null,
    },
    {
      id: "read_gdpr_data_request",
      title: "GDPR data requests",
      desc: null,
      firstScope: "read_gdpr_data_request",
      secondScope: null,
    },
    {
      id: "read_gift_cards",
      title: "Gift cards",
      desc: null,
      firstScope: "read_gift_cards",
      secondScope: null,
    },
    {
      id: "read_inventory",
      title: "Inventory",
      desc: null,
      firstScope: "read_inventory",
      secondScope: "write_inventory",
    },
    {
      id: "read_order_edits",
      title: "Order editing",
      desc: "sometimes called Editing Order",
      firstScope: "read_order_edits",
      secondScope: "write_order_edits",
    },
    {
      id: "read_orders",
      title: "Orders",
      desc: null,
      firstScope: "read_orders",
      secondScope: "write_orders",
    },
    {
      id: "read_price_rules",
      title: "Price rules",
      desc: "sometimes called Pricing rules",
      firstScope: "read_price_rules",
      secondScope: "write_price_rules",
    },
    {
      id: "read_product_listings",
      title: "Product listings",
      desc: "sometimes called Product Pages",
      firstScope: "read_product_listings",
      secondScope: null,
    },
    {
      id: "read_script_tags",
      title: "Script tags",
      desc: "sometimes called Script Tag",
      firstScope: "read_script_tags",
      secondScope: "write_script_tags",
    },
    {
      id: "read_shipping",
      title: "Shipping",
      desc: null,
      firstScope: "read_shipping",
      secondScope: null,
    },
    {
      id: "read_themes",
      title: "Themes",
      desc: null,
      firstScope: "read_themes",
      secondScope: "write_themes",
    },
  ];

  function copyTextToClipboard(id) {
    var textArea = document.createElement("textarea");

    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    textArea.value = id;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successfully" : "unsuccessful";
      document.getElementById(id).style.display = "block";

      setTimeout(() => {
        document.getElementById(id).style.display = "none";
      }, 1500);
    } catch (err) {
      alert("unable to copy");
    }

    document.body.removeChild(textArea);
  }

  function changeStageOnClick(stage) {
    if (stage == "stage2") {
      if (getStage == "stage3") {
        setStage(stage);
      }
    }
    if (stage == "stage1") {
      if (getStage == "stage2" || getStage == "stage3") {
        setStage(stage);
      }
    }
  }

  const SecondStageContent = () => {
    return (
      <>
        <div className="Store-Tab">
          <Card subdued>
            {scopes?.map((item) => {
              return (
                <Card.Section>
                  <Stack>
                    <Stack.Item fill>
                      <Stack vertical={item.desc}>
                        <Text variant="bodyMd" fontWeight="semibold" as="h6">
                          {item.title}
                        </Text>
                        {item.desc && (
                          <Text
                            variant="bodySm"
                            as="p"
                            fontWeight="regular"
                            color="subdued"
                          >
                            {item.desc}
                          </Text>
                        )}
                      </Stack>
                    </Stack.Item>
                    <Stack.Item>
                      <div className="Scopes-Section">
                        <Stack alignment="center">
                          <Stack vertical>
                            <Text variant="bodySm" as="p" fontWeight="regular">
                              <img src={FillCheckBox} alt="checkbox" />
                              {item.firstScope}
                            </Text>
                            {item.secondScope && (
                              <Text
                                variant="bodySm"
                                as="p"
                                fontWeight="regular"
                              >
                                <img src={FillCheckBox} alt="checkbox" />
                                {item.secondScope}
                              </Text>
                            )}
                          </Stack>
                          <span className="Custom-Clipboard">
                            <p id={item.id}>Copied</p>
                            <Button
                              onClick={() => copyTextToClipboard(item.id)}
                            >
                              <img src={clipBoard} alt="clipboard" />
                            </Button>
                          </span>
                        </Stack>
                      </div>
                    </Stack.Item>
                  </Stack>
                </Card.Section>
              );
            })}
          </Card>
        </div>
      </>
    );
  };

  const domainCheck = async () => {
    try {
      if (formValues?.domainName.length == 0) {
        setToastMsg("Domain name is required!");
        setErrorToast(true);
        return false;
      }
      const resp = await axios.post(`${apiUrl}/api/domain-check`, {
        domain: formValues?.domainName,
      });
      setStage("stage2");
    } catch (e) {
      setToastMsg(e?.response?.data?.message);
      setErrorToast(true);
    }
  };

  useEffect(() => {
    console.log(getStage);
  }, [getStage]);

  return (
    <div className="Store-Connect-page">
      <div className="">
        <Columns columns={["oneThird", "twoThirds"]}>
          <div className="sc-secondary-col">
            <div className="sc-main">
              <div className="sc-header">
                <img src={checkifyLogo} alt="" />
                <div className="sc-header-primary">
                  <div className="sc-header-text" onClick={handleLogout}>
                    Log out
                  </div>
                  {/* <div className=''></div> */}
                </div>
              </div>
              {(() => {
                switch (getStage) {
                  case "stage1":
                    return <FirstStage />;
                    break;
                  case "stage2":
                    return <SecondStage />;
                    break;
                  case "stage3":
                    return <ThirdStage />;
                    break;
                }
              })()}
            </div>
          </div>

          <div className="sc-primary-col">
            <div className="sc-primary-header">
              <div
                className={`sc-primary-header-tab ${
                  getStage == "stage1"
                    ? "active"
                    : getStage == "stage2" || getStage == "stage3"
                    ? "activated"
                    : ""
                }`}
                onClick={() => changeStageOnClick("stage1")}
              >
                <span
                  className={`sc-tab-circle ${
                    getStage == "stage1"
                      ? "active"
                      : getStage == "stage2" || getStage == "stage3"
                      ? "activated"
                      : ""
                  }`}
                >
                  1
                </span>
                <span>Add your store</span>
              </div>
              <div
                className={`sc-primary-header-tab ${
                  getStage == "stage2"
                    ? "active"
                    : getStage == "stage3"
                    ? "activated"
                    : ""
                }`}
                onClick={() => changeStageOnClick("stage2")}
              >
                <span
                  className={`sc-tab-circle ${
                    getStage == "stage2"
                      ? "active"
                      : getStage == "stage3"
                      ? "activated"
                      : ""
                  }`}
                >
                  2
                </span>
                <span>Create a custom app</span>
              </div>
              <div
                className={`sc-primary-header-tab ${
                  getStage == "stage3" ? "active" : ""
                }`}
                onClick={() => changeStageOnClick("stage3")}
              >
                <span
                  className={`sc-tab-circle ${
                    getStage == "stage3" ? "active" : ""
                  }`}
                >
                  3
                </span>
                <span>Add app details</span>
              </div>
            </div>
            <div className="sc-primary-content">
              <div className="sc-primary-content-main">
                <div className="sc-primary-content-form">
                  {(() => {
                    switch (getStage) {
                      case "stage1":
                        return (
                          <>
                            <div className="sc-primary-content-form-element">
                              <img
                                src={shopifyLogo}
                                alt=""
                                style={{ marginBottom: "20px" }}
                              />
                              <Text as={"h1"} variant="headingLg">
                                Add your Shopify store name
                              </Text>
                              <br />
                              <InputField
                                value={formValues?.domainName}
                                onChange={handleFormValue}
                                name={"domainName"}
                                inputStyle={{ padding: "10px" }}
                                suffix={".myshopfy.com"}
                                placeholder={"domain-name"}
                                helpText={
                                  "Make sure your domain is correct, you cannot change it later."
                                }
                              />
                            </div>
                            <div className="sc-primary-content-form-element">
                              <Button primary onClick={domainCheck}>
                                Go to next step{" "}
                              </Button>
                            </div>
                          </>
                        );
                        break;
                      case "stage2":
                        return (
                          <>
                            <div className="sc-primary-content-form-element">
                              <Text as={"h1"} variant="headingLg">
                                Set app details
                              </Text>
                              <br />
                              <InputField
                                disabled
                                inputStyle={{ padding: "10px" }}
                                suffix={
                                  <span className="Custom-Clipboard inside-suffix-clipboard">
                                    <p id={"CheckoutRepublic"}>Copied</p>
                                    <Button
                                      onClick={() =>
                                        copyTextToClipboard("CheckoutRepublic")
                                      }
                                    >
                                      <img src={clipBoard} alt="clipboard" />
                                    </Button>
                                  </span>
                                }
                                value={"CheckoutRepublic"}
                                helpText={
                                  "Paste it to the App name field on Shopify."
                                }
                              />
                            </div>
                            <div className="sc-primary-content-form-element">
                              <Text as={"h1"} variant="headingMd">
                                In the Admin API scopes set the following
                                permissions
                              </Text>
                              <br />
                              <div className="sc-primary-content-stage-2">
                                <SecondStageContent />
                              </div>
                            </div>
                            <div className="sc-primary-content-form-element">
                              <Button
                                primary
                                onClick={() => setStage("stage3")}
                              >
                                Go to next step
                              </Button>
                            </div>
                          </>
                        );
                        break;
                      case "stage3":
                        return (
                          <>
                            <div className="sc-primary-content-form-element">
                              <Text as={"h1"} variant="headingLg">
                                You’re almost there!
                              </Text>
                              <br />
                              <Form onSubmit={handleFormSubmit}>
                                <FormLayout>
                                  <InputField
                                    value={formValues?.accessToken}
                                    onChange={handleFormValue}
                                    name={"accessToken"}
                                    required
                                    label={"ADMIN API ACCESS TOKEN"}
                                    inputStyle={{ padding: "10px" }}
                                    helpText={
                                      "Paste value from the API access token field on Shopify here."
                                    }
                                  />

                                  <InputField
                                    required
                                    value={formValues?.publicKey}
                                    onChange={handleFormValue}
                                    name={"publicKey"}
                                    label={"API KEY"}
                                    inputStyle={{ padding: "10px" }}
                                    helpText={
                                      "Paste value from the API key field on Shopify here."
                                    }
                                  />

                                  <InputField
                                    required
                                    value={formValues?.privateKey}
                                    onChange={handleFormValue}
                                    name={"privateKey"}
                                    label={"API SECRET"}
                                    inputStyle={{ padding: "10px" }}
                                    helpText={
                                      "Paste value from the API secret key field on Shopify here."
                                    }
                                  />

                                  <div className="sc-primary-content-form-element">
                                    <Button submit primary>
                                      Connect store
                                    </Button>
                                  </div>
                                </FormLayout>
                              </Form>
                            </div>
                          </>
                        );
                        break;
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </Columns>
      </div>
      {toastErrorMsg}
    </div>
  );
}
