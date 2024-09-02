"use client";

import { useEffect, useState, useRef } from 'react';
import { FaPaintBrush, FaCode, FaExpand } from 'react-icons/fa'; // Importing specific icons
import { getProjects } from '../sanity/sanity-utils'; // Adjust the path if needed
import './page.css'; // Ensure the path is correct
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const dataRef = useRef(null); // Create a ref to attach to the element

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

    // Zoom effect for introPage on scroll
    gsap.fromTo(".introPage", 
      {
        scale: 1.5 // Start zoomed out
      }, 
      {
        scale: 1, // End at normal size
        scrollTrigger: {
          trigger: ".introPage",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Optional: Fade-in effect for introPage
    gsap.fromTo(".introPage", 
      {
        opacity: 0,
        y: -100
      }, 
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: ".introPage",
          start: "top center",
          end: "bottom top",
          scrub: true
        }
      }
    );

    // Optional: Font size effect for h1 on scroll
    gsap.fromTo("h1",
      {
        fontSize: "3rem"
      },
      {
        fontSize: "1.5rem",
        scrollTrigger: {
          trigger: "h1",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      }
    );

    const cursor = document.getElementById("cursor");
    const tip = document.getElementById("tip");

    function handleMouseMove(e) {
      if (cursor) {
        cursor.style.top = `${e.pageY}px`;
        cursor.style.left = `${e.pageX}px`;
      }

      if (tip) {
        tip.style.display = "none";
      }
    }

    // Add event listener on mount
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this runs only on mount

  return (
    <div>
      <div className='introPage'>
        <h1 className='fadeInUp'>DEVIOR</h1>
        <h2 className='fadeInUp delay1'>Digitilize your business</h2>
      </div>
      <div className='offerPage'>
        <h2>What we offer</h2>
        <div className='offercontainer'>
          <div className='offer'>
            <h3><FaPaintBrush /> Design</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis </p>
          </div>
          <div className='offer'>
            <h3><FaExpand /> Flexibility</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis</p>
          </div>
          <div className='offer'>
            <h3><FaCode /> Code</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet risus. Praesent sed venenatis</p>
          </div>
        </div>
      </div>
      <div className='projectsPage'>
        <h2>Our projects</h2>
        <div className='projects-container'>
          {projects.map((project) => (
            <a key={project._id} href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
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
