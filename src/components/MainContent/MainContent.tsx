import { useState, ChangeEvent } from 'react';
import { generateDocuments, FormData } from '../../utils/documentGenerator';
import './MainContent.scss';

const initialState: FormData = {
  name: '',
  description: '',
  volume: '',
  code: '',
  owner: '',
  os: '',
  resolution: '',
  platform: '',
  language: '',
};

const MainContent = () => {
  const [form, setForm] = useState<FormData>(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert('Введите название программы');
      return;
    }
    if (!form.description.trim()) {
      alert('Введите описание программы');
      return;
    }
    if (!form.volume.trim()) {
      alert('Введите объём программы');
      return;
    }
    if (!form.code.trim()) {
      alert('Вставьте код программы');
      return;
    }

    setLoading(true);
    try {
      await generateDocuments(form);
      setForm({
        name: '',
        description: '',
        volume: '',
        code: '',
        owner: form.owner,
        os: form.os,
        resolution: form.resolution,
        platform: form.platform,
        language: form.language,
      });
    } catch (err) {
      console.error(err);
      alert('Ошибка при создании документов: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="main-content__form">
        <div className="main-content__form-row">
          <div className="main-content__form-column">
            <label className="main-content__field">
              <span className="main-content__label">Название программы для ЭВМ *</span>
              <input
                className="main-content__input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Введите название"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Описание программы *</span>
              <textarea
                className="main-content__input main-content__input--textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Введите описание программы"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Объём программы (Кб) *</span>
              <input
                className="main-content__input"
                type="number"
                name="volume"
                value={form.volume}
                onChange={handleChange}
                placeholder="Например: 150"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Код программы *</span>
              <textarea
                className="main-content__input main-content__input--textarea main-content__input--code"
                name="code"
                value={form.code}
                onChange={handleChange}
                rows={12}
                placeholder="Вставьте код программы"
              />
            </label>
          </div>

          <div className="main-content__form-column">
            <label className="main-content__field">
              <span className="main-content__label">Правообладатель</span>
              <input
                className="main-content__input"
                type="text"
                name="owner"
                value={form.owner}
                onChange={handleChange}
                 placeholder="Зюзичев Иван Сергеевич"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">ОС</span>
              <input
                className="main-content__input"
                type="text"
                name="os"
                value={form.os}
                onChange={handleChange}
                placeholder="Windows 7/10/11, Linux, macOS"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Разрешение экрана</span>
              <input
                className="main-content__input"
                type="text"
                name="resolution"
                value={form.resolution}
                onChange={handleChange}
                placeholder="1024х768 минимум"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Базовая платформа</span>
              <input
                className="main-content__input"
                type="text"
                name="platform"
                value={form.platform}
                onChange={handleChange}
                placeholder="GNU Octave 5.2.0 и выше"
              />
            </label>

            <label className="main-content__field">
              <span className="main-content__label">Язык программирования</span>
              <input
                className="main-content__input"
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="JavaScript"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="main-content__actions">
        <button
          className="main-content__button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Создание...' : 'Создать заявление'}
        </button>
      </div>
    </main>
  );
};

export default MainContent;