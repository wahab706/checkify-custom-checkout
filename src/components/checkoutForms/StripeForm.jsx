import React from 'react';
import {
    Elements,
    CardElement,
    ElementsConsumer,
    CardCvcElement,
    CardNumberElement,
    CardExpiryElement,
    AuBankAccountElement,
    EpsBankElement,
    IdealBankElement,
    P24BankElement,

} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';




const StripeForm = ({ handleSubmit, stripeKey }) => {
    const stripePromise = loadStripe(stripeKey);

    // const handleSubmit = async (event, elements, stripe) => {
    //     event.preventDefault();

    //     if (!stripe || !elements) return;

    //     const cardElement = elements.getElement(CardElement);

    //     const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });

    //     if (error) {
    //         console.log('[error]', error);
    //     } else {
    //         const orderData = {
    //             payment: {
    //                 gateway: 'stripe',
    //                 stripe: {
    //                     payment_method_id: paymentMethod.id,
    //                 },
    //             },
    //         };

    //         console.log('orderData', orderData);
    //     }
    // };

    return (
        <>
            <Elements stripe={stripePromise}>
                <ElementsConsumer>{({ elements, stripe }) => (
                    <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                        <CardElement />

                        {/* <AuBankAccountElement /> */}
                        {/* <EpsBankElement /> */}
                        {/* <IdealBankElement />  */}
                        {/* <P24BankElement /> */}


                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button type="submit" disabled={!stripe} id='stripePayBtn'>
                                Pay
                            </button>
                        </div>
                    </form>
                )}
                </ElementsConsumer>
            </Elements>
        </>
    );
};

export default StripeForm;