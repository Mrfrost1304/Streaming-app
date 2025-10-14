import React from 'react';
import { Monitor } from 'lucide-react';

const Header = () => {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Monitor className="w-12 h-12 text-purple-400" />
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Live Stream Studio
        </h1>
      </div>
      <p className="text-gray-300 text-lg">Professional streaming with real-time overlay management</p>
    </header>
  );
};

export default Header;