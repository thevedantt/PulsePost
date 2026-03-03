import MarketingNavbar from "@/components/MarketingNavbar";
import { FeatureCard } from "@/components/FeatureCard";
import TweetCard from "@/components/TweetCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Grid3X3, Layers, Lock, Sparkles, TerminalSquare, LayoutTemplate, Atom, Palette, Component, Server, FileJson, Database, KeyRound, Box, Github, Linkedin } from "lucide-react";
import type { Tweet } from "@/lib/api";

const MOCK_TWEET: Tweet = {
  id: 999,
  user: "alex_dev",
  text: "Just deployed the new multi-image grid system! It automatically adapts based on whether you upload 1, 2, 3, or exactly 4 images. Completely refactored the backend in Django to use bulk_create for maximum efficiency. What do you think? 🚀✨",
  created_at: new Date().toISOString(),
  images: [
    { id: 1, image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80", created_at: "" },
    { id: 2, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80", created_at: "" },
    { id: 3, image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=600&q=80", created_at: "" },
    { id: 4, image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80", created_at: "" },
  ],
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Top Navigation */}
      <MarketingNavbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="mx-auto max-w-6xl px-6 md:px-12 text-center">
            <Badge variant="outline" className="mb-6 rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" /> PulsePost v1.0 is live
            </Badge>
            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl">
              Share your thoughts. <br className="hidden sm:block" />
              Share your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">moments.</span>
              <br className="hidden sm:block" />
              All in one pulse.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              A clean, modern microblogging platform built for simplicity — with multi-image posts, scalable profiles, and seamless session-based authentication.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base font-medium rounded-full transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-medium rounded-full transition-transform hover:-translate-y-1">
                <Link href="#preview">View Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* 2. PRODUCT PREVIEW SECTION */}
        <section id="preview" className="relative py-24 bg-muted/30">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Experience the Feed</h2>
              <p className="mt-4 text-lg text-muted-foreground mb-8">
                See how your content looks with our adaptive image grid engine.
              </p>
            </div>

            {/* TweetCard Preview Wrapper */}
            <div className="mx-auto max-w-2xl relative group perspective-1000">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/30 to-primary/10 opacity-30 blur-xl transition-opacity duration-500 group-hover:opacity-70" />
              <div className="relative rounded-xl border border-border/50 bg-card shadow-2xl overflow-hidden pointer-events-none">
                {/* Simulated application chrome/header */}
                <div className="border-b bg-muted/40 px-4 py-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-foreground/80">Home Feed</div>
                  <Sparkles className="h-4 w-4 text-primary/60" />
                </div>
                <div className="p-4 sm:p-6 pb-2">
                  <TweetCard tweet={MOCK_TWEET} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* 3. FEATURE HIGHLIGHTS */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-16 md:text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Designed for scale. Built for speed.</h2>
              <p className="mt-4 text-lg text-muted-foreground md:mx-auto md:max-w-2xl">
                Under the hood, PulsePost utilizes industry-standard architectural patterns ranging from relational multi-image schemas to CSRF-protected session authentication.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={Grid3X3}
                title="Multi-Image Tweets"
                description="Post up to multiple images in a clean responsive grid layout engineered to prevent layout shifts and maximize engagement."
                highlight="Smart grid system adapts automatically."
              />
              <FeatureCard
                icon={Layers}
                title="Profile System"
                description="Public profiles with tweet history aggregation, personalized avatars, and rich biographic context."
                highlight="Session-based secure access."
              />
              <FeatureCard
                icon={TerminalSquare}
                title="Clean Architecture"
                description="Built completely decoupled using Next.js app router consuming a Django REST Framework API layer."
                highlight="Scalable. Secure. Modern."
              />
            </div>
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* 4. TECH STACK & ARCHITECTURE */}
        <section id="architecture" className="py-24 bg-muted/10">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-16 md:text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">⚙️ Tech Stack & Architecture</h2>
              <p className="mt-4 text-lg text-muted-foreground md:mx-auto md:max-w-2xl">
                Built with a modern, decoupled architecture pushing performance across the stack.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: LayoutTemplate, name: "Next.js", desc: "App Router architecture, server components, optimized rendering." },
                { icon: Atom, name: "React", desc: "Interactive UI state management and hooks." },
                { icon: Palette, name: "Tailwind CSS", desc: "Utility-first styling with custom semantic tokens." },
                { icon: Component, name: "shadcn/ui", desc: "Accessible, unstyled components seamlessly integrated." },
                { icon: Server, name: "Django", desc: "Robust Python backend handling core database logic." },
                { icon: FileJson, name: "Django REST", desc: "Decoupled API endpoints communicating securely." },
                { icon: Database, name: "SQLite / Postgres", desc: "Relational modeling for multi-image tweet schemas." },
                { icon: KeyRound, name: "Session Auth", desc: "CSRF-protected authentication logic built-in." },
              ].map((tech) => (
                <div key={tech.name} className="flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                  <tech.icon className="mb-4 h-8 w-8 text-primary/80" />
                  <h3 className="font-semibold text-foreground mb-1">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground leading-snug">{tech.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* 5. THEME SHOWCASE */}
        <section className="py-24 bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 md:px-12">
            <div className="mb-16 md:text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Themes customized for you</h2>
              <p className="mt-4 text-lg text-muted-foreground md:mx-auto md:max-w-xl">
                Support for both stunning light aesthetic palettes and a deep, modern dark mode experience to suit any browsing preference.
              </p>
              <p className="mt-4 text-sm font-medium text-foreground md:mx-auto md:max-w-xl">
                Built with a semantic theme token system supporting multiple palettes and dark-mode-first design.
              </p>
            </div>

            {/* Split layout explicitly avoiding next-themes logic, just mocking standard CSS values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 rounded-2xl overflow-hidden border shadow-xl">

              {/* Theme 1 - Light Blue Mock */}
              <div className="p-12 relative" style={{ backgroundColor: "#ebebeb", color: "#111" }}>
                <div className="absolute top-4 left-4 inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#10367d", color: "#fff" }}>
                  Default Light
                </div>
                <div className="mt-8 rounded-xl p-6 shadow-sm border border-black/5" style={{ backgroundColor: "#ffffff" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: "#74b4d9" }}></div>
                    <div>
                      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#111" }}></div>
                      <div className="mt-2 h-3 w-16 rounded opacity-60" style={{ backgroundColor: "#111" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-3 w-[90%] rounded opacity-80" style={{ backgroundColor: "#111" }}></div>
                    <div className="h-3 w-[60%] rounded opacity-80" style={{ backgroundColor: "#111" }}></div>
                  </div>
                  <div className="mt-6 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors cursor-pointer" style={{ backgroundColor: "#10367d", color: "#fff" }}>
                    Follow User
                  </div>
                </div>
              </div>

              {/* Theme 2 - Modern Dark Mock */}
              <div className="p-12 relative" style={{ backgroundColor: "#3e4260", color: "#ffead7" }}>
                <div className="absolute top-4 left-4 inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#ffead7", color: "#3e4260" }}>
                  Modern Night
                </div>
                <div className="mt-8 rounded-xl p-6 shadow-lg border border-white/5" style={{ backgroundColor: "#2d3047" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full opacity-80" style={{ backgroundColor: "#ffead7" }}></div>
                    <div>
                      <div className="h-4 w-24 rounded" style={{ backgroundColor: "#ffead7" }}></div>
                      <div className="mt-2 h-3 w-16 rounded opacity-60" style={{ backgroundColor: "#ffead7" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-3 w-[90%] rounded opacity-80" style={{ backgroundColor: "#ffead7" }}></div>
                    <div className="h-3 w-[60%] rounded opacity-80" style={{ backgroundColor: "#ffead7" }}></div>
                  </div>
                  <div className="mt-6 inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors cursor-pointer" style={{ backgroundColor: "#ffead7", color: "#2d3047" }}>
                    Follow User
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <Separator className="opacity-50" />

        {/* 5. CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10" />

          <div className="mx-auto max-w-4xl px-6 md:px-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Ready to start posting?</h2>
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the growing community today. Set up your profile, upload your favorite pictures, and let the world hear your voice.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-10 text-lg font-medium rounded-full shadow-lg shadow-primary/20 transition-transform hover:-translate-y-1">
                <Link href="/register">Create Your Account</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-medium rounded-full bg-background transition-transform hover:-translate-y-1">
                <Link href="/login">Login to Dashboard</Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure Session Authentication included.</span>
            </div>
          </div>
        </section>
      </main>

      {/* 6. FOOTER */}
      <footer className="border-t bg-background">
        <div className="mx-auto max-w-6xl px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4 max-w-sm">
            <span className="font-bold text-xl tracking-tight">Pulse<span className="text-primary">Post</span></span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Designed and developed as a full-stack engineering project demonstrating real-world architecture patterns and scalable UI systems.
            </p>
            <div className="text-sm font-medium text-foreground">
              Tech Stack: <span className="text-muted-foreground font-normal">Next.js • Django • Postgres</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <div className="text-sm text-muted-foreground">
              Built by <strong className="text-foreground">Vedant Talekar</strong>
            </div>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/thevedantt/PulsePost.git" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://www.linkedin.com/in/vedant-talekar-055910208/" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PulsePost
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
