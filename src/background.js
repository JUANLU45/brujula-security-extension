/**
 * Brújula Security - Background Service Worker
 * Gestiona el estado de la extensión y coordina las alertas
 */

// Estado global de la extensión
let extensionStats = {
  threatsBlocked: 0,
  sitesAnalyzed: 0,
  lastThreat: null,
  installDate: null
};

/**
 * Inicializa la extensión
 */
async function initializeExtension() {
  try {
    // Cargar estadísticas guardadas
    const stored = await chrome.storage.local.get(['stats', 'installDate']);
    
    if (stored.stats) {
      extensionStats = { ...extensionStats, ...stored.stats };
    }
    
    if (!stored.installDate) {
      extensionStats.installDate = new Date().toISOString();
      await chrome.storage.local.set({ installDate: extensionStats.installDate });
    } else {
      extensionStats.installDate = stored.installDate;
    }
    
    console.log('[Brújula Security] Extensión inicializada');
  } catch (error) {
    console.error('[Brújula Security] Error inicializando:', error);
  }
}

/**
 * Actualiza el icono de la extensión según el nivel de amenaza
 * Respeta la configuración del usuario
 * @param {number} tabId - ID de la pestaña
 * @param {string} threat - Nivel de amenaza (NONE, MEDIUM, HIGH)
 */
async function updateIcon(tabId, threat) {
  // Cargar configuración del usuario
  let settings = { showBadge: true };
  try {
    const stored = await chrome.storage.local.get(['settings']);
    if (stored.settings) {
      settings = { ...settings, ...stored.settings };
    }
  } catch (error) {
    console.warn('[Brújula Security] No se pudo cargar configuración de badge:', error);
  }
  
  const iconPaths = {
    'NONE': {
      '16': '/icons/logo-16.png',
      '48': '/icons/logo-48.png'
    },
    'MEDIUM': {
      '16': '/icons/logo-16.png',
      '48': '/icons/logo-48.png'
    },
    'HIGH': {
      '16': '/icons/logo-16.png',
      '48': '/icons/logo-48.png'
    }
  };
  
  try {
    await chrome.action.setIcon({
      tabId: tabId,
      path: iconPaths[threat] || iconPaths['NONE']
    });
    
    // Actualizar badge solo si el usuario lo tiene activado
    if (settings.showBadge) {
      if (threat === 'HIGH') {
        await chrome.action.setBadgeText({ tabId: tabId, text: '!' });
        await chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: '#F44336' });
      } else if (threat === 'MEDIUM') {
        await chrome.action.setBadgeText({ tabId: tabId, text: '⚠' });
        await chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: '#FFC107' });
      } else {
        await chrome.action.setBadgeText({ tabId: tabId, text: '' });
      }
    } else {
      // Si está desactivado, limpiar badge
      await chrome.action.setBadgeText({ tabId: tabId, text: '' });
    }
  } catch (error) {
    console.error('[Brújula Security] Error actualizando icono:', error);
  }
}

/**
 * Registra una amenaza detectada
 * @param {Object} threatData - Datos de la amenaza
 */
async function recordThreat(threatData) {
  extensionStats.sitesAnalyzed++;
  
  if (threatData.threat === 'HIGH') {
    extensionStats.threatsBlocked++;
    extensionStats.lastThreat = {
      hostname: threatData.hostname,
      type: threatData.type,
      timestamp: new Date().toISOString()
    };
  }
  
  // Guardar estadísticas
  await chrome.storage.local.set({ stats: extensionStats });
  
  console.log('[Brújula Security] Amenaza registrada:', threatData);
}

/**
 * Registra cuando un usuario ignora una advertencia
 * @param {Object} data - Datos del evento
 */
async function recordIgnoredWarning(data) {
  const ignoredWarnings = await chrome.storage.local.get('ignoredWarnings') || { ignoredWarnings: [] };
  
  ignoredWarnings.ignoredWarnings.push({
    hostname: data.hostname,
    threatType: data.threatType,
    timestamp: new Date().toISOString()
  });
  
  await chrome.storage.local.set(ignoredWarnings);
  
  console.log('[Brújula Security] Advertencia ignorada:', data);
}

/**
 * Obtiene las estadísticas actuales
 * @returns {Object} - Estadísticas de la extensión
 */
async function getStats() {
  return extensionStats;
}

/**
 * Resetea las estadísticas
 */
async function resetStats() {
  extensionStats = {
    threatsBlocked: 0,
    sitesAnalyzed: 0,
    lastThreat: null,
    installDate: extensionStats.installDate
  };
  
  await chrome.storage.local.set({ stats: extensionStats });
  console.log('[Brújula Security] Estadísticas reseteadas');
}

// Event Listeners

/**
 * Listener para mensajes de content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.action === 'recordThreat') {
        await recordThreat(message);
        
        if (sender.tab) {
          await updateIcon(sender.tab.id, message.threat);
        }
        
        sendResponse({ success: true });
      }
      
      else if (message.action === 'userIgnoredWarning') {
        await recordIgnoredWarning(message);
        sendResponse({ success: true });
      }
      
      else if (message.action === 'getStats') {
        const stats = await getStats();
        sendResponse({ success: true, stats });
      }
      
      else if (message.action === 'resetStats') {
        await resetStats();
        sendResponse({ success: true });
      }
    } catch (error) {
      console.error('[Brújula Security] Error manejando mensaje:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Mantener canal abierto para respuesta async
});

/**
 * Listener para cuando se actualiza una pestaña
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Resetear icono cuando cambia la página
    updateIcon(tabId, 'NONE');
  }
});

/**
 * Inyecta los content scripts en todas las pestañas ya abiertas
 */
async function injectContentScriptsInExistingTabs() {
  try {
    const tabs = await chrome.tabs.query({});
    console.log(`[Brújula Security] Inyectando scripts en ${tabs.length} pestañas abiertas...`);
    
    for (const tab of tabs) {
      // Solo inyectar en páginas web normales (http/https)
      if (tab.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [
              'src/utils/levenshtein.js',
              'src/utils/detector.js',
              'src/ui/alerts.js',
              'src/content.js'
            ]
          });
          
          // Inyectar también el CSS
          await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['src/ui/alerts.css']
          });
          
          console.log(`[Brújula Security] ✅ Scripts inyectados en: ${tab.url}`);
        } catch (error) {
          // Ignorar errores en pestañas protegidas (chrome://, etc.)
          console.log(`[Brújula Security] ⏭️ No se puede inyectar en: ${tab.url}`);
        }
      }
    }
    
    console.log('[Brújula Security] ✅ Inyección completada en todas las pestañas');
  } catch (error) {
    console.error('[Brújula Security] Error inyectando scripts:', error);
  }
}

/**
 * Listener para instalación/actualización
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[Brújula Security] Extensión instalada');
    
    // Abrir página de bienvenida
    await chrome.tabs.create({
      url: 'https://brujulacrypto.com/security-extension/bienvenida'
    });
  } else if (details.reason === 'update') {
    console.log('[Brújula Security] Extensión actualizada a', chrome.runtime.getManifest().version);
  }
  
  await initializeExtension();
  
  // CRÍTICO: Inyectar scripts en pestañas ya abiertas
  await injectContentScriptsInExistingTabs();
});

/**
 * Listener para cuando se inicia el navegador
 */
chrome.runtime.onStartup.addListener(() => {
  console.log('[Brújula Security] Navegador iniciado');
  initializeExtension();
});

// Inicializar al cargar el service worker
initializeExtension();
