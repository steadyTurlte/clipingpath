import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { uploadImage } from '@/utils/imageUtils';

const PricingProjectsEditor = () => {
  const [projectData, setProjectData] = useState({
    subtitle: '',
    title: '',
    description: '',
    items: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [projectRemoved, setProjectRemoved] = useState(false);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    id: 0,
    title: '',
    category: '',
    image: '',
    link: ''
  });
  const [projectImageFile, setProjectImageFile] = useState(null);
  const [projectImagePreview, setProjectImagePreview] = useState('');

  useEffect(() => {
    // Fetch the project data when the component mounts
    const fetchProjectData = async () => {
      setError(null);
      try {
        const response = await fetch('/api/content/pricing?section=project');
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError('Failed to load project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleProjectImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProjectImagePreview(previewUrl);
    }
  };

  const handleAddProject = () => {
    // Reset the form
    setNewProject({
      id: projectData.items.length > 0 ? Math.max(...projectData.items.map(item => item.id)) + 1 : 1,
      title: '',
      category: '',
      image: '',
      link: '/portfolio'
    });
    setProjectImageFile(null);
    setProjectImagePreview('');
    setSelectedProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setNewProject({...project});
    setProjectImagePreview(project.image);
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleRemoveProject = (projectId) => {
    const updatedProjects = projectData.items.filter(project => project.id !== projectId);
    setProjectData({
      ...projectData,
      items: updatedProjects
    });
    setProjectRemoved(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setProjectRemoved(false);
    }, 3000);
  };

  const handleSaveProject = async () => {
    // Validate form
    setError(null);

    if (!newProject.title || !newProject.category) {
      setError('Project title and category are required');
      return;
    }

    if (!projectImagePreview && !newProject.image) {
      setError('Project image is required');
      return;
    }

    setUploading(true);
    try {
      let imagePath = newProject.image;

      // Upload image if a new file is selected
      if (projectImageFile) {
        imagePath = await uploadImage(projectImageFile, 'project');
      }

      const updatedProject = {
        ...newProject,
        image: imagePath
      };

      let updatedProjects;
      if (selectedProject) {
        // Update existing project
        updatedProjects = projectData.items.map(project =>
          project.id === selectedProject.id ? updatedProject : project
        );
      } else {
        // Add new project
        updatedProjects = [...projectData.items, updatedProject];
      }

      setProjectData({
        ...projectData,
        items: updatedProjects
      });
      setShowProjectModal(false);
      setProjectSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setProjectSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await fetch('/api/content/pricing?section=project', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Projects section');
      }
    } catch (error) {
      console.error('Error saving project data:', error);
      setError('Failed to save Projects section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading project data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Pricing Projects | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/pricing" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Pricing Projects</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {error && (
          <div className="admin-page__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-page__success">
            <p>Projects section saved successfully!</p>
          </div>
        )}

        {projectSuccess && (
          <div className="admin-page__success">
            <p>Project saved successfully!</p>
          </div>
        )}

        {projectRemoved && (
          <div className="admin-page__success">
            <p>Project removed successfully!</p>
          </div>
        )}

        <div className="admin-page__content">
          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Projects Section Header</h2>
            </div>

            <div className="admin-page__field">
              <label htmlFor="subtitle" className="admin-page__label">Subtitle</label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                className="admin-page__input"
                value={projectData.subtitle}
                onChange={handleInputChange}
                placeholder="Enter subtitle"
              />
            </div>
            <div className="admin-page__field">
              <label htmlFor="title" className="admin-page__label">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="admin-page__input"
                value={projectData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>
            <div className="admin-page__field">
              <label htmlFor="description" className="admin-page__label">Description</label>
              <textarea
                id="description"
                name="description"
                className="admin-page__textarea"
                value={projectData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Projects</h2>
              <button
                type="button"
                className="admin-page__add-button"
                onClick={handleAddProject}
              >
                Add New Project
              </button>
            </div>

            <div className="admin-page__cards-grid">
              {projectData.items.map(project => (
                <div key={project.id} className="admin-page__card">
                  <div className="admin-page__card-header">
                    <h3 className="admin-page__card-title">{project.title}</h3>
                  </div>
                  <div className="admin-page__card-content">
                    <div className="admin-page__project-image">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={300}
                        height={200}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                      />
                    </div>
                    <div className="admin-page__project-details">
                      <p><strong>Category:</strong> {project.category}</p>
                      <p><strong>Link:</strong> {project.link}</p>
                    </div>
                    <div className="admin-page__project-actions">
                      <button
                        type="button"
                        className="admin-page__edit-button"
                        onClick={() => handleEditProject(project)}
                      >
                        <i className="fa-solid fa-pencil"></i> Edit
                      </button>
                      <button
                        type="button"
                        className="admin-page__remove-button"
                        onClick={() => handleRemoveProject(project.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Edit Modal */}
      {showProjectModal && (
        <div className="admin-page__modal-overlay">
          <div className="admin-page__modal">
            <div className="admin-page__modal-header">
              <h2 className="admin-page__modal-title">
                {selectedProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                type="button"
                className="admin-page__modal-close"
                onClick={() => setShowProjectModal(false)}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="admin-page__modal-content">
              {error && (
                <div className="admin-page__modal-error">
                  <p>{error}</p>
                </div>
              )}
              <div className="admin-page__field">
                <label htmlFor="title" className="admin-page__label">Project Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="admin-page__input"
                  value={newProject.title}
                  onChange={handleProjectInputChange}
                  placeholder="Enter project title"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="category" className="admin-page__label">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  className="admin-page__input"
                  value={newProject.category}
                  onChange={handleProjectInputChange}
                  placeholder="Enter project category"
                />
              </div>

              <div className="admin-page__field">
                <label htmlFor="link" className="admin-page__label">Link</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  className="admin-page__input"
                  value={newProject.link}
                  onChange={handleProjectInputChange}
                  placeholder="Enter project link"
                />
              </div>

              <div className="admin-page__field">
                <label className="admin-page__label">Project Image</label>
                <div className="admin-page__file-upload">
                  <input
                    type="file"
                    id="projectImage"
                    className="admin-page__file-input"
                    accept="image/*"
                    onChange={handleProjectImageChange}
                  />
                  <label htmlFor="projectImage" className="admin-page__file-label">
                    <i className="fa-solid fa-upload"></i> Choose Project Image
                  </label>
                </div>
                {projectImagePreview && (
                  <div className="admin-page__image-preview">
                    <Image
                      src={projectImagePreview}
                      alt="Project Image Preview"
                      width={300}
                      height={200}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="admin-page__modal-footer">
              <button
                type="button"
                className="admin-page__modal-cancel"
                onClick={() => setShowProjectModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-page__modal-save"
                onClick={handleSaveProject}
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page__error,
        .admin-page__success,
        .admin-page__modal-error {
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .admin-page__error,
        .admin-page__modal-error {
          background-color: #fee2e2;
          color: #b91c1c;
          border-left: 4px solid #ef4444;
        }

        .admin-page__success {
          background-color: #dcfce7;
          color: #166534;
          border-left: 4px solid #22c55e;
        }

        .admin-page__error p,
        .admin-page__success p,
        .admin-page__modal-error p {
          margin: 0;
          font-weight: 500;
        }

        .admin-page__error p::before,
        .admin-page__modal-error p::before {
          content: '❌ ';
        }

        .admin-page__success p::before {
          content: '✅ ';
        }
      `}</style>
      {/* Using global admin.css styles */}
    </AdminLayout>
  );
};

export default PricingProjectsEditor;
