import React from 'react';
import ivcLogo from '../assets/ivc_logo.jpg';

const Header: React.FC = () => {
  return (
    <header className="flex items-center px-10 py-5 bg-white border-b border-[#e2e8f0] relative z-[100] shadow-sm">
      {/* Left: inunity branding */}
      <div className="flex items-center pr-10">
        <span className="text-2xl font-display font-black tracking-tighter text-[#0f172a] flex items-center gap-2">
          inunity
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
        </span>
      </div>
      
      {/* Vertical Divider */}
      <div className="h-10 w-[1px] bg-[#e2e8f0]"></div>
      
      {/* Right: College Information Block */}
      <div className="flex items-center gap-6 pl-10">
        <div className="relative group">
            <div className="absolute inset-0 bg-[#3b82f6]/5 blur-[20px] rounded-full scale-150 transition-all group-hover:bg-[#3b82f6]/10" />
            <img 
              src={ivcLogo} 
              alt="VVCE" 
              className="w-12 h-12 object-contain relative z-10 grayscale-0 shadow-sm rounded-xl"
              style={{
                 border: '1px solid #f1f5f9'
              }}
            />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-[10px] tracking-[0.15em] text-[#64748b] font-bold uppercase mb-0.5">
            VIDYAVARDHAKA SANGHA ®, MYSORE
          </p>
          <h2 className="text-lg font-extrabold tracking-tight text-[#0f172a] leading-tight font-display">
            Vidyavardhaka College of Engineering
          </h2>
          <p className="text-[10px] tracking-tight text-[#94a3b8] font-bold">
            Autonomous institute affiliated to VTU, Belagavi
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
