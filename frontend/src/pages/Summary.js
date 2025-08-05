// frontend/src/pages/Summary.js
import React from 'react';

export default function Summary() {
  // Use REACT_APP_METABASE_EMBED_URL defined in .env
  const embedUrl = process.env.REACT_APP_REDASH_EMBED_URL || '';

  return (
    <div className="w-full h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Expense Summary</h2>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title="Expense Summary Dashboard"
          frameBorder="0"
          className="w-full"
          style={{ minHeight: '600px' }}
          allowTransparency
        />
      ) : (
        <p className="text-red-600 font-medium">
          Please configure your Metabase embed URL in <code>.env</code> to display the summary dashboard.
        </p>
      )}
    </div>
  );
}
