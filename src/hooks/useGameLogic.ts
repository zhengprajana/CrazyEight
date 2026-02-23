import { useState, useEffect, useCallback } from 'react';
import { GameState, Card, Suit, Turn } from '../types';
import { createDeck, isPlayable, shuffle } from '../utils';

export const useGameLogic = () => {
  const [state, setState] = useState<GameState>({
    deck: [],
    discardPile: [],
    playerHand: [],
    aiHand: [],
    turn: 'player',
    status: 'waiting',
    winner: null,
    currentSuit: null,
  });

  const [showSuitSelector, setShowSuitSelector] = useState(false);
  const [pendingCard, setPendingCard] = useState<Card | null>(null);

  const startGame = useCallback(() => {
    const fullDeck = createDeck();
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Ensure first card is not an 8
    let firstCardIndex = 0;
    while (fullDeck[firstCardIndex].rank === '8') {
      firstCardIndex++;
    }
    const discardPile = [fullDeck.splice(firstCardIndex, 1)[0]];

    setState({
      deck: fullDeck,
      discardPile,
      playerHand,
      aiHand,
      turn: 'player',
      status: 'playing',
      winner: null,
      currentSuit: null,
    });
  }, []);

  const drawCard = useCallback((turn: Turn) => {
    setState(prev => {
      if (prev.deck.length === 0) {
        // If deck is empty, we should ideally reshuffle discard pile
        if (prev.discardPile.length <= 1) return { ...prev, turn: prev.turn === 'player' ? 'ai' : 'player' };
        
        const topCard = prev.discardPile[prev.discardPile.length - 1];
        const rest = prev.discardPile.slice(0, -1);
        const newDeck = shuffle(rest);
        
        const drawn = newDeck.pop()!;
        const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
        
        return {
          ...prev,
          deck: newDeck,
          discardPile: [topCard],
          [handKey]: [...prev[handKey], drawn],
          turn: prev.turn === 'player' ? 'ai' : 'player'
        };
      }

      const newDeck = [...prev.deck];
      const drawn = newDeck.pop()!;
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';

      return {
        ...prev,
        deck: newDeck,
        [handKey]: [...prev[handKey], drawn],
        turn: prev.turn === 'player' ? 'ai' : 'player'
      };
    });
  }, []);

  const playCard = useCallback((card: Card, turn: Turn, chosenSuit?: Suit) => {
    setState(prev => {
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      const nextTurn = turn === 'player' ? 'ai' : 'player';
      
      const isWinner = newHand.length === 0;

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        turn: isWinner ? prev.turn : nextTurn,
        status: isWinner ? 'gameOver' : 'playing',
        winner: isWinner ? turn : null,
        currentSuit: card.rank === '8' ? (chosenSuit || null) : null,
      };
    });
  }, []);

  const handlePlayerPlay = (card: Card) => {
    if (state.turn !== 'player' || state.status !== 'playing') return;

    const topCard = state.discardPile[state.discardPile.length - 1];
    if (isPlayable(card, topCard, state.currentSuit)) {
      if (card.rank === '8') {
        setPendingCard(card);
        setShowSuitSelector(true);
      } else {
        playCard(card, 'player');
      }
    }
  };

  const handleSuitSelection = (suit: Suit) => {
    if (pendingCard) {
      playCard(pendingCard, 'player', suit);
      setPendingCard(null);
      setShowSuitSelector(false);
    }
  };

  // AI Logic
  useEffect(() => {
    if (state.turn === 'ai' && state.status === 'playing') {
      const timer = setTimeout(() => {
        const topCard = state.discardPile[state.discardPile.length - 1];
        const playableCards = state.aiHand.filter(c => isPlayable(c, topCard, state.currentSuit));

        if (playableCards.length > 0) {
          // AI Strategy: Play an 8 if it's the only option or randomly
          const normalPlayable = playableCards.filter(c => c.rank !== '8');
          const eights = playableCards.filter(c => c.rank === '8');
          
          let cardToPlay: Card;
          if (normalPlayable.length > 0) {
            cardToPlay = normalPlayable[Math.floor(Math.random() * normalPlayable.length)];
          } else {
            cardToPlay = eights[0];
          }

          if (cardToPlay.rank === '8') {
            // AI picks its most frequent suit
            const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
            state.aiHand.forEach(c => suitCounts[c.suit]++);
            const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
            playCard(cardToPlay, 'ai', bestSuit);
          } else {
            playCard(cardToPlay, 'ai');
          }
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status, state.aiHand, state.discardPile, state.currentSuit, playCard, drawCard]);

  return {
    state,
    startGame,
    handlePlayerPlay,
    drawCard: () => drawCard('player'),
    showSuitSelector,
    handleSuitSelection,
  };
};
