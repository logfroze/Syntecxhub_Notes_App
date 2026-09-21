import React from 'react';
import { AndroidPhoneEmulator } from './components/AndroidPhoneEmulator';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#E2E8F0] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <AndroidPhoneEmulator />
    </div>
  );
}
