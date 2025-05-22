import React from "react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/layout/Layout";
import CmnBanner from "@/components/layout/Banner/CmnBanner";
import { fetchSettings } from "@/utils/fetchPageData";
import { getData } from "@/utils/dataUtils";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  tags: string[];
}

interface BlogSingleProps {
  post: NewsItem;
  relatedPosts: NewsItem[];
  settings: any;
  blogSettings: any;
}

const BlogSingle = ({
  post,
  relatedPosts,
  settings,
  blogSettings,
}: BlogSingleProps) => {
  if (!post) {
    return (
      <Layout settings={settings}>
        <CmnBanner
          title="Post Not Found"
          breadcrumbs={[
            { text: "Home", link: "/" },
            { text: "Blog", link: "/blog" },
            { text: "Not Found", link: "#" },
          ]}
        />
        <div className="section">
          <div className="container">
            <div className="not-found">
              <h2>Post Not Found</h2>
              <p>
                The blog post you&apos;re looking for doesn&apos;t exist or has
                been removed.
              </p>
              <Link href="/blog" className="btn btn--primary">
                Return to Blog
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout settings={settings}>
      <CmnBanner
        title={post.title}
        breadcrumbs={[
          { text: "Home", link: "/" },
          { text: "Blog", link: "/blog" },
          { text: post.title, link: "#" },
        ]}
      />

      <section className="section blog-single">
        <div className="container">
          <div className="row">
            <div className="col-12 col-xl-8">
              <div className="blog-single__content">
                <div className="blog-single__image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={800}
                    height={450}
                    layout="responsive"
                  />
                </div>

                {(blogSettings?.singlePageSettings?.showAuthor ||
                  blogSettings?.singlePageSettings?.showDate ||
                  blogSettings?.singlePageSettings?.showCategory) && (
                  <div className="blog-single__meta">
                    {(blogSettings?.singlePageSettings?.showAuthor ||
                      blogSettings?.singlePageSettings?.showDate) && (
                      <div className="meta__left">
                        {blogSettings?.singlePageSettings?.showAuthor && (
                          <p>
                            <strong>Written by:</strong> {post.author}
                          </p>
                        )}
                        {blogSettings?.singlePageSettings?.showAuthor &&
                          blogSettings?.singlePageSettings?.showDate && (
                            <span></span>
                          )}
                        {blogSettings?.singlePageSettings?.showDate && (
                          <p>{new Date(post.date).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    {blogSettings?.singlePageSettings?.showCategory && (
                      <div className="meta__right">
                        <Link
                          href={`/blog?category=${post.category.toLowerCase()}`}
                        >
                          {post.category}
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <div className="blog-single__title">
                  <h2>{post.title}</h2>
                </div>

                <div className="blog-single__text">
                  {post.content.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {blogSettings?.singlePageSettings?.showTags &&
                  post.tags &&
                  post.tags.length > 0 && (
                    <div className="blog-single__tags">
                      <h5>Tags:</h5>
                      <ul>
                        {post.tags.map((tag, index) => (
                          <li key={index}>
                            <Link href={`/blog?tag=${tag.toLowerCase()}`}>
                              {tag}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {blogSettings?.singlePageSettings?.showShareButtons && (
                  <div className="blog-single__share">
                    <h5>Share:</h5>
                    <ul>
                      <li>
                        <a
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            typeof window !== "undefined"
                              ? window.location.href
                              : ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            typeof window !== "undefined"
                              ? window.location.href
                              : ""
                          )}&text=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a
                          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                            typeof window !== "undefined"
                              ? window.location.href
                              : ""
                          )}&title=${encodeURIComponent(post.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa-brands fa-linkedin-in"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="blog-single__sidebar">
                {blogSettings?.singlePageSettings?.showRelatedPosts && (
                  <div className="widget">
                    <div className="widget__head">
                      <h5 className="h5">Related Posts</h5>
                    </div>
                    <div className="widget__latest">
                      {relatedPosts.length > 0 ? (
                        relatedPosts
                          .slice(
                            0,
                            blogSettings?.singlePageSettings
                              ?.relatedPostsCount || 3
                          )
                          .map((relatedPost) => (
                            <div key={relatedPost.id} className="latest-single">
                              <div className="latest-thumb">
                                <Link href={`/blog/${relatedPost.slug}`}>
                                  <Image
                                    src={
                                      relatedPost.image ||
                                      blogSettings?.defaultThumbnail ||
                                      "/images/blog/default-thumbnail.jpg"
                                    }
                                    alt={relatedPost.title}
                                    width={100}
                                    height={70}
                                  />
                                </Link>
                              </div>
                              <div className="latest-content">
                                {blogSettings?.singlePageSettings?.showDate && (
                                  <p>
                                    {new Date(
                                      relatedPost.date
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                                <p>
                                  <Link href={`/blog/${relatedPost.slug}`}>
                                    {relatedPost.title}
                                  </Link>
                                </p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p>No related posts found.</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="widget">
                  <div className="widget__head">
                    <h5 className="h5">Return to Blog</h5>
                  </div>
                  <div className="widget__cta">
                    <Link href="/blog" className="btn btn--primary">
                      View All Posts
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .not-found {
          text-align: center;
          padding: 60px 0;
        }

        .not-found h2 {
          margin-bottom: 20px;
        }

        .not-found p {
          margin-bottom: 30px;
        }

        .blog-single__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 30px;
          margin-bottom: 30px;
        }

        .blog-single__image {
          margin-bottom: 20px;
          border-radius: 8px;
          overflow: hidden;
        }

        .blog-single__meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .meta__left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .meta__left span {
          width: 4px;
          height: 4px;
          background-color: #64748b;
          border-radius: 50%;
        }

        .meta__right a {
          color: #4569e7;
          font-weight: 500;
        }

        .blog-single__title {
          margin-bottom: 20px;
        }

        .blog-single__text p {
          margin-bottom: 20px;
          line-height: 1.7;
        }

        .blog-single__tags {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .blog-single__tags ul {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .blog-single__tags li a {
          display: block;
          padding: 5px 12px;
          background-color: #f1f5f9;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .blog-single__tags li a:hover {
          background-color: #4569e7;
          color: white;
        }

        .blog-single__share {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 20px;
        }

        .blog-single__share ul {
          display: flex;
          gap: 10px;
        }

        .blog-single__share li a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: #f1f5f9;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .blog-single__share li a:hover {
          background-color: #4569e7;
          color: white;
        }

        .widget__cta {
          text-align: center;
          padding: 20px;
        }
      `}</style>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };

  // Fetch settings data
  const settings = fetchSettings();

  // Fetch blog settings
  const blogSettings = (getData("blog-settings") || {
    pageTitle: "Blog",
    pageDescription: "Latest news and updates from our team",
    singlePageSettings: {
      showAuthor: true,
      showDate: true,
      showCategory: true,
      showTags: true,
      showShareButtons: true,
      showRelatedPosts: true,
      relatedPostsCount: 3,
    },
  }) as {
    pageTitle: string;
    pageDescription: string;
    singlePageSettings?: {
      showAuthor: boolean;
      showDate: boolean;
      showCategory: boolean;
      showTags: boolean;
      showShareButtons: boolean;
      showRelatedPosts: boolean;
      relatedPostsCount: number;
    };
  };

  // Fetch news data
  const newsData = (getData("news") || { news: [] }) as { news: NewsItem[] };

  // Find the post with the matching slug
  const post = newsData.news.find((item: NewsItem) => item.slug === slug);

  if (!post) {
    return {
      props: {
        post: null,
        relatedPosts: [],
        settings,
        blogSettings,
      },
    };
  }

  // Find related posts (same category, excluding current post)
  const relatedPostsCount =
    blogSettings.singlePageSettings?.relatedPostsCount || 3;

  const relatedPosts = newsData.news
    .filter(
      (item: NewsItem) => item.id !== post.id && item.category === post.category
    )
    .slice(0, relatedPostsCount);

  return {
    props: {
      post,
      relatedPosts,
      settings,
      blogSettings,
    },
  };
};

export default BlogSingle;
