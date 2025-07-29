import React from 'react';
import Hero from '../Hero/Hero';
import PopularPolicies from '../PopularPolicies/PopularPolicies';
import CustomerReviews from './CustomerReviews/CustomerReviews';
import LatestBlog from '../LatestBlog/LatestBlog';
import NewsletterSubscription from '../NewsletterSubscription/NewsletterSubscription';
import MeetOurAgent from '../MeetOurAgent/MeetOurAgent';
import { Helmet } from 'react-helmet-async';


const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home | My Insurance Platform</title>
            </Helmet>
           
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