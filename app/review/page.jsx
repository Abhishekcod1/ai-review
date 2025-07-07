'use client';
import { useState } from 'react';

export default function ReviewPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runReview = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/review', { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={runReview}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        Run Review
      </button>
      {loading && <div>Processing...</div>}
      {result && (
        <div className="space-y-2">
          <div>{result.processed} images processed.</div>
          <a href={result.csv} className="text-blue-500 underline">Download CSV</a>
        </div>
      )}
    </div>
  );
}
