import React from "react";
import Layout from "@/components/layout/Layout";
import AboutBanner from "@/components/containers/about/AboutBanner";
import AboutOverview from "@/components/containers/about/AboutOverview";
import AboutMain from "@/components/containers/about/AboutMain";
import AboutSponsor from "@/components/containers/about/AboutSponsor";
import AboutTeam from "@/components/containers/about/AboutTeam";
import AboutFaq from "@/components/containers/about/AboutFaq";
import TestimonialSec from "@/components/containers/home/TestimonialSec";
import AboutCta from "@/components/containers/about/AboutCta";
import { GetServerSideProps } from "next";

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch about page data
    const aboutResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/about`
    );
    const aboutData = await aboutResponse.json();

    // Fetch testimonials data
    const services = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/services`
    );
    const servicesData = await services.json();
    const testimonials = servicesData.testimonials;

    // Fetch settings data
    const settingsResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/settings`
    );
    const settings = await settingsResponse.json();

    // Fetch portfolio data
    const portfolioResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/portfolio`
    );
    const portfolio = await portfolioResponse.json();

    return {
      props: {
        aboutData,
        testimonials,
        settings,
        portfolio,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    // Return default empty data to prevent rendering errors
    return {
      props: {
        aboutData: {},
        testimonials: {},
        settings: {},
        portfolio: {},
      },
    };
  }
};

interface AboutUsProps {
  aboutData?: any;
  testimonials?: any;
  settings?: any;
  portfolio?: any;
}

const AboutUs = ({
  aboutData,
  testimonials,
  settings,
  portfolio,
}: AboutUsProps) => {
  // Use the data from the API to render the components
  return (
    <Layout settings={settings}>
      <AboutBanner data={aboutData?.banner} />
      <AboutOverview data={aboutData?.overview} />
      <AboutMain data={aboutData?.main} />
      <AboutSponsor data={aboutData?.sponsors} />
      <AboutTeam data={aboutData?.team} />
      <AboutFaq data={aboutData?.faq} />
      <TestimonialSec data={testimonials} />
      <AboutCta data={aboutData?.cta} />
    </Layout>
  );
};

export default AboutUs;
