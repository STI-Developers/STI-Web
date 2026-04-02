# Card Editing Guide

This project stores member card data in `js/member-data.js` and renders the cards into the `.member-deck` section in `index.html`.

## Where to edit
- Open `js/member-data.js`.
- Each member is one object inside `window.memberCards`.
- The deck container stays in `index.html`, but the member cards are rendered by `js/main.js`.
- The first card with `deck-cover` in `index.html` is still the STI cover card, not a member profile.

## Data fields
Each member object contains these fields:
- `letter` — card letter and background mark
- `initials` — corner badge initials
- `name` — member name
- `avatar` — avatar image path
- `previewRole` — role shown before drawing
- `slogan` — highlighted detail text
- `detailRole` — role shown after drawing
- `description` — longer member description
- `website` and `websiteLabel` — link target and visible text
- `tx`, `ty`, `rot`, `z` — stack position and rotation

## What to change
For one member card, update these fields together in the same object:
- `initials`
- `name`
- `avatar`
- `previewRole`
- `slogan`
- `detailRole`
- `description`
- `website`
- `websiteLabel`

Only change `tx`, `ty`, `rot`, or `z` when you want to adjust the visual stack layout.

## Avatar images
Temporary avatars live in `avatars/`.
Use a relative path such as:
- `avatars/ruby.png`
- `avatars/blake.png`
- `avatars/E.png`

When replacing an avatar, keep the `alt` text matched to the member name.

## Example
The E card currently shows `Erina Yip` and uses `avatars/E.png`.
To change it, edit the object with:
- `letter: 'E'`
- `name: 'Erina Yip'`

## Layout notes
- `js/main.js` converts each data object into the card markup.
- Most visual styling still lives in `css/sections.css`.
- If you change the generated HTML structure in `js/main.js`, update the related CSS selectors too.
