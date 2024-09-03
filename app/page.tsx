"use client";

import { useEffect, useState, useRef } from "react";
import { FaPaintBrush, FaCode, FaExpand } from "react-icons/fa"; // Importing specific icons
import { getProjects } from "../sanity/sanity-utils"; // Adjust the path if needed
import "./page.css"; // Ensure the path is correct
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Import the image for the new section
import laptopImage from "./laptop.png"; // Import the image

export default function Home() {
  const [projects, setProjects] = useState([]);
  const dataRef = useRef(null); // Create a ref to attach to the element
  const orangeWrapperRef = useRef(null);
  const orangePanelRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    // GSAP animations for the new section
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
    ).to(orangePanelRef.current, { scale: 0.5, ease: "none" });

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
      if (ScrollTrigger) ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div>
      <div className="introPage">
        <video autoPlay muted loop className="videoBackground">
          <source src="../public/img/particle.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="fadeInUp">DEVIOR</h1>
        <h2 className="fadeInUp delay1">Digitilize your business</h2>
      </div>
      <div className="offerPage">
        <h2>What we offer</h2>
        <div className="offercontainer">
          <div className="offer">
            <h3>
              <FaPaintBrush /> Design
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id
              ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare
              nulla, quis laoreet risus. Praesent sed venenatis{" "}
            </p>
          </div>
          <div className="offer">
            <h3>
              <FaExpand /> Flexibility
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id
              ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare
              nulla, quis laoreet risus. Praesent sed venenatis
            </p>
          </div>
          <div className="offer">
            <h3>
              <FaCode /> Code
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id
              ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Nam id ornare
              nulla, quis laoreet risus. Praesent sed venenatis
            </p>
          </div>
        </div>
      </div>
      <div className="screen-wrapper">
        {/* New Section with Orange Panel and Laptop */}
        <h2>
          From <span>Bussiness</span> to <span>Web</span>
        </h2>
        <div className="panel orangeWrapper" ref={orangeWrapperRef}>
          <div className="screen"></div>
          <section className="panel orange" ref={orangePanelRef}>
            <h2>
              <span className="line line-2" ref={lineRef}></span>
            </h2>
          </section>
        </div>
      </div>
      <div className="projectsPage">
        <h2>Our projects</h2>
        <div className="projects-container">
          {projects.map((project) => (
            <a
              key={project._id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              <div className="project-card">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="project-image"
                />
                <div className="project-info">
                  <h2 className="project-title">{project.name}</h2>
                  <p className="project-bio">{project.bio}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="who-are-we-page">
        <h2>Who are we?</h2>
        <div className="who-info">
          <div className="img-container">
            <div></div>
            <div></div>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id
            ornare nulla, quis laoreet risus. Praesent sed venenatis Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Nam id ornare nulla,
            quis laoreet risus. Praesent sed venenatis Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Nam id ornare nulla, quis laoreet
            risus. Praesent sed venenatis Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nam id ornare nulla, quis laoreet
            risus. Praesent sed venenatis Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nam id ornare nulla, quis laoreet
            risus. Praesent sed venenatis Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nam id ornare nulla, quis laoreet
            risus. Praesent sed venenatis Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Nam id ornare nulla, quis laoreet
            risus. Praesent sed venenatis
          </p>
        </div>
      </div>
      <div className="contact-us-page">
        <h2>Contact us</h2>
        <div className="contact-area">
          <form action="#">
            <label htmlFor="Name">Name or Company Name</label>
            <input type="text" name="name" id="name" />

            <label htmlFor="mail">Email:</label>
            <input type="mail" name="mail" id="mail" />

            <label htmlFor="phone">Phone:</label>
            <input type="phone" name="phone" id="phone" />

            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
            ></textarea>
          </form>
        </div>
      </div>
      <footer>
        <h2>
          <FaPaintBrush /> Devior
        </h2>
        <div className="socials">
          <div>F</div>
          <div>X</div>
          <div>IN</div>
        </div>
        <ul>
          <li>
            <span>Adr:</span> Storgata 2, 1821 Gjøvik{" "}
          </li>
          <li>
            <span>Tlf:</span> +47 123 45 567
          </li>
          <li>
            <span>Orgnr:</span> 4206969
          </li>
        </ul>
      </footer>
    </div>
  );
}
