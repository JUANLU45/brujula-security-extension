/**
 * Brújula Security - Popup Script
 * Lógica del popup con 3 pestañas: Acerca de, Estadísticas, Configuración
 */

(function() {
  'use strict';
  
  // Estado de la UI
  let currentTab = 'about';
  let stats = null;
  
  /**
   * Inicializa la internacionalización (i18n)
   */
  function initI18n() {
    // Obtener todos los elementos con mensajes i18n
    const elements = {
      // Header
      'aboutTitle': 'aboutTitle',
      'aboutSubtitle': 'aboutSubtitle',
      
      // Tabs
      'tab-about-text': 'about',
      'tab-stats-text': 'statistics',
      'tab-settings-text': 'settings',
      'tab-help-text': 'help',
      
      // Panel Acerca de
      'aboutDescription': 'aboutDescription',
      'aboutElevatorPitch': 'aboutElevatorPitch',
      'howToUseTitle': 'howToUseTitle',
      'howToUseStep1': 'howToUseStep1',
      'howToUseStep2': 'howToUseStep2',
      'howToUseStep3': 'howToUseStep3',
      'howToUseStep4': 'howToUseStep4',
      'howToUseStep5': 'howToUseStep5',
      'aboutFeatures': 'aboutFeatures',
      'feature1': 'feature1',
      'feature2': 'feature2',
      'feature3': 'feature3',
      'feature4': 'feature4',
      'feature5': 'feature5',
      'followUs': 'followUs',
      'developedBy': 'developedBy',
      'visitWebsite': 'visitWebsite',
      
      // Panel Estadísticas
      'statsTitle': 'statsTitle',
      'sitesAnalyzed': 'sitesAnalyzed',
      'threatsBlocked': 'threatsBlocked',
      'lastThreat': 'lastThreat',
      'resetStats': 'resetStats',
      
      // Panel Configuración
      'settingsTitle': 'settingsTitle',
      'language': 'language',
      'languageSection': 'language',
      'languageAutoDetectInfo': 'languageAutoDetectInfo',
      'alertsSettings': 'alertsSettings',
      'alertsSettingsSection': 'alertsSettings',
      'alertsSettingsDesc': 'alertsSettingsDesc',
      'showBadge': 'showBadge',
      'showBadgeDesc': 'showBadgeDesc',
      'showVisualAlerts': 'showVisualAlerts',
      'showVisualAlertsDesc': 'showVisualAlertsDesc',
      'alertLevel': 'alertLevel',
      'alertLevelAll': 'alertLevelAll',
      'alertLevelHighMedium': 'alertLevelHighMedium',
      'alertLevelHighOnly': 'alertLevelHighOnly',
      'trustedSites': 'trustedSites',
      'trustedSitesSection': 'trustedSites',
      'trustedSitesDesc': 'trustedSitesDesc',
      'noTrustedSites': 'noTrustedSites',
      'removeFromWhitelist': 'removeFromWhitelist',
      'clearAllTrusted': 'clearAllTrusted',
      'saveSettings': 'saveSettings',

      // Panel Ayuda
      'helpBadgesTitle': 'helpBadgesTitle',
      'helpGreenBadge': 'helpGreenBadge',
      'helpGreenBadgeDesc': 'helpGreenBadgeDesc',
      'helpYellowBadge': 'helpYellowBadge',
      'helpYellowBadgeDesc': 'helpYellowBadgeDesc',
      'helpRedBadge': 'helpRedBadge',
      'helpRedBadgeDesc': 'helpRedBadgeDesc',
      'helpWhitelistTitle': 'helpWhitelistTitle',
      'helpWhitelistDesc': 'helpWhitelistDesc',
      'helpWhitelistStep1': 'helpWhitelistStep1',
      'helpWhitelistStep2': 'helpWhitelistStep2',
      'helpWhitelistStep3': 'helpWhitelistStep3',
      'helpWhitelistWarning': 'helpWhitelistWarning',
      'helpTipsTitle': 'helpTipsTitle',
      'helpTip1': 'helpTip1',
      'helpTip2': 'helpTip2',
      'helpTip3': 'helpTip3',
      'helpTip4': 'helpTip4',
      'helpBlogPromo': 'helpBlogPromo',
      'helpBlogButton': 'helpBlogButton',
      'helpPrivacyTitle': 'helpPrivacyTitle',
      'helpPrivacyDesc': 'helpPrivacyDesc',
      'helpPrivacyButton': 'helpPrivacyButton'
    };
    
    // Aplicar traducciones
    for (const [elementId, messageKey] of Object.entries(elements)) {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = chrome.i18n.getMessage(messageKey);
      }
    }
  }
  
  /**
   * Inicializa los event listeners de las pestañas
   */
  function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.getAttribute('aria-controls');
        
        // Desactivar todas las pestañas y paneles
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(p => {
          p.classList.remove('active');
          p.hidden = true;
        });
        
        // Activar pestaña y panel seleccionado
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        
        const panel = document.getElementById(targetPanel);
        if (panel) {
          panel.classList.add('active');
          panel.hidden = false;
        }
        
        // Actualizar estado
        currentTab = tab.id.replace('tab-', '');
        
        // Cargar datos según la pestaña
        if (currentTab === 'stats') {
          loadStatistics();
        } else if (currentTab === 'settings') {
          loadSettingsFull();
        }
      });
      
      // Soporte de teclado
      tab.addEventListener('keydown', (e) => {
        let targetTab = null;
        
        if (e.key === 'ArrowRight') {
          targetTab = tab.nextElementSibling;
        } else if (e.key === 'ArrowLeft') {
          targetTab = tab.previousElementSibling;
        } else if (e.key === 'Home') {
          targetTab = tabs[0];
        } else if (e.key === 'End') {
          targetTab = tabs[tabs.length - 1];
        }
        
        if (targetTab) {
          targetTab.click();
          targetTab.focus();
          e.preventDefault();
        }
      });
    });
  }
  
  /**
   * Carga y muestra las estadísticas
   */
  async function loadStatistics() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getStats' });
      
      if (response && response.success) {
        stats = response.stats;
        updateStatisticsUI();
      }
    } catch (error) {
      console.error('[Brújula Security] Error cargando estadísticas:', error);
    }
  }
  
  /**
   * Actualiza la UI de estadísticas
   */
  function updateStatisticsUI() {
    if (!stats) return;
    
    // Actualizar valores
    const sitesValue = document.getElementById('sites-analyzed-value');
    const threatsValue = document.getElementById('threats-blocked-value');
    const lastThreatContent = document.getElementById('last-threat-content');
    
    if (sitesValue) {
      sitesValue.textContent = stats.sitesAnalyzed || 0;
      animateNumber(sitesValue, stats.sitesAnalyzed);
    }
    
    if (threatsValue) {
      threatsValue.textContent = stats.threatsBlocked || 0;
      animateNumber(threatsValue, stats.threatsBlocked);
    }
    
    // Última amenaza
    if (lastThreatContent) {
      if (stats.lastThreat) {
        const date = new Date(stats.lastThreat.timestamp);
        const formattedDate = date.toLocaleString();
        
        lastThreatContent.innerHTML = `
          <div class="threat-item">
            <div class="threat-icon">🚨</div>
            <div class="threat-details">
              <div class="threat-hostname">${stats.lastThreat.hostname}</div>
              <div class="threat-type">${getThreatTypeName(stats.lastThreat.type)}</div>
              <div class="threat-time">${formattedDate}</div>
            </div>
          </div>
        `;
      } else {
        lastThreatContent.innerHTML = `
          <div class="no-threats">
            <div class="no-threats-icon">✅</div>
            <p>${chrome.i18n.getMessage('noThreatsYet')}</p>
          </div>
        `;
      }
    }
  }
  
  /**
   * Anima un número desde 0 hasta el valor final
   * @param {HTMLElement} element - Elemento a animar
   * @param {number} targetValue - Valor final
   */
  function animateNumber(element, targetValue) {
    const duration = 1000; // 1 segundo
    const startTime = Date.now();
    const startValue = 0;
    
    function update() {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }
  
  /**
   * Obtiene el nombre legible del tipo de amenaza
   * @param {string} type - Tipo de amenaza
   * @returns {string} - Nombre legible
   */
  function getThreatTypeName(type) {
    const names = {
      'typosquatting': 'Typosquatting',
      'unknown_crypto': 'Sitio cripto desconocido',
      'unknown_crypto_wallet': 'Sitio cripto + wallet',
      'scam_indicators': 'Indicadores de scam',
      'wallet_connection': 'Conexión wallet'
    };
    
    return names[type] || type;
  }
  
  /**
   * Resetea las estadísticas
   */
  async function resetStatistics() {
    if (!confirm('¿Estás seguro de que quieres resetear las estadísticas?')) {
      return;
    }
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'resetStats' });
      
      if (response && response.success) {
        stats = {
          threatsBlocked: 0,
          sitesAnalyzed: 0,
          lastThreat: null
        };
        updateStatisticsUI();
      }
    } catch (error) {
      console.error('[Brújula Security] Error reseteando estadísticas:', error);
    }
  }

  /**
   * Carga la configuración COMPLETA (para pestaña Settings)
   */
  async function loadSettingsFull() {
    try {
      const DEFAULT_SETTINGS = {
        showBadge: true,
        showVisualAlerts: true,
        alertLevel: 'all'
      };

      // ARREGLADO: Cargar settings y whitelist por separado
      const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
      const { whitelist } = await chrome.storage.local.get(['whitelist']);

      console.log('[Brújula Security] Settings cargados:', settings);
      console.log('[Brújula Security] Whitelist cargada:', whitelist);

      // Cargar checkboxes
      const showBadgeCheckbox = document.getElementById('show-badge-checkbox');
      if (showBadgeCheckbox) {
        showBadgeCheckbox.checked = settings.showBadge !== false;
      }

      const showAlertsCheckbox = document.getElementById('show-visual-alerts-checkbox');
      if (showAlertsCheckbox) {
        showAlertsCheckbox.checked = settings.showVisualAlerts !== false;
      }

      // Cargar nivel de alerta
      const alertLevelSelect = document.getElementById('alert-level-select');
      if (alertLevelSelect) {
        alertLevelSelect.value = settings.alertLevel || 'all';
      }

      // ARREGLADO: Renderizar whitelist desde la clave correcta
      renderWhitelist(whitelist || []);

    } catch (error) {
      console.error('[Brújula Security] Error cargando configuración completa:', error);
    }
  }

  /**
   * Renderiza la lista de sitios de confianza
   * @param {Array<string>} whitelist - Array de dominios
   */
  function renderWhitelist(whitelist) {
    const container = document.getElementById('whitelist-container');
    const clearButton = document.getElementById('clear-whitelist-btn');

    if (!container) return;

    if (whitelist.length === 0) {
      container.innerHTML = `<p class="no-trusted-sites" id="noTrustedSites">${chrome.i18n.getMessage('noTrustedSites')}</p>`;
      if (clearButton) clearButton.style.display = 'none';
      return;
    }

    // Mostrar botón de limpiar
    if (clearButton) clearButton.style.display = 'inline-flex';

    // Crear lista
    const html = whitelist.map(domain => `
      <div class="whitelist-item" data-domain="${domain}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M9 12l2 2 4-4"></path>
        </svg>
        <span class="whitelist-domain">${domain}</span>
        <button class="whitelist-remove-btn" data-domain="${domain}" title="${chrome.i18n.getMessage('removeFromWhitelist')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `).join('');

    container.innerHTML = html;

    // Event listeners para botones de eliminar
    container.querySelectorAll('.whitelist-remove-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const domain = e.currentTarget.getAttribute('data-domain');
        await removeFromWhitelist(domain);
      });
    });
  }

  /**
   * Elimina un dominio de la whitelist
   * @param {string} domain - Dominio a eliminar
   */
  async function removeFromWhitelist(domain) {
    try {
      const settings = await chrome.storage.local.get(['whitelist']);
      const whitelist = settings.whitelist || [];
      const newWhitelist = whitelist.filter(d => d !== domain);

      await chrome.storage.local.set({ whitelist: newWhitelist });
      renderWhitelist(newWhitelist);
      showNotification(chrome.i18n.getMessage('settingsSaved'), 'success');
    } catch (error) {
      console.error('[Brújula Security] Error eliminando de whitelist:', error);
      showNotification('Error', 'error');
    }
  }

  /**
   * Limpia toda la whitelist
   */
  async function clearWhitelist() {
    const confirmMessage = chrome.i18n.getMessage('confirmClearWhitelist') || '¿Eliminar todos los sitios de confianza?';
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await chrome.storage.local.set({ whitelist: [] });
      renderWhitelist([]);
      showNotification(chrome.i18n.getMessage('settingsSaved'), 'success');
    } catch (error) {
      console.error('[Brújula Security] Error limpiando whitelist:', error);
      showNotification('Error', 'error');
    }
  }

  /**
   * Muestra una notificación temporal
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - 'success' o 'error'
   */
  function showNotification(message, type = 'success') {
    const notification = document.getElementById('settings-notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
  
  /**
   * Guarda la configuración
   */
  async function saveSettings() {
    const showBadgeCheckbox = document.getElementById('show-badge-checkbox');
    const showAlertsCheckbox = document.getElementById('show-visual-alerts-checkbox');
    const alertLevelSelect = document.getElementById('alert-level-select');
    
    try {
      // ARREGLADO: Obtener whitelist actual para no borrarla
      const { whitelist } = await chrome.storage.local.get(['whitelist']);
      
      const newSettings = {
        showBadge: showBadgeCheckbox ? showBadgeCheckbox.checked : true,
        showVisualAlerts: showAlertsCheckbox ? showAlertsCheckbox.checked : true,
        alertLevel: alertLevelSelect ? alertLevelSelect.value : 'all',
        whitelist: whitelist || [] // CRÍTICO: Preservar whitelist
      };
      
      await chrome.storage.local.set(newSettings);
      
      // Mostrar notificación de éxito
      showNotification(chrome.i18n.getMessage('settingsSaved'), 'success');
      
    } catch (error) {
      console.error('[Brújula Security] Error guardando configuración:', error);
      showNotification('Error', 'error');
    }
  }
  
  /**
   * Inicializa todos los event listeners
   */
  function initEventListeners() {
    // Botón resetear estadísticas
    const resetButton = document.getElementById('reset-stats');
    if (resetButton) {
      resetButton.addEventListener('click', resetStatistics);
    }
    
    // Botón guardar configuración
    const saveButton = document.getElementById('save-settings');
    if (saveButton) {
      saveButton.addEventListener('click', saveSettings);
    }

    // Botón limpiar whitelist
    const clearWhitelistBtn = document.getElementById('clear-whitelist-btn');
    if (clearWhitelistBtn) {
      clearWhitelistBtn.addEventListener('click', clearWhitelist);
    }
    
    // Links externos
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Rastrear clicks en links (sin enviar datos externos)
        console.log('[Brújula Security] Link externo:', link.href);
      });
    });
  }
  
  /**
   * Inicializa el popup
   */
  async function init() {
    initI18n();
    initTabs();
    initEventListeners();
    
    // Si estamos en la pestaña de estadísticas, cargarlas
    if (currentTab === 'stats') {
      await loadStatistics();
    }
  }
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
