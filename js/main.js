/**
 * Minimal JS for Page 1 cursor spotlight.
 * Only updates CSS custom properties used by the radial gradient layer.
 */
(function () {
  const identity = document.querySelector('.panel-identity');
  if (identity) {
    const updateSpotlight = (event) => {
      const rect = identity.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      identity.style.setProperty('--mx', `${x}%`);
      identity.style.setProperty('--my', `${y}%`);
    };

    window.addEventListener('pointermove', updateSpotlight, { passive: true });
  }

  const cards = Array.from(document.querySelectorAll('.deck-card'));
  const deck = document.querySelector('.member-deck');
  if (!cards.length || !deck) return;

  let drawTimer = null;
  const initialMinZ = Math.min(
    ...cards.map((card) => Number(card.style.getPropertyValue('--z')) || 0)
  );
  let nextBottomZ = initialMinZ - 1;

  const sendToBottom = (card) => {
    card.style.setProperty('--z', String(nextBottomZ));
    nextBottomZ -= 1;
  };

  const syncDeckState = () => {
    const hasDrawn = cards.some((card) => card.classList.contains('is-drawn'));
    deck.classList.toggle('has-drawn', hasDrawn);
  };

  const syncFrontCard = () => {
    cards.forEach((card) => card.classList.remove('is-front'));
    const undrawn = cards
      .filter((card) => !card.classList.contains('is-drawn'))
      .sort(
        (a, b) =>
          (Number(b.style.getPropertyValue('--z')) || 0) -
          (Number(a.style.getPropertyValue('--z')) || 0)
      );
    const front = undrawn.find((card) => !card.classList.contains('deck-cover')) || undrawn[0];
    if (front) front.classList.add('is-front');
  };

  const closeAll = () => {
    if (drawTimer) {
      clearTimeout(drawTimer);
      drawTimer = null;
    }
    const current = cards.find((card) => card.classList.contains('is-drawn'));
    if (current) {
      sendToBottom(current);
    }
    cards.forEach((card) => {
      card.classList.remove('is-drawn');
      card.setAttribute('aria-expanded', 'false');
    });
    syncDeckState();
    syncFrontCard();
  };

  cards.forEach((card) => {
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = card.classList.contains('is-drawn');
      const current = cards.find((item) => item.classList.contains('is-drawn'));

      if (drawTimer) {
        clearTimeout(drawTimer);
        drawTimer = null;
      }

      if (!current) {
        if (!isOpen) {
          card.classList.add('is-drawn');
          card.setAttribute('aria-expanded', 'true');
          syncDeckState();
          syncFrontCard();
        }
        return;
      }

      if (current === card) {
        closeAll();
        return;
      }

      sendToBottom(current);
      current.classList.remove('is-drawn');
      current.setAttribute('aria-expanded', 'false');
      syncDeckState();
      syncFrontCard();

      drawTimer = setTimeout(() => {
        card.classList.add('is-drawn');
        card.setAttribute('aria-expanded', 'true');
        syncDeckState();
        syncFrontCard();
        drawTimer = null;
      }, 260);
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.click();
    });
  });

  document.addEventListener('click', closeAll);
  syncDeckState();
  syncFrontCard();
})();
