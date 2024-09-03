"use client"

import { useEffect, useState, useRef } from 'react';
import { FaPaintBrush, FaCode, FaExpand } from 'react-icons/fa';
import { getProjects } from '../sanity/sanity-utils';
import './page.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const dataRef = useRef(null);
  const orangeWrapperRef = useRef(null);
  const orangePanelRef = useRef(null);
  const lineRef = useRef(null);
  const offerPageRef = useRef(null);
  const headerRefs = useRef([]);
  const projectCardRefs = useRef([]);
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

  const introPageRef = useRef(null);

  useEffect(() => {
    const updateBounds = () => {
      if (introPageRef.current) {
        const introPageHeight = introPageRef.current.offsetHeight;
        bounds.current = {
          minX: -150,
          minY: -150,
          maxX: window.innerWidth + 100,
          maxY: introPageHeight - 190, // Adjust based on circle size
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
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

    fetchProjects();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
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

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

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
          start: "top 100%",
          end: "bottom 95%",
          scrub: 1,
          markers: false,
        }
      }
    );

    return () => {
      if (headerAnimation.scrollTrigger) {
        headerAnimation.scrollTrigger.kill();
      }
    };
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    projectCardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 70%",
            toggleActions: "play none none reverse",
            markers: false,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
            <h3><FaPaintBrush className="icon-color" /> Design</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis.</p>
          </div>
          <div className='offer'>
            <h3><FaExpand className="icon-color" /> Flexibility</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis.</p>
          </div>
          <div className='offer'>
            <h3><FaCode className="icon-color" /> Code</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis.</p>
          </div>
        </div>
      </div>
      <div className='screen-wrapper'>
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
        <div className='who-info'>
          <div className='img-container'>
            <div></div>
            <div></div>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis.</p>
        </div>
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
          <li><span>Adr:</span> Storgata 2, 1821 Gjøvik</li>
          <li><span>Tlf:</span> +47 123 45 567</li>
          <li><span>Orgnr:</span> 4206969</li>
        </ul>
      </footer>
    </div>
  );
}
