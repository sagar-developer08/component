'use client'

import React from 'react'
import Image from 'next/image'

export default function LoadingScreen() {
  const loadingScreenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  };

  const loadingContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px'
  };

  const logoContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const logoWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'logoFloat 3s ease-in-out infinite'
  };

  const logoImageStyle = {
    position: 'relative',
    zIndex: 2,
    filter: 'drop-shadow(0 4px 8px rgba(0, 130, 255, 0.2))',
    animation: 'logoPulse 2s ease-in-out infinite'
  };

  const logoGlowStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '140px',
    height: '80px',
    background: 'radial-gradient(circle, rgba(0, 130, 255, 0.3) 0%, rgba(0, 130, 255, 0.1) 50%, transparent 70%)',
    borderRadius: '50%',
    animation: 'glowPulse 2s ease-in-out infinite',
    zIndex: 1
  };

  const loadingDotsStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    background: '#0082FF',
    borderRadius: '50%',
    animation: 'dotPulse 1.4s ease-in-out infinite both'
  };

  return (
    <div style={loadingScreenStyle}>
      <div style={loadingContentStyle}>
        <div style={logoContainerStyle}>
          <div style={logoWrapperStyle}>
            <Image
              src="/logo.png"
              alt="QLIQ Logo"
              width={120}
              height={60}
              priority
              style={logoImageStyle}
            />
            <div style={logoGlowStyle}></div>
          </div>
        </div>
        <div style={loadingDotsStyle}>
          <div style={{...dotStyle, animationDelay: '-0.32s'}}></div>
          <div style={{...dotStyle, animationDelay: '-0.16s'}}></div>
          <div style={{...dotStyle, animationDelay: '0s'}}></div>
        </div>
      </div>
      <style>{`
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes logoPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 4px 8px rgba(0, 130, 255, 0.2));
          }
          50% {
            transform: scale(1.05);
            filter: drop-shadow(0 6px 12px rgba(0, 130, 255, 0.4));
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
