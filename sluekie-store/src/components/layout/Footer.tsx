import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: '#0F1B2E',
      padding: '60px 0 30px',
      position: 'relative',
      zIndex: 2,
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 40px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              marginBottom: '20px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Sluekie
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '20px',
              lineHeight: 1.6,
              fontSize: '15px',
            }}>
              Where dreams begin. Crafting exceptional sleep experiences through luxury design and scientific innovation.
            </p>
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              marginBottom: '20px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Collection
            </h3>
            <Link to="/products?category=bedding" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Bedding Sets
            </Link>
            <Link to="/products?category=pillows" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Pillows
            </Link>
            <Link to="/products?category=accessories" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Sleep Accessories
            </Link>
            <Link to="/products" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Gift Sets
            </Link>
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              marginBottom: '20px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Experience
            </h3>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Sleep Consultation
            </a>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Care Guide
            </a>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Sleep Science
            </a>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Size Guide
            </a>
          </div>

          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              marginBottom: '20px',
              fontWeight: 600,
              color: '#CBDAD5',
            }}>
              Support
            </h3>
            <Link to="/account" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Customer Care
            </Link>
            <Link to="/returns" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Returns & Exchanges
            </Link>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              Shipping Info
            </a>
            <a href="#" style={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'block',
              marginBottom: '10px',
              fontSize: '15px',
            }}>
              FAQ
            </a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px',
        }}>
          <div>
            <p>&copy; 2025 Sluekie. All rights reserved.</p>
          </div>
          <div>
            <a
              href="https://www.tnaado.ca/ventures"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
              }}
            >
              Powered by TNAADO
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
