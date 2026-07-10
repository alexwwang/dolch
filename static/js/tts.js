(function() {
  'use strict';

  // TTS buttons
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.tts-btn');
    if (!btn) return;

    var text = btn.getAttribute('data-text');
    if (!text) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.75;
    utterance.pitch = 1.1;

    // Try to find an English voice
    var voices = window.speechSynthesis.getVoices();
    var enVoice = voices.find(function(v) { return v.lang.startsWith('en'); });
    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.speak(utterance);

    // Visual feedback
    btn.classList.add('speaking');
    utterance.onend = function() {
      btn.classList.remove('speaking');
    };
  });

  // Preload voices
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
})();
