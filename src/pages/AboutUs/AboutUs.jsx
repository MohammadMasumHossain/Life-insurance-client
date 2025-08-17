import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-base-100 py-16 px-4 lg:px-0">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
          About LifeSecure
        </h2>

        {/* Intro Paragraph */}
        <p className="text-base leading-relaxed text-gray-600 mb-4">
          At <span className="font-semibold">LifeSecure Insurance</span>, we believe 
          that true peace of mind comes from knowing your loved ones are protected. 
          Since our founding, we have been committed to helping families, individuals, 
          and businesses secure their futures with flexible and affordable life 
          insurance plans.
        </p>

        {/* Mission Paragraph */}
        <p className="text-base leading-relaxed text-gray-600 mb-4">
          Our mission is simple: to provide financial security, stability, and confidence 
          to every customer we serve. Whether you are just starting your career, planning 
          for retirement, or safeguarding your family’s future, LifeSecure is here to 
          guide you every step of the way.
        </p>

        {/* Values / Commitment */}
        <div className="mt-8 text-left max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-center">Our Commitment</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Affordable, transparent, and customizable plans</li>
            <li>Expert advisors who care about your family’s well-being</li>
            <li>24/7 support to assist you whenever you need us</li>
            <li>Long-term financial protection and stability</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="mt-10">
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
