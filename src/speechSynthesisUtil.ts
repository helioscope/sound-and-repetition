
export function startSpeech(phrase: string, options: {volume?: number, rate?: number, onComplete?:()=>void}) {
  const utterance = new SpeechSynthesisUtterance(phrase);

  options = options || {};
  if (options.volume) {
    utterance.volume = options.volume;
  }
  if (options.onComplete) {
    utterance.onend = utterance.onerror = options.onComplete;
  }
  if (options.rate) {
    utterance.rate = options.rate;
  }
  
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech() {
  window.speechSynthesis.cancel()
}
