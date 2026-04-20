import { useEffect, useMemo, useState } from "react";

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
      "За отсутствие PlasmoVoice Chat вас могут кикнуть, а при игнорировании требования — выдать варн.",
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
    panel: isDark ? "rgba(10,10,12,.88)" : "rgba(255,255,255,.92)",
    panelSoft: isDark ? "#121217" : "#f8fafc",
    text: isDark ? "#ffffff" : "#111827",
    softText: isDark ? "#d4d4d8" : "#4b5563",
    muted: isDark ? "#a1a1aa" : "#6b7280",
    border: isDark ? "#27272a" : "#d4d4d8",
    greenText: isDark ? "#d1fae5" : "#166534",
    greenBg: isDark ? "rgba(16,185,129,.12)" : "#ecfdf5",
    greenBorder: isDark ? "rgba(16,185,129,.26)" : "#86efac",
  };

  const cardStyle: React.CSSProperties = {
    border: `2px solid ${colors.border}`,
    background: colors.panel,
    boxShadow: isDark
      ? "0 18px 55px rgba(0,0,0,.35)"
      : "0 18px 45px rgba(15,23,42,.08)",
    backdropFilter: "blur(10px)",
  };

  const pixelButton = (bg: string, color: string): React.CSSProperties => ({
    background: bg,
    color,
    border: "none",
    borderRight: "4px solid rgba(0,0,0,.35)",
    borderBottom: "4px solid rgba(0,0,0,.35)",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: 14,
    transition: "transform .15s ease, filter .15s ease",
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "radial-gradient(circle at top right, rgba(16,185,129,.10), transparent 25%), radial-gradient(circle at bottom left, rgba(217,70,239,.08), transparent 22%), #09090b"
          : "radial-gradient(circle at top right, rgba(16,185,129,.10), transparent 25%), radial-gradient(circle at bottom left, rgba(34,197,94,.06), transparent 22%), #f2f6f3",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        a:hover, button:hover { filter: brightness(1.05); }
        button:active { transform: translateY(1px); }
        details summary { list-style: none; }
        details summary::-webkit-details-marker { display: none; }

        @media (max-width: 1100px) {
          .hero-grid, .booster-grid, .contact-grid, .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 900px) {
          .stats-grid, .features-grid, .mini-grid, .steps-grid, .about-grid {
            grid-template-columns: 1fr !important;
          }
          .plans-grid {
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

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.035) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

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
                style={{
                  width: 46,
                  height: 46,
                  display: "grid",
                  placeItems: "center",
                  border: `2px solid ${colors.border}`,
                  background: isDark ? "rgba(255,255,255,.08)" : "#f3f4f6",
                  fontSize: 24,
                }}
              >
                👑
              </div>

              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: `2px solid ${colors.border}`,
                    background: isDark ? "#09090b" : "#ffffff",
                    padding: "10px 14px",
                    boxShadow: isDark
                      ? "0 6px 0 rgba(0,0,0,.35)"
                      : "0 6px 0 rgba(0,0,0,.12)",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 8px)", gap: 2 }}>
                    <div style={{ width: 8, height: 8, background: "#22c55e" }} />
                    <div style={{ width: 8, height: 8, background: "#15803d" }} />
                    <div style={{ width: 8, height: 8, background: "#52525b" }} />
                    <div style={{ width: 8, height: 8, background: "#18181b" }} />
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
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  style={{
                    textDecoration: "none",
                    color: colors.text,
                    padding: "10px 12px",
                    fontSize: 14,
                  }}
                >
                  {label}
                </a>
              ))}

              <button
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
          <div>
            <div
              style={{
                display: "inline-block",
                border: `1px solid ${colors.greenBorder}`,
                background: colors.greenBg,
                color: colors.greenText,
                padding: "8px 12px",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              Сервер онлайн • Версия 1.21.4
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(40px, 7vw, 72px)",
                lineHeight: 1,
                fontWeight: 900,
              }}
            >
              Добро пожаловать на <span style={{ color: "#6ee7b7" }}>AbobaWorld</span>
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
                onClick={copyIp}
                style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
              >
                {copied ? "Скопировано" : "Скопировать IP"}
              </button>

              <div
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
                }}
              >
                <span>📶 Онлайн</span>
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
              ].map(([label, value]) => (
                <div key={label} style={{ ...cardStyle, padding: 18 }}>
                  <div style={{ color: colors.muted, fontSize: 14 }}>{label}</div>
                  <div style={{ marginTop: 8, fontWeight: 800, fontSize: 20, wordBreak: "break-word" }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -16,
                background:
                  "linear-gradient(135deg, rgba(52,211,153,.20), rgba(217,70,239,.10), rgba(34,211,238,.10))",
                filter: "blur(28px)",
              }}
            />
            <div style={{ ...cardStyle, position: "relative", padding: 24 }}>
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
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    ...cardStyle,
                    background: colors.panelSoft,
                    padding: 14,
                    marginTop: 10,
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
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
              style={{
                border: "1px solid rgba(255,255,255,.15)",
                background: "rgba(255,255,255,.08)",
                padding: "8px 12px",
                fontWeight: 700,
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
            <div style={{ ...cardStyle, overflow: "hidden" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  borderBottom: `2px solid ${colors.border}`,
                }}
              >
                {["СТАТУС", "ПРИВИЛЕГИИ"].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: 16,
                      textAlign: "center",
                      borderRight: item === "СТАТУС" ? `2px solid ${colors.border}` : "none",
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
                  style={{
                    display: "inline-block",
                    border: "1px solid rgba(251,191,36,.3)",
                    background: "rgba(251,191,36,.12)",
                    color: "#fde68a",
                    padding: "8px 12px",
                    fontWeight: 800,
                    marginBottom: 16,
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
                  {boosterFeatures.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        ...cardStyle,
                        background: colors.panelSoft,
                        padding: 14,
                        color: colors.softText,
                        lineHeight: 1.6,
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
                  style={{
                    ...cardStyle,
                    overflow: "hidden",
                    borderColor: plan.border,
                    boxShadow: `${plan.glow}, ${
                      isDark ? "0 18px 50px rgba(0,0,0,.35)" : "0 18px 40px rgba(15,23,42,.08)"
                    }`,
                    transform: `translateY(${index === 0 ? "0" : index === 1 ? "-4px" : "-8px"})`,
                  }}
                >
                  <div
                    style={{
                      height: 132,
                      background: plan.accent,
                      position: "relative",
                      borderBottom: "2px solid rgba(0,0,0,.2)",
                      padding: 16,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <div
                        style={{
                          padding: "6px 10px",
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: ".18em",
                          background:
                            plan.id === 1 ? "#fcd34d" : plan.id === 2 ? "#d946ef" : "#34d399",
                          color: plan.id === 2 ? "#fff" : "#111827",
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

        <section id="start" style={{ marginBottom: 48 }}>
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
            ].map(([title, text]) => (
              <div key={title} style={{ ...cardStyle, padding: 22 }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{title}</div>
                <div style={{ marginTop: 12, lineHeight: 1.7, color: colors.softText }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" style={{ marginBottom: 48 }}>
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
            ].map(([title, text]) => (
              <div key={title} style={{ ...cardStyle, padding: 22 }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{title}</div>
                <div style={{ marginTop: 12, lineHeight: 1.7, color: colors.softText }}>{text}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" style={{ marginBottom: 48 }}>
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
            <div style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Discord сервера</div>
              <div style={{ marginTop: 10, color: colors.softText }}>
                Основной способ связи с администрацией и игроками проекта.
              </div>
              <button
                onClick={() => window.open("https://discord.gg/yy5JGzGz", "_blank")}
                style={{ ...pixelButton("#6366f1", "#ffffff"), marginTop: 18 }}
              >
                Перейти в Discord
              </button>
            </div>

            <div style={{ ...cardStyle, padding: 22 }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Теги администрации</div>
              <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                {["@casper_932", "@neznaiu_gg"].map((admin) => (
                  <div
                    key={admin}
                    style={{
                      ...cardStyle,
                      background: colors.panelSoft,
                      padding: 14,
                      color: colors.text,
                    }}
                  >
                    {admin}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="rules" style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 13, letterSpacing: ".2em", textTransform: "uppercase", color: colors.muted, marginBottom: 8 }}>
            Правила сервера
          </div>
          <h2 style={{ margin: 0, fontSize: 42 }}>Краткая версия правил AbobaWorld</h2>
          <p style={{ color: colors.softText, maxWidth: 760, lineHeight: 1.7 }}>
            Самое важное собрано ниже: играй честно, уважай игроков, соблюдай правила
            сервера и не забывай про обязательный PlasmoVoice Chat.
          </p>

          <div style={{ ...cardStyle, padding: 22, marginTop: 20 }}>
            <div style={{ display: "grid", gap: 14 }}>
              {ruleGroups.map((group) => (
                <details
                  key={group.id}
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
          className="footer-grid"
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
              onClick={copyIp}
              style={pixelButton(isDark ? "#18181b" : "#ffffff", colors.text)}
            >
              {copied ? "Скопировано" : "Скопировать IP"}
            </button>
            <button
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
          }}
        >
          <div
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
                    onClick={() => setSelectedPlan(null)}
                    style={pixelButton(isDark ? "#18181b" : "#f3f4f6", colors.text)}
                  >
                    ✕
                  </button>
                </div>

                <div
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
                        style={{
                          display: "inline-block",
                          background: "#86efac",
                          color: "#111827",
                          padding: "6px 10px",
                          fontWeight: 900,
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
                      border: `2px solid ${colors.border}`,
                      background: isDark ? "#111318" : "#ffffff",
                      color: colors.text,
                      outline: "none",
                      fontSize: 15,
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
              <div>
                <div style={{ fontSize: 34, fontWeight: 900 }}>✅ Оплата оформлена</div>
                <div style={{ marginTop: 12, color: colors.softText, lineHeight: 1.7 }}>
                  Спасибо за поддержку проекта. В демо-режиме заказ помечен как оплаченный.
                </div>

                <div
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
                    onClick={() => setSelectedPlan(null)}
                    style={pixelButton("#86efac", "#111827")}
                  >
                    Закрыть
                  </button>
                  <button
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