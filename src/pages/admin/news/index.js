import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch news data
    fetch('/api/content/news')
      .then(res => res.json())
      .then(data => {
        setNewsData(data.news || []);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.news.map(item => item.category))].filter(Boolean);
        setCategories(uniqueCategories);

        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching news data:', err);
        setError('Failed to load news data. Please refresh the page.');
        setLoading(false);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleDeleteNews = async (id) => {
    if (!confirm('Are you sure you want to delete this news article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/content/news/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted news from the state
        setNewsData(newsData.filter(item => item.id !== id));
      } else {
        throw new Error('Failed to delete news');
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news. Please try again.');
    }
  };

  // Filter news based on search term and selected category
  const filteredNews = newsData.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-news__loading">
          <p>Loading news data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-news__error">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="admin-news__reload-button"
          >
            Reload Page
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Manage News | Photodit Admin</title>
      </Head>

      <div className="admin-news">
        <div className="admin-news__header">
          <h1 className="admin-news__title">Manage News</h1>
          <div className="admin-news__header-actions">
            <Link href="/admin/news/create" className="admin-news__add-button">
              <i className="fa-solid fa-plus"></i> Add News
            </Link>
          </div>
        </div>

        <div className="admin-news__filters">
          <div className="admin-news__search">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={handleSearch}
              className="admin-news__search-input"
            />
          </div>

          <div className="admin-news__categories">
            <button
              className={`admin-news__category-button ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryFilter('')}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                className={`admin-news__category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <div className="admin-news__empty">
            <p>No news articles found.</p>
            {searchTerm || selectedCategory ? (
              <p>Try adjusting your search or filter criteria.</p>
            ) : (
              <Link href="/admin/news/create" className="admin-news__add-button">
                Add Your First News Article
              </Link>
            )}
          </div>
        ) : (
          <div className="admin-news__list">
            {filteredNews.map(item => (
              <div key={item.id} className="admin-news__item">
                <div className="admin-news__item-image">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={80}
                  />
                </div>
                <div className="admin-news__item-content">
                  <h3 className="admin-news__item-title">{item.title}</h3>
                  <p className="admin-news__item-excerpt">{item.excerpt}</p>
                  <div className="admin-news__item-meta">
                    <span className="admin-news__item-category">{item.category}</span>
                    <span className="admin-news__item-author">By {item.author}</span>
                    <span className="admin-news__item-date">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="admin-news__item-actions">
                  <Link
                    href={`/admin/news/edit/${item.id}`}
                    className="admin-news__item-edit"
                  >
                    <i className="fa-solid fa-edit"></i>
                    <span>Edit</span>
                  </Link>
                  <button
                    className="admin-news__item-delete"
                    onClick={() => handleDeleteNews(item.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-news__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-news__title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .admin-news__header-actions {
          display: flex;
          gap: 12px;
        }

        .admin-news__settings-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          text-decoration: none;
        }

        .admin-news__settings-button:hover {
          background-color: #e2e8f0;
        }

        .admin-news__add-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          text-decoration: none;
        }

        .admin-news__add-button:hover {
          background-color: #3a5bc7;
        }

        .admin-news__filters {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .admin-news__search {
          width: 100%;
        }

        .admin-news__search-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-news__categories {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .admin-news__category-button {
          padding: 6px 12px;
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .admin-news__category-button:hover {
          background-color: #e2e8f0;
        }

        .admin-news__category-button.active {
          background-color: #4569e7;
          color: white;
          border-color: #4569e7;
        }

        .admin-news__empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .admin-news__list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-news__item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-news__item-image {
          flex-shrink: 0;
          width: 120px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f8fafc;
        }

        .admin-news__item-content {
          flex: 1;
          min-width: 0;
        }

        .admin-news__item-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px;
        }

        .admin-news__item-excerpt {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .admin-news__item-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 12px;
          color: #64748b;
        }

        .admin-news__item-category {
          color: #4569e7;
          font-weight: 500;
        }

        .admin-news__item-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          justify-content: center;
        }

        .admin-news__item-edit,
        .admin-news__item-delete {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
          text-decoration: none;
        }

        .admin-news__item-edit {
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
        }

        .admin-news__item-edit:hover {
          background-color: #e2e8f0;
        }

        .admin-news__item-delete {
          background-color: #fee2e2;
          color: #b91c1c;
          border: none;
        }

        .admin-news__item-delete:hover {
          background-color: #fecaca;
        }

        .admin-news__loading,
        .admin-news__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .admin-news__error {
          color: #dc2626;
        }

        .admin-news__reload-button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .admin-news__reload-button:hover {
          background-color: #3a5bc7;
        }

        @media (max-width: 768px) {
          .admin-news__item {
            flex-direction: column;
          }

          .admin-news__item-image {
            width: 100%;
            height: 160px;
          }

          .admin-news__item-actions {
            flex-direction: row;
            margin-top: 16px;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminNews;
