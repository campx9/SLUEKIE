import { useEffect } from 'react';

export default function SkyBackground() {
  useEffect(() => {
    function updateSky() {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const skyContainer = document.getElementById('skyContainer');
      const sun = document.getElementById('sun');
      const moon = document.getElementById('moon');

      if (!skyContainer || !sun || !moon) return;

      function interpolateColor(color1: string, color2: string, factor: number): string {
        if (factor <= 0) return color1;
        if (factor >= 1) return color2;

        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');

        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);

        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);

        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }

      if (scrollPercent < 0.25) {
        const nightToDawn = Math.min(scrollPercent / 0.25, 1);

        if (nightToDawn < 0.5) {
          skyContainer.style.background = 'linear-gradient(180deg, #0F1B2E 0%, #1a2332 50%, #1E2D4D 100%)';
          sun.style.opacity = '0';
          moon.style.opacity = '1';
        } else {
          const dawnProgress = (nightToDawn - 0.5) * 2;
          skyContainer.style.background = `linear-gradient(180deg,
            ${interpolateColor('#0F1B2E', '#2D4A6B', dawnProgress)} 0%,
            ${interpolateColor('#1a2332', '#FF8C69', dawnProgress * 0.8)} 30%,
            ${interpolateColor('#1E2D4D', '#FFB6C1', dawnProgress * 0.6)} 60%,
            ${interpolateColor('#1E2D4D', '#F4E4BC', dawnProgress)} 100%)`;

          sun.style.opacity = (dawnProgress * 0.3).toString();
          moon.style.opacity = (1 - dawnProgress * 0.3).toString();
        }
      } else if (scrollPercent < 0.5) {
        const dawnToNoon = (scrollPercent - 0.25) / 0.25;

        skyContainer.style.background = `linear-gradient(180deg,
          ${interpolateColor('#2D4A6B', '#87CEEB', dawnToNoon)} 0%,
          ${interpolateColor('#FF8C69', '#B0E0E6', dawnToNoon)} 50%,
          ${interpolateColor('#F4E4BC', '#FFF8E7', dawnToNoon)} 100%)`;

        sun.style.opacity = (0.3 + dawnToNoon * 0.7).toString();
        moon.style.opacity = (0.7 - dawnToNoon * 0.7).toString();
      } else if (scrollPercent < 0.75) {
        const noonToDusk = (scrollPercent - 0.5) / 0.25;

        skyContainer.style.background = `linear-gradient(180deg,
          ${interpolateColor('#87CEEB', '#4B0082', noonToDusk)} 0%,
          ${interpolateColor('#B0E0E6', '#FF6B6B', noonToDusk)} 30%,
          ${interpolateColor('#FFF8E7', '#FF69B4', noonToDusk)} 60%,
          ${interpolateColor('#FFF8E7', '#FFB6C1', noonToDusk)} 100%)`;

        sun.style.opacity = (1 - noonToDusk * 0.4).toString();
        moon.style.opacity = (noonToDusk * 0.3).toString();
      } else {
        const duskToNight = (scrollPercent - 0.75) / 0.25;

        skyContainer.style.background = `linear-gradient(180deg,
          ${interpolateColor('#4B0082', '#0F1B2E', duskToNight)} 0%,
          ${interpolateColor('#FF6B6B', '#1a2332', duskToNight)} 30%,
          ${interpolateColor('#FF69B4', '#1E2D4D', duskToNight)} 60%,
          ${interpolateColor('#FFB6C1', '#1E2D4D', duskToNight)} 100%)`;

        sun.style.opacity = (0.6 - duskToNight * 0.6).toString();
        moon.style.opacity = (0.3 + duskToNight * 0.7).toString();
      }
    }

    let ticking = false;
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateSky);
        ticking = true;
      }
    }

    window.addEventListener('scroll', () => {
      requestTick();
      ticking = false;
    });

    window.addEventListener('load', updateSky);
    updateSky();

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('load', updateSky);
    };
  }, []);

  return (
    <>
      <div id="skyContainer" className="sky-container" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: 'linear-gradient(180deg, #0F1B2E 0%, #1a2332 50%, #1E2D4D 100%)',
      }}>
        <div id="sun" style={{
          position: 'absolute',
          borderRadius: '50%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, #FFD700 0%, #FFA500 70%, #FF6347 100%)',
          boxShadow: '0 0 80px rgba(255, 215, 0, 0.6)',
          right: '10%',
          top: '20%',
          opacity: 0,
          transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}></div>
        <div id="moon" style={{
          position: 'absolute',
          borderRadius: '50%',
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle at 30% 30%, #F0F4F8 0%, #E8EBF0 50%, #CBDAD5 100%)',
          boxShadow: '0 0 60px rgba(240, 244, 248, 0.4)',
          right: '15%',
          top: '10%',
          opacity: 1,
          transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'rgba(203, 218, 213, 0.4)',
            borderRadius: '50%',
            top: '25%',
            left: '35%',
          }}></div>
          <div style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'rgba(203, 218, 213, 0.3)',
            borderRadius: '50%',
            top: '55%',
            left: '20%',
          }}></div>
        </div>
      </div>
    </>
  );
}
