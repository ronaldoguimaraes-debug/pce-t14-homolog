/* PCE 2.0 · 06-manual-pce
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
// == MANUAL PCE DINAMICO ==
var _mpceState={},_mpceSections=[],_mpceCurrentCard=null,_mpceEditing=false,_mpceUploadTarget=null,_mpceTab='conteudo';
function mpceTree(data){if(!data)return [];if(_mpceTab==='acao'){if(!Array.isArray(data.acaoCS))data.acaoCS=[];return data.acaoCS;}if(!Array.isArray(data.days))data.days=[];return data.days;}
var MPCE_CACHE_KEY='pce_manualpce_v1_cache';
function mpceSaveCache(s){try{localStorage.setItem(MPCE_CACHE_KEY,JSON.stringify(s));}catch(e){}}
function mpceLoadCache(){try{var r=localStorage.getItem(MPCE_CACHE_KEY);return r?JSON.parse(r):null;}catch(e){return null;}}
async function mpceFetchAllFromCloud(){
  if(!_supabaseReady)throw new Error('Supabase nao inicializado');
  var [sR,cR]=await Promise.all([
    SB.from('manualpce_sections').select('id,title,icon,card_size,display_order,is_default').is('deleted_at',null).order('display_order',{ascending:true}),
    SB.from('manualpce_cards').select('id,tag,title,description,days_json,acao_cs_json,cover_url,section_id,display_order,updated_at,updated_by,updated_by_name,external_url,anexos').is('deleted_at',null).order('display_order',{ascending:true})
  ]);
  if(sR.error)throw sR.error;if(cR.error)throw cR.error;
  _mpceSections=sR.data||[];var state={};
  (cR.data||[]).forEach(function(row){state[row.id]={tag:row.tag,title:row.title,desc:row.description||'',days:row.days_json||[],acaoCS:row.acao_cs_json||[],_coverUrl:row.cover_url||'',_sectionId:row.section_id||'',_displayOrder:row.display_order||0,_updatedAt:row.updated_at,_updatedByName:row.updated_by_name||'',externalUrl:row.external_url||'',anexos:Array.isArray(row.anexos)?row.anexos:[]};});
  return state;
}
async function mpceUpdateCardCloud(id,payload){
  if(!_supabaseReady)throw new Error('Sem conexao');if(!_currentUser)throw new Error('Nao logado');
  payload.updated_by=_currentUser.id;payload.updated_by_name=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;payload.updated_at=new Date().toISOString();
  var r=await SB.from('manualpce_cards').update(payload).eq('id',id).select().single();if(r.error)throw r.error;return r.data;
}
function mpceShowLocked(){var lk=document.getElementById('mpce-locked'),ld=document.getElementById('mpce-loading'),cv=document.getElementById('mpce-cards-view');if(lk)lk.style.display='flex';if(ld)ld.style.display='none';if(cv)cv.style.display='none';var b=document.getElementById('mpce-cloud-banner');if(b)b.classList.remove('show');}
function mpceShowLoading(){var lk=document.getElementById('mpce-locked'),ld=document.getElementById('mpce-loading'),cv=document.getElementById('mpce-cards-view');if(lk)lk.style.display='none';if(ld)ld.style.display='block';if(cv)cv.style.display='none';}
function mpceShowCards(){var lk=document.getElementById('mpce-locked'),ld=document.getElementById('mpce-loading'),cv=document.getElementById('mpce-cards-view');if(lk)lk.style.display='none';if(ld)ld.style.display='none';if(cv)cv.style.display='';}
async function mpceBootCloud(){
  if(!authIsLogged()){mpceShowLocked();return;}
  if(!_supabaseReady){mpceShowLoading();return;}
  mpceShowLoading();
  try{var state=await mpceFetchAllFromCloud();_mpceState=state;mpceSaveCache(state);var b=document.getElementById('mpce-cloud-banner');if(b)b.classList.remove('show');mpceRenderGrid();mpceShowCards();}
  catch(e){if(typeof Logger!=='undefined')Logger.error('MPCE','fetch',{err:e.message});var cache=mpceLoadCache();var b=document.getElementById('mpce-cloud-banner');if(b)b.classList.add('show');if(cache){_mpceState=cache;mpceRenderGrid();mpceShowCards();manualToast('Offline: cache local');}else{_mpceState={};mpceRenderGrid();mpceShowCards();}}
}
function mpceBootIfActive(){var pg=document.getElementById('page-manual-pce');if(pg&&pg.classList.contains('active'))mpceBootCloud();else mpceShowLocked();}
function mpceRenderGrid(){
  var host=document.getElementById('mpce-sections-host');if(!host)return;host.innerHTML='';
  var tb=document.getElementById('mpce-admin-toolbar'),ba=document.getElementById('mpce-btn-add-section');
  if(tb)tb.classList.toggle('show',authIsAdmin());if(ba)ba.style.display=authIsAdmin()?'':'none';
  mpceUpdateTrashCount();
  _mpceSections.forEach(function(sec){
    var cards=Object.entries(_mpceState).filter(function(e){return e[1]._sectionId===sec.id;}).sort(function(a,b){return(a[1]._displayOrder||0)-(b[1]._displayOrder||0);});
    var sizeClass=(sec.card_size==='large')?'manual-grid-gxp':'manual-grid-experts';
    var secEl=document.createElement('div');secEl.className='manual-section';secEl.dataset.sectionId=sec.id;
    var actionsHtml='';
    if(authIsAdmin()){
      actionsHtml='<div class="section-actions">'
        +'<button class="sa-btn" onclick="mpcePromptEditSection(\''+sec.id+'\')" title="Editar">✏️</button>'
        +(!sec.is_default?'<button class="sa-btn danger" onclick="mpceDeleteSection(\''+sec.id+'\')" title="Excluir">🗑</button>':'')
        +'</div>';
    }
    var grabHandle=authIsAdmin()?'<span class="section-grab-handle" title="Arraste para reordenar">⋮⋮</span>':'';
    secEl.innerHTML=
      '<div class="manual-section-header">'
        +grabHandle
        +'<div class="manual-section-icon">'+manualEscape(sec.icon||'📄')+'</div>'
        +'<h3 class="manual-section-title">'+manualEscape(sec.title)+'</h3>'
        +'<div class="manual-section-line"></div>'
        +'<span class="manual-section-count">'+cards.length+' '+(cards.length===1?'card':'cards')+'</span>'
        +actionsHtml
      +'</div>'
      +'<div class="'+sizeClass+'" data-section-grid data-section="'+sec.id+'" id="mpce-grid-'+sec.id+'"></div>';
    host.appendChild(secEl);
    var gridEl=secEl.querySelector('[data-section-grid]');
    cards.forEach(function(e){gridEl.appendChild(mpceBuildCardElement(e[0],e[1]));});
    if(authIsAdmin()){
      var addBtn=document.createElement('button');
      addBtn.className='add-card-btn';
      addBtn.innerHTML='<span class="ac-icon">+</span><span>Adicionar card</span>';
      addBtn.onclick=function(){mpcePromptCreateCard(sec.id);};
      gridEl.appendChild(addBtn);
    }
  });
  if(authIsAdmin())setTimeout(mpceInitSortables,50);
}
function mpceBuildCardElement(id,data){
  var card=document.createElement('div');card.className='mcard'+(authIsAdmin()?' draggable':'');card.dataset.cardId=id;
  var cover=data._coverUrl||'';
  var sectionsCount=(data.days||[]).length;
  var meta='';
  if(data._updatedAt){var d=new Date(data._updatedAt);meta='Atualizado em '+String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+' as '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');if(data._updatedByName)meta+=' por '+data._updatedByName;}
  var coverInner=cover
    ?'<img src="'+cover+'" alt="" loading="lazy">'
    :'<div class="mcard-cover-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--green)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
  var coverBtn=authIsAdmin()?'<button class="mcard-cover-upload" data-action="upload-cover" data-id="'+id+'">📷 '+(cover?'Trocar':'Adicionar')+' foto</button>':'';
  var renameBtn=authIsAdmin()?'<button class="mcard-rename-btn" data-action="rename" data-id="'+id+'">✏️ Renomear card</button>':'';
  var linkBtn=authIsAdmin()?'<button class="mcard-rename-btn" data-action="set-link" data-id="'+id+'">🔗 '+(data.externalUrl?'Editar link':'Definir link')+'</button>':'';
  card.innerHTML=
    '<div class="mcard-cover-wrap">'+coverInner+coverBtn+'</div>'
    +'<div class="mcard-body">'
      +'<div class="mcard-tag">'+manualEscape(data.tag||'Manual')+'</div>'
      +'<div class="mcard-title">'+manualEscape(data.title)+'</div>'
      +'<div class="mcard-desc">'+manualEscape(data.desc||'')+'</div>'
      +(meta?'<div class="mcard-meta">'+manualEscape(meta)+'</div>':'')
      +renameBtn+linkBtn
    +'</div>'
    +'<div class="mcard-footer">'
      +(data.externalUrl?'<span class="mcard-count">Abrir manual ↗</span>':'<span class="mcard-count">'+sectionsCount+' '+(sectionsCount===1?'seção':'seções')+'</span>')
      +((data.anexos&&data.anexos.length)?'<span class="mcard-count" style="margin-left:8px;color:var(--green)">📎 '+data.anexos.length+'</span>':'')
      +'<div class="mcard-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>'
    +'</div>';
  var _mpceOpenOrLink=function(e){if(e.target.closest('[data-action]'))return;if(data.externalUrl){window.open(data.externalUrl,'_blank','noopener');return;}mpceOpen(id);};
  card.querySelector('.mcard-body').addEventListener('click',_mpceOpenOrLink);
  card.querySelector('.mcard-footer').addEventListener('click',_mpceOpenOrLink);
  if(authIsAdmin()){card.addEventListener('click',function(e){var a=e.target.closest('[data-action]');if(!a)return;if(a.dataset.action==='upload-cover')mpceUploadCover(a.dataset.id);if(a.dataset.action==='rename')mpceRenameCard(a.dataset.id);if(a.dataset.action==='set-link')mpceSetCardLink(a.dataset.id);});}
  return card;
}
function mpcePromptCreateSection(){
  if(!authIsAdmin()){alert('Apenas administradores podem criar.');return;}
  document.getElementById('sm-section-title').textContent='Nova seção';
  document.getElementById('sm-section-input-title').value='';document.getElementById('sm-section-input-icon').value=''+String.fromCodePoint(0x1F4DA);document.getElementById('sm-section-input-size').value='compact';
  document.getElementById('sm-section-save').textContent='Criar seção';document.getElementById('sm-section-save').dataset.editId='';
  document.getElementById('sm-section-save').onclick=mpceSaveSectionFromModal;manualOpenModal('sm-section');
}
function mpcePromptEditSection(sectionId){
  if(!authIsAdmin())return;var s=_mpceSections.find(function(x){return x.id===sectionId;});if(!s)return;
  document.getElementById('sm-section-title').textContent='Editar seção';
  document.getElementById('sm-section-input-title').value=s.title;document.getElementById('sm-section-input-icon').value=s.icon||''+String.fromCodePoint(0x1F4DA);document.getElementById('sm-section-input-size').value=s.card_size||'compact';
  document.getElementById('sm-section-save').textContent='Salvar';document.getElementById('sm-section-save').dataset.editId=sectionId;
  document.getElementById('sm-section-save').onclick=mpceSaveSectionFromModal;manualOpenModal('sm-section');
}
async function mpceSaveSectionFromModal(){
  var title=document.getElementById('sm-section-input-title').value.trim(),icon=document.getElementById('sm-section-input-icon').value.trim()||''+String.fromCodePoint(0x1F4DA),size=document.getElementById('sm-section-input-size').value,editId=document.getElementById('sm-section-save').dataset.editId;
  if(!title){alert('Informe um título.');return;}
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;
    if(editId){var r=await SB.from('manualpce_sections').update({title:title,icon:icon,card_size:size,updated_by:_currentUser.id,updated_by_name:who}).eq('id',editId).select().single();if(r.error)throw r.error;manualToast('Seção atualizada');}
    else{var maxOrder=_mpceSections.reduce(function(m,s){return Math.max(m,s.display_order||0);},0);var newId=title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').substring(0,40)+'-'+Date.now().toString(36).slice(-6);var r=await SB.from('manualpce_sections').insert({id:newId,title:title,icon:icon,card_size:size,display_order:maxOrder+1,is_default:false,updated_by:_currentUser.id,updated_by_name:who}).select().single();if(r.error)throw r.error;manualToast('Seção criada');}
    manualCloseModal('sm-section');await mpceBootCloud();
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function mpceDeleteSection(sectionId){
  if(!authIsAdmin())return;var s=_mpceSections.find(function(x){return x.id===sectionId;});if(!s)return;
  if(s.is_default){alert('Seção padrão não pode ser excluída.');return;}
  var cards=Object.values(_mpceState).filter(function(c){return c._sectionId===sectionId;});
  if(cards.length>0){alert('Mova ou exclua os '+cards.length+' card(s) antes.');return;}
  if(!confirm('Excluir "'+s.title+'"?'))return;
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;var r=await SB.from('manualpce_sections').update({deleted_at:new Date().toISOString(),updated_by:_currentUser.id,updated_by_name:who}).eq('id',sectionId);if(r.error)throw r.error;manualToast('Seção na lixeira');await mpceBootCloud();}catch(e){alert('Erro: '+(e.message||e));}
}
function mpcePromptCreateCard(sectionId){
  if(!authIsAdmin())return;
  document.getElementById('sm-card-input-id').value='';document.getElementById('sm-card-input-title').value='';document.getElementById('sm-card-input-tag').value='Manual \u00B7 PCE';document.getElementById('sm-card-input-desc').value='';document.getElementById('sm-card-input-section').value=sectionId;
  document.getElementById('sm-card-save').onclick=mpceSaveCardFromModal;manualOpenModal('sm-card');
}
async function mpceSaveCardFromModal(){
  var id=document.getElementById('sm-card-input-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-'),title=document.getElementById('sm-card-input-title').value.trim(),tag=document.getElementById('sm-card-input-tag').value.trim()||'Manual \u00B7 PCE',desc=document.getElementById('sm-card-input-desc').value.trim(),sectionId=document.getElementById('sm-card-input-section').value;
  if(!id||!title){alert('Informe ID e título.');return;}if(id.length<2||id.length>40){alert('ID: 2-40 caracteres.');return;}if(_mpceState[id]){alert('ID já existe.');return;}
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;var defaultDays=[{label:'Geral',blocks:[{icon:''+String.fromCodePoint(0x1F4CC),title:'Conte\u00FAdo',desc:'Edite este card para adicionar o conte\u00FAdo.'}]}];var r=await SB.from('manualpce_cards').insert({id:id,tag:tag,title:title,description:desc,days_json:defaultDays,section_id:sectionId,display_order:99,updated_by:_currentUser.id,updated_by_name:who}).select().single();if(r.error)throw r.error;manualToast('Card criado!');manualCloseModal('sm-card');await mpceBootCloud();}
  catch(e){alert('Erro: '+(e.message||e));}
}
async function mpceDeleteCard(cardId){
  if(!authIsAdmin())return;var data=_mpceState[cardId];if(!data)return;
  if(!confirm('Excluir "'+data.title+'"?'))return;var typed=prompt('Digite EXATAMENTE:\n\n"'+data.title+'"');if(typed===null)return;if(typed.trim()!==data.title){alert('Nome incorreto.');return;}
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;var r=await SB.from('manualpce_cards').update({deleted_at:new Date().toISOString(),updated_by:_currentUser.id,updated_by_name:who}).eq('id',cardId);if(r.error)throw r.error;manualToast('Card na lixeira');mpceClose();await mpceBootCloud();}catch(e){alert('Erro: '+(e.message||e));}
}
async function mpceRenameCard(id){
  if(!authIsAdmin())return;var data=_mpceState[id];var novo=prompt('Novo nome:',data.title);if(novo===null)return;novo=novo.trim();if(!novo||novo===data.title)return;
  try{var row=await mpceUpdateCardCloud(id,{title:novo});data.title=row.title;data._updatedAt=row.updated_at;data._updatedByName=row.updated_by_name;mpceSaveCache(_mpceState);mpceRenderGrid();manualToast('Nome atualizado');}catch(e){alert('Erro: '+(e.message||e));}
}
async function mpceSetCardLink(id){
  if(!authIsAdmin())return;var data=_mpceState[id];
  var novo=prompt('Cole a URL do manual (deixe vazio para remover o link e voltar ao editor interno):',data.externalUrl||'');
  if(novo===null)return;novo=novo.trim();
  try{var row=await mpceUpdateCardCloud(id,{external_url:novo||null});data.externalUrl=row.external_url||'';mpceSaveCache(_mpceState);mpceRenderGrid();manualToast(novo?'Link definido':'Link removido');}catch(e){alert('Erro: '+(e.message||e));}
}
/* ===== Anexos de card (arquivo) — coluna própria manualpce_cards.anexos, gravada
   por caminho separado do editor (lápis) para sobreviver ao ciclo de salvar. ===== */
function mpceFmtSize(n){n=+n||0;if(n>=1048576)return (n/1048576).toFixed(1).replace('.',',')+' MB';if(n>=1024)return Math.round(n/1024)+' KB';return n+' B';}
function mpceAnexoIcon(a){var t=((a.tipo||'')+' '+(a.nome||'')).toLowerCase();if(/pdf/.test(t))return '\uD83D\uDCD5';if(/(sheet|excel|xls|csv)/.test(t))return '\uD83D\uDCCA';if(/(word|\bdoc)/.test(t))return '\uD83D\uDCDD';if(/(zip|rar|7z|compress)/.test(t))return '\uD83D\uDDDC\uFE0F';if(/(png|jpe?g|gif|webp|image)/.test(t))return '\uD83D\uDDBC\uFE0F';if(/(mp4|mov|video)/.test(t))return '\uD83C\uDFAC';return '\uD83D\uDCCE';}
async function mpceSetCardAnexos(id,anexos){var data=_mpceState[id];var row=await mpceUpdateCardCloud(id,{anexos:anexos});data.anexos=Array.isArray(row.anexos)?row.anexos:[];data._updatedAt=row.updated_at;data._updatedByName=row.updated_by_name;mpceSaveCache(_mpceState);}
function mpceAnexoPick(id){
  if(!authIsAdmin())return;
  var inp=document.createElement('input');inp.type='file';inp.style.display='none';
  inp.onchange=async function(){
    var f=inp.files&&inp.files[0];if(!f){inp.remove();return;}
    try{manualToast('Enviando anexo\u2026');var meta=await manualUploadAnexo(f,'card-'+id);var data=_mpceState[id];var arr=(data.anexos||[]).slice();arr.push(meta);await mpceSetCardAnexos(id,arr);mpceRenderAnexos(id);mpceRenderGrid();manualToast('Anexo adicionado');}
    catch(e){alert('Erro ao anexar: '+(e.message||e));}
    inp.remove();
  };
  document.body.appendChild(inp);inp.click();
}
async function mpceAnexoRemove(id,idx){
  if(!authIsAdmin())return;var data=_mpceState[id];var arr=(data.anexos||[]).slice();var a=arr[idx];if(!a)return;
  if(!confirm('Remover o anexo "'+(a.nome||'arquivo')+'"?'))return;
  arr.splice(idx,1);
  try{await mpceSetCardAnexos(id,arr);mpceRenderAnexos(id);mpceRenderGrid();manualToast('Anexo removido');}catch(e){alert('Erro: '+(e.message||e));}
}
function mpceRenderAnexos(id){
  var host=document.getElementById('mpce-modal-anexos');if(!host)return;
  var data=_mpceState[id];if(!data){host.innerHTML='';return;}
  var isAdmin=authIsAdmin();var list=Array.isArray(data.anexos)?data.anexos:[];
  if(!list.length && !isAdmin){host.innerHTML='';return;}
  var rows=list.map(function(a,i){
    return '<a class="mpce-anexo" href="'+encodeURI(a.url||'#')+'" target="_blank" rel="noopener">'
      +'<span class="mpce-anexo-ic">'+mpceAnexoIcon(a)+'</span>'
      +'<span class="mpce-anexo-nm">'+manualEscape(a.nome||'arquivo')+'</span>'
      +'<span class="mpce-anexo-sz">'+(a.tamanho?mpceFmtSize(a.tamanho):'')+'</span>'
      +(isAdmin?'<button class="mpce-anexo-del" title="Remover" onclick="event.preventDefault();event.stopPropagation();mpceAnexoRemove(\''+id+'\','+i+')">\u00D7</button>':'')
      +'</a>';
  }).join('');
  host.innerHTML='<div class="mpce-anexos-h">\uD83D\uDCCE Anexos'+(list.length?' ('+list.length+')':'')+'</div>'
    +(list.length?'<div class="mpce-anexos-list">'+rows+'</div>':'<div class="mpce-anexos-empty">Nenhum anexo neste card.</div>')
    +(isAdmin?'<button type="button" class="mpce-anexo-add" onclick="mpceAnexoPick(\''+id+'\')">\uFF0B Anexar arquivo (at\u00E9 5 MB)</button>':'');
}
var _mpceSortables=[];
function mpceInitSortables(){
  _mpceSortables.forEach(function(s){try{s.destroy();}catch(e){}});_mpceSortables=[];
  if(!authIsAdmin()||typeof Sortable==='undefined')return;
  // Cards — group explícito pull+put habilita arrasto entre seções
  document.querySelectorAll('#mpce-sections-host [data-section-grid]').forEach(function(grid){
    _mpceSortables.push(Sortable.create(grid,{
      group:{name:'mpcecards',pull:true,put:true},
      animation:150,sort:true,
      ghostClass:'sortable-ghost',chosenClass:'sortable-chosen',
      filter:'.add-card-btn',
      onMove:function(evt){return evt.related?!evt.related.classList.contains('add-card-btn'):true;},
      onEnd:function(evt){if(evt.from===evt.to&&evt.oldIndex===evt.newIndex)return;mpceOnCardDrop(evt);}
    }));
  });
  // Seções — grupo isolado, só via grab handle
  var host=document.getElementById('mpce-sections-host');
  if(host){_mpceSortables.push(Sortable.create(host,{
    group:{name:'mpcesections',pull:false,put:false},
    animation:150,handle:'.section-grab-handle',ghostClass:'sortable-ghost',
    onEnd:function(evt){if(evt.oldIndex!==evt.newIndex)mpceOnSectionDrop(evt);}
  }));}
}
async function mpceOnCardDrop(evt){
  var cardId=evt.item.dataset.cardId,newSec=evt.to.dataset.section;if(!cardId||!newSec)return;
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;await SB.from('manualpce_cards').update({section_id:newSec,display_order:evt.newIndex,updated_by:_currentUser.id,updated_by_name:who}).eq('id',cardId);var all=Array.from(evt.to.querySelectorAll('[data-card-id]'));await Promise.all(all.map(function(el,idx){return SB.from('manualpce_cards').update({display_order:idx}).eq('id',el.dataset.cardId);}));manualToast('Reordenado');if(_mpceState[cardId])_mpceState[cardId]._sectionId=newSec;}
  catch(e){alert('Erro: '+(e.message||e));await mpceBootCloud();}
}
async function mpceOnSectionDrop(evt){
  var host=document.getElementById('mpce-sections-host'),els=Array.from(host.querySelectorAll('[data-section-id]'));
  try{var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;await Promise.all(els.map(function(el,idx){return SB.from('manualpce_sections').update({display_order:idx+1,updated_by:_currentUser.id,updated_by_name:who}).eq('id',el.dataset.sectionId);}));manualToast('Seções reordenadas');}
  catch(e){alert('Erro: '+(e.message||e));await mpceBootCloud();}
}
async function mpceOpenTrashModal(){
  if(!authIsAdmin())return;var listEl=document.getElementById('sm-trash-list');listEl.innerHTML='<div class="sm-list-empty">Carregando...</div>';manualOpenModal('sm-trash');
  try{var [cR,sR]=await Promise.all([SB.from('manualpce_cards').select('id,title,tag,deleted_at,updated_by_name').not('deleted_at','is',null).order('deleted_at',{ascending:false}),SB.from('manualpce_sections').select('id,title,icon,deleted_at,updated_by_name').not('deleted_at','is',null).order('deleted_at',{ascending:false})]);
    var items=[];(cR.data||[]).forEach(function(c){items.push({kind:'card',id:c.id,title:c.title,sub:'Card por '+(c.updated_by_name||'?')});});(sR.data||[]).forEach(function(s){items.push({kind:'section',id:s.id,title:s.title,sub:'Seção por '+(s.updated_by_name||'?')});});
    if(!items.length){listEl.innerHTML='<div class="sm-list-empty">Lixeira vazia '+String.fromCodePoint(0x1F331)+'</div>';return;}
    listEl.innerHTML=items.map(function(it){return '<div class="sm-list-item"><div class="sli-info"><div class="sli-title">'+manualEscape(it.title)+'</div><div class="sli-sub">'+manualEscape(it.sub)+'</div></div><div class="sli-actions"><button class="sli-btn restore" onclick="mpceRestoreItem(\''+it.kind+'\',\''+it.id+'\')">Restaurar</button></div></div>';}).join('');
  }catch(e){listEl.innerHTML='<div class="sm-list-empty">Erro: '+e.message+'</div>';}
}
async function mpceRestoreItem(kind,id){
  if(!authIsAdmin())return;
  try{var table=kind==='card'?'manualpce_cards':'manualpce_sections';var who=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;var r=await SB.from(table).update({deleted_at:null,updated_by:_currentUser.id,updated_by_name:who}).eq('id',id);if(r.error)throw r.error;manualToast('Restaurado');manualCloseModal('sm-trash');await mpceBootCloud();}
  catch(e){alert('Erro: '+(e.message||e));}
}
async function mpceUpdateTrashCount(){
  if(!authIsAdmin()||!_supabaseReady)return;
  try{var [c,s]=await Promise.all([SB.from('manualpce_cards').select('id',{count:'exact',head:true}).not('deleted_at','is',null),SB.from('manualpce_sections').select('id',{count:'exact',head:true}).not('deleted_at','is',null)]);var el=document.getElementById('mpce-trash-count-inline');if(el)el.textContent='('+(c.count||0)+(s.count||0)+')';}catch(e){}
}
async function mpceUploadCover(id){
  if(!authIsAdmin())return;_mpceUploadTarget=id;var inp=document.getElementById('mpce-img-input');
  inp.onchange=async function(){var file=inp.files[0];if(!file){inp.value='';return;}if(file.size>8*1024*1024){alert('Max 8MB.');inp.value='';_mpceUploadTarget=null;return;}
    var targetId=_mpceUploadTarget;manualToast('Comprimindo...');
    try{var dataUrl=await manualCompressImage(file,800,0.78);var fileUp=dataURLtoFile(dataUrl,'cover.webp');manualToast('Enviando...');var publicUrl=await manualUploadFile(fileUp,'covers/pce-'+targetId);await mpceUpdateCardCloud(targetId,{cover_url:publicUrl});_mpceState[targetId]._coverUrl=publicUrl;_mpceState[targetId]._updatedAt=new Date().toISOString();_mpceState[targetId]._updatedByName=(_currentProfile&&_currentProfile.full_name)||_currentUser.email;mpceSaveCache(_mpceState);mpceRenderGrid();if(_mpceCurrentCard===targetId)mpceUpdateModalHero(targetId);manualToast('Foto atualizada');}
    catch(e){alert('Erro: '+(e.message||e));}
    _mpceUploadTarget=null;inp.value='';
  };inp.click();
}
function mpceUploadModal(){if(_mpceCurrentCard)mpceUploadCover(_mpceCurrentCard);}
function mpceUpdateModalHero(id){var hero=document.getElementById('mpce-modal-hero'),ph=document.getElementById('mpce-modal-hero-placeholder');if(!hero||!ph)return;var old=hero.querySelector('img.modal-hero-img');if(old)old.remove();var cover=(_mpceState[id]&&_mpceState[id]._coverUrl)||'';if(cover){var img=document.createElement('img');img.src=cover;img.className='modal-hero-img';ph.style.display='none';hero.insertBefore(img,hero.firstChild);}else ph.style.display='flex';}
function mpceOpen(id){_mpceCurrentCard=id;_mpceEditing=false;_mpceTab='conteudo';mpceRenderModal();document.getElementById('mpce-modal-overlay').classList.add('open');document.body.style.overflow='hidden';}
function mpceClose(e){if(e&&e.target&&e.target.id!=='mpce-modal-overlay'){if(e.target.tagName)return;}if(_mpceEditing){if(!confirm('Sair sem salvar?'))return;}document.getElementById('mpce-modal-overlay').classList.remove('open');document.getElementById('mpce-modal').classList.remove('editing-mode');document.body.style.overflow='';_mpceCurrentCard=null;_mpceEditing=false;}
function mpceRenderModal(){
  var id=_mpceCurrentCard;if(!id)return;var data=_mpceState[id];
  mpceUpdateModalHero(id);
  document.getElementById('mpce-modal-tag').textContent=data.tag||'Manual';
  document.getElementById('mpce-modal-title').textContent=data.title;
  mpceSyncTabBar();
  mpceRenderContent(data);
  var modal=document.getElementById('mpce-modal');
  modal.classList.toggle('editing-mode',_mpceEditing);
  var isAdmin=authIsAdmin();
  document.getElementById('mpce-btn-edit').style.display=(isAdmin&&!_mpceEditing)?'':'none';
  document.getElementById('mpce-btn-save').style.display=(isAdmin&&_mpceEditing)?'':'none';
  document.getElementById('mpce-btn-cancel').style.display=(isAdmin&&_mpceEditing)?'':'none';
  var btnD=document.getElementById('mpce-btn-delete');if(btnD)btnD.style.display=(isAdmin&&!_mpceEditing)?'':'none';
  var btnUp=document.getElementById('mpce-modal-upload-btn');if(btnUp)btnUp.style.display=isAdmin?'':'none';
  mpceRenderAnexos(id);
  mpceApplyEditableState();
}
function mpceRenderContent(data){
  var root=document.getElementById('mpce-modal-content');root.innerHTML='';
  if(window.__fbMaybeRender&&window.__fbMaybeRender(data,root))return;
  var tree=mpceTree(data);
  if(_mpceTab==='acao'){
    var _tt=(data.title||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    if(_tt.indexOf('credenciamento')>=0&&typeof window.baixarTemplateCredenciamento==='function'){
      var bar=document.createElement('div');bar.className='mpce-tpl-bar';
      bar.innerHTML='<div class="mpce-tpl-info"><strong>Planilha-template de Credenciamento</strong><span>Modelo padrão para o time de TI — colunas Nome, CPF, E-mail, Celular e Empresa.</span></div><button type="button" class="mpce-tpl-btn" onclick="baixarTemplateCredenciamento()">\ud83d\udce5 Baixar planilha (.xlsx)</button>';
      root.appendChild(bar);
    }
  }
  if(_mpceTab==='acao'&&(!tree||!tree.length)&&!_mpceEditing){
    var emp=document.createElement('div');emp.className='mpce-acao-empty';
    emp.innerHTML='Nenhuma ação de CS cadastrada para este capítulo ainda.'+(authIsAdmin()?'<br>Clique em <strong>Editar conteúdo</strong> e depois em <strong>+ Adicionar nova seção</strong> para começar.':'');
    root.appendChild(emp);
    return;
  }
  var _guide=(!_mpceEditing&&tree&&tree.length>=2);
  var _nav=null,_host=root;
  if(_guide){
    var _wrap=document.createElement('div');_wrap.className='mpce-guide';
    _nav=document.createElement('div');_nav.className='mpce-guide-nav';
    var _nh=document.createElement('div');_nh.className='mpce-guide-nav-h';_nh.textContent='GUIAS NO DOCUMENTO';_nav.appendChild(_nh);
    var _main=document.createElement('div');_main.className='mpce-guide-main';
    _wrap.appendChild(_nav);_wrap.appendChild(_main);root.appendChild(_wrap);_host=_main;
  }
  (tree||[]).forEach(function(day,di){
    var dayEl=document.createElement('div');dayEl.className='ms-day'+(_guide?' mpce-pane':'');dayEl.dataset.di=di;
    if(_guide){dayEl.dataset.pane=di;dayEl.style.display=(di===0?'':'none');}
    dayEl.innerHTML='<span class="ms-day-badge">'+manualEscape(day.label||'')+'</span>'
      +'<div class="ms-day-controls"><button class="ms-ctrl-btn danger" data-action="del-day" data-di="'+di+'">🗑 Remover seção</button></div>';
    (day.blocks||[]).forEach(function(block,bi){dayEl.appendChild(mpceRenderBlock(block,di,bi));});
    var addBtn=document.createElement('button');addBtn.className='ms-add-block';addBtn.textContent='+ Adicionar bloco';addBtn.dataset.action='add-block';addBtn.dataset.di=di;
    dayEl.appendChild(addBtn);_host.appendChild(dayEl);
    if(_guide){
      var it=document.createElement('div');it.className='mpce-guide-item'+(di===0?' active':'');it.dataset.pane=di;
      it.innerHTML='<span class="mpce-guide-num">'+(di+1)+'</span><span class="mpce-guide-tx">'+manualEscape(day.label||('Se\u00e7\u00e3o '+(di+1)))+'</span>';
      it.onclick=function(){mpceGuideShow(this);};
      _nav.appendChild(it);
    }
  });
}
function mpceGuideShow(el){
  var wrap=el.closest('.mpce-guide');if(!wrap)return;
  var idx=el.dataset.pane;
  [].forEach.call(wrap.querySelectorAll('.mpce-guide-item'),function(n){n.classList.toggle('active',n.dataset.pane===idx);});
  [].forEach.call(wrap.querySelectorAll('.ms-day'),function(p){p.style.display=(p.dataset.pane===idx?'':'none');});
  var m=wrap.querySelector('.mpce-guide-main');if(m)m.scrollTop=0;
}
function mpceRenderBlock(block,di,bi){
  var el=document.createElement('div');el.className='ms-block';el.dataset.di=di;el.dataset.bi=bi;
  var html='<div class="ms-section"><div class="ms-icon">'+manualEscape(block.icon||'📌')+'</div><div class="ms-body"><div class="ms-title">'+manualEscape(block.title||'')+'</div>';
  if(block.desc!==undefined)html+='<p class="ms-desc">'+(block.desc||'')+'</p>';
  if(Array.isArray(block.items)&&block.items.length){
    html+='<div class="ms-items">';
    block.items.forEach(function(it,ii){html+='<div class="ms-item" data-ii="'+ii+'"><span class="ms-dot"></span><div class="ms-item-text">'+it+'</div><button class="ms-item-del" data-action="del-item" data-ii="'+ii+'">×</button></div>';});
    html+='</div><button class="ms-item-add" data-action="add-item">+ Adicionar item</button>';
  }
  if(block.obs)html+='<div class="ms-obs"><div>'+(block.obs||'')+'</div></div>';
  if(block.table&&block.table.head&&block.table.rows){html+='<div class="ms-tbl-wrap"><table class="ms-table"><thead><tr>';block.table.head.forEach(function(h){html+='<th>'+manualEscape(h)+'</th>';});html+='</tr></thead><tbody>';block.table.rows.forEach(function(r){html+='<tr>';(r||[]).forEach(function(c){html+='<td>'+manualEscape(c)+'</td>';});html+='</tr>';});html+='</tbody></table></div>';}
  if(Array.isArray(block.images)&&block.images.length){html+='<div class="ms-img-row">';block.images.forEach(function(src,ii){html+='<div class="ms-img-col" data-ii="'+ii+'"><img src="'+src+'" alt="" loading="lazy" decoding="async"><button class="ms-img-del" data-action="del-image" data-ii="'+ii+'" title="Remover foto">×</button></div>';});html+='</div>';}
  if(Array.isArray(block.videos)&&block.videos.length){html+='<div class="ms-vid-col">';block.videos.forEach(function(vsrc,vi){html+='<div class="ms-vid-item" data-vi="'+vi+'">'+mpceVideoEmbed(vsrc)+'<button class="ms-vid-del" data-action="del-video" data-vi="'+vi+'" title="Remover vídeo">×</button></div>';});html+='</div>';}
  html+='<button class="ms-img-add" data-action="add-photo">📷 Adicionar foto neste bloco</button>';
  html+='<button class="ms-img-add ms-vid-add" data-action="add-video">🎬 Adicionar vídeo (link)</button>';
  html+='</div></div>';
  html+='<div class="ms-block-controls"><button class="ms-ctrl-btn" data-action="add-items">+ Lista de itens</button><button class="ms-ctrl-btn" data-action="add-obs">+ Observação</button><button class="ms-ctrl-btn danger" data-action="del-block">🗑 Remover bloco</button></div>';
  el.innerHTML=html;return el;
}
function mpceApplyEditableState(){
  var modal=document.getElementById('mpce-modal');if(!modal)return;
  modal.classList.toggle('editing-mode',_mpceEditing);
  modal.querySelectorAll('.ms-block').forEach(function(b){b.classList.toggle('editing',_mpceEditing);});
  var sels=['.mpce-modal-tag-edit','.mpce-modal-title-edit','.ms-day-badge','.ms-icon','.ms-title','.ms-desc','.ms-item-text'];
  // Also handle manual-modal-tag and manual-modal-title via id
  ['mpce-modal-tag','mpce-modal-title'].forEach(function(id2){
    var el=document.getElementById(id2);if(!el)return;
    if(_mpceEditing){el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','false');}
    else{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');}
  });
  ['ms-day-badge','ms-icon','ms-title','ms-desc','ms-item-text'].forEach(function(cls){
    modal.querySelectorAll('.'+cls).forEach(function(el){
      if(_mpceEditing){el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','false');}
      else{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');}
    });
  });
  modal.querySelectorAll('.ms-obs > div').forEach(function(el){
    if(_mpceEditing){el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','false');}
    else{el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');}
  });
}
function mpceEditMode(){
  if(!authIsAdmin()){alert('Apenas administradores podem editar.');return;}
  _mpceEditing=true;try{window._mpceEditSnap=JSON.stringify(mpceTree(_mpceState[_mpceCurrentCard])||[]);}catch(e){window._mpceEditSnap='';}mpceRenderModal();
}
function mpceAddDay(){
  if(!_mpceCurrentCard)return;
  var label=prompt('Nome da nova seção (ex: "Dia 4", "Encerramento"):','Nova seção');if(!label)return;
  mpceTree(_mpceState[_mpceCurrentCard]).push({label:label.trim(),blocks:[{icon:'📌',title:'Novo bloco',desc:''}]});
  mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();
}
async function mpceSaveEdits(){
  if(!authIsLogged()){alert('Faça login primeiro.');return;}
  var id=_mpceCurrentCard,data=_mpceState[id];
  data.tag=document.getElementById('mpce-modal-tag').textContent.trim()||'Manual';
  data.title=document.getElementById('mpce-modal-title').textContent.trim()||data.title;
  mpceCollectContent(data);
  try{var _snap=window._mpceEditSnap||'';var _now=JSON.stringify(data.days||[]);if(_snap&&_snap.length>200&&_now.length<_snap.length*0.4){if(!confirm('ATENÇÃO: o conteúdo ficou muito menor que antes. Isso pode indicar perda de conteúdo. Deseja salvar mesmo assim?')){var b0=document.getElementById('mpce-btn-save');if(b0){b0.disabled=false;b0.innerHTML='<span style="font-size:14px">\uD83D\uDCBE</span> Salvar conteúdo';}return;}}}catch(e){}
  var btn=document.getElementById('mpce-btn-save');if(btn){btn.disabled=true;btn.innerHTML='<span style="font-size:14px">⏳</span> Salvando...';}
  try{
    if(window.__fbCaptureForSave)window.__fbCaptureForSave(id,data);
    var row=await mpceUpdateCardCloud(id,{tag:data.tag,title:data.title,description:data.desc||'',days_json:data.days||[],acao_cs_json:data.acaoCS||[]});
    data._updatedAt=row.updated_at;data._updatedByName=row.updated_by_name;
    mpceSaveCache(_mpceState);_mpceEditing=false;mpceRenderModal();mpceRenderGrid();manualToast('Conteúdo salvo!');
  }catch(e){alert('Erro ao salvar: '+(e.message||e));}
  finally{if(btn){btn.disabled=false;btn.innerHTML='<span style="font-size:14px">💾</span> Salvar conteúdo';}}
}
function mpceSyncTabBar(){
  var bar=document.getElementById('mpce-tabs');if(!bar)return;
  bar.querySelectorAll('.mpce-tab').forEach(function(b){b.classList.toggle('on',b.dataset.tab===_mpceTab);});
}
function mpceSwitchTab(tab){
  if(tab===_mpceTab)return;
  if(_mpceEditing&&_mpceCurrentCard)mpceCollectContent(_mpceState[_mpceCurrentCard]);
  _mpceTab=tab;mpceSyncTabBar();
  if(_mpceCurrentCard){mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();}
}
function mpceCollectContent(data){
  var tree=mpceTree(data);
  document.querySelectorAll('#mpce-modal-content > .ms-day').forEach(function(dayEl){
    var di=+dayEl.dataset.di;var day=tree[di];if(!day)return;
    var badgeEl=dayEl.querySelector(':scope > .ms-day-badge');if(badgeEl)day.label=badgeEl.textContent.trim();
    dayEl.querySelectorAll(':scope > .ms-block').forEach(function(blockEl){
      var bi=+blockEl.dataset.bi;var b=day.blocks[bi];if(!b)return;
      var iconEl=blockEl.querySelector('.ms-icon'),titleEl=blockEl.querySelector('.ms-title'),descEl=blockEl.querySelector('.ms-desc'),obsEl=blockEl.querySelector('.ms-obs > div');
      if(iconEl)b.icon=iconEl.textContent.trim();if(titleEl)b.title=titleEl.textContent.trim();
      if(descEl)b.desc=manualCleanRich(descEl.innerHTML);if(obsEl)b.obs=manualCleanRich(obsEl.innerHTML);
      var itemEls=blockEl.querySelectorAll('.ms-items .ms-item');
      if(itemEls.length){b.items=Array.prototype.slice.call(itemEls).map(function(ie){var t=ie.querySelector('.ms-item-text');return t?manualCleanRich(t.innerHTML):'';}).filter(Boolean);}
    });
  });
}
function mpceAddPhotoToBlock(di,bi){
  if(!authIsAdmin()){alert('Apenas administradores podem adicionar fotos.');return;}
  var inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.style.display='none';document.body.appendChild(inp);
  inp.addEventListener('change',async function(){
    var file=inp.files&&inp.files[0];if(!file){document.body.removeChild(inp);return;}
    if(file.size>15*1024*1024){alert('Imagem muito grande (>15MB). Escolha uma menor.');document.body.removeChild(inp);return;}
    manualToast('Comprimindo foto...');
    try{
      var dataUrl=await manualCompressImage(file,800,0.78);
      var fileUp=dataURLtoFile(dataUrl,'block.webp');
      manualToast('Enviando para a nuvem...');
      var prefix='blocks/pce-'+_mpceCurrentCard+'-'+_mpceTab+'-'+di+'-'+bi;
      var publicUrl=await manualUploadFile(fileUp,prefix);
      var b=mpceTree(_mpceState[_mpceCurrentCard])[di].blocks[bi];
      if(!Array.isArray(b.images))b.images=[];
      b.images.push(publicUrl);
      mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();
      manualToast('Foto adicionada — clique em Salvar para confirmar');
    }catch(err){alert('Erro: '+(err.message||err));}
    document.body.removeChild(inp);
  });
  inp.click();
}
function mpceDeletePhotoFromBlock(di,bi,ii){
  if(!confirm('Remover esta foto?'))return;
  var b=mpceTree(_mpceState[_mpceCurrentCard])[di].blocks[bi];
  if(Array.isArray(b.images))b.images.splice(ii,1);
  mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();
}
function mpceVideoInfo(url){
  url=String(url||'').trim(); var m,src='',type='',thumb='';
  if(m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)){src='https://www.youtube.com/embed/'+m[1];type='iframe';thumb='https://img.youtube.com/vi/'+m[1]+'/hqdefault.jpg';}
  else if(m=url.match(/vimeo\.com\/(?:video\/)?(\d+)/)){src='https://player.vimeo.com/video/'+m[1];type='iframe';}
  else if(m=url.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/)){src='https://www.loom.com/embed/'+m[1];type='iframe';}
  else if(m=url.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/)){src='https://drive.google.com/file/d/'+m[1]+'/preview';type='iframe';}
  else if(/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)){src=url;type='video';}
  return {src:src,type:type,thumb:thumb,orig:url};
}
function mpceVideoEmbed(url){
  var i=mpceVideoInfo(url);
  if(!i.type) return '<a class="ms-vid-link" href="'+i.orig+'" target="_blank" rel="noopener">\u25B6 Abrir v\u00eddeo</a>';
  var bg=i.thumb?(' style="background-image:url(\''+i.thumb+'\')"'):'';
  return '<div class="ms-vid-frame ms-vid-trigger"'+bg+' data-vurl="'+encodeURI(i.orig)+'" onclick="mpceOpenVideo(this.getAttribute(\'data-vurl\'))" title="Assistir"><div class="ms-vid-play">\u25B6</div></div>';
}
function mpceOpenVideo(url){
  var i=mpceVideoInfo(url); if(!i.type){window.open(url,'_blank');return;}
  var inner;
  if(i.type==='iframe'){var sep=i.src.indexOf('?')>=0?'&':'?';inner='<iframe src="'+i.src+sep+'autoplay=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';}
  else{inner='<video src="'+i.src+'" controls autoplay playsinline></video>';}
  var ov=document.createElement('div');ov.className='ms-vlightbox';
  ov.innerHTML='<div class="ms-vlb-inner"><button class="ms-vlb-close" aria-label="Fechar">\u00d7</button><div class="ms-vlb-frame">'+inner+'</div></div>';
  function close(){document.removeEventListener('keydown',onkey);ov.remove();}
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.classList.contains('ms-vlb-close'))close();});
  function onkey(e){if(e.key==='Escape')close();}
  document.addEventListener('keydown',onkey);
  document.body.appendChild(ov);
}

function mpceAddVideoToBlock(di,bi){
  if(!authIsAdmin()){alert('Apenas administradores podem adicionar vídeos.');return;}
  var url=prompt('Cole o link do vídeo (YouTube, Vimeo, Loom, Google Drive ou .mp4):','');
  if(url===null)return; url=url.trim(); if(!url)return;
  if(!/^https?:\/\//i.test(url)){alert('Link inválido. Cole a URL completa (começando com http).');return;}
  var b=mpceTree(_mpceState[_mpceCurrentCard])[di].blocks[bi];
  if(!Array.isArray(b.videos))b.videos=[];
  b.videos.push(url);
  mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();
  manualToast('Vídeo adicionado — clique em Salvar para confirmar');
}
function mpceDeleteVideoFromBlock(di,bi,ii){
  if(!confirm('Remover este vídeo?'))return;
  var b=mpceTree(_mpceState[_mpceCurrentCard])[di].blocks[bi];
  if(Array.isArray(b.videos))b.videos.splice(ii,1);
  mpceRenderContent(_mpceState[_mpceCurrentCard]);mpceApplyEditableState();
}

function mpceCancelEdits(){
  if(!confirm('Descartar alterações?'))return;
  _mpceEditing=false;mpceRenderModal();
}
