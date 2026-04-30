import React from 'react'
import HeroSection from '../components/HeroSection'
import Carousel from '../components/Carousel'
import WhyWeMatter from '../components/WhyWeMatter'
import DepressionChatbot from '../components/DepressionChatbot'
import { whyWeMatterData } from '../components/Data'

function Home() {
  return (
    <>
    <HeroSection/>
    <Carousel/>
    <WhyWeMatter {...whyWeMatterData.HomePage} />
    <DepressionChatbot />
    </>
  )
}

export default Home