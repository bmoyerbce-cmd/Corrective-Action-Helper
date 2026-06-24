
window.addEventListener('DOMContentLoaded', () => {
  const fromUrl = window.SupervisorCounselingDraft?.getDraftFromUrl?.();
  if (fromUrl) window.SupervisorCounselingDraft.applyDraft(fromUrl);
  document.querySelectorAll('input, textarea, select').forEach((el) => {
    el.disabled = true;
    el.setAttribute('aria-readonly', 'true');
  });
  document.querySelectorAll('#downloadWordBtn, #downloadPdfBtn').forEach((el) => { el.disabled = false; });
});
