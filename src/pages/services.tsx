import React from "react";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import ServicesMain from "@/components/containers/services/ServicesMain";
import ServicesFeatures from "@/components/containers/services/ServicesFeatures";
import ServicesTestimonials from "@/components/containers/services/ServicesTestimonials";
import SponsorSlider from "@/components/containers/home/SponsorSlider";
import { GetServerSideProps } from "next";
import { fetchSettings } from "@/utils/fetchPageData";

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch services data from API
    const servicesResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/services`
    );
    const servicesData = await servicesResponse.json();

    // Fetch pricing data from the services API to ensure we have the latest
    const pricingResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/services?section=pricing`
    );
    if (pricingResponse.ok) {
      const pricingData = await pricingResponse.json();

      // Update the services data with the latest pricing data
      servicesData.pricing = pricingData;
    }

    // Fetch settings data
    const settingsResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/settings`
    );
    const settings = await settingsResponse.json();

    return {
      props: {
        servicesData,
        settings,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    // Return default empty data to prevent rendering errors
    return {
      props: {
        servicesData: {},
        settings: {},
      },
    };
  }
};

interface ServicesData {
  banner?: {
    title?: string;
    image?: string;
    breadcrumbs?: any;
  };
  main?: any;
  services?: any[];
  features?: any;
  pricing?: any;
  testimonials?: any;
  sponsors?: any;
}

interface ServicesProps {
  servicesData?: ServicesData;
  settings?: any;
}

const Services = ({ servicesData = {}, settings = {} }: ServicesProps) => {
  // Cast servicesData to ServicesData type to avoid TypeScript errors
  const typedServicesData = servicesData as ServicesData;

  return (
    <Layout settings={settings}>
      <CmnBanner
        title={typedServicesData.banner?.title || "Our Services"}
        image={typedServicesData.banner?.image}
        breadcrumbs={typedServicesData.banner?.breadcrumbs}
      />
      <ServicesMain
        data={typedServicesData.main}
        services={typedServicesData.services}
      />
      <ServicesFeatures data={typedServicesData.features} />
      <ServicesTestimonials data={typedServicesData.testimonials} />
      <SponsorSlider data={typedServicesData.sponsors} />
    </Layout>
  );
};

export default Services;
