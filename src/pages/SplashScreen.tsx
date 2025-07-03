import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import fluxpenseLogo from '@/assets/fluxpense-logo.png';
// import waveAnimation from '@/assets/wave.json'; // TODO: Restore when available

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a2342 0%, #274472 100%)',
      }}
    >
      {/* Elevated glassy logo card */}
      <div
        className="mt-24 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center"
        style={{ width: 140, height: 140, boxShadow: '0 8px 32px 0 rgba(10,35,66,0.25)', animation: 'float 4s ease-in-out infinite' }}
      >
        <img
          src={fluxpenseLogo}
          alt="FluxPense"
          className="w-24 h-24 object-contain"
        />
      </div>
      {/* Elegant slogan */}
      <h2
        className="mt-12 text-white text-3xl font-extrabold z-10 tracking-wide drop-shadow-lg text-center"
        style={{ letterSpacing: 2 }}
      >
        Your Money, Your Control
      </h2>
      {/* Wide, glassy, glowing button */}
      <button
        className="mt-20 w-[90vw] max-w-xl py-5 rounded-2xl bg-white/20 border border-white/30 text-white text-xl font-bold shadow-2xl backdrop-blur-lg transition-transform duration-200 hover:scale-105 focus:scale-100 focus:outline-none focus:ring-4 focus:ring-primary/40 ring-offset-2 ring-offset-background"
        style={{ boxShadow: '0 4px 32px 0 rgba(39,68,114,0.25), 0 0 16px 2px #3a5a99' }}
        onClick={() => navigate('/welcome')}
      >
        Continue
      </button>
      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
