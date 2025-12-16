import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/format';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', marginBottom: '40px' }}>Shopping Cart</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty</p>
          <Link to="/products">Continue Shopping</Link>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <div key={`${item.product_id}-${item.variant_id}`} style={{
              display: 'flex',
              gap: '20px',
              padding: '20px',
              borderBottom: '1px solid #eee',
            }}>
              <div style={{ flex: 1 }}>
                <h3>{item.product.name}</h3>
                <p>{formatCurrency(item.price)}</p>
              </div>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value), item.variant_id)}
                min="1"
                style={{ width: '60px', padding: '8px' }}
              />
              <button onClick={() => removeItem(item.product_id, item.variant_id)}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <h2>Total: {formatCurrency(getCartTotal())}</h2>
            <Link to="/checkout">
              <button style={{
                padding: '16px 32px',
                background: '#1E2D4D',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '20px',
              }}>
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
