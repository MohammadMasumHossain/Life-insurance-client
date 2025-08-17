import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-base-100 py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Heading */}
        <h2 className="text-3xl  lg:text-4xl font-bold mt-6 text-primary mb-6 text-left">
          About LifeSecure
        </h2>

        {/* Intro Paragraph */}
        <p className="text-base leading-relaxed text-gray-600 mb-4 text-left">
          At <span className="font-semibold">LifeSecure Insurance</span>, we believe 
          that true peace of mind comes from knowing your loved ones are protected. 
          Since our founding, we have been committed to helping families, individuals, 
          and businesses secure their futures with flexible and affordable life 
          insurance plans.
        </p>

        {/* About Life Insurance */}
        <p className="text-base leading-relaxed text-gray-600 mb-8 text-left">
          Life insurance is not just a policy; it's a promise to protect the ones you love. 
          It ensures financial security and peace of mind, helping your family maintain 
          their lifestyle even when you're not there to provide.
        </p>

        {/* Mission & Vision Section */}
        <div className="mt-12 flex flex-col lg:flex-row gap-8 max-w-full">
          
          {/* Mission */}
          <div className="lg:w-1/2 text-left">
            <h3 className="text-xl font-semibold mb-3 text-primary">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To provide financial security, stability, and confidence to every customer 
              we serve. We guide individuals, families, and businesses to secure their 
              futures with transparency, care, and expertise.
            </p>
          </div>

          {/* Vision */}
          <div className="lg:w-1/2 text-left">
            <h3 className="text-xl font-semibold mb-3 text-primary">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the most trusted life insurance provider, empowering people to protect 
              what matters most. We aim to create a world where everyone can face the 
              future with confidence and peace of mind.
            </p>
          </div>

        </div>

        {/* Values / Commitment */}
        <div className="mt-12 max-w-full text-left">
          <h3 className="text-xl font-semibold mb-3 text-primary">Our Commitment</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Affordable, transparent, and customizable plans</li>
            <li>Expert advisors who care about your family’s well-being</li>
            <li>24/7 support to assist you whenever you need us</li>
            <li>Long-term financial protection and stability</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="mt-10 text-left">
          <a
            href="/AllPolicies"
            className="btn btn-primary px-6 rounded-2xl"
          >
            Explore Our Policies
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
