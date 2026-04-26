// src/App.jsx
import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useGameData } from "./hooks/useGameData";
import { useTrack } from "./hooks/useTrack";
import Dashboard from "./components/Dashboard";
import Pipeline from "./components/Pipeline";
import Bitacora from "./components/Bitacora";
import ConnectionStatus from "./components/ConnectionStatus";
import TrackSelector from "./components/TrackSelector";
import "./styles.css";

export default function App() {
	const { user, loading, login, logout } = useAuth();
	const [tab, setTab] = useState("dash");

	if (loading) {
		return (
			<Shell>
				<div className="fq-boot">
					<div className="fq-boot__line">CARGANDO SISTEMA…</div>
				</div>
			</Shell>
		);
	}

	if (!user) {
		return (
			<Shell>
				<div className="fq-login">
					<div className="fq-login__brand">
						<div className="fq-login__logo">◆</div>
						<h1 className="fq-login__title">
							FOUNDER<span>QUEST</span>
						</h1>
						<p className="fq-login__tagline">
							CONVERTÍ LA FRICCIÓN SOCIAL EN XP.
						</p>
					</div>

					<div className="fq-login__creed">
						<p>El código ya está hecho.</p>
						<p>La venta no se compila.</p>
						<p>Se entrena.</p>
					</div>

					<button onClick={login} className="fq-btn-primary fq-btn-primary--lg">
						▸ INICIAR MISIÓN CON GOOGLE
					</button>
				</div>
			</Shell>
		);
	}

	return <GameShell user={user} tab={tab} setTab={setTab} logout={logout} />;
}

function GameShell({ user, tab, setTab, logout }) {
	const data = useGameData(user.uid);
	const [activeTrack, setActiveTrack] = useTrack();

	// Filtramos contactos del track activo para Pipeline
	const trackContacts = data.contactsByTrack(activeTrack);
	// Filtramos acciones para Bitácora
	const trackActions = data.actionsByTrack(activeTrack);

	return (
		<Shell>
			<ConnectionStatus />

			<header className="fq-header">
				<div>
					<div className="fq-label fq-label--dim">OPERADOR</div>
					<div className="fq-header__user">
						{user.displayName || user.email}
					</div>
				</div>
				<button onClick={logout} className="fq-btn-ghost">
					SALIR
				</button>
			</header>

			{/* SELECTOR DE TRACK - persiste entre sesiones */}
			<TrackSelector active={activeTrack} onChange={setActiveTrack} />

			<main className="fq-main">
				{tab === "dash" && (
					<Dashboard
						actions={data.actions}
						totalXp={data.totalXp}
						rejectionCount={data.rejectionCount}
						closeCount={data.closeCount}
						activeTrack={activeTrack}
						xpByTrack={data.xpByTrack}
						actionsByTrack={data.actionsByTrack}
						onLogAction={data.logAction}
					/>
				)}
				{tab === "pipe" && (
					<Pipeline
						contacts={trackContacts}
						activeTrack={activeTrack}
						onAdd={data.addContact}
						onUpdate={data.updateContact}
						onDelete={data.deleteContact}
					/>
				)}
				{tab === "log" && <Bitacora actions={trackActions} />}
			</main>

			<nav className="fq-nav">
				<NavBtn
					active={tab === "dash"}
					onClick={() => setTab("dash")}
					icon="◆"
					label="DASH"
				/>
				<NavBtn
					active={tab === "pipe"}
					onClick={() => setTab("pipe")}
					icon="⚑"
					label="PIPE"
				/>
				<NavBtn
					active={tab === "log"}
					onClick={() => setTab("log")}
					icon="▤"
					label="LOG"
				/>
			</nav>
		</Shell>
	);
}

function NavBtn({ active, onClick, icon, label }) {
	return (
		<button
			onClick={onClick}
			className={`fq-nav__btn ${active ? "fq-nav__btn--active" : ""}`}
		>
			<span className="fq-nav__icon">{icon}</span>
			<span className="fq-nav__label">{label}</span>
		</button>
	);
}

function Shell({ children }) {
	return (
		<div className="fq-root">
			<div className="fq-scanlines" aria-hidden />
			<div className="fq-grain" aria-hidden />
			<div className="fq-container">{children}</div>
		</div>
	);
}
