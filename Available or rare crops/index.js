(() => {
  const PAGE_SIZE = 24;
  // ضع ملف JSON هنا. غيّر المسار إذا لزم.
  const DATA_URL = '../data/crops.json';

  const state = {
    all: [],
    filtered: [],
    page: 1,
    rarity: 'all',
    q: ''
  };

  const els = {
    grid: document.getElementById('grid'),
    pager: document.getElementById('pagination'),
    search: document.getElementById('search'),
    rarity: document.getElementById('rarity'),
    count: document.getElementById('count')
  };

  function shuffle(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function normalize(data){
    const avail = (data['Available crops'] || []).map(c => ({...c, rarity:'available'}));
    const rare  = (data['Rare crops'] || []).map(c => ({...c, rarity:'rare'}));
    return shuffle([...avail, ...rare]); // خلط عشوائي
  }

  function applyFilters(){
    const q = state.q.trim().toLowerCase();
    state.filtered = state.all.filter(item => {
      const okRarity = state.rarity === 'all' ? true : item.rarity === state.rarity;
      const okText = !q ? true : (item.name || '').toLowerCase().includes(q);
      return okRarity && okText;
    });
    state.page = 1;
    render();
  }

  function pageSlice(){
    const start = (state.page - 1) * PAGE_SIZE;
    return state.filtered.slice(start, start + PAGE_SIZE);
  }

  function render(){
    // count
    els.count.textContent = `${state.filtered.length} results`;

    // grid
    const items = pageSlice();
    if(items.length === 0){
      els.grid.innerHTML = `<p style="color:#666">No results.</p>`;
    }else{
      els.grid.innerHTML = items.map(cardHTML).join('');
    }

    // pagination
    const pages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
    renderPager(pages);
  }

  function cardHTML(item){
    const isSVG = typeof item.icon === 'string' && item.icon.trim().startsWith('<svg');
    const iconEl = isSVG
      ? `<div class="icon" aria-hidden="true">${item.icon}</div>`
      : `<div class="icon" aria-hidden="true">${item.icon || '🟩'}</div>`;

    return `
      <article class="card" aria-label="${escapeHtml(item.name)}">
        ${iconEl}
        <h3 class="name">${escapeHtml(item.name)}</h3>
        <p class="desc">${escapeHtml(item.description || '')}</p>
        <span class="tag ${item.rarity}">${item.rarity === 'rare' ? 'Rare' : 'Available'}</span>
      </article>
    `;
  }

  function renderPager(totalPages){
    const prevDisabled = state.page <= 1 ? 'disabled' : '';
    const nextDisabled = state.page >= totalPages ? 'disabled' : '';
    const pages = rangePages(state.page, totalPages);

    els.pager.innerHTML = `
      <button class="page-btn" ${prevDisabled} aria-label="Previous page">&lt;</button>
      ${pages.map(p => `
        <button class="page-btn ${p === state.page ? 'active' : ''}" data-page="${p}" aria-label="Page ${p}">${p}</button>
      `).join('')}
      <button class="page-btn" ${nextDisabled} aria-label="Next page">&gt;</button>
    `;

    const [prevBtn, ...rest] = els.pager.querySelectorAll('.page-btn');
    const nextBtn = rest[rest.length - 1];
    const pageBtns = Array.from(rest.slice(0, -1));

    prevBtn.addEventListener('click', () => goto(state.page - 1, totalPages));
    nextBtn.addEventListener('click', () => goto(state.page + 1, totalPages));
    pageBtns.forEach(btn => {
      btn.addEventListener('click', () => goto(parseInt(btn.dataset.page, 10), totalPages));
    });
  }

  function goto(p, total){
    if(p < 1 || p > total) return;
    state.page = p;
    render();
  }

  function rangePages(current, total){
    const maxButtons = 7;
    if(total <= maxButtons) return Array.from({length: total}, (_,i) => i+1);

    const half = Math.floor(maxButtons/2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + maxButtons - 1);
    if(end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    return Array.from({length: end - start + 1}, (_,i) => start + i);
  }

  function escapeHtml(s=''){
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // events
  els.search.addEventListener('input', e => { state.q = e.target.value; applyFilters(); });
  els.rarity.addEventListener('change', e => { state.rarity = e.target.value; applyFilters(); });

  // init
  fetch(DATA_URL, { credentials: 'same-origin' })
    .then(r => {
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      state.all = normalize(data);
      state.filtered = state.all.slice();
      render();
    })
    .catch(err => {
      console.error('[crops] load failed:', err);
      els.grid.innerHTML = `<p style="color:#b00">Failed to load data.</p>`;
    });
})();
