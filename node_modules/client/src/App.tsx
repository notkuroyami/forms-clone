import { Routes, Route, Link } from 'react-router-dom';
// Використовуємо 'type' для імпорту типів, щоб уникнути помилки verbatimModuleSyntax
import { useGetFormsQuery, type GetFormsQuery } from './shared/api/generated';
import { FormBuilder } from '../src/pages/FormBuilder';
import { FormFill } from '../src//pages/FormFill';
import { FormResponses } from '../src/pages/FormResponses';

// Типізуємо одну форму, витягуючи тип із масиву в запиті
type FormItem = GetFormsQuery['forms'][number];

const HomePage = () => {
  const { data, isLoading, error } = useGetFormsQuery();

  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      Завантаження форм...
    </div>
  );

  if (error) return (
    <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
      Помилка завантаження: {JSON.stringify(error)}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#202124' }}>Мої форми</h1>
        <Link to="/forms/new">
          <button style={{ 
            padding: '10px 24px', 
            backgroundColor: 'darkblue', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
          }}>
            + Створити форму
          </button>
        </Link>
      </header>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {data?.forms.map((form: FormItem) => (
          <div key={form.id} style={{ 
            border: '1px solid #dadce0', 
            padding: '20px', 
            borderRadius: '8px',
            backgroundColor: 'white',
            transition: 'box-shadow 0.2s',
            cursor: 'default'
          }}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 1px 6px rgba(32,33,36,0.28)'}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#202124' }}>{form.title}</h3>
            {form.description && <p style={{ color: '#70757a', fontSize: '14px', margin: '0 0 16px 0' }}>{form.description}</p>}
            
            <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid #f1f3f4', paddingTop: '12px' }}>
              <Link to={`/forms/${form.id}/fill`} style={{ color: 'darkblue', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Заповнити
              </Link>
              <Link to={`/forms/${form.id}/responses`} style={{ color: 'green', textDecoration: 'none', fontSize: '14px' }}>
                Відповіді
              </Link>
            </div>
          </div>
        ))}
        
        {(!data?.forms || data.forms.length === 0) && (
          <div style={{ textAlign: 'center', color: 'red', marginTop: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📝</div>
            <p>У вас ще немає створених форм.</p>
            <p style={{ fontSize: '14px' }}>Натисніть кнопку вище, щоб почати.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:id/fill" element={<FormFill />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Routes>
    </div>
  );
}

export default App;