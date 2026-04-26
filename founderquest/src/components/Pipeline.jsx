// src/components/Pipeline.jsx
import React, { useState } from "react";
import { PIPELINE_STAGES_BY_TRACK, TRACKS } from "../data/gameConfig";

export default function Pipeline({
	contacts,
	activeTrack,
	onAdd,
	onUpdate,
	onDelete,
}) {
	const stages = PIPELINE_STAGES_BY_TRACK[activeTrack];
	const trackInfo = TRACKS[activeTrack];

	const [showForm, setShowForm] = useState(false);
	const [filter, setFilter] = useState("all");
	const [editing, setEditing] = useState(null);

	// Resetear filtro cuando cambia el track (los stages cambian)
	React.useEffect(() => {
		setFilter("all");
	}, [activeTrack]);

	const filtered =
		filter === "all" ? contacts : contacts.filter((c) => c.stage === filter);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="fq-section-header">
					<span
						className="fq-section-header__bar"
						style={{
							background: trackInfo.color,
							boxShadow: `0 0 10px ${trackInfo.color}55`,
						}}
					/>
					<span>{activeTrack === "jobhunt" ? "OBJETIVOS" : "ALIADOS"}</span>
					<span className="fq-section-header__hint">
						{contacts.length}{" "}
						{activeTrack === "jobhunt" ? "objetivos" : "contactos"}
					</span>
				</div>
				<button
					onClick={() => setShowForm((s) => !s)}
					className="fq-btn-primary"
					style={{
						background: trackInfo.color,
						boxShadow: `0 0 20px ${trackInfo.color}55`,
					}}
				>
					{showForm ? "✕ CERRAR" : "+ NUEVO"}
				</button>
			</div>

			{showForm && (
				<ContactForm
					stages={stages}
					track={activeTrack}
					onSubmit={async (data) => {
						await onAdd({ ...data, track: activeTrack });
						setShowForm(false);
					}}
				/>
			)}

			<div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
				<Chip
					active={filter === "all"}
					onClick={() => setFilter("all")}
					label={`TODOS · ${contacts.length}`}
				/>
				{stages.map((s) => {
					const count = contacts.filter((c) => c.stage === s.id).length;
					return (
						<Chip
							key={s.id}
							active={filter === s.id}
							onClick={() => setFilter(s.id)}
							label={`${s.label.toUpperCase()} · ${count}`}
							color={s.color}
						/>
					);
				})}
			</div>

			<div className="space-y-3">
				{filtered.length === 0 && (
					<div className="fq-empty">
						<div>— SIN REGISTROS —</div>
						<div className="text-xs mt-2 text-[var(--fq-dim)]">
							{activeTrack === "jobhunt"
								? "Agregá tu primer recruiter o líder técnico para arrancar."
								: "Agregá tu primer aliado para empezar a mover el pipeline."}
						</div>
					</div>
				)}

				{filtered.map((c) => (
					<ContactCard
						key={c.id}
						contact={c}
						stages={stages}
						track={activeTrack}
						isEditing={editing === c.id}
						onEdit={() => setEditing(editing === c.id ? null : c.id)}
						onUpdate={(updates) => {
							onUpdate(c.id, updates);
							setEditing(null);
						}}
						onDelete={() => {
							if (confirm(`¿Eliminar a ${c.name}?`)) onDelete(c.id);
						}}
					/>
				))}
			</div>
		</div>
	);
}

function Chip({ active, onClick, label, color }) {
	return (
		<button
			onClick={onClick}
			className={`fq-chip ${active ? "fq-chip--active" : ""}`}
			style={active && color ? { borderColor: color, color } : {}}
		>
			{label}
		</button>
	);
}

function ContactForm({ stages, track, onSubmit, initial = {} }) {
	const [name, setName] = useState(initial.name || "");
	const [org, setOrg] = useState(initial.org || "");
	const [stage, setStage] = useState(initial.stage || stages[0].id);
	const [note, setNote] = useState(initial.note || "");
	// Campos extra para jobhunt: rol que persigue + url del posting
	const [role, setRole] = useState(initial.role || "");

	const submit = () => {
		if (!name.trim()) return;
		onSubmit({
			name: name.trim(),
			org: org.trim(),
			stage,
			note: note.trim(),
			role: role.trim(),
		});
	};

	const isJob = track === "jobhunt";

	return (
		<div className="fq-panel space-y-3">
			<Input
				label="NOMBRE"
				value={name}
				onChange={setName}
				placeholder={isJob ? "ej. Ana Pérez (Recruiter)" : "ej. Laura Gómez"}
			/>
			<Input
				label={isJob ? "EMPRESA" : "ORGANIZACIÓN"}
				value={org}
				onChange={setOrg}
				placeholder={isJob ? "ej. MercadoLibre" : "ej. UNSJ / TechCo"}
			/>
			{isJob && (
				<Input
					label="ROL / POSICIÓN"
					value={role}
					onChange={setRole}
					placeholder="ej. SSR Backend Developer"
				/>
			)}
			<div>
				<label className="fq-label block mb-2">ESTADO</label>
				<div className="grid grid-cols-2 gap-2">
					{stages.map((s) => (
						<button
							key={s.id}
							type="button"
							onClick={() => setStage(s.id)}
							className={`fq-stage-btn ${stage === s.id ? "fq-stage-btn--active" : ""}`}
							style={
								stage === s.id ? { borderColor: s.color, color: s.color } : {}
							}
						>
							{s.label}
						</button>
					))}
				</div>
			</div>
			<div>
				<label className="fq-label block mb-2">
					{isJob ? "NOTAS / OBSERVACIONES" : "NOTAS / DOLOR"}
				</label>
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder={
						isJob
							? "ej. Stack Node + React. Pide ejemplos de open source…"
							: "ej. Le duele la falta de trazabilidad…"
					}
					rows={3}
					className="fq-input w-full resize-none"
				/>
			</div>
			<button onClick={submit} className="fq-btn-primary w-full">
				GUARDAR
			</button>
		</div>
	);
}

function Input({ label, value, onChange, placeholder }) {
	return (
		<div>
			<label className="fq-label block mb-2">{label}</label>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className="fq-input w-full"
			/>
		</div>
	);
}

function ContactCard({
	contact,
	stages,
	track,
	isEditing,
	onEdit,
	onUpdate,
	onDelete,
}) {
	const stage = stages.find((s) => s.id === contact.stage) || stages[0];

	if (isEditing) {
		return (
			<ContactForm
				stages={stages}
				track={track}
				initial={contact}
				onSubmit={(data) => onUpdate(data)}
			/>
		);
	}

	return (
		<div className="fq-contact" style={{ borderLeftColor: stage.color }}>
			<div className="fq-contact__header">
				<div>
					<div className="fq-contact__name">{contact.name}</div>
					{contact.org && <div className="fq-contact__org">{contact.org}</div>}
					{contact.role && (
						<div className="fq-contact__role">▸ {contact.role}</div>
					)}
				</div>
				<div
					className="fq-contact__stage"
					style={{ color: stage.color, borderColor: stage.color }}
				>
					{stage.label}
				</div>
			</div>

			{contact.note && (
				<div className="fq-contact__note">
					<span className="fq-contact__note-mark">▸</span> {contact.note}
				</div>
			)}

			<div className="fq-contact__actions">
				<button onClick={onEdit} className="fq-btn-ghost">
					EDITAR
				</button>
				<button
					onClick={onDelete}
					className="fq-btn-ghost fq-btn-ghost--danger"
				>
					ELIMINAR
				</button>
			</div>
		</div>
	);
}
