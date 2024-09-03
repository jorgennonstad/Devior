"use client";

import { useEffect, useState, useRef } from 'react';
import { FaPaintBrush, FaCode, FaExpand } from 'react-icons/fa'; // Importing specific icons
import { getProjects, getAboutInfo } from '../sanity/sanity-utils'; // Adjust the path if needed
import './page.css'; // Ensure the path is correct
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [aboutInfo, setAboutInfo] = useState(null); // State for About info
  const dataRef = useRef(null); // Create a ref to attach to the element
  const orangeWrapperRef = useRef(null);
  const orangePanelRef = useRef(null);
  const lineRef = useRef(null);
  const offerPageRef = useRef(null);
  const headerRefs = useRef([]); // Create a ref to store multiple h2 elements
  const projectCardRefs = useRef([]); // Create a ref for the project cards
  const [circlePositions, setCirclePositions] = useState({
    circle1: { x: 400, y: 200, xSpeed: 0.2, ySpeed: 0.34 },
    circle2: { x: 600, y: 400, xSpeed: -0.5, ySpeed: 0.5 },
    circle3: { x: 800, y: 600, xSpeed: 0.3, ySpeed: 0.6 },
    circle4: { x: 1000, y: 500, xSpeed: -0.1, ySpeed: 0.6 },
    circle5: { x: 900, y: 300, xSpeed: -0.2, ySpeed: 0.3 },
  });

  const bounds = useRef({
    minX: -150,
    minY: -150,
    maxX: window.innerWidth + 100,
    maxY: window.innerHeight + 100,
  });

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
    circle.x += circle.xSpeed;
    circle.y += circle.ySpeed;

    if (circle.x < bounds.current.minX) {
      circle.x = bounds.current.minX + Math.random() * 10;
      circle.xSpeed = Math.abs(circle.xSpeed);
    } else if (circle.x > bounds.current.maxX) {
      circle.x = bounds.current.maxX - Math.random() * 10;
      circle.xSpeed = -Math.abs(circle.xSpeed);
    }

    if (circle.y < bounds.current.minY) {
      circle.y = bounds.current.minY + Math.random() * 10;
      circle.ySpeed = Math.abs(circle.ySpeed);
    } else if (circle.y > bounds.current.maxY) {
      circle.y = bounds.current.maxY - Math.random() * 10;
      circle.ySpeed = -Math.abs(circle.ySpeed);
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
  }, []);

  useEffect(() => {
    // GSAP animations for the laptop section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: orangeWrapperRef.current,
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=50%",
      },
    });

    tl.fromTo(
      orangePanelRef.current,
      { scale: 0.9 },
      { scale: 0.5, ease: "none" }
    ).to(
      orangePanelRef.current,
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
        x: "-10%",
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

    // Slide-up animation for project cards
    projectScrollTriggers.current = projectCardRefs.current.map((card, index) => {
      return gsap.fromTo(
        card,
        { y: 50, opacity: 0 }, // Start position slightly below with opacity 0
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2, // Stagger effect between cards
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%", // Start animation when the card is in the top 80% of the viewport
            end: "bottom 70%",
            toggleActions: "play none none reverse", // Play animation when scrolled in, reverse when scrolled out
            markers: false, // Set to true to see markers in development
          },
        }
      ).scrollTrigger; // Return the ScrollTrigger instance
    });

    return () => {
      // Clean up each ScrollTrigger
      projectScrollTriggers.current.forEach((trigger) => trigger.kill());
    };
  }, [projects]);


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

  
  
  const circleRadii = [170, 90, 120, 140, 70];

  return (
    <div>
      <button className="back-to-top" onClick={scrollToTop}>
  &uarr; Top
</button>
      <header>
<nav className="navbar">
  <ul className="navbar-list">
    <li className="navbar-item"><a href="#offerPage">What We Offer</a></li>
    <li className="navbar-item"><a href="#projectsPage">Our Projects</a></li>
    <li className="navbar-item"><a href="#whoAreWePage">Who Are We</a></li>
    <li className="navbar-item"><a href="#contactUsPage">Contact</a></li>
  </ul>
</nav>

      </header>
      <div className='introPage'>
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
                <stop offset="0%" stopColor="#ff1900" />
                <stop offset="100%" stopColor="#eec80c" />
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
        <h1 className='fadeInUp'>DEVIOR</h1>
        <h2 className='fadeInUp delay1'>Digitilize your business</h2>
      </div>
      <div className='offerPage' ref={offerPageRef}>
        <div className='header-container'>
          <h2 ref={(el) => headerRefs.current[0] = el}>What we offer</h2>
          <h2 ref={(el) => headerRefs.current[1] = el}>What we offer</h2>
          <h2 ref={(el) => headerRefs.current[2] = el}>What we offer</h2>
          <h2 ref={(el) => headerRefs.current[3] = el}>What we offer</h2>
          <h2 ref={(el) => headerRefs.current[4] = el}>What we offer</h2>
        </div>
        <div id="offerPage" className='offercontainer'>
          <div className='offer'>
            <h3><FaPaintBrush className="icon-color"/> Design</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis </p>
          </div>
          <div className='offer'>
            <h3><FaExpand className="icon-color"/> Flexibility</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis</p>
          </div>
          <div className='offer'>
            <h3><FaCode className="icon-color"/> Code</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis</p>
          </div>
        </div>
      </div>
      <div className='screen-wrapper'>
       {/* New Section with Orange Panel and Laptop */}
       <div className="panel orangeWrapper" ref={orangeWrapperRef}>
        <div className='screen'></div>
        <section className="panel orange" ref={orangePanelRef}>
          <h2>
            <span className="line line-2" ref={lineRef}></span>
          </h2>
        </section>
      </div>
      </div>
      <div id='projectsPage' className='projectsPage'>
        <h2>Our projects</h2>
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
                <img src={project.thumbnail} alt={project.name} className="project-image" />
                <div className="project-info">
                  <h2 className="project-title">{project.name}</h2>
                  <p className="project-bio">{project.bio}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div id='whoAreWePage' className='who-are-we-page'>
  <h2>Who are we?</h2>
  {aboutInfo ? (
    <div className='who-info'>
      <div className='img-container'>
        <div className="person">
          <img src={aboutInfo.imageOneUrl} alt={aboutInfo.imageOneAlt} />
          <p>{aboutInfo.imageOneName}, {aboutInfo.imageOneAge}</p>
        </div>
        <div className="person">
          <img src={aboutInfo.imageTwoUrl} alt={aboutInfo.imageTwoAlt} />
          <p>{aboutInfo.imageTwoName}, {aboutInfo.imageTwoAge}</p>
        </div>
      </div>
      <p>{aboutInfo.bio}</p>
    </div>
  ) : (
    <p>Loading about info...</p>
  )}
</div>

      <div id='contactUsPage' className='contact-us-page'>
        <h2>Contact us</h2>
        <div className='contact-area'>
          <form action="#">
            <label htmlFor="Name">Name or Company Name</label>
            <input type="text" name="name" id="name" />

            <label htmlFor="mail">Email:</label>
            <input type="mail" name="mail" id="mail" />

            <label htmlFor="phone">Phone:</label>
            <input type="phone" name="phone" id="phone" />

            <label htmlFor="description">Description:</label>
            <textarea name="description" id="description" cols="30" rows="10"></textarea>

          </form>
        </div>
      </div>
      <footer>
        <h2><FaPaintBrush /> Devior</h2>
        <div className='socials'>
          <div>F</div>
          <div>X</div>
          <div>IN</div>
        </div>
        <ul>
          <li><span>Adr:</span> Storgata 2, 1821 Gjøvik </li>
          <li><span>Tlf:</span> +47 123 45 567</li>
          <li><span>Orgnr:</span> 4206969</li>
        </ul>
      </footer>
    </div>
  );
}
