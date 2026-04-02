# Card Editing Guide

This project stores all member card content directly in `index.html` inside the `.member-deck` section.

## Where to edit
- Open `index.html`.
- Find the member deck block near the `The Members` section.
- Each member card is one `<article class="deck-card">...</article>`.
- The first card with `deck-cover` is the STI cover card, not a member profile.

## Card structure
Each member card contains these parts:
- `card-backdrop` — large blurred background letter
- `card-letter` — small top-right card letter
- `card-corner` — small corner badge with initials and name
- `card-preview` — content shown before the card is drawn
- `card-body` — content shown after the card is drawn

## What to change
For one member card, update these fields together:
- initials in `.mini-avatar`
- short name in `.mini-name`
- avatar path in both `.member-avatar` images
- preview name in `.card-preview-meta h3`
- preview role in `.card-preview-meta p`
- detail name in `.card-body h3`
- slogan in `.card-slogan`
- detail role in `.card-role`
- description in the plain paragraph after `.card-role`
- website in `.card-link`

## Avatar images
Temporary avatars live in `avatars/`.
Use a relative path such as:
- `avatars/ruby.png`
- `avatars/blake.png`
- `avatars/E.png`

When replacing an avatar, keep the `alt` text matched to the member name.

## Example
The E card currently shows `Erina Yip` and uses `avatars/E.png`.
To change it, edit the block that contains:
- `<strong>E</strong>`
- `<span class="mini-name">Erina Yip</span>`

## Layout notes
Do not remove these wrappers unless you also update CSS:
- `.card-preview`
- `.card-body`
- `.card-corner`

Most visual styling lives in `css/sections.css`.
