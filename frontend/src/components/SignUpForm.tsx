import { useState } from 'react';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import './SignUpForm.css';

interface SignUpFormProps {
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}

export const SignUpForm = ({ onSignUpSuccess, onBackToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });
      setIsVerifying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'サインアップに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });
      onSignUpSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '確認に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <h2>メール確認</h2>
          <p className="info-text">
            {email} に確認コードを送信しました。
          </p>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label htmlFor="verificationCode">確認コード</label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                disabled={loading}
                placeholder="6桁のコードを入力"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '確認中...' : '確認'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>アカウント作成</h2>
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
              autoComplete="new-password"
              minLength={8}
            />
            <small className="helper-text">
              8文字以上、大小英字・数字・記号を含む
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">パスワード(確認)</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '作成中...' : 'アカウント作成'}
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="btn-secondary"
            disabled={loading}
          >
            ログインに戻る
          </button>
        </form>
      </div>
    </div>
  );
};
