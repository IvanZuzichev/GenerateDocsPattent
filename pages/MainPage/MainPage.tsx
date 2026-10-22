import React, { useState } from 'react';
import { generateDocx, generatePdf } from '../../utils/documentGenerator';
import './MainPage.scss';

interface DocumentData {
  title: string;
  content: string;
  author: string;
}

const MainPage: React.FC = () => {
  const [documentData, setDocumentData] = useState<DocumentData>({
    title: '',
    content: '',
    author: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDocumentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateDocx = async () => {
    if (!documentData.title || !documentData.content) return;
    setIsGenerating(true);
    try {
      await generateDocx(documentData);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!documentData.title || !documentData.content) return;
    setIsGenerating(true);
    try {
      await generatePdf(documentData);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="main-page">
      <div className="main-page__form">
        <div className="main-page__field">
          <label htmlFor="title" className="main-page__label">
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={documentData.title}
            onChange={handleChange}
            placeholder="Введите заголовок документа"
            className="main-page__input"
          />
        </div>

        <div className="main-page__field">
          <label htmlFor="author" className="main-page__label">
            Автор
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={documentData.author}
            onChange={handleChange}
            placeholder="Введите имя автора"
            className="main-page__input"
          />
        </div>

        <div className="main-page__field">
          <label htmlFor="content" className="main-page__label">
            Содержание
          </label>
          <textarea
            id="content"
            name="content"
            value={documentData.content}
            onChange={handleChange}
            placeholder="Введите содержание документа"
            rows={8}
            className="main-page__textarea"
          />
        </div>

        <div className="main-page__actions">
          <button
            onClick={handleGenerateDocx}
            disabled={isGenerating || !documentData.title || !documentData.content}
            className="main-page__button main-page__button--docx"
          >
            {isGenerating ? 'Генерация...' : 'Скачать DOCX'}
          </button>
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating || !documentData.title || !documentData.content}
            className="main-page__button main-page__button--pdf"
          >
            {isGenerating ? 'Генерация...' : 'Скачать PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
