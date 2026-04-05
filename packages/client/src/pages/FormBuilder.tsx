import React from 'react';
import { useFormBuilder } from './hooks/useFormBuilder';
import { type QuestionType } from '../shared/api/generated';

// Стиль для виправлення чорного фону автозаповнення
const inputBaseStyle: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'black',
  WebkitBoxShadow: '0 0 0px 1000px white inset',
  outline: 'none'
};

export const FormBuilder = () => {
  const {
    title, setTitle,
    description, setDescription,
    questions, addQuestion, updateQuestion, addOption,
    handleSave, isLoading
  } = useFormBuilder();

  return (
    <div style={{ padding: '40px 20px', maxWidth: '770px', margin: '0 auto', backgroundColor: 'white', minHeight: '100vh' }}>
      
      {/* Заголовок форми */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', borderTop: '10px solid black', padding: '24px', marginBottom: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <input 
          placeholder="Назва форми" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ ...inputBaseStyle, fontSize: '32px', width: '100%', border: 'none', borderBottom: '1px solid gray', marginBottom: '12px' }}
        />
        <input 
          placeholder="Опис форми" 
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...inputBaseStyle, fontSize: '14px', width: '100%', border: 'none', borderBottom: '1px solid gray' }}
        />
      </div>

      {/* Список питань */}
      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '12px', borderLeft: '6px solid black', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <input 
              placeholder="Запитання" 
              value={q.title}
              onChange={e => updateQuestion(qIndex, { title: e.target.value })}
              style={{ ...inputBaseStyle, flex: 2, padding: '15px', border: 'none', borderBottom: '1px solid gray' }}
            />
            <select 
              value={q.type}
              onChange={e => updateQuestion(qIndex, { type: e.target.value as QuestionType, options: [] })}
              style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: 'black', border: '1px solid gray' }}
            >
              <option value="TEXT">Текстова відповідь</option>
              <option value="MULTIPLE_CHOICE">Один варіант (Radio)</option>
              <option value="CHECKBOX">Кілька варіантів (Checkbox)</option>
              <option value="DATE">Дата</option>
            </select>
          </div>

          {/* Варіанти відповіді (Radio/Checkbox) */}
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
                    style={{ ...inputBaseStyle, border: 'none', borderBottom: '1px solid #eee', padding: '4px', width: '80%' }}
                  />
                </div>
              ))}
              <button 
                onClick={() => addOption(qIndex)}
                style={{ color: '#4285f4', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', marginTop: '10px' }}
              >
                + Додати варіант
              </button>
            </div>
          )}

          {/* Пряме відображення для типу DATE */}
          {q.type === 'DATE' && (
             <div style={{ marginLeft: '20px', color: '#70757a' }}>Поле для вибору дати відобразиться при заповненні.</div>
          )}
        </div>
      ))}

      {/* Кнопки управління */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button 
          onClick={addQuestion}
          style={{ padding: '10px 20px', backgroundColor: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Додати питання
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
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          {isLoading ? 'Збереження...' : 'Зберегти форму'}
        </button>
      </div>
    </div>
  );
};