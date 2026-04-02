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
  let stackOrder = cards
    .slice()
    .sort(
      (a, b) =>
        (Number(a.style.getPropertyValue('--z')) || 0) -
        (Number(b.style.getPropertyValue('--z')) || 0)
    );

  const applyStackOrder = () => {
    stackOrder.forEach((card, index) => {
      card.style.setProperty('--z', String((index + 1) * 10));
    });
  };

  const sendToBottom = (card) => {
    stackOrder = [card, ...stackOrder.filter((item) => item !== card)];
    applyStackOrder();
  };

  const syncDeckState = () => {
    const hasDrawn = cards.some((card) => card.classList.contains('is-drawn'));
    deck.classList.toggle('has-drawn', hasDrawn);
  };

  const syncFrontCard = () => {
    cards.forEach((card) => card.classList.remove('is-front'));
    const undrawn = stackOrder.filter((card) => !card.classList.contains('is-drawn'));
    const front =
      undrawn
        .slice()
        .reverse()
        .find((card) => !card.classList.contains('deck-cover')) || undrawn[undrawn.length - 1];
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
  applyStackOrder();
  syncDeckState();
  syncFrontCard();
})();
