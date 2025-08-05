import './cart-item.styles.tsx';

import { FC, memo } from 'react';

import { CartItem as TCartItem } from '../../store/cart/cart.types';

type CartItemProps = {
  cartItem: TCartItem;
};

// JSX требует, чтобы теги (например, CartItemContainer) были определены или импортированы.
// Предположим, ты забыл импортировать их:
import { CartItemContainer, ItemDetails } from './cart-item.styles';

const CartItem: FC<CartItemProps> = memo(({ cartItem }) => {
  const { name, imageUrl, price, quantity } = cartItem;

  return (
    <CartItemContainer>
      <img src={imageUrl} alt={name} />
      <ItemDetails>
        <span>{name}</span>
        <span>
          {quantity} x ${price}
        </span>
      </ItemDetails>
    </CartItemContainer>
  );
});

export default CartItem;