import { PredictionResult } from "@/types/teer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeerResultsTableProps {
  results: PredictionResult[];
  isLoading: boolean;
}

export default function TeerResultsTable({ results, isLoading }: TeerResultsTableProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teer-blue"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No data available</p>
          <p className="text-sm text-gray-400">Please check your internet connection or try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-0 sm:mx-0">
      <Table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
        <TableHeader className="bg-teer-blue">
          <TableRow>
            <TableHead className="text-white font-semibold text-center p-1 text-sm sm:text-base md:text-lg">Date</TableHead>
            <TableHead className="text-white font-semibold text-center p-1 text-sm sm:text-base md:text-lg">F/R</TableHead>
            <TableHead className="text-white font-semibold text-center p-1 text-sm sm:text-base md:text-lg">S/R</TableHead>
            <TableHead className="text-white font-semibold text-center p-1 text-sm sm:text-base md:text-lg">Prediction</TableHead>
            <TableHead className="text-white font-semibold text-center p-1 text-sm sm:text-base md:text-lg">R/W</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="border border-gray-200 text-center p-1 text-sm sm:text-base md:text-lg">{result.date}</TableCell>
              <TableCell className="border border-gray-200 text-center p-1 text-sm sm:text-base md:text-lg">{result.firstRound}</TableCell>
              <TableCell className="border border-gray-200 text-center p-1 text-sm sm:text-base md:text-lg">{result.secondRound}</TableCell>
              <TableCell className="border border-gray-200 text-center p-1 text-sm sm:text-base md:text-lg">
                {isMobile ? (
                  <span className="whitespace-normal">{result.prediction}</span>
                ) : (
                  <span>{result.prediction}</span>
                )}
              </TableCell>
              <TableCell 
                className={`border border-gray-200 text-center p-1 text-sm sm:text-base md:text-lg ${
                  result.isCorrect === true ? "correct" : 
                  result.isCorrect === false ? "wrong" : "pending"
                }`}
              >
                {result.isCorrect === true ? "✓" : 
                 result.isCorrect === false ? "✗" : "⏳"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
