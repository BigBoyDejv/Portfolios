import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, User, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser"; // 1. Importuj knižnicu

const ContactSection = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);

    emailjs.sendForm(
      'service_9xy62sb',
      'template_y1hno4q',
      formRef.current,
      '9KMLskRPB9IM5vci8'
    )
      .then(() => {
        setIsSent(true);
        setIsSending(false);
        formRef.current?.reset();
        setTimeout(() => setIsSent(false), 5000); // Skryje hlášku po 5 sekundách
      }, (error) => {
        console.error("EmailJS Error:", error.text);
        setIsSending(false);
        alert("Ups! Niečo sa nepodarilo. Skús to prosím znova alebo mi napíš priamo.");
      });
  };

  return (
    <motion.section className="py-20" /* ... tvoje animácie ... */ >
      <motion.h2 className="text-4xl md:text-5xl font-bold font-display gradient-text mb-4">
        Get In Touch
      </motion.h2>

      {isSent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 border border-primary/50 bg-primary/10 rounded-xl flex items-center gap-4 text-primary"
        >
          <CheckCircle size={24} />
          <p className="font-display font-semibold">Message sent successfully! I'll get back to you soon.</p>
        </motion.div>
      ) : (
        <motion.form
          ref={formRef}
          className="max-w-lg space-y-5"
          onSubmit={sendEmail}
        >
          <div className="relative">
            <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === "name" ? "text-primary" : "text-muted-foreground/40"}`} />
            <input
              name="user_name" // Dôležité: toto meno musí súhlasiť s template v EmailJS
              type="text"
              required
              placeholder="Your Name"
              className="neon-input w-full pl-10"
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div className="relative">
            <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === "email" ? "text-primary" : "text-muted-foreground/40"}`} />
            <input
              name="user_email" // Dôležité
              type="email"
              required
              placeholder="your@email.com"
              className="neon-input w-full pl-10"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div className="relative">
            <MessageSquare size={16} className={`absolute left-4 top-4 transition-colors ${focused === "message" ? "text-primary" : "text-muted-foreground/40"}`} />
            <textarea
              name="message" // Dôležité
              rows={5}
              required
              placeholder="Tell me about your project..."
              className="neon-input w-full pl-10 resize-none"
              onFocus={() => setFocused("message")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSending}
            className={`gradient-primary px-8 py-3 rounded-lg font-display font-semibold text-primary-foreground flex items-center gap-2 glow-box ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Send size={16} />
            {isSending ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>
      )}
    </motion.section>
  );
};

export default ContactSection;