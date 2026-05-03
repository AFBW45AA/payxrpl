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
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const response = await xumm.authorize();   // Öffnet Xaman und verbindet
      if (response.account) {
        setAccount(response.account);
        fetchBalances(response.account);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBalances = async (acc: string) => {
    try {
      const baseUrl = network === 'TESTNET' ? 'https://testnet.xrpl.org' : 'https://xrpl.org';
      const res = await fetch(`${baseUrl}/v2/accounts/${acc}`);
      const data = await res.json();

      const xrp = data.account_data?.Balance 
        ? (parseInt(data.account_data.Balance) / 1000000).toFixed(2) 
        : '0.00';

      setBalanceXRP(xrp);
      setBalanceRLUSD('0.00');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (xumm && xumm.account) {
      setAccount(xumm.account);
      fetchBalances(xumm.account);
    } else {
      setLoading(false);
    }
  }, [xumm, network]);

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-semibold text-center">Dein Wallet</h2>

      <div className="bg-white/10 rounded-3xl p-8 text-center">
        {loading ? (
          <p className="text-white/70">Verbindung wird geprüft...</p>
        ) : !account ? (
          <div>
            <p className="text-yellow-400 text-xl mb-4">Bitte Xaman Wallet verbinden</p>
            <button 
              onClick={connectWallet}
              className="bg-[#00FFAA] text-black font-bold px-10 py-4 rounded-3xl text-xl hover:bg-[#00CC88]"
            >
              Mit Xaman verbinden
            </button>
          </div>
        ) : (
          <>
            <div className="text-6xl font-bold text-[#00FFAA]">{balanceXRP} XRP</div>
            <div className="text-2xl text-white/70 mt-2">{balanceRLUSD} RLUSD</div>
            <p className="text-xs text-white/50 mt-6">Verbunden: {account.substring(0, 8)}...{account.substring(account.length - 8)}</p>
          </>
        )}
      </div>

      {account && <TrustSetButton xumm={xumm} network={network} />}
    </div>
  );
}