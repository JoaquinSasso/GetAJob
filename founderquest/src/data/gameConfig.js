// src/data/gameConfig.js

// Tracks: dos misiones paralelas que coexisten.
// Cada acción y cada contacto pertenece a un track.
// El usuario alterna entre vistas pero comparte XP y nivel
// (la fricción social entrena igual sea para vender o conseguir trabajo).
export const TRACKS = {
	sales: {
		id: "sales",
		label: "VENTAS",
		short: "SALES",
		desc: "Validar y vender MenSso",
		icon: "▲",
		color: "#7cf5a3",
	},
	jobhunt: {
		id: "jobhunt",
		label: "EMPLEO",
		short: "JOB",
		desc: "Búsqueda laboral en LinkedIn",
		icon: "◆",
		color: "#6bb6ff",
	},
};

// Acciones agrupadas por track. La estructura del objeto se mantiene
// igual que antes — solo agregamos el campo `track` para filtrar.
// XP premia el esfuerzo controlable; los resultados externos pesan más
// pero no son la única fuente de progreso.
export const ACTIONS = {
	// ─────── TRACK SALES (las que ya tenías) ───────
	LINKEDIN_MSG: {
		id: "LINKEDIN_MSG",
		label: "Mensaje LinkedIn",
		short: "DM",
		xp: 10,
		icon: "✉",
		desc: "El grind diario",
		track: "sales",
	},
	RECEIVE_NO: {
		id: "RECEIVE_NO",
		label: "Recibir un NO",
		short: "NO",
		xp: 25,
		icon: "✕",
		desc: "Insensibilización al rechazo",
		track: "sales",
		special: "rejection",
	},
	POSITIVE_REPLY: {
		id: "POSITIVE_REPLY",
		label: "Respuesta Positiva",
		short: "SÍ",
		xp: 30,
		icon: "✓",
		desc: "Abrió la puerta",
		track: "sales",
	},
	MEET_15: {
		id: "MEET_15",
		label: "Charla / Meet 15min",
		short: "MEET",
		xp: 50,
		icon: "◉",
		desc: "Salida de zona de confort",
		track: "sales",
	},
	PAIN_FOUND: {
		id: "PAIN_FOUND",
		label: "Identificar 'Dolor' real",
		short: "DOLOR",
		xp: 80,
		icon: "⚑",
		desc: "Valor estratégico",
		track: "sales",
	},
	PITCH_MENSSO: {
		id: "PITCH_MENSSO",
		label: "Presentar MenSso",
		short: "PITCH",
		xp: 100,
		icon: "▲",
		desc: "Hito importante",
		track: "sales",
	},
	CLOSE: {
		id: "CLOSE",
		label: "Cierre / Pasantía / Venta",
		short: "CLOSE",
		xp: 250,
		icon: "★",
		desc: "LEVEL UP inmediato",
		track: "sales",
		special: "close",
	},

	// ─────── TRACK JOBHUNT (nuevas) ───────
	// Acción controlable: aplicaste a una posición concreta.
	// XP medio porque es alta fricción si nunca aplicaste.
	APPLY_JOB: {
		id: "APPLY_JOB",
		label: "Aplicar a posición",
		short: "APPLY",
		xp: 30,
		icon: "↗",
		desc: "Acción controlable",
		track: "jobhunt",
	},

	// Pedir feedback de CV: incomoda pedirlo, pero el riesgo es bajo
	// y aprendés. XP igual que el original que pediste.
	CV_FEEDBACK: {
		id: "CV_FEEDBACK",
		label: "Feedback de CV (Senior)",
		short: "CV",
		xp: 30,
		icon: "❋",
		desc: "Mejora con criterio externo",
		track: "jobhunt",
	},

	// Postear contenido técnico: la fricción social máxima del track.
	// Subido de +30 a +40 porque exponerse en feed > pedir DM privado.
	PUBLISH_LI: {
		id: "PUBLISH_LI",
		label: "Publicar en LinkedIn",
		short: "POST",
		xp: 40,
		icon: "❖",
		desc: "Exposición pública (la más dura)",
		track: "jobhunt",
		special: "exposure",
	},

	// Recibir un NO de búsqueda laboral. Funciona igual que en sales:
	// el rechazo es entrenamiento de piel, no fracaso.
	REJECTION_JOB: {
		id: "REJECTION_JOB",
		label: "NO de empleo",
		short: "NO",
		xp: 25,
		icon: "✕",
		desc: "Otra puerta cerrada, otro NO ganado",
		track: "jobhunt",
		special: "rejection",
	},

	// Conectar con un líder técnico (CTO, tech lead, etc.) en LinkedIn.
	// Más XP que un DM normal porque el target es más relevante y exigente.
	CONNECT_LEADER: {
		id: "CONNECT_LEADER",
		label: "Conectar con líder técnico",
		short: "LEAD",
		xp: 50,
		icon: "⌬",
		desc: "Targeting estratégico",
		track: "jobhunt",
	},

	// Lograr una entrevista técnica: hito grande, no controlable.
	// 150 XP como pediste.
	TECH_INTERVIEW: {
		id: "TECH_INTERVIEW",
		label: "Entrevista técnica",
		short: "TECH",
		xp: 150,
		icon: "◈",
		desc: "Hito mayor",
		track: "jobhunt",
		special: "milestone",
	},

	// Recibir oferta laboral: cierre del pipeline.
	// 250 igual que el CLOSE de sales, mismo peso emocional.
	OFFER_RECEIVED: {
		id: "OFFER_RECEIVED",
		label: "Oferta laboral",
		short: "OFFER",
		xp: 250,
		icon: "★",
		desc: "LEVEL UP inmediato",
		track: "jobhunt",
		special: "close",
	},
};

// Helper para filtrar acciones por track. Lo usan Dashboard y otros componentes.
export function getActionsByTrack(trackId) {
	return Object.values(ACTIONS).filter((a) => a.track === trackId);
}

// Progresión de niveles: la curva original sigue funcionando
// porque combinamos XP de ambos tracks.
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

// ─────── MENSAJES MOTIVADORES ───────
// Agregamos categorías nuevas para los specials de jobhunt.
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
	exposure: [
		"Te expusiste en público. Eso ya es ganar.",
		"El feed no muerde. Tu post sí va a quedar.",
		"Más visible hoy que ayer.",
		"Postear es código deployado de tu marca personal.",
	],
	milestone: [
		"Hito desbloqueado. Llegaste por algo.",
		"Esto es lo que practicabas. Ahora ejecutá.",
		"El esfuerzo de las últimas semanas tomó forma.",
	],
};

export function getMessageFor(actionId) {
	const action = ACTIONS[actionId];
	if (!action) return pick(MESSAGES.social);
	if (action.special === "rejection") return pick(MESSAGES.rejection);
	if (action.special === "close") return pick(MESSAGES.close);
	if (action.special === "exposure") return pick(MESSAGES.exposure);
	if (action.special === "milestone") return pick(MESSAGES.milestone);
	if (actionId === "PAIN_FOUND") return pick(MESSAGES.strategic);
	return pick(MESSAGES.social);
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// ─────── PIPELINE STAGES ───────
// Antes había uno solo. Ahora hay dos, uno por track.
// Mismo modelo de datos en Firestore — el contacto guarda `track` y `stage`.
export const PIPELINE_STAGES_BY_TRACK = {
	sales: [
		{ id: "prospecto", label: "Prospecto", color: "#6b7280" },
		{ id: "contactado", label: "Contactado", color: "#f59e0b" },
		{ id: "conversacion", label: "En Conversación", color: "#3b82f6" },
		{ id: "validado", label: "Validado", color: "#10b981" },
		{ id: "cierre", label: "Cierre", color: "#ef4444" },
	],
	jobhunt: [
		{ id: "prospecto", label: "Prospecto", color: "#6b7280" },
		{ id: "contactado", label: "Contactado", color: "#f59e0b" },
		{ id: "entrevista", label: "Entrevista", color: "#6bb6ff" },
		{ id: "oferta", label: "Oferta", color: "#10b981" },
		{ id: "rechazado", label: "Rechazado", color: "#ef4444" },
	],
};

// Helper para no romper código viejo que importa PIPELINE_STAGES.
// Default al track sales para retrocompatibilidad.
export const PIPELINE_STAGES = PIPELINE_STAGES_BY_TRACK.sales;

// IDs de stage que cuentan como "cerrados positivamente" en cada track.
// Sirve para métricas y para colorear en el UI.
export const POSITIVE_CLOSE_STAGES = {
	sales: ["cierre"],
	jobhunt: ["oferta"],
};

// ─────── WEEKLY CHALLENGES POR TRACK ───────
// Cada track tiene su propio challenge semanal con su propia métrica.
// Si más adelante querés un challenge por usuario configurable,
// el modelo soporta extenderlo (basta con leer este array de Firestore).
export const WEEKLY_CHALLENGES = {
	sales: {
		label: "Cuota de incomodidad",
		desc: "Rechazos esta semana",
		actionId: "RECEIVE_NO",
		goal: 5,
	},
	jobhunt: {
		label: "Cuota de visibilidad",
		desc: "Posts + aplicaciones esta semana",
		// En jobhunt el challenge mide la combinación de exposición + acción:
		// postear y aplicar. No usamos rejection acá porque el ritmo de NOs
		// de empleo es mucho más lento que el de DMs de venta.
		actionIds: ["PUBLISH_LI", "APPLY_JOB"],
		goal: 5,
	},
};
