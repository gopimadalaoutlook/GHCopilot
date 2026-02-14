// Tests for Bucks2Bar script.js

const {
  debounce,
  formatCurrency,
  readInputs,
  saveData,
  loadData,
  MONTHS,
  STORAGE_KEY
} = require('./script.js');

describe('Bucks2Bar', () => {
  
  describe('debounce()', () => {
    jest.useFakeTimers();
    
    it('should delay function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    it('should cancel previous call when invoked again', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn();
      jest.advanceTimersByTime(150);
      debouncedFn();
      jest.advanceTimersByTime(300);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
    
    it('should flush immediately when flush() is called', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);
      
      debouncedFn();
      debouncedFn.flush();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('formatCurrency()', () => {
    it('should format number as USD currency', () => {
      const result = formatCurrency(100);
      expect(result).toMatch(/\$|100/);
    });

    it('should handle decimal values', () => {
      const result = formatCurrency(99.99);
      expect(result).toBeDefined();
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toBeDefined();
    });
  });

  describe('readInputs()', () => {
    beforeEach(() => {
      // Create mock input elements
      document.body.innerHTML = `
        <input id="income-01" class="income-input" value="1000">
        <input id="expense-01" class="expense-input" value="500">
        <input id="income-02" class="income-input" value="">
        <input id="expense-02" class="expense-input" value="">
        <input id="income-03" class="income-input" value="abc">
        <input id="expense-03" class="expense-input" value="">
      `;
    });

    it('should read income and expense inputs', () => {
      const result = readInputs();
      expect(result.incomes.length).toBe(12);
      expect(result.expenses.length).toBe(12);
    });

    it('should parse numeric values correctly', () => {
      const result = readInputs();
      expect(result.incomes[0]).toBe(1000);
      expect(result.expenses[0]).toBe(500);
    });

    it('should treat empty inputs as 0', () => {
      const result = readInputs();
      expect(result.incomes[1]).toBe(0);
      expect(result.expenses[1]).toBe(0);
    });

    it('should treat non-numeric values as 0', () => {
      const result = readInputs();
      expect(result.incomes[2]).toBe(0);
    });

    it('should mark negative values as invalid', () => {
      const input = document.getElementById('income-01');
      input.value = '-100';
      readInputs();
      expect(input.classList.contains('is-invalid')).toBe(true);
    });

    it('should remove invalid class for valid values', () => {
      const input = document.getElementById('income-01');
      input.classList.add('is-invalid');
      input.value = '100';
      readInputs();
      expect(input.classList.contains('is-invalid')).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should save data to localStorage', () => {
      const incomes = [100, 200, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const expenses = [50, 75, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      
      saveData(incomes, expenses);
      
      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored);
      expect(parsed.incomes).toEqual(incomes);
      expect(parsed.expenses).toEqual(expenses);
      expect(parsed.updated).toBeDefined();
    });

    it('should load data from localStorage', () => {
      const incomes = [100, 200, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const expenses = [50, 75, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      
      saveData(incomes, expenses);
      const loaded = loadData();
      
      expect(loaded).not.toBeNull();
      expect(loaded.incomes).toEqual(incomes);
      expect(loaded.expenses).toEqual(expenses);
    });

    it('should return null if no data is stored', () => {
      const loaded = loadData();
      expect(loaded).toBeNull();
    });

    it('should return null if stored data is invalid', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json');
      const loaded = loadData();
      expect(loaded).toBeNull();
    });
  });

  describe('Constants', () => {
    it('should have 12 months', () => {
      expect(MONTHS.length).toBe(12);
    });

    it('should have valid month abbreviations', () => {
      expect(MONTHS).toEqual(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
    });
  });
});
