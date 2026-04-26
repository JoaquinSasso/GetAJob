// src/components/Dashboard.jsx
import React, { useState } from "react";
import {
	ACTIONS,
	TRACKS,
	getActionsByTrack,
	getLevelInfo,
} from "../data/gameConfig";
import WeeklyChallenge from "./WeeklyChallenge";

export default function Dashboard({
	actions,
	totalXp,
	rejectionCount,
	closeCount,
	activeTrack,
	xpByTrack,
	actionsByTrack,
	onLogAction,
}) {
	const { current, next, xpInLevel, xpForNext, progress } =
		getLevelInfo(totalXp);
	const [flash, setFlash] = useState(null);

	const trackInfo = TRACKS[activeTrack];
	const trackActions = getActionsByTrack(activeTrack);
	const trackXp = xpByTrack(activeTrack);
	const trackActionsList = actionsByTrack(activeTrack);

	const handleClick = (actionId) => {
		onLogAction(actionId);
		setFlash(actionId);
		setTimeout(() => setFlash(null), 450);
		if (navigator.vibrate) navigator.vibrate(20);
	};

	return (
		<div className="space-y-5">
			{/* HEADER DE ESTADO (rango global, suma de ambos tracks) */}
			<section className="fq-panel">
				<div className="flex items-center justify-between mb-3">
					<div className="fq-label">RANGO ACTUAL</div>
					<div className="fq-label fq-label--dim">
						ID · {current.level.toString().padStart(2, "0")}
					</div>
				</div>

				<div className="flex items-baseline gap-3 mb-4">
					<div className="fq-title">{current.title}</div>
					<div className="fq-xp-badge">LVL {current.level}</div>
				</div>

				<div className="fq-xpbar">
					<div
						className="fq-xpbar__fill"
						style={{ width: `${Math.min(progress, 100)}%` }}
					/>
					<div className="fq-xpbar__grid" />
				</div>

				<div className="flex items-center justify-between mt-2 text-xs font-mono tracking-wider">
					<span className="text-[var(--fq-accent)]">
						{xpInLevel} / {xpForNext || "MAX"} XP
					</span>
					<span className="text-[var(--fq-dim)]">
						{next ? `→ ${next.title}` : "RANGO MÁXIMO"}
					</span>
				</div>
			</section>

			{/* CHALLENGE SEMANAL - cambia según track activo */}
			<WeeklyChallenge actions={trackActionsList} track={activeTrack} />

			{/* MÉTRICAS DEL TRACK ACTIVO */}
			<section className="grid grid-cols-3 gap-3">
				<StatCard
					label={`XP ${trackInfo.short}`}
					value={trackXp}
					color={trackInfo.color}
				/>
				<StatCard label="RECHAZOS" value={rejectionCount} rejectionBadge />
				<StatCard label="CIERRES" value={closeCount} gold />
			</section>

			{/* BOTONES DE ACCIÓN DEL TRACK ACTIVO */}
			<section>
				<div className="fq-section-header">
					<span className="fq-section-header__bar" />
					<span>LOG DE ACCIÓN · {trackInfo.label}</span>
					<span className="fq-section-header__hint">tocá para registrar</span>
				</div>

				<div className="grid grid-cols-2 gap-3 mt-3">
					{trackActions.map((a) => (
						<button
							key={a.id}
							onClick={() => handleClick(a.id)}
							className={`fq-action ${a.special ? `fq-action--${a.special}` : ""} ${
								flash === a.id ? "fq-action--flash" : ""
							}`}
						>
							<div className="flex items-start justify-between">
								<span className="fq-action__icon">{a.icon}</span>
								<span className="fq-action__xp">+{a.xp}</span>
							</div>
							<div className="fq-action__label">{a.label}</div>
							<div className="fq-action__desc">{a.desc}</div>
						</button>
					))}
				</div>
			</section>
		</div>
	);
}

function StatCard({ label, value, color, rejectionBadge, gold }) {
	const style = color ? { color } : {};
	return (
		<div
			className={`fq-stat ${color ? "fq-stat--accent" : ""} ${
				rejectionBadge ? "fq-stat--rejection" : ""
			} ${gold ? "fq-stat--gold" : ""}`}
		>
			<div
				className="fq-stat__value"
				style={color ? { color, textShadow: `0 0 14px ${color}55` } : {}}
			>
				{value}
			</div>
			<div className="fq-stat__label" style={style}>
				{label}
			</div>
		</div>
	);
}
