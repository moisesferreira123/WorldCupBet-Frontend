import React from "react";

export default function BackgroundElements() {
  const ballSrc = "/ball.svg";
  
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="absolute -top-[5%] -left-[10%] w-[45vw] h-[45vw] max-w-[600px] opacity-10 rotate-12 blur-[2px] animate-spin-slow invert">
        <img src={ballSrc} alt="" className="w-full h-full object-contain" />
      </div>
      <div className="absolute -bottom-[10%] -right-[5%] w-[40vw] h-[40vw] max-w-[500px] opacity-10 -rotate-12 blur-[1px] [animation-direction:reverse] animate-spin-slow invert">
        <img src={ballSrc} alt="" className="w-full h-full object-contain" />
      </div>
      
      {/* Optional: Add a third one for more depth */}
      <div className="absolute top-[40%] right-[10%] w-[15vw] h-[15vw] max-w-[200px] opacity-[0.07] rotate-45 blur-[3px] animate-spin-slow invert">
        <img src={ballSrc} alt="" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
