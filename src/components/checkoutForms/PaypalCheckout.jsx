import React, { useEffect, useRef } from "react";
import { PayPalScriptProvider, PayPalButtons, } from "@paypal/react-paypal-js";
import { PaymentLoader } from '../Utils/PaymentLoader'
import ReactDOM from "react-dom";

export function PaypalCheckout({ clientId, deferLoading, currency, amount }) {

    const initialOptions = {
        "client-id": clientId,
        currency: currency,
        intent: "capture",
        components: 'buttons'
    };

    return (
        <PayPalScriptProvider options={initialOptions} deferLoading={deferLoading}>
            <PaypalForm
                currency={currency}
                amount={amount}
                deferLoading={deferLoading}
            />
        </PayPalScriptProvider>
    );

}

import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";

function PaypalForm({ deferLoading, amount, currency }) {
    // const PayPalButton = window.paypal?.Buttons.driver("react", { React, ReactDOM });
    const [{ isPending }] = usePayPalScriptReducer();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!deferLoading) {
            console.log('useEffect run');
            window.paypal?.Buttons?.driver("react", { React, ReactDOM });
            setLoading(false)
        }
    }, [deferLoading, amount])


    return (
        <>
            {loading ? <PaymentLoader /> :
                <PayPalButtons
                    forceReRender={[amount]}
                    fundingSource="paypal"
                    createOrder={(data, actions) => {
                        return actions.order
                            .create({
                                purchase_units: [
                                    {
                                        amount: {
                                            currency_code: currency,
                                            value: amount,
                                        },
                                    },
                                ],
                            })
                            .then((orderId) => {
                                // Your code here after create the order
                                return orderId;
                            });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            console.log(details);
                        });
                    }}

                    onCancel={(data, actions) => {
                        return (
                            console.log('payment cancel')
                        );
                    }}

                    onError={(data, actions) => {
                        return (
                            console.log('payment error')
                        );
                    }}
                />
            }
        </>

    )
}