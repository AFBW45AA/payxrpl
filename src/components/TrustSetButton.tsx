import { useState } from 'react';

interface Props {
  xumm: any;
  network: 'TESTNET' | 'MAINNET';
}

export default function TrustSetButton({ xumm, network }: Props) {
  const [status, setStatus] = useState('');

  const issuer = network === 'MAINNET'
    ? 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De'
    : 'rQhWct2fv4Vc4KRjRgMrxa8xPN9Zx9iLKV';

  const createTrustSet = async () => {
    setStatus('Trust Line wird angelegt...');

    const payload = await xumm.payload.create({
      txjson: {
        TransactionType: 'TrustSet',
        LimitAmount: {
          currency: 'USD',
          issuer: issuer,
          value: '1000000'
        }
      },
      custom_meta: {
        instruction: 'RLUSD Trust Line anlegen (für sicheres Senden/Empfangen)'
      },
      options: { force_network: network }
    });

    if (payload.next?.always) {
      window.location.href = payload.next.always;
    }

    payload.subscribe((event: any) => {
      if (event.data.signed) {
        setStatus('✅ Trust Line erfolgreich angelegt!');
      }
      if (event.data.cancelled) {
        setStatus('❌ Abgebrochen');
      }
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={createTrustSet}
        className="w-full bg-white/10 hover:bg-white/20 p-5 rounded-3xl text-left flex items-center gap-4"
      >
        <span className="text-3xl">🔗</span>
        <div>
          <div className="font-medium">RLUSD Trust Line anlegen</div>
          <div className="text-sm text-white/60">Einmalig nötig zum Senden/Empfangen von RLUSD</div>
        </div>
      </button>

      {status && (
        <p className="text-center text-lg font-medium text-white/80">{status}</p>
      )}
    </div>
  );
}