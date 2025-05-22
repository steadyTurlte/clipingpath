import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';

const TeamMembersEditor = () => {
  const [teamData, setTeamData] = useState({
    subtitle: '',
    title: '',
    description: '',
    members: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [memberAdded, setMemberAdded] = useState(false);
  const [memberRemoved, setMemberRemoved] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/api/content/teams?section=team');
        if (response.ok) {
          const data = await response.json();

          // Default members to use if none exist
          const defaultMembers = [
            {
              id: 1,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/one-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            },
            {
              id: 2,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/two-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            },
            {
              id: 3,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/three-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            },
            {
              id: 4,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/four-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            },
            {
              id: 5,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/five-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            },
            {
              id: 6,
              name: "Sergio R. Haas",
              position: "Creative Designer",
              image: "/images/team/six-m.png",
              social: {
                facebook: "/",
                twitter: "/",
                instagram: "/",
                linkedin: "/"
              }
            }
          ];

          // Check if members array exists and has items
          if (!data.members || data.members.length === 0) {
            // If no members exist, automatically initialize with default members
            const updatedData = {
              ...data,
              subtitle: data.subtitle || '',
              title: data.title || '',
              description: data.description || '',
              members: defaultMembers,
              largeImage: data.largeImage || '' // Preserve largeImage if it exists
            };

            // Save the default members to the database
            try {
              const saveResponse = await fetch('/api/content/teams?section=team', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
              });

              if (saveResponse.ok) {
                console.log('Default team members initialized successfully');
              } else {
                console.error('Failed to initialize default team members');
              }
            } catch (saveError) {
              console.error('Error initializing default team members:', saveError);
            }

            // Update the state with the default members
            setTeamData(updatedData);
          } else {
            // If members exist, use them
            setTeamData({
              subtitle: data.subtitle || '',
              title: data.title || '',
              description: data.description || '',
              members: data.members,
              largeImage: data.largeImage || '' // Preserve largeImage if it exists
            });
          }
        } else {
          setError('Failed to load team data');
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Error loading team data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleInputChange = (field, value) => {
    setTeamData({
      ...teamData,
      [field]: value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // Save the team members
      const response = await fetch('/api/content/teams?section=team', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...teamData,
          members: teamData.members || []
        })
      });

      if (response.ok) {
        setSaveSuccess(true);

        // Hide success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        setError('Failed to save Team members section');
      }
    } catch (error) {
      console.error('Error saving team data:', error);
      setError('Failed to save Team members section');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page__loading">
          <p>Loading team members data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Edit Team Members | Photodit Admin</title>
      </Head>

      <div className="admin-page">
        <div className="admin-page__header">
          <div className="admin-page__title-wrapper">
            <Link href="/admin/teams" className="admin-page__back-link">
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
            <h1 className="admin-page__title">Edit Team Members</h1>
          </div>

          <button
            className="admin-page__save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <style jsx>{`
          .admin-page__message {
            background-color: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            margin-bottom: 24px;
          }

          .admin-page__message p {
            color: #64748b;
            margin-bottom: 16px;
          }

          .admin-page__message-actions {
            display: flex;
            justify-content: center;
            margin-top: 16px;
          }

          .admin-page__init-button {
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 10px 16px;
            font-size: 14px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s ease;
          }

          .admin-page__init-button:hover {
            background-color: #4338ca;
            transform: translateY(-1px);
          }

          .admin-page__init-button i {
            font-size: 16px;
          }
          .admin-page__error,
          .admin-page__success {
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

          .admin-page__error {
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
          .admin-page__success p {
            margin: 0;
            font-weight: 500;
          }

          .admin-page__error p::before {
            content: '❌ ';
          }

          .admin-page__success p::before {
            content: '✅ ';
          }
        `}</style>

        {error && (
          <div className="admin-page__error">
            <p>{error}</p>
          </div>
        )}

        {saveSuccess && (
          <div className="admin-page__success">
            <p>Team members section saved successfully!</p>
          </div>
        )}

        {memberAdded && (
          <div className="admin-page__success">
            <p>Team member added successfully!</p>
          </div>
        )}

        {memberRemoved && (
          <div className="admin-page__success">
            <p>Team member removed successfully!</p>
          </div>
        )}

        <div className="admin-page__content">


          <div className="admin-page__section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__section-title">Team Members</h2>
              <button
                className="admin-page__add-button"
                onClick={() => {
                  const newMember = {
                    id: Date.now(),
                    image: '',
                    name: 'New Team Member',
                    position: 'Position',
                    description: '',
                    social: {
                      facebook: '',
                      twitter: '',
                      instagram: '',
                      linkedin: ''
                    }
                  };
                  const updatedMembers = [...teamData.members, newMember];
                  handleInputChange('members', updatedMembers);

                  // Provide feedback
                  setMemberAdded(true);

                  // Hide success message after 3 seconds
                  setTimeout(() => {
                    setMemberAdded(false);
                  }, 3000);

                  // Scroll to the new member after a short delay to allow rendering
                  setTimeout(() => {
                    const memberCards = document.querySelectorAll('.admin-page__member-card');
                    if (memberCards.length > 0) {
                      const lastCard = memberCards[memberCards.length - 1];
                      lastCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

                      // Add a highlight effect
                      lastCard.classList.add('admin-page__member-card--highlight');
                      setTimeout(() => {
                        lastCard.classList.remove('admin-page__member-card--highlight');
                      }, 2000);
                    }
                  }, 100);
                }}
              >
                <i className="fa-solid fa-plus"></i> Add Team Member
              </button>
            </div>

            {!teamData.members || teamData.members.length === 0 ? (
              <div className="admin-page__message">
                <p>Loading team members...</p>
              </div>
            ) : (
              <div className="admin-page__members-list">
                {teamData.members.map((member, index) => (
                  <div key={member.id} className="admin-page__member-card">
                    <div className="admin-page__card-header">
                      <h3 className="admin-page__card-title">
                        {member.name || 'New Team Member'}
                        <span className="admin-page__member-index">#{index + 1}</span>
                      </h3>
                      <button
                        className="admin-page__remove-button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${member.name || 'this team member'}?`)) {
                            const updatedMembers = [...teamData.members];
                            updatedMembers.splice(index, 1);
                            handleInputChange('members', updatedMembers);

                            setMemberRemoved(true);

                            // Hide success message after 3 seconds
                            setTimeout(() => {
                              setMemberRemoved(false);
                            }, 3000);
                          }
                        }}
                      >
                        <i className="fa-solid fa-trash"></i> Remove
                      </button>
                    </div>

                    <div className="admin-page__card-content">
                      <div className="admin-page__member-layout">
                        <div className="admin-page__member-image">
                          <ImageUploader
                            currentImage={member.image}
                            onImageChange={(imageUrl) => {
                              const updatedMembers = [...teamData.members];
                              updatedMembers[index] = {
                                ...updatedMembers[index],
                                image: imageUrl
                              };
                              handleInputChange('members', updatedMembers);
                            }}
                            directory="images/team"
                            label="Team Member Photo"
                            width={200}
                            height={200}
                            id={`member-${member.id}`}
                          />
                        </div>

                        <div className="admin-page__member-details">
                          <div className="admin-page__field">
                            <label className="admin-page__label">Name</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={member.name}
                              onChange={(e) => {
                                const updatedMembers = [...teamData.members];
                                updatedMembers[index] = {
                                  ...updatedMembers[index],
                                  name: e.target.value
                                };
                                handleInputChange('members', updatedMembers);
                              }}
                              placeholder="Enter name"
                            />
                          </div>

                          <div className="admin-page__field">
                            <label className="admin-page__label">Position</label>
                            <input
                              type="text"
                              className="admin-page__input"
                              value={member.position}
                              onChange={(e) => {
                                const updatedMembers = [...teamData.members];
                                updatedMembers[index] = {
                                  ...updatedMembers[index],
                                  position: e.target.value
                                };
                                handleInputChange('members', updatedMembers);
                              }}
                              placeholder="Enter position"
                            />
                          </div>

                          <div className="admin-page__field">
                            <label className="admin-page__label">Description</label>
                            <textarea
                              className="admin-page__textarea"
                              value={member.description || ''}
                              onChange={(e) => {
                                const updatedMembers = [...teamData.members];
                                updatedMembers[index] = {
                                  ...updatedMembers[index],
                                  description: e.target.value
                                };
                                handleInputChange('members', updatedMembers);
                              }}
                              placeholder="Enter description"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


    </AdminLayout>
  );
};

export default TeamMembersEditor;
