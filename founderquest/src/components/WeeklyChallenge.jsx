// src/components/WeeklyChallenge.jsx
import React from "react";

const WEEKLY_GOAL = 5;

// Devuelve el lunes 00:00 de la semana de una fecha dada (hora local).
// Usamos lunes como inicio de semana porque es el patrón más natural
// para "arrancar la semana fuerte".
function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo, 1 = lunes...
  const diff = day === 0 ? -6 : 1 - day; // si es domingo, retroceder 6 días
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Días hasta el próximo lunes (para el countdown)
function daysUntilNextMonday() {
  const now = new Date();
  const monday = getMondayOfWeek(now);
  const nextMonday = new Date(monday);
  nextMonday.setDate(nextMonday.getDate() + 7);
  const ms = nextMonday - now;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export default function WeeklyChallenge({ actions }) {
  const weekStart = getMondayOfWeek(new Date());

  // Filtrar solo los NOs de esta semana. Si createdAt todavía no se
  // resolvió en Firestore (serverTimestamp pendiente), lo contamos como
  // "de esta semana" para no hacer parpadear el contador.
  const rejectionsThisWeek = actions.filter((a) => {
    if (a.actionId !== "RECEIVE_NO") return false;
    if (!a.createdAt) return true;
    const date = a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    return date >= weekStart;
  }).length;

  const progress = Math.min((rejectionsThisWeek / WEEKLY_GOAL) * 100, 100);
  const completed = rejectionsThisWeek >= WEEKLY_GOAL;
  const daysLeft = daysUntilNextMonday();
  const remaining = Math.max(WEEKLY_GOAL - rejectionsThisWeek, 0);

  // Estado del challenge según progreso y días restantes.
  // Define el tono de los mensajes y el color de la barra.
  let state = "normal";
  if (completed) state = "done";
  else if (daysLeft <= 2 && rejectionsThisWeek < WEEKLY_GOAL) state = "warning";

  const message = getMessage(state, remaining, daysLeft);

  return (
    <section className={`fq-challenge fq-challenge--${state}`}>
      <div className="fq-challenge__top">
        <div>
          <div className="fq-label">CHALLENGE SEMANAL</div>
          <div className="fq-challenge__title">Cuota de incomodidad</div>
        </div>
        <div className="fq-challenge__count">
          <span className="fq-challenge__count-now">{rejectionsThisWeek}</span>
          <span className="fq-challenge__count-sep">/</span>
          <span className="fq-challenge__count-goal">{WEEKLY_GOAL}</span>
        </div>
      </div>

      <div className="fq-challenge__bar">
        <div
          className="fq-challenge__bar-fill"
          style={{ width: `${progress}%` }}
        />
        {/* Marcadores verticales, uno por cada NO de la meta */}
        <div className="fq-challenge__bar-marks">
          {Array.from({ length: WEEKLY_GOAL - 1 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>

      <div className="fq-challenge__footer">
        <span className="fq-challenge__message">{message}</span>
        <span className="fq-challenge__timer">
          {completed ? "✓ CUMPLIDO" : `${daysLeft}d restantes`}
        </span>
      </div>
    </section>
  );
}

function getMessage(state, remaining, daysLeft) {
  if (state === "done") {
    const wins = [
      "Cuota semanal de rechazos superada.",
      "Esta semana saliste a buscarla.",
      "Piel más gruesa que el lunes pasado.",
    ];
    return wins[Math.floor(Math.random() * wins.length)];
  }
  if (state === "warning") {
    return `Faltan ${remaining} NOs y ${daysLeft}d. Salí a pedirlos.`;
  }
  if (remaining === 1) return "Un solo NO más para cerrar la semana.";
  return `${remaining} NOs para cumplir el objetivo.`;
}
