import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <>
      <Hero/>
      <FeaturedDestination/>
      <ExclusiveOffers/>
      <NewsLetter/>
    </>
  )
}

export default Home