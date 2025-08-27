'use client';

interface TarotCardProps {
  name: string;
  image: string;
  isFlipped: boolean;
  isSelectable: boolean;
  backImage?: string;
  onClick?: () => void;
}

export default function TarotCard({ name, image, isFlipped, isSelectable, backImage = '/cards/back.jpg', onClick }: TarotCardProps) {
  return (
    <div 
      className={`relative w-[120px] sm:w-[140px] md:w-[160px] h-[206px] sm:h-[240px] md:h-[274px] cursor-pointer perspective-1000 transition-all duration-500 ease-in-out transform 
        ${isSelectable ? 'hover:scale-105' : ''} 
        ${!isSelectable ? 'opacity-50' : ''}`}
      onClick={isSelectable ? onClick : undefined}
    >
      <div className="relative w-full h-full">
        <div 
          className={`
            w-full h-full 
            transition-all duration-1000 transform-style-preserve-3d 
            ${isFlipped ? 'rotate-y-180' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          {/* Parte frontal de la carta (reverso) */}
          <div 
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-full h-full rounded-lg shadow-lg overflow-hidden border-2 border-purple-400">
              <img 
                src={backImage}
                alt="Reverso"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Parte trasera de la carta (frente) */}
          <div 
            className={`
              absolute w-full h-full backface-hidden
              ${isFlipped ? 'animate-cardFloat' : ''}
            `}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className={`
              w-full h-full rounded-lg shadow-lg overflow-hidden border-2 border-purple-300
              ${isFlipped ? 'animate-golden-aura' : ''}
            `}>
              <img 
                src={image} 
                alt={name}
                className="w-full h-full object-contain"
                style={{
                  transform: 'scaleX(-1)'
                }}
              />
            </div>
          </div>
          
          {/* Efecto de destello dorado */}
          {isFlipped && (
            <div 
              className={`
                absolute inset-0 animate-golden-reveal pointer-events-none rounded-lg
                before:content-[''] before:absolute before:inset-0 before:rounded-lg
                before:bg-gradient-to-r before:from-yellow-300/0 before:via-yellow-300/30 before:to-yellow-300/0
                before:animate-shimmer
              `}
              style={{ 
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
