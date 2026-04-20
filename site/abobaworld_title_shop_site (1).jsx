import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Shield,
  Crown,
  Server,
  ScrollText,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertTriangle,
  Music4,
  Gem,
  Sun,
  Moon,
  MessageCircle,
  ExternalLink,
  Mic,
  Stars,
  Trophy,
  Diamond,
  Gamepad2,
  Download,
  LogIn,
  Wifi,
} from "lucide-react";

const rarityStyles = {
  start: {
    icon: Sparkles,
    iconColor: "text-amber-300",
    border: "border-amber-400/30",
    glow: "from-amber-300/25 via-yellow-300/10 to-transparent",
    pulse: "shadow-[0_0_25px_rgba(251,191,36,0.18)]",
    floatY: -4,
    labelClass: "bg-amber-300 text-black",
    label: "ДЛЯ НОВИЧКОВ",
  },
  popular: {
    icon: Gem,
    iconColor: "text-fuchsia-300",
    border: "border-fuchsia-400/30",
    glow: "from-fuchsia-300/25 via-violet-300/10 to-transparent",
    pulse: "shadow-[0_0_28px_rgba(217,70,239,0.18)]",
    floatY: -6,
    labelClass: "bg-fuchsia-400 text-white",
    label: "РЕКОМЕНДУЕМ",
  },
  best: {
    icon: Crown,
    iconColor: "text-emerald-300",
    border: "border-emerald-400/30",
    glow: "from-emerald-300/25 via-cyan-300/10 to-transparent",
    pulse: "shadow-[0_0_32px_rgba(52,211,153,0.2)]",
    floatY: -8,
    labelClass: "bg-emerald-400 text-black",
    label: "ДЛЯ ОЛДОВ",
  },
} as const;

const boosterPlans = [
  {
    id: 1,
    name: "БУСТЕР START",
    period: "7 дней",
    price: 69,
    accent: "from-amber-300/50 via-yellow-300/25 to-orange-400/20",
    badge: "Старт",
    vibe: "Быстрый вход",
    rarity: "start" as const,
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
    accent: "from-fuchsia-300/50 via-violet-300/25 to-purple-400/20",
    badge: "Популярно",
    vibe: "Самый выгодный месяц",
    rarity: "popular" as const,
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
    accent: "from-emerald-300/50 via-cyan-300/25 to-sky-400/20",
    badge: "Лучшее",
    vibe: "Максимальный статус",
    rarity: "best" as const,
    description: "Постоянный статус для тех, кто хочет остаться с проектом надолго.",
    highlights: [
      "Оформляется один раз и остаётся навсегда",
      "Максимально статусный вариант",
      "Лучший способ поддержать проект",
    ],
  },
] as const;

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
    icon: Shield,
    title: "1. База и честная игра",
    items: [
      "Игрок автоматически соглашается с правилами сервера и обязан их соблюдать.",
      "Запрещены читы, x-ray, дюпы, макросы, авто-рыбалка, баги и любые способы получить нечестное преимущество.",
      "Запрещены взлом, вход на чужой аккаунт, передача аккаунта и обход наказаний.",
    ],
  },
  {
    id: "voice",
    icon: Mic,
    title: "2. Обязательный голосовой мод",
    items: [
      "На сервере обязателен мод PlasmoVoice Chat.",
      "За отсутствие PlasmoVoice Chat вас могут кикнуть, а при игнорировании требования — выдать варн.",
      "Перед входом на сервер лучше сразу установить и проверить работу мода.",
    ],
  },
  {
    id: "behavior",
    icon: AlertTriangle,
    title: "3. Поведение и общение",
    items: [
      "Запрещены оскорбления, угрозы, провокации, спам, флуд и реклама.",
      "Нельзя распространять личную информацию, даже если она ложная.",
      "Запрещено оскорблять проект и упоминать сторонние ванильные проекты.",
    ],
  },
  {
    id: "donate",
    icon: Gem,
    title: "4. Донат и возможности",
    items: [
      "Нельзя покупать и продавать внутриигровые предметы, территории и ценности за реальные деньги.",
      "Исключение — донат на сервере и серверные возможности, оформленные администрацией.",
      "Подписка БУСТЕР на этом сайте является частью возможностей проекта и поддержки сервера.",
    ],
  },
  {
    id: "admin",
    icon: ScrollText,
    title: "5. Администрация",
    items: [
      "Администрация может менять наказание по своему усмотрению.",
      "Администрация имеет право заблокировать аккаунт без объяснения причин.",
      "Доказательства к наказанию могут не предоставляться.",
    ],
  },
] as const;

function MinecraftLogo({ theme }: { theme: "dark" | "light" }) {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-block">
      <div className="relative inline-flex flex-col gap-1">
        <div
          className={
            theme === "dark"
              ? "border-2 border-zinc-700 bg-zinc-950 px-4 py-2 shadow-[0_6px_0_0_rgba(0,0,0,0.35)]"
              : "border-2 border-zinc-300 bg-white px-4 py-2 shadow-[0_6px_0_0_rgba(0,0,0,0.12)]"
          }
        >
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-3 w-3 bg-emerald-500" />
              <div className="h-3 w-3 bg-emerald-700" />
              <div className="h-3 w-3 bg-zinc-700" />
              <div className="h-3 w-3 bg-zinc-900" />
            </div>
            <span
              className={
                theme === "dark"
                  ? "font-mono text-xl font-black tracking-[0.2em] text-white"
                  : "font-mono text-xl font-black tracking-[0.2em] text-zinc-950"
              }
            >
              ABOBAWORLD
            </span>
          </div>
        </div>
        <div className="ml-2 flex gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={i % 2 === 0 ? "h-2 w-8 bg-emerald-700" : "h-2 w-8 bg-zinc-700"} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function BlockReveal({ delay = 0 }: { delay?: number }) {
  const blocks = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
      {blocks.map((block) => (
        <motion.div
          key={block}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, delay: delay + block * 0.03, repeat: Infinity, repeatDelay: 4 }}
          className="absolute h-6 w-6 border border-white/10 bg-emerald-400/30"
          style={{ left: `${(block * 8) % 100}%`, top: `${(block * 17) % 100}%` }}
        />
      ))}
    </div>
  );
}

function FloatingParticles({ theme }: { theme: "dark" | "light" }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 6 + ((i * 7) % 18),
    left: `${(i * 13) % 100}%`,
    top: `${(i * 17) % 100}%`,
    duration: 6 + (i % 5),
    delay: (i % 6) * 0.4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={theme === "dark" ? "absolute rounded-none bg-white/10" : "absolute rounded-none bg-emerald-400/10"}
          style={{ width: p.size, height: p.size, left: p.left, top: p.top }}
          animate={{ y: [0, -24, 0], x: [0, 10, 0], opacity: [0.15, 0.45, 0.15], scale: [1, 1.15, 1] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function MinecraftWorldBackground({ theme }: { theme: "dark" | "light" }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 opacity-30">
        <div className="grid h-full grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`grass-${i}`}
              className={
                theme === "dark"
                  ? "border-r border-black/20 bg-gradient-to-b from-emerald-400/35 via-emerald-700/25 to-zinc-800/10"
                  : "border-r border-black/10 bg-gradient-to-b from-emerald-300/40 via-emerald-500/20 to-transparent"
              }
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 opacity-25">
        <div className="grid h-full grid-cols-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`stone-${i}`}
              className={
                theme === "dark"
                  ? "relative border-r border-black/20 bg-zinc-700/40"
                  : "relative border-r border-black/10 bg-zinc-300/40"
              }
            >
              <div className="absolute left-3 top-4 h-3 w-3 bg-sky-400/50" />
              <div className="absolute right-5 top-10 h-2 w-2 bg-emerald-400/50" />
              <div className="absolute left-10 bottom-6 h-3 w-3 bg-fuchsia-400/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CursorGlow({ x, y, theme }: { x: any; y: any; theme: "dark" | "light" }) {
  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{ x, y }}
      animate={{ opacity: [0.55, 0.4, 0.55] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className={theme === "dark" ? "h-full w-full rounded-full bg-emerald-400/20" : "h-full w-full rounded-full bg-emerald-300/25"} />
    </motion.div>
  );
}

function playHoverSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = 520;
    gain.gain.value = 0.0001;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.exponentialRampToValueAtTime(0.015, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    oscillator.start(now);
    oscillator.stop(now + 0.08);
    setTimeout(() => ctx.close().catch(() => {}), 120);
  } catch (e) {
    console.error(e);
  }
}

function PixelButton({ children, className = "", onMouseEnter, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      onMouseEnter={(e) => {
        playHoverSound();
        onMouseEnter?.(e);
      }}
      className={`rounded-none border-b-4 border-r-4 border-black/40 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:border-b-2 active:border-r-2 ${className}`}
    >
      {children}
    </Button>
  );
}

function PixelCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <Card className={`rounded-none border-2 shadow-2xl ${className}`}>{children}</Card>;
}

function CopyIpButton({ theme }: { theme: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("mc.abobaworld.xyz");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PixelButton
      onClick={handleCopy}
      variant="secondary"
      className={theme === "dark" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-white text-zinc-950 hover:bg-zinc-100"}
    >
      <Copy className="mr-2 h-4 w-4" />
      {copied ? "Скопировано" : "Скопировать IP"}
    </PixelButton>
  );
}

function TermsDialog({ theme }: { theme: "dark" | "light" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={
            theme === "dark"
              ? "text-xs underline underline-offset-4 text-zinc-300 hover:text-white"
              : "text-xs underline underline-offset-4 text-zinc-600 hover:text-zinc-950"
          }
        >
          Полные условия покупки
        </button>
      </DialogTrigger>
      <DialogContent
        className={
          theme === "dark"
            ? "border-zinc-700 bg-zinc-950 text-white sm:max-w-2xl"
            : "border-zinc-200 bg-white text-zinc-950 sm:max-w-2xl"
        }
      >
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-2xl text-white" : "text-2xl text-zinc-950"}>
            Условия покупки подписки БУСТЕР
          </DialogTitle>
          <DialogDescription className={theme === "dark" ? "text-zinc-300" : "text-zinc-700"}>
            Ознакомьтесь с условиями до оформления цифровой подписки.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm leading-7">
          {[
            "Подписка БУСТЕР является цифровой серверной услугой для проекта AbobaWorld.",
            "Покупатель обязан указать корректный никнейм Minecraft. Активация выполняется для указанного никнейма.",
            "При ошибке в никнейме, допущенной покупателем, автоматическая выдача может быть невозможна без участия администрации.",
            "Доступ к возможностям подписки зависит от выбранного тарифа: неделя, месяц или навсегда.",
            "Покупка означает согласие с правилами сервера, условиями активации и внутренними правилами проекта.",
            "Возврат цифровой услуги возможен только при технической ошибке, двойном списании или иной подтверждённой проблеме по решению администрации.",
            "Администрация вправе отказать в обслуживании при нарушении правил сервера или попытке злоупотребления покупкой.",
          ].map((item) => (
            <div key={item} className={theme === "dark" ? "border-2 border-zinc-800 bg-zinc-900 p-4" : "border-2 border-zinc-200 bg-zinc-50 p-4"}>
              {item}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BoosterDialog({ plan, theme }: { plan: (typeof boosterPlans)[number]; theme: "dark" | "light" }) {
  const [nickname, setNickname] = useState("");
  const [accepted, setAccepted] = useState(false);
  const orderId = useMemo(() => `BOOST-${plan.id}-${Math.floor(100000 + Math.random() * 900000)}`, [plan.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <PixelButton className="w-full bg-emerald-300 text-black hover:bg-emerald-200">Оформить БУСТЕР</PixelButton>
      </DialogTrigger>
      <DialogContent
        className={
          theme === "dark"
            ? "max-h-[85vh] overflow-y-auto border-zinc-700 bg-zinc-950 text-white sm:max-w-lg"
            : "max-h-[85vh] overflow-y-auto border-zinc-200 bg-white text-zinc-950 sm:max-w-lg"
        }
      >
        <DialogHeader>
          <DialogTitle className={theme === "dark" ? "text-2xl text-white" : "text-2xl text-zinc-950"}>{plan.name}</DialogTitle>
          <DialogDescription className={theme === "dark" ? "text-zinc-200" : "text-zinc-700"}>{plan.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className={theme === "dark" ? "rounded-none border-2 border-zinc-700 bg-zinc-900 p-4" : "rounded-none border-2 border-zinc-200 bg-zinc-50 p-4"}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className={theme === "dark" ? "text-lg font-semibold text-white" : "text-lg font-semibold text-zinc-950"}>{plan.name}</div>
                <div className={theme === "dark" ? "text-sm text-zinc-200" : "text-sm text-zinc-700"}>{plan.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className="rounded-none bg-emerald-300 px-3 py-1 text-black">{plan.price} ₽</Badge>
                <span className={theme === "dark" ? "text-xs text-zinc-300" : "text-xs text-zinc-600"}>{plan.period}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className={theme === "dark" ? "text-sm font-medium text-white" : "text-sm font-medium text-zinc-950"}>Никнейм в Minecraft</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16))}
              placeholder="Например: Steve"
              className={
                theme === "dark"
                  ? "rounded-none border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400"
                  : "rounded-none border-zinc-200 bg-white text-zinc-950 placeholder:text-zinc-500"
              }
            />
            <p className={theme === "dark" ? "text-xs text-zinc-300" : "text-xs text-zinc-600"}>Ник можно вводить только латиницей, цифрами и символом _</p>
          </div>

          <label
            className={
              theme === "dark"
                ? "flex items-start gap-3 rounded-none border-2 border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-100"
                : "flex items-start gap-3 rounded-none border-2 border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800"
            }
          >
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
            <span>
              Я принимаю условия покупки, соглашаюсь с правилами сервера, понимаю, что цифровая подписка активируется для указанного никнейма, а возврат возможен только по решению администрации при технической ошибке.
            </span>
          </label>

          <TermsDialog theme={theme} />

          <div className="rounded-none border-2 border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-900">
            <div className="font-semibold">Что входит в подписку</div>
            <div className="mt-2 grid gap-2">
              {boosterFeatures.map((feature) => (
                <div key={feature}>{feature}</div>
              ))}
            </div>
          </div>

          <div className={theme === "dark" ? "rounded-none border-2 border-zinc-700 bg-zinc-900 p-4" : "rounded-none border-2 border-zinc-200 bg-zinc-50 p-4"}>
            <div className={theme === "dark" ? "text-sm font-semibold text-white" : "text-sm font-semibold text-zinc-950"}>Почему выбрать этот вариант</div>
            <div className="mt-3 grid gap-2">
              {plan.highlights.map((item) => (
                <div key={item} className={theme === "dark" ? "border border-zinc-800 bg-black/20 px-3 py-2 text-sm text-zinc-200" : "border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className={theme === "dark" ? "rounded-none border-2 border-zinc-700 bg-black/30 p-4 text-sm text-zinc-200" : "rounded-none border-2 border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700"}>
            <div>
              Номер заказа: <span className={theme === "dark" ? "font-mono text-white" : "font-mono text-zinc-950"}>{orderId}</span>
            </div>
            <div className="mt-1">Статус: демо-макет страницы</div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <div className={theme === "dark" ? "text-xs text-zinc-300" : "text-xs text-zinc-600"}>
            Покупая подписку, вы подтверждаете правильность никнейма, согласие с правилами проекта и условиями активации цифровой услуги.
          </div>
          <PixelButton disabled={!nickname || !accepted} className="bg-emerald-300 text-black hover:bg-emerald-200">
            Перейти к оплате
          </PixelButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AbobaWorldSite() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 18 });
  const parallaxX = useTransform(springX, [-200, 200], [-16, 16]);
  const parallaxY = useTransform(springY, [-200, 200], [-16, 16]);
  const parallaxXInverse = useTransform(parallaxX, (v) => -v);
  const parallaxYInverse = useTransform(parallaxY, (v) => -v);
  const cursorX = useTransform(mouseX, (v) => v + viewport.width / 2);
  const cursorY = useTransform(mouseY, (v) => v + viewport.height / 2);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const textMain = theme === "dark" ? "text-white" : "text-zinc-950";
  const textSoft = theme === "dark" ? "text-zinc-100" : "text-zinc-700";
  const textMuted = theme === "dark" ? "text-zinc-300" : "text-zinc-600";
  const cardBase = theme === "dark" ? "border-zinc-800 bg-zinc-950/88 text-white" : "border-zinc-200 bg-white/92 text-zinc-950 shadow-sm";

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      className={
        theme === "dark"
          ? "min-h-screen overflow-hidden bg-[#09090b] text-white transition-colors duration-500"
          : "min-h-screen overflow-hidden bg-[#f2f6f3] text-zinc-950 transition-colors duration-500"
      }
    >
      <div
        className={
          theme === "dark"
            ? "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"
            : "absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-[size:40px_40px]"
        }
      />
      <MinecraftWorldBackground theme={theme} />
      <FloatingParticles theme={theme} />
      <CursorGlow x={cursorX} y={cursorY} theme={theme} />

      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className={
          theme === "dark"
            ? "pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
            : "pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl"
        }
      />
      <motion.div
        style={{ x: parallaxXInverse, y: parallaxYInverse }}
        className={
          theme === "dark"
            ? "pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
            : "pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
        }
      />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className={theme === "dark" ? "sticky top-4 z-20 mb-8 border-2 border-zinc-800 bg-black/60 backdrop-blur-xl" : "sticky top-4 z-20 mb-8 border-2 border-zinc-200 bg-white/85 backdrop-blur-xl shadow-sm"}>
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ rotate: -6, scale: 1.04 }} className={theme === "dark" ? "flex h-11 w-11 items-center justify-center border-2 border-zinc-700 bg-white/10" : "flex h-11 w-11 items-center justify-center border-2 border-zinc-200 bg-zinc-100"}>
                <Crown className="h-6 w-6" />
              </motion.div>
              <div className="flex flex-col gap-2">
                <MinecraftLogo theme={theme} />
                <div className={`text-sm ${textMuted}`}>Ванильный Minecraft сервер</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <nav className={`flex flex-wrap gap-2 ${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}>
                <a href="#booster" className="border border-transparent px-3 py-2 transition hover:border-current hover:bg-white/10">Титулы</a>
                <a href="#rules" className="border border-transparent px-3 py-2 transition hover:border-current hover:bg-white/10">Правила</a>
                <a href="#start" className="border border-transparent px-3 py-2 transition hover:border-current hover:bg-white/10">Как начать</a>
                <a href="#about" className="border border-transparent px-3 py-2 transition hover:border-current hover:bg-white/10">О сервере</a>
                <a href="#contact" className="border border-transparent px-3 py-2 transition hover:border-current hover:bg-white/10">Администрация</a>
              </nav>

              <PixelButton variant="secondary" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className={theme === "dark" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-white text-zinc-900 hover:bg-zinc-100"}>
                {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              </PixelButton>
            </div>
          </div>
        </header>

        <section className="grid items-center gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className={theme === "dark" ? "mb-4 rounded-none border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-emerald-50" : "mb-4 rounded-none border border-emerald-400/40 bg-emerald-100 px-3 py-1 text-emerald-800"}>
                Сервер онлайн • Версия 1.21.4
              </Badge>
              <h1 className={`max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl ${textMain}`}>
                Добро пожаловать на <span className="text-emerald-300">AbobaWorld</span>
              </h1>
              <p className={`mt-5 max-w-3xl text-base leading-7 sm:text-lg ${textSoft}`}>
                Уютный ванильный Minecraft-сервер с живым комьюнити, честной игрой, красивыми постройками и атмосферой, куда хочется возвращаться снова. Заходи, развивайся, строй, общайся и становись частью мира AbobaWorld.
              </p>

              <div className={theme === "dark" ? "mt-5 max-w-3xl border-2 border-emerald-500/30 bg-emerald-500/10 p-4" : "mt-5 max-w-3xl border-2 border-emerald-300 bg-emerald-50 p-4"}>
                <div className="mb-2 flex items-center gap-2 font-semibold text-emerald-400">
                  <Mic className="h-4 w-4" />
                  Важно перед входом
                </div>
                <p className={theme === "dark" ? "text-zinc-100" : "text-zinc-800"}>
                  На сервере обязателен мод <strong>PlasmoVoice Chat</strong>. За отсутствие “PlasmoVoice Chat” вас могут кикнуть, или даже дать варн в случае игнорирования.
                </p>
              </div>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-3">
              <CopyIpButton theme={theme} />
              <div className={theme === "dark" ? "flex items-center gap-3 border-2 border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100" : "flex items-center gap-3 border-2 border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-800"}>
                <Wifi className="h-4 w-4" />
                <span>Онлайн</span>
                <span className="opacity-80">•</span>
                <span>TPS 20.0</span>
                <span className="opacity-80">•</span>
                <span>тест</span>
                <span className="opacity-80">•</span>
                <span>Игроков 27/100</span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Server, label: "IP сервера", value: "mc.abobaworld.xyz" },
                { icon: Sparkles, label: "Версия", value: "1.21.4" },
                { icon: Stars, label: "Атмосфера", value: "Ваниль + комьюнити" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} whileHover={{ y: -6, scale: 1.02 }} className="relative">
                    <BlockReveal delay={i * 0.1} />
                    <PixelCard className={cardBase}>
                      <CardContent className="p-4">
                        <Icon className={theme === "dark" ? "mb-3 h-5 w-5 text-zinc-100" : "mb-3 h-5 w-5 text-zinc-800"} />
                        <div className={`text-sm ${textMuted}`}>{stat.label}</div>
                        <div className={`mt-1 break-all text-lg font-semibold ${textMain}`}>{stat.value}</div>
                      </CardContent>
                    </PixelCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} whileHover={{ y: -6 }} className="relative">
            <BlockReveal delay={0.2} />
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/20 via-fuchsia-400/10 to-cyan-400/10 blur-2xl" />
            <PixelCard className={`${cardBase} relative overflow-hidden backdrop-blur-xl`}>
              <CardHeader>
                <CardTitle className={`text-2xl ${textMain}`}>Почему сюда хочется зайти</CardTitle>
                <CardDescription className={textSoft}>
                  Здесь не просто сервер, а место, где можно спокойно играть, строить историю своего мира и знакомиться с людьми, которые тоже любят ванильный Minecraft.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Ламповое выживание и приятная атмосфера",
                  "Понятные правила и упор на честную игру",
                  "Общение через Discord и голосовой мод",
                  "Титулы и дополнительные возможности для поддержки проекта",
                ].map((item) => (
                  <motion.div key={item} whileHover={{ x: 4 }} className={theme === "dark" ? "flex items-start gap-3 border-2 border-zinc-800 bg-zinc-900 p-3" : "flex items-start gap-3 border-2 border-zinc-200 bg-zinc-50 p-3"}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <span className={`text-sm ${textSoft}`}>{item}</span>
                  </motion.div>
                ))}
              </CardContent>
            </PixelCard>
          </motion.div>
        </section>

        <section id="booster" className="py-10 lg:py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className={`text-sm uppercase tracking-[0.2em] ${textMuted}`}>Титулы и поддержка</div>
              <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${textMain}`}>Три версии БУСТЕРА</h2>
              <p className={`mt-3 max-w-2xl ${textSoft}`}>
                Выбери вариант под свой стиль игры: быстрый старт, выгодный месяц или постоянный статус без ограничений по времени.
              </p>
            </div>
            <Badge className="rounded-none border border-white/20 bg-white/10 px-3 py-1 text-white">3 версии • 3 уровня ценности</Badge>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <motion.div whileHover={{ y: -6 }} className="relative">
              <BlockReveal delay={0.3} />
              <PixelCard className={`${cardBase} overflow-hidden`}>
                <div className="grid grid-cols-2 border-b-2 border-zinc-800">
                  {[
                    { icon: Crown, text: "СТАТУС" },
                    { icon: Trophy, text: "ПРИВИЛЕГИИ" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className={theme === "dark" ? "flex flex-col items-center gap-2 border-r-2 border-zinc-800 bg-zinc-900 px-4 py-4 last:border-r-0" : "flex flex-col items-center gap-2 border-r-2 border-zinc-200 bg-zinc-50 px-4 py-4 last:border-r-0"}>
                        <Icon className="h-5 w-5 text-emerald-300" />
                        <span className={`text-xs font-bold tracking-[0.18em] ${textMuted}`}>{item.text}</span>
                      </div>
                    );
                  })}
                </div>
                <CardContent className="p-6">
                  <div className="mb-5 inline-flex border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">ЛИНЕЙКА ПОДПИСОК</div>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className={`text-3xl font-bold ${textMain}`}>Три версии для разных игроков</h3>
                      <p className={`mt-2 max-w-2xl ${textSoft}`}>
                        START подойдёт для знакомства, PLUS — для активной игры, а ULTRA — для тех, кто хочет забрать максимальный статус на проекте.
                      </p>
                    </div>
                    <div className={theme === "dark" ? "border-2 border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100" : "border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"}>
                      Каждая версия ощущается по-разному
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {boosterFeatures.map((feature) => (
                      <motion.div key={feature} whileHover={{ x: 4 }} className={theme === "dark" ? "flex items-start gap-3 border-2 border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-100" : "flex items-start gap-3 border-2 border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800"}>
                        {feature.includes("/disc") ? <Music4 className="mt-0.5 h-4 w-4 text-fuchsia-300" /> : <Diamond className="mt-0.5 h-4 w-4 text-emerald-300" />}
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {[
                      { title: "Фишки", value: "Своя голова, сохранение инвентаря, особый статус" },
                      { title: "Преимущества", value: "Удобные возможности, красивое оформление и больше уникальности" },
                      { title: "Зачем брать", value: "Поддержка проекта и заметный образ на сервере" },
                    ].map((box) => (
                      <div key={box.title} className={theme === "dark" ? "border-2 border-emerald-500/20 bg-emerald-500/10 p-4" : "border-2 border-emerald-300 bg-emerald-50 p-4"}>
                        <div className="text-xs font-bold tracking-[0.18em] text-emerald-400">{box.title}</div>
                        <div className={theme === "dark" ? "mt-2 text-sm text-zinc-100" : "mt-2 text-sm text-zinc-800"}>{box.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </PixelCard>
            </motion.div>

            <div className="grid gap-6">
              {boosterPlans.map((plan, idx) => {
                const rarity = rarityStyles[plan.rarity];
                const RarityIcon = rarity.icon;

                return (
                  <motion.div
                    key={plan.id}
                    className="relative"
                    whileHover={{ y: -6, scale: 1.02 }}
                    animate={{ y: [0, rarity.floatY, 0], scale: [1, 1.01, 1] }}
                    transition={{ duration: 2.8 + idx * 0.35, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <BlockReveal delay={0.15 * idx} />
                    <PixelCard className={`${cardBase} overflow-hidden ${rarity.border} ${rarity.pulse}`}>
                      <div className={`relative h-28 bg-gradient-to-br ${plan.accent} border-b-2 border-black/20`}>
                        <div className={`absolute inset-0 bg-gradient-to-r ${rarity.glow}`} />
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <Badge className={`rounded-none px-3 py-1 text-[10px] font-bold tracking-[0.18em] ${rarity.labelClass}`}>
                            {rarity.label}
                          </Badge>
                          <RarityIcon className={`h-4 w-4 ${rarity.iconColor}`} />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                          <div>
                            <div className={`text-xl font-black leading-none ${textMain}`}>{plan.name}</div>
                            <div className={`mt-2 text-xs font-semibold tracking-[0.14em] ${textMuted}`}>{plan.vibe}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-black leading-none ${textMain}`}>{plan.price}₽</div>
                            <div className={`mt-2 text-xs font-medium ${textSoft}`}>{plan.period}</div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="grid gap-2">
                          {plan.highlights.map((line) => (
                            <div key={line} className={theme === "dark" ? "border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200" : "border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"}>
                              {line}
                            </div>
                          ))}
                        </div>

                        <div className="mt-5">
                          <BoosterDialog plan={plan} theme={theme} />
                        </div>
                      </CardContent>
                    </PixelCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="start" className="py-10 lg:py-16">
          <div className="mb-6">
            <div className={`text-sm uppercase tracking-[0.2em] ${textMuted}`}>Как начать играть</div>
            <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${textMain}`}>Старт за пару минут</h2>
            <p className={`mt-3 max-w-3xl ${textSoft}`}>Всё просто: подготовь игру, поставь голосовой мод и заходи на сервер. Ниже быстрые шаги для старта.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Gamepad2, title: "1. Установить Minecraft", text: "Запусти Minecraft Java Edition версии 1.21.4 и подготовь клиент к игре." },
              { icon: Download, title: "2. Поставить PlasmoVoice", text: "Установи мод PlasmoVoice Chat, потому что без него тебя могут кикнуть или выдать варн при игнорировании." },
              { icon: LogIn, title: "3. Зайти по IP", text: "Добавь сервер mc.abobaworld.xyz в список и заходи в мир AbobaWorld." },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} whileHover={{ y: -6 }} className="relative">
                  <BlockReveal delay={0.12 * idx} />
                  <PixelCard className={cardBase}>
                    <CardContent className="p-6">
                      <div className={theme === "dark" ? "mb-4 flex h-12 w-12 items-center justify-center border-2 border-zinc-700 bg-white/10" : "mb-4 flex h-12 w-12 items-center justify-center border-2 border-zinc-200 bg-zinc-100"}>
                        <Icon className={`h-6 w-6 ${textMain}`} />
                      </div>
                      <h3 className={`text-xl font-semibold ${textMain}`}>{step.title}</h3>
                      <p className={`mt-3 leading-7 ${textSoft}`}>{step.text}</p>
                    </CardContent>
                  </PixelCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="about" className="py-10 lg:py-16">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: Shield, title: "Честная игра", text: "На сервере ценятся адекватность, уважение к другим игрокам и игра без нечестных преимуществ." },
              { icon: Crown, title: "Титулы и поддержка", text: "Здесь можно не только играть, но и красиво выделиться на сервере, поддерживая развитие проекта." },
              { icon: Server, title: "Живой мир", text: "Постройки, города, общение, совместные истории и уютное выживание — всё это делает AbobaWorld местом, куда хочется возвращаться." },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} whileHover={{ y: -6 }} className="relative">
                  <BlockReveal delay={0.1 * idx} />
                  <PixelCard className={cardBase}>
                    <CardContent className="p-6">
                      <div className={theme === "dark" ? "mb-4 flex h-12 w-12 items-center justify-center border-2 border-zinc-700 bg-white/10" : "mb-4 flex h-12 w-12 items-center justify-center border-2 border-zinc-200 bg-zinc-100"}>
                        <Icon className={`h-6 w-6 ${textMain}`} />
                      </div>
                      <h3 className={`text-xl font-semibold ${textMain}`}>{item.title}</h3>
                      <p className={`mt-3 leading-7 ${textSoft}`}>{item.text}</p>
                    </CardContent>
                  </PixelCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="py-10 lg:py-16">
          <div className="mb-6">
            <div className={`text-sm uppercase tracking-[0.2em] ${textMuted}`}>Связь с администрацией</div>
            <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${textMain}`}>Нужна помощь или хочешь влиться в комьюнити?</h2>
            <p className={`mt-3 max-w-3xl ${textSoft}`}>Присоединяйся к Discord сервера, задавай вопросы, общайся с игроками и связывайся с администрацией напрямую.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
              <BlockReveal delay={0.2} />
              <PixelCard className={cardBase}>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center border-2 border-indigo-400/30 bg-indigo-500/15">
                    <MessageCircle className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className={`text-2xl font-bold ${textMain}`}>Discord сервера</h3>
                  <p className={`mt-3 ${textSoft}`}>Основной способ связи с администрацией и игроками проекта.</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <PixelButton onClick={() => window.open("https://discord.gg/yy5JGzGz", "_blank", "noopener,noreferrer")} className="bg-indigo-500 text-white hover:bg-indigo-400">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Перейти в Discord
                    </PixelButton>
                  </div>
                </CardContent>
              </PixelCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }} className="relative">
              <BlockReveal delay={0.35} />
              <PixelCard className={cardBase}>
                <CardContent className="p-6">
                  <h3 className={`text-2xl font-bold ${textMain}`}>Теги администрации</h3>
                  <div className="mt-5 grid gap-3">
                    {["@casper_932", "@neznaiu_gg"].map((admin) => (
                      <motion.div key={admin} whileHover={{ x: 4 }} className={theme === "dark" ? "border-2 border-zinc-800 bg-zinc-900 p-4 text-zinc-100" : "border-2 border-zinc-200 bg-zinc-50 p-4 text-zinc-800"}>
                        {admin}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </PixelCard>
            </motion.div>
          </div>
        </section>

        <section id="rules" className="py-10 lg:py-16">
          <div className="mb-6">
            <div className={`text-sm uppercase tracking-[0.2em] ${textMuted}`}>Правила сервера</div>
            <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${textMain}`}>Краткая версия правил AbobaWorld</h2>
            <p className={`mt-3 max-w-3xl ${textSoft}`}>Самое важное собрано ниже: играй честно, уважай игроков, соблюдай правила сервера и не забывай про обязательный PlasmoVoice Chat.</p>
          </div>

          <PixelCard className={cardBase}>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {ruleGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <AccordionItem key={group.id} value={group.id} className={theme === "dark" ? "border-zinc-800" : "border-zinc-200"}>
                      <AccordionTrigger className={`text-left text-lg hover:no-underline ${textMain}`}>
                        <div className="flex items-center gap-3">
                          <div className={theme === "dark" ? "flex h-10 w-10 items-center justify-center border-2 border-zinc-700 bg-white/5" : "flex h-10 w-10 items-center justify-center border-2 border-zinc-200 bg-zinc-100"}>
                            <Icon className={`h-5 w-5 ${textMain}`} />
                          </div>
                          <span>{group.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-3 pt-2">
                          {group.items.map((item) => (
                            <div key={item} className={theme === "dark" ? "border-2 border-zinc-800 bg-zinc-900 p-4 text-sm leading-7 text-zinc-100" : "border-2 border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-800"}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </PixelCard>
        </section>

        <footer className={theme === "dark" ? "border-t-2 border-zinc-800 bg-black/50" : "border-t-2 border-zinc-200 bg-white/70"}>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className={`text-xl font-black tracking-[0.18em] ${textMain}`}>ABOBAWORLD</div>
                <p className={`mt-2 max-w-2xl ${textSoft}`}>© 2026 AbobaWorld. Ванильный Minecraft-сервер с атмосферой, комьюнити и своими фишками.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <CopyIpButton theme={theme} />
                <PixelButton onClick={() => window.open("https://discord.gg/yy5JGzGz", "_blank", "noopener,noreferrer")} className="bg-indigo-500 text-white hover:bg-indigo-400">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Discord
                </PixelButton>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
