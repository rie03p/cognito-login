import './Dashboard.css';

interface DashboardProps {
  userEmail?: string;
}

export const Dashboard = ({ userEmail }: DashboardProps) => {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>ダッシュボード</h1>
        <div className="welcome-message">
          <p>ようこそ!</p>
          {userEmail && <p className="user-email">{userEmail}</p>}
        </div>
        <div className="dashboard-info">
          <p>ログインに成功しました。</p>
        </div>
      </div>
    </div>
  );
};
