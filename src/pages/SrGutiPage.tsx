
import { useEffect, useState } from "react";
import { fetchTeerResults, getPredictionResults, getGutiNumbers } from "@/services/teerService";
import { PredictionResult, GutiNumber } from "@/types/teer";
import GutiNumbersCard from "@/components/GutiNumbersCard";

export default function SrGutiPage() {
  const [gutiNumber, setGutiNumber] = useState<GutiNumber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const teerResults = await fetchTeerResults();
      const processedResults = getPredictionResults(teerResults);
      
      if (processedResults.length > 0) {
        const latestPrediction = processedResults[0];
        const gutiNumbers = getGutiNumbers(latestPrediction);
        setGutiNumber(gutiNumbers);
      }
      
      setIsLoading(false);
    };
    
    fetchData();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const getCurrentHour = () => {
    return currentTime.getHours();
  };
  
  const getResultMessage = () => {
    const hour = getCurrentHour();
    return "F/R & S/R 4 Guti Number our prediction will update after 1 to 2 pm";
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="teer-card">
        <h1 className="teer-heading">S/R 4 Guti Number</h1>
        <p className="text-center text-gray-600 mb-6">{getResultMessage()}</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teer-blue"></div>
          </div>
        ) : gutiNumber ? (
          <GutiNumbersCard gutiNumber={gutiNumber} />
        ) : (
          <p className="text-center text-gray-500">No predictions available</p>
        )}
      </div>
    </div>
  );
}
