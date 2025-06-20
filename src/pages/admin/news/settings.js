import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const BlogSettings = () => {
  const [settings, setSettings] = useState({
    pageTitle: '',
    pageDescription: '',
    postsPerPage: 6,
    showAuthor: true,
    showDate: true,
    showCategory: true,
    showComments: true,
    showRelatedPosts: true,
    relatedPostsCount: 3,
    defaultThumbnail: '',
    categories: [],
    singlePageSettings: {
      showAuthor: true,
      showDate: true,
      showCategory: true,
      showTags: true,
      showShareButtons: true,
      showComments: true,
      showRelatedPosts: true,
      relatedPostsCount: 3,
      showAuthorBio: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog settings and news data in parallel
        const [settingsResponse, newsResponse] = await Promise.all([
          fetch('/api/content/news/settings'),
          fetch('/api/content/news')
        ]);

        if (settingsResponse.ok && newsResponse.ok) {
          const settingsData = await settingsResponse.json();
          const newsData = await newsResponse.json();

          // Merge categories from news data with blog settings
          if (newsData.categories && newsData.categories.length > 0) {
            settingsData.categories = newsData.categories.map(cat => cat.name);
          }

          setSettings(settingsData);
        } else {
          toast.error('Failed to load blog settings');
        }
      } catch (error) {
        console.error('Error fetching blog settings:', error);
        toast.error('Error loading blog settings');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSinglePageChange = (field, value) => {
    setSettings({
      ...settings,
      singlePageSettings: {
        ...settings.singlePageSettings,
        [field]: value
      }
    });
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') return;

    if (!settings.categories.includes(newCategory.trim())) {
      // Update local state
      setSettings({
        ...settings,
        categories: [...settings.categories, newCategory.trim()]
      });

      // Update news.json categories
      try {
        const response = await fetch('/api/content/news/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: newCategory.trim(),
            slug: newCategory.trim().toLowerCase().replace(/\s+/g, '-')
          })
        });

        if (response.ok) {
          toast.success('Category added successfully!');
          setNewCategory('');
        } else {
          toast.error('Failed to add category to news data');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        toast.error('Error adding category');
      }
    } else {
      toast.error('Category already exists');
    }
  };

  const handleRemoveCategory = async (category) => {
    // Update local state
    setSettings({
      ...settings,
      categories: settings.categories.filter(c => c !== category)
    });

    // Update news.json categories
    try {
      const response = await fetch('/api/content/news/categories', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: category
        })
      });

      if (response.ok) {
        toast.success('Category removed successfully!');
      } else {
        toast.error('Failed to remove category from news data');
      }
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Error removing category');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/news/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Blog settings saved successfully!');
      } else {
        toast.error('Failed to save Blog settings');
      }
    } catch (error) {
      console.error('Error saving blog settings:', error);
      toast.error('Failed to save Blog settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="blog-settings__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Blog Settings | Photodit Admin</title>
      </Head>

      <div className="blog-settings">
        <div className="blog-settings__header">
          <h1 className="blog-settings__title">Blog Settings</h1>
          <div className="blog-settings__actions">
            <Link href="/admin/news" className="blog-settings__back-button">
              Back to Blog
            </Link>
            <button
              className="blog-settings__save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="blog-settings__content">
          <div className="blog-settings__section">
            <h2 className="blog-settings__section-title">General Settings</h2>

            <div className="blog-settings__field">
              <label htmlFor="pageTitle">Blog Page Title</label>
              <input
                type="text"
                id="pageTitle"
                value={settings.pageTitle}
                onChange={(e) => handleInputChange('pageTitle', e.target.value)}
                placeholder="Enter blog page title"
                className="blog-settings__input"
              />
            </div>

            <div className="blog-settings__field">
              <label htmlFor="pageDescription">Blog Page Description</label>
              <textarea
                id="pageDescription"
                value={settings.pageDescription}
                onChange={(e) => handleInputChange('pageDescription', e.target.value)}
                placeholder="Enter blog page description"
                className="blog-settings__textarea"
                rows={3}
              />
            </div>

            <div className="blog-settings__field">
              <label htmlFor="postsPerPage">Posts Per Page</label>
              <input
                type="number"
                id="postsPerPage"
                value={settings.postsPerPage}
                onChange={(e) => handleInputChange('postsPerPage', parseInt(e.target.value))}
                min={1}
                max={24}
                className="blog-settings__input blog-settings__input--small"
              />
            </div>

            <div className="blog-settings__field">
              <label htmlFor="defaultThumbnail">Default Thumbnail URL</label>
              <input
                type="text"
                id="defaultThumbnail"
                value={settings.defaultThumbnail}
                onChange={(e) => handleInputChange('defaultThumbnail', e.target.value)}
                placeholder="Enter default thumbnail URL"
                className="blog-settings__input"
              />
              <small className="blog-settings__help-text">
                This image will be used when a post doesn&apos;t have a thumbnail.
              </small>
            </div>

            <div className="blog-settings__field">
              <label>Display Options</label>
              <div className="blog-settings__checkboxes">
                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="showAuthor"
                    checked={settings.showAuthor}
                    onChange={(e) => handleInputChange('showAuthor', e.target.checked)}
                  />
                  <label htmlFor="showAuthor">Show Author</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="showDate"
                    checked={settings.showDate}
                    onChange={(e) => handleInputChange('showDate', e.target.checked)}
                  />
                  <label htmlFor="showDate">Show Date</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="showCategory"
                    checked={settings.showCategory}
                    onChange={(e) => handleInputChange('showCategory', e.target.checked)}
                  />
                  <label htmlFor="showCategory">Show Category</label>
                </div>
              </div>
            </div>
          </div>

          <div className="blog-settings__section">
            <h2 className="blog-settings__section-title">Categories</h2>

            <div className="blog-settings__categories">
              <div className="blog-settings__add-category">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="blog-settings__input"
                />
                <button
                  className="blog-settings__add-button"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>
              </div>

              <div className="blog-settings__category-list">
                {settings.categories.length === 0 ? (
                  <p className="blog-settings__empty-message">No categories added yet.</p>
                ) : (
                  settings.categories.map((category, index) => (
                    <div key={index} className="blog-settings__category-item">
                      <span>{category}</span>
                      <button
                        className="blog-settings__remove-button"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="blog-settings__section">
            <h2 className="blog-settings__section-title">Single Post Page Settings</h2>

            <div className="blog-settings__field">
              <label>Display Options</label>
              <div className="blog-settings__checkboxes">
                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowAuthor"
                    checked={settings.singlePageSettings.showAuthor}
                    onChange={(e) => handleSinglePageChange('showAuthor', e.target.checked)}
                  />
                  <label htmlFor="singleShowAuthor">Show Author</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowDate"
                    checked={settings.singlePageSettings.showDate}
                    onChange={(e) => handleSinglePageChange('showDate', e.target.checked)}
                  />
                  <label htmlFor="singleShowDate">Show Date</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowCategory"
                    checked={settings.singlePageSettings.showCategory}
                    onChange={(e) => handleSinglePageChange('showCategory', e.target.checked)}
                  />
                  <label htmlFor="singleShowCategory">Show Category</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowTags"
                    checked={settings.singlePageSettings.showTags}
                    onChange={(e) => handleSinglePageChange('showTags', e.target.checked)}
                  />
                  <label htmlFor="singleShowTags">Show Tags</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowShareButtons"
                    checked={settings.singlePageSettings.showShareButtons}
                    onChange={(e) => handleSinglePageChange('showShareButtons', e.target.checked)}
                  />
                  <label htmlFor="singleShowShareButtons">Show Share Buttons</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowComments"
                    checked={settings.singlePageSettings.showComments}
                    onChange={(e) => handleSinglePageChange('showComments', e.target.checked)}
                  />
                  <label htmlFor="singleShowComments">Show Comments</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowRelatedPosts"
                    checked={settings.singlePageSettings.showRelatedPosts}
                    onChange={(e) => handleSinglePageChange('showRelatedPosts', e.target.checked)}
                  />
                  <label htmlFor="singleShowRelatedPosts">Show Related Posts</label>
                </div>

                <div className="blog-settings__checkbox">
                  <input
                    type="checkbox"
                    id="singleShowAuthorBio"
                    checked={settings.singlePageSettings.showAuthorBio}
                    onChange={(e) => handleSinglePageChange('showAuthorBio', e.target.checked)}
                  />
                  <label htmlFor="singleShowAuthorBio">Show Author Bio</label>
                </div>
              </div>
            </div>

            {settings.singlePageSettings.showRelatedPosts && (
              <div className="blog-settings__field">
                <label htmlFor="singleRelatedPostsCount">Related Posts Count</label>
                <input
                  type="number"
                  id="singleRelatedPostsCount"
                  value={settings.singlePageSettings.relatedPostsCount}
                  onChange={(e) => handleSinglePageChange('relatedPostsCount', parseInt(e.target.value))}
                  min={1}
                  max={12}
                  className="blog-settings__input blog-settings__input--small"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-settings__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .blog-settings__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .blog-settings__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .blog-settings__actions {
          display: flex;
          gap: 12px;
        }

        .blog-settings__back-button {
          padding: 8px 16px;
          background-color: #f1f5f9;
          color: #1e293b;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
        }

        .blog-settings__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .blog-settings__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .blog-settings__content {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .blog-settings__section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .blog-settings__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .blog-settings__field {
          margin-bottom: 16px;
        }

        .blog-settings__field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .blog-settings__input,
        .blog-settings__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .blog-settings__input--small {
          width: 100px;
        }

        .blog-settings__textarea {
          resize: vertical;
        }

        .blog-settings__help-text {
          display: block;
          font-size: 12px;
          color: #64748b;
          margin-top: 4px;
        }

        .blog-settings__checkboxes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .blog-settings__checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .blog-settings__checkbox label {
          margin-bottom: 0;
          cursor: pointer;
        }

        .blog-settings__add-category {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .blog-settings__add-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          white-space: nowrap;
        }

        .blog-settings__category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .blog-settings__category-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background-color: #f1f5f9;
          border-radius: 4px;
          font-size: 14px;
        }

        .blog-settings__remove-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border: none;
          background-color: transparent;
          color: #64748b;
          cursor: pointer;
          padding: 0;
        }

        .blog-settings__remove-button:hover {
          color: #dc2626;
        }

        .blog-settings__empty-message {
          color: #64748b;
          font-style: italic;
        }
      `}</style>
    </AdminLayout>
  );
};

export default BlogSettings;
