/* ============================================================
   Agent Idle — engine
   Um idle/incremental game sobre montar uma frota de agentes
   que geram "compute" automaticamente. Tudo client-side,
   salvo em localStorage.
   ============================================================ */
"use strict";

const SAVE_KEY = "agent-idle-save-v1";
const TICK_MS = 100; // 10 ticks por segundo
const SAVE_EVERY_MS = 15000;

/* ---------- Definição de conteúdo ---------- */

// Geradores: produzem compute/s. Custo cresce geometricamente.
const GENERATORS = [
  { id: "intern",    icon: "🧑‍💻", name: "Estagiário Script",  desc: "Um loop ingênuo, mas constante.",        baseCost: 15,        rate: 0.2,    growth: 1.15 },
  { id: "bot",       icon: "🤖", name: "Bot Auxiliar",        desc: "Responde, busca, repete.",                baseCost: 120,       rate: 1.5,    growth: 1.16 },
  { id: "agent",     icon: "🛰️", name: "Agente Autônomo",     desc: "Planeja e executa tarefas sozinho.",      baseCost: 1300,      rate: 9,      growth: 1.17 },
  { id: "swarm",     icon: "🐝", name: "Enxame de Agentes",   desc: "Muitos agentes coordenados em paralelo.", baseCost: 14000,     rate: 55,     growth: 1.18 },
  { id: "cluster",   icon: "🖥️", name: "Cluster de GPUs",     desc: "Hardware dedicado rodando sem parar.",    baseCost: 200000,    rate: 350,    growth: 1.19 },
  { id: "datacenter",icon: "🏭", name: "Datacenter",          desc: "Um andar inteiro de compute.",            baseCost: 3300000,   rate: 2600,   growth: 1.20 },
  { id: "fab",       icon: "🛠️", name: "Fábrica de Chips",    desc: "Você fabrica seu próprio silício.",       baseCost: 55000000,  rate: 20000,  growth: 1.21 },
  { id: "agi",       icon: "🧠", name: "Núcleo AGI",          desc: "Otimiza a si mesmo. Cuidado.",            baseCost: 1e9,       rate: 160000, growth: 1.22 },
];

// Upgrades: compra única. multiplica produção global ou cliques.
const UPGRADES = [
  { id: "fastfingers", icon: "👆", name: "Dedos Rápidos",      desc: "Cliques valem 2×.",                  cost: 100,    apply: s => { s.clickMult *= 2; } },
  { id: "caffeine",    icon: "☕", name: "Cafeína Ilimitada",  desc: "Cliques valem +5 fixos.",            cost: 500,    apply: s => { s.clickFlat += 5; } },
  { id: "overclock",   icon: "⚡", name: "Overclock",          desc: "Produção global +25%.",              cost: 5000,   apply: s => { s.globalMult *= 1.25; } },
  { id: "pipeline",    icon: "🔧", name: "Pipeline Otimizada", desc: "Produção global +50%.",              cost: 75000,  apply: s => { s.globalMult *= 1.5; } },
  { id: "quantize",    icon: "📉", name: "Quantização",        desc: "Produção global +100%.",             cost: 1.2e6,  apply: s => { s.globalMult *= 2; } },
  { id: "moe",         icon: "🧩", name: "Mixture of Experts", desc: "Produção global +150%.",             cost: 4e7,    apply: s => { s.globalMult *= 2.5; } },
  { id: "synergy",     icon: "🔗", name: "Sinergia de Frota",  desc: "Produção global ×3.",                cost: 2e9,    apply: s => { s.globalMult *= 3; } },
];

/* ---------- Estado ---------- */

function freshState() {
  return {
    compute: 0,
    totalEarned: 0,     // total bruto já ganho (para prestígio)
    generators: {},     // id -> quantidade
    upgrades: {},        // id -> true
    insights: 0,         // moeda de prestígio
    lastSeen: Date.now(),
  };
}

let state = freshState();

/* multiplicadores derivados, recalculados a cada compra */
let derived = { clickMult: 1, clickFlat: 0, globalMult: 1 };

/* ---------- Persistência ---------- */

function save() {
  state.lastSeen = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    setStatus("Jogo salvo 💾");
  } catch (e) {
    setStatus("Não foi possível salvar (localStorage bloqueado).");
  }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    state = Object.assign(freshState(), data);
    state.generators = data.generators || {};
    state.upgrades = data.upgrades || {};
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- Mecânicas ---------- */

function insightBonus() {
  // cada insight: +2% produção global
  return 1 + state.insights * 0.02;
}

function recomputeDerived() {
  derived = { clickMult: 1, clickFlat: 0, globalMult: 1 };
  for (const up of UPGRADES) {
    if (state.upgrades[up.id]) up.apply(derived);
  }
}

function generatorCost(gen) {
  const owned = state.generators[gen.id] || 0;
  return Math.ceil(gen.baseCost * Math.pow(gen.growth, owned));
}

function clickValue() {
  return (1 + derived.clickFlat) * derived.clickMult * insightBonus();
}

function productionPerSecond() {
  let total = 0;
  for (const gen of GENERATORS) {
    total += (state.generators[gen.id] || 0) * gen.rate;
  }
  return total * derived.globalMult * insightBonus();
}

function earn(amount) {
  state.compute += amount;
  state.totalEarned += amount;
}

function buyGenerator(gen) {
  const cost = generatorCost(gen);
  if (state.compute < cost) return;
  state.compute -= cost;
  state.generators[gen.id] = (state.generators[gen.id] || 0) + 1;
  renderAll();
}

function buyUpgrade(up) {
  if (state.upgrades[up.id] || state.compute < up.cost) return;
  state.compute -= up.cost;
  state.upgrades[up.id] = true;
  recomputeDerived();
  renderAll();
  setStatus(`Upgrade comprado: ${up.name}`);
}

// Prestígio: insights ganhos ~ raiz do total acumulado.
function prestigeGain() {
  if (state.totalEarned < 1e6) return 0;
  return Math.floor(Math.sqrt(state.totalEarned / 1e6));
}

function doPrestige() {
  const gain = prestigeGain();
  if (gain <= 0) return;
  if (!confirm(
    `Treinar o modelo vai reiniciar compute, agentes e upgrades,\n` +
    `mas você ganha ${formatNumber(gain)} insight(s) permanente(s).\n\nContinuar?`
  )) return;
  const keptInsights = state.insights + gain;
  state = freshState();
  state.insights = keptInsights;
  recomputeDerived();
  renderAll();
  setStatus(`✨ Modelo treinado! +${formatNumber(gain)} insights.`);
}

/* ---------- Loop ---------- */

let lastTick = Date.now();

function tick() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  earn(productionPerSecond() * dt);
  renderResources();
}

function applyOfflineProgress() {
  const now = Date.now();
  const away = Math.min((now - (state.lastSeen || now)) / 1000, 60 * 60 * 8); // máx 8h
  if (away > 5) {
    const gained = productionPerSecond() * away;
    if (gained > 0) {
      earn(gained);
      setStatus(`Bem-vindo de volta! Seus agentes geraram ${formatNumber(gained)} compute enquanto você esteve fora (${formatDuration(away)}).`);
    }
  }
}

/* ---------- Formatação ---------- */

const SUFFIXES = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

function formatNumber(n) {
  if (n < 1000) return Number.isInteger(n) ? String(n) : n.toFixed(1);
  const tier = Math.floor(Math.log10(n) / 3);
  if (tier >= SUFFIXES.length) return n.toExponential(2);
  const scaled = n / Math.pow(1000, tier);
  return scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + SUFFIXES[tier];
}

function formatDuration(s) {
  s = Math.floor(s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${sec}s`;
  return `${sec}s`;
}

/* ---------- Render ---------- */

const $ = (id) => document.getElementById(id);

function setStatus(msg) { $("status").textContent = msg; }

function renderResources() {
  $("compute").textContent = formatNumber(state.compute);
  $("computeRate").textContent = `+${formatNumber(productionPerSecond())}/s`;
  $("clickValue").textContent = formatNumber(clickValue());
  refreshAffordability();
}

function renderGenerators() {
  const list = $("generators");
  list.innerHTML = "";
  // mostra um gerador travado à frente do mais caro que você possui
  let revealed = true;
  for (const gen of GENERATORS) {
    const owned = state.generators[gen.id] || 0;
    if (!revealed) break;
    const cost = generatorCost(gen);
    const btn = document.createElement("button");
    btn.className = "item";
    btn.dataset.cost = cost;
    btn.innerHTML = `
      <span class="item-icon">${gen.icon}</span>
      <span class="item-body">
        <span class="item-name">${gen.name} <span class="item-count">×${owned}</span></span>
        <span class="item-desc">${gen.desc} · ${formatNumber(gen.rate)}/s cada</span>
      </span>
      <span class="item-cost">🔣 ${formatNumber(cost)}</span>`;
    btn.addEventListener("click", () => buyGenerator(gen));
    list.appendChild(btn);
    // próximo gerador só aparece quando você tem ao menos 1 do atual,
    // OU já pode pagar metade do custo base do próximo
    revealed = owned > 0 || state.totalEarned >= gen.baseCost * 0.5;
  }
}

function renderUpgrades() {
  const list = $("upgrades");
  list.innerHTML = "";
  for (const up of UPGRADES) {
    const owned = !!state.upgrades[up.id];
    // só revela upgrades cujo custo está dentro de ~10x do total já ganho
    if (!owned && state.totalEarned < up.cost * 0.1) continue;
    const btn = document.createElement("button");
    btn.className = "item";
    btn.dataset.cost = owned ? 0 : up.cost;
    btn.disabled = owned;
    btn.innerHTML = `
      <span class="item-icon">${up.icon}</span>
      <span class="item-body">
        <span class="item-name">${up.name}</span>
        <span class="item-desc">${up.desc}</span>
      </span>
      <span class="item-cost">${owned ? '<span class="upgrade-owned">✓ Comprado</span>' : "🔣 " + formatNumber(up.cost)}</span>`;
    if (!owned) btn.addEventListener("click", () => buyUpgrade(up));
    list.appendChild(btn);
  }
  if (!list.children.length) {
    list.innerHTML = '<li class="muted">Ganhe mais compute para desbloquear upgrades…</li>';
  }
}

function renderPrestige() {
  $("insights").textContent = formatNumber(state.insights);
  $("insightBonus").textContent = `+${Math.round((insightBonus() - 1) * 100)}%`;
  const gain = prestigeGain();
  $("prestigeGain").textContent = formatNumber(gain);
  $("prestigeBtn").disabled = gain <= 0;
}

function refreshAffordability() {
  // atualiza cor do custo sem reconstruir as listas (mais leve por tick)
  document.querySelectorAll(".item").forEach((el) => {
    const cost = Number(el.dataset.cost || 0);
    if (el.disabled) return;
    const can = state.compute >= cost;
    const costEl = el.querySelector(".item-cost");
    if (costEl) costEl.classList.toggle("affordable", can);
    if (costEl) costEl.classList.toggle("too-expensive", !can);
  });
  const gain = prestigeGain();
  $("prestigeBtn").disabled = gain <= 0;
}

function renderAll() {
  renderResources();
  renderGenerators();
  renderUpgrades();
  renderPrestige();
}

/* ---------- Clicker + floaters ---------- */

function spawnFloater(value) {
  const layer = $("floaters");
  const f = document.createElement("span");
  f.className = "floater";
  f.textContent = `+${formatNumber(value)}`;
  f.style.left = 30 + Math.random() * 40 + "%";
  f.style.top = 30 + Math.random() * 30 + "%";
  layer.appendChild(f);
  setTimeout(() => f.remove(), 900);
}

function handleClick() {
  const v = clickValue();
  earn(v);
  spawnFloater(v);
  renderResources();
}

/* ---------- Init ---------- */

function init() {
  const had = load();
  recomputeDerived();
  if (had) applyOfflineProgress();
  lastTick = Date.now();
  renderAll();

  $("clicker").addEventListener("click", handleClick);
  $("prestigeBtn").addEventListener("click", doPrestige);
  $("saveBtn").addEventListener("click", save);
  $("resetBtn").addEventListener("click", () => {
    if (confirm("Apagar TODO o progresso, incluindo insights? Isso não pode ser desfeito.")) {
      localStorage.removeItem(SAVE_KEY);
      state = freshState();
      recomputeDerived();
      renderAll();
      setStatus("Save apagado. Começando do zero.");
    }
  });

  setInterval(tick, TICK_MS);
  setInterval(save, SAVE_EVERY_MS);
  window.addEventListener("beforeunload", save);

  if (!had) setStatus("Bem-vindo ao Agent Idle! Clique no núcleo para começar.");
}

document.addEventListener("DOMContentLoaded", init);
