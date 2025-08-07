
import { GutiNumber } from "@/types/teer";

interface GutiNumbersCardProps {
  gutiNumber: GutiNumber;
}

export default function GutiNumbersCard({ gutiNumber }: GutiNumbersCardProps) {
  return (
    <div className="teer-card">
      <h2 className="teer-subheading">Date: {gutiNumber.date}</h2>
      <div className="my-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3">4 Guti Prediction:</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {gutiNumber.numbers.map((number, index) => (
            <div 
              key={index} 
              className="bg-teer-light border-2 border-teer-blue rounded-lg p-3 md:p-4 flex items-center justify-center"
            >
              <span className="text-xl md:text-2xl font-bold text-teer-blue">{number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
