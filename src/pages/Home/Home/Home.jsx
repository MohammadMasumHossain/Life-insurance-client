import React from 'react';
import Hero from '../Hero/Hero';
import PopularPolicies from '../PopularPolicies/PopularPolicies';
import CustomerReviews from './CustomerReviews/CustomerReviews';
import LatestBlog from '../LatestBlog/LatestBlog';
import NewsletterSubscription from '../NewsletterSubscription/NewsletterSubscription';
import MeetOurAgent from '../MeetOurAgent/MeetOurAgent';

const Home = () => {
    return (
        <div>
           <Hero></Hero>
           <PopularPolicies></PopularPolicies>
           <CustomerReviews></CustomerReviews>
           <LatestBlog></LatestBlog>
            <NewsletterSubscription></NewsletterSubscription>
            <MeetOurAgent></MeetOurAgent>
        </div>
    );
};

export default Home;