"use client";

import { useEffect, useState, useRef } from 'react';
import { FaPaintBrush, FaCode, FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa'; // Importing specific icons
import { getProjects, getAboutInfo } from '../sanity/sanity-utils'; // Adjust the path if needed
import './page.css'; // Ensure the path is correct
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [aboutInfo, setAboutInfo] = useState(null); // State for About info
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dataRef = useRef(null); // Create a ref to attach to the element
  const screenpicWrapperRef = useRef(null);
  const screenpicPanelRef = useRef(null);
  const [label, setLabel] = useState("fra butikk");
  const lineRef = useRef(null);
  const offerPageRef = useRef(null);
  const offerContainerRef = useRef(null);
  const headerRefs = useRef([]); // Create a ref to store multiple h2 elements
  const projectCardRefs = useRef([]); // Create a ref for the project projectCardRef
  const whoAreWeRef = useRef(null); // Ref for "Who are we?" section
  const [circlePositions, setCirclePositions] = useState({
    circle1: { x: 400, y: 200, xSpeed: 0.1, ySpeed: 0.17 },  // Reduced speeds
    circle2: { x: 600, y: 400, xSpeed: -0.25, ySpeed: 0.25 }, // Reduced speeds
    circle3: { x: 800, y: 600, xSpeed: 0.15, ySpeed: 0.3 },   // Reduced speeds
    circle4: { x: 1000, y: 500, xSpeed: -0.05, ySpeed: 0.3 }, // Reduced speeds
    circle5: { x: 900, y: 300, xSpeed: -0.1, ySpeed: 0.15 },  // Reduced speeds
  });
  

  const bounds = useRef({
    minX: -150,
    minY: -150,
    maxX: window.innerWidth + 100,
    maxY: window.innerHeight + 100,
  });

  const introPageRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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

    return () => {
      // Clean up each ScrollTrigger
      projectScrollTriggers.current.forEach((trigger) => trigger.kill());
      whoAreWeAnimation.scrollTrigger.kill(); // Clean up the ScrollTrigger for the "Who are we?" section
    };
  }, [projects, aboutInfo]); // Dependency array includes 'aboutInfo' to re-run when data is fetched
  
  useEffect(() => {
    const updateBounds = () => {
      if (introPageRef.current) {
        const introPageHeight = introPageRef.current.offsetHeight;
        const navbarHeight = 220; // Adjust this value based on your navbar height
        
        bounds.current = {
          minX: -150,
          minY: navbarHeight, // Adjust to ensure circles don't go under the navbar
          maxX: window.innerWidth + 100,
          maxY: introPageHeight - 180, // Adjusted for circles
        };
      }
    };
  
    // Initial update
    updateBounds();
  
    // Update bounds on window resize
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

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
  

  useEffect(() => {
    const interval = setInterval(() => {
      updateAllCircles();
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const updateAllCircles = () => {
    setCirclePositions((prevState) => {
      const newPositions = { ...prevState };
      Object.keys(newPositions).forEach((circleKey) => {
        const circle = newPositions[circleKey];
        updateCirclePosition(circle);
      });
      return newPositions;
    });
  };

  const updateCirclePosition = (circle) => {
    const dampingFactor = 0.9; // Reduce the speed gradually by 10%
    const bounceBuffer = 1.5;  // The buffer space to prevent flickering
  
    // Update position
    circle.x += circle.xSpeed;
    circle.y += circle.ySpeed;
  
    // Smoothly reverse X direction if hitting bounds
    if (circle.x < bounds.current.minX + bounceBuffer) {
      circle.x = bounds.current.minX + bounceBuffer;
      circle.xSpeed = -circle.xSpeed * dampingFactor;
    } else if (circle.x > bounds.current.maxX - bounceBuffer) {
      circle.x = bounds.current.maxX - bounceBuffer;
      circle.xSpeed = -circle.xSpeed * dampingFactor;
    }
  
    // Smoothly reverse Y direction if hitting bounds
    if (circle.y < bounds.current.minY + bounceBuffer) {
      circle.y = bounds.current.minY + bounceBuffer;
      circle.ySpeed = -circle.ySpeed * dampingFactor;
    } else if (circle.y > bounds.current.maxY - bounceBuffer) {
      circle.y = bounds.current.maxY - bounceBuffer;
      circle.ySpeed = -circle.ySpeed * dampingFactor;
    }
  };
  

  // Refs to store ScrollTriggers
  const laptopScrollTrigger = useRef(null);
  const projectScrollTriggers = useRef([]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scroll effect
    });
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
      start: "top center", // When the image enters the viewport
      end: "bottom center", // When the image leaves the viewport
      onEnter: () => setLabel("Fra butikk"), // When scrolling into the view
      onLeave: () => setLabel("Til nettbutikk"), // When scrolling out of view
      onEnterBack: () => setLabel("Fra butikk"), // If scrolling back up
      onLeaveBack: () => setLabel("Fra butikk"), // If scrolling up out of view
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

    laptopScrollTrigger.current = tl.scrollTrigger; // Store the ScrollTrigger instance

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
      const introPageHeight = document.querySelector('.introPage').offsetHeight;
      const scrollPosition = window.scrollY;
  
      if (scrollPosition > introPageHeight) {
        document.querySelector('.back-to-top').classList.add('show');
      } else {
        document.querySelector('.back-to-top').classList.remove('show');
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const circleRadii = [170, 140, 110];

  return (
    <div>
      <button className="back-to-top" onClick={scrollToTop}>
        <FaArrowUp className="arrow-icon" />
      </button>
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
        <div className="metaballs">
          <svg className="metasvg">
            <defs>
              <filter id="gooify" width="400%" x="-10%" height="400%" y="-150%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0
                          0 1 0 0 0
                          0 0 1 0 0
                          0 0 0 25 -10"
                />
              </filter>
              <linearGradient id="yourGradientId" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#000" />
                <stop offset="100%" stopColor="#000" />
                <stop offset="0%" stopColor="#00000" />
                <stop offset="100%" stopColor="#00000" />
              </linearGradient>
            </defs>
            <g filter="url(#gooify)">
              {Object.entries(circlePositions).map(([key, circle], index) => (
                <circle
                  key={key}
                  className="blobb glow"
                  fill="url(#yourGradientId)"
                  cx={circle.x}
                  cy={circle.y}
                  r={circleRadii[index]}
                />
              ))}
            </g>
          </svg>
        </div>
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
        ref={(el) => projectCardRefs.current[index] = el}
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
      </div>
    )}
  </div>
</div>


<div id="contactUsPage" className='contactUsPage' action="#" method="post">
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
          <li><span>Orgnr:</span> 4206969</li>
        </ul>
      </footer>
    </div>
  );
}


