import React from "react";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import PricingMain from "@/components/containers/pricing/PricingMain";
import PricingProject from "@/components/containers/pricing/PricingProject";
import AboutFaq from "@/components/containers/about/AboutFaq";
import { GetServerSideProps } from "next";
import { fetchSettings } from "@/utils/fetchPageData";

interface PricingPageProps {
  pricingData: {
    banner?: {
      title: string;
      image?: string;
      breadcrumbs: { text: string; link: string }[];
    };
    main: {
      subtitle: string;
      title: string;
      description: string;
      plans: {
        id: number;
        name: string;
        price: string;
        unit: string;
        description: string;
        features: string[];
        recommended: boolean;
      }[];
    };
    project?: {
      subtitle: string;
      title: string;
      description: string;
      items: {
        id: number;
        title: string;
        category: string;
        image: string;
        link: string;
      }[];
    };
    faq?: {
      subtitle: string;
      title: string;
      description: string;
      items: {
        id: number;
        question: string;
        answer: string;
      }[];
    };
  };
  settings: any;
}

const Pricing = ({ pricingData, settings }: PricingPageProps) => {
  return (
    <Layout settings={settings}>
      <CmnBanner
        title={pricingData.banner?.title || "Pricing Plan"}
        image={pricingData.banner?.image}
        breadcrumbs={pricingData.banner?.breadcrumbs}
      />
      <PricingMain data={pricingData.main} />
      <PricingProject data={pricingData.project} />
      <AboutFaq data={pricingData.faq} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch pricing data from API
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/pricing`
    );
    const pricingData = await response.json();

    // Fetch settings data
    const settings = fetchSettings();

    return {
      props: {
        pricingData,
        settings,
      },
    };
  } catch (error) {
    console.error("Error fetching pricing data:", error);
    return {
      props: {
        pricingData: {},
        settings: {},
      },
    };
  }
};

export default Pricing;
