/* PCE 2.0 · 12-credenciamento-xlsx
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
/* === Template Credenciamento PCE — gerador de .xlsx em JS puro (sem dependências) === */
(function(){
  function _crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++){let x=(c^b[i])&0xFF;for(let k=0;k<8;k++){x=(x&1)?(0xEDB88320^(x>>>1)):(x>>>1);}c=(c>>>8)^x;}return (c^0xFFFFFFFF)>>>0;}
  function _cat(a){let n=0;for(const x of a)n+=x.length;const o=new Uint8Array(n);let p=0;for(const x of a){o.set(x,p);p+=x.length;}return o;}
  function _u16(n){return new Uint8Array([n&255,(n>>8)&255]);}
  function _u32(n){n=n>>>0;return new Uint8Array([n&255,(n>>8)&255,(n>>16)&255,(n>>24)&255]);}
  function _zip(files){const enc=new TextEncoder();const loc=[];const cen=[];let off=0;for(const f of files){const nm=enc.encode(f.name);const d=f.data;const crc=_crc32(d);const lh=_cat([_u32(0x04034b50),_u16(20),_u16(0),_u16(0),_u16(0),_u16(0),_u32(crc),_u32(d.length),_u32(d.length),_u16(nm.length),_u16(0)]);loc.push(lh,nm,d);const ch=_cat([_u32(0x02014b50),_u16(20),_u16(20),_u16(0),_u16(0),_u16(0),_u16(0),_u32(crc),_u32(d.length),_u32(d.length),_u16(nm.length),_u16(0),_u16(0),_u16(0),_u16(0),_u32(0),_u32(off)]);cen.push(ch,nm);off+=lh.length+nm.length+d.length;}const cd=_cat(cen);const end=_cat([_u32(0x06054b50),_u16(0),_u16(0),_u16(files.length),_u16(files.length),_u32(cd.length),_u32(off),_u16(0)]);return _cat([...loc,cd,end]);}
  function _xesc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function _build(){
    const enc=new TextEncoder();
    const COLS=['A','B','C','D','E'];
    const rows=[
      [{v:'NOME DO CLIENTE',b:1},{v:'CPF',b:1},{v:'E-MAIL',b:1},{v:'CELULAR',b:1},{v:'EMPRESA',b:1}],
      [{v:'Ronaldo Ferreira'},{v:'11122233366'},{v:'ronaldoCSpremium@febra.com.br'},{v:'11942658477'},{v:'Ronald Company S.A'}],
      [{v:'INSTRUÇÕES',b:1}],
      [{v:''},{v:'CPF com 11 dígitos, sem pontuação'},{v:''},{v:'Celular não precisa do código do país'}]
    ];
    let sd='';
    rows.forEach(function(r,ri){
      sd+='<row r="'+(ri+1)+'">';
      r.forEach(function(c,ci){
        if(!c||c.v==='')return;
        sd+='<c r="'+COLS[ci]+(ri+1)+'" t="inlineStr" s="'+(c.b?'1':'0')+'"><is><t xml:space="preserve">'+_xesc(c.v)+'</t></is></c>';
      });
      sd+='</row>';
    });
    const sheet='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="22" customWidth="1"/><col min="2" max="2" width="18" customWidth="1"/><col min="3" max="3" width="32" customWidth="1"/><col min="4" max="4" width="16" customWidth="1"/><col min="5" max="5" width="24" customWidth="1"/></cols><sheetData>'+sd+'</sheetData></worksheet>';
    const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="49" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
    const workbook='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Credenciamento" sheetId="1" r:id="rId1"/></sheets></workbook>';
    const wbRels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    const rels='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    const ct='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>';
    return _zip([
      {name:'[Content_Types].xml',data:enc.encode(ct)},
      {name:'_rels/.rels',data:enc.encode(rels)},
      {name:'xl/workbook.xml',data:enc.encode(workbook)},
      {name:'xl/_rels/workbook.xml.rels',data:enc.encode(wbRels)},
      {name:'xl/styles.xml',data:enc.encode(styles)},
      {name:'xl/worksheets/sheet1.xml',data:enc.encode(sheet)}
    ]);
  }
  window.baixarTemplateCredenciamento=function(){
    try{
      const blob=new Blob([_build()],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download='TEMPLATE - CREDENCIAMENTO - PCE.xlsx';
      document.body.appendChild(a);a.click();
      setTimeout(function(){if(a.parentNode)a.parentNode.removeChild(a);URL.revokeObjectURL(url);},120);
    }catch(e){console.error('Falha ao gerar template:',e);alert('Não foi possível gerar a planilha base. Detalhe: '+(e&&e.message?e.message:e));}
  };
})();
