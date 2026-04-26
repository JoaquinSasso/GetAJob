// src/hooks/useTrack.js
import { useEffect, useState } from "react";

// El track activo se guarda en localStorage para que persista entre
// sesiones. No vale la pena guardarlo en Firestore: es preferencia
// de UI, no dato del juego.
const STORAGE_KEY = "fq_active_track";

export function useTrack() {
	const [track, setTrack] = useState(() => {
		try {
			return localStorage.getItem(STORAGE_KEY) || "sales";
		} catch {
			return "sales";
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, track);
		} catch {
			/* ignorar errores de cuota o modo privado */
		}
	}, [track]);

	return [track, setTrack];
}
