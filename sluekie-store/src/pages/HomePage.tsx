import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../config/brand';

export default function HomePage() {
  return (
    <div style={{
      fontFamily: BRAND_CONFIG.fonts.body,
      background: BRAND_CONFIG.colors.background,
      minHeight: '100vh',
      color: 'white',
    }}>
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '100px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '13px',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                color: BRAND_CONFIG.colors.secondary,
                marginBottom: '25px',
                fontWeight: 500,
              }}>
                Sleep Reimagined
              </div>
              <h1 style={{
                fontFamily: BRAND_CONFIG.fonts.heading,
                fontSize: 'clamp(48px, 6vw, 72px)',
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: '25px',
                letterSpacing: '-1px',
                background: `linear-gradient(135deg, white 0%, ${BRAND_CONFIG.colors.secondary} 50%, ${BRAND_CONFIG.colors.accent} 100%)`,
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
                  }}>
                    <span style={{
                      fontFamily: BRAND_CONFIG.fonts.heading,
                      fontSize: '32px',
                      fontWeight: 600,
                      color: BRAND_CONFIG.colors.secondary,
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
                  background: `linear-gradient(135deg, ${BRAND_CONFIG.colors.secondary} 0%, ${BRAND_CONFIG.colors.accent} 100%)`,
                  color: BRAND_CONFIG.colors.primary,
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                Experience the Difference
                <span>✨</span>
              </Link>
            </div>

            <div style={{
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
            }}>
              <h3 style={{
                fontFamily: BRAND_CONFIG.fonts.heading,
                fontSize: '24px',
                marginBottom: '12px',
                fontWeight: 500,
              }}>
                HERO VISUAL NEEDED
              </h3>
              <p style={{ fontSize: '14px', opacity: 0.7, maxWidth: '280px' }}>
                Beautiful person sleeping peacefully in luxury Sluekie bedding with soft lighting
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
