import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

/**
 * PromptInput allows user to submit a prompt
 */
export default function PromptInput({ onSend, loading }) {
  const [prompt, setPrompt] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSend(prompt);
    setPrompt('');
  };

  return (
    <form className="prompt-input" onSubmit={submit}>
      <Input
        type="text"
        placeholder="Ask DSP anything..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button type="submit" loading={loading}>
        Send
      </Button>
    </form>
  );
}
