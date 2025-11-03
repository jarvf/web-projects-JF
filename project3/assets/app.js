async function getJSON(u) {
  const r = await fetch(u);
  if (!r.ok) throw new Error("fetch " + u);
  return r.json();
}
function el(h) {
  const t = document.createElement("template");
  t.innerHTML = h.trim();
  return t.content.firstChild;
}

(async function feed() {
  const root = document.getElementById("feed");
  if (!root) return;
  try {
    const items = await getJSON("/api/feed");
    root.innerHTML = "";
    if (items.length === 0) {
      root.appendChild(
        el('<div class="row"><span>No posts yet.</span><span></span></div>')
      );
      return;
    }
    items.forEach((p) =>
      root.appendChild(
        el(
          `<div class="row"><span>${p.author}: ${p.text}</span><span>${new Date(
            p.createdAt
          ).toLocaleDateString()}</span></div>`
        )
      )
    );
  } catch (e) {
    root.textContent = "Failed to load feed.";
  }
})();
