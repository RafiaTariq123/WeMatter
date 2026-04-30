import React from "react";
import GeneralHeroSection from "../components/GeneralHeroSection";
import { heroSectionData, whyWeMatterData } from "../components/Data";
import Carousel from "../components/Carousel";
import WhyWeMatter from "../components/WhyWeMatter";

function MotherhoodTherapy() {
  return (
    <>
      <GeneralHeroSection {...heroSectionData.Motherhood} />
      <Carousel />
      <WhyWeMatter {...whyWeMatterData.Motherhood} />
    </>
  );
}

export default MotherhoodTherapy;
