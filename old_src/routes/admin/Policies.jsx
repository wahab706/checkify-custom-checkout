import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { SkeltonPoliciesPage, getAccessToken } from "../../components";
import { Page, Card, Text, Toast, Loading } from "@shopify/polaris";
import { AppContext } from "../../components/providers/ContextProvider";

export function Policies() {
  const { apiUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [sucessToast, setSucessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [refundPolicy, setRefundPolicy] = useState("");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [contactInformation, setContactInformation] = useState("");

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

  const getPoliciesData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/policies`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      // console.log("getPoliciesData response: ", response.data);

      if (response.data?.errors) {
        setToastMsg(response.data?.message);
        setErrorToast(true);
      } else {
        setRefundPolicy(
          response.data?.data?.refund_policy == null
            ? ""
            : response.data?.data?.refund_policy
        );
        setShippingPolicy(
          response.data?.data?.shipping_policy == null
            ? ""
            : response.data?.data?.shipping_policy
        );
        setPrivacyPolicy(
          response.data?.data?.privacy_policy == null
            ? ""
            : response.data?.data?.privacy_policy
        );
        setTermsOfService(
          response.data?.data?.terms_of_service == null
            ? ""
            : response.data?.data?.terms_of_service
        );
        setContactInformation(
          response.data?.data?.contact_information == null
            ? ""
            : response.data?.data?.contact_information
        );
        setLoading(false);
      }
    } catch (error) {
      console.warn("getPoliciesData Api Error", error.response);
      setLoading(false);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
    }
  };

  useEffect(() => {
    getPoliciesData();
  }, []);

  const updatePolicies = async () => {
    setBtnLoading(true);

    let data = {
      privacy_policy: privacyPolicy,
      refund_policy: refundPolicy,
      shipping_policy: shippingPolicy,
      terms_of_service: termsOfService,
      contact_information: contactInformation,
    };

    try {
      const response = await axios.put(`${apiUrl}/api/policies`, data, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      });

      setBtnLoading(false);
      setToastMsg("Settings Saved");
      setSucessToast(true);
    } catch (error) {
      console.warn("updatePolicies Api Error", error.response);
      if (error.response?.data?.message) {
        setToastMsg(error.response?.data?.message);
      } else {
        setToastMsg("Server Error");
      }
      setErrorToast(true);
      setBtnLoading(false);
    }
  };

  const config = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "indent",
      "outdent",
      "|",
      // "imageUpload",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "undo",
      "redo",
    ],
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
  };

  return (
    <>
      <div className="Policies-Page ">
        {loading ? (
          <span>
            <Loading />
            <SkeltonPoliciesPage />
          </span>
        ) : (
          <Page
            fullWidth
            title="Policies"
            primaryAction={{
              content: "Save Changes",
              onAction: updatePolicies,
              loading: btnLoading,
            }}
          >
            <Card>
              <Card.Section>
                <Text variant="bodyLg" as={"h2"} fontWeight="medium">
                  Refund policy
                </Text>
              </Card.Section>
              <Card.Section>
                <CKEditor
                  editor={ClassicEditor}
                  data={refundPolicy}
                  onChange={(event, editor) =>
                    setRefundPolicy(editor.getData())
                  }
                  config={config}
                />
              </Card.Section>
            </Card>

            <Card>
              <Card.Section>
                <Text variant="bodyLg" as={"h2"} fontWeight="medium">
                  Privacy policy
                </Text>
              </Card.Section>
              <Card.Section>
                <CKEditor
                  editor={ClassicEditor}
                  data={privacyPolicy}
                  onChange={(event, editor) =>
                    setPrivacyPolicy(editor.getData())
                  }
                  config={config}
                />
              </Card.Section>
            </Card>

            <Card>
              <Card.Section>
                <Text variant="bodyLg" as={"h2"} fontWeight="medium">
                  Terms of service
                </Text>
              </Card.Section>
              <Card.Section>
                <CKEditor
                  editor={ClassicEditor}
                  data={termsOfService}
                  onChange={(event, editor) =>
                    setTermsOfService(editor.getData())
                  }
                  config={config}
                />
              </Card.Section>
            </Card>

            <Card>
              <Card.Section>
                <Text variant="bodyLg" as={"h2"} fontWeight="medium">
                  Shipping policy
                </Text>
              </Card.Section>
              <Card.Section>
                <CKEditor
                  editor={ClassicEditor}
                  data={shippingPolicy}
                  onChange={(event, editor) =>
                    setShippingPolicy(editor.getData())
                  }
                  config={config}
                />
              </Card.Section>
            </Card>

            <Card>
              <Card.Section>
                <Text variant="bodyLg" as={"h2"} fontWeight="medium">
                  Contact information
                </Text>
                <Text as={"p"} fontWeight="regular" color="subdued">
                  Contact information is required on your website if you are
                  selling into the European Union.
                </Text>
              </Card.Section>
              <Card.Section>
                <CKEditor
                  editor={ClassicEditor}
                  data={contactInformation}
                  onChange={(event, editor) =>
                    setContactInformation(editor.getData())
                  }
                  config={config}
                />
              </Card.Section>
            </Card>
          </Page>
        )}
        {toastErrorMsg}
        {toastSuccessMsg}
      </div>
    </>
  );
}
