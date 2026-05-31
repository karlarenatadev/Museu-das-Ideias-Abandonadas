/**
 * Context API para Museu das Ideias Abandonadas
 * Gerencia estado global da aplicação
 */

import { createContext, useState, useCallback } from 'react';

export const MuseumContext = createContext();

function MuseumProvider({ children }) {
  // Estado de navegação
  const [activeModal, setActiveModal] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Estado de análise
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  // Estado de newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFeedback, setNewsletterFeedback] = useState(null);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Estado de filtros
  const [activeFilter, setActiveFilter] = useState('Todas');
  const [selectedMood, setSelectedMood] = useState(4);

  // Funções de navegação
  const handleNavigate = useCallback((modalId) => {
    if (modalId === 'analyze') {
      setActiveModal(null);
      setIsFormModalOpen(false);
    } else {
      setActiveModal(modalId);
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setIsFormModalOpen(false);
  }, []);

  const openFormModal = useCallback(() => {
    setIsFormModalOpen(true);
  }, []);

  // Funções de análise
  const clearAnalysisResult = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError(null);
  }, []);

  // Funções de newsletter
  const clearNewsletterFeedback = useCallback(() => {
    setNewsletterFeedback(null);
  }, []);

  const value = {
    // Navegação
    activeModal,
    setActiveModal,
    isFormModalOpen,
    setIsFormModalOpen,
    handleNavigate,
    closeModal,
    openFormModal,

    // Análise
    analysisResult,
    setAnalysisResult,
    analysisLoading,
    setAnalysisLoading,
    analysisError,
    setAnalysisError,
    clearAnalysisResult,

    // Newsletter
    newsletterEmail,
    setNewsletterEmail,
    newsletterFeedback,
    setNewsletterFeedback,
    newsletterLoading,
    setNewsletterLoading,
    clearNewsletterFeedback,

    // Filtros
    activeFilter,
    setActiveFilter,
    selectedMood,
    setSelectedMood,
  };

  return (
    <MuseumContext.Provider value={value}>
      {children}
    </MuseumContext.Provider>
  );
}

export { MuseumProvider };
