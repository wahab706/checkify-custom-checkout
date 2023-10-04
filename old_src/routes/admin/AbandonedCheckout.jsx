import {
  Badge,
  Button,
  Card,
  Checkbox,
  ChoiceList,
  EmptySearchResult,
  Icon,
  IndexTable,
  Layout,
  Loading,
  Page,
  PageActions,
  Stack,
  Tabs,
  Text,
  TextField,
  Toast,
  Pagination,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import { AppContext } from "../../components/providers/ContextProvider";
import axios from "axios";
import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { getAccessToken } from "../../components/providers/AccessToken";
import dateFormat from "dateformat";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { InputField, SkeltonPageForTable } from "../../components";
import { Link } from "react-router-dom";

function reducer(currentState, newState) {
  return { ...currentState, ...newState };
}
const initialStateCheckoutSettings = {
  isEnable: 0,
  sendAfter: "10h",
  sendTo: "anyone",
};

export function AbandonedCheckout() {
  // set states
  const [checkouts, setCheckouts] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const { apiUrl } = useContext(AppContext);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [totalCheckouts, setTotalCheckouts] = useState();
  const [paginationValue, setPaginationValue] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const [checkoutSettings, checkoutDispatch] = useReducer(
    reducer,
    initialStateCheckoutSettings
  );
  const [checkoutEmailTemplate, setEmailTemplate] = useReducer(reducer, {
    emailBody: "",
    emailSubject: "",
  });

  const [temaplteContent, setTemplateContent] = useState("");

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

  const handlePagination = (value) => {
    if (value == "next") {
      setPaginationValue(paginationValue + 1);
    } else {
      setPaginationValue(paginationValue - 1);
    }
    setToggleLoadData(true);
  };

  // api data fetcher

  const getCheckouts = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/abundant-checkout?page=${paginationValue}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      let checkoutArray = [];
      if (response.data.errors) {
        setToastMsg("Something wents wrong,Please try later!");
        setErrorToast(true);
      } else {
        response?.data?.data?.checkouts?.data?.map((item) => {
          let shippingDetails =
            item.oldShippingFormDetails &&
            JSON.parse(item.oldShippingFormDetails);
          checkoutArray.push({
            id: item.id,
            date: item.created_at,
            shippingDetails: shippingDetails,
            emailStatus: item.emailSend,
            recoverdStatus: item.isPaid,
            total:
              response?.data?.user.currency_symbol + "" + item.oldTotalValue,
          });
        });
      }
      if (response?.data?.data?.checkouts?.next_page_url) {
        setHasNextPage(true);
      } else {
        setHasNextPage(false);
      }
      if (response?.data?.data?.checkouts?.prev_page_url) {
        setHasPreviousPage(true);
      } else {
        setHasPreviousPage(false);
      }

      setTotalCheckouts(response?.data?.data?.checkouts?.total);
      setCheckouts(checkoutArray);
      setTableLoading(false);
      setToggleLoadData(false);
      setLoading(false);
    } catch (error) {
      setToastMsg("Something wents wrong,Please try later!");
      setErrorToast(true);
      setToggleLoadData(false);
      setLoading(false);
    }
  };

  const getCheckoutSettings = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/abundant-checkout/settings`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      let resp = response?.data?.data?.settings;

      setEmailTemplate(resp);
      checkoutDispatch(resp);
    } catch (error) {
      setToastMsg("Something wents wrong");
      setErrorToast(true);
    }
  };

  const setCheckoutSettings = async () => {
    try {
      setBtnLoader(true);
      const response = await axios.post(
        `${apiUrl}/api/abundant-checkout/settings`,
        selectedTab == 1 ? checkoutSettings : checkoutEmailTemplate,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );
      setToastMsg("Settings Updated!");
      setSucessToast(true);
    } catch (error) {
      setToastMsg("Something wents wrong,Please try later!");
      setErrorToast(true);
    }
    setBtnLoader(false);
  };

  const rowMarkup = checkouts?.map(
    (
      { id, date, emailStatus, recoverdStatus, total, shippingDetails },
      index
    ) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell className="Polaris-IndexTable-Product-Column">
          <Link to={`/admin/abandoned-checkout/${id}`}>
            <Text fontWeight="bold" as="span">
              #{id}
            </Text>
          </Link>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {dateFormat(date, "dddd, mmm dd, yyyy")}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {shippingDetails &&
            `${
              shippingDetails?.firstName != null && shippingDetails?.firstName
            }  ${
              shippingDetails?.lastName != null && shippingDetails?.lastName
            }`}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {emailStatus ? (
            <Badge status="success">Sent</Badge>
          ) : (
            <Badge status="warning">Not Sent</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
          {recoverdStatus ? (
            <Badge status="success">Recovered</Badge>
          ) : (
            <Badge status="warning">Not Recovered</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>{total}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const emptyStateMarkup = (
    <EmptySearchResult
      title={"No Abandoned checkouts found"}
      withIllustration
    />
  );

  const TableBody = () => {
    return (
      <div className="Polaris-Table">
        <Card.Section>
          <IndexTable
            // resourceName={resourceName}
            itemCount={checkouts.length}
            hasMoreItems
            selectable={false}
            loading={tableLoading}
            emptyState={emptyStateMarkup}
            headings={[
              { title: "Checkout" },
              { title: "Date" },
              { title: "Placed By" },
              { title: "Email Status" },
              { title: "Recovery Status" },
              { title: "Total" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Card.Section>

        {totalCheckouts > 20 && (
          <Card.Section>
            <div className="data-table-pagination">
              <Pagination
                hasPrevious={hasPreviousPage ? true : false}
                onPrevious={() => handlePagination("prev")}
                hasNext={hasNextPage ? true : false}
                onNext={() => handlePagination("next")}
              />
            </div>
          </Card.Section>
        )}
      </div>
    );
  };

  const SettingBody = () => {
    return (
      <Card.Section>
        <Layout>
          <Layout.Section secondary>
            <Text variant="headingMd" as="h6">
              Abandoned checkout emails
            </Text>

            <Text variant="bodyMd" as="p">
              Send an email to customers who didn’t finish checking out.
            </Text>
          </Layout.Section>

          <Layout.Section>
            <span className="Flex-Space-Between">
              <Card>
                <Card.Section>
                  <Checkbox
                    label="Send abandoned checkout emails automatically"
                    checked={checkoutSettings?.isEnable == 1}
                    onChange={() => {
                      checkoutDispatch({
                        isEnable: checkoutSettings?.isEnable == 1 ? 0 : 1,
                      });
                    }}
                  />
                </Card.Section>

                <Card.Section>
                  <ChoiceList
                    title={"Send to"}
                    choices={[
                      {
                        label: "Anyone who abandons their checkout",
                        value: "anyone",
                      },
                      {
                        label: "Email subscribers who abandon their checkout",
                        value: "subscriber",
                      },
                    ]}
                    disabled={checkoutSettings?.isEnable == 0}
                    selected={checkoutSettings?.sendTo}
                    onChange={(value) => {
                      checkoutDispatch({ sendTo: value[0] });
                    }}
                  />
                </Card.Section>

                <Card.Section>
                  <ChoiceList
                    disabled={checkoutSettings?.isEnable == 0}
                    title={"Send after"}
                    choices={[
                      { label: "1 hour", value: "1h" },
                      { label: "6 hour", value: "6h" },
                      { label: "10 hour (recommanded)", value: "10h" },
                      { label: "24 hour", value: "24h" },
                    ]}
                    selected={checkoutSettings?.sendAfter}
                    onChange={(value) => {
                      checkoutDispatch({ sendAfter: value[0] });
                    }}
                  />
                </Card.Section>
              </Card>
            </span>
          </Layout.Section>
        </Layout>
      </Card.Section>
    );
  };

  function emailBodychange(newValue) {
    setTemplateContent(newValue);
  }
  const EmailTemplateBody = () => {
    return (
      <>
        <Card.Section>
          <Layout>
            <Layout.Section secondary>
              <TextField label={"Email subject"} />
              <div style={{ margin: "10px 0px" }}>
                <Text as={"p"}>Email Body (HTML) </Text>
              </div>
              <AceEditor
                mode="java"
                theme="github"
                onChange={emailBodychange}
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                value={temaplteContent}
              />
            </Layout.Section>
          </Layout>
        </Card.Section>
      </>
    );
  };

  // useEffects
  useEffect(() => {
    getCheckoutSettings();
  }, []);

  useEffect(() => {
    if (toggleLoadData) {
      getCheckouts();
    }
  }, [toggleLoadData]);

  return (
    <>
      <div className="AbandonedCheckout-page">
        {loading ? (
          <span>
            <Loading />
            <SkeltonPageForTable />
          </span>
        ) : (
          <Page
            fullWidth
            title="Abandoned Checkouts"
            primaryAction={{
              content: selectedTab != 0 && "Save",
              loading: btnLoader,
              disabled: selectedTab == 0,
              onAction: setCheckoutSettings,
            }}
          >
            <Card>
              <Tabs
                tabs={[
                  {
                    id: 0,
                    content: "All",
                  },
                  {
                    id: 1,
                    content: "Settings",
                  },
                  {
                    id: 2,
                    content: "Email Template",
                  },
                ]}
                selected={selectedTab}
                onSelect={(index) => {
                  setSelectedTab(index);
                }}
              >
                {(() => {
                  switch (selectedTab) {
                    case 0:
                      return <TableBody />;
                      break;
                    case 1:
                      return <SettingBody />;
                      break;
                    case 2:
                      return (
                        <>
                          <Card.Section>
                            <Layout>
                              <Layout.Section secondary>
                                <div className="polaris_preview">
                                  <TextField
                                    label={
                                      <Stack
                                        alignment="center"
                                        distribution="equalSpacing"
                                      >
                                        <p>Email Subject</p>
                                        {/* <Button plain onClick={() => {}}>
                                          Preview
                                        </Button> */}
                                      </Stack>
                                    }
                                    value={checkoutEmailTemplate?.emailSubject}
                                    onChange={(value) => {
                                      setEmailTemplate({ emailSubject: value });
                                    }}
                                  />
                                </div>
                                <div style={{ margin: "10px 0px" }}>
                                  <Text as={"p"}>Email Body (HTML) </Text>
                                </div>
                                <AceEditor
                                  mode="html"
                                  theme="github"
                                  onChange={(value) => {
                                    setEmailTemplate({ emailBody: value });
                                  }}
                                  name="UNIQUE_ID_OF_DIV"
                                  editorProps={{ $blockScrolling: false }}
                                  value={checkoutEmailTemplate?.emailBody}
                                />
                              </Layout.Section>
                            </Layout>
                          </Card.Section>
                        </>
                      );
                      break;

                    default:
                      break;
                  }
                })()}
              </Tabs>
            </Card>
          </Page>
        )}
        {toastErrorMsg}
        {toastSuccessMsg}
      </div>
    </>
  );
}
