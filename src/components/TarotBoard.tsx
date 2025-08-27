'use client';

import { useState, useEffect } from 'react';
import TarotCard from './TarotCard';
import { loadTarotCards, shuffleCards, type TarotCard as TarotCardType } from '../data/tarotDeck';
import config from '../config/webhook';

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
          let readingId;
          try {
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

            if (!initResponse.ok) throw new Error('Error creating reading');
            const initData = await initResponse.json();
            readingId = initData.readingId;
          } catch (error) {
            console.error('Error creating reading:', error);
            throw new Error('No se pudo iniciar la lectura');
          }

          // Preparamos el payload para n8n
          const webhookPayload = {
            readingId,
            question,
            firstCard: newSelectedCards[0].name,
            secondCard: newSelectedCards[1].name,
            thirdCard: newSelectedCards[2].name,
          };

          // Función para enviar al webhook
          const sendToWebhook = async (url: string) => {
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookPayload),
              });
              
              if (!response.ok) throw new Error(`Error ${response.status}`);
              return await response.json();
            } catch (error) {
              console.error(`Error sending to ${url}:`, error);
              return null;
            }
          };

          // Enviar a webhook de prueba y/o producción
          const webhookUrls = [];
          
          if (config.isTestMode) {
            webhookUrls.push(`${config.n8nWebhookUrl}${config.n8nWebhookTestPath}`);
          }
          
          webhookUrls.push(`${config.n8nWebhookUrl}${config.n8nWebhookProdPath}`);
          
          // Enviamos a todos los webhooks configurados
          const responses = await Promise.all(webhookUrls.map(url => sendToWebhook(url)));
          
          // Si al menos una respuesta fue exitosa, continuamos
          const successResponse = responses.find(response => response !== null);
          
          if (successResponse) {
            setReadingId(readingId); // Usamos el readingId que ya tenemos
            setReadingComplete(true);
            onReadingComplete(newSelectedCards);
          } else {
            throw new Error('No se pudo enviar la lectura a ningún webhook');
          }
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
