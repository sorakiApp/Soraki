
import React, { useState, useEffect } from 'react';

const FloatingMascot: React.FC = () => {
  const [positions, setPositions] = useState<Array<{ top: string; left: string; animationDuration: string }>>([]);

  useEffect(() => {
    const newPositions = Array.from({ length: 3 }).map(() => ({
      top: `${Math.random() * 90}vh`,
      left: `${Math.random() * 90}vw`,
      animationDuration: `${8 + Math.random() * 7}s`
    }));
    setPositions(newPositions);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
      {positions.map((pos, i) => (
        <img
          key={i}
          src="/resources/2.png"
          className="absolute w-24 h-24 animate-float opacity-50"
          style={{
            top: pos.top,
            left: pos.left,
            animationDuration: pos.animationDuration,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite'
          }}
          alt=""
        />
      ))}
    </div>
  );
};

export default FloatingMascot;
