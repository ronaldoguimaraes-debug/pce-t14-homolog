/* PCE 2.0 · 16-auditoria-personalizados
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
/* ═══════════════════════════════════════════════════════════════════
   AUDITORIA DE PERSONALIZADOS — Motor JS v2
   Suporta PDF (certificados, TAG, carta) E planilhas (fallback).
   Integrado ao Painel ADM · Engenharia: Ronaldo Ferreira · PCE 2.0
   ═══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── Lazy-load deps ───────────────────────────────────── */
var _audDepsReady=false;
window.__loadAuditDeps=function(){
  if(window.__auditDepsLoaded) return window.__auditDepsLoaded;
  window.__auditDepsLoaded=new Promise(function(resolve){
    var done=0,need=0;
    function check(){done++;if(done>=need){_audDepsReady=true;resolve();}}
    if(typeof XLSX==='undefined'){need++;var s1=document.createElement('script');s1.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s1.onload=check;s1.onerror=check;document.head.appendChild(s1);}
    if(typeof pdfjsLib==='undefined'){need+=2;var s2=document.createElement('script');s2.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';s2.onload=function(){pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';check();};s2.onerror=check;document.head.appendChild(s2);check();}
    if(need===0){_audDepsReady=true;resolve();}
  });
  return window.__auditDepsLoaded;
};

/* ── Utils ────────────────────────────────────────────── */
function stripAcc(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function normTok(t){return stripAcc(String(t).replace(/['\u2019`\u00b4]/g,'').trim().replace(/\.$/,'')).toUpperCase();}
function normHdr(h){return stripAcc(String(h==null?'':h).toUpperCase()).trim().replace(/\s+/g,' ');}
function normCPF(v){if(v==null)return '';var s=String(v).replace(/\D/g,'');if(!s)return '';if(s.length>11)s=s.slice(-11);while(s.length<11)s='0'+s;return s;}
function bagName(nome){if(!nome)return [];return String(nome).replace(/['\u2019`\u00b4]/g,'').split(/\s+/).filter(Boolean).map(normTok);}
function levenshtein(a,b){var m=a.length,n=b.length;if(!m)return n;if(!n)return m;var p=[];for(var j=0;j<=n;j++)p[j]=j;for(var i=1;i<=m;i++){var c=[i];for(var jj=1;jj<=n;jj++)c[jj]=Math.min(p[jj]+1,c[jj-1]+1,p[jj-1]+(a[i-1]===b[jj-1]?0:1));p=c;}return p[n];}
function simR(a,b){if(!a.length&&!b.length)return 1;var d=levenshtein(a,b);return(a.length+b.length-d)/(a.length+b.length);}
function escH(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function uid(){return Math.random().toString(36).slice(2,10);}

/* ── State ────────────────────────────────────────────── */
var LS_KEY='pce_auditoria_sessions_v1';
var AUD={sessionId:null,sessionName:'',docs:{certificados:null,carta:null,tag:null,credenciamento:null},pacoteSelection:{},manualResolutions:{},results:null};

/* ── Sessions ─────────────────────────────────────────── */
function audLoadAll(){try{return JSON.parse(localStorage.getItem(LS_KEY)||'{}');}catch(e){return {};}}
function audSaveAll(o){localStorage.setItem(LS_KEY,JSON.stringify(o));}
function audRefreshSelect(){var all=audLoadAll(),sel=document.getElementById('audSessSelect');if(!sel)return;var cur=sel.value;sel.innerHTML='<option value="">— nova sessão —</option>';Object.keys(all).sort(function(a,b){return(all[b].savedAt||0)-(all[a].savedAt||0);}).forEach(function(id){var o=document.createElement('option');o.value=id;o.textContent=all[id].name||id;sel.appendChild(o);});if(all[cur])sel.value=cur;}
function audPersist(){var all=audLoadAll(),id=AUD.sessionId||uid();AUD.sessionId=id;all[id]={name:AUD.sessionName||'Sessão sem nome',savedAt:Date.now(),docs:{certificados:AUD.docs.certificados,carta:AUD.docs.carta,tag:AUD.docs.tag},pacoteSelection:AUD.pacoteSelection};audSaveAll(all);audRefreshSelect();var sel=document.getElementById('audSessSelect');if(sel)sel.value=id;var m=document.getElementById('audSessMeta');if(m)m.textContent='Salvo · '+new Date().toLocaleString('pt-BR');var d=document.getElementById('audBtnDel');if(d)d.disabled=false;}
function audLoadSess(id){var all=audLoadAll(),s=all[id];if(!s)return;AUD.sessionId=id;AUD.sessionName=s.name;AUD.docs.certificados=s.docs.certificados||null;AUD.docs.carta=s.docs.carta||null;AUD.docs.tag=s.docs.tag||null;AUD.pacoteSelection=s.pacoteSelection||{};var n=document.getElementById('audSessName');if(n)n.value=s.name||'';var m=document.getElementById('audSessMeta');if(m)m.textContent='Carregada · '+new Date(s.savedAt).toLocaleString('pt-BR');var d=document.getElementById('audBtnDel');if(d)d.disabled=false;['certificados','carta','tag'].forEach(audRefreshCard);audUpdateRun();}
function audDelSess(id){var all=audLoadAll();delete all[id];audSaveAll(all);audRefreshSelect();}

/* ── Header detection ─────────────────────────────────── */
function audDetectCols(hr){var norm=hr.map(normHdr);function find(fn){for(var i=0;i<norm.length;i++)if(fn(norm[i],i))return i;return -1;}var cpf=find(function(h){return/CPF/.test(h);});var pac=find(function(h){return h==='PACOTE';});var cst=find(function(h){return h==='CREDENCIAMENTO';});var np=find(function(h){return/PREFERENCIA/.test(h)||/PREFER\u00caNCIA/.test(h);});var nc=find(function(h,i){return(h==='NOME'||h==='NOME COMPLETO'||(/NOME/.test(h)&&/COMPLETO/.test(h)));});if(nc===-1)nc=find(function(h,i){return/NOME/.test(h)&&i!==np&&!/EMPRESA/.test(h)&&!/PREFERENCIA/.test(h)&&!/PREFER\u00caNCIA/.test(h);});return{cpf:cpf,pacote:pac,credStatus:cst,nomePreferencia:np,nomeCompleto:nc};}

/* ── SheetJS helpers ──────────────────────────────────── */
function audParseWb(buf){return XLSX.read(buf,{type:'array',cellDates:false});}
function audSheetRows(wb,sn){var ws=wb.Sheets[sn],aoa=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:null});if(!aoa.length)return{headers:[],rows:[]};return{headers:aoa[0].map(function(h){return h==null?'':String(h);}),rows:aoa.slice(1).filter(function(r){return r.some(function(c){return c!==null&&String(c).trim()!=='';});})};}
function audBuildRows(headers,rawRows,cols){return rawRows.map(function(r){return{nome:cols.nomeCompleto>=0?(r[cols.nomeCompleto]!=null?String(r[cols.nomeCompleto]).trim():''):'',nomePref:cols.nomePreferencia>=0?(r[cols.nomePreferencia]!=null?String(r[cols.nomePreferencia]).trim():''):'',cpf:cols.cpf>=0?normCPF(r[cols.cpf]):'',pacote:cols.pacote>=0?(r[cols.pacote]!=null?String(r[cols.pacote]).trim():''):'',status:cols.credStatus>=0?(r[cols.credStatus]!=null?String(r[cols.credStatus]).trim():''):'',raw:r};});}

/* ── PDF extraction ───────────────────────────────────── */
function audExtractPdfNames(file,mode){
  /* mode: 'certificado' | 'tag' | 'carta'
     Returns Promise<[{nameRaw, bag, blank?, page?}]> */
  return file.arrayBuffer().then(function(buf){
    return pdfjsLib.getDocument({data:buf}).promise;
  }).then(function(pdf){
    var items=[],chain=Promise.resolve();
    for(var i=1;i<=pdf.numPages;i++)(function(pg){
      chain=chain.then(function(){return pdf.getPage(pg);}).then(function(page){
        return page.getTextContent().then(function(content){
          var lineMap={};
          content.items.forEach(function(it){var txt=(it.str||'').trim();if(!txt)return;var y=it.transform[5],key=Math.round(y/2.2);if(!lineMap[key])lineMap[key]=[];lineMap[key].push({x:it.transform[4],text:it.str,h:Math.abs(it.transform[3]||12)});});
          var sortedKeys=Object.keys(lineMap).map(Number).sort(function(a,b){return b-a;});

          if(mode==='certificado'){
            var lineTexts=sortedKeys.map(function(k){return lineMap[k].sort(function(a,b){return a.x-b.x;}).map(function(it){return it.text;}).join(' ').replace(/\s+/g,' ').trim();}).filter(function(t){return t.length>0;});
            var si=-1,ei=-1;
            for(var li=0;li<lineTexts.length;li++){var n=stripAcc(lineTexts[li].toLowerCase());if(si===-1&&n.indexOf('certificamos')!==-1){si=li;continue;}if(si!==-1&&li>si&&n.indexOf('programa')!==-1&&n.indexOf('crescimento')!==-1){ei=li;break;}}
            var nameRaw='';
            if(si!==-1&&ei!==-1&&ei>si){var cl=lineTexts.slice(si+1,ei).filter(function(t){return stripAcc(t.toLowerCase()).indexOf('participou')===-1;});nameRaw=cl.join(' ').replace(/\s+/g,' ').trim();if(!nameRaw){var mm=lineTexts[si].match(/certificamos\s+que\s+(.*)/i);if(mm)nameRaw=mm[1].trim();}}
            items.push({page:pg,nameRaw:nameRaw,bag:bagName(nameRaw),blank:!nameRaw});

          } else if(mode==='tag'){
            /* TAG: 6 cards/page (3 rows × 2 cols). Names have larger font (height>10). */
            var allWords=[];sortedKeys.forEach(function(k){lineMap[k].forEach(function(w){allWords.push(w);});});
            var nameWords=allWords.filter(function(w){return w.h>10;});
            var yGroups={};nameWords.forEach(function(w){var key=Math.round(w.x<297?0:1)*1000+Math.round((842-w.x/842*842+w.h)/50)*50;/* group by row Y */var ky=Math.round((842-allWords.find(function(aw){return aw===w;}).x)/50)*50;/* wrong approach, use lineMap key */});
            /* Simpler: get words with h>10 from the original lineMap, group by Y band, split left/right */
            var bigWords=[];
            sortedKeys.forEach(function(k){lineMap[k].forEach(function(w){if(w.h>10)bigWords.push({x:w.x,text:w.text,top:k});});});
            var yBands={};bigWords.forEach(function(w){var bk=Math.round(w.top/150)*150;if(!yBands[bk])yBands[bk]=[];yBands[bk].push(w);});
            Object.keys(yBands).forEach(function(bk){
              var grp=yBands[bk].sort(function(a,b){return a.x-b.x;});
              var pageW=595;var mid=pageW/2*2.2/2;/* approximate */
              var left=grp.filter(function(w){return w.x<400;}); /* x in transform coords */
              var right=grp.filter(function(w){return w.x>=400;});
              [left,right].forEach(function(side){
                if(!side.length)return;
                var name=side.map(function(w){return w.text;}).join(' ').trim();
                if(name&&name.indexOf('PCE10EM12')===-1) items.push({page:pg,nameRaw:name,bag:bagName(name),blank:false});
              });
            });

          } else if(mode==='carta'){
            /* Carta: name is the big-font line (h>30), one per page, ends with comma */
            var bigWords2=[];
            sortedKeys.forEach(function(k){lineMap[k].forEach(function(w){if(w.h>30)bigWords2.push(w);});});
            if(bigWords2.length){
              var name=bigWords2.sort(function(a,b){return a.x-b.x;}).map(function(w){return w.text;}).join(' ').trim().replace(/,$/,'');
              items.push({page:pg,nameRaw:name,bag:bagName(name),blank:false});
            } else {
              items.push({page:pg,nameRaw:'',bag:[],blank:true});
            }
          }
        });
      });
    })(i);
    return chain.then(function(){return items;});
  });
}

/* ── Matching engine ──────────────────────────────────── */
/* Bijective: cert bag ↔ full name, supports abbreviations (single-letter tokens) */
function bijectiveMatch(bagA,bagB){
  if(bagB.length<2)return false;
  var first=bagB[0],last=bagB[bagB.length-1];
  var cb={};bagA.forEach(function(t){cb[t]=(cb[t]||0)+1;});
  if((cb[first]||0)<1||(cb[last]||0)<1)return false;
  cb[first]--;cb[last]--;
  var remFull=bagB.slice(1,-1),remCert=[];
  Object.keys(cb).forEach(function(k){for(var i=0;i<cb[k];i++)remCert.push(k);});
  if(remCert.length!==remFull.length)return false;
  var used=remFull.map(function(){return false;});
  for(var ci=0;ci<remCert.length;ci++){var ct=remCert[ci],ok=false;
    for(var fi=0;fi<remFull.length;fi++){if(!used[fi]&&((ct.length>1&&ct===remFull[fi])||(ct.length===1&&remFull[fi].indexOf(ct)===0))){used[fi]=true;ok=true;break;}}
    if(!ok)return false;
  }
  return true;
}

/* Subset: every token of the shorter bag found in the longer bag (exact, initial, or fuzzy≥82%) */
function subsetMatch(bagA,bagB){
  if(!bagA.length||!bagB.length)return false;
  var short_=bagA.length<=bagB.length?bagA:bagB;
  var long_=bagA.length<=bagB.length?bagB:bagA;
  if(short_.length<2)return false;
  var used=long_.map(function(){return false;});
  for(var si=0;si<short_.length;si++){
    var st=short_[si],found=false;
    for(var li=0;li<long_.length;li++){if(!used[li]&&((st.length>1&&st===long_[li])||(st.length===1&&long_[li].indexOf(st)===0)||(long_[li].length===1&&st.indexOf(long_[li])===0))){used[li]=true;found=true;break;}}
    if(!found){for(var li2=0;li2<long_.length;li2++){if(!used[li2]&&st.length>2&&long_[li2].length>2&&simR(st,long_[li2])>=0.82){used[li2]=true;found=true;break;}}}
    if(!found)return false;
  }
  return true;
}

function fuzzyCands(itemBag,credRows,cutoff){
  var out=[];
  credRows.forEach(function(cr,idx){
    var ft=bagName(cr.nome);if(ft.length<2)return;
    var first=ft[0],last=ft[ft.length-1],ls=0,fs=0;
    itemBag.forEach(function(ct){if(ct.length>1){ls=Math.max(ls,simR(last,ct));fs=Math.max(fs,simR(first,ct));}});
    if(ls>=cutoff&&fs>=cutoff)out.push({idx:idx,cr:cr,sim:Math.min(ls,fs)});
  });
  return out;
}

/* Universal name-based matching (for cert, tag, carta PDFs) */
function audMatchByName(pdfItems,credFiltered,docKey){
  var exact=[],fuzzy=[],review=[],blanks=[];
  pdfItems.forEach(function(p){
    if(p.blank){blanks.push(p);return;}
    var key=docKey+':'+p.page;
    if(AUD.manualResolutions[key]){
      var res=AUD.manualResolutions[key];
      if(res.type==='match'){exact.push({item:p,cr:credFiltered[res.credIdx],tier:'manual'});return;}
      if(res.type==='none'){review.push({item:p,cands:[],resolved:'none'});return;}
    }
    /* Tier 1: bijective exact */
    var ec=credFiltered.filter(function(cr){return bijectiveMatch(p.bag,bagName(cr.nome));});
    if(ec.length===1){exact.push({item:p,cr:ec[0],tier:'exact'});return;}
    if(ec.length>1){review.push({item:p,cands:ec.map(function(cr){return{cr:cr,sim:1};}),resolved:false});return;}
    /* Tier 1b: subset match (handles abbreviated vs full in either direction) */
    var sc=credFiltered.filter(function(cr){return subsetMatch(p.bag,bagName(cr.nome));});
    if(sc.length===1){exact.push({item:p,cr:sc[0],tier:'exact'});return;}
    if(sc.length>1){review.push({item:p,cands:sc.map(function(cr){return{cr:cr,sim:0.95};}),resolved:false});return;}
    /* Tier 2: fuzzy similarity */
    var fz=fuzzyCands(p.bag,credFiltered,0.8);
    if(fz.length===1){fuzzy.push({item:p,cr:fz[0].cr,tier:'fuzzy',sim:fz[0].sim});return;}
    if(fz.length>1){review.push({item:p,cands:fz.map(function(f){return{cr:f.cr,sim:f.sim};}),resolved:false});return;}
    review.push({item:p,cands:[],resolved:false});
  });
  return{exact:exact,fuzzy:fuzzy,review:review,blanks:blanks};
}

/* CPF-based matching (for spreadsheet-based carta/tag with CPF column) */
function audMatchCPF(docRows,credFiltered,credByCPF,docKey){
  var exact=[],review=[],noCpf=[],cpfAbsent=[];
  docRows.forEach(function(r,i){
    var key=docKey+':'+i;
    if(AUD.manualResolutions[key]){var res=AUD.manualResolutions[key];if(res.type==='match'){exact.push({item:r,cr:credFiltered[res.credIdx],tier:'manual'});return;}if(res.type==='none'){review.push({item:r,cands:[],resolved:'none'});return;}}
    if(r.cpf){var cr=credByCPF[r.cpf];if(cr){exact.push({item:r,cr:cr,tier:'exact'});return;}cpfAbsent.push({item:r,tier:'cpf-absent'});return;}
    var nomeTry=r.nome||r.nomePref;
    if(nomeTry){var toks=bagName(nomeTry);var cands=credFiltered.filter(function(cr){return bijectiveMatch(toks,bagName(cr.nome))||subsetMatch(toks,bagName(cr.nome));});if(cands.length===1){exact.push({item:r,cr:cands[0],tier:'fuzzy'});return;}}
    noCpf.push(r);
  });
  return{exact:exact,review:review,noCpf:noCpf,cpfAbsent:cpfAbsent};
}

function statusIsConf(s){return/confirmad/i.test(String(s||''));}
function audClassify(matched,reviewList,blankCount,totalCount,noCpfList,cpfAbsentList){
  var conf=[],nao=[];
  matched.forEach(function(m){if(statusIsConf(m.cr.status))conf.push(m);else nao.push(m);});
  if(cpfAbsentList&&cpfAbsentList.length)cpfAbsentList.forEach(function(m){nao.push(m);});
  return{confirmados:conf,naoCredenciados:nao,revisar:reviewList.filter(function(r){return r.resolved!=='none';}),marcadosSemCorrespondencia:reviewList.filter(function(r){return r.resolved==='none';}),semCpf:noCpfList||[],blankCount:blankCount,totalCount:totalCount};
}

/* ── Upload handlers ──────────────────────────────────── */
var SLOT_LABELS={certificados:'Certificados',carta:'Carta Profética',tag:'TAG',credenciamento:'Credenciamento'};
function audSetStat(slot,msg,cls){var el=document.getElementById('audstat-'+slot);if(el){el.textContent=msg;el.className='aud-fstat'+(cls?(' '+cls):'');}}
function audRefreshCard(slot){
  var doc=AUD.docs[slot],card=document.querySelector('.aud-upc[data-audslot="'+slot+'"]'),pill=document.getElementById('audpill-'+slot),info=document.getElementById('audinfo-'+slot);
  if(!card||!pill||!info)return;
  if(doc){card.classList.add('has-file');pill.textContent='carregado';pill.classList.add('ok');info.style.display='flex';
    var cl='';
    if(doc.type==='pdf'){var real=doc.items.filter(function(p){return!p.blank;}).length;var blank=doc.items.length-real;cl=real+' nomes'+(blank?' · '+blank+' em branco':'');}
    else cl=doc.rows.length+' linhas';
    info.innerHTML='<span><b>'+escH(doc.fileName)+'</b> · '+cl+'</span><button class="aud-clear" data-audclear="'+slot+'">✕</button>';
  } else {card.classList.remove('has-file');pill.textContent='vazio';pill.classList.remove('ok');info.style.display='none';info.innerHTML='';}
  audUpdateRun();
}
function audHandleXlsx(slot,file){
  audSetStat(slot,'Lendo planilha…');
  file.arrayBuffer().then(function(buf){
    var wb=audParseWb(buf),sheetNames=wb.SheetNames,sheetSel=document.getElementById('audsheet-'+slot);
    if(!sheetSel)return;sheetSel.innerHTML='';
    sheetNames.forEach(function(sn){var o=document.createElement('option');o.value=sn;o.textContent=sn;sheetSel.appendChild(o);});
    var defIdx=0;if(sheetNames.length>1){var wanted=slot==='carta'?'CARTA':slot==='tag'?'FRASE':slot==='credenciamento'?'CREDENCIAMENTO':'';if(wanted){var found=sheetNames.findIndex(function(sn){return normHdr(sn).indexOf(wanted)!==-1;});if(found>=0)defIdx=found;}sheetSel.style.display='block';}else sheetSel.style.display='none';
    sheetSel.value=sheetNames[defIdx];
    function loadSheet(sn){var d=audSheetRows(wb,sn),cols=audDetectCols(d.headers),built=audBuildRows(d.headers,d.rows,cols);AUD.docs[slot]={type:'xlsx',fileName:file.name,sheetNames:sheetNames,rows:built,cols:cols};audRefreshCard(slot);var warn=[];if(cols.cpf===-1)warn.push('CPF não encontrado');if(cols.nomeCompleto===-1&&cols.nomePreferencia===-1)warn.push('nenhuma coluna de nome');if(slot==='credenciamento'){if(cols.pacote===-1)warn.push('coluna Pacote não encontrada');if(cols.credStatus===-1)warn.push('coluna Credenciamento não encontrada');audRebuildPac();}if(warn.length)audSetStat(slot,'⚠ '+warn.join(' · '),'err');else audSetStat(slot,'✓ '+built.length+' linhas · colunas ok','ok');}
    loadSheet(sheetNames[defIdx]);sheetSel.onchange=function(){loadSheet(sheetSel.value);};
  }).catch(function(e){audSetStat(slot,'Erro: '+e.message,'err');});
}
function audHandlePdf(slot,file){
  var mode=slot==='certificados'?'certificado':slot==='tag'?'tag':'carta';
  audSetStat(slot,'Lendo PDF… pode levar alguns segundos');
  audExtractPdfNames(file,mode).then(function(items){
    AUD.docs[slot]={type:'pdf',fileName:file.name,items:items};audRefreshCard(slot);
    var real=items.filter(function(p){return!p.blank;}).length;var blank=items.length-real;
    audSetStat(slot,'✓ '+real+' nomes lidos'+(blank?' · '+blank+' em branco':''),'ok');
  }).catch(function(e){audSetStat(slot,'Erro: '+e.message,'err');});
}
function audHandleFile(slot,file){
  if(!file)return;
  var isPdf=/\.pdf$/i.test(file.name);
  if(slot==='credenciamento'){audHandleXlsx(slot,file);return;}/* credenciamento always xlsx */
  if(isPdf){audHandlePdf(slot,file);}else{audHandleXlsx(slot,file);}
}

/* ── Pacote filter ────────────────────────────────────── */
function audRebuildPac(){
  var doc=AUD.docs.credenciamento,empty=document.getElementById('audPacEmpty'),grid=document.getElementById('audPacGrid'),acts=document.getElementById('audPacActs');
  if(!empty||!grid||!acts)return;
  if(!doc){empty.style.display='block';empty.textContent='Envie o credenciamento para ver os pacotes.';grid.style.display='none';acts.style.display='none';audUpdateRun();return;}
  var counts={};doc.rows.forEach(function(r){var p=r.pacote||'(sem pacote)';counts[p]=(counts[p]||0)+1;});
  if(!Object.keys(counts).length){empty.style.display='block';empty.textContent='Nenhum pacote encontrado.';grid.style.display='none';acts.style.display='none';audUpdateRun();return;}
  empty.style.display='none';grid.style.display='flex';acts.style.display='flex';grid.innerHTML='';
  var existing=AUD.pacoteSelection||{};
  Object.keys(counts).sort().forEach(function(p){var checked=(p in existing)?existing[p]:!/staff/i.test(p);AUD.pacoteSelection[p]=checked;var chip=document.createElement('label');chip.className='aud-pac-chip'+(checked?' on':'');chip.innerHTML='<input type="checkbox" '+(checked?'checked':'')+' data-audpac="'+escH(p)+'"> '+escH(p)+' <span class="cnt">'+counts[p]+'</span>';grid.appendChild(chip);});
  audUpdateRun();
}
function audRebuildPacUI(){document.querySelectorAll('#audPacGrid .aud-pac-chip').forEach(function(chip){var cb=chip.querySelector('input'),on=AUD.pacoteSelection[cb.dataset.audpac];cb.checked=on;chip.classList.toggle('on',on);});}
function audUpdateRun(){var btn=document.getElementById('audBtnRun');if(!btn)return;btn.disabled=!(AUD.docs.credenciamento&&(AUD.docs.certificados||AUD.docs.carta||AUD.docs.tag));}

/* ── Audit execution ──────────────────────────────────── */
function audGetFiltered(){var doc=AUD.docs.credenciamento;if(!doc)return[];return doc.rows.filter(function(r){var p=r.pacote||'(sem pacote)';return AUD.pacoteSelection[p]!==false;});}
function audRunAudit(){
  var cred=audGetFiltered(),credByCPF={};
  cred.forEach(function(cr){if(cr.cpf)credByCPF[cr.cpf]=cr;});
  var results={};
  ['certificados','carta','tag'].forEach(function(dk){
    var doc=AUD.docs[dk];if(!doc)return;
    if(doc.type==='pdf'){
      var m=audMatchByName(doc.items,cred,dk);
      results[dk]=audClassify(m.exact.concat(m.fuzzy),m.review,m.blanks.length,doc.items.length);
    } else {/* xlsx with CPF */
      var m2=audMatchCPF(doc.rows,cred,credByCPF,dk);
      results[dk]=audClassify(m2.exact,m2.review,0,doc.rows.length,m2.noCpf,m2.cpfAbsent);
    }
  });
  AUD.results=results;audRenderResults();
}

/* ── Render results ───────────────────────────────────── */
var _audActiveTab=null;
function audItemLabel(dk,item){
  if(item.page!=null)return{main:item.nameRaw||'(nome vazio)',sub:'página '+item.page};
  var main=item.nome||item.nomePref||'(sem nome)';var parts=[];
  if(item.nomePref&&item.nomePref!==item.nome)parts.push('pref.: '+item.nomePref);
  if(item.cpf)parts.push('CPF '+item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4'));else parts.push('sem CPF');
  return{main:main,sub:parts.join(' · ')};
}
function audKpi(n,l,c){return'<div class="aud-kpi '+c+'"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>';}
function audRenderResults(){
  var ew=document.getElementById('audEmptyState'),rw=document.getElementById('audResultsWrap');if(ew)ew.style.display='none';if(rw)rw.style.display='block';
  var dks=Object.keys(AUD.results);if(!_audActiveTab||dks.indexOf(_audActiveTab)===-1)_audActiveTab=dks[0];
  var tC=0,tN=0,tR=0;dks.forEach(function(k){var r=AUD.results[k];tC+=r.confirmados.length;tN+=r.naoCredenciados.length+r.marcadosSemCorrespondencia.length;tR+=r.revisar.length+r.semCpf.length;});
  var kr=document.getElementById('audKpiRow');if(kr)kr.innerHTML=audKpi(tC,'Confirmados — separar','green')+audKpi(tN,'Não credenciados — pode pular','red')+audKpi(tR,'Revisar manualmente','amber');
  var labelMap={certificados:'🎓 Certificados',carta:'✉️ Carta Profética',tag:'🏷️ TAG'};
  var dt=document.getElementById('audDocTabs');if(dt)dt.innerHTML=dks.map(function(k){var r=AUD.results[k],rc=r.revisar.length+r.semCpf.length;return'<button class="aud-dtab'+(k===_audActiveTab?' on':'')+'" data-auddoctab="'+k+'">'+labelMap[k]+' <span class="badge">'+r.confirmados.length+'</span>'+(rc?' <span class="badge warn">'+rc+' revisar</span>':'')+'</button>';}).join('');
  document.querySelectorAll('[data-auddoctab]').forEach(function(b){b.onclick=function(){_audActiveTab=b.dataset.auddoctab;audRenderResults();};});
  var rs=document.getElementById('audResSections');if(rs)rs.innerHTML=dks.map(function(k){return audRenderDocSec(k);}).join('');
  audBindEvents();
}
function audResBlock(title,list,dk){var h='<div class="aud-rb"><div class="aud-rb-head"><h3>'+title+' <span class="cnt">('+list.length+')</span></h3></div>';if(!list.length){h+='<div class="aud-rl"><div class="aud-rempty">Nenhum registro.</div></div></div>';return h;}h+='<div class="aud-rl aud-rcoll">';h+=list.map(function(m){var lb=audItemLabel(dk,m.item);var tl=m.tier==='exact'?'exato':m.tier==='fuzzy'?'similaridade':m.tier==='manual'?'manual':m.tier==='manual-none'?'marcado':m.tier==='cpf-absent'?'CPF ausente':'';var tc=m.tier==='exact'?'exact':m.tier==='fuzzy'?'fuzzy':'manual';var ci=m.cr?(m.cr.nome+(m.cr.status?' · '+m.cr.status:'')):m.tier==='cpf-absent'?'(CPF ausente no credenciamento)':'(sem correspondência)';return'<div class="aud-rr"><div class="rn"><b>'+escH(lb.main)+'</b><span class="sub">'+escH(lb.sub)+(m.cr||m.tier==='cpf-absent'?' · '+escH(ci):'')+'</span></div>'+(tl?'<span class="aud-rtag '+tc+'">'+tl+'</span>':'')+'</div>';}).join('');h+='</div></div>';return h;}
function audRenderDocSec(dk){var r=AUD.results[dk],on=dk===_audActiveTab;var h='<div class="aud-rs'+(on?' on':'')+'" data-audsec="'+dk+'">';h+=audResBlock('✅ Confirmados — separar',r.confirmados,dk);h+=audResBlock('⛔ Não credenciados — pode pular',r.naoCredenciados.concat(r.marcadosSemCorrespondencia.map(function(x){return{item:x.item,cr:null,tier:'manual-none'};})),dk);
  if(r.revisar.length){h+='<div class="aud-rb"><div class="aud-rb-head"><h3>⚠️ Revisar manualmente <span class="cnt">('+r.revisar.length+')</span></h3></div>';h+=r.revisar.map(function(rv){return audRenderRevCard(dk,rv);}).join('');h+='</div>';}
  if(r.semCpf&&r.semCpf.length){h+='<div class="aud-rb"><div class="aud-rb-head"><h3>ℹ️ Sem CPF <span class="cnt">('+r.semCpf.length+')</span></h3></div><div class="aud-rl aud-rcoll">'+r.semCpf.map(function(item){var lb=audItemLabel(dk,item);return'<div class="aud-rr"><div class="rn"><b>'+escH(lb.main)+'</b><span class="sub">'+escH(lb.sub)+'</span></div></div>';}).join('')+'</div></div>';}
  if(r.blankCount)h+='<div class="aud-rb"><div class="aud-rb-head"><h3 style="color:var(--muted2)">Em branco <span class="cnt">('+r.blankCount+')</span></h3></div></div>';
  h+='<div class="aud-exp-bar"><button class="aud-btn" data-audexp="naocred:'+dk+'">⬇ Não credenciados (CSV)</button><button class="aud-btn" data-audexp="confirmados:'+dk+'">⬇ Confirmados (CSV)</button></div></div>';return h;
}
function audRenderRevCard(dk,rv){var lb=audItemLabel(dk,rv.item);var idx=rv.item.page||0;var key=dk+':'+idx;var h='<div class="aud-revc"><div class="aud-revc-top"><div class="aud-revc-src"><span class="tag">'+SLOT_LABELS[dk]+'</span>'+escH(lb.main)+' <span style="color:var(--muted2);font-weight:400;font-size:11px">('+escH(lb.sub)+')</span></div></div>';
  if(rv.cands&&rv.cands.length){h+='<div class="aud-revc-cands">'+rv.cands.map(function(c){var ci=audGetFiltered().indexOf(c.cr);return'<div class="aud-revc-cand"><div class="info"><span class="nm">'+escH(c.cr.nome)+'</span><span class="meta"> · '+escH(c.cr.status||'—')+' · '+(c.sim!=null?Math.round(c.sim*100)+'%':'—')+'</span></div><button data-audresolve="'+key+'" data-audcred="'+ci+'">✓ é esse</button></div>';}).join('')+'</div>';}
  else h+='<div class="aud-rempty" style="padding:8px 0;text-align:left">Nenhum candidato encontrado.</div>';
  h+='<div class="aud-revc-none"><button class="b2" data-audnone="'+key+'">Marcar como não credenciado</button></div></div>';return h;
}
function audExportCSV(kind,dk){var r=AUD.results[dk],list,fn;if(kind==='naocred'){list=r.naoCredenciados.concat(r.marcadosSemCorrespondencia.map(function(x){return{item:x.item,cr:null};}));fn='nao-credenciados-'+dk+'.csv';}else{list=r.confirmados;fn='confirmados-'+dk+'.csv';}var lines=[['nome_no_documento','nome_credenciamento','status'].join(';')];list.forEach(function(m){var lb=audItemLabel(dk,m.item);lines.push(['"'+lb.main.replace(/"/g,'""')+'"',m.cr?'"'+m.cr.nome.replace(/"/g,'""')+'"':'',m.cr?m.cr.status:''].join(';'));});var blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8'});var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download=fn;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}
function audBindEvents(){
  document.querySelectorAll('[data-audresolve]').forEach(function(b){b.onclick=function(){AUD.manualResolutions[b.dataset.audresolve]={type:'match',credIdx:parseInt(b.dataset.audcred,10)};audRunAudit();};});
  document.querySelectorAll('[data-audnone]').forEach(function(b){b.onclick=function(){AUD.manualResolutions[b.dataset.audnone]={type:'none'};audRunAudit();};});
  document.querySelectorAll('[data-audexp]').forEach(function(b){b.onclick=function(){var p=b.dataset.audexp.split(':');audExportCSV(p[0],p[1]);};});
}

/* ── Boot tab ─────────────────────────────────────────── */
var _audBooted=false;
window.audBootTab=function(){
  window.__loadAuditDeps().then(function(){
    if(_audBooted)return;_audBooted=true;
    ['certificados','carta','tag','credenciamento'].forEach(function(slot){
      var inp=document.getElementById('audfile-'+slot);if(!inp)return;
      inp.addEventListener('change',function(e){audHandleFile(slot,e.target.files[0]);});
      var card=document.querySelector('.aud-upc[data-audslot="'+slot+'"]');
      if(card){card.addEventListener('dragover',function(e){e.preventDefault();card.classList.add('drag');});card.addEventListener('dragleave',function(){card.classList.remove('drag');});card.addEventListener('drop',function(e){e.preventDefault();card.classList.remove('drag');audHandleFile(slot,e.dataTransfer.files[0]);});}
    });
    document.addEventListener('click',function(e){var btn=e.target.closest('[data-audclear]');if(!btn)return;var slot=btn.dataset.audclear;AUD.docs[slot]=null;var inp=document.getElementById('audfile-'+slot);if(inp)inp.value='';var ss=document.getElementById('audsheet-'+slot);if(ss){ss.style.display='none';ss.innerHTML='';}audSetStat(slot,'');audRefreshCard(slot);if(slot==='credenciamento')audRebuildPac();});
    var pg=document.getElementById('audPacGrid');if(pg)pg.addEventListener('change',function(e){var cb=e.target.closest('input[data-audpac]');if(!cb)return;AUD.pacoteSelection[cb.dataset.audpac]=cb.checked;cb.closest('.aud-pac-chip').classList.toggle('on',cb.checked);});
    var pa=document.getElementById('audPacAll');if(pa)pa.onclick=function(){Object.keys(AUD.pacoteSelection).forEach(function(k){AUD.pacoteSelection[k]=true;});audRebuildPacUI();};
    var pn=document.getElementById('audPacNone');if(pn)pn.onclick=function(){Object.keys(AUD.pacoteSelection).forEach(function(k){AUD.pacoteSelection[k]=false;});audRebuildPacUI();};
    var ps=document.getElementById('audPacNoStaff');if(ps)ps.onclick=function(){Object.keys(AUD.pacoteSelection).forEach(function(k){AUD.pacoteSelection[k]=!/staff/i.test(k);});audRebuildPacUI();};
    var rb=document.getElementById('audBtnRun');if(rb)rb.addEventListener('click',audRunAudit);
    var sv=document.getElementById('audBtnSave');if(sv)sv.onclick=function(){AUD.sessionName=(document.getElementById('audSessName')||{}).value||'Sessão sem nome';audPersist();};
    var ss=document.getElementById('audSessSelect');if(ss)ss.onchange=function(e){if(e.target.value)audLoadSess(e.target.value);else{AUD.sessionId=null;AUD.sessionName='';var n=document.getElementById('audSessName');if(n)n.value='';var m=document.getElementById('audSessMeta');if(m)m.textContent='';var d=document.getElementById('audBtnDel');if(d)d.disabled=true;}};
    var dl=document.getElementById('audBtnDel');if(dl)dl.onclick=function(){if(!AUD.sessionId)return;if(!confirm('Excluir esta sessão salva?'))return;audDelSess(AUD.sessionId);AUD.sessionId=null;var n=document.getElementById('audSessName');if(n)n.value='';var m=document.getElementById('audSessMeta');if(m)m.textContent='';dl.disabled=true;};
    audRefreshSelect();
  });
};
})();
