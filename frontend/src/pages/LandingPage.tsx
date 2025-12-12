import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

// Assets
import heroVideo from "@assets/generated_videos/abstract_cinematic_gradient_background_with_soft_teal_and_purple_tones.mp4";
import ctaVideo from "@assets/generated_videos/abstract_clean_light_flow_background_with_soft_cyan_tones.mp4";
import avatarMale from "@assets/generated_images/stylish_male_dj_portrait_with_headphones.png";
import avatarFemale from "@assets/generated_images/stylish_female_dj_portrait_with_headphones.png";

// --- Components ---

const Hero = ({ onOpenWaitlist }: { onOpenWaitlist: () => void }) => {
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
          className="text-4xl md:text-5xl lg:text-6xl text-primary tracking-tight leading-[1] mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
        >
          Skip the fluff
          <br />
          <span
            className="text-5xl md:text-7xl lg:text-8xl block mt-2 mb-6 whitespace-nowrap"
            style={{
              color: '#d4ff00',
              textShadow: '0 0 60px rgba(212, 255, 0, 0.7), 0 0 120px rgba(212, 255, 0, 0.4)',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Get the wisdom
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mx-auto mb-12 relative"
        >
          {/* Outer glow layer - cyan accent */}
          <div
            className="absolute -inset-12"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.15) 0%, rgba(180,100,255,0.1) 40%, rgba(255,255,255,0) 70%)',
              borderRadius: '9999px',
              filter: 'blur(20px)',
              animation: 'wavyBlob 10s ease-in-out infinite',
            }}
          />
          {/* Middle shimmer layer */}
          <div
            className="absolute -inset-8"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(212,255,0,0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(0,255,255,0.15) 0%, transparent 50%)',
              borderRadius: '9999px',
              filter: 'blur(8px)',
              animation: 'wavyBlob 7s ease-in-out infinite reverse',
            }}
          />
          {/* Main white background */}
          <div
            className="absolute -inset-6"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
              borderRadius: '9999px',
              filter: 'blur(2px)',
              animation: 'wavyBlob 8s ease-in-out infinite',
            }}
          />
          {/* Inner crisp layer */}
          <div
            className="absolute -inset-4"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 100%)',
              borderRadius: '9999px',
              animation: 'wavyBlob 6s ease-in-out infinite reverse',
            }}
          />
          <p
            className="relative text-xl md:text-2xl font-light tracking-wide px-8 py-5"
            style={{
              color: '#1a1a1a',
            }}
          >
            Insight extraction from long-form audio.
            <br className="hidden md:block" />
            Turn long podcasts into 5-minute epiphanies.
          </p>
          <style>{`
            @keyframes wavyBlob {
              0%, 100% {
                border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                transform: scale(1) rotate(0deg);
              }
              25% {
                border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                transform: scale(1.03) rotate(2deg);
              }
              50% {
                border-radius: 50% 60% 30% 60% / 40% 30% 70% 50%;
                transform: scale(0.98) rotate(-1deg);
              }
              75% {
                border-radius: 40% 30% 60% 50% / 70% 50% 40% 30%;
                transform: scale(1.02) rotate(1deg);
              }
            }
          `}</style>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-6 justify-center items-center mt-24"
        >
          <Button
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg font-medium tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={onOpenWaitlist}
            data-testid="button-hero-cta"
          >
            Start Curating
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-primary text-primary hover:bg-primary/5 h-14 px-10 text-lg font-medium tracking-wide transition-all duration-300 group cursor-pointer"
            data-testid="button-demo"
          >
            <Play className="w-4 h-4 mr-3 fill-current group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </motion.div>
      </div>

    </section>
  );
};

const AvatarSection = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-16 items-center max-w-6xl mx-auto">
          {/* Transformation Cards - Side by Side */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-4 w-full max-w-4xl">
            {/* Before Card */}
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative group"
            >
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="relative flex flex-col items-center text-center space-y-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg grayscale-[30%]">
                      <img
                        src={avatarMale}
                        alt="Host"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Play indicator */}
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[8px] border-l-gray-400 border-y-[6px] border-y-transparent ml-1" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em]">Original Episode</p>
                    <p className="text-4xl md:text-5xl font-bold text-gray-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>2h 47m</p>
                  </div>

                  {/* Progress bar (mostly empty) */}
                  <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full w-[8%] bg-gray-400 rounded-full" />
                  </div>
                  <p className="text-xs text-gray-400 italic">Most people drop off after 12 minutes...</p>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center py-4 md:py-0 md:px-4"
            >
              <span
                className="text-5xl md:text-7xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.4))'
                }}
              >→</span>
            </motion.div>

            {/* After Card */}
            <motion.div
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative group"
            >
              <div
                className="relative rounded-3xl p-8 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                  boxShadow: '0 0 60px rgba(212, 255, 0, 0.15), 0 25px 50px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#d4ff00] opacity-10 blur-3xl rounded-full" />

                <div className="relative flex flex-col items-center text-center space-y-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden"
                      style={{ boxShadow: '0 0 30px rgba(212, 255, 0, 0.4)' }}
                    >
                      <img
                        src={avatarFemale}
                        alt="Insight"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Check indicator */}
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-lg text-green-500">✓</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-1">
                    <p className="font-mono text-xs text-white/60 uppercase tracking-[0.2em]">Your Insight</p>
                    <p
                      className="text-4xl md:text-5xl font-bold"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#d4ff00',
                        textShadow: '0 0 30px rgba(212, 255, 0, 0.5)'
                      }}
                    >5m 12s</p>
                  </div>

                  {/* Progress bar (complete) */}
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-full rounded-full" style={{ backgroundColor: '#d4ff00' }} />
                  </div>
                  <p className="text-xs text-white/50 italic">100% signal. Zero fluff.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center items-center text-center space-y-6 max-w-3xl relative">
            {/* Dark smoke cloud behind text */}
            <div
              className="absolute -inset-12 md:-inset-24 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(20, 10, 40, 0.6) 0%, rgba(30, 20, 50, 0.4) 50%, transparent 80%)',
                zIndex: -1
              }}
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
            >
              <span
                className="text-3xl md:text-5xl"
                style={{
                  background: 'linear-gradient(135deg, #0e7490 0%, #6d28d9 50%, #7c3aed 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Hours of content
              </span>
              <br />
              <span className="block h-2 md:h-4" />
              <span
                className="text-5xl md:text-7xl"
                style={{
                  background: 'linear-gradient(135deg, #0891b2 0%, #5b21b6 50%, #6d28d9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Minutes of{' '}
              </span>
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 blur-3xl opacity-80"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 165, 0, 0.7) 30%, rgba(139, 92, 246, 0.5) 60%, transparent 80%)',
                    transform: 'scale(2)'
                  }}
                />
                <span
                  className="relative text-6xl md:text-8xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFC125 25%, #DAA520 50%, #FFD700 75%, #FFC125 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    filter: 'drop-shadow(0 0 40px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 80px rgba(218, 165, 32, 0.5))',
                    letterSpacing: '0.02em'
                  }}
                >
                  GOLD
                </span>
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-xl"
            >
              We filter the noise. You tune into the signal.
              <br />
              AI curators extract golden nuggets.
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
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="h-full p-10 md:p-12 rounded-3xl relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(103, 232, 255, 0.55) 0%, rgba(94, 213, 237, 0.5) 50%, rgba(78, 195, 218, 0.45) 100%)',
                boxShadow: '0 20px 60px rgba(6, 182, 212, 0.2)',
                maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 60%, transparent 100%)'
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-20 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200 opacity-30 blur-2xl rounded-full" />
              <div className="relative space-y-4">
                <h3
                  className="text-3xl md:text-4xl"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0e7490 0%, #6d28d9 50%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >Quick Learners</h3>
                <p className="text-gray-700 font-light text-lg md:text-xl">
                  5 podcasts distilled into one TikTok break.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="h-full p-10 md:p-12 rounded-3xl relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.55) 0%, rgba(178, 150, 252, 0.5) 50%, rgba(167, 139, 250, 0.45) 100%)',
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.2)',
                maskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 95% 95% at 50% 50%, black 60%, transparent 100%)'
              }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-20 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 opacity-30 blur-2xl rounded-full" />
              <div className="relative space-y-4">
                <h3
                  className="text-3xl md:text-4xl"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0e7490 0%, #6d28d9 50%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >Content Creators</h3>
                <p className="text-gray-700 font-light text-lg md:text-xl">
                  Find the most impactful clips to remix, share, and expand upon.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      title: "Drop Link",
      desc: "Paste any podcast or video URL",
      icon: <ArrowRight className="w-7 h-7" />,
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      shadowColor: 'rgba(6, 182, 212, 0.4)'
    },
    {
      title: "AI Extracts",
      desc: "Our engine identifies key insights",
      icon: <Loader2 className="w-7 h-7 animate-spin" />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      shadowColor: 'rgba(139, 92, 246, 0.4)'
    },
    {
      title: "Get Wisdom",
      desc: "Receive shareable, potent clips",
      icon: <Check className="w-7 h-7" />,
      gradient: 'linear-gradient(135deg, #d4ff00 0%, #a3e635 100%)',
      shadowColor: 'rgba(212, 255, 0, 0.4)'
    },
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
          <h2
            className="text-4xl md:text-5xl mb-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              background: 'linear-gradient(135deg, #0891b2 0%, #6d28d9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >The Process</h2>
          <div className="h-1 w-20 rounded-full" style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }} />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px z-0" style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #d4ff00)' }} />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative z-10 bg-white md:bg-transparent pr-4"
            >
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 hover:scale-105"
                style={{
                  background: step.gradient,
                  boxShadow: `0 10px 30px ${step.shadowColor}`
                }}
              >
                <span className={i === 2 ? "text-gray-900" : "text-white"}>
                  {step.icon}
                </span>
              </div>
              <h3
                className="text-2xl mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
              >{step.title}</h3>
              <p className="text-muted-foreground font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    { quote: "It's like downloading knowledge directly into my brain. The curation is impeccable", author: "Elena R.", role: "Product Designer", gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.8) 0%, rgba(8, 145, 178, 0.8) 100%)' },
    { quote: "I used to skip podcasts because they were too long. Now I consume the best parts of 10 a week", author: "Marcus T.", role: "Founder", gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)' },
    { quote: "The most elegant tool in my research stack. Absolutely essential", author: "Sarah K.", role: "Journalist", gradient: 'linear-gradient(135deg, rgba(212, 255, 0, 0.8) 0%, rgba(163, 230, 53, 0.8) 100%)' },
  ];

  return (
    <section className="py-32 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="p-8 md:p-10 rounded-2xl relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
              style={{
                background: t.gradient,
                boxShadow: i === 2 ? '0 20px 50px rgba(212, 255, 0, 0.3)' : i === 1 ? '0 20px 50px rgba(139, 92, 246, 0.3)' : '0 20px 50px rgba(6, 182, 212, 0.3)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 blur-3xl rounded-full" />
              <p
                className="text-xl md:text-2xl leading-relaxed mb-8"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 500,
                  color: i === 2 ? '#1a1a2e' : 'white'
                }}
              >"{t.quote}"</p>
              <div>
                <p
                  className="font-bold text-sm tracking-wide"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: i === 2 ? '#1a1a2e' : 'white'
                  }}
                >{t.author}</p>
                <p
                  className="text-xs uppercase tracking-wider mt-1"
                  style={{ color: i === 2 ? 'rgba(26, 26, 46, 0.7)' : 'rgba(255, 255, 255, 0.7)' }}
                >{t.role}</p>
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
          className="text-5xl md:text-7xl lg:text-8xl mb-14"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
        >
          3 hours?
          <br />
          <span className="text-cyan-200/80 italic text-4xl md:text-5xl lg:text-6xl whitespace-nowrap" style={{ fontWeight: 400 }}>Ain't nobody got time</span>
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
            Start Curating
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
  const [, setLocation] = useLocation();
  const goToApp = () => setLocation("/app");

  return (
    <div className="bg-white min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
      <Hero onOpenWaitlist={goToApp} />
      <AvatarSection />
      <PerfectFor />
      <HowItWorks />
      <Testimonials />
      <FinalCTA onOpenWaitlist={goToApp} />

      {/* Footer */}
      <footer className="py-12 bg-black text-white/30 text-center text-xs font-mono uppercase tracking-widest border-t border-white/10">
        <p>© 2025 PodVibe.fm | All rights reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;
