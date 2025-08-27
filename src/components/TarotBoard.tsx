'use client';

import { useState, useEffect } from 'react';
import TarotCard from './TarotCard';
import { loadTarotCards, shuffleCards, type TarotCard as TarotCardType } from '../data/tarotDeck';

interface TarotBoardProps {
  onReadingComplete: (selectedCards: TarotCardType[]) => void;
  question: string;
}

export default function TarotBoard({ onReadingComplete, question }: TarotBoardProps) {
  const [deck, setDeck] = useState<TarotCardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<TarotCardType[]>([]);
  const [readingComplete, setReadingComplete] = useState(false);
  const [interpretation, setInterpretation] = useState('Las cartas están siendo interpretadas...');
  const [readingId, setReadingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadCards() {
      const cards = await loadTarotCards();
      const shuffledDeck = shuffleCards(cards);
      setDeck(shuffledDeck);
    }

    loadCards();
  }, []);

  // Efecto para hacer polling del estado de la lectura
  useEffect(() => {
    if (!readingId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/reading-webhook?id=${readingId}`);
        const data = await response.json();
        
        if (data.status === 'completed' && data.interpretation) {
          setInterpretation(data.interpretation);
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Error polling reading status:', error);
      }
    }, 5000); // Poll cada 5 segundos

    return () => clearInterval(pollInterval);
  }, [readingId]);

  const handleCardClick = async (card: TarotCardType) => {
    if (readingComplete || isLoading) return;
    
    if (selectedCards.includes(card)) {
      // No permitir deseleccionar cartas una vez volteadas
      return;
    } else if (selectedCards.length < 3) {
      const newSelectedCards = [...selectedCards, card];
      setSelectedCards(newSelectedCards);
      
      if (newSelectedCards.length === 3) {
        setIsLoading(true);
        try {
          // Primero creamos un ID de lectura
          const initResponse = await fetch('/api/reading-webhook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question,
              firstCard: newSelectedCards[0].name,
              secondCard: newSelectedCards[1].name,
              thirdCard: newSelectedCards[2].name,
            }),
          });

          const initData = await initResponse.json();
          const readingId = initData.readingId;

          // Luego enviamos al webhook de n8n
          const response = await fetch('http://localhost:5678/webhook/tarot-reading', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              readingId,
              question,
              firstCard: newSelectedCards[0].name,
              secondCard: newSelectedCards[1].name,
              thirdCard: newSelectedCards[2].name,
            }),
          });

          const data = await response.json();
          setReadingId(data.readingId);
          setReadingComplete(true);
          onReadingComplete(newSelectedCards);
        } catch (error) {
          console.error('Error sending reading:', error);
          setInterpretation('Lo siento, ha ocurrido un error al procesar tu lectura.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  if (readingComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl px-4">
          {/* Cartas */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-4 md:gap-8 mb-8">
            {selectedCards.map((card, index) => (
              <div
                key={index}
                className="transform transition-transform duration-500 animate-cardFloat"
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <TarotCard
                  name={card.name}
                  image={card.image}
                  isFlipped={true}
                  isSelectable={false}
                  backImage="/full_cards/000.jpg"
                />
              </div>
            ))}
          </div>
          {/* Texto */}
          <div className="text-center space-y-4 mt-8 md:mt-12">
            <div className="text-gold text-lg md:text-xl lg:text-2xl font-medium">
              Tu pregunta: {question}
            </div>
            <div className="mt-4 text-purple-200 text-base md:text-lg lg:text-xl">
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gold"></div>
                  <span>Procesando tu lectura...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p>{interpretation}</p>
                  {readingId && (
                    <p className="text-sm text-gold">
                      ID de lectura: {readingId}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center">
          {deck.slice(0, 10).map((card, index) => (
            <div
              key={index}
              className={`transform transition-transform duration-300 ${
                selectedCards.includes(card) ? 'scale-105' : 'hover:scale-105'
              }`}
            >
              <TarotCard
                name={card.name}
                image={card.image}
                isFlipped={selectedCards.includes(card)}
                isSelectable={selectedCards.length < 3 && !selectedCards.includes(card)}
                backImage="/full_cards/000.jpg"
                onClick={() => handleCardClick(card)}
              />
            </div>
          ))}
        </div>
        <div className="text-center text-gray-200 text-base md:text-lg mt-6">
          {selectedCards.length < 3 
            ? `Selecciona ${3 - selectedCards.length} carta${3 - selectedCards.length === 1 ? '' : 's'} más`
            : '¡Lectura completada!'}
        </div>
      </div>
    </div>
  );
}
