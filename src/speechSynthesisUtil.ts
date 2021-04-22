
let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentVolume = 1;

export function startSpeech(phrase: string, options: {volume?: number, rate?: number, onComplete?:()=>void}) {
  const utterance = new SpeechSynthesisUtterance(phrase);

  options = options || {};
  if (options.volume) {
    utterance.volume = options.volume;
    currentVolume = options.volume;
  } else {
    utterance.volume = currentVolume;
  }

  if (options.onComplete) {
    utterance.onend = utterance.onerror = () => {
      currentUtterance = null;
      if (options.onComplete) {
        options.onComplete();
      }
    }
  }
  if (options.rate) {
    utterance.rate = options.rate;
  }
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech() {
  if (currentUtterance) {
    currentUtterance.onend = currentUtterance.onerror = null;
  }
  window.speechSynthesis.cancel();
}

export function setSpeechVolume(newVolume: number) {
  // if (currentUtterance) {
  //   // testing in latest firefox on 4/21/2021, this doesn't work.
  //   currentUtterance.volume = newVolume;
  // }
  currentVolume = newVolume;
}
