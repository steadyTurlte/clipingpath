import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsForm from '@/components/admin/news/NewsForm';

const EditNews = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch news data
      fetch(`/api/content/news/${id}`)
        .then(res => res.json())
        .then(data => {
          setNewsData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching news data:', err);
          setError('Failed to load news data. Please try again.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSave = async (updatedNewsData) => {
    try {
      const response = await fetch(`/api/content/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNewsData),
      });

      if (!response.ok) {
        throw new Error('Failed to update news');
      }

      router.push('/admin/news');
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-news-edit__loading">
          <p>Loading news data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-news-edit__error">
          <p>{error}</p>
          <button 
            onClick={() => router.push('/admin/news')}
            className="admin-news-edit__back-button"
          >
            Back to News
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit News | Photodit Admin</title>
      </Head>
      
      <div className="admin-news-edit">
        <div className="admin-news-edit__header">
          <h1 className="admin-news-edit__title">Edit News</h1>
        </div>
        
        <div className="admin-news-edit__content">
          <NewsForm 
            news={newsData} 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </div>
      </div>
      
      <style jsx>{`
        .admin-news-edit__header {
          margin-bottom: 24px;
        }
        
        .admin-news-edit__title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }
        
        .admin-news-edit__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
        
        .admin-news-edit__loading,
        .admin-news-edit__error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .admin-news-edit__error {
          color: #dc2626;
        }
        
        .admin-news-edit__back-button {
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
        
        .admin-news-edit__back-button:hover {
          background-color: #3a5bc7;
        }
      `}</style>
    </AdminLayout>
  );
};

export default EditNews;
