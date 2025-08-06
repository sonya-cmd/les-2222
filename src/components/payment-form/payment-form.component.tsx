import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { StripeCardElement } from '@stripe/stripe-js';

import { selectCartTotal } from '../../store/cart/cart.selector';
import { selectCurrentUser } from '../../store/user/user.selector';

import { BUTTON_TYPE_CLASSES } from '../button/button.types';
import { PaymentFormContainer, FormContainer, PaymentButton } from './payment-form.styles';

const ifValidCardElement = (card: StripeCardElement | null): card is StripeCardElement => card !== null;

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const amount = useSelector(selectCartTotal);
  const currentUser = useSelector(selectCurrentUser);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ Добавлено состояние

  const paymentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessingPayment(true);

    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount * 100 }),
    }).then((res) => res.json());

    const {
      paymentIntent: { client_secret },
    } = response;

    const cardElement = elements.getElement(CardElement);

    if (!ifValidCardElement(cardElement)) {
      setIsProcessingPayment(false);
      return;
    }

    const paymentResult = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: currentUser ? currentUser.displayName : 'Guest',
        },
      },
    });

    setIsProcessingPayment(false);

    if (paymentResult.error) {
      alert(paymentResult.error.message);
    } else if (paymentResult.paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true); // ✅ Устанавливаем успех оплаты
    }
  };

  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit Card Payment:</h2>
        <CardElement />
        <PaymentButton
          isLoading={isProcessingPayment}
          buttonType={BUTTON_TYPE_CLASSES.inverted}
        >
          Pay Now
        </PaymentButton>
        {paymentSuccess && (
          <div style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>
            ✅ Оплата прошла успешно!
          </div>
        )}
      </FormContainer>
    </PaymentFormContainer>
  );
};

export default PaymentForm;
