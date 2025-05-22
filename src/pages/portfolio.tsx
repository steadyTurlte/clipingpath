import React from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import PortfolioMain from "@/components/containers/portfolio/PortfolioMain";
import PortfolioPopup from "@/components/containers/portfolio/PortfolioPopup";
import PortfolioSponsorSlider from "@/components/containers/portfolio/PortfolioSponsorSlider";
import { fetchPageData, fetchSettings } from "@/utils/fetchPageData";

interface PortfolioProps {
  portfolioData: {
    banner?: {
      title?: string;
      image?: string;
      breadcrumbs?: { text: string; link: string }[];
    };
    video?: {
      embedId?: string;
      backgroundImage?: string;
    };
    categories?: any;
    items?: any;
    sponsors?: any;
  };
  settings: any;
}

const Portfolio = ({ portfolioData, settings }: PortfolioProps) => {
  return (
    <Layout settings={settings}>
      <CmnBanner
        title={portfolioData?.banner?.title || "Portfolio"}
        image={portfolioData?.banner?.image}
        breadcrumbs={portfolioData?.banner?.breadcrumbs}
      />
      <PortfolioMain data={portfolioData} />
      <PortfolioPopup data={portfolioData?.video} />
      <PortfolioSponsorSlider data={portfolioData?.sponsors} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data for the Portfolio page
  const portfolioData = fetchPageData("portfolio") as { [key: string]: any };

  // Fetch settings data
  const settings = fetchSettings();

  // Fetch sponsors data from about.json
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/content/about?section=sponsors`
    );
    const sponsorsData = await response.json();

    // Update portfolio data with sponsors from about.json
    if (portfolioData && sponsorsData) {
      portfolioData.sponsors = sponsorsData as any;
    }
  } catch (error) {
    console.error("Error fetching sponsors data:", error);
  }

  return {
    props: {
      portfolioData,
      settings,
    },
  };
};

export default Portfolio;
