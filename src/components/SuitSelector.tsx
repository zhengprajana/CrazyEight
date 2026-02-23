import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { getSuitSymbol, getSuitColor } from '../utils';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">选择一个新花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => {
            const suitNames: Record<Suit, string> = {
              hearts: '红心',
              diamonds: '方块',
              clubs: '梅花',
              spades: '黑桃'
            };
            return (
              <button
                key={suit}
                onClick={() => onSelect(suit)}
                className={`
                  flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100
                  hover:border-indigo-500 hover:bg-indigo-50 transition-all group
                `}
              >
                <span className={`text-5xl mb-2 ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                  {getSuitSymbol(suit)}
                </span>
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {suitNames[suit]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
