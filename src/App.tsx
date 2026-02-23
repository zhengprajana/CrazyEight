import { motion, AnimatePresence } from 'motion/react';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { useGameLogic } from './hooks/useGameLogic';
import { getSuitSymbol, getSuitColor } from './utils';
import { Trophy, RefreshCw, Info, ChevronUp } from 'lucide-react';

export default function App() {
  const { 
    state, 
    startGame, 
    handlePlayerPlay, 
    drawCard, 
    showSuitSelector, 
    handleSuitSelection 
  } = useGameLogic();

  const topDiscard = state.discardPile[state.discardPile.length - 1];
  const isPlayerTurn = state.turn === 'player';

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-emerald-900 font-black text-xl">P</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">prajana</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-semibold">Crazy Eights</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">对手手牌</span>
            <span className="font-mono text-sm">{state.aiHand.length} 张</span>
          </div>
          <button 
            onClick={startGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="重新开始"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 relative flex flex-col items-center justify-between p-4 sm:p-8">
        
        {/* AI Hand */}
        <div className="w-full flex justify-center h-32 sm:h-40">
          <div className="relative flex justify-center w-full max-w-2xl">
            <AnimatePresence>
              {state.aiHand.map((card, i) => (
                <div 
                  key={card.id}
                  className="absolute transition-all duration-300"
                  style={{ 
                    left: `calc(50% + ${(i - (state.aiHand.length - 1) / 2) * 30}px)`,
                    transform: `rotate(${(i - (state.aiHand.length - 1) / 2) * 2}deg)`
                  }}
                >
                  <Card card={card} isFaceUp={false} index={i} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Area: Deck & Discard */}
        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl group-hover:bg-white/10 transition-colors" />
            <div 
              onClick={isPlayerTurn && state.status === 'playing' ? drawCard : undefined}
              className={`relative ${isPlayerTurn && state.status === 'playing' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {state.deck.length > 0 ? (
                <>
                  {/* Stack effect */}
                  <div className="absolute top-1 left-1 w-24 h-36 sm:w-28 sm:h-40 bg-indigo-950 rounded-xl border-2 border-indigo-800 translate-x-2 translate-y-2" />
                  <div className="absolute top-1 left-1 w-24 h-36 sm:w-28 sm:h-40 bg-indigo-950 rounded-xl border-2 border-indigo-800 translate-x-1 translate-y-1" />
                  <Card card={state.deck[0]} isFaceUp={false} />
                  <div className="absolute -bottom-6 left-0 w-full text-center">
                    <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">摸牌堆 ({state.deck.length})</span>
                  </div>
                </>
              ) : (
                <div className="w-24 h-36 sm:w-28 sm:h-40 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-xs opacity-30 uppercase font-bold">Empty</span>
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
             <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-xl" />
             <div className="relative">
                <AnimatePresence mode="popLayout">
                  {state.discardPile.slice(-1).map((card) => (
                    <Card key={card.id} card={card} />
                  ))}
                </AnimatePresence>
                
                {state.currentSuit && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center z-20 border-2 border-emerald-500"
                  >
                    <span className={`text-xl ${getSuitColor(state.currentSuit)}`}>
                      {getSuitSymbol(state.currentSuit)}
                    </span>
                  </motion.div>
                )}

                <div className="absolute -bottom-6 left-0 w-full text-center">
                  <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">弃牌堆</span>
                </div>
             </div>
          </div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isPlayerTurn ? 'bg-yellow-400 animate-pulse' : 'bg-white/20'}`} />
             <span className={`text-xs uppercase tracking-widest font-bold ${isPlayerTurn ? 'text-yellow-400' : 'opacity-40'}`}>
               {isPlayerTurn ? "轮到你了" : "AI 正在思考..."}
             </span>
          </div>
          
          <div className="relative flex justify-center w-full max-w-4xl h-44 sm:h-52">
            <AnimatePresence>
              {state.playerHand.map((card, i) => {
                const playable = isPlayerTurn && state.status === 'playing' && (
                  card.rank === '8' || 
                  card.suit === (state.currentSuit || topDiscard.suit) || 
                  card.rank === topDiscard.rank
                );

                return (
                  <div 
                    key={card.id}
                    className="absolute transition-all duration-300"
                    style={{ 
                      left: `calc(50% + ${(i - (state.playerHand.length - 1) / 2) * 45}px)`,
                      transform: `rotate(${(i - (state.playerHand.length - 1) / 2) * 1.5}deg)`,
                      bottom: playable ? '10px' : '0'
                    }}
                  >
                    <Card 
                      card={card} 
                      isPlayable={playable} 
                      onClick={() => handlePlayerPlay(card)}
                      index={i}
                    />
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {state.status === 'waiting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://picsum.photos/seed/cards/1920/1080?blur=4" 
                alt="Background" 
                className="w-full h-full object-cover scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 text-center p-8 max-w-2xl">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, delay: 0.2 }}
                className="mb-12"
              >
                <div className="inline-block mb-4 px-4 py-1 bg-yellow-400 text-emerald-900 text-xs font-black uppercase tracking-[0.3em] rounded-full shadow-xl">
                  Prajana Presents
                </div>
                <h2 className="text-7xl sm:text-8xl font-black mb-2 tracking-tighter text-white drop-shadow-2xl">
                  疯狂 <span className="text-yellow-400">8</span> 点
                </h2>
                <p className="text-xl uppercase tracking-[0.5em] opacity-60 font-light text-emerald-100">Crazy Eights</p>
              </motion.div>
              
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 gap-6 mb-12 text-left bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md"
              >
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 bg-yellow-400/20 text-yellow-400 rounded-xl"><Info size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">基础规则</h4>
                    <p className="text-sm text-emerald-100/70">打出与弃牌堆花色或点数相同的牌。</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 p-2 bg-indigo-400/20 text-indigo-400 rounded-xl"><ChevronUp size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">万能 8 点</h4>
                    <p className="text-sm text-emerald-100/70">数字 8 是万能牌！随时可以打出并指定新的花色。</p>
                  </div>
                </div>
              </motion.div>

              <motion.button 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="group relative px-16 py-5 bg-white text-emerald-900 rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-yellow-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 group-hover:text-emerald-950 transition-colors">开始游戏</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {state.status === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="mb-6 inline-block p-6 bg-yellow-400 rounded-full text-emerald-900"
              >
                <Trophy size={64} />
              </motion.div>
              <h2 className="text-6xl font-black mb-2">
                {state.winner === 'player' ? '你赢了！' : 'AI 获胜'}
              </h2>
              <p className="text-xl opacity-60 mb-12 uppercase tracking-widest">
                {state.winner === 'player' ? '你是真正的纸牌大师' : '别灰心，再接再厉'}
              </p>
              <button 
                onClick={startGame}
                className="px-12 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
              >
                再玩一局
              </button>
            </div>
          </motion.div>
        )}

        {showSuitSelector && (
          <SuitSelector onSelect={handleSuitSelection} />
        )}
      </AnimatePresence>

      {/* Mobile Footer Stats */}
      <footer className="sm:hidden p-4 bg-black/20 flex justify-between items-center border-t border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase opacity-50 font-bold">对手</span>
          <span className="font-mono text-sm">{state.aiHand.length} 张</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase opacity-50 font-bold">你</span>
          <span className="font-mono text-sm">{state.playerHand.length} 张</span>
        </div>
      </footer>
    </div>
  );
}
