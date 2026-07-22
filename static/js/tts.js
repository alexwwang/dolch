(function() {
  'use strict';

  // Hold reference to prevent GC mid-speech
  var currentUtterance = null;

  function getEnVoice() {
    var voices = window.speechSynthesis.getVoices();
    return voices.find(function(v) { return v.lang.startsWith('en'); });
  }

  function speakText(text, btn) {
    var chunks = [];
    var buffer = '';
    var i = 0;

    while (i < text.length) {
      buffer += text[i];
      if ((text[i] === '.' || text[i] === '!' || text[i] === '?') &&
          (i + 1 >= text.length || text[i + 1] === ' ' || text[i + 1] === '"' || text[i + 1] === "'")) {
        if (i + 1 < text.length && (text[i + 1] === '"' || text[i + 1] === "'")) {
          buffer += text[i + 1];
          i++;
        }
        chunks.push({ text: buffer.trim(), pause: 600 });
        buffer = '';
      } else if (text[i] === ',' || text[i] === ';' || text[i] === ':') {
        chunks.push({ text: (buffer).trim(), pause: 300 });
        buffer = '';
      }
      i++;
    }
    if (buffer.trim()) {
      chunks.push({ text: buffer.trim(), pause: 0 });
    }

    if (chunks.length === 0) {
      chunks.push({ text: text, pause: 0 });
    }

    var idx = 0;
    var voice = getEnVoice();

    function speakNext() {
      if (idx >= chunks.length) {
        currentUtterance = null;
        btn.classList.remove('speaking');
        return;
      }
      var chunk = chunks[idx];
      currentUtterance = new SpeechSynthesisUtterance(chunk.text);
      currentUtterance.lang = 'en-US';
      currentUtterance.rate = 0.75;
      currentUtterance.pitch = 1.1;
      if (voice) currentUtterance.voice = voice;
      currentUtterance.onend = function() {
        idx++;
        if (idx < chunks.length) {
          setTimeout(speakNext, chunks[idx - 1].pause);
        } else {
          currentUtterance = null;
          btn.classList.remove('speaking');
        }
      };
      window.speechSynthesis.speak(currentUtterance);
    }

    speakNext();
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.tts-btn');
    if (!btn) return;
    var text = btn.getAttribute('data-text');
    if (!text) return;

    window.speechSynthesis.cancel();
    currentUtterance = null;
    btn.classList.add('speaking');
    speakText(text, btn);
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
})();
