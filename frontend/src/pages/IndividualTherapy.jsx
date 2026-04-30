import React from 'react'
import GeneralHeroSection from '../components/GeneralHeroSection'
import Carousel from '../components/Carousel'
import WhyWeMatter from '../components/WhyWeMatter'
import { heroSectionData, whyWeMatterData } from '../components/Data'

function IndividualTherapy() {
  return (
    <>
    <GeneralHeroSection {...heroSectionData.Individual}/>
    <Carousel/>
    <WhyWeMatter {...whyWeMatterData.Individual}/>
    </>
  )
}

export default IndividualTherapy