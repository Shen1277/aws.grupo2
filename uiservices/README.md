# AWS Cost Simulator - Frontend

Frontend web per a l'API de simulació de costos AWS.

## Estructura del Projecte

```
uiservices/
├── index.html          # Pàgina principal (SPA)
├── css/
│   └── styles.css      # Estils amb colors AWS
├── js/
│   └── app.js          # Lògica de l'aplicació
└── README.md           # Documentació
```

## Requisits

- Navegador web modern (Chrome, Firefox, Edge, Safari)
- API backend executant-se a `http://127.0.0.1:8000`

## Configuració

La URL de l'API es pot configurar al fitxer `js/app.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

## Funcionalitats

### 1. Dashboard
- Resum de costos totals
- Nombre total d'usos
- Hores totals consumides
- Actualització manual amb botó

### 2. Gestió d'Usos
- Llistat complet amb taula
- Crear nous usos (servei, hores, projecte)
- Editar usos existents
- Eliminar usos individuals
- Eliminar tots els usos

### 3. Gestió de Preus
- Visualitzar preus per servei (EC2, S3, RDS)
- Actualitzar preus individualment
- Interfície amb targetes visuals

### 4. Simulador de Cost Mensual
- Configurar dies al mes
- Definir hores diàries per cada servei
- Calcular cost total mensual
- Desglossament per servei

### 5. Estadístiques
- Gràfic de barres per servei
- Gràfic de barres per projecte
- Detall d'usos i hores per categoria

## Serveis Disponibles

| Servei | Descripció |
|--------|------------|
| EC2 | Elastic Compute Cloud |
| S3 | Simple Storage Service |
| RDS | Relational Database Service |

## Endpoints de l'API

| Mètode | Endpoint | Descripció |
|--------|----------|------------|
| GET | `/stats/summary` | Resum global |
| GET | `/usages` | Llistar tots els usos |
| POST | `/usages` | Crear nou ús |
| GET | `/usages/{id}` | Obtenir un ús |
| PATCH | `/usages/{id}` | Editar ús |
| DELETE | `/usages/{id}` | Eliminar ús |
| DELETE | `/usages` | Eliminar tots els usos |
| GET | `/pricing` | Obtenir preus |
| PUT | `/pricing/{servei}` | Actualitzar preu |
| POST | `/simulate/monthly` | Simular cost mensual |
| GET | `/stats/by-service` | Stats per servei |
| GET | `/stats/by-project` | Stats per projecte |

## Ús

1. Assegura't que l'API backend està en marxa:
   ```bash
   # Des de la carpeta del backend
   uvicorn main:app --reload
   ```

2. Obre `index.html` en un navegador web:
   - Doble clic al fitxer
   - O serveix-lo amb un servidor local:
     ```bash
     # Python
     python -m http.server 8080

     # Node.js
     npx serve .
     ```

3. Navega per les seccions utilitzant el menú superior

## Característiques Tècniques

- **HTML5 + CSS3 + JavaScript pur** - Sense frameworks
- **SPA (Single Page Application)** - Navegació sense recàrrega
- **Responsive Design** - Adaptat a mòbil i escriptori
- **Toast Notifications** - Feedback visual d'operacions
- **Modals de confirmació** - Per accions destructives
- **Colors AWS** - Taronja #ff9900, Blau fosc #232f3e

## Compatibilitat

- Chrome 80+
- Firefox 75+
- Edge 80+
- Safari 13+

## Llicència

Projecte educatiu - Lliure ús
