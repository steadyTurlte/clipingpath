import  { useState } from 'react';
import ImageWithFallback from '@/components/admin/ImageWithFallback';

const FaqEditor = ({ data = {}, onChange }) => {
  const [uploadingImage, setUploadingImage] = useState(false);

  const editorData = {
    ...data,
    questions: [
      ...data.questions
    ]
  };

  const handleChange = (field, value) => {
    if (!onChange) return;
    
    onChange({
      ...editorData,
      [field]: value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    if (!onChange) return;
    
    const newQuestions = [...editorData.questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    
    onChange({
      ...editorData,
      questions: newQuestions
    });
  };

  const handleAddQuestion = () => {
    if (!onChange) return;
    
    const newQuestion = {
      id: Date.now(),
      question: "New Question",
      answer: "Answer to the new question."
    };
    
    onChange({
      ...editorData,
      questions: [...editorData.questions, newQuestion]
    });
  };

  const handleRemoveQuestion = (index) => {
    if (!onChange || editorData.questions.length <= 1) return;
    
    const newQuestions = [...editorData.questions];
    newQuestions.splice(index, 1);
    
    onChange({
      ...editorData,
      questions: newQuestions
    });
  };

  const handleImageUpload = async (e) => {
    if (!onChange) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', 'images/faq');
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.filePath) {
        onChange({
          ...editorData,
          image: result.filePath
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="faq-editor">
      <div className="faq-editor__form">
        <div className="form-group">
          <label htmlFor="subtitle">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            value={editorData.subtitle}
            onChange={(e) => handleChange('subtitle', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={editorData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label>FAQ Image</label>
          <div className="faq-image-preview">
            <ImageWithFallback 
              src={editorData.image} 
              alt="FAQ Image" 
              width={300} 
              height={400} 
            />
          </div>
          <div className="faq-image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control-file"
            />
            {uploadingImage && <span>Uploading...</span>}
          </div>
        </div>
        
        <div className="form-group">
          <div className="questions-header">
            <label>FAQ Questions</label>
            <button 
              type="button" 
              className="btn btn-sm btn-primary"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>
          
          {editorData.questions.map((question, index) => (
            <div key={question.id || index} className="question-editor">
              <div className="question-editor__header">
                <h4>Question {index + 1}</h4>
                <button 
                  type="button" 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  Remove
                </button>
              </div>
              
              <div className="form-group">
                <label htmlFor={`question-text-${index}`}>Question</label>
                <input
                  type="text"
                  id={`question-text-${index}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  className="form-control"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor={`question-answer-${index}`}>Answer</label>
                <textarea
                  id={`question-answer-${index}`}
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                  className="form-control"
                  rows={4}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .faq-editor {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .faq-editor__form {
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
        
        .questions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .question-editor {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 16px;
        }
        
        .question-editor__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .question-editor__header h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .faq-image-preview {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          margin-bottom: 8px;
        }
        
        .btn {
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .btn-primary {
          background-color: #4569e7;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #3a5bc7;
        }
        
        .btn-danger {
          background-color: #ef4444;
          color: white;
        }
        
        .btn-danger:hover {
          background-color: #dc2626;
        }
        
        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default FaqEditor;
