# 🌱 MÉTRICAS DE SOSTENIBILIDAD EMPRESARIAL

**Sistema de Medición de Impacto para Vendedores**

---

## 📊 VISIÓN GENERAL

En lugar de medir el impacto **por producto**, el sistema captura las **métricas anuales de la empresa completa** durante el onboarding. Esto permite:

✅ Datos más precisos (las empresas conocen su impacto total)
✅ Cálculo automático del REGEN Score
✅ Evolución del NFT basado en rendimiento real
✅ Comparación justa entre vendedores
✅ Menor fricción en el onboarding

---

## 🎯 FRAMEWORK DE MÉTRICAS

Basado en estándares internacionales:
- **GHG Protocol** (Greenhouse Gas Protocol)
- **GRI Standards** (Global Reporting Initiative)
- **B Corp Impact Assessment**
- **ISO 14001** (Environmental Management)
- **Science Based Targets**

---

## 📋 CATEGORÍAS DE MÉTRICAS

### 1. 🌍 **EMISIONES Y CLIMA**

#### 1.1 Huella de Carbono
```typescript
{
  // Emisiones totales anuales (Scope 1 + 2 + 3)
  totalEmissions: {
    value: number,           // Toneladas CO₂e/año
    scope1: number,          // Emisiones directas (combustibles)
    scope2: number,          // Emisiones indirectas (electricidad)
    scope3: number,          // Cadena de valor (opcional)
    unit: "tCO2e/year"
  },

  // Reducción vs año anterior
  emissionsReduction: {
    value: number,           // Porcentaje (%)
    baseline: number,        // Año base para comparación
    unit: "%"
  },

  // Neutralidad de carbono
  carbonNeutrality: {
    status: "neutral" | "offsetting" | "reducing" | "none",
    offsetsUsed: number,     // Toneladas compensadas
    certifiedBy: string      // Certificador (Gold Standard, VCS, etc.)
  }
}
```

**Captura en Onboarding:**
- [ ] Emisiones totales anuales (tCO₂e)
- [ ] ¿Reducción vs año anterior? (%)
- [ ] ¿Es carbono neutral? (Sí/No)
- [ ] Toneladas compensadas/año

**Peso en REGEN Score:** 25%

---

### 2. 💧 **GESTIÓN DEL AGUA**

```typescript
{
  // Consumo de agua
  waterConsumption: {
    total: number,           // m³/año
    intensity: number,       // m³/unidad producida o m³/empleado
    unit: "m³/year"
  },

  // Ahorro de agua
  waterSaving: {
    value: number,           // m³/año ahorrados
    percentage: number,      // % vs año anterior
    methods: string[],       // ["reciclaje", "reutilización", "tecnología"]
    unit: "m³/year"
  },

  // Tratamiento de aguas residuales
  waterTreatment: {
    percentage: number,      // % de agua tratada antes de descarga
    certified: boolean,      // ¿Sistema certificado?
    standard: string         // ISO 14001, etc.
  }
}
```

**Captura en Onboarding:**
- [ ] Consumo anual de agua (m³)
- [ ] Agua ahorrada vs año anterior (m³)
- [ ] % de agua reciclada/reutilizada
- [ ] ¿Trata aguas residuales? (Sí/No)

**Peso en REGEN Score:** 15%

---

### 3. ⚡ **ENERGÍA**

```typescript
{
  // Consumo energético
  energyConsumption: {
    total: number,           // kWh/año
    intensity: number,       // kWh/unidad producida
    unit: "kWh/year"
  },

  // Energía renovable
  renewableEnergy: {
    percentage: number,      // % del total (0-100)
    sources: string[],       // ["solar", "eólica", "hidráulica"]
    selfGenerated: number,   // kWh autogenerados
    certified: boolean       // ¿Certificado de energía verde?
  },

  // Eficiencia energética
  energyEfficiency: {
    improvement: number,     // % mejora vs año anterior
    certification: string,   // "Energy Star", "LEED", etc.
    audits: boolean         // ¿Auditorías energéticas?
  }
}
```

**Captura en Onboarding:**
- [ ] Consumo anual de energía (kWh)
- [ ] % de energía renovable (0-100%)
- [ ] Fuentes renovables (solar, eólica, etc.)
- [ ] Energía autogenerada (kWh)
- [ ] Certificación energética (Energy Star, LEED, etc.)

**Peso en REGEN Score:** 20%

---

### 4. ♻️ **GESTIÓN DE RESIDUOS**

```typescript
{
  // Generación de residuos
  wasteGeneration: {
    total: number,           // Toneladas/año
    intensity: number,       // kg/unidad producida
    unit: "tons/year"
  },

  // Reciclaje y reutilización
  wasteManagement: {
    recyclingRate: number,   // % reciclado (0-100)
    reuseRate: number,       // % reutilizado (0-100)
    landfillRate: number,    // % a relleno sanitario (0-100)
    composting: boolean,     // ¿Compostaje?
    circularEconomy: boolean // ¿Economía circular implementada?
  },

  // Reducción de residuos
  wasteReduction: {
    percentage: number,      // % reducción vs año anterior
    zeroWasteGoal: boolean,  // ¿Meta de cero residuos?
    achievedBy: number       // Año objetivo (2030, 2050, etc.)
  }
}
```

**Captura en Onboarding:**
- [ ] Residuos generados/año (toneladas)
- [ ] % reciclado
- [ ] % reutilizado
- [ ] ¿Implementa economía circular? (Sí/No)
- [ ] Reducción vs año anterior (%)

**Peso en REGEN Score:** 15%

---

### 5. 🏭 **CADENA DE SUMINISTRO**

```typescript
{
  // Proveedores sostenibles
  sustainableSuppliers: {
    percentage: number,      // % de proveedores certificados (0-100)
    certified: string[],     // Certificaciones de proveedores
    audited: boolean,        // ¿Auditorías de sostenibilidad?
    localSourcing: number    // % de proveedores locales (reduce transporte)
  },

  // Trazabilidad
  traceability: {
    level: "high" | "medium" | "low",
    blockchain: boolean,     // ¿Usa blockchain para trazabilidad?
    certifications: string[] // Certificaciones de cadena de custodia
  },

  // Logística verde
  greenLogistics: {
    electricVehicles: number,    // % de flota eléctrica
    carbonNeutralShipping: boolean,
    packagingReduction: number   // % de reducción en packaging
  }
}
```

**Captura en Onboarding:**
- [ ] % de proveedores sostenibles certificados
- [ ] % de materias primas locales
- [ ] ¿Logística carbono neutral? (Sí/No)
- [ ] Reducción en empaque (%)

**Peso en REGEN Score:** 10%

---

### 6. 🏆 **CERTIFICACIONES Y COMPLIANCE**

```typescript
{
  environmentalCertifications: {
    iso14001: boolean,           // Gestión ambiental
    iso50001: boolean,           // Gestión energética
    leed: string,                // "Certified", "Silver", "Gold", "Platinum"
    bCorp: boolean,              // B Corporation
    fairTrade: boolean,
    organic: boolean,
    energyStar: boolean,
    carbonTrust: boolean,
    other: string[]
  },

  compliance: {
    environmentalRegulations: boolean,  // ¿Cumple regulaciones locales?
    permits: boolean,                   // ¿Permisos ambientales al día?
    violations: number,                 // Multas/violaciones últimos 3 años
    audits: {
      frequency: "annual" | "biannual" | "none",
      thirdParty: boolean
    }
  }
}
```

**Captura en Onboarding:**
- [ ] Certificaciones (checkboxes)
  - ISO 14001
  - ISO 50001
  - LEED
  - B Corp
  - Fair Trade
  - Organic
  - Energy Star
  - Otra (especificar)
- [ ] ¿Auditorías ambientales? (Sí/No/Frecuencia)

**Peso en REGEN Score:** 10%

---

### 7. 👥 **IMPACTO SOCIAL**

```typescript
{
  // Empleo y condiciones laborales
  employment: {
    totalEmployees: number,
    fairWages: boolean,          // ¿Salarios justos certificados?
    safetyRecord: number,        // Días sin accidentes
    diversity: number,           // % diversidad (género, etc.)
    benefits: boolean            // ¿Beneficios sostenibles?
  },

  // Comunidad
  communityImpact: {
    localJobs: number,           // % empleados de comunidad local
    communityPrograms: boolean,  // ¿Programas comunitarios?
    donation: number,            // % revenue donado
    volunteering: number         // Horas voluntariado/año
  },

  // Transparencia
  transparency: {
    sustainabilityReport: boolean,  // ¿Publica reporte?
    publicData: boolean,            // ¿Datos públicos?
    stakeholderEngagement: boolean  // ¿Diálogo con stakeholders?
  }
}
```

**Captura en Onboarding (Opcional):**
- [ ] Número de empleados
- [ ] ¿Salarios justos certificados? (Sí/No)
- [ ] % empleados de comunidad local
- [ ] ¿Publica reporte de sostenibilidad? (Sí/No)

**Peso en REGEN Score:** 5%

---

## 🎯 CÁLCULO DEL REGEN SCORE

### Fórmula de Scoring

```typescript
REGEN Score (0-100) =
  (Emisiones y Clima × 0.25) +
  (Gestión del Agua × 0.15) +
  (Energía × 0.20) +
  (Gestión de Residuos × 0.15) +
  (Cadena de Suministro × 0.10) +
  (Certificaciones × 0.10) +
  (Impacto Social × 0.05)
```

### Cálculo por Categoría

#### Emisiones y Clima (0-100)
```
Puntos =
  + 40 puntos si es Carbono Neutral
  + 30 puntos por reducción de emisiones (30% max)
    - 1 punto por cada 1% de reducción
  + 20 puntos por compensación de carbono (20% max)
    - Proporcional a % compensado
  + 10 puntos por certificación (Gold Standard, VCS)
```

#### Gestión del Agua (0-100)
```
Puntos =
  + 40 puntos por % de agua ahorrada (max 40%)
    - 1 punto por cada 1% ahorrado
  + 30 puntos por % de agua reciclada (max 30%)
    - 1 punto por cada 1% reciclado
  + 20 puntos por tratamiento de aguas residuales
  + 10 puntos por certificación
```

#### Energía (0-100)
```
Puntos =
  + 50 puntos por % energía renovable
    - 0.5 puntos por cada 1%
  + 30 puntos por autogeneración
    - Proporcional a % autogenerado
  + 20 puntos por certificación energética
```

#### Gestión de Residuos (0-100)
```
Puntos =
  + 40 puntos por % reciclaje
    - 0.4 puntos por cada 1%
  + 30 puntos por % reutilización
    - 0.3 puntos por cada 1%
  + 20 puntos por economía circular
  + 10 puntos por reducción vs año anterior
```

#### Cadena de Suministro (0-100)
```
Puntos =
  + 40 puntos por % proveedores sostenibles
  + 30 puntos por % sourcing local
  + 20 puntos por logística verde
  + 10 puntos por trazabilidad avanzada
```

#### Certificaciones (0-100)
```
Puntos por certificación:
  + ISO 14001: 25 puntos
  + B Corp: 25 puntos
  + LEED: 20 puntos (varía por nivel)
  + Fair Trade: 15 puntos
  + Organic: 15 puntos
  + Energy Star: 15 puntos
  + ISO 50001: 15 puntos
  + Otras: 10 puntos c/u (max 50 puntos total)
```

#### Impacto Social (0-100)
```
Puntos =
  + 30 puntos por salarios justos
  + 25 puntos por reporte de sostenibilidad
  + 25 puntos por % empleados locales
  + 20 puntos por programas comunitarios
```

---

## 🏆 SISTEMA DE NFTs - VERSIÓN REGENMARK

### 5 Niveles de NFT basados en REGEN Score

```typescript
NFT_LEVELS = {
  VERDE_CLARO: {
    name: "Verde Claro 🌱",
    minScore: 0,
    maxScore: 19,
    regenMarksRequired: 0, // Sin RegenMarks aprobados
    benefits: [
      "Perfil básico en marketplace",
      "Badge de vendedor verificado",
      "Soporte estándar",
      "Puede solicitar evaluaciones de RegenMarks"
    ],
    commission: "15%",  // Comisión estándar
    visibility: "normal",
    description: "Vendedor registrado sin certificaciones activas"
  },

  HOJA_ACTIVA: {
    name: "Hoja Activa 🍃",
    minScore: 20,
    maxScore: 39,
    regenMarksRequired: 1, // Al menos 1 RegenMark aprobado
    benefits: [
      "Todo lo de Verde Claro",
      "Badge 'Hoja Activa' en productos",
      "Destacado en filtros de sostenibilidad",
      "Comisión reducida",
      "Aparece en sección 'Vendedores Sostenibles'"
    ],
    commission: "13%",
    visibility: "aumentada (+15%)",
    description: "Primer nivel de certificación sostenible"
  },

  ECO_GUARDIA: {
    name: "Eco-Guardia 🛡️🌿",
    minScore: 40,
    maxScore: 59,
    regenMarksRequired: 2, // Al menos 2 RegenMarks aprobados
    benefits: [
      "Todo lo de Hoja Activa",
      "Badge especial 'Eco-Guardia'",
      "Featured en homepage (rotativo)",
      "Soporte prioritario",
      "Analytics avanzados",
      "Newsletter mensual destacado"
    ],
    commission: "11%",
    visibility: "alta (+30%)",
    description: "Compromiso fuerte con sostenibilidad"
  },

  ESTRELLA_VERDE: {
    name: "Estrella Verde ⭐🌿",
    minScore: 60,
    maxScore: 79,
    regenMarksRequired: 3, // Al menos 3 RegenMarks aprobados
    benefits: [
      "Todo lo de Eco-Guardia",
      "Badge Premium 'Estrella Verde'",
      "Destacado permanente en homepage",
      "Soporte VIP",
      "Co-marketing con plataforma",
      "Entrevista en blog de la plataforma",
      "Acceso a eventos exclusivos"
    ],
    commission: "9%",
    visibility: "muy alta (+50%)",
    description: "Líder en sostenibilidad empresarial"
  },

  HUELLA_CERO: {
    name: "Huella Cero ♻️✨",
    minScore: 80,
    maxScore: 100,
    regenMarksRequired: 4, // Al menos 4 RegenMarks aprobados
    benefits: [
      "Todo lo de Estrella Verde",
      "Badge Ultra Premium 'Huella Cero'",
      "Sección exclusiva en homepage",
      "Comisión mínima",
      "Soporte VIP 24/7",
      "Co-branding en campañas",
      "Caso de estudio publicado",
      "Embajador de la plataforma",
      "Prioridad en nuevas features",
      "Networking con otros líderes sostenibles"
    ],
    commission: "7%",
    visibility: "máxima (+70%)",
    description: "Máximo estándar de sostenibilidad"
  }
}
```

### 📊 Cálculo del Score Total

El REGEN Score se calcula como el **promedio ponderado** de los RegenMarks activos:

```typescript
function calculateRegenScore(regenMarks: RegenMark[]): number {
  if (regenMarks.length === 0) return 0

  const weights = {
    CARBON_SAVER: 0.25,    // 25%
    WATER_GUARDIAN: 0.30,  // 30%
    CIRCULAR_CHAMPION: 0,  // Incluido en otros
    HUMAN_FIRST: 0.30,     // 30%
    HUMANE_HERO: 0.15      // 15%
  }

  let totalScore = 0
  let totalWeight = 0

  regenMarks.forEach(mark => {
    if (mark.status === 'ACTIVE') {
      totalScore += mark.score * weights[mark.type]
      totalWeight += weights[mark.type]
    }
  })

  // Normalizar al 100%
  return totalWeight > 0 ? (totalScore / totalWeight) : 0
}
```

**Ejemplo:**

```
Vendor tiene 3 RegenMarks activos:
├─ Carbon Saver: 85/100 (peso 25%)  → 85 × 0.25 = 21.25
├─ Water Guardian: 70/100 (peso 30%) → 70 × 0.30 = 21.00
└─ Human First: 75/100 (peso 30%)    → 75 × 0.30 = 22.50

Score Total = (21.25 + 21.00 + 22.50) / (0.25 + 0.30 + 0.30)
            = 64.75 / 0.85
            = 76.18 → 76/100

Nivel NFT: ⭐🌿 Estrella Verde (60-79)
```

### Actualización del NFT

El NFT se actualiza:
- ✅ **Automáticamente** cuando se aprueba/renueva un RegenMark
- ✅ **Automáticamente** cuando expira un RegenMark (score baja)
- ✅ **En tiempo real** cuando se recalcula el score
- ✅ **Con notificación** al vendor cuando sube/baja de nivel

**Eventos de Actualización:**

```typescript
EVENTOS QUE ACTUALIZAN EL NFT
═══════════════════════════════════════════════════════════════
1. RegenMark aprobado     → Score sube → NFT puede subir nivel
2. RegenMark renovado     → Score actualiza → NFT recalculado
3. RegenMark expirado     → Score baja → NFT puede bajar nivel
4. RegenMark suspendido   → Score baja → NFT baja nivel
5. Score manual ajustado  → Por admin → NFT actualizado
```

---

## 📝 FORMULARIO DE ONBOARDING PROPUESTO

### Sección 1: Información Básica
- Nombre de la empresa
- Tipo de negocio
- Descripción
- Sitio web
- Contacto

### Sección 2: Certificaciones
**Checkboxes:**
- [ ] ISO 14001 (Gestión Ambiental)
- [ ] ISO 50001 (Gestión Energética)
- [ ] B Corp
- [ ] LEED (nivel: ______)
- [ ] Fair Trade
- [ ] Organic/Orgánico
- [ ] Energy Star
- [ ] Carbono Neutral (certificador: ______)
- [ ] Otra: __________

### Sección 3: Métricas de Impacto Ambiental

**🌍 Emisiones y Clima:**
- Emisiones totales anuales (tCO₂e): [____]
- ¿Reducción vs año anterior? Sí/No → % [____]
- ¿Es carbono neutral? Sí/No
- Toneladas compensadas: [____]

**💧 Agua:**
- Consumo anual (m³): [____]
- Ahorro vs año anterior (%): [____]
- % agua reciclada/reutilizada: [____]
- ¿Trata aguas residuales? Sí/No

**⚡ Energía:**
- Consumo anual (kWh): [____]
- % energía renovable: [____] (0-100%)
- Fuentes: [ ] Solar [ ] Eólica [ ] Hidráulica [ ] Otra
- Energía autogenerada (kWh): [____]

**♻️ Residuos:**
- Residuos generados/año (toneladas): [____]
- % reciclado: [____]
- % reutilizado: [____]
- ¿Economía circular? Sí/No
- Reducción vs año anterior (%): [____]

**🏭 Cadena de Suministro:**
- % proveedores sostenibles: [____]
- % materias primas locales: [____]
- ¿Logística carbono neutral? Sí/No

### Sección 4: Impacto Social (Opcional)
- Número de empleados: [____]
- % empleados locales: [____]
- ¿Publica reporte de sostenibilidad? Sí/No
- URL del reporte: [____]

### Sección 5: Vista Previa del Score

```
Calculando tu REGEN Score...

📊 REGEN Score Estimado: 68/100 🌳

Nivel de NFT: Árbol Joven 🌳

Beneficios:
✅ Badge especial en tus productos
✅ Comisión reducida: 10%
✅ Visibilidad aumentada +40%
✅ Soporte prioritario

Para alcanzar "Árbol Maduro 🌳✨" (80+):
• Aumenta tu % de energía renovable (+10%)
• Consigue certificación ISO 14001 (+25 pts)
• Mejora tu reciclaje al 80% (+8 pts)
```

---

## 🔄 ACTUALIZACIÓN ANUAL DE MÉTRICAS

### Dashboard del Vendedor

```
🌱 TU IMPACTO ESTE AÑO

REGEN Score Actual: 68/100 🌳 (Árbol Joven)

[⚠️ Es hora de actualizar tus métricas!]
Última actualización: Marzo 2024
Próxima actualización: Marzo 2025

[🔄 Actualizar Métricas Ahora]
```

Al hacer clic, el vendedor:
1. Ve un formulario pre-llenado con datos del año anterior
2. Actualiza las métricas con datos del nuevo año
3. Sistema recalcula el REGEN Score
4. Si el score cambió → NFT puede subir o bajar de nivel
5. Notificación: "¡Felicidades! Tu NFT evolucionó a Árbol Maduro 🌳✨"

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ❌ ANTES (Por Producto)

**Problemas:**
- Vendedor tiene que calcular impacto por cada producto individual
- Difícil de estimar (¿cuánto CO₂ ahorra este panel solar específico?)
- Inconsistente entre productos
- Mucha fricción en crear productos
- Datos poco confiables

**Ejemplo:**
```
Producto: Panel Solar 300W
├─ CO₂ reducido: ??? (difícil de calcular)
├─ Agua ahorrada: 0 (no aplica)
└─ Energía: ??? (varía por ubicación)
```

### ✅ DESPUÉS (Por Empresa)

**Ventajas:**
- Empresa ya conoce su impacto total anual
- Datos auditados/certificados
- Un solo formulario en onboarding
- Score se propaga a todos los productos
- Incentiva a empresas realmente sostenibles

**Ejemplo:**
```
Empresa: EcoTech Solutions
├─ REGEN Score: 68/100 🌳
├─ Todos sus productos heredan este score
├─ NFT: Árbol Joven
└─ Badge en cada producto: "Vendedor Sostenible 🌳"
```

---

## 🎯 MÉTRICAS RECOMENDADAS PARA MVP

Para el lanzamiento inicial, recomiendo capturar las **métricas esenciales**:

### ✅ OBLIGATORIAS (MVP)

1. **Certificaciones** (checkboxes)
   - ISO 14001
   - B Corp
   - Carbono Neutral
   - Otras principales

2. **Emisiones de CO₂**
   - Toneladas anuales
   - ¿Reducción vs año anterior? (%)
   - ¿Es carbono neutral?

3. **Energía**
   - % energía renovable (0-100%)
   - Fuentes renovables

4. **Residuos**
   - % reciclado
   - % reutilizado

### 🔜 FASE 2 (Post-MVP)

5. Agua (consumo, ahorro)
6. Cadena de suministro
7. Impacto social
8. Auditorías y compliance

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### Modelo de Datos (Prisma)

```prisma
model VendorProfile {
  // ... campos existentes ...

  // MÉTRICAS DE SOSTENIBILIDAD
  sustainabilityMetrics  Json? // Almacena todas las métricas
  regenScore            Int    @default(0) // 0-100
  regenScoreUpdatedAt   DateTime?
  nftLevel              String @default("SEMILLA_VERDE")

  // CERTIFICACIONES
  certifications        String[] @default([])

  // AUDITORÍA
  metricsVerified       Boolean @default(false)
  verifiedBy            String?
  verifiedAt            DateTime?
}

// Estructura del JSON sustainabilityMetrics:
{
  "emissions": {
    "total": 150.5,
    "reduction": 12,
    "carbonNeutral": true,
    "offsetsUsed": 150.5
  },
  "energy": {
    "total": 250000,
    "renewablePercentage": 75,
    "sources": ["solar", "eólica"],
    "selfGenerated": 100000
  },
  "waste": {
    "total": 50,
    "recyclingRate": 80,
    "reuseRate": 15,
    "circularEconomy": true
  },
  "water": {
    "consumption": 5000,
    "saving": 20,
    "recycled": 30,
    "treatment": true
  },
  "supply": {
    "sustainableSuppliers": 60,
    "localSourcing": 40,
    "greenLogistics": true
  },
  "social": {
    "employees": 50,
    "localEmployees": 80,
    "sustainabilityReport": true,
    "reportUrl": "https://..."
  },
  "year": 2024,
  "updatedAt": "2024-03-20"
}
```

### Función de Cálculo de Score

```typescript
// lib/utils/calculateRegenScore.ts

export function calculateRegenScore(metrics: SustainabilityMetrics, certifications: string[]): number {
  let score = 0

  // 1. Emisiones y Clima (25%)
  score += calculateEmissionsScore(metrics.emissions) * 0.25

  // 2. Agua (15%)
  score += calculateWaterScore(metrics.water) * 0.15

  // 3. Energía (20%)
  score += calculateEnergyScore(metrics.energy) * 0.20

  // 4. Residuos (15%)
  score += calculateWasteScore(metrics.waste) * 0.15

  // 5. Cadena de Suministro (10%)
  score += calculateSupplyScore(metrics.supply) * 0.10

  // 6. Certificaciones (10%)
  score += calculateCertificationsScore(certifications) * 0.10

  // 7. Impacto Social (5%)
  score += calculateSocialScore(metrics.social) * 0.05

  return Math.round(score)
}

function calculateEmissionsScore(emissions: EmissionsData): number {
  let points = 0

  if (emissions.carbonNeutral) points += 40

  if (emissions.reduction) {
    points += Math.min(emissions.reduction, 30)
  }

  if (emissions.offsetsUsed) {
    const offsetPercentage = (emissions.offsetsUsed / emissions.total) * 100
    points += Math.min(offsetPercentage * 0.2, 20)
  }

  // Bonus por certificación
  if (emissions.certified) points += 10

  return Math.min(points, 100)
}

// ... funciones similares para otras categorías
```

### Determinación del NFT

```typescript
export function determineNFTLevel(score: number): string {
  if (score >= 80) return "ARBOL_MADURO"
  if (score >= 60) return "ARBOL_JOVEN"
  if (score >= 40) return "BROTE"
  return "SEMILLA_VERDE"
}

export function getNFTBenefits(level: string) {
  const benefits = {
    SEMILLA_VERDE: {
      name: "Semilla Verde 🌱",
      commission: 0.15,
      visibilityBoost: 0,
      badge: "Vendedor Verificado"
    },
    BROTE: {
      name: "Brote 🌿",
      commission: 0.12,
      visibilityBoost: 0.20,
      badge: "Vendedor Sostenible"
    },
    ARBOL_JOVEN: {
      name: "Árbol Joven 🌳",
      commission: 0.10,
      visibilityBoost: 0.40,
      badge: "Vendedor Eco-Líder"
    },
    ARBOL_MADURO: {
      name: "Árbol Maduro 🌳✨",
      commission: 0.08,
      visibilityBoost: 0.60,
      badge: "Líder Sostenible"
    }
  }

  return benefits[level] || benefits.SEMILLA_VERDE
}
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Actualizar Formulario de Onboarding (1 semana)
- [ ] Rediseñar sección de métricas
- [ ] Agregar validaciones
- [ ] Preview de score en tiempo real
- [ ] Guardar métricas en BD

### Fase 2: Sistema de Scoring (1 semana)
- [ ] Implementar función de cálculo
- [ ] Determinar NFT level
- [ ] Actualizar VendorProfile con score

### Fase 3: UI/UX (1 semana)
- [ ] Badge de NFT en productos
- [ ] Dashboard de métricas para vendor
- [ ] Recordatorio anual de actualización
- [ ] Página pública de impacto del vendor

### Fase 4: Testing y Refinamiento (1 semana)
- [ ] Test con datos reales
- [ ] Ajustar pesos si es necesario
- [ ] Feedback de vendedores beta

---

## ✅ SISTEMA REGENMARK - RESPUESTAS BASADAS EN DOCUMENTACIÓN

### 🔄 RECONCILIACIÓN: Sistema Propuesto vs Sistema RegenMark

#### Mapeo de Categorías

**Mi Propuesta (7 categorías)** → **Sistema RegenMark (5 RegenMarks + 14 Stamps)**

```
MIS 7 CATEGORÍAS                 REGENMARKS DEL USUARIO
═══════════════════════════════════════════════════════════════
1. Emisiones y Clima (25%)    →  🌍 Carbon Saver (25%)
   - Huella de carbono            - Reducción GHG
   - Reducción de emisiones       - Energía limpia
   - Neutralidad de carbono       - Resiliencia climática

2. Gestión del Agua (15%)     →  💧 Water Guardian (30%)
   - Consumo de agua              - Conservación de agua
   - Ahorro de agua               - Calidad del agua
   - Tratamiento                  - Gestión responsable

3. Energía (20%)              →  [Integrado en Carbon Saver]
   - Energía renovable            - Acceso a energía limpia
   - Autogeneración               - Eficiencia energética

4. Gestión de Residuos (15%)  →  ♻️ Circular Champion (incluido)
   - Reciclaje                    - Gestión de residuos
   - Economía circular            - Economía circular
   - Reducción                    - Uso de recursos

5. Cadena de Suministro (10%) →  [Distribuido entre varios]
   - Proveedores sostenibles      - Cadena de valor ética
   - Sourcing local               - Impacto en comunidades

6. Certificaciones (10%)      →  [Evidencia de soporte]
   - ISO, B Corp, etc.            - Documentación para validación

7. Impacto Social (5%)        →  👥 Human First (30%)
                               →  🐾 Humane Hero (15%)
   - Empleados                    - Calidad de vida
   - Comunidad                    - Seguridad alimentaria
   - Transparencia                - Educación ambiental
                                  - Cruelty-free
                                  - Bienestar animal
```

#### Fórmula de Scoring Ajustada (Sistema RegenMark)

```typescript
REGEN Score (0-100) =
  (Carbon Saver × 0.25) +        // 25% - Emisiones, energía, clima
  (Water Guardian × 0.30) +      // 30% - Agua, conservación
  (Circular Champion × TBD) +    // Incluido en otros
  (Human First × 0.30) +         // 30% - Impacto social, empleados
  (Humane Hero × 0.15)           // 15% - Cruelty-free, animal welfare
```

**Total:** 100%

---

### 📋 RESPUESTAS A LAS 5 PREGUNTAS CLAVE

#### 1️⃣ **¿Qué métricas son obligatorias en el MVP?**

**RESPUESTA:** Según el sistema RegenMark, las métricas se organizan por **evaluación de RegenMark**. Cada RegenMark es una evaluación independiente que cuesta entre $12,500-$37,500 MXN.

**Estrategia para MVP:**

**NIVEL 1 (Obligatorio - Registro Básico):**
```
✅ Información básica de la empresa
✅ Declaración de intención sostenible
✅ Certificaciones existentes (si las tienen)
✅ Documentación básica de prácticas
```

**NIVEL 2 (Opcional - RegenMarks Individuales):**

El vendedor puede solicitar evaluación de **uno o más RegenMarks**:

| RegenMark | Métricas Requeridas | Costo Evaluación | Peso en Score |
|-----------|---------------------|------------------|---------------|
| 🌍 **Carbon Saver** | • Huella de carbono total<br>• % reducción GHG<br>• Energía renovable %<br>• Certificaciones climáticas | $12,500 - $37,500 MXN<br>(15-43 hrs evaluación) | 25% |
| 💧 **Water Guardian** | • Consumo anual agua<br>• % ahorro/reducción<br>• Sistema de reciclaje<br>• Tratamiento aguas residuales | $12,500 - $37,500 MXN | 30% |
| ♻️ **Circular Champion** | • Gestión de residuos<br>• % reciclaje<br>• Economía circular<br>• Uso de recursos | $12,500 - $37,500 MXN | Incluido |
| 👥 **Human First** | • Empleados y condiciones<br>• Impacto comunitario<br>• Educación ambiental<br>• Seguridad alimentaria | $12,500 - $37,500 MXN | 30% |
| 🐾 **Humane Hero** | • Prácticas cruelty-free<br>• Bienestar animal<br>• Certificaciones éticas<br>• Cadena de suministro | $12,500 - $37,500 MXN | 15% |

**IMPLEMENTACIÓN MVP:**

```typescript
// En el onboarding, el vendedor selecciona qué RegenMarks solicitar

PASO 1: Registro básico (gratis)
├─ Perfil verificado ✅
├─ Sin RegenMarks
└─ Score inicial: 0/100

PASO 2: Solicitar evaluación de RegenMarks (pago)
├─ Selecciona: [ ] Carbon Saver
├─           [ ] Water Guardian
├─           [ ] Circular Champion
├─           [ ] Human First
└─           [ ] Humane Hero

PASO 3: Evaluación (15-43 hrs por RegenMark)
├─ Carga documentación
├─ AI + revisión manual
├─ Verificación de datos
└─ Aprobación/Rechazo

PASO 4: Score asignado
└─ Score = Promedio de RegenMarks obtenidos
```

**Recomendación:** En MVP, hacer **voluntario** el proceso de RegenMarks, pero ofrecer **incentivos tangibles**:
- Comisión reducida por cada RegenMark obtenido
- Mayor visibilidad en marketplace
- Badge destacado

---

#### 2️⃣ **¿Cómo validamos los datos?**

**RESPUESTA:** Sistema híbrido de **AI + Validación Manual** según el documento RegenMark:

```
PROCESO DE VALIDACIÓN (3 CAPAS)
═══════════════════════════════════════════════════════════════

CAPA 1: 🤖 VALIDACIÓN AUTOMÁTICA (IA)
├─ OCR + NLP para extraer datos de documentos
├─ Detección de anomalías en métricas
├─ Comparación con benchmarks de industria
├─ Verificación de certificaciones contra bases de datos públicas
└─ Tiempo: Instantáneo

CAPA 2: 👤 REVISIÓN MANUAL (EVALUADOR)
├─ Evaluador experto revisa documentación
├─ Valida cálculos y metodología
├─ Entrevista con empresa (video call)
├─ Inspección física (casos específicos)
└─ Tiempo: 15-43 horas

CAPA 3: 🔍 AUDITORÍA ANUAL
├─ Re-evaluación cada año
├─ Verificación de mejora continua
├─ Penalización por inconsistencias
└─ Renovación de RegenMarks
```

**Documentos Requeridos por RegenMark:**

**Carbon Saver 🌍:**
- [ ] Reporte de huella de carbono (GHG Protocol)
- [ ] Facturas de energía (últimos 12 meses)
- [ ] Certificados de compensación (si aplica)
- [ ] Certificación ISO 14001 o equivalente

**Water Guardian 💧:**
- [ ] Recibos de agua (últimos 12 meses)
- [ ] Evidencia de sistemas de reciclaje/tratamiento
- [ ] Auditoría de uso de agua
- [ ] Fotos/videos de instalaciones

**Circular Champion ♻️:**
- [ ] Registros de gestión de residuos
- [ ] Contratos con centros de reciclaje
- [ ] Evidencia de economía circular (ejemplos)
- [ ] Certificación Zero Waste (si aplica)

**Human First 👥:**
- [ ] Política de salarios y condiciones laborales
- [ ] Programas comunitarios (evidencia)
- [ ] Reporte de sostenibilidad publicado
- [ ] Certificación B Corp o Fair Trade

**Humane Hero 🐾:**
- [ ] Certificaciones cruelty-free (Leaping Bunny, PETA)
- [ ] Auditoría de bienestar animal
- [ ] Política de no testeo animal
- [ ] Certificación de cadena de suministro ética

**Sistema de Puntuación de Evidencia:**

```typescript
CALIDAD DE EVIDENCIA → CONFIABILIDAD DEL SCORE
══════════════════════════════════════════════
Certificación de 3ra parte      → 100% confianza
Auditoría externa verificada    → 90% confianza
Documentos oficiales firmados   → 80% confianza
Auto-reporte con evidencia      → 60% confianza
Declaración sin evidencia       → 30% confianza (no aprobado)
```

**Flags Automáticos de IA (rechazo inmediato):**
- ❌ Métricas que superan límites físicos (ej: 150% energía renovable)
- ❌ Mejoras irreales (ej: 90% reducción de CO₂ en 1 año)
- ❌ Certificaciones que no existen o están vencidas
- ❌ Documentos editados/falsificados (detección de manipulación)
- ❌ Inconsistencias entre documentos (fechas, cifras)

---

#### 3️⃣ **¿Frecuencia de actualización?**

**RESPUESTA:** **Anual obligatoria** con penalización por no actualizar.

```
CICLO DE VIDA DE UN REGENMARK
═══════════════════════════════════════════════════════════════

AÑO 1: EVALUACIÓN INICIAL
├─ Vendor solicita RegenMark
├─ Paga evaluación ($12,500 - $37,500 MXN)
├─ Proceso de 15-43 hrs
└─ ✅ RegenMark otorgado (válido 12 meses)

AÑO 2: RENOVACIÓN
├─ ⚠️ Recordatorio 60 días antes de expiración
├─ ⚠️ Recordatorio 30 días antes
├─ ⚠️ Recordatorio 7 días antes
└─ Opciones:
    ├─ Renovar: Actualizar métricas + re-evaluación (descuento 30%)
    ├─ Renovación simplificada: Si métricas mejoraron (descuento 50%)
    └─ No renovar: RegenMark expira

DESPUÉS DE EXPIRACIÓN:
├─ Día 1-30: Badge cambia a "En renovación" 🔄
├─ Día 31-60: Badge cambia a "Expirado" ⏰
├─ Día 61+: RegenMark removido ❌
└─ Score del vendor se recalcula sin ese RegenMark
```

**Dashboard del Vendor:**

```
═══════════════════════════════════════════════════════════════
🌱 TUS REGENMARKS

🌍 Carbon Saver               [Activo ✅]
   Otorgado: Marzo 2024
   Expira: Marzo 2025
   [🔄 Renovar Ahora]

💧 Water Guardian             [Por expirar ⚠️]
   Otorgado: Enero 2024
   Expira: Enero 2025 (en 15 días)
   [🔄 Renovar Urgente]

♻️ Circular Champion          [Expirado ❌]
   Otorgado: Octubre 2023
   Expiró: Octubre 2024
   [🔄 Re-solicitar Evaluación]
═══════════════════════════════════════════════════════════════
```

**Incentivos para Renovación Temprana:**
- ✅ Renuevas 90 días antes: **50% descuento** + bonus de visibilidad
- ✅ Renuevas 60 días antes: **30% descuento**
- ✅ Renuevas 30 días antes: **15% descuento**
- ❌ Renuevas después de expirar: **costo completo**

---

#### 4️⃣ **¿Penalización por no actualizar?**

**RESPUESTA:** **Penalización progresiva** con impacto en score, visibilidad y comisiones.

```
SISTEMA DE PENALIZACIÓN GRADUAL
═══════════════════════════════════════════════════════════════

FASE 1: RECORDATORIOS (60-30 días antes)
├─ Notificaciones en dashboard
├─ Emails automáticos
├─ Sin penalización
└─ Incentivos para renovar temprano

FASE 2: ADVERTENCIA (30-0 días antes)
├─ Banner en dashboard: "RegenMark por expirar"
├─ Badge en productos: "Renovación pendiente 🔄"
├─ Sin impacto en score (aún)
└─ Comisiones normales

FASE 3: EXPIRACIÓN (0-30 días después)
├─ RegenMark marcado como "Expirado ⏰"
├─ Badge removido de productos
├─ Score recalculado SIN ese RegenMark
├─ Comisión aumenta +2%
└─ Visibilidad reducida -20%

FASE 4: SUSPENSIÓN (30-60 días después)
├─ Todos los RegenMarks suspendidos si no renueva
├─ Score vuelve a 0 (sin RegenMarks activos)
├─ Comisión aumenta +5%
├─ Visibilidad reducida -50%
└─ Productos marcados: "Certificación expirada"

FASE 5: PÉRDIDA COMPLETA (60+ días después)
├─ RegenMarks eliminados (debe re-solicitar completo)
├─ Historial conservado pero score = 0
├─ Comisión estándar 15% (sin beneficios)
├─ Visibilidad normal (sin boost)
└─ Para recuperar: debe pagar evaluación completa
═══════════════════════════════════════════════════════════════
```

**Ejemplo Práctico:**

```typescript
// Vendor tiene 3 RegenMarks activos

ESTADO INICIAL (Todos activos):
├─ Carbon Saver: Activo ✅
├─ Water Guardian: Activo ✅
├─ Human First: Activo ✅
├─ REGEN Score: 78/100 🌳 (Árbol Joven)
├─ Comisión: 10%
└─ Visibilidad: +40%

DESPUÉS DE 30 DÍAS (Water Guardian expiró):
├─ Carbon Saver: Activo ✅
├─ Water Guardian: EXPIRADO ❌
├─ Human First: Activo ✅
├─ REGEN Score: 48/100 🌿 (Brote) ⬇️ bajó
├─ Comisión: 12% (+2%)
└─ Visibilidad: +20% (-20%)

DESPUÉS DE 60 DÍAS (Sin renovar nada):
├─ Todos los RegenMarks: SUSPENDIDOS ❌
├─ REGEN Score: 0/100 🌱 (Semilla Verde)
├─ Comisión: 15% (estándar)
└─ Visibilidad: Normal (sin boost)
```

**Notificaciones Automáticas:**

```
📧 EMAIL TEMPLATE - 60 días antes
═══════════════════════════════════════════════════════════════
Asunto: 💧 Tu RegenMark "Water Guardian" expira pronto

Hola [Vendor],

Tu RegenMark "Water Guardian" expirará el [fecha].

🎁 Renueva ahora y obtén:
   • 50% descuento en evaluación
   • Mantén tu comisión reducida (10%)
   • Conserva tu visibilidad (+40%)

[🔄 Renovar Ahora] [📄 Ver Detalles]

Si no renuevas:
⚠️ Tu score bajará de 78 → 48 puntos
⚠️ Tu comisión aumentará a 12%
⚠️ Perderás el badge en productos
═══════════════════════════════════════════════════════════════
```

---

#### 5️⃣ **¿Mostrar score en productos?**

**RESPUESTA:** **Sistema de 14 Stamps + Badge de Nivel + Tooltips** según documentación RegenMark.

```
SISTEMA DE VISUALIZACIÓN EN PRODUCTOS
═══════════════════════════════════════════════════════════════

NIVEL 1: BADGES DE REGENMARKS (5 tipos)
Cada RegenMark activo muestra un badge:

🌍 Carbon Saver        💧 Water Guardian      ♻️ Circular Champion
👥 Human First         🐾 Humane Hero

NIVEL 2: STAMPS DE IMPACTO (14 categorías)
Stamps específicos basados en datos del vendor:

AMBIENTALES (10 stamps):
✓ Reducción GHG              ✓ Ahorro de energía
✓ Conservación de agua       ✓ Gestión de residuos
✓ Conservación del suelo     ✓ Biodiversidad
✓ Calidad del aire           ✓ Uso de recursos
✓ Economía circular          ✓ Acceso a energía limpia

SOCIALES (4 stamps):
✓ Calidad de vida            ✓ Seguridad alimentaria
✓ Educación ambiental        ✓ Resiliencia climática

NIVEL 3: SCORE GLOBAL (0-100)
Número visible con contexto:

[78/100 🌳] Árbol Joven

NIVEL 4: NIVELES DE NFT (5 niveles)
Verde Claro → Hoja Activa → Eco-Guardia → Estrella Verde → Huella Cero
```

**Diseño en Tarjeta de Producto:**

```
┌─────────────────────────────────────────┐
│  [Imagen del Producto]                  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🌳 Eco-Guardia  │  78/100        │  │ ← Badge + Score
│  └──────────────────────────────────┘  │
│                                         │
│  Panel Solar 300W                       │
│  $5,999 MXN                            │
│                                         │
│  🌍 🌱 💧 ♻️                           │ ← RegenMarks activos
│                                         │
│  Stamps:                                │
│  ✓ Reducción GHG  ✓ Energía limpia    │ ← Stamps de impacto
│  ✓ Carbon neutral  ✓ Economía circular │
│                                         │
│  [Ver Detalles de Impacto →]          │ ← Link a página completa
└─────────────────────────────────────────┘
```

**Modal de Detalles de Impacto (click en badge):**

```
═══════════════════════════════════════════════════════════════
🌳 ECO-GUARDIA - VENDEDOR CERTIFICADO
═══════════════════════════════════════════════════════════════

EcoTech Solutions
REGEN Score: 78/100

REGENMARKS ACTIVOS (3/5):
┌──────────────────────────────────────────────────────────────┐
│ 🌍 Carbon Saver                            [Activo ✅]       │
│    • Reducción de 35% en emisiones GHG                       │
│    • 85% energía renovable                                   │
│    • Carbono neutral certificado                             │
│    Última actualización: Marzo 2024                          │
├──────────────────────────────────────────────────────────────┤
│ 💧 Water Guardian                          [Activo ✅]       │
│    • 40% reducción en consumo de agua                        │
│    • 60% agua reciclada                                      │
│    • Sistema de tratamiento certificado                      │
│    Última actualización: Enero 2024                          │
├──────────────────────────────────────────────────────────────┤
│ 👥 Human First                             [Activo ✅]       │
│    • Salarios justos certificados                            │
│    • 80% empleados locales                                   │
│    • Publica reporte de sostenibilidad                       │
│    Última actualización: Febrero 2024                        │
└──────────────────────────────────────────────────────────────┘

IMPACTO TOTAL DE LA EMPRESA (2024):
• 150 toneladas CO₂ evitadas
• 5,000 m³ de agua ahorrados
• 80% residuos reciclados
• 50 empleos locales generados

[📄 Ver Reporte Completo] [🔍 Verificar Certificaciones]
═══════════════════════════════════════════════════════════════
```

**Página de Filtros del Marketplace:**

```
═══════════════════════════════════════════════════════════════
FILTRAR POR SOSTENIBILIDAD

NIVEL DE CERTIFICACIÓN:
[ ] Verde Claro (0-19)
[✓] Hoja Activa (20-39)
[✓] Eco-Guardia (40-59)
[✓] Estrella Verde (60-79)
[ ] Huella Cero (80-100)

REGENMARKS:
[✓] 🌍 Carbon Saver
[✓] 💧 Water Guardian
[ ] ♻️ Circular Champion
[✓] 👥 Human First
[ ] 🐾 Humane Hero

STAMPS DE IMPACTO:
[✓] Reducción GHG
[✓] Conservación de agua
[ ] Economía circular
[✓] Cruelty-free
[ ] Biodiversidad
... (14 stamps totales)

[🔍 Aplicar Filtros]
═══════════════════════════════════════════════════════════════
```

**Opciones de Visualización:**

**Opción A: Minimalista (Recomendada para MVP)**
```
Producto X
$5,999
🌳 78/100 [?] ← Hover para ver detalles
```

**Opción B: Detallada**
```
Producto X
$5,999
[78/100 🌳 Eco-Guardia]
🌍 💧 👥 ← RegenMarks
✓ Carbon neutral ✓ Agua ahorrada
```

**Opción C: Solo Badges**
```
Producto X
$5,999
🌍 💧 👥 ♻️
[Ver certificaciones →]
```

**RECOMENDACIÓN:** Usar **Opción A en tarjetas** + **Modal detallado al click** para no saturar la UI.

---

## 📚 RECURSOS Y REFERENCIAS

- **GHG Protocol:** https://ghgprotocol.org/
- **GRI Standards:** https://www.globalreporting.org/
- **B Corp Assessment:** https://www.bcorporation.net/
- **ISO 14001:** https://www.iso.org/iso-14001-environmental-management.html
- **Science Based Targets:** https://sciencebasedtargets.org/

---

## 📝 RESUMEN EJECUTIVO - SISTEMA REGENMARK

### 🎯 Modelo de Negocio

**Sistema de Certificación de Pago por RegenMark Individual:**

```
FLUJO DE REVENUE
═══════════════════════════════════════════════════════════════
Vendor se registra (gratis)
    ↓
Solicita evaluación de RegenMarks (de pago)
    ↓
Paga $12,500 - $37,500 MXN por cada RegenMark
    ↓
Proceso de evaluación 15-43 hrs (IA + Manual)
    ↓
RegenMark aprobado → Score actualizado → NFT actualizado
    ↓
Beneficios: Comisión reducida, mayor visibilidad, badges
    ↓
Renovación anual (con descuento si mejoraron métricas)
```

**Ingresos de la Plataforma:**
1. **Comisiones variables** según nivel de NFT (7%-15%)
2. **Evaluaciones de RegenMarks** ($12,500-$37,500 MXN c/u)
3. **Renovaciones anuales** (descuento del 30-50%)
4. **Re-evaluaciones** después de expiración (precio completo)

### 🔑 Diferencias Clave: Propuesta Original vs Sistema RegenMark

| Aspecto | Mi Propuesta Original | Sistema RegenMark (Usuario) |
|---------|----------------------|----------------------------|
| **Categorías** | 7 categorías integradas | 5 RegenMarks independientes |
| **Costo** | Gratuito en onboarding | $12,500-$37,500 MXN por RegenMark |
| **Evaluación** | Automática basada en datos | IA + Evaluador humano (15-43 hrs) |
| **Niveles NFT** | 4 niveles (Semilla→Árbol Maduro) | 5 niveles (Verde Claro→Huella Cero) |
| **Score** | Calculado con fórmula fija | Promedio ponderado de RegenMarks activos |
| **Pesos** | Clima 25%, Agua 15%, Energía 20%... | Agua 30%, Carbon 25%, Social 30%, Cruelty 15% |
| **Validación** | Honor system o admin | 3 capas: IA + Manual + Auditoría anual |
| **Modelo** | Toda la empresa al inicio | Modular: vendor elige qué RegenMarks solicitar |
| **Renovación** | Anual con recordatorios | Anual obligatoria con penalización progresiva |

### ✅ Sistema Híbrido Recomendado para MVP

**FASE 1: Onboarding Básico (Gratis)**
- Registro simple con información de empresa
- Declaración de intención sostenible
- Score inicial: 0/100
- Nivel: Verde Claro 🌱
- Comisión: 15% (estándar)

**FASE 2: Solicitud de RegenMarks (Pago Opcional)**
- Vendor elige qué RegenMarks solicitar (1 a 5)
- Paga por cada evaluación
- Carga documentación requerida
- Evaluación IA + Manual (15-43 hrs)
- Si aprueba: RegenMark otorgado por 12 meses

**FASE 3: Beneficios Progresivos**
```
0 RegenMarks → Verde Claro 🌱 (15% comisión)
1 RegenMark  → Hoja Activa 🍃 (13% comisión, +15% visibilidad)
2 RegenMarks → Eco-Guardia 🛡️ (11% comisión, +30% visibilidad)
3 RegenMarks → Estrella Verde ⭐ (9% comisión, +50% visibilidad)
4-5 RegenMarks → Huella Cero ♻️ (7% comisión, +70% visibilidad)
```

**FASE 4: Mantenimiento y Crecimiento**
- Renovación anual de RegenMarks (con descuento)
- Solicitud de nuevos RegenMarks
- Mejora continua de score
- Evolución del NFT

### 🎨 Visualización en el Marketplace

**En tarjetas de productos:**
```
┌─────────────────────────────┐
│ [Imagen]                    │
│ ⭐🌿 76/100 [i]             │ ← NFT + Score + Tooltip
│ Panel Solar 300W            │
│ $5,999 MXN                 │
│ 🌍 💧 👥                   │ ← RegenMarks activos
└─────────────────────────────┘
```

**En página de producto:**
- Sección completa de impacto
- Modal con detalles de cada RegenMark
- Evidencia verificada (documentos, certificados)
- Timeline de evolución del vendor

**En filtros de búsqueda:**
- Por nivel de NFT (Verde Claro → Huella Cero)
- Por RegenMarks específicos (Carbon Saver, Water Guardian, etc.)
- Por 14 stamps de impacto (Reducción GHG, Economía circular, etc.)

### 💡 Ventajas del Sistema RegenMark

1. **Revenue Stream Claro:** Cobra por evaluaciones ($12k-$37k MXN c/u)
2. **Credibilidad:** Validación profesional vs auto-reporte
3. **Modular:** Vendor elige qué certificar (no todo o nada)
4. **Escalable:** Más RegenMarks = más ingresos recurrentes
5. **Incentivos Alineados:** Vendor recupera inversión con comisión reducida
6. **Diferenciación:** Sistema único vs competencia
7. **Gamificación:** Evolución del NFT motiva mejora continua
8. **Transparencia:** Buyers ven evidencia verificada

### ⚠️ Consideraciones de Implementación

**Desafíos:**
1. **Barrera de entrada alta:** $12k-$37k MXN puede alejar a pequeños vendors
   - **Solución:** Ofrecer plan de pagos o versión básica gratuita

2. **Tiempo de evaluación:** 15-43 hrs retrasa onboarding
   - **Solución:** Permitir vender mientras se evalúa (con badge "En evaluación")

3. **Necesidad de evaluadores:** Requiere equipo de expertos
   - **Solución:** Empezar con IA + admin, outsourcing para escalar

4. **Complejidad técnica:** Sistema de docs, IA, scoring, etc.
   - **Solución:** MVP simplificado, agregar features gradualmente

**Riesgos:**
- Vendors pueden falsificar documentos → IA debe detectar fraudes
- Evaluaciones inconsistentes → Necesita rúbrica estandarizada
- Renovaciones no se hacen → Sistema automático de penalización
- Score subjetivo → Documentar criterios claramente

### 🚀 ROADMAP DE IMPLEMENTACIÓN

#### **SPRINT 1-2: Fundamentos (2 semanas)**
- [ ] Actualizar schema de Prisma (VendorProfile, RegenMark model)
- [ ] Crear tablas para RegenMarks, evaluaciones, documentos
- [ ] Definir enums: tipos de RegenMark, estados, niveles NFT
- [ ] Migrations de base de datos

#### **SPRINT 3-4: Sistema de Solicitud (2 semanas)**
- [ ] Página de solicitud de RegenMarks
- [ ] Formulario de carga de documentos por RegenMark
- [ ] Sistema de pagos (Stripe) para evaluaciones
- [ ] Dashboard de vendor: mis RegenMarks solicitados

#### **SPRINT 5-6: Sistema de Evaluación (2 semanas)**
- [ ] Dashboard de admin: evaluaciones pendientes
- [ ] Interfaz de revisión de documentos
- [ ] Sistema de scoring por RegenMark
- [ ] Aprobación/Rechazo con feedback
- [ ] Notificaciones de resultados

#### **SPRINT 7-8: Cálculo de Score y NFT (2 semanas)**
- [ ] Implementar función de cálculo de REGEN Score
- [ ] Sistema de determinación de nivel de NFT
- [ ] Actualización automática de comisiones
- [ ] Actualización de visibilidad en búsquedas
- [ ] Notificaciones de cambio de nivel

#### **SPRINT 9-10: UI/UX en Marketplace (2 semanas)**
- [ ] Badges de NFT en tarjetas de producto
- [ ] Modal de detalles de impacto
- [ ] Filtros por RegenMarks y stamps
- [ ] Página pública de impacto del vendor
- [ ] Sección "Top Vendors Sostenibles"

#### **SPRINT 11-12: Sistema de Renovación (2 semanas)**
- [ ] Cron job para detectar expiración (60, 30, 7 días)
- [ ] Sistema de notificaciones (email + dashboard)
- [ ] Página de renovación de RegenMarks
- [ ] Descuentos automáticos por renovación temprana
- [ ] Sistema de penalización progresiva

#### **SPRINT 13-14: IA y Validación (2 semanas)**
- [ ] Integración OCR para lectura de documentos
- [ ] NLP para extracción de datos
- [ ] Detección de anomalías
- [ ] Verificación de certificaciones contra APIs públicas
- [ ] Flags automáticos de fraude

#### **SPRINT 15-16: Testing y Refinamiento (2 semanas)**
- [ ] Testing end-to-end del flujo completo
- [ ] Beta con 5-10 vendors reales
- [ ] Ajuste de pesos y scoring
- [ ] Optimización de performance
- [ ] Documentación completa

#### **SPRINT 17-18: Buyer Impact Score (2 semanas)**
- [ ] Sistema de puntos por compra
- [ ] Dashboard de comprador: mi impacto
- [ ] Niveles de buyer (Eco Explorer → Regen Champion)
- [ ] Gamificación y rewards
- [ ] Certificado de impacto descargable

**TOTAL: 36 semanas (~9 meses) para sistema completo**

### 🎯 MVP Simplificado (3 meses)

Si necesitas lanzar más rápido, el **MVP Core** incluye:

**Mes 1:**
- ✅ Base de datos con RegenMarks
- ✅ Formulario de solicitud básico
- ✅ Carga de documentos
- ✅ Sistema de pago

**Mes 2:**
- ✅ Dashboard de admin para evaluar
- ✅ Scoring manual (sin IA)
- ✅ Aprobación/Rechazo
- ✅ Cálculo de REGEN Score y NFT

**Mes 3:**
- ✅ Badges en productos
- ✅ Filtros básicos
- ✅ Página de impacto del vendor
- ✅ Sistema de renovación (sin penalización aún)

**Postponer para Fase 2:**
- ❌ IA / OCR / NLP (evaluar manualmente primero)
- ❌ Buyer Impact Score (enfocarse en vendors)
- ❌ 14 stamps detallados (usar solo 5 RegenMarks)
- ❌ Co-marketing y eventos (cuando haya tracción)

---

## 🎬 PRÓXIMOS PASOS INMEDIATOS

1. **Validar el modelo de negocio:**
   - ¿$12k-$37k MXN es viable para tu mercado objetivo?
   - ¿Tienes vendors dispuestos a pagar por certificación?
   - ¿Cómo se compara con certificaciones existentes?

2. **Definir MVP scope:**
   - ¿Lanzamiento en 3 meses (MVP simple) o 9 meses (completo)?
   - ¿Qué RegenMarks son prioritarios? (Carbon + Water recomendados)
   - ¿Hacer voluntario u obligatorio para vender?

3. **Construir equipo de evaluación:**
   - ¿Quién hará las evaluaciones inicialmente?
   - ¿Necesitas contratar expertos externos?
   - ¿Cómo entrenarlos en el sistema?

4. **Diseñar base de datos:**
   - Actualizar schema de Prisma
   - Crear modelos para RegenMark, Evaluation, Document
   - Definir relaciones y cascadas

5. **Prototipar UI:**
   - Wireframes de página de solicitud
   - Mockups de badges y modales
   - Diseño de dashboard de evaluación

---

**Fecha:** Noviembre 2025
**Versión:** 2.0 - Sistema RegenMark Completo

**Elaborado por:** Claude Code
**Basado en:** Documentación RegenMark del usuario + Análisis de proyecto existente
