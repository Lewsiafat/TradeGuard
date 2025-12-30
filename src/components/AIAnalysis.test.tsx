import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIAnalysis } from './AIAnalysis';
import { aiService } from '../services/aiService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock aiService
vi.mock('../services/aiService', () => ({
  aiService: {
    analyzePair: vi.fn()
  }
}));

describe('AIAnalysis Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the analyze button', () => {
    render(<AIAnalysis pair="BTCUSDT" />);
    expect(screen.getByText(/獲取報告/i)).toBeInTheDocument();
  });

  it('should show loading state and then display the report', async () => {
    const mockReport = {
      summary: '看漲趨勢強勁。',
      technicalIndicators: {
        trend: '看多',
        support: 49000,
        resistance: 52000
      },
      riskLevel: 'LOW',
      timestamp: Date.now()
    };

    (aiService.analyzePair as any).mockResolvedValue(mockReport);

    render(<AIAnalysis pair="BTCUSDT" />);
    
    const button = screen.getByText(/獲取報告/i);
    fireEvent.click(button);

    expect(screen.getByText(/分析中/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/看漲趨勢強勁。/i)).toBeInTheDocument();
      expect(screen.getByText('看多')).toBeInTheDocument();
      expect(screen.getByText('LOW')).toBeInTheDocument();
    });
  });

  it('should handle errors gracefully', async () => {
    (aiService.analyzePair as any).mockRejectedValue(new Error('API Error'));

    render(<AIAnalysis pair="BTCUSDT" />);
    
    fireEvent.click(screen.getByText(/獲取報告/i));

    await waitFor(() => {
      expect(screen.getByText(/分析失敗，請稍後再試。/i)).toBeInTheDocument();
    });
  });
});