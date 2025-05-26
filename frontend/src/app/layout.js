import { AuthProvider } from '../app/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Auth App',
  description: 'Authentication application with Next.js and Node.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
