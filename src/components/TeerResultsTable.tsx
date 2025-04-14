
import { PredictionResult } from "@/types/teer";

interface TeerResultsTableProps {
  results: PredictionResult[];
  isLoading: boolean;
}

export default function TeerResultsTable({ results, isLoading }: TeerResultsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teer-blue"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="teer-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>First Round</th>
            <th>Second Round</th>
            <th>Prediction</th>
            <th>R/W</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.date}</td>
              <td>{result.firstRound}</td>
              <td>{result.secondRound}</td>
              <td>{result.prediction}</td>
              <td className={
                result.isCorrect === true ? "correct" : 
                result.isCorrect === false ? "wrong" : "pending"
              }>
                {result.isCorrect === true ? "✓" : 
                 result.isCorrect === false ? "✗" : "⏳"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
