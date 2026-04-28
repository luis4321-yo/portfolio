import { useEffect, useRef, useState } from "react";

export default function Portfolio() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [currentProject, setCurrentProject] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Build particles — density scales with screen size
    const particleCount = Math.min(280, Math.floor((width * height) / 7500));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      // Slow constant drift — the only thing moving these particles
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 2.5 + 1.2,
    }));

    const CONNECT_DIST = 130;        // particle-to-particle line distance
    const CURSOR_CONNECT_DIST = 200; // how far the cursor can reach nodes
    let animationId;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update + draw particles — slow, constant, infinite drift
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Constant motion, no cursor physics
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges for infinite movement
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Glow particles that are near the cursor
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = dist < CURSOR_CONNECT_DIST ? 1 - dist / CURSOR_CONNECT_DIST : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + glow * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 212, ${0.5 + glow * 0.5})`;
        ctx.fill();
      }

      // Particle-to-particle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.strokeStyle = `rgba(94, 234, 212, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Cursor-to-node lines — only when cursor is actually on screen
      if (
        mouseRef.current.x > 0 &&
        mouseRef.current.y > 0 &&
        mouseRef.current.x < width &&
        mouseRef.current.y < height
      ) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_CONNECT_DIST) {
            const opacity = (1 - dist / CURSOR_CONNECT_DIST) * 0.8;
            ctx.strokeStyle = `rgba(94, 234, 212, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const projects = [
    {
      title: "Customer Service Management System",
      tag: "Web Application",
      desc: "Designed the relational database schema, built UI mockups in Figma for the customer, technician, and operations manager interfaces, defined the technical stack, and deployed the Django application on a cloud-based Ubuntu server with Nginx and Gunicorn.",
      stack: ["Django", "Python", "MySQL"],
      image: "/supreme.png",
    },
    {
      title: "Lazapee Payroll System",
      desc: "A Django-based payroll system with role-based access, automated periodic payslip generation, and full CRUD for employee records.",
      stack: ["Django", "Python", "Bootstrap", "CSS"],
      image: "/lazapee.png",
    },
    {
      title: "FetchIt E-commerce Platform",
      tag: "Web Application",
      desc: "A specialized e-commerce platform designed to centralize and streamline the procurement of pet supplies. Built a reliable shopping cart system that allows users to add, edit, and remove items in real-time without data errors. I also integrated secure session tracking to ensure a user’s items stay saved in their cart for up to a week, making it easy for them to return and finish their purchase.",
      stack: ["NodeJs", "React", "MySQL"],
      image: "/fetchit.png",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Node network canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Vignette overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.6) 100%)",
        }}
      />

      {/* Fixed Nav — stays at top regardless of scroll */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-16 py-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div
          className="text-xl tracking-[0.3em] text-teal-300"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
        </div>
        <div
          className="hidden md:flex gap-10 text-xs tracking-[0.25em] text-slate-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <a href="#work" className="hover:text-teal-300 transition-colors">
            WORK
          </a>
          <a href="#about" className="hover:text-teal-300 transition-colors">
            ABOUT
          </a>
          <a href="#contact" className="hover:text-teal-300 transition-colors">
            CONTACT
          </a>
        </div>
      </nav>

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Hero */}
        <header id="about" className="px-8 md:px-16 pt-32 pb-32 md:pt-40 md:pb-48">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center justify-center max-w-7xl mx-auto">
            {/* Photo */}
            <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56">
              <div className="w-full h-full bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
                <img
                  src="/photo.jpg"
                  alt="Luis Atencio"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUzNGVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzlhYTZhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFkZCBQaG90bzwvdGV4dD48L3N2Zz4=";
                  }}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <div
                className="text-xs tracking-[0.4em] text-teal-300 mb-8"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl leading-[0.9] font-light tracking-tight"
                style={{ fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif" }}
              >
                Hi, I'm
                <span className="italic text-teal-300"> Luis Atencio.</span>
                <br />
                A passionate designer and developer studying Management Information Systems who loves to build.
              </h1>
              <p
                className="mt-12 max-w-xl text-slate-400 text-base md:text-lg leading-relaxed"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
              </p>
            </div>
          </div>
        </header>

        {/* Projects section */}
        <section id="work" className="px-8 md:px-16 pb-32">
          <div className="flex items-baseline justify-between mb-16 border-b border-slate-800 pb-6">
            <h2
              className="text-3xl md:text-4xl tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Featured <span className="italic">Works</span>
            </h2>
            <span
              className="text-xs tracking-[0.3em] text-slate-500"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
            </span>
          </div>

          {/* Project Carousel */}
          <div className="max-w-5xl mx-auto">
            {/* Main Project Card */}
            <div className="relative mb-16">
              <div className="relative border border-slate-800 backdrop-blur-sm transition-all duration-500 bg-slate-900/50">
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-teal-300/40" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-teal-300/40" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-teal-300/40" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-teal-300/40" />

                <div className="grid grid-cols-1 gap-8 p-12">
                  {/* Project Image */}
                  <div className="relative">
                    <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden max-w-3xl mx-auto w-full border border-slate-700">
                      <img
                        src={projects[currentProject].image}
                        alt={projects[currentProject].title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWUzNGVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlhYTZhYiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                        }}
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="flex flex-col justify-center">
                    <div
                      className="text-xs tracking-[0.3em] text-teal-300 mb-4"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      / {projects[currentProject].num}
                    </div>

                    <div
                      className="text-[10px] tracking-[0.25em] text-slate-500 mb-3 uppercase"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {projects[currentProject].tag}
                    </div>

                    <h3
                      className="text-5xl mb-8 leading-tight text-slate-100"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {projects[currentProject].title}
                    </h3>

                    <p
                      className="text-sm text-slate-400 leading-relaxed mb-8"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {projects[currentProject].desc}
                    </p>

                    <div className="mb-8">
                      <div
                        className="text-xs tracking-[0.25em] text-slate-500 mb-3 uppercase"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        Tech Stack
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {projects[currentProject].stack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] tracking-widest px-3 py-1 border border-slate-700 text-slate-400 rounded"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2 text-xs tracking-[0.25em] text-teal-300 pt-4 border-t border-slate-800 cursor-pointer hover:text-teal-200 transition-colors"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      <span className="transition-transform duration-300 hover:translate-x-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentProject(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentProject === idx
                      ? 'bg-teal-300 scale-125'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`View project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack section */}
        <section className="px-8 md:px-16 pb-32">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl md:text-4xl tracking-tight mb-16"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Tech <span className="italic">Stack</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { name: "JavaScript", image: "/images/javascript.png" },
                { name: "Node.js", image: "/images/nodejs.png" },
                { name: "React.js", image: "/images/reactjs.png" },
                { name: "Python", image: "/images/python.png" },
                { name: "Django", image: "/images/django.png" },
                { name: "HTML", image: "/images/html.png" },
                { name: "CSS", image: "/images/css.png" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="border border-slate-700 rounded-lg p-6 md:p-8 flex flex-col items-center justify-center gap-4 hover:border-teal-300/50 hover:bg-slate-900/50 transition-all duration-300 bg-slate-900/30"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                    <img
                      src={tech.image}
                      alt={tech.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div
                    className="text-sm md:text-base text-slate-300 text-center"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {tech.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="contact"
          className="px-8 md:px-16 py-16 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-6"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <div className="text-xs tracking-[0.3em] text-slate-500">
            © 2026 — Alfonso Luis Atencio
          </div>
          <div className="flex flex-col sm:flex-row gap-8 text-base md:text-lg tracking-[0.3em] text-slate-400">
            <a href="https://github.com/luis4321-yo" className="hover:text-teal-300 transition-colors flex items-center gap-4">
              <img src="/github-removebg-preview.png" alt="GitHub" className="w-8 h-8 brightness-0 invert" />
              <span>:</span>
              <span>luis4321-yo</span>
            </a>
            <a href="mailto:atencioluis206@gmail.com" className="hover:text-teal-300 transition-colors flex items-center gap-4">
              <img src="/gmail-removebg-preview.png" alt="Email" className="w-8 h-8" />
              <span>:</span>
              <span>atencioluis206@gmail.com</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}