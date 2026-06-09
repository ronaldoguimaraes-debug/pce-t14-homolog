// ═══════════════════════════════════════════════════════════
// [PCE] DASH-T15-COMPLETO.gs
// Versão: 1.5  (1.4 + readDossie() implementado: lê a aba "Typeforme - T15")
// ───────────────────────────────────────────────────────────
// NOVIDADE NA v1.5:
//   • readDossie() agora LÊ a aba "Typeforme - T15" e devolve os campos do
//     dossiê (gênero, empresa, cidade/estado, modelo de negócio, tipo de
//     cliente, MVV, avaliação 0–10, religião, cônjuge, filhos, frase, etc.).
//   • Colunas localizadas POR CABEÇALHO (não por índice fixo), então não
//     quebra se a ordem das perguntas do Typeform mudar.
//   • O join por CPF no buildPayload já existia — agora enche os campos do
//     Perfil da Turma. O dashboard filtra confirmados+PREENCHIDO no front.
//
// HISTÓRICO v1.1–1.4 (transferências automáticas):
//   • Lê a PLANILHA DE TRANSFERÊNCIAS por ID e devolve pendingTransfers.
//
// DIFERENÇAS EM RELAÇÃO À T14:
//   1) Lê o SPREADSHEET DA T15 ('1f4cjdbg...').
//   2) Abas POR NOME ('Onboarding T15' / 'Matriculados - T15' / 'Typeforme - T15').
//   3) Onboarding T15: CONTRATO no índice 14, E-MAIL no 9.
// ═══════════════════════════════════════════════════════════

// ── Planilha de transferências (a mesma do CSV) ──
var TRANSFER_SHEET_ID = '1bEu_7HaJ1v9HaNJ-OmN0TK5RHTcdsPoLiOLNTXKDySE';
var TRANSFER_GID      = 2128009395;     // aba "Transferencia 2026" (por GID)
// A coluna "Turma destino" guarda DATAS (ex.: 01/08/2026). Casamos por mês+ano.
var TURMA_MES = 8;                      // T15 = agosto (1-12).  Na T16 use 11 (novembro).
var TURMA_ANO = 2026;

function doGet(e) {
  const callback = e.parameter.callback || '';
  try {
    const payload = JSON.stringify(buildPayload());
    return respond(callback, payload, true);
  } catch(err) {
    return respond(callback, JSON.stringify({ error: err.message }), true);
  }
}

function buildPayload() {
  const SHEET_ID = '1f4cjdbgGMsaXoFoY8pardtkE51nEuVXRh9BQ8VwFOfc'; // <-- planilha da T15
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const gestao       = readGestao(ss);
  const dossie       = readDossie(ss);
  const matriculados = readMatriculados(ss);

  const idxDossie = {};
  dossie.rows.forEach(r => { if (r.cpf) idxDossie[r.cpf] = r; });  // last-entry-wins

  const idxMat = {};
  matriculados.rows.forEach(r => { if (r.cpf) idxMat[r.cpf] = r; });

  const rowsEnriquecidos = gestao.rows.map(r => {
    const d = idxDossie[r.cpf] || {};
    const m = idxMat[r.cpf]    || {};
    return {
      tipo:r.tipo, evento:r.evento, nome:r.nome, cpf:r.cpf,
      presenca:r.presenca, onboarding:r.onboarding,
      whats:r.whats, data:r.data, typeform:r.typeform, contrato:r.contrato,
      nomePrefGestao:r.nomePrefGestao||'',
      empresaGestao:r.empresaGestao||'',
      telefone:r.telefone||'',
      email:r.email||'',
      grupoWhats:r.grupoWhats||'',
      perfilComport:r.perfilComport||'',
      perfil:r.perfil||'',
      localVendaGestao:r.localVendaGestao||'',
      promocaoGestao:r.promocaoGestao||'',
      // ── Dossiê (agora populado pelo readDossie) ──
      genero:d.genero||'', dtNascDossie:d.dtNasc||'', empresa:d.empresa||'',
      frase:d.frase||'', nomePref:d.nomePref||'', cidadeEst:d.cidadeEst||'',
      modeloNeg:d.modeloNeg||'', tipoCliente:d.tipoCliente||'', mvv:d.mvv||'',
      avaliacao:d.avaliacao||'', religiao:d.religiao||'', conjuge:d.conjuge||'',
      conjugeTrab:d.conjugeTrab||'', filhos:d.filhos||'', alergia:d.alergia||'',
      redesSoc:d.redesSoc||'', aprender:d.aprender||'', outrosPart:d.outrosPart||'',
      problemas:d.problemas||'', metas:d.metas||'', sonho:d.sonho||'',
      submittedAt:d.submittedAt||'',
      // ── Dossiê — campos de gestão/estrutura lidos pelos cards do Insights ──
      confirmacao:d.confirmacao||'', nivelIA:d.nivelIA||'', numColabs:d.numColabs||'',
      organograma:d.organograma||'', canalAquisicao:d.canalAquisicao||'',
      centralizacao:d.centralizacao||'', desafioGestao:d.desafioGestao||'',
      // ── Análises (Perfil/Insights): SOMENTE dossiê (Typeforme - T15) ──
      faixaFat:_normFaixaFat(d.faixaFatDossie)||'',
      faixaEt:_faixaEtFromDt(d.dtNasc)||'',
      setor:d.modeloNeg||'',
      cidade:_cidadeFromText(d.cidadeEst)||'',
      estado:_ufFromText(d.cidadeEst)||'',
      sexo:d.genero||'',
      aprenderPCE:d.aprender||'',
      // ── Comerciais (somente Dashboard): origem/valor de Matriculados.
      //    NÃO entram em nenhuma análise de perfil/insights. ──
      origem:m.origem||'', unidade:m.unidade||'', atendente:m.atendente||'',
      valor:m.valor||0, promocao:m.promocao||'', localVd:m.localVd||'',
      dtFech:m.dtFech||'', dtPag:m.dtPag||'',
    };
  });

  const perfilStats = buildPerfilStats(rowsEnriquecidos);

  // ── "A transferir" (automático, da planilha de transferências) ──
  const pendingTransfers = readPendingTransfers();

  return {
    version:'T15-1.8', rows:rowsEnriquecidos, total:rowsEnriquecidos.length,
    // ↓↓↓ campos lidos pelo dashboard (normalizeBrPayload) ↓↓↓
    pendingTransfers: pendingTransfers,
    pendingTransferCount: pendingTransfers.length,
    stats:{
      presenca:gestao.stats.presenca, onboarding:gestao.stats.onboarding,
      operacional:gestao.stats.operacional, eventos:gestao.stats.eventos,
      perfil:perfilStats,
      financeiro:matriculados.stats.financeiro, origem:matriculados.stats.origem,
      setor:matriculados.stats.setor, estado:matriculados.stats.estado,
      cidade:matriculados.stats.cidade, atendente:matriculados.stats.atendente,
      unidade:matriculados.stats.unidade, faixaFat:matriculados.stats.faixaFat,
      faixaEt:matriculados.stats.faixaEt, sexo:matriculados.stats.sexo,
      localVenda:matriculados.stats.localVenda, promocao:matriculados.stats.promocao,
      tipoMat:matriculados.stats.tipoMat,
    },
    updated:new Date().toISOString()
  };
}

function normCpf(v) {
  const d = (v||'').toString().replace(/\D/g,'');
  return d.length >= 10 ? d.padStart(11,'0') : d;
}

// ─────────────────────────────────────────────────────────────
// Normalização de campos do DOSSIÊ para o formato que o dash espera
// (usados como fallback quando Matriculados está vazio — caso T15)
// ─────────────────────────────────────────────────────────────
var _UF_NOMES = {
  'acre':'AC','alagoas':'AL','amapa':'AP','amazonas':'AM','bahia':'BA','ceara':'CE',
  'distrito federal':'DF','espirito santo':'ES','goias':'GO','maranhao':'MA',
  'mato grosso do sul':'MS','mato grosso':'MT','minas gerais':'MG','para':'PA',
  'paraiba':'PB','parana':'PR','pernambuco':'PE','piaui':'PI','rio de janeiro':'RJ',
  'rio grande do norte':'RN','rio grande do sul':'RS','rondonia':'RO','roraima':'RR',
  'santa catarina':'SC','sao paulo':'SP','sergipe':'SE','tocantins':'TO'
};
var _UF_SIGLAS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MS','MT','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

function _semAcento(s){ return (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }

function _ufFromText(s){
  if(!s) return '';
  var raw = s.toString().trim();
  var m = raw.match(/[\/\-\s,]([A-Za-z]{2})\s*$/);           // "Curitiba PR", "Curitiba/PR"
  if(m){ var uf=m[1].toUpperCase(); if(_UF_SIGLAS.indexOf(uf)>=0) return uf; }
  var n = _semAcento(raw);                                    // nome por extenso
  for(var k in _UF_NOMES){ if(n.indexOf(k)>=0) return _UF_NOMES[k]; }
  return '';
}

function _cidadeFromText(s){
  if(!s) return '';
  var raw = s.toString().trim().replace(/[\/\-\s,]+[A-Za-z]{2}\s*$/,'').trim();
  return raw || s.toString().trim();
}

function _faixaEtFromDt(dt){
  if(!dt) return '';
  var m = dt.toString().match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if(!m) return '';
  var idade = new Date().getFullYear() - parseInt(m[3],10);
  if(idade < 30) return 'Até 29 anos';
  if(idade < 40) return '30–39 anos';
  if(idade < 50) return '40–49 anos';
  if(idade < 60) return '50–59 anos';
  return '60+ anos';
}

// Converte "<num> <escala>" (mil/milhão/bilhão) em reais
function _valorReais(base){
  var m = base.match(/([\d.,]+)\s*(bilho|milho|mil)/);
  if(!m){ var only = base.match(/r\$\s*([\d.,]+)/); if(only){ return parseFloat(only[1].replace(/\./g,'').replace(',','.'))||0; } return 0; }
  var num = parseFloat(m[1].replace(/\./g,'').replace(',','.'))||0;
  if(m[2].indexOf('bilho')>=0) return num*1e9;
  if(m[2].indexOf('milho')>=0) return num*1e6;
  return num*1e3; // 'mil'
}

// Faixa de faturamento do dossiê → bucket ANUAL do formato Matriculados
function _normFaixaFat(s){
  if(!s) return '';
  var txt = s.toString();
  var par = txt.match(/\(([^)]*ano[^)]*)\)/i);   // prefere a parte "(... /ano)"
  var base = _semAcento(par ? par[1] : txt);
  var v = _valorReais(base);
  if(v <= 0) return '';
  if(v <= 81000)     return 'ATE R$ 81.000,00';
  if(v <= 360000)    return 'DE R$ 81.000,01 A R$ 360.000,00';
  if(v <= 1500000)   return 'DE R$ 360.000,01 A R$ 1.500.000,00';
  if(v <= 4800000)   return 'DE R$ 1.500.000,01 A R$ 4.800.000,00';
  if(v <= 10000000)  return 'DE R$ 4.800.000,01 A R$ 10.000.000,00';
  if(v <= 30000000)  return 'DE R$ 10.000.000,01 A R$ 30.000.000,00';
  if(v <= 100000000) return 'DE R$ 30.000.000,01 A R$ 100.000.000,00';
  if(v <= 300000000) return 'DE R$ 100.000.000,01 A R$ 300.000.000,00';
  if(v <= 500000000) return 'DE R$ 300.000.000,01 A R$ 500.000.000,00';
  return 'DE R$ 500.000.000,01 A R$ 1.000.000.000,00';
}

// ─────────────────────────────────────────────────────────────
// TRANSFERÊNCIAS — versão resiliente (localiza aba e colunas pelo
// CABEÇALHO, então não quebra se mudarem a ordem/posição).
// ─────────────────────────────────────────────────────────────
function _findTransferSheet(ss) {
  // 1) por GID
  var byGid = ss.getSheets().filter(function(s){ return s.getSheetId() === TRANSFER_GID; })[0];
  if (byGid) return byGid;
  // 2) por nome
  var names = ['Transferência','Transferencia'];
  for (var i=0;i<names.length;i++){ var s=ss.getSheetByName(names[i]); if(s) return s; }
  // 3) qualquer aba cujo cabeçalho tenha "destino"
  var all = ss.getSheets();
  for (var j=0;j<all.length;j++){
    var sh=all[j]; if(sh.getLastRow()<1) continue;
    var hdr = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(h){return (h||'').toString().toLowerCase();});
    if (hdr.some(function(h){return h.indexOf('destino')>=0;})) return sh;
  }
  return null;
}

function _normHdr(h){ return (h||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim(); }

// Casa "Turma destino" com o mês/ano desta turma. Aceita DATA (Date) ou TEXTO.
function _destinoMatches(cell, tz) {
  if (cell == null || cell === '') return false;
  // 1) célula é uma data real (caso desta planilha)
  if (Object.prototype.toString.call(cell) === '[object Date]' && !isNaN(cell)) {
    var mmyyyy = Utilities.formatDate(cell, tz || Session.getScriptTimeZone(), 'M/yyyy');
    return mmyyyy === (TURMA_MES + '/' + TURMA_ANO);
  }
  // 2) texto tipo "agosto/2026", "ago/2026"
  var meses = {1:['janeiro','jan'],2:['fevereiro','fev'],3:['marco','mar'],4:['abril','abr'],
    5:['maio','mai'],6:['junho','jun'],7:['julho','jul'],8:['agosto','ago'],
    9:['setembro','set'],10:['outubro','out'],11:['novembro','nov'],12:['dezembro','dez']};
  var sl = cell.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  var kws = meses[TURMA_MES] || [];
  if (TURMA_ANO && sl.indexOf(String(TURMA_ANO)) < 0 && /\d{4}/.test(sl)) return false;
  for (var i=0;i<kws.length;i++){ if (sl.indexOf(kws[i]) >= 0) return true; }
  return false;
}

function readPendingTransfers() {
  try {
    var ss = SpreadsheetApp.openById(TRANSFER_SHEET_ID);
    var tz = ss.getSpreadsheetTimeZone();
    var sheet = _findTransferSheet(ss);
    if (!sheet) { Logger.log('readPendingTransfers: aba não encontrada'); return []; }
    var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
    if (lastRow < 2) return [];
    var values = sheet.getRange(1,1,lastRow,lastCol).getValues();
    var header = values[0].map(_normHdr);
    function col(kw){ for(var i=0;i<header.length;i++){ if(header[i].indexOf(kw)>=0) return i; } return -1; }
    var iNome=col('nome'), iCpf=col('cpf'), iDest=col('destino'),
        iAprov=col('aprova'), iStatus=col('status'), iObs=col('observ');
    if (iNome < 0 || iDest < 0) return [];
    var seen = {}, out = [];
    for (var r=1; r<values.length; r++) {
      var row = values[r];
      var nome    = (row[iNome]||'').toString().trim();
      var destino = (row[iDest]||'').toString();
      var status  = iStatus>=0 ? (row[iStatus]||'').toString().toUpperCase() : '';
      var aprov   = iAprov >=0 ? (row[iAprov] ||'').toString().toUpperCase() : '';
      var obs     = iObs   >=0 ? (row[iObs]   ||'').toString().toUpperCase() : '';
      if (nome.length < 2) continue;
      if (!_destinoMatches(row[iDest], tz)) continue;        // só o mês/ano desta turma
      if (status.indexOf('REALIZADA') >= 0) continue;        // já transferido → entra pela turma
      if (obs.indexOf('DUPLICAD') >= 0) continue;            // ignora duplicados
      if (obs.indexOf('PENDENTE DE APROVA') >= 0) continue;  // ainda não aprovado
      if (obs.indexOf('JA TEM') >= 0 || obs.indexOf('MATRICULA NA TURMA') >= 0) continue;
      if (aprov.indexOf('REPROVAD') >= 0 || aprov.indexOf('NAO APROVAD') >= 0) continue;
      var key = (iCpf>=0 && row[iCpf] ? normCpf(row[iCpf]) : '') || nome.toUpperCase();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(nome);
    }
    return out;
  } catch (err) {
    Logger.log('readPendingTransfers ERRO: ' + err.message);  // não engole o erro calado
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// GESTÃO — aba "Onboarding T15" (layout T15, CONTRATO no índice 14)
// ─────────────────────────────────────────────────────────────
function readGestao(ss) {
  const sheet = ss.getSheetByName('Onboarding T15');
  if (!sheet) throw new Error('Aba "Onboarding T15" não encontrada');
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return {rows:[],stats:emptyGestaoStats()};
  const lastCol = sheet.getLastColumn();
  const data    = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  const rows = [];
  let cBrConf=0,cBrUs=0,cUsConf=0,cConfirmado=0,cSemRet=0,cCancel=0,cProxTurma=0;
  let cOnbReal=0,cOnbIni=0,cOnbPend=0,cOnbNao=0;
  let cWhatsOk=0,cTfOk=0,cTfEnv=0,cCtOk=0,cBrasil=0,cOrland=0;

  for (let i = 0; i < data.length; i++) {
    const row  = data[i];
    const tipo = (row[0] || '').toString().trim();
    const nome = (row[3] || '').toString().trim();   // T15: NOME no índice 3
    const cpf  = normCpf(row[7]);                     // T15: CPF no índice 7

    if (nome.length < 2 || !tipo) continue;

    const pUp = (row[4]  || '').toString().toUpperCase().trim();  // PRESENÇA (4)
    const oUp = (row[10] || '').toString().toUpperCase().trim();  // ONBOARDING (10)
    const wUp = (row[11] || '').toString().toUpperCase().trim();  // WHTS (11)
    const tUp = (row[13] || '').toString().toUpperCase().trim();  // TYPEFORM (13)
    const cUp = (row[14] || '').toString().toUpperCase().trim();  // CONTRATO (14) — existe na T15
    const eUp = (row[2]  || '').toString().toUpperCase().trim();  // EVENTO (2)

    if      (pUp==='BR CONFIRMADO'||pUp==='BR + US CONFIRMADO'||pUp==='BR + US CONFIRMAOD') cBrConf++;
    else if (pUp==='US CONFIRMADO')                              cUsConf++;
    else if (pUp==='CONFIRMADO')                                 cConfirmado++;
    else if (pUp==='SEM RETORNO')                                cSemRet++;
    else if (pUp==='CANCELAMENTO')                               cCancel++;
    else if (pUp==='PROXIMA TURMA'||pUp==='PRÓXIMA TURMA')      cProxTurma++;

    if      (oUp==='REALIZADO')        cOnbReal++;
    else if (oUp==='INICIADO')         cOnbIni++;
    else if (oUp.includes('PENDENTE')) cOnbPend++;
    else                               cOnbNao++;

    if (wUp==='SIM')         cWhatsOk++;
    if (tUp==='PREENCHIDO')  cTfOk++;
    else if(tUp==='ENVIADO') cTfEnv++;
    if (cUp==='SIM')         cCtOk++;
    if (eUp.includes('ORLANDO')) cOrland++; else cBrasil++;

    rows.push({
      tipo, evento:(row[2]||'').toString().trim(),
      nome, cpf,
      presenca:pUp, onboarding:oUp, whats:wUp,
      data:(row[12]||'').toString().trim(), typeform:tUp, contrato:cUp,
      nomePrefGestao: (row[5]  || '').toString().trim(),
      empresaGestao:  (row[6]  || '').toString().trim(),
      telefone:       (row[8]  || '').toString().trim(),
      email:          (row[9]  || '').toString().trim(),
      grupoWhats:     (row[15] || '').toString().trim(),
      perfilComport:  (row[16] || '').toString().trim(),
      perfil:         (row[17] || '').toString().trim(),
      localVendaGestao:(row[18] || '').toString().trim(),
      promocaoGestao:  (row[19] || '').toString().trim(),
    });
  }

  return {
    rows,
    stats:{
      presenca:{
        brConfirmado:cBrConf, brUs:cBrUs, usConfirmado:cUsConf,
        confirmado:cConfirmado, semRetorno:cSemRet, cancelamento:cCancel,
        proximaTurma:cProxTurma,
        totalConfirmados:cBrConf+cBrUs+cUsConf+cConfirmado
      },
      onboarding:{realizado:cOnbReal,iniciado:cOnbIni,pendente:cOnbPend,naoIniciado:cOnbNao},
      operacional:{whatsOk:cWhatsOk,typeformOk:cTfOk,typeformEnv:cTfEnv,contratoOk:cCtOk},
      eventos:{brasil:cBrasil,orlando:cOrland}
    }
  };
}

function emptyGestaoStats(){
  return {presenca:{brConfirmado:0,brUs:0,usConfirmado:0,confirmado:0,semRetorno:0,cancelamento:0,proximaTurma:0,totalConfirmados:0},
          onboarding:{realizado:0,iniciado:0,pendente:0,naoIniciado:0},
          operacional:{whatsOk:0,typeformOk:0,typeformEnv:0,contratoOk:0},
          eventos:{brasil:0,orlando:0}};
}

// ─────────────────────────────────────────────────────────────
// DOSSIÊ — aba "Typeforme - T15"  (v1.5: agora lido de verdade)
// Colunas localizadas POR CABEÇALHO (robusto a mudança de ordem).
// ─────────────────────────────────────────────────────────────
function readDossie(ss) {
  const sheet = ss.getSheetByName('Typeforme - T15');
  if (!sheet) { Logger.log('readDossie: aba "Typeforme - T15" não encontrada'); return {rows:[]}; }
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) { Logger.log('readDossie: "Typeforme - T15" sem respostas'); return {rows:[]}; }
  const lastCol = sheet.getLastColumn();
  const all = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const header = all[0].map(_normHdr);

  function findCol(kw){ for (var i=0;i<header.length;i++){ if (header[i].indexOf(kw)>=0) return i; } return -1; }

  const cCpf      = findCol('cpf');
  const cNome     = findCol('nome completo');
  const cPref     = findCol('preferencia');
  const cFrase    = findCol('frase');
  const cEmpresa  = findCol('nome da sua empresa');
  const cDtNasc   = findCol('data de nascimento');
  const cGenero   = findCol('genero');
  const cAlergia  = findCol('alergia');
  const cReligiao = findCol('religi');
  const cConjuge  = findCol('tem um conjuge');     // "Você tem um cônjuge?"
  const cConjTrab = findCol('conjuge trabalha');   // "Seu cônjuge trabalha com você?"
  const cFilhos   = findCol('tem filhos');
  const cRedes    = findCol('redes sociais');
  const cCidade   = findCol('cidade e estado');
  const cModelo   = findCol('modelo de negocio');
  const cTipoCli  = findCol('tipo de clientes');
  const cAprender = findCol('deseja aprender');
  const cMvv      = findCol('visao e valores');    // "missão, visão e valores"
  const cOutros   = findCol('outras pessoas da sua empresa');
  const cProblemas= findCol('5 maiores problemas');
  const cMetas    = findCol('5 principais metas');
  const cAval     = findCol('avalia o relacionamento');  // 0–10
  const cSonho    = findCol('maior sonho');
  const cSubmit   = findCol('submitted');
  // ── Campos de gestão/estrutura (cards do Insights) ──
  const cConfirma = findCol('confirma sua participacao');           // "Você confirma sua participação..."
  const cNumColab = findCol('numero de colaboradores');             // "Qual o seu número de Colaboradores"
  const cOrg      = findCol('organograma');                         // "...organograma funcional..."
  const cCanal    = findCol('canal de aquisicao');                  // "...principal canal de aquisição..."
  const cCentral  = findCol('nivel de centralizacao');              // "...nível de centralização..."
  const cNivelIA  = findCol('utilizacao de ia');                    // "...nível de conhecimento e utilização de IA"
  const cFaixaFat = findCol('faixa de faturamento');                // "Qual a sua faixa de faturamento..."
  const cDesafio  = findCol('desafio na gestao de pessoas');        // "...principal desafio na gestão de pessoas..."

  if (cCpf === -1) { Logger.log('readDossie: coluna CPF não encontrada no cabeçalho'); return {rows:[]}; }

  function fmtDt(v){
    if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    return (v==null?'':v).toString().trim();
  }
  function val(row, idx){ return idx===-1 ? '' : (row[idx]==null?'':row[idx]).toString().trim(); }

  const rows = [];
  for (let i = 1; i < all.length; i++) {
    const r = all[i];
    const cpf = normCpf(r[cCpf]);
    if (!cpf) continue;
    rows.push({
      cpf:cpf,
      nomePref:    val(r,cPref),
      frase:       val(r,cFrase),
      empresa:     val(r,cEmpresa),
      dtNasc:      fmtDt(cDtNasc===-1 ? '' : r[cDtNasc]),
      genero:      val(r,cGenero),
      alergia:     val(r,cAlergia),
      religiao:    val(r,cReligiao),
      conjuge:     val(r,cConjuge),
      conjugeTrab: val(r,cConjTrab),
      filhos:      val(r,cFilhos),
      redesSoc:    val(r,cRedes),
      cidadeEst:   val(r,cCidade),
      modeloNeg:   val(r,cModelo),
      tipoCliente: val(r,cTipoCli),
      aprender:    val(r,cAprender),
      mvv:         val(r,cMvv),
      outrosPart:  val(r,cOutros),
      problemas:   val(r,cProblemas),
      metas:       val(r,cMetas),
      avaliacao:   val(r,cAval),
      sonho:       val(r,cSonho),
      submittedAt: val(r,cSubmit),
      confirmacao:    val(r,cConfirma),
      numColabs:      val(r,cNumColab),
      organograma:    val(r,cOrg),
      canalAquisicao: val(r,cCanal),
      centralizacao:  val(r,cCentral),
      nivelIA:        val(r,cNivelIA),
      faixaFatDossie: val(r,cFaixaFat),
      desafioGestao:  val(r,cDesafio),
    });
  }
  Logger.log('readDossie: ' + rows.length + ' resposta(s) do dossiê T15');
  return {rows:rows};
}

// ─────────────────────────────────────────────────────────────
// MATRICULADOS — aba "Matriculados - T15" (mesmo layout da T14)
// ─────────────────────────────────────────────────────────────
function readMatriculados(ss) {
  const sheet = ss.getSheetByName('Matriculados - T15');
  if (!sheet) return emptyMatric();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return emptyMatric();

  const lastCol = sheet.getLastColumn();
  const data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  const mapa = {};
  let receitaTotal=0,ticketCount=0;
  const cOrigem={},cSetor={},cEstado={},cCidade={},cAtend={},cUnidade={};
  const cFaixaFat={},cFaixaEt={},cSexo={},cLocal={},cPromocao={},cTipoMat={};

  for (let i = 0; i < data.length; i++) {
    const row  = data[i];
    const nome = (row[0] || '').toString().trim();
    const cpf  = normCpf(row[32]);
    if (nome.length < 2) continue;

    const origem   = fixEncoding((row[4]  || '').toString().trim());
    const unidade  = fixEncoding((row[6]  || '').toString().trim());
    const atendente= fixEncoding((row[7]  || '').toString().trim());
    const valorRaw = (row[8] || '').toString().trim().replace(/[R$\s]/g,'').replace(/\./g,'').replace(',','.');
    const valor    = parseFloat(valorRaw) || 0;
    const tipoMat  = fixEncoding((row[12] || '').toString().trim());
    const dtPag    = (row[14] || '').toString().trim();
    const localVd  = fixEncoding((row[19] || '').toString().trim());
    const sexo     = (row[25] || '').toString().trim();
    const dtNascRaw = row[26];
    const dtNasc = (dtNascRaw instanceof Date && !isNaN(dtNascRaw))
      ? Utilities.formatDate(dtNascRaw, Session.getScriptTimeZone(), 'dd/MM/yyyy')
      : (dtNascRaw || '').toString().trim();
    const faixaFat = (row[27] || '').toString().trim();
    const setor    = fixEncoding((row[28] || '').toString().trim());
    const cidade   = fixEncoding((row[29] || '').toString().trim());
    const estado   = fixEncoding((row[30] || '').toString().trim());
    const promocao = fixEncoding((row[31] || '').toString().trim());
    const dtFech   = (row[3]  || '').toString().trim();

    let faixaEt = '';
    if (dtNasc) {
      const m = dtNasc.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (m) {
        const idade = new Date().getFullYear() - parseInt(m[3]);
        if      (idade < 30) faixaEt = 'Até 29 anos';
        else if (idade < 40) faixaEt = '30–39 anos';
        else if (idade < 50) faixaEt = '40–49 anos';
        else if (idade < 60) faixaEt = '50–59 anos';
        else                 faixaEt = '60+ anos';
      }
    }

    if (!mapa[cpf] || valor > (mapa[cpf].valor || 0)) {
      mapa[cpf] = {nome,cpf,origem,unidade,atendente,valor,tipoMat,
        localVd,sexo,dtNasc,faixaFat,setor,cidade,estado,promocao,faixaEt,dtFech,dtPag};
    }

    if (valor>0&&valor<500000){receitaTotal+=valor;ticketCount++;}
    if (origem)   cOrigem[origem]    =(cOrigem[origem]   ||0)+1;
    if (setor)    cSetor[setor]      =(cSetor[setor]     ||0)+1;
    if (estado)   cEstado[estado]    =(cEstado[estado]   ||0)+1;
    if (cidade)   cCidade[cidade]    =(cCidade[cidade]   ||0)+1;
    if (atendente)cAtend[atendente]  =(cAtend[atendente] ||0)+1;
    if (unidade)  cUnidade[unidade]  =(cUnidade[unidade] ||0)+1;
    if (faixaFat) cFaixaFat[faixaFat]=(cFaixaFat[faixaFat]||0)+1;
    if (faixaEt)  cFaixaEt[faixaEt] =(cFaixaEt[faixaEt]||0)+1;
    if (sexo)     cSexo[sexo]        =(cSexo[sexo]       ||0)+1;
    if (localVd)  cLocal[localVd]    =(cLocal[localVd]   ||0)+1;
    if (promocao) cPromocao[promocao]=(cPromocao[promocao]||0)+1;
    if (tipoMat)  cTipoMat[tipoMat] =(cTipoMat[tipoMat] ||0)+1;
  }

  function topObj(obj,n){
    return Object.entries(obj).filter(([k])=>k.length>1)
      .sort((a,b)=>b[1]-a[1]).slice(0,n)
      .reduce((acc,[k,v])=>{acc[k]=v;return acc;},{});
  }

  return {
    rows: Object.values(mapa),
    stats:{
      financeiro:{receitaTotal,ticketMedio:ticketCount>0?Math.round(receitaTotal/ticketCount):0,ticketCount},
      origem:topObj(cOrigem,12), setor:topObj(cSetor,12), estado:topObj(cEstado,30),
      cidade:topObj(cCidade,15), atendente:topObj(cAtend,10), unidade:topObj(cUnidade,10),
      faixaFat:topObj(cFaixaFat,10), faixaEt:topObj(cFaixaEt,8), sexo:topObj(cSexo,5),
      localVenda:topObj(cLocal,10), promocao:topObj(cPromocao,10), tipoMat:topObj(cTipoMat,10),
    }
  };
}

function emptyMatric(){
  return {rows:[],stats:{financeiro:{receitaTotal:0,ticketMedio:0,ticketCount:0},
    origem:{},setor:{},estado:{},cidade:{},atendente:{},unidade:{},
    faixaFat:{},faixaEt:{},sexo:{},localVenda:{},promocao:{},tipoMat:{}}};
}

function buildPerfilStats(rows) {
  const cGenero={},cMvv={sim:0,nao:0},cTipoCliente={},cModeloNeg={};
  const cConjuge={sim:0,nao:0},cFilhos={sim:0,nao:0},cReligiao={},cFaixaEt={};
  const avaliacoes=[];

  rows.forEach(r => {
    if (r.genero) cGenero[r.genero]=(cGenero[r.genero]||0)+1;
    if (r.mvv) { if(r.mvv.toUpperCase().includes('SIM')) cMvv.sim++; else cMvv.nao++; }
    if (r.tipoCliente) cTipoCliente[r.tipoCliente]=(cTipoCliente[r.tipoCliente]||0)+1;
    if (r.modeloNeg)   cModeloNeg[r.modeloNeg]=(cModeloNeg[r.modeloNeg]||0)+1;
    if (r.conjuge) {
      const v=r.conjuge.toUpperCase();
      if (v.match(/NÃO|NAO|^N$|NENHUM/)) cConjuge.nao++; else if(v.length>2) cConjuge.sim++;
    }
    if (r.filhos) {
      const v=r.filhos.toUpperCase();
      if (v.match(/NÃO|NAO|^N$|SEM FILHOS|NENHUM/)) cFilhos.nao++; else if(v.length>1) cFilhos.sim++;
    }
    if (r.religiao) {
      const v=r.religiao.trim();
      const cat=!v||v.match(/NÃO|NAO|^N$|NENHUM|ATEU|AGNOS/i)?'Sem religião':
                v.match(/CRIST|CATOL|EVAN|PENT|BATIST|PRESBIT/i)?'Cristã':
                v.match(/ESPIRIT|CANDOM|UMBANDA/i)?'Espiritualista':v;
      cReligiao[cat]=(cReligiao[cat]||0)+1;
    }
    let fe = r.faixaEt || '';
    if (!fe && r.dtNascDossie) {
      const m = r.dtNascDossie.toString().match(/(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
      if (m) {
        const idade = new Date().getFullYear() - parseInt(m[3]);
        if      (idade < 30) fe = 'Até 29 anos';
        else if (idade < 40) fe = '30–39 anos';
        else if (idade < 50) fe = '40–49 anos';
        else if (idade < 60) fe = '50–59 anos';
        else                 fe = '60+ anos';
      }
    }
    if (fe) cFaixaEt[fe]=(cFaixaEt[fe]||0)+1;

    const av=parseFloat(r.avaliacao);
    if (!isNaN(av)&&av>=0&&av<=10) avaliacoes.push(av);
  });

  const avgAval=avaliacoes.length>0?Math.round((avaliacoes.reduce((a,b)=>a+b,0)/avaliacoes.length)*10)/10:0;
  return {genero:cGenero,mvv:cMvv,tipoCliente:cTipoCliente,modeloNeg:cModeloNeg,
          conjuge:cConjuge,filhos:cFilhos,religiao:cReligiao,faixaEt:cFaixaEt,
          avaliacao:{media:avgAval,total:avaliacoes.length}};
}

function fixEncoding(str) {
  if (!str||typeof str!=='string') return str;
  try {return decodeURIComponent(escape(str));} catch(e){return str;}
}

function respond(callback,payload,isRaw) {
  const body=isRaw?(callback?callback+'('+payload+')':payload):(callback?callback+'('+JSON.stringify(payload)+')':JSON.stringify(payload));
  const out=ContentService.createTextOutput(body);
  out.setMimeType(callback?ContentService.MimeType.JAVASCRIPT:ContentService.MimeType.JSON);
  return out;
}

// ─────────────────────────────────────────────────────────────
// TESTE — rode no editor; deve mostrar os números reais da T15
// ─────────────────────────────────────────────────────────────
function testar() {
  const data = buildPayload();
  Logger.log('=== DASH-T15 v1.8 (analises 100% dossie) ===');
  Logger.log('Total rows: '+data.total);
  Logger.log('BR Confirmado: '+data.stats.presenca.brConfirmado);
  Logger.log('Confirmado (simples): '+data.stats.presenca.confirmado);
  Logger.log('Total confirmados: '+data.stats.presenca.totalConfirmados);
  Logger.log('Sem Retorno: '+data.stats.presenca.semRetorno);
  Logger.log('Turma Válida (conf+sem ret): '+(data.stats.presenca.totalConfirmados+data.stats.presenca.semRetorno));
  Logger.log('--- DOSSIÊ / PERFIL ---');
  Logger.log('Gênero: '+JSON.stringify(data.stats.perfil.genero));
  Logger.log('Avaliação média: '+data.stats.perfil.avaliacao.media+' (n='+data.stats.perfil.avaliacao.total+')');
  Logger.log('MVV: '+JSON.stringify(data.stats.perfil.mvv));
  Logger.log('Tipo de cliente: '+JSON.stringify(data.stats.perfil.tipoCliente));
  Logger.log('A transferir (pendentes): '+data.pendingTransferCount);
  Logger.log('--- CONFIRMADOS ENRIQUECIDOS (prova do join dossiê + Matriculados) ---');
  data.rows
    .filter(function(r){ var p=(r.presenca||'').toUpperCase(); return (p.indexOf('CONFIRMADO')>=0) && (r.typeform||'').toUpperCase()==='PREENCHIDO'; })
    .forEach(function(r){
      Logger.log(' • '+r.nome+' (CPF '+r.cpf+')');
      Logger.log('     estado='+r.estado+' | cidade='+r.cidade+' | faixaFat='+r.faixaFat+' | faixaEt='+r.faixaEt+' | setor='+r.setor);
      Logger.log('     numColabs='+r.numColabs+' | organograma='+r.organograma+' | canal='+r.canalAquisicao+' | IA='+r.nivelIA);
    });
}

// Teste isolado só do dossiê (v1.5)
function testarDossie() {
  const ss = SpreadsheetApp.openById('1f4cjdbgGMsaXoFoY8pardtkE51nEuVXRh9BQ8VwFOfc');
  const d = readDossie(ss);
  Logger.log('Respostas do dossiê T15: ' + d.rows.length);
  d.rows.forEach(function(r){
    Logger.log(' • ' + r.cpf + ' | ' + r.genero + ' | ' + r.empresa + ' | modelo=' + r.modeloNeg +
               ' | tipoCli=' + r.tipoCliente + ' | aval=' + r.avaliacao + ' | mvv=' + r.mvv);
    Logger.log('     colab=' + r.numColabs + ' | organograma=' + r.organograma +
               ' | canal=' + r.canalAquisicao + ' | IA=' + r.nivelIA +
               ' | confirma=' + r.confirmacao + ' | faixaFat=' + r.faixaFatDossie);
  });
}

// Teste isolado só das transferências
function testarTransferencias() {
  const lst = readPendingTransfers();
  Logger.log('[v1.5] A transferir p/ esta turma (mês '+TURMA_MES+'/'+TURMA_ANO+'): '+lst.length);
  Logger.log(JSON.stringify(lst, null, 2));
}

// DIAGNÓSTICO — rode isto se testarTransferencias() der 0.
function diagTransfer() {
  var ss = SpreadsheetApp.openById(TRANSFER_SHEET_ID);
  Logger.log('ABAS: ' + ss.getSheets().map(function(s){return s.getName()+' (gid '+s.getSheetId()+')';}).join(' | '));
  var sheet = _findTransferSheet(ss);
  if (!sheet) { Logger.log('>>> NENHUMA aba de transferências encontrada (ajuste TRANSFER_GID).'); return; }
  var lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
  Logger.log('ABA USADA: ' + sheet.getName() + ' (gid ' + sheet.getSheetId() + ') — ' + lastRow + ' linhas, ' + lastCol + ' colunas');
  Logger.log('CABEÇALHO: ' + JSON.stringify(sheet.getRange(1,1,1,lastCol).getValues()[0]));
  var header = sheet.getRange(1,1,1,lastCol).getValues()[0].map(_normHdr);
  function col(kw){for(var i=0;i<header.length;i++){if(header[i].indexOf(kw)>=0)return i;}return -1;}
  var iDest=col('destino'), iStatus=col('status'), iAprov=col('aprova');
  Logger.log('Índices → destino:'+iDest+' status:'+iStatus+' aprova:'+iAprov);
  if (iDest<0){ Logger.log('>>> Coluna "Turma destino" não encontrada pelo cabeçalho.'); return; }
  var tz = ss.getSpreadsheetTimeZone();
  var vals = sheet.getRange(2,1,lastRow-1,lastCol).getValues();
  var dist={}, casam=0;
  vals.forEach(function(row){ var d=(row[iDest]||'').toString().trim()||'(vazio)'; dist[d]=(dist[d]||0)+1; if(_destinoMatches(row[iDest],tz))casam++; });
  Logger.log('[v1.5] Fuso da planilha: '+tz+' | Casam com mês '+TURMA_MES+'/'+TURMA_ANO+': '+casam);
  Logger.log('DISTRIBUIÇÃO "Turma destino":\n' + JSON.stringify(dist, null, 2));
}
