import React, { useState } from 'react';
import PromptInput from '../components/PromptInput';
import ChatTranscript from '../components/ChatTranscript';
import ErrorBanner from '../components/ErrorBanner';
import LoadingOverlay from '../components/LoadingOverlay';
import * as dspService from '../services/dspService';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSend = async (prompt) => {
    setError('');
    setBusy(true);
    try {
      const res = await dspService.sendPrompt(prompt);
      // TODO: Confirm response shape; expecting { response: string }
      const response = res?.response ?? JSON.stringify(res);
      setItems((prev) => [{ prompt, response }, ...prev]);
    } catch (e) {
      setError(e.message || 'Failed to get response');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {busy && <LoadingOverlay text="Talking to DSP…" />}
      <div className="prompt-card">
        <PromptInput onSend={onSend} loading={busy} />
        <ErrorBanner message={error} />
      </div>
      <div style={{ height: 16 }} />
      <ChatTranscript items={items} />
    </>
  );
}
