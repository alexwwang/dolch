(function() {
  'use strict';

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
        btn.classList.remove('speaking');
        return;
      }
      var chunk = chunks[idx];
      var utt = new SpeechSynthesisUtterance(chunk.text);
      utt.lang = 'en-US';
      utt.rate = 0.75;
      utt.pitch = 1.1;
      if (voice) utt.voice = voice;
      utt.onend = function() {
        idx++;
        // Pause between sentences
        if (idx < chunks.length) {
          setTimeout(speakNext, chunks[idx - 1].pause);
        } else {
          btn.classList.remove('speaking');
        }
      };
      window.speechSynthesis.speak(utt);
    }

    speakNext();
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.tts-btn');
    if (!btn) return;
    var text = btn.getAttribute('data-text');
    if (!text) return;

    window.speechSynthesis.cancel();
    btn.classList.add('speaking');
    speakText(text, btn);
  });

  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
})();
