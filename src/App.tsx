import { useState, useEffect } from 'react';
import SendForm from './components/SendForm';
import Dashboard from './components/Dashboard';
import EscrowForm from './components/EscrowForm';
import History from './components/History';

function App() {
  const [page, setPage] = useState<'dashboard' | 'send' | 'escrow' | 'history'>('dashboard');
  const [network] = useState<'TESTNET' | 'MAINNET'>('TESTNET');
  const [xumm, setXumm] = useState<any>(null);

  useEffect(() => {
    if ((window as any).Xumm) {
      const instance = new (window as any).Xumm('DEIN_API_KEY_HIER');   // ← Dein echter Key hier!
      setXumm(instance);
    }
  }, []);

  if (!xumm) {
    return (
      <div className="min-h-screen bg-[#0A2540] flex items-center justify-center text-white text-xl">
        Xumm wird geladen...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A2540] text-white">
      <header className="bg-[#0A2540] border-b border-white/10 p-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span className="text-[#00FFAA]">Pay</span>XRPL
        </h1>
        <div className="flex gap-1 text-sm">
          <button onClick={() => setPage('dashboard')} className={`px-5 py-2 rounded-2xl ${page === 'dashboard' ? 'bg-white text-black' : 'hover:bg-white/10'}`}>🏠 Dashboard</button>
          <button onClick={() => setPage('send')} className={`px-5 py-2 rounded-2xl ${page === 'send' ? 'bg-white text-black' : 'hover:bg-white/10'}`}>➤ Senden</button>
          <button onClick={() => setPage('escrow')} className={`px-5 py-2 rounded-2xl ${page === 'escrow' ? 'bg-white text-black' : 'hover:bg-white/10'}`}>🔒 Rechnung</button>
          <button onClick={() => setPage('history')} className={`px-5 py-2 rounded-2xl ${page === 'history' ? 'bg-white text-black' : 'hover:bg-white/10'}`}>📜 Verlauf</button>
        </div>
      </header>

      <main className="p-6 max-w-xl mx-auto">
        {page === 'dashboard' && <Dashboard xumm={xumm} network={network} />}
        {page === 'send' && <SendForm xumm={xumm} network={network} />}
        {page === 'escrow' && <EscrowForm xumm={xumm} network={network} />}
        {page === 'history' && <History />}
      </main>
      
      <footer className="text-center text-xs text-white/40 py-6">
        Testnet • XRPL + RLUSD • Gebühr ≈ 0,00001 $
      </footer>
    </div>
  );
}

export default App;