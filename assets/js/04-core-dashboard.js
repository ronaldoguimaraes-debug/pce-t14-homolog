/* PCE 2.0 · 05-core-dashboard
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
const PCE_VERSION = '3.0.0';
const API_SCHEMA_VERSION = '3.0'; // atualizado para DASH-BR-COMPLETO v2
const DATA_SOURCES = {
  br: {
    id:'br',label:'T14 Brasil',flag:'🇧🇷',color:'#f5a623',
    url:'https://script.google.com/macros/s/AKfycbyJenWWKEcbaHT4juL2Qq1Oe8sfLeuNbf5tj4YJ1546iXGI9b03khspyx4iLx32Hl7H/exec',
    type:'full',timeout:15000,retries:1,retryDelay:2000,
  },
  t15: {
    id:'t15',label:'T15 Brasil',flag:'🇧🇷',color:'#f5a623',
    url:'https://script.google.com/macros/s/AKfycbxqKIceC2AQ4pD09_-DLGPcSsf6yh0nl-5pU_AUzMo70Xvb8PZpxmOgW6gNojkN-w0h/exec',
    type:'full',timeout:15000,retries:1,retryDelay:2000,
  },
  t16: {
    id:'t16',label:'T16 Brasil',flag:'🇧🇷',color:'#f5a623',
    url:'https://script.google.com/macros/s/AKfycbxNFO9AOMSgcgdtUCPSHI8o6lXHJClNcujNYg2lL4PfzFyzYHACAIj9uwsrj7xmhIo_9w/exec',
    type:'full',timeout:15000,retries:1,retryDelay:2000,
  },
};
const SCHEMA = {
  br:{requiredFields:['rows','total'],rowRequiredFields:['nome','presenca','tipo'],minRows:1}
};
const FALLBACK_META = {version:'3.0.0',capturedAt:'2026-03-27T18:00:00.000Z',totalRows:192,isOffline:true,source:'static_embedded'};
// ─── v49.6: NETWORKING PV — Noite de Networking (v49.10: dedupe por CPF/nome) ───
const NETWORKING_PV_FALLBACK = [
  {
    "data": "13/05/2026 17:24:15",
    "nome": "juliacaroline.cos@gmail.com",
    "cpf": "45048824857",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:24:21",
    "nome": "Sharon D Angelo",
    "cpf": "15500342606",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:25:28",
    "nome": "Diogo Rezende de  Almeida",
    "cpf": "70742499120",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:25:52",
    "nome": "Larissa Vitória Lopes Firmino",
    "cpf": "43888567890",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:26:28",
    "nome": "Wesley Charles de Oliveira",
    "cpf": "80047122153",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:26:54",
    "nome": "Daiane da Silva Almeida",
    "cpf": "01472525043",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:27:11",
    "nome": "Mateus Oliveira de Azambuja",
    "cpf": "00896612066",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:28:00",
    "nome": "Eraldo Dery Correa",
    "cpf": "55169716168",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:28:05",
    "nome": "Norma Jean Lopes",
    "cpf": "16499922897",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:28:08",
    "nome": "Carlos Felipe Távora Teixeira",
    "cpf": "86961306349",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:28:25",
    "nome": "Diego Eduardo Garcia",
    "cpf": "31958023841",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:29:35",
    "nome": "Débora Fernandes",
    "cpf": "39629461870",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:30:46",
    "nome": "Walquiria Amaral",
    "cpf": "03496772719",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:32:39",
    "nome": "Filipe Oliveira Leite",
    "cpf": "32823336842",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:33:00",
    "nome": "Janete Rosa Vilela",
    "cpf": "08833769704",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:35:39",
    "nome": "Fabiola Franca azzi Paranhos",
    "cpf": "34923365234",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:36:35",
    "nome": "Milon Salazar gramioli dos Santos",
    "cpf": "94130817272",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:37:16",
    "nome": "Alysson Matareli de Castro Abreu",
    "cpf": "04067432666",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:37:46",
    "nome": "Marlete Rizzotto Chagas",
    "cpf": "80965830004",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:38:01",
    "nome": "Aline Fernandes de Matto",
    "cpf": "07630244908",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:38:05",
    "nome": "Cibele lopes da silva",
    "cpf": "07910174608",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:38:36",
    "nome": "Douglas Bellan",
    "cpf": "08183347975",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:40:24",
    "nome": "Diego Souza Silva",
    "cpf": "02235506550",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:40:25",
    "nome": "Marcos Roberto Cardoso Costa",
    "cpf": "26028063827",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:41:03",
    "nome": "Natalia Brianez Fioretti",
    "cpf": "36119069801",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:42:07",
    "nome": "Graziela Cristine Dorileo Paim",
    "cpf": "93884150197",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:44:37",
    "nome": "Luciana Pinheiro Lima Torezan",
    "cpf": "94831947172",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:45:32",
    "nome": "Evandro Luiz Moreira",
    "cpf": "67269508020",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:49:27",
    "nome": "Daniela Fornari Dal Bosco",
    "cpf": "00863638082",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:52:47",
    "nome": "Juliana corso",
    "cpf": "06064137908",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:54:04",
    "nome": "Kleber Roberto da Silva",
    "cpf": "21569837805",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:55:09",
    "nome": "ANGELA ALVES PEREIRA",
    "cpf": "83168982172",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:55:27",
    "nome": "MARCOS ROSENDO DA SILVA",
    "cpf": "53815092191",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:55:44",
    "nome": "LUANNA ALVES SILVA",
    "cpf": "03811407171",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:56:24",
    "nome": "EDUARDO HENRIQUE DE PROSPERO AMUI",
    "cpf": "03196147193",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:56:39",
    "nome": "Rosa de Fátima Surek",
    "cpf": "91399378953",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:56:47",
    "nome": "Sidney Soares de Souza",
    "cpf": "05510125608",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:56:48",
    "nome": "Michel C Miniño",
    "cpf": "01539048799",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 17:58:40",
    "nome": "Leandro Martins da Silva",
    "cpf": "01223442608",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 18:00:57",
    "nome": "Elizângela de Souza Silva",
    "cpf": "92872018549",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 18:04:49",
    "nome": "Rogério Fernandes Guimarães",
    "cpf": "68995040572",
    "participa": "SIM"
  },
  {
    "data": "13/05/2026 18:07:21",
    "nome": "Cibele Lopes da Silva",
    "cpf": "07910174608",
    "participa": "SIM"
  }
];

/* ─── v55: NOITE DE NETWORKING — T15 ───────────────────────────────────────────
   Endpoint dedicado (Apps Script da planilha T15). O cruzamento acontece no
   servidor, que enxerga as duas abas: respostas do formulário + Onboarding T15.
   O dashboard só lê e pinta — mantém a regra de dashboard read-only.

   Diferente da T14, o número de confirmados NÃO é recontado aqui: ele vem da
   coluna O da Onboarding T15, que é o que a operação enxerga na planilha. O
   campo `divergencia` denuncia quando a coluna O está mais velha que os dados.

   CPF chega mascarado do endpoint — dado pessoal não trafega completo.
   Engenharia e fundação: Ronaldo Ferreira */
const NETWORKING_T15_URL = 'https://script.google.com/macros/s/AKfycbySoSTzY5x0locfSCuneh3-itR0JsLdck6ABCoIaq2hWYiuSLZjgIEko3qK2mXzADNF/exec';
let NETWORKING_T15_DATA = null;
let NETWORKING_T15_STATE = 'idle';   // idle | loading | ok | err

async function fetchNetworkingT15(force){
  if(NETWORKING_T15_STATE==='loading') return false;
  if(NETWORKING_T15_DATA && !force) return true;
  if(!NETWORKING_T15_URL){NETWORKING_T15_STATE='err';return false;}
  NETWORKING_T15_STATE='loading';
  try{
    const ctrl=new AbortController();
    const tm=setTimeout(function(){ctrl.abort();},12000);
    const res=await fetch(NETWORKING_T15_URL,{signal:ctrl.signal,cache:'no-store'});
    clearTimeout(tm);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const j=await res.json();
    if(!j||j.ok!==true) throw new Error((j&&j.erro)||'payload inválido');
    NETWORKING_T15_DATA=j;NETWORKING_T15_STATE='ok';
    if(window.Logger)Logger.info('NETWORKING T15','Dados carregados',{confirmados:j.totais&&j.totais.confirmados,divergencia:j.divergencia});
    return true;
  }catch(e){
    NETWORKING_T15_STATE='err';
    if(window.Logger)Logger.warn('NETWORKING T15','Falha ao buscar',{err:e.message});
    return false;
  }
}

function _npt15Esc(v){return String(v==null?'':v).replace(/[<>]/g,'');}

function paintNetworkingT15(turmaValida){
  const d=NETWORKING_T15_DATA;
  const elT=document.getElementById('np-faixa-title');
  const elS=document.getElementById('np-faixa-sub');
  const elC=document.getElementById('np-faixa-count');
  const el=document.getElementById('networking-pv-content');

  if(elT)elT.textContent='Confirmados na '+((d&&d.evento)||'Noite de Networking — T15');

  if(!d){
    const erro=(NETWORKING_T15_STATE==='err');
    if(elC)elC.textContent=erro?'—':'…';
    if(elS)elS.textContent=erro?'Não foi possível carregar agora':'Carregando confirmações…';
    if(el)el.innerHTML=erro
      ? '<div class="np-empty">Não foi possível carregar as confirmações da T15 agora. O painel tenta de novo no próximo carregamento.</div>'
      : '<div class="np-empty">Carregando confirmações…</div>';
    return;
  }

  const t=d.totais||{};
  const conf=t.confirmados||0;
  const onbTotal=t.onboarding||0;
  /* Denominador = Turma Válida (confirmados + sem retorno), a MESMA métrica do
     KPI "Turma Válida". O dashboard passa esse número; se não vier (ex.: fetch
     resolvendo antes do KPI), cai no total da Onboarding para não quebrar. */
  const base=(turmaValida!=null&&+turmaValida>0)?+turmaValida:onbTotal;
  const pctTurma=base>0?Math.round(conf/base*100):0;

  if(elC)elC.textContent=conf;
  if(elS)elS.textContent=conf+' de '+base+' na turma válida · '+pctTurma+'% confirmados';
  if(!el)return;

  if(!conf){
    el.innerHTML='<div class="np-empty">Nenhuma confirmação registrada ainda no formulário da Noite de Networking.</div>';
    return;
  }

  let h='<div class="np-grid">';
  h+='<div class="np-stat"><div class="np-stat-lbl">Total Confirmados</div><div class="np-stat-val">'+conf+'</div><div class="np-stat-sub">'+pctTurma+'% da turma válida ('+base+')</div></div>';
  h+='<div class="np-stat"><div class="np-stat-lbl">Responderam o formulário</div><div class="np-stat-val">'+(t.respostasUnicas||0)+'</div><div class="np-stat-sub">'+(t.respostasBrutas||0)+' preenchimentos → '+(t.respostasUnicas||0)+' pessoas únicas</div></div>';
  h+='<div class="np-stat"><div class="np-stat-lbl">Fora da turma</div><div class="np-stat-val"'+(t.orfaos?' style="color:var(--amber)"':'')+'>'+(t.orfaos||0)+'</div><div class="np-stat-sub">'+(t.orfaos?'precisam investigação':'todos identificados')+'</div></div>';
  h+='</div>';

  /* Coluna O defasada: o número da planilha e o cruzamento ao vivo discordam. */
  if(d.divergencia){
    h+='<div class="np-fora-box"><div class="np-fora-title">⚠️ Coluna O defasada em '+Math.abs(d.divergencia)+' pessoa(s)</div>'
      +'<div class="np-fora-list"><div class="np-fora-item">O cruzamento ao vivo encontrou um total diferente do gravado na planilha. Rodar <strong>PCE · Networking → Sincronizar confirmações agora</strong> antes de comunicar o número.</div></div></div>';
  }

  /* Quem respondeu mais de uma vez — fora da contagem, mantida a 1ª ocorrência. */
  const dup=d.duplicados||[];
  if(dup.length){
    const totRep=dup.reduce(function(a,x){return a+(x.vezes||0);},0);
    h+='<div class="np-dup-box">';
    h+='<div class="np-dup-title">🔁 '+dup.length+' '+(dup.length===1?'pessoa preencheu':'pessoas preencheram')+' mais de uma vez</div>';
    h+='<div class="np-dup-sub">Contadas uma única vez para não inflar o número de confirmados (total bruto: '+totRep+' preenchimentos)</div>';
    h+='<div class="np-dup-list">';
    dup.forEach(function(x){
      h+='<div class="np-dup-item"><strong>'+_npt15Esc(x.nome)+'</strong><span class="np-dup-cpf">CPF '+_npt15Esc(x.cpf||'(sem CPF)')+'</span><span class="np-dup-badge">'+(x.vezes||2)+'×</span></div>';
    });
    h+='</div></div>';
  }

  /* Distribuição por status na turma */
  const porStatus=d.porStatus||{};
  const ordem=['CONFIRMADO','BR CONFIRMADO','BR + US CONFIRMADO','US CONFIRMADO','SEM RETORNO','PROXIMA TURMA','CANCELAMENTO','NAO VAI PARTICIPAR','NAO CHAMAR','TROCA DE CONS','(sem status)'];
  const chaves=Object.keys(porStatus).sort(function(a,b){
    const ia=ordem.indexOf(a),ib=ordem.indexOf(b);
    return (ia<0?99:ia)-(ib<0?99:ib);
  });
  if(chaves.length){
    h+='<div style="margin-top:8px"><div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#aaa);margin-bottom:10px">Distribuição por status na T15</div>';
    chaves.forEach(function(s){
      const n=(porStatus[s]||[]).length;
      const pc=conf>0?Math.round(n/conf*100):0;
      h+='<div class="np-bar-row"><div class="np-bar-lbl">'+_npt15Esc(s)+'</div><div class="np-bar-track"><div class="np-bar-fill" style="width:'+Math.max(pc,4)+'%">'+pc+'%</div></div><div class="np-bar-count">'+n+'</div></div>';
    });
    h+='</div>';

    /* Confirmou o evento mas não está confirmado na turma — lista de contato do CS. */
    const atencao=chaves.filter(function(s){
      return ['CONFIRMADO','BR CONFIRMADO','BR + US CONFIRMADO','US CONFIRMADO'].indexOf(s)<0;
    });
    if(atencao.length){
      const tot=atencao.reduce(function(a,s){return a+(porStatus[s]||[]).length;},0);
      h+='<div class="np-atencao-box">';
      h+='<div class="np-atencao-title">🔍 '+tot+' '+(tot===1?'pessoa confirmou':'pessoas confirmaram')+' a Noite de Networking mas '+(tot===1?'não está':'não estão')+' como confirmad'+(tot===1?'a':'as')+' na T15</div>';
      h+='<div class="np-atencao-sub">Já se comprometeram com o evento — confirmar status, reverter cancelamento ou priorizar onboarding</div>';
      atencao.forEach(function(s){
        const arr=porStatus[s]||[];
        h+='<div class="np-atencao-group"><div class="np-atencao-status">'+_npt15Esc(s)+' <span class="np-atencao-count">'+arr.length+'</span></div><div class="np-atencao-list">';
        arr.forEach(function(p){
          h+='<div class="np-atencao-item"><strong>'+_npt15Esc(p.nome||'(sem nome)')+'</strong><span class="np-atencao-cpf">CPF '+_npt15Esc(p.cpf||'(sem CPF)')+'</span></div>';
        });
        h+='</div></div>';
      });
      h+='</div>';
    }
  }

  /* Respostas sem ninguém correspondente na turma */
  const orf=d.orfaos||[];
  if(orf.length){
    h+='<div class="np-fora-box"><div class="np-fora-title">⚠️ '+orf.length+' confirmaram no formulário mas não estão na Onboarding T15</div><div class="np-fora-list">';
    orf.forEach(function(p){
      h+='<div class="np-fora-item"><strong>'+_npt15Esc(p.nome||'(sem nome)')+'</strong> · CPF '+_npt15Esc(p.cpf||'(sem CPF)')+(p.email?' · '+_npt15Esc(p.email):'')+'</div>';
    });
    h+='</div></div>';
  }

  let quando='';
  try{ quando=' · '+new Date(d.geradoEm).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}); }catch(e){}
  h+='<div class="np-source live">● LIVE — cruzamento no Apps Script da T15 · '+conf+' confirmados'+quando+(d.cpfMascarado?' · CPF mascarado':'')+'</div>';

  el.innerHTML=h;
}

const NETWORKING_PV_URL = 'https://script.google.com/macros/s/AKfycbyMPl7AVEyQQ8UU2T9t6tuCr8tgHbDu0ADARsYFgXDYPwLpUSumKtSfVN3dnGyJHTI_/exec'; // v49.9 endpoint ativo (Google Apps Script)
let NETWORKING_PV_DATA = NETWORKING_PV_FALLBACK.slice();
let NETWORKING_PV_SOURCE = 'static_embedded';
async function fetchNetworkingPV(){
  if(!NETWORKING_PV_URL){if(window.Logger)Logger.info('NETWORKING','Sem URL — fallback embedado',{n:NETWORKING_PV_DATA.length});return false;}
  try{
    const ctrl=new AbortController();const tm=setTimeout(()=>ctrl.abort(),8000);
    const res=await fetch(NETWORKING_PV_URL,{signal:ctrl.signal,cache:'no-store'});clearTimeout(tm);
    if(!res.ok)throw new Error('HTTP '+res.status);
    const data=await res.json();
    const arr=Array.isArray(data)?data:(data.rows||data.data||[]);
    const limpos=arr.filter(r=>(r['Irá Participar']||r.participa||'').toString().trim().toUpperCase()==='SIM')
      .map(r=>{let _cpf=(r['CPF']||r.cpf||'').toString().replace(/\D/g,'');if(_cpf.length>0&&_cpf.length<11)_cpf=_cpf.padStart(11,'0');return{data:(r['Carimbo de data/hora']||r.data||'').toString().trim(),nome:(r['Nome Completo']||r.nome||'').toString().trim(),cpf:_cpf,participa:'SIM'};});
    NETWORKING_PV_DATA=limpos;NETWORKING_PV_SOURCE='api_live';
    if(window.Logger)Logger.info('NETWORKING','Dados atualizados via API',{n:limpos.length});
    return true;
  }catch(e){if(window.Logger)Logger.warn('NETWORKING','Falha ao buscar — usando fallback',{err:e.message});return false;}
}
function analisarNetworkingPV(rowsBR){
  // v49.8: padding zero-à-esquerda em CPFs (Google Sheets converte CPF em número e perde zeros à esquerda)
  function n(v){const s=(v||'').toString().replace(/\D/g,'');return s.length>0&&s.length<11?s.padStart(11,'0'):s;}
  // v49.10: chave de dedupe = CPF (quando existir), senão nome normalizado
  function chave(np){const c=n(np.cpf);if(c)return'cpf:'+c;const nm=(np.nome||'').toString().trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ');return nm?'nome:'+nm:null;}
  // 1) Dedupe: mantém a PRIMEIRA ocorrência de cada pessoa e coleta as repetições
  const vistos=new Map();
  for(const np of NETWORKING_PV_DATA){
    const k=chave(np);if(!k)continue;
    if(vistos.has(k)){vistos.get(k).repeticoes.push(np);}
    else{vistos.set(k,{primeiro:np,repeticoes:[]});}
  }
  const unicos=[];const duplicados=[];
  for(const info of vistos.values()){
    unicos.push(info.primeiro);
    if(info.repeticoes.length>0){
      duplicados.push({
        nome:info.primeiro.nome||'(sem nome)',
        cpf:n(info.primeiro.cpf),
        vezes:1+info.repeticoes.length,
        entradas:[info.primeiro,...info.repeticoes].map(e=>({data:e.data||'',nome:e.nome||'',cpf:n(e.cpf)}))
      });
    }
  }
  // 2) Cruzamento com Onboarding T14 — APENAS sobre as pessoas únicas
  const cpfBR=new Map();for(const r of rowsBR){const c=n(r.cpf);if(c)cpfBR.set(c,r);}
  const dentro=[],fora=[];
  for(const np of unicos){
    const c=n(np.cpf);if(!c)continue;
    if(cpfBR.has(c)){const r=cpfBR.get(c);dentro.push({...np,cpf:c,status:normalizeStatus(r.presenca),nome_t14:r.nome});}
    else{fora.push({...np,cpf:c});}
  }
  const porStatus={};for(const d of dentro){const s=d.status||'(sem status)';if(!porStatus[s])porStatus[s]=[];porStatus[s].push(d);}
  console.log('[NETWORKING PV] Análise:',{bruto:NETWORKING_PV_DATA.length,unicos:unicos.length,duplicados:duplicados.length,dentro:dentro.length,fora:fora.length});
  return{total:unicos.length,bruto:NETWORKING_PV_DATA.length,duplicados,dentro,fora,porStatus,source:NETWORKING_PV_SOURCE};
}

const FALLBACK = [{"tipo":"Taxa de Transferência Isento","evento":"ORLANDO + BRASIL","nome":"Alexandre Fouani","presenca":"SEM RETORNO","onboarding":"NÃO INICIADO","whats":"NÃO","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"Taxa de Transferência Isento","evento":"BRASIL","nome":"Raquel Afonso Ribeiro Correia","presenca":"PROXIMA TURMA","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"Taxa de Transferência Isento","evento":"BRASIL","nome":"Brasíliano Correia Filho","presenca":"PROXIMA TURMA","onboarding":"REALIZADO","whats":"NÃO","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"Taxa de Transferência Isento","evento":"BRASIL","nome":"Rogerio Eduardo Ferreira de Oliveira","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"Taxa de Transferência Isento","evento":"BRASIL","nome":"ANGÉLICA BERNARDES YOSHIDA","presenca":"CANCELAMENTO","onboarding":"NÃO INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"Taxa de Transferência Isento","evento":"ORLANDO + BRASIL","nome":"Yara Assaad","presenca":"SEM RETORNO","onboarding":"NÃO INICIADO","whats":"NÃO","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"IVANI DE SOUSA FREITAS","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Clécio Sidnei Gonçalves","presenca":"SEM RETORNO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"GECY ALVES NE NETO","presenca":"BR CONFIRMADO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Talge Celuppi Gonçalves","presenca":"CANCELAMENTO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Flavio Ratzke","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"RODRIGO DE PAULA","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"FERNANDA RANGEL DE AZEVEDO DE PAULA","presenca":"BR CONFIRMADO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"REGIS BOSQUEROLLI PRESTES","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"GABRIELA RODRIGUES COELHO","presenca":"BR CONFIRMADO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"DIONE COELHO","presenca":"PROXIMA TURMA","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"JULIENE SOARES COELHO RODRIGUES HERCULINO","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"ANA KARLA LIMA BARROS DE CARVALHO E SA","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Jéferson Rodrigues da Silva","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Igor Nonato Almeida Pereira","presenca":"BR CONFIRMADO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"ANDRE LOPES TEIXEIRA","presenca":"SEM RETORNO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"CARINE RODRIGUES","presenca":"SEM RETORNO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Lucas Asato Britto Lopes","presenca":"SEM RETORNO","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Shirley de Carvalho Santos","presenca":"PROXIMA TURMA","onboarding":"INICIADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"RENATO DA SILVA UCHOA","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"Antônio Edson De Oliveira Marinho Júnior","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"ANTONIO MARCOS PIRES CONDE","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"CONSUMIDOR DE VAGAS","evento":"BRASIL","nome":"JUCELIA MARTINI","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""},{"tipo":"Matrícula","evento":"BRASIL","nome":"IGOR GOMES PIRES","presenca":"PROXIMA TURMA","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"NÃO PREENCHEU","contrato":""},{"tipo":"Matrícula","evento":"BRASIL","nome":"William Avancini","presenca":"BR CONFIRMADO","onboarding":"REALIZADO","whats":"SIM","data":"Mon Mar 02 2026 12:54:42 GMT-0300 (Horário Padrão de Brasília)","typeform":"PREENCHIDO","contrato":""}];
const PERFIL = [["Juliene Coelho","Laboratório PETRI","Feminino","Petrolina Pernambuco","Saúde e Bem-Estar","Pessoa Jurídica e Pessoa Física","Sim","6","03/03/2026"],["Daniel Frota","Clínica Renovo","Masculino","Fortaleza Ceará","Saúde e Bem-Estar","Pessoa Física","Sim","8","04/03/2026"],["Ana Karla Barros","Laboratório Petri","Feminino","Pernambuco","Saúde e Bem-Estar","Pessoa Jurídica e Pessoa Física","Sim","8","04/03/2026"],["Erlaine Agudo","MAMA FLORA PAISAGISMO","Feminino","São Paulo SP","Comércio","Pessoa Jurídica e Pessoa Física","Sim","8","04/03/2026"],["Rodrigo Agudo","Mama Flora Paisagismo","Masculino","São Paulo SP","Comércio","Pessoa Jurídica e Pessoa Física","Sim","5","05/03/2026"],["Felipe Siviero","Tf.representações","Masculino","São Paulo","Serviços","Pessoa Jurídica e Pessoa Física","Sim","8","09/03/2026"],["Eliel Carapiá","MHL Seguros","Masculino","São Paulo","Finanças e Seguros","Pessoa Jurídica e Pessoa Física","Sim","7","09/03/2026"],["Diego Garcia","Gepac Soluções Integradas","Masculino","Jundiai SP","Tecnologia e Inovação","Pessoa Jurídica","Sim","8","09/03/2026"],["Alysson Matareli","MR Soluções","Masculino","Sabará MG","Indústria","Pessoa Jurídica","Sim","5","09/03/2026"],["David Couto","Granja Lacerds","Masculino","Frei Paulo SE","Agroindústria","Pessoa Jurídica","Sim","7","10/03/2026"],["Tarlis Faé","TSM Fae Treinamentos","Feminino","Maringá PR","Saúde e Bem-Estar","Pessoa Física","Sim","8","10/03/2026"],["Conde","Grupo Tagma","Masculino","Curitiba PR","Serviços","Pessoa Jurídica e Pessoa Física","Sim","8","10/03/2026"],["Jucelia Martini","Grupo Tagma","Feminino","Curitiba PR","Comércio","Pessoa Jurídica","Sim","6","10/03/2026"],["Kleber Silva","KS Tubos","Masculino","Paulinia SP","Comércio","Pessoa Jurídica e Pessoa Física","Sim","7","10/03/2026"],["Antônio Edson Marinho","Oliveira Marinho Advocacia","Masculino","Óbidos PA","Serviços","Pessoa Física","Sim","9","11/03/2026"],["Rogerio Oliveira","Indústria Baiana de Vidros","Masculino","Santo Antônio de Jesus BA","Indústria","Pessoa Jurídica e Pessoa Física","Sim","8","11/03/2026"],["Rogério Guimarães","KS Tubos","Masculino","Paulinia SP","Comércio","Pessoa Jurídica e Pessoa Física","Sim","5","11/03/2026"],["Luana Mostachio","KidSaber","Feminino","Mundo Novo MS","Educação","Pessoa Jurídica e Pessoa Física","Sim","6","11/03/2026"],["Stefany Barreto","Granja Lacerds","Feminino","Frei Paulo SE","Agroindústria","Pessoa Jurídica","Sim","5","11/03/2026"],["Flavio Ratzke","Grupo Tagma","Masculino","Curitiba PR","Serviços","Pessoa Jurídica","Sim","5","11/03/2026"],["Otavio Behling","Behling Corretora de Seguros","Masculino","Cuiabá MT","Finanças e Seguros","Pessoa Jurídica e Pessoa Física","Não","0","12/03/2026"],["Mayara Behling","AGOM Corretora de Seguros","Feminino","Cuiabá MT","Finanças e Seguros","Pessoa Jurídica e Pessoa Física","Sim","5","12/03/2026"],["Ivani de Sousa","Nutriranch","Masculino","Boa Viagem CE","Agroindústria","Pessoa Jurídica e Pessoa Física","Sim","5","12/03/2026"],["Rodrigo","RPODONTO","Masculino","Itaperuna RJ","Saúde e Bem-Estar","Pessoa Física","Sim","9","12/03/2026"],["Renato Uchoa","Armazem Renato","Masculino","Boa Viagem CE","Comércio","Pessoa Jurídica e Pessoa Física","Sim","8","13/03/2026"],["Ricardo Tonin","Ultravolt","Masculino","Iporã do Oeste SC","Energia e Utilidades","Pessoa Jurídica e Pessoa Física","Não","8","13/03/2026"],["Norma Jean Lopes","Agnus Life","Feminino","São Paulo SP","Serviços","Pessoa Jurídica","Sim","9","13/03/2026"],["Geovanne Ghizoni","Sollis Construtora","Masculino","Francisco Beltrão PR","Construção e Imobiliário","Pessoa Jurídica","Sim","8","14/03/2026"],["Marco Scariot","Queijos Perosa","Masculino","Maravilha SC","Alimentação e Bebidas","Pessoa Jurídica","Não","8","14/03/2026"],["Evandro Moreira","Duemed","Masculino","Santo Ângelo RS","Saúde e Bem-Estar","Pessoa Física","Não","5","15/03/2026"],["Aline Fernandes","4Person","Feminino","Cascavel PR","Educação","Pessoa Jurídica","Sim","10","16/03/2026"],["Eurides Araujo","Clínica Renovo","Feminino","Fortaleza CE","Saúde e Bem-Estar","Pessoa Física","Sim","8","16/03/2026"],["Débora Fernandes","Gepac Soluções","Feminino","Jundiaí SP","Tecnologia e Inovação","Pessoa Jurídica","Sim","7","16/03/2026"],["Jéferson Rodrigues","BS Advogados","Masculino","Porto Alegre RS","Serviços","Pessoa Física","Sim","7","16/03/2026"],["Rony Franchin","Solisteam","Masculino","Sertãozinho SP","E-commerce","Pessoa Jurídica","Sim","7","17/03/2026"],["Douglas Bellan","EnerVolt","Masculino","Iporã Do Oeste SC","Comércio","Pessoa Jurídica e Pessoa Física","Sim","6","17/03/2026"],["Marcelia Bruna Marinho","Oliveira Marinho Advocacia","Feminino","Óbidos PA","Serviços","Pessoa Física","Sim","9","17/03/2026"],["Cristiane Silva","Vinícola Pericó","Feminino","São Joaquim SC","Alimentação e Bebidas","Pessoa Jurídica e Pessoa Física","Não","7","17/03/2026"],["Soraya Schmitz","Grupo Dass","Feminino","Saudades SC","Indústria","Pessoa Jurídica","Sim","7","17/03/2026"],["Nathasha Cadorna","Cadorna Advocacia","Feminino","Itabuna BA","Serviços","Pessoa Física","Sim","8","17/03/2026"],["Cibele Lopes","Lopes e Martins Advogados","Feminino","Belo Horizonte MG","Serviços","Pessoa Física","Sim","4","17/03/2026"],["Rosa Surek","Surek Calçados","Feminino","Quedas do Iguaçu PR","Comércio","Pessoa Física","Sim","7","17/03/2026"],["Giovane Zembruski","HG Business School","Masculino","Chapecó SC","Educação","Pessoa Jurídica e Pessoa Física","Sim","8","17/03/2026"],["Diego Censi","Vinícola Pericó","Masculino","São Joaquim SC","Alimentação e Bebidas","Pessoa Jurídica","Não","7","17/03/2026"],["Andy Gasparetto","Valorize Negócios Imobiliários","Masculino","Cascavel PR","Construção e Imobiliário","Pessoa Jurídica e Pessoa Física","Sim","7","17/03/2026"],["Cleber Ganassini","4Person","Masculino","Cascavel PR","Serviços","Pessoa Jurídica e Pessoa Física","Sim","9","17/03/2026"],["Fernanda Zembruski","HG Business School","Feminino","Chapecó SC","Educação","Pessoa Jurídica e Pessoa Física","Sim","6","17/03/2026"],["Tharyan Andrade","Kidsaber","Masculino","Mundo Novo MS","Saúde e Bem-Estar","Pessoa Física","Sim","8","18/03/2026"],["Diego Perosa","Laticínios Perosa","Masculino","Iraceminha SC","Agroindústria","Pessoa Jurídica e Pessoa Física","Não","9","18/03/2026"],["Marcos Soligo","Ademicon","Masculino","Chapecó SC","Finanças e Seguros","Pessoa Jurídica e Pessoa Física","Sim","8","18/03/2026"],["Marinilse Corso","Veja Bem Ótica","Feminino","Xanxerê SC","Comércio","Pessoa Física","Sim","6","18/03/2026"],["William Avancini","WJTI & Kadosh","Masculino","São Paulo SP","Serviços","Pessoa Jurídica","Sim","5","18/03/2026"],["Regis Prestes","BS Advogados","Masculino","Porto Alegre RS","Serviços","Pessoa Física","Sim","9","18/03/2026"],["Jonilde Surek","SUREK Calçados","Feminino","Quedas do Iguaçu PR","Comércio","Pessoa Física","Sim","7","19/03/2026"],["Fernando Johann","Valorize Negócios Imobiliários","Masculino","Cascavel PR","Construção e Imobiliário","Pessoa Jurídica e Pessoa Física","Sim","7","19/03/2026"],["Roberto Chiamente","Beto Imóveis Litoral","Masculino","Itapema SC","Construção e Imobiliário","Pessoa Física","Não","5","19/03/2026"],["Bruno Elicker","Referência Cell","Masculino","Embu das Artes SP","Comércio","Pessoa Física","Não","7","19/03/2026"],["Caio Tadeu","Tave Pharma","Masculino","Salvador BA","Saúde e Bem-Estar","Pessoa Física","Sim","8","19/03/2026"],["Paulo Reichle","Grupo Millenium","Masculino","Criciúma SC","Serviços","Pessoa Jurídica e Pessoa Física","Sim","8","19/03/2026"],["Felipe Reichle","Millenium Crematório","Masculino","Criciúma SC","Serviços","Pessoa Jurídica e Pessoa Física","Não","4","19/03/2026"],["Gilmar Bispo","Cadorna Advocacia","Masculino","Itabuna BA","Serviços","Pessoa Jurídica e Pessoa Física","Sim","7","19/03/2026"],["Raul Pinheiro","Ademicon","Masculino","Chapecó SC","Finanças e Seguros","Pessoa Jurídica e Pessoa Física","Sim","8","19/03/2026"],["Fabio Quintanilha","Síndicos de Valor","Masculino","São José SC","Educação","Pessoa Jurídica e Pessoa Física","Sim","8","20/03/2026"],["Cibele Magalhães","MR Soluções","Feminino","Sabará MG","Serviços","Pessoa Jurídica","Sim","6","20/03/2026"],["Vanessa Quintanilha","Síndicos de Valor","Feminino","São José SC","Educação","Pessoa Jurídica e Pessoa Física","Sim","8","20/03/2026"],["Ana Venâncio","VilaGreen","Feminino","Tangará da Serra MT","Meio Ambiente","Pessoa Jurídica e Pessoa Física","Não","7","20/03/2026"],["Mara Ribaski","Farmácias Rio Branco","Feminino","Paraná PR","Saúde e Bem-Estar","Pessoa Jurídica e Pessoa Física","Sim","7","20/03/2026"],["Juliana Corso","Veja Bem Ótica","Feminino","Xanxerê SC","Comércio","Pessoa Jurídica e Pessoa Física","Sim","7","20/03/2026"],["Simone Kostaneski","LS Clínica Médica","Feminino","Erechim RS","Serviços","Pessoa Jurídica e Pessoa Física","Não","5","21/03/2026"],["Luciano Artifon","LS Centro Clínico","Masculino","Erechim RS","Serviços","Pessoa Jurídica","Não","5","21/03/2026"],["Schmitz","Grupo Dass","Feminino","Saudades SC","Indústria","Pessoa Jurídica","Sim","6","22/03/2026"],["Leonardo Soares","Sollis Construtora","Masculino","Francisco Beltrão PR","Construção e Imobiliário","Pessoa Física","Sim","7","23/03/2026"],["Zboralski","Clinica Mariana Zboralski","Feminino","Rio Verde GO","Saúde e Bem-Estar","Pessoa Física","Sim","8","23/03/2026"],["Almeida","Macan Projetos Ambientais","Masculino","Cuiabá MT","Meio Ambiente","Pessoa Física","Sim","7","23/03/2026"],["Marcelo de Vargas","Axdoc Tecnologia","Masculino","Francisco Beltrão PR","Tecnologia e Inovação","Pessoa Jurídica","Não","9","23/03/2026"],["Joseline Schmitz","Constrular Imóveis","Feminino","Pinhalzinho SC","Serviços","Pessoa Física","Sim","8","24/03/2026"]];
const FAQ_DATA = [
  {q:"O que é o PCE — Programa de Crescimento Empresarial?",a:"O PCE é um programa intensivo da Febracis voltado para empresários que desejam escalar seus negócios com estrutura, liderança e crescimento sustentável. Ao longo do programa, os participantes passam por imersões, mentorias e ferramentas práticas de gestão."},
  {q:"Quais são as imersões do PCE T14?",a:"O PCE T14 possui duas imersões: a Imersão Brasil (BR Confirmado), realizada em território nacional, e a Imersão Brasil + Orlando (BR + US Confirmado), que inclui também uma imersão presencial em Orlando, nos Estados Unidos."},
  {q:"O que significa o status 'BR + US CONFIRMADO'?",a:"Significa que o participante confirmou presença nas duas imersões: a imersão no Brasil e a imersão em Orlando, EUA. Esses participantes têm acesso a uma experiência ampliada do programa."},
  {q:"O que é o Onboarding do PCE?",a:"O onboarding é o processo de integração dos participantes ao programa. Inclui o preenchimento do formulário Typeform, assinatura do contrato, inclusão no grupo do WhatsApp e realização do formulário de perfil da turma."},
  {q:"O que é o status 'Próxima Turma'?",a:"Participantes com status 'Próxima Turma' foram matriculados mas optaram por migrar para uma edição futura do programa. Não farão parte da T14."},
  {q:"Como os dados deste dashboard são atualizados?",a:"Os dados são buscados diretamente da planilha de gestão via Google Apps Script. Ao clicar em 'Atualizar', o sistema busca as informações mais recentes em tempo real. A atualização também acontece automaticamente a cada 5 minutos."},
];
const Logger=(()=>{const p='[PCE]',ts=()=>new Date().toISOString().slice(11,23);return{info:(o,m,c={})=>console.log(`${p} ${ts()} ℹ️  [${o}] ${m}`,Object.keys(c).length?c:''),warn:(o,m,c={})=>console.warn(`${p} ${ts()} ⚠️  [${o}] ${m}`,Object.keys(c).length?c:''),error:(o,m,c={})=>console.error(`${p} ${ts()} 🔴 [${o}] ${m}`,Object.keys(c).length?c:''),debug:(o,m,c={})=>{if(window._PCE_DEBUG)console.debug(`${p} ${ts()} 🔍 [${o}] ${m}`,Object.keys(c).length?c:'');},perf:(o,l,s)=>console.log(`${p} ${ts()} ⚡ [${o}] ${l} — ${Date.now()-s}ms`)};})();
window._PCE_DEBUG=false;
function validateBrPayload(raw){
  // Só bloqueia se o payload for inválido estruturalmente
  if(!raw||typeof raw!=='object') return{valid:false,errors:['payload nulo']};
  if(!Array.isArray(raw.rows)){
    Logger.error('VALIDATE','BR: rows nao e array',{keys:Object.keys(raw||{}).slice(0,6)});
    return{valid:false,errors:['rows nao array']};
  }
  // total: aceitar ausente ou string numérica — nunca bloquear
  if(raw.total!==undefined && typeof raw.total!=='number'){
    raw.total = Number(raw.total) || raw.rows.length;
  }
  // Campos ausentes: só warning, nunca bloqueia
  if(raw.rows.length>0){
    const sample=raw.rows.slice(0,3);
    const missing=SCHEMA.br.rowRequiredFields.filter(f=>!sample.every(r=>f in r));
    if(missing.length>0) Logger.warn('VALIDATE','BR campos ausentes (ignorado)',{missing});
  }
  return{valid:true,errors:[]};
}
function validateUsPayload(raw){const errors=[];if(!raw||typeof raw!=='object'){errors.push('payload nulo');return{valid:false,errors};}if(typeof raw.total!=='number')errors.push('total deve ser number');if(typeof raw.confirmados!=='number')errors.push('confirmados deve ser number');if(raw.total<SCHEMA.us.minTotal)errors.push(`total inválido: ${raw.total}`);if(raw.version&&raw.version!==API_SCHEMA_VERSION){Logger.warn('SCHEMA',`Versão do schema Orlando incompatível: ${raw.version}`);}return{valid:errors.length===0,errors};}
function normalizeStatus(raw){if(!raw||typeof raw!=='string')return'';const s=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim().replace(/\.+$/,'').replace(/\s+/g,' ');if(s==='BR + US CONFIRMAOD')return'BR + US CONFIRMADO';if(s==='BR + US CONFIRMADO')return'BR + US CONFIRMADO';if(s==='PROXIMA TURMA')return'PROXIMA TURMA';if(s==='SEM RETORNO')return'SEM RETORNO';if(s==='BR CONFIRMADO')return'BR CONFIRMADO';if(s==='US CONFIRMADO')return'US CONFIRMADO';if(s==='CONFIRMADO')return'CONFIRMADO';if(s==='CANCELAMENTO')return'CANCELAMENTO';if(s==='NAO VAI PARTICIPAR')return'NAO VAI PARTICIPAR';if(s==='NAO CHAMAR')return'NAO CHAMAR';if(s==='TROCA DE CONS')return'TROCA DE CONS';return s;}
function normalizeOnboarding(raw){if(!raw||typeof raw!=='string')return'NAO_INICIADO';const s=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim().replace(/\.+$/,'').replace(/\s+/g,' ');if(s==='REALIZADO')return'REALIZADO';if(s==='INICIADO')return'INICIADO';if(s==='SEM RETORNO')return'SEM_RETORNO';if(s==='NAO INICIADO')return'NAO_INICIADO';if(s.includes('PENDENTE'))return'PENDENTE';return'NAO_INICIADO';}
function computeStatsFromRows(rows){const presenca={brConfirmado:0,brUs:0,usConfirmado:0,confirmado:0,semRetorno:0,cancelamento:0,proximaTurma:0,naoVaiParticipar:0,naoChamar:0,trocaCons:0,totalConfirmados:0,turmaValida:0};const onboarding={realizado:0,iniciado:0,pendente:0,naoIniciado:0};const operacional={whatsOk:0,typeformOk:0,typeformEnv:0,contratoOk:0,typeformOkConfirmados:0,typeformOkSemRetorno:0,typeformOkValida:0};const eventos={brasil:0,orlando:0};for(const r of rows){const p=normalizeStatus(r.presenca);const isConfirmado=(p==='BR CONFIRMADO'||p==='BR + US CONFIRMADO'||p==='US CONFIRMADO'||p==='CONFIRMADO');const isSemRetorno=(p==='SEM RETORNO');if(p==='BR CONFIRMADO')presenca.brConfirmado++;else if(p==='BR + US CONFIRMADO')presenca.brUs++;else if(p==='US CONFIRMADO')presenca.usConfirmado++;else if(p==='CONFIRMADO')presenca.confirmado++;else if(p==='SEM RETORNO')presenca.semRetorno++;else if(p==='CANCELAMENTO')presenca.cancelamento++;else if(p==='PROXIMA TURMA')presenca.proximaTurma++;else if(p==='NAO VAI PARTICIPAR')presenca.naoVaiParticipar++;else if(p==='NAO CHAMAR')presenca.naoChamar++;else if(p==='TROCA DE CONS')presenca.trocaCons++;const ob=normalizeOnboarding(r.onboarding);if(ob==='REALIZADO')onboarding.realizado++;else if(ob==='PENDENTE')onboarding.pendente++;else if(ob==='INICIADO')onboarding.iniciado++;else onboarding.naoIniciado++;if((r.whats||'').toUpperCase()==='SIM')operacional.whatsOk++;const tf=(r.typeform||'').toUpperCase();const tfPreenchido=(tf==='PREENCHIDO');if(tfPreenchido)operacional.typeformOk++;else if(tf==='ENVIADO')operacional.typeformEnv++;if(tfPreenchido&&isConfirmado)operacional.typeformOkConfirmados++;if(tfPreenchido&&isSemRetorno)operacional.typeformOkSemRetorno++;if((r.contrato||'').toUpperCase()==='SIM')operacional.contratoOk++;const ev=(r.evento||'').toUpperCase();if(ev.includes('ORLANDO'))eventos.orlando++;else eventos.brasil++;}presenca.totalConfirmados=presenca.brConfirmado+presenca.brUs+presenca.usConfirmado+presenca.confirmado;presenca.turmaValida=presenca.totalConfirmados+presenca.semRetorno;operacional.typeformOkValida=operacional.typeformOkConfirmados+operacional.typeformOkSemRetorno;return{presenca,onboarding,operacional,eventos};}
function normalizeBrPayload(raw){try{const t0=Date.now();const{valid,errors}=validateBrPayload(raw);if(!valid){Logger.error('NORMALIZE','Payload Brasil inválido — descartando',{errors,raw:typeof raw});return null;}const rows=raw.rows;const stats=(raw.stats&&raw.stats.presenca)?raw.stats:computeStatsFromRows(rows);if(!stats.presenca){Logger.warn('NORMALIZE','stats.presenca ausente — recalculando',{total:rows.length});}const result={rows,stats,total:rows.length,updated:raw.updated||new Date().toISOString(),version:raw.version||'unknown',source:'api_live',pendingTransfers:Array.isArray(raw.pendingTransfers)?raw.pendingTransfers:undefined,pendingTransferCount:(typeof raw.pendingTransferCount==='number')?raw.pendingTransferCount:undefined,dossieForaOnboarding:Array.isArray(raw.dossieForaOnboarding)?raw.dossieForaOnboarding:undefined,cartas:(raw.cartas&&typeof raw.cartas==='object')?raw.cartas:undefined,frases:(raw.frases&&typeof raw.frases==='object')?raw.frases:undefined,conciliacao:(raw.conciliacao&&typeof raw.conciliacao==='object')?raw.conciliacao:undefined};Logger.perf('NORMALIZE','normalizeBrPayload',t0);return result;}catch(e){Logger.error('NORMALIZE','Exceção em normalizeBrPayload',{message:e.message});return null;}}
function normalizeUsPayload(raw){try{const{valid,errors}=validateUsPayload(raw);if(!valid){Logger.error('NORMALIZE','Payload Orlando inválido — descartando',{errors});return null;}const total=raw.total;const confirmados=raw.confirmados;const stats=raw.stats||{confirmado:confirmados,semRetorno:0,cancelamento:0,outros:0};return{rows:raw.rows||[],total,confirmados,stats,updated:raw.updated||new Date().toISOString(),version:raw.version||'unknown',source:'api_live'};}catch(e){Logger.error('NORMALIZE','Exceção em normalizeUsPayload',{message:e.message});return null;}}
const store={br:{rows:null,stats:null,updated:null,version:null,source:null},t15:{rows:null,stats:null,updated:null,version:null,source:null},t16:{rows:null,stats:null,updated:null,version:null,source:null},us:{data:null,updated:null,version:null,source:null},meta:{brLoading:false,isOffline:false,currentView:'t15',lastFetchAt:null,fetchCount:0,fetchToken:0}};
/* Espelho somente leitura para diagnostico por console. Nao usar em logica. */
try{window._PCE_STORE=store;}catch(e){}
function storeUpdateT(key, payload){
  if(!payload){Logger.warn('STORE','storeUpdate'+key+': payload nulo');return false;}
  store[key].rows=payload.rows;store[key].stats=payload.stats;
  store[key].updated=payload.updated;store[key].version=payload.version;
  store[key].source=payload.source||'api_live';
  store[key].pendingTransfers=payload.pendingTransfers;store[key].pendingTransferCount=payload.pendingTransferCount;store[key].dossieForaOnboarding=payload.dossieForaOnboarding;
  /* V54.1: blocos de producao (Cartas/Frases). Sem estas duas linhas o payload chega mas morre aqui e o card cai no cache. */
  store[key].cartas=payload.cartas;store[key].frases=payload.frases;store[key].conciliacao=payload.conciliacao;
  Logger.info('STORE',key+' atualizado',{total:payload.rows.length,source:store[key].source,cartas:!!payload.cartas,frases:!!payload.frases,conciliacao:!!payload.conciliacao});
  return true;
}
function storeUpdateBr(payload){if(!payload){Logger.warn('STORE','storeUpdateBr: payload nulo — mantendo dados anteriores');return false;}store.br.rows=payload.rows;store.br.stats=payload.stats;store.br.updated=payload.updated;store.br.version=payload.version;store.br.source=payload.source||'api_live';store.br.pendingTransfers=payload.pendingTransfers;store.br.pendingTransferCount=payload.pendingTransferCount;Logger.info('STORE','Brasil atualizado',{total:payload.rows.length,source:store.br.source,version:store.br.version});return true;}
function storeUpdateUs(payload){if(!payload){Logger.warn('STORE','storeUpdateUs: payload nulo — mantendo dados anteriores');return false;}store.us.data=payload;store.us.updated=payload.updated;store.us.version=payload.version;store.us.source=payload.source||'api_live';Logger.info('STORE','Orlando atualizado',{total:payload.total,confirmados:payload.confirmados});return true;}
function storeSetOffline(isOffline){store.meta.isOffline=isOffline;const banner=document.getElementById('offline-banner');if(banner)banner.classList.toggle('hidden',!isOffline);}
function jsonp(url,name,timeoutMs=15000){return new Promise((resolve,reject)=>{const cbName='_pce_cb_'+name+'_'+Date.now()+'_'+Math.random().toString(36).slice(2);let done=false;const timer=setTimeout(()=>{if(done)return;done=true;cleanup();reject(new Error('Timeout JSONP: '+name));},timeoutMs);function cleanup(){clearTimeout(timer);try{delete window[cbName];}catch(e){}const el=document.getElementById('jsonp_'+cbName);if(el)el.remove();}window[cbName]=function(data){if(done)return;done=true;cleanup();resolve(data);};const script=document.createElement('script');script.id='jsonp_'+cbName;script.onerror=()=>{if(done)return;done=true;cleanup();reject(new Error('Script error JSONP: '+name));};script.src=url+(url.includes('?')?'&':'?')+'callback='+cbName;document.head.appendChild(script);});}
async function fetchWithRetry(sourceConfig,token){const{id,url,timeout,retries,retryDelay,label}=sourceConfig;let lastError;for(let attempt=0;attempt<=retries;attempt++){if(store.meta.fetchToken!==token){Logger.debug('FETCH',`[${id}] Fetch cancelado — token obsoleto`,{expected:token,current:store.meta.fetchToken});throw new Error('CANCELLED');}if(attempt>0){const delay=retryDelay*Math.pow(2,attempt-1);Logger.warn('FETCH',`[${id}] Retry ${attempt}/${retries} em ${delay}ms`,{lastError:lastError?.message});await new Promise(r=>setTimeout(r,delay));if(store.meta.fetchToken!==token)throw new Error('CANCELLED');}try{const t0=Date.now();Logger.info('FETCH',`[${id}] Tentativa ${attempt+1}/${retries+1} — ${label}`);const data=await jsonp(url,id+'_'+attempt,timeout);Logger.perf('FETCH',`[${id}] Resposta recebida`,t0);return data;}catch(e){lastError=e;Logger.warn('FETCH',`[${id}] Tentativa ${attempt+1} falhou`,{error:e.message});}}throw new Error(`[${id}] Todas as ${retries+1} tentativas falharam. Último erro: ${lastError?.message}`);}
// ── Render agnóstico de view: repinta o que está na tela (debounce em rAF) ──
var __renderRAF=null;
function renderActive(){
  if(__renderRAF)cancelAnimationFrame(__renderRAF);
  __renderRAF=requestAnimationFrame(function(){
    __renderRAF=null;
    try{renderCurrentView();}catch(e){if(window.Logger)Logger.warn('UI','renderActive/view',{err:e&&e.message});}
    try{var pf=document.getElementById('page-perfil');if(pf&&pf.classList.contains('active'))buildPerfil();}catch(e){}
    try{var ins=document.getElementById('page-insights');if(ins&&ins.classList.contains('active')&&window.renderInsightsCorrelacionais)window.renderInsightsCorrelacionais();}catch(e){}
  });
}
async function fetchAllData(silent=false){
  const token=++store.meta.fetchToken;
  const btn=document.getElementById('btnR');
  try {
    Logger.info('FETCH','Iniciando fetch progressivo',{token,silent,fetchCount:++store.meta.fetchCount});
    store.meta.brLoading=true;
    const t0=Date.now();
    if(!silent){if(btn){btn.disabled=true;btn.classList.add('spinning');}setStatus('load','Buscando...');}
    const stale=function(){return store.meta.fetchToken!==token;};

    // BR — caminho rápido: pinta assim que chega, sem esperar T15/T16
    const pBr=fetchWithRetry(DATA_SOURCES.br,token).then(function(v){
      if(stale())return false;
      var ok=storeUpdateBr(normalizeBrPayload(v));
      if(ok){
        store.meta.brLoading=false;store.meta.lastFetchAt=new Date().toISOString();
        storeSetOffline(false);setStatus('ok','\u{1F1E7}\u{1F1F7} '+store.br.rows.length+' registros');updateTimestamp();
        renderActive();
      }else{Logger.warn('FETCH','Brasil: payload invalido apos normalizacao');}
      return ok;
    }).catch(function(e){
      if(e&&e.message!=='CANCELLED')Logger.error('FETCH','Falha definitiva API Brasil',{error:e&&e.message});
      return false;
    });

    // T15 — pinta quando cair (independente do BR)
    const pT15=DATA_SOURCES.t15.url?fetchWithRetry(DATA_SOURCES.t15,token).then(function(v){
      if(stale())return;
      var n=normalizeBrPayload(v);if(n)storeUpdateT('t15',n);
      try{if(typeof window.__refreshT15Banner==='function')window.__refreshT15Banner();}catch(_e){}
      renderActive();
    }).catch(function(e){if(e&&e.message!=='CANCELLED')Logger.warn('FETCH','T15 falhou',{error:e&&e.message});}):Promise.resolve();

    // T16 — idem
    const pT16=DATA_SOURCES.t16.url?fetchWithRetry(DATA_SOURCES.t16,token).then(function(v){
      if(stale())return;
      var n=normalizeBrPayload(v);if(n){storeUpdateT('t16',n);renderActive();}
    }).catch(function(e){if(e&&e.message!=='CANCELLED')Logger.warn('FETCH','T16 falhou',{error:e&&e.message});}):Promise.resolve();

    var brOk=false;
    try{brOk=await pBr;}catch(_e){brOk=false;}
    await Promise.allSettled([pT15,pT16]);
    if(stale())return;

    store.meta.brLoading=false;

    // BR falhou e sem dados em memoria -> fallback estatico offline
    if(!brOk){
      if(!store.br.rows||!store.br.rows.length){
        Logger.info('FETCH','Carregando FALLBACK estatico',{rows:FALLBACK.length,capturedAt:FALLBACK_META.capturedAt});
        var fb=normalizeBrPayload({rows:FALLBACK,stats:null});
        if(fb){fb.source='static_embedded';storeUpdateBr(fb);}
      }
      storeSetOffline(true);setStatus('err','Cache local');updateTimestamp('(cache)');
    }

    await fetchNetworkingPV().catch(function(){});
    renderActive();
    Logger.perf('FETCH','fetchAllData completo',t0);
  } catch(err) {
    Logger.error('FETCH','Erro inesperado',{msg:err&&err.message});
    try{setStatus('err','Erro de conexao');}catch(_e){}
  } finally {
    store.meta.brLoading=false;
    Loader.hide();
    if (!silent) {
      var _btn = document.getElementById('btnR');
      if (_btn) { _btn.disabled=false; _btn.classList.remove('spinning'); }
    }
  }
}
const G='#f5a623',G2='#3d2e0a',G3='#e09018',AM='#f5c542',RD='#ff5f5f',BL='#4d9fff',CR='#EAE5E1';
const PAL=[G,BL,AM,RD,'#a78bfa','#f472b6','#2dd4bf','#fb923c',G2,'#facc15','#34d399','#60a5fa'];
const CHART_REGISTRY={};
const LC='#adada8',GC='rgba(255,255,255,.035)';
const TOOLTIP_DEFAULTS={backgroundColor:'#1a1a18',borderColor:'rgba(245,166,35,.12)',borderWidth:1,titleColor:CR,bodyColor:'#7a7a76',titleFont:{family:'Barlow',weight:'600',size:12},bodyFont:{family:'Barlow',size:12},padding:10};
function destroyChart(id){if(CHART_REGISTRY[id]){try{CHART_REGISTRY[id].destroy();}catch(e){}delete CHART_REGISTRY[id];}}
function safeEl(id){const el=document.getElementById(id);if(!el)Logger.debug('UI',`Elemento não encontrado: ${id}`);return el;}
function safeRender(name,fn){
  if(name==='kpi-dash' && !window.__kpiDashReady){
    // Guarda a versão mais recente da função (dados ao vivo, se já chegaram)
    window.__kpiDashPendingFn = fn;
    // Inicia o scheduler dinâmico apenas uma vez
    if(!window.__kpiDashScheduled){
      window.__kpiDashScheduled = true;
      __kpiDashStartWatcher();
    }
    return;
  }
  try{fn();}catch(e){Logger.error('UI',`Falha isolada ao renderizar: ${name}`,{message:e.message});const el=document.getElementById(name);if(el)el.innerHTML='<div style="color:var(--muted);font-size:11px;padding:20px;text-align:center">⚠️ Erro ao renderizar</div>';}
}

// ── Scheduler do skeleton dos 4 KPIs ─────────────────────────
// Lógica: enquanto o offline-banner ("Modo cache") estiver visível,
// mantém o P pulsando. Quando o banner sumir (= API respondeu com dados
// ao vivo), segura mais 2s por capricho estético e revela os KPIs.
// Garantias:
//   - Tempo mínimo de exibição do skeleton: 1.5s (pra parecer intencional)
//   - Safety timeout máximo: 15s (caso API nunca responda)
function __kpiDashStartWatcher(){
  var startTime = Date.now();
  var BUFFER_AFTER_LOAD = 3000;  // 3s extras após banner sumir
  var MIN_DISPLAY      = 1500;   // skeleton aparece por no mínimo 1.5s
  var SAFETY_MAX       = 15000;  // fallback se API nunca responde
  var observer = null;
  var safetyTimer = null;
  function revealKpis(){
    if(window.__kpiDashReady) return;
    window.__kpiDashReady = true;
    if(observer){ observer.disconnect(); observer = null; }
    if(safetyTimer){ clearTimeout(safetyTimer); safetyTimer = null; }
    window.__kpiDashPendingFn = null;
    // Re-renderiza a view atual com os dados JÁ atualizados do store
    // (evita exibir um valor antigo capturado antes do dado vivo chegar).
    try{ if(typeof renderCurrentView==='function') renderCurrentView(); }
    catch(e){ if(window.Logger) Logger.error('UI','Falha kpi-dash reveal',{message:e.message}); }
  }
  function revealAfterBuffer(){
    var elapsed = Date.now() - startTime;
    var wait = Math.max(MIN_DISPLAY - elapsed, BUFFER_AFTER_LOAD);
    setTimeout(revealKpis, wait);
  }
  var banner = document.getElementById('offline-banner');
  if(!banner){
    // Fallback: sem banner, espera 4.5s como antes
    setTimeout(revealKpis, 4500);
    return;
  }
  // Banner já hidden no boot (improvável mas possível)
  if(banner.classList.contains('hidden')){
    revealAfterBuffer();
    return;
  }
  // Observa quando o banner ganha class 'hidden' (API respondeu)
  observer = new MutationObserver(function(){
    if(banner.classList.contains('hidden')){
      observer.disconnect();
      observer = null;
      revealAfterBuffer();
    }
  });
  observer.observe(banner, { attributes:true, attributeFilter:['class'] });
  // Safety: revela em 15s mesmo se a API nunca responder
  safetyTimer = setTimeout(revealKpis, SAFETY_MAX);
}
// ──── Helpers globais (v44): FAIXA_MEDIA + fatMedioRow para uso fora do IIFE ────
const FAIXA_MEDIA_GLOBAL = {
  'ATE R$ 81.000,00': 40500,
  'DE R$ 81.000,01 A R$ 360.000,00': 220500,
  'DE R$ 360.000,01 A R$ 1.500.000,00': 930000,
  'DE R$ 1.500.000,01 A R$ 4.800.000,00': 3150000,
  'DE R$ 4.800.000,01 A R$ 10.000.000,00': 7400000,
  'DE R$ 10.000.000,01 A R$ 30.000.000,00': 20000000,
  'DE R$ 30.000.000,01 A R$ 100.000.000,00': 65000000,
  'DE R$ 100.000.000,01 A R$ 300.000.000,00': 200000000,
  'DE R$ 300.000.000,01 A R$ 500.000.000,00': 400000000,
  'DE R$ 500.000.000,01 A R$ 1.000.000.000,00': 750000000
};
function isSemRetornoFatGlobal(v) {
  return /^\s*sem\s*retorno?\s*$/i.test(v||'') || /^\s*sem\s*$/i.test(v||'');
}
function fatMedioRowGlobal(r) {
  const ff = (r.faixaFat||'').trim();
  if (isSemRetornoFatGlobal(ff)) return 0;
  return FAIXA_MEDIA_GLOBAL[ff] || 0;
}
function faixaFatLabelGlobal(v) {
  const map = {'ATE R$ 81.000,00':'Até 81k','DE R$ 81.000,01 A R$ 360.000,00':'81k–360k','DE R$ 360.000,01 A R$ 1.500.000,00':'360k–1,5M','DE R$ 1.500.000,01 A R$ 4.800.000,00':'1,5M–4,8M','DE R$ 4.800.000,01 A R$ 10.000.000,00':'4,8M–10M','DE R$ 10.000.000,01 A R$ 30.000.000,00':'10M–30M','DE R$ 30.000.000,01 A R$ 100.000.000,00':'30M–100M','DE R$ 100.000.000,01 A R$ 300.000.000,00':'100M–300M','DE R$ 300.000.000,01 A R$ 500.000.000,00':'300M–500M','DE R$ 500.000.000,01 A R$ 1.000.000.000,00':'500M–1B'};
  return map[v] || (v||'').substring(0,14);
}
function fmtBRLGlobal(v) {
  if (v >= 1e6) return 'R$ ' + (v/1e6).toFixed(1) + 'M';
  if (v >= 1e3) return 'R$ ' + (v/1e3).toFixed(0) + 'k';
  return 'R$ ' + (v||0).toFixed(0);
}
// ──── Helpers globais (v43): bar labels + cobertura ────
function barLabelsPlugin(formatter, options) {
  const opts = options || {};
  return {
    id: 'barLabels_' + Math.random().toString(36).slice(2,9),
    afterDatasetsDraw(chart) {
      const ds = chart.data && chart.data.datasets && chart.data.datasets[0];
      if (!ds || !ds.data) return;
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.data) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = (opts.fontWeight || '700') + " " + (opts.fontSize || '12') + "px 'Barlow Condensed', 'Barlow', sans-serif";
      ctx.fillStyle = opts.color || '#EAE5E1';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ds.data.forEach((value, i) => {
        const bar = meta.data[i];
        if (!bar || value == null) return;
        const label = formatter(value, i);
        if (!label) return;
        ctx.fillText(label, bar.x + 6, bar.y);
      });
      ctx.restore();
    }
  };
}
function appendCobertura(canvasId, totalAnalisado, totalBase, motivo) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  let card = canvas.parentElement;
  while (card && !card.classList.contains('card') && !card.classList.contains('carf')) {
    card = card.parentElement;
  }
  if (!card) return;
  const existing = card.querySelector('.ins-cobertura[data-for="' + canvasId + '"]');
  if (existing) existing.remove();
  if (totalBase <= 0) return;
  const pct = Math.round(totalAnalisado/totalBase*100);
  const semDados = totalBase - totalAnalisado;
  const div = document.createElement('div');
  div.className = 'ins-cobertura';
  div.setAttribute('data-for', canvasId);
  if (semDados > 0) {
    div.innerHTML = '<strong>' + totalAnalisado + ' de ' + totalBase + '</strong> confirmados analisados (' + pct + '% de cobertura) — os outros ' + semDados + ' ' + motivo;
  } else {
    div.innerHTML = '<strong>' + totalAnalisado + ' de ' + totalBase + '</strong> confirmados analisados (100% de cobertura)';
  }
  card.appendChild(div);
}
// Cobertura para containers genéricos (não-canvas) — usa o cardId direto
function appendCoberturaContainer(containerId, totalAnalisado, totalBase, motivo) {
  const el = document.getElementById(containerId);
  if (!el) return;
  let card = el.parentElement;
  while (card && !card.classList.contains('card') && !card.classList.contains('carf')) {
    card = card.parentElement;
  }
  if (!card) return;
  const existing = card.querySelector('.ins-cobertura[data-for="' + containerId + '"]');
  if (existing) existing.remove();
  if (totalBase <= 0) return;
  const pct = Math.round(totalAnalisado/totalBase*100);
  const semDados = totalBase - totalAnalisado;
  const div = document.createElement('div');
  div.className = 'ins-cobertura';
  div.setAttribute('data-for', containerId);
  if (semDados > 0) {
    div.innerHTML = '<strong>' + totalAnalisado + ' de ' + totalBase + '</strong> confirmados analisados (' + pct + '% de cobertura) — os outros ' + semDados + ' ' + motivo;
  } else {
    div.innerHTML = '<strong>' + totalAnalisado + ' de ' + totalBase + '</strong> confirmados analisados (100% de cobertura)';
  }
  card.appendChild(div);
}
function renderLegend(id,labels,data,colors){safeRender('legend_'+id,()=>{const el=safeEl(id);if(!el)return;const total=data.reduce((a,b)=>a+b,0);el.innerHTML=labels.map((l,i)=>`<span><span class="ld" style="background:${colors[i%colors.length]}"></span>${l}: <strong style="color:${CR}">${data[i]}</strong> <span style="color:#7a7a76">(${Math.round(data[i]/total*100)}%)</span></span>`).join('');});}
function renderDonut(id,labels,data,colors){safeRender(id,()=>{destroyChart(id);const el=safeEl(id);if(!el)return;CHART_REGISTRY[id]=new Chart(el,{type:'doughnut',data:{labels,datasets:[{data,backgroundColor:colors,borderColor:'#252523',borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS}}});});}
function renderHBar(id,labels,data,palette,valueFormatter){safeRender(id,()=>{destroyChart(id);const el=safeEl(id);if(!el)return;const plugs=(valueFormatter&&typeof barLabelsPlugin==='function')?[barLabelsPlugin(valueFormatter)]:[];const padR=valueFormatter?55:8;CHART_REGISTRY[id]=new Chart(el,{type:'bar',data:{labels,datasets:[{data,backgroundColor:labels.map((_,i)=>palette[i%palette.length]),borderColor:'transparent',borderRadius:5,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:padR}},plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{family:'Barlow',size:11}},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{family:'Barlow',size:11},padding:4},border:{color:'transparent'}}}},plugins:plugs});});}
function renderVBar(id,labels,data,colors){safeRender(id,()=>{destroyChart(id);const el=safeEl(id);if(!el)return;CHART_REGISTRY[id]=new Chart(el,{type:'bar',data:{labels,datasets:[{data,backgroundColor:colors,borderColor:'transparent',borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{title:c=>`Nota ${c[0].label}`}}},scales:{x:{grid:{display:false},ticks:{color:LC,font:{family:'Barlow',size:11}},border:{color:'transparent'}},y:{grid:{color:GC},ticks:{color:LC,font:{family:'Barlow',size:10},stepSize:1},border:{color:'transparent'},min:0}}}});});}
function renderLine(id,labels,data,color){safeRender(id,()=>{destroyChart(id);const el=safeEl(id);if(!el)return;const ctx=el.getContext('2d');const gr=ctx.createLinearGradient(0,0,0,120);gr.addColorStop(0,color+'30');gr.addColorStop(1,color+'00');CHART_REGISTRY[id]=new Chart(ctx,{type:'line',data:{labels,datasets:[{data,borderColor:color,borderWidth:2.5,pointBackgroundColor:color,pointRadius:data.map(v=>v>1?4:2),fill:true,backgroundColor:gr,tension:.4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>` ${c.parsed.y} reg.`}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{family:'Barlow',size:9},maxRotation:35},border:{color:'transparent'}},y:{grid:{color:GC},ticks:{color:LC,font:{family:'Barlow',size:9},stepSize:1},border:{color:'transparent'},min:0}}}});});}
function countBy(arr){return arr.reduce((o,v)=>{o[v]=(o[v]||0)+1;return o;},{});}
function topN(obj,n=12){return Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n);}
function buildTicker(items){if(!Array.isArray(items)||items.length===0){Logger.warn('TICKER','items vazio');return;}const html=items.map(i=>`<div class="ticker-item"><div><div class="t-label">${i.lbl}</div><div style="display:flex;align-items:baseline;gap:4px"><span class="t-val ${i.cls||'w'}">${i.val}</span>${i.tag?`<span class="t-tag ${i.tag.cls}">${i.tag.txt}</span>`:''}</div></div></div>`).join('');const track=safeEl('ticker-track');if(!track)return;track.innerHTML=html+html;track.style.animationDuration=Math.max(items.length*4,20)+'s';}
const PENDING_BY_TURMA={'T14':[],'T15':['Virgínia Horst Beckhauser','Leonardo Amancio Nunes','Paola kelly Binda','Gabriela Friedrichs Tonhá','TAIS NASCIMENTO','ALEX MESQUITA DA SILVA','Vanderson Paulino de Araujo','Erika costa guanaes Carassa','MARCELO CARASSA','tarlis faé','Elisa Ermida Ramos','FERNANDO CARPES BRAGA','Matusalem de oliveira','WALBRAM MARIO MORAES COELHO','LUCIO CARLOS DE CARVALHO BOGGIAN','Flavia Cristina Teixeira Silva','Mickael Manzela Santana Gomes','Natália Brianez Fioretti','ERICK FIORETTI','José Alexandre Borges de Figueiredo Junior','FLAVIO CUNHA LEMOS FILHO','ALEXANDRE SANTOS DE MOURA CEZAR','Alysson Santos Lisboa','BRUNA FRANCELINO','IVONE FLORENCIO BARROS LIMA','ROMARIO MARTINS DOS REIS','MARCELO ORIONE TOLENTINO LIMA JUNIOR','Vandeilson Paulino de Araujo','ronaldo ferreira'],'T16':['Shirley de Carvalho Santos','Raquel Barroso de Oliveira Figueiredo','André Rodrigo Lui']};
function _normNome(s){return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
function computePendingTransfer(entry,label){const liveCount=(entry&&typeof entry.pendingTransferCount==='number')?entry.pendingTransferCount:null;if(liveCount!=null)return liveCount;const liveList=(entry&&Array.isArray(entry.pendingTransfers))?entry.pendingTransfers:null;const rows=(entry&&entry.rows)||[];const list=liveList||PENDING_BY_TURMA[(label||'').toUpperCase()]||[];const rowNames=new Set(rows.map(r=>_normNome(r.nome)));const seen=new Set();return list.filter(n=>{const k=_normNome(n);if(!k||seen.has(k)||rowNames.has(k))return false;seen.add(k);return true;}).length;}
function buildTickerBr(stats,total,label){const pr=stats.presenca||{};const op=stats.operacional||{};const t100=v=>total>0?Math.round(v/total*100):0;const _lbl=label||'T14';const conf=pr.totalConfirmados||pr.brConfirmado||0;buildTicker([{lbl:'🇧🇷 Total da Turma '+_lbl,val:total,cls:'w',tag:null},{lbl:'🇧🇷 Confirmados',val:conf,cls:'g',tag:{txt:`${t100(conf)}%`,cls:'up'}},{lbl:'🇧🇷 Sem Retorno',val:pr.semRetorno||0,cls:'r',tag:{txt:`${t100(pr.semRetorno||0)}%`,cls:'dn'}},{lbl:'🇧🇷 Próximas Turmas',val:pr.proximaTurma||0,cls:'a',tag:null},{lbl:'🇧🇷 Cancelamentos',val:pr.cancelamento||0,cls:'r',tag:null},{lbl:'🇧🇷 Onboarding Realizado',val:stats.onboarding?.realizado||0,cls:'w',tag:{txt:`${t100(stats.onboarding?.realizado||0)}%`,cls:'neu'}},{lbl:'🇧🇷 WhatsApp',val:op.whatsOk||0,cls:'g',tag:{txt:`${t100(op.whatsOk||0)}%`,cls:'up'}},{lbl:'🇧🇷 Typeform Preenchido',val:op.typeformOk||0,cls:'a',tag:{txt:`${t100(op.typeformOk||0)}%`,cls:'neu'}},{lbl:'🇧🇷 Contrato Assinado',val:op.contratoOk||0,cls:'w',tag:{txt:`${t100(op.contratoOk||0)}%`,cls:'neu'}}]);}
function buildTickerGeralBR(turmas){let total=0,conf=0,sem=0,prox=0,cancel=0,onb=0,wa=0,tf=0,ct=0;turmas.forEach(s=>{const pr=(s.stats&&s.stats.presenca)||{};const op=(s.stats&&s.stats.operacional)||{};const ob=(s.stats&&s.stats.onboarding)||{};total+=(s.rows&&s.rows.length)||0;conf+=pr.totalConfirmados||0;sem+=pr.semRetorno||0;prox+=pr.proximaTurma||0;cancel+=pr.cancelamento||0;onb+=ob.realizado||0;wa+=op.whatsOk||0;tf+=op.typeformOk||0;ct+=op.contratoOk||0;});const t100=v=>total>0?Math.round(v/total*100):0;buildTicker([{lbl:'📊 Total Geral (T15+T16)',val:total,cls:'w',tag:null},{lbl:'🇧🇷 Confirmados',val:conf,cls:'g',tag:{txt:`${t100(conf)}%`,cls:'up'}},{lbl:'🇧🇷 Sem Retorno',val:sem,cls:'r',tag:{txt:`${t100(sem)}%`,cls:'dn'}},{lbl:'🇧🇷 Próximas Turmas',val:prox,cls:'a',tag:null},{lbl:'🇧🇷 Cancelamentos',val:cancel,cls:'r',tag:null},{lbl:'🇧🇷 Onboarding Realizado',val:onb,cls:'w',tag:{txt:`${t100(onb)}%`,cls:'neu'}},{lbl:'🇧🇷 WhatsApp',val:wa,cls:'g',tag:{txt:`${t100(wa)}%`,cls:'up'}},{lbl:'🇧🇷 Typeform Preenchido',val:tf,cls:'a',tag:{txt:`${t100(tf)}%`,cls:'neu'}},{lbl:'🇧🇷 Contrato Assinado',val:ct,cls:'w',tag:{txt:`${t100(ct)}%`,cls:'neu'}}]);}
function buildTickerUs(data){const total=data.total||0;const conf=data.confirmados||0;const stats=data.stats||{};const t100=v=>total>0?Math.round(v/total*100):0;buildTicker([{lbl:'🇺🇸 Total T13 Orlando',val:total,cls:'w',tag:null},{lbl:'🇺🇸 Confirmados',val:conf,cls:'b',tag:{txt:`${t100(conf)}%`,cls:'up'}},{lbl:'🇺🇸 Sem Retorno',val:stats.semRetorno||0,cls:'r',tag:{txt:`${t100(stats.semRetorno||0)}%`,cls:'dn'}},{lbl:'🇺🇸 Cancelamentos',val:stats.cancelamento||0,cls:'r',tag:null},{lbl:'🇺🇸 Taxa Confirmação',val:t100(conf)+'%',cls:'b',tag:null}]);}
function buildTickerGeral(brStats,brTotal,usData){const brPr=brStats.presenca||{};const usTotal=usData.total||0;const usConf=usData.confirmados||0;buildTicker([{lbl:'🇧🇷 T14 Total',val:brTotal,cls:'g',tag:null},{lbl:'🇧🇷 Confirmados',val:brPr.totalConfirmados||0,cls:'g',tag:{txt:`${brTotal>0?Math.round((brPr.totalConfirmados||0)/brTotal*100):0}%`,cls:'up'}},{lbl:'🇧🇷 Sem Retorno',val:brPr.semRetorno||0,cls:'r',tag:null},{lbl:'🇺🇸 T13 Total',val:usTotal,cls:'b',tag:null},{lbl:'🇺🇸 Confirmados',val:usConf,cls:'b',tag:{txt:`${usTotal>0?Math.round(usConf/usTotal*100):0}%`,cls:'up'}},{lbl:'🇺🇸 Sem Retorno',val:usData.stats?.semRetorno||0,cls:'r',tag:null},{lbl:'📊 Total Geral',val:brTotal+usTotal,cls:'w',tag:null}]);}
// ── PLANTA DO EVENTO — Mapa de Lugares (fiel à planta). Edite os assentos por fileira nos arrays "rows". ──
const SEAT_BLOCKS=[
 {id:'B1',rows:[16,16,16,16,14,14,12,10,10],rowLabels:['B1-02','B1-03','B1-04','B1-05','B1-06','B1-07','B1-08','B1-09','B1-10']},
 {id:'B2',rows:[14,16,16,16,14,13,12],rowLabels:['B2-01','B2-02','B2-03','B2-04','B2-05','B2-06','B2-07']},
 {id:'B3',rows:[12,12,12,11,10,10,10],rowLabels:['B3-02','B3-03','B3-04','B3-05','B3-06','B3-07','B3-08']}
];
const SEAT_DIAG=[{id:'B1-01',n:6},{id:'B3-01',n:6}];
const SEAT_LAYOUT={blocks:[{cx:289,top:78},{cx:525,top:78},{cx:736,top:78}],diag:[{cx:224,cy:49,ang:-30},{cx:776,cy:47,ang:30}],stage:{x:270,y:21,w:460,h:34}};
function _seatCap(){let t=0;SEAT_DIAG.forEach(d=>t+=d.n);SEAT_BLOCKS.forEach(b=>b.rows.forEach(n=>t+=n));return t;}
function _seatBuild(PX,PY,SZ){
 const seats=[];
 SEAT_BLOCKS.forEach((b,bi)=>{const L=SEAT_LAYOUT.blocks[bi];b.rows.forEach((n,ri)=>{const y=L.top+ri*PY,w=n*PX,x0=L.cx-w/2+(PX-SZ)/2;for(let i=0;i<n;i++)seats.push({x:x0+i*PX,y:y,row:ri,bi:bi,col:i,diag:false});});});
 SEAT_DIAG.forEach((d,di)=>{const L=SEAT_LAYOUT.diag[di],w=d.n*PX,x0=L.cx-w/2+(PX-SZ)/2;for(let i=0;i<d.n;i++)seats.push({x:x0+i*PX,y:L.cy-SZ/2,row:-1,bi:3+di,col:i,diag:true,ang:L.ang,gcx:L.cx,gcy:L.cy});});
 seats.sort((a,b)=>(a.row-b.row)||(a.x-b.x));seats.forEach((s,i)=>s.rank=i);return seats;
}
function renderSeatmap(label,confirmados,turmaValida){
 const host=document.getElementById('seatmap-floor');if(!host)return;
 const cap=_seatCap();
 const conf=Math.max(0,Math.min(confirmados|0,cap));
 const valida=Math.max(conf,Math.min(turmaValida|0,cap));
 const livres=cap-valida;
 const confPct=Math.round(conf/cap*100),validaPct=Math.round(valida/cap*100),livrePct=Math.round(livres/cap*100);
 const PX=12.5,PY=15.5,SZ=9.5;
 const seats=_seatBuild(PX,PY,SZ);
 function paint(s){if(s.rank<conf)return 'fill="#46d160" filter="url(#plGlow)"';if(s.rank<valida)return 'fill="rgba(255,95,95,.6)" stroke="rgba(255,95,95,.5)" stroke-width=".6"';return 'fill="rgba(255,255,255,.045)" stroke="rgba(255,255,255,.15)" stroke-width=".6"';}
 const seatSvg=seats.map(s=>{const cx=s.x+SZ/2,cy=s.y+SZ/2,rot=s.diag?' transform="rotate('+s.ang+' '+s.gcx+' '+s.gcy+')"':'';return '<circle cx="'+cx.toFixed(1)+'" cy="'+cy.toFixed(1)+'" r="'+(SZ/2).toFixed(1)+'"'+rot+' '+paint(s)+'/>';}).join('');
 let labels='';
 SEAT_BLOCKS.forEach((b,bi)=>{const cx=SEAT_LAYOUT.blocks[bi].cx,top=SEAT_LAYOUT.blocks[bi].top;labels+='<text x="'+cx+'" y="'+(top-9)+'" class="pl-blbl" text-anchor="middle">BLOCO 0'+(bi+1)+'</text>';b.rows.forEach((n,ri)=>{const y=top+ri*PY;if(bi===2){const x=cx+(n*PX)/2+7;labels+='<text x="'+x.toFixed(1)+'" y="'+(y+SZ-1).toFixed(1)+'" class="pl-flbl" text-anchor="start">'+b.rowLabels[ri]+'</text>';}else{const x=cx-(n*PX)/2-7;labels+='<text x="'+x.toFixed(1)+'" y="'+(y+SZ-1).toFixed(1)+'" class="pl-flbl" text-anchor="end">'+b.rowLabels[ri]+'</text>';}});});
 labels+='<text x="'+(SEAT_LAYOUT.diag[0].cx-22)+'" y="'+(SEAT_LAYOUT.diag[0].cy+3)+'" class="pl-flbl" text-anchor="end">B1-01</text>';
 labels+='<text x="'+(SEAT_LAYOUT.diag[1].cx+22)+'" y="'+(SEAT_LAYOUT.diag[1].cy+3)+'" class="pl-flbl" text-anchor="start">B3-01</text>';
 const defs='<defs><filter id="plGlow" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#46d160" flood-opacity="0.6"/></filter></defs>';
 const room='<path d="M145,12 H855 V192 H400 V218 H145 Z" fill="rgba(255,255,255,.018)" stroke="rgba(255,255,255,.09)" stroke-width="1.3" vector-effect="non-scaling-stroke"/>';
 const st=SEAT_LAYOUT.stage;
 const stage='<rect x="'+(st.x+30)+'" y="'+(st.y-9)+'" width="'+(st.w-60)+'" height="6" rx="2" fill="rgba(236,232,224,.85)"/><rect x="'+st.x+'" y="'+st.y+'" width="'+st.w+'" height="'+st.h+'" rx="7" fill="#312f2b" stroke="rgba(255,255,255,.14)" stroke-width="1"/><rect x="'+(st.x+4)+'" y="'+(st.y+4)+'" width="'+(st.w-8)+'" height="'+(st.h-8)+'" rx="5" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/><text x="'+(st.x+st.w/2)+'" y="'+(st.y+st.h/2+6)+'" class="pl-stage" text-anchor="middle">PALCO</text>';
 const svg='<svg viewBox="0 0 1000 230" class="pl-svg" xmlns="http://www.w3.org/2000/svg">'+defs+room+stage+labels+seatSvg+'</svg>';
 function mini(pct,center,color,lbl,sub){const R=26,C=2*Math.PI*R,off=C*(1-Math.max(0,Math.min(100,pct))/100);return '<div class="sm-stat"><div class="sm-mini"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="'+R+'" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="6"/><circle cx="32" cy="32" r="'+R+'" fill="none" stroke="'+color+'" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" class="sm-mini-num" fill="'+color+'">'+center+'</text></svg></div><div class="sm-stat-lbl">'+lbl+'<br><span>'+sub+'</span></div></div>';}
 const subEl=document.getElementById('seatmap-sub');
 if(subEl){var _sem=Math.max(0,valida-conf),_semPct=Math.round(_sem/cap*100);subEl.innerHTML='<div class="sm-occ">'+mini(confPct,confPct+'%','#46d160','Ocupação confirmada',conf+' de '+cap)+mini(_semPct,_semPct+'%','#ff5f5f','Sem retorno',_sem+' de '+cap)+mini(livrePct,livrePct+'%','#b9b9b4','Lugares livres',livres+' de '+cap)+'</div>';}
 host.innerHTML=svg;
}
/* ─── V54 — PRODUÇÃO T15: Cartas Proféticas & Frases do Cliente ───────────────
   Engenharia: Ronaldo Ferreira
   Lê a coluna ATIVIDADE das abas "Carta Profética - T15" e "Frase do cliente - T15"
   (planilha destino T15) e mostra a contagem por status + controle de prazo.
   Dashboard READ-ONLY: nenhuma escrita — o endpoint T15 publica os blocos agregados.
   • LIVE   : store.br.cartas / store.br.frases (payload do Apps Script T15)
   • CACHE  : snapshot embedado abaixo (SOMENTE contagens agregadas — sem dado pessoal)
   As datas de prazo são de planejamento local (localStorage do navegador do operador),
   não são dado de turma e não trafegam para o backend.
   ────────────────────────────────────────────────────────────────────────────── */
const PROD_T15_FALLBACK={
  cartas:{total:107,porStatus:{'PENDENTE':103,'REVISAO':3,'REALIZADO':0,'DUPLICADO':1},capturedAt:'2026-07-15'},
  frases:{total:109,porStatus:{'PENDENTE':12,'EM ANDAMENTO':0,'REALIZADO':93,'DUPLICADO':4},capturedAt:'2026-07-15'}
};
const PROD_T15_DEFS={
  cartas:{el:'prod-cartas',lbl:'Cartas proféticas',lsKey:'pce_prod_t15_cartas_prazo',
    chips:[{k:'REALIZADO',l:'Realizado',c:'ok'},{k:'REVISAO',l:'Revisão',c:'wr'},{k:'PENDENTE',l:'Pendente',c:'pd'},{k:'DUPLICADO',l:'Duplicado',c:'dp'}]},
  frases:{el:'prod-frases',lbl:'Frases do cliente',lsKey:'pce_prod_t15_frases_prazo',
    chips:[{k:'REALIZADO',l:'Realizado',c:'ok'},{k:'EM ANDAMENTO',l:'Em andamento',c:'wr'},{k:'PENDENTE',l:'Pendente',c:'pd'},{k:'DUPLICADO',l:'Duplicado',c:'dp'}]}
};
function _prodNorm(v){return String(v==null?'':v).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();}
function _prodBR(iso){if(!iso)return '—';const p=String(iso).split('-');return p.length===3?(p[2]+'/'+p[1]+'/'+p[0]):String(iso);}
function _prodHojeISO(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function _prodDias(a,b){if(!a||!b)return null;const d1=new Date(a+'T00:00:00'),d2=new Date(b+'T00:00:00');if(isNaN(d1.getTime())||isNaN(d2.getTime()))return null;return Math.round((d2.getTime()-d1.getTime())/86400000);}
function _prodBlock(kind){
  try{
    const live=store.br&&store.br[kind];
    if(live&&typeof live==='object'){
      if(Array.isArray(live.rows)){
        const ps={};let t=0;
        for(const r of live.rows){const k=_prodNorm(r&&(r.atividade||r.ATIVIDADE))||'(SEM STATUS)';ps[k]=(ps[k]||0)+1;t++;}
        return {total:t,porStatus:ps,source:'api_live',capturedAt:live.updated||store.br.updated||null};
      }
      if(live.porStatus&&typeof live.porStatus==='object'){
        const ps={};for(const k in live.porStatus){if(!Object.prototype.hasOwnProperty.call(live.porStatus,k))continue;const nk=_prodNorm(k);ps[nk]=(ps[nk]||0)+(Number(live.porStatus[k])||0);}
        let t=Number(live.total);if(!isFinite(t)||t<=0){t=0;for(const k in ps)t+=ps[k];}
        return {total:t,porStatus:ps,source:'api_live',capturedAt:live.capturedAt||store.br.updated||null};
      }
    }
  }catch(e){if(window.Logger)Logger.warn('PROD_T15','Falha lendo bloco live — usando cache',{kind:kind,message:e.message});}
  const fb=PROD_T15_FALLBACK[kind];
  const ps={};for(const k in fb.porStatus){if(Object.prototype.hasOwnProperty.call(fb.porStatus,k))ps[_prodNorm(k)]=fb.porStatus[k];}
  return {total:fb.total,porStatus:ps,source:'cache_embedded',capturedAt:fb.capturedAt};
}
function _prodLoadPrazo(k){try{const raw=localStorage.getItem(k);if(!raw)return{ini:'',fim:'',lim:''};const o=JSON.parse(raw)||{};return{ini:o.ini||'',fim:o.fim||'',lim:o.lim||''};}catch(e){return{ini:'',fim:'',lim:''};}}
function _prodSavePrazo(kind,campo,val){
  const def=PROD_T15_DEFS[kind];if(!def)return;
  const p=_prodLoadPrazo(def.lsKey);if(campo!=='ini'&&campo!=='fim'&&campo!=='lim')return;
  p[campo]=String(val||'').slice(0,10);
  try{localStorage.setItem(def.lsKey,JSON.stringify(p));}catch(e){if(window.Logger)Logger.warn('PROD_T15','localStorage indisponível',{message:e.message});}
  renderProdT15(kind);
}
window.__prodSavePrazo=_prodSavePrazo;
function _prodVerdict(p,restantes){
  const L=[];let cls='neutral';
  if(!p.lim&&!p.ini&&!p.fim)return{cls:'neutral',html:'Defina <b>início</b>, <b>fim previsto</b> e <b>data limite</b> para acompanhar o prazo.'};
  if(p.ini&&p.fim){const jan=_prodDias(p.ini,p.fim);if(jan!==null)L.push('Janela de execução: <b>'+(jan+1)+' dia(s)</b> — '+_prodBR(p.ini)+' → '+_prodBR(p.fim)+'.');}
  if(p.lim){
    const dLim=_prodDias(_prodHojeISO(),p.lim);
    if(dLim!==null){
      if(dLim<0){cls='err';L.push('⛔ Limite <b>vencido há '+Math.abs(dLim)+' dia(s)</b> — '+_prodBR(p.lim)+'.');}
      else{cls='ok';L.push('Restam <b>'+dLim+' dia(s)</b> até o limite ('+_prodBR(p.lim)+').');}
    }
    if(p.fim){
      const folga=_prodDias(p.fim,p.lim);
      if(folga!==null){
        if(folga<0){cls='err';L.push('🔴 O fim previsto <b>estoura o limite em '+Math.abs(folga)+' dia(s)</b>.');}
        else if(folga<=2){if(cls!=='err')cls='warn';L.push('🟠 <b>Apertado</b>: apenas <b>'+folga+' dia(s)</b> de folga entre fim previsto e limite.');}
        else{if(cls!=='err')cls='ok';L.push('🟢 <b>Folga de '+folga+' dia(s)</b> entre fim previsto e limite.');}
      }
    }
    if(restantes>0){
      const dLim2=_prodDias(_prodHojeISO(),p.lim);
      if(dLim2!==null&&dLim2>0){const r=restantes/dLim2;L.push('Faltam <b>'+restantes+'</b> — ritmo necessário de <b>'+(Math.round(r*10)/10).toString().replace('.',',')+'/dia</b> (dias corridos) até o limite.');}
      else L.push('Faltam <b>'+restantes+'</b> e o limite já passou.');
    }else L.push('✅ Nada pendente — produção concluída.');
  }
  return {cls:cls,html:L.join('<br>')};
}
function renderProdT15(only){
  const kinds=(only&&PROD_T15_DEFS[only])?[only]:['cartas','frases'];
  for(const kind of kinds){
    const def=PROD_T15_DEFS[kind];const el=document.getElementById(def.el);if(!el)continue;
    const b=_prodBlock(kind);const ps=b.porStatus||{};
    const dup=ps['DUPLICADO']||0;
    const base=Math.max(0,b.total-dup);
    const feitos=ps['REALIZADO']||0;
    const restantes=Math.max(0,base-feitos);
    const pct=base>0?Math.round(feitos/base*100):0;
    const p=_prodLoadPrazo(def.lsKey);
    const v=_prodVerdict(p,restantes);
    let chips='',soma=0;
    for(const c of def.chips){const n=ps[c.k]||0;soma+=n;chips+='<div class="pd-chip '+c.c+'"><div class="pd-chip-n">'+n+'</div><div class="pd-chip-l">'+c.l+'</div></div>';}
    const outros=Math.max(0,b.total-soma);
    const nota=outros>0?('<div class="pd-note">⚠️ '+outros+' linha(s) com ATIVIDADE fora do menu suspenso — revisar na planilha.</div>'):'';
    const srcCls=b.source==='api_live'?'pd-src live':'pd-src';
    const srcTxt=b.source==='api_live'
      ? '● LIVE — endpoint T15'+(b.capturedAt?(' · '+new Date(b.capturedAt).toLocaleString('pt-BR')):'')
      : '● CACHE — snapshot de '+_prodBR(b.capturedAt)+' · aguardando publicação no endpoint T15';
    el.innerHTML=
      '<div class="pd-head"><div class="pd-total">'+b.total+'</div><div class="pd-total-lbl">'+def.lbl+'</div>'
      +'<div class="pd-total-sub">'+base+' válidas'+(dup>0?(' · '+dup+' duplicada(s)'):'')+'</div></div>'
      +'<div class="pd-grid">'+chips+'</div>'
      +'<div class="pd-bar"><div class="pd-bar-fill" style="width:'+Math.max(pct,6)+'%">'+pct+'%</div></div>'
      +'<div class="pd-bar-cap"><strong>'+feitos+'</strong> de <strong>'+base+'</strong> realizadas · faltam <strong>'+restantes+'</strong></div>'
      +nota
      +'<div class="pd-dates">'
      +'<div class="pd-dt"><label>Início das execuções</label><input type="date" value="'+p.ini+'" onchange="__prodSavePrazo(\''+kind+'\',\'ini\',this.value)"></div>'
      +'<div class="pd-dt"><label>Fim das execuções</label><input type="date" value="'+p.fim+'" onchange="__prodSavePrazo(\''+kind+'\',\'fim\',this.value)"></div>'
      +'<div class="pd-dt"><label>Data limite</label><input type="date" value="'+p.lim+'" onchange="__prodSavePrazo(\''+kind+'\',\'lim\',this.value)"></div>'
      +'</div>'
      +'<div class="pd-verdict '+v.cls+'">'+v.html+'</div>'
      +'<div class="'+srcCls+'">'+srcTxt+'</div>';
  }
}
window.__refreshProdT15=renderProdT15;
function diagnosticarProdT15(){
  const out={};
  for(const kind of ['cartas','frases']){
    const b=_prodBlock(kind);const def=PROD_T15_DEFS[kind];
    out[kind]={source:b.source,total:b.total,porStatus:b.porStatus,capturedAt:b.capturedAt,
      prazo:_prodLoadPrazo(def.lsKey),elPresente:!!document.getElementById(def.el)};
  }
  console.table([{bloco:'cartas',fonte:out.cartas.source,total:out.cartas.total},{bloco:'frases',fonte:out.frases.source,total:out.frases.total}]);
  console.log('[PROD_T15] detalhe:',out);
  return out;
}
window.diagnosticarProdT15=diagnosticarProdT15;

/* ─── V56 — CONCILIAÇÃO: por que 101 confirmados viram 108 linhas de carta ────
   Engenharia: Ronaldo Ferreira
   101 conta PESSOAS. 108 conta LINHAS DE PLANILHA. Não é o mesmo número e nunca
   vai bater. Este card mostra a ponte entre os dois em vez de deixar o operador
   concluir sozinho que o dashboard está errado.

   O universo esperado NÃO é "confirmados": é quem preencheu o Typeform. O
   SYNC-DOSSIE-T15 gera carta e frase a partir do dossiê, sem olhar presença.
   Fonte: store.br.conciliacao (endpoint T15 v1.8+). Sem o bloco, o card avisa
   e não inventa número.
   ────────────────────────────────────────────────────────────────────────── */
function _cnEsc(v){return String(v==null?'':v).replace(/[&<>"]/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];});}
function _cnLado(L,titulo,esperado){
  const falta=(L.faltam||[]).length;
  const semDono=(L.semDono||[]).length;
  return '<div class="cn-col">'
    +'<div class="cn-col-t">'+titulo+'</div>'
    +'<div class="cn-col-n '+(falta>0?'gap':'ok')+'">'+L.cobertas+'<small> / '+esperado+' pessoas</small></div>'
    +'<table>'
    +'<tr class="'+(falta>0?'bad':'')+'"><td>Faltam</td><td class="n">'+falta+'</td></tr>'
    +'<tr><td>Linhas sem dono no dossiê</td><td class="n">'+semDono+'</td></tr>'
    +'<tr><td>Linhas repetidas</td><td class="n">'+(L.repetidas||0)+'</td></tr>'
    +'<tr class="'+((L.repSemMarcar||0)>0?'warn':'')+'"><td>Repetição sem marcar duplicado</td><td class="n">'+(L.repSemMarcar||0)+'</td></tr>'
    +'<tr class="foot"><td>Linhas na aba</td><td class="n" style="color:var(--muted2)">'+L.linhas+'</td></tr>'
    +'</table></div>';
}
function renderConcT15(){
  const el=document.getElementById('prod-conc');if(!el)return;
  const c=store.br&&store.br.conciliacao;
  const sub=document.getElementById('prod-conc-sub');
  if(!c||typeof c!=='object'||!c.cartas||!c.frases){
    el.innerHTML='<div class="cn-exc warn"><div class="cn-exc-h">Bloco de conciliação não recebido</div>'
      +'O endpoint T15 precisa estar na v1.8 ou superior. Sem ele este card não inventa número.</div>';
    return;
  }
  const b=c.base||{};
  const conf=b.confirmados||0, outro=b.outroStatus||0, fora=b.foraOnboarding||0;
  if(sub)sub.textContent='Por que '+conf+' confirmados viram '+c.cartas.linhas+' linhas de carta';

  let ponte='<div class="cn-ponte"><table>'
    +'<tr><td>Confirmados c/ typeform preenchido</td><td class="n">'+conf+'</td></tr>';
  if(outro>0)ponte+='<tr><td>+ Preencheu e está em outro status <span style="color:var(--muted2)">(também recebe carta)</span></td><td class="n">'+outro+'</td></tr>';
  if(fora>0)ponte+='<tr><td>+ Preencheu e não está no Onboarding</td><td class="n">'+fora+'</td></tr>';
  ponte+='<tr class="tot"><td>Pessoas que precisam de carta e frase</td><td class="n">'+c.esperado+'</td></tr>'
    +'</table></div>';

  const cols='<div class="cn-cols">'+_cnLado(c.cartas,'Cartas proféticas',c.esperado)
    +_cnLado(c.frases,'Frases do cliente',c.esperado)+'</div>';

  // ── Exceções ──
  let exc='',n=0;
  const vistos={};
  [['carta',c.cartas],['frase',c.frases]].forEach(function(par){
    (par[1].faltam||[]).forEach(function(f){
      n++;
      exc+='<div class="cn-exc err"><div class="cn-exc-h">'+_cnEsc(f.nome)+' — '+_cnEsc((f.presenca||'').toLowerCase())+', sem '+par[0]+'</div>'
        +(f.cpfProvavel
          ? 'CPF no Onboarding <b>'+_cnEsc(f.cpf)+'</b> · consta <b>'+_cnEsc(f.cpfProvavel)+'</b> na aba. Provável CPF digitado errado no typeform — a '+par[0]+' existe, pendurada no CPF errado.'
          : 'CPF <b>'+_cnEsc(f.cpf)+'</b> preencheu o typeform e não tem linha na aba de '+par[0]+'.')
        +'</div>';
    });
  });
  const sd=[];
  [c.cartas,c.frases].forEach(function(L){(L.semDono||[]).forEach(function(x){if(!vistos[x.cpf]){vistos[x.cpf]=1;sd.push(x);}});});
  if(sd.length){
    n+=sd.length;
    exc+='<div class="cn-exc warn"><div class="cn-exc-h">'+sd.length+' linha(s) sem dono no dossiê</div>'
      +sd.map(function(x){return _cnEsc(x.nome)+' <span style="opacity:.7">('+_cnEsc(x.cpf)+')</span>';}).join(' · ')
      +'<div class="cn-exc-sub">Têm carta/frase mas não estão no typeform. O sync só adiciona e nunca remove — correção de CPF na origem deixa a linha antiga para trás.</div></div>';
  }
  const rsm=(c.cartas.repSemMarcar||0)+(c.frases.repSemMarcar||0);
  if(rsm>0){
    n+=rsm;
    exc+='<div class="cn-exc warn"><div class="cn-exc-h">'+rsm+' repetição(ões) passando como trabalho real</div>'
      +'Há linha repetida do mesmo CPF sem estar marcada DUPLICADO. Enquanto isso, o "faltam" dos cards acima fica inflado.</div>';
  }
  if(!n)exc='<div class="cn-exc ok"><div class="cn-exc-h">✅ Nada a tratar</div>Todo mundo que preencheu o typeform tem carta e frase, sem lixo e sem repetição solta.</div>';

  el.innerHTML=ponte+cols
    +'<div class="cn-exc-t">Exceções para tratar'+(n?' — '+n:'')+'</div>'+exc
    +'<div class="pd-src live">● LIVE — endpoint T15 · conciliado por CPF'
    +(c.capturedAt?(' · '+new Date(c.capturedAt).toLocaleString('pt-BR')):'')+'</div>';
}
window.__refreshConcT15=renderConcT15;
function diagnosticarConcT15(){
  const c=store.br&&store.br.conciliacao;
  if(!c){console.warn('[CONC_T15] bloco ausente — endpoint T15 precisa estar na v1.8+');return null;}
  console.log('[CONC_T15] esperado:',c.esperado,'=',c.base);
  ['cartas','frases'].forEach(function(k){
    const L=c[k],soma=L.cobertas+(L.semDono||[]).length+L.repetidas;
    console.log('[CONC_T15] '+k+': '+L.cobertas+'/'+c.esperado+' cobertas | aba '+L.linhas+
      ' | confere: '+soma+(soma===L.linhas?' ✓':' ✗ DIVERGE'),L);
  });
  return c;
}
window.diagnosticarConcT15=diagnosticarConcT15;
/* ─── fim V56 ──────────────────────────────────────────────────────────────── */
/* ─── fim V54 ─────────────────────────────────────────────────────────────── */
function renderViewBr(turmaLabel){const rows=store.br.rows;const stats=store.br.stats;if(!rows||rows.length===0){Logger.warn('UI','renderViewBr: sem dados');return;}{const fm=document.getElementById('br-funil-meta-wrap');if(fm)fm.style.display='';const im=document.getElementById('imersao-container');if(im)im.innerHTML='';}const total=rows.length;const pr=stats.presenca||{};const ob=stats.onboarding||{};const op=stats.operacional||{};const totalConf=pr.totalConfirmados||((pr.brConfirmado||0)+(pr.brUs||0)+(pr.usConfirmado||0)+(pr.confirmado||0));const brOnly=totalConf;const brUs=0;const semRet=pr.semRetorno||0;const proxTurma=pr.proximaTurma||0;const cancelamento=pr.cancelamento||0;const turmaValida=(pr.turmaValida!=null?pr.turmaValida:(totalConf+semRet));const onbReal=ob.realizado||0;const onbIni=ob.iniciado||0;const onbPend=ob.pendente||0;const onbNao=ob.naoIniciado||0;const whatsOk=op.whatsOk||0;const tfOk=op.typeformOk||0;const tfEnv=op.typeformEnv||0;const ctOk=op.contratoOk||0;let _tfOkConf=0,_tfOkSR=0,_tfNaoPreValida=0,_onbIni=0,_onbNaoReal=0,_onbReal=0;for(const _r of rows){const _p=normalizeStatus(_r.presenca);const _tf=(_r.typeform||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();const _ob=normalizeOnboarding(_r.onboarding);const _isConf=(_p==='BR CONFIRMADO'||_p==='BR + US CONFIRMADO'||_p==='US CONFIRMADO'||_p==='CONFIRMADO');const _isSR=(_p==='SEM RETORNO');const _isValida=(_isConf||_isSR);if(_tf==='PREENCHIDO'){if(_isConf)_tfOkConf++;else if(_isSR)_tfOkSR++;}if((_tf==='NAO PREENCHEU'||_tf==='NÃO PREENCHEU')&&_isValida)_tfNaoPreValida++;if(_ob==='INICIADO')_onbIni++;else if(_ob==='NAO_INICIADO'||_ob==='SEM_RETORNO')_onbNaoReal++;else if(_ob==='REALIZADO')_onbReal++;}const tfOkConfirmados=_tfOkConf;const tfOkSemRetorno=_tfOkSR;const tfOkValida=tfOkConfirmados+tfOkSemRetorno;const tfNaoPreencheuValida=_tfNaoPreValida;const onbIniciado=_onbIni;const onbNaoRealizado=_onbNaoReal;const onbRealCalc=_onbReal;const semRetPreencheram=rows.filter(r=>{const p=normalizeStatus(r.presenca);const tf=(r.typeform||'').toUpperCase();return p==='SEM RETORNO'&&tf==='PREENCHIDO';}).map(r=>(r.nome||'(sem nome)').trim()).sort((a,b)=>a.localeCompare(b,'pt-BR'));Logger.info('UI','renderViewBr',{total,totalConf,turmaValida,semRet,source:store.br.source});{const _isT14view=(!turmaLabel||turmaLabel==='T14'||turmaLabel==='BR T14 BRASIL');const _isT15view=(turmaLabel==='T15'||turmaLabel==='BR T15 BRASIL');var _npViewMode=_isT14view?'t14':(_isT15view?'t15':'none');const _npFaixaEl=document.getElementById('np-faixa');if(_npFaixaEl)_npFaixaEl.style.display=(_npViewMode!=='none')?'':'none';/* card de detalhamento migrado para o Painel ADM */if(_npViewMode==='t14'){const _npT=document.getElementById('np-faixa-title');if(_npT)_npT.textContent='Confirmados na Noite de Networking de Maio';const _npS=document.getElementById('np-faixa-sub');if(_npS)_npS.textContent='';}else if(_npViewMode==='t15'){var _tvPend=computePendingTransfer(store.br,turmaLabel);var _turmaValidaNP=turmaValida+_tvPend;paintNetworkingT15(_turmaValidaNP);fetchNetworkingT15().then(function(ok){if(ok)paintNetworkingT15(_turmaValidaNP);});}const _smEl=document.getElementById('seatmap-section');if(_smEl){const _showSeat=!_isT14view;_smEl.style.display=_showSeat?'':'none';if(_showSeat)renderSeatmap(turmaLabel||'',totalConf,turmaValida);}{const _imt=document.getElementById('imersao-t14-wrap');if(_imt){const _show=(dashMode==='turmas'&&_isT14view);_imt.style.display=_show?'':'none';if(_show)renderImersaoT14();}}{const _isT15view=(turmaLabel==='T15'||turmaLabel==='BR T15 BRASIL');const _pSl=document.getElementById('prod-t15-sl');const _pGr=document.getElementById('prod-t15-grid');if(_pSl)_pSl.style.display=_isT15view?'':'none';if(_pGr)_pGr.style.display=_isT15view?'':'none';if(_isT15view)safeRender('prod-t15',function(){renderProdT15();});}}safeRender('kpi-dash',()=>{const totalConfPct=total>0?Math.round(totalConf/total*100):0;const semRetPct=total>0?Math.round(semRet/total*100):0;const turmaValPct=total>0?Math.round(turmaValida/total*100):0;const proxPct=total>0?Math.round(proxTurma/total*100):0;const C=264;const off=p=>C-(C*Math.max(0,Math.min(100,p))/100);const pendingTransfer=computePendingTransfer(store.br,turmaLabel);const tvDisplay=turmaValida+pendingTransfer;const tvRingPct=pendingTransfer>0?(tvDisplay>0?Math.round(turmaValida/tvDisplay*100):0):turmaValPct;const tvSub=pendingTransfer>0?`${turmaValida} na turma&nbsp; <b style="color:var(--green);font-weight:800">+${pendingTransfer} a transferir</b>`:`${totalConf} confirmados + ${semRet} sem retorno`;const tvBadge=pendingTransfer>0?`<div title="${pendingTransfer} transferência(s) aprovada(s) ainda não inserida(s) na turma" style="position:absolute;top:8px;right:8px;min-width:24px;height:24px;padding:0 7px;display:flex;align-items:center;justify-content:center;background:#f5a623;color:#1a1a18;border-radius:12px;font-size:13px;font-weight:800;font-variant-numeric:tabular-nums;box-shadow:0 0 0 3px rgba(245,166,35,.18);z-index:3">${pendingTransfer}</div>`:'';document.getElementById('kpi-dash').innerHTML=`<div class="kpi-ribbon" style="grid-column:1/-1"><div class="kr-cell"><div class="kr-k">Turma Válida</div><div class="kr-n">${tvDisplay}</div><div class="kr-x">${tvSub}</div></div><div class="kr-cell"><div class="kr-k">Confirmados</div><div class="kr-n g">${totalConf}</div><div class="kr-x">${Math.round(totalConf/_seatCap()*100)}% do auditório</div></div><div class="kr-cell"><div class="kr-k">Sem Retorno</div><div class="kr-n r">${semRet}</div><div class="kr-x">${semRetPct}% da turma</div></div><div class="kr-cell"><div class="kr-k">Próximas Turmas</div><div class="kr-n">${proxTurma}</div><div class="kr-x">remarcadas</div></div><div class="kr-cell"><div class="kr-k">Cancelamentos</div><div class="kr-n">${cancelamento}</div><div class="kr-x">no período</div></div></div>`;});const brPct=total>0?Math.round(totalConf/total*100):0;/* V54: card 'Funil de Conversão' removido a pedido — Preenchimento do Typeform ocupa a largura toda */safeRender('meta-confirm',()=>{const meta=totalConf;const faltam=Math.max(0,meta-tfOkConfirmados);const pct=meta>0?Math.min(100,Math.round(tfOkConfirmados/meta*100)):0;const C=264;const off=C-(C*pct/100);let badge='<span class="meta-badge ok">● Meta atingida</span>';if(meta===0)badge='<span class="meta-badge warn">● Sem confirmados ainda</span>';else if(faltam>0&&pct>=80)badge='<span class="meta-badge ok">● Quase lá</span>';else if(faltam>0&&pct>=50)badge='<span class="meta-badge warn">● Em andamento</span>';else if(faltam>0)badge='<span class="meta-badge err">● Atenção</span>';const subTxt=tfOkSemRetorno>0?`<strong>${tfOkSemRetorno}</strong> em <em>sem retorno</em> já preencheram (potenciais a confirmar)`:'Nenhum preenchimento de pessoa em sem retorno';const faltamTxt=faltam>0?`Faltam <strong>${faltam} confirmados</strong> sem typeform preenchido`:'Todos os confirmados preencheram 🎉';const listHtml=semRetPreencheram.length>0?`<div class="meta-list-wrap"><div class="meta-list-title">Sem retorno + preenchido <span class="meta-list-count">${semRetPreencheram.length}</span></div><ul class="meta-list">${semRetPreencheram.map(n=>`<li class="meta-list-item">${n.replace(/[<>]/g,'')}</li>`).join('')}</ul></div>`:'<div class="meta-list-wrap"><div class="meta-list-title">Sem retorno + preenchido</div><div class="meta-list-empty">Nenhuma pessoa nessa categoria no momento.</div></div>';const foraOnb=Array.isArray(store.br.dossieForaOnboarding)?store.br.dossieForaOnboarding:[];const foraOnbHtml=foraOnb.length>0?('<div class="meta-list-wrap"><div class="meta-list-title">Preencheu Typeform · fora do Onboarding <span class="meta-list-count">'+foraOnb.length+'</span></div><ul class="meta-list">'+foraOnb.map(function(p){return '<li class="meta-list-item">'+String((p&&p.nome)||'(sem nome)').replace(/[<>]/g,'')+'<span style="opacity:.55"> · CPF '+String((p&&p.cpf)||'').replace(/[<>]/g,'')+'</span></li>';}).join('')+'</ul></div>'):'';const el=document.getElementById('meta-confirm');if(el)el.innerHTML=`<div class="meta-wrap"><div class="meta-gauge"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" class="meta-gauge-bg"/><circle cx="50" cy="50" r="42" class="meta-gauge-fill" style="stroke-dashoffset:${off}"/></svg><div class="meta-gauge-text"><div class="meta-gauge-pct">${pct}%</div><div class="meta-gauge-sub">META ${meta}</div></div></div><div class="meta-info"><div class="meta-info-lbl">Confirmados c/ typeform preenchido</div><div class="meta-info-val">${tfOkConfirmados}<span class="meta-sep">/</span><span class="meta-target">${meta}</span></div><div class="meta-info-faltam">${faltamTxt}</div><div class="meta-info-faltam" style="margin-top:4px">${subTxt}</div>${badge}</div></div>`;var _amSR=document.getElementById('adm-tf-semret');if(_amSR)_amSR.innerHTML=listHtml||'<div class="meta-list-empty">Nenhuma pessoa nessa categoria no momento.</div>';var _amFO=document.getElementById('adm-tf-fora');if(_amFO)_amFO.innerHTML=foraOnbHtml||'<div class="meta-list-empty">Ninguém fora do Onboarding.</div>';});document.getElementById('badge-total').textContent=total;buildTickerBr(stats,total,turmaLabel);if(_npViewMode==='t14'){const _np=analisarNetworkingPV(rows);const _elCount=document.getElementById('np-faixa-count');if(_elCount)_elCount.textContent=_np.total;}safeRender('networking-pv-content',()=>{if(!document.getElementById('networking-pv-content'))return;if(_npViewMode!=='t14')return;const np=analisarNetworkingPV(rows);const el=document.getElementById('networking-pv-content');if(!el)return;if(np.total===0){el.innerHTML='<div class="np-empty">Nenhuma confirmação registrada ainda no formulário da Noite de Networking.</div>';return;}const sourceLabel=np.source==='api_live'?'● LIVE — atualização automática':'● CACHE — dados embedados (atualização manual)';const sourceCls=np.source==='api_live'?'np-source live':'np-source';const dentroN=np.dentro.length;const foraN=np.fora.length;const dupN=np.duplicados.length;const pctCrz=np.total>0?Math.round(dentroN/np.total*100):0;const subTotalTxt=dupN>0?`${np.bruto} preenchimentos → ${np.total} pessoas únicas`:'preencheram "Sim, irei participar"';let statsHtml='<div class="np-grid">';statsHtml+=`<div class="np-stat"><div class="np-stat-lbl">Total Confirmados</div><div class="np-stat-val">${np.total}</div><div class="np-stat-sub">${subTotalTxt}</div></div>`;statsHtml+=`<div class="np-stat"><div class="np-stat-lbl">CPF na Onboarding T14</div><div class="np-stat-val">${dentroN}</div><div class="np-stat-sub">${pctCrz}% do total · cruzamento OK</div></div>`;statsHtml+=`<div class="np-stat"><div class="np-stat-lbl">CPF fora da T14</div><div class="np-stat-val" style="color:#f5a623">${foraN}</div><div class="np-stat-sub">${foraN===0?'todos identificados':'precisam investigação'}</div></div>`;statsHtml+='</div>';let dupHtml='';if(dupN>0){const totRepeticoes=np.duplicados.reduce((acc,d)=>acc+d.vezes,0);dupHtml='<div class="np-dup-box">';dupHtml+=`<div class="np-dup-title">🔁 ${dupN} ${dupN===1?'pessoa preencheu':'pessoas preencheram'} mais de uma vez</div>`;dupHtml+=`<div class="np-dup-sub">Excluídas do número principal de confirmados para não poluir a contagem · mantida a 1ª ocorrência de cada pessoa (total bruto: ${totRepeticoes} preenchimentos)</div>`;dupHtml+='<div class="np-dup-list">';for(const d of np.duplicados){const nm=(d.nome||'(sem nome)').toString().replace(/[<>]/g,'');dupHtml+=`<div class="np-dup-item"><strong>${nm}</strong><span class="np-dup-cpf">CPF ${d.cpf||'(sem CPF)'}</span><span class="np-dup-badge">${d.vezes}×</span></div>`;}dupHtml+='</div></div>';}let barsHtml='';if(dentroN>0){const ordemStatus=['BR CONFIRMADO','BR + US CONFIRMADO','US CONFIRMADO','CONFIRMADO','SEM RETORNO','PROXIMA TURMA','CANCELAMENTO','NAO VAI PARTICIPAR','NAO CHAMAR','TROCA DE CONS','(sem status)'];const statusOrdenados=Object.keys(np.porStatus).sort((a,b)=>{const ia=ordemStatus.indexOf(a),ib=ordemStatus.indexOf(b);return(ia<0?99:ia)-(ib<0?99:ib);});barsHtml='<div style="margin-top:8px"><div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#aaa);margin-bottom:10px">Distribuição por status na T14</div>';for(const s of statusOrdenados){const arr=np.porStatus[s];const cnt=arr.length;const pct=dentroN>0?Math.round(cnt/dentroN*100):0;const w=Math.max(pct,4);barsHtml+=`<div class="np-bar-row"><div class="np-bar-lbl">${s}</div><div class="np-bar-track"><div class="np-bar-fill" style="width:${w}%">${pct}%</div></div><div class="np-bar-count">${cnt}</div></div>`;}barsHtml+='</div>';const statusAtencao=statusOrdenados.filter(s=>s!=='BR CONFIRMADO'&&s!=='BR + US CONFIRMADO'&&s!=='US CONFIRMADO'&&s!=='CONFIRMADO');if(statusAtencao.length>0){const totAtencao=statusAtencao.reduce((acc,s)=>acc+np.porStatus[s].length,0);let atHtml='<div class="np-atencao-box">';atHtml+=`<div class="np-atencao-title">🔍 ${totAtencao} ${totAtencao===1?'pessoa preencheu':'pessoas preencheram'} o Networking mas ${totAtencao===1?'não está':'não estão'} como confirmado${totAtencao===1?'':'s'} na T14</div>`;atHtml+='<div class="np-atencao-sub">Precisam ser contatadas — confirmar status, reverter cancelamento ou priorizar onboarding</div>';for(const s of statusAtencao){const arr=np.porStatus[s];atHtml+=`<div class="np-atencao-group"><div class="np-atencao-status">${s} <span class="np-atencao-count">${arr.length}</span></div><div class="np-atencao-list">`;for(const p of arr){const nm=(p.nome_t14||p.nome||'(sem nome)').toString().replace(/[<>]/g,'');atHtml+=`<div class="np-atencao-item"><strong>${nm}</strong><span class="np-atencao-cpf">CPF ${p.cpf||'(sem CPF)'}</span></div>`;}atHtml+='</div></div>';}atHtml+='</div>';barsHtml+=atHtml;}}let foraHtml='';if(foraN>0){foraHtml=`<div class="np-fora-box"><div class="np-fora-title">⚠️ ${foraN} confirmaram no Networking mas o CPF NÃO está na Onboarding T14</div><div class="np-fora-list">${np.fora.map(p=>`<div class="np-fora-item"><strong>${(p.nome||'(sem nome)').replace(/[<>]/g,'')}</strong> · CPF ${p.cpf||'(sem CPF)'}</div>`).join('')}</div></div>`;}el.innerHTML=statsHtml+dupHtml+barsHtml+foraHtml+`<div class="${sourceCls}">${sourceLabel} · ${np.total} pessoas únicas${dupN>0?` (de ${np.bruto} preenchimentos)`:''}</div>`;});}
function renderViewUs(){
  const data=store.us.data;
  if(!data){Logger.warn('UI','renderViewUs: sem dados de Orlando');safeRender('kpi-dash',()=>{document.getElementById('kpi-dash').innerHTML=`<div class="kpi hi-b" style="grid-column:1/-1;text-align:center"><div class="kpi-lbl">T13 Orlando</div><div style="font-size:14px;color:var(--muted);padding:20px">Dados indisponíveis. Clique em Atualizar.</div></div>`;});return;}
  const total=data.total||0;
  const conf=data.confirmados||0;
  const stats=data.stats||{};
  const semRet=stats.semRetorno||0;
  const cancel=stats.cancelamento||0;
  const usOnly=stats.confirmado||stats.usOnly||0;
  const brUs=stats.brUs||0;
  const usOnlyFinal=(usOnly+brUs>0)?usOnly:conf;
  const brUsFinal=(usOnly+brUs>0)?brUs:0;
  const totalConf=usOnlyFinal+brUsFinal||conf;
  const usOnlyPct=totalConf>0?Math.round(usOnlyFinal/totalConf*100):0;
  const brUsPct=totalConf>0?Math.round(brUsFinal/totalConf*100):0;
  Logger.info('UI','renderViewUs',{total,conf,usOnly:usOnlyFinal,brUs:brUsFinal,source:store.us.source});
  safeRender('kpi-dash',()=>{
    document.getElementById('kpi-dash').innerHTML=`
      <div class="kpi hi-b"><div class="kpi-lbl">Total T13 Orlando</div><div class="kpi-val b">${total}</div><div class="kpi-sub">participantes registrados</div></div>
      <div class="kpi hi-b"><div class="kpi-lbl">Total confirmados</div><div class="kpi-val b">${totalConf}</div><div class="kpi-sub">${total>0?Math.round(totalConf/total*100):0}% confirmados</div></div>
      <div class="kpi hi-r"><div class="kpi-lbl">Sem retorno</div><div class="kpi-val r">${semRet}</div><div class="kpi-sub">${total>0?Math.round(semRet/total*100):0}% do total</div></div>
      <div class="kpi"><div class="kpi-lbl">Cancelamentos</div><div class="kpi-val a">${cancel}</div><div class="kpi-sub">${total>0?Math.round(cancel/total*100):0}% do total</div></div>`;
  });
  safeRender('imersao-container',()=>{
    const _fm=document.getElementById('br-funil-meta-wrap');if(_fm)_fm.style.display='none';
    document.getElementById('imersao-container').innerHTML=`
<div class="imersao-full" style="background:linear-gradient(135deg,#0d1a2e 0%,#142038 100%);border-color:rgba(77,159,255,.25)">
  <div style="position:absolute;bottom:-20px;right:-20px;width:280px;height:200px;background-image:url('https://flagcdn.com/us.svg');background-size:cover;background-position:center;border-radius:10px;opacity:.06;pointer-events:none;transform:rotate(-6deg)"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:24px">
    <div style="display:flex;align-items:center;gap:16px">
      <span style="font-size:36px">🇺🇸</span>
      <div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);margin-bottom:3px">T13 — Imersão Orlando</div>
        <div style="font-size:13px;color:var(--muted)">Programa de Crescimento Empresarial · Febracis</div>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:32px">
      <div style="text-align:center">
        <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Total da turma</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;line-height:1;color:var(--cream)">${total}</div>
        <div style="font-size:10px;color:var(--muted2);margin-top:3px">participantes</div>
      </div>
      <div style="width:1px;height:48px;background:rgba(255,255,255,.1)"></div>
      <div style="text-align:center">
        <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Total confirmados</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;line-height:1;color:var(--blue)">${totalConf}</div>
        <div style="font-size:10px;color:var(--muted2);margin-top:3px">confirmados</div>
      </div>
    </div>
  </div>
  <div style="width:100%;height:1px;background:rgba(255,255,255,.07);margin-bottom:24px"></div>
  <div style="display:grid;grid-template-columns:1fr 1px 1fr 1px 1fr;gap:0;width:100%;align-items:center">
    <div style="padding-right:32px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="width:10px;height:10px;border-radius:50%;background:var(--blue);flex-shrink:0;box-shadow:0 0 8px rgba(77,159,255,.5)"></div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--blue)">Imersão Orlando</div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">Somente em Orlando</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:80px;font-weight:800;line-height:1;color:var(--blue)">${usOnlyFinal}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:6px;margin-bottom:14px">participantes confirmados</div>
      <div style="background:rgba(77,159,255,.08);border-radius:6px;height:6px;overflow:hidden;margin-bottom:8px">
        <div style="height:100%;border-radius:6px;background:var(--blue);width:${usOnlyPct}%;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--blue)">${usOnlyPct}% dos confirmados</div>
    </div>
    <div style="background:rgba(255,255,255,.07);height:120px;margin:0 4px"></div>
    <div style="padding:0 32px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <div style="width:10px;height:10px;border-radius:50%;background:#a78bfa;flex-shrink:0;box-shadow:0 0 8px rgba(167,139,250,.4)"></div>
        <div style="font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#a78bfa">🇧🇷 Orlando + Brasil</div>
      </div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px">Confirmados nos dois eventos</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:80px;font-weight:800;line-height:1;color:#a78bfa">${brUsFinal}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:6px;margin-bottom:14px">participantes confirmados</div>
      <div style="background:rgba(167,139,250,.08);border-radius:6px;height:6px;overflow:hidden;margin-bottom:8px">
        <div style="height:100%;border-radius:6px;background:#a78bfa;width:${brUsPct}%;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
      </div>
      <div style="font-size:13px;font-weight:700;color:#a78bfa">${brUsPct}% dos confirmados</div>
    </div>
    <div style="background:rgba(255,255,255,.07);height:120px;margin:0 4px"></div>
    <div style="padding-left:32px;display:flex;flex-direction:column;gap:16px">
      <div style="font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Distribuição dos confirmados</div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;color:var(--blue)">🇺🇸 Orlando</span>
          <span style="font-size:11px;font-weight:700;color:var(--blue)">${usOnlyPct}%</span>
        </div>
        <div style="background:rgba(255,255,255,.06);border-radius:4px;height:8px;overflow:hidden">
          <div style="height:100%;border-radius:4px;background:var(--blue);width:${usOnlyPct}%;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
        </div>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:11px;color:#a78bfa">🇧🇷 Orlando + Brasil</span>
          <span style="font-size:11px;font-weight:700;color:#a78bfa">${brUsPct}%</span>
        </div>
        <div style="background:rgba(255,255,255,.06);border-radius:4px;height:8px;overflow:hidden">
          <div style="height:100%;border-radius:4px;background:#a78bfa;width:${brUsPct}%;transition:width 1.2s cubic-bezier(.4,0,.2,1)"></div>
        </div>
      </div>
      <div style="font-size:10px;color:var(--muted2);margin-top:4px">% sobre o total de confirmados</div>
    </div>
  </div>
</div>`;
  });
  
  ['cOnb','cW','cTf','cCt','cMat'].forEach(id=>safeRender(id,()=>destroyChart(id)));
  ['lOnb','lW','lTf','lCt'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='';});
  
  document.getElementById('badge-total').textContent=total;
  buildTickerUs(data);
}
function renderViewTurma(key, label){
  const rows  = store[key] && store[key].rows;
  const stats = store[key] && store[key].stats;
  if(!rows||rows.length===0){
    {const _fm=document.getElementById('br-funil-meta-wrap');if(_fm)_fm.style.display='none';}
    safeRender('kpi-dash',()=>{
      document.getElementById('kpi-dash').innerHTML=
        '<div class="kpi hi-b" style="grid-column:1/-1;text-align:center">'
        +'<div class="kpi-lbl">'+label+' Brasil</div>'
        +'<div style="font-size:14px;color:var(--muted);padding:20px">'
        +(DATA_SOURCES[key].url ? '⏳ Carregando dados...' : '⚙️ Configure a URL do Apps Script para '+label)
        +'</div></div>';
    });
    return;
  }
  // Reutiliza toda a lógica do renderViewBr com os dados da turma correta
  const _origRows = store.br.rows;
  const _origStats = store.br.stats;
  const _origSource = store.br.source;
  const _origPT = store.br.pendingTransfers;
  const _origPTC = store.br.pendingTransferCount;
  const _origDFO = store.br.dossieForaOnboarding;
  const _origCartas = store.br.cartas;
  const _origFrases = store.br.frases;
  const _origConc = store.br.conciliacao;
  store.br.cartas = store[key].cartas;
  store.br.frases = store[key].frases;
  store.br.conciliacao = store[key].conciliacao;
  store.br.rows   = rows;
  store.br.stats  = stats;
  store.br.source = store[key].source;
  store.br.pendingTransfers = store[key].pendingTransfers;
  store.br.pendingTransferCount = store[key].pendingTransferCount;
  store.br.dossieForaOnboarding = store[key].dossieForaOnboarding;
  // Atualiza título da imersão
  renderViewBr(label);
  // Restaura BR
  store.br.rows   = _origRows;
  store.br.stats  = _origStats;
  store.br.source = _origSource;
  store.br.pendingTransfers = _origPT;
  store.br.pendingTransferCount = _origPTC;
  store.br.dossieForaOnboarding = _origDFO;
  store.br.cartas = _origCartas;
  store.br.frases = _origFrases;
  store.br.conciliacao = _origConc;
}

function renderViewGeral(){
  const _fm=document.getElementById('br-funil-meta-wrap');if(_fm)_fm.style.display='none';{const _npf=document.getElementById('np-faixa');if(_npf)_npf.style.display='none';}
  {const _sm=document.getElementById('seatmap-section');if(_sm)_sm.style.display='none';}
  const br  = store.br;
  const t15 = store.t15;
  const t16 = store.t16;
  if(!br.rows){Logger.warn('UI','renderViewGeral: T14 indisponível');return;}

  function turmaStats(s, lbl, cor, mes) {
    const pr = s.stats?.presenca||{};
    const total = s.rows?.length||0;
    const conf  = pr.totalConfirmados||0;
    const sem   = pr.semRetorno||0;
    const onb   = s.stats?.onboarding?.realizado||0;
    const cancel= pr.cancelamento||0;
    const prox  = pr.proximaTurma||0;
    const pend  = computePendingTransfer(s, lbl);
    const valida= (pr.turmaValida!=null?pr.turmaValida:(conf+sem)) + pend;
    if(!s.rows||s.rows.length===0) return '<div class="geral-card br" style="opacity:.4"><div class="geral-flag">🇧🇷 '+lbl+'</div><div class="geral-turma">PCE '+lbl+' — Brasil</div><div class="geral-title" style="color:var(--muted)">Aguardando dados...</div></div>';
    return '<div class="geral-card br" onclick="gModalOpen(\''+lbl+'\','+(mes||''?'\''+mes+'\'':'\'\'')+',' +total+','+conf+','+sem+','+onb+','+prox+','+cancel+')">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start">'
      +'<div class="geral-flag">🇧🇷 '+lbl+'</div>'
      +(mes?'<div style="font-family:Barlow Condensed,sans-serif;font-size:24px;font-weight:800;color:var(--green);letter-spacing:.04em">'+mes.toUpperCase()+'</div>':'')
      +'</div>'
      +'<div class="geral-turma">PCE '+lbl+' — Brasil</div>'
      +'<div class="geral-title">Programa de Crescimento Empresarial</div>'
      +'<div class="geral-kpis">'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Turma Válida</div><div class="geral-kpi-val">'+valida+'</div><div class="geral-kpi-sub">'+(pend>0?(conf+sem)+' na turma + '+pend+' a transferir':conf+' conf + '+sem+' sem ret')+'</div></div>'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Confirmados</div><div class="geral-kpi-val">'+conf+'</div><div class="geral-kpi-sub">'+(total>0?Math.round(conf/total*100):0)+'% do total</div></div>'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Sem Retorno</div><div class="geral-kpi-val" style="color:var(--red)">'+sem+'</div><div class="geral-kpi-sub">'+(total>0?Math.round(sem/total*100):0)+'% do total</div></div>'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Onboarding</div><div class="geral-kpi-val">'+onb+'</div><div class="geral-kpi-sub">'+(total>0?Math.round(onb/total*100):0)+'% realizado</div></div>'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Próx. Turma</div><div class="geral-kpi-val" style="color:var(--amber)">'+prox+'</div></div>'
      +'<div class="geral-kpi"><div class="geral-kpi-lbl">Cancelamentos</div><div class="geral-kpi-val" style="color:var(--red)">'+cancel+'</div></div>'
      +'</div></div>';
  }

  // KPIs consolidados
  const totalGeral = (br.rows?.length||0) + (t15.rows?.length||0) + (t16.rows?.length||0);
  const confGeral  = (br.stats?.presenca?.totalConfirmados||0)
                   + (t15.stats?.presenca?.totalConfirmados||0)
                   + (t16.stats?.presenca?.totalConfirmados||0);
  const semGeral   = (br.stats?.presenca?.semRetorno||0)
                   + (t15.stats?.presenca?.semRetorno||0)
                   + (t16.stats?.presenca?.semRetorno||0);
  const onbGeral   = (br.stats?.onboarding?.realizado||0)
                   + (t15.stats?.onboarding?.realizado||0)
                   + (t16.stats?.onboarding?.realizado||0);

  // KPIs removidos da visão geral — cards das turmas já mostram tudo
  document.getElementById('kpi-dash').innerHTML='';

  safeRender('imersao-container',()=>{
    document.getElementById('imersao-container').innerHTML=
      '<div class="geral-header" style="grid-template-columns:repeat(2,1fr);gap:16px">'
      + turmaStats(t15, 'T15', '#f5a623', 'Agosto')
      + turmaStats(t16, 'T16', '#f5a623', 'Novembro')
      +'</div>';
  });

  document.getElementById('badge-total').textContent=totalGeral;
  buildTickerGeralBR([t15,t16]);
}
function renderCurrentView(){const v=store.meta.currentView;Logger.debug('UI','renderCurrentView',{view:v});safeRender('view_'+v,()=>{if(v==='br')renderViewBr();else if(v==='t15')renderViewTurma('t15','T15');else if(v==='t16')renderViewTurma('t16','T16');else if(v==='geral')renderViewGeral();});}
function setStatus(type,txt){const p=document.getElementById('pill'),d=document.getElementById('dot'),t=document.getElementById('pill-txt');if(!p||!d||!t)return;const cls={ok:'',err:' err',load:' loading',neu:' neu',offline:' offline'};const dcls={ok:'',err:' off',load:' spin',neu:' warn',offline:' warn'};p.className='pill'+(cls[type]||'');d.className='dot'+(dcls[type]||'');t.textContent=txt;}
function updateTimestamp(suffix=''){const el=document.getElementById('ts');if(!el)return;el.textContent=new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+(suffix?' '+suffix:'');}

/* === Imersão T14 — dados + render (cruzamento das bases da imersão 25–28/05/2026) === */
const IMERSAO_T14={"durante":[{"n":"Daniele Cesconeto","e":"DC Supermercado","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"MARCELIA BRUNA SOUSA DE OLIVEIRA MARINHO","e":"Oliveira Marinho Advocacia","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"Hariadney Fernandes almeida alves","e":"","s":"BR CONFIRMADO","sala":false,"d":"25/05"},{"n":"ANDERSON BASILIO DE OLIVEIRA","e":"","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"ELIAS FAZIO GOIS","e":"KS tubos, válvulas e conexões","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"Alyne Terra Tozzi de Sousa","e":"","s":"BR CONFIRMADO","sala":false,"d":"25/05"},{"n":"Luciene rocha de Oliveira","e":"","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"Paulo Albuquerque","e":"Seu Brownie","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"JUCIANE ILZOMARA BRUSKOVSKI BORGES","e":"","s":"BR CONFIRMADO","sala":true,"d":"25/05"},{"n":"NICOLAS FLUGEL","e":"","s":"","sala":true,"d":"26/05"},{"n":"CELSO OTO KERBER","e":"","s":"","sala":true,"d":"26/05"},{"n":"MOISEIS FERRARESSO","e":"","s":"","sala":true,"d":"26/05"},{"n":"ADEMILSON INACIO COSTA","e":"","s":"BR CONFIRMADO","sala":true,"d":"26/05"},{"n":"REGINA KERBER","e":"","s":"","sala":true,"d":"26/05"},{"n":"Norton Borges","e":"","s":"","sala":true,"d":"26/05"},{"n":"HOANA ALMEIDA SANTOS LINDEMAIER","e":"","s":"","sala":false,"d":"26/05"},{"n":"Virgínia Endlich Fiorese","e":"Levei um bolo","s":"","sala":true,"d":"26/05"}],"dez":[{"n":"ERALDO DERY CORREA","e":"Moderna Serviços Terceirizados Ltda","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"FABRICIO LUCENA DE ALMEIDA","e":"Fabrício Almeida Cirurgia Plástica","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"Patrícia Franceila Vésper Plaster","e":"Agro Pavão","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"RIUJI DE MELO ROSA KAMACHI","e":"Oriental Garden","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"TIEMY DE MELLO ROSA KAMACHI","e":"","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"FELIPE AMARAL PIMENTA","e":"Nova Sucuri","s":"BR CONFIRMADO","sala":true,"d":"15/05"},{"n":"Vicente de Paulo Macedo","e":"Paulinho Sorvetes","s":"BR CONFIRMADO","sala":true,"d":"18/05"},{"n":"Alysson Santos Lisboa","e":"","s":"BR CONFIRMADO","sala":false,"d":"18/05"},{"n":"Marcelo Teixeira Do Nascimento","e":"","s":"BR CONFIRMADO","sala":true,"d":"19/05"},{"n":"Talita Vasconcelos","e":"Grupo Siom","s":"BR CONFIRMADO","sala":true,"d":"19/05"},{"n":"BRUNA FRANCELINO","e":"","s":"PROXIMA TURMA","sala":false,"d":"19/05"},{"n":"KARLA CRISTINA DE MELO ROSA FREGNANI","e":"","s":"AUT - PROX - TURMA","sala":false,"d":"19/05"},{"n":"LUIZA BATISTA COURA","e":"WR Consorcio","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"PEDRO HENRIQUE COELHO DONATO","e":"WR Construtora","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"LARISSA MIRANDA SIMAO DONATO","e":"WR Construtora","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"VALERIA FELISBERTO FIOROT","e":"Clínica Persona","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"ANDRE BARCELLOS","e":"JARACATIÁ DISTRIBUIDORA LTDA","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"Everto Barros da silva Barros","e":"Super simples","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"JOSELMA MARIA DE LIMA OLIVEIRA","e":"","s":"BR CONFIRMADO","sala":false,"d":"20/05"},{"n":"LEILANNY CASSIANO","e":"","s":"BR CONFIRMADO","sala":true,"d":"20/05"},{"n":"Ricardo Moreira","e":"","s":"BR CONFIRMADO","sala":true,"d":"21/05"},{"n":"Lorena Lobo Pricevicius","e":"LP empreendimentos","s":"BR CONFIRMADO","sala":true,"d":"21/05"}],"prox_sala":[{"n":"Zaquiely Guzatti Klafke Rodrigues","e":"","s":"PROXIMA TURMA","sala":true,"d":"06/02"}],"autprox_sala":[{"n":"Adair Oliveira Carvalho","e":"","s":"AUT - PROX - TURMA","sala":true,"d":"01/04"}],"cancel_sala":[],"branco_sala":[{"n":"Alcemir Hacker","e":"","s":"","sala":true,"d":"13/05"},{"n":"CELSO OTO KERBER","e":"","s":"","sala":true,"d":"26/05"},{"n":"CLAUDEMIR HACKER","e":"Hacker Industrial","s":"","sala":true,"d":"13/05"},{"n":"MOISEIS FERRARESSO","e":"","s":"","sala":true,"d":"26/05"},{"n":"NICOLAS FLUGEL","e":"","s":"","sala":true,"d":"26/05"},{"n":"Norton Borges","e":"","s":"","sala":true,"d":"26/05"},{"n":"REGINA KERBER","e":"","s":"","sala":true,"d":"26/05"},{"n":"Virgínia Endlich Fiorese","e":"Levei um bolo","s":"","sala":true,"d":"26/05"}],"conf_nao_sala":[{"n":"ALINE ROSSETTO","e":"AxDoc","s":"BR CONFIRMADO","sala":false,"d":"24/03"},{"n":"Alyne Terra Tozzi de Sousa","e":"","s":"BR CONFIRMADO","sala":false,"d":"25/05"},{"n":"Alysson Santos Lisboa","e":"","s":"BR CONFIRMADO","sala":false,"d":"18/05"},{"n":"BARBARA PASCOTTO DE OSTE LOCATELLI","e":"Federal Burger","s":"BR CONFIRMADO","sala":false,"d":"25/03"},{"n":"Bruno Avelar de Souza","e":"Clube de Transição","s":"BR CONFIRMADO","sala":false,"d":"08/05"},{"n":"Bruno Garcia Redondo","e":"","s":"BR CONFIRMADO","sala":false,"d":"11/03"},{"n":"CARLA TAKAO","e":"SOLISTEAM","s":"BR CONFIRMADO","sala":false,"d":"02/04"},{"n":"CARLOS REIS VALENTIM DA SILVA","e":"Viva PDV Comunicação visual","s":"BR CONFIRMADO","sala":false,"d":"09/03"},{"n":"DANIELLA MARTINS LOCATELLI DE SOUSA","e":"Restaurante Locatelli","s":"BR CONFIRMADO","sala":false,"d":"20/03"},{"n":"ERIKA COSTA GUANAES","e":"Dedo de Deus Agro","s":"BR CONFIRMADO","sala":false,"d":"14/05"},{"n":"EVANDRO LUIZ MOREIRA","e":"Duemed","s":"BR CONFIRMADO","sala":false,"d":"08/03"},{"n":"Erica Rangel","e":"My Vet Clínica Veterinária","s":"BR CONFIRMADO","sala":false,"d":"11/03"},{"n":"FERNANDO HENRIQUE M LOCATELLI","e":"Silvestre administradora","s":"BR CONFIRMADO","sala":false,"d":"25/03"},{"n":"Francielen de Carvalho Ferreira Ceguinato","e":"Imperium","s":"BR CONFIRMADO","sala":false,"d":"01/04"},{"n":"GECY ALVES NE NETO","e":"","s":"BR CONFIRMADO","sala":false,"d":"05/02"},{"n":"GIORGIO BERTACHINI D ANGELO","e":"Bertachini Advocacia","s":"BR CONFIRMADO","sala":false,"d":"11/03"},{"n":"Hariadney Fernandes almeida alves","e":"","s":"BR CONFIRMADO","sala":false,"d":"25/05"},{"n":"JOSELMA MARIA DE LIMA OLIVEIRA","e":"","s":"BR CONFIRMADO","sala":false,"d":"20/05"},{"n":"JOSÉ MARCOS DA SILVA SANTOS","e":"JM concretos","s":"BR CONFIRMADO","sala":false,"d":"05/05"},{"n":"LARISSA VITORIA LOPES FIRMINO","e":"Agnus Consultoria e Corretora","s":"BR CONFIRMADO","sala":false,"d":"10/03"},{"n":"LUAN ARIEL GUZATTI KLAFKE","e":"","s":"BR CONFIRMADO","sala":false,"d":"20/03"},{"n":"Lucas Asato Britto Lopes","e":"Eco Brasil Bioenergia LTDA","s":"BR CONFIRMADO","sala":false,"d":"09/02"},{"n":"MARCELO CARASSA","e":"","s":"BR CONFIRMADO","sala":false,"d":"05/05"},{"n":"Marla Honorato Braga Andrade","e":"M C EMPREENDIMENTOS DIGITAIS","s":"BR CONFIRMADO","sala":false,"d":"10/03"},{"n":"RAFAEL CEGUINATO RODRIGUES RIBEIRO","e":"IMPERIUM Galvânica","s":"BR CONFIRMADO","sala":false,"d":"01/04"},{"n":"ROBERTO DE LACERDA RUSSO","e":"My Vet","s":"BR CONFIRMADO","sala":false,"d":"12/03"},{"n":"Rodrigo Pereira de Freitas","e":"Pedreira de Freitas Serviços Medicos","s":"BR CONFIRMADO","sala":false,"d":"09/02"},{"n":"Rony Franchin","e":"Solisteam","s":"BR CONFIRMADO","sala":false,"d":"09/03"},{"n":"Rosa Maria Da Silva","e":"Use7","s":"BR CONFIRMADO","sala":false,"d":"14/04"},{"n":"Samara Lilian da silva","e":"Àprigio Prime","s":"BR CONFIRMADO","sala":false,"d":"19/03"},{"n":"Zaquiely Guzatti Klafke Rodrigues","e":"Campo-Erê Comércio de Peças e Serviços L","s":"BR CONFIRMADO","sala":false,"d":"11/03"}],"fora_base":[{"n":"Eronaldo dos Santos"},{"n":"Cassio Campos"},{"n":"Claudia Zamberlan"},{"n":"Alexandre Borges Boaflores"}],"timeline":[{"d":"18/05","v":2},{"d":"19/05","v":4},{"d":"20/05","v":8},{"d":"21/05","v":2},{"d":"25/05","v":9},{"d":"26/05","v":8}],"tot":{"sala":275,"conf":296,"conf_sala":265,"durante":17,"dez":22,"universo":402}};
function _imtTag(s){const u=(s||'').toUpperCase();if(u.includes('CONFIRMADO'))return'<span class="imt-tag conf">Confirmado</span>';if(u.includes('CANCEL'))return'<span class="imt-tag cancel">Cancelamento</span>';if(u.includes('PROX')||u.includes('TURMA'))return'<span class="imt-tag prox">'+(u.startsWith('AUT')?'Aut próx turma':'Próxima turma')+'</span>';if(!u.trim())return'<span class="imt-tag blank">Sem status</span>';return'<span class="imt-tag blank">'+s+'</span>';}
function _imtChip(p,opt){opt=opt||{};const seat=p.sala?'<span class="imt-seat" title="Mapeado na sala">🪑</span>':'';const nm=(p.n||'(sem nome)').replace(/[<>]/g,'');const dt=(opt.date&&p.d)?'<span class="imt-cd">'+p.d+'</span>':'';const tg=opt.tag?_imtTag(p.s):'';return'<span class="imt-chip">'+seat+'<span class="imt-cn">'+nm+'</span>'+tg+dt+'</span>';}
function _imtPeople(arr,opt){if(!arr||!arr.length)return'<div class="imt-empty">Nenhum registro nesta categoria ✓</div>';return'<div class="imt-people">'+arr.map(p=>_imtChip(p,opt)).join('')+'</div>';}
function imtToggle(id,btn){const el=document.getElementById(id);if(!el)return;const open=el.classList.toggle('imt-hidden')===false;if(btn)btn.textContent=open?'Ocultar nomes ▾':('Ver nomes ('+(btn.dataset.n||'')+') ▸');}
let _imtSeq=0;
function _imtBlk(label,desc,arr,opt){opt=opt||{};_imtSeq++;const id='imtb'+_imtSeq;const n=arr?arr.length:0;const sev=opt.sev||'';const hasNames=n>0;
const btn=hasNames?'<div class="imt-btn" data-n="'+n+'" onclick="imtToggle(\''+id+'\',this)">Ver nomes ('+n+') ▸</div>':'<div class="imt-btn off">— sem nomes</div>';
let h='<div class="imt-blk"><div class="imt-blk-top"><div class="imt-blk-num '+sev+'">'+n+'</div><div class="imt-blk-tt"><div class="imt-blk-h">'+label+'</div>'+(desc?'<div class="imt-blk-d">'+desc+'</div>':'')+'</div>'+btn+'</div>';
if(hasNames)h+='<div id="'+id+'" class="imt-list imt-hidden">'+_imtPeople(arr,opt)+'</div>';
h+='</div>';return h;}
function renderImersaoT14(){const wrap=document.getElementById('imersao-t14-wrap');if(!wrap)return;_imtSeq=0;const D=IMERSAO_T14,T=D.tot;
const confNaoSala=T.conf-T.conf_sala;
const tlMax=Math.max(1,...D.timeline.map(x=>x.v));const evtDays=['25/05','26/05','27/05','28/05'];
const tl=D.timeline.map(x=>{const hh=Math.round(x.v/tlMax*78)+8;const evt=evtDays.includes(x.d);return'<div class="imt-tl-col"><div class="imt-tl-n">'+x.v+'</div><div class="imt-tl-bar'+(evt?' evt':'')+'" style="height:'+hh+'px"></div><div class="imt-tl-d">'+x.d+'</div></div>';}).join('');
let h='';
h+='<div class="imt-faixa"><div><h2>🎯 Imersão T14 — O que aconteceu durante o evento</h2><div class="imt-sub">Cruzamento de Matriculados (Data de Aprovação), Onboarding (status) e mapeamento da sala</div></div><div class="imt-date">25–28 / 05 / 2026</div></div>';
h+='<div class="imt-note">Janela do evento: <b>Noite de Networking 25/05</b> + <b>Imersão presencial 26–28/05</b>. Conversões medidas pela <b>Data de Aprovação</b> (exato, por CPF). Presença na sala vem do <b>mapeamento manual da imersão</b> (cruzado por nome — aproximado).</div>';

// CARD 1 — conversões
h+='<div class="card"><div class="ct">📈 Conversões na janela do evento</div><div class="cs">Matrículas com Data de Aprovação nos 10 dias que antecederam e durante o evento</div>';
h+='<div class="imt-grid">';
h+='<div class="imt-stat amber"><div class="imt-v">'+D.dez.length+'</div><div class="imt-l">10 dias antes</div><div class="imt-s">aprovadas 15–24/05 (pré-evento)</div></div>';
h+='<div class="imt-stat"><div class="imt-v">'+D.durante.length+'</div><div class="imt-l">Durante o evento</div><div class="imt-s">aprovadas 25–28/05</div></div>';
h+='<div class="imt-stat neutral"><div class="imt-v">'+(D.dez.length+D.durante.length)+'</div><div class="imt-l">Total de matrículas</div><div class="imt-s">somando pré-evento + durante (15–28/05)</div></div>';
h+='</div>';
h+='<div class="imt-tl-leg"><span><i style="background:var(--green3)"></i>Pré-evento</span><span><i style="background:var(--green)"></i>Durante (25–28/05)</span></div>';
h+='<div class="imt-tl">'+tl+'</div>';
h+=_imtBlk('Durante o evento (25–28/05)','🪑 = também mapeado na sala · vários entram ainda sem status (matrícula recém-aprovada)',D.durante,{date:true,tag:true});
h+=_imtBlk('10 dias antes (15–24/05) — pré-evento','',D.dez,{date:true,tag:true,sev:'amber'});
h+='</div>';

// CARD 2 — sala x status
h+='<div class="card" style="margin-top:14px"><div class="ct">🪑 Quem estava na sala × status no sistema</div><div class="cs">Cruzamento do mapeamento presencial com o status de cada pessoa na Onboarding T14</div>';
h+='<div class="imt-grid">';
h+='<div class="imt-stat"><div class="imt-v">'+T.sala+'</div><div class="imt-l">Mapeados na sala</div><div class="imt-s">pessoas identificadas no mapa</div></div>';
h+='<div class="imt-stat"><div class="imt-v">'+T.conf_sala+'</div><div class="imt-l">Confirmados presentes</div><div class="imt-s">de '+T.conf+' confirmados na turma</div></div>';
h+='<div class="imt-stat red"><div class="imt-v">'+confNaoSala+'</div><div class="imt-l">Confirmaram e não vieram</div><div class="imt-s">confirmados sem presença mapeada na sala</div></div>';
h+='<div class="imt-stat amber"><div class="imt-v">'+(D.branco_sala.length+D.prox_sala.length+D.autprox_sala.length+D.cancel_sala.length)+'</div><div class="imt-l">Não confirmaram, mas vieram</div><div class="imt-s">compareceram à imersão sem confirmar</div></div>';
h+='</div>';
h+=_imtBlk('Próxima turma — mas vieram à imersão','Marcados como próxima turma / aut. próxima turma, porém mapeados na sala',D.prox_sala.concat(D.autprox_sala),{tag:true,sev:'amber'});
h+=_imtBlk('Cancelamento — mas vieram à imersão','Marcados como cancelamento, porém mapeados na sala',D.cancel_sala,{tag:true,sev:'red'});
h+=_imtBlk('Na sala mas NÃO estavam como confirmados','Estavam fisicamente na sala porém sem status de confirmado (em branco na presença) — vários são matrículas aprovadas em 26/05, durante a imersão. Precisam de definição de status.',D.branco_sala,{date:true,sev:'amber'});
h+=_imtBlk('Na sala, mas fora da Onboarding T14','Mapeados na sala sem correspondência na base — <b>podem ser staff/equipe</b>, acompanhantes/cônjuges, próxima turma ainda não inserida, ou variação de grafia a conferir.',D.fora_base,{sev:'muted'});
h+=_imtBlk('Confirmados que NÃO aparecem no mapa da sala','Confirmados na turma sem correspondência no mapeamento — possível ausência (no-show) ou lacuna do mapa manual. Conferir individualmente.',D.conf_nao_sala,{date:true,sev:'red'});
h+='</div>';
wrap.innerHTML=h;
}

let dashMode='atual';
function switchView(v){if(!['br','t15','t16','geral'].includes(v)){Logger.error('UI','switchView inválida',{v});return;}store.meta.currentView=v;const labels={br:'active-br',t15:'active-t15',t16:'active-t16',us:'active-us',geral:'active-geral'};['br','t15','t16','geral'].forEach(id=>{const btn=document.getElementById('vbtn-'+id);if(btn)btn.className='vbtn'+(id===v?' '+labels[id]:'');});const prefix=(dashMode==='turmas')?'Turmas':'Dashboard';const titles={br:prefix+' — T14 Brasil',t15:prefix+' — T15 Brasil',t16:prefix+' — T16 Brasil',geral:'PCE — Visão Geral'};const titleEl=document.getElementById('page-title');if(titleEl)titleEl.textContent=titles[v];const months={br:'Maio',t15:'Agosto',t16:'Novembro'};const mb=document.getElementById('month-bar');if(mb){if(months[v]){mb.innerHTML='<span class="mb-turma">'+(v==='br'?'T14':v.toUpperCase())+'</span><span class="mb-kicker">Imersão de</span><span class="mb-month">'+months[v]+'</span>';mb.style.display='flex';}else{mb.style.display='none';}}renderCurrentView();}
function configTurmaButtons(mode){dashMode=(mode==='turmas')?'turmas':'atual';const turmas=(mode==='turmas');[['br',turmas],['t15',!turmas],['t16',!turmas],['geral',!turmas]].forEach(function(p){const b=document.getElementById('vbtn-'+p[0]);if(b)b.style.display=p[1]?'':'none';});let target;if(turmas)target='br';else target=(store.meta.currentView==='br')?'t15':store.meta.currentView;switchView(target);}
var PAGINAS_RESTRITAS={nps:'NPS — PCE',admin:'Painel ADM'};
function gatedLogin(){
  var pr=(typeof window.__bootstrapManual==='function')?window.__bootstrapManual():Promise.resolve();
  Promise.resolve(pr).catch(function(){}).then(function(){
    if(!_supabaseReady && typeof supabaseInit==='function'){try{supabaseInit();}catch(e){}}
    authShowModal('login');
  });
}
function showLockedPage(p){
  var nome=PAGINAS_RESTRITAS[p]||'Esta área';
  window.__gatedPending=p;
  ['dash','perfil','faq','insights','manual','manual-pce','nps','estoque'].forEach(function(pg){var el=document.getElementById('page-'+pg);if(el)el.classList.remove('active');});
  var lk=document.getElementById('page-locked');if(lk)lk.classList.add('active');
  var m=document.getElementById('locked-msg');if(m)m.textContent='O '+nome+' contém informações restritas e está disponível apenas para usuários autenticados. Faça login para acessar.';
  ['dash','turmas','perfil','faq','insights','manual','manual-pce','nps','estoque'].forEach(function(nv){var el=document.getElementById('nav-'+nv);if(el)el.classList.toggle('active',nv===p);});
  var t=document.getElementById('page-title');if(t)t.textContent=nome;
  try{var sw=document.getElementById('view-switch');if(sw)sw.style.display='none';}catch(e){}
}
function switchPage(p){
  /* Gate de autenticação: NPS e Turmas expõem dados sigilosos (avaliações nominais de
     mentores, comentários de mentorados, dados de turma). Reforçado por RLS no banco —
     este gate é a camada de UI. */
  if(PAGINAS_RESTRITAS[p] && typeof authIsLogged==='function' && !authIsLogged()){showLockedPage(p);return;}
  /* Painel ADM: exige admin. Reforçado por RLS — aqui é só a UI. */
  if(p==='admin' && !(typeof authIsAdmin==='function' && authIsAdmin())){alert('Área restrita a administradores.');return;}
  /* Turmas: em manutenção — só admin vê o módulo real (dados de T14/T15/T16); demais veem placeholder. */
  if(p==='turmas' && !(typeof authIsAdmin==='function' && authIsAdmin())){
    window.__gatedPending=null;
    try{analyticsPageEnter(p);}catch(e){}
    ['dash','perfil','faq','insights','manual','manual-pce','nps','estoque','locked','admin'].forEach(function(pg){var el=document.getElementById('page-'+pg);if(el)el.classList.remove('active');});
    var mp=document.getElementById('page-manutencao');if(mp)mp.classList.add('active');
    var mLogged=(typeof authIsLogged==='function' && authIsLogged());
    var mBtn=document.getElementById('manutencao-login-btn');if(mBtn)mBtn.style.display=mLogged?'none':'';
    var mMsg=document.getElementById('manutencao-msg');if(mMsg)mMsg.textContent=mLogged?'Esta área está em manutenção e correções. Acesso restrito ao administrador responsável.':'Esta área está em manutenção e correções. Login restrito a administradores.';
    ['dash','turmas','perfil','faq','insights','manual','manual-pce','nps','estoque','admin'].forEach(function(nv){var nav=document.getElementById('nav-'+nv);if(nav)nav.classList.toggle('active',nv===p);});
    var vb=document.getElementById('view-btns-container');if(vb)vb.style.display='none';
    var mt=document.getElementById('page-title');if(mt)mt.textContent='Turmas — Histórico';
    var mb=document.getElementById('month-bar');if(mb)mb.style.display='none';
    return;
  }
  window.__gatedPending=null;
  try{analyticsPageEnter(p);}catch(e){}const isTurmas=(p==='turmas');const pageEl=isTurmas?'dash':p;const activePages=isTurmas?['dash','perfil','insights']:[pageEl];['dash','perfil','faq','insights','manual','manual-pce','nps','estoque','locked','admin'].forEach(pg=>{const el=document.getElementById('page-'+pg);if(el)el.classList.toggle('active',activePages.includes(pg));});const dashPg=document.getElementById('page-dash');if(dashPg){dashPg.classList.toggle('mode-turmas',isTurmas);dashPg.classList.toggle('mode-atual',!isTurmas);}var _pp=document.getElementById('page-perfil');if(_pp)_pp.classList.toggle('standalone',p==='perfil');var _pb=document.getElementById('perfil-body');if(_pb)_pb.style.display='';var _pi=document.getElementById('page-insights');if(_pi)_pi.classList.remove('as-subtab');['dash','turmas','perfil','faq','insights','manual','manual-pce','nps','estoque','admin'].forEach(nv=>{const nav=document.getElementById('nav-'+nv);if(nav)nav.classList.toggle('active',nv===p);});const isDashLike=(p==='dash'||isTurmas);const showSwitch=(isDashLike||p==='perfil'||p==='insights');const viewBtns=document.getElementById('view-btns-container');if(viewBtns)viewBtns.style.display=showSwitch?'flex':'none';const titles={dash:'Dashboard',turmas:'Turmas — Histórico',perfil:'Perfil da Turma',faq:'FAQ — PCE',insights:'Insights Correlacionais',manual:'Manual — Experts','manual-pce':'Manual — PCE','nps':'NPS — PCE','estoque':'Estoque PCE','admin':'Painel ADM'};const titleEl=document.getElementById('page-title');if(titleEl)titleEl.textContent=titles[p]||'';if(showSwitch)configTurmaButtons(isTurmas?'turmas':'dash');if(isTurmas){try{switchView('br');}catch(e){}setTimeout(()=>{try{buildPerfil();}catch(e){}try{if(window.renderInsightsCorrelacionais)window.renderInsightsCorrelacionais();}catch(e){}},150);}else if(p==='dash'){if(store.meta.currentView==='br'){try{switchView('t15');}catch(e){}}}else if(p==='perfil'){try{showPerfilSub('perfil');}catch(e){}try{buildPerfil();}catch(e){}}if(p==='manual'){manualBootCloud();}else if(p==='manual-pce'){if(typeof mpceBootCloud==='function')mpceBootCloud();}else if(p==='estoque'){if(typeof estoqueBootCloud==='function')estoqueBootCloud();}else if(p==='admin'){if(typeof admBoot==='function')admBoot();}}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('collapsed');}
function refreshManual(){Loader.show('Atualizando');const btn=document.getElementById('btnR');if(btn){btn.disabled=true;btn.classList.add('spinning');}const safetyTimer=setTimeout(()=>{if(btn){btn.disabled=false;btn.classList.remove('spinning');}setStatus('neu','Pronto');},10000);fetchAllData(false).finally(()=>{clearTimeout(safetyTimer);if(btn){btn.disabled=false;btn.classList.remove('spinning');}});}
/* Perfil standalone (aba "Perfil da Turma") = template vazio para T15; Turmas = dados T14 */
function _isStandalonePerfil(){const np=document.getElementById('nav-perfil'),nt=document.getElementById('nav-turmas');return !!(np&&np.classList.contains('active'))&&!(nt&&nt.classList.contains('active'));}
function _perfilSrc(){
  if(_isStandalonePerfil()){
    // Perfil ao vivo por turma ativa (confirmados+PREENCHIDO são filtrados no buildPerfil)
    var v=(store.meta&&store.meta.currentView)||'t15';
    if(v==='t15' && store.t15 && store.t15.rows && store.t15.rows.length) return store.t15;
    if(v==='t16' && store.t16 && store.t16.rows && store.t16.rows.length) return store.t16;
    if(v==='geral'){
      var _m=[].concat(
        (store.t15&&store.t15.rows)||[],
        (store.t16&&store.t16.rows)||[],
        (store.br &&store.br.rows )||[]);
      if(_m.length) return {rows:_m,stats:{},source:'api_live'};
    }
    return {rows:[],stats:{},source:null};
  }
  return store.br;
}
function _isStandaloneInsights(){return _isStandalonePerfil();}
function showPerfilSub(which){var pb=document.getElementById('perfil-body'),pi=document.getElementById('page-insights'),bp=document.getElementById('psub-perfil'),bi=document.getElementById('psub-insights');var ins=(which==='insights');if(pb)pb.style.display=ins?'none':'';if(pi){pi.classList.toggle('active',ins);pi.classList.toggle('as-subtab',ins);}if(bp)bp.classList.toggle('active',!ins);if(bi)bi.classList.toggle('active',ins);if(ins&&window.renderInsightsCorrelacionais){setTimeout(window.renderInsightsCorrelacionais,60);}}
function buildPerfil() {
  if(typeof _isStandalonePerfil==='function' && _isStandalonePerfil() && !(_perfilSrc().rows||[]).length){var _pbE=document.getElementById('perfil-body');if(_pbE&&window.__perfilPristineHTML!=null)_pbE.innerHTML=window.__perfilPristineHTML;return;}
  safeRender('kpi-perf', () => {
    // ── Usa dados ao vivo do store (enriquecidos pelo DASH-BR-COMPLETO) ──
    const rows  = _perfilSrc().rows  || [];
    const stats = _perfilSrc().stats || {};

    // v49.5: paridade TOTAL com Dashboard — usa normalizeStatus (igual computeStatsFromRows)
    // Isso garante que variações como "BR CONFIRMADO.", "BR  CONFIRMADO", acentos, etc. contem.
    function normCpf(v){ return (v||'').toString().replace(/\D/g,''); }
    const confirmados = rows.filter(r => {
      const p = normalizeStatus(r.presenca);
      const tf = (r.typeform||'').toUpperCase();
      return (p === 'BR CONFIRMADO' || p === 'BR + US CONFIRMADO'
          || p === 'US CONFIRMADO' || p === 'CONFIRMADO')
          && tf === 'PREENCHIDO';
    });
    const d = confirmados; // alias para compatibilidade com código abaixo
    console.log('[PERFIL] Confirmados analisados (paridade Dashboard via normalizeStatus):', d.length);

    // ── Se dados são do FALLBACK (estático), aguardar API ao vivo ──
    const isLive = _perfilSrc().source && _perfilSrc().source !== 'static_embedded';

    if (!isLive) {
      ['kpi-perf','cSeg','cEst','cGen','cCli','cAval','cFaixaEt','cFaixaFat','cReligiao','cTime'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (id === 'kpi-perf') {
            el.innerHTML = '<div class="kpi" style="grid-column:1/-1;text-align:center;padding:24px"><div class="kpi-lbl">Perfil da Turma</div><div style="color:var(--muted);font-size:13px;margin-top:8px">⏳ Carregando dados ao vivo...</div><div style="color:var(--muted2);font-size:11px;margin-top:4px">Aguardando resposta da API</div></div>';
          }
        }
      });
      ['ins-familia','ins-intencoes','ins-dores','ins-fat','ins-prior','ins-wcloud','ins-top-fat'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      });
      return;
    }

    const total = d.length;
    if (total === 0) {
      document.getElementById('kpi-perf').innerHTML = '<div class="kpi" style="grid-column:1/-1;text-align:center"><div class="kpi-lbl">Perfil</div><div style="color:var(--muted);padding:20px">Nenhum confirmado encontrado</div></div>';
      return;
    }

    // ── KPIs ──
    const comEmpresa  = d.filter(r => r.empresa && r.empresa !== 'Não informado').length;
    const avals       = d.map(r => parseFloat(r.avaliacao)).filter(v => !isNaN(v) && v >= 0 && v <= 10);
    const avgAval     = avals.length > 0 ? (avals.reduce((a,b)=>a+b,0)/avals.length).toFixed(1) : '—';
    const comMvv      = d.filter(r => (r.mvv||'').toUpperCase().includes('SIM')).length;
    document.getElementById('kpi-perf').innerHTML = `
      <div class="kpi hi"><div class="kpi-lbl">Confirmados (perfil)</div><div class="kpi-val g">${total}</div><div class="kpi-sub">todos os confirmados analisados</div></div>
      <div class="kpi hi-b"><div class="kpi-lbl">Empresas mapeadas</div><div class="kpi-val b">${comEmpresa}</div><div class="kpi-sub">${Math.round(comEmpresa/total*100)}% do total</div></div>
      <div class="kpi hi-b"><div class="kpi-lbl">Avaliação média</div><div class="kpi-val b">${avgAval}</div><div class="kpi-sub">colaboração (0–10)</div></div>
      <div class="kpi hi-a"><div class="kpi-lbl">Têm MVV</div><div class="kpi-val a">${Math.round(comMvv/total*100)}%</div><div class="kpi-sub">missão, visão e valores</div></div>
    `;

    // ── Segmento (vem do Typeform — coluna 14 "Qual é o modelo de negócio") ──
    const setorMap = {};
    d.forEach(r => {
      const s = (r.modeloNeg||r.setor||'').trim() || 'Não informado';
      setorMap[s] = (setorMap[s]||0)+1;
    });
    const segE = topN(setorMap, 12);
    renderHBar('cSeg', segE.map(e=>e[0]), segE.map(e=>e[1]), PAL, v=>v+' empresas');
    const segCobertura = d.filter(r => (r.modeloNeg||r.setor||'').trim() && (r.modeloNeg||r.setor||'').trim() !== 'Não informado').length;
    appendCobertura('cSeg', segCobertura, total, 'não informaram o modelo de negócio da empresa');

    // ── Estados (estado vem de Matriculados via join) ──
    const estMap = {};
    d.forEach(r => {
      const s = (r.estado||'').trim() || 'N/I';
      if (s.length >= 2) estMap[s] = (estMap[s]||0)+1;
    });
    const estE = topN(estMap, 10);
    renderHBar('cEst', estE.map(e=>e[0]), estE.map(e=>e[1]), PAL, v=>v+' empresas');
    const estCobertura = d.filter(r => (r.estado||'').trim().length >= 2).length;
    appendCobertura('cEst', estCobertura, total, 'não informaram o estado da empresa');

    // ── Gênero ──
    const genMap = {};
    d.forEach(r => {
      const g = (r.genero||'').trim() || 'Não informado';
      genMap[g] = (genMap[g]||0)+1;
    });
    const gL = Object.keys(genMap), gD = gL.map(k=>genMap[k]), gC = [BL,'#f472b6',AM,G];
    renderDonut('cGen', gL, gD, gC); renderLegend('lGen', gL, gD, gC);
    const genCobertura = d.filter(r => (r.genero||'').trim() && (r.genero||'').trim() !== 'Não informado').length;
    appendCobertura('cGen', genCobertura, total, 'não informaram o gênero');

    // ── Tipo de cliente ──
    function nCli(s) {
      if (!s) return 'Não informado';
      if (s.match(/governo|estadual|municipal|federal|b2g/i)) return 'B2G';
      if (s.match(/jurídica e pessoa física|b2b.*b2c|b2c.*b2b/i)) return 'B2B + B2C';
      if (s.match(/jurídica|b2b/i)) return 'B2B';
      if (s.match(/física|b2c/i))   return 'B2C';
      return s.substring(0,15);
    }
    const cMap = {};
    d.forEach(r => { const k = nCli(r.tipoCliente); cMap[k]=(cMap[k]||0)+1; });
    const cL = Object.keys(cMap), cD = cL.map(k=>cMap[k]), cC = [AM,BL,G,RD,'#a78bfa'];
    renderDonut('cCli', cL, cD, cC); renderLegend('lCli', cL, cD, cC);
    const cliCobertura = d.filter(r => (r.tipoCliente||'').trim()).length;
    appendCobertura('cCli', cliCobertura, total, 'não informaram o tipo de cliente atendido');

    // ── Avaliação de colaboração ──
    const bins = {};
    for (let i=0; i<=10; i++) bins[i]=0;
    avals.forEach(v => { const k=Math.round(v); if(k>=0&&k<=10) bins[k]++; });
    appendCobertura('cAval', avals.length, total, 'não informaram a nota de avaliação de colaboração (0-10)');

    // ── Faixa Etária — usa faixaEt dos Matriculados ou calcula do dtNascDossie ──
    const etMap = {};
    d.forEach(r => {
      let fe = (r.faixaEt||'').trim();
      // Fallback: calcula a partir da data de nascimento do Dossiê
      if (!fe && r.dtNascDossie) {
        const parts = r.dtNascDossie.toString().match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
        if (parts) {
          const idade = new Date().getFullYear() - parseInt(parts[3]);
          if      (idade < 30) fe = 'Até 29 anos';
          else if (idade < 40) fe = '30–39 anos';
          else if (idade < 50) fe = '40–49 anos';
          else if (idade < 60) fe = '50–59 anos';
          else                 fe = '60+ anos';
        }
      }
      const cat = fe || 'Não informado';
      etMap[cat] = (etMap[cat]||0)+1;
    });
    const etOrdem = ['Até 29 anos','30–39 anos','40–49 anos','50–59 anos','60+ anos','Não informado'];
    const etL = etOrdem.filter(k => etMap[k]);
    const etD = etL.map(k => etMap[k]);
    renderHBar('cFaixaEt', etL, etD, PAL, v=>v+' empresas');
    renderLegend('lFaixaEt', etL, etD, PAL);
    const fxetCobertura = total - (etMap['Não informado']||0);
    appendCobertura('cFaixaEt', fxetCobertura, total, 'não tinham data de nascimento ou faixa etária informadas');

    // ── Faixa de Faturamento (faixas REAIS do dado) ──
    const fatMap = {};
    const isSemRetornoFat = v => /^\s*sem\s*retorno?\s*$/i.test(v||'') || /^\s*sem\s*$/i.test(v||'');
    d.forEach(r => {
      const ffRaw = (r.faixaFat||'').trim();
      const ff = (isSemRetornoFat(ffRaw) ? '' : ffRaw) || 'Não informado';
      fatMap[ff] = (fatMap[ff]||0)+1;
    });
    const fatE = topN(fatMap, 10).filter(([k]) => k !== 'Não informado');
    if (fatE.length > 0) {
      renderHBar('cFaixaFat', fatE.map(e=>e[0]), fatE.map(e=>e[1]), PAL, v=>v+' empresas');
      renderLegend('lFaixaFat', fatE.map(e=>e[0]), fatE.map(e=>e[1]), PAL);
      const fatCobertura = fatE.reduce((s,e)=>s+e[1],0);
      appendCobertura('cFaixaFat', fatCobertura, total, 'não informaram a faixa de faturamento anual da empresa');
    }

    // ── Religião (com normalização de acentos + unificação Católico/Católica em um único indicador) ──
    const relMap = {};
    d.forEach(r => {
      const rel = (r.religiao||'').trim();
      if (!rel || rel.length < 2) { relMap['Não informado'] = (relMap['Não informado']||0)+1; return; }
      const ru = rel.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
      let cat = 'Outras';
      if (ru.match(/\b(NAO|NENHUM|ATEU|AGNOS|SEM RELIGIAO)\b/) && !ru.match(/CATOLIC|EVANG|CRIST|ESPIRIT|ADVENT|BATIST|LUTERAN|ASSEMBL|TESTEMUNHA|MUSLIM|MUSULMAN/)) cat = 'Sem religião';
      else if (ru.match(/CATOLIC/)) cat = 'Católico';
      else if (ru.match(/EVANG|PENTECOST|ASSEMBL|BATIST|LUTERAN|ADVENT|PRESBIT|TESTEMUNHA|PROTESTANT|CRENTE|METODIST/)) cat = 'Evangélico';
      else if (ru.match(/ESPIRIT|KARDEC|UMBANDA|CANDOMBL/)) cat = 'Espírita';
      else if (ru.match(/MUSULMAN|MUSLIM|ISLAM/)) cat = 'Islâmico';
      else if (ru.match(/CRIST|JESUS|DEUS|CREIO/)) cat = 'Cristão';
      relMap[cat] = (relMap[cat]||0)+1;
    });
    const relE = topN(relMap, 8);
    renderDonut('cReligiao', relE.map(e=>e[0]), relE.map(e=>e[1]), PAL);
    renderLegend('lReligiao', relE.map(e=>e[0]), relE.map(e=>e[1]), PAL);
    const relCobertura = total - (relMap['Não informado']||0);
    appendCobertura('cReligiao', relCobertura, total, 'não informaram crença ou religião');

    // ── Inscrições ao longo do tempo (usa dtFech de Matriculados) ──
    const dateMap = {};
    d.forEach(r => {
      const raw = r.dtFech || r.data || '';
      let k = null;
      const m1 = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      const m2 = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (m1) k = `${m1[3]}-${m1[2]}-${m1[1]}`;
      else if (m2) k = `${m2[1]}-${m2[2]}-${m2[3]}`;
      else {
        // Tenta formato "Mon Mar 31 2026..."
        const m3 = raw.match(/\b(\w{3})\s+(\w{3})\s+(\d{2})\s+(\d{4})/);
        if (m3) {
          const months={Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'};
          k = `${m3[4]}-${months[m3[2]]||'01'}-${m3[3]}`;
        }
      }
      if (k) dateMap[k] = (dateMap[k]||0)+1;
    });
    const sd2 = Object.keys(dateMap).sort();
    renderLine('cTime', sd2.map(d=>{const[,mo,dy]=d.split('-');return`${dy}/${mo}`;}), sd2.map(k=>dateMap[k]), G);

    
    // ── Organograma — stat-pills ──
    const orgMap={'Sim':0,'Parcialmente':0,'Não':0}; // declarado aqui para evitar TDZ
    // [fix] preenche a contagem ANTES do render das stat-pills (senão as pills saem zeradas)
    d.forEach(r=>{ const v=(r.organograma||r.org||'').trim(); if(orgMap[v]!==undefined) orgMap[v]++; else if(v) orgMap[v]=1; });
    const orgVisEl=document.getElementById('org-visual');
    if(orgVisEl){
      const orgOrder=['Sim','Parcialmente','Não'];
      const orgColors={'Sim':'#46d160','Parcialmente':'#f5a623','Não':'#ff5f5f'};
      const total2=d.length||1;
      let h='<div style="display:flex;flex-direction:column;gap:10px;padding:4px 0">';
      orgOrder.forEach(k=>{
        const n=orgMap[k]||0;
        const pct=Math.round(n/total2*100);
        h+='<div style="display:flex;flex-direction:column;gap:4px">'
          +'<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:var(--cream)">'
          +'<span>'+k+'</span><span style="color:'+orgColors[k]+'">'+n+' · '+pct+'%</span></div>'
          +'<div style="height:8px;border-radius:8px;background:rgba(255,255,255,.07);overflow:hidden">'
          +'<div style="height:100%;width:'+pct+'%;border-radius:8px;background:'+orgColors[k]+';transition:width .6s cubic-bezier(.4,0,.2,1)"></div></div></div>';
      });
      h+='</div>';
      orgVisEl.innerHTML=h;
    }
    // ── Avaliação de Colaboração — NPS-style large number + arc ──
    const avalVisEl=document.getElementById('aval-visual');
    if(avalVisEl && avals.length>0){
      const avg=parseFloat(avgAval);
      const pct=avg/10;
      const R=52,C=2*Math.PI*R,arc=C*0.75;
      const fill=arc*pct;
      const col=avg<=4?'#ff5f5f':avg<=6?'#f5a623':avg<=8?'#46d160':'#4d9fff';
      const maxc=Math.max.apply(null,Object.keys(bins).map(function(k){return bins[k];}).concat([1]));
      const BAR_H=120; // altura (px) da barra de maior frequência
      var scaleHtml='';
      for(var n=0;n<=10;n++){
        var vv=bins[n]||0;
        var hh=vv>0?Math.max(6,Math.round(BAR_H*vv/maxc)):0;
        var cc=n<=4?'#ff5f5f':n<=6?'#f5a623':n<=8?'#46d160':'#4d9fff';
        scaleHtml+='<div style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px;flex:1;min-width:0">'
          +'<div style="font-family:\'Barlow Condensed\',sans-serif;font-size:14px;font-weight:800;line-height:1;color:'+(vv>0?'var(--cream)':'transparent')+'">'+(vv>0?vv:'')+'</div>'
          +'<div style="width:100%;max-width:30px;height:'+hh+'px;min-height:'+(vv>0?6:2)+'px;border-radius:5px 5px 3px 3px;background:'+(vv>0?cc:'rgba(255,255,255,.05)')+';transition:height .6s ease"></div>'
          +'<div style="font-size:11px;font-weight:600;line-height:1;color:var(--muted2)">'+n+'</div></div>';
      }
      var mn=Math.min.apply(null,avals),mx=Math.max.apply(null,avals);
      avalVisEl.innerHTML='<div style="display:flex;align-items:flex-end;gap:24px;padding:10px 4px 4px">'
        +'<div style="flex-shrink:0;position:relative;width:150px;height:100px;overflow:hidden">'
        +'<svg viewBox="0 0 124 82" width="150" height="100">'
        +'<path d="M14 70 A52 52 0 1 1 110 70" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="9" stroke-linecap="round"/>'
        +'<path d="M14 70 A52 52 0 1 1 110 70" fill="none" stroke="'+col+'" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+arc.toFixed(1)+'" stroke-dashoffset="'+(arc-fill).toFixed(1)+'" style="transition:stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)"/>'
        +'<text x="62" y="60" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-size="30" font-weight="800" fill="'+col+'">'+avgAval+'</text>'
        +'<text x="62" y="75" text-anchor="middle" font-family="Barlow,sans-serif" font-size="10" font-weight="600" fill="var(--muted)">média</text>'
        +'</svg></div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="display:flex;align-items:flex-end;gap:6px;height:'+(BAR_H+38)+'px">'+scaleHtml+'</div>'
        +'<div style="font-size:11px;color:var(--muted);margin-top:10px">'+avals.length+' resposta'+(avals.length>1?'s':'')+' · menor '+mn+' · maior '+mx+'</div>'
        +'</div></div>';
    }

    
    const confMap={'SIM':0,'Próxima turma':0,'Outro motivo':0};
    d.forEach(r=>{
      const c=(r.confirmacao||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
      if(c.includes('SIM')) confMap['SIM']++;
      else if(c.includes('PROXIMA')||c.includes('PRÓXIMA')) confMap['Próxima turma']++;
      else if(c.length>1) confMap['Outro motivo']++;
    });
    const cL2=Object.keys(confMap),cD2=cL2.map(k=>confMap[k]),cC2=['#46d160','#f5a623','#ff5f5f'];
    renderDonut('cConf',cL2,cD2,cC2); renderLegend('lConf',cL2,cD2,cC2);

    // ── Maturidade em IA (1–5) ──
    const iaBins={1:0,2:0,3:0,4:0,5:0};
    d.forEach(r=>{ const v=parseInt(r.nivelIA); if(v>=1&&v<=5) iaBins[v]++; });
    const iaLbls=['1 – Iniciante','2 – Básico','3 – Intermediário','4 – Avançado','5 – Expert'];
    const iaVals=[1,2,3,4,5].map(k=>iaBins[k]);
    const iaCols=[1,2,3,4,5].map(k=>k<=2?'#ff5f5f':k===3?'#f5a623':'#46d160');
    if(document.getElementById('cIA')) {
      if(CHART_REGISTRY['cIA']) CHART_REGISTRY['cIA'].destroy();
      CHART_REGISTRY['cIA']=new Chart(document.getElementById('cIA'),{type:'bar',data:{labels:iaLbls,datasets:[{data:iaVals,backgroundColor:iaCols,borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS},scales:{x:{grid:{display:false},ticks:{color:LC,font:{size:10}},border:{color:'transparent'}},y:{grid:{color:GC},ticks:{color:LC,font:{size:10}},border:{color:'transparent'},min:0}}}});
    }
    appendCobertura('cIA', d.filter(r=>parseInt(r.nivelIA)>=1).length, total, 'Maturidade IA');

    // ── Nº de Colaboradores ──
    const colabOrd=['1 a 5','6 a 20','21 a 50','51 a 200','Mais de 200'];
    const colabMap={};
    d.forEach(r=>{ const v=(r.numColabs||'').trim(); if(v) colabMap[v]=(colabMap[v]||0)+1; });
    const colabE=colabOrd.filter(k=>colabMap[k]).map(k=>[k,colabMap[k]]);
    // also add unknown keys
    Object.keys(colabMap).filter(k=>!colabOrd.includes(k)).forEach(k=>colabE.push([k,colabMap[k]]));
    if(colabE.length>0){ renderHBar('cColabs',colabE.map(e=>e[0]),colabE.map(e=>e[1]),PAL); }
    appendCobertura('cColabs', d.filter(r=>(r.numColabs||'').trim().length>0).length, total, 'Nº colaboradores');

    // ── Organograma (contagem já feita acima, antes das stat-pills) ──
    const orgL=Object.keys(orgMap).filter(k=>orgMap[k]>0);
    const orgD=orgL.map(k=>orgMap[k]);
    const orgC=['#46d160','#f5a623','#ff5f5f','#4d9fff'];
    if(orgL.length>0){ renderDonut('cOrg',orgL,orgD,orgC); renderLegend('lOrg',orgL,orgD,orgC); }
    appendCobertura('cOrg', d.filter(r=>(r.organograma||'').trim().length>0).length, total, 'Organograma');

    // ── Canal de Aquisição ──
    const canalMap={};
    d.forEach(r=>{ const v=(r.canalAquisicao||'').trim(); if(v) canalMap[v]=(canalMap[v]||0)+1; });
    const canalE=topN(canalMap,8);
    if(canalE.length>0){ renderHBar('cCanal',canalE.map(e=>e[0]),canalE.map(e=>e[1]),PAL); }
    appendCobertura('cCanal', d.filter(r=>(r.canalAquisicao||'').trim().length>0).length, total, 'Canal de aquisição');

// ── Dispara insights estratégicos ──
    setTimeout(() => { if (typeof window.renderInsights === 'function') window.renderInsights(); }, 200);
  });
}

function buildFaq(){safeRender('faq-list',()=>{document.getElementById('faq-list').innerHTML=FAQ_DATA.map((f,i)=>`<div class="faq-item" id="faq-${i}"><div class="faq-q" onclick="toggleFaq(${i})"><span>${f.q}</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></div><div class="faq-a">${f.a}</div></div>`).join('');});}
function toggleFaq(i){const el=document.getElementById('faq-'+i);if(el)el.classList.toggle('open');}
// [PCE] INSIGHTS ESTRATÉGICOS — Módulo isolado
(function() {

  // ── CSS dos insights ──────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
.ins-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.ins-bar-label{font-size:11px;color:var(--cream);width:215px;flex-shrink:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ins-bar-bg{flex:1;background:rgba(255,255,255,.06);border-radius:4px;height:8px;overflow:hidden}
.ins-bar-fill{height:100%;border-radius:4px;background:var(--green);transition:width .8s cubic-bezier(.4,0,.2,1)}
.ins-bar-val{font-size:11px;font-weight:700;color:var(--cream);width:24px;text-align:right;flex-shrink:0}
.ins-bar-pct{font-size:10px;color:var(--muted);width:32px;flex-shrink:0}
.ins-empty{font-size:12px;color:var(--muted);padding:20px 0;text-align:center}
.fat-table{width:100%;border-collapse:collapse;font-size:11px}
.fat-table th{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:0 0 8px;text-align:left}
.fat-table td{padding:5px 4px;color:var(--cream);border-bottom:1px solid var(--border);vertical-align:middle}
.fat-table td.num{text-align:right;font-weight:700;color:var(--green)}
.fat-table td.pct{text-align:right;color:var(--muted);font-size:10px}
.fat-pill{font-size:10px;background:var(--green2);color:var(--green);padding:3px 9px;border-radius:5px;white-space:nowrap;display:inline-flex;align-items:baseline;gap:2px;font-weight:700;letter-spacing:.02em}
.fat-pill-unit{font-size:8px;opacity:.7;font-weight:500;letter-spacing:0}
.wcloud{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;padding:8px 0;min-height:100px}
.g-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(5px);z-index:900;opacity:0;pointer-events:none;transition:opacity .25s}
.g-overlay.on{opacity:1;pointer-events:all}
.g-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-46%) scale(.95);z-index:901;width:min(560px,88vw);background:var(--card);border:1px solid var(--border2);border-radius:14px;padding:24px;box-shadow:0 24px 60px rgba(0,0,0,.5);opacity:0;pointer-events:none;transition:all .25s cubic-bezier(.4,0,.2,1)}
.g-modal.on{opacity:1;pointer-events:all;transform:translate(-50%,-50%) scale(1)}
.g-modal-x{position:absolute;top:12px;right:14px;background:none;border:none;color:var(--muted);font-size:18px;cursor:pointer;padding:4px 8px;border-radius:6px}
.g-modal-x:hover{color:var(--cream)}
.g-modal-flag{font-family:'Barlow Condensed',sans-serif;font-size:46px;font-weight:800;color:var(--cream);line-height:1;margin-bottom:3px}
.g-modal-mes{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:.12em;color:var(--green);margin-bottom:2px}
.g-modal-sub{font-size:11px;color:var(--muted);margin-bottom:18px}
.g-modal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.g-modal-kpi{background:rgba(255,255,255,.04);border-radius:8px;padding:11px 13px}
.g-modal-kpi b{display:block;font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:800;line-height:1;margin:4px 0 2px}
.g-modal-kpi small{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
.g-modal-kpi span{display:block;font-size:9px;color:var(--muted2);margin-top:2px}
.geral-card{cursor:pointer;transition:transform .18s,box-shadow .18s}
.geral-card:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(0,0,0,.4)}
.ins-cor-gauge-val{font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:800;line-height:1}
.ins-cor-gauge-lbl{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ins-cor-gauge-bar{width:100%;background:rgba(255,255,255,.07);border-radius:4px;height:8px;overflow:hidden;margin-top:4px}
.ins-cor-gauge-fill{height:100%;border-radius:4px;transition:width 1s cubic-bezier(.4,0,.2,1)}
.ins-dores-faixa{margin-bottom:14px}
.ins-dores-faixa-titulo{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--green);margin-bottom:6px}
.ins-dores-tags{display:flex;flex-wrap:wrap;gap:6px}
.ins-dores-tag{font-size:10px;font-weight:600;padding:3px 10px;border-radius:12px;background:var(--green2);color:var(--green)}
.ins-mvv-compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:8px 0}
.ins-mvv-card{background:rgba(255,255,255,.03);border-radius:8px;padding:14px;text-align:center}
.ins-mvv-card-lbl{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.ins-mvv-card-val{font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:800;line-height:1}
.ins-mvv-card-sub{font-size:10px;color:var(--muted2);margin-top:4px}
.ins-mvv-card-unit{font-size:14px;color:var(--muted);font-weight:500;margin-left:3px;letter-spacing:0}
.ins-cobertura{margin-top:14px;padding:10px 14px;background:rgba(255,255,255,.025);border-left:3px solid var(--muted2);border-radius:6px;font-size:11px;color:var(--muted);line-height:1.5;font-style:italic}
.ins-cobertura strong{color:var(--cream);font-weight:700;font-style:normal}
/* ──── Top 10 Maiores Faturamentos — layout limpo e bonito (v44) ──── */
.top-fat-row{display:grid;grid-template-columns:24px 1fr 70px 95px;align-items:center;gap:12px;padding:8px 4px;border-bottom:1px solid var(--border);transition:background .15s}
.top-fat-row:last-child{border-bottom:none}
.top-fat-row:hover{background:rgba(255,255,255,.02)}
.top-fat-pos{font-size:14px;font-weight:800;text-align:center;line-height:1}
.top-fat-info{min-width:0;display:flex;flex-direction:column;gap:2px}
.top-fat-nome{font-size:12px;color:var(--cream);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2}
.top-fat-faixa{font-size:9.5px;color:var(--muted);font-weight:500;letter-spacing:.03em;line-height:1}
.top-fat-bar-bg{background:rgba(255,255,255,.06);border-radius:4px;height:10px;overflow:hidden}
.top-fat-bar-fill{height:100%;border-radius:4px;background:var(--green);transition:width .8s cubic-bezier(.4,0,.2,1)}
.top-fat-val{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:800;color:var(--green);text-align:right;line-height:1;white-space:nowrap}
.top-fat-val-sub{font-size:9px;color:var(--muted);font-weight:500;margin-left:2px;letter-spacing:0}
/* ──── Estrutura Familiar (v48) — storytelling ──── */
.fam-story{display:flex;flex-direction:column;gap:14px;padding:4px 0}
.fam-block{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;background:rgba(255,255,255,.025);border-radius:8px;border-left:3px solid var(--green)}
.fam-icon{font-size:22px;line-height:1;flex-shrink:0;margin-top:2px}
.fam-content{flex:1;min-width:0}
.fam-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:6px}
.fam-numbers{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.fam-big{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:var(--green);line-height:1}
.fam-of{font-size:11px;color:var(--muted);font-weight:500}
.fam-pct{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:var(--cream);margin-left:auto}
.fam-context{font-size:10.5px;color:var(--muted);font-style:italic;margin-top:6px;line-height:1.4}
.fam-context strong{color:var(--cream);font-weight:700;font-style:normal}
/* ──── Mapa Faturamento + Dores/Prioridades — layout 60/40 ──── */
.g-mapfat{display:grid;grid-template-columns:1fr 1.1fr;gap:14px}
.g-mapfat-right{display:flex;flex-direction:column;gap:14px}
@media (max-width:1100px){
  .g-mapfat{grid-template-columns:1fr}
}
/* ========================================================================
   DIAGNÓSTICO ESTRATÉGICO + KPI DUAL CARD (v39)
   ======================================================================== */
#diagnostico-card{border:1px solid var(--border2);background:linear-gradient(180deg,rgba(245,166,35,.04) 0%,var(--card) 60%)}
.diag-title{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;letter-spacing:.02em;color:var(--cream);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.diag-body{font-size:13.5px;line-height:1.7;color:var(--cream)}
.diag-body p{margin:0 0 12px}
.diag-body strong{color:var(--green);font-weight:700}
.diag-leitura{margin-top:18px;padding:16px 20px;background:rgba(245,166,35,.06);border-left:3px solid var(--green);border-radius:6px}
.diag-leitura-title{font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--green);margin-bottom:10px;display:flex;align-items:center;gap:6px}
.diag-leitura-intro{font-size:13px;line-height:1.6;color:var(--cream);font-style:italic;margin-bottom:10px}
.diag-leitura ul{margin:0;padding:0;list-style:none}
.diag-leitura li{font-size:12.5px;line-height:1.55;color:var(--cream);padding:5px 0 5px 18px;position:relative}
.diag-leitura li::before{content:"●";color:var(--green);position:absolute;left:0;top:5px;font-size:10px}
.diag-leitura li strong{color:var(--cream);font-weight:700}
.diag-leitura li em{color:var(--muted);font-style:italic;font-size:11.5px}
.diag-leitura-ang{margin-top:12px;padding-top:12px;border-top:1px solid rgba(245,166,35,.18);font-size:11.5px;color:var(--muted);font-style:italic;line-height:1.5}
.diag-fonte-toggle{margin-top:14px;background:transparent;border:1px solid var(--border2);color:var(--muted);font-family:'Barlow',sans-serif;font-size:11px;font-weight:600;letter-spacing:.08em;padding:6px 14px;border-radius:6px;cursor:pointer;transition:all .15s}
.diag-fonte-toggle:hover{color:var(--cream);border-color:var(--green3)}
.diag-fonte{margin-top:14px;padding:16px 18px;background:rgba(255,255,255,.02);border:1px solid var(--border);border-radius:8px;font-size:11.5px;line-height:1.6;color:var(--muted)}
.diag-fonte-sec{font-size:11px;letter-spacing:.06em;color:var(--cream)}
.diag-fonte-sec strong{color:var(--cream);font-weight:700}
.diag-fonte-txt{margin:6px 0 8px}
.diag-fonte-list{margin:0 0 6px;padding-left:18px}
.diag-fonte-list li{margin-bottom:5px;font-style:normal;color:var(--muted)}
.diag-fonte-list li strong{color:var(--cream)}
.diag-fonte-list li em{color:var(--cream);font-style:italic}
.diag-fonte-meta{margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:10.5px;color:var(--muted2);font-style:italic}
/* KPI dual card (Empresas + Cidades) */
.kpi-dual{display:flex;flex-direction:column;justify-content:center}
.kpi-dual-row{display:flex;align-items:baseline;gap:8px;line-height:1}
.kpi-dual-num{font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:800;line-height:1;color:var(--green)}
.kpi-dual-sep{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:600;color:var(--muted)}
.kpi-dual-sub{font-size:11px;color:var(--muted);margin-top:5px}
.kpi-dual-sub strong{color:var(--cream);font-weight:700;font-size:14px}
/* Insights por faixa de faturamento — barras horizontais */
.ins-fx-row{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.ins-fx-label{font-size:11px;color:var(--cream);width:130px;flex-shrink:0;font-weight:600}
.ins-fx-bar{flex:1;background:rgba(255,255,255,.06);border-radius:4px;height:14px;overflow:hidden;position:relative}
.ins-fx-fill{height:100%;border-radius:4px;background:var(--green);transition:width .8s cubic-bezier(.4,0,.2,1)}
.ins-fx-val{font-size:11px;font-weight:700;color:var(--cream);width:50px;text-align:right;flex-shrink:0;font-family:'Barlow Condensed',sans-serif}
.ins-fx-pct{font-size:10px;color:var(--muted);width:34px;flex-shrink:0}
.ins-fx-count{font-size:10px;color:var(--muted2);width:38px;flex-shrink:0;text-align:right}
/* Grid de 5 KPIs (fallback se ficar muito apertado) */
@media (max-width:1200px){
  .g4#ins-cor-kpis{grid-template-columns:repeat(2,1fr) !important}
  .kpi-dual-num{font-size:32px}
}
.carf{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);padding:16px 18px;margin-bottom:16px}
.wcloud span{cursor:default;transition:opacity .2s;line-height:1.3;font-family:"Barlow Condensed",sans-serif;font-weight:700}
.wcloud span:hover{opacity:1!important}
  `;
  document.head.appendChild(style);

  // ── Stopwords ──────────────────────────────────────────────
  const STOPWORDS = new Set([
    'de','a','o','que','e','do','da','em','um','para','com','uma','os','no','se',
    'na','por','mais','as','dos','como','mas','ao','ele','das','seu','sua','ou',
    'quando','muito','nos','já','eu','também','só','pelo','pela','até','isso',
    'ela','entre','depois','sem','mesmo','aos','ter','seus','suas','numa','num',
    'meu','minha','meus','minhas','foi','são','está','não','ter','ser','há',
    'me','te','lhe','nos','vos','lhes','mim','si','nós','vós','eles','elas',
    'isso','isto','aquilo','este','essa','esse','aquela','aquele','tudo','todo',
    'toda','todos','todas','cada','outro','outra','outros','outras','qual','quais',
    'quem','onde','quando','como','porque','pois','mas','porém','todavia',
    'contudo','entretanto','portanto','logo','assim','ainda','além','sobre',
    'entre','contra','ante','após','até','desde','durante','mediante','perante',
    'através','trás','fazer','feito','feita','ter','sido','sendo','estar','ficar',
    'ir','vir','poder','querer','saber','dever','deixar','ver','dar','falar',
    'empresa','empresas','negócio','negócios','negocio','negocios',
    'área','areas','parte','partes','vez','vezes','anos','ano',
    'preciso','precisa','precisamos','quer','quero','queremos','minha','meus',
    'hoje','nosso','nossa','nossos','nossas','esse','essa','esses','essas',
    'melhor','maior','mais','menos','pouco','muito','bastante','sempre'
  ]);

  // ── Sinônimos ──────────────────────────────────────────────
  const SINONIMOS = {
    'vender':'vendas','vendedor':'vendas','venda':'vendas','vendendo':'vendas',
    'crescer':'crescimento','escalar':'crescimento','escala':'crescimento',
    'expansão':'crescimento','expandir':'crescimento','crescendo':'crescimento',
    'contratar':'contratacao','contratação':'contratacao',
    'controle':'gestao','gestão':'gestao','gerenciar':'gestao',
    'gerenciamento':'gestao','gerir':'gestao','administrar':'gestao',
    'financeiro':'financas','financeira':'financas','finanças':'financas',
    'caixa':'financas','fluxo':'financas','faturamento':'financas',
    'marketing':'marketing','divulgação':'marketing','divulgacao':'marketing',
    'publicidade':'marketing','propaganda':'marketing',
    'equipe':'equipe','time':'equipe','colaboradores':'equipe',
    'funcionarios':'equipe','funcionários':'equipe','colaborador':'equipe',
    'processos':'processos','processo':'processos','procedimentos':'processos',
    'clientes':'clientes','cliente':'clientes','consumidores':'clientes',
    'liderança':'lideranca','lider':'lideranca','líder':'lideranca',
    'liderar':'lideranca','liderando':'lideranca',
    'produto':'produto','produtos':'produto','serviço':'produto','serviços':'produto',
    'lucro':'lucratividade','lucratividade':'lucratividade',
    'margem':'lucratividade','rentabilidade':'lucratividade',
    'tecnologia':'tecnologia','sistema':'tecnologia','sistemas':'tecnologia',
    'software':'tecnologia','automação':'tecnologia','automacao':'tecnologia',
    'pessoas':'pessoas','talentos':'pessoas','recrutamento':'pessoas',
    'seleção':'pessoas','selecao':'pessoas','rh':'pessoas',
    'planejamento':'estrategia','estratégia':'estrategia',
    'objetivos':'estrategia','estrategia':'estrategia','metas':'estrategia',
    'precificação':'precificacao','preço':'precificacao',
    'precos':'precificacao','precificar':'precificacao','preco':'precificacao',
    'comunicação':'comunicacao','comunicar':'comunicacao','comunicacao':'comunicacao',
    'marca':'marca','branding':'marca','identidade':'marca',
    'digital':'digital','online':'digital','redes':'digital','social':'digital',
    'inovação':'inovacao','inovar':'inovacao','inovacao':'inovacao','inovando':'inovacao',
    'produtividade':'produtividade','produtivo':'produtividade','eficiencia':'produtividade',
    'resultado':'resultados','resultados':'resultados','performance':'resultados','desempenho':'resultados',
    'delegação':'delegacao','delegar':'delegacao','delegar':'delegacao',
  };

  // ── Normaliza texto ────────────────────────────────────────
  function normalizarTexto(txt) {
    if (!txt) return [];
    return txt
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s,\.;]/g, ' ')
      .split(/[,\.;\n]+/)
      .flatMap(frase => frase.trim().split(/\s+/))
      .map(w => w.trim())
      .filter(w => w.length > 3 && !STOPWORDS.has(w))
      .map(w => SINONIMOS[w] || w);
  }

  // ── Conta frequência ───────────────────────────────────────
  function contarFreq(arr) {
    return arr.reduce((o, w) => { o[w] = (o[w]||0)+1; return o; }, {});
  }

  function topNFreq(freq, n) {
    return Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,n);
  }

  // ── Processa dados do store ────────────────────────────────
  function processarDados() {
    const rows  = _perfilSrc().rows  || [];
    const stats = _perfilSrc().stats || {};

    // Normaliza CPF para join
    function normCpf(v){ return (v||'').toString().replace(/\D/g,''); }

    // v49.5: paridade TOTAL com Dashboard via normalizeStatus
    const confirmados = rows.filter(r => {
      const p = normalizeStatus(r.presenca);
      const tf = (r.typeform||'').toUpperCase();
      return (p === 'BR CONFIRMADO' || p === 'BR + US CONFIRMADO'
           || p === 'US CONFIRMADO' || p === 'CONFIRMADO')
           && tf === 'PREENCHIDO';
    });

    // Mantém o alias 'unicos' (nome legado) — agora aponta para todos os confirmados
    const unicos = confirmados;
    console.log('[INSIGHTS] Confirmados analisados (paridade Dashboard via normalizeStatus):', confirmados.length);

    // Enriquece com fallback para campos vazios
    const enriquecidos = unicos.map(r => ({
      ...r,
      genero:      r.genero      || 'Não informado',
      setor:       r.setor       || 'Não informado',
      faixaFat:    r.faixaFat    || 'Não informado',
      problemas:   r.problemas   || '',
      aprender:    r.aprender    || '',
      sonho:       r.sonho       || '',
      metas:       r.metas       || '',
      mvv:         r.mvv         || '',
      tipoCliente: r.tipoCliente || 'Não informado',
    }));

    const _isLive = store.br.source && store.br.source !== 'static_embedded';
    console.log('[PERFIL] source:', store.br.source, '| isLive:', _isLive, '| total rows:', rows.length, '| confirmados:', enriquecidos.length);
    console.log('[INSIGHTS] Total rows:', rows.length,
      '| Confirmados:', confirmados.length,
      '| Após unicidade CPF:', enriquecidos.length,
      '| Com problemas:', enriquecidos.filter(r=>r.problemas).length,
      '| Com aprender:', enriquecidos.filter(r=>r.aprender).length);

    return { confirmados: enriquecidos, stats };
  }

  // ── Gera ranking de dores ──────────────────────────────────
  function gerarRankingDores(confirmados) {
    // v49.2: classificação semântica via globals expostas pelo outro IIFE
    if (!window.__classificaTopico || !window.__TOPICOS_DOR) return [];
    const textos = confirmados.map(r => r.problemas || '').filter(t => t.length > 3);
    if (textos.length === 0) return [];
    const counts = window.__classificaTopico(textos, window.__TOPICOS_DOR);
    return window.__topNFiltrado(counts, 5);
  }

  // ── Gera prioridades de ensino ─────────────────────────────
  function gerarPrioridades(confirmados) {
    // v49.2: classificação semântica via globals expostas pelo outro IIFE
    if (!window.__classificaTopico || !window.__TOPICOS_APRENDER) return [];
    const textos = confirmados.map(r => r.aprender || '').filter(t => t.length > 3);
    if (textos.length === 0) return [];
    const counts = window.__classificaTopico(textos, window.__TOPICOS_APRENDER);
    return window.__topNFiltrado(counts, 3);
  }

  // ── Gera mapa de faturamento ───────────────────────────────
  function gerarMapaFaturamento(confirmados) {
    // Detecta valores "SEM RETORNO" (e variantes) que vieram da planilha quando
    // a pessoa não preencheu a coluna correspondente — não devem virar categoria.
    const isSemRetorno = v => /^\s*sem\s*retorno?\s*$/i.test(v||'') || /^\s*sem\s*$/i.test(v||'');

    const tabela = {};
    confirmados.forEach(r => {
      // Usa modeloNeg (coluna 14 do Typeform — categorias limpas) com fallback para setor
      const sRaw = r.modeloNeg || r.setor || '';
      const fRaw = r.faixaFat  || '';
      const s = (isSemRetorno(sRaw) ? '' : sRaw).trim() || 'Não informado';
      const f = (isSemRetorno(fRaw) ? '' : fRaw).trim() || 'Não informado';
      if (s === 'Não informado') return;
      if (!tabela[s]) tabela[s] = { faixas: {} };
      tabela[s].faixas[f] = (tabela[s].faixas[f]||0)+1;
    });

    return Object.entries(tabela)
      .map(([setor, d]) => ({
        setor,
        total: Object.values(d.faixas).reduce((a,b)=>a+b,0),
        faixas: d.faixas
      }))
      .filter(r => r.total > 0)
      .sort((a,b) => b.total - a.total)
      .slice(0, 10);
  }

  // ── Gera word cloud ────────────────────────────────────────
  function gerarWordCloud(confirmados) {
    const palavras = confirmados.flatMap(r =>
      normalizarTexto((r.sonho||'') + ' ' + (r.metas||'') + ' ' + (r.aprender||'') + ' ' + (r.problemas||''))
    );
    if (palavras.length === 0) return [];
    const freq = contarFreq(palavras);
    return topNFreq(freq, 30);
  }

  // ── Render barra horizontal ────────────────────────────────
  function renderInsBar(containerId, items, total) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!items || items.length === 0) {
      el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      return;
    }
    const max = items[0][1];
    el.innerHTML = items.map(([label, val]) => {
      const pct = total > 0 ? Math.round(val/total*100) : 0;
      const w   = max  > 0 ? Math.round(val/max*100)   : 0;
      const cap = label.charAt(0).toUpperCase() + label.slice(1);
      return `<div class="ins-bar-row" title="${cap} — ${val} pessoas (${pct}%)">
        <div class="ins-bar-label">${cap}</div>
        <div class="ins-bar-bg"><div class="ins-bar-fill" style="width:${w}%"></div></div>
        <div class="ins-bar-val">${val}</div>
        <div class="ins-bar-pct">${pct}%</div>
      </div>`;
    }).join('');
  }

  // ── Render mapa faturamento ────────────────────────────────
  function renderMapaFaturamento(tabela, total) {
    const el = document.getElementById('ins-fat');
    if (!el) return;
    if (!tabela || tabela.length === 0) {
      el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      return;
    }
    const rows = tabela.map(r => {
      const pct = total > 0 ? Math.round(r.total/total*100) : 0;
      const faixaTop = Object.entries(r.faixas).sort((a,b)=>b[1]-a[1])[0];
      const faixaRaw = faixaTop ? faixaTop[0] : '';
      // v49: usa label limpo (ex: "81k–360k") em vez do texto bruto truncado
      const faixaLabel = faixaRaw ? faixaFatLabelGlobal(faixaRaw) : '—';
      const faixaFull  = faixaRaw || 'Sem informação';
      return `<tr>
        <td title="${r.setor}">${r.setor.substring(0,30)}</td>
        <td class="num">${r.total}</td>
        <td class="pct">${pct}%</td>
        <td><span class="fat-pill" title="${faixaFull} (anual)">${faixaLabel}<span class="fat-pill-unit">/ano</span></span></td>
      </tr>`;
    }).join('');

    el.innerHTML = `<table class="fat-table">
      <thead><tr>
        <th>Setor</th><th style="text-align:right">Qtd</th>
        <th style="text-align:right">%</th><th>Faixa Principal</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  // ── Render word cloud ──────────────────────────────────────
  function renderWordCloud(items, total) {
    const el = document.getElementById('ins-wcloud');
    if (!el) return;
    if (!items || items.length === 0) {
      el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      return;
    }
    const max = items[0][1];
    const min = items[items.length-1][1];
    const minSize = 13, maxSize = 44;

    // Embaralha levemente para layout mais natural
    const shuffled = [...items].sort(() => Math.random() - 0.42);

    el.innerHTML = shuffled.map(([word, freq]) => {
      const ratio   = max > min ? (freq - min) / (max - min) : 1;
      const size    = Math.round(minSize + ratio * (maxSize - minSize));
      const opacity = (0.35 + ratio * 0.65).toFixed(2);
      const cap     = word.charAt(0).toUpperCase() + word.slice(1);
      const pct     = total > 0 ? Math.round(freq/total*100) : 0;
      return `<span title="${cap} — ${freq}x (${pct}%)" style="font-size:${size}px;color:var(--green);opacity:${opacity}">${cap}</span>`;
    }).join('');
  }

  // ── Render principal ───────────────────────────────────────
  // ── Gera estrutura familiar ───────────────────────────────
  function gerarFamilia(confirmados) {
    const total = confirmados.length;
    if (total === 0) return null;
    let comConjuge=0, conjugeNaEmpresa=0, comFilhos=0;
    confirmados.forEach(r => {
      const conj = (r.conjuge||'').toUpperCase();
      const conjTrab = (r.conjugeTrab||'').toUpperCase();
      const filhos = (r.filhos||'').toUpperCase();
      if (conj && !conj.match(/NÃO|NAO|^N$|^NAO$/) && conj.length > 2) comConjuge++;
      if (conjTrab && conjTrab.match(/SIM|ANO|ANOS|TEMPO/) && !conjTrab.match(/NÃO|NAO/)) conjugeNaEmpresa++;
      if (filhos && !filhos.match(/NÃO|NAO|^N$|SEM FILHOS|NENHUM/) && filhos.length > 1) comFilhos++;
    });
    return { total, comConjuge, conjugeNaEmpresa, comFilhos };
  }

  // ── Gera intenções (clusters de metas) ────────────────────
  function gerarIntencoes(confirmados) {
    const CLUSTERS = {
      'Crescimento financeiro': ['lucro','faturamento','receita','financeiro','caixa','crescer','crescimento','resultado','rentabilidade'],
      'Estruturação': ['processo','organização','gestao','controle','sistema','estrutura','procedimento','organizar'],
      'Equipe & Liderança': ['equipe','liderança','time','funcionario','colaborador','contratar','delegar','pessoas'],
      'Expansão': ['expansão','escalar','novo','mercado','filial','franquia','expandir','nacional'],
      'Liberdade': ['liberdade','autonomia','sozinho','dependencia','centralizado','sobrecarga','delegar'],
      'Digitalização': ['digital','online','tecnologia','automacao','sistema','plataforma','marketing','redes'],
    };
    const contagem = {};
    Object.keys(CLUSTERS).forEach(k => contagem[k] = 0);
    confirmados.forEach(r => {
      const texto = ((r.metas||'') + ' ' + (r.sonho||'')).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g,'');
      Object.entries(CLUSTERS).forEach(([cat, palavras]) => {
        if (palavras.some(p => texto.includes(p))) contagem[cat]++;
      });
    });
    return Object.entries(contagem).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  }

  // ── Render estrutura familiar (v48: storytelling didático) ───
  function renderFamilia(dados) {
    const el = document.getElementById('ins-familia');
    if (!el) return;
    if (!dados || dados.total === 0) { el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>'; return; }
    const { total, comConjuge, conjugeNaEmpresa, comFilhos } = dados;
    const pctConjuge = Math.round(comConjuge/total*100);
    const pctConjEmpresaSobreCasados = comConjuge > 0 ? Math.round(conjugeNaEmpresa/comConjuge*100) : 0;
    const pctConjEmpresaSobreTotal = Math.round(conjugeNaEmpresa/total*100);
    const pctFilhos = Math.round(comFilhos/total*100);
    el.innerHTML = `
      <div class="fam-story">
        <div class="fam-block">
          <div class="fam-icon">💑</div>
          <div class="fam-content">
            <div class="fam-label">Empresários com cônjuge</div>
            <div class="fam-numbers"><span class="fam-big">${comConjuge}</span><span class="fam-of">de ${total}</span><span class="fam-pct">${pctConjuge}%</span></div>
          </div>
        </div>
        <div class="fam-block">
          <div class="fam-icon">🤝</div>
          <div class="fam-content">
            <div class="fam-label">Cônjuge trabalhando na empresa</div>
            <div class="fam-numbers"><span class="fam-big">${conjugeNaEmpresa}</span><span class="fam-of">dos ${comConjuge} casados</span><span class="fam-pct">${pctConjEmpresaSobreCasados}%</span></div>
            <div class="fam-context">Equivale a <strong>${pctConjEmpresaSobreTotal}%</strong> do total da turma — perfil "casal empresário"</div>
          </div>
        </div>
        <div class="fam-block">
          <div class="fam-icon">👨‍👧</div>
          <div class="fam-content">
            <div class="fam-label">Empresários com filhos</div>
            <div class="fam-numbers"><span class="fam-big">${comFilhos}</span><span class="fam-of">de ${total}</span><span class="fam-pct">${pctFilhos}%</span></div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Render intenções ───────────────────────────────────────
  function renderIntencoes(items, total) {
    const el = document.getElementById('ins-intencoes');
    if (!el) return;
    if (!items || items.length === 0) { el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>'; return; }
    const max = items[0][1];
    const cores = [G, BL, AM, '#a78bfa', '#2dd4bf', '#fb923c'];
    el.innerHTML = items.map(([label, val], i) => {
      const pct = total > 0 ? Math.round(val/total*100) : 0;
      const w   = max  > 0 ? Math.round(val/max*100)   : 0;
      const cor = cores[i % cores.length];
      return `<div class="ins-bar-row" title="${label} — ${val} pessoas (${pct}%)">
        <div class="ins-bar-label" style="width:150px">${label}</div>
        <div class="ins-bar-bg"><div class="ins-bar-fill" style="width:${w}%;background:${cor}"></div></div>
        <div class="ins-bar-val">${val}</div>
        <div class="ins-bar-pct">${pct}%</div>
      </div>`;
    }).join('');
  }

  // ── Gera top 5 faturamentos ───────────────────────────────
  function gerarTopFaturamento(confirmados) {
    // v46: ordena por faixa de faturamento anual (DESC) + nome alfabético (tie-break determinístico)
    // Dentro da mesma faixa, todas as empresas têm o mesmo ponto médio →
    // ordem alfabética garante consistência (não-aleatoriedade) entre renders.
    return confirmados
      .map(r => ({...r, fatMedio: fatMedioRowGlobal(r)}))
      .filter(r => r.fatMedio > 0)
      .sort((a, b) => {
        if (b.fatMedio !== a.fatMedio) return b.fatMedio - a.fatMedio;
        // Empate de faixa → ordem alfabética (determinística)
        const na = (a.nome||'').trim().toLowerCase();
        const nb = (b.nome||'').trim().toLowerCase();
        return na.localeCompare(nb, 'pt-BR');
      })
      .slice(0, 10);
  }

  // ── Render top 10 maiores faturamentos empresariais (anuais) ───────────
  function renderTopFaturamento(items) {
    const el = document.getElementById('ins-top-fat');
    if (!el) return;
    if (!items || items.length === 0) {
      el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      return;
    }
    const max = items[0].fatMedio;
    el.innerHTML = items.map(function(r, i) {
      const w = max > 0 ? Math.round(r.fatMedio / max * 100) : 0;
      // Nome: até 22 chars, primeiros 2 nomes
      let nomeDisplay = r.nome ? r.nome.trim().split(/\s+/).slice(0,2).join(' ') : 'Não informado';
      if (nomeDisplay.length > 22) nomeDisplay = nomeDisplay.substring(0,20) + '…';
      const faixaLabel = faixaFatLabelGlobal(r.faixaFat);
      const valorFmt = fmtBRLGlobal(r.fatMedio);
      const medalha = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : (i+1)+'º';
      const medColor = i===0 ? '#f5c542' : i===1 ? '#adada8' : i===2 ? '#e09018' : 'var(--muted)';
      return '<div class="top-fat-row">'
        +   '<div class="top-fat-pos" style="color:'+medColor+'">'+medalha+'</div>'
        +   '<div class="top-fat-info">'
        +     '<div class="top-fat-nome" title="'+(r.nome||'')+'">'+nomeDisplay+'</div>'
        +     '<div class="top-fat-faixa">'+faixaLabel+'/ano</div>'
        +   '</div>'
        +   '<div class="top-fat-bar-bg"><div class="top-fat-bar-fill" style="width:'+w+'%"></div></div>'
        +   '<div class="top-fat-val">'+valorFmt+'<span class="top-fat-val-sub">/ano</span></div>'
        + '</div>';
    }).join('');
  }

  function renderInsights() {
    try {
      const { confirmados, stats } = processarDados();
      const total = confirmados.length;
      const allIds = ['ins-dores','ins-fat','ins-prior','ins-wcloud','ins-familia','ins-intencoes','ins-top-fat'];

      if (total === 0) {
        allIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
        });
        return;
      }

      renderInsBar('ins-dores',    gerarRankingDores(confirmados),   total);
      renderTopFaturamento(gerarTopFaturamento(confirmados));
      renderInsBar('ins-prior',    gerarPrioridades(confirmados),    total);
      renderMapaFaturamento(gerarMapaFaturamento(confirmados),       total);
      renderWordCloud(gerarWordCloud(confirmados),                   total);
      renderFamilia(gerarFamilia(confirmados));
      renderIntencoes(gerarIntencoes(confirmados),                   total);

      console.log('[INSIGHTS] Renderizado com sucesso. Confirmados:', total,
        '| Com família:', confirmados.filter(r=>r.conjuge).length,
        '| Com metas:', confirmados.filter(r=>r.metas).length);
    } catch(err) {
      console.error('[INSIGHTS] Erro:', err.message, err.stack);
      ['ins-dores','ins-fat','ins-prior','ins-wcloud','ins-familia','ins-intencoes','ins-top-fat'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '<div class="ins-empty">Erro ao processar dados</div>';
      });
    }
  }

  // ── Hook na aba perfil + re-render quando dados ao vivo chegam
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      // (nav-perfil listener movido para o hook storeUpdateBr acima)

      // Intercepta storeUpdateBr para re-renderizar perfil + insights com dados ao vivo
      const _orig = window.storeUpdateBr;
      if (typeof _orig === 'function') {
        window.storeUpdateBr = function(payload) {
          const result = _orig.call(this, payload);
          // Só re-renderiza se a aba perfil estiver visível
          const perfilPage = document.getElementById('page-perfil');
          if (perfilPage && perfilPage.classList.contains('active')) {
            // Re-executa buildPerfil completo com dados ao vivo
            setTimeout(() => {
              try { buildPerfil(); } catch(e) { console.error('[PERFIL] Erro no re-render:', e.message); }
            }, 150);
            setTimeout(renderInsights, 400);
          }
          return result;
        };
      }

      // Também re-renderiza ao clicar na aba perfil (dados já podem estar ao vivo)
      const navPerfil2 = document.getElementById('nav-perfil');
      if (navPerfil2) {
        navPerfil2.addEventListener('click', () => {
          setTimeout(() => {
            try { buildPerfil(); } catch(e) {}
            setTimeout(renderInsights, 300);
          }, 150);
        });
      }
    }, 600);
  });

  // Expõe globalmente para ser chamado pelo buildPerfil
  window.renderInsights = renderInsights;

})();
// [PCE] INSIGHTS CORRELACIONAIS — v39 reformulado
(function() {
  // ── Helpers ───────────────────────────────────────────────
  function faixaFatLabel(v) {
    const map = {'ATE R$ 81.000,00':'Até 81k','DE R$ 81.000,01 A R$ 360.000,00':'81k–360k','DE R$ 360.000,01 A R$ 1.500.000,00':'360k–1,5M','DE R$ 1.500.000,01 A R$ 4.800.000,00':'1,5M–4,8M','DE R$ 4.800.000,01 A R$ 10.000.000,00':'4,8M–10M','DE R$ 10.000.000,01 A R$ 30.000.000,00':'10M–30M','DE R$ 30.000.000,01 A R$ 100.000.000,00':'30M–100M','DE R$ 100.000.000,01 A R$ 300.000.000,00':'100M–300M','DE R$ 300.000.000,01 A R$ 500.000.000,00':'300M–500M','DE R$ 500.000.000,01 A R$ 1.000.000.000,00':'500M–1B'};
    return map[v] || (v||'').substring(0,14);
  }
  // Ponto médio de cada faixa de faturamento empresarial (em R$)
  const FAIXA_MEDIA = {
    'ATE R$ 81.000,00': 40500,
    'DE R$ 81.000,01 A R$ 360.000,00': 220500,
    'DE R$ 360.000,01 A R$ 1.500.000,00': 930000,
    'DE R$ 1.500.000,01 A R$ 4.800.000,00': 3150000,
    'DE R$ 4.800.000,01 A R$ 10.000.000,00': 7400000,
    'DE R$ 10.000.000,01 A R$ 30.000.000,00': 20000000,
    'DE R$ 30.000.000,01 A R$ 100.000.000,00': 65000000,
    'DE R$ 100.000.000,01 A R$ 300.000.000,00': 200000000,
    'DE R$ 300.000.000,01 A R$ 500.000.000,00': 400000000,
    'DE R$ 500.000.000,01 A R$ 1.000.000.000,00': 750000000
  };
  // Ordem canônica das faixas (do menor pro maior)
  const FAIXA_ORDEM = ['ATE R$ 81.000,00','DE R$ 81.000,01 A R$ 360.000,00','DE R$ 360.000,01 A R$ 1.500.000,00','DE R$ 1.500.000,01 A R$ 4.800.000,00','DE R$ 4.800.000,01 A R$ 10.000.000,00','DE R$ 10.000.000,01 A R$ 30.000.000,00','DE R$ 30.000.000,01 A R$ 100.000.000,00','DE R$ 100.000.000,01 A R$ 300.000.000,00','DE R$ 300.000.000,01 A R$ 500.000.000,00','DE R$ 500.000.000,01 A R$ 1.000.000.000,00'];

  const isSemRetornoFat = v => /^\s*sem\s*retorno?\s*$/i.test(v||'') || /^\s*sem\s*$/i.test(v||'');

  function fmtBRL(v) {
    if (v >= 1e6) return 'R$ ' + (v/1e6).toFixed(1) + 'M';
    if (v >= 1e3) return 'R$ ' + (v/1e3).toFixed(0) + 'k';
    return 'R$ ' + (v||0).toFixed(0);
  }
  function fmtBRLfull(v) {
    return 'R$ ' + Math.round(v||0).toLocaleString('pt-BR');
  }
  function fatMedioRow(r) {
    const ff = (r.faixaFat||'').trim();
    if (isSemRetornoFat(ff)) return 0;
    return FAIXA_MEDIA[ff] || 0;
  }

  function getConfirmados() {
    // Fonte = turma ativa (_perfilSrc), igual ao Perfil. Filtro: confirmado + PREENCHIDO.
    const _src = (typeof _perfilSrc==='function') ? _perfilSrc() : store.br;
    const rows = (_src && _src.rows) || [];
    const result = rows.filter(r => {
      const p = normalizeStatus(r.presenca);
      const tf = (r.typeform||'').toUpperCase();
      return (p==='BR CONFIRMADO'||p==='BR + US CONFIRMADO'
           ||p==='US CONFIRMADO'||p==='CONFIRMADO')
           && tf==='PREENCHIDO';
    });
    console.log('[INSIGHTS CORRELACIONAIS] Confirmados (via _perfilSrc):', result.length);
    return result;
  }

  // ── NLP utilities (mantém compatibilidade com módulo de dores) ──
  const STOP = new Set(['para','tenho','muito','minha','meu','meus','minhas','mais','sobre','como','onde','quando','aqui','isso','isto','aquilo','dele','dela','deles','delas','seria','muita','muitas','muitos','tudo','nada','algum','alguma','alguns','algumas','outro','outra','outros','outras','pessoa','pessoas','empresa','empresas','sempre','nunca','ainda','depois','antes','tempo','hora','horas','negócio','negocio','meio','nosso','nossa','nossos','nossas','também','tambem','desde','entre','contra','pelo','pela','pelos','pelas','pode','poder','tem','ter','ser','estar','estou','estamos','está','estão','foi','será','sendo','fazer','feito','fica','ficar','cada','este','esse','essa','esta','isso','toda','todos','todas','todo','este','esses','essas','assim','então','entao','quem','qual','quais','que','não','nao','sim','mas','por','com','sem','dos','das','aos','das','dia','dias','ano','anos','mês','mes','meses','vamos','vai','vou','venho','vem','tipo','coisa','coisas'].concat(['equipe','equipes','colaborador','colaboradores','time','times','funcionário','funcionarios','pessoal']));
  function tokenize(text) {
    if (!text) return [];
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w => w.length > 3 && !STOP.has(w));
  }
  // Agrupador de tópicos para Top 3 dores/aprendizados
  const TOPICOS_DOR = [
    {nome:'gestão de pessoas e equipes', keys:['pessoas','gestao','equipe','team','colaborador','funcionario','lideranca','time','rh','recursos','humanos','liderar','engajar','equipes','contratacao','contratar','demissao','clima']},
    {nome:'estruturação comercial e vendas', keys:['vendas','comercial','venda','prospec','prospect','cliente','clientes','funil','closer','marketing','divulgacao','divulgar','captacao','captar','leads','lead','prospeccao']},
    {nome:'gestão financeira e fluxo de caixa', keys:['financeiro','caixa','fluxo','dinheiro','financ','margem','lucro','custo','custos','despesa','despesas','capital','investimento','endivida','divida','receita','faturamento','financa','financas']},
    {nome:'processos e operações', keys:['processo','processos','operacao','operacional','operacoes','padroniza','padronizar','indicador','indicadores','controle','controles','sistemas','sistema','ferramenta','ferramentas','metricas','metrica','kpi']},
    {nome:'estratégia e crescimento', keys:['estrategia','estrategias','crescer','crescimento','escalar','escala','expandir','expansao','planejamento','planejar','meta','metas','objetivo','objetivos','foco','direcao','visao']},
    {nome:'gestão do tempo e produtividade', keys:['tempo','produtividade','organiza','organizar','prioridade','prioridades','rotina','agenda','foco','disciplina','delegar','delega']},
    {nome:'cultura organizacional', keys:['cultura','valores','propos','propósito','clima','ambiente','engajamento','retencao','reter','motivar','motivacao','comunicacao','comunicar']},
    {nome:'sucessão e família', keys:['sucessao','sucessor','familia','familiar','herdeiro','conjuge','esposa','marido','filhos','socio','socios']},
    {nome:'liderança e tomada de decisão', keys:['lideranca','liderar','liderar','decisao','decisoes','decidir','autonomia','responsabilidade','delegar','autoridade']},
    {nome:'inovação e tecnologia', keys:['inovacao','inovar','tecnologia','digital','sistema','automatizar','automacao','ia','inteligencia']}
  ];
  const TOPICOS_APRENDER = [
    {nome:'liderança e tomada de decisão', keys:['lideranca','liderar','decisao','decisoes','decidir','autonomia','autoridade']},
    {nome:'escalar o negócio com previsibilidade', keys:['escalar','escala','crescer','crescimento','expandir','expansao','previsibilidade','previsivel','planejamento']},
    {nome:'construir cultura forte', keys:['cultura','valores','propos','clima','engajamento','equipe','time','pessoas']},
    {nome:'gestão financeira estratégica', keys:['financeiro','caixa','margem','lucro','financas','capital','indicadores','metricas']},
    {nome:'processos comerciais e vendas', keys:['vendas','comercial','prospec','funil','marketing','closer','clientes']},
    {nome:'gestão por indicadores', keys:['indicadores','indicador','metricas','metrica','kpi','controle','dashboard','monitorar']},
    {nome:'inovação e diferenciação', keys:['inovacao','inovar','diferencial','diferenciar','posicionamento','reposicionar']},
    {nome:'método e mindset Febracis', keys:['metodo','metodologia','mindset','transformacao','transformar','mudanca','mudar']}
  ];

  function classificaTopico(textos, topicos) {
    const counts = {};
    topicos.forEach(t => counts[t.nome] = 0);
    textos.forEach(txt => {
      if (!txt) return;
      const toks = new Set(tokenize(txt));
      // Conta 1 por texto por tópico (presença, não menções múltiplas)
      const hit = new Set();
      topicos.forEach(t => {
        for (const k of t.keys) {
          if (toks.has(k)) { hit.add(t.nome); break; }
        }
      });
      hit.forEach(n => counts[n]++);
    });
    return counts;
  }

  function topN(obj, n) {
    return Object.entries(obj).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,n);
  }
  // v49.2: expor para uso cross-IIFE (gerarRankingDores e gerarPrioridades estão em outro escopo)
  window.__TOPICOS_DOR       = TOPICOS_DOR;
  window.__TOPICOS_APRENDER  = TOPICOS_APRENDER;
  window.__classificaTopico  = classificaTopico;
  window.__topNFiltrado      = topN;

  // ── Idade média e cidades únicas ──
  function idadeMedia(data) {
    const idades = [];
    data.forEach(r => {
      const dn = r.dtNascDossie || '';
      const parts = dn.toString().match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
      if (parts) {
        const idade = new Date().getFullYear() - parseInt(parts[3]);
        if (idade >= 18 && idade <= 90) idades.push(idade);
      } else {
        // Fallback: ponto médio da faixaEt
        const fe = (r.faixaEt||'').trim();
        const mid = {'Até 29 anos':25,'30–39 anos':35,'40–49 anos':45,'50–59 anos':55,'60+ anos':65}[fe];
        if (mid) idades.push(mid);
      }
    });
    return idades.length ? Math.round(idades.reduce((a,b)=>a+b,0)/idades.length) : 0;
  }
  function cidadesUnicas(data) {
    const set = new Set();
    data.forEach(r => {
      const c = (r.cidade || '').toString().trim();
      if (c && c.length > 1) set.add(c.toLowerCase());
    });
    return set.size;
  }
  function empresasUnicas(data) {
    const set = new Set();
    data.forEach(r => {
      const e = (r.empresa || '').toString().trim();
      if (e && e.length > 1 && e !== 'Não informado') set.add(e.toLowerCase());
    });
    return set.size;
  }
  function estadosUnicos(data) {
    const set = new Set();
    data.forEach(r => {
      const e = (r.estado || '').toString().trim().toUpperCase();
      if (e && e.length >= 2) set.add(e);
    });
    return set.size;
  }

  // ── Mapeia faixaEt para geração legível ──
  function faixaEtNorm(r) {
    let fe = (r.faixaEt||'').trim();
    if (!fe && r.dtNascDossie) {
      const parts = r.dtNascDossie.toString().match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
      if (parts) {
        const idade = new Date().getFullYear() - parseInt(parts[3]);
        if      (idade < 30) fe = 'Até 29 anos';
        else if (idade < 40) fe = '30–39 anos';
        else if (idade < 50) fe = '40–49 anos';
        else if (idade < 60) fe = '50–59 anos';
        else                 fe = '60+ anos';
      }
    }
    return fe || '';
  }

  // ── Classifica tipo de cliente ──
  function nCli(s) {
    if (!s) return null;
    if (s.match(/governo|estadual|municipal|federal|b2g/i)) return 'B2G';
    if (s.match(/jurídica e pessoa física|b2b.*b2c|b2c.*b2b/i)) return 'B2B + B2C';
    if (s.match(/jurídica|b2b/i)) return 'B2B';
    if (s.match(/física|b2c/i))   return 'B2C';
    return null;
  }

  // ──────────────────────────────────────────────────────────
  // RENDER KPIs (4 cards: Confirmados / Idade / Empresas+Cidades / MVV)
  // ──────────────────────────────────────────────────────────
  function renderKpisInsights(data) {
    const el = document.getElementById('ins-cor-kpis');
    if (!el) return;
    const total = data.length;
    const idade = idadeMedia(data);
    const empresas = empresasUnicas(data);
    const cidades = cidadesUnicas(data);
    const comMvv = data.filter(r => (r.mvv||'').toUpperCase().includes('SIM')).length;
    const pctMvv = total > 0 ? Math.round(comMvv/total*100) : 0;
    el.innerHTML = `<div class="kpi-ribbon" style="grid-column:1/-1">
      <div class="kr-cell"><div class="kr-k">Confirmados analisados</div><div class="kr-n g">${total}</div><div class="kr-x">base de análise</div></div>
      <div class="kr-cell"><div class="kr-k">Idade média da turma</div><div class="kr-n">${idade>0?idade:'—'}</div><div class="kr-x">${idade>0?'anos — perfil etário':'sem dados'}</div></div>
      <div class="kr-cell"><div class="kr-k">Empresas representadas</div><div class="kr-n">${empresas}</div><div class="kr-x">em ${cidades} cidades</div></div>
      <div class="kr-cell"><div class="kr-k">Empresas com MVV</div><div class="kr-n">${pctMvv}%</div><div class="kr-x">${comMvv} de ${total} empresas</div></div>
    </div>`;
  }

  // ──────────────────────────────────────────────────────────
  // DIAGNÓSTICO ESTRATÉGICO — texto dinâmico
  // ──────────────────────────────────────────────────────────
  function renderDiagnostico(data) {
    const total = data.length;
    if (total === 0) {
      const el = document.getElementById('diag-body');
      if (el) el.innerHTML = '<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';
      return;
    }

    // Cálculos
    const empresas = empresasUnicas(data);
    const estados = estadosUnicos(data);
    const idade = idadeMedia(data);
    const comMvv = data.filter(r => (r.mvv||'').toUpperCase().includes('SIM')).length;
    const pctMvv = total > 0 ? Math.round(comMvv/total*100) : 0;

    // Geração predominante
    const gerMap = {};
    data.forEach(r => { const fe = faixaEtNorm(r); if (fe) gerMap[fe] = (gerMap[fe]||0)+1; });
    const gerTop = Object.entries(gerMap).sort((a,b)=>b[1]-a[1])[0] || ['—',0];
    const gerPct = total > 0 ? Math.round(gerTop[1]/total*100) : 0;

    // Top 3 estados
    const estMap = {};
    data.forEach(r => { const e=(r.estado||'').trim().toUpperCase(); if (e && e.length>=2) estMap[e]=(estMap[e]||0)+1; });
    const topEst = Object.entries(estMap).sort((a,b)=>b[1]-a[1]).slice(0,3);
    const topEstNomes = topEst.map(e=>e[0]).join(', ');
    const topEstPct = total>0 ? Math.round(topEst.reduce((s,e)=>s+e[1],0)/total*100) : 0;

    // Porte (faixa de faturamento)
    const fatMap = {};
    let totalFat = 0;
    data.forEach(r => {
      const ff = (r.faixaFat||'').trim();
      if (!ff || isSemRetornoFat(ff)) return;
      fatMap[ff] = (fatMap[ff]||0)+1;
      totalFat++;
    });
    const cobertura = totalFat;
    // Micro (até 360k), Pequeno (até 1.5M), Médio (até 30M), Grande (>30M)
    let micro=0, pequeno=0, medio=0, grande=0;
    Object.entries(fatMap).forEach(([k,c]) => {
      const v = FAIXA_MEDIA[k] || 0;
      if (v <= 360000) micro += c;
      else if (v <= 1500000) pequeno += c;
      else if (v <= 30000000) medio += c;
      else grande += c;
    });
    const pctMicro = totalFat>0 ? Math.round(micro/totalFat*100) : 0;
    const pctMedio = totalFat>0 ? Math.round((pequeno+medio+grande)/totalFat*100) : 0;
    const pctAcimaMM = totalFat>0 ? Math.round((medio+grande)/totalFat*100) : 0;

    // Top 3 dores
    const dorTextos = data.map(r => r.problemas || '');
    const dorCounts = classificaTopico(dorTextos, TOPICOS_DOR);
    const topDores = topN(dorCounts, 3);
    const dorTotal = dorTextos.filter(t=>t&&t.length>2).length || total;

    // Top 3 aprendizados
    const aprenderTextos = data.map(r => r.aprenderPCE || r.aprender || '');
    const aprCounts = classificaTopico(aprenderTextos, TOPICOS_APRENDER);
    const topApr = topN(aprCounts, 3);

    // Tipo de cliente
    const cliMap = {};
    data.forEach(r => { const c = nCli(r.tipoCliente); if (c) cliMap[c]=(cliMap[c]||0)+1; });
    const topCli = Object.entries(cliMap).sort((a,b)=>b[1]-a[1]).slice(0,2);
    const totalCli = Object.values(cliMap).reduce((a,b)=>a+b,0);

    // Frase de geração predominante
    let geracaoFrase = 'reposicionamento estratégico e evolução no modelo de gestão';
    if (gerTop[0] === '30–39 anos') geracaoFrase = 'aceleração de crescimento e profissionalização da gestão';
    else if (gerTop[0] === '40–49 anos') geracaoFrase = 'reposicionamento estratégico e evolução no modelo de gestão';
    else if (gerTop[0] === '50–59 anos') geracaoFrase = 'consolidação, perpetuação e sucessão do negócio';
    else if (gerTop[0] === '60+ anos') geracaoFrase = 'legado, sucessão e perpetuação empresarial';
    else if (gerTop[0] === 'Até 29 anos') geracaoFrase = 'estruturação inicial e fundamentos de crescimento';

    // Monta texto
    const dorLista = topDores.map((d,i) => {
      const pct = Math.round(d[1]/dorTotal*100);
      return `<strong>${d[0]}</strong> (${i===0?'citada por ':''}${pct}%${i===0?' dos participantes':''})`;
    });
    const aprLista = topApr.map(a => `<strong>${a[0]}</strong>`);
    const cliFrase = topCli.length>=2
      ? `<strong>${topCli[0][0]}</strong> (${Math.round(topCli[0][1]/totalCli*100)}%), seguido de <strong>${topCli[1][0]}</strong> (${Math.round(topCli[1][1]/totalCli*100)}%)`
      : (topCli[0] ? `<strong>${topCli[0][0]}</strong> (${Math.round(topCli[0][1]/totalCli*100)}%)` : '—');

    const html = `
      <p>A turma é composta por <strong>${total} empresários confirmados</strong>, representando <strong>${empresas} empresas únicas</strong> em <strong>${estados} estados</strong> (com forte concentração em ${topEstNomes} — ${topEstPct}% da turma). A idade média é de <strong>${idade} anos</strong>, com predominância da geração ${gerTop[0]} (${gerPct}%). Essa turma busca <strong>${geracaoFrase}</strong>.</p>
      ${topDores.length>=3 ? `<p>As <strong>três dores predominantes</strong> mencionadas são: ${dorLista[0]}, ${dorLista[1].replace(/^citada por /,'')} e ${dorLista[2].replace(/^citada por /,'')}.</p>` : ''}
      <p>Do ponto de vista de <strong>maturidade empresarial</strong>, ${pctMvv}% das empresas declaram ter missão, visão e valores estruturados — uma base sólida acima da média de mercado. No entanto, o porte é heterogêneo: <strong>${pctMicro}% das empresas faturam até R$ 360k/ano</strong> (microempresas em transição), enquanto <strong>${pctAcimaMM}% já operam acima de R$ 1,5M/ano</strong> (médio porte ou superior).</p>
      ${topApr.length>=3 ? `<p>O que eles declaram querer aprender mais durante o PCE é ${aprLista[0]}, ${aprLista[1]} e ${aprLista[2]}.</p>` : ''}
      ${topCli.length>0 ? `<p>O perfil de clientes é predominantemente ${cliFrase}.</p>` : ''}
    `;
    const elBody = document.getElementById('diag-body');
    if (elBody) elBody.innerHTML = html;

    // Leitura Estratégica — bullets dinâmicos
    const bullets = [];
    if (topDores[0]) bullets.push(`<li><strong>${topDores[0][0].charAt(0).toUpperCase()+topDores[0][0].slice(1)}</strong> <em>(responde à dor #1 — ${Math.round(topDores[0][1]/dorTotal*100)}% da turma)</em></li>`);
    if (topDores[1]) bullets.push(`<li><strong>${topDores[1][0].charAt(0).toUpperCase()+topDores[1][0].slice(1)}</strong> <em>(responde à dor #2 — ${Math.round(topDores[1][1]/dorTotal*100)}% da turma)</em></li>`);
    if (pctMicro >= 30) bullets.push(`<li><strong>Fluxo de caixa e indicadores financeiros básicos</strong> <em>(crítico para os ${pctMicro}% de microempresas em transição)</em></li>`);
    bullets.push(`<li><strong>Cases de escala R$ 1M → R$ 10M</strong> <em>(o salto que a maioria da turma está vivendo, mais aderente que cases R$ 100M+)</em></li>`);

    const angulo = gerTop[0] === '40–49 anos'
      ? `Ângulo de conexão emocional: empresários de ${gerTop[0]} que carregam empresa, família e legado simultaneamente — ${gerPct}% da turma vive esse momento de inflexão.`
      : `Ângulo de conexão emocional: turma com perfil predominante de ${gerTop[0]} (${gerPct}% da turma).`;

    const elLeitura = document.getElementById('diag-leitura');
    if (elLeitura) {
      elLeitura.innerHTML = `
        <div class="diag-leitura-title">📌 Leitura Estratégica</div>
        <div class="diag-leitura-intro">Esta é uma turma em <strong>transição de microempresa para empresa estruturada</strong>, com fundamentos já formados (${pctMvv}% com MVV) mas ainda dependente da liderança do dono. Recomenda-se enfatizar:</div>
        <ul>${bullets.join('')}</ul>
        <div class="diag-leitura-ang">${angulo}</div>
      `;
    }

    // Atualiza fonte das informações (cobertura, total, sync)
    const elCob = document.getElementById('diag-cobertura'); if (elCob) elCob.textContent = cobertura;
    const elTot = document.getElementById('diag-total'); if (elTot) elTot.textContent = total;
    const elSync = document.getElementById('diag-sync');
    if (elSync) {
      const ts = store.meta && store.meta.lastFetchAt;
      if (ts) {
        const d = new Date(ts);
        const dd = String(d.getDate()).padStart(2,'0');
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const hh = String(d.getHours()).padStart(2,'0');
        const mi = String(d.getMinutes()).padStart(2,'0');
        elSync.textContent = `Última sync: ${dd}/${mm}/${d.getFullYear()} — ${hh}:${mi}.`;
      } else {
        elSync.textContent = 'Última sync: aguardando primeira atualização ao vivo...';
      }
    }
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 2 — Faturamento Empresarial por Geração
  // ──────────────────────────────────────────────────────────
  function renderFatEtaria(data) {
    const agg = data.reduce((acc, r) => {
      const fe = faixaEtNorm(r);
      if (!fe) return acc;
      if (!acc[fe]) acc[fe]={soma:0,count:0};
      const v = fatMedioRow(r);
      if (v>0){acc[fe].soma+=v; acc[fe].count++;}
      return acc;
    }, {});
    const ordem = ['Até 29 anos','30–39 anos','40–49 anos','50–59 anos','60+ anos'];
    const labels = ordem.filter(k=>agg[k] && agg[k].count>0);
    const medias = labels.map(k=>Math.round(agg[k].soma/agg[k].count));
    const counts = labels.map(k=>agg[k].count);
    const cores  = ['#4d9fff','#f5a623','#a78bfa','#f5c542','#ff5f5f'];
    safeRender('cInsFatEt', () => {
      destroyChart('cInsFatEt');
      const el = safeEl('cInsFatEt'); if(!el) return;
      CHART_REGISTRY['cInsFatEt'] = new Chart(el, {type:'bar',data:{labels,datasets:[{data:medias,backgroundColor:cores.slice(0,labels.length),borderRadius:5,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:75}},plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>'  Faturamento médio anual: '+fmtBRL(c.raw)+'/ano · '+counts[c.dataIndex]+' empresas'}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:11},callback:v=>fmtBRL(v)},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:11}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>fmtBRL(v)+'/ano')]});
    });
    const totalAnalisado = counts.reduce((a,b)=>a+b,0);
    appendCobertura('cInsFatEt', totalAnalisado, data.length, 'não tinham idade ou faixa de faturamento informados');
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 2 — Faturamento por Modelo de Negócio (top 8)
  // ──────────────────────────────────────────────────────────
  function renderModeloFat(data) {
    const agg = data.reduce((acc, r) => {
      const m = (r.modeloNeg||'').trim();
      if (!m) return acc;
      if (!acc[m]) acc[m]={soma:0,count:0};
      const v = fatMedioRow(r);
      if (v>0){acc[m].soma+=v; acc[m].count++;}
      return acc;
    }, {});
    const top = Object.entries(agg).filter(([,v])=>v.count>=2).sort((a,b)=>(b[1].soma/b[1].count)-(a[1].soma/a[1].count)).slice(0,8);
    safeRender('cInsModeloFat', () => {
      destroyChart('cInsModeloFat');
      const el = safeEl('cInsModeloFat'); if(!el) return;
      CHART_REGISTRY['cInsModeloFat']=new Chart(el,{type:'bar',data:{labels:top.map(([k])=>k.substring(0,22)),datasets:[{data:top.map(([,v])=>Math.round(v.soma/v.count)),backgroundColor:PAL,borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:80}},plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>'  Faturamento médio anual: '+fmtBRL(c.raw)+'/ano · '+top[c.dataIndex][1].count+' empresas'}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10},callback:v=>fmtBRL(v)},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:10}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>fmtBRL(v)+'/ano')]});
    });
    const totalAnalisado = top.reduce((s,[,v])=>s+v.count,0);
    appendCobertura('cInsModeloFat', totalAnalisado, data.length, 'estão em modelos fora do top 8 ou sem faixa de faturamento informada (mínimo 2 empresas por modelo)');
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 2 — Faturamento por Tipo de Cliente (B2B/B2C/B2G)
  // ──────────────────────────────────────────────────────────
  function renderTipoCliFat(data) {
    const agg = {};
    data.forEach(r => {
      const c = nCli(r.tipoCliente);
      if (!c) return;
      if (!agg[c]) agg[c]={soma:0,count:0};
      const v = fatMedioRow(r);
      if (v>0){agg[c].soma+=v; agg[c].count++;}
    });
    const ordem = ['B2B','B2C','B2G','B2B + B2C'];
    const cores = {'B2B':'#4d9fff','B2C':'#f5c542','B2G':'#a78bfa','B2B + B2C':'#f5a623'};
    const el = document.getElementById('ins-tipo-cli-fat');
    if (!el) return;
    const lista = ordem.filter(k=>agg[k] && agg[k].count>0);
    if (lista.length===0) { el.innerHTML='<div class="ins-empty">Sem dados</div>'; return; }
    const max = Math.max(...lista.map(k=>agg[k].soma/agg[k].count));
    const totalAnalisado = lista.reduce((s,k)=>s+agg[k].count,0);
    const totalBase = data.length;
    const semDados = totalBase - totalAnalisado;
    const rows = lista.map(k => {
      const media = Math.round(agg[k].soma/agg[k].count);
      const w = max>0 ? Math.round(media/max*100) : 0;
      return `<div class="ins-fx-row"><div class="ins-fx-label" style="color:${cores[k]||'#fff'};font-weight:700">${k}</div><div class="ins-fx-bar"><div class="ins-fx-fill" style="width:${w}%;background:${cores[k]||'#f5a623'}"></div></div><div class="ins-fx-val">${fmtBRL(media)}<span style="font-size:9px;color:var(--muted);font-weight:500;letter-spacing:0">/ano</span></div><div class="ins-fx-count">${agg[k].count} emp.</div></div>`;
    }).join('');
    const footer = `<div class="ins-cobertura"><strong>${totalAnalisado} de ${totalBase}</strong> confirmados analisados (${Math.round(totalAnalisado/totalBase*100)}% de cobertura) — os outros ${semDados} não informaram tipo de cliente ou faixa de faturamento</div>`;
    el.innerHTML = rows + footer;
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 2 — Top 5 estados por faturamento empresarial
  // ──────────────────────────────────────────────────────────
  function renderEstadoFat(data) {
    const agg = {};
    data.forEach(r => {
      const e = (r.estado||'').trim().toUpperCase();
      if (!e || e.length<2) return;
      if (!agg[e]) agg[e]={soma:0,count:0};
      const v = fatMedioRow(r);
      if (v>0){agg[e].soma+=v; agg[e].count++;}
    });
    const top = Object.entries(agg).filter(([,v])=>v.count>=2).sort((a,b)=>(b[1].soma/b[1].count)-(a[1].soma/a[1].count)).slice(0,5);
    safeRender('cInsEstFat', () => {
      destroyChart('cInsEstFat');
      const el = safeEl('cInsEstFat'); if(!el) return;
      CHART_REGISTRY['cInsEstFat']=new Chart(el,{type:'bar',data:{labels:top.map(([k])=>k),datasets:[{data:top.map(([,v])=>Math.round(v.soma/v.count)),backgroundColor:['#f5a623','#4d9fff','#a78bfa','#f5c542','#ff5f5f'].slice(0,top.length),borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:80}},plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>'  Faturamento médio anual: '+fmtBRL(c.raw)+'/ano · '+top[c.dataIndex][1].count+' empresas'}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10},callback:v=>fmtBRL(v)},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:11},font:{weight:'700'}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>fmtBRL(v)+'/ano')]});
    });
    const totalAnalisado = top.reduce((s,[,v])=>s+v.count,0);
    appendCobertura('cInsEstFat', totalAnalisado, data.length, 'estão em estados fora do top 5 ou sem faixa de faturamento informada');
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 3 — MVV vs Faturamento (faturamento médio empresarial)
  // ──────────────────────────────────────────────────────────
  function renderMvvPerf(data) {
    const agg = {'Com MVV':{soma:0,count:0},'Sem MVV':{soma:0,count:0}};
    let semFaixa = 0, semMvv = 0;
    data.forEach(r => {
      const mvv = (r.mvv||'').toUpperCase().includes('SIM') ? 'Com MVV' : (r.mvv?'Sem MVV':null);
      if (!mvv) { semMvv++; return; }
      const v = fatMedioRow(r);
      if (v>0){agg[mvv].soma+=v; agg[mvv].count++;}
      else { semFaixa++; }
    });
    const el = document.getElementById('ins-mvv-perf');
    if (!el) return;
    const grupos = ['Com MVV','Sem MVV'], cores = ['#f5a623','#7a7a76'];
    const max = Math.max(...grupos.map(g=>agg[g].count>0?(agg[g].soma/agg[g].count):0));
    const totalAnalisado = agg['Com MVV'].count + agg['Sem MVV'].count;
    const totalBase = data.length;
    const semDados = totalBase - totalAnalisado;
    const cards = '<div class="ins-mvv-compare">'+grupos.map((g,i)=>{
      const d=agg[g];
      const media=d.count>0?Math.round(d.soma/d.count):0;
      const w=max>0?Math.round(media/max*100):0;
      return '<div class="ins-mvv-card"><div class="ins-mvv-card-lbl" style="color:'+cores[i]+'">'+g+'</div><div class="ins-mvv-card-val" style="color:'+cores[i]+'">'+fmtBRL(media)+'<span class="ins-mvv-card-unit">/ano</span></div><div class="ins-mvv-card-sub">'+d.count+' empresas</div><div class="ins-cor-gauge-bar" style="margin-top:10px"><div class="ins-cor-gauge-fill" style="width:'+w+'%;background:'+cores[i]+'"></div></div></div>';
    }).join('')+'</div>';
    const footer = '<div class="ins-cobertura"><strong>'+totalAnalisado+' de '+totalBase+'</strong> confirmados analisados ('+Math.round(totalAnalisado/totalBase*100)+'% de cobertura) — os outros '+semDados+' não responderam MVV ou faixa de faturamento</div>';
    el.innerHTML = cards + footer;
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 3 — % com MVV por faixa de faturamento
  // ──────────────────────────────────────────────────────────
  function renderMvvPorte(data) {
    const agg = {};
    data.forEach(r => {
      const ff = (r.faixaFat||'').trim();
      if (!ff || isSemRetornoFat(ff)) return;
      if (!agg[ff]) agg[ff]={total:0,mvv:0};
      agg[ff].total++;
      if ((r.mvv||'').toUpperCase().includes('SIM')) agg[ff].mvv++;
    });
    const labels = FAIXA_ORDEM.filter(k=>agg[k] && agg[k].total>=2);
    const pcts = labels.map(k=>Math.round(agg[k].mvv/agg[k].total*100));
    const counts = labels.map(k=>agg[k].total);
    const lblsShort = labels.map(faixaFatLabel);
    safeRender('cInsMvvPorte', () => {
      destroyChart('cInsMvvPorte');
      const el = safeEl('cInsMvvPorte'); if(!el) return;
      CHART_REGISTRY['cInsMvvPorte']=new Chart(el,{type:'bar',data:{labels:lblsShort,datasets:[{data:pcts,backgroundColor:'#f5a623',borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:55}},plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>'  '+c.raw+'% com MVV · '+counts[c.dataIndex]+' empresas'}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10},callback:v=>v+'%'},border:{color:'transparent'},max:100},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:10}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>v+'%')]});
    });
    const totalAnalisado = counts.reduce((a,b)=>a+b,0);
    appendCobertura('cInsMvvPorte', totalAnalisado, data.length, 'estão em faixas com menos de 2 empresas ou sem faixa de faturamento informada');
  }

  // ──────────────────────────────────────────────────────────
  // BLOCO 3 — Avaliação de colaboração por faixa de faturamento
  // ──────────────────────────────────────────────────────────
  // [REMOVED v47] Função renderAvalPorte — sem uso (dead code limpado)

  // ──────────────────────────────────────────────────────────
  // BLOCO 4 — Cônjuge e Filhos vs Avaliação (mantidos)
  // ──────────────────────────────────────────────────────────
  // [REMOVED v47] Função renderFamiliaClima — sem uso (dead code limpado)

  // ──────────────────────────────────────────────────────────
  // BLOCO 4 — Outros PCE participando vs Faturamento
  // ──────────────────────────────────────────────────────────
  // [REMOVED v47] Função renderOutrosPCE — sem uso (dead code limpado)

  // ──────────────────────────────────────────────────────────
  // BLOCO 5 — Top 3 dores/aprendizados por faixa OU modelo
  // ──────────────────────────────────────────────────────────
  function renderTopicoPorChave(data, elId, getKey, getTexto, topicos, ordemKeys, labelFn) {
    const agg = {};
    data.forEach(r => {
      const k = getKey(r);
      if (!k) return;
      if (!agg[k]) agg[k] = [];
      const t = getTexto(r);
      if (t) agg[k].push(t);
    });
    const ordem = ordemKeys ? ordemKeys.filter(k=>agg[k] && agg[k].length>=2) : Object.keys(agg).filter(k=>agg[k].length>=2);
    const el = document.getElementById(elId);
    if (!el) return;
    if (ordem.length===0) { el.innerHTML='<div class="ins-empty">Sem dados suficientes</div>'; return; }
    el.innerHTML = ordem.slice(0,7).map(k => {
      const counts = classificaTopico(agg[k], topicos);
      const top3 = topN(counts, 3);
      if (top3.length===0) return '';
      const tags = top3.map(([nome,c]) => `<span class="ins-dores-tag">${nome} <strong>(${c})</strong></span>`).join('');
      return `<div class="ins-dores-faixa"><div class="ins-dores-faixa-titulo">${labelFn ? labelFn(k) : k} <span style="color:var(--muted);font-weight:400;letter-spacing:0">· ${agg[k].length} empresários</span></div><div class="ins-dores-tags">${tags}</div></div>`;
    }).join('');
  }

  // [REMOVED v47] Função renderDoresFat — sem uso (dead code limpado)
  // [REMOVED v47] Função renderDoresModelo — sem uso (dead code limpado)
  // [REMOVED v47] Função renderAprenderFat — sem uso (dead code limpado)

  // ──────────────────────────────────────────────────────────
  // BLOCO 6 — Setores: Quantidade de empresas + Faturamento médio
  // ──────────────────────────────────────────────────────────
  function renderSetores(data) {
    const agg = data.reduce((acc, r) => {
      const m = (r.modeloNeg||'').trim();
      if (!m) return acc;
      if (!acc[m]) acc[m]={soma:0,count:0};
      acc[m].count++;
      const v = fatMedioRow(r);
      if (v>0) acc[m].soma+=v;
      return acc;
    }, {});
    // Quantidade
    const topQtd = Object.entries(agg).sort((a,b)=>b[1].count-a[1].count).slice(0,10);
    safeRender('cInsSetorFat',()=>{
      destroyChart('cInsSetorFat');
      const el=safeEl('cInsSetorFat'); if(!el)return;
      CHART_REGISTRY['cInsSetorFat']=new Chart(el,{type:'bar',data:{labels:topQtd.map(([k])=>k.substring(0,22)),datasets:[{data:topQtd.map(([,v])=>v.count),backgroundColor:PAL,borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:60}},plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10}},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:10}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>v+' empresas')]});
    });
    const totalQtd = topQtd.reduce((s,[,v])=>s+v.count,0);
    appendCobertura('cInsSetorFat', totalQtd, data.length, 'estão em modelos de negócio fora do top 10 ou não informaram o modelo');
    // Ticket médio (fat médio empresarial)
    const topMedia = Object.entries(agg).filter(([,v])=>v.count>=2).map(([k,v])=>[k,{...v,media:v.count>0?v.soma/v.count:0}]).filter(([,v])=>v.media>0).sort((a,b)=>b[1].media-a[1].media).slice(0,10);
    safeRender('cInsSetorTkt',()=>{
      destroyChart('cInsSetorTkt');
      const el=safeEl('cInsSetorTkt'); if(!el)return;
      CHART_REGISTRY['cInsSetorTkt']=new Chart(el,{type:'bar',data:{labels:topMedia.map(([k])=>k.substring(0,22)),datasets:[{data:topMedia.map(([,v])=>Math.round(v.media)),backgroundColor:['#4d9fff','#f5a623','#f5c542','#a78bfa','#ff5f5f','#2dd4bf','#fb923c','#f472b6','#e09018','#3d2e0a'].slice(0,topMedia.length),borderRadius:4,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,layout:{padding:{right:80}},plugins:{legend:{display:false},tooltip:{...TOOLTIP_DEFAULTS,callbacks:{label:c=>'  Faturamento médio anual: '+fmtBRL(c.raw)+'/ano · '+topMedia[c.dataIndex][1].count+' empresas'}}},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10},callback:v=>fmtBRL(v)},border:{color:'transparent'}},y:{grid:{display:false},ticks:{color:'#adada8',font:{size:10}},border:{color:'transparent'}}}},plugins:[barLabelsPlugin(v=>fmtBRL(v)+'/ano')]});
    });
    const totalMedia = topMedia.reduce((s,[,v])=>s+v.count,0);
    appendCobertura('cInsSetorTkt', totalMedia, data.length, 'estão em modelos com menos de 2 empresas ou sem faixa de faturamento informada');
  }

  // ──────────────────────────────────────────────────────────
  // ENTRY POINT
  // ──────────────────────────────────────────────────────────
  function renderInsightsCorrelacionais() {
    const data = getConfirmados();
    Logger.info('UI','renderInsightsCorrelacionais — v39',{total:data.length});
    if (data.length===0) {
      const allIds = ['ins-cor-kpis','ins-mvv-perf','ins-tipo-cli-fat','diag-body'];
      allIds.forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<div class="ins-skeleton"><img class="ins-skeleton-logo" src="assets/img/logo-pce-center-ee117996.png" alt=""/><div class="ins-skeleton-bars"><div class="ins-skeleton-bar" style="width:78%"></div><div class="ins-skeleton-bar" style="width:55%"></div><div class="ins-skeleton-bar" style="width:82%"></div></div><div class="ins-skeleton-txt">Aguardando dados ao vivo</div></div>';});
      return;
    }
    try { renderKpisInsights(data); } catch(e){ Logger.error('UI','renderKpisInsights',{message:e.message}); }
    try { renderDiagnostico(data); } catch(e){ Logger.error('UI','renderDiagnostico',{message:e.message}); }
    try { renderFatEtaria(data); } catch(e){ Logger.error('UI','renderFatEtaria',{message:e.message}); }
    try { renderModeloFat(data); } catch(e){ Logger.error('UI','renderModeloFat',{message:e.message}); }
    try { renderTipoCliFat(data); } catch(e){ Logger.error('UI','renderTipoCliFat',{message:e.message}); }
    try { renderEstadoFat(data); } catch(e){ Logger.error('UI','renderEstadoFat',{message:e.message}); }
    try { renderMvvPerf(data); } catch(e){ Logger.error('UI','renderMvvPerf',{message:e.message}); }
    try { renderMvvPorte(data); } catch(e){ Logger.error('UI','renderMvvPorte',{message:e.message}); }
    try { renderSetores(data); } catch(e){ Logger.error('UI','renderSetores',{message:e.message}); }
  
    // ── Nível de Centralização ──
    try {
      const centrBins={1:0,2:0,3:0,4:0,5:0};
      data.forEach(r=>{ const v=parseInt(r.centralizacao); if(v>=1&&v<=5) centrBins[v]++; });
      const cEl=document.getElementById('cCentr');
      if(cEl){
        if(CHART_REGISTRY['cCentr']) CHART_REGISTRY['cCentr'].destroy();
        const cCentLbls=['1 – Delegado','2','3','4','5 – Centralizado'];
        const cCentVals=[1,2,3,4,5].map(k=>centrBins[k]);
        const cCentCols=[1,2,3,4,5].map(k=>k>=4?RD:k===3?AM:G);
        CHART_REGISTRY['cCentr']=new Chart(cEl,{type:'bar',data:{labels:cCentLbls,datasets:[{data:cCentVals,backgroundColor:cCentCols,borderRadius:5,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS},scales:{x:{grid:{display:false},ticks:{color:LC,font:{size:10}},border:{color:'transparent'}},y:{grid:{color:GC},ticks:{color:LC,font:{size:10}},border:{color:'transparent'},min:0}}}});
      }
    } catch(e){ Logger.error('UI','renderCentralizacao',{message:e.message}); }

    // ── Desafio na Gestão de Pessoas ──
    try {
      const desafioMap={};
      data.forEach(r=>{ const v=(r.desafioGestao||'').trim(); if(v) desafioMap[v]=(desafioMap[v]||0)+1; });
      const desafioE=Object.entries(desafioMap).sort((a,b)=>b[1]-a[1]);
      const dEl=document.getElementById('cDesafio');
      if(dEl && desafioE.length>0){
        if(CHART_REGISTRY['cDesafio']) CHART_REGISTRY['cDesafio'].destroy();
        // shorten labels
        const shorten=s=>s.length>38?s.slice(0,36)+'…':s;
        CHART_REGISTRY['cDesafio']=new Chart(dEl,{type:'bar',data:{labels:desafioE.map(e=>shorten(e[0])),datasets:[{data:desafioE.map(e=>e[1]),backgroundColor:PAL,borderRadius:5,borderSkipped:false}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:TOOLTIP_DEFAULTS},scales:{x:{grid:{color:GC},ticks:{color:LC,font:{size:10}},border:{color:'transparent'},min:0},y:{grid:{display:false},ticks:{color:LC,font:{size:10}},border:{color:'transparent'}}}}});
      }
    } catch(e){ Logger.error('UI','renderDesafioGestao',{message:e.message}); }
}

  // Hook: ao clicar na aba
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>{
      const navIns=document.getElementById('nav-insights');
      if(navIns) navIns.addEventListener('click',()=>setTimeout(renderInsightsCorrelacionais,150));
    },600);
  });
  // Re-render quando dados vivos chegam (hook em storeUpdateBr)
  const _origSU2 = window.storeUpdateBr;
  if (typeof _origSU2 === 'function') {
    window.storeUpdateBr = function(payload) {
      const r = _origSU2(payload);
      try {
        const pg = document.getElementById('page-insights');
        if (pg && pg.classList.contains('active')) setTimeout(renderInsightsCorrelacionais,100);
      } catch(e){}
      return r;
    };
  }
  // Toggle de fonte das informações
  window.toggleDiagFonte = function() {
    const el = document.getElementById('diag-fonte');
    const btn = document.getElementById('diag-fonte-toggle');
    if (!el || !btn) return;
    if (el.style.display === 'none') {
      el.style.display = 'block';
      btn.innerHTML = '📖 Esconder fonte das informações';
    } else {
      el.style.display = 'none';
      btn.innerHTML = '📖 Ver fonte das informações';
    }
  };
  window.renderInsightsCorrelacionais = renderInsightsCorrelacionais;
})();

function gModalOpen(lbl,mes,t,c,s,o,p,x){
  document.getElementById('gMes').textContent=(mes&&mes!=='undefined')?mes.toUpperCase():'';
  document.getElementById('gFlag').textContent='🇧🇷 '+lbl;
  document.getElementById('gSub').textContent='PCE '+lbl+' — Programa de Crescimento Empresarial · Febracis';
  const G='#f5a623';
  document.getElementById('gGrid').innerHTML=[
    {l:'Total',v:t,s:'participantes',c:'var(--cream)'},
    {l:'Confirmados',v:c,s:t>0?Math.round(c/t*100)+'% do total':'—',c:G},
    {l:'Sem Retorno',v:s,s:t>0?Math.round(s/t*100)+'% do total':'—',c:'var(--red)'},
    {l:'Onboarding',v:o,s:t>0?Math.round(o/t*100)+'% realizado':'—',c:'var(--blue)'},
    {l:'Próx. Turma',v:p,s:'migrados',c:'var(--amber)'},
    {l:'Cancelamentos',v:x,s:'cancelados',c:'var(--red)'},
  ].map(k=>'<div class="g-modal-kpi"><small>'+k.l+'</small><b style="color:'+k.c+'">'+k.v+'</b><span>'+k.s+'</span></div>').join('');
  document.getElementById('gOverlay').classList.add('on');
  document.getElementById('gModal').classList.add('on');
  document.body.style.overflow='hidden';
}
function gModalClose(){
  document.getElementById('gOverlay').classList.remove('on');
  document.getElementById('gModal').classList.remove('on');
  document.body.style.overflow='';
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')gModalClose();});

// ══ LOADER
var Loader = (function() {
  var CIRC = 408.41;
  var pct  = 0;
  var ival = null;

  function el(id) { return document.getElementById(id); }

  function setProgress(p) {
    pct = Math.min(100, Math.max(0, p));
    var arc = el('pce-arc-fill');
    var txt = el('pce-pct');
    if (arc) arc.style.strokeDashoffset = CIRC * (1 - pct / 100);
    if (txt) txt.textContent = Math.round(pct) + '%';
  }

  function show(txt) {
    var loader = el('pce-loader');
    if (loader) loader.classList.remove('hidden');
    var t = el('pce-loader-txt');
    if (t && txt) t.textContent = txt;
    setProgress(0);
    // Auto-avanço até 80% enquanto aguarda
    var auto = 1;
    clearInterval(ival);
    ival = setInterval(function() {
      if (auto < 80) {
        auto = auto + (80 - auto) * 0.06;
        setProgress(auto);
      }
    }, 400);
  }

  function hide() {
    clearInterval(ival);
    setProgress(100);
    setTimeout(function() {
      var loader = el('pce-loader');
      if (loader) loader.classList.add('hidden');
    }, 400);
  }

  return { show: show, hide: hide, setProgress: setProgress };
})();

// ══ MANUAL — EXPERTS · CARDS, MODAL, EDIÇÃO E PERSISTÊNCIA ════


// ── SENHA MASTER PARA EDIÇÃO ─────────────────────────────────
// Cacheia consentimento por sessão (some ao fechar o navegador).
// SUPABASE - Cliente + Auth + persistencia
var SUPABASE_URL = 'https://amibetbgzwaayhyxnank.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaWJldGJnendhYXloeXhuYW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDI0MjgsImV4cCI6MjA5MzU3ODQyOH0.Sg6u0i8FWV2fhuyBfqmLeINqK2Q2RR1G2KqMXB3-Ydw';
var SB = null;
var _currentUser = null;
var _currentProfile = null;
var _supabaseReady = false;
var _supabaseError = null;
function supabaseInit(){
  try {
    if (typeof supabase === 'undefined' || !supabase.createClient){
      _supabaseError = 'SDK do Supabase nao carregou';
      return false;
    }
    SB = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
    _supabaseReady = true;
    return true;
  } catch(e){
    _supabaseError = e.message;
    if (typeof Logger !== 'undefined') Logger.error('SUPABASE','init',{err:e.message});
    return false;
  }
}


/* ===== PAINEL ADM =====================================================
   Área restrita a administradores. Consolida gestão de usuários, aprovação
   de cadastros e lixeira. Toda ação é reforçada por RLS no banco — o gate de
   UI aqui é conveniência, não segurança. Engenharia: Ronaldo Ferreira. */
var _admTab='usuarios';
var _admUsers=[];

function admSyncNav(){
  var on = (typeof authIsAdmin==='function') && authIsAdmin();
  var it=document.getElementById('nav-admin'), sc=document.getElementById('nav-section-admin');
  if(it) it.style.display = on?'':'none';
  if(sc) sc.style.display = on?'':'none';
  if(!on){
    var pg=document.getElementById('page-admin');
    if(pg && pg.classList.contains('active')) switchPage('dash');
  }
}
function admBadge(n){
  var b=document.getElementById('badge-admin-pend');
  if(!b)return;
  if(n>0){b.textContent=n;b.style.display='';b.style.background='#f5c542';b.style.color='#1a1a18';}
  else b.style.display='none';
}
async function admBoot(){
  if(!authIsAdmin()){ switchPage('dash'); return; }
  var body=document.getElementById('adm-body');
  if(!body)return;
  body.innerHTML='<div class="adm-empty">Carregando…</div>';
  var _ger=document.getElementById('adm-gerencial');
  var _aud=document.getElementById('adm-auditoria');
  if(_admTab==='auditoria'){
    if(body)body.style.display='none';
    if(_ger)_ger.style.display='none';
    if(_aud)_aud.style.display='';
    if(typeof audBootTab==='function')audBootTab();
    return;
  }
  if(_aud)_aud.style.display='none';
  if(_admTab==='gerencial'){
    if(body)body.style.display='none';
    if(_ger)_ger.style.display='';
    admRenderGerencial();
    return;
  }
  if(body)body.style.display='';
  if(_ger)_ger.style.display='none';
  if(_admTab==='usuarios') await admRenderUsuarios();
  else await admRenderLixeira();
}
function admRenderGerencial(){
  /* Reaproveita as engines existentes; só dispara os renders nos containers do ADM.
     Requer store.br carregado (Dashboard já busca no boot). */
  try{
    var rows=(store.br&&store.br.rows)||[];
    /* Networking: T15 tem endpoint próprio; T14 usa a análise local. */
    if(typeof paintNetworkingT15==='function'){
      var _tv=null;try{var _pr=(store.br&&store.br.stats&&store.br.stats.presenca)||{};var _tc=_pr.totalConfirmados||((_pr.brConfirmado||0)+(_pr.brUs||0)+(_pr.usConfirmado||0)+(_pr.confirmado||0));var _sr=_pr.semRetorno||0;_tv=(_pr.turmaValida!=null?_pr.turmaValida:(_tc+_sr))+(typeof computePendingTransfer==='function'?computePendingTransfer(store.br,'T15'):0);}catch(e){}
      paintNetworkingT15(_tv);
      if(typeof fetchNetworkingT15==='function')fetchNetworkingT15().then(function(ok){if(ok)paintNetworkingT15(_tv);});
    }
    /* Conciliação T15 */
    var _cSl=document.getElementById('adm-conc-sl');var _cGr=document.getElementById('adm-conc-grid');
    var _hasConc=!!(store.br&&store.br.conciliacao);
    if(_cSl)_cSl.style.display=_hasConc?'':'none';
    if(_cGr)_cGr.style.display=_hasConc?'':'none';
    if(_hasConc&&typeof renderConcT15==='function')renderConcT15();
    /* As 2 sublistas do Typeform são escritas pelo render do meta-confirm,
       que roda no renderViewBr. Se o admin abrir a aba sem ter passado pela
       Dashboard, forçamos um render silencioso. */
    var _srEl=document.getElementById('adm-tf-semret');
    if(_srEl&&!_srEl.innerHTML.trim()&&typeof renderViewBr==='function'&&store.br&&store.br.rows){
      try{renderViewBr(store.br.turmaLabel||'T15');}catch(e){}
    }
  }catch(e){if(window.Logger)Logger.warn('ADM','Falha ao render gerencial',{err:e&&e.message});}
}
document.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.adm-tab'):null;if(b&&b.dataset.adm)admSwitchTab(b.dataset.adm);});
function admSwitchTab(t){
  _admTab=t;
  [].forEach.call(document.querySelectorAll('.adm-tab'),function(b){b.classList.toggle('on',b.dataset.adm===t);});
  /* Toggle containers directly — não depende de admBoot completar */
  var _b=document.getElementById('adm-body');
  var _g=document.getElementById('adm-gerencial');
  var _a=document.getElementById('adm-auditoria');
  if(t==='auditoria'){
    if(_b)_b.style.display='none';if(_g)_g.style.display='none';if(_a)_a.style.display='';
    if(typeof audBootTab==='function')try{audBootTab();}catch(e){if(window.Logger)Logger.warn('ADM','audBootTab err',{err:e&&e.message});}
  } else {
    if(_a)_a.style.display='none';
    admBoot();
  }
}
async function admLoadUsers(){
  var r=await SB.from('editor_profiles').select('user_id, email, full_name, is_admin, approved, created_at').order('approved',{ascending:true}).order('is_admin',{ascending:false}).order('full_name');
  if(r.error)throw r.error;
  _admUsers=r.data||[];
  admBadge(_admUsers.filter(function(u){return u.approved===false;}).length);
  return _admUsers;
}
async function admRenderUsuarios(){
  var body=document.getElementById('adm-body');
  try{ await admLoadUsers(); }
  catch(e){ body.innerHTML='<div class="adm-empty">Erro ao carregar: '+manualEscape(e.message||String(e))+'</div>'; return; }
  var pend=_admUsers.filter(function(u){return u.approved===false;});
  var apro=_admUsers.filter(function(u){return u.approved!==false;});

  function linha(u){
    var isMe=_currentUser && u.user_id===_currentUser.id;
    var pendente=u.approved===false;
    var acts='';
    if(pendente){
      acts='<button class="adm-b ok" onclick="admApprove(\''+u.user_id+'\',true)">✓ Aprovar</button>'+
           '<button class="adm-b dang" onclick="admReject(\''+u.user_id+'\')">✕ Rejeitar</button>';
    }else{
      acts=(isMe?'':'<button class="adm-b" onclick="admToggleAdmin(\''+u.user_id+'\','+(!u.is_admin)+')">'+(u.is_admin?'↓ Remover admin':'↑ Tornar admin')+'</button>')+
           '<button class="adm-b warn" onclick="admResetSenha(\''+u.user_id+'\')">✉ Resetar senha</button>'+
           (isMe?'<button class="adm-b" onclick="admTrocarMinhaSenha()">🔑 Trocar minha senha</button>'
                :'<button class="adm-b dang" onclick="admApprove(\''+u.user_id+'\',false)">⏸ Revogar</button>');
    }
    return '<tr'+(pendente?' class="pend"':'')+'>'+
      '<td><div class="adm-nm">'+manualEscape(u.full_name||u.email||'—')+(isMe?' <span style="color:var(--green);font-size:10px">(você)</span>':'')+'</div>'+
      '<div class="adm-em">'+manualEscape(u.email||'')+'</div></td>'+
      '<td>'+(pendente?'<span class="adm-pill pend">Pendente</span>':(u.is_admin?'<span class="adm-pill adm">Admin</span>':'<span class="adm-pill usr">Usuário</span>'))+'</td>'+
      '<td class="adm-em">'+String(u.created_at||'').slice(0,10)+'</td>'+
      '<td><div class="adm-acts">'+acts+'</div></td></tr>';
  }
  var h='';
  h+='<div class="adm-card"><div class="adm-ct">Aguardando aprovação ('+pend.length+')</div>';
  h+= pend.length
    ? '<table class="adm-tbl"><thead><tr><th>Pessoa</th><th>Status</th><th>Cadastro</th><th style="text-align:right">Ações</th></tr></thead><tbody>'+pend.map(linha).join('')+'</tbody></table>'
    : '<div class="adm-empty">Nenhum cadastro pendente.</div>';
  h+='</div>';
  h+='<div class="adm-card"><div class="adm-ct">Usuários com acesso ('+apro.length+')</div>'+
     '<table class="adm-tbl"><thead><tr><th>Pessoa</th><th>Papel</th><th>Cadastro</th><th style="text-align:right">Ações</th></tr></thead><tbody>'+apro.map(linha).join('')+'</tbody></table>'+
     '<div class="adm-note"><b>Resetar senha</b> envia um link de redefinição para o e-mail da pessoa — ela mesma escolhe a nova senha. '+
     'Definir a senha de outro usuário diretamente exigiria a <i>service_role key</i> no HTML, o que daria acesso total ao banco a qualquer visitante. Por isso o fluxo é por e-mail.</div>'+
     '</div>';
  document.getElementById('adm-body').innerHTML=h;
}
async function admRenderLixeira(){
  var body=document.getElementById('adm-body');
  body.innerHTML='<div class="adm-card"><div class="adm-ct">Lixeira do Manual PCE</div>'+
    '<div style="font-size:13px;color:var(--muted);line-height:1.6;margin-bottom:14px">Cards e seções removidos do Manual — PCE. Podem ser restaurados ou apagados definitivamente.</div>'+
    '<button class="adm-b ok" style="font-size:12px;padding:9px 16px" onclick="mpceOpenTrashModal()">🗑 Abrir lixeira <span id="adm-trash-n"></span></button>'+
    '</div>';
  try{
    var r=await SB.from('manualpce_cards').select('id',{count:'exact',head:true}).not('deleted_at','is',null);
    var el=document.getElementById('adm-trash-n');
    if(el && r && typeof r.count==='number') el.textContent='('+r.count+')';
  }catch(e){}
}
async function admApprove(userId,val){
  if(!authIsAdmin())return;
  try{
    var r=await SB.from('editor_profiles').update({approved:val}).eq('user_id',userId);
    if(r.error)throw r.error;
    manualToast(val?'Acesso aprovado':'Acesso revogado');
    await admRenderUsuarios();
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function admReject(userId){
  if(!authIsAdmin())return;
  var u=_admUsers.filter(function(x){return x.user_id===userId;})[0]||{};
  if(!confirm('Rejeitar e remover o cadastro de "'+(u.full_name||u.email||'')+'"?\n\nO perfil será apagado.'))return;
  try{
    var r=await SB.from('editor_profiles').delete().eq('user_id',userId);
    if(r.error)throw r.error;
    manualToast('Cadastro rejeitado');
    await admRenderUsuarios();
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function admToggleAdmin(userId,val){
  if(!authIsAdmin())return;
  var u=_admUsers.filter(function(x){return x.user_id===userId;})[0]||{};
  if(!confirm((val?'Tornar ':'Remover o status de ')+'administrador'+(val?'':' de')+' "'+(u.full_name||u.email||'')+'"?'))return;
  try{
    var r=await SB.from('editor_profiles').update({is_admin:val}).eq('user_id',userId);
    if(r.error)throw r.error;
    manualToast(val?'Promovido a admin':'Admin removido');
    await admRenderUsuarios();
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function admResetSenha(userId){
  if(!authIsAdmin())return;
  var u=_admUsers.filter(function(x){return x.user_id===userId;})[0]||{};
  if(!u.email){alert('Este usuário não tem e-mail cadastrado.');return;}
  if(!confirm('Enviar link de redefinição de senha para '+u.email+'?\n\nA pessoa recebe um e-mail e define a nova senha.'))return;
  try{
    var r=await SB.auth.resetPasswordForEmail(u.email,{redirectTo:window.location.href.split('#')[0]});
    if(r.error)throw r.error;
    manualToast('Link de redefinição enviado para '+u.email);
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function admTrocarMinhaSenha(){
  if(!_currentUser){alert('Faça login.');return;}
  var s1=prompt('Nova senha (mínimo 6 caracteres):');
  if(s1===null)return;
  s1=String(s1);
  if(s1.length<6){alert('A senha precisa ter pelo menos 6 caracteres.');return;}
  var s2=prompt('Repita a nova senha:');
  if(s2===null)return;
  if(s1!==String(s2)){alert('As senhas não conferem.');return;}
  try{
    var r=await SB.auth.updateUser({password:s1});
    if(r.error)throw r.error;
    manualToast('Senha alterada com sucesso');
  }catch(e){alert('Erro: '+(authTranslateError(e.message||String(e))));}
}

// ── ADMIN ─────────────────────────────────────────────────────
function authIsAdmin(){
  return !!(_currentProfile && _currentProfile.is_admin === true);
}

// Listas de seções (carregadas do banco)
var _manualSections = [];

// ── PROMPTS DE CRIAÇÃO ───────────────────────────────────────
function manualOpenModal(id){
  document.getElementById(id).classList.add('open');
}
function manualCloseModal(id){
  document.getElementById(id).classList.remove('open');
}

function manualPromptCreateSection(){
  if (!authIsAdmin()){ alert('Apenas administradores podem criar seções.'); return; }
  document.getElementById('sm-section-title').textContent = 'Nova seção';
  document.getElementById('sm-section-input-title').value = '';
  document.getElementById('sm-section-input-icon').value = '📚';
  document.getElementById('sm-section-input-size').value = 'compact';
  document.getElementById('sm-section-save').textContent = 'Criar seção';
  document.getElementById('sm-section-save').dataset.editId = '';
  manualOpenModal('sm-section');
}

function manualPromptEditSection(sectionId){
  if (!authIsAdmin()){ return; }
  var s = _manualSections.find(function(x){ return x.id === sectionId; });
  if (!s) return;
  document.getElementById('sm-section-title').textContent = 'Editar seção';
  document.getElementById('sm-section-input-title').value = s.title;
  document.getElementById('sm-section-input-icon').value = s.icon || '📚';
  document.getElementById('sm-section-input-size').value = s.card_size || 'compact';
  document.getElementById('sm-section-save').textContent = 'Salvar alterações';
  document.getElementById('sm-section-save').dataset.editId = sectionId;
  manualOpenModal('sm-section');
}

async function manualSaveSectionFromModal(){
  var title = document.getElementById('sm-section-input-title').value.trim();
  var icon  = document.getElementById('sm-section-input-icon').value.trim() || '📚';
  var size  = document.getElementById('sm-section-input-size').value;
  var editId = document.getElementById('sm-section-save').dataset.editId;
  if (!title){ alert('Informe um título.'); return; }
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    if (editId){
      var r = await SB.from('manual_sections').update({
        title: title, icon: icon, card_size: size,
        updated_by: _currentUser.id, updated_by_name: who
      }).eq('id', editId).select().single();
      if (r.error) throw r.error;
      manualToast('Seção atualizada');
    } else {
      // Gerar id único baseado no título
      var newId = title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
        .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').substring(0,40)
        + '-' + Date.now().toString(36).substring(-6);
      var maxOrder = _manualSections.reduce(function(m,s){ return Math.max(m, s.display_order || 0); }, 0);
      var r = await SB.from('manual_sections').insert({
        id: newId, title: title, icon: icon, card_size: size,
        display_order: maxOrder + 1, is_default: false,
        updated_by: _currentUser.id, updated_by_name: who
      }).select().single();
      if (r.error) throw r.error;
      manualToast('Seção criada');
    }
    manualCloseModal('sm-section');
    await manualBootCloud();
  } catch(e){
    alert('Erro ao salvar seção: ' + (e.message || e));
  }
}

async function manualDeleteSection(sectionId){
  if (!authIsAdmin()){ return; }
  var s = _manualSections.find(function(x){ return x.id === sectionId; });
  if (!s) return;
  if (s.is_default){ alert('Esta seção é padrão e não pode ser excluída.'); return; }
  // Verificar se tem cards ativos
  var cardsInSection = Object.values(_manualState).filter(function(c){
    return c._sectionId === sectionId && !c._deletedAt;
  });
  if (cardsInSection.length > 0){
    alert('Não é possível excluir esta seção: ela ainda tem ' + cardsInSection.length + ' card(s). Mova ou exclua os cards primeiro.');
    return;
  }
  if (!confirm('Excluir a seção "' + s.title + '"?\n\nVocê pode restaurá-la depois pela Lixeira.')) return;
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    var r = await SB.from('manual_sections').update({
      deleted_at: new Date().toISOString(),
      updated_by: _currentUser.id, updated_by_name: who
    }).eq('id', sectionId);
    if (r.error) throw r.error;
    manualToast('Seção movida para a lixeira');
    await manualBootCloud();
  } catch(e){
    alert('Erro: ' + (e.message || e));
  }
}

function manualPromptCreateCard(sectionId){
  if (!authIsAdmin()){ return; }
  document.getElementById('sm-card-input-id').value = '';
  document.getElementById('sm-card-input-title').value = '';
  document.getElementById('sm-card-input-tag').value = 'Manual';
  document.getElementById('sm-card-input-desc').value = '';
  document.getElementById('sm-card-input-section').value = sectionId;
  manualOpenModal('sm-card');
}

async function manualSaveCardFromModal(){
  var id    = document.getElementById('sm-card-input-id').value.trim().toLowerCase().replace(/[^a-z0-9-]/g,'-');
  var title = document.getElementById('sm-card-input-title').value.trim();
  var tag   = document.getElementById('sm-card-input-tag').value.trim() || 'Manual';
  var desc  = document.getElementById('sm-card-input-desc').value.trim();
  var sectionId = document.getElementById('sm-card-input-section').value;
  if (!id || !title){ alert('Informe ID e título.'); return; }
  if (id.length < 2 || id.length > 40){ alert('ID precisa ter de 2 a 40 caracteres.'); return; }
  // Verificar se id já existe
  if (_manualState[id]){ alert('Já existe um card com este ID. Escolha outro.'); return; }
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    // Estrutura inicial mínima
    var defaultDays = [{ label: 'Geral', blocks: [{ icon: '📌', title: 'Conteúdo', desc: 'Edite este card para adicionar o conteúdo.' }] }];
    var r = await SB.from('manual_cards').insert({
      id: id, tag: tag, title: title, description: desc,
      days_json: defaultDays, section_id: sectionId,
      display_order: 99,
      updated_by: _currentUser.id, updated_by_name: who
    }).select().single();
    if (r.error) throw r.error;
    manualToast('Card criado!');
    manualCloseModal('sm-card');
    await manualBootCloud();
  } catch(e){
    alert('Erro ao criar card: ' + (e.message || e));
  }
}

async function manualDeleteCard(cardId){
  if (!authIsAdmin()){ return; }
  var data = _manualState[cardId];
  if (!data) return;
  // 1ª confirmação
  if (!confirm('Excluir o card "' + data.title + '"?\n\nVocê pode restaurá-lo depois pela Lixeira.')) return;
  // 2ª confirmação: digitar nome
  var typed = prompt('Digite EXATAMENTE o nome do card para confirmar:\n\n"' + data.title + '"');
  if (typed === null) return;
  if (typed.trim() !== data.title){
    alert('O nome digitado não bate. Operação cancelada.');
    return;
  }
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    var r = await SB.from('manual_cards').update({
      deleted_at: new Date().toISOString(),
      updated_by: _currentUser.id, updated_by_name: who
    }).eq('id', cardId);
    if (r.error) throw r.error;
    manualToast('Card movido para a lixeira');
    manualClose();
    await manualBootCloud();
  } catch(e){
    alert('Erro: ' + (e.message || e));
  }
}

// ── DRAG AND DROP ─────────────────────────────────────────────
var _sortableInstances = [];
function manualInitSortables(){
  // Limpar instances anteriores
  _sortableInstances.forEach(function(s){ try { s.destroy(); } catch(e){} });
  _sortableInstances = [];
  if (!authIsAdmin()) return;
  if (typeof Sortable === 'undefined'){ console.warn('Sortable não carregou'); return; }

  // Sortable em cada grid (cards dentro da seção)
  document.querySelectorAll('[data-section-grid]').forEach(function(grid){
    var inst = Sortable.create(grid, {
      group: 'cards',
      animation: 150,
      filter: '.add-card-btn',
      onMove: function(evt){
        // Não permite soltar na posição do botão "+ Adicionar card"
        return !evt.related.classList.contains('add-card-btn');
      },
      onEnd: function(evt){ manualOnCardDrop(evt); }
    });
    _sortableInstances.push(inst);
  });

  // Sortable nas seções (drag handle)
  var host = document.getElementById('manual-sections-host');
  if (host){
    var inst = Sortable.create(host, {
      animation: 150,
      handle: '.section-grab-handle',
      onEnd: function(evt){ manualOnSectionDrop(evt); }
    });
    _sortableInstances.push(inst);
  }
}

async function manualOnCardDrop(evt){
  var cardId = evt.item.dataset.cardId;
  var newSectionId = evt.to.dataset.section;
  if (!cardId || !newSectionId) return;
  var newOrder = evt.newIndex;
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    await SB.from('manual_cards').update({
      section_id: newSectionId,
      display_order: newOrder,
      updated_by: _currentUser.id,
      updated_by_name: who
    }).eq('id', cardId);
    // Reordenar todos os cards do grid de destino
    var allInGrid = Array.from(evt.to.querySelectorAll('[data-card-id]'));
    var updates = allInGrid.map(function(el, idx){
      return SB.from('manual_cards').update({ display_order: idx }).eq('id', el.dataset.cardId);
    });
    await Promise.all(updates);
    manualToast('Posição atualizada');
    // Atualiza estado local sem re-fetch (mais rápido)
    if (_manualState[cardId]) _manualState[cardId]._sectionId = newSectionId;
  } catch(e){
    alert('Erro ao reordenar: ' + (e.message || e));
    await manualBootCloud(); // Reverte visual
  }
}

async function manualOnSectionDrop(evt){
  var host = document.getElementById('manual-sections-host');
  var sectionEls = Array.from(host.querySelectorAll('[data-section-id]'));
  try {
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    var updates = sectionEls.map(function(el, idx){
      return SB.from('manual_sections').update({
        display_order: idx + 1,
        updated_by: _currentUser.id,
        updated_by_name: who
      }).eq('id', el.dataset.sectionId);
    });
    await Promise.all(updates);
    manualToast('Ordem das seções atualizada');
  } catch(e){
    alert('Erro: ' + (e.message || e));
    await manualBootCloud();
  }
}

// ── LIXEIRA ──────────────────────────────────────────────────
async function manualOpenTrashModal(){
  if (!authIsAdmin()){ return; }
  var listEl = document.getElementById('sm-trash-list');
  listEl.innerHTML = '<div class="sm-list-empty">Carregando…</div>';
  manualOpenModal('sm-trash');
  try {
    var [cardsRes, sectionsRes] = await Promise.all([
      SB.from('manual_cards').select('id, title, tag, deleted_at, updated_by_name').not('deleted_at','is',null).order('deleted_at',{ascending:false}),
      SB.from('manual_sections').select('id, title, icon, deleted_at, updated_by_name').not('deleted_at','is',null).order('deleted_at',{ascending:false})
    ]);
    var items = [];
    (cardsRes.data || []).forEach(function(c){
      items.push({ kind: 'card', id: c.id, title: c.title, sub: 'Card · excluído por ' + (c.updated_by_name || '?'), date: c.deleted_at });
    });
    (sectionsRes.data || []).forEach(function(s){
      items.push({ kind: 'section', id: s.id, title: s.title, sub: 'Seção · excluída por ' + (s.updated_by_name || '?'), date: s.deleted_at });
    });
    if (!items.length){
      listEl.innerHTML = '<div class="sm-list-empty">Lixeira vazia 🌱</div>';
      return;
    }
    listEl.innerHTML = items.map(function(it){
      return '<div class="sm-list-item">'+
        '<div class="sli-info">'+
          '<div class="sli-title">'+manualEscape(it.title)+'</div>'+
          '<div class="sli-sub">'+manualEscape(it.sub)+'</div>'+
        '</div>'+
        '<div class="sli-actions">'+
          '<button class="sli-btn restore" onclick="manualRestoreItem(\''+it.kind+'\',\''+it.id+'\')">Restaurar</button>'+
        '</div>'+
      '</div>';
    }).join('');
  } catch(e){
    listEl.innerHTML = '<div class="sm-list-empty">Erro: ' + e.message + '</div>';
  }
}

async function manualRestoreItem(kind, id){
  if (!authIsAdmin()){ return; }
  try {
    var table = (kind === 'card') ? 'manual_cards' : 'manual_sections';
    var who = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
    var r = await SB.from(table).update({
      deleted_at: null,
      updated_by: _currentUser.id, updated_by_name: who
    }).eq('id', id);
    if (r.error) throw r.error;
    manualToast('Restaurado');
    manualCloseModal('sm-trash');
    await manualBootCloud();
  } catch(e){
    alert('Erro: ' + (e.message || e));
  }
}

// ── GERENCIAR ADMINS ─────────────────────────────────────────
async function manualOpenAdminsModal(){
  if (!authIsAdmin()){ return; }
  var listEl = document.getElementById('sm-admins-list');
  listEl.innerHTML = '<div class="sm-list-empty">Carregando…</div>';
  manualOpenModal('sm-admins');
  try {
    var r = await SB.from('editor_profiles').select('user_id, email, full_name, is_admin, approved, created_at').order('approved',{ascending:true}).order('is_admin',{ascending:false}).order('full_name');
    if (r.error) throw r.error;
    var users = r.data || [];
    if (!users.length){
      listEl.innerHTML = '<div class="sm-list-empty">Nenhum usuário cadastrado.</div>';
      return;
    }
    var pend = users.filter(function(u){return u.approved===false;});
    var apro = users.filter(function(u){return u.approved!==false;});
    function row(u){
      var isMe = u.user_id === _currentUser.id;
      var pendente = u.approved===false;
      return '<div class="sm-list-item"'+(pendente?' style="background:rgba(245,197,66,.06);border-left:3px solid var(--amber,#f5c542)"':'')+'>'+
        '<div class="sli-info">'+
          '<div class="sli-title">'+manualEscape(u.full_name || u.email)+
            (isMe?' <span style="color:var(--green);font-size:10px">(você)</span>':'')+
            (pendente?' <span style="color:var(--amber,#f5c542);font-size:10px;font-weight:800">● PENDENTE</span>':'')+
          '</div>'+
          '<div class="sli-sub">'+manualEscape(u.email || '')+'</div>'+
        '</div>'+
        '<div class="sli-actions">'+
          (pendente
            ? '<button class="sli-btn" style="background:var(--green);color:#1a1a18;font-weight:800" onclick="adminApprove(\''+u.user_id+'\',true)">✓ Aprovar</button>'+
              '<button class="sli-btn" style="background:transparent;border:1px solid rgba(255,95,95,.5);color:#ff8a8a" onclick="adminReject(\''+u.user_id+'\',\''+manualEscape((u.full_name||u.email||'').replace(/\'/g,''))+'\')">✕ Rejeitar</button>'
            : '<button class="sli-btn toggle '+(u.is_admin?'is-admin':'')+'" onclick="manualToggleAdmin(\''+u.user_id+'\','+!u.is_admin+')">'+(u.is_admin?'Admin':'Promover')+'</button>'+
              (isMe?'':'<button class="sli-btn" style="background:transparent;border:1px solid rgba(255,95,95,.35);color:#ff8a8a" onclick="adminApprove(\''+u.user_id+'\',false)" title="Revogar acesso">⏸ Revogar</button>')
          )+
        '</div>'+
      '</div>';
    }
    var html='';
    if(pend.length) html+='<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--amber,#f5c542);margin:2px 0 8px">Aguardando aprovação ('+pend.length+')</div>'+pend.map(row).join('')+'<div style="height:14px"></div>';
    html+='<div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:2px 0 8px">Com acesso ('+apro.length+')</div>'+apro.map(row).join('');
    listEl.innerHTML = html;
  } catch(e){
    listEl.innerHTML = '<div class="sm-list-empty">Erro: ' + e.message + '</div>';
  }
}
async function adminApprove(userId, val){
  if(!authIsAdmin())return;
  try{
    var r=await SB.from('editor_profiles').update({approved:val}).eq('user_id',userId);
    if(r.error)throw r.error;
    manualToast(val?'Acesso aprovado':'Acesso revogado');
    await manualOpenAdminsModal();
  }catch(e){alert('Erro: '+(e.message||e));}
}
async function adminReject(userId, nome){
  if(!authIsAdmin())return;
  if(!confirm('Rejeitar e remover o cadastro de "'+nome+'"?\n\nO perfil será apagado. A pessoa poderá se cadastrar de novo, mas continuará pendente.'))return;
  try{
    var r=await SB.from('editor_profiles').delete().eq('user_id',userId);
    if(r.error)throw r.error;
    manualToast('Cadastro rejeitado');
    await manualOpenAdminsModal();
  }catch(e){alert('Erro: '+(e.message||e));}
}

function adminsToggleCreate(forceClose){
  var form=document.getElementById('sm-create-form');
  var chevron=document.getElementById('sm-create-chevron');
  var msg=document.getElementById('sm-create-msg');
  var isOpen=form.style.display!=='none';
  if(forceClose||isOpen){
    form.style.display='none';
    chevron.style.transform='rotate(0deg)';
    ['sm-new-name','sm-new-email','sm-new-pass'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    document.getElementById('sm-new-admin').checked=false;
    if(msg){msg.style.display='none';msg.textContent='';}
  } else {
    form.style.display='block';
    chevron.style.transform='rotate(180deg)';
    setTimeout(function(){var el=document.getElementById('sm-new-name');if(el)el.focus();},80);
  }
}

async function manualCreateUser(){
  if(!authIsAdmin()) return;
  var name=(document.getElementById('sm-new-name').value||'').trim();
  var email=(document.getElementById('sm-new-email').value||'').trim();
  var pass=(document.getElementById('sm-new-pass').value||'').trim();
  var isAdmin=document.getElementById('sm-new-admin').checked;
  var msg=document.getElementById('sm-create-msg');
  function showMsg(text,ok){
    msg.textContent=text;msg.style.display='block';
    msg.style.background=ok?'rgba(70,209,96,.12)':'rgba(255,95,95,.12)';
    msg.style.color=ok?'#46d160':'var(--red)';
    msg.style.border='1px solid '+(ok?'rgba(70,209,96,.3)':'rgba(255,95,95,.3)');
  }
  if(!name){showMsg('Informe o nome completo.',false);return;}
  if(!email){showMsg('Informe o e-mail.',false);return;}
  if(pass.length<6){showMsg('A senha precisa ter pelo menos 6 caracteres.',false);return;}
  var btn=document.getElementById('sm-create-btn');
  btn.disabled=true;btn.textContent='Criando…';
  msg.style.display='none';
  try{
    var tmpClient=supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{
      auth:{persistSession:false,autoRefreshToken:false,storageKey:'tmp_su_'+Date.now()}
    });
    var r=await tmpClient.auth.signUp({email:email,password:pass,options:{data:{full_name:name}}});
    if(r.error) throw r.error;
    var userId=r.data&&r.data.user&&r.data.user.id;
    if(userId){
      await SB.from('editor_profiles').upsert({user_id:userId,email:email,full_name:name,is_admin:isAdmin},{onConflict:'user_id'});
    }
    showMsg('Usuário criado com sucesso!'+(isAdmin?' (admin)':''),true);
    btn.textContent='✓ Criado!';
    ['sm-new-name','sm-new-email','sm-new-pass'].forEach(function(id){document.getElementById(id).value='';});
    document.getElementById('sm-new-admin').checked=false;
    setTimeout(function(){manualOpenAdminsModal();btn.disabled=false;btn.textContent='✓ Criar usuário';},1400);
  } catch(e){
    var em=e.message||String(e);
    if(em.toLowerCase().includes('already registered')) em='Este e-mail já está cadastrado.';
    showMsg('Erro: '+em,false);
    btn.disabled=false;btn.textContent='✓ Criar usuário';
  }
}

async function manualToggleAdmin(userId, makeAdmin){
  if (!authIsAdmin()){ return; }
  if (!makeAdmin && userId === _currentUser.id){
    if (!confirm('Tem certeza que deseja despromover você mesmo? Você perderá acesso administrativo.')) return;
  }
  try {
    var r = await SB.from('editor_profiles').update({ is_admin: makeAdmin }).eq('user_id', userId);
    if (r.error) throw r.error;
    manualToast(makeAdmin ? 'Promovido a admin' : 'Removido de admin');
    // Se foi a própria conta, recarrega o perfil
    if (userId === _currentUser.id){
      await authOnLogin(_currentUser);
    }
    await manualOpenAdminsModal(); // Reabre pra mostrar atualizado
  } catch(e){
    alert('Erro: ' + (e.message || e));
  }
}


function authShowModal(tab){
  document.getElementById('auth-overlay').classList.add('open');
  authSwitchTab(tab || 'login');
  authClearMessages();
  setTimeout(function(){
    var inp = document.getElementById(tab === 'signup' ? 'auth-signup-email' : 'auth-login-email');
    if (inp) inp.focus();
  }, 100);
}
function authHideModal(){
  document.getElementById('auth-overlay').classList.remove('open');
  authClearMessages();
}
function authSwitchTab(tab){
  document.getElementById('auth-tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('auth-tab-signup').classList.toggle('active', tab === 'signup');
  document.getElementById('auth-form-login').style.display  = tab === 'login'  ? '' : 'none';
  document.getElementById('auth-form-signup').style.display = tab === 'signup' ? '' : 'none';
  var forgot = document.getElementById('auth-form-forgot');
  if (forgot) forgot.style.display = tab === 'forgot' ? '' : 'none';
  // Quando volta para login/signup, mostra as tabs novamente
  var tabs = document.querySelector('.auth-tabs');
  if (tabs) tabs.style.display = tab === 'forgot' ? 'none' : '';
  authClearMessages();
}

function authShowForgot(){
  authSwitchTab('forgot');
  authClearMessages();
  // Pré-preenche com o e-mail digitado no login (se houver)
  var loginEmail = document.getElementById('auth-login-email').value.trim();
  if (loginEmail) document.getElementById('auth-forgot-email').value = loginEmail;
  setTimeout(function(){
    var inp = document.getElementById('auth-forgot-email');
    if (inp) inp.focus();
  }, 80);
}

function authTogglePw(inputId, btn){
  var inp = document.getElementById(inputId);
  if (!inp) return;
  if (inp.type === 'password'){
    inp.type = 'text';
    btn.textContent = '🙈';
    btn.title = 'Ocultar senha';
  } else {
    inp.type = 'password';
    btn.textContent = '👁️';
    btn.title = 'Mostrar senha';
  }
}

async function authDoForgot(){
  if (!_supabaseReady){ authError('Cliente Supabase indisponivel'); return; }
  var email = document.getElementById('auth-forgot-email').value.trim();
  if (!email){ authError('Informe um e-mail valido'); return; }
  var btn = document.getElementById('auth-btn-forgot');
  btn.disabled = true; btn.textContent = 'Enviando...';
  try {
    // redirect para a propria pagina apos clique no link de email
    var redirectUrl = window.location.origin + window.location.pathname;
    var r = await SB.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
    if (r.error) throw r.error;
    authInfo('Pronto! Se este e-mail estiver cadastrado, voce recebera um link de recuperacao em alguns minutos. Verifique tambem a caixa de spam.');
    document.getElementById('auth-forgot-email').value = '';
  } catch(e){
    authError(authTranslateError(e.message || 'Falha ao enviar link'));
  } finally {
    btn.disabled = false; btn.textContent = 'Enviar link de recuperacao';
  }
}
function authError(msg){
  var el = document.getElementById('auth-error');
  el.textContent = msg; el.classList.add('show');
  document.getElementById('auth-info').classList.remove('show');
}
function authInfo(msg){
  var el = document.getElementById('auth-info');
  el.textContent = msg; el.classList.add('show');
  document.getElementById('auth-error').classList.remove('show');
}
function authClearMessages(){
  document.getElementById('auth-error').classList.remove('show');
  document.getElementById('auth-info').classList.remove('show');
}
async function authDoLogin(){
  if (!_supabaseReady){ authError('Cliente Supabase indisponivel'); return; }
  var email = document.getElementById('auth-login-email').value.trim();
  var pw    = document.getElementById('auth-login-pw').value;
  if (!email || !pw){ authError('Preencha e-mail e senha'); return; }
  var btn = document.getElementById('auth-btn-login');
  btn.disabled = true; btn.textContent = 'Entrando...';
  try {
    var r = await SB.auth.signInWithPassword({ email: email, password: pw });
    if (r.error) throw r.error;
    await authOnLogin(r.data.user);
    try{analyticsLogLogin();}catch(e){}
    authHideModal();
    manualToast('Bem-vindo de volta!');
  } catch(e){
    authError(authTranslateError(e.message || 'Falha ao entrar'));
  } finally {
    btn.disabled = false; btn.textContent = 'Entrar';
  }
}
async function authDoSignup(){
  if (!_supabaseReady){ authError('Cliente Supabase indisponivel'); return; }
  var name  = document.getElementById('auth-signup-name').value.trim();
  var email = document.getElementById('auth-signup-email').value.trim();
  var pw    = document.getElementById('auth-signup-pw').value;
  if (!name)  { authError('Informe seu nome completo'); return; }
  if (!email) { authError('Informe um e-mail valido'); return; }
  if (pw.length < 6){ authError('A senha precisa ter pelo menos 6 caracteres'); return; }
  var btn = document.getElementById('auth-btn-signup');
  btn.disabled = true; btn.textContent = 'Criando...';
  try {
    var r = await SB.auth.signUp({ email: email, password: pw });
    if (r.error) throw r.error;
    if (!r.data.user){
      authInfo('Conta criada! Verifique seu e-mail para confirmar.');
      return;
    }
    if (!r.data.session){
      authInfo('Conta criada! Verifique seu e-mail para confirmar e depois faca login.');
      return;
    }
    await SB.from('editor_profiles').upsert({
      user_id: r.data.user.id,
      full_name: name,
      email: email,
      approved: false
    });
    /* COMPLIANCE: conta nasce PENDENTE. Não logamos direto — o acesso a dados
       sigilosos (NPS/Turmas) só é liberado após um admin aprovar. */
    try { if (SB) await SB.auth.signOut(); } catch(e){}
    _currentUser = null; _currentProfile = null; authUpdateUI();
    authInfo('Conta criada! Seu acesso está PENDENTE de aprovação por um administrador. Você será avisado quando for liberado.');
  } catch(e){
    authError(authTranslateError(e.message || 'Falha ao criar conta'));
  } finally {
    btn.disabled = false; btn.textContent = 'Criar conta';
  }
}
async function authDoLogout(){
  if (!confirm('Sair da sua conta?')) return;
  try{analyticsPageExit();}catch(e){}
  try { if (SB) await SB.auth.signOut(); } catch(e){}
  _currentUser = null;
  _currentProfile = null;
  authUpdateUI();
  if (document.getElementById('page-manual').classList.contains('active')){
    manualShowLocked();
  }
  if (typeof mpceShowLocked==='function') mpceShowLocked();
  /* NPS é sigiloso: limpa da tela e expulsa da página restrita ao sair. */
  try{ if(typeof window.__npsReboot==='function') window.__npsReboot(); }catch(e){}
  try{ if(typeof admSyncNav==='function') admSyncNav(); }catch(e){}
  try{
    var _act=['nps'].filter(function(pg){var el=document.getElementById('page-'+pg);return el&&el.classList.contains('active');});
    var _dashTurmas=document.getElementById('page-dash');
    var _emTurmas=_dashTurmas&&_dashTurmas.classList.contains('mode-turmas');
    if(_act.length||_emTurmas) switchPage('dash');
  }catch(e){}
}
/* ===== Analytics de uso — page_logs + login_logs (RPC estreita) =====
   Engenharia: Ronaldo Ferreira (construtor da fundação).
   Dashboard segue read-only: toda escrita passa pelas RPCs
   SECURITY DEFINER no Supabase. Fire-and-forget, nunca bloqueia a UI,
   só registra com sessao ativa (_currentUser). */
var __pageLogId = null;
function analyticsLogLogin(){
  try{
    if(!_supabaseReady || !SB || !_currentUser) return;
    SB.rpc('log_login', {
      p_navegador: (navigator && navigator.userAgent) || null,
      p_sistema:   (navigator && navigator.platform)  || null
    }).then(function(res){
      if(res && res.error && window.Logger) Logger.warn('ANALYTICS','log_login', {err:res.error.message});
    }, function(e){ if(window.Logger) Logger.warn('ANALYTICS','log_login rede', {err:e.message}); });
  }catch(e){}
}
function analyticsPageEnter(p){
  try{
    if(!_supabaseReady || !SB || !_currentUser) return;
    analyticsPageExit();
    SB.rpc('log_page_enter', { p_pagina: String(p||'') }).then(function(res){
      if(res && !res.error && res.data != null) __pageLogId = res.data;
      else if(res && res.error && window.Logger) Logger.warn('ANALYTICS','log_page_enter', {err:res.error.message});
    }, function(e){ if(window.Logger) Logger.warn('ANALYTICS','page_enter rede', {err:e.message}); });
  }catch(e){}
}
function analyticsPageExit(){
  try{
    if(!_supabaseReady || !SB || __pageLogId == null) return;
    var id = __pageLogId; __pageLogId = null;
    SB.rpc('log_page_exit', { p_id: id }).then(function(){}, function(){});
  }catch(e){}
}
try{
  window.addEventListener('beforeunload', function(){
    try{ if(_supabaseReady && SB && __pageLogId != null) SB.rpc('log_page_exit', { p_id: __pageLogId }); }catch(e){}
  });
}catch(e){}
async function authOnLogin(user){
  _currentUser = user;
  try {
    var r = await SB.from('editor_profiles').select('*').eq('user_id', user.id).maybeSingle();
    if (r.data) _currentProfile = r.data;
    else {
      var fallback = (user.email || 'Usuario').split('@')[0];
      await SB.from('editor_profiles').insert({ user_id: user.id, full_name: fallback, email: user.email, approved: false });
      _currentProfile = { user_id: user.id, full_name: fallback, email: user.email, approved: false };
    }
  } catch(e){
    if (typeof Logger !== 'undefined') Logger.warn('AUTH','load profile failed', {err:e.message});
  }
  /* COMPLIANCE: autenticado != autorizado. Conta pendente é deslogada e avisada;
     não vê NPS/Turmas nem qualquer dado sigiloso. */
  if (_currentProfile && _currentProfile.approved === false){
    try { if (SB) await SB.auth.signOut(); } catch(e){}
    _currentUser = null; _currentProfile = null; authUpdateUI();
    authInfo('Seu acesso ainda está PENDENTE de aprovação por um administrador. Assim que for liberado você poderá entrar.');
    return;
  }
  authUpdateUI();
  if (document.getElementById('page-manual').classList.contains('active')){
    manualBootCloud();
  }
  if (typeof mpceBootIfActive==='function') mpceBootIfActive();
  /* NPS lê do banco e a RLS agora exige sessão — recarrega depois do login. */
  try{ if(typeof window.__npsReboot==='function') window.__npsReboot(); }catch(e){}
  /* Painel ADM só aparece no menu para admin. */
  try{ if(typeof admSyncNav==='function'){ admSyncNav(); if(authIsAdmin()) admLoadUsers().catch(function(){}); } }catch(e){}
  /* Se o usuário parou numa página restrita, leva ele para lá agora. */
  try{ if(window.__gatedPending){ var _g=window.__gatedPending; window.__gatedPending=null; switchPage(_g); } }catch(e){}
}
function authUpdateUI(){
  /* Painel ADM aparece/some conforme o perfil. Roda em login, logout e restore de sessão. */
  try{ if(typeof admSyncNav==='function') admSyncNav(); }catch(e){}
  var chip = document.getElementById('user-chip');
  if (_currentUser && _currentProfile){
    chip.classList.add('show');
    var name = _currentProfile.full_name || _currentUser.email;
    document.getElementById('user-chip-name').textContent = name;
    document.getElementById('user-chip-avatar').textContent = (name || '?').charAt(0).toUpperCase();
  } else {
    chip.classList.remove('show');
  }
}
function authIsLogged(){ return !!_currentUser; }
function authTranslateError(msg){
  var m = (msg || '').toLowerCase();
  if (m.indexOf('invalid login') >= 0)        return 'E-mail ou senha incorretos.';
  if (m.indexOf('email not confirmed') >= 0)  return 'Confirme seu e-mail antes de entrar.';
  if (m.indexOf('user already registered') >= 0) return 'Este e-mail ja tem conta. Use a aba "Entrar".';
  if (m.indexOf('rate limit') >= 0)           return 'Muitas tentativas. Aguarde um minuto.';
  if (m.indexOf('weak password') >= 0)        return 'Senha muito fraca. Use pelo menos 6 caracteres.';
  return msg;
}
async function authRestoreSession(){
  if (!_supabaseReady) return false;
  // Listener: detectar quando o usuario clica no link de recuperacao
  SB.auth.onAuthStateChange(function(event, session){
    if (event === 'PASSWORD_RECOVERY'){
      authPromptNewPassword();
    }
  });
  try {
    var r = await SB.auth.getSession();
    if (r.data && r.data.session && r.data.session.user){
      await authOnLogin(r.data.session.user);
      return true;
    }
  } catch(e){
    if (typeof Logger !== 'undefined') Logger.warn('AUTH','restore failed', {err:e.message});
  }
  return false;
}

async function authPromptNewPassword(){
  var pw1 = prompt('Recuperacao de senha\n\nDigite sua NOVA senha (minimo 6 caracteres):');
  if (pw1 === null) return;
  if (pw1.length < 6){ alert('A senha precisa ter pelo menos 6 caracteres.'); return authPromptNewPassword(); }
  var pw2 = prompt('Confirme a nova senha:');
  if (pw2 === null) return;
  if (pw1 !== pw2){ alert('As senhas nao conferem. Tente novamente.'); return authPromptNewPassword(); }
  try {
    var r = await SB.auth.updateUser({ password: pw1 });
    if (r.error) throw r.error;
    alert('Senha redefinida com sucesso! Voce ja esta logado.');
    if (r.data.user) await authOnLogin(r.data.user);
    // Limpar hash da URL
    history.replaceState(null, '', window.location.pathname);
  } catch(e){
    alert('Erro ao redefinir senha: ' + (e.message || e));
  }
}
var MANUAL_CACHE_KEY = 'pce_manual_v39_cache';
function manualSaveCache(state){ try { localStorage.setItem(MANUAL_CACHE_KEY, JSON.stringify(state)); } catch(e){} }
function manualLoadCache(){
  try {
    var raw = localStorage.getItem(MANUAL_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}
async function manualFetchAllFromCloud(){
  if (!_supabaseReady) throw new Error('Cliente Supabase nao inicializado');
  // Buscar seções E cards em paralelo (só ativos = deleted_at IS NULL)
  var [sectionsRes, cardsRes] = await Promise.all([
    SB.from('manual_sections')
      .select('id, title, icon, card_size, display_order, is_default')
      .is('deleted_at', null)
      .order('display_order', { ascending: true }),
    SB.from('manual_cards')
      .select('id, tag, title, description, days_json, cover_url, section_id, display_order, updated_at, updated_by, updated_by_name')
      .is('deleted_at', null)
      .order('display_order', { ascending: true })
  ]);
  if (sectionsRes.error) throw sectionsRes.error;
  if (cardsRes.error) throw cardsRes.error;
  _manualSections = sectionsRes.data || [];
  var state = {};
  (cardsRes.data || []).forEach(function(row){
    state[row.id] = {
      tag: row.tag,
      title: row.title,
      desc: row.description || '',
      days: row.days_json || [],
      _coverUrl: row.cover_url || '',
      _sectionId: row.section_id || '',
      _displayOrder: row.display_order || 0,
      _updatedAt: row.updated_at,
      _updatedByName: row.updated_by_name || ''
    };
  });
  return state;
}
async function manualUpdateCardCloud(id, payload){
  if (!_supabaseReady) throw new Error('Sem conexao com a nuvem');
  if (!_currentUser)   throw new Error('E preciso estar logado');
  payload.updated_by = _currentUser.id;
  payload.updated_by_name = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
  var r = await SB.from('manual_cards').update(payload).eq('id', id).select().single();
  if (r.error) throw r.error;
  return r.data;
}
async function manualUploadFile(file, pathPrefix){
  if (!_supabaseReady) throw new Error('Sem conexao');
  if (!_currentUser)   throw new Error('E preciso estar logado');
  var ts = Date.now();
  var ext = (file.type || '').indexOf('webp') >= 0 ? 'webp'
          : (file.type || '').indexOf('png')  >= 0 ? 'png'  : 'jpg';
  var path = pathPrefix + '-' + ts + '.' + ext;
  var r = await SB.storage.from('manual-photos').upload(path, file, {
    contentType: file.type || 'image/jpeg',
    cacheControl: '3600',
    upsert: false
  });
  if (r.error) throw r.error;
  var u = SB.storage.from('manual-photos').getPublicUrl(path);
  return u.data.publicUrl;
}
/* Upload de ANEXO (arquivo genérico) para o mesmo bucket manual-photos.
   Preserva extensão e nome original; devolve {url,nome,tipo,tamanho}. Bucket limita 5 MB. */
async function manualUploadAnexo(file, pathPrefix){
  if(!_supabaseReady) throw new Error('Sem conexao');
  if(!_currentUser)   throw new Error('E preciso estar logado');
  if(file.size > 5*1024*1024) throw new Error('Arquivo acima de 5 MB (limite do storage). Comprima ou hospede externamente e use "Definir link".');
  var ts=Date.now();
  var nome=(file.name||('anexo-'+ts)).replace(/[\u0000-\u001f]/g,'').trim();
  var dot=nome.lastIndexOf('.');
  var ext=(dot>0?nome.slice(dot+1):'').toLowerCase().replace(/[^a-z0-9]/g,'') || 'bin';
  var safe=nome.replace(/[^\w.\-]+/g,'_').slice(0,60);
  var path='anexos/'+pathPrefix+'-'+ts+'-'+safe.replace(/\.[^.]*$/,'')+'.'+ext;
  var r=await SB.storage.from('manual-photos').upload(path, file, {contentType:file.type||'application/octet-stream',cacheControl:'3600',upsert:false});
  if(r.error) throw r.error;
  var u=SB.storage.from('manual-photos').getPublicUrl(path);
  return {url:u.data.publicUrl, nome:nome, tipo:file.type||'', tamanho:file.size||0};
}
function dataURLtoFile(dataUrl, filename){
  var arr = dataUrl.split(',');
  var mime = (arr[0].match(/:(.*?);/) || [,'image/jpeg'])[1];
  var bin = atob(arr[1]);
  var n = bin.length;
  var u8 = new Uint8Array(n);
  while (n--) u8[n] = bin.charCodeAt(n);
  return new File([u8], filename, { type: mime });
}


var MANUAL_STORAGE_PREFIX = 'pce_manual_v36_';

// Ordem dos cards no grid
var MANUAL_CARD_ORDER = ['experiencias','jornada','pic','ppe','pcm','pcia','pftv'];

// Conteúdo padrão (vem dos PDFs). É usado como fallback caso não haja nada salvo.
var MANUAL_DEFAULTS = {
  experiencias: {
    tag: 'Manual · Experiências',
    title: 'Experiências do Aluno',
    desc: 'Kit, alimentação e momentos especiais ao longo dos 3 dias',
    days: [
      { label: 'Dia 1', blocks: [
        { icon: '🎒', title: 'Kit do Aluno',
          desc: 'O <strong>Kit do Aluno</strong> deve estar <strong>montado na mesa</strong> antes do início da imersão:',
          items: ['Moleskine','Garrafa de Água <em>(personalizada com cada programa)</em>','Caneta','Carta de boas-vindas','Docinho <em>(Bombom Vitão ou outros)</em>'],
          images: ['assets/img/coffeebreak-01-cf5b9fa2.webp'] },
        { icon: '🍎', title: 'Retorno do Almoço',
          desc: 'Na volta do almoço deve ter na mesa o kit abaixo:',
          items: ['Alimentos: Banana, Maçã ou Barrinha','All Day <em>(todos os dias)</em>'],
          images: ['assets/img/coffeebreak-02-2fa44979.webp'] }
      ]},
      { label: 'Dia 2', blocks: [
        { icon: '🍫', title: 'Início do Dia',
          items: ['Chocolate na bancada na chegada dos alunos <em>(tag adaptada para cada programa)</em>','All Day'],
          images: ['assets/img/coffeebreak-03-26b098c5.webp','assets/img/coffeebreak-02-2fa44979.webp'] },
        { icon: '🌾', title: 'Volta do Almoço',
          items: ['Barra de cereal na bancada na chegada dos alunos','All Day'],
          images: ['assets/img/coffeebreak-04-1f4aba4b.webp'] }
      ]},
      { label: 'Dia 3', blocks: [
        { icon: '🍫', title: 'Início do Dia',
          items: ['Chocolate na bancada na chegada dos alunos <em>(com tag de cada programa)</em>','All Day'],
          images: ['assets/img/coffeebreak-03-26b098c5.webp','assets/img/coffeebreak-02-2fa44979.webp'] },
        { icon: '🥜', title: 'Retorno do Almoço',
          items: ['Nuts ou bebida proteica tipo Yopro','All Day'] },
        { icon: '⚡', title: 'Momento Energia',
          obs: 'Momento Energia deve ser sempre alinhado com o time de eventos e treinador para saber o dia exato que irá acontecer.',
          images: ['assets/img/coffeebreak-05-3822411c.webp'] }
      ]}
    ]
  },

  jornada: {
    tag: 'Manual · Jornada',
    title: 'Jornada do Aluno',
    desc: 'Credenciamento, crachás, plenária, gamificação e operação no evento',
    days: [
      { label: 'Visão Geral', blocks: [
        { icon: '📋', title: 'Atividades e Responsáveis',
          desc: 'Distribuição operacional entre os times envolvidos.',
          table: { head: ['Atividade','Responsável'], rows: [
            ['Listagem dos alunos','Onboarding · Pedagógico'],
            ['Solicitação dos cordões','Time de eventos'],
            ['Organização dos cordões e crachás','Time de eventos'],
            ['Credenciamento e montagem dos crachás','Time de eventos'],
            ['Experiências (água, banana e etc.)','Time de eventos'],
            ['Impressão das etiquetas','CS · Credenciamento'],
            ['Colagem da etiqueta nos crachás','CS · Credenciamento']
          ]}}
      ]},
      { label: 'Credenciamento', blocks: [
        { icon: '🎫', title: 'Check-in',
          desc: 'Uma semana antes da <strong>noite de networking</strong>, o time de CS precisa enviar ao time de TI a <strong>lista de credenciamento</strong>.<br><br>A lista precisa estar no formato padrão que está nesse card — você pode baixar a planilha base abaixo.<br><a href="#" onclick="baixarTemplateCredenciamento();return false;" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:7px 14px;background:var(--green);color:#1a1a18;font-weight:800;font-size:11px;letter-spacing:.06em;text-transform:uppercase;border-radius:7px;text-decoration:none;cursor:pointer">📥 Baixar planilha base</a><br><br><strong>Obs:</strong> precisam estar nessa lista todos os alunos que confirmaram presença no evento.<br><br>O credenciamento é o momento em que o aluno realiza o <strong>check-in via SGE</strong> quando chega. Em seguida, recebe o crachá e o prisma de mesa, ficando livre para explorar o hall dos alunos e registrar esse momento com uma foto profissional tirada pelo fotógrafo oficial.',
          obs: 'É fundamental que os times de CS e Comercial estejam presentes nesse momento para oferecer suporte completo, garantindo que todas as situações sejam acompanhadas e resolvidas de forma ágil e eficiente.' },
        { icon: '🪪', title: 'Crachás',
          desc: 'Os crachás de <strong>Staff</strong> serão destinados aos Monitores que estiverem atuando no evento. Devem conter a inscrição "STAFF" e utilizar um <strong>cordão vermelho</strong>, fornecido pelo time de eventos.' }
      ]},
      { label: 'Plenária', blocks: [
        { icon: '🎤', title: 'Estrutura',
          desc: 'Toda a estrutura prevista para a plenária deve estar montada antes do início da imersão, incluindo os kits e materiais na mesa do mentorado.' },
        { icon: '🎒', title: 'Kit do Aluno',
          desc: 'O Kit do Aluno deve estar montado na mesa antes do início da imersão:',
          items: ['Moleskine','Garrafa de Água <em>(personalizada com cada programa)</em>','Caneta','Carta de boas-vindas','Docinho <em>(Bombom Vitão ou outros)</em>'] },
        { icon: '📋', title: 'Montagem do Kit',
          table: { head: ['Atividade','Responsável'], rows: [
            ['Montagem do kit nas mesas','Time de eventos'],
            ['Solicitação dos itens do kit','Time de eventos'],
            ['Higienização das garrafas','Time de eventos'],
            ['Solicitação dos doces / permuta','Time de eventos']
          ]}},
        { icon: '🪑', title: 'Mobiliário e Bistrôs',
          table: { head: ['Atividade','Responsável'], rows: [
            ['Kits e materiais na mesa dos alunos','Time de eventos'],
            ['Mobiliário (mesa, cadeira, bistrô, sofás)','Time de eventos'],
            ['Bistrô do Palco (livro TCB, Livrão do PCE, Apostila PCE, caderno de Capa Preta, água e taça, ferramentas do dia)','Time de eventos'],
            ['Bistrô Dinâmica de vendas (buzina, sino, megafone), caso tenha','Time de eventos']
          ]}}
      ]},
      { label: 'Experiências e Operação', blocks: [
        { icon: '🎮', title: 'Gamificação',
          desc: 'Avaliar na introdução de cada programa qual a gamificação ou atividades cada programa irá realizar para preparar todos os materiais necessários.' },
        { icon: '⚡', title: 'Momento Energia',
          desc: 'O Momento Energia acontece de acordo com o cronograma estabelecido, com a distribuição de energéticos para os mentorados na plenária. A entrega é realizada pelos monitores.',
          obs: 'Para garantir o fornecimento, o Coordenador do Produto deve verificar antecipadamente a parceria com o fornecedor "Baly". Caso a parceria não seja confirmada, a responsabilidade pela compra dos energéticos fica a cargo do time de eventos.',
          table: { head: ['Atividade','Responsável'], rows: [
            ['Solicitação dos energéticos para o fornecedor','Time de eventos'],
            ['Entrega dos energéticos','Time de eventos']
          ]}},
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist para conferência de todas as entregas operacionais do programa.' }
      ]}
    ]
  },

  pic: {
    tag: 'Manual · Programa',
    title: 'PIC — Inteligência Comercial',
    desc: 'Imersão de 3 dias conduzida por Ramon Pessoa',
    days: [
      { label: 'Sobre o Programa', blocks: [
        { icon: '📚', title: 'O que é',
          desc: 'O <strong>PIC</strong> é uma imersão de <strong>3 dias</strong> desenvolvida para padronizar e escalar a operação de vendas da sua empresa. O objetivo é substituir o esforço intuitivo por uma metodologia baseada em <strong>dados, processos e indicadores de performance</strong>. O foco é a implementação imediata: com ferramentas práticas, o aluno irá aprender a monitorar métricas que de fato impactam o caixa e a estruturar processos que garantam que cada oportunidade de negócio seja aproveitada ao máximo.' },
        { icon: '🎤', title: 'Quem conduz',
          desc: '<strong>Ramon Pessoa</strong>, especialista em inteligência comercial e planejamento estratégico, impactou mais de <strong>1.500 empresas</strong> e <strong>20 mil alunos</strong> através de suas imersões e programas de mentoria, em mais de 16 anos de experiência em mentoria e desenvolvimento de negócios.' }
      ]},
      { label: 'Operação', blocks: [
        { icon: '🎯', title: 'Entregáveis',
          items: ['Gamificação','Cards do jogo CIS Assessment <em>(avaliar se teremos novamente nesse treinamento ou se fica apenas no PFTV)</em>'] },
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist | Prog. Inteligência Comercial (Ramon Pessoa) — <strong>11 a 13/03/2026</strong>' },
        { icon: '📅', title: 'Cronograma',
          desc: 'Febracis · CRONOGRAMA PIC <em>[Proposta com experiências].xlsx</em>' }
      ]}
    ]
  },

  ppe: {
    tag: 'Manual · Programa',
    title: 'PPE — Planejamento Estratégico',
    desc: 'Imersão de 4 dias conduzida por Tiago Zanini',
    days: [
      { label: 'Sobre o Programa', blocks: [
        { icon: '📚', title: 'O que é',
          desc: 'O <strong>PPE</strong> é uma imersão de <strong>4 dias</strong> desenvolvida para ajudar empresas e negócios a crescerem e se perpetuarem com resultados melhores e maiores. É alicerçado em conceitos para elaboração e execução do planejamento, ferramentas lógicas e comportamentais, fazendo uso da razão e da emoção de maneira integrada, e estratégias concretas e práticas.' },
        { icon: '🎤', title: 'Quem conduz',
          desc: '<strong>Tiago Zanini</strong>, especialista em Planejamento Estratégico, criador do método <em>Planejamento Estratégico na Prática</em>, Treinador, Master Coach e Mentor do Programa de Crescimento Empresarial — PCE.' }
      ]},
      { label: 'Operação', blocks: [
        { icon: '🎯', title: 'Entregáveis',
          items: ['Entrega de Agenda Programada'] },
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist | Evento Programa de Planejamento Estratégico — <strong>12 a 15/01/2026</strong>' },
        { icon: '📅', title: 'Cronograma',
          desc: 'Janeiro 2026 · CRONOGRAMA PROGRAMA DE PLANEJAMENTO ESTRATÉGICO' }
      ]}
    ]
  },

  pcm: {
    tag: 'Manual · Programa',
    title: 'PCM — Crescimento em Marketing',
    desc: 'Marketing digital com IA, conduzido por Rafael Galdino',
    days: [
      { label: 'Sobre o Programa', blocks: [
        { icon: '📚', title: 'O que é',
          desc: 'O <strong>Programa de Crescimento em Marketing Digital com IA</strong> foi criado para desenvolver a mentalidade de <strong>Growth</strong> nas principais estratégias da empresa. Mais do que técnicas, apresenta o marketing como uma filosofia que orienta decisões, inovação e geração de valor. Essa abordagem conecta marcas às pessoas e transforma desafios em oportunidades reais de crescimento.',
          obs: 'O foco é explorar processos e ferramentas capazes de impulsionar vendas e fortalecer a gestão comercial e a experiência do cliente. Um convite para expandir a visão, evoluir estratégias e construir vantagem competitiva sustentável no novo cenário de negócios.' },
        { icon: '🎤', title: 'Quem conduz',
          desc: '<strong>Rafael Galdino</strong> é estrategista de marketing e empreendedor com mais de <strong>15 anos</strong> na vanguarda do mercado digital. Seus projetos já geraram mais de <strong>R$ 250 milhões</strong> em vendas, <strong>1,5 milhão de alunos</strong> e impactaram mais de <strong>500 mil pessoas</strong> em eventos presenciais. Também criou mais de 10 ecossistemas de educação, atuou em mais de 34 países e liderou mais de R$ 50 milhões em investimentos em anúncios.' }
      ]},
      { label: 'Operação', blocks: [
        { icon: '🎯', title: 'Entregáveis',
          items: ['Livrão Programa de Crescimento em Marketing <em>(não foi entregue no último, mas Galdino solicitou para os próximos)</em>'] },
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist | Programa PCM — <strong>21 a 23/01/2026</strong>' }
      ]}
    ]
  },

  pcia: {
    tag: 'Manual · Programa',
    title: 'PCIA — Inteligência Artificial',
    desc: 'Crescimento com IA, conduzido por Vinicius David',
    days: [
      { label: 'Sobre o Programa', blocks: [
        { icon: '📚', title: 'O que é',
          desc: 'O <strong>Programa de Crescimento com Inteligência Artificial</strong> foi desenvolvido para transformar negócios com <strong>mais receita, menos custos e maior produtividade</strong>. A proposta é simples: aplicar IA de forma prática para automatizar processos, otimizar recursos e acelerar resultados reais. Em poucos dias intensivos, a operação passa a utilizar ferramentas acessíveis de IA para ampliar o faturamento sem aumentar equipe ou esforço.',
          obs: 'A jornada percorre fundamentos estratégicos, diagnóstico de oportunidades e criação rápida de soluções no-code como automações e dashboards. Um plano estruturado de execução e escala impulsiona a produtividade e posiciona a empresa para crescer de forma exponencial.' },
        { icon: '🎤', title: 'Quem conduz',
          desc: '<strong>Vinicius David</strong> é especialista em Inteligência Artificial, formado em IA pela <strong>Universidade de Stanford</strong> (Califórnia) e com mais de <strong>8 anos</strong> de atuação na área. É conselheiro da Febracis, escritor best-seller, investidor e CEO da <strong>Ugrow AI</strong>. Ao longo da carreira, participou da criação de negócios que já ultrapassaram <strong>US$ 1 bilhão</strong> impulsionados por IA.' }
      ]},
      { label: 'Operação', blocks: [
        { icon: '🎯', title: 'Entregáveis',
          items: ['Entrega do livro <em>IA para Líderes</em>, do Vinicius David'] },
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist | PCIA — <strong>28 a 30/01/2026</strong>' }
      ]}
    ]
  },

  pftv: {
    tag: 'Manual · Programa',
    title: 'PFTV — Formação de Time de Vendas',
    desc: 'Cultura de alta performance, conduzido por Daniele Pires',
    days: [
      { label: 'Sobre o Programa', blocks: [
        { icon: '📚', title: 'O que é',
          desc: 'O <strong>Programa de Formação do Time de Vendas</strong> foi criado para muito além de ensinar técnicas e estratégias comerciais. Tem como objetivo implantar uma <strong>cultura de alta performance</strong>, desenvolvendo líderes capazes de recrutar, formar, inspirar e movimentar equipes orientadas a resultados.',
          obs: 'Ao longo da jornada são trabalhados princípios que fortalecem mentalidade, disciplina de execução e alinhamento estratégico do time de vendas. Mais do que um treinamento, é um processo de transformação que impacta diretamente a empresa, a equipe e o faturamento. Ideal para alinhar propósito, metas e ações para construir um time comercial forte, engajado e preparado para gerar crescimento consistente e impacto real nos resultados do negócio.' },
        { icon: '🎤', title: 'Quem conduz',
          desc: '<strong>Daniele Pires</strong> é treinadora e master coach da Febracis, especializada em ajudar homens e mulheres a conquistarem sucesso na vida pessoal e afetiva por meio de estratégias comportamentais. Reconhecida como <strong>estrategista comportamental</strong>, dedica-se a formar empresários preparados para dominar a mesa de negociação e tomar decisões com inteligência emocional. Já impactou mais de <strong>68 mil pessoas</strong> com seus treinamentos e mentorias.' }
      ]},
      { label: 'Operação', blocks: [
        { icon: '🎯', title: 'Entregáveis',
          items: ['Gamificação','Cards de Jogo CIS Assessment','Livrão (Programa de Formação de Times de Vendas)'] },
        { icon: '✅', title: 'Checklist Base',
          desc: 'MODELO · Checklist | PFTV — 3ª Edição' },
        { icon: '📅', title: 'Cronograma',
          desc: 'CRONOGRAMA PFTV · 3ª EDIÇÃO (real com mudanças durante treinamento)' }
      ]}
    ]
  }
};

// Estado em memória
var _manualState = {};
var _manualCurrentCard = null;
var _manualEditing = false;
var _manualUploadTarget = null;

// ── PERSISTÊNCIA EM LOCALSTORAGE ──────────────────────────────
function manualLoadCard(id){
  try {
    var raw = localStorage.getItem(MANUAL_STORAGE_PREFIX + id);
    if (raw) return JSON.parse(raw);
  } catch(e){ Logger.warn('MANUAL','loadCard fail',{id:id,err:e.message}); }
  return JSON.parse(JSON.stringify(MANUAL_DEFAULTS[id]));
}
function manualSaveCardData(id, data){
  try {
    localStorage.setItem(MANUAL_STORAGE_PREFIX + id, JSON.stringify(data));
    return true;
  } catch(e){
    Logger.error('MANUAL','saveCard fail',{id:id,err:e.message});
    alert('Não foi possível salvar (cota local cheia ou erro).');
    return false;
  }
}
function manualLoadCover(id){
  try { return localStorage.getItem(MANUAL_STORAGE_PREFIX + id + '_cover') || ''; }
  catch(e){ return ''; }
}
function manualSaveCoverData(id, dataUrl){
  try {
    localStorage.setItem(MANUAL_STORAGE_PREFIX + id + '_cover', dataUrl);
    return true;
  } catch(e){
    Logger.error('MANUAL','saveCover fail',{id:id,err:e.message});
    alert('Imagem muito grande. Tente uma menor (máx ~2MB).');
    return false;
  }
}

function manualInit(){
  var cache = manualLoadCache();
  if (cache){
    _manualState = cache;
  } else {
    MANUAL_CARD_ORDER.forEach(function(id){
      _manualState[id] = JSON.parse(JSON.stringify(MANUAL_DEFAULTS[id]));
    });
  }
}
function manualShowLocked(){
  document.getElementById('manual-locked').style.display = 'flex';
  document.getElementById('manual-loading').style.display = 'none';
  document.getElementById('manual-cards-view').style.display = 'none';
  document.getElementById('manual-cloud-banner').classList.remove('show');
}
function manualShowLoading(){
  document.getElementById('manual-locked').style.display = 'none';
  document.getElementById('manual-loading').style.display = 'block';
  document.getElementById('manual-cards-view').style.display = 'none';
}
function manualShowCards(){
  document.getElementById('manual-locked').style.display = 'none';
  document.getElementById('manual-loading').style.display = 'none';
  document.getElementById('manual-cards-view').style.display = '';
}
async function manualBootCloud(){
  if (!authIsLogged()){ manualShowLocked(); return; }
  manualShowLoading();
  try {
    var state = await manualFetchAllFromCloud();
    _manualState = state;
    manualSaveCache(state);
    document.getElementById('manual-cloud-banner').classList.remove('show');
    manualRenderGrid();
    manualShowCards();
  } catch(e){
    if (typeof Logger !== 'undefined') Logger.error('MANUAL','fetch cloud',{err:e.message});
    var cache = manualLoadCache();
    if (cache){
      _manualState = cache;
      document.getElementById('manual-cloud-banner').classList.add('show');
      manualRenderGrid();
      manualShowCards();
      manualToast('Modo offline: usando cache local');
    } else {
      MANUAL_CARD_ORDER.forEach(function(id){
        _manualState[id] = JSON.parse(JSON.stringify(MANUAL_DEFAULTS[id]));
      });
      document.getElementById('manual-cloud-banner').classList.add('show');
      manualRenderGrid();
      manualShowCards();
    }
  }
}

// ── ESCAPE / UTIL ─────────────────────────────────────────────
function manualEscape(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function manualToast(msg){
  var t = document.getElementById('manual-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(manualToast._t);
  manualToast._t = setTimeout(function(){ t.classList.remove('show'); }, 1800);
}

// ── RENDER GRID ───────────────────────────────────────────────
function manualFormatMeta(data){
  var meta = '';
  if (data._updatedAt){
    var d = new Date(data._updatedAt);
    var dd = String(d.getDate()).padStart(2,'0');
    var mm = String(d.getMonth()+1).padStart(2,'0');
    var hh = String(d.getHours()).padStart(2,'0');
    var mi = String(d.getMinutes()).padStart(2,'0');
    meta = 'Atualizado em ' + dd + '/' + mm + ' as ' + hh + ':' + mi;
    if (data._updatedByName) meta += ' por ' + data._updatedByName;
  }
  return meta;
}
function manualRenderGrid(){
  var host = document.getElementById('manual-sections-host');
  if (!host) return;
  host.innerHTML = '';

  // Toolbar admin
  var toolbar = document.getElementById('admin-toolbar');
  var btnAddSec = document.getElementById('btn-add-section');
  if (toolbar) toolbar.classList.toggle('show', authIsAdmin());
  if (btnAddSec) btnAddSec.style.display = authIsAdmin() ? '' : 'none';

  // Atualizar contador da lixeira (assíncrono, não bloqueia)
  manualUpdateTrashCount();

  // Agrupar cards por section_id
  var cardsBySection = {};
  Object.keys(_manualState).forEach(function(id){
    var c = _manualState[id];
    var sid = c._sectionId || '';
    if (!cardsBySection[sid]) cardsBySection[sid] = [];
    cardsBySection[sid].push({ id: id, data: c });
  });
  // Ordenar cada grupo por display_order
  Object.keys(cardsBySection).forEach(function(sid){
    cardsBySection[sid].sort(function(a, b){ return (a.data._displayOrder || 0) - (b.data._displayOrder || 0); });
  });

  // Renderizar cada seção
  _manualSections.forEach(function(section){
    var secEl = document.createElement('div');
    secEl.className = 'manual-section';
    secEl.dataset.sectionId = section.id;
    var cards = cardsBySection[section.id] || [];
    var sizeClass = (section.card_size === 'large') ? 'manual-grid-gxp' : 'manual-grid-experts';

    var actionsHtml = '';
    if (authIsAdmin()){
      actionsHtml = '<div class="section-actions">'+
        '<button class="sa-btn" onclick="manualPromptEditSection(\''+section.id+'\')" title="Editar seção">✏️</button>'+
        (!section.is_default ? '<button class="sa-btn danger" onclick="manualDeleteSection(\''+section.id+'\')" title="Excluir seção">🗑</button>' : '')+
      '</div>';
    }

    var grabHandle = authIsAdmin() ? '<span class="section-grab-handle" title="Arraste para reordenar">⋮⋮</span>' : '';

    secEl.innerHTML =
      '<div class="manual-section-header">'+
        grabHandle +
        '<div class="manual-section-icon">'+manualEscape(section.icon || '📋')+'</div>'+
        '<h3 class="manual-section-title">'+manualEscape(section.title)+'</h3>'+
        '<div class="manual-section-line"></div>'+
        '<span class="manual-section-count">'+cards.length+' '+(cards.length===1?'card':'cards')+'</span>'+
        actionsHtml +
      '</div>'+
      '<div class="'+sizeClass+'" data-section-grid data-section="'+section.id+'" id="grid-'+section.id+'"></div>';
    host.appendChild(secEl);

    var gridEl = secEl.querySelector('[data-section-grid]');
    cards.forEach(function(item){
      var cardEl = manualBuildCardElement(item.id, item.data);
      gridEl.appendChild(cardEl);
    });

    // Botão "+ Adicionar card" no final do grid
    if (authIsAdmin()){
      var addBtn = document.createElement('button');
      addBtn.className = 'add-card-btn';
      addBtn.innerHTML = '<span class="ac-icon">+</span><span>Adicionar card</span>';
      addBtn.onclick = function(){ manualPromptCreateCard(section.id); };
      gridEl.appendChild(addBtn);
    }
  });

  // Init drag-and-drop
  setTimeout(manualInitSortables, 50);
}

function manualBuildCardElement(id, data){
  var cover = data._coverUrl || '';
  var sectionsCount = (data.days || []).length;
  var meta = manualFormatMeta(data);
  var card = document.createElement('div');
  card.className = 'mcard' + (authIsAdmin() ? ' draggable' : '');
  card.dataset.cardId = id;

  var coverInner = cover
    ? '<img src="'+cover+'" alt="" loading="lazy">'
    : '<div class="mcard-cover-placeholder" id="mcard-cover-'+id+'">'+
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--green)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>'+
      '</div>';

  var coverBtn = authIsAdmin() ? '<button class="mcard-cover-upload" data-action="upload-cover" data-id="'+id+'">📷 '+(cover?'Trocar':'Adicionar')+' foto</button>' : '';
  var renameBtn = authIsAdmin() ? '<button class="mcard-rename-btn" data-action="rename" data-id="'+id+'">✏️ Renomear card</button>' : '';

  card.innerHTML =
    '<div class="mcard-cover-wrap">'+
      coverInner +
      coverBtn +
    '</div>'+
    '<div class="mcard-body">'+
      '<div class="mcard-tag">'+manualEscape(data.tag || 'Manual')+'</div>'+
      '<div class="mcard-title">'+manualEscape(data.title)+'</div>'+
      '<div class="mcard-desc">'+manualEscape(data.desc || '')+'</div>'+
      (meta ? '<div class="mcard-meta">'+manualEscape(meta)+'</div>' : '')+
      renameBtn +
    '</div>'+
    '<div class="mcard-footer">'+
      '<span class="mcard-count">'+sectionsCount+' '+(sectionsCount===1?'seção':'seções')+'</span>'+
      '<div class="mcard-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg></div>'+
    '</div>';

  card.addEventListener('click', function(e){
    var act = e.target.closest('[data-action]');
    if (act){
      e.stopPropagation();
      var a = act.dataset.action;
      var cid = act.dataset.id;
      if (a === 'upload-cover'){ manualUploadCover(cid); return; }
      if (a === 'rename'){ manualRenameCard(cid); return; }
    }
    manualOpen(id);
  });
  return card;
}

async function manualUpdateTrashCount(){
  if (!authIsAdmin() || !_supabaseReady) return;
  try {
    var [cards, sections] = await Promise.all([
      SB.from('manual_cards').select('id', {count:'exact', head:true}).not('deleted_at','is',null),
      SB.from('manual_sections').select('id', {count:'exact', head:true}).not('deleted_at','is',null)
    ]);
    var n = (cards.count || 0) + (sections.count || 0);
    var el = document.getElementById('trash-count-inline');
    if (el) el.textContent = '(' + n + ')';
  } catch(e){}
}

async function manualRenameCard(id){
  if (!authIsAdmin()){ alert('Apenas administradores podem renomear.'); return; }
  var data = _manualState[id];
  var novo = prompt('Novo nome para este card:', data.title);
  if (novo === null) return;
  novo = novo.trim();
  if (!novo || novo === data.title) return;
  try {
    var row = await manualUpdateCardCloud(id, { title: novo });
    data.title = row.title;
    data._updatedAt = row.updated_at;
    data._updatedByName = row.updated_by_name;
    manualSaveCache(_manualState);
    manualRenderGrid();
    manualToast('Nome atualizado');
  } catch(e){
    alert('Erro ao salvar: ' + (e.message || e));
  }
}

async function manualUploadCover(id){
  if (!authIsAdmin()){ alert('Apenas administradores podem trocar fotos.'); return; }
  _manualUploadTarget = id;
  var inp = document.getElementById('manual-img-input');
  inp.onchange = async function(){
    var file = inp.files[0];
    if (!file){ inp.value=''; return; }
    if (file.size > 8 * 1024 * 1024){
      alert('Imagem muito grande (max 8 MB). Escolha uma menor.');
      inp.value=''; _manualUploadTarget = null; return;
    }
    var targetId = _manualUploadTarget;
    manualToast('Comprimindo foto...');
    try {
      var dataUrl = await manualCompressImage(file, 800, 0.78);
      var fileToUpload = dataURLtoFile(dataUrl, 'cover.webp');
      manualToast('Enviando para a nuvem...');
      var publicUrl = await manualUploadFile(fileToUpload, 'covers/' + targetId);
      await manualUpdateCardCloud(targetId, { cover_url: publicUrl });
      _manualState[targetId]._coverUrl = publicUrl;
      _manualState[targetId]._updatedAt = new Date().toISOString();
      _manualState[targetId]._updatedByName = (_currentProfile && _currentProfile.full_name) || _currentUser.email;
      manualSaveCache(_manualState);
      manualRenderGrid();
      if (_manualCurrentCard === targetId){
        manualUpdateModalHero(targetId);
      }
      manualToast('Foto atualizada');
    } catch(e){
      alert('Erro ao salvar foto: ' + (e.message || e));
      if (typeof Logger !== 'undefined') Logger.error('MANUAL','upload cover', {err:e.message});
    }
    _manualUploadTarget = null;
    inp.value = '';
  };
  inp.click();
}
function manualUploadModal(){
  if (_manualCurrentCard) manualUploadCover(_manualCurrentCard);
}
function manualUpdateModalHero(id){
  var hero = document.getElementById('manual-modal-hero');
  var ph   = document.getElementById('manual-modal-hero-placeholder');
  if (!hero || !ph) return;
  var oldImg = hero.querySelector('img.modal-hero-img');
  if (oldImg) oldImg.remove();
  var cover = (_manualState[id] && _manualState[id]._coverUrl) || '';
  if (cover){
    var img = document.createElement('img');
    img.src = cover;
    img.className = 'modal-hero-img';
    ph.style.display = 'none';
    hero.insertBefore(img, hero.firstChild);
  } else {
    ph.style.display = 'flex';
  }
}

// ── ABRIR / FECHAR MODAL ──────────────────────────────────────
function manualOpen(id){
  _manualCurrentCard = id;
  _manualEditing = false;
  manualRenderModal();
  document.getElementById('manual-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function manualClose(e){
  if (e && e.target && e.target.id !== 'manual-modal-overlay') {
    // Clicou em algo diferente do overlay: ignora a menos que seja o botão close (que não passa target)
    if (e.target.tagName) return;
  }
  if (_manualEditing){
    if (!confirm('Você está em modo edição. Sair sem salvar?')) return;
  }
  document.getElementById('manual-modal-overlay').classList.remove('open');
  document.getElementById('manual-modal').classList.remove('editing-mode');
  document.body.style.overflow = '';
  _manualCurrentCard = null;
  _manualEditing = false;
}

// ── RENDER MODAL ──────────────────────────────────────────────
function manualRenderModal(){
  var id = _manualCurrentCard;
  if (!id) return;
  var data = _manualState[id];

  manualUpdateModalHero(id);

  document.getElementById('manual-modal-tag').textContent = data.tag || 'Manual';
  document.getElementById('manual-modal-title').textContent = data.title;

  manualRenderContent(data);

  var modal = document.getElementById('manual-modal');
  modal.classList.toggle('editing-mode', _manualEditing);

  var isAdmin = authIsAdmin();
  document.getElementById('manual-btn-edit').style.display   = (isAdmin && !_manualEditing) ? '' : 'none';
  document.getElementById('manual-btn-save').style.display   = (isAdmin && _manualEditing) ? '' : 'none';
  document.getElementById('manual-btn-cancel').style.display = (isAdmin && _manualEditing) ? '' : 'none';
  var btnDel = document.getElementById('manual-btn-delete');
  if (btnDel) btnDel.style.display = (isAdmin && !_manualEditing) ? '' : 'none';
  // Esconder também o botão de upload no hero pra não-admin
  var btnUp = document.getElementById('manual-modal-upload-btn');
  if (btnUp) btnUp.style.display = isAdmin ? '' : 'none';

  manualApplyEditableState();
}

function manualRenderContent(data){
  var root = document.getElementById('manual-modal-content');
  root.innerHTML = '';
  (data.days || []).forEach(function(day, di){
    var dayEl = document.createElement('div');
    dayEl.className = 'ms-day';
    dayEl.dataset.di = di;
    var dayHtml = '<span class="ms-day-badge">'+manualEscape(day.label)+'</span>'+
      '<div class="ms-day-controls">'+
        '<button class="ms-ctrl-btn danger" data-action="del-day" data-di="'+di+'">🗑 Remover seção</button>'+
      '</div>';
    dayEl.innerHTML = dayHtml;
    (day.blocks || []).forEach(function(block, bi){
      dayEl.appendChild(manualRenderBlock(block, di, bi));
    });
    var addBtn = document.createElement('button');
    addBtn.className = 'ms-add-block';
    addBtn.textContent = '+ Adicionar bloco';
    addBtn.dataset.action = 'add-block';
    addBtn.dataset.di = di;
    dayEl.appendChild(addBtn);
    root.appendChild(dayEl);
  });
}

function manualCleanRich(html){
  var s = String(html == null ? '' : html);
  s = s.replace(/<\/(div|p)>/gi, '<br>')
       .replace(/<(div|p)\b[^>]*>/gi, '')
       .replace(/<br\s*\/?>/gi, '<br>')
       .replace(/(?:<br>\s*){3,}/gi, '<br><br>')
       .replace(/^(?:\s|<br>)+/i, '')
       .replace(/(?:\s|<br>)+$/i, '');
  return s;
}
function manualRenderBlock(block, di, bi){
  var el = document.createElement('div');
  el.className = 'ms-block';
  el.dataset.di = di;
  el.dataset.bi = bi;

  var html = '<div class="ms-section">'+
    '<div class="ms-icon">'+manualEscape(block.icon || '📌')+'</div>'+
    '<div class="ms-body">'+
    '<div class="ms-title">'+manualEscape(block.title || '')+'</div>';

  if (block.desc !== undefined){
    html += '<p class="ms-desc">'+(block.desc || '')+'</p>';
  }
  if (Array.isArray(block.items) && block.items.length){
    html += '<div class="ms-items">';
    block.items.forEach(function(it, ii){
      html += '<div class="ms-item" data-ii="'+ii+'">'+
        '<span class="ms-dot"></span>'+
        '<div class="ms-item-text">'+it+'</div>'+
        '<button class="ms-item-del" data-action="del-item" data-ii="'+ii+'">×</button>'+
      '</div>';
    });
    html += '</div>';
    html += '<button class="ms-item-add" data-action="add-item">+ Adicionar item</button>';
  }
  if (block.obs){
    html += '<div class="ms-obs"><div>'+(block.obs || '')+'</div></div>';
  }
  if (block.table && block.table.head && block.table.rows){
    html += '<table class="ms-table"><thead><tr>';
    block.table.head.forEach(function(h){ html += '<th>'+manualEscape(h)+'</th>'; });
    html += '</tr></thead><tbody>';
    block.table.rows.forEach(function(row, ri){
      html += '<tr data-ri="'+ri+'">';
      row.forEach(function(c, ci){ html += '<td data-ci="'+ci+'">'+manualEscape(c)+'</td>'; });
      html += '</tr>';
    });
    html += '</tbody></table>';
  }
  if (Array.isArray(block.images) && block.images.length){
    html += '<div class="ms-img-row">';
    block.images.forEach(function(src, ii){
      html += '<div class="ms-img-col" data-ii="'+ii+'">'+
        '<img src="'+src+'" alt="" loading="lazy" decoding="async">'+
        '<button class="ms-img-del" data-action="del-image" data-ii="'+ii+'" title="Remover foto">×</button>'+
      '</div>';
    });
    html += '</div>';
  }
  html += '<button class="ms-img-add" data-action="add-photo">📷 Adicionar foto neste bloco</button>';
  html += '</div></div>';

  html += '<div class="ms-block-controls">'+
    '<button class="ms-ctrl-btn" data-action="add-items">+ Lista de itens</button>'+
    '<button class="ms-ctrl-btn" data-action="add-obs">+ Observação</button>'+
    '<button class="ms-ctrl-btn danger" data-action="del-block">🗑 Remover bloco</button>'+
  '</div>';

  el.innerHTML = html;
  return el;
}

// ── EDITABLE STATE ────────────────────────────────────────────
function manualApplyEditableState(){
  var modal = document.getElementById('manual-modal');
  if (!modal) return;
  modal.classList.toggle('editing-mode', _manualEditing);

  // Toggle .editing nos blocos (controla visibilidade dos botões + e ×)
  modal.querySelectorAll('.ms-block').forEach(function(b){
    b.classList.toggle('editing', _manualEditing);
  });

  // Aplica/remove contenteditable em todos os elementos editáveis
  var sels = [
    '.manual-modal-tag','.manual-modal-title',
    '.ms-day-badge','.ms-icon','.ms-title','.ms-desc','.ms-item-text','.ms-table td'
  ];
  sels.forEach(function(sel){
    modal.querySelectorAll(sel).forEach(function(el){
      if (_manualEditing) {
        el.setAttribute('contenteditable','true');
        el.setAttribute('spellcheck','false');
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
      }
    });
  });
  // ms-obs tem div interno que é o editável
  modal.querySelectorAll('.ms-obs > div').forEach(function(el){
    if (_manualEditing) { el.setAttribute('contenteditable','true'); el.setAttribute('spellcheck','false'); }
    else { el.removeAttribute('contenteditable'); el.removeAttribute('spellcheck'); }
  });
}

// ── ENTRAR/SAIR EDIÇÃO ────────────────────────────────────────
function manualEditMode(){
  if (!authIsAdmin()){ alert('Apenas administradores podem editar.'); return; }
  _manualEditing = true;
  manualRenderModal();
}
function manualCancelEdits(){
  if (!confirm('Descartar alterações?')) return;
  _manualState[_manualCurrentCard] = manualLoadCard(_manualCurrentCard);
  _manualEditing = false;
  manualRenderModal();
}
async function manualSaveEdits(){
  if (!authIsLogged()){ alert('Faca login primeiro.'); return; }
  var id = _manualCurrentCard;
  var data = _manualState[id];
  data.tag = document.getElementById('manual-modal-tag').textContent.trim() || 'Manual';
  data.title = document.getElementById('manual-modal-title').textContent.trim() || data.title;
  document.querySelectorAll('#manual-modal-content > .ms-day').forEach(function(dayEl){
    var di = +dayEl.dataset.di;
    var day = data.days[di]; if (!day) return;
    var badgeEl = dayEl.querySelector(':scope > .ms-day-badge');
    if (badgeEl) day.label = badgeEl.textContent.trim();
    dayEl.querySelectorAll(':scope > .ms-block').forEach(function(blockEl){
      var bi = +blockEl.dataset.bi;
      var b = day.blocks[bi]; if (!b) return;
      var iconEl = blockEl.querySelector('.ms-icon');
      var titleEl = blockEl.querySelector('.ms-title');
      var descEl = blockEl.querySelector('.ms-desc');
      var obsEl = blockEl.querySelector('.ms-obs > div');
      if (iconEl) b.icon = iconEl.textContent.trim();
      if (titleEl) b.title = titleEl.textContent.trim();
      if (descEl) b.desc = manualCleanRich(descEl.innerHTML);
      if (obsEl) b.obs = manualCleanRich(obsEl.innerHTML);
      var itemEls = blockEl.querySelectorAll('.ms-items .ms-item');
      if (itemEls.length){
        b.items = Array.prototype.slice.call(itemEls).map(function(ie){
          var t = ie.querySelector('.ms-item-text');
          return t ? manualCleanRich(t.innerHTML) : '';
        }).filter(function(x){ return !!x; });
      }
      var tbl = blockEl.querySelector('.ms-table');
      if (tbl && b.table){
        b.table.head = Array.prototype.slice.call(tbl.querySelectorAll('thead th')).map(function(h){ return h.textContent.trim(); });
        b.table.rows = Array.prototype.slice.call(tbl.querySelectorAll('tbody tr')).map(function(tr){
          return Array.prototype.slice.call(tr.querySelectorAll('td')).map(function(td){ return td.textContent.trim(); });
        });
      }
    });
  });
  var saveBtn = document.getElementById('manual-btn-save');
  if (saveBtn){ saveBtn.disabled = true; saveBtn.innerHTML = '<span style="font-size:14px">⏳</span> Salvando...'; }
  try {
    var row = await manualUpdateCardCloud(id, {
      tag: data.tag,
      title: data.title,
      description: data.desc || '',
      days_json: data.days || []
    });
    data._updatedAt = row.updated_at;
    data._updatedByName = row.updated_by_name;
    manualSaveCache(_manualState);
    _manualEditing = false;
    manualRenderModal();
    manualRenderGrid();
    manualToast('Conteudo salvo na nuvem');
  } catch(e){
    alert('Erro ao salvar: ' + (e.message || e));
    if (typeof Logger !== 'undefined') Logger.error('MANUAL','save', {err:e.message});
  } finally {
    if (saveBtn){ saveBtn.disabled = false; saveBtn.innerHTML = '<span style="font-size:14px">💾</span> Salvar conteúdo'; }
  }
}


// ── COMPRIMIR IMAGEM CLIENT-SIDE (canvas) ─────────────────────
function manualCompressImage(file, maxDim, quality){
  return new Promise(function(resolve, reject){
    var reader = new FileReader();
    reader.onload = function(e){
      var img = new Image();
      img.onload = function(){
        var w = img.width, h = img.height;
        if (w > maxDim || h > maxDim){
          if (w > h){ h = Math.round(h * maxDim / w); w = maxDim; }
          else      { w = Math.round(w * maxDim / h); h = maxDim; }
        }
        var canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        var url;
        try {
          url = canvas.toDataURL('image/webp', quality);
          if (!url || url.indexOf('data:image/webp') !== 0){
            url = canvas.toDataURL('image/jpeg', quality);
          }
        } catch(_){ url = canvas.toDataURL('image/jpeg', quality); }
        resolve(url);
      };
      img.onerror = function(){ reject(new Error('Falha ao carregar imagem')); };
      img.src = e.target.result;
    };
    reader.onerror = function(){ reject(new Error('Falha ao ler arquivo')); };
    reader.readAsDataURL(file);
  });
}

function manualAddPhotoToBlock(di, bi){
  if (!authIsAdmin()){ alert('Apenas administradores podem adicionar fotos.'); return; }
  var inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.addEventListener('change', async function(){
    var file = inp.files && inp.files[0];
    if (!file){ document.body.removeChild(inp); return; }
    if (file.size > 15 * 1024 * 1024){
      alert('Imagem muito grande (>15MB). Escolha uma menor.');
      document.body.removeChild(inp); return;
    }
    manualToast('Comprimindo foto...');
    try {
      var dataUrl = await manualCompressImage(file, 800, 0.78);
      var fileToUpload = dataURLtoFile(dataUrl, 'block.webp');
      manualToast('Enviando para a nuvem...');
      var prefix = 'blocks/' + _manualCurrentCard + '-' + di + '-' + bi;
      var publicUrl = await manualUploadFile(fileToUpload, prefix);
      var b = _manualState[_manualCurrentCard].days[di].blocks[bi];
      if (!Array.isArray(b.images)) b.images = [];
      b.images.push(publicUrl);
      manualRenderContent(_manualState[_manualCurrentCard]);
      manualApplyEditableState();
      manualToast('Foto adicionada - clique em Salvar para confirmar');
    } catch(err){
      alert('Erro: ' + err.message);
    }
    document.body.removeChild(inp);
  });
  inp.click();
}

// ── REMOVER FOTO DE UM BLOCO ──────────────────────────────────
function manualDeletePhotoFromBlock(di, bi, ii){
  if (!confirm('Remover esta foto?')) return;
  var b = _manualState[_manualCurrentCard].days[di].blocks[bi];
  if (Array.isArray(b.images)) b.images.splice(ii, 1);
  manualRenderContent(_manualState[_manualCurrentCard]);
  manualApplyEditableState();
}

// ── ADICIONAR DIA ─────────────────────────────────────────────
function manualAddDay(){
  if (!_manualCurrentCard) return;
  var label = prompt('Nome da nova seção (ex: "Dia 4", "Encerramento"):', 'Nova seção');
  if (!label) return;
  _manualState[_manualCurrentCard].days.push({label: label.trim(), blocks:[{icon:'📌',title:'Novo bloco',desc:''}]});
  manualRenderContent(_manualState[_manualCurrentCard]);
  manualApplyEditableState();
}

// ── DELEGATION DE CLICKS NO MODAL ─────────────────────────────
document.addEventListener('click', function(e){
  if (!document.getElementById('manual-modal-content')) return;
  if (!e.target.closest || !e.target.closest('#manual-modal-content')) return;
  var t = e.target.closest('[data-action]');
  if (!t) return;
  var action = t.dataset.action;
  var id = _manualCurrentCard;
  if (!id) return;

  if (action === 'add-block'){
    var di = +t.dataset.di;
    _manualState[id].days[di].blocks.push({icon:'📌', title:'Novo bloco', desc:''});
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'del-block'){
    if (!confirm('Remover este bloco?')) return;
    var block = t.closest('.ms-block');
    var di2 = +block.dataset.di, bi = +block.dataset.bi;
    _manualState[id].days[di2].blocks.splice(bi,1);
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'del-day'){
    if (!confirm('Remover esta seção e todos os blocos dela?')) return;
    var di3 = +t.dataset.di;
    _manualState[id].days.splice(di3,1);
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'add-items'){
    var block2 = t.closest('.ms-block');
    var di4 = +block2.dataset.di, bi2 = +block2.dataset.bi;
    var b = _manualState[id].days[di4].blocks[bi2];
    if (!Array.isArray(b.items)) b.items = ['Novo item'];
    else b.items.push('Novo item');
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'add-obs'){
    var block3 = t.closest('.ms-block');
    var di5 = +block3.dataset.di, bi3 = +block3.dataset.bi;
    var b2 = _manualState[id].days[di5].blocks[bi3];
    if (!b2.obs) b2.obs = 'Atenção: ';
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'add-item'){
    var block4 = t.closest('.ms-block');
    var di6 = +block4.dataset.di, bi4 = +block4.dataset.bi;
    var b3 = _manualState[id].days[di6].blocks[bi4];
    if (!Array.isArray(b3.items)) b3.items = [];
    b3.items.push('Novo item');
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'del-item'){
    var item = t.closest('.ms-item');
    var block5 = t.closest('.ms-block');
    var di7 = +block5.dataset.di, bi5 = +block5.dataset.bi, ii = +item.dataset.ii;
    _manualState[id].days[di7].blocks[bi5].items.splice(ii,1);
    manualRenderContent(_manualState[id]); manualApplyEditableState();
  }
  if (action === 'add-photo'){
    var blockP = t.closest('.ms-block');
    var diP = +blockP.dataset.di, biP = +blockP.dataset.bi;
    manualAddPhotoToBlock(diP, biP);
  }
  if (action === 'del-image'){
    var col = t.closest('.ms-img-col');
    var blockI = t.closest('.ms-block');
    var diI = +blockI.dataset.di, biI = +blockI.dataset.bi, iiI = +col.dataset.ii;
    manualDeletePhotoFromBlock(diI, biI, iiI);
  }
}, false);

// ── CLICK DELEGATION PARA MPCE MODAL ─────────────────────────
document.addEventListener('click', function(e){
  if(!e.target.closest||!e.target.closest('#mpce-modal-content'))return;
  var t=e.target.closest('[data-action]');if(!t)return;
  var action=t.dataset.action,id=_mpceCurrentCard;if(!id)return;
  var _tree=mpceTree(_mpceState[id]);
  if(action==='add-block'){var di=+t.dataset.di;_tree[di].blocks.push({icon:'📌',title:'Novo bloco',desc:''});mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='del-block'){if(!confirm('Remover este bloco?'))return;var bl=t.closest('.ms-block');var di2=+bl.dataset.di,bi=+bl.dataset.bi;_tree[di2].blocks.splice(bi,1);mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='del-day'){if(!confirm('Remover esta seção?'))return;var di3=+t.dataset.di;_tree.splice(di3,1);mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='add-items'){var bl2=t.closest('.ms-block');var di4=+bl2.dataset.di,bi2=+bl2.dataset.bi;var b=_tree[di4].blocks[bi2];if(!Array.isArray(b.items))b.items=['Novo item'];else b.items.push('Novo item');mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='add-obs'){var bl3=t.closest('.ms-block');var di5=+bl3.dataset.di,bi3=+bl3.dataset.bi;var b2=_tree[di5].blocks[bi3];if(!b2.obs)b2.obs='Atenção: ';mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='add-item'){var bl4=t.closest('.ms-block');var di6=+bl4.dataset.di,bi4=+bl4.dataset.bi;var b3=_tree[di6].blocks[bi4];if(!Array.isArray(b3.items))b3.items=[];b3.items.push('Novo item');mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='del-item'){var itm=t.closest('.ms-item'),bl5=t.closest('.ms-block');var di7=+bl5.dataset.di,bi5=+bl5.dataset.bi,ii=+itm.dataset.ii;_tree[di7].blocks[bi5].items.splice(ii,1);mpceRenderContent(_mpceState[id]);mpceApplyEditableState();}
  if(action==='add-photo'){var blP=t.closest('.ms-block');mpceAddPhotoToBlock(+blP.dataset.di,+blP.dataset.bi);}
  if(action==='del-image'){var colI=t.closest('.ms-img-col'),blI=t.closest('.ms-block');mpceDeletePhotoFromBlock(+blI.dataset.di,+blI.dataset.bi,+colI.dataset.ii);}
  if(action==='add-video'){var blV=t.closest('.ms-block');mpceAddVideoToBlock(+blV.dataset.di,+blV.dataset.bi);}
  if(action==='del-video'){var itV=t.closest('.ms-vid-item'),blkV=t.closest('.ms-block');mpceDeleteVideoFromBlock(+blkV.dataset.di,+blkV.dataset.bi,+itV.dataset.vi);}
},false);

// Boot do Manual: roda quando o switchPage('manual') for chamado pela primeira vez
// e também no boot global

(function boot(){
  const t0=Date.now();
  Loader.show('Carregando');
  Logger.info('BOOT',`PCE Dashboard v${PCE_VERSION} iniciando`);
  const fb=normalizeBrPayload({rows:FALLBACK,stats:null});
  if(fb){fb.source='static_embedded';storeUpdateBr(fb);storeSetOffline(true);}
  try{renderCurrentView();}catch(e){Logger.error('BOOT','Render inicial',{message:e.message});}
  try{switchPage('dash');}catch(e){Logger.error('BOOT','Setup inicial dash',{message:e.message});}
  setStatus('neu','Atualizando...');
  setTimeout(()=>{
    try{buildPerfil();}catch(e){Logger.error('BOOT','buildPerfil',{message:e.message});}
    try{buildFaq();}  catch(e){Logger.error('BOOT','buildFaq',   {message:e.message});}
    // v47: supabaseInit + manualInit adiados — só rodam quando o Manual é aberto pela primeira vez
    // (economiza ~250KB de download síncrono no boot)
    window.__manualReady = false;
    window.__bootstrapManual = function(){
      if (window.__manualReady) return Promise.resolve();
      return window.__loadManualDeps().then(function(){
        try{
          supabaseInit();
          manualInit();
          window.__manualReady = true;
          return authRestoreSession();
        }catch(e){Logger.error('BOOT','manualInit (lazy)',{message:e.message});}
      });
    };
    // Hook: ao clicar no nav-manual OU nav-manual-pce, dispara o bootstrap
    setTimeout(function(){
      var navM = document.getElementById('nav-manual');
      if (navM) navM.addEventListener('click', function(){
        window.__bootstrapManual().then(function(){
          if (document.getElementById('page-manual').classList.contains('active')) {
            manualBootCloud();
          }
        });
      });
      var navP = document.getElementById('nav-manual-pce');
      if (navP) navP.addEventListener('click', function(){
        window.__bootstrapManual().then(function(){
          if (document.getElementById('page-manual-pce').classList.contains('active')) {
            if (typeof mpceBootCloud==='function') mpceBootCloud();
          }
        });
      });
    }, 100);
  },300);
  // Timeout de segurança curto — esconde loader após 4s no MÁXIMO (dashboard já rendeu com FALLBACK)
  const _safeHide = setTimeout(()=>Loader.hide(), 4000);
  // Esconde loader assim que dashboard estiver visualmente pronto (após renderização inicial + buildPerfil)
  setTimeout(()=>{ clearTimeout(_safeHide); Loader.hide(); }, 1200);
  // fetchAllData roda em background — quando chegar dado vivo, o store atualiza e os componentes re-renderizam
  setTimeout(()=>{
    fetchAllData(true)
      .catch(e=>{ Logger.error('BOOT','Fetch inicial',{message:e.message}); });
  },50);
  (function(){
  var _autoPendente=false;
  function _autoRefresh(){
    if(document.hidden){_autoPendente=true;return;}   // aba em segundo plano: adia
    _autoPendente=false;
    fetchAllData(true).catch(e=>Logger.warn('BOOT','Auto-refresh',{message:e.message}));
  }
  setInterval(_autoRefresh,15*60*1000);
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&_autoPendente)_autoRefresh();  // voltou pra frente: atualiza na hora
  });
})();
  Logger.perf('BOOT','Boot completo',t0);
})();
