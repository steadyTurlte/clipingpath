import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';

const HomeSponsorsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the centralized sponsors editor in the about section
    router.push('/admin/about/sponsors');
  }, [router]);

  return (
    <AdminLayout>
      <div className="admin-editor__loading">
        <p>Sponsors data has been centralized. Redirecting to About Sponsors editor...</p>
      </div>

      <style jsx>{`
        .admin-editor__loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          font-size: 18px;
          color: #64748b;
          flex-direction: column;
          text-align: center;
          background-color: #f8fafc;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </AdminLayout>
  );
};

export default HomeSponsorsRedirect;
