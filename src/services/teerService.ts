
import { TeerResult, PredictionResult, GutiNumber, TodayPredictionCardData } from "@/types/teer";

export function formatLocalDate(date: Date): string {
  let y = date.getFullYear();
  let m = String(date.getMonth() + 1).padStart(2, '0');
  let d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Fetch Teer results from the API
export const fetchTeerResults = async (): Promise<TeerResult[]> => {
  try {
    const data = await fetchWithTimeout(
      "https://script.google.com/macros/s/AKfycbyUaUWwIs-18s6X330mT1z4eehTqDrs_rvnkn4JTJLUcHvtd1G5yNSBERVVsDyc4sbRpg/exec"
    );
    return data.slice(0, 20).map((result: any) => ({
      ...result,
      first_round: result.first_round || 'XX',
      second_round: result.second_round || 'XX'
    }));
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};

// Process the raw results into prediction results with correctness check and locking logic
export const getPredictionResults = (results: TeerResult[], predictionUnlocked = true): PredictionResult[] => {
  const predictionResults: PredictionResult[] = [];
  const today = formatLocalDate(new Date());
  
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    let firstRound = result.first_round;
    let secondRound = result.second_round;
    let prediction = 'XXX';
    let isCorrect: boolean | null = null;
    
    if (i < results.length - 1) {
      let prev = results[i + 1];
      let f1 = parseInt(prev.first_round[1]) || 0;
      let s1 = parseInt(prev.second_round[1]) || 0;
      let gg1 = (f1 + s1) % 10;
      
      let digit1 = parseInt(prev.first_round[0]) || 0;
      let digit2 = parseInt(prev.first_round[1]) || 0;
      let gg2 = (digit1 + digit2) % 10;
      
      let calculatedPrediction = `H=${gg2}, ${(gg2 + 1) % 10} / E=${gg1}, ${(gg1 + 1) % 10}`;

      if (result.date === today && !predictionUnlocked) {
        prediction = "🔒 Locked";
        isCorrect = null;
      } else {
        prediction = calculatedPrediction;

        if (firstRound.toLowerCase() === "xx" || secondRound.toLowerCase() === "xx") {
          isCorrect = null;
        } else {
          let frDigit0 = parseInt(firstRound[0]);
          let frDigit1 = parseInt(firstRound[1]);
          let srDigit0 = parseInt(secondRound[0]);
          let srDigit1 = parseInt(secondRound[1]);

          let isHCorrect =
            gg2 === frDigit0 ||
            (gg2 + 1) % 10 === frDigit0 ||
            gg2 === srDigit0 ||
            (gg2 + 1) % 10 === srDigit0;

          let isECorrect =
            gg1 === frDigit1 ||
            (gg1 + 1) % 10 === frDigit1 ||
            gg1 === srDigit1 ||
            (gg1 + 1) % 10 === srDigit1;

          if (isHCorrect || isECorrect) {
            isCorrect = true;
          } else {
            isCorrect = false;
          }
        }
      }
    }

    predictionResults.push({
      date: result.date,
      first_round: firstRound,
      second_round: secondRound,
      prediction,
      isCorrect
    });
  }
  
  return predictionResults;
};

// Calculate today's prediction card data using history & official macro APIs
export const calculateTodayPrediction = async (): Promise<TodayPredictionCardData | null> => {
  const historyData = await fetchWithTimeout(
    "https://script.google.com/macros/s/AKfycbyUaUWwIs-18s6X330mT1z4eehTqDrs_rvnkn4JTJLUcHvtd1G5yNSBERVVsDyc4sbRpg/exec"
  );

  // Also query official macro endpoint as per script
  try {
    await fetchWithTimeout(
      "https://script.google.com/macros/s/AKfycbyFw_7IlPEOD7Nj5eEvuuTG_j1CpdgEsRi3yThgFfLbuWyDrMIjz-zSf9QuLbeAHE7FZQ/exec"
    );
  } catch (err) {
    console.warn("Official endpoint fetch error:", err);
  }

  if (!historyData || historyData.length < 2) {
    return null;
  }

  let prev = historyData[1];
  let f1 = parseInt(prev.first_round[1]) || 0;
  let s1 = parseInt(prev.second_round[1]) || 0;
  let gg1 = (f1 + s1) % 10;

  let digit1 = parseInt(prev.first_round[0]) || 0;
  let digit2 = parseInt(prev.first_round[1]) || 0;
  let gg2 = (digit1 + digit2) % 10;

  return {
    basedOnDate: prev.date,
    h1: gg2,
    h2: (gg2 + 1) % 10,
    e1: gg1,
    e2: (gg1 + 1) % 10
  };
};

// Get 4 Guti numbers based on prediction
export const getGutiNumbers = (predictionResult: PredictionResult): GutiNumber => {
  const predictionStr = predictionResult.prediction;
  const hMatch = predictionStr.match(/H=(\d+), (\d+)/);
  const eMatch = predictionStr.match(/E=(\d+), (\d+)/);
  
  if (!hMatch || !eMatch) {
    return {
      date: predictionResult.date,
      numbers: ['--', '--', '--', '--']
    };
  }
  
  const h1 = hMatch[1];
  const h2 = hMatch[2];
  const e1 = eMatch[1];
  const e2 = eMatch[2];
  
  const numbers = [
    h1 + e1,
    h1 + e2,
    h2 + e1,
    h2 + e2
  ];
  
  return {
    date: predictionResult.date,
    numbers
  };
};

