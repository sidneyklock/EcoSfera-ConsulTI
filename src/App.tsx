
import { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

// Imports disponíveis
import ChatPage from './pages/ChatPage';
import TestPage from './pages/TestPage';
// Imports que serão temporariamente comentados por não existirem
// import AccountPage from './pages/AccountPage';
// import HomePage from './pages/HomePage';
// import PricingPage from './pages/PricingPage';
// import AuthPage from './pages/AuthPage';
// import SolutionsPage from './pages/SolutionsPage';
// import SolutionDetailPage from './pages/SolutionDetailPage';
// import NewSolutionPage from './pages/NewSolutionPage';
// import EditSolutionPage from './pages/EditSolutionPage';

function App() {
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      setIsUserLoaded(false);
      // Check if there is a session
      if (session) {
        // If there's a session, navigate to the home page
        if (location.pathname === '/auth') {
          navigate('/');
        }
      } else {
        // If there's no session, navigate to the auth page
        if (location.pathname !== '/auth') {
          navigate('/');  // Temporarily navigate to root instead of /auth
        }
      }
      setIsUserLoaded(true);
    };

    loadUser();
  }, [session, navigate, location.pathname]);

  return (
    <Routes>
      {/* Rotas temporariamente comentadas por falta dos componentes */}
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <div>Home Page (Placeholder)</div>
          </Suspense>
        }
      />
      {/* 
      <Route
        path="/pricing"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <PricingPage />
          </Suspense>
        }
      />
      <Route
        path="/account"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <AccountPage />
          </Suspense>
        }
      />
      */}
      <Route
        path="/chat"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <ChatPage />
          </Suspense>
        }
      />
      {/*
      <Route
        path="/auth"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <AuthPage />
          </Suspense>
        }
      />
      <Route
        path="/solutions"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <SolutionsPage />
          </Suspense>
        }
      />
      <Route
        path="/solutions/:id"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <SolutionDetailPage />
          </Suspense>
        }
      />
      <Route
        path="/solutions/new"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <NewSolutionPage />
          </Suspense>
        }
      />
      <Route
        path="/solutions/:id/edit"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <EditSolutionPage />
          </Suspense>
        }
      />
      */}
      <Route
        path="/test"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <TestPage />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
