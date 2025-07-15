import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { LoadingPopUp } from '../components/LoadingPopUp';

interface UIContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  showFooter: boolean;
  setShowFooter: (show: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
  const [loading, setLoadingState] = useState(false);
  const [showFooter, setShowFooterState] = useState(true);

  const setLoading = useCallback((value: boolean) => {
    setLoadingState(value);
  }, []);

  const setShowFooter = useCallback((value: boolean) => {
    setShowFooterState(value);
  }, []);

  return (
    <UIContext.Provider
      value={{ loading, setLoading, showFooter, setShowFooter }}
    >
      <LoadingPopUp open={loading} />
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return ctx;
};
