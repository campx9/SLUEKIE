import { useEffect, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';
import Layout from '../components/layout/Layout';

export default function ProductsPage() {
  const { products, isLoading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in, .scale-in, .slide-in-left, .slide-in-right').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [products]);

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
            <div style={{ opacity: 0.7 }}>Preparing your luxury experience</div>
          </div>
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
        {/* Header Section - Asymmetric Design */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '60px',
          marginBottom: '80px',
          alignItems: 'end',
        }}>
          <div className="slide-in-left">
            <div style={{
              fontSize: '13px',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#CBDAD5',
              marginBottom: '20px',
              fontWeight: 500,
            }}>
              Premium Collection
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(42px, 5vw, 64px)',
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: '25px',
              background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Discover Your Perfect Sleep Solution
            </h1>
            <p style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.7,
              maxWidth: '600px',
            }}>
              Explore our carefully curated collection of premium sleep essentials, each designed to transform your nightly rest into a luxurious experience.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="slide-in-right" style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '12px 24px',
                background: viewMode === 'grid'
                  ? 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: viewMode === 'grid' ? '#1E2D4D' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('masonry')}
              style={{
                padding: '12px 24px',
                background: viewMode === 'masonry'
                  ? 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: viewMode === 'masonry' ? '#1E2D4D' : 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Masonry View
            </button>
          </div>
        </div>

        {/* Products Grid - Varied Layout */}
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '35px',
          }}>
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className={`scale-in stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: '280px',
                    background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{
                        color: '#1E2D4D',
                        fontWeight: 600,
                        fontSize: '18px',
                      }}>Premium Product</div>
                    )}

                    {/* Floating badge */}
                    {index < 3 && (
                      <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1E2D4D',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        Featured
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '22px',
                      marginBottom: '12px',
                      color: '#1E2D4D',
                      fontWeight: 600,
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      opacity: 0.7,
                      marginBottom: '20px',
                      lineHeight: 1.6,
                      color: '#4A4A4A',
                      flex: 1,
                    }}>
                      {product.description?.substring(0, 90)}...
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        fontSize: '26px',
                        fontWeight: 700,
                        color: '#1E2D4D',
                      }}>
                        {formatCurrency(product.price)}
                      </div>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}>
                        →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Masonry Layout */
          <div style={{
            columnCount: 3,
            columnGap: '35px',
          }}>
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'inline-block',
                  width: '100%',
                  marginBottom: '35px',
                }}
              >
                <div
                  className={`fade-in stagger-${(index % 6) + 1}`}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    breakInside: 'avoid',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{
                    height: index % 3 === 0 ? '320px' : index % 2 === 0 ? '240px' : '280px',
                    background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ color: '#1E2D4D', fontWeight: 600 }}>Premium Product</div>
                    )}
                  </div>

                  <div style={{ padding: '28px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: '#CBDAD5',
                      color: '#1E2D4D',
                      padding: '6px 14px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '14px',
                    }}>
                      Premium
                    </div>

                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '20px',
                      marginBottom: '12px',
                      color: '#1E2D4D',
                      fontWeight: 600,
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      opacity: 0.7,
                      marginBottom: '18px',
                      lineHeight: 1.6,
                      color: '#4A4A4A',
                    }}>
                      {product.description?.substring(0, 80)}...
                    </p>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: '#1E2D4D',
                    }}>
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom CTA Section - Diagonal Layout */}
        <div
          className="fade-in"
          style={{
            marginTop: '100px',
            background: 'linear-gradient(135deg, rgba(203, 218, 213, 0.2) 0%, rgba(212, 207, 231, 0.2) 100%)',
            borderRadius: '32px',
            padding: '60px',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 600,
            marginBottom: '20px',
            color: 'white',
          }}>
            Need Help Choosing?
          </h2>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '30px',
            maxWidth: '500px',
            margin: '0 auto 30px',
          }}>
            Our sleep experts are here to guide you to your perfect match
          </p>
          <button style={{
            padding: '16px 36px',
            background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
            color: '#1E2D4D',
            border: 'none',
            borderRadius: '50px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
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
            Contact Sleep Expert
          </button>
        </div>
      </div>
    </Layout>
  );
}
