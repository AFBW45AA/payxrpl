import { useState, useEffect } from 'react';
import TrustSetButton from './TrustSetButton';

interface Props {
  xumm: any;
  network: 'TESTNET' | 'MAINNET';
}

export default function Dashboard({ xumm, network }: Props) {
  const [balanceXRP, setBalanceXRP] = useState<string>('0.00');
  const [balanceRLUSD, setBalanceRLUSD] = useState<string>('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const account = xumm.account;
        if (!account) return;

        const baseUrl = network === 'TESTNET' 
          ? 'https://testnet.xrpl.org' 
          : 'https://xrpl.org';

        const res = await fetch(`${baseUrl}/v2/accounts/${account}`);
        const data = await res.json();

        // XRP Balance (in Drops → XRP umrechnen)
        const xrpBalance = data.account_data?.Balance 
          ? (parseInt(data.account_data.Balance) / 1000000).toFixed(2) 
          : '0.00';

        setBalanceXRP(xrpBalance);
        setBalanceRLUSD('0.00'); // RLUSD-Balance wird später genauer (TrustLine nötig)

      } catch (e) {
        console.error('Saldo konnte nicht geladen werden', e);
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

      <TrustSetButton xumm={xumm} network={network} />
    </div>
  );
}