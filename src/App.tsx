import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import HomePage from '@/pages/HomePage';

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Navbar title="Hoops Hub" logoUrl={null} />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;