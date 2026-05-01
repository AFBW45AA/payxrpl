import { useState } from 'react';

export default function History() {
  const [tab, setTab] = useState<'all' | 'escrow'>('all');

  // Platzhalter-Daten (später echte Abfrage über Xumm/XRPL)
  const transactions = [
    { id: 1, type: 'send', amount: '25.50', currency: 'RLUSD', date: 'heute', status: '✅' },
    { id: 2, type: 'escrow', amount: '120', currency: 'XRP', date: 'gestern', status: '🔒' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold text-center">Verlauf</h2>

      {/* Tabs */}
      <div className="flex bg-white/10 rounded-3xl p-1">
        <button
          onClick={() => setTab('all')}
          className={`flex-1 py-4 rounded-3xl font-medium ${tab === 'all' ? 'bg-[#00FFAA] text-black' : ''}`}
        >
          Alle Transaktionen
        </button>
        <button
          onClick={() => setTab('escrow')}
          className={`flex-1 py-4 rounded-3xl font-medium ${tab === 'escrow' ? 'bg-[#00FFAA] text-black' : ''}`}
        >
          Offene Escrows
        </button>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white/10 rounded-3xl p-5 flex justify-between items-center">
            <div>
              <span className="text-2xl">{tx.status}</span>
              <span className="ml-4 font-medium">
                {tx.type === 'send' ? 'Gesendet' : 'Escrow erstellt'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">
                {tx.amount} {tx.currency}
              </div>
              <div className="text-xs text-white/60">{tx.date}</div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <p className="text-center text-white/50 py-12">Noch keine Transaktionen</p>
      )}
    </div>
  );
}