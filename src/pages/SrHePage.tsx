import { useEffect, useState, useCallback } from "react";
import { fetchTeerResults, getPredictionResults, calculateTodayPrediction } from "@/services/teerService";
import { PredictionResult, TodayPredictionCardData } from "@/types/teer";
import TeerResultsTable from "@/components/TeerResultsTable";

export default function SrHePage() {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardState, setCardState] = useState<'loading' | 'activated' | 'error'>('loading');
  const [cardData, setCardData] = useState<TodayPredictionCardData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setCardState('loading');
    setErrorMessage(null);

    try {
      const [rawResults, todayData] = await Promise.all([
        fetchTeerResults(),
        calculateTodayPrediction().catch(err => {
          console.warn("Error calculating today prediction:", err);
          return null;
        })
      ]);

      const processedResults = getPredictionResults(rawResults, true);
      setResults(processedResults);

      if (todayData) {
        setCardData(todayData);
        setCardState('activated');
      } else {
        setCardState('error');
        setErrorMessage("Not enough data.");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setCardState('error');
      setErrorMessage("⚠ Unable to fetch prediction data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // Auto refresh history and prediction every 5 minutes (300,000 ms)
    const interval = setInterval(() => {
      loadData();
    }, 300000);

    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shillong Teer AI</h2>

      <div className="bg-white rounded-2xl shadow-lg p-5 max-w-md mx-auto my-5 border border-gray-100">
        {cardState === 'loading' && (
          <div className="py-4">
            <div className="w-7 h-7 border-4 border-gray-200 border-t-[#0984e3] rounded-full animate-spin mx-auto my-2" />
            <p className="text-gray-500 text-sm">Calculating prediction...</p>
          </div>
        )}

        {cardState === 'activated' && cardData && (
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#d4edda] text-[#155724] inline-block mb-2">
              Prediction Activated
            </span>
            <div className="text-sm md:text-base text-gray-700">
              <strong>Based On:</strong> {cardData.basedOnDate}
            </div>
            <div className="h-px bg-gray-200 my-3" />
            <div className="font-bold text-gray-500 text-xs md:text-sm mb-1 uppercase tracking-wide">
              TODAY PREDICTION
            </div>
            <div className="text-lg md:text-xl font-bold my-1 text-gray-800">
              H: {cardData.h1}, {cardData.h2}
            </div>
            <div className="text-lg md:text-xl font-bold my-1 text-gray-800">
              E: {cardData.e1}, {cardData.e2}
            </div>
          </div>
        )}

        {cardState === 'error' && (
          <p className="text-red-500 font-semibold my-2">{errorMessage || "⚠ Error loading prediction."}</p>
        )}
      </div>

      <TeerResultsTable results={results} isLoading={isLoading} />
    </div>
  );
}
