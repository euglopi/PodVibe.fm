import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistDialog } from "@/components/WaitlistDialog";

// Assets
import heroVideo from "@assets/videos/hero-background.mp4";
import ctaVideo from "@assets/videos/cta-background.mp4";
import avatarMale from "@assets/images/avatar-male.png";
import avatarFemale from "@assets/images/avatar-female.png";

// --- Components ---

const Hero = ({ onNavigateToApp }: { onNavigateToApp: () => void }) => {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Light Gradient Veil */}
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-primary tracking-tight leading-[0.9] mb-8"
        >
          Skip the fluff.
          <br />
          <span className="italic font-light opacity-80">Get the wisdom.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-12 tracking-wide"
        >
          Instant insight extraction from long-form audio.
          <br className="hidden md:block" />
          Turn 3-hour conversations into 5-minute epiphanies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <Button
            size="lg"
            className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105"
            onClick={onNavigateToApp}
            data-testid="button-hero-cta"
          >
            Start Curating
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-none border-primary text-primary hover:bg-primary/5 h-14 px-8 text-lg font-medium tracking-wide transition-all duration-300 group"
            data-testid="button-demo"
          >
            <Play className="w-4 h-4 mr-3 fill-current group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>
      </div>

      {/* Minimalist Right Rail Nav */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-8 z-50 mix-blend-difference text-white/50">
        {["01", "02", "03", "04"].map((num) => (
          <span
            key={num}
            className="text-xs font-mono cursor-pointer hover:text-white transition-colors"
          >
            {num}
          </span>
        ))}
      </div>
    </section>
  );
};

const AvatarSection = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
          {/* Avatar Composition */}
          <div className="relative h-[500px] w-full flex items-center justify-center">
            {/* Avatar A (Male) */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute left-0 top-10 md:left-10 md:top-0 z-10"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl relative">
                <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-10" />
                <img
                  src={avatarMale}
                  alt="Curator"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-105"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 shadow-xl border border-gray-100">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  Original
                </p>
                <p className="font-serif text-3xl">3h 12m</p>
              </div>
            </motion.div>

            {/* Avatar B (Female) */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute right-0 bottom-10 md:right-10 md:bottom-0 z-0 opacity-80"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl relative">
                <div className="absolute inset-0 bg-purple-500/20 mix-blend-overlay z-10" />
                <img
                  src={avatarFemale}
                  alt="Insight"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -left-6 bg-primary text-white p-4 shadow-xl z-20">
                <p className="font-mono text-xs text-white/70 uppercase tracking-widest mb-1">
                  Insight
                </p>
                <p className="font-serif text-3xl">5m 24s</p>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif leading-none"
            >
              Why spend hours when the value lives in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">minutes?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-muted-foreground font-light leading-relaxed max-w-md"
            >
              We filter the noise so you can tune into the signal. Our curators (AI & Human) extract the golden nuggets from long-form content instantly.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PerfectFor = () => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full border-0 shadow-none bg-white p-12 hover:shadow-2xl transition-all duration-500 group cursor-default">
              <CardContent className="p-0 space-y-6">
                <div className="w-12 h-12 bg-cyan-50 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <span className="font-serif text-2xl text-cyan-900 italic">Q</span>
                </div>
                <h3 className="text-3xl font-serif">Quick Learners</h3>
                <p className="text-muted-foreground font-light text-lg">
                  Absorb the wisdom of 5 podcasts in the time it takes to listen to one.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-0 shadow-none bg-white p-12 hover:shadow-2xl transition-all duration-500 group cursor-default">
              <CardContent className="p-0 space-y-6">
                <div className="w-12 h-12 bg-purple-50 flex items-center justify-center rounded-full mb-6 group-hover:scale-110 transition-transform">
                  <span className="font-serif text-2xl text-purple-900 italic">C</span>
                </div>
                <h3 className="text-3xl font-serif">Content Creators</h3>
                <p className="text-muted-foreground font-light text-lg">
                  Find the most impactful clips to remix, share, and expand upon instantly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Drop Link", desc: "Paste any podcast or video URL.", icon: <ArrowRight className="w-6 h-6" /> },
    { title: "AI Extracts", desc: "Our engine identifies key insights.", icon: <Loader2 className="w-6 h-6 animate-spin" /> },
    { title: "Get Wisdom", desc: "Receive shareable, potent clips.", icon: <Check className="w-6 h-6" /> },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-20"
        >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">The Process</h2>
            <div className="h-px w-20 bg-black/10" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gray-100 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 bg-white md:bg-transparent pr-4"
            >
              <div className="w-24 h-24 bg-white border border-gray-100 flex items-center justify-center mb-8 shadow-sm group hover:border-black transition-colors duration-300">
                <span className="text-gray-400 group-hover:text-black transition-colors">
                    {step.icon}
                </span>
              </div>
              <span className="font-mono text-xs text-gray-400 mb-2 block">0{i + 1}</span>
              <h3 className="text-2xl font-serif mb-3">{step.title}</h3>
              <p className="text-muted-foreground font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-32 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { quote: "It's like downloading knowledge directly into my brain. The curation is impeccable.", author: "Elena R.", role: "Product Designer" },
            { quote: "I used to skip podcasts because they were too long. Now I consume the best parts of 10 a week.", author: "Marcus T.", role: "Founder" },
            { quote: "The most elegant tool in my research stack. Absolutely essential.", author: "Sarah K.", role: "Journalist" },
          ].map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 md:p-12 bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <p className="font-serif text-xl md:text-2xl leading-relaxed mb-8 text-gray-800">"{t.quote}"</p>
              <div>
                <p className="font-bold text-sm tracking-wide">{t.author}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FinalCTA = ({ onOpenWaitlist }: { onOpenWaitlist: () => void }) => {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center bg-black text-white">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={ctaVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-serif mb-8"
        >
          Learn smarter,
          <br />
          <span className="text-cyan-200/80 italic">not longer.</span>
        </motion.h2>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <Button
            size="lg"
            className="rounded-full bg-white text-black hover:bg-gray-100 h-16 px-10 text-xl font-medium tracking-wide mb-6 transition-transform hover:scale-105"
            onClick={onOpenWaitlist}
            data-testid="button-final-cta"
            >
            Get Started Free
            </Button>
            <p className="text-white/40 text-sm font-light tracking-widest uppercase">
            No credit card · Cancel anytime
            </p>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <div className="bg-white min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
      <Hero onNavigateToApp={() => setLocation("/app")} />
      <AvatarSection />
      <PerfectFor />
      <HowItWorks />
      <Testimonials />
      <FinalCTA onOpenWaitlist={() => setWaitlistOpen(true)} />

      {/* Footer */}
      <footer className="py-12 bg-black text-white/30 text-center text-xs font-mono uppercase tracking-widest border-t border-white/10">
        <p>&copy; 2025 PodVibe.fm. All rights reserved.</p>
      </footer>

      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </div>
  );
};

export default LandingPage;
