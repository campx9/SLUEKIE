import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Navigation() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(15, 27, 46, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Link to="/" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '28px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          SLUEKIE
        </Link>

        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <Link to="/products" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}>
            Shop
          </Link>
          <Link to="/products" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: '0.5px',
          }}>
            Collections
          </Link>
          <Link to="/cart" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '15px',
            fontWeight: 500,
            position: 'relative',
          }}>
            Cart
            {itemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: '#CBDAD5',
                color: '#1E2D4D',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
              }}>
                {itemCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/account" style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '15px',
              fontWeight: 500,
            }}>
              Account
            </Link>
          ) : (
            <Link to="/login" style={{
              background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
              color: '#1E2D4D',
              padding: '10px 24px',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
