import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useProducts } from '../hooks/useProducts';
import { formatCurrency } from '../utils/format';

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [products]);

  return (
    <Layout>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '100px',
            alignItems: 'center',
          }}>
            <div className="hero-left">
              <div style={{
                fontSize: '13px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: '#CBDAD5',
                marginBottom: '25px',
                fontWeight: 500,
              }}>
                Sleep Reimagined
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: '25px',
                letterSpacing: '-1px',
                background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Transform Your Nights Forever
              </h1>
              <p style={{
                fontSize: '22px',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.85)',
                marginBottom: '35px',
                lineHeight: 1.4,
              }}>
                Experience sleep so profound, it changes everything. Discover the luxury bedding collection that redefines rest and recovery.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '25px',
                margin: '40px 0',
              }}>
                {[
                  { number: '87%', label: 'Deeper Sleep' },
                  { number: '3x', label: 'Faster Recovery' },
                  { number: '95%', label: 'Feel Refreshed' },
                ].map((metric, i) => (
                  <div key={i} style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '32px',
                      fontWeight: 600,
                      color: '#CBDAD5',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      {metric.number}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 500,
                    }}>
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/products"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                  color: '#1E2D4D',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 8px 25px rgba(203, 218, 213, 0.3)',
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(203, 218, 213, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(203, 218, 213, 0.3)';
                }}
              >
                Experience the Difference ✨
              </Link>
            </div>

            <div className="hero-visual" style={{
              height: '600px',
              background: 'linear-gradient(145deg, rgba(203, 218, 213, 0.2), rgba(212, 207, 231, 0.2))',
              borderRadius: '30px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '40px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '24px',
                marginBottom: '12px',
                fontWeight: 500,
              }}>
                Premium Sleep Experience
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '280px' }}>
                Discover our luxury collection
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sleep Science Section - Asymmetric Layout */}
      <section style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 40px' }}>
          {/* Section Header - Offset to Left */}
          <div className="slide-in-left" style={{ marginBottom: '70px', maxWidth: '700px' }}>
            <div style={{
              fontSize: '12px',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: '#CBDAD5',
              marginBottom: '15px',
              fontWeight: 500,
            }}>
              Sleep Innovation
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '52px',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'white',
              lineHeight: 1.2,
            }}>
              The Science of Perfect Sleep
            </h2>
            <p style={{
              fontSize: '18px',
              opacity: 0.8,
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.85)',
            }}>
              Every Sluekie product is engineered using cutting-edge sleep research, premium materials, and innovative design.
            </p>
          </div>

          {/* Feature Cards - Varied Heights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'auto auto',
            gap: '30px',
          }}>
            {[
              { icon: '🧬', title: 'Thermoregulation', desc: 'Advanced fiber technology maintains optimal body temperature throughout all sleep cycles.', span: 'normal' },
              { icon: '🌙', title: 'Pressure Relief', desc: 'Precisely engineered support systems distribute weight evenly, reducing pressure points.', span: 'tall' },
              { icon: '💫', title: 'Sleep Quality', desc: 'Hypoallergenic materials and breathable weaves create the ideal sleep environment.', span: 'normal' },
              { icon: '🌿', title: 'Organic Materials', desc: 'GOTS-certified organic cotton and sustainably sourced materials.', span: 'tall' },
              { icon: '⚡', title: 'Recovery', desc: 'Specialized weaves enhance muscle recovery and cellular regeneration.', span: 'normal' },
              { icon: '🎯', title: 'Personalized', desc: 'Adaptive materials respond to individual body types and sleep patterns.', span: 'normal' },
            ].map((item, i) => (
              <div
                key={i}
                className={`scale-in stagger-${(i % 6) + 1}`}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '24px',
                  padding: item.span === 'tall' ? '50px 35px' : '40px 30px',
                  textAlign: 'center',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  gridRow: item.span === 'tall' ? 'span 2' : 'span 1',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: item.span === 'tall' ? '110px' : '90px',
                  height: item.span === 'tall' ? '110px' : '90px',
                  margin: '0 auto 25px',
                  background: 'linear-gradient(135deg, #CBDAD5, #D4CFE7)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: item.span === 'tall' ? '48px' : '36px',
                  transition: 'transform 0.3s ease',
                }}
                className="gentle-float">
                  {item.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: item.span === 'tall' ? '28px' : '24px',
                  color: '#1E2D4D',
                  marginBottom: '16px',
                  fontWeight: 600,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: '#4A4A4A',
                  lineHeight: 1.7,
                  fontSize: item.span === 'tall' ? '16px' : '15px',
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '100px 40px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="fade-in" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <div style={{
                fontSize: '12px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#CBDAD5',
                marginBottom: '15px',
                fontWeight: 500,
              }}>
                Luxury Collection
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '48px',
                color: 'white',
                marginBottom: '20px',
                fontWeight: 600,
              }}>
                Curated for Excellence
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
            }}>
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <div className="fade-in" style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.06)';
                  }}>
                    <div style={{
                      height: '240px',
                      background: 'linear-gradient(145deg, #CBDAD5, #D4CFE7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {product.images[0]?.url ? (
                        <img src={product.images[0].url} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ color: '#1E2D4D', fontWeight: 600, fontSize: '16px' }}>Premium Product</div>
                      )}
                    </div>
                    <div style={{ padding: '25px' }}>
                      <div style={{
                        display: 'inline-block',
                        background: '#CBDAD5',
                        color: '#1E2D4D',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '15px',
                      }}>
                        Bestseller
                      </div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '20px',
                        color: '#1E2D4D',
                        marginBottom: '10px',
                        fontWeight: 600,
                      }}>
                        {product.name}
                      </h3>
                      <p style={{
                        fontSize: '14px',
                        color: '#4A4A4A',
                        marginBottom: '15px',
                        opacity: 0.8,
                        lineHeight: 1.6,
                      }}>
                        {product.description?.substring(0, 80)}...
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <div>
                          <span style={{
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#1E2D4D',
                          }}>
                            {formatCurrency(product.price)}
                          </span>
                          {product.compare_at_price && (
                            <span style={{
                              fontSize: '16px',
                              color: '#4A4A4A',
                              opacity: 0.5,
                              textDecoration: 'line-through',
                              marginLeft: '8px',
                            }}>
                              {formatCurrency(product.compare_at_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Asymmetric Split Layout */}
      <section style={{
        padding: '100px 0',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: '80px',
            alignItems: 'center',
          }}>
            {/* Left Side - Content */}
            <div className="slide-in-left">
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '64px',
                fontWeight: 600,
                marginBottom: '30px',
                background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.1,
              }}>
                Begin Your Sleep Journey
              </h2>
              <p style={{
                fontSize: '22px',
                marginBottom: '40px',
                opacity: 0.9,
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '550px',
              }}>
                Transform your nights. Elevate your days. Experience the luxury of perfect sleep with our scientifically-crafted collection.
              </p>

              <Link
                to="/products"
                style={{
                  padding: '22px 48px',
                  fontSize: '17px',
                  borderRadius: '50px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                  color: '#1E2D4D',
                  boxShadow: '0 12px 30px rgba(203, 218, 213, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(203, 218, 213, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(203, 218, 213, 0.3)';
                }}
              >
                Discover Your Collection
                <span style={{ fontSize: '20px' }}>→</span>
              </Link>
            </div>

            {/* Right Side - Trust Badges in Card */}
            <div className="slide-in-right" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              padding: '50px 40px',
            }}>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontWeight: 600,
                marginBottom: '35px',
                color: '#CBDAD5',
                textAlign: 'center',
              }}>
                The Sluekie Promise
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
              }}>
                {[
                  { icon: '🛡️', text: '30-Night Sleep Trial', sub: 'Risk-free experience guarantee' },
                  { icon: '🚀', text: 'Complimentary Delivery', sub: 'White-glove service included' },
                  { icon: '💎', text: 'Lifetime Quality Promise', sub: 'Exceptional standards always' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`fade-in stagger-${i + 1}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '20px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(8px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '17px',
                        color: 'rgba(255, 255, 255, 0.95)',
                        marginBottom: '6px',
                      }}>
                        {item.text}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}>
                        {item.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
