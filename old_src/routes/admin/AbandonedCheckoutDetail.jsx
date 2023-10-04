import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  Page,
  Layout,
  Card,
  Scrollable,
  Text,
  Stack,
  Icon,
  Toast,
  Loading,
  List,
  Banner,
  Avatar,
  Badge,
  TextField,
} from "@shopify/polaris";
import { ExternalMinor } from "@shopify/polaris-icons";
import {
  SkeltonPageForProductDetail,
  getAccessToken,
  InputField,
} from "../../components";
import { AppContext } from "../../components/providers/ContextProvider";
import { useAuthState } from "../../components/providers/AuthProvider";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import dateFormat from "dateformat";

export function AbandonedCheckoutDetail() {
  const params = useParams();
  const { apiUrl } = useContext(AppContext);
  const { user } = useAuthState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [toggleLoadData, setToggleLoadData] = useState(true);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [abandonedCheckout, setAbandonedCheckout] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [cartPrices, setCartPrices] = useState();
  const [shippingDetails, setShippingDetails] = useState();
  const [billingDetails, setBillingDetails] = useState();

  // ------------------------Toasts Code start here------------------
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

  const abandonedCheckoutDetail = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/api/abundant-checkout-view/${id}`,
        {
          headers: { Authorization: `Bearer ${getAccessToken()}` },
        }
      );

      console.log(
        "AbandonedCheckoutDetail response: ",
        response.data?.data?.checkout?.emailSendAt
      );
      if (response.data.errors) {
        setToastMsg(response.data.message);
        setErrorToast(true);
      } else {
        setAbandonedCheckout(response.data?.data?.checkout);
        setLineItems(response.data?.data?.cart?.line_items);
        if (response.data?.data?.checkout?.oldShippingFormDetails) {
          setShippingDetails(
            JSON.parse(response.data?.data?.checkout?.oldShippingFormDetails)
          );
        }
        if (response.data?.data?.checkout?.oldBillingFormDetails) {
          setBillingDetails(
            JSON.parse(response.data?.data?.checkout?.oldBillingFormDetails)
          );
        }
        if (response.data?.data?.checkout?.oldThankYouPageData) {
          setCartPrices(
            JSON.parse(response.data?.data?.checkout?.oldThankYouPageData)[0]
          );
        }
        setLoading(false);
        setToggleLoadData(false);
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.warn("AbandonedCheckoutDetail Api Error", error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  useEffect(() => {
    if (toggleLoadData) {
      abandonedCheckoutDetail(params.abandonedCheckoutId);
    }
  }, [toggleLoadData]);

  const discardAbandonedCheckout = () => {
    navigate("/admin/abandoned-checkout");
  };

  return (
    <div className="Discount-Detail-Page Abandoned-Checkout-Detail-Page">
      {loading ? (
        <span>
          <Loading />
          <SkeltonPageForProductDetail />
        </span>
      ) : (
        <Page
          breadcrumbs={[
            {
              content: "Abandoned Checkout",
              onAction: discardAbandonedCheckout,
            },
          ]}
          title={`#${abandonedCheckout?.id}`}
          subtitle={dateFormat(
            abandonedCheckout?.created_at,
            "mmmm d, yyyy 'at' h:MM tt"
          )}
          titleMetadata={
            convertNumberToBoolean(abandonedCheckout?.isPaid) ? (
              <Badge status="success">Recovered</Badge>
            ) : (
              <Badge status="warning">Not Recovered</Badge>
            )
          }
          //   primaryAction={{
          //     content: "Save discount",
          //     onAction: handleUpdateDiscount,
          //     loading: btnLoading[1],
          //   }}
        >
          {convertNumberToBoolean(abandonedCheckout?.emailSend) && (
            <Banner title="Cart recovery email sent" status="success">
              <List>
                <List.Item>
                  {abandonedCheckout?.emailSendAt ? (
                    <>
                      {`A reminder email was sent to the customer on ${dateFormat(
                        abandonedCheckout?.emailSendAt,
                        "mmmm d, yyyy 'at' h:MM tt"
                      )}.`}
                    </>
                  ) : (
                    <>{`A reminder email was sent to the customer.`}</>
                  )}
                </List.Item>
              </List>
              <div className="Icon-TextFiled">
                <InputField
                  marginTop
                  defaultValue={`https://ecommercehack.com/checkout?id=${abandonedCheckout?.checkout_uuid}`}
                />

                <a
                  href={`https://ecommercehack.com/checkout?id=${abandonedCheckout?.checkout_uuid}`}
                  target="_blank"
                  className="Icon-Section"
                >
                  <Icon source={ExternalMinor} color="subdued" />
                </a>
              </div>
            </Banner>
          )}

          <Layout>
            <Layout.Section>
              <Card title="Checkout details">
                <Card.Section>
                  <Scrollable
                    style={{
                      height: lineItems?.length == 1 ? "75px" : "225px",
                    }}
                  >
                    {lineItems?.map((item) => {
                      return (
                        <div className="Order-Product-Details" key={item.id}>
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
                                <h2 className="Product-Title">{item.title}</h2>
                                <h2 className="Product-Title">
                                  {abandonedCheckout?.oldCurrencyCode}
                                  {item.price && Number(item.price).toFixed(2)}
                                </h2>
                              </div>
                              {/* <h2 className='Product-Extras'>Old</h2> */}
                            </div>
                          </Stack>
                        </div>
                      );
                    })}
                  </Scrollable>
                </Card.Section>

                {cartPrices && (
                  <Card.Section>
                    <div className="Paid-Section">
                      {abandonedCheckout?.oldDiscountCode && (
                        <div className="Paid-SubTotal">
                          <Stack>
                            <p>Discount</p>
                            <p>{abandonedCheckout?.oldDiscountCode}</p>
                            <p>
                              - {abandonedCheckout?.oldCurrencyCode}{" "}
                              {abandonedCheckout?.oldDiscountedValue}
                            </p>
                          </Stack>
                        </div>
                      )}
                      <div className="Paid-SubTotal">
                        <Stack>
                          <p>SubTotal</p>
                          <p>
                            {lineItems?.length}{" "}
                            {lineItems?.length > 1 ? "items" : "item"}
                          </p>
                          <p>
                            {abandonedCheckout?.oldCurrencyCode}{" "}
                            {cartPrices?.subTotal}
                          </p>
                        </Stack>
                      </div>
                      {cartPrices?.shippingValue ? (
                        <div className="Paid-SubTotal">
                          <Stack>
                            <p>Shipping</p>
                            <p>{cartPrices?.shippingName}</p>
                            <p>
                              {abandonedCheckout?.oldCurrencyCode}
                              {cartPrices?.shippingValue &&
                                Number(cartPrices?.shippingValue).toFixed(2)}
                            </p>
                          </Stack>
                        </div>
                      ) : (
                        ""
                      )}

                      {cartPrices?.taxTotal ? (
                        <div className="Paid-Tax">
                          <Stack>
                            <p>Estimated tax</p>
                            <p>
                              {abandonedCheckout?.oldCurrencyCode}{" "}
                              {cartPrices?.taxTotal &&
                                Number(cartPrices?.taxTotal).toFixed(2)}
                            </p>
                          </Stack>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="Paid-Total">
                        <Stack>
                          <p>Total</p>
                          <p>
                            {abandonedCheckout?.oldCurrencyCode}{" "}
                            {cartPrices?.totalValue}
                          </p>
                        </Stack>
                      </div>

                      <div className="Paid-By">
                        <Stack>
                          <p>To be paid by customer</p>
                          <p>
                            {abandonedCheckout?.oldCurrencyCode}{" "}
                            {cartPrices?.totalValue}
                          </p>
                        </Stack>
                      </div>
                    </div>
                  </Card.Section>
                )}
              </Card>
            </Layout.Section>

            <Layout.Section oneThird>
              {abandonedCheckout?.oldShippingFormDetails && (
                <Card>
                  <Card.Section title="Customer">
                    {/* <Avatar />
                    <br /> */}
                    <p>
                      {shippingDetails?.firstName} {shippingDetails?.lastName}
                    </p>
                    <p>{shippingDetails?.email}</p>
                  </Card.Section>

                  <Card.Section title="Shipping address">
                    <p>
                      {shippingDetails?.firstName} {shippingDetails?.lastName}
                    </p>
                    <p>{shippingDetails?.address}</p>
                    <p>
                      {shippingDetails?.city} {cartPrices?.stateName}{" "}
                      {shippingDetails?.zipCode}
                    </p>
                    <p>{cartPrices?.countryName}</p>
                  </Card.Section>

                  <Card.Section title="Billing address">
                    {convertNumberToBoolean(
                      abandonedCheckout?.oldIsBillingAddressSame
                    ) ? (
                      <Text as="p" color="subdued">
                        Same as shipping address
                      </Text>
                    ) : (
                      <>
                        <p>
                          {billingDetails?.firstName} {billingDetails?.lastName}
                        </p>
                        <p>{billingDetails?.address}</p>
                        <p>
                          {billingDetails?.city} {cartPrices?.billingStateName}{" "}
                          {billingDetails?.zipCode}
                        </p>
                        <p>{cartPrices?.billingCountryName}</p>
                      </>
                    )}
                  </Card.Section>
                </Card>
              )}
            </Layout.Section>
          </Layout>
        </Page>
      )}
      {toastErrorMsg}
      {toastSuccessMsg}
    </div>
  );
}
