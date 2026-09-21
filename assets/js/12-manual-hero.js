/* PCE 2.0 · 12-manual-hero
   Imagem e enquadramento do hero dos Manuais (PCE e Experts), editáveis pelo admin.
   Engenharia e fundação: Ronaldo Ferreira.

   - Lê public.manual_hero (key 'pce' | 'experts') e aplica image_url + position_y no hero.
   - Sem linha na tabela: mantém a imagem estática do site (assets/img). Nada quebra.
   - Admin (authIsAdmin) vê o botão "Trocar foto" e o painel de enquadramento.
   - Upload no bucket manual-photos, pasta hero/. Salva via upsert (RLS: só admin).
   - Não toca em 05-manual-pce.js nem no módulo Experts. */
(function(){
  if (window.__manualHeroBooted) return; window.__manualHeroBooted = true;

  var HEROS = {
    pce:     { wrap:'mpce-hero',   img:null, fallback:'assets/img/manual-hero-pce.jpg' },
    experts: { wrap:'manual-hero', img:null, fallback:'assets/img/manual-hero-experts.jpg' }
  };
  var STATE = { pce:null, experts:null };   // linha do banco por manual
  var DRAFT = { key:null, file:null, url:null, pos:0 };

  function $(id){ return document.getElementById(id); }
  function sb(){ return (typeof SB !== 'undefined' && SB) ? SB : (window.SB || null); }
  function isAdm(){ try{ return (typeof authIsAdmin === 'function') ? !!authIsAdmin() : false; }catch(e){ return false; } }
  function toast(msg){ try{ if (typeof manualToast === 'function') manualToast(msg); else console.log('[HERO]', msg); }catch(e){} }
  function imgEl(key){
    var w = $(HEROS[key].wrap); if (!w) return null;
    return w.querySelector('.mhero-img');
  }

  /* ── aplicar no DOM ───────────────────────────────────────────── */
  function apply(key, url, pos){
    var el = imgEl(key); if (!el) return;
    var u = url || HEROS[key].fallback;
    var p = (pos == null || isNaN(pos)) ? 0 : Math.max(0, Math.min(100, +pos));
    el.style.backgroundImage = "url('" + u + "')";
    el.style.backgroundPosition = 'right ' + p + '%';
  }

  /* ── carregar do banco ────────────────────────────────────────── */
  async function load(){
    var c = sb(); if (!c) return;
    try{
      var r = await c.from('manual_hero').select('key,image_url,position_y,updated_at,updated_by');
      if (r.error) throw r.error;
      (r.data || []).forEach(function(row){
        STATE[row.key] = row;
        apply(row.key, row.image_url, row.position_y);
      });
    }catch(e){ console.warn('[HERO] load', e && e.message); }
    mountButtons();
  }

  /* ── botão "Trocar foto" no hero (só admin) ───────────────────── */
  function mountButtons(){
    Object.keys(HEROS).forEach(function(key){
      var w = $(HEROS[key].wrap); if (!w) return;
      var old = w.querySelector('.mhero-edit'); if (old) old.remove();
      if (!isAdm()) return;
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'mhero-edit';
      b.innerHTML = '\uD83D\uDDBC Trocar foto';
      b.onclick = function(){ openPanel(key); };
      w.appendChild(b);
    });
  }

  /* ── painel de troca/enquadramento ────────────────────────────── */
  function ensurePanel(){
    if ($('mhero-panel')) return;
    var d = document.createElement('div');
    d.className = 'mhero-panel'; d.id = 'mhero-panel';
    d.innerHTML =
      '<div class="mhero-panel-in">' +
        '<div class="mhero-panel-h"><div class="mhero-panel-t">Imagem do hero</div><button type="button" class="mhero-panel-x" id="mhero-x">\u2715</button></div>' +
        '<div class="mhero-prev" id="mhero-prev"></div>' +
        '<label class="mhero-file"><input type="file" id="mhero-file" accept="image/*" hidden><span id="mhero-file-lbl">Escolher imagem (JPG/PNG, at\u00e9 5 MB)</span></label>' +
        '<div class="mhero-slider"><span>Enquadramento</span><input type="range" id="mhero-pos" min="0" max="100" step="1" value="0"><span id="mhero-pos-v">Topo</span></div>' +
        '<div class="mhero-hint">Arraste o controle: 0 = topo da foto, 50 = centro, 100 = base. A pr\u00e9via acima mostra como fica.</div>' +
        '<div class="mhero-acts"><button type="button" class="mhero-btn2" id="mhero-reset">Voltar \u00e0 imagem padr\u00e3o</button><span class="mhero-sp"></span><button type="button" class="mhero-btn2" id="mhero-cancel">Cancelar</button><button type="button" class="mhero-btn2 pri" id="mhero-save">Salvar</button></div>' +
        '<div class="mhero-msg" id="mhero-msg"></div>' +
      '</div>';
    document.body.appendChild(d);
    $('mhero-x').onclick = closePanel; $('mhero-cancel').onclick = closePanel;
    d.addEventListener('click', function(e){ if (e.target === d) closePanel(); });
    $('mhero-file').onchange = onFile;
    $('mhero-pos').oninput = onPos;
    $('mhero-save').onclick = save;
    $('mhero-reset').onclick = resetDefault;
  }
  function posLabel(p){ return p <= 10 ? 'Topo' : p >= 90 ? 'Base' : (p === 50 ? 'Centro' : p + '%'); }
  function renderPrev(){
    var pv = $('mhero-prev'); if (!pv) return;
    var u = DRAFT.url || (STATE[DRAFT.key] && STATE[DRAFT.key].image_url) || HEROS[DRAFT.key].fallback;
    pv.style.backgroundImage = "url('" + u + "')";
    pv.style.backgroundPosition = 'right ' + DRAFT.pos + '%';
    $('mhero-pos-v').textContent = posLabel(DRAFT.pos);
  }
  function openPanel(key){
    ensurePanel();
    var cur = STATE[key] || {};
    DRAFT = { key:key, file:null, url:null, pos: (cur.position_y != null ? +cur.position_y : 0) };
    $('mhero-pos').value = DRAFT.pos;
    $('mhero-file').value = ''; $('mhero-file-lbl').textContent = 'Escolher imagem (JPG/PNG, at\u00e9 5 MB)';
    $('mhero-msg').textContent = ''; $('mhero-save').disabled = false;
    renderPrev();
    $('mhero-panel').classList.add('on');
  }
  function closePanel(){ var p = $('mhero-panel'); if (p) p.classList.remove('on'); if (DRAFT.url && DRAFT.url.indexOf('blob:') === 0) URL.revokeObjectURL(DRAFT.url); DRAFT = { key:null, file:null, url:null, pos:0 }; }
  function onFile(e){
    var f = e.target.files && e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) { $('mhero-msg').textContent = 'Escolha um arquivo de imagem.'; return; }
    if (f.size > 5 * 1024 * 1024) { $('mhero-msg').textContent = 'Imagem acima de 5 MB. Reduza e tente de novo.'; return; }
    DRAFT.file = f; DRAFT.url = URL.createObjectURL(f);
    $('mhero-file-lbl').textContent = f.name + ' (' + Math.round(f.size/1024) + ' KB)';
    $('mhero-msg').textContent = '';
    renderPrev();
  }
  function onPos(e){ DRAFT.pos = +e.target.value; renderPrev(); }

  /* ── salvar: upload (se houver arquivo) + upsert na tabela ────── */
  async function save(){
    var c = sb(); if (!c) { $('mhero-msg').textContent = 'Supabase n\u00e3o dispon\u00edvel.'; return; }
    if (!isAdm()) { $('mhero-msg').textContent = 'Apenas administradores.'; return; }
    var key = DRAFT.key, url = (STATE[key] && STATE[key].image_url) || null;
    $('mhero-save').disabled = true; $('mhero-msg').textContent = 'Salvando\u2026';
    try{
      if (DRAFT.file){
        var ext = (DRAFT.file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g,'') || 'jpg';
        var path = 'hero/' + key + '-' + Date.now() + '.' + ext;
        var up = await c.storage.from('manual-photos').upload(path, DRAFT.file, { contentType: DRAFT.file.type || 'image/jpeg', cacheControl:'3600', upsert:false });
        if (up.error) throw up.error;
        url = c.storage.from('manual-photos').getPublicUrl(path).data.publicUrl;
      }
      var who = null; try{ who = (typeof _currentProfile !== 'undefined' && _currentProfile && (_currentProfile.full_name || _currentProfile.email)) || null; }catch(e){}
      var row = { key:key, image_url:url, position_y:DRAFT.pos, updated_at:new Date().toISOString(), updated_by:who };
      var r = await c.from('manual_hero').upsert(row, { onConflict:'key' }).select().single();
      if (r.error) throw r.error;
      STATE[key] = r.data; apply(key, r.data.image_url, r.data.position_y);
      toast('Imagem do hero salva');
      closePanel();
    }catch(e){
      console.error('[HERO] save', e);
      $('mhero-msg').textContent = 'Erro ao salvar: ' + (e && e.message ? e.message : e);
      $('mhero-save').disabled = false;
    }
  }
  /* ── voltar \u00e0 imagem est\u00e1tica: apaga a linha do banco ───────── */
  async function resetDefault(){
    var c = sb(); if (!c || !isAdm()) return;
    if (!STATE[DRAFT.key]) { DRAFT.url = null; DRAFT.file = null; DRAFT.pos = 0; $('mhero-pos').value = 0; renderPrev(); return; }
    if (!confirm('Voltar \u00e0 imagem padr\u00e3o do site? A foto atual deixa de ser usada.')) return;
    $('mhero-msg').textContent = 'Restaurando\u2026';
    try{
      var r = await c.from('manual_hero').delete().eq('key', DRAFT.key);
      if (r.error) throw r.error;
      STATE[DRAFT.key] = null; apply(DRAFT.key, null, 0);
      toast('Imagem padr\u00e3o restaurada'); closePanel();
    }catch(e){ $('mhero-msg').textContent = 'Erro: ' + (e && e.message ? e.message : e); }
  }

  /* ── boot: quando o Supabase estiver pronto e ao mudar login ──── */
  var tries = 0;
  function boot(){
    if (sb()) { load(); return; }
    if (++tries < 40) setTimeout(boot, 500);   // até 20 s esperando __loadManualDeps
  }
  document.addEventListener('DOMContentLoaded', boot);
  if (document.readyState !== 'loading') boot();
  window.addEventListener('pce:auth', mountButtons);          // se o app emitir evento de login
  window.__manualHeroRefresh = function(){ mountButtons(); }; // ponto de re-render manual
  // fallback: reavaliar o botão a cada mudança do chip de usuário
  var chip = $('user-chip');
  if (chip && window.MutationObserver) new MutationObserver(function(){ mountButtons(); }).observe(chip, { attributes:true, attributeFilter:['class'] });
})();
