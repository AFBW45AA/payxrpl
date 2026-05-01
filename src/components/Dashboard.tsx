import { useState, useEffect } from 'react';
import TrustSetButton from './TrustSetButton';

interface Props {
  xumm: any;
  network: 'TESTNET' | 'MAINNET';
}

export default function Dashboard({ xumm, network }: Props) {
  const [balanceXRP, setBalanceXRP] = useState<string>('0');
  const [balanceRLUSD, setBalanceRLUSD] = useState<string>('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const account = xumm.account; // Xumm gibt die aktuelle Adresse zurück
        if (!account) return;

        // Einfache Abfrage über Xumm (funktioniert mit CDN)
        const response = await fetch(`https://api.xrpl.org/v2/accounts/${account}/balances?network=${network.toLowerCase()}`);
        const data = await response.json();

        const xrpBal = data.balances?.find((b: any) => b.currency === 'XRP')?.value || '0';
        const rlusdBal = data.balances?.find((b: any) => b.currency === 'USD')?.value || '0';

        setBalanceXRP(parseFloat(xrpBal).toFixed(2));
        setBalanceRLUSD(parseFloat(rlusdBal).toFixed(2));
      } catch (e) {
        console.error('Saldo konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [xumm, network]);

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-semibold text-center">Dein Wallet</h2>

      <div className="bg-white/10 rounded-3xl p-8 text-center">
        {loading ? (
          <p className="text-white/70">Saldo wird geladen...</p>
        ) : (
          <>
            <div className="text-6xl font-bold text-[#00FFAA]">{balanceXRP} XRP</div>
            <div className="text-2xl text-white/70 mt-2">{balanceRLUSD} RLUSD</div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left">
          <div className="text-sm text-white/70">Letzte Transaktion</div>
          <div className="text-lg">Noch keine</div>
        </button>
        <button className="bg-white/10 hover:bg-white/20 p-6 rounded-3xl text-left">
          <div className="text-sm text-white/70">Offene Escrows</div>
          <div className="text-lg">0</div>
        </button>
      </div>
            <div className="mt-8">
        <TrustSetButton xumm={xumm} network={network} />
      </div>    
    </div>
  );
}