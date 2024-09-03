"use client";

import { useEffect, useState, useRef } from 'react';
import { FaPaintBrush, FaCode, FaExpand } from 'react-icons/fa'; // Importing specific icons
import { getProjects } from '../sanity/sanity-utils'; // Adjust the path if needed
import './page.css'; // Ensure the path is correct
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Import the image for the new section
import laptopImage from './laptop.png'; // Import the image

export default function Home() {
  const [projects, setProjects] = useState([]);
  const dataRef = useRef(null); // Create a ref to attach to the element
  const orangeWrapperRef = useRef(null);
  const orangePanelRef = useRef(null);
  const lineRef = useRef(null);
  const offerPageRef = useRef(null);
  const headerRefs = useRef([]); // Create a ref to store multiple h2 elements
  const projectCardRefs = useRef([]); // Create a ref for the project cards

  // Refs to store ScrollTriggers
  const laptopScrollTrigger = useRef(null);
  const projectScrollTriggers = useRef([]);

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
          markers: true, // Optional: remove or set to false to hide markers
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
            markers: true, // Set to true to see markers in development
          },
        }
      ).scrollTrigger; // Return the ScrollTrigger instance
    });

    return () => {
      // Clean up each ScrollTrigger
      projectScrollTriggers.current.forEach((trigger) => trigger.kill());
    };
  }, [projects]);
  return (
    <div>
      <div className='introPage'>
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
        <div className='offercontainer'>
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
      <div className='projectsPage'>
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
      <div className='who-are-we-page'>
        <h2>Who are we?</h2>
        <div className='who-info'>
          <div className='img-container'>
            <div></div>
            <div></div>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis</p>
        </div>
      </div>
      <div className='contact-us-page'>
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
