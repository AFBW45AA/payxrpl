import { useState } from 'react';

interface Props {
  xumm: any;
  network: 'TESTNET' | 'MAINNET';
}

export default function SendForm({ xumm, network }: Props) {
  const [amount, setAmount] = useState<number>(25.5);
  const [destination, setDestination] = useState('');
  const [currency, setCurrency] = useState<'XRP' | 'USD'>('USD');
  const [status, setStatus] = useState('');

  const issuer = network === 'MAINNET'
    ? 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De'
    : 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV';

  const handleSend = async () => {
    if (!destination) {
      setStatus('Bitte Empfänger-Adresse eingeben');
      return;
    }

    setStatus('Xaman wird geöffnet...');

    let amountObj: any;
    if (currency === 'USD') {
      amountObj = { currency: 'USD', issuer, value: amount.toString() };
    } else {
      amountObj = (amount * 1_000_000).toString();
    }

    const payload = await xumm.payload.create({
      txjson: {
        TransactionType: 'Payment',
        Destination: destination,
        Amount: amountObj,
      },
      custom_meta: { instruction: `Du sendest ${amount} ${currency}` },
      options: { force_network: network },
    });

    if (payload.next?.always) {
      window.location.href = payload.next.always;
    }

    payload.subscribe((event: any) => {
      if (event.data.signed) {
        setStatus(`✅ Erfolgreich gesendet! Tx: ${event.data.txid}`);
      }
      if (event.data.cancelled) {
        setStatus('❌ Abgebrochen');
      }
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-semibold text-center">Zahlung senden</h2>

      <div className="flex bg-white/10 rounded-3xl p-1">
        <button onClick={() => setCurrency('XRP')} className={`flex-1 py-4 rounded-3xl font-medium ${currency === 'XRP' ? 'bg-[#00FFAA] text-black' : ''}`}>XRP</button>
        <button onClick={() => setCurrency('USD')} className={`flex-1 py-4 rounded-3xl font-medium ${currency === 'USD' ? 'bg-[#00FFAA] text-black' : ''}`}>RLUSD</button>
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
        className="w-full bg-white/10 text-6xl text-center p-8 rounded-3xl focus:outline-none"
        step="0.01"
      />

      <input
        type="text"
        placeholder="Empfänger-Adresse (r...)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full bg-white/10 p-6 rounded-3xl text-lg placeholder:text-white/40"
      />

      <button
        onClick={handleSend}
        className="w-full bg-[#00FFAA] hover:bg-[#00CC88] text-black font-bold text-2xl py-7 rounded-3xl transition"
      >
        Jetzt senden
      </button>

      {status && <p className="text-center text-lg font-medium">{status}</p>}
    </div>
  );
}