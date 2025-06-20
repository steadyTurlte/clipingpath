import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import YoutubeEmbed from "../layout/youtube/YoutubeEmbed";

const DynamicBlogMain = ({ newsData, loading, error }) => {
  const [videoActive, setVideoActive] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = newsData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(newsData.length / itemsPerPage);

  // Handle video click
  const handleVideoClick = (videoId) => {
    setCurrentVideoId(videoId);
    setVideoActive(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="loading-spinner"></div>
              <p>Loading blog posts...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="error-message">
                <p>Error loading blog posts: {error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (newsData.length === 0) {
    return (
      <section className="section blog-main">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>No blog posts found. Check back later for updates!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section blog-main">
      <div className="container">
        <div className="row gaper">
          <div className="col-12 col-xl-8">
            <div className="blog-main__content">
              {currentItems.map((item, index) => (
                <div className="blog-main__single" key={item.id || index}>
                  <div className="thumb">
                    <div
                      className="thumb-link"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                    >
                      <Link href={`/blog/${item.slug || item.id}`}>
                        <Image
                          src={item.image || "/images/news/one.png"}
                          alt={item.title || "Blog Image"}
                          width={800}
                          height={500}
                        />
                      </Link>
                      {item.videoId && (
                        <div className="video-wrap">
                          <a
                            title="Video Player"
                            className="video-btn"
                            onClick={() => handleVideoClick(item.videoId)}
                          >
                            <i className="icon-play"></i>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="meta">
                      <div className="meta__left">
                        <p>
                          <strong>Written by:</strong> {item.author || "Admin"}
                        </p>
                        <span></span>
                        <p>{item.date ? formatDate(item.date) : "No date"}</p>
                      </div>
                      <div className="meta__right">
                        {item.categories && item.categories.map((category, idx) => (
                          <Link href={`/blog?category=${category}`} key={idx}>
                            {category}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className="content"
                    data-aos="fade-up"
                    data-aos-duration="600"
                    data-aos-delay="100"
                  >
                    <h4 className="h4">
                      <Link href={`/blog/${item.slug || item.id}`}>
                        {item.title || "Untitled Blog Post"}
                      </Link>
                    </h4>
                    <p>
                      {item.excerpt || item.content?.substring(0, 150) || "No content available"}
                    </p>
                    <div className="cta">
                      <Link href={`/blog/${item.slug || item.id}`}>
                        <i className="fa-solid fa-arrow-right-long"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <ul className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page}>
                        <a
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "active" : ""}
                        >
                          {page < 10 ? `0${page}` : page}
                        </a>
                      </li>
                    ))}
                    {currentPage < totalPages && (
                      <li>
                        <button onClick={() => setCurrentPage(currentPage + 1)}>
                          <i className="fa-solid fa-arrow-right-long"></i>
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-12 col-xl-4">
            <div className="blog-main__sidebar">
              {/* Search Widget */}
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
                  <form action="#" method="post">
                    <div className="form-group-input">
                      <input
                        type="search"
                        name="blog-search"
                        id="blogSearch"
                        placeholder="Search here. . ."
                      />
                      <button type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Categories Widget */}
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
                    {/* Extract unique categories from news data */}
                    {Array.from(new Set(newsData.flatMap(item => item.categories || []))).map((category, index) => (
                      <li key={index}>
                        <Link href={`/blog?category=${category}`}>{category}</Link>
                      </li>
                    ))}
                    {/* Add default categories if none found */}
                    {newsData.flatMap(item => item.categories || []).length === 0 && (
                      <>
                        <li><Link href="/blog">News</Link></li>
                        <li><Link href="/blog">Updates</Link></li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Recent Posts Widget */}
              <div className="widget">
                <div className="widget__head">
                  <h5 className="h5">Recent Posts</h5>
                </div>
                <div className="widget__latest">
                  {newsData.slice(0, 4).map((item, index) => (
                    <div
                      className="latest-single"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay="100"
                      key={item.id || index}
                    >
                      <div className="latest-thumb">
                        <Link href={`/blog/${item.slug || item.id}`}>
                          <Image
                            src={item.image || "/images/news/one.png"}
                            alt={item.title || "Blog Image"}
                            width={100}
                            height={100}
                          />
                        </Link>
                      </div>
                      <div className="latest-content">
                        <p>{item.date ? formatDate(item.date) : "No date"}</p>
                        <p>
                          <Link href={`/blog/${item.slug || item.id}`}>
                            {item.title || "Untitled Blog Post"}
                          </Link>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <div
        className={(videoActive ? " video-zoom-in" : " ") + " video-backdrop"}
        onClick={() => setVideoActive(false)}
      >
        <div className="video-inner">
          <div
            className="video-container"
            onClick={(e) => e.stopPropagation()}
          >
            {videoActive && <YoutubeEmbed embedId={currentVideoId || "fSv6UgCkuTU"} />}
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
    </section>
  );
};

export default DynamicBlogMain;
