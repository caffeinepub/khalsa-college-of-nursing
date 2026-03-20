import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Facebook,
  FlaskConical,
  GraduationCap,
  Handshake,
  Heart,
  Instagram,
  Lightbulb,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope,
  Trophy,
  Twitter,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { NewsCategory } from "./backend.d";
import {
  useGetActiveNewsEvents,
  useGetAllNotices,
  useSubmitAdmissionEnquiry,
  useSubmitContactForm,
} from "./hooks/useQueries";

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

// ── Stagger variants ──────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ── NAV LINKS ─────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Programs", href: "#programs" },
  { label: "Facilities", href: "#facilities" },
  { label: "Admissions", href: "#admissions" },
  { label: "News", href: "#news" },
  { label: "Contact", href: "#contact" },
];

// ── SAMPLE DATA ───────────────────────────────────────────────────────────────
const sampleNews = [
  {
    title: "BFUHS Affiliation Renewed for 2026-27",
    description:
      "Khalsa College of Nursing has successfully renewed its affiliation with Baba Farid University of Health Sciences, Faridkot for the academic year 2026-27.",
    date: BigInt(Date.now() * 1_000_000),
    category: "news" as const,
    isActive: true,
  },
  {
    title: "New Simulation Lab Inaugurated",
    description:
      "State-of-the-art nursing simulation laboratory with latest medical mannequins and equipment has been inaugurated by the college management.",
    date: BigInt((Date.now() - 7 * 86400000) * 1_000_000),
    category: "news" as const,
    isActive: true,
  },
  {
    title: "Students Win Inter-College Nursing Olympiad",
    description:
      "Our nursing students brought glory to the college by winning first place in the Inter-College Nursing Olympiad held at Government Medical College, Amritsar.",
    date: BigInt((Date.now() - 14 * 86400000) * 1_000_000),
    category: "news" as const,
    isActive: true,
  },
];
const sampleEvents = [
  {
    title: "Annual Nurses Day Celebration",
    description:
      "Join us for the grand celebration of International Nurses Day on May 12th. Special felicitation ceremony for outstanding nursing professionals.",
    date: BigInt((Date.now() + 14 * 86400000) * 1_000_000),
    category: "event" as const,
    isActive: true,
  },
  {
    title: "Admission Open Day 2026",
    description:
      "Meet faculty, tour campus, and learn about admission procedures. Parents and prospective students are welcome to attend our Open Day event.",
    date: BigInt((Date.now() + 21 * 86400000) * 1_000_000),
    category: "event" as const,
    isActive: true,
  },
  {
    title: "Workshop on Palliative Care",
    description:
      "Two-day workshop on Modern Approaches in Palliative Nursing Care in collaboration with Holy Family Hospital, Amritsar.",
    date: BigInt((Date.now() + 30 * 86400000) * 1_000_000),
    category: "event" as const,
    isActive: true,
  },
];
const sampleNotices = [
  {
    title: "B.Sc Nursing 2026 Admissions Open",
    content:
      "Applications are invited for B.Sc Nursing, GNM, Post Basic and M.Sc Nursing programs. Last date: 30th March 2026.",
    isImportant: true,
    date: BigInt(Date.now() * 1_000_000),
  },
  {
    title: "Clinical Posting Schedule - February 2026",
    content:
      "Clinical posting schedule for 2nd year B.Sc Nursing students has been uploaded. Students are requested to report to their respective hospitals.",
    isImportant: false,
    date: BigInt((Date.now() - 2 * 86400000) * 1_000_000),
  },
  {
    title: "PNRC Registration Drive",
    content:
      "Punjab Nurses Registration Council registration drive for final year students on 15th March 2026. Bring required documents.",
    isImportant: true,
    date: BigInt((Date.now() - 3 * 86400000) * 1_000_000),
  },
];

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setActiveLink(href);
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy-900 shadow-navy py-2"
            : "bg-navy-900/90 backdrop-blur-md py-3"
        }`}
        style={{ backgroundColor: "oklch(var(--navy-900))" }}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("#home")}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: "oklch(var(--gold-500))" }}
            >
              <img
                src="/assets/generated/kcn-logo-transparent.dim_200x200.png"
                alt="KCN Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white text-sm leading-tight">
                Khalsa College of Nursing
              </div>
              <div
                className="text-xs"
                style={{ color: "oklch(var(--gold-400))" }}
              >
                Amritsar, Punjab
              </div>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeLink === link.href
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
                style={
                  activeLink === link.href
                    ? {
                        backgroundColor: "oklch(var(--gold-500) / 0.2)",
                        borderBottom: "2px solid oklch(var(--gold-500))",
                      }
                    : {}
                }
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav("#admissions")}
              className="ml-3 px-4 py-2 rounded-md text-sm font-semibold text-navy-900 transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "oklch(var(--gold-500))",
                color: "oklch(var(--navy-900))",
              }}
            >
              Apply Now
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[65px] left-0 right-0 z-40 shadow-xl"
            style={{ backgroundColor: "oklch(var(--navy-800))" }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-left px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm font-medium"
                >
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNav("#admissions")}
                className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: "oklch(var(--gold-500))",
                  color: "oklch(var(--navy-900))",
                }}
              >
                Apply Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  const stats = [
    { value: "1000+", label: "Alumni" },
    { value: "15+", label: "Years" },
    { value: "4", label: "Programs" },
    { value: "98%", label: "Placement" },
  ];

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/generated/hero-campus.dim_1400x600.jpg"
          alt="Khalsa College of Nursing Campus"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.18 0.065 255 / 0.82) 0%, oklch(0.18 0.065 255 / 0.75) 50%, oklch(0.18 0.065 255 / 0.88) 100%)",
          }}
        />
        {/* Decorative golden lines */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: "oklch(var(--gold-500))" }}
        />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-center justify-center pt-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "oklch(var(--gold-500) / 0.2)",
                color: "oklch(var(--gold-400))",
                border: "1px solid oklch(var(--gold-500) / 0.4)",
              }}
            >
              <GraduationCap size={16} />
              Approved by INC & Affiliated to BFUHS
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4"
          >
            Khalsa College
            <br />
            <span style={{ color: "oklch(var(--gold-400))" }}>of Nursing</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/85 mb-10 font-light"
          >
            Nurturing Compassionate Healthcare Professionals
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              type="button"
              onClick={() => scrollTo("#admissions")}
              className="px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-gold"
              style={{
                backgroundColor: "oklch(var(--gold-500))",
                color: "oklch(var(--navy-900))",
              }}
            >
              Apply Now
            </button>
            <button
              type="button"
              onClick={() => scrollTo("#about")}
              className="px-8 py-4 rounded-lg font-semibold text-base text-white border border-white/40 hover:bg-white/10 transition-all duration-200"
            >
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative w-full"
        style={{ backgroundColor: "oklch(var(--gold-500))" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-navy-900/30">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-2">
                <div
                  className="font-display text-3xl font-bold"
                  style={{ color: "oklch(var(--navy-900))" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "oklch(var(--navy-800))" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── NOTICE BOARD ──────────────────────────────────────────────────────────────
function NoticeBoard() {
  const { data: notices } = useGetAllNotices();
  const displayNotices =
    notices && notices.length > 0 ? notices : sampleNotices;

  const tickerItems = displayNotices.map((n) =>
    n.isImportant ? `🔴 IMPORTANT: ${n.title}` : `📌 ${n.title}`,
  );

  return (
    <div
      className="w-full py-3 overflow-hidden"
      style={{ backgroundColor: "oklch(var(--navy-800))" }}
    >
      <div className="flex items-center">
        <div
          className="flex-shrink-0 px-4 py-1 font-semibold text-sm mr-4 flex items-center gap-2"
          style={{
            backgroundColor: "oklch(var(--gold-500))",
            color: "oklch(var(--navy-900))",
          }}
        >
          <AlertCircle size={14} />
          NOTICES
        </div>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker whitespace-nowrap">
            {tickerItems.map((item) => (
              <span key={item} className="text-white/90 text-sm mr-16">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function AboutSection() {
  const { ref, visible } = useReveal();

  const values = [
    {
      icon: <Trophy size={24} />,
      title: "Excellence",
      desc: "Striving for the highest standards in nursing education and clinical practice.",
    },
    {
      icon: <Heart size={24} />,
      title: "Compassion",
      desc: "Cultivating empathy, kindness, and patient-centered care in every student.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Integrity",
      desc: "Upholding ethical values and professional conduct across all disciplines.",
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Innovation",
      desc: "Embracing modern practices and evidence-based approaches in healthcare.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate={visible ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: "oklch(var(--gold-500))" }}
              >
                About Us
              </span>
              <h2 className="section-heading mt-2 mb-4">
                A Legacy of Nursing Excellence
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Established over 15 years ago, Khalsa College of Nursing stands
                as one of Punjab's most respected nursing institutions. Located
                in the holy city of Amritsar on Grand Trunk Road, our college is
                dedicated to shaping compassionate, skilled nursing
                professionals who serve humanity with devotion.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Affiliated with{" "}
                <strong className="text-foreground">
                  Baba Farid University of Health Sciences (BFUHS), Faridkot
                </strong>{" "}
                and recognized by the{" "}
                <strong className="text-foreground">
                  Indian Nursing Council (INC)
                </strong>{" "}
                and{" "}
                <strong className="text-foreground">
                  Punjab Nurses Registration Council (PNRC)
                </strong>
                , we offer world-class nursing education with a blend of
                traditional Sikh values of service (seva) and modern healthcare
                practices.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-2 gap-4">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="p-4 rounded-xl border transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
                    style={{
                      borderColor: "oklch(var(--border))",
                      backgroundColor: "oklch(var(--navy-50))",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: "oklch(var(--gold-500) / 0.15)",
                        color: "oklch(var(--gold-500))",
                      }}
                    >
                      {v.icon}
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-navy">
              <img
                src="/assets/generated/nursing-students.dim_800x600.jpg"
                alt="Nursing Students at KCN"
                className="w-full h-[420px] object-cover"
              />
              {/* Overlay badge */}
              <div
                className="absolute bottom-6 left-6 right-6 p-4 rounded-xl"
                style={{
                  backgroundColor: "oklch(var(--navy-900) / 0.88)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <p className="text-white font-semibold text-sm">
                  🏥 Attached to multiple premier hospitals in Amritsar for
                  hands-on clinical training
                </p>
              </div>
            </div>
            {/* Decorative element */}
            <div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl -z-10"
              style={{ backgroundColor: "oklch(var(--gold-500) / 0.15)" }}
            />
            <div
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-xl -z-10"
              style={{ backgroundColor: "oklch(var(--navy-100))" }}
            />
          </motion.div>
        </div>

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Our Mission",
              icon: <Stethoscope size={20} />,
              content:
                "To provide quality nursing education that integrates academic excellence, clinical proficiency, and compassionate care — empowering graduates to excel in diverse healthcare settings across India and abroad.",
            },
            {
              title: "Our Vision",
              icon: <Activity size={20} />,
              content:
                "To be the foremost nursing institution in Punjab, recognized for producing ethical, skilled, and innovative nursing leaders who transform healthcare outcomes for communities and families.",
            },
          ].map((item, idx) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl"
              style={{
                background:
                  idx === 0
                    ? "linear-gradient(135deg, oklch(var(--navy-900)), oklch(var(--navy-700)))"
                    : "linear-gradient(135deg, oklch(var(--gold-500)), oklch(var(--gold-300)))",
              }}
            >
              <div
                className={`flex items-center gap-3 mb-3 ${idx === 0 ? "text-white" : "text-navy-900"}`}
                style={idx === 1 ? { color: "oklch(var(--navy-900))" } : {}}
              >
                {item.icon}
                <h3 className="font-display font-bold text-lg">{item.title}</h3>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={
                  idx === 0
                    ? { color: "rgba(255,255,255,0.85)" }
                    : { color: "oklch(var(--navy-800))" }
                }
              >
                {item.content}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── PROGRAMS ──────────────────────────────────────────────────────────────────
function ProgramsSection() {
  const { ref, visible } = useReveal();

  const programs = [
    {
      icon: <GraduationCap size={32} />,
      name: "B.Sc Nursing",
      duration: "4 Years",
      seats: "60 Seats",
      color: "navy",
      highlights: [
        "UG degree recognized globally",
        "Clinical postings from Year 1",
        "BFUHS University examination",
        "Excellent hospital attachment",
      ],
    },
    {
      icon: <Activity size={32} />,
      name: "GNM",
      duration: "3.5 Years",
      seats: "60 Seats",
      color: "gold",
      highlights: [
        "General Nursing & Midwifery",
        "Diploma recognized by INC",
        "Strong clinical foundation",
        "High government job prospects",
      ],
    },
    {
      icon: <Award size={32} />,
      name: "Post Basic B.Sc",
      duration: "2 Years",
      seats: "30 Seats",
      color: "navy",
      highlights: [
        "For working GNM nurses",
        "Advanced nursing concepts",
        "Distance learning option",
        "Career upgrade pathway",
      ],
    },
    {
      icon: <BookOpen size={32} />,
      name: "M.Sc Nursing",
      duration: "2 Years",
      seats: "20 Seats",
      color: "gold",
      highlights: [
        "Specialization in Medical/Surgical",
        "Research & thesis component",
        "Faculty & leadership roles",
        "Advanced clinical practice",
      ],
    },
  ];

  return (
    <section
      id="programs"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--navy-50))" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-500))" }}
          >
            Our Programs
          </span>
          <h2 className="section-heading mt-2 mb-3">
            Nursing Programs We Offer
          </h2>
          <p className="section-subheading mx-auto">
            Choose from four comprehensive programs designed to meet the
            evolving demands of modern healthcare
          </p>
        </div>

        <motion.div
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {programs.map((prog) => (
            <motion.div
              key={prog.name}
              variants={itemVariants}
              className="bg-white rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer group"
            >
              {/* Card header */}
              <div
                className="p-6 pb-4"
                style={{
                  background:
                    prog.color === "navy"
                      ? "linear-gradient(135deg, oklch(var(--navy-900)), oklch(var(--navy-700)))"
                      : "linear-gradient(135deg, oklch(var(--gold-500)), oklch(var(--gold-300)))",
                }}
              >
                <div
                  className="mb-3"
                  style={{
                    color:
                      prog.color === "navy"
                        ? "oklch(var(--gold-400))"
                        : "oklch(var(--navy-900))",
                  }}
                >
                  {prog.icon}
                </div>
                <h3
                  className="font-display font-bold text-xl mb-1"
                  style={{
                    color:
                      prog.color === "navy"
                        ? "white"
                        : "oklch(var(--navy-900))",
                  }}
                >
                  {prog.name}
                </h3>
                <div className="flex gap-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        prog.color === "navy"
                          ? "oklch(var(--gold-500) / 0.2)"
                          : "oklch(var(--navy-900) / 0.15)",
                      color:
                        prog.color === "navy"
                          ? "oklch(var(--gold-300))"
                          : "oklch(var(--navy-800))",
                    }}
                  >
                    <Clock size={10} className="inline mr-1" />
                    {prog.duration}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        prog.color === "navy"
                          ? "oklch(var(--gold-500) / 0.2)"
                          : "oklch(var(--navy-900) / 0.15)",
                      color:
                        prog.color === "navy"
                          ? "oklch(var(--gold-300))"
                          : "oklch(var(--navy-800))",
                    }}
                  >
                    <Users size={10} className="inline mr-1" />
                    {prog.seats}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="p-6 pt-4">
                <ul className="space-y-2">
                  {prog.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "oklch(var(--gold-500))" }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector("#admissions")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group-hover:gap-3"
                  style={{
                    backgroundColor: "oklch(var(--navy-100))",
                    color: "oklch(var(--navy-900))",
                  }}
                >
                  Enquire Now <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── FACILITIES ────────────────────────────────────────────────────────────────
function FacilitiesSection() {
  const { ref, visible } = useReveal();

  const facilities = [
    {
      image: "/assets/generated/nursing-lab.dim_600x400.jpg",
      icon: <FlaskConical size={20} />,
      name: "Simulation Lab",
      desc: "State-of-the-art nursing simulation lab with advanced medical mannequins, procedure trainers, and clinical skill stations for hands-on practice.",
    },
    {
      image: "/assets/generated/library.dim_600x400.jpg",
      icon: <BookOpen size={20} />,
      name: "Library",
      desc: "Extensive medical library with 10,000+ books, national and international nursing journals, e-resources, and 24-hour digital access.",
    },
    {
      image: null,
      icon: <Building2 size={20} />,
      name: "Student Hostel",
      desc: "Secure and comfortable hostel accommodation for outstation students with round-the-clock security, nutritious mess, and recreational facilities.",
    },
    {
      image: null,
      icon: <Trophy size={20} />,
      name: "Sports Complex",
      desc: "Multipurpose sports ground, indoor gym, badminton court, and yoga facilities promoting holistic wellness and teamwork among students.",
    },
    {
      image: null,
      icon: <Activity size={20} />,
      name: "Computer Lab",
      desc: "Well-equipped computer lab with high-speed internet, medical software, e-learning platforms, and digital health record simulation tools.",
    },
    {
      image: null,
      icon: <Stethoscope size={20} />,
      name: "Hospital Attachment",
      desc: "Clinical training in partnered hospitals including Government Medical College, Holy Family Hospital, and Fortis — Amritsar's leading healthcare centers.",
    },
  ];

  return (
    <section id="facilities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-500))" }}
          >
            World-Class Infrastructure
          </span>
          <h2 className="section-heading mt-2 mb-3">Our Facilities</h2>
          <p className="section-subheading mx-auto">
            Modern learning environment designed to produce confident, competent
            nursing professionals
          </p>
        </div>

        <motion.div
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {facilities.map((fac) => (
            <motion.div
              key={fac.name}
              variants={itemVariants}
              className="rounded-2xl overflow-hidden border shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 group"
              style={{ borderColor: "oklch(var(--border))" }}
            >
              {fac.image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className="h-48 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(var(--navy-900)), oklch(var(--navy-700)))",
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: "oklch(var(--gold-500) / 0.2)",
                      color: "oklch(var(--gold-400))",
                    }}
                  >
                    {fac.icon}
                  </div>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: "oklch(var(--gold-500) / 0.12)",
                      color: "oklch(var(--gold-500))",
                    }}
                  >
                    {fac.icon}
                  </div>
                  <h3 className="font-display font-bold text-foreground">
                    {fac.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {fac.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── FACULTY ───────────────────────────────────────────────────────────────────
function FacultySection() {
  const { ref, visible } = useReveal();

  const faculty = [
    {
      name: "Dr. Harpreet Kaur",
      designation: "Principal & Professor",
      qualification: "Ph.D (Nursing), M.Sc Nursing (Medical-Surgical)",
      experience: "22 Years",
      initials: "HK",
    },
    {
      name: "Mrs. Manpreet Sandhu",
      designation: "Associate Professor",
      qualification: "M.Sc Nursing (OBG), B.Sc Nursing",
      experience: "16 Years",
      initials: "MS",
    },
    {
      name: "Mrs. Gurpreet Bains",
      designation: "Assistant Professor",
      qualification: "M.Sc Nursing (Paediatrics)",
      experience: "11 Years",
      initials: "GB",
    },
    {
      name: "Mr. Rajinder Singh",
      designation: "Assistant Professor",
      qualification: "M.Sc Nursing (Community Health)",
      experience: "9 Years",
      initials: "RS",
    },
    {
      name: "Mrs. Sukhwinder Gill",
      designation: "Clinical Instructor",
      qualification: "B.Sc Nursing (Post Basic), GNM",
      experience: "14 Years",
      initials: "SG",
    },
    {
      name: "Mrs. Navneet Dhaliwal",
      designation: "Clinical Tutor",
      qualification: "B.Sc Nursing, PGDHN",
      experience: "7 Years",
      initials: "ND",
    },
  ];

  const avatarColors = [
    "oklch(var(--navy-900))",
    "oklch(var(--gold-500))",
    "oklch(var(--navy-700))",
    "oklch(var(--gold-400))",
    "oklch(var(--navy-800))",
    "oklch(var(--navy-600))",
  ];

  return (
    <section
      id="faculty"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--navy-900))" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-400))" }}
          >
            Our Educators
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
            Meet Our Faculty
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Experienced, dedicated educators committed to shaping the next
            generation of nursing leaders
          </p>
        </div>

        <motion.div
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {faculty.map((f, fIdx) => (
            <motion.div
              key={f.name}
              variants={itemVariants}
              className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "oklch(var(--navy-800))",
                border: "1px solid oklch(var(--navy-700))",
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold font-display text-lg flex-shrink-0"
                  style={{ backgroundColor: avatarColors[fIdx] }}
                >
                  {f.initials}
                </div>
                <div>
                  <h3 className="font-display font-bold text-white">
                    {f.name}
                  </h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "oklch(var(--gold-400))" }}
                  >
                    {f.designation}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm text-white/70">
                  <Award
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "oklch(var(--gold-400))" }}
                  />
                  {f.qualification}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Star size={14} style={{ color: "oklch(var(--gold-400))" }} />
                  {f.experience} Experience
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── ADMISSIONS ────────────────────────────────────────────────────────────────
function AdmissionsSection() {
  const { ref, visible } = useReveal();
  const submitEnquiry = useSubmitAdmissionEnquiry();
  const [form, setForm] = useState({
    applicantName: "",
    email: "",
    phone: "",
    programOfInterest: "",
  });

  const steps = [
    {
      num: 1,
      title: "Apply Online",
      desc: "Fill admission form on our website or visit college office",
    },
    {
      num: 2,
      title: "Document Verification",
      desc: "Submit mark sheets, certificates, and photo ID",
    },
    {
      num: 3,
      title: "Merit List",
      desc: "Shortlisting based on 10+2 marks and eligibility",
    },
    {
      num: 4,
      title: "Fee Payment",
      desc: "Confirm seat by paying admission fee within 7 days",
    },
    {
      num: 5,
      title: "Enrollment",
      desc: "Collect ID card, schedule and attend orientation",
    },
  ];

  const eligibility = [
    {
      program: "B.Sc Nursing",
      criteria: "10+2 with PCB, 45% marks, age 17–35 years",
    },
    {
      program: "GNM",
      criteria: "10+2 with PCB/Arts, 40% marks, age 17–35 years",
    },
    {
      program: "Post Basic B.Sc",
      criteria: "GNM with 2 years experience, RN/RM registered",
    },
    {
      program: "M.Sc Nursing",
      criteria: "B.Sc Nursing with 55% marks, 1 year experience",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.applicantName ||
      !form.email ||
      !form.phone ||
      !form.programOfInterest
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await submitEnquiry.mutateAsync(form);
      toast.success(
        "Enquiry submitted! Our admissions team will contact you shortly.",
      );
      setForm({
        applicantName: "",
        email: "",
        phone: "",
        programOfInterest: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="admissions"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--navy-50))" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-500))" }}
          >
            Join Us
          </span>
          <h2 className="section-heading mt-2 mb-3">Admissions 2026</h2>
          <p className="section-subheading mx-auto">
            Secure your seat in Punjab's premier nursing institution
          </p>
        </div>

        {/* Process Steps */}
        <motion.div
          initial="hidden"
          animate={visible ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-14"
        >
          <h3 className="font-display font-bold text-lg text-center mb-6 text-foreground">
            Admission Process
          </h3>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0">
            {steps.map((step, sIdx) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="flex-1 relative"
              >
                <div className="text-center px-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold font-display text-lg mx-auto mb-3"
                    style={{ backgroundColor: "oklch(var(--gold-500))" }}
                  >
                    {step.num}
                  </div>
                  <h4 className="font-display font-bold text-sm text-foreground mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {sIdx < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-0 h-0.5"
                    style={{ backgroundColor: "oklch(var(--gold-500) / 0.3)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
              <CheckCircle
                size={20}
                style={{ color: "oklch(var(--gold-500))" }}
              />
              Eligibility Criteria
            </h3>
            <div className="space-y-3">
              {eligibility.map((el) => (
                <div
                  key={el.program}
                  className="p-4 rounded-xl bg-white shadow-card"
                >
                  <div
                    className="font-display font-bold text-sm mb-1"
                    style={{ color: "oklch(var(--navy-900))" }}
                  >
                    {el.program}
                  </div>
                  <p className="text-sm text-muted-foreground">{el.criteria}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="font-display font-bold text-xl mb-4 text-foreground flex items-center gap-2">
              <Handshake
                size={20}
                style={{ color: "oklch(var(--gold-500))" }}
              />
              Admission Enquiry
            </h3>
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl shadow-card space-y-4"
            >
              <div>
                <Label
                  htmlFor="adm-name"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Full Name *
                </Label>
                <Input
                  id="adm-name"
                  placeholder="Your full name"
                  value={form.applicantName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, applicantName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label
                    htmlFor="adm-email"
                    className="text-sm font-medium text-foreground mb-1.5 block"
                  >
                    Email *
                  </Label>
                  <Input
                    id="adm-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="adm-phone"
                    className="text-sm font-medium text-foreground mb-1.5 block"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="adm-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground mb-1.5 block">
                  Program of Interest *
                </Label>
                <Select
                  value={form.programOfInterest}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, programOfInterest: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="B.Sc Nursing">
                      B.Sc Nursing (4 Years)
                    </SelectItem>
                    <SelectItem value="GNM">
                      GNM — General Nursing & Midwifery
                    </SelectItem>
                    <SelectItem value="Post Basic B.Sc Nursing">
                      Post Basic B.Sc Nursing (2 Years)
                    </SelectItem>
                    <SelectItem value="M.Sc Nursing">
                      M.Sc Nursing (2 Years)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={submitEnquiry.isPending}
                style={{
                  backgroundColor: "oklch(var(--navy-900))",
                  color: "white",
                }}
              >
                {submitEnquiry.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── NEWS & EVENTS ─────────────────────────────────────────────────────────────
function NewsEventsSection() {
  const { ref, visible } = useReveal();
  const { data: newsEvents } = useGetActiveNewsEvents();

  const allNews =
    newsEvents && newsEvents.length > 0
      ? newsEvents.filter((e) => e.category === NewsCategory.news)
      : sampleNews;
  const allEvents =
    newsEvents && newsEvents.length > 0
      ? newsEvents.filter((e) => e.category === NewsCategory.event)
      : sampleEvents;

  const NewsCard = ({ item }: { item: (typeof sampleNews)[0] }) => (
    <div className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-3">
        <Badge
          className="text-xs"
          style={{
            backgroundColor: "oklch(var(--gold-500) / 0.15)",
            color: "oklch(var(--gold-500))",
            border: "none",
          }}
        >
          <Newspaper size={10} className="mr-1" />
          NEWS
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          <Calendar size={10} />
          {formatDate(item.date)}
        </span>
      </div>
      <h4 className="font-display font-bold text-foreground mb-2 text-sm leading-snug">
        {item.title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {item.description}
      </p>
    </div>
  );

  const EventCard = ({ item }: { item: (typeof sampleEvents)[0] }) => (
    <div className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center gap-2 mb-3">
        <Badge
          className="text-xs"
          style={{
            backgroundColor: "oklch(var(--navy-900) / 0.1)",
            color: "oklch(var(--navy-900))",
            border: "none",
          }}
        >
          <Calendar size={10} className="mr-1" />
          EVENT
        </Badge>
        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
          <Calendar size={10} />
          {formatDate(item.date)}
        </span>
      </div>
      <h4 className="font-display font-bold text-foreground mb-2 text-sm leading-snug">
        {item.title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
        {item.description}
      </p>
    </div>
  );

  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-500))" }}
          >
            Stay Updated
          </span>
          <h2 className="section-heading mt-2 mb-3">News & Events</h2>
          <p className="section-subheading mx-auto">
            Latest happenings, achievements, and upcoming events at Khalsa
            College of Nursing
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Tabs defaultValue="news">
            <TabsList
              className="mx-auto mb-8 flex w-fit"
              style={{
                backgroundColor: "oklch(var(--navy-50))",
              }}
            >
              <TabsTrigger
                value="news"
                className="data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              >
                Latest News
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-navy-900 data-[state=active]:text-white"
              >
                Upcoming Events
              </TabsTrigger>
            </TabsList>
            <TabsContent value="news">
              <div className="grid md:grid-cols-3 gap-5">
                {allNews.map((item) => (
                  <NewsCard key={item.title} item={item} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="events">
              <div className="grid md:grid-cols-3 gap-5">
                {allEvents.map((item) => (
                  <EventCard key={item.title} item={item} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function ContactSection() {
  const { ref, visible } = useReveal();
  const submitContact = useSubmitContactForm();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill required fields");
      return;
    }
    try {
      await submitContact.mutateAsync(form);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send. Please call us directly.");
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      label: "Address",
      value: "Grand Trunk Road, Amritsar, Punjab 143001",
    },
    {
      icon: <Phone size={20} />,
      label: "Phone",
      value: "+91-183-2500XXX",
    },
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: "info@khalsanursing.edu.in",
    },
    {
      icon: <Clock size={20} />,
      label: "Office Hours",
      value: "Mon–Sat: 9:00 AM – 5:00 PM",
    },
  ];

  return (
    <section
      id="contact"
      className="py-20"
      style={{ backgroundColor: "oklch(var(--navy-50))" }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-14" ref={ref}>
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "oklch(var(--gold-500))" }}
          >
            Get in Touch
          </span>
          <h2 className="section-heading mt-2 mb-3">Contact Us</h2>
          <p className="section-subheading mx-auto">
            Have questions? Our admissions team is ready to guide you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-card"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: "oklch(var(--gold-500) / 0.12)",
                      color: "oklch(var(--gold-500))",
                    }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {info.label}
                    </div>
                    <div className="font-medium text-foreground text-sm mt-0.5">
                      {info.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div
              className="rounded-2xl overflow-hidden h-52 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--navy-900)), oklch(var(--navy-700)))",
              }}
            >
              <div className="text-center text-white/80">
                <MapPin
                  size={32}
                  className="mx-auto mb-2"
                  style={{ color: "oklch(var(--gold-400))" }}
                />
                <p className="font-display font-semibold text-white">
                  Khalsa College of Nursing
                </p>
                <p className="text-sm mt-1">
                  Grand Trunk Road, Amritsar, Punjab
                </p>
                <a
                  href="https://maps.google.com/?q=Amritsar+Punjab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "oklch(var(--gold-500))",
                    color: "oklch(var(--navy-900))",
                  }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: <Facebook size={18} />, label: "Facebook" },
                { icon: <Twitter size={18} />, label: "Twitter" },
                { icon: <Instagram size={18} />, label: "Instagram" },
                { icon: <Youtube size={18} />, label: "YouTube" },
              ].map((s) => (
                <button
                  type="button"
                  key={s.label}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: "oklch(var(--navy-900))",
                    color: "oklch(var(--gold-400))",
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-card space-y-4"
            >
              <h3 className="font-display font-bold text-lg text-foreground mb-2">
                Send us a Message
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="ct-name"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Name *
                  </Label>
                  <Input
                    id="ct-name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="ct-phone"
                    className="text-sm font-medium mb-1.5 block"
                  >
                    Phone
                  </Label>
                  <Input
                    id="ct-phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="ct-email"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Email *
                </Label>
                <Input
                  id="ct-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="ct-subject"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Subject
                </Label>
                <Input
                  id="ct-subject"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, subject: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="ct-message"
                  className="text-sm font-medium mb-1.5 block"
                >
                  Message *
                </Label>
                <Textarea
                  id="ct-message"
                  placeholder="Write your message here..."
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full font-semibold"
                disabled={submitContact.isPending}
                style={{
                  backgroundColor: "oklch(var(--gold-500))",
                  color: "oklch(var(--navy-900))",
                }}
              >
                {submitContact.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  const quickLinks = [
    "Home",
    "About Us",
    "Programs",
    "Facilities",
    "Admissions",
    "Contact",
  ];
  const programs = ["B.Sc Nursing", "GNM", "Post Basic B.Sc", "M.Sc Nursing"];

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ backgroundColor: "oklch(var(--navy-900))" }}>
      {/* CTA Banner */}
      <div
        className="py-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--gold-500)), oklch(var(--gold-400)))",
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="font-display text-3xl font-bold mb-3"
            style={{ color: "oklch(var(--navy-900))" }}
          >
            Begin Your Nursing Journey Today
          </h2>
          <p
            className="mb-6 text-lg"
            style={{ color: "oklch(var(--navy-800))" }}
          >
            Admissions open for 2026–27. Limited seats available.
          </p>
          <button
            type="button"
            onClick={() => scrollTo("#admissions")}
            className="px-8 py-3 rounded-lg font-bold text-base transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "oklch(var(--navy-900))",
              color: "white",
            }}
          >
            Apply Now →
          </button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-14">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0"
                  style={{ borderColor: "oklch(var(--gold-500))" }}
                >
                  <img
                    src="/assets/generated/kcn-logo-transparent.dim_200x200.png"
                    alt="KCN Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-display font-bold text-white text-sm">
                    Khalsa College of Nursing
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(var(--gold-400))" }}
                  >
                    Amritsar, Punjab
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                Nurturing compassionate healthcare professionals since 2010.
                Affiliated with BFUHS, approved by INC and PNRC.
              </p>
              <div className="flex gap-2">
                {[
                  { Icon: Facebook, n: "fb" },
                  { Icon: Twitter, n: "tw" },
                  { Icon: Instagram, n: "ig" },
                  { Icon: Youtube, n: "yt" },
                ].map(({ Icon, n }) => (
                  <button
                    type="button"
                    key={n}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: "oklch(var(--navy-800))",
                      color: "oklch(var(--gold-400))",
                    }}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() =>
                        scrollTo(
                          `#${link.toLowerCase().replace(" ", "").replace("us", "")}`,
                        )
                      }
                      className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight
                        size={12}
                        style={{ color: "oklch(var(--gold-500))" }}
                      />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">
                Programs
              </h4>
              <ul className="space-y-2">
                {programs.map((prog) => (
                  <li key={prog}>
                    <button
                      type="button"
                      onClick={() => scrollTo("#programs")}
                      className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight
                        size={12}
                        style={{ color: "oklch(var(--gold-500))" }}
                      />
                      {prog}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-bold text-white mb-4">
                Contact Info
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-white/60">
                  <MapPin
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "oklch(var(--gold-400))" }}
                  />
                  Grand Trunk Road, Amritsar, Punjab 143001
                </li>
                <li className="flex items-center gap-2 text-sm text-white/60">
                  <Phone
                    size={14}
                    style={{ color: "oklch(var(--gold-400))" }}
                  />
                  +91-183-2500XXX
                </li>
                <li className="flex items-center gap-2 text-sm text-white/60">
                  <Mail size={14} style={{ color: "oklch(var(--gold-400))" }} />
                  info@khalsanursing.edu.in
                </li>
              </ul>

              <div
                className="mt-4 p-3 rounded-lg"
                style={{ backgroundColor: "oklch(var(--navy-800))" }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "oklch(var(--gold-400))" }}
                >
                  Accredited By
                </div>
                <div className="text-xs text-white/60 space-y-0.5">
                  <div>• Indian Nursing Council (INC)</div>
                  <div>• BFUHS, Faridkot</div>
                  <div>• Punjab Nurses Registration Council</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm"
            style={{ borderTop: "1px solid oklch(var(--navy-700))" }}
          >
            <p className="text-white/50">
              © {year} Khalsa College of Nursing, Amritsar. All Rights Reserved.
            </p>
            <p className="text-white/40">
              Built with{" "}
              <Heart
                size={12}
                className="inline mx-1"
                style={{ color: "oklch(var(--gold-400))" }}
              />
              using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors underline underline-offset-2"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═════════════════════════════════════════════════════════════════════════════
export default function App() {
  return (
    <div className="min-h-screen font-body">
      <Toaster position="top-right" />
      <Navbar />
      <main>
        <HeroSection />
        <NoticeBoard />
        <AboutSection />
        <ProgramsSection />
        <FacilitiesSection />
        <FacultySection />
        <AdmissionsSection />
        <NewsEventsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
