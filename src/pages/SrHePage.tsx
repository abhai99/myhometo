
import { useEffect, useState } from "react";
import { fetchTeerResults, getPredictionResults } from "@/services/teerService";
import { PredictionResult } from "@/types/teer";
import TeerResultsTable from "@/components/TeerResultsTable";

export default function SrHePage() {
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const teerResults = await fetchTeerResults();
      const processedResults = getPredictionResults(teerResults);
      setResults(processedResults);
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
    if (hour < 13) {
      return "Result will show after 1 PM";
    } else if (hour < 16) {
      return "Second round result will show after 4 PM";
    } else {
      return "Today's results are complete";
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="teer-card">
        <h1 className="teer-heading">SR H/E Prediction</h1>
        <p className="text-center text-gray-600 mb-4">{getResultMessage()}</p>
        
        <TeerResultsTable results={results} isLoading={isLoading} />
      </div>
    </div>
  );
}
