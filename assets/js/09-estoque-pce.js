/* PCE 2.0 · 14-estoque-pce
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
/* ============================================================
   ESTOQUE PCE — inventario de materiais (nome, qtd, foto)
   Persistencia: Supabase tabela "estoque_pce" + cache local.
   Foto: data URL (base64) redimensionada, salva na coluna "foto".
   ============================================================ */
(function(){
  var ESTOQUE_CACHE_KEY = 'pce_estoque_v1_cache';
  var ESTOQUE_TABLE = 'estoque_pce';
  var ESTOQUE_IMG_MAX = 1000;   // px (maior lado)
  var ESTOQUE_IMG_Q   = 0.8;    // qualidade JPEG

  // Lista inicial (semente) — usada so se a nuvem E o cache estiverem vazios
  var ESTOQUE_SEED = [
    {nome:'Caneca',               logo:'ANTIGO', quantidade:169},
    {nome:'Mochila',              logo:'NOVO',   quantidade:8},
    {nome:'Molesquine',           logo:'NOVO',   quantidade:378},
    {nome:'Apostila',             logo:'ANTIGO', quantidade:2},
    {nome:'Caneta',               logo:'ANTIGO', quantidade:31},
    {nome:'Livrao',               logo:'ANTIGO', quantidade:34},
    {nome:'Carta de boas vindas', logo:'',       quantidade:100},
    {nome:'Primas EUA',           logo:'NOVO',   quantidade:63},
    {nome:'Cracha EUA',           logo:'NOVO',   quantidade:70},
    {nome:'Caderno folha lisa',   logo:'ANTIGO', quantidade:118}
  ];

  var _estoque = [];
  var _estoqueDirty = false;
  var _estoqueLoaded = false;
  var _fotoTargetId = null;

  function _esc(s){ return (typeof manualEscape==='function') ? manualEscape(s) : String(s==null?'':s); }
  function _toast(m){ if(typeof manualToast==='function') manualToast(m); }

  function _slug(s){
    return String(s||'item').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,40) || 'item';
  }
  function _newId(nome){ return _slug(nome)+'-'+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36); }

  function _seed(){
    return ESTOQUE_SEED.map(function(it,i){
      return {id:(_slug(it.nome)||('item-'+i)), nome:it.nome, logo:it.logo||'', quantidade:it.quantidade||0, foto:null, ordem:i};
    });
  }

  function _saveCache(){ try{ localStorage.setItem(ESTOQUE_CACHE_KEY, JSON.stringify(_estoque)); }catch(e){} }
  function _loadCache(){ try{ var r=localStorage.getItem(ESTOQUE_CACHE_KEY); return r?JSON.parse(r):null; }catch(e){ return null; } }

  function _markDirty(d){
    _estoqueDirty = (d!==false);
    var tag=document.getElementById('estoque-saved-tag');
    if(tag){ tag.textContent=_estoqueDirty?'Alteracoes nao salvas':'Sincronizado'; tag.classList.toggle('dirty',_estoqueDirty); }
  }

  function _sbReady(){ return (typeof _supabaseReady!=='undefined') && _supabaseReady && (typeof SB!=='undefined') && SB; }

  function _ensureSb(){
    if(_sbReady()) return Promise.resolve(true);
    if(typeof window.__bootstrapManual==='function'){
      return window.__bootstrapManual().then(function(){ return _sbReady(); }).catch(function(){ return false; });
    }
    if(typeof supabaseInit==='function'){ try{ supabaseInit(); }catch(e){} }
    return Promise.resolve(_sbReady());
  }

  function _rowFor(it){
    return {id:it.id, nome:it.nome||'', logo:it.logo||'', quantidade:Number(it.quantidade)||0, foto:it.foto||null, ordem:it.ordem||0, updated_at:new Date().toISOString()};
  }

  function _fetchCloud(){
    if(!_sbReady()) return Promise.reject(new Error('Supabase indisponivel'));
    return SB.from(ESTOQUE_TABLE).select('id,nome,logo,quantidade,foto,ordem,updated_at').order('ordem',{ascending:true})
      .then(function(r){ if(r.error) throw r.error; return r.data||[]; });
  }
  function _upsertAll(){
    if(!_sbReady()) return Promise.reject(new Error('Sem conexao com a nuvem'));
    _estoque.forEach(function(it,i){ it.ordem=i; });
    return SB.from(ESTOQUE_TABLE).upsert(_estoque.map(_rowFor),{onConflict:'id'})
      .then(function(r){ if(r.error) throw r.error; return true; });
  }
  function _upsertOne(it){
    if(!_sbReady()) return Promise.reject(new Error('Sem conexao'));
    return SB.from(ESTOQUE_TABLE).upsert([_rowFor(it)],{onConflict:'id'})
      .then(function(r){ if(r.error) throw r.error; return true; });
  }
  function _deleteCloud(id){
    if(!_sbReady()) return Promise.resolve();
    return SB.from(ESTOQUE_TABLE).delete().eq('id',id).then(function(){}).catch(function(){});
  }

  function estoqueRender(){
    var tb=document.getElementById('estoque-tbody'); if(!tb) return;
    if(!_estoque.length){
      tb.innerHTML='<tr><td colspan="6"><div class="estoque-empty">Nenhum item ainda. Clique em \u201CAdicionar item\u201D para comecar.</div></td></tr>';
    } else {
      tb.innerHTML=_estoque.map(function(it,i){
        var foto = it.foto
          ? '<div class="estoque-foto-wrap"><img class="estoque-thumb" src="'+_esc(it.foto)+'" onclick="estoqueViewFoto(\''+it.id+'\')" alt="foto"><span class="estoque-foto-replace" onclick="estoquePickFoto(\''+it.id+'\')">trocar</span></div>'
          : '<button class="estoque-foto-btn" onclick="estoquePickFoto(\''+it.id+'\')"><span style="font-size:13px">\uD83D\uDCF7</span> Adicionar</button>';
        return '<tr class="estoque-row" data-id="'+it.id+'">'
          + '<td class="estoque-idx hide-sm">'+(i+1)+'</td>'
          + '<td><input class="estoque-nome-inp" value="'+_esc(it.nome)+'" oninput="estoqueEdit(\''+it.id+'\',\'nome\',this.value)" placeholder="Nome do item"></td>'
          + '<td><select class="estoque-logo-sel" onchange="estoqueEdit(\''+it.id+'\',\'logo\',this.value)">'
            + '<option value=""'+(it.logo===''?' selected':'')+'>\u2014 Sem logo</option>'
            + '<option value="ANTIGO"'+(it.logo==='ANTIGO'?' selected':'')+'>Logo Atual</option>'
            + '<option value="NOVO"'+(it.logo==='NOVO'?' selected':'')+'>Logo Novo</option>'
          + '</select></td>'
          + '<td class="c"><input class="estoque-qtd-inp" type="number" min="0" value="'+(Number(it.quantidade)||0)+'" oninput="estoqueEdit(\''+it.id+'\',\'quantidade\',this.value)"></td>'
          + '<td class="estoque-foto-cell">'+foto+'</td>'
          + '<td class="c"><button class="estoque-del" title="Remover item" onclick="estoqueDelItem(\''+it.id+'\')">\u2715</button></td>'
          + '</tr>';
      }).join('');
    }
    _updateStats();
  }

  function _updateStats(){
    var itens=_estoque.length;
    var novo=_estoque.filter(function(it){ return it.logo==='NOVO'; }).length;
    var atual=_estoque.filter(function(it){ return it.logo==='ANTIGO'; }).length;
    var fot=_estoque.filter(function(it){ return !!it.foto; }).length;
    function set(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; }
    set('estoque-stat-itens',itens);
    set('estoque-stat-novo',novo);
    set('estoque-stat-atual',atual);
    set('estoque-stat-fotos',fot+'/'+itens);
    var badge=document.getElementById('badge-estoque'); if(badge) badge.textContent=itens;
  }

  window.estoqueEdit=function(id,field,val){
    var it=_estoque.find(function(x){ return x.id===id; }); if(!it) return;
    if(field==='quantidade'){ val=Math.max(0,Math.floor(Number(val)||0)); }
    it[field]=val; _saveCache(); _markDirty(true);
    if(field==='quantidade'||field==='logo') _updateStats();
  };

  window.estoqueAddItem=function(){
    var it={id:_newId('item'), nome:'', logo:'', quantidade:0, foto:null, ordem:_estoque.length};
    _estoque.push(it); _saveCache(); _markDirty(true); estoqueRender();
    setTimeout(function(){
      var inp=document.querySelector('.estoque-row[data-id="'+it.id+'"] .estoque-nome-inp');
      if(inp) inp.focus();
    },30);
  };

  window.estoqueDelItem=function(id){
    var it=_estoque.find(function(x){ return x.id===id; });
    var nome=(it&&it.nome)?it.nome:'este item';
    if(!confirm('Remover "'+nome+'" do estoque?')) return;
    _estoque=_estoque.filter(function(x){ return x.id!==id; });
    _saveCache(); estoqueRender(); _deleteCloud(id); _toast('Item removido');
  };

  window.estoquePickFoto=function(id){
    _fotoTargetId=id;
    var inp=document.getElementById('estoque-foto-input');
    if(inp){ inp.value=''; inp.click(); }
  };

  function _resizeImage(file){
    return new Promise(function(resolve,reject){
      var reader=new FileReader();
      reader.onload=function(){
        var img=new Image();
        img.onload=function(){
          var w=img.width,h=img.height,max=ESTOQUE_IMG_MAX;
          if(w>max||h>max){ if(w>=h){ h=Math.round(h*max/w); w=max; } else { w=Math.round(w*max/h); h=max; } }
          var cv=document.createElement('canvas'); cv.width=w; cv.height=h;
          var cx=cv.getContext('2d'); cx.drawImage(img,0,0,w,h);
          try{ resolve(cv.toDataURL('image/jpeg',ESTOQUE_IMG_Q)); }catch(e){ reject(e); }
        };
        img.onerror=function(){ reject(new Error('imagem invalida')); };
        img.src=reader.result;
      };
      reader.onerror=function(){ reject(new Error('falha ao ler arquivo')); };
      reader.readAsDataURL(file);
    });
  }

  function _onFotoSelected(e){
    var file=e.target.files&&e.target.files[0]; if(!file) return;
    var id=_fotoTargetId; if(!id) return;
    var it=_estoque.find(function(x){ return x.id===id; }); if(!it) return;
    if(file.size>15*1024*1024){ _toast('Imagem muito grande (max 15MB)'); return; }
    _toast('Processando foto\u2026');
    _resizeImage(file).then(function(dataUrl){
      it.foto=dataUrl; _saveCache(); estoqueRender();
      _ensureSb().then(function(){
        _upsertOne(it)
          .then(function(){ _toast('Foto salva \u2713'); })
          .catch(function(){ _markDirty(true); _toast('Foto salva localmente \u2014 clique em Salvar para enviar a nuvem'); });
      });
    }).catch(function(err){ _toast('Erro na foto: '+(err.message||err)); });
  }

  window.estoqueViewFoto=function(id){
    var it=_estoque.find(function(x){ return x.id===id; }); if(!it||!it.foto) return;
    var v=document.getElementById('estoque-viewer'),img=document.getElementById('estoque-viewer-img'),cap=document.getElementById('estoque-viewer-cap');
    if(img) img.src=it.foto;
    if(cap) cap.textContent=(it.nome||'Item')+(it.logo?(' \u00B7 Logo '+(it.logo==='NOVO'?'Novo':'Atual')):'')+' \u00B7 '+(Number(it.quantidade)||0)+' un.';
    if(v) v.classList.add('open');
  };
  window.estoqueCloseViewer=function(e){
    if(e&&e.target&&e.target.id!=='estoque-viewer'&&!(e.target.className&&String(e.target.className).indexOf('estoque-viewer-close')>=0)) return;
    var v=document.getElementById('estoque-viewer'); if(v) v.classList.remove('open');
  };

  window.estoqueSaveAll=function(){
    var btn=document.getElementById('estoque-save-btn');
    if(btn){ btn.disabled=true; btn.innerHTML='<span style="font-size:14px">\u23F3</span> Salvando\u2026'; }
    _saveCache();
    _ensureSb().then(function(ok){ if(!ok) throw new Error('sem conexao'); return _upsertAll(); })
      .then(function(){ _markDirty(false); _toast('Estoque salvo na nuvem \u2713'); })
      .catch(function(err){ _toast('Salvo localmente. Nuvem: '+(err.message||err)); })
      .then(function(){ if(btn){ btn.disabled=false; btn.innerHTML='<span style="font-size:14px">\uD83D\uDCBE</span> Salvar'; } });
  };

  function _renderFromLocal(){
    var cache=_loadCache();
    _estoque=(cache&&cache.length)?cache:_seed();
    estoqueRender(); _markDirty(false);
  }

  window.estoqueBootCloud=function(){
    if(!_estoqueLoaded){ _renderFromLocal(); _estoqueLoaded=true; }
    _ensureSb().then(function(ok){
      if(!ok) return;
      _fetchCloud().then(function(rows){
        if(rows && rows.length){
          _estoque=rows.map(function(r){ return {id:r.id,nome:r.nome||'',logo:r.logo||'',quantidade:Number(r.quantidade)||0,foto:r.foto||null,ordem:r.ordem||0}; });
          _saveCache(); estoqueRender(); _markDirty(false);
        } else {
          // nuvem vazia na 1a vez: grava a lista atual (semente/cache) para inicializar
          _estoque.forEach(function(it,i){ it.ordem=i; });
          _upsertAll().then(function(){ _markDirty(false); }).catch(function(){});
        }
      }).catch(function(){ /* offline: mantem cache/semente */ });
    });
  };

  function _initDom(){
    var inp=document.getElementById('estoque-foto-input');
    if(inp) inp.addEventListener('change',_onFotoSelected);
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'){ var v=document.getElementById('estoque-viewer'); if(v&&v.classList.contains('open')) v.classList.remove('open'); }
    });
  }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',_initDom); } else { _initDom(); }
})();
