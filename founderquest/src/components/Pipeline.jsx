// src/components/Pipeline.jsx
import React, { useState } from "react";
import { PIPELINE_STAGES } from "../data/gameConfig";

export default function Pipeline({ contacts, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);

  const filtered =
    filter === "all" ? contacts : contacts.filter((c) => c.stage === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="fq-section-header">
          <span className="fq-section-header__bar" />
          <span>ALIADOS</span>
          <span className="fq-section-header__hint">{contacts.length} objetivos</span>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="fq-btn-primary"
        >
          {showForm ? "✕ CERRAR" : "+ NUEVO"}
        </button>
      </div>

      {showForm && (
        <ContactForm
          onSubmit={async (data) => {
            await onAdd(data);
            setShowForm(false);
          }}
        />
      )}

      {/* Filtros por stage */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <Chip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`TODOS · ${contacts.length}`}
        />
        {PIPELINE_STAGES.map((s) => {
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

      {/* Lista */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="fq-empty">
            <div>— SIN REGISTROS —</div>
            <div className="text-xs mt-2 text-[var(--fq-dim)]">
              Agregá tu primer aliado para empezar a mover el pipeline.
            </div>
          </div>
        )}

        {filtered.map((c) => (
          <ContactCard
            key={c.id}
            contact={c}
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

function ContactForm({ onSubmit, initial = {} }) {
  const [name, setName] = useState(initial.name || "");
  const [org, setOrg] = useState(initial.org || "");
  const [stage, setStage] = useState(initial.stage || "prospecto");
  const [note, setNote] = useState(initial.note || "");

  const submit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), org: org.trim(), stage, note: note.trim() });
  };

  return (
    <div className="fq-panel space-y-3">
      <Input label="NOMBRE" value={name} onChange={setName} placeholder="ej. Laura Gómez" />
      <Input label="ORGANIZACIÓN" value={org} onChange={setOrg} placeholder="ej. UNSJ / TechCo" />
      <div>
        <label className="fq-label block mb-2">ESTADO</label>
        <div className="grid grid-cols-2 gap-2">
          {PIPELINE_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStage(s.id)}
              className={`fq-stage-btn ${stage === s.id ? "fq-stage-btn--active" : ""}`}
              style={stage === s.id ? { borderColor: s.color, color: s.color } : {}}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="fq-label block mb-2">NOTAS / DOLOR</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ej. Le duele la falta de trazabilidad…"
          rows={3}
          className="fq-input w-full resize-none"
        />
      </div>
      <button onClick={submit} className="fq-btn-primary w-full">
        GUARDAR CONTACTO
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

function ContactCard({ contact, isEditing, onEdit, onUpdate, onDelete }) {
  const stage = PIPELINE_STAGES.find((s) => s.id === contact.stage) || PIPELINE_STAGES[0];

  if (isEditing) {
    return (
      <ContactForm
        initial={contact}
        onSubmit={(data) => onUpdate(data)}
      />
    );
  }

  return (
    <div className="fq-contact">
      <div className="fq-contact__header">
        <div>
          <div className="fq-contact__name">{contact.name}</div>
          {contact.org && (
            <div className="fq-contact__org">{contact.org}</div>
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
        <button onClick={onEdit} className="fq-btn-ghost">EDITAR</button>
        <button onClick={onDelete} className="fq-btn-ghost fq-btn-ghost--danger">
          ELIMINAR
        </button>
      </div>
    </div>
  );
}
