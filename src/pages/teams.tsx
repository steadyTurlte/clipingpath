import React from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import SponsorSlider from "@/components/containers/home/SponsorSlider";
import TeamMainSec from "@/components/containers/TeamMainSec";
import { fetchPageData, fetchSettings } from "@/utils/fetchPageData";

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch data for the Teams page
    const teamsData = fetchPageData('teams');

    // Fetch settings data
    const settings = fetchSettings();

    return {
      props: {
        teamsData,
        settings
      }
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    // Return default empty data to prevent rendering errors
    return {
      props: {
        teamsData: {},
        settings: {}
      }
    };
  }
}

interface TeamsProps {
  teamsData: {
    banner?: {
      title?: string;
      image?: string;
      breadcrumbs?: any[];
    };
    team?: any;
    sponsors?: any;
  };
  settings: any;
}

const Teams = ({ teamsData = {}, settings = {} }: TeamsProps) => {
  return (
    <Layout settings={settings}>
      <CmnBanner
        title={teamsData.banner?.title || "Our Teams"}
        image={teamsData.banner?.image}
        breadcrumbs={teamsData.banner?.breadcrumbs}
      />
      <TeamMainSec teamData={teamsData.team} />
      <SponsorSlider data={teamsData.sponsors} />
    </Layout>
  );
};

export default Teams;
