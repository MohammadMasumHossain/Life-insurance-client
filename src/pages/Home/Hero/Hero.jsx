import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

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
    image: "https://i.ibb.co/qhKfb6Q/image1.png",
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
        autoPlay={true}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={5000}
        transitionTime={700}
      >
        {slides.map(slide => (
          <div key={slide.id} className="relative h-[80vh]">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-center items-center text-white px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-6">{slide.subtitle}</p>
              <button className="btn btn-primary px-6">Get a Free Quote</button>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
