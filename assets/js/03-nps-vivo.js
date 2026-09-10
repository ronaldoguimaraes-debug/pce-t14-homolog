/* PCE 2.0 · 04-nps-vivo
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
(function(){
  if(window.__npsVivoBooted) return; window.__npsVivoBooted=true;
  var $=function(id){return document.getElementById(id);};

  /* ---------- STORE híbrido: Supabase (tabela nps_encontros) senão localStorage ---------- */
  var LKEY='nps_encontros_local';
  async function listAll(){
    var rows=[];
    try{ if(typeof SB!=='undefined'&&SB){ var r=await SB.from('nps_encontros').select('*'); if(!r.error&&Array.isArray(r.data)) rows=r.data; } }catch(e){}
    try{ rows=rows.concat(JSON.parse(localStorage.getItem(LKEY)||'[]')); }catch(e){}
    return rows;
  }
  async function insertRow(row){
    window.__npsLastErr='';
    try{ if(typeof SB!=='undefined'&&SB){ var r=await SB.from('nps_encontros').insert(row).select().single(); if(!r.error&&r.data) return r.data; if(r.error) window.__npsLastErr=r.error.message||String(r.error); } else { window.__npsLastErr='Supabase nao inicializado'; } }catch(e){ window.__npsLastErr=e.message||String(e); }
    var all=JSON.parse(localStorage.getItem(LKEY)||'[]'); row.id='loc_'+Date.now()+'_'+Math.random().toString(36).slice(2,5); row.__local=true; all.push(row); localStorage.setItem(LKEY,JSON.stringify(all)); return row;
  }
  async function deleteRow(id){
    if(String(id).indexOf('loc_')===0){ var all=JSON.parse(localStorage.getItem(LKEY)||'[]').filter(function(r){return r.id!==id;}); localStorage.setItem(LKEY,JSON.stringify(all)); return; }
    try{ if(typeof SB!=='undefined'&&SB) await SB.from('nps_encontros').delete().eq('id',id); }catch(e){}
  }

  /* ---------- helpers ---------- */
  var norm=function(s){return (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');};
  var fmt=function(n){return (Math.round(n*100)/100).toFixed(2).replace('.',',');};
  var pct=function(n){return Math.round(n*100);};
  function parseCSV(text){
    text=text.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
    var rows=[],row=[],field='',i=0,inQ=false;
    while(i<text.length){var c=text[i];
      if(inQ){ if(c==='"'){ if(text[i+1]==='"'){field+='"';i+=2;continue;} inQ=false;i++;continue;} field+=c;i++;continue;}
      if(c==='"'){inQ=true;i++;continue;}
      if(c===','){row.push(field);field='';i++;continue;}
      if(c==='\n'){row.push(field);rows.push(row);row=[];field='';i++;continue;}
      field+=c;i++;}
    if(field.length||row.length){row.push(field);rows.push(row);}
    return rows.filter(function(r){return r.some(function(c){return String(c).trim()!=='';});});
  }
  function isScaleCol(values){var ne=values.filter(function(v){return String(v).trim()!=='';});var nums=ne.filter(function(v){return /^\d+([.,]\d+)?$/.test(String(v).trim())&&+String(v).replace(',','.')<=10;});return ne.length>0&&(nums.length/ne.length)>=0.6;}
  function avgOf(values){var nums=values.map(function(v){return +String(v).replace(',','.');}).filter(function(v){return !isNaN(v);});return nums.length?nums.reduce(function(a,b){return a+b;},0)/nums.length:0;}
  function scoreColor(v,max){var r=v/max;return r>=0.92?'#46d160':r>=0.8?'#f5a623':r>=0.6?'#f5c542':'#ff5f5f';}
  function esc(s){return String(s).replace(/[<>]/g,'');}
  /* Comentários: a diretoria precisa do panorama completo, não de uma amostra de 3.
     Mostra CM_SHOW e revela o restante no toggle, sem perder nada. */
  var CM_SHOW=6;
  function cmClean(arr){return (arr||[]).map(function(c){return String(c==null?'':c).trim();}).filter(function(c){return c!=='';});}
  function cmH(label,color,arr){var n=cmClean(arr).length;return '<div class="nv-cmh" style="color:'+color+'">'+label+(n?' ('+n+')':'')+'</div>';}
  function cmBox(arr,neg,vazio){
    var list=cmClean(arr);
    if(!list.length)return '<div class="nv-cm" style="opacity:.5">'+vazio+'</div>';
    var st=neg?' style="border-left-color:rgba(245,197,66,.5)"':'';
    var h='<div class="nv-cmbox">';
    h+=list.map(function(c,i){return '<div class="nv-cm'+(i>=CM_SHOW?' nv-cm-more':'')+'"'+st+'>"'+esc(c)+'"</div>';}).join('');
    if(list.length>CM_SHOW)h+='<button class="nv-cmtoggle" data-cmtoggle="'+list.length+'">Ver todos os '+list.length+' comentários ▾</button>';
    h+='</div>';
    return h;
  }
  function isAdm(){try{return (typeof authIsAdmin==='function')?!!authIsAdmin():true;}catch(e){return false;}}

  /* ---------- base fixa IMERSÃO (dados reais PCE 10–14) ---------- */
  var BASELINE=[
   {id:'base_pce10',baseline:true,tipo:'imersao',turma:'PCE 10',label:'PCE 10',sub:'Orlando · Set/2025',data_encontro:'2025-09-15',resps:null,total:null,recomenda:9.2,
    fortes:['Conteúdo prático e transformador','Alta energia e interatividade dos palestrantes','Experiência geral acima das expectativas'],
    melhoria:['Alimentação e pausas para café','Comunicação pré-evento','Tomadas nas mesas e infraestrutura'],
    palestrantes:[{label:'Tiago Zanini',score:9.0},{label:'Renatta Rêzende',score:8.5},{label:'Bruna Godoy',score:8.3},{label:'Edson Campos',score:9.3},{label:'Rafael Galdino',score:9.5},{label:'Vinicius David',score:9.5},{label:'Buzulin & Colisse',score:9.1}],
    experiencia:[{label:'Material Didático',score:9.1},{label:'Ferramentas aplicáveis',score:9.1},{label:'Time de Staff',score:9.3},{label:'Estrutura do Evento',score:9.0},{label:'Networking',score:8.7}],
    comentarios:{positivos:['Conteúdo prático e transformador.','Alta energia e interatividade dos palestrantes.','Experiência geral acima das expectativas.'],melhoria:['Avaliar melhorias na alimentação e pausas para café.','Melhorar comunicação pré-evento (evitar mensagens repetidas).','Ajustar tempo de conteúdo para maior aplicação prática.']}},
   {id:'base_pce11',baseline:true,tipo:'imersao',turma:'PCE 11',label:'PCE 11',sub:'Brasil · Out/2025',data_encontro:'2025-10-15',resps:null,total:null,recomenda:9.34,
    fortes:['Estruturação e processos da empresa','Métricas, KPIs e Gestão Financeira','Equipe de Comunicação e Atendimento'],
    melhoria:['Material didático mais aprofundado','Horários do evento','Noite de Networking'],
    palestrantes:[{label:'Tiago Zanini',score:9.0},{label:'Vinicius David',score:8.1},{label:'Iane Parente',score:9.0},{label:'Renatta Rêzende',score:8.1},{label:'Bruna Godoy',score:8.1},{label:'Rafael Galdino',score:9.1},{label:'Lilian Carmo',score:9.0}],
    experiencia:[{label:'Time de Staff',score:9.07},{label:'Material Didático',score:9.06},{label:'Ferramentas aplicáveis',score:9.06},{label:'Estrutura do Evento',score:9.06},{label:'Coffee Break',score:9.01},{label:'Noite de Networking',score:8.04}],
    comentarios:{positivos:['Importância de estruturar a empresa, definir processos claros e a relevância de Organograma e Cultura.','Maior compreensão sobre métricas (KPIs), Margem vs. Markup e gestão do Fluxo de Caixa.','A equipe de Comunicação, Atendimento e Suporte foi avaliada como excepcional.'],melhoria:['Aprofundar módulos técnicos como Finanças/KPIs e Processos — tempo curto para a densidade.','O jantar de networking — não conseguimos escutar nada que a equipe falou.','Noite de network — o local e a comida não estavam à altura do programa.']}},
   {id:'base_pce12',baseline:true,tipo:'imersao',turma:'PCE 12',label:'PCE 12',sub:'Brasil · Fev/2026',data_encontro:'2026-02-15',resps:33,total:80,recomenda:9.45,
    fortes:['Ferramentas aplicáveis','Recomendação do Programa','Time de staff'],
    melhoria:['Cumprimento de horários','Coffee Break e alimentação'],
    palestrantes:[{label:'Tiago Zanini',score:8.94},{label:'Vinicius David',score:8.21},{label:'Renatta Rêzende',score:9.00},{label:'Bruna Godoy',score:8.42},{label:'Ramon Pessoa',score:9.21},{label:'Rafael Galdino',score:9.76},{label:'Iane Parente',score:9.61}],
    experiencia:[{label:'Ferramentas aplicáveis',score:9.48},{label:'Time de Staff',score:9.61},{label:'Material Didático',score:9.09},{label:'Estrutura do Evento',score:9.73},{label:'Noite de Networking',score:9.06},{label:'Networking p/ negócio',score:8.85},{label:'Coffee Break',score:8.91}],
    comentarios:{positivos:['A didática do curso, muito fácil aplicar as ferramentas no dia a dia.','O PCE é um lugar que todos empresários precisam estar.','Soluções inovadoras para minha empresa e também para minha vida pessoal.'],melhoria:['Melhorar o coffee e a pontualidade.','As cadeiras deixam muita dor na coluna.','A alimentação não está à altura do evento.']}},
   {id:'base_pce13',baseline:true,tipo:'imersao',turma:'PCE 13',label:'PCE 13',sub:'Orlando · Abr/2026',data_encontro:'2026-04-15',resps:35,total:35,recomenda:9.71,
    fortes:['Entrega do conteúdo','Aplicabilidade das ferramentas','Time de Staff'],
    melhoria:['Cumprimento de horários','Coffee Break','Internet'],
    palestrantes:[{label:'Tiago Zanini',score:9.69},{label:'Vinicius David',score:9.49},{label:'Renatta Rêzende',score:8.71},{label:'Bruna Godoy',score:8.83},{label:'Ramon Pessoa',score:9.51},{label:'Rafael Galdino',score:9.71},{label:'Buzulin & A. Oliveira',score:9.74}],
    experiencia:[{label:'Ferramentas aplicáveis',score:9.60},{label:'Time de Staff',score:9.71},{label:'Material Didático',score:9.57},{label:'Estrutura do Evento',score:9.43},{label:'Networking p/ negócio',score:9.26}],
    comentarios:{positivos:['A profundidade dos conteúdos e as ferramentas que foram entregues.','Alto nível de conteúdo.','Excelência na entrega.'],melhoria:['A experiência da internet atrapalhou muito.','Começar mais cedo e terminar mais cedo.','Lanche, internet e disponibilizar os horários de intervalo.']}},
   {id:'base_pce14',baseline:true,tipo:'imersao',turma:'PCE 14',label:'PCE 14',sub:'Brasil · Mai/2026',data_encontro:'2026-05-26',resps:91,total:269,recomenda:9.34,
    fortes:['Conteúdo do Paulo Vieira','Aplicabilidade de ferramentas'],
    melhoria:['Pontualidade / horários','Coffee Break e alimentação'],
    palestrantes:[{label:'Tiago Zanini',score:9.36},{label:'Vinicius David',score:8.96},{label:'Iane Parente',score:8.97},{label:'Rafael Galdino',score:9.73},{label:'Renatta Rêzende',score:8.59},{label:'Dani Pires',score:9.21}],
    experiencia:[{label:'Ferramentas aplicáveis',score:9.41},{label:'Time de Staff',score:9.60},{label:'Material Didático',score:9.21},{label:'Estrutura do Evento',score:9.30},{label:'Noite de Networking',score:8.71},{label:'Networking p/ negócio',score:8.67},{label:'Coffee Break',score:8.73}],
    comentarios:{positivos:['A entrega de conteúdo e profundidade do Paulo.','Insights poderosos que mudarão o rumo dos negócios.','Palestra do Galdino e sem dúvidas do Paulo. Ambos trouxeram as soluções que minha empresa precisava.'],melhoria:['Ajustar os horários para encerrar mais cedo.','A alimentação não está à altura do evento.','Acho que poderia ser algo um pouco mais tranquilo em tempo.']}}
  ];
  var byDate=function(a,b){return String(a.data_encontro||'').localeCompare(String(b.data_encontro||''));};
  function imersaoList(){
    var stored=STATE.all.filter(function(e){return e.tipo==='imersao';});
    var base={}; BASELINE.forEach(function(b){base[b.label]=b;});
    /* Ao sobrescrever uma baseline, herda os campos curados que a tabela não guarda
       (fortes/melhoria/sub) para não perder o conteúdo editorial. */
    stored.forEach(function(s){
      var b=base[s.label||s.turma]; if(!b)return;
      if(!s.fortes||!s.fortes.length)s.fortes=b.fortes;
      if(!s.melhoria||!s.melhoria.length)s.melhoria=b.melhoria;
      if(!s.sub)s.sub=b.sub;
    });
    var over={}; stored.forEach(function(s){over[s.label||s.turma]=1;});
    return BASELINE.filter(function(b){return !over[b.label];}).concat(stored).sort(byDate);
  }
  /* ---- Participantes editável (admin) ---- */
  async function npsSaveTotal(enc,val){
    var id=String(enc.id||'');
    if(id.indexOf('base_')===0){
      /* Baseline é hardcoded: grava uma linha de override que a imersaoList substitui por label. */
      return await insertRow({tipo:'imersao',turma:enc.turma,label:enc.label,sub:enc.sub,data_encontro:enc.data_encontro,
        resps:enc.resps,total:val,recomenda:enc.recomenda,palestrantes:enc.palestrantes||[],
        experiencia:enc.experiencia||[],comentarios:enc.comentarios||{},created_by_name:'admin'});
    }
    if(id.indexOf('loc_')===0){
      var all=JSON.parse(localStorage.getItem(LKEY)||'[]');
      all.forEach(function(r){if(String(r.id)===id)r.total=val;});
      localStorage.setItem(LKEY,JSON.stringify(all));
      return {__local:true};
    }
    if(typeof SB==='undefined'||!SB)throw new Error('Supabase não inicializado');
    var r=await SB.from('nps_encontros').update({total:val}).eq('id',id).select().single();
    if(r.error)throw r.error;
    return r.data;
  }
  async function npsEditTotal(id){
    if(!isAdm()){alert('Apenas administradores podem editar este campo.');return;}
    var enc=null;
    STATE.all.concat(BASELINE).forEach(function(x){if(String(x.id)===String(id))enc=x;});
    if(!enc)return;
    var lbl=enc.label||enc.turma,tipo=enc.tipo;
    var v=prompt('Quantas pessoas participaram deste encontro?\n(fonte: Relatório de Participantes do Zoom ou lista de presença)\n\nDeixe vazio para limpar.',(enc.total!=null?enc.total:''));
    if(v===null)return;
    v=String(v).trim();
    var val=(v==='')?null:parseInt(v,10);
    if(v!==''&&(!isFinite(val)||val<0)){alert('Informe um número inteiro válido (ou vazio para limpar).');return;}
    try{
      var res=await npsSaveTotal(enc,val);
      if(res&&res.__local)alert('ATENÇÃO: salvo APENAS neste navegador — não foi para o Supabase.\n\nMotivo: '+(window.__npsLastErr||'desconhecido')+'\n\nVerifique se você está logado como admin.');
      await boot();
      if(tipo==='imersao'){var f=imersaoList().filter(function(x){return (x.label||x.turma)===lbl;})[0];if(f){STATE.imTurma=f.id;render();}}
    }catch(e){alert('Erro ao salvar: '+(e.message||e));}
  }
  window.__npsEditTotal=npsEditTotal;
  window.__npsReboot=function(){try{STATE.all=[];boot();}catch(e){}};

  /* ---------- parsers ---------- */
  function palestranteName(header){var m=header.match(/palestrante\s+(.+?)\s*\?/i)||header.match(/palestrante\s+([^?.,]+)/i);return m?m[1].trim():header.slice(0,30);}
  function expLabel(header){var h=norm(header);
    if(/material didatico/.test(h))return 'Material Didático';
    if(/ferramentas.*(aplicav|relevant)/.test(h))return 'Ferramentas aplicáveis';
    if(/estrutura do evento/.test(h))return 'Estrutura do Evento';
    if(/time de staff|staff da imersao/.test(h))return 'Time de Staff';
    if(/coffee/.test(h))return 'Coffee Break';
    if(/noite de networking|satisfeito.*networking/.test(h))return 'Noite de Networking';
    if(/networking.*(util|vivenciado)/.test(h))return 'Networking p/ negócio';
    var c=header.replace(/em uma escala de 0 a 10,?/i,'').replace(/considere.*$/i,'').replace(/[?*]/g,'').trim();
    return c.length>34?c.slice(0,34)+'…':c;}
  function analyzeImersao(rows){
    var headers=rows[0].map(function(h){return h.trim();}),data=rows.slice(1);
    var cols=headers.map(function(h,idx){return {header:h,values:data.map(function(r){return r[idx]!=null?r[idx]:'';})};});
    var recomenda=null,palestrantes=[],experiencia=[],positivos=[],melhoria=[],mapping=[];
    cols.forEach(function(c){var h=norm(c.header);
      if(/carimbo|timestamp|data\/hora|nome/.test(h)){mapping.push({header:c.header,role:'ignore',txt:'ignorado'});return;}
      if(isScaleCol(c.values)){var avg=avgOf(c.values);
        if(/recomenda/.test(h)){recomenda=avg;mapping.push({header:c.header,role:'scale',txt:'RECOMENDAÇÃO'});}
        else if(/palestrante/.test(h)){var nm=palestranteName(c.header);palestrantes.push({label:nm,score:avg});mapping.push({header:c.header,role:'scale',txt:'PALESTRANTE · '+nm});}
        else{var lb=expLabel(c.header);experiencia.push({label:lb,score:avg});mapping.push({header:c.header,role:'scale',txt:'EXPERIÊNCIA · '+lb});}
      }else{
        if(/melhorar|melhoria|sugest|negativ|pior/.test(h)){c.values.forEach(function(v){var t=String(v).trim();if(t&&!/^(nada|nao|não|-|n\/a)\.?$/i.test(t))melhoria.push(t);});mapping.push({header:c.header,role:'neg',txt:'MELHORIA'});}
        else if(/gostou|forte|positiv|destaque|importante|melhor.*(evento|palestr)|aprend|marcou/.test(h)){c.values.forEach(function(v){var t=String(v).trim();if(t)positivos.push(t);});mapping.push({header:c.header,role:'pos',txt:'COMENTÁRIO +'});}
        else mapping.push({header:c.header,role:'ignore',txt:'ignorado'});
      }});
    return {_im:true,n:data.length,recomenda:recomenda,palestrantes:palestrantes,experiencia:experiencia,comentarios:{positivos:positivos,melhoria:melhoria},mapping:mapping};
  }
  var HS_LABELS={satisfacao:'Satisfação com o encontro',relevancia:'Relevância para a empresa',conteudo:'Satisfação com o conteúdo'};
  function analyzeHotseat(rows){
    var headers=rows[0].map(function(h){return h.trim();}),data=rows.slice(1);
    var cols=headers.map(function(h,idx){return {header:h,values:data.map(function(r){return r[idx]!=null?r[idx]:'';})};});
    var metricas={},order=[],mapping=[],positivos=[],melhoria=[];
    cols.forEach(function(c){var h=norm(c.header);
      if(/carimbo|timestamp|data\/hora|nome/.test(h)){mapping.push({header:c.header,role:'ignore',txt:'ignorado'});return;}
      if(isScaleCol(c.values)){
        var vals=c.values.map(function(v){return +String(v).replace(',','.');}).filter(function(v){return !isNaN(v)&&v>0;});
        if(!vals.length){mapping.push({header:c.header,role:'ignore',txt:'ignorado'});return;}
        var max=Math.max.apply(null,vals)>5?10:5,key=null;
        /* ORDEM IMPORTA: "satisfeito com o CONTEUDO do encontro" tambem casa com o regex de
           satisfacao (tem "satisfeito"+"encontro"). Testar conteudo primeiro evita que as duas
           colunas virem a mesma chave e o conteudo sobrescreva a satisfacao. */
        if(/satisfeito.*conteudo|conteudo/.test(h))key='conteudo';
        else if(/relevante|util|utilidade|proveito/.test(h))key='relevancia';
        else if(/satisfeito.*(encontro|hot ?seat|mentoria)/.test(h))key='satisfacao';
        var avg=vals.reduce(function(a,b){return a+b;},0)/vals.length;
        var dist={};for(var k=1;k<=max;k++)dist[k]=0;vals.forEach(function(v){var r=Math.round(v);if(dist[r]!=null)dist[r]++;});
        var topBox=vals.filter(function(v){return v>=max-1;}).length/vals.length;
        var lowBox=vals.filter(function(v){return v<=(max===10?6:2);}).length/vals.length;
        var kk=key||('extra:'+c.header);
        /* Trava anti-perda: se a chave ja existe, nao sobrescreve — vira coluna extra. */
        if(metricas[kk])kk='extra:'+c.header;
        metricas[kk]={label:key?HS_LABELS[key]:c.header,avg:avg,n:vals.length,dist:dist,scaleMax:max,topBox:topBox,lowBox:lowBox};order.push(kk);
        mapping.push({header:c.header,role:'scale',txt:'NOTA · '+(key?HS_LABELS[key]:'extra')});
      }else{
        if(/negativ|melhorar|melhoria|ponto.*melhor/.test(h)){c.values.forEach(function(v){var t=String(v).trim();if(t&&!/^(nada|nao|não|-|n\/a)\.?$/i.test(t))melhoria.push(t);});mapping.push({header:c.header,role:'neg',txt:'MELHORIA'});}
        else{c.values.forEach(function(v){var t=String(v).trim();if(t)positivos.push(t);});mapping.push({header:c.header,role:'pos',txt:'COMENTÁRIO +'});}
      }});
    var mainKey=metricas.satisfacao?'satisfacao':order[0];
    return {n:data.length,metricas:metricas,order:order,mainKey:mainKey,comentarios:{positivos:positivos,melhoria:melhoria},mapping:mapping};
  }
  var STOP={};'a o e de da do das dos que com para por em no na nos nas um uma os as se ao aos foi ser sao são muito mais menos meu minha nosso nossa ele ela eles elas isso este esta the and eu voce você tudo todo toda todos todas ja já nao não sim como qual quais onde quando pra pro sobre entre tem ter teve era esta está fazer feito ainda caraca nossa poxa entao então apenas pouco bastante sempre nunca porem porém desde tambem também assim depois antes cada outro outra ate até quase talvez'.split(' ').forEach(function(w){STOP[w]=1;});
  function temas(list,n){n=n||4;var f={};list.forEach(function(t){norm(t).replace(/[^a-z\s]/g,' ').split(/\s+/).forEach(function(w){if(w.length>=4&&!STOP[w])f[w]=(f[w]||0)+1;});});return Object.keys(f).map(function(k){return [k,f[k]];}).sort(function(a,b){return b[1]-a[1];}).slice(0,n).map(function(x){return x[0];});}
  /* Nem toda pesquisa de hot seat tem pergunta de nota em escala. O Pre-PCE, por exemplo,
     mede itens categoricos (dificuldade de preencher formulario, erro sistemico). Nesses casos
     mainKey nao resolve para uma metrica numerica e o render precisa seguir sem media. */
  function hsMain(enc){
    var mm=(enc&&enc.metricas&&enc.mainKey)?enc.metricas[enc.mainKey]:null;
    if(!mm||typeof mm.avg!=='number'||!isFinite(mm.avg)||!mm.scaleMax)return null;
    return mm;
  }
  function hsAnalysis(enc,prev){
    var m=enc.metricas||{},main=hsMain(enc),P=[];
    var _pres=(enc.total!=null&&+enc.total>0)?+enc.total:null;
    var _abre=_pres?('<b>'+_pres+'</b> participantes online · <b>'+enc.n+'</b> responderam ('+Math.min(100,pct((enc.n||0)/_pres))+'% de resposta).'):('<b>'+enc.n+' respostas.</b>');
    if(!main){
      P.push(_abre+' Esta pesquisa não traz pergunta de nota em escala, então não há média de satisfação para este encontro.');
      var _tc0=((enc.comentarios&&enc.comentarios.positivos)||[]).length+((enc.comentarios&&enc.comentarios.melhoria)||[]).length;
      P.push('Leitura possível: <b>'+_tc0+'</b> comentário(s) aberto(s) e a taxa de participação acima.');
      return {paras:P,temasPos:temas((enc.comentarios&&enc.comentarios.positivos)||[]),temasNeg:temas((enc.comentarios&&enc.comentarios.melhoria)||[])};
    }
    P.push(_abre+' '+main.label+' média de <b>'+fmt(main.avg)+'/'+main.scaleMax+'</b>, com <b>'+pct(main.topBox)+'%</b> de notas altas'+(main.lowBox>0?' e '+pct(main.lowBox)+'% de notas baixas':'')+'.');
    if(prev&&prev.metricas&&prev.metricas[enc.mainKey]){var d=main.avg-prev.metricas[enc.mainKey].avg;var dir=d>0.05?'subiu':(d<-0.05?'caiu':'ficou estável');var cls=d>0.05?'nv-up':(d<-0.05?'nv-down':'');P.push('Frente ao encontro anterior (<b>'+(prev.mentor||prev.turma)+'</b>), a satisfação <span class="'+cls+'">'+dir+(Math.abs(d)>=0.05?' '+fmt(Math.abs(d))+' ponto(s)':'')+'</span>.');}
    else P.push('Primeiro encontro deste tipo — vira a <b>linha de base</b> para os próximos.');
    var dims=enc.order.map(function(k){return m[k];}).filter(Boolean);
    if(dims.length>1){var t=dims.slice().sort(function(a,b){return b.avg-a.avg;})[0],b=dims.slice().sort(function(a,b){return a.avg-b.avg;})[0];P.push('Dimensão mais forte: <b>'+t.label+'</b> ('+fmt(t.avg)+'). Menor nota: <b>'+b.label+'</b> ('+fmt(b.avg)+').');}
    var tc=enc.comentarios.positivos.length+enc.comentarios.melhoria.length,rate=enc.n?tc/enc.n:0;var lvl=rate>=0.7?'alto':(rate>=0.35?'médio':'baixo');
    P.push('Engajamento qualitativo <b>'+lvl+'</b>: '+enc.n+' respostas e '+tc+' comentário(s) aberto(s) ('+pct(rate)+'% de aproveitamento).');
    return {paras:P,temasPos:temas(enc.comentarios.positivos),temasNeg:temas(enc.comentarios.melhoria)};
  }

  /* ---------- render ---------- */
  var charts=[];function killCharts(){charts.forEach(function(c){try{c.destroy();}catch(e){}});charts.length=0;}
  var STATE={all:[],tab:'imersao',tipo:'hotseat_pos',imTurma:null};
  var currentTipo=function(){return STATE.tab==='imersao'?'imersao':STATE.tipo;};
  function barRow(label,score,max){var c=scoreColor(score,max);return '<div class="nv-mrow"><div class="nv-mlbl">'+label+'</div><div class="nv-mbar"><div class="nv-mfill" style="width:'+(score/max*100).toFixed(0)+'%;background:'+c+'"></div></div><div class="nv-msc" style="color:'+c+'">'+fmt(score)+'</div></div>';}

  function render(){
    killCharts();
    var tipo=currentTipo();
    if(tipo==='imersao'){renderImersao(imersaoList());return;}
    var list=STATE.all.filter(function(e){return e.tipo===tipo;}).sort(byDate);
    renderHotseat(list);
  }

  function renderImersao(list){
    var host=$('nv-content');
    if(!list.length){host.innerHTML='<div class="nv-empty">Nenhuma imersão carregada.</div>';return;}
    if(!STATE.imTurma||!list.filter(function(t){return t.id===STATE.imTurma;}).length) STATE.imTurma=list[list.length-1].id;
    var t=list.filter(function(x){return x.id===STATE.imTurma;})[0];
    var h='<div class="nv-card"><div class="nv-ct">Evolução da Recomendação</div><div class="nv-cs">Nota média de recomendação (0–10) por turma</div><div style="position:relative;height:180px"><canvas id="nv-im-evo"></canvas></div></div><div class="nv-ttabs" id="nv-im-tabs">';
    list.forEach(function(x){h+='<button class="nv-ttab '+(x.id===t.id?'on':'')+'" data-id="'+x.id+'">'+(x.label||x.turma)+'<span>'+(x.sub||x.data_encontro||'')+'</span></button>';});
    h+='</div>';
    var dims=(t.palestrantes||[]).concat(t.experiencia||[]);
    var fortesArr=(t.fortes&&t.fortes.length)?t.fortes:dims.slice().sort(function(a,b){return b.score-a.score;}).slice(0,2).map(function(x){return x.label+' ('+fmt(x.score)+')';});
    var melhoriaArr=(t.melhoria&&t.melhoria.length)?t.melhoria:dims.slice().sort(function(a,b){return a.score-b.score;}).slice(0,2).map(function(x){return x.label+' ('+fmt(x.score)+')';});
    var recCol=scoreColor(t.recomenda,10),circ=2*Math.PI*66,off=circ-circ*(t.recomenda/10);
    /* Participantes da imersão: t.total = presentes no evento; t.resps = quem respondeu a pesquisa. */
    var _imTot=(t.total!=null&&+t.total>0)?+t.total:null;
    var _imRsp=(t.resps!=null&&+t.resps>0)?+t.resps:null;
    var _imTaxa=(_imTot&&_imRsp)?Math.min(100,Math.round(_imRsp/_imTot*100)):null;
    var _imStats='<div class="nv-imstats">'
      +'<div class="nv-imstat">'+(isAdm()?'<button class="nv-statedit" data-edit-total="'+t.id+'" title="Editar participantes">✎</button>':'')+'<div class="nv-imstat-n'+(_imTot==null?' off':'')+'">'+(_imTot!=null?_imTot:'—')+'</div><div class="nv-imstat-l">Participantes</div></div>'
      +'<div class="nv-imstat"><div class="nv-imstat-n'+(_imRsp==null?' off':'')+'">'+(_imRsp!=null?_imRsp:'—')+'</div><div class="nv-imstat-l">Respostas</div></div>'
      +(_imTaxa!=null?'<div class="nv-imstat"><div class="nv-imstat-n">'+_imTaxa+'%</div><div class="nv-imstat-l">Taxa de resposta</div></div>':'')
      +'</div>'
      +((_imTot==null&&_imRsp==null)?'<div class="nv-imstat-warn">Participantes não informados — clique no ✎ para incluir.</div>':'');
    h+='<div class="nv-imhero"><div class="nv-card"><div class="nv-ct" style="text-align:center">Recomendação (0–10)</div><div class="nv-ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="66" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="11"/><circle cx="75" cy="75" r="66" fill="none" stroke="'+recCol+'" stroke-width="11" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+off+'"/></svg><div class="nv-ringc"><div class="nv-ringn" style="color:'+recCol+'">'+fmt(t.recomenda)+'</div></div></div>'+_imStats+'<div class="nv-cs" style="text-align:center;margin:8px 0 0">'+(t.label||t.turma)+' · '+(t.sub||'')+'</div><div class="nv-fortes"><div class="nv-fh" style="color:#46d160">Pontos Fortes</div>'+fortesArr.map(function(x){return '<div class="nv-fi"><span style="color:#46d160">✓</span> '+x+'</div>';}).join('')+'<div class="nv-fh" style="color:#f5c542">Pontos de Melhoria</div>'+melhoriaArr.map(function(x){return '<div class="nv-fi"><span style="color:#f5c542">▲</span> '+x+'</div>';}).join('')+'</div></div><div class="nv-imcols"><div class="nv-card"><div class="nv-ct">Avaliação dos Palestrantes</div>'+((t.palestrantes||[]).map(function(p){return barRow(p.label,p.score,10);}).join('')||'<div class="nv-cs">Sem palestrantes no arquivo.</div>')+'</div><div class="nv-card"><div class="nv-ct">Experiência do Evento</div>'+((t.experiencia||[]).map(function(p){return barRow(p.label,p.score,10);}).join('')||'<div class="nv-cs">Sem itens de experiência.</div>')+'</div></div></div>';
    var _posArr=(t.comentarios&&t.comentarios.positivos)||[],_negArr=(t.comentarios&&t.comentarios.melhoria)||[];
    var pos=cmBox(_posArr,false,'Sem comentários.');
    var neg=cmBox(_negArr,true,'Nenhum ponto de melhoria.');
    h+='<div class="nv-card"><div class="nv-ct">Comentários dos Participantes</div><div class="nv-comments"><div>'+cmH('Positivos','#46d160',_posArr)+pos+'</div><div>'+cmH('Pontos de melhoria','#f5c542',_negArr)+neg+'</div></div>'+((t.baseline||!isAdm())?'':'<div style="margin-top:14px;text-align:right"><button class="nv-encdel" data-del="'+t.id+'">excluir turma</button></div>')+'</div>';
    host.innerHTML=h;
    $('nv-im-tabs').addEventListener('click',function(e){var b=e.target.closest('.nv-ttab');if(!b)return;STATE.imTurma=b.dataset.id;render();});
    var canvas=$('nv-im-evo'),labels=list.map(function(x){return x.label||x.turma;}),scores=list.map(function(x){return +(+x.recomenda).toFixed(2);});
    var grad=canvas.getContext('2d').createLinearGradient(0,0,0,180);grad.addColorStop(0,'rgba(245,166,35,.22)');grad.addColorStop(1,'rgba(245,166,35,0)');
    if(window.Chart)charts.push(new Chart(canvas,{type:'line',data:{labels:labels,datasets:[{data:scores,borderColor:'#f5a623',backgroundColor:grad,borderWidth:2.5,tension:.35,fill:true,pointRadius:6,pointBackgroundColor:scores.map(function(s){return scoreColor(s,10);}),pointBorderColor:'#1a1a18',pointBorderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return ' Recomendação: '+fmt(c.raw);}}}},scales:{x:{grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#7a7a76',font:{size:11}},border:{color:'transparent'}},y:{min:Math.min.apply(null,scores.concat([8.5]))-.3,max:10,grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#7a7a76',callback:function(v){return fmt(v);}},border:{color:'transparent'}}}}}));
  }

  /* ===== PAINEL GERENCIAL — leitura para decisão, gerada deterministicamente dos números ===== */
  var SHORT_DIM={satisfacao:'Satisfação',relevancia:'Relevância',conteudo:'Conteúdo'};
  function hsRank(list,key){return list.filter(function(e){return e.metricas&&e.metricas[key];}).slice().sort(function(a,b){return b.metricas[key].avg-a.metricas[key].avg;});}
  function distBar(m){
    var top=Math.round((m.topBox||0)*100),low=Math.round((m.lowBox||0)*100),mid=Math.max(0,100-top-low);
    return '<div class="nv-dist" title="'+top+'% altas · '+mid+'% neutras · '+low+'% baixas">'
      +'<span style="width:'+top+'%;background:#46d160"></span>'
      +'<span style="width:'+mid+'%;background:rgba(234,229,225,.25)"></span>'
      +'<span style="width:'+low+'%;background:#ff5f5f"></span></div>';
  }
  function kpiBox(n,l,c){return '<div class="nv-kpi"><div class="nv-kpi-n"'+(c?' style="color:'+c+'"':'')+'>'+n+'</div><div class="nv-kpi-l">'+l+'</div></div>';}
  function hsPainel(list,key,tipoLbl){
    var rank=hsRank(list,key);
    if(!rank.length)return {html:'',rank:[]};
    var n=rank.length;
    var media=rank.reduce(function(a,e){return a+e.metricas[key].avg;},0)/n;
    var best=rank[0],worst=rank[n-1];
    var totPart=0,semPart=0,totResp=0;
    rank.forEach(function(e){if(e.total!=null&&+e.total>0)totPart+=+e.total;else semPart++;totResp+=(e.n||0);});
    var taxa=(totPart>0&&semPart===0)?Math.min(100,Math.round(totResp/totPart*100)):null;
    var sTop=0,sLow=0,sN=0;
    rank.forEach(function(e){var m=e.metricas[key];sTop+=(m.topBox||0)*m.n;sLow+=(m.lowBox||0)*m.n;sN+=m.n;});
    var saldo=sN?Math.round((sTop-sLow)/sN*100):0;
    var saldoCol=saldo>=50?'#46d160':(saldo>=0?'#f5c542':'#ff5f5f');

    var h='<div class="nv-card"><div class="nv-ct">Painel gerencial — '+esc(tipoLbl)+'</div>'
      +'<div class="nv-cs">Desempenho por mentor, efetividade percebida e pontos de atenção. Gerado dos números da pesquisa.</div>';

    h+='<div class="nv-kpis">'
      +kpiBox(n,'Encontros','')
      +kpiBox(fmt(media),'Média satisfação /10',scoreColor(media,10))
      +kpiBox(totResp,'Respostas','')
      +'</div>';

    var mB=best.metricas[key],dB=mB.avg-media;
    h+='<div class="nv-verdict"><div class="nv-vd nv-vd-top"><b>Destaque · '+esc(best.mentor||best.turma)+'</b></div>';
    if(n>1){var mW=worst.metricas[key],dW=mW.avg-media;
      h+='<div class="nv-vd nv-vd-low"><b>Atenção · '+esc(worst.mentor||worst.turma)+'</b></div>';}
    h+='</div>';

    var dims=['satisfacao','relevancia','conteudo'].filter(function(k){return rank.some(function(e){return e.metricas[k];});});
    h+='<div class="nv-ranktbl"><table class="nv-rank"><thead><tr><th>#</th><th>Mentor</th><th>Turma</th><th>Data</th>'
      +dims.map(function(k){return '<th class="num">'+(SHORT_DIM[k]||k)+'</th>';}).join('')
      +'<th class="num">Resp.</th><th class="num">Online</th></tr></thead><tbody>';
    rank.forEach(function(e,i){
      var m=e.metricas[key];
      var pos=(i===0)?'\u{1F947}':(i===1)?'\u{1F948}':(i===2&&n>3)?'\u{1F949}':(i+1)+'\u00BA';
      var st=(m.avg>=media+0.3)?'<span class="nv-badge up">Acima</span>':(m.avg<=media-0.3)?'<span class="nv-badge dn">Abaixo</span>':'<span class="nv-badge eq">Na média</span>';
      var sal=Math.round(((m.topBox||0)-(m.lowBox||0))*100);
      var tx=(e.total&&e.n)?Math.min(100,Math.round(e.n/e.total*100))+'%':'—';
      h+='<tr'+(i===n-1&&n>2?' class="last"':'')+'><td class="pos">'+pos+'</td><td class="mt">'+esc(e.mentor||'—')+'</td><td><span class="nv-turma">'+esc(e.turma||'—')+'</span></td><td class="dt">'+(e.data_encontro||'—')+'</td>';
      dims.forEach(function(k){var mm=e.metricas[k];
        h+='<td class="num"'+(mm?' style="color:'+scoreColor(mm.avg,mm.scaleMax)+';font-weight:700"':'')+'>'+(mm?fmt(mm.avg):'—')+'</td>';});
      var _onl=(e.total!=null&&+e.total>0)?+e.total:null;
      h+='<td class="num">'+(e.n||'—')+'</td>'
        +'<td class="num">'+(_onl!=null?_onl:'—')
        +(isAdm()?'<button class="nv-onledit" data-edit-total="'+e.id+'" title="Editar participantes online">✎</button>':'')
        +'</td></tr>';
    });
    h+='</tbody></table></div>';


    h+='<div style="position:relative;height:'+Math.max(190,70+n*46)+'px;margin-top:18px"><canvas id="nv-hs-cmp"></canvas></div>';

    var P=[],gap=best.metricas[key].avg-worst.metricas[key].avg;
    var disp=gap>=2?'alta':(gap>=1?'moderada':'baixa');
    P.push('<b>'+n+' encontro'+(n>1?'s':'')+'</b> avaliado'+(n>1?'s':'')+' com <b>'+totResp+'</b> resposta'+(totResp===1?'':'s')
      +(taxa!=null?' de <b>'+totPart+'</b> participantes (<b>'+taxa+'%</b> de resposta)':'')
      +'. Média de satisfação <b>'+fmt(media)+'/10</b>, saldo <b>'+(saldo>0?'+':'')+saldo+'</b> (notas altas menos baixas).');
    if(n>1){
      P.push('Entre o melhor (<b>'+esc(best.mentor||best.turma)+'</b>, '+fmt(best.metricas[key].avg)+') e o último (<b>'+esc(worst.mentor||worst.turma)+'</b>, '+fmt(worst.metricas[key].avg)+') há <b>'+fmt(gap)+' ponto'+(gap>=2?'s':'')+'</b> de diferença — dispersão <b>'+disp+'</b>.');
      var acima=rank.filter(function(e){return e.metricas[key].avg>media;}).length;
      P.push('<b>'+acima+' de '+n+'</b> encontro'+(n>1?'s':'')+' ficaram acima da média do período.');
      var det=rank.slice().sort(function(a,b){return (b.metricas[key].lowBox||0)-(a.metricas[key].lowBox||0);})[0];
      if(det&&det.metricas[key].lowBox>0)P.push('As notas baixas se concentram em <b>'+esc(det.mentor||det.turma)+'</b>: <b>'+Math.round(det.metricas[key].lowBox*100)+'%</b> das respostas desse encontro.');
      else P.push('Nenhum encontro registrou notas baixas relevantes.');
    }
    if(dims.length>1){
      var mediaDim={};dims.forEach(function(k){var v=rank.filter(function(e){return e.metricas[k];});mediaDim[k]=v.reduce(function(a,e){return a+e.metricas[k].avg;},0)/v.length;});
      var ord=dims.slice().sort(function(a,b){return mediaDim[b]-mediaDim[a];});
      P.push('Por dimensão: <b>'+SHORT_DIM[ord[0]]+'</b> é a mais forte ('+fmt(mediaDim[ord[0]])+') e <b>'+SHORT_DIM[ord[ord.length-1]]+'</b> a mais fraca ('+fmt(mediaDim[ord[ord.length-1]])+').');
    }
    if(semPart)P.push('<b>'+semPart+' encontro'+(semPart>1?'s':'')+' sem participantes informados</b> — a taxa de resposta do período fica incompleta até preencher (\u270e).');
    var rec=(gap>=2)?'Padronizar o roteiro a partir do que <b>'+esc(best.mentor||best.turma)+'</b> faz e revisar a condução de <b>'+esc(worst.mentor||worst.turma)+'</b> antes da próxima rodada.'
      :(saldo<0)?'Revisar formato e tema do encontro: há mais insatisfeitos do que satisfeitos.'
      :(saldo<30)?'Saldo apertado: vale investigar os comentários de melhoria antes de repetir o formato.'
      :'Manter o formato e replicar as práticas de <b>'+esc(best.mentor||best.turma)+'</b> nos demais encontros.';
    P.push('<b>Recomendação:</b> '+rec);

    h+='<div class="nv-analise" style="margin-top:16px"><div class="nv-antitle">Leitura gerencial</div>'
      +P.map(function(x){return '<div class="nv-anp">'+x+'</div>';}).join('')+'</div>';
    h+='</div>';
    return {html:h,rank:rank,dims:dims,media:media};
  }
  /* Painel enxuto para pesquisas sem nota em escala (Pre-PCE). Sem media, sem
     ranking e sem grafico comparativo, porque nao ha o que ranquear: mostra
     volume, participacao e os temas que aparecem nos comentarios. */
  function hsPainelSemNota(list,tipoLbl){
    var n=list.length,totResp=0,totPart=0,semPart=0,pos=[],neg=[];
    list.forEach(function(e){
      totResp+=(+e.n||0);
      if(e.total!=null&&+e.total>0)totPart+=+e.total;else semPart++;
      pos=pos.concat((e.comentarios&&e.comentarios.positivos)||[]);
      neg=neg.concat((e.comentarios&&e.comentarios.melhoria)||[]);
    });
    var taxa=(totPart>0&&semPart===0)?Math.min(100,Math.round(totResp/totPart*100)):null;
    var h='<div class="nv-card"><div class="nv-ct">Painel gerencial \u2014 '+esc(tipoLbl)+'</div>'
      +'<div class="nv-cs">Esta pesquisa n\u00e3o tem pergunta de nota em escala, ent\u00e3o n\u00e3o h\u00e1 m\u00e9dia nem ranking de mentor. O que d\u00e1 para medir aqui \u00e9 alcance, participa\u00e7\u00e3o e o que as pessoas escreveram.</div>';
    h+='<div class="nv-kpis">'
      +kpiBox(n,'Encontros','')
      +kpiBox(totPart||'\u2014','Participantes online','')
      +kpiBox(totResp,'Respostas','')
      +(taxa!=null?kpiBox(taxa+'%','Taxa de resposta',''):'')
      +kpiBox(pos.length+neg.length,'Coment\u00e1rios abertos','')
      +'</div>';
    var tp=temas(pos,6),tn=temas(neg,6);
    if(tp.length||tn.length){
      h+='<div class="nv-tags" style="margin-top:14px">'
        +tp.map(function(x){return '<span class="nv-tag">'+esc(x)+'</span>';}).join('')
        +tn.map(function(x){return '<span class="nv-tag nv-tagneg">'+esc(x)+'</span>';}).join('')
        +'</div>';
    }
    var P=[];
    P.push('<b>'+n+' encontro'+(n>1?'s':'')+'</b> nesta modalidade, com <b>'+totResp+'</b> resposta'+(totResp===1?'':'s')
      +(taxa!=null?' de <b>'+totPart+'</b> participantes (<b>'+taxa+'%</b> de resposta)':'')+'.');
    P.push('Leitura poss\u00edvel: <b>'+pos.length+'</b> coment\u00e1rio(s) positivo(s) e <b>'+neg.length+'</b> ponto(s) de melhoria. '
      +'Os cards abaixo trazem o texto na \u00edntegra.');
    h+='<div class="nv-analise" style="margin-top:16px"><div class="nv-antitle">Leitura gerencial</div>'
      +P.map(function(x){return '<div class="nv-anp">'+x+'</div>';}).join('')+'</div>';
    return h+'</div>';
  }
  function renderHotseat(list){
    var host=$('nv-content');
    if(!list.length){host.innerHTML='<div class="nv-empty">Nenhum hot seat deste tipo ainda.<br><b>Suba um CSV</b> ou clique em Carregar exemplo (Renata + Iane).</div>';return;}
    var html='';
    var key=list.filter(function(e){return e.metricas.satisfacao;}).length?'satisfacao':list[0].mainKey;
    var _tipoLbl=(STATE.tipo==='hotseat_pre')?'Hot Seats Pré-PCE':'Hot Seats Pós-PCE';
    var _pn=hsPainel(list,key,_tipoLbl);
    var _rank=_pn.rank||[];
    html+=_pn.html||hsPainelSemNota(list,_tipoLbl);
    list.forEach(function(enc,i){
      var prev=i>0?list[i-1]:null,an=hsAnalysis(enc,prev);
      var main=hsMain(enc),col=main?scoreColor(main.avg,main.scaleMax):'var(--mut)';
      /* Participantes online do encontro (enc.total) x quem respondeu (enc.n). */
      var _hsTot=(enc.total!=null&&+enc.total>0)?+enc.total:null;
      var _hsRsp=(enc.n!=null&&+enc.n>0)?+enc.n:null;
      var _hsTaxa=(_hsTot&&_hsRsp)?Math.min(100,Math.round(_hsRsp/_hsTot*100)):null;
      var _hsStats='<div class="nv-imstats" style="max-width:430px;margin:0 0 14px">'
        +'<div class="nv-imstat">'+(isAdm()?'<button class="nv-statedit" data-edit-total="'+enc.id+'" title="Editar participantes">✎</button>':'')+'<div class="nv-imstat-n'+(_hsTot==null?' off':'')+'">'+(_hsTot!=null?_hsTot:'—')+'</div><div class="nv-imstat-l">Participantes online</div></div>'
        +'<div class="nv-imstat"><div class="nv-imstat-n'+(_hsRsp==null?' off':'')+'">'+(_hsRsp!=null?_hsRsp:'—')+'</div><div class="nv-imstat-l">Respostas</div></div>'
        +(_hsTaxa!=null?'<div class="nv-imstat"><div class="nv-imstat-n">'+_hsTaxa+'%</div><div class="nv-imstat-l">Taxa de resposta</div></div>':'')
        +'</div>'
        +(_hsTot==null?'<div class="nv-imstat-warn" style="text-align:left;margin:-6px 0 12px">Participantes online não informados — clique no ✎ para incluir.</div>':'');
      var circ=2*Math.PI*66,off=main?(circ-circ*(main.avg/main.scaleMax)):circ;
      var mrows=(enc.order||[]).map(function(k){var mm=enc.metricas&&enc.metricas[k];
        return (mm&&typeof mm.avg==='number'&&isFinite(mm.avg)&&mm.scaleMax)?barRow(mm.label||k,mm.avg,mm.scaleMax):'';}).join('');
      var _hsHero=main
        ? '<div class="nv-hero"><div class="nv-ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="66" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10"/><circle cx="75" cy="75" r="66" fill="none" stroke="'+col+'" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+off+'"/></svg><div class="nv-ringc"><div class="nv-ringn" style="color:'+col+'">'+fmt(main.avg)+'</div><div class="nv-ringl">'+String(main.label||'').split(' ')[0]+' · /'+main.scaleMax+'</div></div></div><div style="display:flex;flex-direction:column">'+mrows+'</div></div>'
        : (mrows?'<div class="nv-hero"><div style="display:flex;flex-direction:column;width:100%">'+mrows+'</div></div>':'')
          +'<div class="nv-imstat-warn" style="text-align:left;margin:0 0 12px">Pesquisa sem pergunta de nota em escala — sem anel de satisfação. Participação e comentários abaixo.</div>';
      var _posArr=enc.comentarios.positivos||[],_negArr=enc.comentarios.melhoria||[];
      var pos=cmBox(_posArr,false,'Sem comentários.');
      var neg=cmBox(_negArr,true,'Nenhum ponto de melhoria.');
      html+='<div class="nv-card"><div class="nv-enchead"><div><div class="nv-enctitle">'+(enc.mentor||'Encontro')+'</div><div class="nv-encmeta">'+(enc.turma||'')+' · '+(enc.tipo||'').replace('hotseat_pos','Hot Seat · Pós-PCE').replace('hotseat_pre','Hot Seat · Pré-PCE')+' · '+(enc.data_encontro||'')+(String(enc.id||'').indexOf('loc_')===0?' · <span class="nv-locbadge">SÓ NESTE NAVEGADOR</span>':'')+'</div></div>'+'<div class="nv-encacts"><button class="nv-encpng" data-png="'+enc.id+'" title="Baixar este relatório em PNG">\u2913 PNG</button>'+(isAdm()?'<button class="nv-encdel" data-del="'+enc.id+'">excluir</button>':'')+'</div></div>'+_hsStats+_hsHero+'<div class="nv-analise"><div class="nv-antitle">Análise automática</div>'+an.paras.map(function(p){return '<div class="nv-anp">'+p+'</div>';}).join('')+((an.temasPos.length||an.temasNeg.length)?'<div class="nv-tags">'+an.temasPos.map(function(x){return '<span class="nv-tag">'+x+'</span>';}).join('')+an.temasNeg.map(function(x){return '<span class="nv-tag nv-tagneg">'+x+'</span>';}).join('')+'</div>':'')+'</div><div class="nv-comments" style="margin-top:16px"><div>'+cmH('Positivos','#46d160',_posArr)+pos+'</div><div>'+cmH('Pontos de melhoria','#f5c542',_negArr)+neg+'</div></div></div>';
    });
    host.innerHTML=html;
    var canvas=$('nv-hs-cmp');
    if(canvas&&_rank.length){
      var keys=['satisfacao','relevancia','conteudo'],kc={satisfacao:'#f5a623',relevancia:'#46d160',conteudo:'rgba(234,229,225,.55)'};
      var present=keys.filter(function(k){return _rank.some(function(e){return e.metricas[k];});}),useKeys=present.length?present:[_rank[0].mainKey];
      /* Barras horizontais ORDENADAS POR DESEMPENHO (ranking) — não por data.
         Encontros de mentores diferentes não formam série temporal; ordenar por data sugeria
         uma "tendência" que não existe. */
      var _mediaRef=_pn.media;
      if(window.Chart)charts.push(new Chart(canvas,{type:'bar',
        data:{labels:_rank.map(function(e,i){return (i+1)+'\u00BA  '+(e.mentor||e.turma);}),
          datasets:useKeys.map(function(k){return {label:HS_LABELS[k]||k.replace('extra:',''),data:_rank.map(function(e){return e.metricas[k]?+e.metricas[k].avg.toFixed(2):null;}),backgroundColor:kc[k]||'#f5a623',borderRadius:3,maxBarThickness:14};})},
        options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
          plugins:{legend:{position:'top',align:'start',labels:{color:'#c9c9c4',usePointStyle:true,pointStyle:'rect',boxWidth:10,boxHeight:10,padding:12,font:{family:'Barlow',size:11}}},
            tooltip:{callbacks:{afterBody:function(c){var e=_rank[c[0].dataIndex];var m=e.metricas[key];return ['','Turma: '+(e.turma||'—')+(e.data_encontro?'  ·  '+e.data_encontro:''),'Notas altas: '+Math.round(m.topBox*100)+'%','Notas baixas: '+Math.round(m.lowBox*100)+'%','Respostas: '+(e.n||0)+(e.total?' de '+e.total+' participantes':'')];}}}},
          scales:{x:{beginAtZero:true,max:10,grid:{color:'rgba(255,255,255,.05)'},ticks:{color:'#7a7a76',stepSize:2},border:{color:'transparent'}},
                  y:{grid:{display:false},ticks:{color:'#c9c9c4',font:{size:11,weight:'700'}},border:{color:'rgba(255,255,255,.1)'}}}}}));
    }
  }

  /* ---------- tabs + ações ---------- */
  $('nv-subtabs').addEventListener('click',function(e){var b=e.target.closest('.nv-subtab');if(!b)return;STATE.tab=b.dataset.tab;[].forEach.call(this.children,function(c){c.classList.toggle('on',c===b);});$('nv-prepos').classList.toggle('hidden',STATE.tab!=='hotseat');try{syncDemoBtn();}catch(e){}render();});
  $('nv-prepos').addEventListener('click',function(e){var b=e.target.closest('.nv-pp');if(!b)return;STATE.tipo=b.dataset.tipo;[].forEach.call(this.children,function(c){c.classList.toggle('on',c===b);});render();});

  /* ─── Export PNG do card de hot seat ─────────────────────────────────────────
     Desenha o relatório em <canvas>, sem dependência externa (nada de CDN nova,
     nada de canvas "tainted"). As cores saem das CSS vars: em HOMOLOG o PNG sai
     âmbar, em PROD sai verde, sem nenhuma linha específica de ambiente aqui —
     o token swap continua sendo a única diferença entre os dois.
     Engenharia e fundação: Ronaldo Ferreira */
  var NPS_PNG_MAX_COMENTARIOS = 8;
  function _pngCss(n,f){try{var v=getComputedStyle(document.documentElement).getPropertyValue(n).trim();return v||f;}catch(e){return f;}}
  function _pngPlain(h){var d=document.createElement('div');d.innerHTML=String(h==null?'':h);return (d.textContent||'').replace(/\s+/g,' ').trim();}
  function _pngRR(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();}
  function _pngWrap(c,txt,maxW){var out=[],line='';String(txt).split(/\s+/).forEach(function(w){var t=line?line+' '+w:w;if(c.measureText(t).width>maxW&&line){out.push(line);line=w;}else line=t;});if(line)out.push(line);return out;}
  function _pngSlug(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();}

  async function npsExportPNG(id){
    var alvo=STATE.all.filter(function(e){return String(e.id)===String(id);})[0];
    if(!alvo||!alvo.metricas||!alvo.metricas[alvo.mainKey]){alert('Não encontrei os dados deste encontro para gerar o PNG.');return;}

    /* Mesma análise determinística do card — nada é reescrito para a imagem. */
    var lista=STATE.all.filter(function(e){return e.tipo===alvo.tipo;}).sort(byDate);
    var pos=lista.map(function(e){return String(e.id);}).indexOf(String(id));
    var an=hsAnalysis(alvo,pos>0?lista[pos-1]:null);

    /* Sem esperar a fonte, o canvas desenha com fallback e o PNG sai fora do padrão. */
    try{
      await document.fonts.load('800 78px "Barlow Condensed"');
      await document.fonts.load('700 26px "Barlow"');
      await document.fonts.load('italic 21px "Barlow"');
      await document.fonts.ready;
    }catch(e){}

    var W=1080,PAD=64,S=2,MAXH=6000;
    var cv=document.createElement('canvas');cv.width=W*S;cv.height=MAXH*S;
    var c=cv.getContext('2d');c.scale(S,S);
    var ls=('letterSpacing' in c);
    function sp(v){if(ls)c.letterSpacing=v;}
    var C={
      bg:_pngCss('--bg','#1A1A18'), card:_pngCss('--card','#252523'),
      g:_pngCss('--green','#f5a623'), g2:_pngCss('--green2','#3d2e0a'),
      cream:_pngCss('--cream','#EAE5E1'), mut:_pngCss('--muted','#adada8'),
      amber:_pngCss('--amber','#f5c542')
    };
    c.fillStyle=C.bg;c.fillRect(0,0,W,MAXH);
    c.textBaseline='alphabetic';

    var y=PAD+20;

    /* Cabeçalho de marca */
    c.font='800 26px "Barlow Condensed", Barlow, sans-serif';sp('5px');
    c.fillStyle=C.cream;c.fillText('PCE · 10 EM 12',PAD,y);
    c.font='700 15px Barlow, sans-serif';sp('3px');
    c.fillStyle=C.mut;c.textAlign='right';c.fillText('FEEDBACK DO ENCONTRO',W-PAD,y-2);
    c.textAlign='left';sp('0px');
    y+=26;c.fillStyle='rgba(234,229,225,.12)';c.fillRect(PAD,y,W-PAD*2,1);y+=54;

    /* Identificação */
    c.font='700 16px Barlow, sans-serif';sp('4px');
    c.fillStyle=C.g;c.fillText('AVALIAÇÃO DOS MENTORADOS',PAD,y);sp('0px');
    y+=56;
    c.font='800 76px "Barlow Condensed", Barlow, sans-serif';c.fillStyle=C.cream;
    _pngWrap(c,alvo.mentor||'Encontro',W-PAD*2).forEach(function(l){c.fillText(l,PAD,y);y+=74;});
    y+=4;
    c.font='500 22px Barlow, sans-serif';c.fillStyle=C.mut;
    var tipoLbl=String(alvo.tipo||'').replace('hotseat_pos','Hot Seat · Pós-PCE').replace('hotseat_pre','Hot Seat · Pré-PCE');
    c.fillText([alvo.turma,tipoLbl,alvo.data_encontro].filter(Boolean).join(' · '),PAD,y);
    y+=46;

    /* Anel + dimensões */
    var main=alvo.metricas[alvo.mainKey];
    var col=scoreColor(main.avg,main.scaleMax);
    var R=112,cx=PAD+R,cy=y+R;
    c.lineWidth=18;c.strokeStyle='rgba(255,255,255,.08)';
    c.beginPath();c.arc(cx,cy,R-9,0,Math.PI*2);c.stroke();
    var frac=Math.max(0,Math.min(1,main.avg/main.scaleMax));
    if(frac>0){c.strokeStyle=col;c.lineCap='round';c.beginPath();c.arc(cx,cy,R-9,-Math.PI/2,-Math.PI/2+Math.PI*2*frac);c.stroke();c.lineCap='butt';}
    c.textAlign='center';
    c.font='800 60px "Barlow Condensed", Barlow, sans-serif';c.fillStyle=col;
    c.fillText(fmt(main.avg),cx,cy+8);
    c.font='700 12px Barlow, sans-serif';c.fillStyle=C.mut;sp('3px');
    c.fillText(String(main.label.split(' ')[0]||'').toUpperCase()+' · /'+main.scaleMax,cx,cy+36);
    sp('0px');c.textAlign='left';

    var bx=PAD+R*2+46,bw=W-PAD-bx,by=y+26;
    (alvo.order||[]).forEach(function(k){
      var m=alvo.metricas[k];if(!m)return;
      c.font='600 23px Barlow, sans-serif';c.fillStyle=C.cream;c.fillText(m.label,bx,by);
      c.font='800 25px "Barlow Condensed", Barlow, sans-serif';c.fillStyle=scoreColor(m.avg,m.scaleMax);
      c.textAlign='right';c.fillText(fmt(m.avg),W-PAD,by);c.textAlign='left';
      by+=14;
      c.fillStyle='#2c2c29';_pngRR(c,bx,by,bw,12,6);c.fill();
      c.fillStyle=scoreColor(m.avg,m.scaleMax);
      _pngRR(c,bx,by,Math.max(8,bw*Math.max(0,Math.min(1,m.avg/m.scaleMax))),12,6);c.fill();
      by+=46;
    });
    y=Math.max(cy+R+14,by+4)+18;

    /* KPIs do encontro */
    var tot=(alvo.total!=null&&+alvo.total>0)?+alvo.total:null;
    var rsp=(alvo.n!=null&&+alvo.n>0)?+alvo.n:null;
    var kp=[];
    if(tot!=null)kp.push([String(tot),'PARTICIPANTES ONLINE']);
    if(rsp!=null)kp.push([String(rsp),'RESPOSTAS']);
    if(tot&&rsp)kp.push([Math.min(100,Math.round(rsp/tot*100))+'%','TAXA DE RESPOSTA']);
    else if(main.topBox!=null)kp.push([Math.round(main.topBox*100)+'%','NOTAS ALTAS']);
    if(kp.length){
      var gap=20,kw=(W-PAD*2-gap*(kp.length-1))/kp.length,kh=104;
      kp.forEach(function(k,i){
        var x=PAD+i*(kw+gap);
        c.fillStyle=C.card;_pngRR(c,x,y,kw,kh,18);c.fill();
        c.strokeStyle='rgba(234,229,225,.08)';c.lineWidth=1;_pngRR(c,x+0.5,y+0.5,kw-1,kh-1,18);c.stroke();
        c.font='800 44px "Barlow Condensed", Barlow, sans-serif';c.fillStyle=C.g;c.fillText(k[0],x+24,y+58);
        c.font='700 12px Barlow, sans-serif';c.fillStyle=C.mut;sp('2px');
        c.fillText(k[1],x+24,y+84);sp('0px');
      });
      y+=kh+30;
    }

    /* Análise automática — texto determinístico, igual ao do painel */
    var paras=(an.paras||[]).map(_pngPlain).filter(Boolean);
    if(paras.length){
      c.font='500 21px Barlow, sans-serif';
      var linhas=[];
      paras.forEach(function(p){_pngWrap(c,p,W-PAD*2-56).forEach(function(l){linhas.push(l);});linhas.push('');});
      if(linhas.length&&linhas[linhas.length-1]==='')linhas.pop();
      var ah=linhas.length*31+46;
      c.fillStyle=C.g2;_pngRR(c,PAD,y,W-PAD*2,ah,18);c.fill();
      c.fillStyle=C.cream;var ty=y+40;
      linhas.forEach(function(l){if(l)c.fillText(l,PAD+28,ty);ty+=31;});
      y+=ah+32;
    }

    /* Comentários — transcrição fiel, sem reescrita */
    function bloco(titulo,cor,arr,vazio){
      arr=arr||[];
      c.font='800 15px Barlow, sans-serif';c.fillStyle=cor;sp('3px');
      c.fillText(titulo.toUpperCase()+(arr.length?' ('+arr.length+')':''),PAD,y);sp('0px');
      y+=28;
      if(!arr.length){
        c.font='italic 20px Barlow, sans-serif';c.fillStyle=C.mut;
        c.fillText(vazio,PAD,y+18);y+=48;return;
      }
      arr.slice(0,NPS_PNG_MAX_COMENTARIOS).forEach(function(t){
        c.font='italic 21px Barlow, sans-serif';
        var ll=_pngWrap(c,'“'+_pngPlain(t)+'”',W-PAD*2-56);
        var bh=ll.length*30+30;
        c.fillStyle=C.card;_pngRR(c,PAD,y,W-PAD*2,bh,14);c.fill();
        c.fillStyle=cor;_pngRR(c,PAD,y,4,bh,2);c.fill();
        c.fillStyle=C.cream;var yy=y+30;
        ll.forEach(function(l){c.fillText(l,PAD+28,yy);yy+=30;});
        y+=bh+14;
      });
      if(arr.length>NPS_PNG_MAX_COMENTARIOS){
        c.font='500 18px Barlow, sans-serif';c.fillStyle=C.mut;
        c.fillText('+ '+(arr.length-NPS_PNG_MAX_COMENTARIOS)+' comentário(s) no painel',PAD,y+18);y+=38;
      }
      y+=16;
    }
    bloco('Positivos','#46d160',alvo.comentarios&&alvo.comentarios.positivos,'Sem comentários.');
    bloco('Pontos de melhoria',C.amber,alvo.comentarios&&alvo.comentarios.melhoria,'Nenhum ponto de melhoria.');

    /* Rodapé */
    y+=6;c.fillStyle='rgba(234,229,225,.12)';c.fillRect(PAD,y,W-PAD*2,1);y+=32;
    c.font='700 14px Barlow, sans-serif';c.fillStyle='#6f6d69';sp('3px');
    c.fillText('PCE · 10 EM 12 · FEBRACIS',PAD,y);
    c.textAlign='right';c.fillText(new Date().toLocaleDateString('pt-BR'),W-PAD,y);
    c.textAlign='left';sp('0px');
    y+=PAD-14;

    /* Recorta na altura real e baixa */
    var H=Math.min(MAXH,Math.ceil(y));
    var out=document.createElement('canvas');out.width=W*S;out.height=H*S;
    var o=out.getContext('2d');
    o.fillStyle=C.bg;o.fillRect(0,0,out.width,out.height);
    o.drawImage(cv,0,0,W*S,H*S,0,0,W*S,H*S);

    var nome=('nps-'+_pngSlug(alvo.mentor||'encontro')+'-'+_pngSlug(alvo.turma||'')+'-'+_pngSlug(alvo.data_encontro||'')).replace(/-+/g,'-').replace(/-+$/,'')+'.png';
    out.toBlob(function(b){
      if(!b){alert('Não foi possível gerar o PNG neste navegador.');return;}
      var u=URL.createObjectURL(b);
      var a=document.createElement('a');a.href=u;a.download=nome;
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      setTimeout(function(){URL.revokeObjectURL(u);},4000);
      if(window.Logger)Logger.info('NPS','PNG gerado',{encontro:alvo.mentor,arquivo:nome});
    },'image/png');
  }

  $('nv-content').addEventListener('click',async function(e){
    var ct=e.target.closest('[data-cmtoggle]');
    if(ct){var box=ct.parentNode;var open=box.classList.toggle('cm-open');ct.textContent=open?'Mostrar menos \u25b4':('Ver todos os '+ct.dataset.cmtoggle+' comentários \u25be');return;}
    var et=e.target.closest('[data-edit-total]');
    if(et){npsEditTotal(et.dataset.editTotal);return;}
    var pg=e.target.closest('[data-png]');
    if(pg){pg.disabled=true;var _lb=pg.textContent;pg.textContent='gerando…';try{await npsExportPNG(pg.dataset.png);}catch(err){if(window.Logger)Logger.warn('NPS','Falha ao gerar PNG',{err:err&&err.message});alert('Não foi possível gerar o PNG.');}pg.disabled=false;pg.textContent=_lb;return;}
    var d=e.target.closest('[data-del]');if(!d)return;
    if(confirm('Excluir?')){await deleteRow(d.dataset.del);STATE.imTurma=null;boot();}
  });
  function syncTabs(){[].forEach.call(document.querySelectorAll('.nv-subtab'),function(b){b.classList.toggle('on',b.dataset.tab===STATE.tab);});$('nv-prepos').classList.toggle('hidden',STATE.tab!=='hotseat');[].forEach.call(document.querySelectorAll('.nv-pp'),function(b){b.classList.toggle('on',b.dataset.tipo===STATE.tipo);});try{syncDemoBtn();}catch(e){}}

  /* ---------- modal ---------- */
  var PENDING=null,LAST_CSV='';var modal=$('nv-modal');
  var MENTORES=['Renata Rezende','Iane Parente','Ruben Farinello','Rafael Galdino','Dani Pires','Vinícius David','Ramon Pessoa','Tiago Zanini'];
  (function(){var sel=$('nv-m-mentor-sel');sel.innerHTML='<option value="">Selecione o mentor…</option>'+MENTORES.map(function(m){return '<option value="'+m+'">'+m+'</option>';}).join('')+'<option value="__outro">Outro…</option>';sel.addEventListener('change',function(){$('nv-m-mentor-other').style.display=sel.value==='__outro'?'':'none';});$('nv-m-tipo').addEventListener('change',function(){toggleFields();if(LAST_CSV)processFile(LAST_CSV);});})();
  function toggleFields(){var im=$('nv-m-tipo').value==='imersao';$('nv-m-mentor-fld').style.display=im?'none':'';$('nv-m-total-fld').style.display=im?'':'none';var pf=$('nv-m-presentes-fld');if(pf)pf.style.display=im?'none':'';}
  function mentorValue(){var s=$('nv-m-mentor-sel').value;return s==='__outro'?$('nv-m-mentor-other').value.trim():s;}
  function openModal(){modal.classList.add('on');$('nv-m-tipo').value=currentTipo()==='imersao'?'imersao':STATE.tipo;toggleFields();}
  function closeModal(){modal.classList.remove('on');PENDING=null;LAST_CSV='';$('nv-m-file').value='';$('nv-m-mentor-sel').value='';$('nv-m-mentor-other').value='';$('nv-m-mentor-other').style.display='none';var pv=$('nv-m-presentes');if(pv)pv.value='';$('nv-m-map-wrap').style.display='none';$('nv-m-confirm').disabled=true;}
  $('nv-btn-upload').onclick=openModal;$('nv-m-cancel').onclick=closeModal;modal.addEventListener('click',function(e){if(e.target===modal)closeModal();});
  $('nv-m-file').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;var rd=new FileReader();rd.onload=function(){LAST_CSV=rd.result;processFile(LAST_CSV);};rd.readAsText(f,'UTF-8');});
  function processFile(text){var warn=$('nv-m-warn');warn.textContent='';try{var rows=parseCSV(text);if(rows.length<2){warn.textContent='Arquivo sem respostas.';return;}var im=$('nv-m-tipo').value==='imersao';PENDING=im?analyzeImersao(rows):analyzeHotseat(rows);$('nv-m-map').innerHTML=PENDING.mapping.map(function(mp){var cls=mp.role==='scale'?'nv-r-scale':mp.role==='pos'?'nv-r-pos':mp.role==='neg'?'nv-r-neg':'nv-r-ignore';return '<div class="nv-maprow"><div class="nv-mapq" title="'+esc(mp.header)+'">'+(esc(mp.header)||'(sem título)')+'</div><div class="nv-maprole '+cls+'">'+mp.txt+'</div></div>';}).join('');$('nv-m-map-wrap').style.display='';var ok=im?(PENDING.recomenda!=null||PENDING.palestrantes.length||PENDING.experiencia.length):PENDING.order.length;$('nv-m-confirm').disabled=!ok;if(!ok)warn.textContent=im?'⚠ Nenhuma nota (0–10) detectada.':'⚠ Nenhuma coluna de nota detectada.';}catch(err){warn.textContent='Erro ao ler CSV: '+err.message;}}
  $('nv-m-confirm').onclick=async function(){if(!PENDING)return;var tipo=$('nv-m-tipo').value,turma=$('nv-m-turma').value.trim(),data=$('nv-m-data').value||new Date().toISOString().slice(0,10),row;
    if(PENDING._im){row={tipo:'imersao',turma:turma,label:turma,sub:'',data_encontro:data,resps:PENDING.n,total:+$('nv-m-total').value||null,recomenda:PENDING.recomenda,palestrantes:PENDING.palestrantes,experiencia:PENDING.experiencia,comentarios:PENDING.comentarios,created_by_name:'admin'};}
    else{row={tipo:tipo,turma:turma,mentor:mentorValue(),data_encontro:data,n_respostas:PENDING.n,total:+$('nv-m-presentes').value||null,metricas:PENDING.metricas,order:PENDING.order,mainKey:PENDING.mainKey,comentarios:PENDING.comentarios,created_by_name:'admin'};}
    var _saved=await insertRow(row);
    if(_saved&&_saved.__local){alert('ATENÇÃO: este encontro foi salvo APENAS neste navegador (localStorage) — NÃO foi para o Supabase.\n\nMotivo: '+(window.__npsLastErr||'desconhecido')+'\n\nOutras pessoas não vão ver este dado e ele some se o navegador for limpo. Verifique se você está logado com um usuário admin e suba a pesquisa novamente.');}
    closeModal();if(tipo==='imersao'){STATE.tab='imersao';STATE.imTurma=null;}else{STATE.tab='hotseat';STATE.tipo=tipo;}syncTabs();boot();};

  /* ---------- demo hot seats (Renata + Iane, dados reais) ---------- */
  var DEMO_RENATA='Carimbo de data/hora,Você ficou satisfeito com o encontro?,O encontro foi relevante e útil para sua empresa?,Quais foram os pontos mais importantes do encontro,Você ficou satisfeito com o conteúdo do encontro?,Nome (opcional)\n11/06/2026 11:39:42,5,5,Vibracao personagem coach,5,Regina Kerber\n11/06/2026 11:41:14,1,1,,1,\n11/06/2026 11:41:26,1,1,Esperava mais do encontro nao foi pratico ficou muito na conversa,1,\n11/06/2026 11:41:55,5,4,sugestoes de pontos a melhorar,4,Adair Carvalho\n11/06/2026 11:41:56,4,5,Excelencia construida por pequenas decisoes cultura,4,Abimael\n11/06/2026 11:42:38,2,2,Nao contribuiu com todos os presentes tema pouco amplo,2,\n11/06/2026 11:46:16,5,5,liberdade de comunicacao interatividade e cases reais,5,Marcio\n11/06/2026 11:55:23,3,2,As percepcoes da Renata,3,Marta\n11/06/2026 11:56:28,4,4,Situacoes chaves que abriram portas,5,Leandro\n11/06/2026 12:11:41,3,3,empresarios dando solucoes uns para os outros,3,Eliss\n11/06/2026 12:34:49,5,5,Escutar as empresas e dicas que cabem pra nos,5,Maria Jonilde\n11/06/2026 12:52:08,3,3,pensei que fosse mais implementacao do que conteudo,3,Luciana\n11/06/2026 14:22:09,5,5,Insights com a participacao dos alunos e dicas da Renata,5,Rosa\n11/06/2026 15:13:15,5,5,Troca de experiencia entre os alunos falar e ouvir,5,Vanessa\n12/06/2026 13:41:30,1,2,Pouco conteudo e muita conversa,2,\n12/06/2026 15:51:37,4,4,Estrategias para alavancar vendas,4,Marcos';
  var DEMO_IANE='Carimbo de data/hora,Você ficou satisfeito com o encontro?,O encontro foi relevante e útil para sua empresa?,Quais foram os pontos mais importantes do encontro,Quais foram os pontos negativos a melhorar do encontro,Você ficou satisfeito com o conteúdo do encontro?,Nome (opcional)\n25/06/2026 15:13:15,2,3,,ela perde muito o foco do assunto,2,Zaquiely\n25/06/2026 15:13:28,5,4,Resposta alinhada a realidade do negocio,,4,\n25/06/2026 15:15:07,5,5,Validacao de candidatos na entrevista contratar por vontade,enquete antes e mediador de perguntas,5,William\n25/06/2026 15:18:59,5,5,exemplos dos colegas proximos da nossa realidade,o tempo foi pouco para tantos assuntos,5,Daiane\n25/06/2026 15:54:19,5,4,expor os problemas da empresa,ela reconheceu que fala demais,4,Luiz\n25/06/2026 17:37:23,5,5,Conteudo,Nada,5,Mateus\n30/06/2026 21:57:38,5,5,Recrutamento e selecao,Nada a declarar,5,Sara';
  /* Exemplo (Renata + Iane): marcado com created_by_name='demo'.
     ANTES: cada clique inseria 2 linhas novas, sem checagem — 20 cliques viraram 40 encontros
     falsos poluindo o painel gerencial. AGORA é um TOGGLE idempotente e só admin:
     se o exemplo já existe, o botão remove; se não existe, insere uma única vez. */
  function nvDemoRows(){return (STATE.all||[]).filter(function(e){return e&&e.created_by_name==='demo';});}
  function syncDemoBtn(){
    var b=$('nv-btn-demo'); if(!b) return;
    var has=nvDemoRows().length;
    b.textContent=has?('Remover exemplo ('+has+')'):'Carregar exemplo (Renata + Iane)';
    b.style.display=(STATE.tab==='imersao'||!isAdm())?'none':'';
  }
  var _demoBusy=false;
  $('nv-btn-demo').onclick=async function(){
    if(_demoBusy) return;
    if(!isAdm()){alert('Apenas administradores podem carregar o exemplo.');return;}
    var ex=nvDemoRows();
    _demoBusy=true; this.disabled=true;
    try{
      if(ex.length){
        if(!confirm('Remover '+ex.length+' encontro(s) de exemplo?\n\nOs encontros reais não são afetados.')) return;
        for(var i=0;i<ex.length;i++){ await deleteRow(ex[i].id); }
      }else{
        var mk=function(csv,mentor,data){var a=analyzeHotseat(parseCSV(csv));return {tipo:'hotseat_pos',turma:'T14',mentor:mentor,data_encontro:data,n_respostas:a.n,metricas:a.metricas,order:a.order,mainKey:a.mainKey,comentarios:a.comentarios,created_by_name:'demo'};};
        await insertRow(mk(DEMO_RENATA,'Renata Rezende','2026-06-11'));
        await insertRow(mk(DEMO_IANE,'Iane Parente','2026-06-25'));
      }
      STATE.tab='hotseat';STATE.tipo='hotseat_pos';syncTabs();await boot();
    }finally{ _demoBusy=false; this.disabled=false; syncDemoBtn(); }
  };

  /* ---------- boot ---------- */
  /* Normaliza Hot Seats para apresentação em escala 0–10 (notas coletadas em 0–5 são reescaladas ×2).
     Também resolve enc.n a partir de n_respostas ao recarregar do banco. Não toca imersão (0–10). */
  function normalizeHS(list){list.forEach(function(e){if(!e||!e.metricas)return;if(e.n==null&&e.n_respostas!=null)e.n=e.n_respostas;if(e.__norm10)return;Object.keys(e.metricas).forEach(function(k){var m=e.metricas[k];if(m&&+m.scaleMax===5){m.avg=m.avg*2;m.scaleMax=10;}});e.__norm10=true;});}
  async function boot(){STATE.all=await listAll();normalizeHS(STATE.all);render();try{syncDemoBtn();}catch(e){}}
  $('nv-m-data').value=new Date().toISOString().slice(0,10);
  syncTabs();boot();
  document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,60);}); // Chart.js (defer) já carregado
  var nav=$('nav-nps');if(nav)nav.addEventListener('click',function(){setTimeout(boot,150);});
  setTimeout(boot,2600); // repega dados quando o Supabase terminar de inicializar
})();
