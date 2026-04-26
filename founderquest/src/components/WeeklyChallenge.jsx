// src/components/WeeklyChallenge.jsx
import React from "react";
import { WEEKLY_CHALLENGES } from "../data/gameConfig";

function getMondayOfWeek(date) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function daysUntilNextMonday() {
	const now = new Date();
	const monday = getMondayOfWeek(now);
	const nextMonday = new Date(monday);
	nextMonday.setDate(nextMonday.getDate() + 7);
	return Math.ceil((nextMonday - now) / (1000 * 60 * 60 * 24));
}

export default function WeeklyChallenge({ actions, track = "sales" }) {
	const challenge = WEEKLY_CHALLENGES[track];
	if (!challenge) return null;

	// El challenge puede medir una sola acción (sales: rechazos)
	// o varias combinadas (jobhunt: posts + aplicaciones).
	const targetIds = challenge.actionIds || [challenge.actionId];

	const weekStart = getMondayOfWeek(new Date());
	const count = actions.filter((a) => {
		if (!targetIds.includes(a.actionId)) return false;
		if (!a.createdAt) return true;
		const date = a.createdAt.toDate
			? a.createdAt.toDate()
			: new Date(a.createdAt);
		return date >= weekStart;
	}).length;

	const progress = Math.min((count / challenge.goal) * 100, 100);
	const completed = count >= challenge.goal;
	const daysLeft = daysUntilNextMonday();
	const remaining = Math.max(challenge.goal - count, 0);

	let state = "normal";
	if (completed) state = "done";
	else if (daysLeft <= 2 && count < challenge.goal) state = "warning";

	const message = getMessage(state, remaining, daysLeft, track);

	return (
		<section
			className={`fq-challenge fq-challenge--${state} fq-challenge--track-${track}`}
		>
			<div className="fq-challenge__top">
				<div>
					<div className="fq-label">CHALLENGE SEMANAL</div>
					<div className="fq-challenge__title">{challenge.label}</div>
					<div className="fq-challenge__sub">{challenge.desc}</div>
				</div>
				<div className="fq-challenge__count">
					<span className="fq-challenge__count-now">{count}</span>
					<span className="fq-challenge__count-sep">/</span>
					<span className="fq-challenge__count-goal">{challenge.goal}</span>
				</div>
			</div>

			<div className="fq-challenge__bar">
				<div
					className="fq-challenge__bar-fill"
					style={{ width: `${progress}%` }}
				/>
				<div className="fq-challenge__bar-marks">
					{Array.from({ length: challenge.goal - 1 }).map((_, i) => (
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

function getMessage(state, remaining, daysLeft, track) {
	if (state === "done") {
		const wins = {
			sales: [
				"Cuota semanal de rechazos superada.",
				"Esta semana saliste a buscarla.",
				"Piel más gruesa que el lunes pasado.",
			],
			jobhunt: [
				"Cuota de visibilidad cumplida.",
				"Esta semana fuiste imposible de ignorar.",
				"Más expuesto, más oportunidades.",
			],
		};
		return pick(wins[track] || wins.sales);
	}
	if (state === "warning") {
		const action = track === "jobhunt" ? "posteá o aplicá" : "salí a pedirlos";
		return `Faltan ${remaining} y ${daysLeft}d. ${action}.`;
	}
	if (remaining === 1) return "Una sola acción más para cerrar la semana.";
	return `${remaining} acciones para cumplir el objetivo.`;
}

function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
