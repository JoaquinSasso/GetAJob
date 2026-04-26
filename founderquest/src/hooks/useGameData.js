// src/hooks/useGameData.js
import { useEffect, useState } from "react";
import {
	collection,
	query,
	orderBy,
	limit,
	onSnapshot,
	addDoc,
	serverTimestamp,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { ACTIONS, getMessageFor } from "../data/gameConfig";

export function useGameData(uid) {
	const [actions, setActions] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!uid) return;

		const actionsRef = query(
			collection(db, "users", uid, "actions"),
			orderBy("createdAt", "desc"),
			limit(100),
		);
		const unsubActions = onSnapshot(actionsRef, (snap) => {
			setActions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
			setLoading(false);
		});

		const contactsRef = query(
			collection(db, "users", uid, "contacts"),
			orderBy("updatedAt", "desc"),
		);
		const unsubContacts = onSnapshot(contactsRef, (snap) => {
			setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
		});

		return () => {
			unsubActions();
			unsubContacts();
		};
	}, [uid]);

	// Totales globales (suma de ambos tracks)
	const totalXp = actions.reduce((sum, a) => sum + (a.xp || 0), 0);

	// Helpers para métricas por track
	const xpByTrack = (trackId) =>
		actions
			.filter(
				(a) => (a.track || resolveTrackFromActionId(a.actionId)) === trackId,
			)
			.reduce((sum, a) => sum + (a.xp || 0), 0);

	const actionsByTrack = (trackId) =>
		actions.filter(
			(a) => (a.track || resolveTrackFromActionId(a.actionId)) === trackId,
		);

	const contactsByTrack = (trackId) =>
		contacts.filter((c) => (c.track || "sales") === trackId);

	const rejectionCount = actions.filter(
		(a) => a.actionId === "RECEIVE_NO" || a.actionId === "REJECTION_JOB",
	).length;

	const closeCount = actions.filter(
		(a) => a.actionId === "CLOSE" || a.actionId === "OFFER_RECEIVED",
	).length;

	// Loguear acción. Ahora persiste el campo `track` para filtrado eficiente.
	const logAction = async (actionId, contactId = null) => {
		const action = ACTIONS[actionId];
		if (!action || !uid) return;
		const message = getMessageFor(actionId);
		await addDoc(collection(db, "users", uid, "actions"), {
			actionId,
			label: action.label,
			xp: action.xp,
			track: action.track || "sales",
			message,
			contactId,
			createdAt: serverTimestamp(),
		});
	};

	// Contacts: cualquier contact nuevo recibe un track explícito.
	// Default a "sales" para retrocompatibilidad con datos viejos.
	const addContact = async (contact) => {
		if (!uid) return;
		const ref = doc(collection(db, "users", uid, "contacts"));
		await setDoc(ref, {
			track: "sales",
			...contact,
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
		});
		return ref.id;
	};

	const updateContact = async (id, updates) => {
		if (!uid) return;
		await updateDoc(doc(db, "users", uid, "contacts", id), {
			...updates,
			updatedAt: serverTimestamp(),
		});
	};

	const deleteContact = async (id) => {
		if (!uid) return;
		await deleteDoc(doc(db, "users", uid, "contacts", id));
	};

	return {
		actions,
		contacts,
		totalXp,
		rejectionCount,
		closeCount,
		loading,
		xpByTrack,
		actionsByTrack,
		contactsByTrack,
		logAction,
		addContact,
		updateContact,
		deleteContact,
	};
}

// Para acciones viejas que se guardaron antes de tener el campo `track`,
// resolvemos el track mirando la definición de la acción.
function resolveTrackFromActionId(actionId) {
	return ACTIONS[actionId]?.track || "sales";
}
