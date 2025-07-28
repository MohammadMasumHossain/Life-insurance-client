import React from 'react';
import Hero from '../Hero/Hero';
import PopularPolicies from '../PopularPolicies/PopularPolicies';
import CustomerReviews from './CustomerReviews/CustomerReviews';

const Home = () => {
    return (
        <div>
           <Hero></Hero>
           <PopularPolicies></PopularPolicies>
           <CustomerReviews></CustomerReviews>
        </div>
    );
};

export default Home;