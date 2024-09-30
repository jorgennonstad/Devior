"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { FaPaintBrush, FaCode, FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa'; // Importing specific icons
import { getProjects, getAboutInfo } from '../sanity/sanity-utils'; // Adjust the path if needed
import './page.css'; // Ensure the path is correct
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null); // State for About info
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dataRef = useRef(null); // Create a ref to attach to the element
  const screenpicWrapperRef = useRef<HTMLDivElement | null>(null);
  const screenpicPanelRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const [label, setLabel] = useState("Fra Offline");
  const offerPageRef = useRef(null);
  const offerContainerRef = useRef(null);
  const headerRefs = useRef([]); // Create a ref to store multiple h2 elements
  const projectCardRefs = useRef<(HTMLAnchorElement | null)[]>([]); // Create a ref for the project projectCardRef
  const whoAreWeRef = useRef<HTMLDivElement>(null); // Ref for "Who are we?" section

  const setRef = useCallback((index: number) => (el: HTMLAnchorElement | null) => {
    projectCardRefs.current[index] = el;
  }, []);
  
  interface AboutInfo {
    bio: string;
    imageOneUrl: string;
    imageOneAlt: string;
    imageOneName: string;
    imageTwoUrl: string;
    imageTwoAlt: string;
    imageTwoName: string;
    imageThreeUrl: string;
    imageThreeAlt: string;
    imageThreeName: string;
  }
  

  interface Project {
    _id: string;
    url: string;
    thumbnail: string;
    hoverImage: string;
    name: string;
    bio: string;
  }

  const introPageRef = useRef<HTMLDivElement | null>(null); // Define as HTMLDivElement or the appropriate element type

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  
    // Prevent body scroll when the menu is open
    if (!isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  useEffect(() => {
    if (whoAreWeRef.current) {
      // GSAP animation for "Who are we?" section
      const whoAreWeAnimation = gsap.fromTo(
        whoAreWeRef.current.querySelectorAll('.person, .bio-container'),
        { y: 50, opacity: 0 }, // Initial state
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3, // Stagger effect for multiple elements
          ease: "power3.out",
          scrollTrigger: {
            trigger: whoAreWeRef.current,
            start: "top 80%", // Adjust start position as needed
            end: "bottom 70%",
            markers: false, // Set to true to see markers in development
          },
        }
      );

      // Add ScrollTrigger instance to the ref array
      if (whoAreWeAnimation.scrollTrigger) {
        projectScrollTriggers.current.push(whoAreWeAnimation.scrollTrigger);
      }
      
    }

    return () => {
      // Clean up each ScrollTrigger
      projectScrollTriggers.current.forEach((trigger) => trigger.kill());
      // Clear the array after cleanup
      projectScrollTriggers.current = [];
    };
  }, [projects, aboutInfo]); // Dependencies to re-run the effect when they change


  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for offerContainer to pop up
    gsap.fromTo(
      offerContainerRef.current,
      { y: 50, opacity: 0 }, // Start state: below and transparent
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: offerContainerRef.current,
          start: 'top 100%',  // Animation starts when the container is 80% from the top of the viewport
          end: 'bottom 90%', // Animation completes before it's fully scrolled past
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  // Refs to store ScrollTriggers
  const laptopScrollTrigger = useRef<ScrollTrigger | null>(null);
  const projectScrollTriggers = useRef<ScrollTrigger[]>([]);

  const scrollToTop = () => {

  };

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    async function fetchAboutInfo() {
      try {
        const aboutData = await getAboutInfo();
        setAboutInfo(aboutData);
      } catch (error) {
        console.error('Error fetching about info:', error);
      }
    }

    fetchProjects();
    fetchAboutInfo(); // Fetch about info
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: screenpicWrapperRef.current,
      start: "top 90%", // Start when the top of the image is 90% from the top of the viewport (switch sooner)
      end: "bottom 60%", // End when the bottom of the image is 60% from the bottom of the viewport (switch sooner)
      onEnter: () => setLabel("Fra Offline"), // When scrolling into the view
      onLeave: () => setLabel("Til Online"), // When scrolling out of view
      onEnterBack: () => setLabel("Fra Offline"), // If scrolling back up
      onLeaveBack: () => setLabel("Fra Offline"), // If scrolling up out of view
    });
    
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    // GSAP animations for the laptop section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: screenpicWrapperRef.current,
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=50%",
      },
    });

    tl.fromTo(
      screenpicPanelRef.current,
      { scale: 0.7 },
      { scale: 0.5, ease: "none" }
    ).to(
      screenpicPanelRef.current,
      { scale: 0.5, ease: "none" }
    );

    tl.from(
      lineRef.current,
      {
        scaleX: 0,
        ease: "none",
        transformOrigin: "left top",
      },
      0
    );

    // Explicitly handle `undefined` case
    const scrollTrigger = tl.scrollTrigger as ScrollTrigger | undefined;
    if (scrollTrigger) {
      laptopScrollTrigger.current = scrollTrigger;
    } else {
      laptopScrollTrigger.current = null;
    }

    return () => {
      // Clean up specific ScrollTrigger
      if (laptopScrollTrigger.current) {
        laptopScrollTrigger.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animations for header h2 elements
    const headerAnimation = gsap.fromTo(
      headerRefs.current,
      { x: "200%", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        duration: 1,
        stagger: 0.20,
        scrollTrigger: {
          trigger: offerPageRef.current,
          start: "top 100%",  // Adjust this value to make the animation start further up
          end: "bottom 95%", // Keep this or adjust as needed
          scrub: 1,
          markers: false, // Optional: remove or set to false to hide markers
        }
      }
    );

    return () => {
      // Clean up specific ScrollTrigger
      if (headerAnimation.scrollTrigger) {
        headerAnimation.scrollTrigger.kill();
      }
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  
    // Slide-up animation for the entire project container
    const projectContainerAnimation = gsap.fromTo(
      projectCardRefs.current, // Apply animation to all project cards at once
      { y: 50, opacity: 0 },   // Start state: slightly below and transparent
      {
        y: 0,
        opacity: 1,
        duration: 1,   // Animation duration
        ease: "power3.out",
        stagger: 0.2,  // Optional: stagger the effect a bit for each project card
        scrollTrigger: {
          trigger: ".projects-container", // Trigger for the entire container
          start: "top 80%",  // Start animation when container hits 80% of the viewport
          end: "bottom 70%", // End when container is 70% from the bottom
          toggleActions: "play none none none", // Play when scrolling in, don't reverse
          markers: false,   // Set to true to see debugging markers
        }
      }
    );
  
    return () => {
      // Clean up the ScrollTrigger instance when the component unmounts
      if (projectContainerAnimation.scrollTrigger) {
        projectContainerAnimation.scrollTrigger.kill();
      }
    };
  }, [projects]); // Re-run this effect when the projects data changes
  

  useEffect(() => {
    const handleScroll = () => {
      // Use type assertion to ensure the elements are treated as HTMLElement
      const introPageElement = document.querySelector('.introPage') as HTMLElement | null;
      const backToTopElement = document.querySelector('.back-to-top') as HTMLElement | null;

      // Check if elements exist before accessing properties or methods
      if (introPageElement && backToTopElement) {
        const introPageHeight = introPageElement.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition > introPageHeight) {
          backToTopElement.classList.add('show');
        } else {
          backToTopElement.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Initial call to handle scroll state on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const totalGifs = 10; // Total number of gif classes
    const randomIndex = Math.floor(Math.random() * totalGifs) + 1; // Random number between 1 and 14
    const randomClass = `gif${randomIndex}`;

    if (introPageRef.current) {
      // Remove any previous gifX class
      for (let i = 1; i <= totalGifs; i++) {
        introPageRef.current.classList.remove(`gif${i}`);
      }

      // Add the new random gif class
      introPageRef.current.classList.add(randomClass);
    }
  }, []); // Runs only once on component mount

  
  return (
    <div id="top">
      <a href="#top">
      <button className="back-to-top" onClick={scrollToTop}>
        <FaArrowUp className="arrow-icon" />
      </button>
      </a>
      <header>
        {/* Hamburger menu icon */}
        <div className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Full-screen overlay menu */}
        <div className={`overlay-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="menu-nav">
            <ul>
              <li><a href="#offerPage" onClick={toggleMenu}>Hva vi tilbyr</a></li>
              <li><a href="#projectsPage" onClick={toggleMenu}>Prosjekter</a></li>
              <li><a href="#whoAreWePage" onClick={toggleMenu}>Om oss</a></li>
              <li><a href="#contactUsPage" onClick={toggleMenu}>Kontakt</a></li>
            </ul>
          </nav>
        </div>
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item"><a href="#offerPage">Hva vi tilbyr</a></li>
            <li className="navbar-item"><a href="#projectsPage">Prosjekter</a></li>
            <li className="navbar-item"><a href="#whoAreWePage">Om oss</a></li>
            <li className="navbar-item"><a href="#contactUsPage">Kontakt</a></li>
          </ul>
        </nav>
      </header>
      <div className='introPage' ref={introPageRef}>
        <h1 className='fadeInUp'> DEVIRO</h1>
        <h2 className='fadeInUp delay1'>Digitaliser ditt selskap</h2>
      </div>
      <div id="offerPage" className='offerPage'>
      <h2>Hva vi tilbyr</h2>
      <div className='offercontainer' ref={offerContainerRef}>
        <div className='offer'>
          <h3><FaPaintBrush className="icon-color" /> Design</h3>
          <p>Vi skaper nettsider med fokus på optimal brukeropplevelse, kreativitet og livlighet, skreddersydd etter dine behov. Vi tar imot inspirasjon og ønsker fra deg for å sikre at designet reflekterer din virksomhets unike identitet. I tillegg tilbyr vi prototyper slik at du kan se og teste designet før det blir implementert, slik at vi sammen kan sørge for at sluttresultatet er akkurat slik du ønsker</p>
        </div>
        <div className='offer'>
          <h3><FaExpand className="icon-color" /> Fleksibilitet</h3>
          <p>Ved å bruke Sanity, en moderne plattform for innholdsadministrasjon, gir vi deg muligheten til å enkelt oppdatere og tilpasse innholdet på nettsiden din uten å måtte håndtere koding. Enten du ønsker å legge til nye elementer på menyen, oppdatere priser eller endre overskrifter, kan du gjøre dette på en intuitiv måte gjennom et brukervennlig grensesnitt</p>
        </div>
        <div className='offer'>
          <h3><FaCode className="icon-color" /> Kode</h3>
          <p>Vi koder nettsider som fungerer feilfritt på laptop, nettbrett og mobil, og sikrer en optimal brukeropplevelse på alle enheter. I tillegg kan vi utvikle prosjekter med WordPress eller Shopify hvis det er ønskelig, slik at du får den løsningen som passer best for dine behov</p>
        </div>
      </div>
    </div>
      <div className='screen-wrapper'>
      <div className='screentitle'><h2>{label}</h2> {/* The dynamic label text */}</div>
        {/* New Section with screenpic Panel and Laptop */}
        <div className="panel screenpicWrapper" ref={screenpicWrapperRef}>
        <div className="screen"></div>
          <section className="panel screenpic" ref={screenpicPanelRef}>
            <h2>
              <span className="line line-2" ref={lineRef}></span>
            </h2>
          </section>
        </div>
      </div>
      <div id='projectsPage' className='projectsPage'>
  <h2>Våre prosjekter</h2>
  <div className='projects-container'>
    {projects.map((project, index) => (
      <a
      key={project._id}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-link"
      ref={setRef(index)}
    >
        <div className="project-card">
          <div className="image-container">
            <img
              src={project.thumbnail}
              alt={project.name}
              className="project-image"
            />
            <img
              src={project.hoverImage}
              alt={project.name}
              className="project-hover-image"
            />
          </div>
          <div className="project-info">
            <h2 className="project-title">{project.name}</h2>
            <p className="project-bio">{project.bio}</p>
          </div>
        </div>
      </a>
    ))}
  </div>
</div>


<div id="whoAreWePage" className="who-are-we-page" ref={whoAreWeRef}>
      <h2>Hvem er vi?</h2>
      {aboutInfo && (
  <div className="images-container">
    <div className="person">
      <div className="image-wrapper">
        <img src={aboutInfo.imageOneUrl} alt={aboutInfo.imageOneAlt} />
        <div className="glow-wrap"><i className="glow"></i></div>
      </div>
      <h1>{aboutInfo.imageOneName}</h1>
    </div>
    <div className="person">
      <div className="image-wrapper">
        <img src={aboutInfo.imageTwoUrl} alt={aboutInfo.imageTwoAlt} />
        <div className="glow-wrap"><i className="glow"></i></div>
      </div>
      <h1>{aboutInfo.imageTwoName}</h1>
    </div>
    <div className="person">
      <div className="image-wrapper">
        <img src={aboutInfo.imageThreeUrl} alt={aboutInfo.imageThreeAlt} />
        <div className="glow-wrap"><i className="glow"></i></div>
      </div>
      <h1>{aboutInfo.imageThreeName}</h1>
    </div>
  </div>
)}


  <div className="content-container">
    <div className="text-container">
      {aboutInfo ? (
        <div className="bio-container">
          <p>{aboutInfo.bio}</p>
        </div>
      ) : (
        <p>Laster inn...</p>
      )}
    </div>
    
  </div>
</div>


<div id="contactUsPage" className='contactUsPage'>
  <div className='contactHeader'>
      <h2 className="message-title">Kontakt oss</h2>
      <p>Kontakt oss for mer informasjon eller hjelp med dine behov.</p>
  </div>
  <div className='contactBody'>
  <div className='contactBox'>
    <FaEnvelope className="contactBoxIcon" /> {/* Icon for Email */}
    <p>Email</p>
    <a href='mailto:deviro.contact@gmail.com' target='_blank'>deviro.contact@gmail.com</a> {/* mailto for email */}
    <a href='mailto:deviro.contact@gmail.com' target='_blank'>
      <button className="contactButton">Kontakt</button>
    </a>
  </div>
  
  <div className='contactBox'>
    <FaPhone className="contactBoxIcon" /> {/* Icon for Phone */}
    <p>Phone</p>
    <a href='tel:+4793434688'>+47 934 34 688</a> {/* tel for phone */}
    <a href='tel:+4793434688'>
      <button className="contactButton">Ring</button>
    </a>
  </div>
  
  <div className='contactBox'>
    <FaMapMarkerAlt className="contactBoxIcon" /> {/* Icon for Address */}
    <p>Office</p>
    <a href="https://www.google.com/maps/place/Storgata+2,+1821,+2815+Gj%C3%B8vik/@60.7961651,10.6904173,17z/data=!3m1!4b1!4m5!3m4!1s0x4641da3d35be1823:0x7108834441c40703!8m2!3d60.7961625!4d10.6929922?entry=ttu&g_ep=EgoyMDI0MDkxMC4wIKXMDSoASAFQAw%3D%3D" target='_blank'>Storgata 2, 1821 Gjøvik</a>
    <a href="https://www.google.com/maps/place/Storgata+2,+1821,+2815+Gj%C3%B8vik/@60.7961651,10.6904173,17z/data=!3m1!4b1!4m5!3m4!1s0x4641da3d35be1823:0x7108834441c40703!8m2!3d60.7961625!4d10.6929922?entry=ttu&g_ep=EgoyMDI0MDkxMC4wIKXMDSoASAFQAw%3D%3D" target='_blank'>
    <button className="contactButton">Lokasjon</button>
    </a>
  </div>
</div>
</div>

      <footer>
        <h2><img className='footerLogo' src="/faviconWhite.png" alt="Logo" /> Deviro</h2>
        <ul>
          <li><span>Adr: </span><a href="https://www.google.com/maps/place/Storgata+2,+1821,+2815+Gj%C3%B8vik/@60.7961651,10.6904173,17z/data=!3m1!4b1!4m5!3m4!1s0x4641da3d35be1823:0x7108834441c40703!8m2!3d60.7961625!4d10.6929922?entry=ttu&g_ep=EgoyMDI0MDkxMC4wIKXMDSoASAFQAw%3D%3D" target='_blank'>Storgata 2, 2815 Gjøvik</a></li>
          <li><span>Tlf: </span><a href='tel:+4793434688'>+47 934 34 688</a> {/* tel for phone */}</li>
          <li><span>Orgnr:</span> 934159306</li>
        </ul>
      </footer>
    </div>
  );
}