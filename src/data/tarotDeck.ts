export interface TarotCard {
  id: number;
  name: string;
  number: string;
  arcana: string;
  suit: string;
  image: string;
  archetype: string;
  numerology: string;
  elemental: string;
  mythicalSpiritual: string;
}

export const BACK_CARD_IMAGE = '/full_cards/000.jpg';
export const CARDS_PATH = '/full_cards/';

export async function loadTarotCards(): Promise<TarotCard[]> {
  try {
    const response = await fetch('/full_cards/tarot-images.json');
    const data = await response.json();
    
    return data.cards.map((card: any, index: number) => ({
      id: index + 1,
      name: card.name,
      number: card.number,
      arcana: card.arcana,
      suit: card.suit,
      image: CARDS_PATH + card.img,
      archetype: card.Archetype,
      numerology: card.Numerology,
      elemental: card.Elemental,
      mythicalSpiritual: card.Mythical_Spiritual || card['Mythical/Spiritual']
    }));
  } catch (error) {
    console.error('Error loading tarot cards:', error);
    return [];
  }
}

// Función para barajar las cartas
export function shuffleCards<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
