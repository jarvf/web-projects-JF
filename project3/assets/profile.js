async function getJSON(u) {
  const r = await fetch(u);
  if (!r.ok) throw new Error("fetch " + u);
  return r.json();
}
async function postJSON(u, b) {
  const r = await fetch(u, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(b),
  });
  return r.json();
}
function el(h) {
  const t = document.createElement("template");
  t.innerHTML = h.trim();
  return t.content.firstChild;
}

const params = new URLSearchParams(location.search);
const id = params.get("id");
const root = document.getElementById("profileRoot");

(async function init() {
  if (!id) {
    root.textContent = "Missing id";
    return;
  }
  try {
    const p = await getJSON(`/api/profiles/${id}`);
    const posts = await getJSON(`/api/profiles/${id}/wall`);

    root.innerHTML = "";
    root.appendChild(
      el(`
<div class="profile-grid">
<div class="profile-card">
<h1>@${p.username}</h1>
<p>${p.bio || ""}</p>
${
  p.song
    ? `<div class="panel"><iframe title="profile song" src="${p.song}" allow="autoplay; encrypted-media" loading="lazy" width="100%" height="180" style="border:0;border-radius:8px"></iframe></div>`
    : ""
}
<div class="panel">
<h3>Top 8</h3>
<div class="top8">${(p.top8 || [])
        .map((n) => `<div class="bubble">${n}</div>`)
        .join("")}</div>
</div>
</div>
<div>
<div class="panel wall">
<h2>Wall</h2>
<div id="wallList" class="list"></div>
<form id="wallForm">
<label>Nickname <input name="author" placeholder="anon" /></label>
<label>Say something <textarea name="text" rows="3" required></textarea></label>
<button class="btn" type="submit">Post to wall</button>
</form>
</div>
</div>
</div>
`)
    );

    const wallList = document.getElementById("wallList");
    const wallForm = document.getElementById("wallForm");

    function render() {
      wallList.innerHTML = "";
      if (posts.length === 0) {
        wallList.appendChild(
          el('<div class="row"><span>No posts yet.</span><span></span></div>')
        );
        return;
      }
      posts.forEach((w) =>
        wallList.appendChild(
          el(
            `<div class="row"><span>${w.author}: ${
              w.text
            }</span><span>${new Date(
              w.createdAt
            ).toLocaleDateString()}</span></div>`
          )
        )
      );
    }
    render();

    wallForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(wallForm);
      const res = await postJSON(`/api/profiles/${id}/wall`, {
        author: fd.get("author") || "anon",
        text: fd.get("text"),
      });
      if (!res.error) {
        posts.unshift(res);
        wallForm.reset();
        render();
      }
    });
  } catch (e) {
    root.textContent = "Profile not found.";
  }
})();
