import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/format';
import Layout from '../components/layout/Layout';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .scale-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <Layout>
      <div style={{
        padding: '120px 40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Header */}
        <div className="fade-in" style={{
          marginBottom: '60px',
        }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)',
            fontWeight: 600,
            marginBottom: '15px',
            background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Shopping Cart
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="scale-in" style={{
            textAlign: 'center',
            padding: '100px 40px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '32px',
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '24px',
            }}>
              🛍️
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '16px',
              color: 'white',
            }}>
              Your cart is empty
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '32px',
            }}>
              Discover our collection of premium sleep essentials
            </p>
            <Link to="/products" style={{
              display: 'inline-block',
              padding: '18px 36px',
              background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
              color: '#1E2D4D',
              borderRadius: '50px',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(203, 218, 213, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
          }}>
            {/* Cart Items */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}>
              {items.map((item, index) => (
                <div
                  key={`${item.product_id}-${item.variant_id}`}
                  className={`scale-in stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr auto',
                    gap: '24px',
                    padding: '20px',
                    alignItems: 'center',
                  }}>
                    {/* Product Image */}
                    <div style={{
                      height: '120px',
                      background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}>
                      {item.product.images?.[0]?.url ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1E2D4D',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}>
                          Product
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div>
                      <Link
                        to={`/products/${item.product_id}`}
                        style={{
                          textDecoration: 'none',
                          color: 'inherit',
                        }}
                      >
                        <h3 style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: '20px',
                          fontWeight: 600,
                          marginBottom: '8px',
                          color: '#1E2D4D',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#1E2D4D'}>
                          {item.product.name}
                        </h3>
                      </Link>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#1E2D4D',
                        marginBottom: '12px',
                      }}>
                        {formatCurrency(item.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}>
                        <span style={{
                          fontSize: '13px',
                          color: '#4A4A4A',
                          fontWeight: 500,
                        }}>
                          Quantity:
                        </span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#F5F5F5',
                          borderRadius: '12px',
                          padding: '4px',
                        }}>
                          <button
                            onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1), item.variant_id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'white',
                              border: '1px solid #E0E0E0',
                              color: '#1E2D4D',
                              fontSize: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#CBDAD5';
                              e.currentTarget.style.borderColor = '#CBDAD5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#E0E0E0';
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            fontSize: '15px',
                            fontWeight: 600,
                            minWidth: '24px',
                            textAlign: 'center',
                            color: '#1E2D4D',
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.variant_id)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: 'white',
                              border: '1px solid #E0E0E0',
                              color: '#1E2D4D',
                              fontSize: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#CBDAD5';
                              e.currentTarget.style.borderColor = '#CBDAD5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'white';
                              e.currentTarget.style.borderColor = '#E0E0E0';
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product_id, item.variant_id)}
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(255, 107, 107, 0.1)',
                        color: '#FF6B6B',
                        border: '1px solid rgba(255, 107, 107, 0.2)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FF6B6B';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#FF6B6B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 107, 107, 0.1)';
                        e.currentTarget.style.color = '#FF6B6B';
                        e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.2)';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Sticky */}
            <div className="fade-in" style={{
              position: 'sticky',
              top: '120px',
              height: 'fit-content',
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '24px',
                  fontWeight: 600,
                  marginBottom: '24px',
                  color: '#1E2D4D',
                }}>
                  Order Summary
                </h2>

                <div style={{
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  paddingBottom: '20px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px',
                    color: '#4A4A4A',
                  }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    fontSize: '15px',
                    color: '#4A4A4A',
                  }}>
                    <span>Shipping</span>
                    <span style={{ fontWeight: 600, color: '#4CAF50' }}>Free</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '15px',
                    color: '#4A4A4A',
                  }}>
                    <span>Tax</span>
                    <span style={{ fontWeight: 600 }}>Calculated at checkout</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                }}>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1E2D4D',
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1E2D4D 0%, #CBDAD5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {formatCurrency(getCartTotal())}
                  </span>
                </div>

                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '18px 32px',
                    background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                    color: '#1E2D4D',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(203, 218, 213, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(203, 218, 213, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(203, 218, 213, 0.3)';
                  }}>
                    Proceed to Checkout
                  </button>
                </Link>

                <Link to="/products" style={{
                  display: 'block',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#4A4A4A',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#4A4A4A'}>
                  Continue Shopping
                </Link>

                {/* Trust Indicators */}
                <div style={{
                  marginTop: '28px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  {[
                    { icon: '🔒', text: 'Secure Checkout' },
                    { icon: '↩️', text: '30-Day Returns' },
                    { icon: '✓', text: 'Quality Guaranteed' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13px',
                      color: '#4A4A4A',
                    }}>
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
