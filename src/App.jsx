import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import './App.css';

const CartTotalCalculator = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'iPhone 15', price: 999, quantity: 1, image: '📱' },
    { id: 2, name: 'MacBook Air', price: 1199, quantity: 1, image: '💻' },
    { id: 3, name: 'AirPods Pro', price: 249, quantity: 2, image: '🎧' }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });

  // Available products to add to cart
  const availableProducts = [
    { id: 4, name: 'iPad Pro', price: 799, image: '📱' },
    { id: 5, name: 'Apple Watch', price: 399, image: '⌚' },
    { id: 6, name: 'Magic Mouse', price: 79, image: '🖱️' },
    { id: 7, name: 'USB-C Cable', price: 19, image: '🔌' }
  ];

  // Calculate totals using ES6 features
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 ? 0 : 15; // Free shipping over $500
    const total = subtotal + tax + shipping;

    setTotals({ subtotal, tax, shipping, total });
  };

  // Recalculate totals when cart items change
  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Handle checkout process
  const handleCheckout = () => {
    // Show order summary
    const itemsList = cartItems.map(item => `• ${item.name} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`).join('\n');
    
    alert(`🛒 ORDER SUMMARY\n\n${itemsList}\n\nSubtotal: ${formatCurrency(totals.subtotal)}\nTax (8%): ${formatCurrency(totals.tax)}\nShipping: ${totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}\n\nTOTAL: ${formatCurrency(totals.total)}\n\n✅ Thank you for your order!\n\n(In a real app, this would redirect to payment)`);
    
    // Uncomment to clear cart after checkout
    // setCartItems([]);
  };

  // Format currency
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

  return (
    <div className="app-container">
      <div className="cart-container">
        <div className="header">
          <h1 className="title">
            <ShoppingCart size={36} />
            Cart Total Calculator
          </h1>
          <p className="subtitle">ES6 React State Management Demo</p>
        </div>

        <div className="main-content">
          {/* Available Products */}
          <div className="section">
            <h2 className="section-title">Available Products</h2>
            <div className="products-list">
              {availableProducts.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-info">
                    <span className="product-image">{product.image}</span>
                    <div>
                      <p className="product-name">{product.name}</p>
                      <p className="product-price">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="add-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Items */}
          <div className="section">
            <div className="cart-header">
              <h2 className="section-title">Cart Items ({cartItems.length})</h2>
              {cartItems.length > 0 && (
                <button onClick={clearCart} className="clear-btn">
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <span className="item-image">{item.image}</span>
                      <div>
                        <p className="item-name">{item.name}</p>
                        <p className="item-price">{formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                    
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="summary-container">
            <div className="summary">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="summary-line">
                  <span>Tax (8%):</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span className={totals.shipping === 0 ? 'free-shipping' : ''}>
                    {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping)}
                  </span>
                </div>
                <div className="summary-line total-line">
                  <span>Total:</span>
                  <span className="total-amount">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {totals.subtotal < 500 && (
                <p className="shipping-notice">
                  💡 Spend {formatCurrency(500 - totals.subtotal)} more for free shipping!
                </p>
              )}

              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="debug-info">
        <h3>🔧 Debug Info (ES6 Features Used):</h3>
        <ul>
          <li>• <code>useState</code> & <code>useEffect</code> hooks for state management</li>
          <li>• <code>reduce()</code> for calculating totals from array</li>
          <li>• <code>map()</code> & <code>filter()</code> for array transformations</li>
          <li>• <code>find()</code> for searching items</li>
          <li>• Arrow functions & destructuring assignment</li>
          <li>• Template literals & spread operator</li>
          <li>• <code>Intl.NumberFormat</code> for currency formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default CartTotalCalculator;