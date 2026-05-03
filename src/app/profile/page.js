'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EditProfile from '@/components/EditProfile';

export default function ProfilePage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [router]);

    if (!authorized) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
                Loading...
            </div>
        );
    }

    return <EditProfile />;
}
