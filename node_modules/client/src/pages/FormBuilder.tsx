import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFormMutation, type QuestionType } from '../shared/api/generated';

interface Question {
  title: string;
  type: QuestionType;
  options: string[];
}

export const FormBuilder = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading }] = useCreateFormMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    setQuestions([...questions, { title: '', type: 'TEXT' as QuestionType, options: [] }]);
  };

  const updateQuestion = (index: number, fields: Partial<Question>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...fields };
    setQuestions(newQuestions);
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push(`Варіант ${newQuestions[qIndex].options.length + 1}`);
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!title.trim()) return alert('Будь ласка, вкажіть назву форми');
    
    try {
      await createForm({
        title,
        description: description || null,
        questions: questions.map(q => ({
          title: q.title || 'Без назви',
          type: q.type,
          options: q.options.length > 0 ? q.options : null
        }))
      }).unwrap();
      
      navigate('/');
    } catch (e) {
      console.error('Помилка при створенні:', e);
      alert('Не вдалося зберегти форму. Перевірте консоль.');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '770px', margin: '0 auto', backgroundColor: '#f0ebf8', minHeight: '100vh' }}>
      {/* Заголовок форми */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', borderTop: '10px solid #673ab7', padding: '24px', marginBottom: '12px' }}>
        <input 
          placeholder="Назва форми" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: '32px', width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', marginBottom: '12px' }}
        />
        <input 
          placeholder="Опис форми" 
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ fontSize: '14px', width: '100%', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none' }}
        />
      </div>

      {/* Список питань */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '12px', borderLeft: '6px solid #4285f4' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <input 
              placeholder="Запитання" 
              value={q.title}
              onChange={e => updateQuestion(qIndex, { title: e.target.value })}
              style={{ flex: 2, padding: '15px', backgroundColor: '#f8f9fa', border: 'none', borderBottom: '1px solid #ccc' }}
            />
            <select 
              value={q.type}
              onChange={e => updateQuestion(qIndex, { type: e.target.value as QuestionType, options: [] })}
              style={{ flex: 1, padding: '10px' }}
            >
              <option value="TEXT">Текстова відповідь</option>
              <option value="MULTIPLE_CHOICE">Один варіант (Radio)</option>
              <option value="CHECKBOX">Кілька варіантів (Checkbox)</option>
            </select>
          </div>

          {/* Відображення варіантів відповіді */}
          {(q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') && (
            <div style={{ marginLeft: '20px' }}>
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type={q.type === 'CHECKBOX' ? 'checkbox' : 'radio'} disabled />
                  <input 
                    value={opt}
                    onChange={e => {
                      const newOpts = [...q.options];
                      newOpts[oIndex] = e.target.value;
                      updateQuestion(qIndex, { options: newOpts });
                    }}
                    style={{ border: 'none', borderBottom: '1px solid #eee', padding: '4px' }}
                  />
                </div>
              ))}
              <button 
                onClick={() => addOption(qIndex)}
                style={{ color: '#4285f4', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                + Додати варіант
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Кнопки управління */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          onClick={addQuestion}
          style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
        >
          Додати питання
        </button>
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          style={{ 
            padding: '10px 30px', 
            backgroundColor: '#673ab7', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Збереження...' : 'Зберегти форму'}
        </button>
      </div>
    </div>
  );
};