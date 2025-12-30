import { GoogleGenerativeAI } from '@google/genai';
import { AIAnalysisReport } from '../types';

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string = '';

  setApiKey(key: string) {
    this.apiKey = key;
    this.genAI = new GoogleGenerativeAI(key);
  }

  async analyzePair(pair: string): Promise<AIAnalysisReport> {
    // In a real app, we'd fetch actual price data/indicators here to feed the AI
    // For this task, we focus on the infrastructure and integration.
    
    // If no AI is configured, return a mock or throw? 
    // For testing and initial integration, we'll use a simplified flow.
    
    if (!this.genAI && !this.apiKey) {
        // Return mock data if not configured to allow testing/dev
        return this.getMockReport(pair);
    }

    try {
        const model = this.genAI!.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `分析加密貨幣交易對 ${pair} 的目前行情。
        請以 JSON 格式回應，包含以下欄位：
        - summary: 簡短的市場總結
        - technicalIndicators: { trend: '看多' | '看空' | '中性', support: 支撐位, resistance: 壓力位 }
        - riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
        
        請只回傳 JSON 字串。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Basic JSON extraction from markdown if needed
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonData = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

        return {
            ...jsonData,
            timestamp: Date.now()
        };
    } catch (error) {
        console.error('AI Analysis failed:', error);
        return this.getMockReport(pair);
    }
  }

  private getMockReport(pair: string): AIAnalysisReport {
    return {
      summary: `[模擬報告] ${pair} 目前表現穩定，建議觀察 1 小時線 K 值。`,
      technicalIndicators: {
        trend: '中性',
        support: 0,
        resistance: 0
      },
      riskLevel: 'LOW',
      timestamp: Date.now()
    };
  }
}

export const aiService = new AIService();
