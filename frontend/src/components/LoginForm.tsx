import { useState } from 'react';
import { signIn, signInWithRedirect } from 'aws-amplify/auth';
import './LoginForm.css';
import googleLogo from '../assets/google.svg';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginForm = ({ onLoginSuccess, onSwitchToSignUp }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn({
        username: email,
        password: password,
      });
      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Googleログインに失敗しました');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>ログイン</h2>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="btn-google"
          disabled={loading}
        >
          <img src={googleLogo} alt="Google logo" width={18} height={18} />
          Googleでログイン
        </button>
        <div className="divider">
          <span>または</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="btn-secondary"
            disabled={loading}
          >
            アカウントを作成
          </button>
        </form>
      </div>
    </div>
  );
};
