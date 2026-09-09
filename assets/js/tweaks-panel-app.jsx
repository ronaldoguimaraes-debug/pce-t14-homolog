const PCE_TW_DEFAULTS = { densidade:'regular', profundidade:'elevado', acento:'vibrante' };
function applyPceTweaks(t){
  const b=document.body;
  b.classList.remove('tw-d-compact','tw-d-spacious');
  if(t.densidade==='compacto')b.classList.add('tw-d-compact'); else if(t.densidade==='espaçoso')b.classList.add('tw-d-spacious');
  b.classList.remove('tw-x-flat','tw-x-glass');
  if(t.profundidade==='plano')b.classList.add('tw-x-flat'); else if(t.profundidade==='vidro')b.classList.add('tw-x-glass');
  b.classList.remove('tw-a-sober','tw-a-vibrant');
  b.classList.add(t.acento==='sóbrio'?'tw-a-sober':'tw-a-vibrant');
}
function PceTweaks(){
  const [t,setTweak]=useTweaks(PCE_TW_DEFAULTS);
  React.useEffect(()=>{applyPceTweaks(t);},[t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Densidade" />
      <TweakRadio label="Espaçamento" value={t.densidade} options={['compacto','regular','espaçoso']} onChange={v=>setTweak('densidade',v)} />
      <TweakSection label="Profundidade" />
      <TweakRadio label="Superfície" value={t.profundidade} options={['plano','elevado','vidro']} onChange={v=>setTweak('profundidade',v)} />
      <TweakSection label="Acento" />
      <TweakRadio label="Brilho" value={t.acento} options={['sóbrio','vibrante']} onChange={v=>setTweak('acento',v)} />
    </TweaksPanel>
  );
}
(function(){ var r=document.createElement('div'); document.body.appendChild(r); ReactDOM.createRoot(r).render(<PceTweaks/>); })();
