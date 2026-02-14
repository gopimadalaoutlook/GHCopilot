// Bucks2Bar script: debounced inputs → Chart.js updates + localStorage persistence

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const STORAGE_KEY = 'bucks2bar.data';
let chart = null;

function debounce(fn, wait = 300) {
  let timeout = null;
  function wrapper(...args) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn.apply(this, args);
    }, wait);
  }
  wrapper.flush = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      fn();
    }
  };
  return wrapper;
}

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
}

function readInputs() {
  const incomes = [];
  const expenses = [];
  for (let i = 1; i <= 12; i++) {
    const id = String(i).padStart(2, '0');
    const incEl = document.getElementById(`income-${id}`);
    const expEl = document.getElementById(`expense-${id}`);
    let iv = incEl && incEl.value !== '' ? parseFloat(incEl.value) : 0;
    let ev = expEl && expEl.value !== '' ? parseFloat(expEl.value) : 0;
    if (!isFinite(iv)) iv = 0;
    if (!isFinite(ev)) ev = 0;
    // validation: mark invalid if negative
    if (incEl) {
      if (iv < 0) incEl.classList.add('is-invalid'); else incEl.classList.remove('is-invalid');
    }
    if (expEl) {
      if (ev < 0) expEl.classList.add('is-invalid'); else expEl.classList.remove('is-invalid');
    }
    incomes.push(iv);
    expenses.push(ev);
  }
  return { incomes, expenses };
}

function saveData(incomes, expenses) {
  try {
    const payload = { incomes, expenses, updated: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save data', e);
  }
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (obj && Array.isArray(obj.incomes) && Array.isArray(obj.expenses)) return obj;
    return null;
  } catch (e) {
    return null;
  }
}

function initChart(incomes, expenses) {
  const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MONTHS,
      datasets: [
        { label: 'Income', backgroundColor: '#198754', data: incomes },
        { label: 'Expense', backgroundColor: '#dc3545', data: expenses }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.raw || 0;
              return ctx.dataset.label + ': ' + formatCurrency(Number(val));
            }
          }
        },
        legend: { position: 'top' }
      },
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true }
      }
    }
  });
}

function updateChartFromInputs() {
  const { incomes, expenses } = readInputs();
  if (!chart) {
    initChart(incomes, expenses);
  } else {
    chart.data.datasets[0].data = incomes;
    chart.data.datasets[1].data = expenses;
    chart.update();
  }
  saveData(incomes, expenses);
}

function populateInputsFromData(data) {
  if (!data) return;
  const incomes = data.incomes || [];
  const expenses = data.expenses || [];
  for (let i = 1; i <= 12; i++) {
    const id = String(i).padStart(2, '0');
    const incEl = document.getElementById(`income-${id}`);
    const expEl = document.getElementById(`expense-${id}`);
    if (incEl && incomes[i - 1] != null) incEl.value = incomes[i - 1];
    if (expEl && expenses[i - 1] != null) expEl.value = expenses[i - 1];
  }
}

function resetInputs() {
  for (let i = 1; i <= 12; i++) {
    const id = String(i).padStart(2, '0');
    const incEl = document.getElementById(`income-${id}`);
    const expEl = document.getElementById(`expense-${id}`);
    if (incEl) { incEl.value = ''; incEl.classList.remove('is-invalid'); }
    if (expEl) { expEl.value = ''; expEl.classList.remove('is-invalid'); }
  }
  updateChartFromInputs();
  localStorage.removeItem(STORAGE_KEY);
}

document.addEventListener('DOMContentLoaded', () => {
 
  const usernameForm = document.getElementById('username-form');
  const usernameInput = document.getElementById('username-input');
  const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/;

  if (usernameForm) {
    usernameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const isValid = usernameRegex.test(username);
      
     
      const existingMessage = document.getElementById('username-message');
      if (existingMessage) existingMessage.remove();
      
   
      const messageDiv = document.createElement('div');
      messageDiv.id = 'username-message';
      messageDiv.className = isValid ? 'alert alert-success mt-2' : 'alert alert-danger mt-2';
      messageDiv.setAttribute('role', 'alert');
      messageDiv.textContent = isValid 
        ? `✓ Username "${username}" is valid!` 
        : '✗ Username does not meet requirements. Must be at least 5 characters and include 1 uppercase letter, 1 number, and 1 special character.';
      
      usernameForm.parentElement.insertAdjacentElement('afterend', messageDiv);
      
     
      setTimeout(() => messageDiv.remove(), 5000);
    });
  }

  const inputs = document.querySelectorAll('.income-input, .expense-input');
  const debouncedUpdate = debounce(updateChartFromInputs, 300);
  inputs.forEach(input => {
    input.addEventListener('input', debouncedUpdate);
    input.addEventListener('blur', () => debouncedUpdate.flush());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); debouncedUpdate.flush(); } });
  });

  document.getElementById('reset-button').addEventListener('click', () => resetInputs());
  document.getElementById('clear-storage-button').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    // Optionally clear visible inputs
    resetInputs();
  });

  document.getElementById('download-chart-button').addEventListener('click', () => {
    if (!chart) return;
    const canvas = chart.canvas;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `bucks2bar-${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  });

  // Seed fresh random values on every page load (do not persist)
  const defaultsIncome = [];
  const defaultsExpense = [];
  for (let i = 0; i < 12; i++) {
    const inc = Math.round(50 + Math.random() * 950);
    const exp = Math.round(50 + Math.random() * 950);
    defaultsIncome.push(inc);
    defaultsExpense.push(exp);
  }
  for (let i = 1; i <= 12; i++) {
    const id = String(i).padStart(2, '0');
    const incEl = document.getElementById(`income-${id}`);
    const expEl = document.getElementById(`expense-${id}`);
    if (incEl) incEl.value = defaultsIncome[i - 1];
    if (expEl) expEl.value = defaultsExpense[i - 1];
  }
  updateChartFromInputs();
});

// Export functions for testing (Node.js/Jest)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MONTHS,
    STORAGE_KEY,
    debounce,
    formatCurrency,
    readInputs,
    saveData,
    loadData,
    initChart,
    updateChartFromInputs,
    populateInputsFromData,
    resetInputs
  };
}