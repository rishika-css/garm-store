/**
 * CartContext.jsx
 * Global cart state using React Context + useReducer.
 * Wraps the entire app so any component can read/write cart state.
 */

import { createContext, useContext, useReducer } from 'react';

// ─── Initial State ────────────────────────────────────────────────
const initialState = {
  items: [],        // [{ id, name, price, image, size, qty }]
  isOpen: false,    // cart drawer open/closed
};

// ─── Reducer ──────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const exists = state.items.find(
        i => i.id === action.payload.id && i.size === action.payload.size
      );
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id && i.size === action.payload.size
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.id === action.payload.id && i.size === action.payload.size)
        ),
      };

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id && i.size === action.payload.size
            ? { ...i, qty: action.payload.qty }
            : i
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Derived values
  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal  = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const addItem    = (item)           => dispatch({ type: 'ADD_ITEM',    payload: item });
  const removeItem = (id, size)       => dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  const updateQty  = (id, size, qty)  => dispatch({ type: 'UPDATE_QTY',  payload: { id, size, qty } });
  const clearCart  = ()               => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = ()               => dispatch({ type: 'TOGGLE_CART' });
  const closeCart  = ()               => dispatch({ type: 'CLOSE_CART' });

  return (
    <CartContext.Provider value={{
      ...state,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      toggleCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}
