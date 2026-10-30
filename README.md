# NutriHealth Consultants Kenya website (editable front-end)

This is a responsive HTML/CSS/JavaScript starter based on the NutriHealth website UI concept. It is designed to be opened and edited in **Visual Studio Code**.

## Files
- `index.html` - page content and sections
- `style.css` - colors, spacing, typography, responsive layout and visual styling
- `script.js` - mobile navigation, product filtering/search, demo cart, screening form and booking/contact interactions

## Open it
1. Extract the ZIP file to a folder on your computer.
2. Open Visual Studio Code.
3. Select **File → Open Folder** and choose the extracted `nutrihealth-website` folder.
4. Open `index.html`.
5. For a convenient preview, install the VS Code extension **Live Server** (by Ritwick Dey), then right-click `index.html` and choose **Open with Live Server**. You can also double-click `index.html` to open it in a browser.

## Where to edit
- **Business name, page wording, links and page sections:** `index.html`
- **Brand colors:** at the top of `style.css`, inside `:root`
  - `--green` is the primary green
  - `--red` is the accent red
  - `--green-dark` is the deep green
- **Sample products and prices:** the product cards in `index.html`. Update the product name, category, price and `data-product` / `data-price` values on the Add to Cart button together.
- **Phone and location:** search for `0724 165 646` and `Kiambu Town, Kenya` in `index.html`.
- **Interactions:** `script.js`

## Important limitations
This is a **front-end demo**, not a live online store yet:
- The cart works in the current browser session, but it does not create orders in a database.
- The booking form prepares a WhatsApp message with the requested consultation details; you must press Send in WhatsApp, and NutriHealth must confirm the appointment. Screening, contact and newsletter forms still display demo responses only.
- M-Pesa payments, user accounts, appointment reminders, order tracking and a consultant dashboard require a secure backend and service integrations.
- Product names, prices, ratings and imagery are sample content. Verify all product information and replace sample details before publishing.
- Do not make medical claims about supplements unless properly substantiated. Nutrition screening is not a diagnosis.

## Before publishing
1. Replace sample products and photos with your real, authorized content.
2. Connect forms to a backend or trusted form service.
3. Build secure authentication and a database before adding customer accounts.
4. Integrate M-Pesa using Safaricom Daraja or a trusted payment provider. Never collect or store customers' M-Pesa PINs.
5. Add privacy, terms, delivery, returns and product-safety information.
6. Test on phones, tablets and desktop browsers.
