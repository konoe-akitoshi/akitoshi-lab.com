import React, { useEffect } from 'react';
import Img1 from '../assets/img1.jpg';
import Img2 from '../assets/img2.jpg';
import Img3 from '../assets/img3.jpg';
import Img4 from '../assets/img4.jpg';

const Slideshow = () => {
  useEffect(() => {
    let slideIndex = 0;
    let slides;
    let fading = false;

    function showSlides() {
      if (fading) return; // Prevent running the fade process while already running
      fading = true;
      let currentSlide = slides[slideIndex];
      slideIndex = (slideIndex + 1) % slides.length;
      let nextSlide = slides[slideIndex];

      currentSlide.style.display = "block";
      currentSlide.style.opacity = 1;
      nextSlide.style.display = "block";
      nextSlide.style.opacity = 0;

      let fadeEffect = setInterval(() => {
        if (currentSlide.style.opacity > 0) {
          currentSlide.style.opacity -= 0.1;
          nextSlide.style.opacity = parseFloat(nextSlide.style.opacity) + 0.1;
        } else {
          clearInterval(fadeEffect);
          currentSlide.style.display = "none";
          fading = false;
        }
      }, 100);
    }

    function initSlides() {
      slides = document.getElementsByClassName("mySlides");
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].style.opacity = 0;
      }
      slides[slideIndex].style.display = "block";
      slides[slideIndex].style.opacity = 1;
      setInterval(showSlides, 6000); // Change image every 8 seconds
    }

    initSlides();
  }, []);

  return (
    <div className="slideshow-container fixed w-full h-full top-0 left-0">
      <div className="mySlides fade h-full w-full absolute top-0 left-0">
        <img src={Img1.src} alt="Slide 1" className="w-full h-full object-cover" />
      </div>
      <div className="mySlides fade h-full w-full absolute top-0 left-0">
        <img src={Img2.src} alt="Slide 2" className="w-full h-full object-cover" />
      </div>
      <div className="mySlides fade h-full w-full absolute top-0 left-0">
        <img src={Img3.src} alt="Slide 3" className="w-full h-full object-cover" />
      </div>
      <div className="mySlides fade h-full w-full absolute top-0 left-0">
        <img src={Img4.src} alt="Slide 4" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Slideshow;
