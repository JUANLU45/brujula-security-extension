/**
 * Brújula Security - Content Script
 * Script que se ejecuta en cada página para analizar amenazas
 */

console.log('🚀 [Brújula Security] content.js CARGADO - Inicio de ejecución');

(function() {
  'use strict';
  
  console.log('🔧 [Brújula Security] Dentro del IIFE');
  
  // Evitar ejecución múltiple
  if (window.brujulaSecurityLoaded) {
    console.log('⚠️ [Brújula Security] Ya estaba cargado, saliendo...');
    return;
  }
  window.brujulaSecurityLoaded = true;
  console.log('✅ [Brújula Security] Flag brujulaSecurityLoaded establecido');
  
  /**
   * Inicializa el análisis de la página
   */
  async function initializeAnalysis() {
    try {
      const hostname = window.location.hostname;
      console.log('🔍 [Brújula Security] Analizando hostname:', hostname);
      
      // Ignorar extensiones y páginas internas del navegador
      if (hostname.startsWith('chrome-extension://') ||
          hostname.startsWith('chrome://') ||
          hostname.startsWith('edge://') ||
          hostname.startsWith('about:')) {
        console.log('⏭️ [Brújula Security] Página interna ignorada');
        return;
      }
      
      // Ejecutar análisis
      console.log('⚙️ [Brújula Security] Ejecutando analyzeSite()...');
      const result = await analyzeSite(hostname);
      console.log('📋 [Brújula Security] Resultado del análisis:', result);
      
      // Mostrar alerta apropiada
      console.log('🎨 [Brújula Security] Llamando a showAppropriateAlert()...');
      showAppropriateAlert(result);
      
    } catch (error) {
      // Si es error de contexto invalidado, mostrar mensaje claro
      if (error.message && error.message.includes('Extension context invalidated')) {
        console.warn('⚠️ [Brújula Security] La extensión fue recargada. Por favor, recarga esta página (F5) para reactivar la protección.');
        return;
      }
      
      console.error('[Brújula Security] Error en análisis:', error);
    }
  }
  
  /**
   * Observa cambios en el DOM para detectar inyección dinámica de botones
   */
  function observeDOM() {
    try {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Re-verificar si se agregaron botones de conexión
            const walletConnection = detectWalletConnection();
            
            if (walletConnection) {
              // Solo re-alertar si no hay alerta activa
              if (!document.getElementById('brujula-security-danger') &&
                  !document.getElementById('brujula-security-alert')) {
                
                analyzeSite(window.location.hostname).then(result => {
                  if (result.threat === 'HIGH' || result.threat === 'MEDIUM') {
                    showAppropriateAlert(result);
                  }
                }).catch(err => {
                  if (!err.message.includes('Extension context invalidated')) {
                    console.error('[Brújula Security] Error en re-análisis:', err);
                  }
                });
              }
              
              // Detener observación una vez detectado
              observer.disconnect();
              break;
            }
          }
        }
      });
      
      // Verificar que document.body existe antes de observar
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Detener observación después de 30 segundos
        setTimeout(() => observer.disconnect(), 30000);
      }
    } catch (error) {
      console.error('[Brújula Security] Error configurando observer:', error);
    }
  }
  
  /**
   * Escucha mensajes del background script
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'reanalyze') {
      initializeAnalysis();
      sendResponse({ success: true });
    }
    
    if (message.action === 'clearAlerts') {
      clearAllAlerts();
      sendResponse({ success: true });
    }
    
    return true;
  });
  
  // Ejecutar análisis cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAnalysis();
      observeDOM();
    });
  } else {
    // DOM ya está listo
    initializeAnalysis();
    observeDOM();
  }
  
  // Re-analizar en cambios de URL (SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      clearAllAlerts();
      setTimeout(initializeAnalysis, 500);
    }
  }).observe(document, { subtree: true, childList: true });
  
})();
