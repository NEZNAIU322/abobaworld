import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

type ThemeMode = "dark" | "light";

type Plan = {
  id: number;
  name: string;
  period: string;
  price: number;
  accent: string;
  border: string;
  glow: string;
  badge: string;
  vibe: string;
  label: string;
  description: string;
  highlights: string[];
};

type PaymentMethod = "card" | "sbp" | "crypto";

const boosterPlans: Plan[] = [
  {
    id: 1,
    name: "БУСТЕР START",
    period: "7 дней",
    price: 69,
    accent: "linear-gradient(135deg, rgba(251,191,36,.50), rgba(249,115,22,.18))",
    border: "rgba(251,191,36,.38)",
    glow: "0 0 35px rgba(251,191,36,.16)",
    badge: "Старт",
    vibe: "Быстрый вход",
    label: "ДЛЯ НОВИЧКОВ",
    description: "Лёгкий старт для знакомства с возможностями БУСТЕРА.",
    highlights: [
      "Доступ к основным возможностям БУСТЕРА",
      "Идеально, чтобы попробовать подписку",
      "Хороший вариант для первого доната",
    ],
  },
  {
    id: 2,
    name: "БУСТЕР PLUS",
    period: "30 дней",
    price: 199,
    accent: "linear-gradient(135deg, rgba(217,70,239,.45), rgba(124,58,237,.18))",
    border: "rgba(217,70,239,.35)",
    glow: "0 0 38px rgba(217,70,239,.18)",
    badge: "Популярно",
    vibe: "Самый выгодный месяц",
    label: "РЕКОМЕНДУЕМ",
    description: "Оптимальный выбор для активной игры и красивого статуса на сервере.",
    highlights: [
      "Лучший баланс цены и длительности",
      "Подходит для активной игры на сервере",
      "Самый частый выбор игроков",
    ],
  },
  {
    id: 3,
    name: "БУСТЕР ULTRA",
    period: "Навсегда",
    price: 499,
    accent: "linear-gradient(135deg, rgba(16,185,129,.40), rgba(6,182,212,.18))",
    border: "rgba(16,185,129,.35)",
    glow: "0 0 42px rgba(16,185,129,.20)",
    badge: "Лучшее",
    vibe: "Максимальный статус",
    label: "ДЛЯ ОЛДОВ",
    description: "Постоянный статус для тех, кто хочет остаться с проектом надолго.",
    highlights: [
      "Оформляется один раз и остаётся навсегда",
      "Максимально статусный вариант",
      "Лучший способ поддержать проект",
    ],
  },
];

const boosterFeatures = [
  "Доступ к меню возможностей /buster",
  "ВКЛ/ВЫКЛ сохранения инвентаря",
  "Получение своей головы",
  "/disc search — поиск треков на YouTube",
  "/disc burn — создание диска с собственным аудио по URL-адресу",
  "/disc erase — возвращение кастомного диска в обычный",
  "Выделение среди игроков и более статусный образ на сервере",
  "Поддержка проекта и развитие сервера",
];

const ruleGroups = [
  {
    id: "start",
    title: "1. База и честная игра",
    icon: "🛡️",
    items: [
      "Игрок автоматически соглашается с правилами сервера и обязан их соблюдать.",
      "Запрещены читы, x-ray, дюпы, макросы, авто-рыбалка, баги и любые способы получить нечестное преимущество.",
      "Запрещены взлом, вход на чужой аккаунт, передача аккаунта и обход наказаний.",
    ],
  },
  {
    id: "voice",
    title: "2. Обязательный голосовой мод",
    icon: "🎤",
    items: [
      "На сервере обязателен мод PlasmoVoice Chat.",
      "За отсутствие PlasmoVoice Chat вас могут кикнуть или выдать варн при игнорировании.",
      "Перед входом на сервер лучше сразу установить и проверить работу мода.",
    ],
  },
  {
    id: "behavior",
    title: "3. Поведение и общение",
    icon: "⚠️",
    items: [
      "Запрещены оскорбления, угрозы, провокации, спам, флуд и реклама.",
      "Нельзя распространять личную информацию, даже если она ложная.",
      "Запрещено оскорблять проект и упоминать сторонние ванильные проекты.",
    ],
  },
  {
    id: "donate",
    title: "4. Донат и возможности",
    icon: "💎",
    items: [
      "Нельзя покупать и продавать внутриигровые предметы, территории и ценности за реальные деньги.",
      "Исключение — донат на сервере и серверные возможности, оформленные администрацией.",
      "Подписка БУСТЕР на этом сайте является частью возможностей проекта и поддержки сервера.",
    ],
  },
  {
    id: "admin",
    title: "5. Администрация",
    icon: "📜",
    items: [
      "Администрация может менять наказание по своему усмотрению.",
      "Администрация имеет право заблокировать аккаунт без объяснения причин.",
      "Доказательства к наказанию могут не предоставляться.",
    ],
  },
];

function App() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [copied, setCopied] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [nickname, setNickname] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.fontFamily =
      'Inter, Arial, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    document.body.style.background = isDark ? "#09090b" : "#f2f6f3";
    document.body.style.color = isDark ? "#fff" : "#111827";
  }, [isDark]);

  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setNickname("");
      setAccepted(false);
      setShowTerms(false);
      setPaymentMethod("card");
      setPaymentDone(false);
      setIsPaying(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPlan]);

  const orderId = useMemo(() => {
    if (!selectedPlan) return "";
    return `BOOST-${selectedPlan.id}-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [selectedPlan]);

  const colors = {
    panel: isDark ? "rgba(10,10,12,.82)" : "rgba(255,255,255,.82)",
    panelSoft: isDark ? "rgba(18,18,23,.88)" : "rgba(248,250,252,.9)",
    text: isDark ? "#ffffff" : "#111827",
    softText: isDark ? "#d4d4d8" : "#4b5563",
    muted: isDark ? "#a1a1aa" : "#6b7280",
    border: isDark ? "rgba(63,63,70,.75)" : "rgba(212,212,216,.9)",
    greenText: isDark ? "#d1fae5" : "#166534",
    greenBg: isDark ? "rgba(16,185,129,.12)" : "#ecfdf5",
    greenBorder: isDark ? "rgba(16,185,129,.26)" : "#86efac",
  };

  const cardStyle: CSSProperties = {
    border: `1px solid ${colors.border}`,
    background: colors.panel,
    boxShadow: isDark
      ? "0 18px 55px rgba(0,0,0,.35)"
      : "0 18px 45px rgba(15,23,42,.08)",
    backdropFilter: "blur(14px)",
    borderRadius: 20,
  };

  const pixelButton = (bg: string, color: string): CSSProperties => ({
    background: bg,
    color,
    border: "none",
    padding: "13px 18px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 14,
    transition: "transform .25s ease, filter .25s ease, box-shadow .25s ease",
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,.18)",
    position: "relative",
    overflow: "hidden",
  });

  async function copyIp() {
    try {
      await navigator.clipboard.writeText("mc.abobaworld.xyz");
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      alert("Не удалось скопировать IP");
    }
  }

  function startDemoPayment() {
    if (!selectedPlan || !nickname || !accepted) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
    }, 1500);
  }

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || !rootRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rootRef.current.style.setProperty("--mx", `${x}px`);
    rootRef.current.style.setProperty("--my", `${y}px`);
  }

  return (
    <div
      ref={rootRef}
      onMouseMove={handleMove}
      style={
        {
          minHeight: "100vh",
          background: isDark
            ? "radial-gradient(circle at top right, rgba(16,185,129,.10), transparent 25%), radial-gradient(circle at bottom left, rgba(217,70,239,.08), transparent 22%), #09090b"
            : "radial-gradient(circle at top right, rgba(16,185,129,.10), transparent 25%), radial-gradient(circle at bottom left, rgba(34,197,94,.06), transparent 22%), #f2f6f3",
          position: "relative",
          overflow: "hidden",
          ["--mx" as string]: "50%",
          ["--my" as string]: "50%",
        } as CSSProperties
      }
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes floatSoft {
          0%, 100% { transform: translate3d(0,0,0); }
          50% { transform: translate3d(0,-6px,0); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: .35; transform: scale(1); }
          50% { opacity: .7; transform: scale(1.08); }
        }

        @keyframes shine {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(220%); }
        }

        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes particleMove {
          0% { transform: translateY(0px) translateX(0px) scale(1); opacity: .15; }
          50% { transform: translateY(-18px) translateX(8px) scale(1.18); opacity: .45; }
          100% { transform: translateY(0px) translateX(0px) scale(1); opacity: .15; }
        }

        .fade-up { animation: fadeUp .7s ease both; }
        .float-soft { animation: floatSoft 5s ease-in-out infinite; }
        .glass-card {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease, background .28s ease;
        }
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 28px 60px rgba(0,0,0,.28);
        }

        .shine-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transform: translateX(-140%);
          animation: shine 3.8s linear infinite;
        }

        .hero-orb-a, .hero-orb-b {
          position: absolute;
          border-radius: 999px;
          filter: blur(55px);
          pointer-events: none;
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .hero-orb-a {
          width: 320px;
          height: 320px;
          right: -80px;
          top: -60px;
          background: rgba(16,185,129,.15);
        }

        .hero-orb-b {
          width: 260px;
          height: 260px;
          left: -60px;
          bottom: 40px;
          background: rgba(168,85,247,.13);
          animation-delay: 1.4s;
        }

        .cursor-glow {
          position: fixed;
          left: calc(var(--mx) - 120px);
          top: calc(var(--my) - 120px);
          width: 240px;
          height: 240px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(110,231,183,.14), transparent 65%);
          pointer-events: none;
          filter: blur(24px);
          z-index: 0;
          transition: left .08s linear, top .08s linear;
        }

        .particles {
          pointer-events: none;
          position: fixed;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .particle {
          position: absolute;
          border-radius: 999px;
          animation: particleMove ease-in-out infinite;
        }

        .hero-title {
          background: linear-gradient(180deg, #fff 0%, #c7f9dd 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(255,255,255,.08);
        }

        .ring-spin {
          animation: spinSlow 18s linear infinite;
        }

        .plan-card {
          position: relative;
          overflow: hidden;
        }

        .plan-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 20%, rgba(255,255,255,.08) 45%, transparent 70%);
          transform: translateX(-120%);
          transition: transform .7s ease;
          pointer-events: none;
        }

        .plan-card:hover::after {
          transform: translateX(120%);
        }

        .badge-pop {
          animation: pulseGlow 3.4s ease-in-out infinite;
        }

        details {
          overflow: hidden;
        }

        details[open] summary {
          margin-bottom: 14px;
        }

        summary {
          transition: transform .2s ease;
        }

        details:hover summary {
          transform: translateX(4px);
        }

        .live-panel {
          position: relative;
          overflow: hidden;
        }

        .live-panel::before {
          content: "";
          position: absolute;
          inset: -1px;
          background: linear-gradient(130deg, rgba(16,185,129,.22), transparent 35%, rgba(99,102,241,.18), transparent 70%);
          opacity: .5;
          pointer-events: none;
        }

        @media (max-width: 1100px) {
          .hero-grid, .booster-grid, .contact-grid, .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 900px) {
          .stats-grid, .features-grid, .steps-grid, .about-grid {
            grid-template-columns: 1fr !important;
          }
          .mini-grid, .plans-grid {
            grid-template-columns: 1fr !important;
          }
          .header-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .nav-row {
            justify-content: flex-start !important;
          }
          .plan-head {
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .plan-price-box {
            text-align: left !important;
          }
        }
      `}</style>

      <div className="cursor-glow" />

      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="particle"
            style={{
              width: 6 + (i % 5) * 6,
              height: 6 + (i % 5) * 6,
              left: `${(i * 17) % 100}%`,
              top: `${(i * 11) % 100}%`,
              background: i % 2 === 0 ? "rgba(110,231,183,.18)" : "rgba(192,132,252,.14)",
              animationDuration: `${5 + (i % 6)}s`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      <div className="hero-orb-a" />
      <div className="hero-orb-b" />

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "24px 16px 50px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <header
          className="glass-card fade-up"
          style={{
            ...cardStyle,
            padding: 16,
            position: "sticky",
            top: 16,
            zIndex: 20,
            marginBottom: 36,
          }}
        >
          <div
            className="header-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                className="float-soft"
                style={{
                  width: 50,
                  height: 50,
                  display: "grid",
                  placeItems: "center",
                  border: `1px solid ${colors.border}`,
                  background: isDark ? "rgba(255,255,255,.08)" : "#f3f4f6",
                  fontSize: 24,
                  borderRadius: 16,
                }}
              >
                👑
              </div>

              <div>
                <div
                  className="live-panel"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${colors.border}`,
                    background: isDark ? "#09090b" : "#ffffff",
                    padding: "10px 14px",
                    borderRadius: 16,
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 8px)", gap: 2 }}>
                    <div style={{ width: 8, height: 8, background: "#22c55e", borderRadius: 2 }} />
                    <div style={{ width: 8, height: 8, background: "#15803d", borderRadius: 2 }} />
                    <div style={{ width: 8, height: 8, background: "#52525b", borderRadius: 2 }} />
                    <div style={{ width: 8, height: 8, background: "#18181b", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontWeight: 900, letterSpacing: ".2em", fontSize: 22 }}>
                    ABOBAWORLD
                  </span>
                </div>
                <div style={{ marginTop: 8, color: colors.muted, fontSize: 14 }}>
                  Ванильный Minecraft сервер
                </div>
              </div>
            </div>

            <div
              className="nav-row"
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {[
                ["#booster", "Титулы"],
                ["#rules", "Правила"],
                ["#start", "Как начать"],
                ["#about", "О сервере"],
                ["#contact", "Администрация"],
              ].map(([href, label], i) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: colors.text,
                    padding: "10px 12px",
                    fontSize: 14,
                    borderRadius: 12,
                    background: i === 0 ? "rgba(255,255,255,.05)" : "transparent",
                    transition: "transform .2s ease, background .2s ease",
                  }}
                >
                  {label}
                </a>
              ))}

              <button
                className="shine-btn"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
              >
                {isDark ? "Светлая тема" : "Тёмная тема"}
              </button>
            </div>
          </div>
        </header>

        <section
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 28,
            alignItems: "center",
            marginBottom: 48,
          }}
        >
          <div className="fade-up" style={{ animationDelay: ".1s" }}>
            <div
              className="badge-pop"
              style={{
                display: "inline-block",
                border: `1px solid ${colors.greenBorder}`,
                background: colors.greenBg,
                color: colors.greenText,
                padding: "8px 12px",
                fontWeight: 700,
                marginBottom: 14,
                borderRadius: 999,
              }}
            >
              Сервер онлайн • Версия 1.21.4
            </div>

            <h1
              className="hero-title"
              style={{
                margin: 0,
                fontSize: "clamp(40px, 7vw, 72px)",
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              Добро пожаловать на AbobaWorld
            </h1>

            <p
              style={{
                color: colors.softText,
                fontSize: 18,
                lineHeight: 1.7,
                maxWidth: 780,
                marginTop: 18,
              }}
            >
              Уютный ванильный Minecraft-сервер с живым комьюнити, честной игрой,
              красивыми постройками и атмосферой, куда хочется возвращаться снова.
              Заходи, развивайся, строй, общайся и становись частью мира AbobaWorld.
            </p>

            <div
              className="glass-card live-panel"
              style={{
                ...cardStyle,
                borderColor: colors.greenBorder,
                background: colors.greenBg,
                padding: 18,
                marginTop: 18,
                maxWidth: 820,
              }}
            >
              <div style={{ fontWeight: 800, color: "#34d399", marginBottom: 8 }}>
                🎤 Важно перед входом
              </div>
              <div style={{ lineHeight: 1.7 }}>
                На сервере обязателен мод <strong>PlasmoVoice Chat</strong>. За отсутствие
                PlasmoVoice Chat вас могут кикнуть или выдать варн при игнорировании.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
              <button
                className="shine-btn"
                onClick={copyIp}
                style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
              >
                {copied ? "Скопировано" : "Скопировать IP"}
              </button>

              <div
                className="glass-card"
                style={{
                  ...cardStyle,
                  borderColor: colors.greenBorder,
                  background: colors.greenBg,
                  padding: "12px 16px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  color: colors.greenText,
                  fontSize: 14,
                  borderRadius: 16,
                }}
              >
                <span className="ring-spin" style={{ display: "inline-block" }}>📶</span>
                <span>Онлайн</span>
                <span style={{ opacity: 0.7 }}>•</span>
                <span>TPS 20.0</span>
                <span style={{ opacity: 0.7 }}>•</span>
                <span>Игроков 27/100</span>
              </div>
            </div>

            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
                marginTop: 22,
              }}
            >
              {[
                ["IP сервера", "mc.abobaworld.xyz"],
                ["Версия", "1.21.4"],
                ["Атмосфера", "Ваниль + комьюнити"],
              ].map(([label, value], idx) => (
                <div
                  key={label}
                  className="glass-card float-soft"
                  style={{
                    ...cardStyle,
                    padding: 18,
                    animationDelay: `${idx * 0.5}s`,
                  }}
                >
                  <div style={{ color: colors.muted, fontSize: 14 }}>{label}</div>
                  <div style={{ marginTop: 8, fontWeight: 800, fontSize: 20, wordBreak: "break-word" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay: ".2s", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -20,
                background:
                  "linear-gradient(135deg, rgba(52,211,153,.20), rgba(217,70,239,.10), rgba(34,211,238,.10))",
                filter: "blur(32px)",
                borderRadius: 30,
              }}
            />
            <div className="glass-card live-panel" style={{ ...cardStyle, position: "relative", padding: 24 }}>
              <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 12 }}>
                Почему сюда хочется зайти
              </div>
              <div style={{ color: colors.softText, lineHeight: 1.7, marginBottom: 18 }}>
                Здесь не просто сервер, а место, где можно спокойно играть, строить
                историю своего мира и знакомиться с людьми, которые тоже любят
                ванильный Minecraft.
              </div>

              {[
                "Ламповое выживание и приятная атмосфера",
                "Понятные правила и упор на честную игру",
                "Общение через Discord и голосовой мод",
                "Титулы и дополнительные возможности для поддержки проекта",
              ].map((item, idx) => (
                <div
                  key={item}
                  className="glass-card"
                  style={{
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 14,
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                    transform: `translateX(${idx % 2 === 0 ? 0 : 4}px)`,
                  }}
                >
                  <span style={{ color: "#6ee7b7" }}>✔</span>
                  <span style={{ color: colors.softText }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="booster" style={{ marginBottom: 48 }}>
          <div
            className="fade-up"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "end",
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: colors.muted,
                  marginBottom: 8,
                }}
              >
                Титулы и поддержка
              </div>
              <h2 style={{ margin: 0, fontSize: 42 }}>Три версии БУСТЕРА</h2>
              <p style={{ color: colors.softText, maxWidth: 760, lineHeight: 1.7 }}>
                Выбери вариант под свой стиль игры: быстрый старт, выгодный месяц
                или постоянный статус без ограничений по времени.
              </p>
            </div>

            <div
              className="badge-pop"
              style={{
                border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.08)",
                padding: "8px 12px",
                fontWeight: 700,
                borderRadius: 999,
              }}
            >
              3 версии • 3 уровня ценности
            </div>
          </div>

          <div
            className="booster-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr .9fr",
              gap: 20,
            }}
          >
            <div className="glass-card fade-up live-panel" style={{ ...cardStyle, overflow: "hidden", animationDelay: ".08s" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                {["СТАТУС", "ПРИВИЛЕГИИ"].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      borderRight: item === "СТАТУС" ? `1px solid ${colors.border}` : "none",
                      background: colors.panelSoft,
                      fontWeight: 800,
                      letterSpacing: ".16em",
                      fontSize: 12,
                      color: colors.muted,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div style={{ padding: 24 }}>
                <div
                  className="badge-pop"
                  style={{
                    display: "inline-block",
                    border: "1px solid rgba(251,191,36,.3)",
                    background: "rgba(251,191,36,.12)",
                    color: "#fde68a",
                    padding: "8px 12px",
                    fontWeight: 800,
                    marginBottom: 16,
                    borderRadius: 999,
                  }}
                >
                  ЛИНЕЙКА ПОДПИСОК
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    alignItems: "start",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 34, fontWeight: 900 }}>
                      Три версии для разных игроков
                    </div>
                    <div style={{ marginTop: 10, color: colors.softText, lineHeight: 1.7 }}>
                      START подойдёт для знакомства, PLUS — для активной игры, а
                      ULTRA — для тех, кто хочет забрать максимальный статус на проекте.
                    </div>
                  </div>

                  <div
                    className="glass-card"
                    style={{
                      ...cardStyle,
                      borderColor: colors.greenBorder,
                      background: colors.greenBg,
                      padding: 14,
                      color: colors.greenText,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    Каждая версия ощущается по-разному
                  </div>
                </div>

                <div
                  className="features-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                    marginTop: 18,
                  }}
                >
                  {boosterFeatures.map((feature, idx) => (
                    <div
                      key={feature}
                      className="glass-card"
                      style={{
                        ...cardStyle,
                        background: colors.panelSoft,
                        padding: 14,
                        color: colors.softText,
                        lineHeight: 1.6,
                        animation: `fadeUp .55s ease both`,
                        animationDelay: `${0.04 * idx}s`,
                      }}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="plans-grid" style={{ display: "grid", gap: 18 }}>
              {boosterPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="glass-card plan-card fade-up"
                  style={{
                    ...cardStyle,
                    overflow: "hidden",
                    borderColor: plan.border,
                    boxShadow: `${plan.glow}, ${
                      isDark ? "0 18px 50px rgba(0,0,0,.35)" : "0 18px 40px rgba(15,23,42,.08)"
                    }`,
                    transform: `translateY(${index === 0 ? "0" : index === 1 ? "-4px" : "-8px"})`,
                    animationDelay: `${0.1 + index * 0.08}s`,
                  }}
                >
                  <div
                    className="float-soft"
                    style={{
                      height: 132,
                      background: plan.accent,
                      position: "relative",
                      borderBottom: "1px solid rgba(0,0,0,.2)",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      animationDelay: `${index * 0.4}s`,
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <div
                        className="badge-pop"
                        style={{
                          padding: "6px 10px",
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: ".18em",
                          background:
                            plan.id === 1 ? "#fcd34d" : plan.id === 2 ? "#d946ef" : "#34d399",
                          color: plan.id === 2 ? "#fff" : "#111827",
                          borderRadius: 999,
                        }}
                      >
                        {plan.label}
                      </div>
                      <span style={{ fontSize: 18 }}>
                        {plan.id === 1 ? "✨" : plan.id === 2 ? "💎" : "👑"}
                      </span>
                    </div>

                    <div
                      className="plan-head"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: 16,
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: 900,
                            lineHeight: 1.1,
                            wordBreak: "break-word",
                          }}
                        >
                          {plan.name}
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 12,
                            letterSpacing: ".14em",
                            fontWeight: 700,
                            color: colors.muted,
                          }}
                        >
                          {plan.vibe}
                        </div>
                      </div>

                      <div
                        className="plan-price-box"
                        style={{
                          textAlign: "right",
                          flexShrink: 0,
                          minWidth: 96,
                        }}
                      >
                        <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>
                          {plan.price}₽
                        </div>
                        <div style={{ marginTop: 8, color: colors.softText, fontSize: 13 }}>
                          {plan.period}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 20 }}>
                    <div style={{ display: "grid", gap: 10 }}>
                      {plan.highlights.map((line) => (
                        <div
                          key={line}
                          className="glass-card"
                          style={{
                            ...cardStyle,
                            background: colors.panelSoft,
                            padding: 12,
                            color: colors.softText,
                          }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>

                    <button
                      className="shine-btn"
                      onClick={() => setSelectedPlan(plan)}
                      style={{
                        ...pixelButton("#86efac", "#111827"),
                        marginTop: 16,
                        width: "100%",
                      }}
                    >
                      Оформить БУСТЕР
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="start" className="fade-up" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: colors.muted, marginBottom: 8 }}>
            Как начать играть
          </div>
          <h2 style={{ margin: 0, fontSize: 42 }}>Старт за пару минут</h2>
          <p style={{ color: colors.softText, maxWidth: 760, lineHeight: 1.7 }}>
            Всё просто: подготовь игру, поставь голосовой мод и заходи на сервер.
          </p>

          <div
            className="steps-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
              marginTop: 20,
            }}
          >
            {[
              ["🎮 1. Установить Minecraft", "Запусти Minecraft Java Edition версии 1.21.4 и подготовь клиент к игре."],
              ["🎤 2. Поставить PlasmoVoice", "Установи мод PlasmoVoice Chat, потому что без него тебя могут кикнуть или выдать варн."],
              ["🚪 3. Зайти по IP", "Добавь сервер mc.abobaworld.xyz в список и заходи в мир AbobaWorld."],
            ].map(([title, text], idx) => (
              <div
                key={title}
                className="glass-card"
                style={{
                  ...cardStyle,
                  padding: 22,
                  animation: "fadeUp .6s ease both",
                  animationDelay: `${0.08 * idx}s`,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800 }}>{title}</div>
                <div style={{ marginTop: 12, lineHeight: 1.7, color: colors.softText }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="fade-up" style={{ marginBottom: 48 }}>
          <div
            className="about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {[
              ["🛡️ Честная игра", "На сервере ценятся адекватность, уважение к другим игрокам и игра без нечестных преимуществ."],
              ["👑 Титулы и поддержка", "Здесь можно не только играть, но и красиво выделиться на сервере, поддерживая развитие проекта."],
              ["🌍 Живой мир", "Постройки, города, общение, совместные истории и уютное выживание — всё это делает AbobaWorld местом, куда хочется возвращаться."],
            ].map(([title, text], idx) => (
              <div
                key={title}
                className="glass-card"
                style={{
                  ...cardStyle,
                  padding: 22,
                  animation: "fadeUp .6s ease both",
                  animationDelay: `${0.08 * idx}s`,
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 800 }}>{title}</div>
                <div style={{ marginTop: 12, lineHeight: 1.7, color: colors.softText }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="fade-up" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: colors.muted, marginBottom: 8 }}>
            Связь с администрацией
          </div>
          <h2 style={{ margin: 0, fontSize: 42 }}>
            Нужна помощь или хочешь влиться в комьюнити?
          </h2>
          <p style={{ color: colors.softText, maxWidth: 760, lineHeight: 1.7 }}>
            Присоединяйся к Discord сервера, задавай вопросы, общайся с игроками и
            связывайся с администрацией напрямую.
          </p>

          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr .9fr",
              gap: 18,
              marginTop: 20,
            }}
          >
            <div className="glass-card live-panel" style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Discord сервера</div>
              <div style={{ marginTop: 10, color: colors.softText }}>
                Основной способ связи с администрацией и игроками проекта.
              </div>
              <button
                className="shine-btn"
                onClick={() => window.open("https://discord.gg/yy5JGzGz", "_blank")}
                style={{ ...pixelButton("#6366f1", "#ffffff"), marginTop: 18 }}
              >
                Перейти в Discord
              </button>
            </div>

            <div className="glass-card" style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Теги администрации</div>
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                {["@casper_932", "@neznaiu_gg"].map((admin, idx) => (
                  <div
                    key={admin}
                    className="glass-card"
                    style={{
                      ...cardStyle,
                      background: colors.panelSoft,
                      padding: 14,
                      color: colors.text,
                      animation: "fadeUp .5s ease both",
                      animationDelay: `${0.08 * idx}s`,
                    }}
                  >
                    {admin}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="rules" className="fade-up" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: colors.muted, marginBottom: 8 }}>
            Правила сервера
          </div>
          <h2 style={{ margin: 0, fontSize: 42 }}>Краткая версия правил AbobaWorld</h2>
          <p style={{ color: colors.softText, maxWidth: 760, lineHeight: 1.7 }}>
            Самое важное собрано ниже: играй честно, уважай игроков, соблюдай правила
            сервера и не забывай про обязательный PlasmoVoice Chat.
          </p>

          <div className="glass-card" style={{ ...cardStyle, padding: 22, marginTop: 20 }}>
            <div style={{ display: "grid", gap: 14 }}>
              {ruleGroups.map((group) => (
                <details
                  key={group.id}
                  className="glass-card"
                  style={{
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 16,
                  }}
                >
                  <summary style={{ cursor: "pointer", fontWeight: 800, fontSize: 18 }}>
                    {group.icon} {group.title}
                  </summary>
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className="glass-card"
                        style={{
                          ...cardStyle,
                          padding: 14,
                          background: isDark ? "#0f1115" : "#ffffff",
                          color: colors.softText,
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <footer
          className="footer-grid glass-card fade-up"
          style={{
            ...cardStyle,
            padding: 24,
            display: "grid",
            gridTemplateColumns: "1.2fr .8fr",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: ".18em" }}>
              ABOBAWORLD
            </div>
            <div style={{ marginTop: 8, color: colors.softText }}>
              © 2026 AbobaWorld. Ванильный Minecraft-сервер с атмосферой,
              комьюнити и своими фишками.
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              className="shine-btn"
              onClick={copyIp}
              style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
            >
              {copied ? "Скопировано" : "Скопировать IP"}
            </button>
            <button
              className="shine-btn"
              onClick={() => window.open("https://discord.gg/yy5JGzGz", "_blank")}
              style={pixelButton("#6366f1", "#ffffff")}
            >
              Discord
            </button>
          </div>
        </footer>
      </div>

      {selectedPlan && (
        <div
          onClick={() => setSelectedPlan(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.68)",
            display: "grid",
            placeItems: "center",
            padding: 20,
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="fade-up"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(620px, 100%)",
              maxHeight: "85vh",
              overflowY: "auto",
              ...cardStyle,
              background: isDark ? "#09090b" : "#ffffff",
              padding: 22,
            }}
          >
            {!paymentDone ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 900 }}>{selectedPlan.name}</div>
                    <div style={{ color: colors.softText, marginTop: 8 }}>
                      {selectedPlan.description}
                    </div>
                  </div>

                  <button
                    className="shine-btn"
                    onClick={() => setSelectedPlan(null)}
                    style={pixelButton(isDark ? "#18181b" : "#f3f4f6", colors.text)}
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="glass-card"
                  style={{
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 16,
                    marginTop: 18,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedPlan.name}</div>
                      <div style={{ marginTop: 6, color: colors.softText }}>
                        {selectedPlan.description}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        className="badge-pop"
                        style={{
                          display: "inline-block",
                          background: "#86efac",
                          color: "#111827",
                          padding: "6px 10px",
                          fontWeight: 900,
                          borderRadius: 999,
                        }}
                      >
                        {selectedPlan.price} ₽
                      </div>
                      <div style={{ marginTop: 8, color: colors.muted, fontSize: 13 }}>
                        {selectedPlan.period}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>
                    Никнейм в Minecraft
                  </label>
                  <input
                    value={nickname}
                    onChange={(e) =>
                      setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16))
                    }
                    placeholder="Например: Steve"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "12px 14px",
                      border: `1px solid ${colors.border}`,
                      background: isDark ? "#111318" : "#ffffff",
                      color: colors.text,
                      outline: "none",
                      fontSize: 15,
                      borderRadius: 14,
                      transition: "box-shadow .25s ease, border-color .25s ease",
                    }}
                  />
                  <div style={{ marginTop: 8, color: colors.muted, fontSize: 13 }}>
                    Ник можно вводить только латиницей, цифрами и символом _
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Способ оплаты</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {[
                      ["card", "💳 Банковская карта"],
                      ["sbp", "📱 СБП"],
                      ["crypto", "🪙 Криптовалюта"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setPaymentMethod(value as PaymentMethod)}
                        className="glass-card"
                        style={{
                          ...cardStyle,
                          background:
                            paymentMethod === value ? colors.greenBg : colors.panelSoft,
                          borderColor:
                            paymentMethod === value ? colors.greenBorder : colors.border,
                          padding: 14,
                          textAlign: "left",
                          cursor: "pointer",
                          color: colors.text,
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <label
                  className="glass-card"
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 14,
                    marginTop: 18,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ color: colors.softText, lineHeight: 1.7 }}>
                    Я принимаю условия покупки, соглашаюсь с правилами сервера,
                    понимаю, что цифровая подписка активируется для указанного никнейма,
                    а возврат возможен только по решению администрации при технической ошибке.
                  </span>
                </label>

                <div style={{ marginTop: 16 }}>
                  <button
                    onClick={() => setShowTerms((v) => !v)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: colors.muted,
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Полные условия покупки
                  </button>
                </div>

                {showTerms && (
                  <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                    {[
                      "Подписка БУСТЕР является цифровой серверной услугой для проекта AbobaWorld.",
                      "Покупатель обязан указать корректный никнейм Minecraft. Активация выполняется для указанного никнейма.",
                      "При ошибке в никнейме автоматическая выдача может потребовать участия администрации.",
                      "Покупка означает согласие с правилами сервера, условиями активации и внутренними правилами проекта.",
                      "Возврат цифровой услуги возможен только при технической ошибке или иной подтверждённой проблеме по решению администрации.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="glass-card"
                        style={{
                          ...cardStyle,
                          background: colors.panelSoft,
                          padding: 14,
                          color: colors.softText,
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="glass-card live-panel"
                  style={{
                    ...cardStyle,
                    borderColor: colors.greenBorder,
                    background: colors.greenBg,
                    padding: 16,
                    marginTop: 18,
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>Что входит в подписку</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {boosterFeatures.map((feature) => (
                      <div key={feature}>{feature}</div>
                    ))}
                  </div>
                </div>

                <div
                  className="glass-card"
                  style={{
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 16,
                    marginTop: 18,
                    color: colors.softText,
                  }}
                >
                  Номер заказа:{" "}
                  <span style={{ fontFamily: "monospace", color: colors.text }}>{orderId}</span>
                  <div style={{ marginTop: 6 }}>Статус: ожидание оплаты</div>
                  <div style={{ marginTop: 6 }}>Выбранный способ: {paymentMethod}</div>
                </div>

                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      color: colors.muted,
                      fontSize: 13,
                      lineHeight: 1.6,
                      maxWidth: 360,
                    }}
                  >
                    Это демонстрационный шаг оплаты. Для реального приёма платежей потом
                    можно подключить платёжный сервис.
                  </div>

                  <button
                    className="shine-btn"
                    disabled={!nickname || !accepted || isPaying}
                    style={{
                      ...pixelButton("#86efac", "#111827"),
                      opacity: !nickname || !accepted || isPaying ? 0.55 : 1,
                      cursor: !nickname || !accepted || isPaying ? "not-allowed" : "pointer",
                    }}
                    onClick={startDemoPayment}
                  >
                    {isPaying ? "Обработка..." : "Оплатить"}
                  </button>
                </div>
              </>
            ) : (
              <div className="fade-up">
                <div style={{ fontSize: 34, fontWeight: 900 }}>✅ Оплата оформлена</div>
                <div style={{ marginTop: 12, color: colors.softText, lineHeight: 1.7 }}>
                  Спасибо за поддержку проекта. В демо-режиме заказ помечен как оплаченный.
                </div>

                <div
                  className="glass-card live-panel"
                  style={{
                    ...cardStyle,
                    background: colors.greenBg,
                    borderColor: colors.greenBorder,
                    padding: 16,
                    marginTop: 20,
                    color: colors.greenText,
                  }}
                >
                  <div><strong>Тариф:</strong> {selectedPlan.name}</div>
                  <div style={{ marginTop: 6 }}><strong>Ник:</strong> {nickname}</div>
                  <div style={{ marginTop: 6 }}><strong>Сумма:</strong> {selectedPlan.price} ₽</div>
                  <div style={{ marginTop: 6 }}><strong>Способ:</strong> {paymentMethod}</div>
                  <div style={{ marginTop: 6 }}><strong>Заказ:</strong> {orderId}</div>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
                  <button
                    className="shine-btn"
                    onClick={() => setSelectedPlan(null)}
                    style={pixelButton("#86efac", "#111827")}
                  >
                    Закрыть
                  </button>
                  <button
                    className="shine-btn"
                    onClick={() => {
                      setPaymentDone(false);
                      setNickname("");
                      setAccepted(false);
                    }}
                    style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
                  >
                    Оформить заново
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;