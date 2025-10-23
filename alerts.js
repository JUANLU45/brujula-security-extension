/**
 * Brújula Security - Alert System
 * Sistema de inyección de alertas visuales en páginas web
 */

/**
 * Crea y muestra un badge verde (sitio verificado)
 */
function showGreenBadge() {
  console.log('🟢 [Brújula Security] showGreenBadge() LLAMADA');
  
  // Verificar que no exista ya
  if (document.getElementById('brujula-security-badge')) {
    console.log('⚠️ [Brújula Security] Badge ya existe, no crear duplicado');
    return;
  }
  
  console.log('✅ [Brújula Security] Creando badge verde...');
  
  const badge = document.createElement('div');
  badge.id = 'brujula-security-badge';
  badge.className = 'brujula-badge-green';
  badge.setAttribute('role', 'status');
  badge.setAttribute('aria-label', chrome.i18n.getMessage('verifiedSite'));
  
  badge.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${chrome.i18n.getMessage('verified')}</span>
  `;
  
  document.body.appendChild(badge);
  console.log('✅ [Brújula Security] Badge verde INYECTADO en DOM');
  
  // Auto-hide después de 5 segundos
  setTimeout(() => {
    console.log('⏰ [Brújula Security] Badge verde desapareciendo...');
    badge.style.opacity = '0';
    setTimeout(() => {
      badge.remove();
      console.log('🗑️ [Brújula Security] Badge verde eliminado del DOM');
    }, 300);
  }, 5000);
}

/**
 * Crea y muestra una alerta amarilla (precaución)
 * @param {string} message - Mensaje de la alerta
 */
function showYellowAlert(message) {
  // Verificar que no exista ya
  if (document.getElementById('brujula-security-alert')) {
    return;
  }
  
  const alert = document.createElement('div');
  alert.id = 'brujula-security-alert';
  alert.className = 'brujula-alert-yellow';
  alert.setAttribute('role', 'alert');
  alert.setAttribute('aria-live', 'assertive');
  
  alert.innerHTML = `
    <div class="brujula-alert-content">
      <div class="brujula-alert-icon">⚠️</div>
      <div class="brujula-alert-text">
        <h3>${chrome.i18n.getMessage('caution')}</h3>
        <p>${message}</p>
        <p class="brujula-alert-tip">${chrome.i18n.getMessage('cautionTip')}</p>
        <div class="brujula-alert-links">
          <a href="https://brujulacrypto.com/blog" target="_blank" rel="noopener noreferrer" class="brujula-link-blog">
            📚 ${chrome.i18n.getMessage('learnMore')} →
          </a>
        </div>
      </div>
      <button class="brujula-alert-close" aria-label="${chrome.i18n.getMessage('close')}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(alert);
  
  // Event listener para cerrar
  const closeBtn = alert.querySelector('.brujula-alert-close');
  closeBtn.addEventListener('click', () => {
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 300);
  });
}

/**
 * Crea y muestra una alerta roja (peligro)
 * @param {Object} threatData - Datos de la amenaza
 */
function showRedAlert(threatData) {
  // Verificar que no exista ya
  if (document.getElementById('brujula-security-danger')) {
    return;
  }
  
  const overlay = document.createElement('div');
  overlay.id = 'brujula-security-danger';
  overlay.className = 'brujula-alert-red-overlay';
  overlay.setAttribute('role', 'alertdialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'brujula-alert-title');
  
  // Mensaje educativo del elevator pitch
  const educationalMessage = chrome.i18n.getMessage('educationalMessage');
  const learnMoreText = chrome.i18n.getMessage('learnMore');
  
  // Construir mensaje específico según tipo de amenaza
  let actionButton = '';
  if (threatData.type === 'typosquatting' && threatData.similar) {
    actionButton = `
      <button id="brujula-go-official" class="brujula-btn-primary">
        ${chrome.i18n.getMessage('goToOfficialSite', [threatData.similar])}
      </button>
    `;
  }
  
  overlay.innerHTML = `
    <div class="brujula-alert-red-modal">
      <div class="brujula-alert-red-header">
        <div class="brujula-alert-red-icon">🚨</div>
        <h2 id="brujula-alert-title">${chrome.i18n.getMessage('phishingDetected')}</h2>
      </div>
      
      <div class="brujula-alert-red-body">
        <p class="brujula-alert-red-message">${threatData.message}</p>
        
        ${threatData.type === 'typosquatting' ? `
          <div class="brujula-alert-comparison">
            <div class="brujula-domain-fake">
              <span class="brujula-label">${chrome.i18n.getMessage('currentSite')}:</span>
              <span class="brujula-value">${window.location.hostname}</span>
            </div>
            <div class="brujula-domain-real">
              <span class="brujula-label">${chrome.i18n.getMessage('officialSite')}:</span>
              <span class="brujula-value">${threatData.similar}</span>
            </div>
          </div>
        ` : ''}
        
        <div class="brujula-alert-education">
          <h4>${chrome.i18n.getMessage('didYouKnow')}</h4>
          <p>${educationalMessage}</p>
          <a href="https://brujulacrypto.com/seguridad" target="_blank" rel="noopener noreferrer">
            ${learnMoreText} →
          </a>
        </div>
      </div>
      
      <div class="brujula-alert-red-footer">
        ${actionButton}
        <button id="brujula-close-tab" class="brujula-btn-danger">
          ${chrome.i18n.getMessage('closeThisPage')}
        </button>
        <button id="brujula-trust-site" class="brujula-btn-trust">
          ${chrome.i18n.getMessage('trustThisSite')}
        </button>
        <button id="brujula-ignore" class="brujula-btn-secondary">
          ${chrome.i18n.getMessage('ignoreWarning')}
        </button>
      </div>
      
      <div class="brujula-alert-branding">
        <span>${chrome.i18n.getMessage('protectedBy')}</span>
        <strong>Brújula Security</strong>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Event listeners para botones
  if (threatData.type === 'typosquatting' && threatData.similar) {
    const goOfficialBtn = document.getElementById('brujula-go-official');
    if (goOfficialBtn) {
      goOfficialBtn.addEventListener('click', () => {
        window.location.href = `https://${threatData.similar}`;
      });
    }
  }
  
  const closeTabBtn = document.getElementById('brujula-close-tab');
  if (closeTabBtn) {
    closeTabBtn.addEventListener('click', () => {
      window.close();
      // Si window.close() no funciona (no abrió desde script), ir a página segura
      setTimeout(() => {
        window.location.href = 'https://brujulacrypto.com';
      }, 100);
    });
  }
  
  // Botón "Confío en este sitio"
  const trustSiteBtn = document.getElementById('brujula-trust-site');
  if (trustSiteBtn) {
    trustSiteBtn.addEventListener('click', async () => {
      try {
        // Agregar dominio a whitelist
        const domain = window.location.hostname;
        const result = await chrome.storage.local.get(['settings']);
        const settings = result.settings || { whitelist: [] };
        
        if (!settings.whitelist) {
          settings.whitelist = [];
        }
        
        if (!settings.whitelist.includes(domain)) {
          settings.whitelist.push(domain);
          await chrome.storage.local.set({ settings });
          
          // Mostrar confirmación
          overlay.innerHTML = `
            <div class="brujula-alert-red-modal" style="background: #48bb78;">
              <div class="brujula-alert-red-header">
                <div class="brujula-alert-red-icon">✅</div>
                <h2>${chrome.i18n.getMessage('addedToWhitelist')}</h2>
              </div>
              <div class="brujula-alert-red-body">
                <p style="color: white;">${chrome.i18n.getMessage('neverShowAgain')}</p>
                <p style="color: white; margin-top: 12px;"><strong>${domain}</strong></p>
              </div>
            </div>
          `;
          
          // Cerrar después de 2 segundos
          setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
          }, 2000);
        }
      } catch (error) {
        console.error('[Brújula Security] Error agregando a whitelist:', error);
      }
    });
  }
  
  const ignoreBtn = document.getElementById('brujula-ignore');
  if (ignoreBtn) {
    ignoreBtn.addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
      
      // Registrar que el usuario ignoró la advertencia
      chrome.runtime.sendMessage({
        action: 'userIgnoredWarning',
        hostname: window.location.hostname,
        threatType: threatData.type
      });
    });
  }
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}

/**
 * Muestra la alerta apropiada según el nivel de amenaza
 * Respeta la configuración del usuario
 * @param {Object} analysisResult - Resultado del análisis
 */
async function showAppropriateAlert(analysisResult) {
  console.log('🎯 [Brújula Security] showAppropriateAlert() llamada con:', analysisResult);
  
  if (!analysisResult) {
    console.log('❌ [Brújula Security] analysisResult es null/undefined');
    return;
  }
  
  // Cargar configuración del usuario
  let settings = { showVisualAlerts: true };
  try {
    const stored = await chrome.storage.local.get(['settings']);
    if (stored.settings) {
      settings = { ...settings, ...stored.settings };
    }
  } catch (error) {
    console.warn('[Brújula Security] No se pudo cargar configuración de alertas:', error);
  }
  
  // Si el usuario desactivó las alertas visuales, no mostrar nada
  if (!settings.showVisualAlerts) {
    console.log('🔕 [Brújula Security] Alertas visuales desactivadas por el usuario');
    return;
  }
  
  console.log(`📊 [Brújula Security] Threat: ${analysisResult.threat}, Type: ${analysisResult.type}`);
  
  switch (analysisResult.threat) {
    case 'NONE':
      if (analysisResult.type === 'verified') {
        console.log('✅ [Brújula Security] Sitio verificado, mostrando badge verde...');
        showGreenBadge();
      } else if (analysisResult.type === 'whitelisted') {
        console.log('✅ [Brújula Security] Sitio en whitelist del usuario');
      } else {
        console.log('ℹ️ [Brújula Security] Sin amenaza pero no verificado, no mostrar nada');
      }
      break;
      
    case 'MEDIUM':
      showYellowAlert(analysisResult.message);
      break;
      
    case 'HIGH':
      showRedAlert(analysisResult);
      break;
      
    default:
      break;
  }
  
  // Enviar estadística al background
  chrome.runtime.sendMessage({
    action: 'recordThreat',
    threat: analysisResult.threat,
    type: analysisResult.type,
    hostname: window.location.hostname
  });
}

/**
 * Limpia todas las alertas existentes
 */
function clearAllAlerts() {
  const badge = document.getElementById('brujula-security-badge');
  const alert = document.getElementById('brujula-security-alert');
  const danger = document.getElementById('brujula-security-danger');
  
  if (badge) badge.remove();
  if (alert) alert.remove();
  if (danger) {
    danger.remove();
    document.body.style.overflow = '';
  }
}

// Hacer funciones disponibles globalmente para content.js
window.showGreenBadge = showGreenBadge;
window.showYellowAlert = showYellowAlert;
window.showRedAlert = showRedAlert;
window.showAppropriateAlert = showAppropriateAlert;
window.clearAllAlerts = clearAllAlerts;
