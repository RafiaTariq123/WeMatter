import React from 'react'
import GeneralHeroSection from '../components/GeneralHeroSection'
import { heroSectionData, whyWeMatterData } from '../components/Data'
import Carousel from '../components/Carousel'
import WhyWeMatter from '../components/WhyWeMatter'

export default function MaritalTherapy() {
  return (
    <>
    <GeneralHeroSection {...heroSectionData.Marital}/>
    <Carousel/>
    <WhyWeMatter {...whyWeMatterData.Marital}/>
    </>
  )
}
