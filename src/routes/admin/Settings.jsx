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
  ChoiceList,
  Modal,
  TextContainer,
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
  CustomSelect,
  NotifyBanner,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import {
  useAuthState,
  useAuthDispatch,
} from "../../components/providers/AuthProvider";

function reducer(currentState, newState) {
  return { ...currentState, ...newState };
}
const initialStateDomainSettings = {
  domainOption: "default",
  subdomain: "pay",
  domain: "https://google.com",
};

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
  const [themeModelShow, setThemeModelShow] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState('');

  const [domainSettings, domainSettingDispatch] = useReducer(
    reducer,
    initialStateDomainSettings
  );

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
      id: "2",
      content: "Checkout Republic Script",
    },
    {
      id: "1",
      content: "Custom Domain",
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
    let data = {
      theme_id: selectedThemeId
    };
    try {
      const response = await axios.post(`${apiUrl}/api/script-publish`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      console.log("publishScript Api response: ", response.data);
      setToastMsg("Sucessfully Published");
      setSucessToast(true);
      setBtnLoading(false);
      setThemeModelShow(false);
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

  const[themeoptions, setThemeOptions] = useState([]);
  const fetchTheme = async() =>{
    try{
      const resp = await axios.post(`${apiUrl}/api/theme-list`,{},{
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });
let response = resp?.data?.body?.themes;
       let options =[] 
       response?.map(({id,name,role})=>{
        options.push({label:name+ ` ${role=='main'?' (main)':''}`,value:id});
      });
      setThemeOptions(options.reverse());
      response?.length && setSelectedThemeId(response[response?.length-1]?.id)
    }catch(e){

    }
  }
useEffect(() => {
  fetchTheme();

}, [])
useEffect(() => {
  console.log(themeoptions);

}, [themeoptions])
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
          domainSettings,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        //   console.log("connectDomain Api response: ", response.data);
        if (response.data?.errors) {
          // setToastMsg(response.data?.message);
          setErrorToast(true);
        } else {
          dispatch({
            user: response.data?.user,
          });
          domainSettingDispatch({
            domainOption: response.data?.user?.domainOption,
            subdomain: response.data?.user?.subdomain,
            domain: response.data?.user.domain,
          });
          // domainSettingDispatch(response.data?.user);
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
  const getUserDomain = async () => {
    let resp = await axios.get(`${apiUrl}/api/profile`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    // domainSettingDispatch(resp?.data?.user);
    domainSettingDispatch({
      domainOption: resp.data?.data?.domainOption,
      subdomain: resp.data?.data?.subdomain,
      domain: resp.data?.data?.domain,
    });
  };
  useEffect(() => {
    getUserDomain();
  }, []);

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
              placeholder="https://example.com"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
            />

            <div className="domain-sheet-divider"></div>

            <Text variant="headingMd" as="h6">
              Create a DNS A Record
            </Text>

            <Text variant="bodyMd" as="p" color="subdued">
              Create a new A record in your in your domain provider using
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
                    @
                  </Text>
                </Stack>
              </div>
            </Card>

            <Card subdued title="Ponits to / Value">
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
                  157.245.89.162
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
       {/* <NotifyBanner/> */}
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {(() => {
            switch (selectedTab) {
              case 1:
                return (
                  <div className="Custom-Domain-Tab">
                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                          Connect your domain to Checkout Republic
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
                            <ChoiceList
                              title={"Select Domain options"}
                              choices={[
                                {
                                  label: "Default Domain",
                                  value: "default",
                                },
                                // {
                                //   label: "Sub Domain",
                                //   value: "subdomain",
                                // },
                                {
                                  label: "Custom Domain",
                                  value: "customdomain",
                                },
                              ]}
                              // disabled={checkoutSettings?.isEnable == 0}
                              selected={domainSettings?.domainOption??'default'}
                              onChange={(value) => {
                                domainSettingDispatch({
                                  domainOption: value[0],
                                });
                              }}
                            />
                            {/* {(() => {
                              switch (domainSettings?.domainOption) {
                                case "default":
                                  break;
                                case "subdomain":
                                  return (
                                    <>
                                      <div className="connect-domain">
                                        <InputField
                                          marginTop
                                          label={
                                            <Stack
                                              alignment="center"
                                              distribution="equalSpacing"
                                            >
                                              <p>Set your custom subdomain</p>
                                            </Stack>
                                          }
                                          suffix=".checkoutrepublic.com"
                                          value={customSubDomain}
                                          onChange={(e) =>
                                            setCustomSubDomain(e.target.value)
                                          }
                                        />
                                      </div>
                                    </>
                                  );
                                  break;
                                case "customdomain":
                                  return (
                                    <>
                                      <div className="connect-domain">
                                        <Button
                                          primary
                                          size="slim"
                                          onClick={handleDomainSheet}
                                        >
                                          Connect Domain
                                        </Button>
                                      </div>
                                    </>
                                  );
                                  break;
                                default:
                                  break;
                              }
                            })()} */}

                            {domainSettings?.domainOption == "subdomain" && (
                              <div className="connect-domain">
                                <InputField
                                  marginTop
                                  label={
                                    <Stack
                                      alignment="center"
                                      distribution="equalSpacing"
                                    >
                                      <p>Set your custom subdomain</p>
                                    </Stack>
                                  }
                                  suffix=".checkoutrepublic.com"
                                  value={domainSettings?.subdomain}
                                  onChange={(e) =>
                                     domainSettingDispatch({
                                        subdomain:e.target.value
                                     })
                                    // setCustomSubDomain(e.target.value)
                                  }
                                />
                              </div>
                            )}
                          </Card.Section>
                          <Card.Section>
                            <Stack distribution="equalSpacing">
                              {domainSettings?.domainOption ==
                              "customdomain" ? (
                                <Button primary onClick={handleDomainSheet}>
                                  Connect Domain
                                </Button>
                              ) : (
                                <Button
                                  primary
                                  onClick={connectDomain}
                                  loading={btnLoading["connectDomain"]}
                                >
                                  Save
                                </Button>
                              )}
                              <Stack>
                                <Text variant="headingSm" as="h6">
                                  Primary Domain:
                                </Text>

                                <Text variant="bodyMd" as="p">
                                  {`${domainSettings?.domainOption=='default'?'pay.checkoutrepublic.com':''}`}
                                  {`${domainSettings?.domainOption=='subdomain'?domainSettings?.subdomain+'.checkoutrepublic.com':''}`}
                                  {`${domainSettings?.domainOption=='customdomain'?domainSettings?.domain:''}`}
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
                        Checkout Republic branding
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
                                Remove “©️ Checkout Republic” label from your checkout
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

              case 0:
                return (
                  <div className="Checkify-Script-Tab">
                    <Layout>
                      <Layout.Section secondary>
                        <Text variant="headingMd" as="h6">
                        Checkout Republic Script
                        </Text>

                        <Text variant="bodyMd" as="p">
                          This script was automatically generated and embedded
                          into your Shopify Store theme when Checkout Republic connects.
                        </Text>

                        <Text variant="bodyMd" as="p">
                          With all permissions granted, this script redirects
                          users to Checkout Republic checkout from the shopping cart
                          and buy buttons.
                        </Text>
                      </Layout.Section>

                      <Layout.Section>
                        <span className="Flex-Space-Start">
                          <Card>
                            <Card.Section>
                              <Text variant="headingMd" as="h6">
                              Checkout Republic Script
                              </Text>

                              <Text variant="bodyMd" as="p">
                                This script was automatically generated and
                                embedded into your Shopify Store theme when
                                Checkout Republic connects. With all permissions granted,
                                this script redirects users to Checkout Republic
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
                                              `<script data-checkout-republic-url="${apiUrl}" async="" src="${apiUrl}"></script>`
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
                                  value={`<script data-checkout-republic-url="${apiUrl}" async="" src="${apiUrl}"></script>`}
                                  autoComplete="off"
                                />
                              </span>

                              <br />
                              <Text variant="bodyMd" as="p">
                                {
                                  " If you would like to temporarily disable Checkout Republic on your store, convert this script to a comment. For this, locate this script in"
                                }
                                <strong>{" theme.liquid"} </strong>
                                {" and enclose it in"}
                                <strong> {" <!--"} </strong>
                                {" and "}
                                <strong> {" -->"} </strong>
                                {
                                  " tags. Thus, when you want to enable Checkout Republic, you can simply remove the comment tags."
                                }
                              </Text>

                              <Button
                                primary
                                onClick={()=>setThemeModelShow(true)}
                              >
                                Choose theme
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
                                              `${apiUrl}/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`
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
                                  value={`${apiUrl}/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=`}
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
                                {`${apiUrl}/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=[VARIANT-ID-1]:[QUANTITY-1],[VARIANT-ID-2]:[QUANTITY-2]&discount=[DISCOUNT CODE]`}
                              </Text>

                              <Text variant="bodyMd" as="p">
                                {`Link example: ${apiUrl}/api/checkoutByItems?store=${user?.shopifyShopDomainName}=&items=123456789:1&discount=CheckoutRepublic`}
                              </Text>
                              {/* <br />
                              <a
                                // href="https://help.checkify.pro/en/articles/4784506-direct-checkout-links-buy-links"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button plain>
                                  Go to helpdesk
                                  <Icon source={ExternalMinor}></Icon>
                                </Button>
                              </a> */}
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
       <Modal
       
        open={themeModelShow}
        onClose={()=>setThemeModelShow(false)}
        title="Choose theme"
        primaryAction={{
          content: 'Publish Script',
          onAction: publishScript,
          loading:btnLoading
        }}
     
      >
        <Modal.Section>
          <TextContainer>
            <p>
            Choose the theme where you want to publish
            </p>
            <CustomSelect
                            label='Select Theme'
                            name='theme_id'
                            value={selectedThemeId}
                            onChange={(e)=>{setSelectedThemeId(e.target.value)}}
                            options={themeoptions}
                            // error={billingFormErrors.country && "Select your Theme"}
            />
          </TextContainer>
        </Modal.Section>
      </Modal>
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
