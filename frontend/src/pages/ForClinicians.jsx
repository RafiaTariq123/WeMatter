import React from 'react'
import GeneralHeroSection from '../components/GeneralHeroSection'
import BenefitsWeMatter from '../components/BenefitsWeMatter'

import Carousel from '../components/Carousel'
import MediaSection from '../components/MediaSection'
import { heroSectionData } from '../components/Data'


function ForClinicians() {
  return (
    <>
    <GeneralHeroSection {...heroSectionData.Clinician} />
    <Carousel/>
    <BenefitsWeMatter/>
    <MediaSection/>
    </>
  )
}

export default ForClinicians