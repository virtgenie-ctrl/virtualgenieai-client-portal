(() => {
  const form = document.getElementById('onboardingForm');
  const pages = [...document.querySelectorAll('.form-step')];
  const navButtons = [...document.querySelectorAll('.step')];
  const backBtn = document.getElementById('backBtn');
  const nextBtn = document.getElementById('nextBtn');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('statusMessage');
  const progressFill = document.getElementById('progressFill');
  const stepCount = document.getElementById('stepCount');
  const progressPercent = document.getElementById('progressPercent');
  const STORAGE_KEY = 'vgai-client-onboarding-draft-v1';
  let current = 0;

  document.getElementById('year').textContent = new Date().getFullYear();

  function setStatus(message, error=false) {
    status.textContent = message;
    status.style.color = error ? '#ff9aab' : '#72e7ce';
  }
  function updateUI() {
    pages.forEach((page, i) => page.classList.toggle('active', i === current));
    navButtons.forEach((button, i) => {
      button.classList.toggle('active', i === current);
      button.classList.toggle('done', i < current);
      if (i < current) button.querySelector('.step-num').textContent = '✓';
      else button.querySelector('.step-num').textContent = String(i + 1);
    });
    const percent = Math.round(((current + 1) / pages.length) * 100);
    progressFill.style.width = percent + '%';
    stepCount.textContent = `STEP ${current + 1} OF ${pages.length}`;
    progressPercent.textContent = percent + '%';
    backBtn.disabled = current === 0;
    nextBtn.innerHTML = current === pages.length - 1 ? 'Download summary <span>↓</span>' : 'Continue <span>→</span>';
    if (current === pages.length - 1) buildReview();
    setStatus('');
  }
  function valueOf(el) {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'file') return [...el.files].map(f => ({name:f.name,size:f.size,type:f.type}));
    return el.value;
  }
  function collectData() {
    const data = {};
    [...form.elements].forEach(el => {
      if (!el.name || el.type === 'button' || el.type === 'file') return;
      if (el.type === 'checkbox') {
        if (!data[el.name]) data[el.name] = [];
        if (el.checked) data[el.name].push(el.value);
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else data[el.name] = el.value;
    });
    data.selectedFiles = {};
    [...form.querySelectorAll('input[type=file]')].forEach(el => {
      data.selectedFiles[el.name] = [...el.files].map(f => ({name:f.name,size:f.size,type:f.type}));
    });
    data.savedAt = new Date().toISOString();
    return data;
  }
  function saveDraft() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({current, data:collectData()}));
      setStatus('Draft saved in this browser on this device.');
    } catch (e) {
      setStatus('Could not save draft in this browser. You can still continue.', true);
    }
  }
  function restoreDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || !saved.data) return;
      Object.entries(saved.data).forEach(([name, value]) => {
        if (name === 'selectedFiles' || name === 'savedAt') return;
        const elements = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
        elements.forEach(el => {
          if (el.type === 'checkbox') el.checked = Array.isArray(value) && value.includes(el.value);
          else if (el.type !== 'file' && typeof value === 'string') el.value = value;
        });
      });
      document.getElementById('descriptionCount').textContent = (form.elements.businessDescription.value || '').length;
      current = Math.max(0, Math.min(pages.length - 1, Number(saved.current) || 0));
      setStatus('Previous draft restored. Re-select any files; browsers do not restore file uploads.');
    } catch (e) {}
  }
  function validateCurrent() {
    const required = [...pages[current].querySelectorAll('[required]')];
    for (const el of required) {
      if (el.type === 'checkbox') {
        if (!el.checked) { el.focus(); setStatus('Please confirm the required checkbox before continuing.', true); return false; }
      } else if (!el.value.trim()) {
        el.focus();
        el.reportValidity?.();
        setStatus('Please complete the required fields before continuing.', true);
        return false;
      }
    }
    return true;
  }
  function buildReview() {
    const data = collectData();
    const fields = [
      ['Business name', data.businessName],['Business type', data.businessType],
      ['Contact person', data.contactPerson],['Phone / WhatsApp', data.phone],
      ['Address', data.address],['Services', data.services],
      ['Team profiles', data.teamProfiles],['Style preference', data.stylePreference],
      ['Preferred colours', data.colors],['Main website goals', (data.goals || []).join(', ')]
    ];
    document.getElementById('reviewSummary').innerHTML = fields.map(([label,value]) =>
      `<div class="review-item"><small>${escapeHTML(label)}</small><b>${escapeHTML(value || 'Not provided')}</b></div>`
    ).join('');
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function downloadSummary() {
    if (!validateCurrent()) return;
    const payload = collectData();
    payload.note = 'Prototype only: this file was generated locally. Files are listed by name only, not embedded or uploaded.';
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(payload.businessName || 'client').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}-onboarding.json`;
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    setStatus('Summary downloaded. This prototype has not submitted anything to VirtualGenieAI.');
  }
  nextBtn.addEventListener('click', () => {
    if (current < pages.length - 1) {
      if (!validateCurrent()) return;
      current++; updateUI(); window.scrollTo({top:0,behavior:'smooth'});
    } else downloadSummary();
  });
  backBtn.addEventListener('click', () => { current = Math.max(0,current-1); updateUI(); });
  saveBtn.addEventListener('click', saveDraft);
  navButtons.forEach(button => button.addEventListener('click', () => {
    const target = Number(button.dataset.step);
    if (target > current && !validateCurrent()) return;
    current = target; updateUI();
  }));
  form.addEventListener('input', e => {
    if (e.target.name === 'businessDescription') document.getElementById('descriptionCount').textContent = e.target.value.length;
  });
  form.querySelectorAll('input[type=file]').forEach(input => input.addEventListener('change', () => {
    const display = document.querySelector(`[data-for="${input.name}"]`);
    if (display) display.textContent = input.files.length ? [...input.files].map(f=>f.name).join(', ') : 'Choose file';
  }));
  restoreDraft();
  updateUI();
})();