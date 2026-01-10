'use client';

import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { store, persistor } from '@/store/store';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ReactNode } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}
