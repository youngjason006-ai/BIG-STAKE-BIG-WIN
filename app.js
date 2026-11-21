const matches = [
  { id: 'm1', sport: 'Football', icon: '⚽', league: 'PREMIER DIVISION', time: '18:30', status: 'UP NEXT', home: 'Eastborough FC', away: 'Westhaven', homeIcon: '🟠', awayIcon: '🔵', odds: ['2.10', '3.25', '3.40'] },
  { id: 'm2', sport: 'Basketball', icon: '🏀', league: 'PRO BASKETBALL', time: '19:00', status: 'UP NEXT', home: 'Metro Kings', away: 'Coastline', homeIcon: '👑', awayIcon: '🌊', odds: ['1.78', '—', '2.02'] },
  { id: 'm3', sport: 'Tennis', icon: '🎾', league: 'WORLD TOUR · QUARTER FINAL', time: '19:15', status: 'UP NEXT', home: 'A. Rivera', away: 'J. Novak', homeIcon: '🇪🇸', awayIcon: '🇨🇿', odds: ['1.91', '—', '1.87'] },
  { id: 'm4', sport: 'Football', icon: '⚽', league: 'NATIONAL LEAGUE', time: '20:00', status: 'UP NEXT', home: 'Harbor Town', away: 'Pinecrest United', homeIcon: '⚓', awayIcon: '🌲', odds: ['2.45', '3.10', '2.80'] },
  { id: 'm5', sport: 'Hockey', icon: '🏒', league: 'ICE LEAGUE', time: '20:30', status: 'UP NEXT', home: 'Frost Wolves', away: 'Blaze HC', homeIcon: '🐺', awayIcon: '🔥', odds: ['2.20', '—', '1.74'] },
  { id: 'm6', sport: 'Football', icon: '⚽', league: 'CHAMPIONS SERIES', time: '21:00', status: 'UP NEXT', home: 'Capital Rovers', away: 'Valley Stars', homeIcon: '⭐', awayIcon: '💫', odds: ['1.95', '3.50', '3.80'] }
];
const picks = new Map();
const matchList = document.getElementById('matchList');
const slipPicks = document.getElementById('slipPicks');
const stakeInput = document.getElementById('stakeInput');
const toast = document.getElementById('toast');
let activeSport = 'all';
let toastTimer;

function renderMatches() {
  const filtered = matches.filter(m => activeSport === 'all' || m.sport === activeSport);
  matchList.innerHTML = filtered.map(m => `<article class="match-card" data-search="${m.home} ${m.away} ${m.league}">
    <div class="match-meta"><span class="league-name">${m.icon} &nbsp;${m.league}</span><span class="match-time">${m.time} <i>·</i> ${m.status}</span></div>
    <div class="match-main"><div class="teams"><div class="team-row"><span class="team-badge">${m.homeIcon}</span><b>${m.home}</b></div><div class="team-row"><span class="team-badge">${m.awayIcon}</span><b>${m.away}</b></div></div><div class="odds-area"><span class="odds-label">${m.sport === 'Football' ? 'MATCH RESULT' : 'WINNER'}</span><div class="odds-buttons">${m.odds.map((odd, i) => odd === '—' ? `<span class="odds-na">—</span>` : `<button class="odd-btn ${picks.get(m.id)?.index === i ? 'picked' : ''}" data-match="${m.id}" data-index="${i}" aria-label="${['Home win', 'Draw', 'Away win'][i]} odds ${odd}"><span>${['1', 'X', '2'][i]}</span><b>${odd}</b></button>`).join('')}</div></div></div>
    <div class="match-foot"><span>＋ More markets</span><span>Match centre <b>↗</b></span></div>
  </article>`).join('');
  matchList.querySelectorAll('.odd-btn').forEach(button => button.addEventListener('click', () => togglePick(button.dataset.match, Number(button.dataset.index))));
}
function togglePick(id, index) {
  if (picks.has(id) && picks.get(id).index === index) picks.delete(id);
  else { const m = matches.find(item => item.id === id); picks.set(id, { id, index, odd: Number(m.odds[index]), name: `${m.home} vs ${m.away}`, outcome: index === 0 ? m.home : index === 1 ? 'Draw' : m.away, sport: m.sport }); }
  renderMatches(); renderSlip();
}
function renderSlip() {
  const list = [...picks.values()];
  document.getElementById('pickCount').textContent = list.length;
  document.getElementById('slipEmpty').hidden = list.length > 0;
  document.getElementById('stakeArea').hidden = list.length === 0;
  slipPicks.innerHTML = list.map(p => `<div class="slip-pick"><div><span class="pick-sport">${matches.find(m => m.id === p.id).icon} ${p.sport} · ${p.odd.toFixed(2)}</span><b>${p.outcome}</b><small>${p.name}</small></div><button class="remove-pick" data-remove="${p.id}" aria-label="Remove ${p.name}">×</button></div>`).join('');
  slipPicks.querySelectorAll('.remove-pick').forEach(b => b.addEventListener('click', () => { picks.delete(b.dataset.remove); renderMatches(); renderSlip(); }));
  updateReturn();
}
function updateReturn() {
  const stake = Math.max(0, Number(stakeInput.value) || 0);
  const combined = [...picks.values()].reduce((total, pick) => total * pick.odd, 1);
  document.getElementById('potentialReturn').textContent = (stake * combined).toFixed(2);
}
function showToast(message) {
  toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}
document.querySelectorAll('.sport-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.sport-tab').forEach(t => t.classList.remove('selected'));
  tab.classList.add('selected'); activeSport = tab.dataset.sport; renderMatches();
}));
stakeInput.addEventListener('input', updateReturn);
document.querySelectorAll('.quick-stakes button').forEach(button => button.addEventListener('click', () => { stakeInput.value = button.dataset.stake; updateReturn(); }));
document.getElementById('clearSlip').addEventListener('click', () => { picks.clear(); renderMatches(); renderSlip(); });
document.getElementById('demoSubmit').addEventListener('click', () => {
  if (!picks.size) return;
  showToast('Nice picks! This is a demo — no real wager was placed.'); picks.clear(); stakeInput.value = 10; renderMatches(); renderSlip();
});
document.getElementById('loadMore').addEventListener('click', () => showToast('You’re all caught up with today’s lineup.'));
document.querySelectorAll('.view-chip').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.view-chip').forEach(b => b.classList.remove('active')); button.classList.add('active');
}));
document.querySelectorAll('.outline-btn, .join-btn').forEach(button => button.addEventListener('click', () => showToast('Welcome to Rally — account features are coming soon.')));
const searchModal = document.getElementById('searchModal');
function closeSearch() { searchModal.classList.remove('open'); searchModal.setAttribute('aria-hidden', 'true'); }
document.querySelector('.search-toggle').addEventListener('click', () => { searchModal.classList.add('open'); searchModal.setAttribute('aria-hidden', 'false'); document.getElementById('searchInput').focus(); });
document.querySelector('.search-close').addEventListener('click', closeSearch);
searchModal.addEventListener('click', e => { if (e.target === searchModal) closeSearch(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
document.getElementById('searchInput').addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.match-card').forEach(card => { card.hidden = !card.dataset.search.toLowerCase().includes(term); });
});
renderMatches();
