import React from 'react'
import GeneralHeroSection from '../components/GeneralHeroSection'
import { heroSectionData, whyWeMatterData } from '../components/Data'
import Carousel from '../components/Carousel'
import WhyWeMatter from '../components/WhyWeMatter'

function TeensTherapy() {
  return (
    <>
    <GeneralHeroSection {...heroSectionData.Teen}/>
    <Carousel/>
    <WhyWeMatter {...whyWeMatterData.Teen}/>
    </>
  )
}

export default TeensTherapy