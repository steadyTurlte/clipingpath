import React from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import QuoteOverview from "@/components/containers/quote/QuoteOverview";
import CustomQuote from "@/components/containers/quote/CustomQuote";
import QuoteInstructions from "@/components/containers/quote/QuoteInstructions";
import { fetchPageData, fetchSettings } from "@/utils/fetchPageData";

interface GetQuoteProps {
  quoteData: {
    banner: {
      title: string;
      image?: string;
      breadcrumbs: Array<{ text: string; link: string }>;
    };
    hero: {
      subtitle: string;
      title: string;
      description: string;
    };
    statistics: Array<{
      id: number;
      value: string;
      symbol: string;
      label: string;
    }>;
    gallery: {
      title: string;
      description: string;
      images: Array<{
        id: number;
        src: string;
        alt: string;
        category: string;
      }>;
    };
    form: any;
    instructions: {
      title: string;
      steps: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
      }>;
    };
  };
  settings: any;
}

const GetQuote = ({ quoteData, settings }: GetQuoteProps) => {
  return (
    <Layout settings={settings}>
      <CmnBanner
        title={quoteData.banner.title}
        image={quoteData.banner.image}
        breadcrumbs={quoteData.banner.breadcrumbs}
      />
      <QuoteOverview
        hero={quoteData.hero}
        statistics={quoteData.statistics}
      />
      <CustomQuote
        gallery={quoteData.gallery}
        form={quoteData.form}
      />
      <QuoteInstructions
        instructions={quoteData.instructions}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch data for the Get A Quote page
  const quoteData = fetchPageData('get-quote');

  // Fetch settings data
  const settings = fetchSettings();

  return {
    props: {
      quoteData,
      settings
    }
  };
};

export default GetQuote;
