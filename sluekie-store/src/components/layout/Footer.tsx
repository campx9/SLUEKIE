import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = {
    collection: [
      { to: '/products?category=bedding', label: 'Bedding Sets' },
      { to: '/products?category=pillows', label: 'Pillows' },
      { to: '/products?category=accessories', label: 'Sleep Accessories' },
      { to: '/products', label: 'Gift Sets' },
    ],
    experience: [
      { href: '#', label: 'Sleep Consultation' },
      { href: '#', label: 'Care Guide' },
      { href: '#', label: 'Sleep Science' },
      { href: '#', label: 'Size Guide' },
    ],
    support: [
      { to: '/account', label: 'Customer Care' },
      { to: '/returns', label: 'Returns & Exchanges' },
      { href: '#', label: 'Shipping Info' },
      { href: '#', label: 'FAQ' },
    ],
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #0F1B2E 0%, #1E2D4D 100%)',
      padding: '80px 0 40px',
      position: 'relative',
      zIndex: 2,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '60px',
          marginBottom: '60px',
        }}>
          {/* Brand Column */}
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              marginBottom: '24px',
              fontWeight: 600,
              background: 'linear-gradient(135deg, white 0%, #CBDAD5 50%, #D4CFE7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '1px',
            }}>
              SLUEKIE
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '32px',
              lineHeight: 1.7,
              fontSize: '15px',
              maxWidth: '360px',
            }}>
              Where dreams begin. Crafting exceptional sleep experiences through luxury design and scientific innovation.
            </p>

            {/* Newsletter Signup */}
            <div>
              <p style={{
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '16px',
                fontSize: '15px',
                fontWeight: 600,
              }}>
                Join Our Sleep Community
              </p>
              <div style={{
                display: 'flex',
                gap: '12px',
              }}>
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.borderColor = '#CBDAD5';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                />
                <button style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #CBDAD5 0%, #D4CFE7 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#1E2D4D',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(203, 218, 213, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Collection Links */}
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '18px',
              marginBottom: '24px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Collection
            </h3>
            {footerLinks.collection.map((link, i) => (
              <Link
                key={i}
                to={link.to}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'block',
                  marginBottom: '14px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  paddingLeft: '0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#CBDAD5';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Experience Links */}
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '18px',
              marginBottom: '24px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Experience
            </h3>
            {footerLinks.experience.map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  display: 'block',
                  marginBottom: '14px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  paddingLeft: '0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#CBDAD5';
                  e.currentTarget.style.paddingLeft = '8px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  e.currentTarget.style.paddingLeft = '0';
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Support Links */}
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '18px',
              marginBottom: '24px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Support
            </h3>
            {footerLinks.support.map((link, i) => {
              const LinkComponent = link.to ? Link : 'a';
              const linkProps = link.to ? { to: link.to } : { href: link.href };

              return (
                <LinkComponent
                  key={i}
                  {...linkProps}
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    display: 'block',
                    marginBottom: '14px',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    paddingLeft: '0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#CBDAD5';
                    e.currentTarget.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  {link.label}
                </LinkComponent>
              );
            })}
          </div>
        </div>

        {/* Social Media & Trust Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '50px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {[
            { icon: '🔒', label: 'Secure Checkout' },
            { icon: '🚚', label: 'Free Shipping' },
            { icon: '↩️', label: '30-Day Returns' },
            { icon: '✓', label: 'Quality Guaranteed' },
          ].map((badge, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#CBDAD5';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <span style={{ fontSize: '20px' }}>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <p>&copy; 2025 Sluekie. All rights reserved.</p>
            <div style={{
              display: 'flex',
              gap: '20px',
            }}>
              <a
                href="#"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#CBDAD5'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                Terms of Service
              </a>
            </div>
          </div>
          <div>
            <a
              href="https://www.tnaado.ca/ventures"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '13px',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#CBDAD5';
                e.currentTarget.style.transform = 'translateX(3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              Powered by TNAADO →
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
