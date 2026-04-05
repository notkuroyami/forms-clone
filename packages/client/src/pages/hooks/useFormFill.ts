import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation, type AnswerInput } from '../../shared/api/generated';

export const useFormFill = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useGetFormQuery({ id: id || "" });
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();

  // Стан для відповідей
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const handleInputChange = (
    questionId: string,
    value: string,
    isCheckbox: boolean
  ) => {
    setAnswers((prev) => {
      const currentValues = prev[questionId] || [];
      if (isCheckbox) {
        return {
          ...prev,
          [questionId]: currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value],
        };
      }
      return { ...prev, [questionId]: [value] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedAnswers: AnswerInput[] = Object.entries(answers).map(
      ([qId, values]) => ({
        questionId: qId,
        value: values,
      })
    );

    try {
      await submitResponse({
        formId: id || "",
        answers: formattedAnswers,
      }).unwrap();
      alert("Відповідь успішно надіслана!");
      navigate("/");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Помилка при відправці");
    }
  };

  return {
    form: data?.form,
    isLoading,
    error,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};