/* PCE 2.0 · 15-reorganizacao
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
/* ============================================================
   PCE 2.0 — Reordenacao de cards por drag-and-drop (persistencia global)
   Engenharia da fundacao: Ronaldo Ferreira
   Autocontido: injeta o proprio CSS; reusa SB + Sortable + authIsAdmin.
   Backend: tabela dashboard_card_order (RLS: leitura publica, escrita so admin).
   Fase 1: aba Perfil. Estender a outras telas em PAGES (linha marcada).
   ============================================================ */
(function(){
  'use strict';
  var TABLE='dashboard_card_order';
  var editMode=false, sortables=[], orderCache={}, loaded=false, curPage=null;

  // >>> ESTENDER AQUI para as demais telas: 'page-dash', 'page-insights', etc.
  var PAGES={ 'page-perfil':true };

  function slug(s){return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48);}

  function cardsOf(g){return Array.prototype.slice.call(g.children)
    .filter(function(c){return c.classList && c.classList.contains('card');});}

  // grids "puros" de cards com titulo (.ct) — exclui grids de KPI dinamicos
  function eligibleGrids(page){
    if(!page) return [];
    return Array.prototype.slice.call(page.querySelectorAll('.g2,.g3')).filter(function(g){
      var cards=cardsOf(g);
      return cards.length>=2 && cards.length===g.children.length &&
        cards.every(function(c){return c.querySelector(':scope > .ct');});
    });
  }

  function ensureKeys(page,pageId){
    eligibleGrids(page).forEach(function(g,gi){
      if(!g.dataset.layoutKey){
        var first=g.querySelector('.card > .ct');
        g.dataset.layoutKey=pageId.replace('page-','')+':'+gi+':'+slug(first&&first.textContent);
      }
      cardsOf(g).forEach(function(c,ci){
        if(!c.dataset.cardId){
          var ct=c.querySelector(':scope > .ct');
          c.dataset.cardId=(slug(ct&&ct.textContent)||('c'+ci));
        }
        if(!c.querySelector(':scope > .pce-grab')){
          var h=document.createElement('span');
          h.className='pce-grab'; h.title='Arraste para reordenar'; h.textContent='\u22ee\u22ee';
          c.insertBefore(h,c.firstChild);
        }
      });
    });
  }

  function applyOrder(page){
    eligibleGrids(page).forEach(function(g){
      var order=orderCache[g.dataset.layoutKey]; if(!order||!order.length) return;
      var byId={}; cardsOf(g).forEach(function(c){ if(c.dataset.cardId) byId[c.dataset.cardId]=c; });
      order.forEach(function(id){ if(byId[id]) g.appendChild(byId[id]); });
    });
  }

  function deps(){
    var p=(typeof window.__loadManualDeps==='function')?window.__loadManualDeps():Promise.resolve();
    return p.then(function(){ if(!window._supabaseReady && typeof supabaseInit==='function') supabaseInit(); });
  }

  function loadOrders(){
    if(loaded) return Promise.resolve();
    if(typeof SB==='undefined'||!SB) return Promise.resolve();
    return SB.from(TABLE).select('layout_key,card_ids').then(function(r){
      if(r&&r.data) r.data.forEach(function(row){ orderCache[row.layout_key]=row.card_ids||[]; });
      loaded=true;
    }).catch(function(e){ console.warn('[PCECardOrder] load',e&&e.message); });
  }

  function saveOrder(key,ids){
    orderCache[key]=ids;
    if(typeof SB==='undefined'||!SB) return;
    SB.from(TABLE).upsert({layout_key:key,card_ids:ids,updated_at:new Date().toISOString()},
      {onConflict:'layout_key'}).then(function(r){
        if(r&&r.error) console.warn('[PCECardOrder] save',r.error.message);
      });
  }

  function enable(page){
    if(typeof Sortable==='undefined'){ console.warn('[PCECardOrder] Sortable indisponivel'); return; }
    disable();
    eligibleGrids(page).forEach(function(g){
      g.classList.add('pce-editing');
      sortables.push(Sortable.create(g,{
        animation:150, draggable:'.card', handle:'.pce-grab',
        ghostClass:'sortable-ghost', chosenClass:'sortable-chosen',
        onEnd:function(){ saveOrder(g.dataset.layoutKey, cardsOf(g).map(function(c){return c.dataset.cardId;})); }
      }));
    });
  }
  function disable(){
    sortables.forEach(function(s){try{s.destroy();}catch(e){}}); sortables=[];
    document.querySelectorAll('.pce-editing').forEach(function(g){g.classList.remove('pce-editing');});
  }

  function setBtn(){
    var b=document.getElementById('pce-reorder-btn'); if(!b) return;
    b.textContent=editMode?'\u2713 Concluir':'\u22ee\u22ee Reorganizar';
    b.classList.toggle('on',editMode);
  }
  function toggle(){
    var page=document.getElementById(curPage); if(!page) return;
    editMode=!editMode;
    document.body.classList.toggle('pce-edit-mode',editMode);
    if(editMode){ ensureKeys(page,curPage); enable(page); } else disable();
    setBtn();
  }

  function mountBtn(){
    if(typeof authIsAdmin==='function' && !authIsAdmin()) return;
    if(document.getElementById('pce-reorder-btn')) return;
    var b=document.createElement('button');
    b.id='pce-reorder-btn'; b.type='button'; b.textContent='\u22ee\u22ee Reorganizar';
    b.onclick=toggle;
    document.body.appendChild(b);
  }

  function injectCss(){
    if(document.getElementById('pce-cardorder-css')) return;
    var st=document.createElement('style'); st.id='pce-cardorder-css';
    st.textContent=[
      '#pce-reorder-btn{position:fixed;right:18px;bottom:18px;z-index:9999;display:none;',
        'align-items:center;gap:6px;font-family:inherit;font-size:12px;font-weight:700;',
        'letter-spacing:.02em;color:var(--cream);background:var(--card);border:1px solid var(--border2);',
        'border-radius:999px;padding:9px 16px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35);transition:all .15s}',
      '#pce-reorder-btn:hover{border-color:var(--green)}',
      '#pce-reorder-btn.on{background:var(--green);color:#0a0a09;border-color:var(--green)}',
      'body.pce-page-cards #pce-reorder-btn{display:inline-flex}',
      '.pce-grab{display:none;position:absolute;top:10px;right:10px;z-index:5;font-size:15px;line-height:1;',
        'color:var(--cream);cursor:grab;user-select:none;padding:3px 6px;border-radius:6px;',
        'background:var(--green);opacity:.9}',
      '.pce-grab:active{cursor:grabbing}',
      'body.pce-edit-mode .pce-grab{display:inline-block}',
      'body.pce-edit-mode .pce-editing .card{position:relative;outline:1px dashed var(--border2)}',
      'body.pce-edit-mode .pce-editing .card:hover{outline-color:var(--green)}',
      '.card.sortable-ghost{opacity:.35}',
      '.card.sortable-chosen{box-shadow:0 12px 32px rgba(245,166,35,.25);transform:scale(.99)}'
    ].join('');
    document.head.appendChild(st);
  }

  function initPage(pageId){
    injectCss(); mountBtn();
    var page=document.getElementById(pageId); if(!page) return;
    curPage=pageId;
    var hasCards=eligibleGrids(page).length>0;
    var isAdm=(typeof authIsAdmin!=='function')||authIsAdmin();
    document.body.classList.toggle('pce-page-cards', hasCards && isAdm);
    if(!hasCards) return;
    ensureKeys(page,pageId);
    deps().then(loadOrders).then(function(){ applyOrder(page); });
  }

  function leavePage(){
    if(editMode){ editMode=false; document.body.classList.remove('pce-edit-mode'); disable(); setBtn(); }
    curPage=null; document.body.classList.remove('pce-page-cards');
  }

  // Detecta pagina ativa via classe .active (robusto vs. forma de navegacao)
  function watch(){
    Object.keys(PAGES).forEach(function(pid){
      var el=document.getElementById(pid); if(!el) return;
      new MutationObserver(function(){
        if(el.classList.contains('active')){ if(curPage!==pid) initPage(pid); }
        else if(curPage===pid){ leavePage(); }
      }).observe(el,{attributes:true,attributeFilter:['class']});
      if(el.classList.contains('active')) initPage(pid);
    });
  }

  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',function(){ setTimeout(watch,800); });
  else setTimeout(watch,800);

  window.PCECardOrder={initPage:initPage,toggle:toggle,reload:function(){loaded=false;return loadOrders();}};
})();
