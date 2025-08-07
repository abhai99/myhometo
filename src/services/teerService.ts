
import { TeerResult, PredictionResult, GutiNumber } from "@/types/teer";

// Fetch Teer results from the API
export const fetchTeerResults = async (): Promise<TeerResult[]> => {
  try {
    // Using CORS proxy to bypass restrictions
    const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgRCC1AEEP-Jlz_tIwxD0qunNAhAhcWBi-neZ4z2xGI7eAcVno-ghOztb7YsuB38Wy8_iLuRgAB_DMeY8JwUxCTiGWu4yZG0vn_D8b_MYilf5bxwLy0D9qvEcJIOsEIcpBBPRmOfzjV8cvsFWfDVricvnqiggqe1Vw-CXhH97r-wUdDjeCIET2OuKfq_UF4UcnjuNfmKDD3zzs6cDQ83eKNa4GppMdsaSyuE6cjBxZzWy-rEGyr46-QzZoQgpQIr5-M_r-dHAfJV1luoKPjfni2oiLq5B5DRM5jWrqN&lib=M_fLkZuQPQPKvZER-3aiTiGlh2RNTi2UH');
    const data = await response.json();
    return data.slice(0, 20).map((result: any) => ({
      ...result,
      // Ensure consistent data structure
      first_round: result.first_round || 'XX',
      second_round: result.second_round || 'XX'
    }));
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};

// Process the raw results into prediction results with correctness check
export const getPredictionResults = (results: TeerResult[]): PredictionResult[] => {
  const predictionResults: PredictionResult[] = [];
  
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    let firstRound = result.first_round;
    let secondRound = result.second_round;
    let prediction = 'XXX';
    let isCorrect = null;
    
    if (i < results.length - 1) {
      let prevResult = results[i + 1];
      let f1 = parseInt(prevResult.first_round[1]) || 0;
      let s1 = parseInt(prevResult.second_round[1]) || 0;
      let gg1 = (f1 + s1) % 10;
      
      let digit1 = parseInt(prevResult.first_round[0]) || 1;
      let digit2 = parseInt(prevResult.first_round[1]) || 1;
      let gg2 = (digit1 + digit2) % 10;
      
      prediction = `H=${gg2}, ${(gg2 + 1) % 10} / E=${gg1}, ${(gg1 + 1) % 10}`;
      
      if (!(isNaN(parseInt(firstRound)) || isNaN(parseInt(secondRound)))) {
        let isHCorrect = (gg2 == parseInt(firstRound[0]) || (gg2 + 1) % 10 == parseInt(firstRound[0]) || 
                         gg2 == parseInt(secondRound[0]) || (gg2 + 1) % 10 == parseInt(secondRound[0]));
        let isECorrect = (gg1 == parseInt(firstRound[1]) || (gg1 + 1) % 10 == parseInt(firstRound[1]) || 
                         gg1 == parseInt(secondRound[1]) || (gg1 + 1) % 10 == parseInt(secondRound[1]));
        
        isCorrect = isHCorrect || isECorrect;
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

// Get 4 Guti numbers based on prediction
export const getGutiNumbers = (predictionResult: PredictionResult): GutiNumber => {
  // Extract H and E values from prediction
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
