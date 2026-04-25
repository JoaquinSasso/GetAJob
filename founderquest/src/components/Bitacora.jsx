// src/components/Bitacora.jsx
import React from "react";
import { ACTIONS } from "../data/gameConfig";

export default function Bitacora({ actions }) {
  const last = actions.slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="fq-section-header">
        <span className="fq-section-header__bar" />
        <span>BITÁCORA</span>
        <span className="fq-section-header__hint">últimas 10 entradas</span>
      </div>

      {last.length === 0 && (
        <div className="fq-empty">
          <div>— TRANSMISIÓN EN SILENCIO —</div>
          <div className="text-xs mt-2 text-[var(--fq-dim)]">
            Logueá tu primera acción desde el Dashboard.
          </div>
        </div>
      )}

      <div className="space-y-2">
        {last.map((a, i) => (
          <Entry key={a.id} action={a} index={i} />
        ))}
      </div>
    </div>
  );
}

function Entry({ action, index }) {
  const actionDef = ACTIONS[action.actionId];
  const icon = actionDef?.icon || "•";
  const special = actionDef?.special;

  const date = action.createdAt?.toDate
    ? action.createdAt.toDate()
    : new Date();
  const time = date.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className={`fq-log ${special ? `fq-log--${special}` : ""}`}>
      <div className="fq-log__timeline">
        <div className="fq-log__icon">{icon}</div>
        {index < 9 && <div className="fq-log__line" />}
      </div>
      <div className="fq-log__body">
        <div className="fq-log__meta">
          <span className="fq-log__time">{day} · {time}</span>
          <span className="fq-log__xp">+{action.xp} XP</span>
        </div>
        <div className="fq-log__label">{action.label}</div>
        {action.message && (
          <div className="fq-log__message">“{action.message}”</div>
        )}
      </div>
    </div>
  );
}
