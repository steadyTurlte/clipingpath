import { useEffect } from 'react';
import { useRouter } from 'next/router';

const FormFieldsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main get-quote admin page
    router.replace('/admin/get-quote');
  }, [router]);

  return null;
};

export default FormFieldsRedirect;
