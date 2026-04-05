import { useParams, Link } from 'react-router-dom';
import { useGetResponsesQuery, useGetFormQuery } from '../shared/api/generated';

export const FormResponses = () => {
  const { id } = useParams<{ id: string }>();
  
  // Отримуємо дані форми (щоб знати назви питань), і самі відповіді
  const { data: formData } = useGetFormQuery({ id: id || '' });
  const { data: responseData, isLoading, error } = useGetResponsesQuery({ formId: id || '' });

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження відповідей...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red' }}>Помилка завантаження</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#1a73e8', textDecoration: 'none' }}>← На головну</Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
        <h1 style={{ margin: '0 0 50px 0', color: 'black' }}>Відповіді: {formData?.form?.title}</h1>
        <p style={{ color: '#5f6368' }}>Всього отримано відповідей: {responseData?.responses.length || 0}</p>
      </div>

      {responseData?.responses.map((resp, index) => (
        <div key={resp.id} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '15px', border: '1px solid #dadce0' }}>
          <h3 style={{ marginTop: 0, color: 'darkblue' }}>Респондент #{index + 1}</h3>
          <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
          
          {resp.answers.map(ans => {
            // Шукаємо назву питання за його ID
            const questionTitle = formData?.form?.questions.find(q => q.id === ans.questionId)?.title || 'Питання видалено';
            return (
              <div key={ans.questionId} style={{ margin: '12px 0' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{questionTitle}:</p>
                <p style={{ margin: 0, color: '#3c4043' }}>
                  {ans.value.join(', ') || <span style={{ color: '#999' }}>Без відповіді</span>}
                </p>
              </div>
            );
          })}
        </div>
      ))}

      {responseData?.responses.length === 0 && (
        <div style={{ textAlign: 'center', color: '#70757a', marginTop: '40px' }}>
          Тут поки порожньо. Надішліть посилання на форму друзям!
        </div>
      )}
    </div>
  );
};