import React from "react";
import Layout from "@/components/layout/Layout";
import HomeOneBanner from "@/components/layout/Banner/HomeOneBanner";
import Services from "@/components/containers/home/Services";
import AboutSec from "@/components/containers/home/AboutSec";
import ChooseSec from "@/components/containers/home/ChooseSec";
import QualitySec from "@/components/containers/home/QualitySec";
import TestimonialSec from "@/components/containers/home/TestimonialSec";
import PricingPlan from "@/components/containers/home/PricingPlan";
import NewsSec from "@/components/containers/home/NewsSec";
import CTA from "@/components/containers/home/CTA";
import SponsorSlider from "@/components/containers/home/SponsorSlider";

import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const homeResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/home`
    );
    const homeData = await homeResponse.json();

    const newsResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/news`
    );
    const newsData = await newsResponse.json();

    const servicesResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/services`
    );
    const servicesData = await servicesResponse.json();

    if (servicesData && servicesData.services) {
      homeData.services = {
        ...homeData.services,
        services: servicesData.services,
      };
    }

    if (servicesData && servicesData.testimonials) {
      homeData.testimonials = {
        ...homeData.testimonials,
        items: servicesData.testimonials.items,
      };
    }

    const pricingResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/pricing?section=main`
    );
    const pricingData = await pricingResponse.json();

    const settingsResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/settings`
    );
    const settingsData = await settingsResponse.json();

    // Fetch sponsors data from about.json
    const aboutResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/about?section=sponsors`
    );
    const sponsorsData = await aboutResponse.json();

    homeData.pricing = pricingData;
    homeData.sponsors = sponsorsData;

    return {
      props: {
        homeData,
        newsData,
        settings: settingsData,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        homeData: {},
        newsData: { news: [] },
        settings: {},
      },
    };
  }
};

interface HomeData {
  banner?: any;
  services?: any;
  about?: any;
  whySpecial?: any;
  trickyBackgrounds?: any;
  testimonials?: any;
  pricing?: any;
  news?: any;
  cta?: any;
  sponsors?: any;
}

interface NewsData {
  news?: any[];
}

interface HomeProps {
  homeData?: HomeData;
  newsData?: NewsData;
  settings?: any;
}

const Home = ({
  homeData = {},
  newsData = { news: [] },
  settings = {},
}: HomeProps) => {
  const typedHomeData = homeData as HomeData;

  return (
    <Layout settings={settings}>
      <HomeOneBanner data={typedHomeData.banner} />
      <Services data={typedHomeData.services} />
      <AboutSec data={typedHomeData.about} />
      <ChooseSec data={typedHomeData.whySpecial} />
      <QualitySec data={typedHomeData.trickyBackgrounds} />
      <TestimonialSec data={typedHomeData.testimonials} />
      <PricingPlan data={typedHomeData.pricing} />
      <NewsSec
        data={typedHomeData.news}
        newsItems={newsData.news?.slice(0, 3)}
      />
      <CTA data={typedHomeData.cta} />
      <SponsorSlider data={typedHomeData.sponsors} />
    </Layout>
  );
};

export default Home;
