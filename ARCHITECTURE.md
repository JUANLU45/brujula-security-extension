# 🏗️ ARCHITECTURE - Brújula Security Extension

**Arquitectura Técnica v1.0**

---

## 📑 Índice

1. [Diagrama de Arquitectura](#1-diagrama-de-arquitectura)
2. [Componentes del Sistema](#2-componentes-del-sistema)
3. [Flujos de Detección](#3-flujos-de-detección)
4. [Algoritmos Core](#4-algoritmos-core)
5. [Estructura de Archivos](#5-estructura-de-archivos)
6. [Decisiones Técnicas](#6-decisiones-técnicas)

---

## 1. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   CHROME BROWSER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              USER VISITS WEBSITE                     │   │
│  │          (e.g., binanse.com - typo)                 │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│               ▼                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          CONTENT SCRIPT (content.js)                 │   │
│  │  - Runs in page context                             │   │
│  │  - Extracts: hostname, page content, buttons        │   │
│  │  - Triggers analysis                                 │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│               ▼                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      DETECTION ENGINE (src/utils/detector.js)       │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  1. TYPOSQUATTING DETECTOR                  │   │   │
│  │  │     - Levenshtein algorithm                 │   │   │
│  │  │     - Compares vs. verified sites list      │   │   │
│  │  │     - Threshold: 80% similarity = ALERT     │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  2. UNKNOWN CRYPTO SITE DETECTOR            │   │   │
│  │  │     - Checks crypto keywords in domain      │   │   │
│  │  │     - Verifies against verified sites DB    │   │   │
│  │  │     - Unknown + crypto words = WARNING      │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  3. WALLET CONNECTION DETECTOR              │   │   │
│  │  │     - Detects "Connect Wallet" buttons      │   │   │
│  │  │     - Detects window.ethereum presence      │   │   │
│  │  │     - Unknown site + wallet = DANGER        │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│               ▼                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         DATA SOURCES (Local - Offline)              │   │
│  │                                                      │   │
│  │  ├─ sitios-verificados.json (100+ verified sites)  │   │
│  │  ├─ palabras-cripto.json (50+ crypto keywords)     │   │
│  │  └─ messages.json (i18n ES/EN)                     │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│               ▼                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          ALERT SYSTEM (src/ui/alerts.js)            │   │
│  │                                                      │   │
│  │  🟢 GREEN BADGE   → Verified site (discrete)       │   │
│  │  🟡 YELLOW ALERT  → Unknown crypto site (caution)  │   │
│  │  🔴 RED ALERT     → Phishing detected (danger!)    │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                              │
│               ▼                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          INJECTED UI IN PAGE                        │   │
│  │                                                      │   │
│  │  [🚨 POSIBLE PHISHING DETECTADO]                   │   │
│  │  Este sitio es muy similar a binance.com           │   │
│  │  [Ir a sitio oficial] [Cerrar]                     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            EXTENSION POPUP (popup.html)                     │
│                                                              │
│  [Acerca de] [Estadísticas] [Configuración]                │
│                                                              │
│  - Shows protection stats                                   │
│  - Educational content (elevator pitch)                     │
│  - Links to Brújula Cripto                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes del Sistema

### 2.1 Manifest (manifest.json)

**Propósito**: Configuración de la extensión Chrome.

**Permisos requeridos**:
```json
{
  "permissions": [
    "activeTab",    // Para leer URL actual
    "storage"       // Para guardar estadísticas locales
  ],
  "host_permissions": [
    "<all_urls>"    // Para inyectar content script en todas las páginas
  ]
}
```

**Manifest V3** (última versión estándar).

### 2.2 Content Script (content.js)

**Propósito**: Script que se ejecuta en el contexto de cada página web.

**Responsabilidades**:
1. Extraer hostname de la página actual
2. Escanear contenido HTML en busca de botones "Connect Wallet"
3. Detectar presencia de `window.ethereum` (MetaMask/WalletConnect)
4. Enviar datos al Detection Engine
5. Recibir resultado y activar alertas

**Ejecución**: Automática en `document_idle` (cuando la página ha cargado).

### 2.3 Background Service Worker (background.js)

**Propósito**: Servicio en segundo plano que coordina la extensión.

**Responsabilidades**:
1. Gestionar estado de la extensión
2. Actualizar icono según nivel de alerta (verde/amarillo/rojo)
3. Manejar clicks en el icono de extensión
4. Almacenar estadísticas de protección

**Lifecycle**: Persiste mientras Chrome esté abierto.

### 2.4 Detector Engine (src/utils/detector.js)

**Propósito**: Motor central de detección de phishing.

**Módulos**:

#### **detectTyposquatting(domain)**
```javascript
function detectTyposquatting(domain) {
  const verifiedSites = loadVerifiedSites();
  
  for (const site of verifiedSites) {
    const similarity = levenshteinDistance(domain, site);
    const percentage = (1 - (similarity / Math.max(domain.length, site.length))) * 100;
    
    if (percentage > 80 && domain !== site) {
      return {
        threat: 'HIGH',
        type: 'typosquatting',
        similar: site,
        message: `Este sitio es muy parecido a ${site}`
      };
    }
  }
  
  return null;
}
```

#### **detectUnknownCryptoSite(domain, content)**
```javascript
function detectUnknownCryptoSite(domain, content) {
  const cryptoKeywords = loadCryptoKeywords();
  const verifiedSites = loadVerifiedSites();
  
  const hasCryptoKeyword = cryptoKeywords.some(keyword => 
    domain.toLowerCase().includes(keyword)
  );
  
  const isVerified = verifiedSites.includes(domain);
  
  if (hasCryptoKeyword && !isVerified) {
    return {
      threat: 'MEDIUM',
      type: 'unknown_crypto',
      message: 'Sitio cripto no verificado. Precaución.'
    };
  }
  
  return null;
}
```

#### **detectWalletConnection(document)**
```javascript
function detectWalletConnection(document) {
  const connectButtons = document.querySelectorAll('button, a');
  const hasConnectButton = Array.from(connectButtons).some(btn => 
    /connect.*wallet|conectar/i.test(btn.textContent)
  );
  
  const hasEthereumProvider = typeof window.ethereum !== 'undefined';
  
  if (hasConnectButton || hasEthereumProvider) {
    return {
      threat: 'HIGH',
      type: 'wallet_connection',
      message: '⚠️ Sitio pide conectar wallet'
    };
  }
  
  return null;
}
```

### 2.5 Levenshtein Algorithm (src/utils/levenshtein.js)

**Propósito**: Calcular similitud entre strings (dominios).

**Implementación**:
```javascript
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  // Inicializar primera fila y columna
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Llenar matriz con distancias
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Sustitución
          matrix[i][j - 1] + 1,     // Inserción
          matrix[i - 1][j] + 1      // Eliminación
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
```

**Ejemplo**:
```
levenshteinDistance('binanse', 'binance')
→ 1 (solo 1 carácter diferente: 's' vs 'c')
→ Similitud: 92%
```

### 2.6 Alert System (src/ui/alerts.js)

**Propósito**: Inyectar alertas visuales en la página.

**Tipos de alertas**:

#### **🟢 Green Badge (Verified)**
```javascript
function showGreenBadge() {
  const badge = document.createElement('div');
  badge.id = 'brujula-security-badge';
  badge.className = 'brujula-badge-green';
  badge.innerHTML = `
    <span>✅</span>
    <span>${chrome.i18n.getMessage('verifiedSite')}</span>
  `;
  badge.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4CAF50;
    color: white;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    z-index: 999999;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(badge);
}
```

#### **🔴 Red Alert (Phishing)**
```javascript
function showRedAlert(message, officialSite) {
  const overlay = document.createElement('div');
  overlay.id = 'brujula-security-alert';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    z-index: 999999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  overlay.innerHTML = `
    <div style="background: white; padding: 40px; border-radius: 10px; max-width: 500px; text-align: center;">
      <div style="font-size: 60px;">🚨</div>
      <h2 style="color: #F44336; margin: 20px 0;">
        ${chrome.i18n.getMessage('phishingDetected')}
      </h2>
      <p style="font-size: 16px; margin: 20px 0;">
        ${message}
      </p>
      <div style="margin-top: 30px;">
        <button id="brujula-go-official" style="background: #4CAF50; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; cursor: pointer; margin-right: 10px;">
          ${chrome.i18n.getMessage('goToOfficialSite')}
        </button>
        <button id="brujula-close-tab" style="background: #F44336; color: white; border: none; padding: 15px 30px; border-radius: 5px; font-size: 16px; cursor: pointer;">
          ${chrome.i18n.getMessage('closeTab')}
        </button>
      </div>
      <div style="margin-top: 20px; padding: 20px; background: #FFF3CD; border-radius: 5px;">
        <p style="font-size: 14px; margin: 0;">
          ${chrome.i18n.getMessage('educationalMessage')}
        </p>
        <a href="https://brujulacrypto.com" target="_blank" style="color: #007bff; text-decoration: none;">
          ${chrome.i18n.getMessage('learnMore')}
        </a>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  document.getElementById('brujula-go-official').addEventListener('click', () => {
    window.location.href = `https://${officialSite}`;
  });
  
  document.getElementById('brujula-close-tab').addEventListener('click', () => {
    window.close();
  });
}
```

### 2.7 Popup (popup.html + popup.js)

**Propósito**: Interfaz cuando usuario clica el icono de extensión.

**Pestañas**:

1. **"Acerca de" / "About"**:
   - Elevator pitch completo
   - Links a redes sociales
   - Botón "Ver tutorial"

2. **"Estadísticas" / "Stats"**:
   - Sitios analizados hoy
   - Phishing bloqueados
   - Última amenaza detectada

3. **"Configuración" / "Settings"**:
   - Selección de idioma (ES/EN)
   - Activar/desactivar tipos de alertas
   - Whitelist personalizada (futuro v1.1)

---

## 3. Flujos de Detección

### Flujo 1: Usuario entra en sitio legítimo

```
1. Usuario escribe: binance.com
2. content.js extrae hostname: "binance.com"
3. detector.js verifica:
   → loadVerifiedSites() incluye "binance.com"
4. Resultado: { threat: 'NONE', type: 'verified' }
5. alerts.js inyecta green badge (discreto)
6. Usuario continúa navegando sin interrupciones
```

### Flujo 2: Typosquatting detectado

```
1. Usuario escribe (error de tipeo): binanse.com
2. content.js extrae hostname: "binanse.com"
3. detector.js ejecuta detectTyposquatting():
   → levenshteinDistance('binanse', 'binance') = 1
   → Similitud: 92% > 80% threshold
4. Resultado: { 
     threat: 'HIGH', 
     type: 'typosquatting', 
     similar: 'binance.com' 
   }
5. alerts.js inyecta RED ALERT con mensaje:
   "🚨 Este sitio es muy similar a binance.com
    ¿Querías entrar en el sitio oficial?"
6. background.js actualiza icono a ROJO
7. background.js registra estadística: +1 phishing bloqueado
8. Usuario clica "Ir a sitio oficial" → redirige a binance.com
```

### Flujo 3: Sitio cripto desconocido con conexión wallet

```
1. Usuario entra en: free-bitcoin-earn.com
2. content.js extrae:
   → hostname: "free-bitcoin-earn.com"
   → Detecta botón: <button>Connect Wallet</button>
3. detector.js ejecuta:
   → detectUnknownCryptoSite(): dominio contiene "bitcoin"
   → loadVerifiedSites(): NO incluye "free-bitcoin-earn.com"
   → detectWalletConnection(): botón "Connect Wallet" presente
4. Resultado: { 
     threat: 'HIGH', 
     type: 'unknown_crypto_wallet' 
   }
5. alerts.js inyecta RED ALERT:
   "⚠️ SITIO NO VERIFICADO
    Este sitio cripto no está en nuestra base de datos.
    NUNCA conectes tu wallet a sitios desconocidos."
6. Mensaje educativo:
   "¿Sabías que 1 de cada 3 usuarios pierde fondos por phishing?
    Aprende más en Brújula Cripto →"
7. Usuario cierra la pestaña (fondos salvados)
```

---

## 4. Algoritmos Core

### 4.1 Levenshtein Distance

**Complejidad**: O(m × n) donde m, n son longitudes de strings

**Optimizaciones implementadas**:
- Early exit si diferencia > 20%
- Cache de resultados para dominios repetidos

### 4.2 Detección de Patrones

**Regex para botones wallet**:
```javascript
const WALLET_PATTERNS = [
  /connect.*wallet/i,
  /conectar.*wallet/i,
  /link.*wallet/i,
  /vincular.*billetera/i
];
```

**Crypto keywords**:
```javascript
const CRYPTO_KEYWORDS = [
  'crypto', 'bitcoin', 'btc', 'ethereum', 'eth',
  'wallet', 'exchange', 'trading', 'defi', 'nft',
  'blockchain', 'coin', 'token', 'airdrop', 'stake'
];
```

---

## 5. Estructura de Archivos

```
security-extension/
├── manifest.json                # Configuración Chrome Extension
├── README.md                    # Documentación principal (ES/EN)
├── LICENSE                      # MIT License
│
├── icons/                       # Iconos de la extensión
│   ├── logo-16.png             # Logo 16x16 (toolbar)
│   ├── logo-48.png             # Logo 48x48 (extensiones)
│   ├── logo-128.png            # Logo 128x128 (Chrome Store)
│   └── alert-red.svg           # Icono alerta roja
│
├── src/                         # Código fuente
│   ├── content.js              # Content script (se inyecta en páginas)
│   ├── background.js           # Service worker (background)
│   ├── popup.html              # UI del popup
│   ├── popup.js                # Lógica del popup
│   ├── popup.css               # Estilos del popup
│   │
│   ├── utils/                  # Utilidades
│   │   ├── detector.js         # Motor de detección
│   │   ├── levenshtein.js      # Algoritmo de similitud
│   │   └── storage.js          # Gestión chrome.storage
│   │
│   ├── ui/                     # Componentes UI
│   │   ├── alerts.js           # Sistema de alertas inyectadas
│   │   └── badge.js            # Badge flotante
│   │
│   └── data/                   # Bases de datos locales
│       ├── sitios-verificados.json   # 100+ sitios legítimos
│       └── palabras-cripto.json      # 50+ keywords cripto
│
├── _locales/                    # Internacionalización
│   ├── es/
│   │   └── messages.json       # Traducciones español
│   └── en/
│       └── messages.json       # Traducciones inglés
│
├── docs/                        # Documentación
│   ├── PRD.md                  # Product Requirements Document
│   ├── ARCHITECTURE.md         # Este archivo
│   ├── MARKETING.md            # Estrategia de marketing
│   └── API.md                  # Documentación de funciones
│
└── tests/                       # Tests
    ├── levenshtein.test.js     # Tests algoritmo
    ├── detector.test.js        # Tests detección
    └── e2e/                    # Tests end-to-end
        └── phishing-scenarios.test.js
```

---

## 6. Decisiones Técnicas

### 6.1 ¿Por qué Manifest V3?

- **Estándar actual** de Chrome (V2 deprecated en 2023)
- **Service Workers** más eficientes que background pages
- **Mejor seguridad** con permisos granulares

### 6.2 ¿Por qué sin APIs externas?

- **Privacidad**: No enviamos datos del usuario
- **Offline**: Funciona sin internet (ideal LATAM)
- **Velocidad**: <100ms análisis (no espera respuesta servidor)
- **Sin costos**: No requiere backend

### 6.3 ¿Por qué Levenshtein?

- **Matemáticamente robusto**: No es "machine learning mágico"
- **Predecible**: Mismos inputs = mismos outputs
- **Rápido**: O(m × n) aceptable para dominios cortos
- **Estándar industria**: Usado por navegadores para sugerencias

### 6.4 ¿Por qué JSON local vs. API?

**Ventajas JSON local**:
- Funciona offline ✅
- No requiere autenticación ✅
- Actualizable vía GitHub releases ✅
- Transparente (usuarios pueden auditar) ✅

**Desventajas**:
- Requiere actualizaciones manuales ⚠️
- No detecta scams en tiempo real ⚠️

**Solución futura (v2.0)**:
- API opcional para sitios con internet
- Fallback a JSON local si no hay conexión

### 6.5 ¿Por qué content script vs. browser action?

**Content script**:
- Se ejecuta automáticamente en cada página
- Puede leer DOM y detectar botones
- No requiere interacción del usuario

**Browser action** (popup):
- Solo para UI/configuración
- No tiene acceso al DOM de la página

---

## 📞 Contacto Técnico

**Arquitecto**: equipo-tecnico@brujulacrypto.com  
**GitHub Issues**: https://github.com/JUANLU45/Brujula-Cripto/issues  
**Contribuciones**: Ver [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Última actualización**: Octubre 22, 2025  
**Versión**: 1.0  
**Estado**: ✅ Diseño finalizado, listo para implementación
