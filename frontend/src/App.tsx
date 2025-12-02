import { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { LoginForm } from './components/LoginForm';
import { SignUpForm } from './components/SignUpForm';
import { LogoutButton } from './components/LogoutButton';
import { Dashboard } from './components/Dashboard';
import type { ResourcesConfig } from 'aws-amplify';
import './App.css';

const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
      loginWith: {
        email: true,
        oauth: {
          domain: import.meta.env.VITE_APP_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:5173/callback'],
          redirectSignOut: ['http://localhost:5173/'],
          responseType: 'code',
        },
      },
    },
  },
};

Amplify.configure(amplifyConfig);

type ViewMode = 'login' | 'signup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('login');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      setIsAuthenticated(true);
      setUserEmail(user.signInDetails?.loginId || session.tokens?.idToken?.payload.email as string);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkAuthStatus();
  };

  const handleSignUpSuccess = () => {
    setViewMode('login');
  };

  const handleLogoutSuccess = () => {
    setIsAuthenticated(false);
    setUserEmail(undefined);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="header">
            <LogoutButton onLogoutSuccess={handleLogoutSuccess} />
          </div>
          <Dashboard userEmail={userEmail} />
        </>
      ) : viewMode === 'login' ? (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignUp={() => setViewMode('signup')}
        />
      ) : (
        <SignUpForm
          onSignUpSuccess={handleSignUpSuccess}
          onBackToLogin={() => setViewMode('login')}
        />
      )}
    </>
  );
}

export default App;
