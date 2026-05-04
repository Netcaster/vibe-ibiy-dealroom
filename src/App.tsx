import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, ShieldCheck, ArrowRight, ArrowLeft, Droplets, QrCode, Wallet,
  Trophy, HeartHandshake, Building2, Plane, Hotel, Activity, Menu, X,
  Download, Eye, FileText, BarChart3, Coins, Gauge, Users, PenLine,
  DollarSign, CheckCircle2, Clock3, Send, BriefcaseBusiness, Sun, Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────
interface TenantConfig { name: string; subtitle: string; eyebrow: string; }

interface SlideData {
  eyebrow: string; title: string; subtitle?: string; body?: string;
  stat?: string; bullets?: string[]; cards?: [string, string][]; icon: React.ElementType;
}

// ── Theme Context ────────────────────────────────────────────────────────
interface ThemeCtx { isDark: boolean; toggle: () => void; }
const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggle: () => {} });
const useTheme = () => useContext(ThemeContext);

// ── Tenant Configs ────────────────────────────────────────────────────────
const TENANTS: Record<string, TenantConfig> = {
  "VIBE-IBIY-2026":    { name: "VIBE × IBIY",   subtitle: "Connected Consumption Network", eyebrow: "Investor Deal Room"        },
  "TPG-VIBE-ACCESS":   { name: "TPG × VIBE",    subtitle: "Enterprise Consortium Access",  eyebrow: "TPG Partner Portal"        },
  "IBIY-PILOT":        { name: "IBIY Pilot",    subtitle: "Bracelet · Wallet · Access",    eyebrow: "Pilot Program Access"      },
  "DEALROOM-TPG-2026": { name: "TPG Deal Room", subtitle: "Restricted Investor Access",   eyebrow: "Strategic Investor Portal" },
};

// ── Access Codes ──────────────────────────────────────────────────────────
const ACCESS_CODES = new Set(["VIBE-IBIY-2026", "TPG-VIBE-ACCESS", "IBIY-PILOT", "DEALROOM-TPG-2026"]);

// ── Slide Data ────────────────────────────────────────────────────────────
const slides: SlideData[] = [
  { eyebrow: "Investor Kill Shot", title: "VIBE × IBIY", subtitle: "Connected Consumption Network", body: "Every can becomes a digital access point into identity, rewards, community, health, commerce, events, and impact.", stat: "Drink → Scan → Activate → Earn → Redeem → Repeat", icon: Droplets },
  { eyebrow: "Problem", title: "Beverage Brands Buy Attention. They Do Not Own Relationships.", subtitle: "Retail velocity is expensive, fragmented, and difficult to retain.", bullets: ["Traditional beverage marketing creates trial but weak consumer ownership.", "Retail distribution introduces slotting, margin compression, and limited data.", "Consumers receive no durable identity, rewards, or economic participation.", "Brands spend heavily to reacquire the same customer again and again."], icon: Eye },
  { eyebrow: "The Shift", title: "Consumption Becomes Connection.", subtitle: "VIBE is not only a beverage. It is an access rail.", body: "A QR-enabled VIBE can links directly to the IBIY bracelet, wallet, rewards engine, VIBE Network channel, and TPG ecosystem environments.", stat: "Every Can = A Key", icon: QrCode },
  { eyebrow: "System Architecture", title: "Four Layers. One Closed Loop.", subtitle: "Physical product, digital identity, community engagement, ecosystem monetization.", cards: [["VIBE", "Distribution + acquisition layer"], ["IBIY", "Bracelet, identity, access, wallet"], ["VIBE Network", "Community, rewards, content, commerce"], ["TPG Ecosystem", "HTES, R.I.S.E., VIPTIO, events, hospitality"]], icon: ShieldCheck },
  { eyebrow: "Product", title: "Premium Hydration + Energy With Built-In Digital Utility.", subtitle: "Launch stack designed for controlled environments first, retail second.", bullets: ["VIBE Water as flagship lifestyle and hydration product.", "VIBE Energy and Zero Sugar as functional expansion SKUs.", "IBIY-enabled QR and access language on every pilot can.", "Limited pilot allocation for hospitality, events, campuses, and R.I.S.E. sites."], icon: Droplets },
  { eyebrow: "IBIY Integration", title: "Bracelet Community Becomes The Companion Layer For Every Can.", subtitle: "The can initiates participation. The bracelet extends retention.", bullets: ["Scan can to activate or connect IBIY bracelet.", "Users receive wallet, rewards profile, and VIBE Network community access.", "Bracelet can unlock event entry, partner discounts, health benefits, and marketplace offers.", "Digital bracelet option allows lower-cost pilot onboarding before physical bracelet scale-up."], icon: Wallet },
  { eyebrow: "Gamification", title: "The Reward Engine Turns Trial Into Habit.", subtitle: "Instant gratification, streaks, tiers, prize pools, and community wins.", cards: [["Instant", "Free offers, discounts, bonus points"], ["Engagement", "Event tickets, hotel upgrades, VIP access"], ["High Value", "Cash/token rewards, phones, travel packages"], ["Grand Prize", "Car, major cash prize, or lifetime VIP tier"]], icon: Trophy },
  { eyebrow: "Distribution Advantage", title: "Controlled Environments Beat Shelf Competition.", subtitle: "We do not start by fighting for retail shelf space. We deploy where TPG already controls attention.", cards: [["Hotels", "In-room, VIP suites, lounges, minibars"], ["Events", "GCC, HTES, watch parties, ARIA cycles"], ["Airports", "Kiosks, device bundles, travel offers"], ["Campuses + R.I.S.E.", "Community adoption, impact, repeat usage"]], icon: Hotel },
  { eyebrow: "Economics", title: "Margin Is Only The First Monetization Layer.", subtitle: "Product margin, experience margin, marketplace margin, and identity value compound together.", bullets: ["Illustrative landed cost: approximately $0.45 per unit based on pilot order assumptions.", "Blended retail equivalent: approximately $2.50+ per unit depending on channel and bundle structure.", "Reward pool funded by a small per-can allocation plus sponsor contributions and ecosystem inventory.", "The larger asset is customer acquisition into VIBE Network, IBIY, HTES, and R.I.S.E. environments."], stat: "Product Margin + Data + Access + Marketplace + Impact", icon: Activity },
  { eyebrow: "High Touch Layer", title: "Every Can Can Fund Real-World Impact.", subtitle: "Purpose becomes visible, measurable, and tied to participation.", bullets: ["A defined portion of proceeds supports IBIY-aligned causes and organizations.", "Dashboard shows participant impact: meals, telehealth sessions, prescription support, housing support.", "R.I.S.E. environments can use VIBE + IBIY as onboarding, benefits, and utility rails.", "High Tech monetization and High Touch mission reinforce each other instead of competing."], icon: HeartHandshake },
  { eyebrow: "Pilot Rollout", title: "Limited Pilot Before Full Network Scale.", subtitle: "Prove conversion, engagement, redemption, and repeat behavior inside controlled environments.", cards: [["Phase 1", "100K QR-enabled cans + digital bracelet onboarding"], ["Phase 2", "1M+ units across HTES, campuses, events, and hospitality"], ["Phase 3", "U.S. co-pack, national accounts, and sponsor-funded prize pools"], ["Phase 4", "Canada, Mexico, South America option expansion"]], icon: Plane },
  { eyebrow: "The Ask", title: "Launch The First Connected Consumption Network.", subtitle: "The objective is not to sell beverages. The objective is to activate people.", body: "VIBE × IBIY gives TPG a physical product that becomes a network channel, a community rail, a rewards engine, an impact vehicle, and a monetizable gateway into every ecosystem environment.", stat: "We do not sell drinks. We activate people.", icon: Building2 },
];

const docs = [
  ["Investor Deck", "Web presentation and printable PDF version", "Ready"],
  ["Pilot Overview", "100K-can limited activation scope", "Ready"],
  ["Token + Points Memo", "Rewards, utility, and compliance-safe points-first model", "Draft"],
  ["Manufacturing Packet", "SKU, MOQ, lead time, label, and compliance package", "Draft"],
  ["IBIY Integration MOU", "Bracelet, wallet, community, and companion access layer", "Pending"],
  ["Cause Allocation Policy", "Proceed contribution framework for supported organizations", "Draft"],
];

const pipeline = [
  ["Strategic Investor A", "$500K", "Deck Opened", "82%"],
  ["Family Office B", "$1.5M", "Diligence", "64%"],
  ["Brand Sponsor C", "$250K", "Intro Sent", "31%"],
  ["Hospitality Partner D", "$750K", "Term Sheet", "88%"],
];

const activityLog = [
  ["Today", "Strategic Investor A opened Investor Deck", "High intent"],
  ["Today", "Family Office B viewed Token + Economics for 7m 42s", "Follow up"],
  ["Yesterday", "Hospitality Partner D downloaded Pilot Overview", "Term sheet stage"],
  ["Yesterday", "Brand Sponsor C opened Document Vault", "Needs call"],
  ["2 days ago", "Investor group accessed Deal Room from private link", "New lead"],
];

const capitalStack = [
  ["Pilot Inventory Financing", 750000, 500000, "Product, freight, QR packaging, launch allocation"],
  ["Sponsor + Prize Pool", 250000, 125000, "Rewards, car/cash prize, event packages, influencer activation"],
  ["Technology + Wallet Layer", 500000, 200000, "IBIY integration, VIBE Network, CRM, dashboard, QR system"],
  ["Marketing + HTES Activation", 1000000, 350000, "Hotels, events, airports, campuses, media, launch night"],
];

function money(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

// ── Theme Toggle Button ───────────────────────────────────────────────────
function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className={cn(
        "shrink-0 rounded-2xl border transition flex items-center gap-2",
        compact ? "p-2" : "px-4 py-3 text-sm",
        "bg-white/5 dark:bg-white/5 text-white/70 dark:text-white/70 border-white/10 dark:border-white/10",
        "hover:bg-white/10 dark:hover:bg-white/10"
      )}
      aria-label="Toggle day/night"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {!compact && <span>{isDark ? "Day" : "Night"}</span>}
    </button>
  );
}

// ── Access Wall ───────────────────────────────────────────────────────────
function AccessWall({ onUnlock }: { onUnlock: (code: string) => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (ACCESS_CODES.has(normalized)) {
      sessionStorage.setItem("vibe_ibiy_dealroom_access", normalized);
      onUnlock(normalized);
      return;
    }
    setError("Access code not recognized. Please request investor access from TPG.");
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ background: "var(--grad-main)" }}>
      {/* mesh grid */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      {/* theme toggle top-right */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle compact />
      </div>

      <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full max-w-xl">
          <Card className="border-white/15 backdrop-blur-xl text-white rounded-2xl shadow-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Restricted Access</p>
                  <h1 className="text-2xl md:text-3xl font-semibold text-white">VIBE × IBIY Deal Room</h1>
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl font-black leading-tight mb-5 text-white">Investor Access Portal</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">Enter your access code to open the investor portal, web deck, economics simulator, document vault, and commitment tracker.</p>

              <form onSubmit={submit} className="space-y-4">
                <input
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(""); }}
                  placeholder="Enter access code"
                  className="w-full rounded-2xl px-5 py-4 outline-none text-white"
                  style={{ background: "var(--c-input)", border: "1px solid var(--c-input-border)", color: "var(--c-input-text)" }}
                />
                {error && <p className="text-sm text-red-300">{error}</p>}
                <Button type="submit" className="btn-primary w-full rounded-2xl py-6 bg-white text-black hover:bg-white/85 font-bold">
                  Unlock Deal Room <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-white/50">
                {["Deck", "Economics", "Data Room"].map(l => (
                  <div key={l} className="rounded-xl border border-white/10 p-3">{l}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────
const NAV_ITEMS: [string, string, React.ElementType][] = [
  ["portal", "Portal", BriefcaseBusiness],
  ["deck", "Deck", Eye],
  ["economics", "Economics", Coins],
  ["dashboard", "Pilot Metrics", Gauge],
  ["documents", "Documents", FileText],
  ["pipeline", "Pipeline", Users],
  ["activity", "Activity", BarChart3],
  ["signing", "Signing", PenLine],
  ["commit", "Commit", DollarSign],
];

function Shell({ children, view, setView, lock, tenant }: {
  children: React.ReactNode; view: string; setView: (v: string) => void; lock: () => void; tenant: TenantConfig;
}) {
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "var(--grad-shell)" }}>
      {/* mesh grid */}
      <div className="fixed inset-0 opacity-[0.10]" style={{ backgroundImage: "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />

      <header className="relative z-20 px-5 md:px-8 py-5 border-b border-white/10 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4" style={{ background: "var(--c-header)" }}>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">{tenant.eyebrow}</p>
          <h1 className="text-2xl font-black text-white">{tenant.name} Deal Room</h1>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map(([key, label, Icon]) => (
            <button key={key} onClick={() => setView(key)}
              className={cn("shrink-0 rounded-2xl px-4 py-3 text-sm border transition",
                view === key ? "nav-active bg-white text-black border-white" : "btn-secondary bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
              )}>
              <Icon className="inline h-4 w-4 mr-2" />{label}
            </button>
          ))}
          <ThemeToggle />
          <button onClick={lock} className="btn-secondary shrink-0 rounded-2xl px-4 py-3 text-sm border bg-transparent text-white/70 border-white/10 hover:bg-white hover:text-black transition">
            <Lock className="inline h-4 w-4 mr-2" />Lock
          </button>
        </nav>
      </header>

      <main className="relative z-10 p-5 md:p-8 pb-24">{children}</main>
    </div>
  );
}

// ── Portal ────────────────────────────────────────────────────────────────
function Portal({ setView }: { setView: (v: string) => void }) {
  const tiles: [string, string, string, React.ElementType][] = [
    ["deck",      "Investor Deck",       "Present the full kill-shot narrative directly from the portal.",                              Eye],
    ["economics", "Token + Economics",   "Run the model: units, scans, activations, reward cost, sponsor value.",                       Coins],
    ["dashboard", "Pilot Metrics",       "Live-style KPI board for scans, activations, redemptions, and impact.",                       Gauge],
    ["documents", "Document Vault",      "MSA, manufacturing packet, pilot memo, IBIY integration, and legal files.",                   FileText],
    ["pipeline",  "Investor Tracking",   "CRM-style deal flow, interest level, open status, and follow-up stage.",                      Users],
    ["commit",    "Commitment Tracker",  "Capture soft commitments, tranche targets, and next-step actions.",                           DollarSign],
    ["activity",  "Investor Activity",   "Track opens, downloads, time-in-section, and follow-up signals.",                             BarChart3],
    ["signing",   "Signing Workflow",    "Move investors from interest to NDA, MOU, term sheet, and subscription docs.",               PenLine],
  ];
  return (
    <div className="max-w-7xl mx-auto">
      <section className="rounded-[2rem] border border-white/10 p-8 md:p-12 mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50 mb-5">Restricted Investor Portal</p>
        <h2 className="text-5xl md:text-7xl font-black leading-none mb-6 text-white">You are now inside the network.</h2>
        <p className="max-w-3xl text-xl text-white/70 leading-relaxed">This portal turns the VIBE × IBIY pilot into a capital-ready deal room: presentation, economics, proof dashboard, documents, investor tracking, and commitment workflow.</p>
      </section>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {tiles.map(([key, title, text, Icon]) => (
          <button key={key} onClick={() => setView(key)}
            className="text-left rounded-[1.5rem] border border-white/10 hover:border-white/50 transition p-6 min-h-56 group"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <Icon className="h-8 w-8 mb-8 text-white" />
            <h3 className="text-2xl font-black mb-3 text-white">{title}</h3>
            <p className="text-white/65 leading-relaxed">{text}</p>
            <ArrowRight className="mt-6 h-5 w-5 opacity-50 group-hover:translate-x-2 transition text-white" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Slide ─────────────────────────────────────────────────────────────────
function Slide({ slide, index }: { slide: SlideData; index: number }) {
  const Icon = slide.icon || Droplets;
  return (
    <motion.section key={index} initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 }} transition={{ duration: 0.35 }} className="min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-2xl bg-white text-black flex items-center justify-center shrink-0"><Icon className="h-5 w-5" /></div>
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] text-white/55">{slide.eyebrow}</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-black leading-[0.95] tracking-tight mb-6 text-white">{slide.title}</h1>
          {slide.subtitle && <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-7">{slide.subtitle}</p>}
          {slide.body    && <p className="text-lg md:text-xl text-white/72 leading-relaxed max-w-3xl">{slide.body}</p>}
          {slide.stat    && <div className="mt-8 inline-flex rounded-2xl border border-white/15 px-5 py-4 text-white font-semibold" style={{ background: "rgba(255,255,255,0.08)" }}>{slide.stat}</div>}
        </div>
        <div>
          {slide.bullets && (
            <div className="space-y-4">
              {slide.bullets.map((b, i) => (
                <div key={b} className="rounded-2xl border border-white/10 p-5 text-white/78 leading-relaxed" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <span className="text-white font-semibold mr-2">0{i + 1}</span>{b}
                </div>
              ))}
            </div>
          )}
          {slide.cards && (
            <div className="grid sm:grid-cols-2 gap-4">
              {slide.cards.map(([title, text], i) => (
                <div key={title} className="min-h-40 rounded-2xl border border-white/10 p-5 flex flex-col justify-between" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="text-3xl font-black text-white/20">0{i + 1}</div>
                  <div><h3 className="text-xl font-bold mb-2 text-white">{title}</h3><p className="text-white/65 leading-relaxed">{text}</p></div>
                </div>
              ))}
            </div>
          )}
          {!slide.bullets && !slide.cards && (
            <div className="rounded-[2rem] border border-white/10 p-10 min-h-96 flex items-center justify-center relative overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Icon className="relative h-40 w-40 text-white/75" />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

// ── Deck ──────────────────────────────────────────────────────────────────
function Deck() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = ((current + 1) / slides.length) * 100;
  const next = () => setCurrent(s => Math.min(s + 1, slides.length - 1));
  const prev = () => setCurrent(s => Math.max(s - 1, 0));

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div>
      <div className="h-1 mb-6 progress-bar" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div className="h-full progress-fill transition-all bg-white" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-white/50">Slide {current + 1} / {slides.length}</p>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} className="btn-secondary rounded-2xl px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white border border-white/10">
            <Download className="mr-2 h-4 w-4" />Print
          </Button>
          <Button onClick={() => setMenuOpen(true)} className="btn-secondary rounded-2xl px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white border border-white/10">
            <Menu className="mr-2 h-4 w-4" />Slides
          </Button>
        </div>
      </div>
      <AnimatePresence mode="wait"><Slide slide={slides[current]} index={current} /></AnimatePresence>
      <div className="fixed bottom-0 left-0 right-0 z-30 px-5 md:px-10 py-5 flex items-center justify-between backdrop-blur-xl border-t border-white/10" style={{ background: "rgba(0,0,0,0.60)" }}>
        <Button onClick={prev} disabled={current === 0} className="btn-secondary rounded-2xl px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 disabled:opacity-30">
          <ArrowLeft className="mr-2 h-4 w-4" />Previous
        </Button>
        <Button onClick={next} disabled={current === slides.length - 1} className="btn-primary rounded-2xl px-4 py-2 bg-white text-black hover:bg-white/85 disabled:opacity-30">
          Next<ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 backdrop-blur-xl p-5 overflow-auto" style={{ background: "rgba(0,0,0,0.92)" }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Slide Navigation</h3>
              <button onClick={() => setMenuOpen(false)} className="rounded-xl border border-white/15 p-3 text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {slides.map((s, i) => (
                <button key={s.title} onClick={() => { setCurrent(i); setMenuOpen(false); }}
                  className={cn("text-left rounded-2xl border p-4", i === current ? "border-white bg-white text-black" : "border-white/15 text-white")}
                  style={{ background: i === current ? undefined : "rgba(255,255,255,0.05)" }}>
                  <span className="text-xs opacity-60">{i + 1}</span>
                  <div className="font-bold">{s.title}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Economics ─────────────────────────────────────────────────────────────
function Economics() {
  const [units, setUnits] = useState(100000);
  const [cost, setCost] = useState(0.45);
  const [value, setValue] = useState(2.5);
  const [scan, setScan] = useState(35);
  const [activate, setActivate] = useState(50);
  const [reward, setReward] = useState(0.08);
  const [sponsor, setSponsor] = useState(25000);

  const grossRevenue = units * value;
  const cogs = units * cost;
  const rewardPool = units * reward;
  const scans = units * (scan / 100);
  const activations = scans * (activate / 100);
  const grossProfit = grossRevenue - cogs - rewardPool + sponsor;
  const cac = activations ? rewardPool / activations : 0;

  const Metric = ({ label, val, sub }: { label: string; val: string; sub?: string }) => (
    <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.05)" }}>
      <p className="text-white/45 text-sm mb-2">{label}</p>
      <div className="text-3xl font-black text-white">{val}</div>
      {sub && <p className="text-white/50 text-sm mt-2">{sub}</p>}
    </div>
  );

  const Input = ({ label, value: v, onChange, step = "1" }: { label: string; value: number; onChange: (n: number) => void; step?: string }) => (
    <label className="block">
      <span className="text-sm text-white/50">{label}</span>
      <input type="number" step={step} value={v} onChange={e => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-2xl px-4 py-3 outline-none text-white"
        style={{ background: "var(--c-input)", border: "1px solid var(--c-input-border)", color: "var(--c-input-text)" }} />
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Token + Economics</p>
        <h2 className="text-5xl font-black mb-4 text-white">Live Pitch Simulator</h2>
        <p className="text-white/65 max-w-3xl">Use this in investor meetings to show how product margin, scan conversion, activations, rewards, and sponsor funding combine into a measurable acquisition and revenue engine.</p>
      </div>
      <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6">
        <Card className="border-white/10 text-white rounded-3xl" style={{ background: "rgba(255,255,255,0.05)" }}>
          <CardContent className="p-6 grid md:grid-cols-2 gap-5">
            <Input label="Units Deployed" value={units} onChange={setUnits} />
            <Input label="Landed Cost / Unit" value={cost} onChange={setCost} step="0.01" />
            <Input label="Retail/Bundle Value / Unit" value={value} onChange={setValue} step="0.01" />
            <Input label="Scan Rate %" value={scan} onChange={setScan} />
            <Input label="Activation Rate % of Scans" value={activate} onChange={setActivate} />
            <Input label="Reward Allocation / Can" value={reward} onChange={setReward} step="0.01" />
            <Input label="Sponsor Funding" value={sponsor} onChange={setSponsor} />
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-4">
          <Metric label="Gross Revenue Equivalent" val={money(grossRevenue)} sub="Units × bundle value" />
          <Metric label="COGS" val={money(cogs)} sub="Units × landed cost" />
          <Metric label="Reward Pool" val={money(rewardPool)} sub="Per-can allocation" />
          <Metric label="Sponsor Funding" val={money(sponsor)} sub="Partner-funded prize pool" />
          <Metric label="Projected Gross Profit" val={money(grossProfit)} sub="Revenue - COGS - rewards + sponsors" />
          <Metric label="Estimated Activations" val={Math.round(activations).toLocaleString()} sub={`${Math.round(scans).toLocaleString()} scans`} />
          <Metric label="Reward CAC" val={money(cac)} sub="Reward pool / activations" />
          <Metric label="Investor Soundbite" val="Acquire Through Consumption" sub="Then monetize across HTES, R.I.S.E., marketplace, and media" />
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────
function Dashboard() {
  const metrics = [
    ["Cans Deployed", "100,000", "Pilot allocation"],
    ["QR Scans", "35,000", "35% target scan rate"],
    ["Bracelet Activations", "17,500", "50% of scans"],
    ["Reward Claims", "8,750", "25% of scans"],
    ["Event Conversions", "1,750", "10% of activations"],
    ["Impact Pool", "$8,000", "$0.08 per can"],
  ];
  const health = [["Scan Velocity", 72], ["Activation Quality", 64], ["Reward Engagement", 58], ["Investor Readiness", 86]];
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Pilot Metrics</p>
      <h2 className="text-5xl font-black mb-6 text-white">Live KPI Board</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-6">
        {metrics.map(([a, b, c]) => (
          <div key={a} className="rounded-3xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-white/45 mb-2">{a}</p>
            <div className="text-4xl font-black mb-2 text-white">{b}</div>
            <p className="text-white/55">{c}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)" }}>
        <h3 className="text-2xl font-black mb-4 text-white">Pilot Health</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {health.map(([label, val]) => (
            <div key={label}>
              <div className="flex justify-between text-sm text-white/55 mb-2"><span>{label}</span><span>{val}%</span></div>
              <div className="h-3 rounded-full metric-bar-track" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full metric-bar-fill bg-white" style={{ width: `${val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Documents ─────────────────────────────────────────────────────────────
function Documents() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Document Vault</p>
      <h2 className="text-5xl font-black mb-6 text-white">Investor Data Room</h2>
      <div className="grid gap-3">
        {docs.map(([name, desc, status]) => (
          <div key={name} className="rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 mt-1 text-white" />
              <div><h3 className="text-xl font-bold text-white">{name}</h3><p className="text-white/55">{desc}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", status === "Ready" ? "badge-ready bg-white text-black" : "border border-white/20 text-white/70")}>{status}</span>
              <Button className="btn-secondary rounded-2xl px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white border border-white/10">
                <Download className="mr-2 h-4 w-4" />Open
              </Button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-white/45 mt-5 text-sm">Connect these buttons to protected file URLs from your storage provider or CMS.</p>
    </div>
  );
}

// ── Pipeline ──────────────────────────────────────────────────────────────
function Pipeline() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Investor Tracking</p>
      <h2 className="text-5xl font-black mb-6 text-white">CRM Pipeline</h2>
      <div className="grid gap-3">
        {pipeline.map(([name, amount, stage, interest]) => (
          <div key={name} className="rounded-2xl border border-white/10 p-5 grid md:grid-cols-5 gap-4 items-center" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="md:col-span-2"><h3 className="text-xl font-bold text-white">{name}</h3><p className="text-white/45">Tracked investor profile</p></div>
            <div><p className="text-white/45 text-sm">Target</p><p className="font-bold text-white">{amount}</p></div>
            <div><p className="text-white/45 text-sm">Stage</p><p className="font-bold text-white">{stage}</p></div>
            <div>
              <p className="text-white/45 text-sm mb-2">Interest</p>
              <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full bg-white" style={{ width: interest }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)" }}>
        <h3 className="text-2xl font-black mb-4 text-white">Capital Stack</h3>
        <div className="grid gap-4">
          {capitalStack.map(([label, target, committed, use]) => {
            const pct = Math.min(100, Math.round((committed as number / (target as number)) * 100));
            return (
              <div key={label as string} className="rounded-2xl border border-white/10 p-4" style={{ background: "rgba(0,0,0,0.20)" }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <div><p className="font-bold text-white">{label as string}</p><p className="text-white/45 text-sm">{use as string}</p></div>
                  <div className="text-right"><p className="font-black text-white">{money(committed as number)} / {money(target as number)}</p><p className="text-white/45 text-sm">{pct}% committed</p></div>
                </div>
                <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-white/45 mt-5 text-sm">Wire this to HubSpot, Airtable, Salesforce, Notion, or Supabase for real investor tracking.</p>
    </div>
  );
}

// ── Activity Log ──────────────────────────────────────────────────────────
function ActivityLog() {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Investor Intelligence</p>
      <h2 className="text-5xl font-black mb-6 text-white">Activity + Follow-Up Signals</h2>
      <div className="grid lg:grid-cols-[1fr_0.8fr] gap-6">
        <div className="grid gap-3">
          {activityLog.map(([date, event, signal]) => (
            <div key={event} className="rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="flex items-start gap-4">
                <Clock3 className="h-6 w-6 mt-1 text-white" />
                <div><p className="font-bold text-white">{event}</p><p className="text-white/45 text-sm">{date}</p></div>
              </div>
              <span className="rounded-full bg-white text-black px-3 py-1 text-xs font-bold">{signal}</span>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)" }}>
          <h3 className="text-2xl font-black mb-4 text-white">Recommended Follow-Up</h3>
          <div className="space-y-4 text-white/70">
            <p><CheckCircle2 className="inline h-5 w-5 mr-2 text-white" />Send economics memo to Family Office B.</p>
            <p><CheckCircle2 className="inline h-5 w-5 mr-2 text-white" />Move Hospitality Partner D to signing workflow.</p>
            <p><CheckCircle2 className="inline h-5 w-5 mr-2 text-white" />Invite Strategic Investor A to live pitch simulator review.</p>
          </div>
          <Button className="btn-primary mt-6 w-full rounded-2xl py-3 bg-white text-black hover:bg-white/85 font-bold">
            <Send className="mr-2 h-4 w-4" />Create Follow-Up Sequence
          </Button>
        </div>
      </div>
      <p className="text-white/45 mt-5 text-sm">Replace mock events with analytics from Segment, PostHog, Plausible, or Supabase logs.</p>
    </div>
  );
}

// ── Signing ───────────────────────────────────────────────────────────────
function Signing() {
  const steps = ["NDA / Confidentiality", "Pilot MOU", "Term Sheet", "Subscription / Sponsor Agreement", "Funds Flow + Closing Checklist"];
  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Signing Workflow</p>
      <h2 className="text-5xl font-black mb-6 text-white">From Interest To Close</h2>
      <div className="grid gap-4">
        {steps.map((step, i) => (
          <div key={step} className="rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-4">
              <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center font-black", i < 2 ? "bg-white text-black" : "text-white")}
                style={i >= 2 ? { background: "rgba(255,255,255,0.1)" } : undefined}>{i + 1}</div>
              <div>
                <h3 className="text-xl font-bold text-white">{step}</h3>
                <p className="text-white/45">{i < 2 ? "Ready for execution" : "Prepared after diligence checkpoint"}</p>
              </div>
            </div>
            <Button className="btn-secondary rounded-2xl px-4 py-2 bg-white/10 hover:bg-white hover:text-black text-white border border-white/10">
              <PenLine className="mr-2 h-4 w-4" />{i < 2 ? "Send for Signature" : "Prepare"}
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)" }}>
        <h3 className="text-2xl font-black mb-3 text-white">Closing Control</h3>
        <p className="text-white/65 leading-relaxed">Use this section to route qualified investors into NDA, MOU, term sheet, subscription, sponsor agreement, or cause allocation documents without leaving the deal room.</p>
      </div>
      <p className="text-white/45 mt-5 text-sm">Connect buttons to DocuSign, Dropbox Sign, PandaDoc, or Ironclad. Store signed copies back in the protected document vault.</p>
    </div>
  );
}

// ── Commit ────────────────────────────────────────────────────────────────
function Commit() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(250000);
  const [type, setType] = useState("Strategic Investment");
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-white/45 mb-3">Capital Commitment</p>
      <h2 className="text-5xl font-black mb-6 text-white">Soft Commitment Tracker</h2>
      <Card className="border-white/10 text-white rounded-3xl" style={{ background: "rgba(255,255,255,0.05)" }}>
        <CardContent className="p-6 space-y-5">
          <label className="block">
            <span className="text-sm text-white/50">Investor / Organization</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter investor name"
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
              style={{ background: "var(--c-input)", border: "1px solid var(--c-input-border)", color: "var(--c-input-text)" }} />
          </label>
          <label className="block">
            <span className="text-sm text-white/50">Commitment Amount</span>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
              style={{ background: "var(--c-input)", border: "1px solid var(--c-input-border)", color: "var(--c-input-text)" }} />
          </label>
          <label className="block">
            <span className="text-sm text-white/50">Commitment Type</span>
            <select value={type} onChange={e => setType(e.target.value)}
              className="mt-2 w-full rounded-2xl px-4 py-3 outline-none"
              style={{ background: "var(--c-input)", border: "1px solid var(--c-input-border)", color: "var(--c-input-text)" }}>
              <option>Strategic Investment</option>
              <option>Sponsor Funding</option>
              <option>Inventory Financing</option>
              <option>Prize Pool Contribution</option>
              <option>Cause Allocation Partner</option>
            </select>
          </label>
          <Button onClick={() => setSent(true)} className="btn-primary w-full rounded-2xl py-6 bg-white text-black hover:bg-white/85 font-bold">
            <Send className="mr-2 h-4 w-4" />Submit Soft Commitment
          </Button>
          {sent && (
            <div className="rounded-2xl border border-white/10 p-5" style={{ background: "rgba(255,255,255,0.08)" }}>
              <CheckCircle2 className="h-6 w-6 mb-2 text-white" />
              <p className="font-bold text-white">Soft commitment captured: {name || "Investor"} — {money(amount)} — {type}</p>
              <p className="text-white/55 mt-1 text-sm">Connect this form to CRM, email notification, and e-signature workflow.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Deal Room ─────────────────────────────────────────────────────────────
function DealRoom({ tenant, onLock }: { tenant: TenantConfig; onLock: () => void }) {
  const [view, setView] = useState("portal");
  const content: Record<string, React.ReactNode> = {
    portal:    <Portal setView={setView} />,
    deck:      <Deck />,
    economics: <Economics />,
    dashboard: <Dashboard />,
    documents: <Documents />,
    pipeline:  <Pipeline />,
    activity:  <ActivityLog />,
    signing:   <Signing />,
    commit:    <Commit />,
  };
  return (
    <Shell view={view} setView={setView} lock={onLock} tenant={tenant}>
      {content[view]}
    </Shell>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("vibe-theme");
    return saved !== "light";
  });

  const [unlockedCode, setUnlockedCode] = useState<string | null>(() =>
    sessionStorage.getItem("vibe_ibiy_dealroom_access")
  );

  const tenant = useMemo<TenantConfig>(() =>
    TENANTS[unlockedCode ?? ""] ?? TENANTS["VIBE-IBIY-2026"],
    [unlockedCode]
  );

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      html.classList.remove("light");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
    }
    localStorage.setItem("vibe-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  const handleUnlock = (code: string) => {
    sessionStorage.setItem("vibe_ibiy_dealroom_access", code);
    setUnlockedCode(code);
  };

  const handleLock = () => {
    sessionStorage.removeItem("vibe_ibiy_dealroom_access");
    setUnlockedCode(null);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {unlockedCode
        ? <DealRoom tenant={tenant} onLock={handleLock} />
        : <AccessWall onUnlock={handleUnlock} />
      }
    </ThemeContext.Provider>
  );
}
