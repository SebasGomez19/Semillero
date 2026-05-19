import { useEffect, useRef, useState } from "react";
import { eventsByCategory } from "../data/portfolioData";
import Charts from "./Charts";

// ─── Colores por tipo de evento ────────────────────────────────────
const typeConfig = {
  "Póster": { color: "#29ABE2", bg: "rgba(41,171,226,0.12)", icon: "🖼️" },
  "Capacitación": { color: "#39B54A", bg: "rgba(57,181,74,0.12)", icon: "🎓" },
  "Ponencia": { color: "#F7931E", bg: "rgba(247,147,30,0.12)", icon: "🎤" },
  "Investigación": { color: "#BE63F9", bg: "rgba(190,99,249,0.12)", icon: "🔬" },
  "Codirección": { color: "#F9A63A", bg: "rgba(249,166,58,0.12)", icon: "🎓" },
  "Taller": { color: "#FF6B6B", bg: "rgba(255,107,107,0.12)", icon: "🛠️" },
  "Participación": { color: "#4ECDC4", bg: "rgba(78,205,196,0.12)", icon: "🙋" },
  "Producto": { color: "#F7931E", bg: "rgba(247,147,30,0.12)", icon: "📱" },
};

// ─── Colores por categoría (encabezado de tarjeta) ─────────────────
const categoryConfig = {
  "Póster": { color: "#29ABE2", bg: "rgba(41,171,226,0.12)", icon: "🖼️", label: "Póster" },
  "Capacitaciones": { color: "#39B54A", bg: "rgba(57,181,74,0.12)", icon: "🎓", label: "Capacitaciones" },
  "Participaciones / Ponencias": { color: "#F7931E", bg: "rgba(247,147,30,0.12)", icon: "🎤", label: "Participaciones / Ponencias" },
  "Investigaciones": { color: "#BE63F9", bg: "rgba(190,99,249,0.12)", icon: "🔬", label: "Investigaciones" },
  "Codirección": { color: "#F9A63A", bg: "rgba(249,166,58,0.12)", icon: "📋", label: "Codirección" },
  "Talleres": { color: "#FF6B6B", bg: "rgba(255,107,107,0.12)", icon: "🛠️", label: "Talleres" },
  "Participaciones": { color: "#4ECDC4", bg: "rgba(78,205,196,0.12)", icon: "🙋", label: "Participaciones" },
  "Productos": { color: "#F7931E", bg: "rgba(247,147,30,0.12)", icon: "📱", label: "Productos" },
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

// ─── MediaCarousel ─────────────────────────────────────────────────
function MediaCarousel({ media, onOpenModal, cfg }) {
  const [current, setCurrent] = useState(0);
  const total = media.length;

  const prev = (e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + total) % total); };
  const next = (e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % total); };

  const m = media[current];

  const getYoutubeId = (src) => {
    try {
      const u = new URL(src);
      return u.searchParams.get("v") || u.pathname.split("/").pop();
    } catch { return ""; }
  };

  const getThumbnail = (item) => {
    if (item.type === "youtube") {
      const id = getYoutubeId(item.src);
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }
    if (item.type === "image" || item.type === "poster") return item.src;
    return null;
  };

  const isPlayable = m && m.src && (m.type === "video" || m.type === "youtube" || m.type === "drive");
  const isImage = m && m.src && (m.type === "image" || m.type === "poster");

  return (
    <div>
      <p style={{
        fontSize: 11, textTransform: "uppercase",
        letterSpacing: "0.15em", color: "#475569", marginBottom: 12,
      }}>
        Evidencias
      </p>

      {/* ── Slide principal ── */}
      <div style={{
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        background: "#07152a",
        border: `1px solid ${cfg.color}33`,
      }}>
        {/* Zona clickeable */}
        <div
          onClick={() => m && m.src && onOpenModal(m)}
          style={{ cursor: m && m.src ? "pointer" : "default" }}
        >
          {/* Sin src */}
          {(!m || !m.src) && (
            <div style={{
              height: 200, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <span style={{ fontSize: 32, opacity: 0.3 }}>📎</span>
              <p style={{ fontSize: 12, color: "#334155", textAlign: "center", margin: 0 }}>
                {m?.caption || "Sin contenido"}<br />
                <span style={{ fontSize: 10 }}>pendiente</span>
              </p>
            </div>
          )}

          {/* Imagen / Póster: tamaño natural, sin recorte */}
          {isImage && (
            <img
              src={m.src}
              alt={m.caption}
              style={{
                display: "block",
                width: "100%",
                height: "auto",        // respeta proporción original
                objectFit: "unset",    // sin recorte
              }}
            />
          )}

          {/* Video local */}
          {m && m.src && m.type === "video" && (
            <div style={{ position: "relative", height: 240 }}>
              <video
                src={m.src} muted playsInline
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", opacity: 0.5,
                  pointerEvents: "none",
                }}
              />
              <PlayOverlay color={cfg.color} />
            </div>
          )}

          {/* YouTube */}
          {m && m.src && m.type === "youtube" && (() => {
            const thumb = getThumbnail(m);
            return (
              <div style={{ position: "relative", height: 240 }}>
                {thumb && (
                  <img
                    src={thumb} alt={m.caption}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", opacity: 0.65,
                    }}
                  />
                )}
                <PlayOverlay color={cfg.color} />
              </div>
            );
          })()}

          {/* Google Drive */}
          {m && m.src && m.type === "drive" && (
            <div style={{
              height: 240, display: "flex",
              alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              <PlayOverlay color={cfg.color} />
            </div>
          )}

          {/* Caption superpuesto */}
          {m && m.caption && m.src && (
            <div style={{
              background: "linear-gradient(to top, rgba(7,21,42,0.9) 0%, transparent 100%)",
              padding: "20px 14px 10px",
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{m.caption}</p>
            </div>
          )}
        </div>

        {/* Flechas */}
        {total > 1 && (
          <>
            <button onClick={prev} style={arrowStyle("left", cfg.color)}>‹</button>
            <button onClick={next} style={arrowStyle("right", cfg.color)}>›</button>
          </>
        )}

        {/* Contador */}
        {total > 1 && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(7,21,42,0.82)", borderRadius: 99,
            padding: "3px 10px", fontSize: 11, color: "#94a3b8", zIndex: 10,
            pointerEvents: "none",
          }}>
            {current + 1} / {total}
          </div>
        )}
      </div>

      {/* ── Puntos ── */}
      {total > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 99,
                border: "none",
                cursor: "pointer",
                background: i === current ? cfg.color : "rgba(41,171,226,0.2)",
                transition: "all 0.25s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Miniaturas ── */}
      {total > 1 && (
        <div style={{
          display: "flex", gap: 8, marginTop: 12,
          overflowX: "auto", paddingBottom: 4,
        }}>
          {media.map((item, i) => {
            const thumb = getThumbnail(item);
            const active = i === current;
            return (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  flexShrink: 0,
                  width: 64, height: 48,
                  borderRadius: 8, overflow: "hidden",
                  border: `2px solid ${active ? cfg.color : "rgba(41,171,226,0.15)"}`,
                  background: "#07152a",
                  cursor: "pointer",
                  position: "relative",
                  opacity: active ? 1 : 0.55,
                  transition: "border-color 0.2s, opacity 0.2s",
                }}
              >
                {thumb ? (
                  <img
                    src={thumb} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: 16 }}>
                      {item.type === "video" || item.type === "youtube" || item.type === "drive"
                        ? "▶" : "📄"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Helpers del carrusel ──────────────────────────────────────────
function PlayOverlay({ color }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 2,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: "rgba(7,21,42,0.7)",
        border: `2px solid ${color}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color, fontSize: 22, marginLeft: 4 }}>▶</span>
      </div>
    </div>
  );
}

function arrowStyle(side, color) {
  return {
    position: "absolute",
    [side]: 10,
    top: "50%",
    transform: "translateY(-50%)",
    width: 34, height: 34,
    borderRadius: "50%",
    border: `1px solid ${color}55`,
    background: "rgba(7,21,42,0.85)",
    color,
    cursor: "pointer",
    fontSize: 22,
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 10,
    lineHeight: 1,
  };
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
        `}</style>

        {/* ══ SECCIÓN SUPERIOR: imagen representativa ══ */}
        <div style={{ position: "relative" }}>

          {event.image ? (
            <div style={{ position: "relative" }}>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* Gradiente para legibilidad del texto */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #0d2040 0%, rgba(13,32,64,0.35) 50%, transparent 100%)",
              }} />
            </div>
          ) : (
            <div style={{
              height: 180,
              background: `linear-gradient(135deg, rgba(26,78,159,0.4) 0%, #07152a 60%, ${cfg.bg} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 56, opacity: 0.25 }}>{cfg.icon}</span>
            </div>
          )}

          {/* Handle */}
          <div style={{
            position: "absolute", top: 12, left: 0, right: 0,
            display: "flex", justifyContent: "center",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.3)" }} />
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 14,
              width: 34, height: 34, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(7,21,42,0.7)",
              color: "#fff", cursor: "pointer", fontSize: 20,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(6px)",
            }}
          >×</button>

          {/* Badge + título superpuestos en la parte inferior de la imagen */}
          <div style={{
            position: event.image ? "absolute" : "relative",
            bottom: 0, left: 0, right: 0,
            padding: "0 20px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                background: cfg.bg, color: cfg.color,
                border: `1px solid ${cfg.color}55`,
                backdropFilter: "blur(6px)",
              }}>
                {cfg.icon} {event.type}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                {event.date}
              </span>
            </div>
            <h3 style={{
              fontSize: "clamp(18px,3vw,26px)", fontWeight: 900,
              color: "#fff", margin: 0, lineHeight: 1.2,
              textShadow: "0 2px 14px rgba(0,0,0,0.7)",
            }}>
              {event.title}
            </h3>
          </div>
        </div>

        {/* ══ SECCIÓN INFERIOR: descripción + highlights + carrusel ══ */}
        <div style={{ padding: "20px 20px 40px" }}>

          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 16px" }}>
            {event.description}
          </p>

      

          {event.media && event.media.length > 0 && (
            <MediaCarousel
              media={event.media}
              onOpenModal={setModalItem}
              cfg={cfg}
            />
          )}
        </div>
      </div>
    </>
  );
}

// ─── Tarjeta de categoría ──────────────────────────────────────────
function CategoryCard({ categoryName, events, index, onEventClick }) {
  const [ref, inView] = useInView();
  const cfg = categoryConfig[categoryName] || {
    color: "#29ABE2", bg: "rgba(41,171,226,0.12)", icon: "📌", label: categoryName,
  };

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
            <p style={{ fontSize: 20, fontWeight: 900, color: cfg.color, margin: "12px 0 0", lineHeight: 1.2 }}>
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
            {cfg.icon} {cfg.label}
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((event) => {
              const evCfg = typeConfig[event.type] || { color: "#29ABE2", bg: "rgba(41,171,226,0.12)", icon: "📌" };
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
        <>
          <CategoryCard
            key={categoryName}
            categoryName={categoryName}
            events={events}
            index={index}
            onEventClick={setSelectedEvent}
          />
          {categoryName === "Capacitaciones" && <Charts />}
        </>
      ))}
    </section>
  );
}