# 📋 PRD: Brújula Security - Extensión Anti-Phishing Cripto

**Product Requirements Document v1.0**

**Fecha**: Octubre 2025  
**Autor**: Equipo Brújula Cripto  
**Estado**: En Desarrollo

---

## 📑 Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Análisis de Mercado](#2-análisis-de-mercado)
3. [Propuesta de Valor](#3-propuesta-de-valor)
4. [User Personas](#4-user-personas)
5. [Características Técnicas](#5-características-técnicas)
6. [Casos de Uso](#6-casos-de-uso)
7. [Requisitos No Funcionales](#7-requisitos-no-funcionales)
8. [Roadmap](#8-roadmap)
9. [Métricas de Éxito](#9-métricas-de-éxito)

---

## 1. Resumen Ejecutivo

### 1.1 Problema

**1 de cada 3 usuarios de criptomonedas** ha perdido fondos por phishing. Los sitios maliciosos evolucionan más rápido que las listas negras de extensiones existentes.

**Escenario típico de pérdida:**
```
Usuario busca: "comprar bitcoin barato"
→ Clica resultado patrocinado: "crypto-exchange-pro.com"
→ Sitio parece legítimo (diseño profesional, SSL válido)
→ "Connect Wallet to get 50% bonus"
→ Usuario conecta MetaMask
→ Firma transacción maliciosa
→ Fondos robados en <30 segundos
```

### 1.2 Solución

**Brújula Security** detecta sitios cripto sospechosos **ANTES** de que el usuario conecte su wallet mediante:

1. **Análisis de similitud** (typosquatting: binanse.com vs binance.com)
2. **Detección de palabras cripto** en dominios desconocidos
3. **Identificación de conexiones wallet** en sitios no verificados

### 1.3 Diferenciadores Clave

| Característica | Brújula Security | Competencia |
|---|---|---|
| **Idioma español nativo** | ✅ | ❌ |
| **Funciona offline** | ✅ | ⚠️ Parcial |
| **Detección proactiva** | ✅ | ⚠️ Solo listas negras |
| **Sin registro** | ✅ | ⚠️ Requieren cuenta |
| **Privacidad total** | ✅ | ❌ Envían datos |

---

## 2. Análisis de Mercado

### 2.1 Tamaño del Mercado

- **Usuarios cripto hispanohablantes**: ~50M (2025)
- **Pérdidas por phishing**: $4.6B USD globales (2024)
- **Crecimiento anual**: +23% usuarios LATAM

### 2.2 Competencia Directa

#### **A) Scam Sniffer** 🔍
- **Usuarios**: 100,000+
- **Fortalezas**:
  - Base de datos de scams conocidos
  - Detección de firmas maliciosas
  - Integración con OpenSea
- **Debilidades**:
  - Solo inglés
  - Requiere API backend
  - Interfaz compleja
- **Precio**: Gratis

#### **B) Fire (by Chainpatrol)** 🔥
- **Usuarios**: 500,000+
- **Fortalezas**:
  - Machine Learning avanzado
  - Cobertura de múltiples blockchains
- **Debilidades**:
  - Requiere cuenta
  - Modelo freemium (límites en free tier)
  - Comparte datos con terceros
- **Precio**: Gratis / $4.99/mes PRO

#### **C) Pocket Universe** 🌌
- **Usuarios**: 50,000+
- **Fortalezas**:
  - Simulación de transacciones
  - Detección de contratos maliciosos
- **Debilidades**:
  - Solo previene después de conectar wallet
  - Limitado a Ethereum/EVM
- **Precio**: Gratis

### 2.3 Competencia Indirecta

- **MetaMask** (wallet con detección básica)
- **Netcraft Extension** (anti-phishing general)
- **Google Safe Browsing** (lista negra genérica)

### 2.4 Ventaja Competitiva

**Posicionamiento único:**
> "La primera extensión de seguridad cripto en español, 100% offline y privada"

**Barreras de entrada para competidores:**
1. Marca establecida (Brújula Cripto = confianza)
2. Comunidad hispanohablante leal
3. Algoritmo propietario de detección proactiva

---

## 3. Propuesta de Valor

### 3.1 Elevator Pitch (30 segundos)

> "¿Sabes que 1 de cada 3 usuarios de cripto ha perdido dinero por phishing? **Brújula Security** te protege detectando sitios falsos ANTES de que conectes tu wallet. Gratis, en español, y sin recopilar tus datos."

### 3.2 Beneficios Principales

#### Para el Usuario Novato
- ✅ **Tranquilidad**: "No tengo que preocuparme si este sitio es falso"
- ✅ **Sin conocimientos técnicos**: Se instala y funciona automáticamente
- ✅ **Educación**: Aprende a identificar sitios peligrosos

#### Para el Trader Activo
- ⚡ **Velocidad**: Alertas instantáneas (<100ms)
- 🛡️ **Protección multicapa**: Complementa otras medidas de seguridad
- 📊 **Sin fricción**: No interrumpe el flujo de trabajo

#### Para el Escéptico de LATAM
- 🌐 **Funciona offline**: Ideal para internet intermitente
- 🇪🇸 **En su idioma**: Español nativo, no traducciones genéricas
- 🔒 **Privacidad**: No envía datos a servidores externos

### 3.3 Casos de Uso Reales

#### **Caso 1: Typosquatting**
```
Usuario escribe: binanse.com (error de tipeo)
→ Extensión detecta: 92% similar a binance.com
→ Alerta ROJA: "⚠️ POSIBLE PHISHING
   Este sitio es muy parecido a binance.com
   ¿Querías entrar en el sitio oficial?"
→ Usuario cierra la pestaña
→ Fondos salvados ✅
```

#### **Caso 2: Sitio Desconocido con Conexión Wallet**
```
Usuario entra en: free-ethereum-airdrop.com
→ Extensión detecta:
   - Palabras cripto: "ethereum", "airdrop"
   - NO está en sitios verificados
   - Botón "Connect Wallet" presente
→ Alerta ROJA: "⚠️ SITIO NO VERIFICADO
   Nunca conectes tu wallet a sitios desconocidos"
→ Usuario no conecta wallet
→ Fondos salvados ✅
```

#### **Caso 3: Sitio Legítimo**
```
Usuario entra en: binance.com
→ Extensión detecta: Sitio en lista verificada
→ Badge verde discreto: "✅ Sitio verificado"
→ Usuario opera con confianza
```

---

## 4. User Personas

### 4.1 Persona Primaria: "El Novato Vulnerable"

**Nombre**: Juan  
**Edad**: 28 años  
**Ubicación**: Ciudad de México  
**Ocupación**: Diseñador gráfico freelance

**Perfil Cripto**:
- Compró $100 USD en Bitcoin hace 3 meses
- Usa solo Binance y Trust Wallet
- Ve videos de YouTube para aprender
- No entiende términos técnicos

**Frustraciones**:
- "No sé si este sitio es real o falso"
- "Vi un video de alguien que perdió todo por clicar un link"
- "Las extensiones en inglés no las entiendo bien"

**Objetivos**:
- Proteger sus ahorros
- Aprender sin riesgo
- Sentirse seguro al navegar

**Cómo Brújula Security le ayuda**:
- Alertas en español claro
- Protección automática (no requiere configuración)
- Educación contextual (explica POR QUÉ es peligroso)

### 4.2 Persona Secundaria: "El Trader Activo"

**Nombre**: María  
**Edad**: 35 años  
**Ubicación**: Buenos Aires, Argentina  
**Ocupación**: Trader cripto full-time

**Perfil Cripto**:
- Portfolio de $50,000 USD
- Usa 5+ exchanges (Binance, Kraken, Bybit, etc.)
- Opera DeFi (Uniswap, Aave, Curve)
- Lee whitepapers y participa en DAOs

**Frustraciones**:
- "Visito 20+ sitios cripto al día, es fácil equivocarse"
- "Casi conecto mi wallet a un sitio falso de Uniswap"
- "Las extensiones de seguridad tienen falsos positivos molestos"

**Objetivos**:
- Protección sin fricción
- Alertas solo cuando es necesario
- Privacidad total (no quiere ser trackeada)

**Cómo Brújula Security le ayuda**:
- Detección inteligente (menos falsos positivos)
- Funciona offline (no depende de APIs lentas)
- No rastrea su actividad

### 4.3 Persona Terciaria: "El Escéptico de LATAM"

**Nombre**: Carlos  
**Edad**: 42 años  
**Ubicación**: Lima, Perú  
**Ocupación**: Ingeniero de sistemas

**Perfil Cripto**:
- Holdea Bitcoin desde 2017
- Usa cold wallet (Ledger)
- Internet intermitente en su zona
- Desconfía de servicios que requieren registro

**Frustraciones**:
- "Las extensiones en inglés están mal traducidas"
- "No funciono cuando no hay internet"
- "No confío en servicios que envían mis datos a USA"

**Objetivos**:
- Herramienta que funcione offline
- Privacidad absoluta
- Open source para auditar el código

**Cómo Brújula Security le ayuda**:
- 100% local (no envía datos)
- Funciona sin internet
- Código abierto en GitHub

---

## 5. Características Técnicas

### 5.1 Features Core (MVP)

#### F1: Detección de Typosquatting
**Descripción**: Detecta dominios muy similares a sitios legítimos conocidos.

**Lógica**:
```javascript
// Algoritmo Levenshtein Distance
function detectarTyposquatting(dominioActual) {
  const sitiosLegitimos = ['binance.com', 'coinbase.com', ...];
  
  for (let sitio of sitiosLegitimos) {
    const similitud = calcularLevenshtein(dominioActual, sitio);
    
    if (similitud > 80% && dominioActual !== sitio) {
      return {
        nivel: 'ROJO',
        mensaje: `Posible phishing. ¿Querías entrar en ${sitio}?`
      };
    }
  }
  return null;
}
```

**Criterios de aceptación**:
- ✅ Detecta similitud >80%
- ✅ Alerta en <100ms
- ✅ No genera falsos positivos en dominios legítimos

#### F2: Detección de Sitios Cripto Desconocidos
**Descripción**: Identifica sitios con vocabulario cripto que NO están verificados.

**Lógica**:
```javascript
function detectarSitioDesconocido(dominio, contenidoPagina) {
  const palabrasCripto = [
    'crypto', 'bitcoin', 'ethereum', 'wallet', 
    'exchange', 'airdrop', 'defi', 'nft'
  ];
  
  const contieneVocabularioCripto = palabrasCripto.some(
    palabra => dominio.includes(palabra)
  );
  
  const estaVerificado = sitiosVerificados.includes(dominio);
  
  if (contieneVocabularioCripto && !estaVerificado) {
    return {
      nivel: 'AMARILLO',
      mensaje: 'Sitio cripto no verificado. Precaución.'
    };
  }
  return null;
}
```

**Criterios de aceptación**:
- ✅ Detecta 50+ palabras clave
- ✅ No alerta en subdominios de sitios verificados
- ✅ Actualizable sin reinstalar extensión

#### F3: Detección de Conexión Wallet
**Descripción**: Alerta si un sitio desconocido intenta conectar con MetaMask/WalletConnect.

**Lógica**:
```javascript
function detectarConexionWallet() {
  const tieneBotonConectar = document.querySelector(
    '[text*="Connect Wallet"], [text*="Conectar"]'
  );
  
  const tieneProviderEthereum = window.ethereum !== undefined;
  
  const esSitioVerificado = sitiosVerificados.includes(
    window.location.hostname
  );
  
  if ((tieneBotonConectar || tieneProviderEthereum) && !esSitioVerificado) {
    return {
      nivel: 'ROJO',
      mensaje: '⚠️ PELIGRO: Sitio desconocido pide conectar wallet'
    };
  }
  return null;
}
```

**Criterios de aceptación**:
- ✅ Detecta botones en español/inglés
- ✅ Detecta `window.ethereum` injection
- ✅ Alerta ANTES de que se abra popup de MetaMask

#### F4: Sistema de Alertas Visuales
**Descripción**: Badge flotante con 3 niveles de alerta.

**Diseño**:
```
🟢 VERDE (Verificado)
  - Posición: Esquina superior derecha
  - Tamaño: 40x40px (discreto)
  - Texto: "✅ Verificado"

🟡 AMARILLO (Precaución)
  - Posición: Centro superior
  - Tamaño: 300x80px
  - Texto: "⚠️ Sitio no verificado"
  - Botón: "Más info"

🔴 ROJO (Peligro)
  - Posición: Pantalla completa (overlay semitransparente)
  - Tamaño: 500x300px (modal)
  - Texto: "🚨 POSIBLE PHISHING"
  - Botones: "Salir de aquí" | "Ignorar (no recomendado)"
```

**Criterios de aceptación**:
- ✅ Visible sobre cualquier z-index
- ✅ No bloqueable por sitios maliciosos
- ✅ Responsive (mobile/desktop)

#### F5: Base de Datos Local de Sitios Verificados
**Descripción**: JSON con 100+ sitios cripto legítimos.

**Estructura**:
```json
{
  "exchanges": [
    "binance.com",
    "coinbase.com",
    "kraken.com",
    "bybit.com",
    "kucoin.com"
  ],
  "wallets": [
    "metamask.io",
    "trustwallet.com",
    "ledger.com",
    "trezor.io"
  ],
  "defi": [
    "uniswap.org",
    "aave.com",
    "curve.fi",
    "compound.finance"
  ],
  "nft": [
    "opensea.io",
    "blur.io",
    "rarible.com"
  ],
  "lastUpdated": "2025-10-22"
}
```

**Criterios de aceptación**:
- ✅ 100+ sitios al lanzamiento
- ✅ Actualización mensual vía GitHub
- ✅ Contribuciones de la comunidad

### 5.2 Features Futuros (Post-MVP)

#### F6: Whitelist Personalizada (v1.1)
- Usuario puede marcar sitios como seguros
- Sincronización opcional vía Firebase

#### F7: Reporte de Sitios Maliciosos (v1.2)
- Botón para reportar nuevos scams
- Envío a base de datos comunitaria

#### F8: Integración con Brújula Cripto (v1.3)
- Artículos educativos contextuales
- Estadísticas de protección en dashboard

#### F9: Análisis de Contratos (v2.0)
- Verificación de contratos inteligentes
- Detección de honeypots/rugpulls

---

## 6. Casos de Uso

### CU1: Primer Uso (Onboarding)

**Actor**: Usuario novato  
**Precondición**: Extensión recién instalada

**Flujo Principal**:
1. Usuario instala extensión desde Chrome Web Store
2. Extensión muestra página de bienvenida:
   ```
   🛡️ ¡Bienvenido a Brújula Security!
   
   ✅ Ya estás protegido contra phishing cripto
   ✅ No requiere configuración
   ✅ Funciona automáticamente
   
   [Ver tutorial de 2 minutos] [Empezar a navegar]
   ```
3. Usuario elige idioma (ES/EN)
4. Tutorial interactivo muestra:
   - Cómo se ven las alertas (verde/amarillo/rojo)
   - Ejemplo de sitio falso vs real
   - Dónde ver estadísticas de protección
5. Usuario empieza a navegar con protección activa

**Postcondición**: Usuario entiende cómo funciona la extensión

### CU2: Detección de Typosquatting

**Actor**: Trader activo  
**Precondición**: Usuario intenta entrar en sitio falso

**Flujo Principal**:
1. Usuario escribe "binanse.com" (error de tipeo)
2. Navegador carga la página
3. Content script analiza dominio:
   ```javascript
   calcularLevenshtein('binanse.com', 'binance.com')
   // Resultado: 92% similar
   ```
4. Extensión inyecta alerta ROJA:
   ```
   🚨 POSIBLE PHISHING DETECTADO
   
   Este sitio es muy similar a: binance.com
   
   Diferencias detectadas:
   - binans**e**.com (OFICIAL)
   - binans**a**.com (ACTUAL - FALSO)
   
   [Ir a binance.com oficial] [Cerrar esta pestaña]
   ```
5. Usuario clica "Ir a binance.com oficial"
6. Extensión redirige a sitio real
7. Extensión registra estadística: "Phishing bloqueado"

**Postcondición**: Usuario evita perder fondos

### CU3: Sitio Legítimo (Flujo Exitoso)

**Actor**: Usuario cualquiera  
**Precondición**: Usuario entra en sitio verificado

**Flujo Principal**:
1. Usuario entra en "coinbase.com"
2. Content script verifica:
   ```javascript
   sitiosVerificados.exchanges.includes('coinbase.com')
   // true
   ```
3. Extensión inyecta badge verde discreto (esquina)
4. Usuario opera normalmente
5. No hay interrupciones

**Postcondición**: Usuario tiene confianza en el sitio

---

## 7. Requisitos No Funcionales

### 7.1 Rendimiento

- **Tiempo de análisis**: <100ms por página
- **Uso de memoria**: <50MB
- **Impacto en carga de página**: <2%

### 7.2 Compatibilidad

- **Navegadores**: Chrome 88+, Edge 88+, Brave 1.20+
- **Sistemas operativos**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Manifest Version**: V3 (última estándar)

### 7.3 Seguridad

- **Permisos mínimos**: Solo `activeTab`, `storage`
- **Sin conexiones externas**: 100% offline
- **Código abierto**: GitHub público para auditoría
- **Sin telemetría**: Cero recopilación de datos

### 7.4 Accesibilidad

- **WCAG 2.1 AA**: Cumplimiento total
- **Screen readers**: Compatibilidad con NVDA/JAWS
- **Contraste**: AAA en alertas rojas (7:1)
- **Teclado**: Navegación sin mouse

### 7.5 Internacionalización

- **Idiomas lanzamiento**: Español (ES), Inglés (EN)
- **Idiomas futuros**: Portugués (PT-BR), Francés (FR)
- **Formato de fechas**: Localizado por región
- **Monedas**: USD, EUR, MXN, ARS, COP

---

## 8. Roadmap

### Fase 1: MVP (Mes 1)
- ✅ Estructura de archivos
- ✅ Algoritmo Levenshtein
- ✅ Base de datos 100 sitios
- ✅ Sistema de alertas básico
- ✅ i18n ES/EN
- ✅ Documentación completa

### Fase 2: Beta Testing (Mes 2)
- 🔄 Pruebas con 50 usuarios
- 🔄 Corrección de bugs
- 🔄 Optimización de rendimiento
- 🔄 Diseño final de alertas

### Fase 3: Lanzamiento Público (Mes 3)
- 📅 Publicación en Chrome Web Store
- 📅 Artículo en blog Brújula Cripto
- 📅 Campaña en redes sociales
- 📅 Monitoreo de métricas

### Fase 4: Iteración v1.1 (Mes 4-6)
- 📅 Whitelist personalizada
- 📅 Reporte de sitios maliciosos
- 📅 500+ sitios verificados
- 📅 Firefox/Edge versions

---

## 9. Métricas de Éxito

### 9.1 Métricas de Adopción

#### Corto Plazo (3 meses)
- **Instalaciones**: 1,000+
- **Rating Chrome Store**: 4.5+ estrellas
- **Usuarios activos diarios (DAU)**: 500+
- **Retención 7 días**: 60%+

#### Mediano Plazo (6 meses)
- **Instalaciones**: 5,000+
- **Reseñas positivas**: 50+
- **DAU**: 2,500+
- **Menciones en medios**: 3+ artículos

#### Largo Plazo (12 meses)
- **Instalaciones**: 20,000+
- **DAU**: 10,000+
- **Partnerships**: 2+ proyectos cripto
- **Expansión**: Firefox, Edge, Safari

### 9.2 Métricas de Impacto

- **Phishing bloqueados**: Objetivo 100+ al mes
- **Fondos salvados**: Estimación basada en reportes de usuarios
- **Falsos positivos**: <5% de alertas
- **Tiempo promedio de respuesta**: <50ms

### 9.3 Métricas de Negocio

- **Tráfico a Brújula Cripto**: +15% desde extensión
- **Suscriptores newsletter**: +500 desde CTA en extensión
- **Brand awareness**: 20% usuarios asocian "seguridad cripto" con Brújula

---

## 📞 Contacto

**Equipo de Producto**: producto@brujulacrypto.com  
**Reporte de Bugs**: security-extension@brujulacrypto.com  
**GitHub**: https://github.com/JUANLU45/Brujula-Cripto

---

**Última actualización**: Octubre 22, 2025  
**Versión documento**: 1.0  
**Estado**: ✅ Aprobado para desarrollo
