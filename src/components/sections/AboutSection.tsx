import { motion } from "framer-motion";
import { User, MapPin, Briefcase } from "lucide-react";

const AboutSection = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold font-display gradient-text mb-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        About Me
      </motion.h2>

      <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
        {/* Profile image placeholder */}
        <img
          src="/photo.png"
          alt="David Loper - Profile Photo"
          className="w-full h-full object-cover rounded-xl"
          loading="lazy"
        />

        <div className="space-y-6">
          <motion.p
            className="text-lg text-secondary-foreground/80 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I'm a creative student passionate about building modern websites and digital experiences.
            I enjoy working with the latest technologies and best practices to create clean,
            performant, and visually engaging web applications that feel alive.
          </motion.p>

          <motion.p
            className="text-secondary-foreground/60 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Specializing in building modern web applications that simplify people's lives and streamline processes.
            I enjoy creating practical digital tools that make everyday tasks faster, easier, and more efficient.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { icon: MapPin, text: "Remote Worldwide" },
              { icon: Briefcase, text: "Open to Work" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-muted-foreground"
              >
                <Icon size={14} className="text-primary" />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div
            className="flex flex-wrap gap-2 pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {["React", "Supabase", "TypeScript", "Next.js", "PostgreSQL", "Vibe Coding", "Figma", "SpringBoot", "PWA apps"].map(
              (skill, i) => (
                <motion.span
                  key={skill}
                  className="glass glow-border px-3 py-1.5 rounded-lg text-xs font-mono text-primary/80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
