import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';

import { selectCartItems, selectCartTotal } from '../../store/cart/cart.selector';
import { stripePromise } from '../../utils/stripe/stripe.utils'; // путь может отличаться

import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import PaymentForm from '../../components/payment-form/payment-form.component';

import './checkout.styles.scss';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  return (
    <div className='checkout-container'>
      <div className='checkout-header'>
        <div className='header-block'><span>Product</span></div>
        <div className='header-block'><span>Description</span></div>
        <div className='header-block'><span>Quantity</span></div>
        <div className='header-block'><span>Price</span></div>
        <div className='header-block'><span>Remove</span></div>
      </div>

      {cartItems.map((cartItem) => (
        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
      ))}

      <span className='total'>Total: ${cartTotal}</span>

      {/* 🔥 Важно: оборачиваем PaymentForm в <Elements> */}
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
};

export default Checkout;