// src/components/TrackSelector.jsx
import React from "react";
import { TRACKS } from "../data/gameConfig";

// Toggle entre los dos tracks. Diseño tipo "switch de canal" de codec
// para reforzar el aesthetic de consola de misión.
export default function TrackSelector({ active, onChange }) {
	return (
		<div className="fq-track-selector">
			{Object.values(TRACKS).map((t) => (
				<button
					key={t.id}
					onClick={() => onChange(t.id)}
					className={`fq-track-btn ${active === t.id ? "fq-track-btn--active" : ""}`}
					style={
						active === t.id ? { borderColor: t.color, color: t.color } : {}
					}
				>
					<span className="fq-track-btn__icon">{t.icon}</span>
					<span className="fq-track-btn__label">{t.label}</span>
				</button>
			))}
		</div>
	);
}
