import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation, type AnswerInput } from '../shared/api/generated';

export const FormFill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetFormQuery({ id: id || '' });
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();

  // Зберігаємо відповіді у форматі { questionId: [value] }
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження форми...</div>;
  if (error || !data?.form) return <div style={{ textAlign: 'center', color: 'red' }}>Форму не знайдено</div>;

  const handleInputChange = (questionId: string, value: string, isCheckbox: boolean) => {
    setAnswers(prev => {
      const currentValues = prev[questionId] || [];
      if (isCheckbox) {
        return {
          ...prev,
          [questionId]: currentValues.includes(value) 
            ? currentValues.filter(v => v !== value) 
            : [...currentValues, value]
        };
      }
      return { ...prev, [questionId]: [value] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedAnswers: AnswerInput[] = Object.entries(answers).map(([qId, values]) => ({
      questionId: qId,
      value: values
    }));

    try {
      await submitResponse({ formId: id || '', answers: formattedAnswers }).unwrap();
      alert('Відповідь успішно надіслана!');
      navigate('/');
    } catch (err) {
      alert('Помилка при відправці');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '640px', margin: '0 auto', fontFamily: 'Roboto, Arial' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', borderTop: '10px solid #673ab7', padding: '24px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>{data.form.title}</h1>
          <p style={{ color: '#202124' }}>{data.form.description}</p>
        </div>

        {data.form.questions.map((q) => (
          <div key={q.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <p style={{ fontWeight: '500', marginBottom: '16px' }}>{q.title}</p>
            
            {q.type === 'TEXT' && (
              <input 
                type="text" 
                placeholder="Ваша відповідь"
                style={{ width: '100%', border: 'none', borderBottom: '1px solid #ddd', padding: '8px 0', outline: 'none' }}
                onChange={(e) => handleInputChange(q.id, e.target.value, false)}
              />
            )}

            {(q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') && q.options?.map(opt => (
              <div key={opt} style={{ margin: '10px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type={q.type === 'CHECKBOX' ? 'checkbox' : 'radio'} 
                  name={q.id}
                  onChange={() => handleInputChange(q.id, opt, q.type === 'CHECKBOX')}
                />
                <span>{opt}</span>
              </div>
            ))}
          </div>
        ))}

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ backgroundColor: '#673ab7', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
        >
          {isSubmitting ? 'Надсилаємо...' : 'Надіслати'}
        </button>
      </form>
    </div>
  );
};