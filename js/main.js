/**
 * Minimal JS for Page 1 cursor spotlight.
 * Only updates CSS custom properties used by the radial gradient layer.
 */
(function () {
  const memberDeck = document.querySelector('.member-deck');
  const memberCards = Array.isArray(window.memberCards) ? window.memberCards : [];

  const renderMemberCard = (member) => `
    <article class="deck-card" role="listitem" tabindex="0" style="--tx:${member.tx}; --ty:${member.ty}; --rot:${member.rot}; --z:${member.z};">
      <span class="card-backdrop" aria-hidden="true">${member.letter}</span>
      <span class="card-letter">${member.letter}</span>
      <div class="card-corner"><span class="mini-avatar">${member.initials}</span><span class="mini-name">${member.name}</span></div>
      <div class="card-preview">
        <div class="card-preview-top"><img class="member-avatar" src="${member.avatar}" alt="${member.name} avatar" /><div class="card-preview-mark"><span>STI</span><strong>${member.letter}</strong></div></div>
        <div class="card-preview-meta"><h3>${member.name}</h3><p>${member.previewRole}</p></div>
      </div>
      <div class="card-body"><img class="member-avatar" src="${member.avatar}" alt="${member.name} avatar" /><h3>${member.name}</h3><p class="card-slogan">${member.slogan}</p><p class="card-role">${member.detailRole}</p><p>${member.description}</p><a class="card-link" href="${member.website}" target="_blank" rel="noreferrer">${member.websiteLabel}</a></div>
    </article>`;

  if (memberDeck && memberCards.length) {
    memberDeck.insertAdjacentHTML('beforeend', memberCards.map(renderMemberCard).join(''));
  }

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

  const returnCardToDeck = (card) => {
    if (!card) return;
    card.classList.remove('is-drawn');
    card.setAttribute('aria-expanded', 'false');
    sendToBottom(card);
  };

  const closeAll = () => {
    if (drawTimer) {
      clearTimeout(drawTimer);
      drawTimer = null;
    }
    const current = cards.find((card) => card.classList.contains('is-drawn'));
    if (current) {
      returnCardToDeck(current);
    }
    cards.forEach((card) => {
      if (card !== current) {
        card.classList.remove('is-drawn');
        card.setAttribute('aria-expanded', 'false');
      }
    });
    syncDeckState();
    syncFrontCard();
  };

  cards.forEach((card) => {
    card.setAttribute('aria-expanded', 'false');

    card.addEventListener('click', (event) => {
      const cardLink = event.target.closest('.card-link');

      if (cardLink) {
        if (!card.classList.contains('is-drawn')) {
          event.preventDefault();
        }
        event.stopPropagation();
        return;
      }

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

      returnCardToDeck(current);
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
