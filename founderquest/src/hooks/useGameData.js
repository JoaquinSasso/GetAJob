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

// Toda la data del usuario vive bajo users/{uid}/... para que las
// reglas de seguridad sean simples y robustas.
export function useGameData(uid) {
  const [actions, setActions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const actionsRef = query(
      collection(db, "users", uid, "actions"),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const unsubActions = onSnapshot(actionsRef, (snap) => {
      setActions(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      setLoading(false);
    });

    const contactsRef = query(
      collection(db, "users", uid, "contacts"),
      orderBy("updatedAt", "desc")
    );
    const unsubContacts = onSnapshot(contactsRef, (snap) => {
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubActions();
      unsubContacts();
    };
  }, [uid]);

  // Totales derivados
  const totalXp = actions.reduce((sum, a) => sum + (a.xp || 0), 0);
  const rejectionCount = actions.filter((a) => a.actionId === "RECEIVE_NO").length;
  const closeCount = actions.filter((a) => a.actionId === "CLOSE").length;

  const logAction = async (actionId, contactId = null) => {
    const action = ACTIONS[actionId];
    if (!action || !uid) return;
    const message = getMessageFor(actionId);
    await addDoc(collection(db, "users", uid, "actions"), {
      actionId,
      label: action.label,
      xp: action.xp,
      message,
      contactId,
      createdAt: serverTimestamp(),
    });
  };

  const addContact = async (contact) => {
    if (!uid) return;
    const ref = doc(collection(db, "users", uid, "contacts"));
    await setDoc(ref, {
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
    logAction,
    addContact,
    updateContact,
    deleteContact,
  };
}
