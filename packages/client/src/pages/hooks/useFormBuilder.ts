import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFormMutation, type QuestionType } from '../../shared/api/generated';

export interface Question {
  title: string;
  type: QuestionType;
  options: string[];
}

export const useFormBuilder = () => {
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

  return {
    title, setTitle,
    description, setDescription,
    questions, addQuestion, updateQuestion, addOption,
    handleSave, isLoading
  };
};