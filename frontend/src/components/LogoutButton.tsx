import { signOut } from 'aws-amplify/auth';
import './LogoutButton.css';

interface LogoutButtonProps {
  onLogoutSuccess: () => void;
}

export const LogoutButton = ({ onLogoutSuccess }: LogoutButtonProps) => {
  const handleLogout = async () => {
    try {
      await signOut();
      onLogoutSuccess();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn-logout">
      ログアウト
    </button>
  );
};
