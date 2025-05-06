import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation deve ser usado dentro de um TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }) => {
  const [translations, setTranslations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTranslations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await fetch(`${config.apiUrl}/api/translations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTranslations(data.translations || []);
      } else {
        throw new Error(data.message || 'Erro ao buscar histórico de traduções');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar histórico de traduções:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const translate = async (text, sourceLanguage, targetLanguage, autoDetect) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text,
          source: autoDetect ? 'auto' : sourceLanguage,
          target: targetLanguage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Após uma tradução bem-sucedida, atualize o histórico
        fetchTranslations();
        return { 
          success: true, 
          translated_text: data.translated_text,
          detected_language: data.detected_language
        };
      } else {
        throw new Error(data.message || 'Erro na tradução');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const detectLanguage = async (text) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, detectedLanguage: data.detected_language };
      } else {
        throw new Error(data.message || 'Erro na detecção de idioma');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/translations`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTranslations([]);
      } else {
        throw new Error(data.message || 'Erro ao limpar histórico de traduções');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao limpar histórico de traduções:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeTranslation = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/api/translations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTranslations(translations.filter(t => t.id !== id));
      } else {
        throw new Error(data.message || 'Erro ao remover tradução');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao remover tradução:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TranslationContext.Provider
      value={{
        translations,
        loading,
        error,
        translate,
        detectLanguage,
        clearHistory,
        removeTranslation,
        fetchTranslations
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}; 