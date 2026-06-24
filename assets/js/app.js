const STORAGE_KEY = 'supervisor-counseling-config-v2';
    const DEFAULT_CONFIG = {
      adminPassword: 'Titan2026!$',
      contracts: [
        { label: 'FLVS', jobTitle: 'Help Desk Coordinator II', location: 'Remote' },
        { label: 'OSCD', jobTitle: 'Help Desk Coordinator II', location: 'Remote' },
        { label: 'OCPS', jobTitle: 'Help Desk Coordinator II', location: 'Remote' },
        { label: 'IEN', jobTitle: 'Help Desk Coordinator II', location: 'Remote' },
        { label: 'Titan Help Desk', jobTitle: 'Help Desk Coordinator II', location: 'Remote' }
      ],
      reasonTemplates: {
        none: { label: 'None', contractLabel: 'ALL', forceFormType: 'written', reasonTop: '', reasonBottom: '', prior: '', policy: '', corrective: '', consequences: '' },
        flvsDnd: {
          label: 'FLVS Do Not Do Policy',
          contractLabel: 'FLVS',
          forceFormType: 'final',
          reasonTop: '[Agent Name] has failed to comply with the FLVS Do Not Do Policy. Across the most recent semi-monthly scorecard period [Period], [Agent Name] received a Quality Assurance score of 0.00% on the scorecard. Quality Assurance evaluations are conducted at a cadence of one evaluation per agent per week, with two evaluations included in each semi-monthly scorecard period. The evaluated call across this period received an automatic failure attributed to [Auto Fail Reason], in direct violation of the FLVS Do Not Do Policy, [Section of DND], which prohibits [Reason for auto fail directly from the DND Policy].',
          reasonBottom: 'The FLVS Do Not Do Policy explicitly states that violation of any part of the policy will result in an immediate Final Written Warning and/or termination of employment. Future violations of the FLVS Do Not Do Policy or any related Titan Technologies or FLVS policy may result in additional corrective action or termination of employment.',
          prior: 'On [Date], [Agent Name] signed acknowledgment of the FLVS Do Not Do Policy (Version 2.1), confirming receipt, review, and understanding of all prohibited actions, including the requirement to create a ticket for every contact made with the call center.',
          policy: 'FLVS Do Not Do Policy (Version 2.1, Effective April 17, 2026), Section [Section of DND] – [Section of DND]',
          corrective: '[Agent Name] and [Sup Name] reviewed the FLVS Do Not Do Policy on [Date] with [HCM Witness]. A copy of the policy was previously provided to [Agent Name] via email and is on file with her signed acknowledgment dated [Date of signed DND]. [Agent Name] understands that [infraction] and that any further violation of the FLVS Do Not Do Policy will result in immediate termination of employment.',
          consequences: 'Additional infractions of Titan or FLVS policy may result in additional corrective action, up to and including termination of employment.'
        }
      }
    };

    const state = {
      adminUnlocked: false,
      currentAdminTemplateKey: 'flvsDnd',
      config: loadConfig()
    };

    const formType = document.getElementById('formType');
    const contractSelect = document.getElementById('contractSelect');
    const reasonTemplateSelect = document.getElementById('reasonTemplateSelect');
    const docTitle = document.getElementById('docTitle');
    const reasonLabel = document.getElementById('reasonLabel');
    const warningTypeTable = document.getElementById('warningTypeTable');
    const priorDiscussionTable = document.getElementById('priorDiscussionTable');
    const consequencesTable = document.getElementById('consequencesTable');
    const verbalBox = document.getElementById('verbalBox');
    const writtenBox = document.getElementById('writtenBox');
    const finalBox = document.getElementById('finalBox');
    const flvsHelperCard = document.getElementById('flvsHelperCard');
    const helperStatus = document.getElementById('helperStatus');
    const reasonClosing = document.getElementById('reasonClosing');
    const scorecardShell = document.getElementById('scorecardShell');
    const contractPresetBadge = document.getElementById('contractPresetBadge');
    const locationText = document.getElementById('locationText');
    const templateHelperTitle = document.getElementById('templateHelperTitle');
    const templateHelperDescription = document.getElementById('templateHelperDescription');

    const formTabBtn = document.getElementById('formTabBtn');
    const adminTabBtn = document.getElementById('adminTabBtn');
    const formPanel = document.getElementById('formPanel');
    const adminPanel = document.getElementById('adminPanel');
    const workspace = document.querySelector('.workspace');

    const adminPassword = document.getElementById('adminPassword');
    const adminStatus = document.getElementById('adminStatus');
    const adminLockedView = document.getElementById('adminLockedView');
    const adminUnlockedView = document.getElementById('adminUnlockedView');
    const adminSaveStatus = document.getElementById('adminSaveStatus');
    const contractsJson = document.getElementById('contractsJson');
    const templateAdminSelect = document.getElementById('templateAdminSelect');
    const templateNameInput = document.getElementById('templateNameInput');
    const templateContractSelect = document.getElementById('templateContractSelect');
    const templateForceFormType = document.getElementById('templateForceFormType');
    const tplReasonTopConfig = document.getElementById('tplReasonTopConfig');
    const tplReasonBottomConfig = document.getElementById('tplReasonBottomConfig');
    const tplPriorConfig = document.getElementById('tplPriorConfig');
    const tplPolicyConfig = document.getElementById('tplPolicyConfig');
    const tplCorrectiveConfig = document.getElementById('tplCorrectiveConfig');
    const tplConsequencesConfig = document.getElementById('tplConsequencesConfig');

    const employeeName = document.getElementById('employeeName');
    const supervisor = document.getElementById('supervisor');
    const formDate = document.getElementById('formDate');
    const helperEmployeeName = document.getElementById('helperEmployeeName');
    const helperSupervisor = document.getElementById('helperSupervisor');
    const helperFormDate = document.getElementById('helperFormDate');

    const docFields = ['employeeName','jobTitle','supervisor','formDate','reasonMain','reasonClosing','priorDiscussion','policyViolated','correctiveAction','consequences','employeeComments','employeeSignature','employeeDate','supervisorSignature','supervisorDate','hcmSignature','hcmDate'];
    const helperFields = ['helperEmployeeName','helperSupervisor','helperFormDate','tplPeriod','tplCallRef','tplScore','tplAutoFailReason','tplDndSection','tplDndReason','tplAckDate','tplReviewDate','tplSignedDndDate','tplHcmWitness','tplInfraction'];

    function deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }

    function normalizeContract(item) {
      return {
        label: String(item.label || '').trim(),
        jobTitle: String(item.jobTitle || '').trim(),
        location: String(item.location || 'Remote').trim() || 'Remote'
      };
    }

    function normalizeTemplate(key, tpl) {
      return {
        label: String(tpl.label || key || '').trim() || 'Template',
        contractLabel: String(tpl.contractLabel || 'ALL').trim() || 'ALL',
        forceFormType: ['counseling','verbal','written','final'].includes(tpl.forceFormType) ? tpl.forceFormType : 'written',
        reasonTop: String(tpl.reasonTop || '').trim(),
        reasonBottom: String(tpl.reasonBottom || '').trim(),
        prior: String(tpl.prior || '').trim(),
        policy: String(tpl.policy || '').trim(),
        corrective: String(tpl.corrective || '').trim(),
        consequences: String(tpl.consequences || '').trim()
      };
    }

    function loadConfig() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const base = deepClone(DEFAULT_CONFIG);
        if (!raw) return base;
        const parsed = JSON.parse(raw);
        const contracts = Array.isArray(parsed.contracts) && parsed.contracts.length
          ? parsed.contracts.map(normalizeContract).filter((item) => item.label)
          : base.contracts;
        const templates = { none: normalizeTemplate('none', base.reasonTemplates.none) };
        const sourceTemplates = parsed.reasonTemplates && typeof parsed.reasonTemplates === 'object' ? parsed.reasonTemplates : {};
        Object.entries({ ...base.reasonTemplates, ...sourceTemplates }).forEach(([key, tpl]) => {
          if (key === 'none') return;
          templates[key] = normalizeTemplate(key, { ...(base.reasonTemplates[key] || {}), ...(sourceTemplates[key] || tpl || {}) });
        });
        return {
          adminPassword: parsed.adminPassword || base.adminPassword,
          contracts,
          reasonTemplates: templates
        };
      } catch (err) {
        return deepClone(DEFAULT_CONFIG);
      }
    }

    function saveConfig() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.config));
    }

    function getSelectedContract() {
      return state.config.contracts[Number(contractSelect.value)] || state.config.contracts[0] || { label: 'Unknown', jobTitle: '', location: 'Remote' };
    }

    function getCurrentTemplate() {
      return state.config.reasonTemplates[reasonTemplateSelect.value] || null;
    }

    function setActiveTab(tab) {
      const isAdmin = tab === 'admin';
      formTabBtn.classList.toggle('active', !isAdmin);
      adminTabBtn.classList.toggle('active', isAdmin);
      formPanel.classList.toggle('hidden', isAdmin);
      adminPanel.classList.toggle('hidden', !isAdmin);
      workspace.classList.toggle('admin-mode', isAdmin);
    }

    function autoGrow(el) {
      if (!el) return;
      const minHeight = Number(el.dataset.minHeight || 0);
      el.style.height = 'auto';
      el.style.height = Math.max(el.scrollHeight, minHeight) + 'px';
    }

    function populateContractSelect() {
      contractSelect.innerHTML = '';
      state.config.contracts.forEach((contract, idx) => {
        const opt = document.createElement('option');
        opt.value = String(idx);
        opt.textContent = contract.label;
        contractSelect.appendChild(opt);
      });
    }

    function populateReasonTemplateSelect(preferredValue) {
      const selectedContract = getSelectedContract().label;
      const currentValue = preferredValue ?? reasonTemplateSelect.value;
      reasonTemplateSelect.innerHTML = '';
      Object.entries(state.config.reasonTemplates).forEach(([key, template]) => {
        const allowed = key === 'none' || template.contractLabel === 'ALL' || template.contractLabel === selectedContract;
        if (!allowed) return;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key === 'none' ? template.label : `${template.label} (${template.contractLabel})`;
        reasonTemplateSelect.appendChild(opt);
      });
      const allowedValues = Array.from(reasonTemplateSelect.options).map((opt) => opt.value);
      reasonTemplateSelect.value = allowedValues.includes(currentValue) ? currentValue : 'none';
    }

    function populateAdminTemplateContractOptions() {
      templateContractSelect.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = 'ALL';
      allOpt.textContent = 'All Contracts';
      templateContractSelect.appendChild(allOpt);
      state.config.contracts.forEach((contract) => {
        const opt = document.createElement('option');
        opt.value = contract.label;
        opt.textContent = contract.label;
        templateContractSelect.appendChild(opt);
      });
    }

    function renderTemplateAdminOptions(preferredKey) {
      templateAdminSelect.innerHTML = '';
      const newOpt = document.createElement('option');
      newOpt.value = '__new__';
      newOpt.textContent = '+ Create New Template';
      templateAdminSelect.appendChild(newOpt);
      Object.entries(state.config.reasonTemplates).forEach(([key, template]) => {
        if (key === 'none') return;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${template.label} (${template.contractLabel})`;
        templateAdminSelect.appendChild(opt);
      });
      templateAdminSelect.value = preferredKey && Array.from(templateAdminSelect.options).some((opt) => opt.value === preferredKey)
        ? preferredKey
        : 'flvsDnd';
    }

    function applyContractPreset() {
      const preset = getSelectedContract();
      document.getElementById('jobTitle').value = preset.jobTitle || '';
      locationText.textContent = preset.location || 'Remote';
      contractPresetBadge.textContent = `${preset.label} preset applied`;
      populateReasonTemplateSelect(reasonTemplateSelect.value);
      updateTemplateVisibility();
    }

    function applyType() {
      const type = formType.value;
      const isCounseling = type === 'counseling';
      document.documentElement.style.setProperty('--doc-font', isCounseling ? 'Calibri, Arial, sans-serif' : 'Arial, sans-serif');
      docTitle.textContent = isCounseling ? 'Employee Counseling Form' : 'Disciplinary Action Form';
      reasonLabel.textContent = isCounseling
        ? 'Reason for Counseling (violation of company policy or unsatisfactory performance/behavior):'
        : 'Reason for warning (violation of company policy or unsatisfactory performance/behavior):';
      warningTypeTable.classList.toggle('hidden', isCounseling);
      priorDiscussionTable.classList.toggle('hidden', isCounseling);
      consequencesTable.classList.toggle('hidden', isCounseling);
      verbalBox.textContent = type === 'verbal' ? '☒' : '☐';
      writtenBox.textContent = type === 'written' ? '☒' : '☐';
      finalBox.textContent = type === 'final' ? '☒' : '☐';
    }

    function syncHelperFieldsFromMain() {
      helperEmployeeName.value = employeeName.value;
      helperSupervisor.value = supervisor.value;
      helperFormDate.value = formDate.value;
    }

    function syncMainFieldsFromHelper() {
      employeeName.value = helperEmployeeName.value;
      supervisor.value = helperSupervisor.value;
      formDate.value = helperFormDate.value;
    }

    function defaultDateToken() {
      return helperFormDate.value || formDate.value || '[Date]';
    }

    function replaceTokens(text, overrides = {}) {
      const agent = employeeName.value || helperEmployeeName.value || '[Agent Name]';
      const sup = supervisor.value || helperSupervisor.value || '[Sup Name]';
      const values = {
        '[Agent Name]': agent,
        '[Agent name]': agent,
        '[Sup Name]': sup,
        '[Period]': document.getElementById('tplPeriod').value || '[Period]',
        '[Call Ref]': document.getElementById('tplCallRef').value || '[Call Ref]',
        '[Score]': document.getElementById('tplScore').value || '[Score]',
        '[Auto Fail Reason]': document.getElementById('tplAutoFailReason').value || '[Auto Fail Reason]',
        '[Section of DND]': document.getElementById('tplDndSection').value || '[Section of DND]',
        '[Reason for auto fail directly from the DND Policy]': document.getElementById('tplDndReason').value || '[Reason for auto fail directly from the DND Policy]',
        '[Date]': overrides.date || defaultDateToken(),
        '[Date of signed DND]': document.getElementById('tplSignedDndDate').value || '[Date of signed DND]',
        '[HCM Witness]': document.getElementById('tplHcmWitness').value || '[HCM Witness]',
        '[infraction]': document.getElementById('tplInfraction').value || '[infraction]'
      };
      let output = text || '';
      Object.entries(values).forEach(([token, value]) => {
        output = output.split(token).join(value);
      });
      return output;
    }

    function updateTemplateVisibility() {
      const template = getCurrentTemplate();
      const contractLabel = getSelectedContract().label;
      const hasTemplate = !!template && reasonTemplateSelect.value !== 'none';
      const isFlvs = hasTemplate && reasonTemplateSelect.value === 'flvsDnd';
      flvsHelperCard.classList.toggle('hidden', !hasTemplate);
      scorecardShell.classList.toggle('hidden', !isFlvs);
      reasonClosing.classList.toggle('hidden', !(hasTemplate && template.reasonBottom));
      if (hasTemplate) {
        templateHelperTitle.textContent = `${template.label} Helper`;
        templateHelperDescription.textContent = `Assigned to ${template.contractLabel}. Fill the helper details below, then click Apply Template to replace placeholders.`;
        injectReasonTemplatePreview(true);
        helperStatus.textContent = `${template.label} was added to the form with placeholders. Complete the helper fields, then click Apply Template to finish the prefill.`;
      } else {
        helperStatus.textContent = contractLabel === 'FLVS'
          ? 'Select a reason template to load helper options.'
          : `No reason templates are currently assigned to ${contractLabel}. Admins can add one in the Admin tab.`;
      }
      syncScorecardPreview();
      autoGrow(document.getElementById('reasonMain'));
      autoGrow(reasonClosing);
    }

    function injectReasonTemplatePreview(force = false) {
      const template = getCurrentTemplate();
      if (!template || reasonTemplateSelect.value === 'none') return;
      const previewFields = ['reasonMain', 'reasonClosing', 'priorDiscussion', 'policyViolated', 'correctiveAction', 'consequences'];
      const hasUserContent = previewFields.some((id) => {
        const el = document.getElementById(id);
        return el && (el.value || '').trim() !== '';
      });
      if (hasUserContent && !force) return;
      document.getElementById('reasonMain').value = replaceTokens(template.reasonTop, { date: '[Date]' });
      document.getElementById('reasonClosing').value = replaceTokens(template.reasonBottom, { date: '[Date]' });
      document.getElementById('priorDiscussion').value = replaceTokens(template.prior, { date: '[Date]' });
      document.getElementById('policyViolated').value = replaceTokens(template.policy, { date: '[Date]' });
      document.getElementById('correctiveAction').value = replaceTokens(template.corrective, { date: '[Date]' });
      document.getElementById('consequences').value = replaceTokens(template.consequences, { date: '[Date]' });
      if (template.forceFormType) {
        formType.value = template.forceFormType;
        applyType();
      }
      document.querySelectorAll('.doc-textarea').forEach(autoGrow);
    }

    function applyReasonTemplate() {
      const template = getCurrentTemplate();
      if (!template || reasonTemplateSelect.value === 'none') return;
      const ackDate = document.getElementById('tplAckDate').value || defaultDateToken();
      const reviewDate = document.getElementById('tplReviewDate').value || defaultDateToken();
      document.getElementById('reasonMain').value = replaceTokens(template.reasonTop, { date: reviewDate });
      document.getElementById('reasonClosing').value = replaceTokens(template.reasonBottom, { date: reviewDate });
      document.getElementById('priorDiscussion').value = replaceTokens(template.prior, { date: ackDate });
      document.getElementById('policyViolated').value = replaceTokens(template.policy, { date: reviewDate });
      document.getElementById('correctiveAction').value = replaceTokens(template.corrective, { date: reviewDate });
      document.getElementById('consequences').value = replaceTokens(template.consequences, { date: reviewDate });
      if (template.forceFormType) {
        formType.value = template.forceFormType;
        applyType();
      }
      document.querySelectorAll('.doc-textarea').forEach(autoGrow);
      helperStatus.textContent = `${template.label} applied to the form with your helper values.`;
    }

    function syncScorecardPreview() {
      document.getElementById('scorecardPeriodView').textContent = document.getElementById('tplPeriod').value || '[Period]';
      document.getElementById('scorecardCallView').textContent = document.getElementById('tplCallRef').value || '[Call Ref]';
      document.getElementById('scorecardScoreView').textContent = document.getElementById('tplScore').value || '[Score]';
    }

    function clearForm() {
      docFields.concat(helperFields).forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.value = '';
      });
      applyContractPreset();
      applyType();
      syncHelperFieldsFromMain();
      updateTemplateVisibility();
      syncScorecardPreview();
      document.querySelectorAll('.doc-textarea').forEach(autoGrow);
    }

    function buildStaticPaper() {
      const paper = document.getElementById('paper');
      const clone = paper.cloneNode(true);
      const originals = paper.querySelectorAll('input, textarea');
      const clones = clone.querySelectorAll('input, textarea');
      originals.forEach((orig, idx) => {
        const value = orig.value || '';
        const replacement = document.createElement(orig.tagName === 'TEXTAREA' ? 'div' : 'span');
        replacement.textContent = value;
        replacement.className = orig.tagName === 'TEXTAREA' ? 'export-text block' : ('export-text ' + (orig.classList.contains('inline') ? 'inline' : 'block'));
        clones[idx].replaceWith(replacement);
      });
      return clone;
    }

    function buildExportHtml() {
      const styleText = document.querySelector('style').innerHTML;
      const staticPaper = buildStaticPaper();
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${styleText}</style></head><body><section class="paper">${staticPaper.innerHTML}</section></body></html>`;
    }

    function safeFilenamePart(value, fallback) {
      const clean = String(value || '').trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
      return clean || fallback;
    }

    function downloadBlob(blob, fileName) {
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    function downloadWord() {
      try {
        if (!window.htmlDocx || typeof window.htmlDocx.asBlob !== 'function') {
          throw new Error('htmlDocx library not loaded');
        }
        const html = buildExportHtml();
        const blob = window.htmlDocx.asBlob(html, {
          orientation: 'portrait',
          margins: { top: 1080, right: 1440, bottom: 1080, left: 1440, header: 720, footer: 720, gutter: 0 }
        });
        const fileName = `${safeFilenamePart(formType.value, 'form')}_${safeFilenamePart(employeeName.value, 'employee')}.docx`;
        downloadBlob(blob, fileName);
      } catch (error) {
        console.error(error);
        alert('Word export could not be completed. Please confirm network access to the page libraries and try again.');
      }
    }

    async function downloadPdf() {
      const host = document.createElement('div');
      host.style.position = 'fixed';
      host.style.left = '-99999px';
      host.style.top = '0';
      host.appendChild(buildStaticPaper());
      document.body.appendChild(host);
      const fileName = `${safeFilenamePart(formType.value, 'form')}_${safeFilenamePart(employeeName.value, 'employee')}.pdf`;
      try {
        await html2pdf().set({
          margin: 0,
          filename: fileName,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'] }
        }).from(host.firstElementChild).save();
      } finally {
        host.remove();
      }
    }

    function createTemplateKey(name) {
      const base = String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'template';
      let key = base;
      let i = 2;
      while (state.config.reasonTemplates[key] && key !== state.currentAdminTemplateKey) {
        key = `${base}_${i++}`;
      }
      return key;
    }

    function fillAdminForm() {
      contractsJson.value = JSON.stringify(state.config.contracts, null, 2);
      populateAdminTemplateContractOptions();
      renderTemplateAdminOptions(state.currentAdminTemplateKey || 'flvsDnd');
      loadTemplateIntoAdminBuilder(state.currentAdminTemplateKey || 'flvsDnd');
    }

    function loadTemplateIntoAdminBuilder(key) {
      if (key === '__new__') {
        state.currentAdminTemplateKey = null;
        templateAdminSelect.value = '__new__';
        templateNameInput.value = '';
        templateContractSelect.value = 'ALL';
        templateForceFormType.value = 'written';
        tplReasonTopConfig.value = '';
        tplReasonBottomConfig.value = '';
        tplPriorConfig.value = '';
        tplPolicyConfig.value = '';
        tplCorrectiveConfig.value = '';
        tplConsequencesConfig.value = '';
        return;
      }
      const template = state.config.reasonTemplates[key];
      if (!template) return;
      state.currentAdminTemplateKey = key;
      templateAdminSelect.value = key;
      templateNameInput.value = template.label || '';
      templateContractSelect.value = template.contractLabel || 'ALL';
      templateForceFormType.value = template.forceFormType || 'written';
      tplReasonTopConfig.value = template.reasonTop || '';
      tplReasonBottomConfig.value = template.reasonBottom || '';
      tplPriorConfig.value = template.prior || '';
      tplPolicyConfig.value = template.policy || '';
      tplCorrectiveConfig.value = template.corrective || '';
      tplConsequencesConfig.value = template.consequences || '';
    }

    function unlockAdmin() {
      if (adminPassword.value !== state.config.adminPassword) {
        adminStatus.textContent = 'Incorrect password';
        return;
      }
      state.adminUnlocked = true;
      adminStatus.textContent = 'Unlocked';
      adminStatus.className = 'status-text success';
      adminLockedView.classList.add('hidden');
      adminUnlockedView.classList.remove('hidden');
      fillAdminForm();
    }

    function saveAdminSettings() {
      try {
        const parsedContracts = JSON.parse(contractsJson.value);
        if (!Array.isArray(parsedContracts) || !parsedContracts.length) throw new Error('Contracts JSON must be a non-empty array.');
        state.config.contracts = parsedContracts.map(normalizeContract).filter((item) => item.label);
        if (!state.config.contracts.length) throw new Error('At least one contract is required.');

        const templateName = templateNameInput.value.trim();
        if (!templateName) throw new Error('Template name is required.');
        const editingKey = state.currentAdminTemplateKey;
        const key = editingKey || createTemplateKey(templateName);
        state.config.reasonTemplates[key] = normalizeTemplate(key, {
          label: templateName,
          contractLabel: templateContractSelect.value || 'ALL',
          forceFormType: templateForceFormType.value || 'written',
          reasonTop: tplReasonTopConfig.value,
          reasonBottom: tplReasonBottomConfig.value,
          prior: tplPriorConfig.value,
          policy: tplPolicyConfig.value,
          corrective: tplCorrectiveConfig.value,
          consequences: tplConsequencesConfig.value
        });
        if (key === 'flvsDnd') state.config.reasonTemplates[key].contractLabel = 'FLVS';
        state.currentAdminTemplateKey = key;
        state.config.reasonTemplates.none = normalizeTemplate('none', DEFAULT_CONFIG.reasonTemplates.none);
        saveConfig();

        populateContractSelect();
        populateAdminTemplateContractOptions();
        renderTemplateAdminOptions(key);
        loadTemplateIntoAdminBuilder(key);
        populateReasonTemplateSelect(reasonTemplateSelect.value === 'none' ? 'none' : key);
        applyContractPreset();
        updateTemplateVisibility();
        adminSaveStatus.textContent = 'Admin settings saved.';
        adminSaveStatus.className = 'status-text success';
      } catch (error) {
        adminSaveStatus.textContent = error.message || 'Unable to save settings.';
        adminSaveStatus.className = 'status-text';
      }
    }

    function deleteSelectedTemplate() {
      const key = templateAdminSelect.value;
      if (!key || key === '__new__') return;
      if (key === 'flvsDnd') {
        adminSaveStatus.textContent = 'The default FLVS template cannot be deleted, but it can be edited.';
        adminSaveStatus.className = 'status-text';
        return;
      }
      if (!confirm('Delete the selected reason template?')) return;
      delete state.config.reasonTemplates[key];
      state.currentAdminTemplateKey = 'flvsDnd';
      saveConfig();
      renderTemplateAdminOptions('flvsDnd');
      loadTemplateIntoAdminBuilder('flvsDnd');
      populateReasonTemplateSelect('none');
      updateTemplateVisibility();
      adminSaveStatus.textContent = 'Template deleted.';
      adminSaveStatus.className = 'status-text success';
    }

    function resetAdminSettings() {
      if (!confirm('Reset admin settings to defaults?')) return;
      state.config = deepClone(DEFAULT_CONFIG);
      state.currentAdminTemplateKey = 'flvsDnd';
      saveConfig();
      populateContractSelect();
      populateReasonTemplateSelect('none');
      fillAdminForm();
      contractSelect.value = '0';
      applyContractPreset();
      applyType();
      syncHelperFieldsFromMain();
      updateTemplateVisibility();
      adminSaveStatus.textContent = 'Defaults restored.';
      adminSaveStatus.className = 'status-text success';
    }

    document.querySelectorAll('.doc-textarea').forEach((textarea) => {
      autoGrow(textarea);
      textarea.addEventListener('input', () => autoGrow(textarea));
    });

    helperFields.filter((id) => !['helperEmployeeName','helperSupervisor','helperFormDate'].includes(id)).forEach((id) => {
      document.getElementById(id).addEventListener('input', syncScorecardPreview);
    });

    employeeName.addEventListener('input', syncHelperFieldsFromMain);
    supervisor.addEventListener('input', syncHelperFieldsFromMain);
    formDate.addEventListener('input', syncHelperFieldsFromMain);
    helperEmployeeName.addEventListener('input', syncMainFieldsFromHelper);
    helperSupervisor.addEventListener('input', syncMainFieldsFromHelper);
    helperFormDate.addEventListener('input', syncMainFieldsFromHelper);

    formType.addEventListener('change', applyType);
    contractSelect.addEventListener('change', applyContractPreset);
    reasonTemplateSelect.addEventListener('change', updateTemplateVisibility);
    document.getElementById('downloadWordBtn').addEventListener('click', downloadWord);
    document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
    document.getElementById('clearBtn').addEventListener('click', clearForm);
    document.getElementById('applyReasonTemplateBtn').addEventListener('click', applyReasonTemplate);
    formTabBtn.addEventListener('click', () => setActiveTab('form'));
    adminTabBtn.addEventListener('click', () => setActiveTab('admin'));
    document.getElementById('unlockAdminBtn').addEventListener('click', unlockAdmin);
    document.getElementById('saveAdminBtn').addEventListener('click', saveAdminSettings);
    document.getElementById('resetAdminBtn').addEventListener('click', resetAdminSettings);
    document.getElementById('newTemplateBtn').addEventListener('click', () => loadTemplateIntoAdminBuilder('__new__'));
    document.getElementById('deleteTemplateBtn').addEventListener('click', deleteSelectedTemplate);
    templateAdminSelect.addEventListener('change', (e) => loadTemplateIntoAdminBuilder(e.target.value));

    populateContractSelect();
    contractSelect.value = '0';
    populateReasonTemplateSelect('none');
    applyContractPreset();
    applyType();
    syncHelperFieldsFromMain();
    updateTemplateVisibility();
    syncScorecardPreview();
    setActiveTab('form');

// GitHub Pages helpers: draft persistence and read-page sharing
(function () {
  const DRAFT_KEY = 'supervisor-counseling-draft-v1';
  const shareButtonId = 'openReadPageBtn';
  const saveButtonId = 'saveDraftBtn';
  function collectDraft() {
    const ids = [...docFields, ...helperFields, 'formType', 'contractSelect', 'reasonTemplateSelect'];
    const data = {};
    ids.forEach((id) => { const el = document.getElementById(id); if (el) data[id] = el.value ?? el.textContent ?? ''; });
    data.locationText = document.getElementById('locationText')?.textContent || '';
    return data;
  }
  function applyDraft(data) {
    if (!data || typeof data !== 'object') return;
    ['formType', 'contractSelect', 'reasonTemplateSelect'].forEach((id) => { const el = document.getElementById(id); if (el && data[id] !== undefined) el.value = data[id]; });
    if (typeof applyType === 'function') applyType();
    if (typeof applyContractPreset === 'function') applyContractPreset();
    [...docFields, ...helperFields].forEach((id) => { const el = document.getElementById(id); if (el && data[id] !== undefined) el.value = data[id]; });
    if (typeof syncHelperFieldsFromMain === 'function') syncHelperFieldsFromMain();
    if (typeof syncScorecardPreview === 'function') syncScorecardPreview();
    if (typeof updateTemplateVisibility === 'function') updateTemplateVisibility();
  }
  function saveDraft() { localStorage.setItem(DRAFT_KEY, JSON.stringify(collectDraft())); const status = document.getElementById('helperStatus'); if (status) status.textContent = 'Draft saved in this browser.'; }
  function loadDraftFromStorage() { try { applyDraft(JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')); } catch (e) {} }
  function encodeDraft(data) { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
  function decodeDraft(encoded) { return JSON.parse(decodeURIComponent(escape(atob(encoded)))); }
  function getDraftFromUrl() { const params = new URLSearchParams(window.location.search); const encoded = params.get('data') || window.location.hash.replace(/^#data=/, ''); return encoded ? decodeDraft(encoded) : null; }
  function openReadPage() { const data = collectDraft(); localStorage.setItem(DRAFT_KEY, JSON.stringify(data)); window.location.href = `read.html#data=${encodeDraft(data)}`; }
  function addGithubButtons() {
    const controls = document.querySelector('.bar-controls');
    if (!controls || document.getElementById(saveButtonId)) return;
    const save = document.createElement('button'); save.className = 'secondary'; save.id = saveButtonId; save.type = 'button'; save.textContent = 'Save Draft'; save.addEventListener('click', saveDraft);
    const read = document.createElement('button'); read.className = 'secondary'; read.id = shareButtonId; read.type = 'button'; read.textContent = 'Read Page'; read.addEventListener('click', openReadPage);
    controls.append(save, read);
  }
  window.SupervisorCounselingDraft = { collectDraft, applyDraft, saveDraft, loadDraftFromStorage, getDraftFromUrl, openReadPage };
  window.addEventListener('DOMContentLoaded', () => { addGithubButtons(); const fromUrl = getDraftFromUrl(); if (fromUrl) applyDraft(fromUrl); else loadDraftFromStorage(); });
})();

