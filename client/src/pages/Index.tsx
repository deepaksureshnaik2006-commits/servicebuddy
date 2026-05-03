import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, Headphones, LayoutDashboard, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: ClipboardList,
    title: "Submit a complaint easily",
    description: "Select your service issue, describe the problem, and submit your request in just a few steps — no paperwork needed.",
  },
  {
    icon: UsersRound,
    title: "Get a technician assigned",
    description: "Once you submit a complaint, a qualified technician is assigned to your request and you are kept informed.",
  },
  {
    icon: LayoutDashboard,
    title: "Track your request live",
    description: "Check your complaint status anytime from your dashboard and see real-time updates as your issue is resolved.",
  },
  {
    icon: Headphones,
    title: "Get support when needed",
    description: "If your issue is taking longer than expected, you can escalate it and receive faster follow-up from the support team.",
  },
];

const faqs = [
  {
    question: "How do I register a complaint?",
    answer: "You can sign in to your account and submit a service request by selecting the issue and providing a short description.",
  },
  {
    question: "How can I track my complaint status?",
    answer: "After logging in, go to your dashboard to view all submitted complaints and their current status.",
  },
  {
    question: "How long does it take to resolve an issue?",
    answer: "Resolution time depends on the type of service, but you can track progress updates in real time.",
  },
  {
    question: "Can I contact support if there is a delay?",
    answer: "Yes. If your issue is not resolved, you can use the support option provided in your complaint.",
  },
  {
    question: "Can I update my profile details?",
    answer: "Yes. You can update your phone number and password from your profile section.",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <a href="#" className="flex items-center gap-3" data-testid="link-home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-teal-500 text-white shadow-lg" data-testid="icon-brand">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-slate-900 sm:text-base" data-testid="text-brand-name">
              Smart CRM Platform
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#about" className="transition hover:text-blue-700" data-testid="link-about">About</a>
            <a href="#features" className="transition hover:text-blue-700" data-testid="link-features">Features</a>
            <a href="#faq" className="transition hover:text-blue-700" data-testid="link-faq">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-full border-slate-300 font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"
              onClick={() => navigate("/login")}
              data-testid="button-nav-login"
            >
              Login
            </Button>
          </div>
        </nav>
        <div className="border-t border-slate-200/70 px-4 py-2 md:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
            <a href="#about" className="transition hover:text-blue-700" data-testid="link-mobile-about">About</a>
            <a href="#features" className="transition hover:text-blue-700" data-testid="link-mobile-features">Features</a>
            <a href="#faq" className="transition hover:text-blue-700" data-testid="link-mobile-faq">FAQ</a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef7ff_45%,#ecfdf5_100%)] px-4 pb-20 pt-40 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <h1 className="animate-fade-in-up text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl" data-testid="text-hero-title">
                Customer Relationship Management System
              </h1>
              <p className="animate-fade-in-up animation-delay-150 mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl" data-testid="text-hero-tagline">
                Register a complaint, get a technician assigned, and follow your request from submission to resolution — all in one place.
              </p>
              <div className="animate-fade-in-up animation-delay-300 mt-9">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-600 px-8 py-6 text-base font-black text-white shadow-xl transition hover:scale-105 hover:shadow-2xl"
                  onClick={() => navigate("/register")}
                  data-testid="button-hero-get-started"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_30px_90px_rgba(15,23,42,0.12)]" data-testid="panel-hero-summary">
              <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-400" data-testid="text-panel-label">How it works</p>
                    <h2 className="mt-1.5 text-xl font-black tracking-tight" data-testid="text-panel-title">Your complaint journey</h2>
                  </div>
                  <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-bold text-teal-300">4 simple steps</span>
                </div>
                <div className="space-y-1" data-testid="panel-steps">
                  {[
                    { label: "Submit your complaint", sub: "Describe the issue and select a service" },
                    { label: "Technician is assigned", sub: "A qualified technician is matched to you" },
                    { label: "Track your progress", sub: "Follow live updates from your dashboard" },
                    { label: "Get support if needed", sub: "Escalate anytime for faster help" },
                  ].map(({ label, sub }, index) => (
                    <div key={label} data-testid={`row-workflow-${index}`}>
                      <div className="flex items-start gap-4 rounded-2xl px-3 py-3 transition hover:bg-white/[0.06]">
                        <div className="flex flex-col items-center">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-teal-400 text-sm font-black text-white shadow-lg" data-testid={`text-workflow-step-${index}`}>
                            {index + 1}
                          </span>
                          {index < 3 && <span className="mt-1 h-6 w-px bg-white/15" />}
                        </div>
                        <div className="pt-1">
                          <p className="font-bold leading-snug text-white" data-testid={`text-workflow-title-${index}`}>{label}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-white/50">{sub}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700" data-testid="text-about-eyebrow">How it helps you</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl" data-testid="text-about-title">
                Everything you need to get your issue resolved.
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-8 text-slate-600">
              <p data-testid="text-about-description">
                You can submit a service complaint in minutes, track its status in real time, and get support whenever you need it. No back-and-forth calls or emails — your request is handled digitally from start to finish.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {["Submit", "Track", "Resolve"].map((step) => (
                  <div key={step} className="rounded-3xl border border-slate-200 bg-slate-50 p-5" data-testid={`card-about-${step.toLowerCase()}`}>
                    <CheckCircle2 className="mb-3 h-6 w-6 text-teal-600" />
                    <p className="font-black text-slate-950" data-testid={`text-about-step-${step.toLowerCase()}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-300" data-testid="text-features-eyebrow">What you get</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl" data-testid="text-features-title">
                Everything you need, built around you.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {capabilities.map((item, index) => (
                <article key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:bg-white/[0.09]" data-testid={`card-feature-${index}`}>
                  <item.icon className="h-8 w-8 text-teal-300" />
                  <h3 className="mt-5 text-lg font-black" data-testid={`text-feature-title-${index}`}>{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/70" data-testid={`text-feature-description-${index}`}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] bg-gradient-to-br from-blue-700 via-indigo-700 to-teal-600 p-8 text-white shadow-2xl sm:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl" data-testid="text-cta-title">
                  Ready to submit your complaint and get support?
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85" data-testid="text-cta-description">
                  Create a free account to submit your service request, track its progress, and get the help you need — quickly and easily.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Button
                  size="lg"
                  className="rounded-full bg-white px-8 py-6 text-base font-black text-blue-800 transition hover:scale-105 hover:bg-slate-50"
                  onClick={() => navigate("/register")}
                  data-testid="button-cta-get-started"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700" data-testid="text-faq-eyebrow">FAQ</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl" data-testid="text-faq-title">
                Common Questions
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {faqs.map((faq, index) => (
                <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" data-testid={`card-faq-${index}`}>
                  <h3 className="text-lg font-black text-slate-950" data-testid={`text-faq-question-${index}`}>{faq.question}</h3>
                  <p className="mt-3 leading-7 text-slate-600" data-testid={`text-faq-answer-${index}`}>{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center text-sm text-slate-500">
          <p className="font-semibold" data-testid="text-footer-brand">© 2026 Smart CRM Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
