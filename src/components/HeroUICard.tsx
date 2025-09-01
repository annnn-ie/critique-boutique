import React from 'react';
import { Card as HeroUICard, CardBody, Button, Chip, Avatar, Badge } from '@heroui/react';
import { CardData } from '@/types/CardData';

interface HeroUICardProps {
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
  8: '/lovable-uploads/design-system-advocate.png',
  9: '/lovable-uploads/information-architect.png',
  10: '/lovable-uploads/accessibility-expert.png',
};

export const HeroUICardComponent: React.FC<HeroUICardProps> = ({ 
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
          relative transition-all duration-1000 cursor-pointer
          ${isFlipped ? 'transform-style-preserve-3d rotate-y-180' : 'transform-style-preserve-3d'}
          ${!disabled && !isStacked ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl' : ''}
          ${disabled && !isDragging ? 'cursor-not-allowed' : ''}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        onClick={handleClick}
        style={{
          width: '180px',
          height: '256px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          pointerEvents: disabled ? 'none' : 'auto',
          zIndex: 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled && !isStacked) {
            e.currentTarget.style.transform = `${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'} rotate(${hoverRotation}deg)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !isStacked) {
            e.currentTarget.style.transform = `${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`;
          }
        }}
      >
        {/* Card Back */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl shadow-xl backface-hidden bg-neutral-50 p-2"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div 
            className="w-full h-full rounded-xl"
            style={{
              backgroundImage: 'url(/lovable-uploads/card-back.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>

        {/* Card Front */}
        <div 
          className="absolute inset-0 w-full h-full bg-neutral-50 rounded-2xl shadow-xl backface-hidden p-2"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div 
            className="w-full h-full rounded-xl"
            style={{
              backgroundImage: `url(${cardFrontImages[data.id]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Alternative HeroUI Card implementation using HeroUI components
export const HeroUICardAlternative: React.FC<HeroUICardProps> = ({ 
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

  return (
    <div className="relative perspective-1000" style={{ zIndex: 1 }}>
      <div
        className={`
          relative transition-all duration-1000 cursor-pointer
          ${isFlipped ? 'transform-style-preserve-3d rotate-y-180' : 'transform-style-preserve-3d'}
          ${!disabled && !isStacked ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl' : ''}
          ${disabled && !isDragging ? 'cursor-not-allowed' : ''}
          ${isDragging ? 'cursor-grabbing' : ''}
        `}
        onClick={handleClick}
        style={{
          width: '180px',
          height: '256px',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 1000ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          pointerEvents: disabled ? 'none' : 'auto',
          zIndex: 1,
        }}
      >
        {/* Card Back using HeroUI Card */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <HeroUICard 
            className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200"
            shadow="lg"
          >
            <CardBody className="p-0 flex items-center justify-center">
              <div 
                className="w-full h-full rounded-xl"
                style={{
                  backgroundImage: 'url(/lovable-uploads/card-back.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </CardBody>
          </HeroUICard>
        </div>

        {/* Card Front using HeroUI Card */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <HeroUICard 
            className="w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100"
            shadow="lg"
          >
            <CardBody className="p-0 flex flex-col">
              <div 
                className="w-full h-3/4 rounded-t-xl"
                style={{
                  backgroundImage: `url(${cardFrontImages[data.id]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="p-3 flex flex-col gap-2">
                <Chip 
                  color="primary" 
                  variant="flat" 
                  size="sm"
                  className="w-fit"
                >
                  {data.name.title}
                </Chip>
                <p className="text-xs text-neutral-600 font-medium">
                  {data.critique.title}
                </p>
              </div>
            </CardBody>
          </HeroUICard>
        </div>
      </div>
    </div>
  );
};
