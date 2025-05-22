import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'react-toastify';

const QuoteStatisticsEditor = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch('/api/content/get-quote?section=statistics');
        if (response.ok) {
          const data = await response.json();
          setStatistics(data);
        } else {
          toast.error('Failed to load statistics data');
        }
      } catch (error) {
        console.error('Error fetching statistics data:', error);
        toast.error('Error loading statistics data');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleStatChange = (index, field, value) => {
    const updatedStats = [...statistics];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    setStatistics(updatedStats);
  };

  const handleAddStat = () => {
    const newStat = {
      id: Date.now(),
      value: "0",
      symbol: "",
      label: "New Statistic"
    };
    setStatistics([...statistics, newStat]);
  };

  const handleRemoveStat = (index) => {
    const updatedStats = [...statistics];
    updatedStats.splice(index, 1);
    setStatistics(updatedStats);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/get-quote?section=statistics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(statistics)
      });

      if (response.ok) {
        toast.success('Statistics section saved successfully!');
      } else {
        toast.error('Failed to save Statistics section');
      }
    } catch (error) {
      console.error('Error saving statistics data:', error);
      toast.error('Failed to save Statistics section');
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
        <title>Edit Quote Statistics | Photodit Admin</title>
      </Head>

      <div className="admin-editor">
        <div className="admin-editor__header">
          <h1 className="admin-editor__title">Edit Quote Statistics</h1>
          <div className="admin-editor__actions">
            <Link href="/admin/get-quote" className="admin-editor__back-button">
              Back to Get A Quote
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

        <div className="admin-editor__content">
          <div className="admin-editor__section">
            <div className="admin-editor__section-header">
              <h2 className="admin-editor__section-title">Statistics</h2>
              <button
                className="admin-editor__add-button"
                onClick={handleAddStat}
              >
                Add Statistic
              </button>
            </div>

            {statistics.length === 0 ? (
              <p className="admin-editor__empty-message">No statistics added yet.</p>
            ) : (
              <div className="admin-editor__items">
                {statistics.map((stat, index) => (
                  <div key={stat.id} className="admin-editor__item">
                    <div className="admin-editor__item-header">
                      <h3 className="admin-editor__item-title">Statistic #{index + 1}</h3>
                      <button
                        className="admin-editor__remove-button"
                        onClick={() => handleRemoveStat(index)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="admin-editor__item-fields">
                      <div className="admin-editor__field admin-editor__field--small">
                        <label className="admin-editor__label">Value</label>
                        <input
                          type="text"
                          className="admin-editor__input"
                          value={stat.value}
                          onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                          placeholder="Enter value"
                        />
                      </div>

                      <div className="admin-editor__field admin-editor__field--small">
                        <label className="admin-editor__label">Symbol</label>
                        <input
                          type="text"
                          className="admin-editor__input"
                          value={stat.symbol}
                          onChange={(e) => handleStatChange(index, 'symbol', e.target.value)}
                          placeholder="Enter symbol (e.g. +, %, $)"
                        />
                      </div>

                      <div className="admin-editor__field">
                        <label className="admin-editor__label">Label</label>
                        <input
                          type="text"
                          className="admin-editor__input"
                          value={stat.label}
                          onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                          placeholder="Enter label"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

        .admin-editor__content {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .admin-editor__section {
          margin-bottom: 24px;
        }

        .admin-editor__section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-editor__section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-editor__add-button {
          padding: 6px 12px;
          background-color: #4569e7;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .admin-editor__empty-message {
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 4px;
          text-align: center;
          color: #64748b;
        }

        .admin-editor__items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-editor__item {
          padding: 16px;
          background-color: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .admin-editor__item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .admin-editor__item-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .admin-editor__remove-button {
          padding: 4px 8px;
          background-color: #fee2e2;
          color: #b91c1c;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .admin-editor__item-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 2fr;
          gap: 16px;
        }

        .admin-editor__field {
          margin-bottom: 16px;
        }

        .admin-editor__label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 8px;
        }

        .admin-editor__input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .admin-editor__item-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AdminLayout>
  );
};

export default QuoteStatisticsEditor;
