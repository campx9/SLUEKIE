import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Navigation() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/products', label: 'Shop' },
    { to: '/products', label: 'Collections' },
    { to: '/cart', label: 'Cart' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled
        ? 'rgba(15, 27, 46, 0.98)'
        : 'rgba(15, 27, 46, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled
        ? '1px solid rgba(255, 255, 255, 0.15)'
        : '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.2)' : 'none',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: scrolled ? '16px 40px' : '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: scrolled ? '26px' : '28px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all 0.3s ease',
            letterSpacing: '1px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          SLUEKIE
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              style={{
                color: location.pathname === link.to
                  ? '#CBDAD5'
                  : 'rgba(255, 255, 255, 0.85)',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '0.5px',
                position: 'relative',
                transition: 'color 0.3s ease',
                paddingBottom: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#CBDAD5';
                const underline = e.currentTarget.querySelector('.nav-underline') as HTMLElement;
                if (underline) {
                  underline.style.width = '100%';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.to) {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }
                const underline = e.currentTarget.querySelector('.nav-underline') as HTMLElement;
                if (underline && location.pathname !== link.to) {
                  underline.style.width = '0%';
                }
              }}
            >
              {link.label}
              {link.label === 'Cart' && itemCount > 0 && (
                <span
                  className="gentle-float"
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-16px',
                    background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                    color: '#1E2D4D',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(203, 218, 213, 0.3)',
                  }}
                >
                  {itemCount}
                </span>
              )}
              <div
                className="nav-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: location.pathname === link.to ? '100%' : '0%',
                  background: 'linear-gradient(90deg, #CBDAD5 0%, #D4CFE7 100%)',
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </Link>
          ))}

          {/* Account/Sign In */}
          {user ? (
            <Link
              to="/account"
              style={{
                color: location.pathname === '/account'
                  ? '#CBDAD5'
                  : 'rgba(255, 255, 255, 0.85)',
                fontSize: '15px',
                fontWeight: 500,
                letterSpacing: '0.5px',
                position: 'relative',
                transition: 'color 0.3s ease',
                paddingBottom: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#CBDAD5';
                const underline = e.currentTarget.querySelector('.nav-underline') as HTMLElement;
                if (underline) {
                  underline.style.width = '100%';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/account') {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }
                const underline = e.currentTarget.querySelector('.nav-underline') as HTMLElement;
                if (underline && location.pathname !== '/account') {
                  underline.style.width = '0%';
                }
              }}
            >
              Account
              <div
                className="nav-underline"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  width: location.pathname === '/account' ? '100%' : '0%',
                  background: 'linear-gradient(90deg, #CBDAD5 0%, #D4CFE7 100%)',
                  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </Link>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                color: '#1E2D4D',
                padding: '10px 26px',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(203, 218, 213, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(203, 218, 213, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(203, 218, 213, 0.2)';
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
