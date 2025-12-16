import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/format';
import Layout from '../components/layout/Layout';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading } = useProduct(id!);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{
          padding: '100px 40px',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}>
          <div className="scale-in visible">
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>Loading...</div>
            <div style={{ opacity: 0.7 }}>Preparing product details</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div style={{
          padding: '100px 40px',
          textAlign: 'center',
          minHeight: '100vh',
          color: 'white',
        }}>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Product not found</h1>
          <Link to="/products" style={{
            display: 'inline-block',
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
            color: '#1E2D4D',
            borderRadius: '50px',
            fontWeight: 600,
            marginTop: '20px',
          }}>
            Back to Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        padding: '120px 40px 80px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Breadcrumb */}
        <div className="fade-in" style={{
          marginBottom: '40px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.6)',
        }}>
          <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
            Home
          </Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'rgba(255, 255, 255, 0.6)', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}>
            Products
          </Link>
          <span>/</span>
          <span style={{ color: '#CBDAD5' }}>{product.name}</span>
        </div>

        {/* Asymmetric Layout - 60/40 Split */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: '80px',
          marginBottom: '100px',
        }}>
          {/* Left Side - Images */}
          <div className="slide-in-left">
            {/* Main Image */}
            <div style={{
              height: '600px',
              background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
              borderRadius: '32px',
              overflow: 'hidden',
              marginBottom: '24px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}>
              {product.images[selectedImage]?.url ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
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
                  fontSize: '24px',
                  fontWeight: 600,
                }}>
                  Premium Product Image
                </div>
              )}

              {/* Badge Overlay */}
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                padding: '12px 24px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#1E2D4D',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
              }}>
                Premium Quality
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
              }}>
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      height: '120px',
                      background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImage === index ? '3px solid #CBDAD5' : '3px solid transparent',
                      transition: 'all 0.3s ease',
                      opacity: selectedImage === index ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = selectedImage === index ? '1' : '0.6';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {image.url && (
                      <img
                        src={image.url}
                        alt={`${product.name} view ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Info (Sticky) */}
          <div className="slide-in-right" style={{
            position: 'sticky',
            top: '120px',
            height: 'fit-content',
          }}>
            {/* Product Title */}
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '48px',
              fontWeight: 600,
              lineHeight: 1.2,
              marginBottom: '20px',
              color: 'white',
            }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{
              fontSize: '42px',
              fontWeight: 700,
              marginBottom: '30px',
              background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {formatCurrency(product.price)}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              lineHeight: 1.8,
              marginBottom: '40px',
              color: 'rgba(255, 255, 255, 0.85)',
            }}>
              {product.description}
            </p>

            {/* Features List */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '20px',
                color: 'white',
              }}>
                Key Features
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Premium organic materials',
                  'Temperature regulating technology',
                  'Hypoallergenic and breathable',
                  '30-night sleep trial included',
                ].map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '15px',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}>
                      ✓
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                marginBottom: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}>
                Quantity
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '8px',
                width: 'fit-content',
              }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                  -
                </button>
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  minWidth: '30px',
                  textAlign: 'center',
                  color: 'white',
                }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '20px 32px',
                background: addedToCart
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                  : 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                color: addedToCart ? 'white' : '#1E2D4D',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                boxShadow: '0 8px 24px rgba(203, 218, 213, 0.3)',
                marginBottom: '20px',
              }}
              onMouseEnter={(e) => {
                if (!addedToCart) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(203, 218, 213, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(203, 218, 213, 0.3)';
              }}
            >
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>

            {/* Trust Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {[
                { icon: '🚚', text: 'Free Shipping' },
                { icon: '🔒', text: 'Secure Checkout' },
              ].map((badge, i) => (
                <div key={i} style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{badge.icon}</div>
                  {badge.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information Section - Full Width */}
        <div className="fade-in" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: '60px',
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '40px',
            textAlign: 'center',
            color: 'white',
          }}>
            Product Details
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
          }}>
            {[
              { title: 'Materials', desc: 'Premium organic cotton with innovative cooling fibers for optimal comfort' },
              { title: 'Care', desc: 'Machine washable at 40°C. Tumble dry low. Do not bleach or iron directly' },
              { title: 'Warranty', desc: 'Lifetime quality guarantee. 30-night trial period with free returns' },
            ].map((detail, i) => (
              <div key={i}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: '#CBDAD5',
                }}>
                  {detail.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  {detail.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
