// Core utilities for ShadowHub — data loader, render helpers, modals
(function(window){
  'use strict';

  const ShadowHub = window.ShadowHub || {};
  let _DATA = null;

  async function ensureData(){
    if(_DATA) return _DATA;
    const paths = ['data/software.json','../data/software.json'];
    for(const p of paths){
      try{
        const res = await fetch(p);
        if(!res.ok) continue;
        _DATA = await res.json();
        break;
      }catch(e){ /* try next */ }
    }
    if(!_DATA) _DATA = [];
    return _DATA;
  }

  function getAllSoftware(){ return _DATA || []; }

  function humanSize(bytes){ if(!bytes && bytes !== 0) return '—'; const u=['B','KB','MB','GB','TB']; let i=0; let b=bytes; while(b>1024 && i<u.length-1){ b/=1024; i++ } return Math.round(b*10)/10 + ' ' + u[i]; }

  function createCard(item){
    const card = document.createElement('div');
    card.className = 'software-card bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden hover:border-red-500 transition-all cursor-pointer';

    const imgSrc = item.image || 'https://picsum.photos/seed/'+encodeURIComponent(item.name || 's')+'/600/400';

    card.innerHTML = `
      <div class="relative h-52">
        <img src="${imgSrc}" alt="${item.name}" class="w-full h-full object-cover">
        ${item.type === 'warez' || item.category === 'cracks' ? `<span class="warez-badge alt absolute top-4 right-4">WAREZ</span>` : ''}
      </div>
      <div class="p-6">
        <h3 class="font-bold text-lg mb-2 line-clamp-2">${item.name}</h3>
        <p class="text-zinc-400 text-sm mb-4 line-clamp-3">${item.description || ''}</p>
        <div class="flex gap-3">
          <button class="flex-1 danger-btn py-3 rounded-2xl text-sm font-medium">TÉLÉCHARGER</button>
        </div>
      </div>
    `;

    const btn = card.querySelector('button');
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      fakeDownload(item);
    });

    return card;
  }

  function renderCards(containerId, items){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';
    items.forEach(it => container.appendChild(createCard(it)));
  }

  function showModal(html){
    let overlay = document.getElementById('shadowhub-core-modal');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id = 'shadowhub-core-modal';
      overlay.className = 'fixed inset-0 z-60 flex items-center justify-center modal-backdrop';
      overlay.innerHTML = `<div class="bg-zinc-900 border border-zinc-800 rounded-lg max-w-xl w-full mx-4 p-6 text-sm"><div id="shadowhub-core-modal-body"></div><div class="mt-4 text-right"><button id="shadowhub-core-modal-close" class="px-4 py-2 bg-zinc-800 rounded">FERMER</button></div></div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('#shadowhub-core-modal-close').addEventListener('click', ()=>{ overlay.classList.add('hidden'); overlay.classList.remove('flex'); });
    }
    const body = document.getElementById('shadowhub-core-modal-body');
    if(body) body.innerHTML = html;
    overlay.classList.remove('hidden'); overlay.classList.add('flex');
  }

  function closeModal(){ const o = document.getElementById('shadowhub-core-modal'); if(o){ o.classList.add('hidden'); o.classList.remove('flex'); } }

  function fakeDownload(item){
    // Demo-only safe modal
    const html = `
      <h3 class="text-red-400 font-bold">ACCÈS BLOQUÉ — DÉMO</h3>
      <p class="mt-3 text-zinc-400">Le téléchargement réel est désactivé dans cette démonstration. Aucune ressource illégale n'est fournie.</p>
      <div class="mt-3 text-zinc-300 text-sm"><strong>Nom:</strong> ${item.name || '—'}<br><strong>Version:</strong> ${item.version || '—'}</div>
    `;
    showModal(html);
  }

  async function attachSearch(inputEl, containerId){
    if(typeof inputEl === 'string') inputEl = document.getElementById(inputEl);
    if(!inputEl) return;
    inputEl.addEventListener('input', (e)=>{
      const term = e.target.value.toLowerCase();
      const list = getAllSoftware() || [];
      const filtered = list.filter(s => (s.name && s.name.toLowerCase().includes(term)) || (s.description && s.description.toLowerCase().includes(term)));
      renderCards(containerId, filtered.slice(0,36));
    });
  }

  // expose
  ShadowHub.ensureData = ensureData;
  ShadowHub.getAllSoftware = getAllSoftware;
  ShadowHub.renderCards = renderCards;
  ShadowHub.fakeDownload = fakeDownload;
  ShadowHub.showModal = showModal;
  ShadowHub.closeModal = closeModal;
  ShadowHub.attachSearch = attachSearch;

  window.ShadowHub = ShadowHub;
  window.renderCards = renderCards;

})(window);
