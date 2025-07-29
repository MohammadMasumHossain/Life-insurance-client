import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { NavLink } from 'react-router';

const slides = [
  {
    id: 1,
    title: "Secure Your Tomorrow Today",
    subtitle: "Protect your loved ones with confidence.",
    image: "https://i.ibb.co/qhKfb6Q/image1.png",
  },
  {
    id: 2,
    title: "Insurance Made Easy",
    subtitle: "Simple, smart, and tailored to you.",
    image: "https://i.ibb.co/cKDskw4m/banner2.png",
  },
  {
    id: 3,
    title: "Peace of Mind, Guaranteed",
    subtitle: "Plans that grow with your family.",
    image: "https://i.ibb.co/qhKfb6Q/image1.png",
  },
];

const Hero = () => {
  return (
    <div className="relative w-full">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={700}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[70vh] md:h-[80vh]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay content */}
            <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-center mb-6 max-w-xl">
                {slide.subtitle}
              </p>
             <NavLink to='/quote'><button className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded">
                Get a Free Quote
              </button></NavLink> 
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
