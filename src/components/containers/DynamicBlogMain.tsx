import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import YoutubeEmbed from "../layout/youtube/YoutubeEmbed";
import { useRouter } from "next/router";

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface NewsData {
  news: NewsItem[];
  categories: Category[];
  tags: Tag[];
}

interface BlogSettings {
  pageTitle: string;
  pageDescription: string;
  postsPerPage: number;
  showAuthor: boolean;
  showDate: boolean;
  showCategory: boolean;
  showComments: boolean;
  showRelatedPosts: boolean;
  relatedPostsCount: number;
  categories: string[];
  singlePageSettings: {
    showAuthor: boolean;
    showDate: boolean;
    showCategory: boolean;
    showTags: boolean;
    showShareButtons: boolean;
    showComments: boolean;
    showRelatedPosts: boolean;
    relatedPostsCount: number;
    showAuthorBio: boolean;
  };
}

const DynamicBlogMain = () => {
  const [videoActive, setVideoActive] = useState(false);
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
  const { category, tag, page, search } = router.query;

  useEffect(() => {
    // Set initial filter values from URL query parameters
    if (category) setSelectedCategory(category as string);
    if (tag) setSelectedTag(tag as string);
    if (page) setCurrentPage(parseInt(page as string));
    if (search) setSearchTerm(search as string);

    fetchData();
  }, [category, tag, page, search]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch news data and blog settings in parallel
      const [newsResponse, settingsResponse] = await Promise.all([
        fetch('/api/content/news'),
        fetch('/api/content/news/settings')
      ]);

      if (!newsResponse.ok) {
        throw new Error('Failed to fetch news data');
      }

      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch blog settings');
      }

      const newsData = await newsResponse.json();
      const settingsData = await settingsResponse.json();

      setNewsData(newsData);
      setBlogSettings(settingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load blog data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUrlParams();
  };

  const handleCategoryClick = (categorySlug: string) => {
    setSelectedCategory(categorySlug === selectedCategory ? "" : categorySlug);
    setCurrentPage(1);
    updateUrlParams();
  };

  const handleTagClick = (tagSlug: string) => {
    setSelectedTag(tagSlug === selectedTag ? "" : tagSlug);
    setCurrentPage(1);
    updateUrlParams();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams();
  };

  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedTag) params.set('tag', selectedTag);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchTerm) params.set('search', searchTerm);

    router.push({
      pathname: '/blog',
      search: params.toString()
    }, undefined, { shallow: true });
  };

  if (loading) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="loading-indicator">
            <p>Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchData} className="btn btn--primary">
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!newsData || !newsData.news || newsData.news.length === 0) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="no-posts-message">
            <p>No blog posts found.</p>
          </div>
        </div>
      </section>
    );
  }

  // Filter news based on search, category, and tag
  const filteredNews = newsData.news.filter(item => {
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesTag = !selectedTag ||
      (item.tags && item.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));

    return matchesSearch && matchesCategory && matchesTag;
  });

  const itemsPerPage = blogSettings?.postsPerPage || 6;

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="section blog-main">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-xl-8">
            <div className="blog-main__content">
              {paginatedNews.length === 0 ? (
                <div className="no-results">
                  <p>No posts found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSelectedTag("");
                      setCurrentPage(1);
                      router.push('/blog');
                    }}
                    className="btn btn--primary"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                paginatedNews.map((post) => (
                  <div key={post.id} className="blog-main__single">
                    <div className="thumb">
                      <div
                        className="thumb-link"
                        data-aos="fade-up"
                        data-aos-duration="600"
                        data-aos-delay="100"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={800}
                            height={450}
                            layout="responsive"
                          />
                        </Link>
                      </div>
                      <div className="meta">
                        {(blogSettings?.showAuthor || blogSettings?.showDate) && (
                          <div className="meta__left">
                            {blogSettings?.showAuthor && (
                              <p>
                                <strong>Written by:</strong> {post.author}
                              </p>
                            )}
                            {blogSettings?.showAuthor && blogSettings?.showDate && <span></span>}
                            {blogSettings?.showDate && (
                              <p>{new Date(post.date).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}
                        {blogSettings?.showCategory && (
                          <div className="meta__right">
                            <Link href={`/blog?category=${post.category.toLowerCase()}`}>
                              {post.category}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    <div
                      className="content"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <h4 className="h4">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h4>
                      <p>{post.excerpt}</p>
                      <div className="cta">
                        <Link href={`/blog/${post.slug}`}>
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <ul className="pagination">
                    {currentPage > 1 && (
                      <li>
                        <button onClick={() => handlePageChange(currentPage - 1)}>
                          <i className="fa-solid fa-arrow-left-long"></i>
                        </button>
                      </li>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <li key={page}>
                        <button
                          className={currentPage === page ? "active" : ""}
                          onClick={() => handlePageChange(page)}
                        >
                          {page.toString().padStart(2, '0')}
                        </button>
                      </li>
                    ))}

                    {currentPage < totalPages && (
                      <li>
                        <button onClick={() => handlePageChange(currentPage + 1)}>
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="blog-main__sidebar">
              <div
                className="widget"
                data-aos="fade-up"
                data-aos-duration="600"
                data-aos-delay="100"
              >
                <div className="widget__head">
                  <h5 className="h5">Search</h5>
                </div>
                <div className="widget-search">
                  <form onSubmit={handleSearch}>
                    <div className="form-group-input">
                      <input
                        type="search"
                        name="blog-search"
                        id="blogSearch"
                        placeholder="Search here. . ."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Categories Widget */}
              {newsData.categories && newsData.categories.length > 0 && (
                <div
                  className="widget"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <div className="widget__head">
                    <h5 className="h5">Categories</h5>
                  </div>
                  <div className="widget__list">
                    <ul>
                      {newsData.categories.map(category => (
                        <li key={category.id}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCategoryClick(category.slug);
                            }}
                            className={selectedCategory === category.slug ? "active" : ""}
                          >
                            {category.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Recent Posts Widget */}
              <div className="widget">
                <div className="widget__head">
                  <h5 className="h5">Recent Posts</h5>
                </div>
                <div className="widget__latest">
                  {newsData.news.slice(0, 4).map(post => (
                    <div
                      key={post.id}
                      className="latest-single"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <div className="latest-thumb">
                        <Link href={`/blog/${post.slug}`}>
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={100}
                            height={70}
                          />
                        </Link>
                      </div>
                      <div className="latest-content">
                        <p>{new Date(post.date).toLocaleDateString()}</p>
                        <p>
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Widget */}
              {newsData.tags && newsData.tags.length > 0 && (
                <div
                  className="widget"
                  data-aos="fade-up"
                  data-aos-duration="600"
                  data-aos-delay="100"
                >
                  <div className="widget__head">
                    <h5 className="h5">Tags</h5>
                  </div>
                  <div className="widget__tags">
                    <ul>
                      {newsData.tags.map(tag => (
                        <li key={tag.id}>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTagClick(tag.slug);
                            }}
                            className={selectedTag === tag.slug ? "active" : ""}
                          >
                            {tag.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      <div
        className={(videoActive ? " video-zoom-in" : " ") + " video-backdrop"}
        onClick={() => setVideoActive(false)}
      >
        <div className="video-inner">
          <div
            className="video-container"
            onClick={(e: any) => e.stopPropagation()}
          >
            {videoActive && <YoutubeEmbed embedId="fSv6UgCkuTU" />}
            <button
              aria-label="close video popup"
              className="close-video-popup"
              onClick={() => setVideoActive(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-indicator,
        .error-message,
        .no-posts-message,
        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          background-color: #f8fafc;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .error-message {
          color: #dc2626;
        }

        .widget__list ul li a.active,
        .widget__tags ul li a.active {
          color: #4569e7;
          font-weight: bold;
        }

        .pagination button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: inherit;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default DynamicBlogMain;
