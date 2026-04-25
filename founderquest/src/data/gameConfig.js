// src/data/gameConfig.js

// Acciones que el usuario puede loguear. El XP premia el esfuerzo social
// por sobre el resultado: recibir un NO vale casi lo mismo que un SÍ.
export const ACTIONS = {
  LINKEDIN_MSG: {
    id: "LINKEDIN_MSG",
    label: "Mensaje LinkedIn",
    short: "DM",
    xp: 10,
    icon: "✉",
    desc: "El grind diario",
  },
  RECEIVE_NO: {
    id: "RECEIVE_NO",
    label: "Recibir un NO",
    short: "NO",
    xp: 25,
    icon: "✕",
    desc: "Insensibilización al rechazo",
    special: "rejection",
  },
  POSITIVE_REPLY: {
    id: "POSITIVE_REPLY",
    label: "Respuesta Positiva",
    short: "SÍ",
    xp: 30,
    icon: "✓",
    desc: "Abrió la puerta",
  },
  MEET_15: {
    id: "MEET_15",
    label: "Charla / Meet 15min",
    short: "MEET",
    xp: 50,
    icon: "◉",
    desc: "Salida de zona de confort",
  },
  PAIN_FOUND: {
    id: "PAIN_FOUND",
    label: "Identificar 'Dolor' real",
    short: "DOLOR",
    xp: 80,
    icon: "⚑",
    desc: "Valor estratégico",
  },
  PITCH_MENSSO: {
    id: "PITCH_MENSSO",
    label: "Presentar MenSso",
    short: "PITCH",
    xp: 100,
    icon: "▲",
    desc: "Hito importante",
  },
  CLOSE: {
    id: "CLOSE",
    label: "Cierre / Pasantía / Venta",
    short: "CLOSE",
    xp: 250,
    icon: "★",
    desc: "LEVEL UP inmediato",
    special: "close",
  },
};

// Progresión de niveles: curva suave al inicio, exigente después.
// XP acumulado requerido para alcanzar cada nivel.
export const LEVELS = [
  { level: 1, xp: 0, title: "Recluta" },
  { level: 2, xp: 100, title: "Explorador" },
  { level: 3, xp: 250, title: "Mensajero" },
  { level: 4, xp: 500, title: "Cazador" },
  { level: 5, xp: 900, title: "Negociador" },
  { level: 6, xp: 1400, title: "Estratega" },
  { level: 7, xp: 2100, title: "Operador" },
  { level: 8, xp: 3000, title: "Vendedor" },
  { level: 9, xp: 4200, title: "Closer" },
  { level: 10, xp: 5800, title: "Founder" },
  { level: 11, xp: 8000, title: "Rainmaker" },
  { level: 12, xp: 11000, title: "Leyenda" },
];

export function getLevelInfo(totalXp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].xp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const xpInLevel = totalXp - current.xp;
  const xpForNext = next ? next.xp - current.xp : 0;
  const progress = next ? (xpInLevel / xpForNext) * 100 : 100;
  return { current, next, xpInLevel, xpForNext, progress };
}

// Mensajes motivadores. Se muestran aleatoriamente en la bitácora
// y al loguear una acción. Agrupados por tipo para que el tono cuadre.
export const MESSAGES = {
  rejection: [
    "Ese NO te acerca al SÍ.",
    "Cada rechazo es data, no una derrota.",
    "La piel se endurece. Seguí.",
    "Felicitaciones: probaste algo real.",
    "Los NO son peajes del camino. Pagá y avanzá.",
    "Mejor un NO hoy que un 'quizás' eterno.",
  ],
  close: [
    "LEVEL UP. Esto es lo que entrenabas.",
    "Validación real. No lo minimices.",
    "El código no hizo esto. Vos sí.",
    "Esto vale más que 10 commits perfectos.",
  ],
  social: [
    "Nivel de carisma aumentando.",
    "La Maldición del Constructor retrocede un paso.",
    "Hablar cuesta menos la segunda vez.",
    "El compilador no da estos bugs. La gente sí. Bien.",
    "Un mensaje enviado > un producto perfecto sin usuarios.",
  ],
  strategic: [
    "Capturaste oro: un dolor real.",
    "Esto es lo que diferencia a un técnico de un founder.",
    "El mercado te está hablando. Escuchalo.",
  ],
};

export function getMessageFor(actionId) {
  const action = ACTIONS[actionId];
  if (!action) return pick(MESSAGES.social);
  if (action.special === "rejection") return pick(MESSAGES.rejection);
  if (action.special === "close") return pick(MESSAGES.close);
  if (actionId === "PAIN_FOUND") return pick(MESSAGES.strategic);
  return pick(MESSAGES.social);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Estados del pipeline de contactos (aliados)
export const PIPELINE_STAGES = [
  { id: "prospecto", label: "Prospecto", color: "#6b7280" },
  { id: "contactado", label: "Contactado", color: "#f59e0b" },
  { id: "conversacion", label: "En Conversación", color: "#3b82f6" },
  { id: "validado", label: "Validado", color: "#10b981" },
  { id: "cierre", label: "Cierre", color: "#ef4444" },
];
