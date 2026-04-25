// src/components/ConnectionStatus.jsx
import React, { useEffect, useState } from "react";

// Escucha el estado de la red del navegador y muestra un badge discreto
// cuando estás offline. Las escrituras a Firestore siguen funcionando
// (quedan encoladas en IndexedDB) y este componente te avisa que estás
// en ese modo para que no te preocupes si una acción tarda en reflejarse.
export default function ConnectionStatus() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const onOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 2500);
    };
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (online && !justReconnected) return null;

  return (
    <div className={`fq-conn ${online ? "fq-conn--sync" : "fq-conn--off"}`}>
      {online ? (
        <>
          <span className="fq-conn__dot" />
          SINCRONIZANDO
        </>
      ) : (
        <>
          <span className="fq-conn__dot" />
          MODO OFFLINE · Los registros se guardarán al reconectar
        </>
      )}
    </div>
  );
}
