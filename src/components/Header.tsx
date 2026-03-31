import React from 'react';
import ivcLogo from '../assets/ivc_logo.jpg';

const Header: React.FC = () => {
  return (
    <header className="flex items-center px-8 py-4 border-b border-white/5">
      {/* Left: inunity */}
      <span className="text-lg font-light tracking-[0.2em] text-gray-500 mr-6">inunity</span>
      
      {/* Divider */}
      <div className="h-10 w-px bg-white/10 mr-5"></div>
      
      {/* Logo + College Info */}
      <img src={ivcLogo} alt="VVCE" className="w-10 h-10 rounded-full border border-cyan-glow/20 mr-4" />
      <div>
        <p className="text-[9px] tracking-[0.15em] text-gray-500 font-semibold uppercase">VIDYAVARDHAKA SANGA®, MYSORE</p>
        <p className="text-sm font-bold tracking-wider text-white">Vidyavardhaka College of Engineering</p>
        <p className="text-[8px] tracking-[0.1em] text-gray-600 uppercase">Autonomous institute affiliated to VTU, Belagavi</p>
      </div>
    </header>
  );
};

export default Header;
