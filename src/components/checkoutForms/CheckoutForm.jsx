import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements,
    AddressElement
} from "@stripe/react-stripe-js";
import { PaymentLoader } from '../../components'
import { Text } from '@shopify/polaris';


export default function CheckoutForm({ setBtnLoading, localizations, accordion, API_URL, preview, cartUuid }) {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(null);


    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setError(false)
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setError(false)
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setError(true)
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setError(true)
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setMessage()
        setError(false)

        setBtnLoading((prev) => {
            let toggleId;
            if (prev['paymentSubmitBtn']) {
                toggleId = { ['paymentSubmitBtn']: false };
            } else {
                toggleId = { ['paymentSubmitBtn']: true };
            }
            return { ...toggleId };
        });

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: preview ? `${API_URL}/preview/thank-you-page?storeName=${cartUuid}` : `${API_URL}/api/checkout/confirm-stripe`,
            },
        });


        if (error.type === "card_error" || error.type === "validation_error") {
            if (error.message == 'Your card number is incomplete.') {
                setMessage(localizations?.VE_ErrorCard);
            }
            else {
                setMessage(error.message);
            }
            setError(true)
        }
        else {
            setMessage("An unexpected error occurred.");
            setError(true)
        }

        setBtnLoading(false);
    };

    const paymentElementOptions = {
        // layout: "tabs",
        layout: accordion ? "accordion" : "tabs",
    }



    return (
        <>
            {!stripe || !elements ? <PaymentLoader /> :
                <form id="payment-form" onSubmit={handleSubmit}>
                    <PaymentElement id="payment-element" options={paymentElementOptions} />

                    <button disabled={!stripe || !elements} id="stripePayBtn" hidden>
                        Pay now
                    </button>

                    <br />
                    {message &&
                        <div id="payment-message">
                            {error ?
                                <Text variant="bodyMd" as="p" fontWeight="regular" color="critical">
                                    {message}
                                </Text>
                                :
                                <Text variant="bodyMd" as="p" fontWeight="regular" alignment="center">
                                    {message}
                                </Text>
                            }
                        </div>
                    }
                </form>
            }
        </>
    );
}