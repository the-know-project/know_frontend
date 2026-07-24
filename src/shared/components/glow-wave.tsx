import React from "react";

interface GlowWaveProps {
  text: string;
  className?: string;
  letterDelay?: number;
  animationDuration?: number;
  as?: React.ElementType;
}

const GlowWave: React.FC<GlowWaveProps> = ({
  text,
  className = "",
  letterDelay = 0.08,
  animationDuration = 1,
  as: Component = "p",
}) => {
  return (
    <Component className={className}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="glow-letter max-w-prose"
          style={{
            animationDelay: `${index * letterDelay}s`,
            animationDuration: `${animationDuration}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </Component>
  );
};

export default GlowWave;
