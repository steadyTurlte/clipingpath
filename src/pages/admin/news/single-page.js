import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const BlogSinglePageEditor = () => {
  const [singlePageData, setSinglePageData] = useState({
    banner: {
      title: 'Blog Details'
    },
    layout: {
      showSidebar: true,
      sidebarPosition: 'right',
      contentWidth: 'wide'
    },
    display: {
      showAuthor: true,
      showDate: true,
      showCategory: true,
      showTags: true,
      showShareButtons: true,
      showComments: true,
      showRelatedPosts: true
    },
    relatedPosts: {
      title: 'Related Posts',
      count: 3,
      criteria: 'category' // category, tag, author
    },
    comments: {
      title: 'Comments',
      allowComments: true,
      requireApproval: true,
      requireName: true,
      requireEmail: true,
      notificationEmail: ''
    },
    author: {
      showBio: true,
      showSocialLinks: true,
      showOtherPosts: false
    },
    socialShare: {
      platforms: ['facebook', 'twitter', 'linkedin', 'pinterest']
    },
    seo: {
      metaTitleFormat: '{post_title} | {site_name}',
      metaDescriptionFormat: '{post_excerpt}',
      usePostImageAsSocialImage: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchSinglePageData = async () => {
      try {
        const response = await fetch('/api/content/news/single-page');
        if (response.ok) {
          const data = await response.json();
          setSinglePageData(data);
        } else {
          toast.error('Failed to load blog single page settings');
        }
      } catch (error) {
        console.error('Error fetching blog single page settings:', error);
        toast.error('Error loading blog single page settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSinglePageData();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSinglePageData({
      ...singlePageData,
      [section]: {
        ...singlePageData[section],
        [field]: value
      }
    });
  };

  const handleSocialPlatformsChange = (platform, checked) => {
    let updatedPlatforms = [...singlePageData.socialShare.platforms];

    if (checked && !updatedPlatforms.includes(platform)) {
      updatedPlatforms.push(platform);
    } else if (!checked && updatedPlatforms.includes(platform)) {
      updatedPlatforms = updatedPlatforms.filter(p => p !== platform);
    }

    setSinglePageData({
      ...singlePageData,
      socialShare: {
        ...singlePageData.socialShare,
        platforms: updatedPlatforms
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/news/single-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(singlePageData)
      });

      if (response.ok) {
        toast.success('Blog single page settings saved successfully!');
      } else {
        toast.error('Failed to save Blog single page settings');
      }
    } catch (error) {
      console.error('Error saving blog single page settings:', error);
      toast.error('Failed to save Blog single page settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-editor__loading">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Blog Single Page Settings | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Blog Single Page Settings</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/news" className="admin-editor__back-button">
              Back to Blog
            </Link>
            <button
              className="admin-editor__save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="admin-editor__tabs">
          <button
            className={`admin-editor__tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Layout
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'display' ? 'active' : ''}`}
            onClick={() => setActiveTab('display')}
          >
            Display
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'related' ? 'active' : ''}`}
            onClick={() => setActiveTab('related')}
          >
            Related Posts
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'author' ? 'active' : ''}`}
            onClick={() => setActiveTab('author')}
          >
            Author
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'social' ? 'active' : ''}`}
            onClick={() => setActiveTab('social')}
          >
            Social Sharing
          </button>
          <button
            className={`admin-editor__tab ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO
          </button>
        </div>

        <div className="admin-editor__content">
          {activeTab === 'general' && (
            <div className="admin-editor__section">
              <h2 className="admin-editor__section-title">Banner Settings</h2>

              <div className="admin-editor__field">
                <label className="admin-editor__label">Banner Title</label>
                <input
                  type="text"
                  className="admin-editor__input"
                  value={singlePageData.banner.title}
                  onChange={(e) => handleInputChange('banner', 'title', e.target.value)}
                  placeholder="Enter banner title"
                />
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="admin-editor__section">
              <h2 className="admin-editor__section-title">Layout Settings</h2>

              <div className="admin-editor__field admin-editor__field--checkbox">
                <input
                  type="checkbox"
                  id="showSidebar"
                  checked={singlePageData.layout.showSidebar}
                  onChange={(e) => handleInputChange('layout', 'showSidebar', e.target.checked)}
                />
                <label htmlFor="showSidebar" className="admin-editor__checkbox-label">
                  Show Sidebar
                </label>
              </div>

              <div className="admin-editor__field">
                <label className="admin-editor__label">Sidebar Position</label>
                <select
                  className="admin-editor__select"
                  value={singlePageData.layout.sidebarPosition}
                  onChange={(e) => handleInputChange('layout', 'sidebarPosition', e.target.value)}
                  disabled={!singlePageData.layout.showSidebar}
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                </select>
              </div>

              <div className="admin-editor__field">
                <label className="admin-editor__label">Content Width</label>
                <select
                  className="admin-editor__select"
                  value={singlePageData.layout.contentWidth}
                  onChange={(e) => handleInputChange('layout', 'contentWidth', e.target.value)}
                >
                  <option value="wide">Wide</option>
                  <option value="narrow">Narrow</option>
                  <option value="full">Full Width</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="admin-editor__section">
              <h2 className="admin-editor__section-title">Display Settings</h2>
              <p className="admin-editor__description">
                Configure what elements are displayed on the blog single page.
              </p>

              <div className="admin-editor__checkboxes">
                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showAuthor"
                    checked={singlePageData.display.showAuthor}
                    onChange={(e) => handleInputChange('display', 'showAuthor', e.target.checked)}
                  />
                  <label htmlFor="showAuthor" className="admin-editor__checkbox-label">
                    Show Author
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showDate"
                    checked={singlePageData.display.showDate}
                    onChange={(e) => handleInputChange('display', 'showDate', e.target.checked)}
                  />
                  <label htmlFor="showDate" className="admin-editor__checkbox-label">
                    Show Date
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showCategory"
                    checked={singlePageData.display.showCategory}
                    onChange={(e) => handleInputChange('display', 'showCategory', e.target.checked)}
                  />
                  <label htmlFor="showCategory" className="admin-editor__checkbox-label">
                    Show Category
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showTags"
                    checked={singlePageData.display.showTags}
                    onChange={(e) => handleInputChange('display', 'showTags', e.target.checked)}
                  />
                  <label htmlFor="showTags" className="admin-editor__checkbox-label">
                    Show Tags
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showShareButtons"
                    checked={singlePageData.display.showShareButtons}
                    onChange={(e) => handleInputChange('display', 'showShareButtons', e.target.checked)}
                  />
                  <label htmlFor="showShareButtons" className="admin-editor__checkbox-label">
                    Show Share Buttons
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showComments"
                    checked={singlePageData.display.showComments}
                    onChange={(e) => handleInputChange('display', 'showComments', e.target.checked)}
                  />
                  <label htmlFor="showComments" className="admin-editor__checkbox-label">
                    Show Comments
                  </label>
                </div>

                <div className="admin-editor__field admin-editor__field--checkbox">
                  <input
                    type="checkbox"
                    id="showRelatedPosts"
                    checked={singlePageData.display.showRelatedPosts}
                    onChange={(e) => handleInputChange('display', 'showRelatedPosts', e.target.checked)}
                  />
                  <label htmlFor="showRelatedPosts" className="admin-editor__checkbox-label">
                    Show Related Posts
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Additional tabs will be implemented similarly */}
        </div>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
        }

        .admin-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-editor__title {
          font-size: 24px;
          font-weight: 600;
          color: #1e293b;
        }

        .admin-editor__actions {
          display: flex;
          gap: 12px;
        }

        .admin-editor__back-button {
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

        .admin-editor__save-button {
          padding: 8px 16px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .admin-editor__save-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }

        .admin-editor__tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 24px;
          overflow-x: auto;
          background-color: #f1f5f9;
          border-radius: 8px;
        }

        .admin-editor__tab {
          padding: 12px 16px;
          background-color: transparent;
          color: #64748b;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
        }

        .admin-editor__tab.active {
          background-color: white;
          color: #4569e7;
          font-weight: 600;
        }

        .admin-editor__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-editor__section {
          margin-bottom: 24px;
        }

        .admin-editor__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-editor__subsection-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 16px 0 12px;
        }

        .admin-editor__description {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 16px;
        }

        .admin-editor__field {
          margin-bottom: 16px;
        }

        .admin-editor__field--checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .admin-editor__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-editor__checkbox-label {
          font-size: 14px;
          color: #1e293b;
          cursor: pointer;
        }

        .admin-editor__input,
        .admin-editor__select,
        .admin-editor__textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        .admin-editor__checkboxes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

      `}</style>
    </AdminLayout>
  );
};

export default BlogSinglePageEditor;
