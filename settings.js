/**
 * Brújula Security - Settings Page
 * Página de configuración de la extensión
 */

(function() {
  'use strict';
  
  // Configuración por defecto
  const DEFAULT_SETTINGS = {
    language: 'es',
    showBadge: true,
    showVisualAlerts: true,
    alertLevel: 'all', // 'all', 'high-medium', 'high-only'
    whitelist: []
  };
  
  let currentSettings = { ...DEFAULT_SETTINGS };
  
  /**
   * Inicializa la página de configuración
   */
  async function initSettings() {
    try {
      // Cargar configuración guardada
      const stored = await chrome.storage.local.get(['settings']);
      if (stored.settings) {
        currentSettings = { ...DEFAULT_SETTINGS, ...stored.settings };
      }
      
      // Aplicar traducciones
      applyTranslations();
      
      // Cargar valores en UI
      loadSettingsToUI();
      
      // Renderizar whitelist
      renderWhitelist();
      
      // Configurar event listeners
      setupEventListeners();
      
    } catch (error) {
      console.error('[Brújula Security] Error inicializando settings:', error);
    }
  }
  
  /**
   * Aplica las traducciones de i18n
   */
  function applyTranslations() {
    // Header
    document.getElementById('settingsTitle').textContent = chrome.i18n.getMessage('settingsTitle') || 'Configuración';
    document.getElementById('headerSubtitle').textContent = 
      currentSettings.language === 'es' 
        ? 'Personaliza la protección de Brújula Security'
        : 'Customize Brújula Security protection';
    
    // Idioma
    document.getElementById('languageLabel').textContent = chrome.i18n.getMessage('language') || 'Idioma';
    document.getElementById('langEs').textContent = chrome.i18n.getMessage('languageSpanish') || 'Español';
    document.getElementById('langEn').textContent = chrome.i18n.getMessage('languageEnglish') || 'English';
    
    // Alertas
    document.getElementById('alertsTitle').textContent = chrome.i18n.getMessage('alertsSettings') || 'Alertas y Notificaciones';
    document.getElementById('alertsDesc').textContent = 
      currentSettings.language === 'es'
        ? 'Controla cómo y cuándo recibes alertas de seguridad'
        : 'Control how and when you receive security alerts';
    
    document.getElementById('showBadgeTitle').textContent = chrome.i18n.getMessage('showBadge') || 'Mostrar badge en el icono';
    document.getElementById('showBadgeDesc').textContent = chrome.i18n.getMessage('showBadgeDesc') || 'Muestra un indicador (!, ?) en el icono de la extensión según el nivel de amenaza';
    
    document.getElementById('showVisualAlertsTitle').textContent = chrome.i18n.getMessage('showVisualAlerts') || 'Mostrar alertas visuales en la página';
    document.getElementById('showVisualAlertsDesc').textContent = chrome.i18n.getMessage('showVisualAlertsDesc') || 'Muestra badges verdes (sitio seguro) y modales rojos/amarillos (amenaza detectada)';
    
    document.getElementById('alertLevelLabel').textContent = chrome.i18n.getMessage('alertLevel') || 'Nivel de alerta';
    document.getElementById('alertAll').textContent = chrome.i18n.getMessage('alertLevelAll') || 'Todas (ALTA, MEDIA, BAJA)';
    document.getElementById('alertHighMedium').textContent = chrome.i18n.getMessage('alertLevelHighMedium') || 'ALTA y MEDIA solamente';
    document.getElementById('alertHigh').textContent = chrome.i18n.getMessage('alertLevelHighOnly') || 'Solo ALTA (máxima seguridad)';
    
    // Whitelist
    document.getElementById('trustedTitle').textContent = chrome.i18n.getMessage('trustedSites') || 'Sitios de Confianza';
    document.getElementById('trustedDesc').textContent = chrome.i18n.getMessage('trustedSitesDesc') || 'Estos sitios nunca mostrarán alertas porque los has marcado como confiables:';
    document.getElementById('noTrusted').textContent = chrome.i18n.getMessage('noTrustedSites') || 'No has marcado ningún sitio como confiable aún.';
    document.getElementById('clearWhitelistText').textContent = '🗑️ ' + (chrome.i18n.getMessage('clearAllTrusted') || 'Limpiar toda la lista');
    
    // Botones
    document.getElementById('saveBtnText').textContent = '💾 ' + (chrome.i18n.getMessage('saveSettings') || 'Guardar configuración');
    document.getElementById('notificationText').textContent = chrome.i18n.getMessage('settingsSaved') || '✅ Configuración guardada correctamente';
  }
  
  /**
   * Carga la configuración actual en la UI
   */
  function loadSettingsToUI() {
    document.getElementById('languageSelect').value = currentSettings.language;
    document.getElementById('showBadgeCheck').checked = currentSettings.showBadge;
    document.getElementById('showVisualAlertsCheck').checked = currentSettings.showVisualAlerts;
    document.getElementById('alertLevelSelect').value = currentSettings.alertLevel;
  }
  
  /**
   * Renderiza la lista de sitios confiables
   */
  function renderWhitelist() {
    const container = document.getElementById('whitelistContainer');
    const clearBtn = document.getElementById('clearWhitelistBtn');
    
    if (!currentSettings.whitelist || currentSettings.whitelist.length === 0) {
      container.innerHTML = `<div class="no-trusted" id="noTrusted">${chrome.i18n.getMessage('noTrustedSites') || 'No has marcado ningún sitio como confiable aún.'}</div>`;
      clearBtn.style.display = 'none';
      return;
    }
    
    let html = '';
    currentSettings.whitelist.forEach(domain => {
      html += `
        <div class="whitelist-item">
          <span class="whitelist-domain">${domain}</span>
          <button onclick="window.removeFromWhitelist('${domain}')">
            ${chrome.i18n.getMessage('removeFromWhitelist') || 'Eliminar'}
          </button>
        </div>
      `;
    });
    
    container.innerHTML = html;
    clearBtn.style.display = 'block';
  }
  
  /**
   * Elimina un dominio de la whitelist
   */
  window.removeFromWhitelist = async function(domain) {
    try {
      currentSettings.whitelist = currentSettings.whitelist.filter(d => d !== domain);
      await chrome.storage.local.set({ settings: currentSettings });
      renderWhitelist();
      showNotification();
    } catch (error) {
      console.error('[Brújula Security] Error eliminando de whitelist:', error);
    }
  };
  
  /**
   * Configura event listeners
   */
  function setupEventListeners() {
    // Cambio de idioma
    document.getElementById('languageSelect').addEventListener('change', (e) => {
      currentSettings.language = e.target.value;
      applyTranslations();
    });
    
    // Botón guardar
    document.getElementById('saveBtn').addEventListener('click', saveSettings);
    
    // Botón limpiar whitelist
    document.getElementById('clearWhitelistBtn').addEventListener('click', async () => {
      if (confirm(currentSettings.language === 'es' 
        ? '¿Estás seguro de que quieres eliminar todos los sitios de confianza?'
        : 'Are you sure you want to remove all trusted sites?')) {
        currentSettings.whitelist = [];
        await chrome.storage.local.set({ settings: currentSettings });
        renderWhitelist();
        showNotification();
      }
    });
  }
  
  /**
   * Guarda la configuración
   */
  async function saveSettings() {
    try {
      // Obtener valores de UI
      currentSettings.language = document.getElementById('languageSelect').value;
      currentSettings.showBadge = document.getElementById('showBadgeCheck').checked;
      currentSettings.showVisualAlerts = document.getElementById('showVisualAlertsCheck').checked;
      currentSettings.alertLevel = document.getElementById('alertLevelSelect').value;
      
      // Guardar en storage
      await chrome.storage.local.set({ settings: currentSettings });
      
      // Notificar al background script
      chrome.runtime.sendMessage({ 
        action: 'settingsUpdated', 
        settings: currentSettings 
      });
      
      // Mostrar notificación
      showNotification();
      
    } catch (error) {
      console.error('[Brújula Security] Error guardando configuración:', error);
    }
  }
  
  /**
   * Muestra notificación de guardado
   */
  function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
  } else {
    initSettings();
  }
  
})();
