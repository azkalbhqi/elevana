"use client";

interface AnalysisCardProps {
  title?: string;
  analysis: string | undefined; // Allow analysis to be undefined
  rawData?: string[];
}

export default function AnalysisCard({ title, analysis, rawData }: AnalysisCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl border border-gray-200 p-6 transition hover:shadow-lg">
      {title && (
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
      )}

      {rawData && rawData.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-gray-700">Raw Mood Data</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {rawData.map((mood, idx) => (
              <li key={idx}>{mood}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="font-medium mb-2 text-gray-700">AI Analysis</h3>
        <p className="text-gray-800 whitespace-pre-line">{typeof analysis === 'string' ? analysis : 'No analysis available'}</p>
      </div>
    </div>
  );
}
