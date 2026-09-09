/* PCE 2.0 · 02-manual-deps
   Extraido do index monolitico sem alteracao de logica.
   Engenharia e fundacao: Ronaldo Ferreira. */
window.__loadManualDeps = function() {
  if (window.__manualDepsLoaded) return Promise.resolve();
  window.__manualDepsLoaded = new Promise(function(resolve){
    var done = 0;
    function check(){ done++; if(done >= 2) resolve(); }
    var s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s1.onload = check; s1.onerror = check;
    document.head.appendChild(s1);
    var s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
    s2.onload = check; s2.onerror = check;
    document.head.appendChild(s2);
  });
  return window.__manualDepsLoaded;
};
