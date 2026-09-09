/* PCE 2.0 · 13-fb-board
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
(function(){
  var C={arch:'#6366f1',data:'#f59e0b',rules:'#0d9488',flow:'#7c3aed',trigger:'#8b5cf6',decision:'#e11d48',yes:'#059669',no:'#e11d48',defer:'#d97706',human:'#ea580c',slate:'#64748b',dark:'#0f172a',yellow:'#eab308'};
  var SWA=[C.dark,C.slate,C.arch,C.data,C.rules,C.flow,C.trigger,C.decision,C.yes,C.no,C.defer,C.human,C.yellow];
  function lf(t,c){return {title:t,c:c,type:'leaf'};}
  var FLOW_SEED={type:'root',title:'PCE · Automação de Onboarding',eyebrow:'Base do projeto',c:C.dark,children:[
    {type:'hub',title:'Base Técnica do Projeto',eyebrow:'Arquitetura',c:C.slate,children:[
      {type:'cat',title:'Arquitetura de Integração',eyebrow:'Trilha',c:C.arch,children:[
        {type:'cond',title:'Sistemas envolvidos',c:C.arch,children:[
          lf('Salesforce — origem da venda e status',C.arch),lf('Avalon — motor de IA e orquestrador do fluxo',C.arch),
          lf('Typeform — coleta de dados de onboarding',C.arch),lf('WhatsApp — canal de comunicação',C.arch),lf('Base Google — apoio de dados',C.arch)]},
        {type:'cond',title:'Chave única',c:C.arch,children:[
          lf('CPF como identificador universal em toda a jornada',C.arch),lf('Consulta de status no Salesforce por CPF',C.arch),
          lf('Consulta de status no Typeform por CPF',C.arch),lf('Conciliação e sincronização de dados entre sistemas',C.arch)]},
        {type:'cond',title:'Mecanismos técnicos',c:C.arch,children:[
          lf('Webhook para receber eventos do Typeform em tempo real',C.arch),lf('Polling como verificação periódica alternativa',C.arch),
          lf('Cruzamento Salesforce × Typeform por CPF',C.arch)]}]},
      {type:'cat',title:'Dados & Variáveis Dinâmicas',eyebrow:'Trilha',c:C.data,children:[
        lf('Nome do cliente',C.data),lf('CPF',C.data),lf('Número da turma',C.data),lf('Data da turma',C.data),
        lf('Status da venda no Salesforce',C.data),lf('Status de resposta do Typeform',C.data),lf('Resposta sobre participação na turma',C.data)]},
      {type:'cat',title:'Regras de Negócio',eyebrow:'Trilha',c:C.rules,children:[
        lf('Disparo condicionado ao status da venda',C.rules),lf('CPF como chave-mestra em toda a jornada',C.rules),
        lf('Régua interrompida ao detectar formulário respondido',C.rules),lf('Link de transferência só após negativa explícita',C.rules),
        lf('Suporte humano disponível em todos os pontos',C.rules)]}]},
    {type:'hub',title:'Fluxo de Automação',eyebrow:'Onboarding PCE',c:C.flow,children:[
      {type:'cat',title:'Gatilho de Entrada',eyebrow:'Início',c:C.trigger,children:[
        {type:'cond',title:'Venda APROVADA detectada no Salesforce',c:C.trigger,children:[
          lf('Planilha Base · Origem — Matriculados PCE Turmas',C.trigger),lf('OU Relatório SF — Funil PCE Integral (Onboarding)',C.trigger)]},
        lf('Identificação por CPF e por TURMA (ex.: T13–T16)',C.trigger)]},
      {type:'decision',title:'Decisão 1 · Status da venda no Salesforce',eyebrow:'Decisão 01',c:C.decision,children:[
        {type:'cond',title:'Se status = Aprovado → verificar data da turma',c:C.yes}]},
      {type:'decision',title:'Decisão 2 · Data da turma',eyebrow:'Decisão 02',c:C.decision,children:[
        {type:'cond',title:'Se TURMA FUTURA',c:C.defer,children:[
          lf('Boas-vindas personalizado + data específica',C.defer),lf('Informar que haverá novo contato próximo ao evento',C.defer),
          lf('Programar lembrete de início quando a turma ficar atual',C.defer),lf('Oferecer botão "falar com CS"',C.defer)]},
        {type:'cond',title:'Se TURMA VIGENTE',c:C.yes,children:[
          lf('Enviar saudação imediata',C.yes),lf('Enviar link do Typeform de Onboarding',C.yes),
          lf('Enviar documento / manual de boas-vindas',C.yes),lf('Seguir para monitoramento do Typeform',C.yes)]},
        {type:'note',title:'Fluxo alternativo a ser discutido tecnicamente com Deivith',eyebrow:'Obs.',c:C.yellow}]},
      {type:'decision',title:'Decisão 3 · Monitoramento do Typeform via Avalon',eyebrow:'Decisão 03',c:C.decision,children:[
        {type:'cond',title:'Se NÃO respondeu',c:C.no,children:[
          lf('Entrar em loop de régua de ativação',C.no),lf('Lembrete após 3 dias; novo lembrete até a data-limite do CS',C.no),
          lf('Manter cobrança até detecção de resposta pelo CPF',C.no),lf('Interromper régua automaticamente ao identificar resposta',C.no)]},
        {type:'cond',title:'Se RESPONDEU',c:C.yes,children:[
          lf('Avalon analisa: "Confirma sua presença na data xx/xx?"',C.yes),lf('Seguir para decisão de participação',C.yes)]}]},
      {type:'decision',title:'Decisão 4 · Resposta de participação',eyebrow:'Decisão 04',c:C.decision,children:[
        {type:'cond',title:'Resposta = SIM',c:C.yes,children:[
          lf('Encerrar fluxo de onboarding',C.yes),lf('Enviar guia logístico e informações finais do evento',C.yes),
          {type:'human',title:'Transbordo humano — botão "falar com atendente / CS"',c:C.human}]},
        {type:'cond',title:'Resposta = NÃO',c:C.no,children:[
          lf('IA identifica desistência ou impedimento',C.no),lf('Enviar mensagem de lamento pela ausência',C.no),
          lf('Enviar automaticamente link de transferência para outra data',C.no),lf('Regra: exibir link somente após negativa explícita',C.no),
          lf('Regra: restringir à turma atual informada no formulário',C.no),
          {type:'human',title:'Transbordo humano — botão "falar com atendente / CS"',c:C.human}]}]}]}
  ]};

  var CARDW=240,COLW=300,ROWGAP=15;
  function esc(s){return (s||'').replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}
  function isAdmin(){return (typeof authIsAdmin!=='function')||authIsAdmin();}

  function fbExtract(data){
    var days=(data&&data.days)||[];
    for(var i=0;i<days.length;i++){var bl=days[i].blocks||[];for(var j=0;j<bl.length;j++){if(bl[j]&&bl[j].kind==='flow-canvas'&&bl[j].tree)return bl[j].tree;}}
    return null;
  }
  function fbClean(n){var o={type:n.type,title:n.title};if(n.eyebrow)o.eyebrow=n.eyebrow;if(n.c)o.c=n.c;if(n.children&&n.children.length)o.children=n.children.map(fbClean);return o;}
  function fbBlock(tree){return {kind:'flow-canvas',icon:'\uD83D\uDDFA\uFE0F',title:'Mapa do Fluxo de Onboarding',desc:'Mapa interativo — abra no dashboard atualizado para visualizar e editar.',tree:fbClean(tree)};}

  // captura no salvamento do Manual: troca days_json pelo bloco do board
  window.__fbCaptureForSave=function(id,data){
    if(data&&data._fbWork){data.days=[{label:'Mapa',blocks:[fbBlock(data._fbWork)]}];if(data.desc===undefined)data.desc='';}
  };

  function fbBuildShell(tree,editing){
    var shell=document.createElement('div');shell.className='fb-shell'+(editing?' editing':'');
    shell.innerHTML='<div class="fb-viewport"><div class="fb-canvas"><svg class="fb-edges"></svg><div class="fb-nodes"></div></div></div>'
      +'<div class="fb-top"><div class="fb-kick">Manual · Automação</div><div class="fb-h1">Fluxo de Onboarding — PCE</div></div>'
      +'<div class="fb-editbadge">\u270E Editando — clique num card</div>'
      +'<div class="fb-legend"></div>'
      +'<div class="fb-ctrl"><button class="fb-btn fb-fit" title="Enquadrar">&#10530;</button><button class="fb-btn fb-zo">&#8722;</button><button class="fb-btn fb-zi">+</button></div>'
      +'<div class="fb-hint">'+(editing?'clique num card para editar · use o inspetor para adicionar/remover':'arraste para mover · scroll = zoom · clique nos núcleos para recolher')+'</div>'
      +'<aside class="fb-insp"><h4>Editar card <span class="fb-insp-x">\u2715</span></h4><div class="bd">'
      +'<div><label>Tipo</label><select class="fb-f-type"><option value="leaf">Item</option><option value="cond">Condição / ramo</option><option value="cat">Categoria</option><option value="decision">Decisão</option><option value="hub">Núcleo</option><option value="human">Transbordo humano</option><option value="note">Observação</option><option value="root">Raiz</option></select></div>'
      +'<div><label>Rótulo (acima do título)</label><input class="fb-f-eye" placeholder="opcional"></div>'
      +'<div><label>Título</label><textarea class="fb-f-title"></textarea></div>'
      +'<div><label>Cor</label><div class="fb-sws"></div></div>'
      +'<div class="fb-acts"><button class="fb-a-child">\uFF0B Filho</button><button class="fb-a-sib">\uFF0B Irmão</button><button class="fb-a-del dng">\uD83D\uDDD1 Excluir</button></div>'
      +'</div></aside>';
    requestAnimationFrame(function(){fbRender(shell,tree,editing);});
    return shell;
  }

  function fbRender(shell,tree,editing){
    var vp=shell.querySelector('.fb-viewport'),canvas=shell.querySelector('.fb-canvas'),
        svg=shell.querySelector('.fb-edges'),nodesEl=shell.querySelector('.fb-nodes');
    var scale=1,tx=0,ty=0,CB={minX:0,minY:0,maxX:1,maxY:1},selected=null;
    var insp=shell.querySelector('.fb-insp');
    var LEG=[['Arquitetura',C.arch],['Dados',C.data],['Regras',C.rules],['Decisão',C.decision],['Sim / ativo',C.yes],['Não / parado',C.no],['Adiar',C.defer],['Humano',C.human]];
    shell.querySelector('.fb-legend').innerHTML=LEG.map(function(x){return '<span class="fb-li"><i style="background:'+x[1]+'"></i>'+x[0]+'</span>';}).join('');

    function buildDOM(){
      nodesEl.innerHTML='';
      (function build(n,parent){
        n.el=document.createElement('div');n.parent=parent;n.el.className='fb-node '+n.type;n.el.style.setProperty('--c',n.c||'#94a3b8');n.el.__node=n;
        n.el.innerHTML=(n.eyebrow?'<div class="fb-eye">'+esc(n.eyebrow)+'</div>':'')+'<div class="fb-tt">'+esc(n.title)+'</div>';
        nodesEl.appendChild(n.el);
        if(n.children&&n.children.length){
          var t=document.createElement('div');t.className='fb-tog';t.textContent=n.collapsed?'+':'\u2212';
          t.addEventListener('pointerdown',function(e){e.stopPropagation();});
          t.addEventListener('click',function(e){e.stopPropagation();n.collapsed=!n.collapsed;layout();});
          n.el.appendChild(t);n.tog=t;
          n.children.forEach(function(c){build(c,n);});
        }
      })(tree,null);
      (function meas(n){n.h=n.el.offsetHeight;(n.children||[]).forEach(meas);})(tree);
    }
    function layout(){
      var cursor=0,edges=[];
      (function hide(n){n.vis=false;(n.children||[]).forEach(hide);})(tree);
      (function place(n,d){n.vis=true;n.x=d*COLW;var kids=n.collapsed?[]:(n.children||[]);
        if(!kids.length){n.y=cursor+n.h/2;cursor+=n.h+ROWGAP;}
        else{kids.forEach(function(k){place(k,d+1);edges.push([n,k]);});n.y=(kids[0].y+kids[kids.length-1].y)/2;}
      })(tree,0);
      var minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
      (function pos(n){if(n.vis){n.el.style.display='block';n.el.style.left=n.x+'px';n.el.style.top=(n.y-n.h/2)+'px';if(n.tog)n.tog.textContent=n.collapsed?'+':'\u2212';
        minX=Math.min(minX,n.x);minY=Math.min(minY,n.y-n.h/2);maxX=Math.max(maxX,n.x+CARDW);maxY=Math.max(maxY,n.y+n.h/2);}else n.el.style.display='none';
        (n.children||[]).forEach(pos);})(tree);
      CB={minX:minX,minY:minY,maxX:maxX,maxY:maxY};
      var p='';for(var i=0;i<edges.length;i++){var a=edges[i][0],b=edges[i][1],x1=a.x+CARDW,y1=a.y,x2=b.x,y2=b.y,mx=(x1+x2)/2;
        p+='<path d="M'+x1+','+y1+' C'+mx+','+y1+' '+mx+','+y2+' '+x2+','+y2+'" fill="none" stroke="'+(b.c||'#cbd3e0')+'" stroke-width="2" stroke-opacity=".55"/>';}
      svg.innerHTML=p;
    }
    function apply(){canvas.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';}
    function fit(){var pad=46,W=vp.clientWidth||820,H=vp.clientHeight||520,w=CB.maxX-CB.minX,h=CB.maxY-CB.minY;
      if(w<=0||h<=0)return;scale=Math.min((W-pad*2)/w,(H-pad*2)/h,1.05);if(!isFinite(scale)||scale<=0)scale=0.5;
      tx=(W-w*scale)/2-CB.minX*scale;ty=(H-h*scale)/2-CB.minY*scale;apply();}
    function zoomAt(cx,cy,f){var ns=Math.min(2.4,Math.max(.1,scale*f)),k=ns/scale;tx=cx-(cx-tx)*k;ty=cy-(cy-ty)*k;scale=ns;apply();}

    function selectNode(n){
      if(selected&&selected.el)selected.el.classList.remove('sel');
      selected=n;
      if(!n){insp.classList.remove('show');return;}
      if(n.el)n.el.classList.add('sel');
      insp.classList.add('show');
      fType.value=n.type;fEye.value=n.eyebrow||'';fTitle.value=n.title||'';
      Array.prototype.forEach.call(fSws.children,function(s){s.classList.toggle('on',s.dataset.c===(n.c||''));});
    }
    function rebuild(){buildDOM();layout();if(selected)selectNode(selected);}

    var fType,fEye,fTitle,fSws;
    if(editing){
      fType=insp.querySelector('.fb-f-type');fEye=insp.querySelector('.fb-f-eye');fTitle=insp.querySelector('.fb-f-title');fSws=insp.querySelector('.fb-sws');
      fSws.innerHTML=SWA.map(function(c){return '<span class="fb-sw" data-c="'+c+'" style="background:'+c+'"></span>';}).join('');
      insp.querySelector('.fb-insp-x').addEventListener('click',function(){selectNode(null);});
      fTitle.addEventListener('input',function(){if(!selected)return;selected.title=fTitle.value;var tt=selected.el.querySelector('.fb-tt');if(tt)tt.textContent=fTitle.value;selected.h=selected.el.offsetHeight;layout();});
      fEye.addEventListener('input',function(){if(!selected)return;selected.eyebrow=fEye.value||undefined;rebuild();});
      fType.addEventListener('change',function(){if(!selected)return;selected.type=fType.value;rebuild();});
      fSws.addEventListener('click',function(e){var s=e.target.closest('.fb-sw');if(!s||!selected)return;selected.c=s.dataset.c;rebuild();});
      insp.querySelector('.fb-a-child').addEventListener('click',function(){if(!selected)return;selected.children=selected.children||[];selected.collapsed=false;var c={type:'leaf',title:'Novo item',c:selected.c};selected.children.push(c);rebuild();selectNode(c);});
      insp.querySelector('.fb-a-sib').addEventListener('click',function(){if(!selected||!selected.parent){alert('A raiz não tem irmão.');return;}var p=selected.parent,i=p.children.indexOf(selected),c={type:selected.type,title:'Novo item',c:selected.c};p.children.splice(i+1,0,c);rebuild();selectNode(c);});
      insp.querySelector('.fb-a-del').addEventListener('click',function(){if(!selected){return;}if(!selected.parent){alert('Não dá para excluir a raiz.');return;}if(!confirm('Excluir este card e tudo abaixo dele?'))return;var p=selected.parent;p.children.splice(p.children.indexOf(selected),1);if(!p.children.length)delete p.children;selectNode(null);rebuild();});
    }

    buildDOM();layout();fit();

    vp.addEventListener('wheel',function(e){e.preventDefault();var r=vp.getBoundingClientRect();zoomAt(e.clientX-r.left,e.clientY-r.top,e.deltaY<0?1.12:1/1.12);},{passive:false});
    var drag=false,moved=false,sx0,sy0,tx0,ty0,downEl=null;
    vp.addEventListener('pointerdown',function(e){drag=true;moved=false;downEl=e.target.closest('.fb-node');sx0=e.clientX;sy0=e.clientY;tx0=tx;ty0=ty;vp.classList.add('drag');try{vp.setPointerCapture(e.pointerId);}catch(_){}});
    vp.addEventListener('pointermove',function(e){if(!drag)return;var dx=e.clientX-sx0,dy=e.clientY-sy0;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;tx=tx0+dx;ty=ty0+dy;apply();});
    function endd(){if(editing&&drag&&!moved){if(downEl&&downEl.__node)selectNode(downEl.__node);else selectNode(null);}drag=false;vp.classList.remove('drag');}
    vp.addEventListener('pointerup',endd);vp.addEventListener('pointercancel',endd);
    shell.querySelector('.fb-zi').addEventListener('click',function(){var r=vp.getBoundingClientRect();zoomAt(r.width/2,r.height/2,1.2);});
    shell.querySelector('.fb-zo').addEventListener('click',function(){var r=vp.getBoundingClientRect();zoomAt(r.width/2,r.height/2,1/1.2);});
    shell.querySelector('.fb-fit').addEventListener('click',fit);
    var hint=shell.querySelector('.fb-hint');setTimeout(function(){hint.style.opacity='0';},4500);
    if(window.ResizeObserver){var ro=new ResizeObserver(function(){fit();});ro.observe(vp);}
  }

  window.__fbMaybeRender=function(data,root){
    var modal=document.getElementById('mpce-modal');
    var base=fbExtract(data)||(/fluxo de onboarding/i.test((data&&data.title)||'')?FLOW_SEED:null);
    if(modal)modal.classList.toggle('fb-wide',!!base);
    if(!base)return false;
    var editing=!!window._mpceEditing&&isAdmin();
    var tree;
    if(editing){ if(!data._fbWork)data._fbWork=JSON.parse(JSON.stringify(base)); tree=data._fbWork; }
    else { data._fbWork=null; tree=JSON.parse(JSON.stringify(base)); }
    root.appendChild(fbBuildShell(tree,editing));
    return true;
  };
})();
