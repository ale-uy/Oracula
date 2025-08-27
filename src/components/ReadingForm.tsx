'use client';
import { useState } from 'react';
import TarotBoard from './TarotBoard';
import { type TarotCard } from '../data/tarotDeck';

interface ReadingResult {
  question: string;
  firstCard: string;
  secondCard: string;
  thirdCard: string;
  timestamp: string;
}

export default function ReadingForm() {
  const [question, setQuestion] = useState('');
  const [showTarotBoard, setShowTarotBoard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTarotBoard(true);
  };

  const handleReadingComplete = async (cards: TarotCard[]) => {
    const readingResult: ReadingResult = {
      question,
      firstCard: cards[0].name,
      secondCard: cards[1].name,
      thirdCard: cards[2].name,
      timestamp: new Date().toISOString()
    };

    try {
      // Enviar el resultado al webhook
      const response = await fetch('/api/reading-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(readingResult),
      });

      if (!response.ok) {
        console.error('Error al enviar la lectura al webhook');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {!showTarotBoard ? (
        <div className="max-w-md mx-auto mt-8 p-6 bg-purple-900/30 rounded-lg backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-purple-200 mb-2">
                ¿Qué deseas consultar?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-purple-900/50 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                required
                placeholder="Escribe tu pregunta aquí..."
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 bg-purple-600 text-white rounded-md transition-all
                ${question.length > 0 ? 'hover:bg-purple-700 hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}`}
              disabled={question.length === 0}
            >
              Consultar las cartas
            </button>
          </form>
        </div>
      ) : (
        <TarotBoard 
          onReadingComplete={handleReadingComplete}
          question={question}
        />
      )}
    </>
  );
}
