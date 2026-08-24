import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  // Load cart from sessionStorage so any demonstrative changes reset on next session
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = sessionStorage.getItem('cartItems');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Session storage quota or access issue:', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id;
      const existingItem = prevItems.find((item) => (item.id || item._id) === productId);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + quantity;

      // Validate against available stock
      if (product.quantityInStock !== undefined && newQty > product.quantityInStock) {
        console.warn(`Cannot add more than ${product.quantityInStock} units of "${product.name}"`);
        return prevItems;
      }

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id || item._id) === productId
            ? { ...item, quantity: newQty }
            : item
        );
      } else {
        return [...prevItems, { ...product, id: productId, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.id || item._id) !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if ((item.id || item._id) === productId) {
            if (item.quantityInStock !== undefined && newQuantity > item.quantityInStock) {
              console.warn(`Cannot set quantity above available stock (${item.quantityInStock})`);
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      sessionStorage.removeItem('cartItems');
    } catch (e) {
      console.warn(e);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const p = item.unitPrice !== undefined ? item.unitPrice : (item.price > 100 ? item.price / 100 : item.price) || 0;
      return acc + p * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext };
export default CartProvider;
