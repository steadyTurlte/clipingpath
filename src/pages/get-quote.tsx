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

interface QuotePageData {
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
}

export const getServerSideProps: GetServerSideProps = async () => {
  const defaultQuoteData: QuotePageData = {
    banner: {
      title: 'Get A Quote',
      breadcrumbs: [],
      image: ''
    },
    hero: {
      subtitle: 'Custom Photography Services',
      title: 'Get A Quote',
      description: 'Tell us about your project and we\'ll get back to you with a customized quote.'
    },
    statistics: [
      { id: 1, value: '100', symbol: '+', label: 'Happy Clients' },
      { id: 2, value: '5', symbol: 'k', label: 'Photos Taken' },
      { id: 3, value: '10', symbol: '+', label: 'Years Experience' },
    ],
    gallery: {
      title: 'Our Work',
      description: 'Check out some of our recent projects',
      images: []
    },
    form: {
      // Default form structure
    },
    instructions: {
      title: 'How It Works',
      steps: [
        {
          id: 'step-1',
          title: 'Submit Request',
          description: 'Fill out the quote request form with your project details.',
          icon: 'flaticon-edit'
        },
        {
          id: 'step-2',
          title: 'Get a Quote',
          description: 'We\'ll review your request and send you a customized quote.',
          icon: 'flaticon-document'
        },
        {
          id: 'step-3',
          title: 'Start Project',
          description: 'Once approved, we\'ll begin working on your project.',
          icon: 'flaticon-photo-camera'
        }
      ]
    }
  };

  try {
    // Fetch data for the Get A Quote page
    const quoteData = (await fetchPageData('get-quote')) as Partial<QuotePageData>;
    
    // Merge with default data to ensure all required fields are present
    const mergedQuoteData: QuotePageData = {
      ...defaultQuoteData,
      ...quoteData,
      banner: {
        ...defaultQuoteData.banner,
        ...(quoteData?.banner || {})
      },
      hero: {
        ...defaultQuoteData.hero,
        ...(quoteData?.hero || {})
      },
      gallery: {
        ...defaultQuoteData.gallery,
        ...(quoteData?.gallery || {})
      },
      instructions: {
        ...defaultQuoteData.instructions,
        ...(quoteData?.instructions || {})
      }
    };

    // Fetch settings data
    const settings = await fetchSettings() || {};

    return {
      props: {
        quoteData: JSON.parse(JSON.stringify(mergedQuoteData)),
        settings: JSON.parse(JSON.stringify(settings))
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        quoteData: defaultQuoteData,
        settings: {}
      }
    };
  }
};

export default GetQuote;
