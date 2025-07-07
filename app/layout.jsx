import './globals.css';

export const metadata = {
  title: 'AI Design Reviewer',
  description: 'Rate your designs automatically',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
