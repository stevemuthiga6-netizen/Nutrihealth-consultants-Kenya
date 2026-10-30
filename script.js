const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".main-nav a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

const searchRow = $("#searchRow");
$("#searchToggle").addEventListener("click", () => {
  searchRow.classList.toggle("hidden");
  if (!searchRow.classList.contains("hidden")) $("#productSearch").focus();
});
$("#searchClear").addEventListener("click", () => {
  $("#productSearch").value = "";
  filterProducts();
});

let selectedCategory = "All";
function filterProducts() {
  const query = $("#productSearch").value.trim().toLowerCase();
  let visible = 0;
  $$(".product-card").forEach(card => {
    const categoryMatch = selectedCategory === "All" || card.dataset.category === selectedCategory;
    const queryMatch = !query || card.dataset.name.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
    card.classList.toggle("hidden", !(categoryMatch && queryMatch));
    if (categoryMatch && queryMatch) visible++;
  });
  $("#resultsLabel").textContent = `${visible} product${visible === 1 ? "" : "s"} found`;
  let noResults = $("#noResults");
  if (!visible && !noResults) {
    noResults = document.createElement("p");
    noResults.id = "noResults";
    noResults.className = "no-results";
    noResults.textContent = "No products found. Try another search or category.";
    $("#productGrid").appendChild(noResults);
  } else if (visible && noResults) noResults.remove();
}
$("#productSearch").addEventListener("input", filterProducts);
$$(".filter-pill").forEach(button => button.addEventListener("click", () => {
  $$(".filter-pill").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
  selectedCategory = button.dataset.category;
  filterProducts();
}));

const cart = [];
const drawer = $("#cartDrawer");
const scrim = $("#drawerScrim");
function money(amount) { return `KSh ${amount.toLocaleString("en-KE")}`; }
function openCart() {
  drawer.classList.add("open");
  scrim.classList.add("show");
  drawer.setAttribute("aria-hidden", "false");
  $("#cartClose").focus();
}
function closeCart() {
  drawer.classList.remove("open");
  scrim.classList.remove("show");
  drawer.setAttribute("aria-hidden", "true");
}
$("#cartOpen").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
scrim.addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart(); });

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartTotal").textContent = money(total);
  const host = $("#cartItems");
  if (!cart.length) {
    host.innerHTML = '<p class="empty-cart">Your cart is waiting for its first item.</p>';
    return;
  }
  host.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div><strong>${escapeHTML(item.name)}</strong><small>${money(item.price)} each · ${money(item.price * item.quantity)}</small></div>
      <div class="cart-item-controls">
        <button aria-label="Decrease ${escapeHTML(item.name)} quantity" data-action="minus" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button aria-label="Increase ${escapeHTML(item.name)} quantity" data-action="plus" data-index="${index}">+</button>
        <button class="remove-item" aria-label="Remove ${escapeHTML(item.name)}" data-action="remove" data-index="${index}">×</button>
      </div>
    </div>`).join("");
}
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
}
$("#cartItems").addEventListener("click", e => {
  const button = e.target.closest("button[data-action]");
  if (!button) return;
  const item = cart[Number(button.dataset.index)];
  if (!item) return;
  if (button.dataset.action === "plus") item.quantity++;
  if (button.dataset.action === "minus") item.quantity--;
  if (button.dataset.action === "remove" || item.quantity <= 0) cart.splice(Number(button.dataset.index), 1);
  renderCart();
});
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}
$$(".add-cart").forEach(button => button.addEventListener("click", () => {
  const name = button.dataset.product;
  const price = Number(button.dataset.price);
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  renderCart();
  toast(`${name} added to your cart`);
}));
$("#checkoutButton").addEventListener("click", () => {
  if (!cart.length) return toast("Add a product to your cart first.");
  toast("Checkout is a demo. Connect a secure backend and M-Pesa integration before accepting payments.");
});

function showFormResult(id, message) {
  const el = $(id);
  el.textContent = message;
  el.classList.remove("hidden");
}
$("#screeningFormElement").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const age = data.get("age") || "not provided";
  const goal = data.get("goal") || "general wellness";
  showFormResult("#screeningResult", `Thanks for sharing. Your starting point: age range ${age.toLowerCase()}, with a focus on ${goal.toLowerCase()}. This is not a diagnosis. For tailored guidance, request a consultation below.`);
});
$("#bookingDate").min = new Date().toISOString().split("T")[0];
$("#bookingForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const bookingMessage = [
    "Hello NutriHealth Consultants Kenya, I would like to request a consultation.",
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Service: ${data.get("service")}`,
    `Consultation type: ${data.get("type")}`,
    `Preferred date: ${data.get("date")}`,
    `Preferred time: ${data.get("time")}`,
    `Additional details: ${data.get("message") || "None"}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/254724165646?text=${encodeURIComponent(bookingMessage)}`;
  const result = $("#bookingResult");
  result.replaceChildren();
  result.append("Your request is ready. Press Send in WhatsApp to submit it. ");
  const whatsappLink = document.createElement("a");
  whatsappLink.href = whatsappUrl;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.textContent = "Open WhatsApp booking request";
  result.append(whatsappLink);
  result.classList.remove("hidden");
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  e.currentTarget.reset();
});
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  showFormResult("#contactResult", "Thanks for your message. This front-end demo does not send messages yet. Connect a backend or form service to receive enquiries.");
  e.currentTarget.reset();
});
$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  $("#newsletterResult").textContent = "Thanks for your interest. Newsletter signup is demo-only.";
  e.currentTarget.reset();
});
$("#year").textContent = new Date().getFullYear();
renderCart();
