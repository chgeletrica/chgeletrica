(function(){
  var WA_NUMBER = '258852776220';
  var $ = function(id){ return document.getElementById(id); };
  var yr = $('yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* Menu no telemóvel */
  var header = $('top'), menuBtn = $('menuBtn');
  if (header && menuBtn) {
    menuBtn.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    $('nav').addEventListener('click', function(e){
      if (e.target.closest('a')) { header.classList.remove('open'); menuBtn.setAttribute('aria-expanded','false'); }
    });
  }

  /* Aviso rápido */
  var toastTimer;
  function toast(text){
    var t = $('toast'); if (!t) return;
    t.textContent = text; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function(){ t.hidden = true; }, 2200);
  }

  /* Copiar texto */
  function copyText(text, done){
    function fallback(){
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly','');
      ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ done(true); }, fallback);
    } else { fallback(); }
  }
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click', function(){
      var n = b.getAttribute('data-copy');
      copyText(n, function(ok){ toast(ok ? 'Copiado: ' + n : 'Seleccione o texto para copiar'); });
    });
  });

  /* Separadores e imagem ampliada do projecto */
  var stage = $('stage'), stageImg = $('stageImg'), lb = $('lightbox'), lbImg = $('lbImg');
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      stageImg.src = tab.getAttribute('data-src'); stageImg.alt = tab.getAttribute('data-alt');
      stage.setAttribute('aria-labelledby', tab.id);
    });
  });
  if (stage && lb) {
    stage.addEventListener('click', function(){
      lbImg.src = stageImg.src; lbImg.alt = stageImg.alt;
      if (lb.showModal) lb.showModal(); else lb.setAttribute('open','');
    });
    $('lbClose').addEventListener('click', function(){ lb.close ? lb.close() : lb.removeAttribute('open'); });
    lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });
  }

  /* Escolher o serviço no formulário (também a partir de outras páginas) */
  var SKEY = 'chg-servico-escolhido';
  function pickService(v){
    var r = document.querySelector('input[name="servico"][value="' + v + '"]');
    if (r) { r.checked = true; return true; }
    return false;
  }
  document.querySelectorAll('[data-service]').forEach(function(a){
    a.addEventListener('click', function(){
      var v = a.getAttribute('data-service');
      if (!pickService(v)) { try { sessionStorage.setItem(SKEY, v); } catch(e) {} }
    });
  });

  /* Submenu das páginas internas: destaca a secção visível */
  var subLinks = document.querySelectorAll('.subnav a');
  if (subLinks.length) {
    document.documentElement.classList.add('has-subnav');
    var map = {};
    subLinks.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
    function mark(id){
      subLinks.forEach(function(a){ a.classList.toggle('on', a === map[id]); });
      var on = map[id]; if (on) { var bar = on.parentNode, x = on.offsetLeft - bar.offsetLeft; if (x < bar.scrollLeft || x + on.offsetWidth > bar.scrollLeft + bar.clientWidth) bar.scrollLeft = Math.max(0, x - 16); }
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting) mark(en.target.id); });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(map).forEach(function(id){ var s = $(id); if (s) io.observe(s); });
    }
    mark(location.hash ? location.hash.slice(1) : Object.keys(map)[0]);

    /* O cabeçalho principal só aparece no início da página; ao descer fica só o submenu */
    var hero = $('pageHero'), ticking = false;
    function onScroll(){
      ticking = false;
      var atTop = (window.scrollY || document.documentElement.scrollTop) <= 8;
      document.documentElement.classList.toggle('hide-top', !atTop && !(header && header.classList.contains('open')));
    }
    window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* Formulário de orçamento */
  var form = $('quoteForm');
  if (!form) return;
  var result = $('result'), msgEl = $('msg'), sendWa = $('sendWa');
  var KEY = 'chg-orcamento-rascunho';
  var fields = ['nome','telefone','imovel','local','descricao'];

  function saveDraft(){
    try {
      var d = {}; fields.forEach(function(f){ d[f] = $(f).value; });
      d.servico = (form.querySelector('input[name="servico"]:checked')||{}).value;
      d.contacto = (form.querySelector('input[name="contacto"]:checked')||{}).value;
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch(e) {}
  }
  function loadDraft(){
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) {
        fields.forEach(function(f){ if (d[f]) $(f).value = d[f]; });
        ['servico','contacto'].forEach(function(n){
          var r = d[n] && form.querySelector('input[name="' + n + '"][value="' + d[n] + '"]'); if (r) r.checked = true;
        });
      }
      var wanted = sessionStorage.getItem(SKEY);
      if (wanted) { pickService(wanted); sessionStorage.removeItem(SKEY); }
    } catch(e) {}
  }
  loadDraft();
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);

  function setErr(id, text){
    $('e-' + id).textContent = text || '';
    $('f-' + id).classList.toggle('bad', !!text);
  }
  function validate(){
    var first = null;
    var nome = $('nome').value.trim();
    var digits = $('telefone').value.replace(/\D/g,'');
    var local = $('local').value.trim();
    var desc = $('descricao').value.trim();
    var rules = [
      ['nome', nome.length >= 2 ? '' : 'Escreva o seu nome.'],
      ['telefone', (digits.length === 9 || (digits.length === 12 && digits.indexOf('258') === 0)) ? '' : 'Escreva um número com 9 dígitos, por exemplo 84 123 4567.'],
      ['local', local.length >= 3 ? '' : 'Indique o bairro e a cidade.'],
      ['descricao', desc.length >= 10 ? '' : 'Descreva o trabalho em pelo menos 10 caracteres.']
    ];
    rules.forEach(function(r){ setErr(r[0], r[1]); if (r[1] && !first) first = r[0]; });
    if (first) $(first).focus();
    return !first;
  }
  function formatTel(v){
    var d = v.replace(/\D/g,''); if (d.indexOf('258') === 0 && d.length === 12) d = d.slice(3);
    return '+258 ' + d.slice(0,2) + ' ' + d.slice(2,5) + ' ' + d.slice(5);
  }
  function buildMessage(){
    var servico = form.querySelector('input[name="servico"]:checked').value;
    var contacto = form.querySelector('input[name="contacto"]:checked').value;
    return [
      'Olá CHG Elétrica, gostaria de pedir um orçamento.',
      '',
      'Nome: ' + $('nome').value.trim(),
      'Telefone: ' + formatTel($('telefone').value),
      'Serviço: ' + servico,
      'Tipo de imóvel: ' + $('imovel').value,
      'Localização: ' + $('local').value.trim(),
      'Contacto preferido: ' + contacto,
      '',
      'Descrição:',
      $('descricao').value.trim()
    ].join('\n');
  }
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (!validate()) return;
    var text = buildMessage();
    msgEl.textContent = text;
    sendWa.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
    $('status').textContent = '';
    form.hidden = true; result.hidden = false;
    result.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
  });
  ['nome','telefone','local','descricao'].forEach(function(id){
    $(id).addEventListener('input', function(){ if ($('f-' + id).classList.contains('bad')) setErr(id, ''); });
  });
  sendWa.addEventListener('click', function(){
    $('status').textContent = 'O WhatsApp abre num separador novo. Carregue em enviar para concluir o pedido.';
  });
  $('copyMsg').addEventListener('click', function(){
    copyText(msgEl.textContent, function(ok){
      $('status').textContent = ok ? 'Mensagem copiada. Cole no WhatsApp ou num email para chgeletrica@gmail.com.' : 'Seleccione o texto da mensagem e copie manualmente.';
    });
  });
  $('editMsg').addEventListener('click', function(){
    result.hidden = true; form.hidden = false; $('nome').focus();
  });
})();
