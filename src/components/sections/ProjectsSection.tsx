import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Chalet Lechnica",
    description: "Reservation system for a mountain chalet, including a booking website and an admin panel for managing reservations and availability.",
    tags: ["Node.js", "Postgres", "Html"],
    color: "from-primary/30 to-accent/20",
    link: "https://chata-lechnica-production.up.railway.app",
  },
  {
    title: "Gym Managmant Software",
    description: "I developed a complete gym management system where owners, receptionists, trainers, and customers have their own roles. Members can buy memberships, book trainings, and track their gym progress, while the owner can monitor all statistics and operations.",
    tags: ["SpringBoot", "Html", "Css", "Thymeleaf", "JS", "Postgres",],
    color: "from-accent/30 to-primary/20",
    link: "https://fitnessapp-5ogv.onrender.com",
  },
  {
    title: "HammerIT",
    description: "Built a web platform that simplifies finding craftsmen and service providers. Users post job offers, and registered craftsmen can browse and respond to the requests.",
    tags: ["React", "Next.js", "Supabase", "Tailwind", "JS", "TypeScript", "Vercel"],
    color: "from-primary/20 to-accent/30",
    link: "https://hammer-it-six.vercel.app",
  },
  {
    title: "E-Guide on boat trip",
    description: "I developed an e-guide for Dunajec river rafting, featuring multi-language support, an integrated chatbot for quick assistance, and real-time GPS tracking. The application allows users to follow their exact location on the map while providing all the necessary information for a seamless rafting experience.",
    tags: ["React", "Next.js", "Supabase", "Tailwind", "JS", "TypeScript", "Cloudflare"],
    color: "from-accent/20 to-primary/30",
    link: "https://plte.jan-rusin3038.workers.dev",
  },
];

const ProjectsSection = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
        Projects
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className="glass glow-box rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              scale: 1.02,
              rotateX: 2,
              rotateY: -2,
            }}
            style={{ transformStyle: "preserve-3d" }}
          // Voliteľné: Ak chceš, aby celá karta bola klikateľná, odkomentuj riadok nižšie:
          // onClick={() => window.open(project.link, "_blank")}
          >
            {/* Gradient bg */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-3 text-muted-foreground relative z-20">
                  <a
                    href="https://github.com/BigBoyDejv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <p className="text-secondary-foreground/60 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;