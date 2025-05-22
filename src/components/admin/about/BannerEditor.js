
const BannerEditor = ({ data = {}, onChange }) => {
  const editorData = {
    ...data
  };

  const handleChange = (field, value) => {
    if (!onChange) return;

    onChange({
      ...editorData,
      [field]: value
    });
  };

  return (
    <div className="banner-editor">
      <div className="banner-editor__form">
        <div className="form-group">
          <label htmlFor="title">Banner Title</label>
          <input
            type="text"
            id="title"
            value={editorData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <style jsx>{`
        .banner-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .banner-editor__form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default BannerEditor;
