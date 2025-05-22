import React from "react";
import { GetServerSideProps } from "next";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import DynamicBlogMain from "@/components/containers/DynamicBlogMain";
import { fetchSettings } from "@/utils/fetchPageData";
import { getData } from "@/utils/dataUtils";

interface BlogProps {
  settings: any;
  blogSettings: any;
}

const Blog = ({ settings, blogSettings }: BlogProps) => {
  return (
    <Layout settings={settings}>
      <CmnBanner
        title={blogSettings?.pageTitle || "Blog"}
        breadcrumbs={[
          { text: "Home", link: "/" },
          { text: blogSettings?.pageTitle || "Blog", link: "/blog" },
        ]}
      />
      <DynamicBlogMain />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch settings data
  const settings = fetchSettings();

  // Fetch blog settings
  const blogSettings = getData("blog-settings") || {
    pageTitle: "Blog",
    pageDescription: "Latest news and updates from our team",
  };

  return {
    props: {
      settings,
      blogSettings,
    },
  };
};

export default Blog;
