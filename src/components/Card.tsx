import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils';

interface CardProps {
  card: CardType;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = "",
  index = 0
}) => {
  const symbol = getSuitSymbol(card.suit);
  const colorClass = getSuitColor(card.suit);

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isFaceUp && isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-24 h-36 sm:w-28 sm:h-40 rounded-xl shadow-lg border-2 
        ${isFaceUp ? 'bg-white border-slate-200' : 'bg-indigo-900 border-indigo-700'}
        ${isPlayable ? 'cursor-pointer ring-2 ring-yellow-400 ring-offset-2' : 'cursor-default'}
        flex flex-col items-center justify-center select-none
        ${className}
      `}
      style={{
        zIndex: index,
      }}
    >
      {isFaceUp ? (
        <>
          <div className={`absolute top-2 left-2 text-lg font-bold ${colorClass}`}>
            {card.rank}
          </div>
          <div className={`absolute top-2 left-6 text-sm ${colorClass}`}>
            {symbol}
          </div>
          
          <div className={`text-4xl ${colorClass}`}>
            {symbol}
          </div>

          <div className={`absolute bottom-2 right-2 text-lg font-bold rotate-180 ${colorClass}`}>
            {card.rank}
          </div>
          <div className={`absolute bottom-2 right-6 text-sm rotate-180 ${colorClass}`}>
            {symbol}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full border-2 border-indigo-400/30 rounded-lg flex items-center justify-center">
            <div className="text-indigo-400/50 text-2xl font-bold italic">P</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
