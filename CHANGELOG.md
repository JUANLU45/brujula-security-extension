# 📝 Changelog - Brújula Security Extension

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-10-22

### 🎉 Initial Release - ULTRA ROBUSTA

Primera versión completa de Brújula Security con sistema de protección multi-capa y personalización avanzada.

### ✨ Added (Funcionalidades Nuevas)

#### 🛡️ Sistema de Protección
- **Detección de Typosquatting** - 4 métodos combinados:
  - Similitud Levenshtein (>80%)
  - Detección de homógrafos (caracteres cirílicos/griegos)
  - Detección de adiciones de palabras (binance-app.com)
  - Sustitución de números por letras (b1nance.com)
- **Detección de sitios cripto desconocidos** - 240 palabras clave
- **Detección de conexión de wallet** - Múltiples proveedores (MetaMask, Trust, Coinbase, Solana)
- **Detección de indicadores de scam** - 160 palabras sospechosas
- **Detección de TLDs sospechosos** - 15 dominios de alto riesgo (.tk, .ga, .ml, etc.)
- **Detección CRÍTICA de seed phrases** - Alerta máxima si un sitio solicita frase de recuperación
- **Base de datos de sitios verificados** - 107 sitios en 7 categorías:
  - Exchanges (22 sitios)
  - Wallets (14 sitios)
  - DeFi (20 sitios)
  - NFT Marketplaces (9 sitios)
  - Bridges (6 sitios)
  - Analytics (11 sitios)
  - News (7 sitios, incluyendo brujulacrypto.com)

#### ⚙️ Sistema de Configuración (NUEVO)
- **Página de configuración completa** (`src/settings.html`)
  - Interfaz moderna con gradientes y animaciones
  - Accesible desde el popup (abre en nueva pestaña)
- **Control de badges**
  - Activar/desactivar indicadores en el icono de la extensión
  - Badge rojo (!) para amenazas ALTAS
  - Badge amarillo (⚠) para amenazas MEDIAS
- **Control de alertas visuales**
  - Activar/desactivar badges verdes y modales rojos/amarillos
  - Opción para usuarios que prefieren protección silenciosa
- **Niveles de alerta configurables**
  - "Todas" (ALTA + MEDIA + BAJA) - Máxima información
  - "ALTA y MEDIA solamente" - Balance seguridad/comodidad
  - "Solo ALTA" - Máxima seguridad, mínimas interrupciones
- **Cambio de idioma dinámico**
  - Español ↔ English
  - Cambio sin recargar extensión

#### 🛡️ Sistema de Whitelist (NUEVO)
- **Lista de sitios confiables personalizada**
  - Guardar sitios que el usuario marca como seguros
  - Almacenamiento local con `chrome.storage.local`
  - Visualización en página de configuración
- **Botón "Confío en este sitio"**
  - Aparece en modales rojos (amenazas ALTAS)
  - Agrega el dominio a la whitelist con un click
  - Confirmación visual de color verde
- **Gestión de whitelist**
  - Ver todos los sitios confiables
  - Eliminar sitios individuales
  - Limpiar toda la lista (con confirmación)
- **Respeto a la whitelist**
  - Sitios en whitelist nunca muestran alertas
  - Se saltan todos los detectores excepto seed phrase (seguridad crítica)

#### 🎨 Sistema de Alertas Visuales
- **Badge verde** (✅) - Sitios verificados oficialmente
  - Aparece en esquina superior derecha
  - Se auto-oculta después de 5 segundos
  - Animación de fade in/out
- **Modal amarillo** (⚠️) - Amenazas MEDIAS
  - Sitios cripto desconocidos
  - Conexión de wallet en sitios no especializados
  - Indicadores de scam (1 palabra)
- **Modal rojo** (🚨) - Amenazas ALTAS
  - Typosquatting detectado
  - Sitios cripto con conexión wallet
  - Múltiples indicadores de scam (2+)
  - Solicitud de seed phrase (CRÍTICO)

#### 🌐 Internacionalización Completa
- **96 claves de traducción** (ES/EN)
- **Mensajes bilingües:**
  - Alertas de seguridad
  - Interfaz de popup
  - Página de configuración
  - Mensajes educativos
  - Botones y labels
- **Traducciones contextuales**
  - Placeholders dinámicos para nombres de sitios
  - Contadores de amenazas
  - Fechas localizadas

### 🔧 Technical Improvements

#### Arquitectura
- **Manifest V3** - Última versión de Chrome Extensions API
- **Service Worker persistente** - Background script optimizado
- **Content Scripts modulares**:
  - `levenshtein.js` - Algoritmo de similitud
  - `detector.js` - Motor de detección (572 líneas)
  - `alerts.js` - Sistema de UI (327 líneas)
  - `content.js` - Orquestador principal
- **Manejo de errores robusto**
  - Detección de "Extension context invalidated"
  - Limpieza de cache en errores
  - Mensajes de advertencia claros

#### Performance
- **Cache de datos JSON**
  - sitios-verificados.json cargado una sola vez
  - palabras-cripto.json cacheado en memoria
- **Early exit en detectores**
  - Whitelist verificada primero
  - Sitios verificados saltan todos los análisis
- **Lazy loading de configuración**
  - Settings solo se cargan cuando se usan

#### Seguridad
- **Permisos mínimos**:
  - `activeTab` - Solo pestaña activa
  - `storage` - Guardar configuración
  - `scripting` - Inyección programática
  - `tabs` - Gestión de pestañas
- **web_accessible_resources** con wildcards
  - `icons/*.png`
  - `src/data/*.json`
- **Rutas absolutas** en Service Worker
  - `/icons/logo-16.png` en lugar de relativas

### 📦 Files Added

#### Core
- `src/settings.html` (322 líneas) - Página de configuración
- `src/settings.js` (220 líneas) - Lógica de configuración

#### Updated
- `src/utils/detector.js` - Agregada función `shouldShowAlert()` y respeto a whitelist
- `src/ui/alerts.js` - Agregado botón "Confío en este sitio" y verificación de configuración
- `src/ui/alerts.css` - Agregados estilos `.brujula-btn-trust`
- `src/popup.js` - Agregada redirección a settings.html
- `src/content.js` - Mejorado manejo de errores de contexto
- `src/background.js` - Rutas absolutas para iconos
- `_locales/es/messages.json` - +16 claves nuevas (total: 96)
- `_locales/en/messages.json` - +16 claves nuevas (total: 96)
- `src/data/sitios-verificados.json` - Agregado brujulacrypto.com y brujulacripto.com

#### Documentation
- `CHANGELOG.md` (este archivo)
- `README.md` - Actualizado con nuevas funcionalidades
- `docs/VERIFICACION.md` - Actualizado con nuevos features

### 🐛 Fixed

- **Extension context invalidated** - Manejo graceful con mensajes claros
- **Rutas de iconos** - Cambiadas a absolutas (`/icons/`) para Service Worker
- **web_accessible_resources** - Wildcards correctos (`*.png`, `*.json`)
- **MutationObserver** - Verificación de `document.body` antes de observar
- **Cache de JSON** - Limpieza en errores de contexto

### 🎯 User Experience

#### Configuración Intuitiva
- **Sin fricción**: Click en pestaña "Configuración" abre página completa
- **Cambios en tiempo real**: Guardar actualiza toda la extensión inmediatamente
- **Notificaciones visuales**: Confirmación verde al guardar
- **Diseño moderno**: Gradientes, sombras, animaciones suaves

#### Protección Personalizable
- **3 niveles de sensibilidad** para adaptarse a cada usuario
- **Whitelist fácil de usar** - Un click para confiar
- **Sin interrupciones innecesarias** si el usuario lo prefiere
- **Educación integrada** - Mensajes "¿Sabías que..." en alertas

#### Multilingüe Nativo
- **Detección automática** del idioma del navegador
- **Cambio sin fricción** entre español e inglés
- **Traducciones profesionales** - No automáticas

### 📊 Statistics

- **Total de archivos**: 18 (vs 15 en versión anterior)
- **Líneas de código JavaScript**: ~2,500
- **Líneas de CSS**: ~500
- **Traducciones**: 96 × 2 idiomas = 192 strings
- **Sitios verificados**: 107
- **Palabras cripto**: 240
- **Indicadores de scam**: 160
- **TLDs sospechosos**: 15
- **Métodos de detección**: 9

### 🚀 Performance Metrics

- **Tiempo de análisis**: <100ms
- **Tamaño de extensión**: ~250KB
- **Memoria usada**: <5MB
- **Carga de página**: 0 impacto perceptible

---

## [Próximas Versiones]

### [1.1.0] - Planeado

#### Posibles mejoras futuras:
- **Sincronización en la nube** (opcional) - Whitelist entre dispositivos
- **Reportar sitios falsos** - Sistema comunitario
- **Estadísticas avanzadas** - Gráficos de amenazas bloqueadas
- **Exportar/importar whitelist** - Backup de configuración
- **Modo ultra-paranoia** - Análisis aún más agresivo

---

**Desarrollado con ❤️ por el equipo de Brújula Cripto**  
Website: https://brujulacrypto.com  
GitHub: https://github.com/JUANLU45/Brujula-Cripto
