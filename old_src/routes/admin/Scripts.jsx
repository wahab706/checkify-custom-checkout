import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Page,
  Layout,
  Sheet,
  Card,
  ButtonGroup,
  Button,
  Icon,
  Tabs,
  Text,
  TextField,
  Modal,
  Toast,
  Scrollable,
  Stack,
  EmptyState,
  ResourceList,
  ResourceItem,
  TextContainer,
  Form,
  FormLayout,
  Loading,
} from "@shopify/polaris";
import {
  MobileCancelMajor,
  DeleteMinor,
  ExternalMinor,
  EditMinor,
} from "@shopify/polaris-icons";
import clipBoard from "../../assets/icons/clipBoard.svg";

import axios from "axios";
import {
  SkeltonTabsWithThumbnail,
  getAccessToken,
  InputField,
  CustomSelect,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";

export function Scripts() {
  const [selectedTab, setSelectedTab] = useState(0);
  const { apiUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [scriptsData, setScriptsData] = useState([]);
  const [scriptId, setScriptId] = useState();
  const [modalDeleteScript, setModalDeleteScript] = useState(false);
  const [scriptSheet, setScriptSheet] = useState(false);
  const [editScriptToggle, setEditScriptToggle] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const [script, setScript] = useState({
    type: "header", // header || footer
    page: "checkout", // checkout || thankYouPage || all
    title: "",
    script: "",
  });

  const tabs = [
    {
      id: "1",
      content: "Scripts",
    },
    // {
    //     id: '2',
    //     content: 'Checkify API'
    // },
  ];

  const handleTabChange = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
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

  const handleDeleteScriptModal = () => {
    setModalDeleteScript(!modalDeleteScript);
    setScriptId();
  };

  const handleScriptSheet = () => {
    setScriptSheet(!scriptSheet);
    setEditScriptToggle(false);
    setScriptId();
    setScriptError(false);
    setScript({
      type: "header",
      page: "checkout",
      title: `Custom script #${scriptsData?.length + 1}`,
      script: "",
    });
  };

  const handleDeleteScript = (id) => {
    setScriptId(id);
    setModalDeleteScript(true);
  };

  const handleScript = (e) => {
    if (e.target.name == "script") {
      setScriptError(false);
    }
    setScript({ ...script, [e.target.name]: e.target.value });
  };

  const EmptyCard = () => {
    return (
      <div className="Empty-State-Card">
        <Card sectioned>
          <EmptyState
            heading="You don't have any custom scripts yet"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>
              You can add custom scripts to connect apps that do not have
              official integration with Checkify and do not require variables
              from the checkout page (support chats, tracking affiliate
              programs, etc.).
            </p>
            <Button primary onClick={handleScriptSheet}>
              Add Script
            </Button>
          </EmptyState>
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

  function copyTextToClipboard(text) {
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
      document.getElementById("copyToCliboard").style.display = "block";

      const timer = setTimeout(() => {
        document.getElementById("copyToCliboard").style.display = "none";
      }, 1000);
    } catch (err) {
      alert("unable to copy");
    }

    document.body.removeChild(textArea);
  }

  function validateScript() {
    let str = script.script;
    // let re1 = /<(script)[^>]*>[\s\S]*?<\/(script)>/gi;
    // let re2 = /<(noscript)[^>]*>[\s\S]*?<\/(noscript)>/gi;
    // let re3 = /<(style)[^>]*>[\s\S]*?<\/(style)>/gi;
    // let resp = re1.test(str) || re2.test(str) || re3.test(str);

    let regex = /<(script|style|noscript)([\s\S]*?)>[\s\S]*?<\/\1>/gi;
    // let regex = /<(script)([\s\S]*?)>[\s\S]*?<\/\1>/gi;
    let resp = regex.test(str);
    return resp;
  }

  const getScripts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/custom_script`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log('getScripts response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setScriptsData(response.data?.data);
        setToggleLoadData(false);
        setLoading(false);
      }
    } catch (error) {
      console.warn("getScripts Api Error", error.response);
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

  const deleteScript = async () => {
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
        `${apiUrl}/api/custom_script/${scriptId}/delete`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('deleteScript response: ', response.data);
      setBtnLoading(false);
      setToastMsg("Script Deleted");
      setSucessToast(true);
      handleDeleteScriptModal();
      setToggleLoadData(true);
    } catch (error) {
      console.warn("deleteScript Api Error", error.response);
      setBtnLoading(false);
      handleDeleteScriptModal();
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  const createScript = async (e) => {
    e.preventDefault();

    let data = {
      type: script.type,
      page: script.page,
      title: script.title,
      script: script.script,
      isEnabled: 1,
    };

    if (validateScript()) {
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
          `${apiUrl}/api/custom_script/store`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('createScript response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleScriptSheet();
          setToastMsg("Script Created Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("createScript Api Error", error.response);
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setScriptError(true);
    }
  };

  const editScript = async (id) => {
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
        `${apiUrl}/api/custom_script/${id}/edit`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      // console.log('editScript response: ', response.data);
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setScript({
          type: response.data.data?.type,
          page: response.data.data?.page,
          title: response.data.data?.title,
          script: response.data.data?.script,
        });

        setScriptId(id);
        setEditScriptToggle(true);

        setTimeout(() => {
          setScriptSheet(true);
          setResourceLoading(false);
          setBtnLoading(false);
        }, 500);
      }
    } catch (error) {
      console.warn("editScript Api Error", error.response);
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

  const updateScript = async (e) => {
    e.preventDefault();

    let data = {
      type: script.type,
      page: script.page,
      title: script.title,
      script: script.script,
    };

    if (validateScript()) {
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
        const response = await axios.put(
          `${apiUrl}/api/custom_script/${scriptId}/update`,
          data,
          {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
          }
        );

        // console.log('updateScript response: ', response.data);
        if (response.data.errors) {
          setToastMsg(response.data.message);
          setErrorToast(true);
        } else {
          handleScriptSheet();
          setEditScriptToggle(false);
          setToastMsg("Script Updated Sucessfully");
          setSucessToast(true);
          setToggleLoadData(true);
        }
        setBtnLoading(false);
      } catch (error) {
        console.warn("updateScript Api Error", error.response);
        if (error.response?.data?.message) {
          setToastMsg(error.response?.data?.message);
        } else {
          setToastMsg("Server Error");
        }
        setErrorToast(true);
        setBtnLoading(false);
      }
    } else {
      setScriptError(true);
    }
  };

  const updateScriptStatus = async (id, value) => {
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

    let enableValue = "";
    let offerStatus = "";
    if (value == 0) {
      enableValue = 1;
      offerStatus = "Script Enabled";
    } else {
      enableValue = 0;
      offerStatus = "Script Disabled";
    }

    let data = {
      isEnabled: enableValue,
    };

    try {
      const response = await axios.put(
        `${apiUrl}/api/custom_script/${id}/update`,
        data,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      setBtnLoading(false);
      setResourceLoading(false);
      setToastMsg(offerStatus);
      setSucessToast(true);
      setToggleLoadData(true);
    } catch (error) {
      console.warn("updateScriptStatus Api Error", error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
      setResourceLoading(false);
    }
  };

  useEffect(() => {
    if (toggleLoadData) {
      getScripts();
    }
  }, [toggleLoadData]);

  return (
    <div className="Integrations-Page">
      <Modal
        small
        open={modalDeleteScript}
        onClose={handleDeleteScriptModal}
        title="Delete script?"
        loading={btnLoading[2]}
        primaryAction={{
          content: "Delete",
          destructive: true,
          disabled: btnLoading[2],
          onAction: deleteScript,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            disabled: btnLoading[2],
            onAction: handleDeleteScriptModal,
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
        open={scriptSheet}
        onClose={handleScriptSheet}
        accessibilityLabel="Add Script"
      >
        <Form onSubmit={editScriptToggle ? updateScript : createScript}>
          <div className="Sheet-Container">
            <div className="Sheet-Header">
              <Text variant="headingMd" as="h2">
                {editScriptToggle ? "Edit Script " : "Add Script "}
              </Text>
              <Button
                accessibilityLabel="Cancel"
                icon={MobileCancelMajor}
                onClick={handleScriptSheet}
                plain
              />
            </div>

            <Scrollable className="Sheet-Scrollable">
              <FormLayout>
                <span>
                  <Text variant="headingMd" as="h6">
                    Select script type
                  </Text>
                  <Text
                    variant="bodyMd"
                    as="p"
                    fontWeight="regular"
                    color="subdued"
                  >
                    To understand the correct place for your code, carefully
                    read the instructions from the script provider.
                  </Text>
                </span>

                <FormLayout.Group>
                  <CustomSelect
                    label="Select Type"
                    name="type"
                    value={script.type}
                    onChange={handleScript}
                    options={[
                      { label: "Script in header", value: "header" },
                      { label: "Script in footer", value: "footer" },
                    ]}
                  />

                  <CustomSelect
                    label="Select Page"
                    name="page"
                    value={script.page}
                    onChange={handleScript}
                    options={[
                      { label: "Only for checkout page", value: "checkout" },
                      {
                        label: "Only for thank you page",
                        value: "thankYouPage",
                      },
                      {
                        label: "Both for checkout and thank you pages",
                        value: "all",
                      },
                    ]}
                  />
                </FormLayout.Group>

                <span>
                  <Text variant="headingMd" as="h6">
                    Script title
                  </Text>
                  <Text
                    variant="bodyMd"
                    as="p"
                    fontWeight="regular"
                    color="subdued"
                  >
                    Give this script a short name to make it easy to identify.
                    It won’t be visible for anyone else.
                  </Text>
                </span>

                <InputField
                  type="text"
                  label="Script title"
                  name="title"
                  value={script.title}
                  onChange={handleScript}
                  autoComplete="off"
                  required
                />

                <span>
                  <Text variant="headingMd" as="h6">
                    Script
                  </Text>
                  <Text
                    variant="bodyMd"
                    as="p"
                    fontWeight="regular"
                    color="subdued"
                  >
                    {`Make sure that your piece of code enclosed in <script> ... </script>, <noscript> ... </noscript>, <style> ... </style> tags.`}
                  </Text>
                </span>

                <InputField
                  type="text"
                  label="Script"
                  name="script"
                  value={script.script}
                  onChange={handleScript}
                  autoComplete="off"
                  required
                  multiline={4}
                  error={scriptError && "Invalid Script"}
                />
              </FormLayout>
            </Scrollable>

            <div className="Sheet-Footer">
              <Button onClick={handleScriptSheet}>Cancel</Button>
              <Button primary submit loading={btnLoading[3]}>
                {editScriptToggle ? "Update Script " : "Add Script "}
              </Button>
            </div>
          </div>
        </Form>
      </Sheet>

      {loading && <Loading />}
      <Page
        title="Scripts & API"
        fullWidth
        primaryAction={{
          content: selectedTab == 0 && "Add Script",
          onAction: selectedTab == 0 && handleScriptSheet,
          disabled: selectedTab == 1,
        }}
        secondaryActions={
          <ButtonGroup>
            <a
              href="https://help.checkify.pro/en/articles/4367163-general-customization-settings"
              target="_blank"
            >
              <Button>
                Explore the guide <Icon source={ExternalMinor}></Icon>
              </Button>
            </a>
          </ButtonGroup>
        }
      >
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          {loading ? (
            <SkeltonTabsWithThumbnail />
          ) : (
            <>
              {(() => {
                switch (selectedTab) {
                  case 0:
                    return (
                      <div className="Scripts-Tab Custom-ResourceList Custom-ResourceList-Offers">
                        {scriptsData?.length > 0 ? (
                          <span>
                            <ResourceList
                              loading={resourceLoading}
                              resourceName={{
                                singular: "script",
                                plural: "scripts",
                              }}
                              items={scriptsData}
                              renderItem={(item) => {
                                const { id, type, page, title, isEnabled } =
                                  item;

                                return (
                                  <Card>
                                    <ResourceItem
                                      id={id}
                                      accessibilityLabel={`View details for ${title}`}
                                      name={title}
                                    >
                                      <div>
                                        <Text
                                          variant="bodyMd"
                                          as="p"
                                          fontWeight="bold"
                                        >
                                          {title}
                                        </Text>

                                        <span style={{ display: "flex" }}>
                                          {type == "header" && (
                                            <Text
                                              variant="bodyMd"
                                              as="p"
                                              color="subdued"
                                            >
                                              Script in header
                                            </Text>
                                          )}
                                          {type == "footer" && (
                                            <Text
                                              variant="bodyMd"
                                              as="p"
                                              color="subdued"
                                            >
                                              Script in footer
                                            </Text>
                                          )}
                                          &nbsp; {"·"} &nbsp;
                                          {page == "checkout" && (
                                            <Text
                                              variant="bodyMd"
                                              as="p"
                                              color="subdued"
                                            >
                                              Only for checkout page
                                            </Text>
                                          )}
                                          {page == "thankYouPage" && (
                                            <Text
                                              variant="bodyMd"
                                              as="p"
                                              color="subdued"
                                            >
                                              Only for thank you page
                                            </Text>
                                          )}
                                          {page == "all" && (
                                            <Text
                                              variant="bodyMd"
                                              as="p"
                                              color="subdued"
                                            >
                                              Both for checkout and thank you
                                              pages
                                            </Text>
                                          )}
                                        </span>
                                      </div>

                                      <div className="Action-Section">
                                        <span
                                          onClick={() =>
                                            updateScriptStatus(id, isEnabled)
                                          }
                                        >
                                          <input
                                            id={id}
                                            type="checkbox"
                                            className="tgl tgl-light"
                                            checked={convertNumberToBoolean(
                                              isEnabled
                                            )}
                                          />
                                          <label
                                            htmlFor={id}
                                            className="tgl-btn"
                                          ></label>
                                        </span>

                                        <ButtonGroup>
                                          <Button
                                            onClick={() => editScript(id)}
                                          >
                                            <Icon source={EditMinor}></Icon>
                                          </Button>

                                          <Button
                                            onClick={() =>
                                              handleDeleteScript(id)
                                            }
                                          >
                                            <Icon source={DeleteMinor}></Icon>
                                          </Button>
                                        </ButtonGroup>
                                      </div>
                                    </ResourceItem>
                                  </Card>
                                );
                              }}
                            />
                          </span>
                        ) : (
                          <EmptyCard />
                        )}
                      </div>
                    );

                  case 1:
                    return (
                      <div className="API-Tab">
                        <Layout>
                          <Layout.Section secondary>
                            <Text variant="headingMd" as="h6">
                              Checkify API
                            </Text>

                            <Text variant="bodyMd" as="p">
                              Provide third-party apps with access to the data
                              of your checkout.
                            </Text>
                          </Layout.Section>

                          <Layout.Section>
                            <Card>
                              <Card.Section>
                                <Text variant="headingMd" as="h6">
                                  Connect Checkify to external services
                                </Text>

                                <Text variant="bodyMd" as="p">
                                  Keep this information secure and share only
                                  with Checkify-supported apps.
                                </Text>
                                <span className="Custom-TextField-Label">
                                  <TextField
                                    disabled
                                    type="text"
                                    label={
                                      <span className="Custom-Label">
                                        <span>API Key</span>
                                        <span>
                                          <p id="copyToCliboard">Copied</p>
                                          <Button
                                            onClick={() =>
                                              copyTextToClipboard(
                                                "chk_b750bb7b0616db79df49fbfa"
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
                                    value="chk_b750bb7b0616db79df49fbfa"
                                    autoComplete="off"
                                  />
                                </span>
                              </Card.Section>
                              <Card.Section>
                                <ButtonGroup>
                                  <a
                                    href="https://help.checkify.pro/en/articles/5480533-connect-zapier"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button>
                                      <svg
                                        width="70"
                                        height="22"
                                        viewBox="0 0 57 26"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M34.1066 11.2892H32.6898C32.6607 11.1732 32.639 11.0387 32.6246 10.8861C32.5957 10.5889 32.5957 10.2897 32.6246 9.99258C32.639 9.84026 32.6607 9.70589 32.6898 9.58926H36.2206V20.7696C36.0439 20.8004 35.8657 20.8221 35.6867 20.8347C35.5089 20.8483 35.3307 20.8555 35.1524 20.8563C34.9816 20.8552 34.8109 20.848 34.6406 20.8347C34.4617 20.822 34.2836 20.8002 34.1069 20.7693V11.2887V11.2889L34.1066 11.2892ZM46.398 14.1008C46.398 13.6939 46.3435 13.3053 46.2348 12.9345C46.1257 12.5643 45.9654 12.2411 45.7553 11.9649C45.5442 11.6891 45.2756 11.4673 44.9487 11.3003C44.6219 11.1332 44.2331 11.0495 43.7827 11.0495C42.8965 11.0495 42.2171 11.3187 41.745 11.8561C41.2728 12.3935 40.986 13.1418 40.8842 14.1008H46.3982H46.398ZM40.8625 15.7134C40.8916 16.9339 41.2076 17.8276 41.8105 18.3939C42.4132 18.9605 43.3033 19.2442 44.4802 19.2442C45.5115 19.2442 46.4923 19.0623 47.4221 18.6992C47.5381 18.9171 47.6325 19.1823 47.7052 19.4947C47.7766 19.7988 47.8203 20.1088 47.8359 20.4208C47.3568 20.6247 46.8297 20.7766 46.2562 20.8786C45.6819 20.9799 45.0463 21.0311 44.3494 21.0311C43.332 21.0311 42.4601 20.889 41.734 20.606C41.0074 20.3223 40.4081 19.9228 39.9359 19.4072C39.4638 18.8916 39.1186 18.2813 38.9006 17.5765C38.6828 16.872 38.5736 16.0982 38.5736 15.2556C38.5736 14.4274 38.6789 13.6536 38.8896 12.9343C39.0999 12.2155 39.4239 11.5906 39.8593 11.0603C40.2953 10.5298 40.8437 10.1086 41.5049 9.79627C42.1656 9.48388 42.9465 9.32747 43.8477 9.32747C44.6176 9.32747 45.2932 9.45842 45.8746 9.71988C46.4554 9.98133 46.9423 10.341 47.3347 10.7987C47.7269 11.2564 48.0247 11.8013 48.2282 12.433C48.4315 13.0653 48.5336 13.7516 48.5336 14.4928C48.5336 14.6963 48.5258 14.9104 48.5114 15.1355C48.4995 15.3282 48.485 15.5207 48.468 15.713H40.862L40.8622 15.7133L40.8625 15.7134ZM50.9103 9.58926C51.062 9.56173 51.2146 9.53996 51.368 9.52401C51.5129 9.5098 51.6658 9.50241 51.8256 9.50241C51.9855 9.50241 52.1451 9.5098 52.3051 9.52401C52.4648 9.53879 52.6102 9.56062 52.7411 9.58926C52.7843 9.80729 52.8279 10.0946 52.8713 10.4501C52.9149 10.8062 52.937 11.1074 52.937 11.3545C53.242 10.8607 53.6452 10.4318 54.1463 10.0685C54.6476 9.70555 55.2905 9.52367 56.0749 9.52367C56.1911 9.52367 56.3109 9.52754 56.4345 9.53481C56.5402 9.54049 56.6459 9.55118 56.7505 9.56721C56.7794 9.69816 56.8017 9.83639 56.816 9.98144C56.8303 10.1266 56.8376 10.2793 56.8376 10.439C56.8376 10.6135 56.8268 10.7953 56.8051 10.9837C56.7841 11.1659 56.7587 11.3475 56.7289 11.5285C56.6112 11.4995 56.4904 11.4849 56.3691 11.4849H56.0747C55.6825 11.4849 55.3083 11.5395 54.9524 11.6483C54.5961 11.7574 54.2767 11.95 53.9934 12.2258C53.7104 12.502 53.485 12.8798 53.3182 13.3593C53.1507 13.8388 53.0674 14.4563 53.0674 15.2117V20.7693C52.8907 20.8 52.7124 20.8219 52.5334 20.8346C52.3375 20.8491 52.1594 20.8562 51.9997 20.8562C51.8214 20.8554 51.6433 20.8482 51.4656 20.8346C51.2794 20.821 51.094 20.7993 50.9097 20.7694V9.58938L50.9103 9.58926ZM35.6147 3.61945C35.6147 3.8803 35.5676 4.13901 35.4757 4.38312C35.2315 4.47508 34.9727 4.52221 34.7118 4.52226H34.7086C34.4477 4.5223 34.1889 4.4752 33.9447 4.38324C33.8526 4.13908 33.8054 3.88028 33.8055 3.61933V3.61592C33.8055 3.34708 33.8548 3.0896 33.9441 2.85202C34.1884 2.75993 34.4473 2.71283 34.7083 2.71299H34.7112C34.9802 2.71299 35.2375 2.76233 35.4751 2.85202C35.5672 3.09618 35.6143 3.35499 35.6142 3.61592V3.61933H35.6145L35.6147 3.61945ZM38.2777 3.01469H36.1661L37.6591 1.52155C37.4243 1.19183 37.1361 0.903675 36.8063 0.668984L35.313 2.16212V0.0503585C35.1145 0.0169589 34.9135 0.000114766 34.7121 0H34.7083C34.5034 0 34.3028 0.0175061 34.1073 0.0503585V2.16212L32.6137 0.66887C32.4492 0.785942 32.2948 0.916597 32.1521 1.05946L32.1515 1.06014C32.0088 1.2029 31.8783 1.35728 31.7612 1.52167L33.2548 3.01469H31.1427C31.1427 3.01469 31.0925 3.41142 31.0925 3.61649V3.61899C31.0925 3.82406 31.1099 4.02504 31.1428 4.22068H33.2549L31.7611 5.71359C31.9961 6.04327 32.2843 6.33148 32.614 6.56639L34.1074 5.07336V7.18524C34.3027 7.21798 34.503 7.23526 34.7076 7.23548H34.7127C34.9138 7.2353 35.1146 7.21849 35.3129 7.18524V5.07336L36.8064 6.56673C36.9709 6.44955 37.1254 6.3189 37.2683 6.17614H37.2686C37.4112 6.03323 37.5417 5.87874 37.6587 5.71427L36.1657 4.22079H38.2778C38.3106 4.02527 38.3278 3.82497 38.3278 3.62036V3.61513C38.3278 3.41392 38.311 3.21328 38.2778 3.01492V3.01469H38.2777ZM0 20.4647L5.88433 11.311H0.697289C0.653865 11.0495 0.632153 10.7592 0.632153 10.4394C0.632153 10.1345 0.654206 9.85083 0.697744 9.58915H9.08818L9.19731 9.873L3.26944 19.048H8.82661C8.87015 19.3387 8.89209 19.6363 8.89209 19.9413C8.89209 20.2323 8.87026 20.5082 8.82672 20.7696H0.109129L0 20.4643V20.4647ZM16.9771 15.5171C16.7592 15.4884 16.483 15.4596 16.1489 15.4302C15.8147 15.4014 15.5315 15.3866 15.2993 15.3866C14.3983 15.3866 13.7118 15.5537 13.24 15.8879C12.7674 16.2224 12.5318 16.7306 12.5318 17.4135C12.5318 17.8493 12.6113 18.1908 12.7713 18.4377C12.9309 18.6851 13.1308 18.8735 13.3706 19.0044C13.6104 19.1351 13.8753 19.2151 14.1657 19.2442C14.4562 19.2732 14.7324 19.2877 14.9939 19.2877C15.3281 19.2877 15.6731 19.2695 16.0291 19.2331C16.3849 19.1971 16.701 19.1424 16.9772 19.0697V15.5171H16.9771ZM16.9771 13.4034C16.9771 12.5459 16.7592 11.9502 16.3234 11.616C15.8874 11.2818 15.2554 11.1147 14.4273 11.1147C13.9184 11.1147 13.4429 11.1549 12.9999 11.2347C12.5615 11.3134 12.1283 11.4188 11.7028 11.5504C11.4266 11.0709 11.2891 10.4974 11.2891 9.82866C11.7824 9.66906 12.3272 9.54561 12.9232 9.45842C13.5188 9.37112 14.0927 9.32747 14.645 9.32747C16.0978 9.32747 17.2019 9.65826 17.9575 10.3193C18.7128 10.9809 19.0909 12.0377 19.0909 13.4904V20.4863C18.5821 20.6024 17.9648 20.7222 17.2384 20.8458C16.5039 20.9698 15.7603 21.0318 15.0155 21.0311C14.3036 21.0311 13.6605 20.966 13.0868 20.8351C12.5128 20.7041 12.026 20.4939 11.6266 20.2029C11.2267 19.9125 10.9184 19.5419 10.7001 19.0917C10.4823 18.6412 10.3733 18.0964 10.3733 17.457C10.3733 16.8325 10.5004 16.2839 10.7547 15.8114C11.0045 15.3447 11.3589 14.9419 11.79 14.6347C12.2259 14.3227 12.7271 14.0899 13.2937 13.9376C13.8605 13.7849 14.456 13.7085 15.0807 13.7085C15.5457 13.7085 15.927 13.7197 16.225 13.7415C16.5226 13.7631 16.7734 13.7886 16.9768 13.8177V13.4036L16.9771 13.4034ZM23.6021 18.9386C23.8772 19.0402 24.1621 19.1133 24.4522 19.1566C24.7427 19.2003 25.1201 19.2221 25.5855 19.2221C26.1084 19.2221 26.5877 19.1387 27.0235 18.9716C27.4596 18.8049 27.8336 18.5467 28.146 18.1978C28.4584 17.8493 28.7053 17.4101 28.8869 16.8792C29.0685 16.3492 29.1595 15.7211 29.1595 14.9942C29.1595 13.832 28.9449 12.9094 28.5166 12.2264C28.0877 11.5437 27.3866 11.2022 26.4136 11.2022C26.0504 11.2022 25.7014 11.2675 25.3677 11.3984C25.0331 11.5291 24.7355 11.7253 24.4739 11.9868C24.2124 12.2483 24.0018 12.5791 23.8421 12.9785C23.6818 13.3784 23.6022 13.8538 23.6022 14.4061V18.9389V18.9387L23.6021 18.9386ZM21.4445 9.58904C21.5923 9.55993 21.7412 9.53822 21.8913 9.52378C22.0471 9.50937 22.2035 9.50216 22.36 9.50219C22.5048 9.50219 22.6572 9.50969 22.8174 9.52378C22.977 9.53856 23.1296 9.5605 23.2751 9.58915C23.2894 9.6187 23.3078 9.70908 23.3296 9.86174C23.3512 10.0144 23.3731 10.1778 23.395 10.3519C23.4168 10.5264 23.4385 10.6939 23.4604 10.8532C23.4822 11.0133 23.4931 11.115 23.4931 11.1586C23.638 10.9263 23.8125 10.7009 24.016 10.483C24.2195 10.265 24.4631 10.0689 24.7464 9.89471C25.0297 9.72022 25.3491 9.58233 25.7052 9.48047C26.061 9.37885 26.457 9.32758 26.8929 9.32758C27.5466 9.32758 28.1533 9.43671 28.7129 9.65474C29.2719 9.873 29.7511 10.2103 30.1509 10.668C30.5502 11.1258 30.8625 11.707 31.0879 12.4115C31.313 13.1167 31.4255 13.9484 31.4255 14.9071C31.4255 16.8249 30.906 18.3254 29.867 19.4076C28.828 20.4901 27.3574 21.0311 25.4541 21.0311C25.1344 21.0311 24.8077 21.0093 24.4734 20.9657C24.139 20.922 23.8487 20.8638 23.6015 20.7915V25.913C23.4175 25.943 23.2321 25.9648 23.0461 25.9784C22.8498 25.9926 22.6717 26 22.5118 26C22.3337 25.9992 22.1556 25.992 21.978 25.9784C21.7991 25.9657 21.6209 25.9439 21.4442 25.913V9.58915L21.4445 9.58904Z"
                                          fill="#FF4A00"
                                        />
                                      </svg>
                                    </Button>
                                  </a>

                                  <a
                                    href=""
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ cursor: "default" }}
                                  >
                                    <Button disabled>
                                      <svg
                                        width="70"
                                        height="22"
                                        viewBox="0 0 89 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M8.33833 0.138484C8.88015 0.0474946 9.43658 0 10.0041 0C10.5717 0 11.1281 0.0474946 11.67 0.138484V3.54597C11.1375 3.40874 10.5792 3.33575 10.0041 3.33575C9.42908 3.33575 8.87077 3.40874 8.33833 3.54597V0.138484ZM6.66725 4.23066V0.571697C2.78469 1.94517 0 5.65062 0 10.0013C0 15.5196 4.48037 20 9.99887 20C15.5174 20 19.9976 15.5196 19.9976 10.0013C19.9976 5.65062 17.2132 1.94517 13.3305 0.571697V4.23066C15.3215 5.38328 16.6621 7.53691 16.6621 10.0013C16.6621 13.6787 13.6765 16.6644 9.99887 16.6644C6.32128 16.6644 3.33562 13.6787 3.33562 10.0013C3.33562 7.53691 4.67622 5.38328 6.66725 4.23066ZM26.4444 6.89742H28.0456V13.3024H26.4444V6.89742ZM28.2059 5.08675C28.2059 5.39871 28.136 5.62256 27.9964 5.75805C27.8568 5.89353 27.6104 5.96127 27.2573 5.96127C26.9042 5.96127 26.6579 5.89353 26.5183 5.75805C26.3787 5.62256 26.3089 5.39871 26.3089 5.08675C26.3089 4.78291 26.3787 4.56118 26.5183 4.42157C26.6579 4.28196 26.9042 4.21222 27.2573 4.21222C27.6104 4.21222 27.8568 4.28196 27.9964 4.42157C28.136 4.56118 28.2059 4.78291 28.2059 5.08675ZM29.3507 13.3007V8.94031C29.3507 8.53798 29.4082 8.19302 29.5231 7.90568C29.638 7.61821 29.8146 7.38624 30.0527 7.20976C30.2908 7.03315 30.5947 6.90379 30.9643 6.82168C31.3337 6.73956 31.7731 6.69857 32.2822 6.69857C33.3005 6.69857 34.0415 6.86892 34.5055 7.20976C34.9694 7.55047 35.2014 8.1274 35.2014 8.94031V13.3007H33.6002V9.13741C33.6002 8.94856 33.5878 8.78433 33.5632 8.64472C33.5386 8.50511 33.4831 8.38812 33.397 8.29363C33.3108 8.19927 33.1794 8.1294 33.0028 8.08428C32.8262 8.03916 32.5861 8.01654 32.2822 8.01654C31.9784 8.01654 31.7382 8.03916 31.5617 8.08428C31.3851 8.1294 31.2516 8.19927 31.1614 8.29363C31.071 8.38812 31.0135 8.50511 30.9889 8.64472C30.9643 8.78433 30.9519 8.94856 30.9519 9.13741V13.3007H29.3507ZM39.0768 13.2994H40.0745L40.3332 11.9814H39.1877C38.966 11.9814 38.7832 11.967 38.6395 11.9383C38.4958 11.9095 38.3849 11.852 38.3069 11.7659C38.2289 11.6797 38.1756 11.5585 38.1468 11.4024C38.1181 11.2465 38.1037 11.0452 38.1037 10.7989V8.2123H40.1485L40.4071 6.89433H38.1037V5.14528L36.5025 5.40387V10.8851C36.5025 11.3532 36.5394 11.7433 36.6134 12.0552C36.6872 12.3673 36.8207 12.6158 37.0136 12.8005C37.2066 12.9853 37.4694 13.1146 37.802 13.1885C38.1346 13.2624 38.5595 13.2994 39.0768 13.2994ZM42.7634 10.6401C42.7634 10.9357 42.7799 11.1781 42.8128 11.3669C42.8455 11.5558 42.9133 11.7035 43.016 11.8102C43.1186 11.9171 43.2602 11.991 43.441 12.032C43.6216 12.0731 43.8597 12.0936 44.1554 12.0936H45.1408C45.5102 12.0936 45.9659 12.0853 46.508 12.069L46.2617 13.3007C46.0317 13.3089 45.8265 13.3151 45.6457 13.3192C45.4651 13.3233 45.2906 13.3253 45.1223 13.3253H44.0814C43.4985 13.3253 43.018 13.2597 42.6403 13.1282C42.2626 12.9969 41.9649 12.808 41.7473 12.5617C41.5297 12.3153 41.3777 12.0136 41.2916 11.6564C41.2053 11.2992 41.1622 10.8906 41.1622 10.4308V9.74097C41.1622 9.24828 41.2073 8.81308 41.2977 8.43537C41.3881 8.05754 41.5461 7.73932 41.7719 7.48073C41.9978 7.22201 42.3016 7.02703 42.6834 6.89567C43.0653 6.76431 43.5477 6.69857 44.1306 6.69857C44.6727 6.69857 45.1223 6.75806 45.4795 6.87717C45.8367 6.99628 46.124 7.16251 46.3416 7.37599C46.5592 7.58946 46.7132 7.84206 46.8036 8.13353C46.894 8.425 46.9391 8.74321 46.9391 9.08817V9.29752C46.9391 9.57674 46.9227 9.80459 46.8898 9.98119C46.857 10.1577 46.8016 10.2953 46.7235 10.3938C46.6455 10.4924 46.5449 10.558 46.4218 10.5909C46.2985 10.6237 46.1467 10.6401 45.9659 10.6401H42.7634ZM44.0938 7.90568C43.8146 7.90568 43.5887 7.9283 43.4163 7.97342C43.2439 8.01854 43.1084 8.10066 43.0098 8.21977C42.9113 8.33888 42.8455 8.49899 42.8128 8.70009C42.7799 8.90132 42.7634 9.15791 42.7634 9.47H45.4117V9.18666C45.4117 8.94856 45.3911 8.74733 45.3501 8.5831C45.309 8.41887 45.2393 8.28751 45.1408 8.18902C45.0422 8.09041 44.9067 8.01854 44.7342 7.97342C44.5618 7.9283 44.3484 7.90568 44.0938 7.90568ZM51.5635 11.7056C51.3829 11.7507 51.1447 11.7734 50.8491 11.7734C50.5289 11.7734 50.2743 11.7487 50.0854 11.6994C49.8966 11.6501 49.755 11.5599 49.6605 11.4284C49.566 11.297 49.5045 11.1164 49.4757 10.8865C49.447 10.6566 49.4326 10.3609 49.4326 9.99969V9.75334C49.4326 9.39201 49.4449 9.09629 49.4695 8.86644C49.4942 8.63647 49.5557 8.45587 49.6544 8.32451C49.7528 8.19302 49.8966 8.10278 50.0854 8.05354C50.2743 8.00417 50.5289 7.97955 50.8491 7.97955C51.1693 7.97955 51.4239 8.00417 51.6128 8.05354C51.8016 8.10278 51.9453 8.19302 52.044 8.32451C52.1424 8.45587 52.2041 8.63647 52.2287 8.86644C52.2533 9.09629 52.2656 9.39201 52.2656 9.75334V10.3568C52.2656 10.636 52.2472 10.866 52.2102 11.0466C52.1732 11.2273 52.1013 11.3709 51.9946 11.4778C51.8878 11.5845 51.7441 11.6604 51.5635 11.7056ZM51.6374 12.9312C51.892 12.8491 52.1013 12.7423 52.2656 12.6109V12.6971C52.2656 12.9927 52.2389 13.2391 52.1856 13.4362C52.1322 13.6333 52.044 13.7873 51.9207 13.8981C51.7975 14.009 51.6395 14.087 51.4465 14.1321C51.2535 14.1773 51.0174 14.1998 50.7382 14.1998H49.8452C49.6851 14.1998 49.5126 14.1978 49.3279 14.1937C49.1432 14.1896 48.9358 14.1835 48.7058 14.1752L48.4472 15.4562C48.7428 15.4644 48.9994 15.4706 49.217 15.4747C49.4346 15.4788 49.6337 15.4809 49.8145 15.4809H50.8121C51.3623 15.4809 51.8304 15.4296 52.2163 15.327C52.6023 15.2242 52.9185 15.0621 53.1648 14.8404C53.4112 14.6187 53.5898 14.3312 53.7006 13.9781C53.8115 13.625 53.8669 13.2022 53.8669 12.7095V9.53162C53.8669 9.10454 53.8258 8.71659 53.7436 8.36763C53.6615 8.01854 53.5077 7.72095 53.2818 7.4746C53.056 7.22826 52.746 7.03728 52.3518 6.90179C51.9577 6.76631 51.4526 6.69857 50.8368 6.69857C50.2292 6.69857 49.7302 6.76431 49.3403 6.89567C48.9502 7.02703 48.6402 7.22001 48.4102 7.4746C48.1803 7.72907 48.0223 8.04316 47.936 8.41687C47.8498 8.79045 47.8067 9.21953 47.8067 9.70397V10.0489C47.8067 10.5498 47.8539 10.9891 47.9483 11.3669C48.0428 11.7446 48.1988 12.0587 48.4164 12.3092C48.634 12.5596 48.9214 12.7464 49.2786 12.8696C49.6359 12.9927 50.0813 13.0543 50.6151 13.0543C51.0421 13.0543 51.3829 13.0133 51.6374 12.9312ZM56.7757 13.3008H55.1744V9.08828C55.1744 8.6777 55.2319 8.33074 55.3469 8.0474C55.4619 7.76418 55.6302 7.5362 55.8519 7.36385C56.0737 7.19137 56.3446 7.06613 56.6648 6.98814C56.9851 6.91015 57.3505 6.87115 57.7611 6.87115H58.5618C58.7835 6.87115 59.0011 6.87528 59.2146 6.8834L58.9558 8.21375C58.7916 8.2055 58.611 8.19938 58.4139 8.19526C58.2168 8.19113 58.0526 8.18913 57.9212 8.18913C57.6585 8.18913 57.4531 8.21375 57.3054 8.263C57.1575 8.31224 57.0425 8.38411 56.9604 8.4786C56.8783 8.57296 56.8271 8.69207 56.8064 8.83568C56.786 8.97941 56.7757 9.1499 56.7757 9.34687V13.3008ZM64.1328 6.84642C63.7469 6.74781 63.2788 6.69857 62.7286 6.69857C62.1702 6.69857 61.698 6.74781 61.3121 6.84642C60.9262 6.94491 60.61 7.11114 60.3636 7.34524C60.1173 7.57922 59.9387 7.89331 59.8278 8.28751C59.7169 8.68172 59.6616 9.17441 59.6616 9.76559V10.4308C59.6616 11.0219 59.7169 11.5146 59.8278 11.9088C59.9387 12.3029 60.1173 12.6171 60.3636 12.8511C60.61 13.0851 60.9262 13.2514 61.3121 13.3499C61.698 13.4486 62.1702 13.4978 62.7286 13.4978C63.2788 13.4978 63.7469 13.4486 64.1328 13.3499C64.5188 13.2514 64.8349 13.0851 65.0812 12.8511C65.3276 12.6171 65.5062 12.3029 65.617 11.9088C65.7279 11.5146 65.7832 11.0219 65.7832 10.4308V9.76559C65.7832 9.17441 65.7279 8.68172 65.617 8.28751C65.5062 7.89331 65.3276 7.57922 65.0812 7.34524C64.8349 7.11114 64.5188 6.94491 64.1328 6.84642ZM64.0958 8.82332C64.1369 9.0573 64.1574 9.36326 64.1574 9.74097V10.4676C64.1574 10.8455 64.1369 11.1493 64.0958 11.3792C64.0547 11.6091 63.983 11.7856 63.8802 11.9088C63.7776 12.032 63.6339 12.1141 63.4491 12.1552C63.2644 12.1962 63.0242 12.2168 62.7286 12.2168C62.433 12.2168 62.1908 12.1962 62.0018 12.1552C61.813 12.1141 61.6672 12.032 61.5646 11.9088C61.462 11.7856 61.3901 11.6091 61.349 11.3792C61.308 11.1493 61.2874 10.8455 61.2874 10.4676V9.74097C61.2874 9.36326 61.308 9.0573 61.349 8.82332C61.3901 8.58923 61.462 8.41062 61.5646 8.28751C61.6672 8.16427 61.813 8.08216 62.0018 8.04116C62.1908 8.00004 62.433 7.97955 62.7286 7.97955C63.0242 7.97955 63.2644 8.00004 63.4491 8.04116C63.6339 8.08216 63.7776 8.16427 63.8802 8.28751C63.983 8.41062 64.0547 8.58923 64.0958 8.82332ZM81.5074 12.1429V11.1453C81.5074 10.9974 81.493 10.8722 81.4642 10.7696C81.4355 10.667 81.3759 10.5827 81.2856 10.5171C81.1953 10.4514 81.068 10.4041 80.9038 10.3754C80.7396 10.3466 80.522 10.3323 80.2509 10.3323H80.0661C79.5981 10.3323 79.282 10.3898 79.1178 10.5047C78.9535 10.6197 78.8714 10.8291 78.8714 11.1329V11.367C78.8714 11.6297 78.9473 11.8247 79.0993 11.9521C79.2511 12.0793 79.5325 12.1429 79.943 12.1429H81.5074ZM83.0593 12.1429C83.0593 12.5781 82.9608 12.88 82.7637 13.0483C82.5666 13.2167 82.2258 13.3008 81.7413 13.3008H79.7336C78.8549 13.3008 78.233 13.1366 77.8675 12.8081C77.5021 12.4796 77.3193 12.0074 77.3193 11.3916V11.1207C77.3193 10.439 77.5206 9.94431 77.9229 9.63634C78.3253 9.3285 78.9535 9.17452 79.8075 9.17452C80.2345 9.17452 80.5897 9.20939 80.8729 9.27913C81.1563 9.349 81.3678 9.42899 81.5074 9.51935V9.29763C81.5074 9.0759 81.4847 8.89118 81.4396 8.74332C81.3944 8.59558 81.3184 8.4786 81.2116 8.39236C81.1049 8.30612 80.9592 8.2465 80.7744 8.21375C80.5897 8.18088 80.3577 8.16438 80.0785 8.16438H79.5612C79.3722 8.16438 79.1814 8.16651 78.9884 8.17063L78.4156 8.18288C78.2267 8.18701 78.0544 8.18913 77.8983 8.18913L78.157 6.89578C78.3868 6.88753 78.6743 6.8814 79.0191 6.87728C79.3641 6.87315 79.7418 6.87115 80.1524 6.87115C81.1542 6.87115 81.8892 7.04763 82.3573 7.40072C82.8252 7.7538 83.0593 8.30812 83.0593 9.06366V12.1429ZM86.9482 13.2994H87.9459L88.2047 11.9814H87.059C86.8373 11.9814 86.6547 11.967 86.511 11.9383C86.3672 11.9095 86.2564 11.852 86.1784 11.7659C86.1004 11.6797 86.047 11.5585 86.0183 11.4024C85.9895 11.2465 85.9752 11.0452 85.9752 10.7989V8.2123H88.0198L88.2785 6.89433H85.9752V5.14528L84.3738 5.40387V10.8851C84.3738 11.3532 84.4108 11.7433 84.4847 12.0552C84.5587 12.3673 84.6921 12.6158 84.885 12.8005C85.078 12.9853 85.3409 13.1146 85.6733 13.1885C86.0059 13.2624 86.4309 13.2994 86.9482 13.2994ZM66.9642 11.1322V8.91569C66.9642 8.50511 67.0217 8.15815 67.1367 7.87493C67.2516 7.59159 67.422 7.36374 67.6479 7.19126C67.8737 7.01878 68.1508 6.89354 68.4792 6.81555C68.8077 6.73756 69.1854 6.69857 69.6125 6.69857C70.0558 6.69857 70.448 6.76018 70.7887 6.88329C71.1296 7.00653 71.3944 7.18301 71.5833 7.41298C71.7721 7.18301 72.039 7.00653 72.3839 6.88329C72.7288 6.76018 73.127 6.69857 73.5787 6.69857C73.9975 6.69857 74.3711 6.73756 74.6995 6.81555C75.028 6.89354 75.3051 7.01878 75.531 7.19126C75.7568 7.36374 75.9272 7.59159 76.0421 7.87493C76.1571 8.15815 76.2146 8.50511 76.2146 8.91569V13.3007H74.6133V9.13741C74.6133 8.94856 74.6031 8.78433 74.5826 8.64472C74.5621 8.50511 74.5148 8.38812 74.441 8.29363C74.367 8.19927 74.2541 8.1294 74.1021 8.08428C73.9503 8.03916 73.747 8.01654 73.4924 8.01654C73.2543 8.01654 73.0655 8.03704 72.9259 8.07816C72.7863 8.11915 72.6754 8.18077 72.5933 8.26289C72.5112 8.345 72.4578 8.44762 72.4332 8.57085C72.4086 8.69396 72.3962 8.8377 72.3962 9.00193V12.2233H70.795V9.13741C70.795 8.94856 70.7846 8.78433 70.7641 8.64472C70.7436 8.50511 70.6944 8.38812 70.6164 8.29363C70.5383 8.19927 70.4254 8.1294 70.2775 8.08428C70.1298 8.03916 69.9286 8.01654 69.674 8.01654C69.4195 8.01654 69.2183 8.03916 69.0704 8.08428C68.9227 8.1294 68.8118 8.19927 68.738 8.29363C68.664 8.38812 68.6169 8.50511 68.5962 8.64472C68.5757 8.78433 68.5655 8.94856 68.5655 9.13741V11.1322H66.9642ZM8.33833 5.2845V13.0512C8.85952 13.2357 9.42021 13.3361 10.0041 13.3361C10.5881 13.3361 11.1488 13.2357 11.67 13.0512V5.2845C11.1488 5.09989 10.5881 4.99965 10.0041 4.99965C9.42021 4.99965 8.85952 5.09989 8.33833 5.2845Z"
                                          fill="#B5B8CA"
                                        />
                                      </svg>
                                    </Button>
                                  </a>
                                </ButtonGroup>
                              </Card.Section>
                            </Card>
                          </Layout.Section>
                        </Layout>
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

      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
