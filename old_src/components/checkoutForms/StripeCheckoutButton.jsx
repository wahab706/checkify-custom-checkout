import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

const StripeCheckoutButton = ({ price, currency }) => {
    const priceForStripe = price * 100;
    const publishableKey = 'pk_test_51MVyTSH3Igfzz6r0KpCqSMA2LZ05bBpb2gZxHjVGaGbjxyQxmipNWvWbXwjpVG2TvVAwd4F7I3QdxnIAaWtFFNvM005s4tJ953';

    const onToken = token => {
        console.log(token);
    };

    return (
        <StripeCheckout
            // label='Pay Now'
            // name='Freaky Jolly Co.'
            // billingAddress
            // shippingAddress
            // image='https://www.freakyjolly.com/wp-content/uploads/2020/04/fj-logo.png'
            description={`Your total is ${currency} ${price}`}
            amount={priceForStripe}
            currency={currency}
            token={onToken}
            stripeKey={publishableKey}
        />
    )
}

export default StripeCheckoutButton;