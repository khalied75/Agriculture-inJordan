(() => {
  const PAGE_SIZE = 20;
  const DATA_URL = '../data/plants.json';

  const state = { all: [], filtered: [], page: 1, rarity: 'all', q: '' };

  const els = {
    grid: document.getElementById('grid'),
    pager: document.getElementById('pagination'),
    search: document.getElementById('search'),
    rarity: document.getElementById('rarity'),
    count: document.getElementById('count')
  };

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }

  function normalize(data){
    const avail=(data['Available plants']||[]).map(c=>({...c,rarity:'available'}));
    const rare=(data['Rare plants']||[]).map(c=>({...c,rarity:'rare'}));
    return shuffle([...avail,...rare]);
  }

  function applyFilters(){
    const q=state.q.trim().toLowerCase();
    state.filtered=state.all.filter(item=>{
      const okRarity=state.rarity==='all'?true:item.rarity===state.rarity;
      const okText=!q?true:(item.name||'').toLowerCase().includes(q);
      return okRarity && okText;
    });
    state.page=1;
    render();
  }

  function render(){
    els.count.textContent = `${state.filtered.length} results`;
    const items=state.filtered.slice((state.page-1)*PAGE_SIZE,state.page*PAGE_SIZE);
    els.grid.innerHTML = items.length ? items.map(cardHTML).join('') : `<p>No results found.</p>`;
    renderPager(Math.ceil(state.filtered.length/PAGE_SIZE)||1);
  }

  function cardHTML(item){
    const icon = item.icon.startsWith('<svg') ? item.icon : item.icon || '🌿';
    return `
      <article class="card">
        <div class="icon">${icon}</div>
        <h3 class="name">${item.name}</h3>
        <p class="desc">${item.description}</p>
        <span class="tag ${item.rarity}">${item.rarity}</span>
      </article>`;
  }

  function renderPager(total){
    els.pager.innerHTML='';
    const prev=document.createElement('button');
    prev.className='page-btn';
    prev.textContent='<';
    prev.disabled=state.page<=1;
    prev.onclick=()=>{if(state.page>1){state.page--;render();}};
    els.pager.appendChild(prev);

    for(let i=1;i<=total;i++){
      const btn=document.createElement('button');
      btn.className='page-btn'+(i===state.page?' active':'');
      btn.textContent=i;
      btn.onclick=()=>{state.page=i;render();};
      els.pager.appendChild(btn);
    }

    const next=document.createElement('button');
    next.className='page-btn';
    next.textContent='>';
    next.disabled=state.page>=total;
    next.onclick=()=>{if(state.page<total){state.page++;render();}};
    els.pager.appendChild(next);
  }

  els.search.addEventListener('input',e=>{state.q=e.target.value;applyFilters();});
  els.rarity.addEventListener('change',e=>{state.rarity=e.target.value;applyFilters();});

  fetch(DATA_URL).then(r=>r.json()).then(data=>{
    state.all=normalize(data);
    state.filtered=state.all.slice();
    render();
  });
})();
