import React, { useState } from 'react';

export default function PropertySpotlight({ properties, onSelectProperty, onShareProperty }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!properties || properties.length === 0) return null;

  const current = properties[currentIndex] || properties[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      minHeight: 340,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Background high-res image with dark luxury vignette */}
      <img
        src={current.image}
        alt={current.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          transition: 'transform 0.5s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(8,12,20,0.4) 0%, rgba(8,12,20,0.85) 100%)',
        zIndex: 2,
      }}></div>

      {/* Top Bar of spotlight */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            fontSize: '0.74rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            padding: '0.25rem 0.75rem',
            borderRadius: 999,
            background: 'rgba(34, 197, 94, 0.25)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: 'var(--emerald-neon)'
          }}>
            Spotlight Property
          </span>
          <span style={{ fontSize: '0.78rem', color: '#FFF', opacity: 0.85 }}>
            {current.category} • {current.type}
          </span>
        </div>

        {/* Carousel controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button 
            onClick={handlePrev}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 700 }}>
            {currentIndex + 1}/{properties.length}
          </span>
          <button 
            onClick={handleNext}
            style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Bottom Info Area matching reference monitor */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--teal-light)', marginRight: 6 }}></i>
            {current.location}
          </div>
          <h3 style={{ fontSize: '1.6rem', color: '#FFF', fontWeight: 800, marginTop: 4 }}>
            {current.title}
          </h3>
          <div style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
            Valued at {current.priceFormatted} ({current.area})
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Your Commission ({current.commissionPct}%)
            </span>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: 'var(--emerald-neon)'
            }}>
              {current.commissionFormatted}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onShareProperty(current)}
              className="btn btn-outline btn-sm"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              <i className="fa-solid fa-share-nodes"></i>
              <span>Share Link</span>
            </button>
            <button
              onClick={() => onSelectProperty(current)}
              className="btn btn-neon btn-sm"
            >
              <span>View Property</span>
              <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.75rem' }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
