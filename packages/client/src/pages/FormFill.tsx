import React from 'react';
import { useFormFill } from './hooks/useFormFill';

const inputBaseStyle: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'black',
  WebkitBoxShadow: '0 0 0px 1000px white inset',
  outline: 'none',
  border: 'none',
  borderBottom: '1px solid gray',
};

export const FormFill = () => {
  const { form, isLoading, error, isSubmitting, handleInputChange, handleSubmit } = useFormFill();

  if (isLoading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Завантаження форми...</div>;
  if (error || !form) return <div style={{ textAlign: "center", color: "red", marginTop: "50px" }}>Форму не знайдено</div>;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "640px", margin: "0 auto", fontFamily: "Roboto, Arial" }}>
      <form onSubmit={handleSubmit}>
        {/* Шапка форми */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", borderTop: "10px solid #673ab7", padding: "24px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <h1 style={{ fontSize: "32px", margin: "0 0 8px 0", color: 'black' }}>{form.title}</h1>
          <p style={{ color: "#202124" }}>{form.description}</p>
        </div>

        {/* Питання */}
        {form.questions.map((q) => (
          <div key={q.id} style={{ backgroundColor: "white", borderRadius: "8px", padding: "24px", marginBottom: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
            <p style={{ fontWeight: "500", marginBottom: "16px", color: 'black' }}>{q.title}</p>

            {q.type === "TEXT" && (
              <input
                type="text"
                placeholder="Ваша відповідь"
                style={{ ...inputBaseStyle, width: "100%", padding: "8px 0" }}
                onChange={(e) => handleInputChange(q.id, e.target.value, false)}
              />
            )}

            {(q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX") &&
              q.options?.map((opt) => (
                <div key={opt} style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type={q.type === "CHECKBOX" ? "checkbox" : "radio"}
                    name={q.id}
                    onChange={() => handleInputChange(q.id, opt, q.type === "CHECKBOX")}
                  />
                  <span style={{ color: 'black' }}>{opt}</span>
                </div>
              ))}

            {q.type === "DATE" && (
              <input
                type="date"
                style={{ ...inputBaseStyle, padding: "8px" }}
                onChange={(e) => handleInputChange(q.id, e.target.value, false)}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#673ab7",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: "500",
            fontSize: "16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
          }}
        >
          {isSubmitting ? "Надсилаємо..." : "Надіслати"}
        </button>
      </form>
    </div>
  );
};