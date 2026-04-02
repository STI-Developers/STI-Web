(function () {
  const scrollRoot = document.querySelector('.site-scroll');
  const panels = Array.from(document.querySelectorAll('.panel'));
  const membersPanel = document.querySelector('.panel-members');
  const memberDeck = document.querySelector('.member-deck');
  const memberCards = Array.isArray(window.memberCards) ? window.memberCards : [];
  let deckInitialized = false;

  const renderMemberCard = (member) => `
    <article class="deck-card" role="listitem" tabindex="0" style="--tx:${member.tx}; --ty:${member.ty}; --rot:${member.rot}; --z:${member.z};">
      <span class="card-backdrop" aria-hidden="true">${member.letter}</span>
      <span class="card-letter">${member.letter}</span>
      <div class="card-corner"><span class="mini-avatar">${member.initials}</span><span class="mini-name">${member.name}</span></div>
      <div class="card-preview">
        <div class="card-preview-top"><img class="member-avatar" src="${member.avatar}" alt="${member.name} avatar" loading="lazy" decoding="async" /><div class="card-preview-mark"><span>STI</span><strong>${member.letter}</strong></div></div>
        <div class="card-preview-meta"><h3>${member.name}</h3><p>${member.previewRole}</p></div>
      </div>
      <div class="card-body"><img class="member-avatar" src="${member.avatar}" alt="${member.name} avatar" loading="lazy" decoding="async" /><h3>${member.name}</h3><p class="card-slogan">${member.slogan}</p><p class="card-role">${member.detailRole}</p><p>${member.description}</p><a class="card-link" href="${member.website}" target="_blank" rel="noreferrer">${member.websiteLabel}</a></div>
    </article>`;

  const setActivePanels = () => {
    if (!scrollRoot || !panels.length) return;

    const rootRect = scrollRoot.getBoundingClientRect();
    const focusLine = rootRect.top + rootRect.height * 0.5;

    panels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const isActive = rect.top <= focusLine && rect.bottom >= focusLine;
      panel.classList.toggle('is-active', isActive);
    });
  };

  const initializeDeck = () => {
    if (deckInitialized || !memberDeck || !memberCards.length) return;

    memberDeck.insertAdjacentHTML('beforeend', memberCards.map(renderMemberCard).join(''));
    deckInitialized = true;

    const cards = Array.from(memberDeck.querySelectorAll('.deck-card'));
    const deck = memberDeck;
    if (!cards.length) return;

    let drawTimer = null;
    let drawHistory = [];
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

    const drawCard = (card, options = {}) => {
      if (!card) return;
      const { recordHistory = true } = options;

      card.classList.add('is-drawn');
      card.setAttribute('aria-expanded', 'true');

      if (recordHistory && !card.classList.contains('deck-cover')) {
        if (drawHistory[drawHistory.length - 1] !== card) {
          drawHistory.push(card);
        }
      }

      syncDeckState();
      syncFrontCard();
    };

    const animateCardReturn = (card) => {
      if (!card) return;

      card.classList.remove('is-returning');
      void card.offsetWidth;
      card.classList.add('is-returning');

      window.setTimeout(() => {
        card.classList.remove('is-returning');
      }, 420);
    };

    const restorePreviousCard = () => {
      if (drawTimer) {
        clearTimeout(drawTimer);
        drawTimer = null;
      }

      const current = cards.find((card) => card.classList.contains('is-drawn'));
      const coverCard = cards.find((card) => card.classList.contains('deck-cover'));

      if (current && current.classList.contains('deck-cover')) {
        drawHistory = [];
        closeAll();
        return;
      }

      if (current && !current.classList.contains('deck-cover')) {
        while (drawHistory.length && drawHistory[drawHistory.length - 1] !== current) {
          drawHistory.pop();
        }

        if (drawHistory[drawHistory.length - 1] === current) {
          drawHistory.pop();
        }
      }

      const previous = drawHistory[drawHistory.length - 1] || coverCard;

      if (!previous) return;

      if (current) {
        returnCardToDeck(current);
      }

      if (previous.classList.contains('deck-cover')) {
        drawHistory = [];
      }

      drawCard(previous, { recordHistory: false });
      animateCardReturn(previous);
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
            drawCard(card);
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
          drawCard(card);
          drawTimer = null;
        }, 260);
      });

      card.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        event.stopPropagation();
        restorePreviousCard();
      });

      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        card.click();
      });
    });

    deck.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      restorePreviousCard();
    });

    document.addEventListener('click', closeAll);
    applyStackOrder();
    syncDeckState();
    syncFrontCard();
  };

  const identity = document.querySelector('.panel-identity');
  if (identity) {
    let spotlightFrame = null;

    const updateSpotlight = (event) => {
      if (spotlightFrame) return;

      spotlightFrame = window.requestAnimationFrame(() => {
        const rect = identity.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        identity.style.setProperty('--mx', `${x}%`);
        identity.style.setProperty('--my', `${y}%`);
        spotlightFrame = null;
      });
    };

    identity.addEventListener('pointermove', updateSpotlight, { passive: true });
  }

  setActivePanels();

  if (scrollRoot) {
    scrollRoot.addEventListener('scroll', setActivePanels, { passive: true });
  }

  if (membersPanel && 'IntersectionObserver' in window) {
    const memberObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          initializeDeck();
          observer.disconnect();
        });
      },
      {
        root: scrollRoot,
        rootMargin: '25% 0px',
        threshold: 0.15,
      }
    );

    memberObserver.observe(membersPanel);
  } else {
    initializeDeck();
  }
})();
