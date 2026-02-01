// hooks/useCart.js
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/cartSlice";

import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
  selectCartItemById,
} from "../store/cartSelectors";

export const useCart = () => {
  const dispatch = useDispatch();

  // Global selectors (safe)
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // No illegal nested hooks here. 
  // If we need an item by ID, we should handle it in the component or via a selector passed to useSelector directly.
  const getCartItem = useCallback((id) => {
    // This is just a helper, it shouldn't call hooks
    return cartItems.find(item => item.id === id);
  }, [cartItems]);

  return {
    // State
    cartItems,
    cartTotal,
    cartItemsCount,

    // Selectors
    getCartItem,

    // Actions
    addToCart: (product) => dispatch(addToCart(product)),
    increaseQuantity: (id) => dispatch(increaseQuantity(id)),
    decreaseQuantity: (id) => dispatch(decreaseQuantity(id)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    clearCart: () => dispatch(clearCart()),
  };
};
