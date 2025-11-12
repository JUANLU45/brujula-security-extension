# 🛡️ Brújula Security | Crypto Anti-Phishing Extension

**[English](#english) | [Español](#español)**

---

## Español

### 🎯 Descripción

**Brújula Security** es la primera extensión de navegador anti-phishing cripto en español. Protege tus criptomonedas detectando sitios maliciosos **antes** de que conectes tu wallet.

### ✨ Características Principales

- ✅ **Detección Proactiva**: Identifica sitios cripto sospechosos desconocidos
- 🔍 **Anti-Typosquatting**: Detecta dominios falsificados (binanse.com vs binance.com)
- 🛡️ **Sistema de Whitelist**: Marca sitios como confiables y nunca vuelvas a ver alertas sobre ellos
- ⚙️ **Configuración Personalizable**: 
  - Activa/desactiva badges en el icono
  - Controla qué nivel de alertas ver (ALTA, MEDIA, BAJA)
  - Elige mostrar u ocultar alertas visuales
  - Cambia el idioma en cualquier momento
- 🌐 **Funciona Offline**: Toda la detección es local, sin APIs externas
- 🇪🇸 **Bilingüe Completo**: Interfaz completa en español e inglés (96 traducciones)
- 🔒 **100% Privado**: Sin rastreo, sin cuentas, sin recopilación de datos
- ⚡ **Alertas Instantáneas**: Notificaciones en menos de 0.1 segundos
- 🎯 **Botón "Confío en este sitio"**: Agrega excepciones personalizadas con un click

### 🚀 Instalación

#### Desde Chrome Web Store (Recomendado)
1. Visita [Chrome Web Store](#) (próximamente)
2. Click en "Añadir a Chrome"
3. Confirma los permisos
4. ¡Listo! Ya estás protegido

#### Instalación Manual (Desarrolladores)
```bash
# Clonar el repositorio
git clone https://github.com/JUANLU45/Brujula-Cripto.git

# Navegar a la extensión
cd packages/security-extension

# Abrir Chrome y dirigirse a chrome://extensions/
# Activar "Modo desarrollador"
# Click en "Cargar extensión sin empaquetar"
# Seleccionar la carpeta security-extension
```

### 📖 Uso

Una vez instalada, la extensión funciona **completamente automática**:

#### 🎨 Alertas Visuales Automáticas
- **🟢 Badge Verde**: Sitio verificado y seguro (se muestra 5 segundos)
- **🟡 Modal Amarillo**: Sitio cripto desconocido (precaución recomendada)
- **🔴 Modal Rojo**: Posible phishing detectado (¡PELIGRO! NO CONECTES TU WALLET)

#### ⚙️ Personalización Avanzada
1. Haz clic en el icono de la extensión
2. Ve a la pestaña "Configuración" (se abre en nueva página)
3. Configura:
   - **Badge en icono**: Muestra indicadores (!, ?) según amenaza
   - **Alertas visuales**: Activa/desactiva badges verdes y modales rojos
   - **Nivel de alerta**: 
     - "Todas" (ALTA + MEDIA + BAJA)
     - "ALTA y MEDIA solamente"
     - "Solo ALTA" (máxima seguridad)
   - **Idioma**: Español ↔ English
   - **Sitios de confianza**: Ver y gestionar tu whitelist personal

#### 🛡️ Agregar Sitios Confiables
Si recibes una alerta en un sitio que **tú sabes que es legítimo**:
1. En el modal rojo, haz clic en "✅ Confío en este sitio"
2. El sitio se agregará a tu lista personal de confianza
3. No volverás a ver alertas sobre ese sitio

**Importante**: Solo marca como confiable sitios que **realmente conozcas y uses**.

### 🛠️ Tecnología

- **Algoritmo Levenshtein**: Detección matemática de similitud entre dominios
- **Base de datos local**: 100+ sitios cripto verificados
- **Content Scripts**: Análisis en tiempo real de cada página
- **Manifest V3**: Última versión de Chrome Extensions API

### 📊 Estadísticas de Protección

- **Sitios verificados**: 107+ exchanges, wallets, DeFi, NFT marketplaces y news
- **Palabras cripto detectadas**: 240+ términos clave
- **Indicadores de scam**: 160+ palabras sospechosas
- **TLDs sospechosos**: 15 dominios de alto riesgo
- **Precisión typosquatting**: 92%+ de similitud detectada
- **Tiempo de respuesta**: <100ms
- **Traducciones**: 96 claves en ES/EN
- **Métodos de detección**: 9 algoritmos combinados

### 🤝 Contribuir

¿Encontraste un sitio falso? ¿Quieres agregar más sitios verificados?

1. Fork este repositorio
2. Crea una rama: `git checkout -b feature/nuevo-sitio`
3. Edita `src/data/sitios-verificados.json`
4. Commit: `git commit -m 'Agregar exchange-legítimo.com'`
5. Push: `git push origin feature/nuevo-sitio`
6. Abre un Pull Request

### 📄 Licencia

MIT License - Ver [LICENSE](../../LICENSE) para detalles

### 🔗 Enlaces

- [Documentación Completa](docs/PRD.md)
- [Arquitectura Técnica](docs/ARCHITECTURE.md)
- [Estrategia de Marketing](docs/MARKETING.md)
- [Brújula Cripto](https://brujulacripto.com)

---

## English

### 🎯 Description

**Brújula Security** is the first Spanish-native crypto anti-phishing browser extension. Protect your cryptocurrencies by detecting malicious sites **before** you connect your wallet.

### ✨ Key Features

- ✅ **Proactive Detection**: Identifies unknown suspicious crypto sites
- 🔍 **Anti-Typosquatting**: Detects fake domains (binanse.com vs binance.com)
- 🌐 **Works Offline**: All detection is local, no external APIs
- 🇬🇧 **Bilingual**: Full interface in Spanish and English
- 🔒 **100% Private**: No tracking, no accounts, no data collection
- ⚡ **Instant Alerts**: Notifications in less than 0.1 seconds

### 🚀 Installation

#### From Chrome Web Store (Recommended)
1. Visit [Chrome Web Store](#) (coming soon)
2. Click "Add to Chrome"
3. Confirm permissions
4. Done! You're now protected

#### Manual Installation (Developers)
```bash
# Clone the repository
git clone https://github.com/JUANLU45/Brujula-Cripto.git

# Navigate to the extension
cd packages/security-extension

# Open Chrome and go to chrome://extensions/
# Enable "Developer mode"
# Click "Load unpacked extension"
# Select the security-extension folder
```

### 📖 Usage

Once installed, the extension works automatically:

- **🟢 Green**: Verified and safe site
- **🟡 Yellow**: Unknown crypto site (caution)
- **🔴 Red**: Possible phishing detected (DON'T CONNECT YOUR WALLET!)

### 🛠️ Technology

- **Levenshtein Algorithm**: Mathematical detection of domain similarity
- **Local Database**: 100+ verified crypto sites
- **Content Scripts**: Real-time analysis of each page
- **Manifest V3**: Latest Chrome Extensions API version

### 📊 Protection Stats

- **Verified sites**: 100+ exchanges, wallets and DeFi platforms
- **Crypto words detected**: 50+ key terms
- **Typosquatting accuracy**: 92%+ similarity detected
- **Response time**: <100ms

### 🤝 Contributing

Found a fake site? Want to add more verified sites?

1. Fork this repository
2. Create a branch: `git checkout -b feature/new-site`
3. Edit `src/data/sitios-verificados.json`
4. Commit: `git commit -m 'Add legitimate-exchange.com'`
5. Push: `git push origin feature/new-site`
6. Open a Pull Request

### 📄 License

MIT License - See [LICENSE](../../LICENSE) for details

### 🔗 Links

- [Full Documentation](docs/PRD.md)
- [Technical Architecture](docs/ARCHITECTURE.md)
- [Marketing Strategy](docs/MARKETING.md)
- [Brújula Cripto](https://brujulacrypto.com)

---

<div align="center">
  
**Desarrollado con ❤️ por el equipo de Brújula Cripto**

[Website](https://brujulacrypto.com) • [Twitter](https://twitter.com/brujulacripto) • [Discord](#)

</div>
