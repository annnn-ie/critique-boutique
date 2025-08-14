
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/Card';
import { CardData } from '@/types/CardData';
import { X } from 'lucide-react';
import VariableProximity from '@/components/VariableProximity';
import ImageTrail from '@/components/ImageTrail';

const cardData: CardData[] = [
  {
    id: 1,
    name: {
      title: "UX Researcher"
    },
    critique: {
      title: "User Research Focus"
    }
  },
  {
    id: 2,
    name: {
      title: "Product Manager"
    },
    critique: {
      title: "Business Impact Analysis"
    }
  },
  {
    id: 3,
    name: {
      title: "Brand Designer"
    },
    critique: {
      title: "Visual Excellence & Craft"
    }
  },
  {
    id: 4,
    name: {
      title: "Engineer"
    },
    critique: {
      title: "Technical Implementation Reality"
    }
  },
  {
    id: 5,
    name: {
      title: "Content Strategist"
    },
    critique: {
      title: "Data-Driven Optimization"
    }
  },
  {
    id: 6,
    name: {
      title: "Lead Designer"
    },
    critique: {
      title: "Brand Consistency & Alignment"
    }
  },
  {
    id: 7,
    name: {
      title: "Motion Designer"
    },
    critique: {
      title: "Animation & Interaction Flow"
    }
  },
  {
    id: 8,
    name: {
      title: "Design System Advocate"
    },
    critique: {
      title: "Design System & Scalability"
    }
  },
  {
    id: 9,
    name: {
      title: "Information Architect"
    },
    critique: {
      title: "Information Hierarchy & Navigation"
    }
  },
  {
    id: 10,
    name: {
      title: "Accessibility Expert"
    },
    critique: {
      title: "Accessibility & Usability"
    }
  }
];

const Index = () => {
  const [cards, setCards] = useState<CardData[]>(cardData);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [drawnCards, setDrawnCards] = useState<CardData[]>([]);
  const [isDrawingCards, setIsDrawingCards] = useState(false);
  const [drawnCardsFlipped, setDrawnCardsFlipped] = useState<boolean[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingToBack, setIsAnimatingToBack] = useState(false);
  const [cardPositions, setCardPositions] = useState<Array<{ rotation: number; x: number; y: number }>>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isTopCardFlipped, setIsTopCardFlipped] = useState(false);
  const [isDeckTransitioning, setIsDeckTransitioning] = useState(false);
  const [deckPosition, setDeckPosition] = useState('center'); // 'center' or 'top'
  const [showInformation, setShowInformation] = useState(false);
  const [showNamesInput, setShowNamesInput] = useState(false); // Changed to false initially
  const [names, setNames] = useState('');
  const [namesSubmitted, setNamesSubmitted] = useState(false);
  const [showDrawnCards, setShowDrawnCards] = useState(false);
  const [startCardReveal, setStartCardReveal] = useState(false);
  const [showParticipantNames, setShowParticipantNames] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true); // New state for initial screen
  const [showEmptyState, setShowEmptyState] = useState(false); // State for empty state animation
  const dragThreshold = 10; // Reduced threshold for better responsiveness
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate random positions for cards
  const generateRandomPositions = () => {
    const positions = [];
    for (let i = 0; i < 5; i++) {
      positions.push({
        rotation: (Math.random() - 0.5) * 30,
        x: (Math.random() - 0.5) * 24,
        y: (Math.random() - 0.5) * 16
      });
    }
    return positions;
  };

  // Initialize positions on mount
  React.useEffect(() => {
    setCardPositions(generateRandomPositions());
  }, []);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showInitialScreen && e.key === 'Enter') {
        setShowInitialScreen(false);
        // Small delay to ensure the deck slides up smoothly
        setTimeout(() => {
          setShowNamesInput(true);
        }, 100);
      }
      
             // Handle ⌘ + R (Cmd + R) restart shortcut
       if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
         e.preventDefault(); // Prevent browser refresh
         // Reset the deck and all states
         setCards(cardData);
         setSelectedCard(null);
         setIsTopCardFlipped(false);
         setIsDeckTransitioning(false);
         setShowInformation(false);
         setDrawnCards([]);
         setDrawnCardsFlipped([]);
         setShowDrawnCards(false);
         setStartCardReveal(false);
         setShowParticipantNames(false);
         setShowInitialScreen(true);
         setShowNamesInput(false);
         setNames('');
         setNamesSubmitted(false);
         setShowEmptyState(false);
       }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showInitialScreen]);

  // Set deck position based on state
  React.useEffect(() => {
    // Deck should be at top when:
    // 1. Names input is showing
    // 2. Cards are being drawn
    // 3. Cards have been drawn and are being revealed
    if (showNamesInput || isDrawingCards || (drawnCards.length > 0 && !selectedCard)) {
      setDeckPosition('top');
    } else {
      setDeckPosition('center');
    }
  }, [showNamesInput, isDrawingCards, drawnCards.length, selectedCard]);

  // Handle empty state animation
  React.useEffect(() => {
    if (cards.length === 0 && drawnCards.length > 0) {
      // Small delay to ensure smooth transition from drawn cards to empty state
      setTimeout(() => {
        setShowEmptyState(true);
      }, 100);
    } else {
      setShowEmptyState(false);
    }
  }, [cards.length, drawnCards.length]);

  // Global mouse event handlers for better reliability
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!dragStart || cards.length === 0 || (drawnCards.length > 0 && !selectedCard)) return;
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      // Check if we've moved beyond the threshold to start dragging
      if ((Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) && !isDragging) {
        setIsDragging(true);
        // Generate new positions when dragging starts
        setCardPositions(generateRandomPositions());
      }
      
      setDragOffset({ x: deltaX, y: deltaY });
    };

    const handleGlobalMouseUp = () => {
      if (!dragStart || cards.length === 0 || (drawnCards.length > 0 && !selectedCard)) return;
      
              if (!isDragging) {
          // This was a click/tap
          if (showInitialScreen) {
            // Initial screen is active - transition to names input
            setShowInitialScreen(false);
            // Small delay to ensure the deck slides up smoothly
            setTimeout(() => {
              setShowNamesInput(true);
            }, 100);
            return;
          } else if (showNamesInput) {
            // Names input is active - do nothing on tap
            return;
          } else if (namesSubmitted && names.trim()) {
            // Names submitted - draw one card per name
            const namesArray = names.split(',').map(name => name.trim()).filter(name => name.length > 0);
            const cardsToDraw = Math.min(namesArray.length, cards.length);
            
            if (cardsToDraw > 0) {
              setIsDrawingCards(true);
              
              // Draw cards from the deck
              const drawnCardsForNames = cards.slice(0, cardsToDraw);
              setDrawnCards(drawnCardsForNames);
              setDrawnCardsFlipped(new Array(cardsToDraw).fill(false));
              
              // Remove the drawn cards from the deck
              setCards(prevCards => prevCards.slice(cardsToDraw));
              
              // Move deck to top
              setIsDeckTransitioning(true);
              
              // Reset drawing state after animation, then start flipping cards
              setTimeout(() => {
                setIsDrawingCards(false);
                setIsDeckTransitioning(false);
                
                // Show drawn cards section with a slight delay for smooth transition
                setTimeout(() => {
                  setShowDrawnCards(true);
                  // Start the card reveal animation after a brief pause
                  setTimeout(() => {
                    setStartCardReveal(true);
                    
                    // Start flipping cards much sooner - don't wait for all reveal animations
                    // Start flipping cards immediately with a small stagger
                    cards.forEach((_, index) => {
                      setTimeout(() => {
                        setDrawnCardsFlipped(prev => {
                          const newFlipped = [...prev];
                          newFlipped[index] = true;
                          return newFlipped;
                        });
                        
                        // Show participant names only after the last card has flipped
                        if (index === cards.length - 1) {
                          setTimeout(() => {
                            setShowParticipantNames(true);
                          }, 100); // Small delay after the last flip completes
                        }
                      }, 100 * (index + 1)); // Small stagger between flips
                    });
                  }, 100);
                }, 200);
              }, 600);
            } else {
              // Not enough cards - show remaining cards
              setIsDrawingCards(true);
              setDrawnCards(cards);
              setDrawnCardsFlipped(new Array(cards.length).fill(false));
              setCards([]);
              
              setIsDeckTransitioning(true);
              
              setTimeout(() => {
                setIsDrawingCards(false);
                setIsDeckTransitioning(false);
                
                // Show drawn cards section with a slight delay for smooth transition
                setTimeout(() => {
                  setShowDrawnCards(true);
                  // Start the card reveal animation after a brief pause
                  setTimeout(() => {
                    setStartCardReveal(true);
                  }, 100);
                }, 200);
                
                // Start the card reveal animation after a brief pause
                setTimeout(() => {
                  setStartCardReveal(true);
                  
                  // Start flipping cards much sooner - don't wait for all reveal animations
                  // Start flipping cards immediately with a small stagger
                  cards.forEach((_, index) => {
                    setTimeout(() => {
                      setDrawnCardsFlipped(prev => {
                        const newFlipped = [...prev];
                        newFlipped[index] = true;
                        return newFlipped;
                      });
                      
                      // Show participant names only after the last card has flipped
                      if (index === cards.length - 1) {
                        setTimeout(() => {
                          setShowParticipantNames(true);
                        }, 100); // Small delay after the last flip completes
                      }
                    }, 100 * (index + 1)); // Small stagger between flips
                  });
                }, 100);
              }, 600);
            }
          }
        } else {
        // This was a drag - animate card to back of deck
        setIsAnimatingToBack(true);
        
        // After animation completes, shuffle the deck
        setTimeout(() => {
          setCards(prevCards => {
            const [topCard, ...remainingCards] = prevCards;
            const shuffledRemaining = [...remainingCards].sort(() => Math.random() - 0.5);
            return [...shuffledRemaining, topCard];
          });
          setIsAnimatingToBack(false);
          setCardPositions(generateRandomPositions());
          setIsDeckTransitioning(true);
          
          // Reset deck transition after animation
          setTimeout(() => {
            setIsDeckTransitioning(false);
          }, 300);
        }, 300);
      }
      
      // Reset all drag states
      setDragStart(null);
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    };

    // Add global event listeners when dragging
    if (dragStart) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.userSelect = '';
    };
  }, [dragStart, isDragging, cards.length, dragThreshold, showNamesInput, names]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't handle mouse down if we're in drawn cards mode
    if (drawnCards.length > 0 && !selectedCard) return;
    
    if (cards.length === 0 || isFlipping || isAnimatingToBack || isDrawingCards) return;
    
    // If card is selected and information is shown, allow clicking to close
    if (selectedCard && showInformation) {
      resetSelection();
      return;
    }
    
    // If initial screen is showing, handle click to transition
    if (showInitialScreen) {
      setShowInitialScreen(false);
      // Small delay to ensure the deck slides up smoothly
      setTimeout(() => {
        setShowNamesInput(true);
      }, 100);
      return;
    }
    
    e.preventDefault(); // Prevent default to avoid text selection
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const selectCard = (card: CardData) => {
    setSelectedCard(card);
    setShowInformation(true);
  };

  const redrawCard = (index: number) => {
    if (cards.length === 0) {
      console.log('No cards left in deck to redraw');
      return;
    }
    
    console.log(`Redrawing card at index ${index}, cards remaining: ${cards.length}`);
    
    // Get a new card from the deck
    const newCard = cards[0];
    
    // Remove the new card from the deck
    setCards(prevCards => prevCards.slice(1));
    
    // Replace the card at the specified index
    setDrawnCards(prevCards => {
      const newCards = [...prevCards];
      newCards[index] = newCard;
      return newCards;
    });
    
    // Reset the flip state for the redrawn card
    setDrawnCardsFlipped(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = false;
      return newFlipped;
    });
    
    // Flip the new card after a short delay
    setTimeout(() => {
      setDrawnCardsFlipped(prev => {
        const newFlipped = [...prev];
        newFlipped[index] = true;
        return newFlipped;
      });
    }, 150);
  };

  const resetSelection = () => {
    // First hide information with fade-out
    setShowInformation(false);
    
    // After fade-out completes, move deck down and reset states
    setTimeout(() => {
      setSelectedCard(null);
      setIsTopCardFlipped(false);
      setDrawnCards([]);
      setDrawnCardsFlipped([]);
      setShowDrawnCards(false);
      setStartCardReveal(false);
      setShowParticipantNames(false);
      
      // Reset to initial screen
      setShowInitialScreen(true);
      setShowNamesInput(false);
      setNames('');
      setNamesSubmitted(false);
      
      // Start transition back to center
      setIsDeckTransitioning(true);
      setDeckPosition('center');
      
      // Reset deck transition flag after animation
      setTimeout(() => {
        setIsDeckTransitioning(false);
      }, 700);
    }, 300); // Wait for fade-out to complete
  };

  const handleNamesSubmit = () => {
    if (names.trim()) {
      setShowNamesInput(false);
      setNamesSubmitted(true);
      // The actual card drawing will happen on the next deck tap
    }
  };

  const rotation = dragOffset.x * 0.1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-neutral-950">
      {/* Main Content */}
      <main className="relative z-10 min-h-screen" ref={containerRef}>
        {/* Title and Interactive Elements Container */}
        <div className="absolute top-0 left-0 right-0 z-20" style={{ paddingTop: '340px' }}>
          <div className="w-full max-w-4xl mx-auto text-center">
            {/* Title Section - Always render but control visibility with opacity */}
            <div className={`transition-all duration-1000 ease-in-out ${
              showInitialScreen || showNamesInput ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
            }`}>
              <div className="text-center mb-4 flex flex-col items-center">
                <h1 className="font-black text-neutral-50 tracking-tight font-neue-haas" style={{ fontSize: '120px', lineHeight: '100%' }}>
                  <VariableProximity
                    label="CRITIQUE BOUTIQUE"
                    fromFontVariationSettings="'wght' 900"
                    toFontVariationSettings="'wght' 100"
                    containerRef={containerRef}
                    radius={150}
                    falloff="gaussian"
                    className="block"
                  />
                </h1>
              </div>

              {/* Subtitle container - positioned absolutely to not affect layout */}
              <div className="relative h-16 flex justify-center">
                {/* Initial screen subtitle */}
                <div className={`absolute text-center transition-all duration-500 ease-in-out ${
                  showInitialScreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}>
                  <p className="text-neutral-50 text-opacity-70 leading-relaxed font-denton" style={{ fontSize: '48px', lineHeight: '1.0' }}>
                    Feedback with style,<br />
                    purpose, and heart.
                  </p>
                </div>

                {/* Names input subtitle */}
                <div className={`absolute text-center transition-all duration-500 ease-in-out ${
                  showNamesInput ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`} style={{ transitionDelay: showNamesInput ? '100ms' : '0ms' }}>
                  <p className="text-neutral-50 text-opacity-70 max-w-xs leading-relaxed font-normal" style={{ fontSize: '20px' }}>
                    Who will be participating this session?
                  </p>
                </div>
              </div>
            </div>

            {/* Names Input Field - Show when names input is active */}
            <div className={`text-center w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out ${
              showNamesInput ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`} style={{ transitionDelay: showNamesInput ? '300ms' : '0ms' }}>
              <div className="relative mb-4 flex justify-center">
                <input
                  type="text"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && names.trim()) {
                      handleNamesSubmit();
                    }
                  }}
                  placeholder="e.g., Lorem, Ipsum, Dolor"
                  className="w-80 px-4 py-3 text-neutral-50 placeholder-neutral-400 border-b border-neutral-500 outline-none bg-transparent text-center text-lg transition-colors duration-200"
                  autoFocus={showNamesInput}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom instruction text */}
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <div className="relative h-6 flex items-center justify-center w-full">
            {/* Text for initial screen */}
            <p className={`absolute text-neutral-400 text-base uppercase tracking-wide transition-all duration-500 ease-in-out text-center w-full ${
              showInitialScreen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              ENTER ↵ TO START
            </p>
            
            {/* Text for names input state */}
            <p className={`absolute text-neutral-400 text-base uppercase tracking-wide transition-all duration-500 ease-in-out text-center w-full ${
              showNamesInput 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`} style={{ transitionDelay: showNamesInput ? '600ms' : '0ms' }}>
              Write names separated by commas and hit ENTER ↵
            </p>
            
            {/* Text for drawn cards state */}
            <p className={`absolute text-neutral-400 text-base uppercase tracking-wide transition-all duration-500 ease-in-out text-center w-full ${
              drawnCards.length > 0 && !selectedCard && cards.length > 0
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              Tap on a card to redraw a new one ⌘ + R to restart
            </p>
            
            {/* Text for when deck is empty */}
            <p className={`absolute text-neutral-400 text-base uppercase tracking-wide transition-all duration-500 ease-in-out text-center w-full ${
              cards.length === 0 && drawnCards.length > 0
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              ⌘ + R to restart
            </p>
            
            {/* Text for default shuffling state */}
            <p className={`absolute text-neutral-400 text-base uppercase tracking-wide transition-all duration-500 ease-in-out text-center w-full ${
              !showInitialScreen && !showNamesInput && drawnCards.length === 0 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              Drag Cards to Shuffle and tap on the deck to reveal
            </p>
          </div>
        </div>

        {/* Image Trail Effect - Show on initial screen and shuffling screen (before cards are drawn) */}
        {(showInitialScreen || (!showNamesInput && namesSubmitted && !isDragging && drawnCards.length === 0)) && (
          <ImageTrail 
            items={[
              '/lovable-uploads/image-trail/image-1.svg',
              '/lovable-uploads/image-trail/image-2.svg',
              '/lovable-uploads/image-trail/image-3.svg',
              '/lovable-uploads/image-trail/image-4.svg',
              '/lovable-uploads/image-trail/image-5.svg',
              '/lovable-uploads/image-trail/image-6.svg',
              '/lovable-uploads/image-trail/image-7.svg',
              '/lovable-uploads/image-trail/image-8.svg'
            ]}
            variant={5}
            config={{
              threshold: 80,        // Increased from 40 to 80 (bigger threshold)
              animationDuration: 0.8,  // Increased from 0.3 to 0.8 (stays longer)
              fadeOutDelay: 0.6       // Increased from 0.3 to 0.6 (fades out later)
            }}
          />
        )}

        {/* Card Stack - Positioned absolutely for better control */}
        <div className={`absolute inset-0 flex items-center justify-center z-50 ${(drawnCards.length > 0 && !selectedCard) || showNamesInput ? 'pointer-events-none' : ''}`}>
          {cards.length === 0 ? (
            <div className={`text-neutral-50 text-center flex items-center justify-center h-full transition-all duration-300 ease-out ${
              showEmptyState ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0.5'
            }`}>
              <p className="font-denton" style={{ fontSize: '24px', lineHeight: '1.0' }}>No more cards available</p>
            </div>
          ) : (
            <div 
              className={`relative w-48 h-72 transition-transform duration-700 ease-in-out ${
                showInitialScreen ? '-translate-y-[100vh]' : deckPosition === 'top' ? '-translate-y-[380px]' : 'translate-y-0'
              }`}
            >
              <>
                {/* Stack Cards */}
                {cards.slice(0, 5).map((card, index) => {
                  const isTopCard = index === 0;
                  const zIndex = 200 + (cards.length - index); // Increased z-index to be above drawn cards
                  const scale = 1 - index * 0.012;
                  
                  const position = cardPositions[index] || { rotation: 0, x: 0, y: 0 };
                  const baseRotation = position.rotation;
                  const xOffset = position.x;
                  const yOffset = position.y;
                  
                  // Calculate transform
                  let transform;
                  const transitionDuration = isDeckTransitioning ? '0.3s' : '0.3s';
                  
                  if (isTopCard && isAnimatingToBack) {
                    const backCardIndex = Math.min(4, cards.length - 1);
                    const backPosition = cardPositions[backCardIndex] || { rotation: 0, x: 0, y: 0 };
                    const backScale = 1 - backCardIndex * 0.012;
                    transform = `translate(${backPosition.x}px, ${backPosition.y}px) rotate(${backPosition.rotation}deg) scale(${backScale})`;
                  } else if (isTopCard && isDragging) {
                    transform = `translate(${dragOffset.x + xOffset}px, ${dragOffset.y + yOffset}px) rotate(${rotation}deg) scale(${scale})`;
                  } else {
                    transform = `translate(${xOffset}px, ${yOffset}px) rotate(${baseRotation}deg) scale(${scale})`;
                  }
                  
                  return (
                    <div
                      key={card.id}
                      className="absolute cursor-pointer select-none"
                      style={{
                        zIndex: isTopCard && isAnimatingToBack ? 1 : zIndex,
                        transform,
                        transition: (isDragging && isTopCard) ? 'none' : `all ${transitionDuration} ease-out`,
                      }}
                      onMouseDown={isTopCard ? handleMouseDown : undefined}
                    >
                      <Card
                        data={card}
                        isStacked={!isTopCard}
                        isFlipped={isTopCard && (isFlipping || isTopCardFlipped)}
                        onClick={() => {}}
                        disabled={!isTopCard}
                        isDragging={isTopCard && isDragging}
                      />
                    </div>
                  );
                })}
              </>
            </div>
          )}
        </div>

        {/* Drawn Cards Section - Show when cards have been drawn and deck is not empty */}
        {drawnCards.length > 0 && !selectedCard && showDrawnCards && cards.length > 0 && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center z-30 transition-all duration-1000 ease-in-out ${
            isDrawingCards ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
          }`} style={{ paddingTop: '100px', pointerEvents: 'auto' }}>
            <div className="relative mb-8" style={{ width: '100%', height: '200px', pointerEvents: 'auto' }}>
              {drawnCards.map((card, index) => {
                const namesArray = names.split(',').map(name => name.trim()).filter(name => name.length > 0);
                const participantName = namesArray[index] || `Participant ${index + 1}`;
                
                // Calculate the starting position (from deck) and final position
                const isAnimating = !startCardReveal;
                const cardDelay = index * 150; // Stagger each card by 150ms
                const animationProgress = isAnimating ? 0 : 1;
                
                // Start position: center (where deck is at the top)
                const startY = -524; // Start at the exact top edge of the card stack (deck's -380px + half card height)
                const startX = 0; // All cards start at center (deck position)
                const startScale = 1; // Start at normal size (no scaling)
                const startRotation = 0; // Start with no rotation
                
                // Final position: spread out horizontally from center, at display level
                const finalY = 0; // Final display position
                const finalX = (index - (drawnCards.length - 1) / 2) * 260; // Spread horizontally with 260px gaps
                const finalScale = 1; // End at normal size (no scaling)
                const finalRotation = 0;
                
                // Interpolate between start and final positions
                const currentY = startY + (finalY - startY) * animationProgress;
                const currentX = startX + (finalX - startX) * animationProgress;
                const currentScale = startScale + (finalScale - startScale) * animationProgress;
                const currentRotation = startRotation + (finalRotation - startRotation) * animationProgress;
                
                return (
                  <div
                    key={`${card.id}-${index}`}
                    className="absolute top-0 flex flex-col items-center"
                    style={{ 
                      left: `calc(50% + ${currentX}px)`,
                      transform: `translateX(-50%) translateY(${currentY}px) scale(${currentScale}) rotate(${currentRotation}deg)`,
                      pointerEvents: 'auto',
                      zIndex: 100 + index, // Ensure each card has a unique z-index
                      transitionDelay: `${cardDelay}ms`,
                      transition: 'all 500ms ease-out',
                    }}
                  >
                    <div
                      className="relative mb-4"
                      style={{
                        pointerEvents: 'auto',
                      }}
                    >
                      <Card
                        data={card}
                        isStacked={false}
                        isFlipped={drawnCardsFlipped[index] || false}
                        onClick={() => {
                          console.log(`Card ${index} clicked, cards remaining: ${cards.length}`);
                          redrawCard(index);
                        }}
                        disabled={false}
                        isDragging={false}
                      />
                      {/* Participant name underneath each card */}
                      <div className={`text-center mt-4 transition-all duration-500 ease-in-out ${
                        showParticipantNames ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <p className="text-neutral-50 text-lg font-black">
                          {participantName}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Content Section - Only show when card is selected and information should be visible */}
        {selectedCard && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            showInformation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="w-full max-w-4xl mx-auto transition-all duration-500 ease-in-out">
              {/* Content */}
              <div className="bg-neutral-50 rounded-2xl shadow-2xl p-8">
                {/* Name */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4">Name</h3>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-xl font-semibold text-neutral-600 mb-3">
                      {selectedCard.name.title}
                    </h4>
                  </div>
                </div>

                {/* In a Critique */}
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4">In a Critique</h3>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-xl font-semibold text-neutral-600 mb-3">
                      {selectedCard.critique.title}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
