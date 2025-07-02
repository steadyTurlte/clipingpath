import { GetServerSideProps } from "next";
import { getData } from "@/utils/dataUtils";

interface NewsData {
  news: Array<{
    slug: string;
  }>;
}

// This page is now deprecated in favor of dynamic blog/[slug] pages
// This is just a redirect to the first blog post or to the blog index if none exists
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch news data
  const newsData = (await getData('news') || { news: [] }) as NewsData;

  // If there are blog posts, redirect to the first one
  if (newsData.news && newsData.news.length > 0) {
    return {
      redirect: {
        destination: `/blog/${newsData.news[0].slug}`,
        permanent: false,
      },
    };
  }

  // If no blog posts, redirect to the blog index
  return {
    redirect: {
      destination: '/blog',
      permanent: false,
    },
  };
};

// This component will never be rendered due to the redirect
const BlogSingle = () => null;

export default BlogSingle;
