import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import NewsForm from '@/components/admin/news/NewsForm';

const CreateNews = () => {
  const router = useRouter();

  const handleSave = async (newsData) => {
    try {
      const response = await fetch('/api/content/news/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        throw new Error('Failed to create news');
      }

      router.push('/admin/news');
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/admin/news');
  };

  return (
    <AdminLayout>
      <Head>
        <title>Create News | Photodit Admin</title>
      </Head>
      
      <div className="admin-news-create">
        <div className="admin-news-create__header">
          <h1 className="admin-news-create__title">Create News</h1>
        </div>
        
        <div className="admin-news-create__content">
          <NewsForm 
            onSave={handleSave} 
            onCancel={handleCancel} 
          />
        </div>
      </div>
      
      <style jsx>{`
        .admin-news-create__header {
          margin-bottom: 24px;
        }
        
        .admin-news-create__title {
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }
        
        .admin-news-create__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }
      `}</style>
    </AdminLayout>
  );
};

export default CreateNews;
