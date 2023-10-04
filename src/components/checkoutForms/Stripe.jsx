import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
// import { StripeProvider, Elements } from 'react-stripe-elements'
import PaymentForm from './PaymentForm'

export default function StripeCheckout() {
    const stripePromise = loadStripe("pk_test_51MVyTSH3Igfzz6r0KpCqSMA2LZ05bBpb2gZxHjVGaGbjxyQxmipNWvWbXwjpVG2TvVAwd4F7I3QdxnIAaWtFFNvM005s4tJ953");

    const appearance = {
        theme: 'stripe',
    };
    const stripeOptions = {
        appearance,
        clientSecret: 'pk_test_51MVyTSH3Igfzz6r0KpCqSMA2LZ05bBpb2gZxHjVGaGbjxyQxmipNWvWbXwjpVG2TvVAwd4F7I3QdxnIAaWtFFNvM005s4tJ953',
        // clientSecret: 'sk_test_51MVyTSH3Igfzz6r0ntWfEJphBktSZSDBivsorGEx3XoNfp7jeCnRA0aopqmvBFTSPeiLCOdGiJBy1xO0EY2co7TS00gUxIT5QC',
    };



    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>

        // <StripeProvider apiKey="pk_test_51MVyTSH3Igfzz6r0KpCqSMA2LZ05bBpb2gZxHjVGaGbjxyQxmipNWvWbXwjpVG2TvVAwd4F7I3QdxnIAaWtFFNvM005s4tJ953">
        //     <Elements>
        //         <PaymentForm />
        //     </Elements>
        // </StripeProvider>
    );
};
