import { useEffect, useState } from 'react';
import { Wind, Atom, Bot, Cpu, Plane, Check, Linkedin, Mail, ArrowUpRight, X, Menu } from 'lucide-react';
import { PortfolioUpload } from './components/PortfolioUpload';
import './App.css';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  icon: React.ElementType;
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 800);
    };
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Solo cerrar si el click es fuera del dropdown y fuera del botón Tools
      if (!target.closest('.tools-dropdown') && !target.closest('button')?.textContent?.includes('Tools')) {
        setToolsDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const capabilities = [
    'Industrial Automation (PLC & CNC)',
    'Technical Support & Systems Diagnostics',
    'English C1 (Professional Proficiency)',
    'Rapid Prototyping & CAD Design',
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: 'ZYNIONYX PCB Platform',
      category: 'Electronics',
      description: 'Custom PCB design with integrated ZL processor architecture for embedded automation systems.',
      image: '/images/28481.png',
      icon: Cpu,
    },
    {
      id: 2,
      title: 'Advanced Turbofan Engine',
      category: 'Turbine Systems',
      description: 'High-bypass turbofan design with advanced cooling and direct-drive reduction gearbox.',
      image: '/images/15728.png',
      icon: Wind,
    },
    {
      id: 3,
      title: 'V8 Twin-Turbo Powertrain',
      category: 'Propulsion',
      description: 'Direct fuel injection V8 engine with twin-turbocharging and DOHC configuration.',
      image: '/images/15725.png',
      icon: Wind,
    },
    {
      id: 4,
      title: 'Clean Room Automation',
      category: 'Industrial Robotics',
      description: 'Lithography system integration with robotic handling in semiconductor manufacturing.',
      image: '/images/15385.png',
      icon: Bot,
    },
    {
      id: 5,
      title: 'Tokamak Fusion Reactor',
      category: 'Nuclear Fusion',
      description: 'Experimental plasma confinement system for sustainable energy research.',
      image: '/images/15384.png',
      icon: Atom,
    },
    {
      id: 6,
      title: 'Hybrid-Electric Aircraft',
      category: 'Aerospace',
      description: 'Next-generation commercial aircraft with hybrid-electric propulsion and advanced cabin design.',
      image: '/images/15383.png',
      icon: Plane,
    },
    {
      id: 7,
      title: 'Medical Evacuation Helicopter',
      category: 'Aerospace',
      description: 'Hybrid-electric rotorcraft with advanced medical interior and next-gen avionics.',
      image: '/images/15382.png',
      icon: Plane,
    },
    {
      id: 8,
      title: 'Plasma Propulsion System',
      category: 'Advanced Propulsion',
      description: 'High-energy plasma thruster for next-generation spacecraft propulsion.',
      image: '/images/15349.png',
      icon: Atom,
    },
    {
      id: 9,
      title: 'Dual-Chamber Fusion Core',
      category: 'Nuclear Fusion',
      description: 'Advanced tokamak configuration with dual plasma chambers for enhanced confinement.',
      image: '/images/12978.png',
      icon: Atom,
    },
  ];

  const categories = ['All', 'Turbine Systems', 'Nuclear Fusion', 'Industrial Robotics', 'Aerospace', 'Electronics', 'Propulsion'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md border-b border-apple-gray-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="ZL Logo" 
                className="h-8 w-auto"
              />
              <span className="font-semibold text-sm tracking-tight text-foreground">
                JUAN PABLO PEREIRA
              </span>
            </div>
            <div className="flex items-center gap-6">
              {isMobile ? null : (
              <nav 
                className="flex items-center gap-8">
                {['About', 'ZYCAD', 'Projects', 'Portfolio', 'Skills', 'Contact'].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-sm text-apple-gray-500 hover:text-foreground transition-colors duration-200"
                  >
                    {item}
                  </button>
                ))}
                
                {/* Tools Dropdown */}
                <div className="relative tools-dropdown">
                  <button
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                    className="text-sm text-apple-gray-500 hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                  >
                    Tools
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {toolsDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-apple-gray-100 py-2 z-50">
                      <a
                        href="/tools/vernier-caliper.html"
                        className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-blue-50 flex items-center gap-3 transition-colors"
                      >
                        <span className="text-lg">📏</span>
                        <div>
                          <div className="font-medium">Calibrador Vernier</div>
                          <div className="text-xs text-apple-gray-400">Pie de rey digital - Precisión 1/128"</div>
                        </div>
                      </a>
                      
                      {/* More tools can be added here */}
                      <div className="border-t border-apple-gray-100 my-2"></div>
                      <div className="px-4 py-2 text-xs text-apple-gray-400">
                        Más herramientas próximamente...
                      </div>
                    </div>
                  )}
                </div>
              </nav>
              )}
              
              {/* Hamburger Menu Button */}
              {isMobile && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X size={24} className="text-foreground" />
                ) : (
                  <Menu size={24} className="text-foreground" />
                )}
              </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-apple-gray-100">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3">
            {['About', 'ZYCAD', 'Projects', 'Portfolio', 'Skills', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(item.toLowerCase());
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-apple-gray-500 hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors"
              >
                {item}
              </button>
            ))}
            <div className="h-px bg-gray-200 my-2"></div>
            <a
              href="/tools/vernier-caliper.html"
              className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              📏 Calibrador Vernier
            </a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Engineering the Future of Automation & Energy.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-apple-gray-400 font-normal">
              Bilingual Tech Specialist | Robotics & Propulsion Systems
            </p>
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* About Section */}
      <section id="about" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              About Me
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Juan Pablo Pereira
            </h2>
          </div>

          <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] items-center">
            <div className="rounded-3xl overflow-hidden border border-apple-gray-100 shadow-sm bg-white">
              <img
                src="/images/juan-pablo-pereira.jpg"
                alt="Juan Pablo Pereira"
                className="w-full h-[520px] sm:h-[560px] object-contain bg-apple-gray-50"
              />
            </div>

            <div className="space-y-6 text-apple-gray-500">
              <p>
                Juan Pablo Pereira is a Colombian entrepreneur and the founder of ZYNIONYX, a technology-driven initiative focused on building innovative solutions across software, engineering, and advanced systems.
              </p>
              <p>
                He is driven by a long-term vision to develop integrated technologies that redefine how people interact with digital and physical environments. His work centers on creating scalable systems that combine performance, efficiency, and user-focused design.
              </p>
              <p>
                With a strong interest in global business and emerging technologies, Juan Pablo is committed to building a company that not only competes at an international level, but also contributes to meaningful progress across industries.
              </p>
              <p>
                Through ZYNIONYX, he aims to shape the future of technology by developing solutions that are both ambitious and practical, with a clear focus on impact and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* ZYCAD Section */}
      <section id="zycad" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              Software Development
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              ZYCAD Software Suite
            </h2>
            <p className="mt-4 text-apple-gray-400 max-w-2xl">
              A comprehensive engineering software platform developed by ZYNIONYX, designed to streamline complex design, simulation, and analysis workflows across multiple disciplines.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Advanced CAD Modeling</h3>
              <p className="text-sm text-apple-gray-400">
                Parametric 3D modeling with intelligent feature recognition, automated dimensioning, and real-time collaboration tools for distributed teams.
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Finite Element Analysis</h3>
              <p className="text-sm text-apple-gray-400">
                Integrated FEA solver with multi-physics capabilities, including structural, thermal, and fluid dynamics analysis with cloud-based processing.
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Simulation Engine</h3>
              <p className="text-sm text-apple-gray-400">
                High-fidelity simulation environment supporting CFD, electromagnetic, and multiphysics simulations with GPU acceleration and parallel computing.
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Data Integration</h3>
              <p className="text-sm text-apple-gray-400">
                Seamless integration with PLM systems, IoT sensors, and enterprise databases for real-time data-driven design decisions.
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Optimization</h3>
              <p className="text-sm text-apple-gray-400">
                Machine learning algorithms for automated design optimization, predictive maintenance, and intelligent material selection.
              </p>
            </div>
            <div className="bg-apple-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Collaborative Platform</h3>
              <p className="text-sm text-apple-gray-400">
                Web-based platform with version control, real-time editing, and integrated communication tools for global engineering teams.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-apple-gray-400">
              ZYCAD represents the culmination of years of research in computational engineering, combining cutting-edge algorithms with intuitive user interfaces to empower innovation across industries.
            </p>
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* Gallery Section - Projects */}
      <section id="projects" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              Portfolio
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Technical Projects
            </h2>
            <p className="mt-4 text-apple-gray-400 max-w-2xl">
              A collection of conceptual engineering designs spanning aerospace, energy systems, 
              and industrial automation — all created under the ZYNIONYX research initiative.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-foreground text-white'
                    : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-apple-gray-50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-xs">
                      <project.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-apple-gray-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>View project</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* Portfolio Upload Section */}
      <section id="portfolio" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              File Management
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Upload Documents & Files
            </h2>
            <p className="mt-4 text-apple-gray-400 max-w-2xl">
              Manage your portfolio files including PDFs, design documents, technical drawings, 
              and reference materials. Organize and share your work with ease.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl border border-apple-gray-100 p-8 lg:p-12">
            <PortfolioUpload />
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* Core Capabilities Section */}
      <section id="skills" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              Expertise
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            {capabilities.map((capability, index) => (
              <div
                key={index}
                className="flex items-center gap-4 py-4 border-b border-apple-gray-100"
              >
                <div className="w-5 h-5 rounded-full bg-apple-gray-50 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-foreground" strokeWidth={2} />
                </div>
                <span className="text-sm text-foreground">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thin divider line */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-px bg-apple-gray-100" />
      </div>

      {/* Footer / Contact Section */}
      <footer id="contact" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-6">
              Let's Connect
            </h2>
            <p className="text-apple-gray-400 mb-8 leading-relaxed">
              Open to opportunities in automation, robotics, and energy systems. 
              Let's discuss how we can engineer the future together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-white text-sm font-medium rounded-full hover:bg-apple-gray-800 transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4" strokeWidth={1.5} />
                Contact via LinkedIn
              </a>
              <a
                href="mailto:juanpablo@example.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-apple-gray-50 text-foreground text-sm font-medium rounded-full hover:bg-apple-gray-100 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" strokeWidth={1.5} />
                juanpablo@example.com
              </a>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-apple-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="ZL Logo" className="h-5 w-auto opacity-50" />
                <span className="text-xs text-apple-gray-400">
                  © 2024 Juan Pablo Pereira. All rights reserved.
                </span>
              </div>
              <span className="text-xs text-apple-gray-400">
                Designed with technical precision in Floridablanca, Colombia.
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg hover:bg-apple-gray-50 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {/* Modal Image */}
            <div className="aspect-video bg-apple-gray-100">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-apple-gray-50 flex items-center justify-center">
                  <selectedProject.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-apple-gray-400 leading-relaxed">
                {selectedProject.description}
              </p>
              <div className="mt-6 pt-6 border-t border-apple-gray-100">
                <p className="text-xs text-apple-gray-400">
                  Part of the ZYNIONYX Conceptual Research Portfolio — Designed in Floridablanca, Santander, Colombia.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
