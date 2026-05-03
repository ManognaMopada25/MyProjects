import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, Helvetica, sans-serif;
        }
      `}</style>
      <LoginForm />
    </>
  );
}
