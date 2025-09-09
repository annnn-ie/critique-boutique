
import React from 'react';
import { CardData } from '@/types/CardData';

interface CardProps {
  data: CardData;
  isStacked?: boolean;
  isFlipped?: boolean;
  onClick: () => void;
  disabled?: boolean;
  isDragging?: boolean;
}

// Map card IDs to their corresponding front images using the new PNG files
const cardFrontImages: Record<number, string> = {
  1: '/lovable-uploads/ux-researcher.png',
  2: '/lovable-uploads/product-manager.png',
  3: '/lovable-uploads/brand-designer.png',
  4: '/lovable-uploads/engineer.png',
  5: '/lovable-uploads/content-strategist.png',
  6: '/lovable-uploads/lead-designer.png',
  7: '/lovable-uploads/motion-designer.png',
  8: '/lovable-uploads/design-systems-advocate.png',
  9: '/lovable-uploads/information-architect.png',
  10: '/lovable-uploads/accessibility-expert.png',
};

export const Card: React.FC<CardProps> = ({ 
  data, 
  isStacked = false, 
  isFlipped = false, 
  onClick, 
  disabled = false,
  isDragging = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      console.log('Card click blocked - disabled');
      return;
    }
    
    console.log('Card clicked:', data.id, 'disabled:', disabled, 'isStacked:', isStacked);
    onClick();
  };

  // Generate a slight random rotation for hover effect (only for drawn cards)
  const hoverRotation = !isStacked && !disabled ? (Math.random() - 0.5) * 8 : 0; // ±4 degrees

  return (
    <div className="relative perspective-1000" style={{ zIndex: 1 }}>
      <div
        className={`
          relative cursor-pointer shadow-xl
          ${isFlipped ? 'transform-style-preserve-3d rotate-y-180' : 'transform-style-preserve-3d'}
          ${disabled && !isDragging ? 'cursor-not-allowed' : ''}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        onClick={handleClick}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          pointerEvents: disabled ? 'none' : 'auto',
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isStacked && !isDragging) {
            e.currentTarget.style.transform = `${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'} rotate(${hoverRotation}deg) scale(1.05) translateY(-8px)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isStacked && !isDragging) {
            e.currentTarget.style.transform = `${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`;
          }
        }}
      >
        {/* Card Back */}
        <div 
          className="relative rounded-2xl backface-hidden border"
          style={{ borderColor: '#EFEFF0' }}
        >
          <img
            src="/lovable-uploads/card-back.png"
            alt="Card back"
            className="block"
            style={{
              maxWidth: '280px',
              maxHeight: '400px',
            }}
          />
        </div>

        {/* Card Front */}
        <div 
          className="absolute inset-0 rounded-2xl backface-hidden border"
          style={{
            transform: 'rotateY(180deg)',
            borderColor: '#EFEFF0',
          }}
        >
          <img
            src={cardFrontImages[data.id]}
            alt={`${data.name.title} card`}
            className="block"
            style={{
              maxWidth: '280px',
              maxHeight: '400px',
            }}
          />
        </div>
        

      </div>
    </div>
  );
};
