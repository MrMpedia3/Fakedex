import React from 'react';
import TeamAnalyzerComponent from '../components/TeamAnalyzer.jsx';

export default function TeamAnalyzerPage() {
  return (
    <div className="container mx-auto p-4 pt-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 border-b pb-2">
        Análise Estratégica de Time
      </h1>
      <TeamAnalyzerComponent />
    </div>
  );
}