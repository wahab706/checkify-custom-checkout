import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useReducer,
} from "react";
import {
  Page,
  Layout,
  Button,
  Loading,
  Card,
  Icon,
  Tabs,
  Text,
  TextField,
  Toast,
  ButtonGroup,
  Checkbox,
  RadioButton,
  Stack,
  Sheet,
  Scrollable,
} from "@shopify/polaris";
import {
  ExternalMinor,
  ArrowLeftMinor,
  LinkMinor,
} from "@shopify/polaris-icons";
import shopify from "../../assets/icons/shopify.svg";
import namecheap from "../../assets/icons/namecheap.svg";
import godaddy from "../../assets/icons/godaddy.svg";
import clipBoard from "../../assets/icons/clipBoard.svg";
import axios from "axios";
import {
  SkeltonTabsLayoutSecondary,
  getAccessToken,
  InputField,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  useAuthState,
  useAuthDispatch,
} from "../../components/providers/AuthProvider";

export function Settings() {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const { apiUrl } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [toggleLoadProfile, setToggleLoadProfile] = useState(true);

  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);

  const [branding, setBranding] = useState(
    convertNumberToBoolean(user?.checkifyBranding)
  );
  const [customSubDomain, setCustomSubDomain] = useState(user?.subdomain);
  const [customDomain, setCustomDomain] = useState(user?.domain);
  const [currentDomain, setCurrentDomain] = useState(user?.subdomain);
  const [domainSheet, setDomainSheet] = useState(false);

  const handleDomainSheet = () => {
    setDomainSheet(!domainSheet);
  };

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

  const tabs = [
    {
      id: "1",
      content: "Custom Domain",
    },
    {
      id: "2",
      content: "Checkify Script",
    },
    {
      id: "3",
      content: "Buy Link",
    },
  ];

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    []
  );

  function getValidUrl(value) {
    const regex = /^[^.-]+$/;
    const isValid = regex.test(value);
    // console.log("isValid", isValid);

    if (isValid) {
      return true;
    } else {
      return false;
    }
  }

  function copyTextToClipboard(id, text) {
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
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successfully" : "unsuccessful";
      document.getElementById(id).style.display = "block";

      const timer = setTimeout(() => {
        document.getElementById(id).style.display = "none";
      }, 1500);
    } catch (err) {
      alert("unable to copy");
    }

    document.body.removeChild(textArea);
  }

  function copyTextToClipboard3(id) {
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

  const publishScript = async () => {
    setBtnLoading(true);
    let data = {};
    try {
      const response = await axios.post(`${apiUrl}/api/script-publish`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      console.log("publishScript Api response: ", response.data);
      setToastMsg("Sucessfully Published");
      setSucessToast(true);

      setBtnLoading(false);
    } catch (error) {
      console.warn("publishScript Api Error", error.response);
      setBtnLoading(false);
      setToastMsg("Failed to publish");
      setErrorToast(true);
    }
  };

  const verifyDomain = async () => {
    setBtnLoading((prev) => {
      let toggleId;
      if (prev["verifyDomain"]) {
        toggleId = { ["verifyDomain"]: false };
      } else {
        toggleId = { ["verifyDomain"]: true };
      }
      return { ...toggleId };
    });

    let data = {
      domain: customDomain,
    };

    try {
      const response = await axios.put(`${apiUrl}/api/domain/connect`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      //   console.log("verifyDomain Api response: ", response.data);

      setToastMsg(response.data?.data?.message);
      setSucessToast(true);

      setBtnLoading(false);
    } catch (error) {
      console.warn("verifyDomain Api Error", error.response);
      setBtnLoading(false);
      setToastMsg("Server Error");
      setErrorToast(true);
    }
  };

  const connectDomain = async () => {
    if (getValidUrl(customSubDomain)) {
      setBtnLoading((prev) => {
        let toggleId;
        if (prev["connectDomain"]) {
          toggleId = { ["connectDomain"]: false };
        } else {
          toggleId = { ["connectDomain"]: true };
        }
        return { ...toggleId };
      });

      let data = {
        subdomain: customSubDomain,
      };
      try {
        const response = await axios.put(
          `${apiUrl}/api/subdomain/connect`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        //   console.log("connectDomain Api response: ", response.data);
        if (response.data?.errors) {
          setToastMsg(response.data?.message);
          setErrorToast(true);
        } else {
          dispatch({
            user: response.data?.user,
          });
          setCurrentDomain(response.data?.user?.subdomain);

          if (response?.data?.data) {
            setToastMsg(
              response.data?.data[0] ? response.data?.data[0] : "Success!"
            );
          } else {
            setToastMsg("Success!");
          }

          setSucessToast(true);
        }

        setBtnLoading(false);
      } catch (error) {
        console.warn("connectDomain Api Error", error.response);
        setBtnLoading(false);
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
      }
    } else {
      setToastMsg("Enter valid domain");
      setErrorToast(true);
    }
  };

  const handleCheckifyBranding = async (value) => {
    let data = {
      type: "enableSettings",
      checkifyBranding: convertBooleanToNumber(value),
    };

    try {
      const response = await axios.post(`${apiUrl}/api/store/minor`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      //   console.log("CheckifyBranding Api response: ", response.data);
      dispatch({
        user: response.data?.user,
      });
      setBranding(
        convertNumberToBoolean(response.data?.user?.checkifyBranding)
      );

      setToastMsg(response.data?.message ? response.data?.message : "Success!");
      setSucessToast(true);

      setBtnLoading(false);
    } catch (error) {
      console.warn("CheckifyBranding Api Error", error.response);
      setBtnLoading(false);
      setToastMsg("Server Error");
      setErrorToast(true);
    }
  };

  return (
    <div className="Settings-Page">
      <Sheet
        open={domainSheet}
        onClose={handleDomainSheet}
        accessibilityLabel="Payment Methods"
      >
        <div className="Sheet-Container Payment-Sheet Domain-Sheet">
          <div className="Sheet-Header">
            <div className="Flex Align-Center">
              <Button
                accessibilityLabel="Cancel"
                icon={ArrowLeftMinor}
                onClick={handleDomainSheet}
                disabled={btnLoading["verifyDomain"]}
              />
              <span>
                <Icon source={LinkMinor} color="base"></Icon>
              </span>
              <div className="Payment-Sheet-Heading">
                <Text variant="bodyMd" as="p" fontWeight="semibold">
                  Custom domain
                </Text>
                <Text
                  variant="bodyMd"
                  as="p"
                  fontWeight="regular"
                  color="subdued"
                >
                  Your checkout will be displayed on the custom domain
                </Text>
              </div>
            </div>
          </div>

          <Scrollable className="Sheet-Scrollable">
            <Text variant="headingMd" as="h6">
              Open your domain provider and goto DNS settings
            </Text>

            <Text variant="bodyMd" as="p" color="subdued">
              Your domain provider is the place you bought and manage your
              domain
            </Text>
            <br />

            <span style={{ display: "flex", justifyContent: "space-around" }}>
              <ButtonGroup>
                <a
                  href="https://onecheckout.myshopify.com/admin/settings/domains"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <img src={shopify} alt="shopify" />
                  </Button>
                </a>

                <a
                  href="https://godaddy.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <img src={godaddy} alt="godaddy" />
                  </Button>
                </a>

                <a
                  href="https://www.namecheap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button>
                    <img src={namecheap} alt="namecheap" />
                  </Button>
                </a>
              </ButtonGroup>
            </span>

            <div className="domain-sheet-divider"></div>

            <InputField
              label="Set your custom domain"
              placeholder="https://example.com/"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />

            <div className="domain-sheet-divider"></div>

            <Text variant="headingMd" as="h6">
              Create a DNS CNAME Record
            </Text>

            <Text variant="bodyMd" as="p" color="subdued">
              Create a new CNAME record in your in your domain provider using
              the values below. Once done click the "Verify domain" button.
            </Text>
            <br />

            <Card subdued title="HOST / NAME">
              <div className="Scopes-Section">
                <Stack alignment="center" distribution="equalSpacing">
                  <Text variant="bodyMd" as="p">
                    Copy this value and put in your domain settings
                  </Text>
                  {/* <span className="Custom-Clipboard">
                    <p id="hostName">Copied</p>
                    <Button
                      onClick={() =>
                        copyTextToClipboard("hostName", "_acme-challenge")
                      }
                    >
                      <img src={clipBoard} alt="clipboard" />
                    </Button>
                  </span> */}
                </Stack>
                <Stack>
                  <Text variant="headingSm" as="h6">
                    _acme-challenge
                  </Text>
                </Stack>
              </div>
            </Card>

            <Card subdued title="Ponits to">
              <div className="Scopes-Section">
                <Stack alignment="center" distribution="equalSpacing">
                  <Text variant="bodyMd" as="p">
                    Copy this value and put in your domain settings
                  </Text>
                  {/* <span className="Custom-Clipboard">
                    <p id="pointsTo">Copied</p>
                    <Button
                      onClick={() =>
                        copyTextToClipboard(
                          "pointsTo",
                          "http://phpstack-908320-3153127.cloudwaysapps.com"
                        )
                      }
                    >
                      <img src={clipBoard} alt="clipboard" />
                    </Button>
                  </span> */}
                </Stack>
                <Stack>
                  <Text variant="headingSm" as="h6">
                    http://phpstack-908320-3153127.cloudwaysapps.com
                  </Text>
                </Stack>
              </div>
            </Card>
          </Scrollable>

          <div className="Sheet-Footer">
            <Button
              onClick={handleDomainSheet}
              disabled={btnLoading["verifyDomain"]}
            >
              Cancel
            </Button>
            <Button
              primary
              loading={btnLoading["verifyDomain"]}
              onClick={verifyDomain}
            >
              {customDomain ? "Verify" : "Connect"}
            </Button>
          </div>
        </div>
      </Sheet>

      <Page fullWidth title="Settings">
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {(() => {
            switch (selectedTab) {
              case 0:
                return (
                  <div className="Custom-Domain-Tab">
                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                          Connect your domain to Checkify
                        </Text>

                        <Text variant="bodyMd" as="p">
                          Improve your checkout branding, customer trust & ads
                          tracking performance by connecting your store domain
                          to your checkout.
                        </Text>
                      </Layout.Section>

                      <Layout.Section>
                        <Card>
                          <Card.Section>
                            <div className="connect-domain">
                              <InputField
                                label={
                                  <Stack
                                    alignment="center"
                                    distribution="equalSpacing"
                                  >
                                    <p>Set your custom subdomain</p>
                                    <Button plain onClick={handleDomainSheet}>
                                      Connect domain
                                    </Button>
                                  </Stack>
                                }
                                suffix=".ecommercehack.com"
                                value={customSubDomain}
                                onChange={(e) =>
                                  setCustomSubDomain(e.target.value)
                                }
                              />
                            </div>
                          </Card.Section>
                          <Card.Section>
                            <Stack distribution="equalSpacing">
                              <Button
                                primary
                                onClick={connectDomain}
                                loading={btnLoading["connectDomain"]}
                              >
                                Save subdomain
                              </Button>
                              <Stack>
                                <Text variant="headingSm" as="h6">
                                  Current Domain:
                                </Text>

                                <Text variant="bodyMd" as="p">
                                  {`${
                                    currentDomain ? currentDomain : "pay"
                                  }.ecommercehack.com`}
                                </Text>
                              </Stack>
                            </Stack>
                          </Card.Section>
                        </Card>
                      </Layout.Section>
                    </Layout>

                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                          Checkify branding
                        </Text>

                        <Text variant="bodyMd" as="p">
                          Can only be removed from checkout page after custom
                          domain verification.
                        </Text>
                      </Layout.Section>

                      <Layout.Section>
                        <span className="Flex-Space-Between">
                          <Card>
                            <Card.Section>
                              <Text variant="bodyMd" as="p" color="subdued">
                                Remove “©️ Checkify” label from your checkout
                              </Text>

                              <span>
                                <input
                                  id="branding"
                                  type="checkbox"
                                  className="tgl tgl-light"
                                  checked={branding}
                                  onChange={(e) =>
                                    handleCheckifyBranding(e.target.checked)
                                  }
                                />
                                <label
                                  htmlFor="branding"
                                  className="tgl-btn"
                                ></label>
                              </span>
                            </Card.Section>
                          </Card>
                        </span>
                      </Layout.Section>
                    </Layout>
                  </div>
                );

              case 1:
                return (
                  <div className="Checkify-Script-Tab">
                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                          Checkify Script
                        </Text>

                        <Text variant="bodyMd" as="p">
                          This script was automatically generated and embedded
                          into your Shopify Store theme when Checkify connects.
                        </Text>

                        <Text variant="bodyMd" as="p">
                          With all permissions granted, this script redirects
                          users to Checkify's checkout from the shopping cart
                          and buy buttons.
                        </Text>
                      </Layout.Section>

                      <Layout.Section>
                        <span className="Flex-Space-Start">
                          <Card>
                            <Card.Section>
                              <Text variant="headingMd" as="h6">
                                Checkify Script
                              </Text>

                              <Text variant="bodyMd" as="p">
                                This script was automatically generated and
                                embedded into your Shopify Store theme when
                                Checkify connects. With all permissions granted,
                                this script redirects users to Checkify's
                                checkout from the shopping cart and buy buttons.
                              </Text>

                              <Text variant="bodyMd" as="p">
                                {
                                  " In some cases, we may ask you to add this script to your theme manually. For this, go to "
                                }
                                <strong>
                                  {
                                    " Online Store > Themes > Current theme > Actions > Edit code."
                                  }
                                </strong>

                                {" Find"}
                                <strong>{" theme.liquid"}</strong>

                                {
                                  " file in the left menu and add this script right before closing "
                                }
                                <strong>{" </head>"}</strong>

                                {" tag."}
                              </Text>

                              <span className="Custom-TextField-Label">
                                <TextField
                                  disabled
                                  type="text"
                                  label={
                                    <span className="Custom-Label">
                                      <span>Script</span>
                                      <span>
                                        <p id="copyToCliboard">Copied</p>
                                        <Button
                                          onClick={() =>
                                            copyTextToClipboard(
                                              "copyToCliboard",
                                              '<script data-checkify-url="https://ecommercehack.com" async="" src="https://ecommercehack.com/script.js"></script>'
                                            )
                                          }
                                        >
                                          <img
                                            src={clipBoard}
                                            alt="clipboard"
                                          />
                                        </Button>
                                      </span>
                                    </span>
                                  }
                                  value='<script data-checkify-url="https://ecommercehack.com" async="" src="https://ecommercehack.com/script.js"></script>'
                                  autoComplete="off"
                                />
                              </span>

                              <br />
                              <Text variant="bodyMd" as="p">
                                {
                                  " If you would like to temporarily disable Checkify on your store, convert this script to a comment. For this, locate this script in"
                                }
                                <strong>{" theme.liquid"} </strong>
                                {" and enclose it in"}
                                <strong> {" <!--"} </strong>
                                {" and "}
                                <strong> {" -->"} </strong>
                                {
                                  " tags. Thus, when you want to enable Checkify, you can simply remove the comment tags."
                                }
                              </Text>

                              <Button
                                primary
                                loading={btnLoading}
                                onClick={publishScript}
                              >
                                Republish Script
                              </Button>
                            </Card.Section>
                          </Card>
                        </span>
                      </Layout.Section>
                    </Layout>
                  </div>
                );

              case 2:
                return (
                  <div className="Buy-Link-Tab">
                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                          Buy link
                        </Text>

                        <Text variant="bodyMd" as="p">
                          You can send them to customers directly or add to
                          custom landings, use in email marketing, etc.
                        </Text>
                      </Layout.Section>

                      <Layout.Section>
                        <span className="Flex-Space-Start">
                          <Card>
                            <Card.Section>
                              <Text variant="headingMd" as="h6">
                                Direct Checkout Link Template
                              </Text>

                              <Text variant="bodyMd" as="p">
                                Direct checkout links ("Buy Links") are created
                                from the product(s) variant ID, their quantity
                                and discount code (optional). You can share them
                                with customers, add to the custom landings, use
                                in email marketing etc.
                              </Text>

                              <span className="Custom-TextField-Label">
                                <TextField
                                  disabled
                                  type="text"
                                  label={
                                    <span className="Custom-Label">
                                      <span>Generated link</span>
                                      <span>
                                        <p id="copyToCliboard">Copied</p>
                                        <Button
                                          onClick={() =>
                                            copyTextToClipboard(
                                              "copyToCliboard",
                                              `https://ecommercehack.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`
                                            )
                                          }
                                        >
                                          <img
                                            src={clipBoard}
                                            alt="clipboard"
                                          />
                                        </Button>
                                      </span>
                                    </span>
                                  }
                                  value={`https://ecommercehack.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`}
                                  autoComplete="off"
                                />
                              </span>
                              <br />
                              <Text variant="headingMd" as="h6">
                                Use this template to create “Buy Link” for your
                                store:
                              </Text>
                              <br />
                              <Text variant="bodyMd" as="p">
                                {`https://ecommercehack.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=[VARIANT-ID-1]:[QUANTITY-1],[VARIANT-ID-2]:[QUANTITY-2]&discount=[DISCOUNT CODE]`}
                              </Text>

                              <Text variant="bodyMd" as="p">
                                {`Link example: https://ecommercehack.com/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=123456789:1&discount=CHECKIFY`}
                              </Text>
                              <br />
                              <a
                                href="https://help.checkify.pro/en/articles/4784506-direct-checkout-links-buy-links"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button plain>
                                  Go to helpdesk
                                  <Icon source={ExternalMinor}></Icon>
                                </Button>
                              </a>
                            </Card.Section>
                          </Card>
                        </span>
                      </Layout.Section>
                    </Layout>
                  </div>
                );

              default:
                break;
            }
          })()}
        </Tabs>
      </Page>
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}

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
