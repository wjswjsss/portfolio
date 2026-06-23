/* ============================================================
   Portfolio behavior — navigation + multi-select tag filtering.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderPublications();
  renderExperience();
  renderProjects();
  setupNavigation();
  setupMobileNav();
  document.getElementById("year").textContent = new Date().getFullYear();

  // Show the section referenced in the URL hash (if any), else "home".
  const initial = (location.hash || "#home").replace("#", "");
  showSection(document.querySelector(`[data-section="${initial}"]`) ? initial : "home");
});

/* ---------- Rendering ---------- */
function renderPublications() {
  const list = document.getElementById("pub-list");
  list.innerHTML = PUBLICATIONS.map((p) => {
    return `
      <li class="pub-item">
        <p class="pub-title">${p.title}</p>
        <p class="pub-authors">${p.authorsHtml}</p>
        <p class="pub-venue">${p.venue}</p>
      </li>`;
  }).join("");
}

function renderExperience() {
  const container = document.getElementById("experience-list");
  const lane0X = 16;
  const laneGap = 26;
  const nodeR = 6;
  const laneX = (lane) => lane0X + lane * laneGap;
  const maxLane = Math.max(...EXPERIENCE.map((n) => n.lane));
  const railW = laneX(maxLane) + lane0X;

  // 1) Render the labels first so we can measure their real heights
  //    (rows grow when an experience has linked projects).
  const labels = EXPERIENCE.map((n) => {
    const projects = (n.projects || [])
      .map(
        (p) =>
          `<a class="exp-project" href="#projects" data-project="${p.target}">${p.label}<span class="exp-project-icon" aria-hidden="true">↗</span></a>`
      )
      .join("");
    return `
      <li class="commit">
        <p class="exp-role">${n.role} <span class="exp-org">\u00b7 ${n.org}</span></p>
        <p class="commit-period">${n.year}</p>
        ${projects ? `<div class="exp-projects">${projects}</div>` : ""}
      </li>`;
  }).join("");

  container.style.setProperty("--rail-w", `${railW}px`);
  container.innerHTML = `<ol class="git-labels">${labels}</ol>`;

  // 2) Measure each row's center so SVG nodes align with variable-height rows.
  const items = [...container.querySelectorAll(".commit")];
  const pos = {};
  EXPERIENCE.forEach((n, i) => {
    const li = items[i];
    pos[n.id] = { x: laneX(n.lane), y: li.offsetTop + li.offsetHeight / 2 };
  });
  const totalH = container.querySelector(".git-labels").offsetHeight;

  const edges = EXPERIENCE_EDGES.map(([a, b]) => {
    const p = pos[a];
    const c = pos[b];
    const midY = (p.y + c.y) / 2;
    return `<path class="git-edge" d="M${p.x},${p.y} C${p.x},${midY} ${c.x},${midY} ${c.x},${c.y}" />`;
  }).join("");

  const nodes = EXPERIENCE.map((n) => {
    const p = pos[n.id];
    return `<circle class="git-node" cx="${p.x}" cy="${p.y}" r="${nodeR}" />`;
  }).join("");

  const svg = `<svg class="git-rail" width="${railW}" height="${totalH}" viewBox="0 0 ${railW} ${totalH}" aria-hidden="true">${edges}${nodes}</svg>`;

  // 3) Prepend the rail behind the (already rendered) labels.
  container.insertAdjacentHTML("afterbegin", svg);

  // 4) Wire experience -> project links.
  container.querySelectorAll(".exp-project").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openProject(link.dataset.project);
    });
  });
}

/* ---------- Projects + tag filtering ---------- */
const activeTags = new Set();

/* Inline SVG icons keyed by link `type`. Default: "link" (external arrow). */
const LINK_ICONS = {
  paper: `<svg class="link-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 1h5.5L11 3.5V13H3V1z"/><path d="M8.5 1v2.5H11"/><line x1="4.5" y1="6.5" x2="9.5" y2="6.5"/><line x1="4.5" y1="9" x2="7.5" y2="9"/></svg>`,
  github: `<svg class="link-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>`,
  demo:  `<svg class="link-icon" width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><polygon points="3,1 13,7 3,13"/></svg>`,
  arxiv: `<svg class="link-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1.5" y="1.5" width="11" height="11" rx="1.5"/><path d="M4.5 9.5L6.5 5 8 7.5 9.5 5 11.5 9.5"/></svg>`,
  link:  `<svg class="link-icon" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V8.5"/><path d="M8.5 1H13v4.5"/><line x1="13" y1="1" x2="6.5" y2="7.5"/></svg>`
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* Jump from an experience item to its project card:
   switch to Projects, clear filters so the card is visible, open & highlight it. */
function openProject(title) {
  showSection("projects");
  document.querySelector('.nav-link[data-section="projects"]')?.classList.add("active");

  if (activeTags.size) {
    activeTags.clear();
    renderFilterBar();
    renderProjectGrid();
  }

  const card = document.getElementById(`project-${slugify(title)}`);
  if (!card) return;

  // Make sure the card is expanded when jumped to.
  card.classList.remove("is-folded");
  const fold = card.querySelector(".project-fold");
  if (fold) {
    fold.setAttribute("aria-expanded", "true");
  }

  // Mark the matching minimap item active.
  document.querySelectorAll(".minimap-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.project === title);
  });

  requestAnimationFrame(() => {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.remove("project-flash");
    void card.offsetWidth; // restart the animation
    card.classList.add("project-flash");
  });
}

/* Tag tier definitions — order determines display order within each group */
const TAG_TIERS = [
  { label: "Domain",    tags: ["Industry", "Research"] },
  { label: "Technical", tags: ["Robotics", "Computer Vision", "ML Engineering", "Full-stack", "Software Development", "VR", "Traditional ML"] }
];

function allTags() {
  const set = new Set();
  PROJECTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
  return [...set].sort();
}

function renderProjects() {
  renderFilterBar();
  renderProjectGrid();
}

function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  const usedTags = new Set();
  PROJECTS.forEach((p) => p.tags.forEach((t) => usedTags.add(t)));

  let html = "";
  TAG_TIERS.forEach((tier) => {
    const tierTags = tier.tags.filter((t) => usedTags.has(t));
    if (!tierTags.length) return;
    html += `<div class="filter-tier">`;
    html += `<span class="filter-tier-label">${tier.label}</span>`;
    tierTags.forEach((t) => {
      html += `<button class="filter-chip${activeTags.has(t) ? " active" : ""}" data-tag="${t}">${t}</button>`;
    });
    html += `</div>`;
  });

  // Any tags not assigned to a tier go to an ungrouped row
  const ungrouped = [...usedTags].filter((t) => !TAG_TIERS.some((tier) => tier.tags.includes(t))).sort();
  if (ungrouped.length) {
    html += `<div class="filter-tier">`;
    ungrouped.forEach((t) => {
      html += `<button class="filter-chip${activeTags.has(t) ? " active" : ""}" data-tag="${t}">${t}</button>`;
    });
    html += `</div>`;
  }

  html += `<button class="filter-chip clear" data-clear="true"${activeTags.size ? "" : " hidden"}>Clear ✕</button>`;
  bar.innerHTML = html;

  bar.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.dataset.clear) {
        activeTags.clear();
      } else {
        const tag = chip.dataset.tag;
        activeTags.has(tag) ? activeTags.delete(tag) : activeTags.add(tag);
      }
      renderFilterBar();
      renderProjectGrid();
    });
  });
}

function renderProjectGrid() {
  const grid = document.getElementById("project-grid");
  const empty = document.getElementById("empty-state");

  // Multi-select: a project matches if it has ALL selected tags.
  const filtered = PROJECTS.filter((p) =>
    [...activeTags].every((t) => p.tags.includes(t))
  );

  empty.hidden = filtered.length !== 0;

  // Update result count
  const countEl = document.getElementById("filter-count");
  if (countEl) {
    const total = PROJECTS.length;
    countEl.textContent = activeTags.size
      ? `${filtered.length} / ${total} project${total !== 1 ? "s" : ""}`
      : "";
    countEl.hidden = !activeTags.size;
  }

  grid.innerHTML = filtered
    .map((p) => {
      const tags = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");
      const links = (p.links || [])
        .map((l) => {
          const icon = LINK_ICONS[l.type || "link"] || LINK_ICONS.link;
          return `<a class="project-link-btn" href="${l.url}" target="_blank" rel="noopener">${icon}<span>${l.label}</span></a>`;
        })
        .join("");

      // Unify figures + demo gifs into one thumbnail strip.
      const mediaItems = Array.isArray(p.media) ? p.media : p.media ? [{ src: p.media }] : [];
      const galleryItems = (p.gallery || []).map((src, i) => ({ src, label: `Clip ${i + 1}` }));
      const allMedia = [...mediaItems, ...galleryItems];

      const thumbs = allMedia
        .map((m, i) => {
          const label = m.label || `View ${i + 1}`;
          const preview = m.type === "video"
            ? `<video src="${m.src}" muted loop playsinline preload="metadata"></video>`
            : `<img src="${m.src}" alt="${p.title} — ${label}" loading="lazy" onerror="this.closest('.media-thumb').remove()">`;
          return `
            <a class="media-thumb" href="${m.src}" target="_blank" rel="noopener" title="${label} — open full size">
              ${preview}
              <span class="media-thumb-label">${label}</span>
              <span class="media-thumb-zoom" aria-hidden="true">⤢</span>
            </a>`;
        })
        .join("");

      const captions = allMedia
        .filter((m) => m.caption)
        .map((m) => `<p class="project-caption">${m.caption}</p>`)
        .join("");

      return `
        <article class="project-card" id="project-${slugify(p.title)}" data-project-title="${p.title}">
          <header class="project-head">
            <button class="project-fold" type="button" aria-expanded="true" aria-label="Fold or elaborate ${p.title}" title="Fold / Elaborate">
              <span class="project-fold-icon" aria-hidden="true"></span>
            </button>
            <h3 class="project-title">${p.title}</h3>
            <span class="project-tags">${tags}</span>
          </header>
          <div class="project-body">
            <div class="project-desc">${p.description}</div>
            ${thumbs ? `<div class="project-media-strip">${thumbs}</div>` : ""}
            ${captions}
            ${links ? `<div class="project-links">${links}</div>` : ""}
          </div>
        </article>`;
    })
    .join("");

  // Fold / Elaborate toggle for each card.
  grid.querySelectorAll(".project-fold").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      card.classList.toggle("is-folded", expanded);
    });
  });

  renderMinimap(filtered);
}

/* Floating minimap on the left — quick locate / jump between project cards. */
function renderMinimap(projects) {
  const minimap = document.getElementById("project-minimap");
  if (!minimap) return;
  minimap.innerHTML = projects
    .map(
      (p) => `
      <a class="minimap-item" href="#project-${slugify(p.title)}" data-project="${p.title}">
        <span class="minimap-dot" aria-hidden="true"></span>
        <span class="minimap-label">${p.title}</span>
      </a>`
    )
    .join("");

  minimap.querySelectorAll(".minimap-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openProject(item.dataset.project);
    });
  });

  // Scroll-spy: update active minimap item as user scrolls.
  if (window._minimapScrollHandler) {
    window.removeEventListener("scroll", window._minimapScrollHandler);
    document.removeEventListener("scroll", window._minimapScrollHandler);
  }
  function updateMinimapActive() {
    const cards = [...document.querySelectorAll(".project-card[data-project-title]")];
    if (!cards.length) return;
    // Find the card whose top edge is closest to (but not below) the middle of the viewport.
    const mid = window.innerHeight * 0.4;
    let best = cards[0];
    let bestDist = Infinity;
    cards.forEach((card) => {
      const top = card.getBoundingClientRect().top;
      const dist = Math.abs(top - mid);
      if (dist < bestDist) { bestDist = dist; best = card; }
    });
    const title = best.dataset.projectTitle;
    minimap.querySelectorAll(".minimap-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.project === title);
    });
  }
  window._minimapScrollHandler = updateMinimapActive;
  window.addEventListener("scroll", updateMinimapActive, { passive: true });
  document.addEventListener("scroll", updateMinimapActive, { passive: true });
  // Run once immediately to set initial state.
  updateMinimapActive();
}

/* ---------- Navigation (one section at a time) ---------- */
function setupNavigation() {
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      showSection(target);
      history.replaceState(null, "", `#${target}`);
      closeMobileNav();
    });
  });
}

function showSection(name) {
  document.querySelectorAll(".section").forEach((s) => {
    s.classList.toggle("is-active", s.id === name);
  });

  // Experience rail uses measured row heights; re-render after section is visible.
  if (name === "experience") {
    renderExperience();
  }

  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.dataset.section === name);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Mobile nav ---------- */
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const list = document.querySelector(".nav-list");
  toggle.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function closeMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  document.querySelector(".nav-list").classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}
