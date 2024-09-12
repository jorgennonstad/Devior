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
        <h1 className='fadeInUp'>DEVIRO</h1>
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
  <h2>Our Projects</h2>
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
      <h2>Who are we?</h2>
  <div className="content-container">
    <div className="text-container">
      {aboutInfo ? (
        <div className="bio-container">
          <p>{aboutInfo.bio}</p>
        </div>
      ) : (
        <p>Loading about info...</p>
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


<form id="contactUsPage" action="#" method="post">
      <h2 className="message-title">Contact us</h2>
  <section className="container">
    <div className="phonie"></div> {/* Ensure the phone image is within the message section */}
    <div className="message-section">
      <input type="text" className="input-field" placeholder="Name" required/>
      <input type="text" className="input-field" placeholder="Email" required/>
      <input type="text" className="input-field" placeholder="Phone" required/>
      <textarea className="message-textarea" placeholder="Message" required></textarea>
      <button className="submit-button">Send</button>
    </div>
  </section>
</form>

      <footer>
        <h2><FaPaintBrush /> Deviro</h2>
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


