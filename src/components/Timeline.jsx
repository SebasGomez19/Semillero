import { useEffect, useRef, useState } from "react";
import { eventsByCategory } from "../data/portfolioData";

// ─── Colores por tipo de evento ────────────────────────────────────
const typeConfig = {
  "Capacitación": { color: "#29ABE2", bg: "rgba(41,171,226,0.12)", icon: "🎓" },
  "Ponencia":     { color: "#39B54A", bg: "rgba(57,181,74,0.12)",  icon: "🎤" },
  "Producto":     { color: "#F7931E", bg: "rgba(247,147,30,0.12)", icon: "📱" },
  "Investigación":{ color: "#BE63F9", bg: "rgba(190,99,249,0.12)", icon: "🔬" },
};

// Configuración visual de cada categoría (encabezado de la tarjeta)
const categoryConfig = {
  "Productos":     { color: "#F7931E", bg: "rgba(247,147,30,0.12)",  icon: "📱", label: "Producto" },
  "Capacitaciones":{ color: "#29ABE2", bg: "rgba(41,171,226,0.12)",  icon: "🎓", label: "Capacitación" },
  "Ponencias":     { color: "#39B54A", bg: "rgba(57,181,74,0.12)",   icon: "🎤", label: "Ponencia" },
  "Investigación": { color: "#BE63F9", bg: "rgba(190,99,249,0.12)",  icon: "🔬", label: "Investigación" },
};

// ─── Hook de animación por scroll ─────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Modal ─────────────────────────────────────────────────────────
function Modal({ m, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", width: "100%", maxWidth: 900,
          borderRadius: 20, overflow: "hidden", background: "#000",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 20,
            width: 36, height: 36, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.7)", color: "#fff",
            cursor: "pointer", fontSize: 20, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >×</button>

        {m.type === "video" && (
          <video
            src={m.src} controls autoPlay playsInline
            style={{ width: "100%", maxHeight: "85vh", display: "block", background: "#000" }}
          />
        )}
        {m.type === "youtube" && (
          <iframe
            src={`https://www.youtube.com/embed/${(() => {
              try { const u = new URL(m.src); return u.searchParams.get("v") || u.pathname.split("/").pop(); }
              catch { return ""; }
            })()}?autoplay=1&rel=0`}
            title={m.caption}
            style={{ width: "100%", height: "70vh", border: "none" }}
            allow="autoplay; fullscreen" allowFullScreen
          />
        )}
        {m.type === "drive" && (
          <iframe
            src={`https://drive.google.com/file/d/${m.src}/preview`}
            title={m.caption}
            style={{ width: "100%", height: "70vh", border: "none" }}
            allow="autoplay" allowFullScreen
          />
        )}
        {(m.type === "image" || m.type === "poster") && (
          <img src={m.src} alt={m.caption}
            style={{ width: "100%", maxHeight: "85vh", objectFit: "contain", display: "block" }} />
        )}

        {m.caption && (
          <div style={{ padding: "10px 16px", background: "#0d2040" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>{m.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Drawer ────────────────────────────────────────────────────────
function Drawer({ event, onClose }) {
  const [modalItem, setModalItem] = useState(null);
  const cfg = typeConfig[event.type] || typeConfig["Capacitación"];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (modalItem) setModalItem(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, modalItem]);

  return (
    <>
      {modalItem && <Modal m={modalItem} onClose={() => setModalItem(null)} />}

      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: "#0d2040",
        borderRadius: "24px 24px 0 0",
        border: "1px solid rgba(41,171,226,0.25)",
        borderBottom: "none",
        maxHeight: "85vh",
        overflowY: "auto",
        animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0);    opacity: 1; }
          }
          .drawer-media-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
          @media (min-width: 640px) { .drawer-media-grid { grid-template-columns: 1fr 1fr; } }
        `}</style>

        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
        </div>

        <div style={{ padding: "16px 24px 40px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{
                  padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                  background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`,
                }}>
                  {cfg.icon} {event.type}
                </span>
                <span style={{ fontSize: 12, color: "#475569" }}>{event.date}</span>
              </div>
              <h3 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                {event.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                flexShrink: 0, marginLeft: 16, width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(41,171,226,0.3)", background: "rgba(7,21,42,0.8)",
                color: "#29ABE2", cursor: "pointer", fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >×</button>
          </div>

          {event.image && (
            <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, maxHeight: 280 }}>
              <img src={event.image} alt={event.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 20px" }}>
            {event.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {event.highlights.map((h) => (
              <span key={h} style={{
                padding: "5px 14px", borderRadius: 99, fontSize: 13,
                border: `1px solid ${cfg.color}44`, background: cfg.bg, color: cfg.color,
              }}>{h}</span>
            ))}
          </div>

          {event.media && event.media.length > 0 && (
            <>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 12 }}>
                Evidencias
              </p>
              <div className="drawer-media-grid">
                {event.media.map((m, i) => (
                  <MediaThumb key={i} m={m} onOpenModal={setModalItem} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MediaThumb ────────────────────────────────────────────────────
function MediaThumb({ m, onOpenModal }) {
  const base = {
    height: 160, borderRadius: 14, overflow: "hidden",
    border: m.src ? "1px solid rgba(41,171,226,0.2)" : "1px dashed rgba(41,171,226,0.15)",
    background: "#07152a", display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  };

  if (!m.src) return (
    <div style={base}>
      <p style={{ fontSize: 12, color: "#334155", textAlign: "center", padding: "0 16px" }}>
        {m.caption}<br /><span style={{ fontSize: 10 }}>pendiente</span>
      </p>
    </div>
  );

  return (
    <div style={{ ...base, cursor: "pointer" }} onClick={() => onOpenModal(m)}>
      {m.type === "video" && (
        <video src={m.src} muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, pointerEvents: "none" }} />
      )}
      {m.type === "youtube" && (() => {
        let videoId = "";
        try { const u = new URL(m.src); videoId = u.searchParams.get("v") || u.pathname.split("/").pop(); } catch { }
        return <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt={m.caption}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />;
      })()}
      {(m.type === "image" || m.type === "poster") && (
        <img src={m.src} alt={m.caption}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}

      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(41,171,226,0.25)", border: "2px solid #29ABE2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#29ABE2", fontSize: 18, marginLeft: m.type === "image" ? 0 : 3 }}>
            {(m.type === "image" || m.type === "poster") ? "⤢" : "▶"}
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)", padding: "8px 10px 6px" }}>
        <p style={{ fontSize: 11, color: "#fff", margin: 0 }}>{m.caption}</p>
      </div>
    </div>
  );
}

// ─── Tarjeta de categoría ──────────────────────────────────────────
function CategoryCard({ categoryName, events, index, onEventClick }) {
  const [ref, inView] = useInView();
  const cfg = categoryConfig[categoryName] || categoryConfig["Capacitaciones"];

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(30px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        borderRadius: 28,
        border: "1px solid rgba(41,171,226,0.2)",
        background: "#0d2040",
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          .cat-card-${index} { grid-template-columns: 0.55fr 1.45fr !important; align-items: center; }
        }
      `}</style>

      <div
        className={`cat-card-${index}`}
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, padding: 24 }}
      >
        {/* Visual de la categoría */}
        <div style={{
          position: "relative", minHeight: 220, borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "linear-gradient(135deg, rgba(26,78,159,0.4) 0%, #07152a 50%, rgba(41,171,226,0.1) 100%)",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            borderRadius: 20, border: `1px solid ${cfg.color}33`,
            background: cfg.bg, padding: "32px 44px",
            textAlign: "center", backdropFilter: "blur(8px)",
          }}>
            <p style={{ fontSize: 64, margin: 0, lineHeight: 1 }}>{cfg.icon}</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: cfg.color, margin: "12px 0 0", lineHeight: 1.1 }}>
              {categoryName}
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8, marginBottom: 0 }}>
              {events.length} {events.length === 1 ? "actividad" : "actividades"}
            </p>
          </div>
        </div>

        {/* Lista de eventos */}
        <div>
          <span style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
            border: `1px solid ${cfg.color}44`, background: cfg.bg,
            color: cfg.color, marginBottom: 20,
          }}>
            {cfg.icon} {categoryName}
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((event) => {
              const evCfg = typeConfig[event.type] || typeConfig["Capacitación"];
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  style={{
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "9px 14px", borderRadius: 12,
                    border: `1px solid ${evCfg.color}22`,
                    background: "rgba(7,21,42,0.5)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${evCfg.color}55`;
                    e.currentTarget.style.background = evCfg.bg;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = `1px solid ${evCfg.color}22`;
                    e.currentTarget.style.background = "rgba(7,21,42,0.5)";
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{evCfg.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: evCfg.color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 2px" }}>
                      {event.date}
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0, lineHeight: 1.3 }}>
                      {event.title}
                    </p>
                  </div>
                  <span style={{ color: "#334155", fontSize: 18, flexShrink: 0 }}>›</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────
export default function Timeline() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <section id="recorrido" style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px" }}>

      {selectedEvent && (
        <Drawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      <div style={{ marginBottom: 40 }}>
        <span style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600,
          border: "1px solid rgba(41,171,226,0.3)", background: "rgba(41,171,226,0.1)",
          color: "#29ABE2", marginBottom: 12,
        }}>
          Lo que hicimos
        </span>
        <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 900, color: "#fff", margin: "0 0 12px", textShadow: "0 0 18px rgba(41,171,226,0.45)" }}>
          Lo que se vivió en el semillero
        </h2>
        <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 600, margin: 0 }}>
          Una trayectoria de investigación, enseñanza, esfuerzo y desarrollo tecnológico.
        </p>
      </div>

      {Object.entries(eventsByCategory).map(([categoryName, events], index) => (
        <CategoryCard
          key={categoryName}
          categoryName={categoryName}
          events={events}
          index={index}
          onEventClick={setSelectedEvent}
        />
      ))}

    </section>
  );
}