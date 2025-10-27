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

const list = document.getElementById("people");
const form = document.getElementById("createForm");

async function load() {
  const people = await getJSON("/api/profiles");
  list.innerHTML = "";
  people.forEach((p) => {
    list.appendChild(
      el(
        `<a class="card" href="profile.html?id=${p.id}"><h3>@${
          p.username
        }</h3><p>${p.bio || ""}</p></a>`
      )
    );
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const top8 = (fd.get("top8") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 8);
  const res = await postJSON("/api/profiles", {
    username: fd.get("username"),
    bio: fd.get("bio"),
    song: fd.get("song"),
    top8,
  });
  if (res.error) {
    alert(res.error);
    return;
  }
  form.reset();
  load();
});

load();
