/**
 * Hook customizado para acessar o contexto do Museu
 */

import { useContext } from 'react';
import { MuseumContext } from '../context/MuseumContext';

export function useMuseum() {
  const context = useContext(MuseumContext);

  if (!context) {
    throw new Error('useMuseum deve ser usado dentro de MuseumProvider');
  }

  return context;
}
