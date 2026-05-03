'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskDashboard from '@/components/TaskDashboard';
import StudentDashboard from '@/components/StudentDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setAuthorized(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) setUserRole(user.role);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return userRole === 'Student' ? <StudentDashboard /> : <TaskDashboard />;
}
