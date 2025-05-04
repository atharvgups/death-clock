import React from 'react';
import { Auth } from './Auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-vaporwave-darkPurple">
      <h1 className="text-4xl font-display mb-6 text-vaporwave-neonPink">Death Clock</h1>
      <p className="mb-8 text-gray-300 text-lg">Sign in to track your subscriptions and digital afterlife.</p>
      <Auth />
    </div>
  );
} 