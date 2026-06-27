import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import store from './store/index.js';
import App from './App.jsx';
import './assets/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch just because the user switched browser tabs
      refetchOnWindowFocus: false,
      // Retry failed requests once before showing an error
      retry: 1,
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Redux — auth state */}
    <Provider store={store}>
      {/* React Query — server data caching */}
      <QueryClientProvider client={queryClient}>
        {/* React Router — client-side navigation */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);