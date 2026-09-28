/* ============================================================
   Gael Pineda · Multiservicios & Lotes Campestres · Tarjeta digital
   ============================================================ */

function openModal(id) {
  const el = document.getElementById(id);
  el.classList.add('active');
  el.setAttribute('aria-hidden', 'false');
}
function closeModal(id) {
  const el = document.getElementById(id);
  el.classList.remove('active');
  el.setAttribute('aria-hidden', 'true');
}
function cerrarTodos() {
  document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarTodos();
});

document.addEventListener('DOMContentLoaded', () => {
  /* QR dinámico */
  const qrBox = document.getElementById("qrcode");
  if (qrBox) {
    new QRCode(qrBox, {
      text: window.location.href,
      width: 130,
      height: 130,
      colorDark: "#064e3b",
      colorLight: "#ffffff"
    });
  }

  /* Toast */
  const toast = document.getElementById('toast');
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2200);
  };

  /* Guardar contacto (vCard) */
  document.getElementById('btn-vcard').addEventListener('click', () => {
    const vCardData = [
      "BEGIN:VCARD", "VERSION:3.0",
      "FN:Gael Pineda - Multiservicios",
      "ORG:Multiservicios Gael Pineda",
      "TITLE:Asesor Profesional en Lotes Campestres",
      "TEL;TYPE=CELL:+573334002040",
      "URL:https://www.multiserviciosgaelpineda.com/",
      "ADR;TYPE=WORK:;;Sabanagrande / Palmar de Varela;Atlántico;;Colombia",
      "NOTE:Lotes campestres con financiación directa hasta 48 meses sin intereses.",
      "END:VCARD"
    ].join("\r\n");
    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Gael_Pineda_Multiservicios.vcf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    showToast('Contacto guardado en agenda');
  });

  /* Copiar enlace (con respaldo) */
  const copiar = (texto) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(() => showToast('Enlace copiado'), () => copiarFallback(texto));
    } else {
      copiarFallback(texto);
    }
  };
  const copiarFallback = (texto) => {
    const ta = document.createElement('textarea');
    ta.value = texto; ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Enlace copiado'); } catch (e) { showToast('Copia: ' + texto); }
    ta.remove();
  };
  document.getElementById('btn-copiar').addEventListener('click', () => copiar(window.location.href));

  /* Compartir nativo (solo si el navegador lo soporta) */
  const btnShare = document.getElementById('btn-share-nativo');
  if (navigator.share) {
    btnShare.style.display = '';
    btnShare.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: 'Gael Pineda – Multiservicios & Lotes Campestres',
          text: 'Lotes campestres con financiación directa hasta 48 meses sin intereses.',
          url: window.location.href
        });
      } catch (e) { /* cancelado */ }
    });
  }

  /* Año del pie */
  document.getElementById('anio').textContent = new Date().getFullYear();

  /* Service worker */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
});
