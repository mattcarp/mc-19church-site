// Lightbox for any <a data-lb> link. Without JS the links open the image itself.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('a[data-lb]'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  var d = document.createElement('dialog');
  d.className = 'lb';
  d.setAttribute('aria-label', 'Photograph');
  d.innerHTML =
    '<div class="lb-inner"><div class="lb-stage"><img alt=""></div>' +
    '<div class="lb-row"><span class="cap"></span><span class="ctl">' +
    '<button type="button" data-a="-1" aria-label="Previous">&larr;</button>' +
    '<button type="button" data-a="1" aria-label="Next">&rarr;</button>' +
    '<button type="button" data-a="x" aria-label="Close">Close</button></span></div></div>';
  document.body.appendChild(d);
  var img = d.querySelector('img'), cap = d.querySelector('.cap'), i = 0;
  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], t = a.querySelector('img');
    img.src = a.href; img.alt = t ? t.alt : '';
    cap.textContent = (i + 1) + ' / ' + links.length + '   ' + (a.getAttribute('data-cap') || '');
  }
  links.forEach(function (a, n) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(n); d.showModal(); });
  });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) { var v = b.getAttribute('data-a'); v === 'x' ? d.close() : show(i + Number(v)); }
    else if (e.target === d || e.target.classList.contains('lb-stage')) d.close();
  });
  document.addEventListener('keydown', function (e) {
    if (!d.open) return;
    if (e.key === 'ArrowRight') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
})();
