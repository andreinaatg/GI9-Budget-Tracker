class Budget {
    constructor() {
        // Initialize properties with default values
        this.income = 0;
        this.expenses = 0;
        this.totalBudget = 0;
        this.expenseHistory = [];

        // Load budget data from sessionStorage if available
        const savedData = sessionStorage.getItem('budgetData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            this.income = parsedData.income;
            this.expenses = parsedData.expenses;
            this.totalBudget = parsedData.totalBudget;
            this.expenseHistory = parsedData.expenseHistory;
        }
    }

    // Save budget data to sessionStorage
    saveToSessionStorage() {
        const data = {
            income: this.income,
            expenses: this.expenses,
            totalBudget: this.totalBudget,
            expenseHistory: this.expenseHistory
        };
        sessionStorage.setItem('budgetData', JSON.stringify(data));
    }

    // Set the income and update the budget
    setIncome(amount) {
        if (amount <= 0 || isNaN(amount)) {
            alert("Income must be a positive number");
            return;
        }
        this.income = amount;
        this.calculateTotalBudget();
        this.saveToSessionStorage();
    }

    // Add an expense and update the budget
    addExpense(amount, date, category) {
        if (amount <= 0 || isNaN(amount)) {
            alert("Expense must be a positive number");
            return;
        }
        this.expenses += amount;
        this.expenseHistory.push({ date, category, amount });
        this.calculateTotalBudget();
        this.saveToSessionStorage();
    }

    // Clear the expense history
    clearHistory() {
        this.expenseHistory = [];
        this.expenses = 0;
        this.calculateTotalBudget();
        this.saveToSessionStorage();
    }

    // Calculate the total budget
    calculateTotalBudget() {
        this.totalBudget = this.income - this.expenses;
    }

    // Get a summary of the budget
    getBudgetSummary() {
        return {
            income: this.income,
            expenses: this.expenses,
            totalBudget: this.totalBudget
        };
    }

    // Get the expense history
    getExpenseHistory() {
        return this.expenseHistory;
    }
}

// Create an instance of the Budget class
const budgetTracker = new Budget();

// Function to update the DOM with the budget summary
function updateDOM() {
    const summary = budgetTracker.getBudgetSummary();
    document.querySelector('.income-card').textContent = summary.income.toFixed(2);
    document.querySelector('.expenses-card').textContent = summary.expenses.toFixed(2);
    document.querySelector('.balance-card').textContent = summary.totalBudget.toFixed(2);
}

// Function to update the DOM with the expense history
function updateHistoryDOM() {
    const historyList = document.querySelector('.expense-history');
    historyList.innerHTML = ''; // Clear existing history
    budgetTracker.getExpenseHistory().forEach(expense => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>${expense.date}</span> - <span>${expense.category}</span>: <span>$${expense.amount.toFixed(2)}</span>`;
        historyList.appendChild(listItem);
    });
}

// Function to handle setting the income
function handleSetIncome() {
    const incomeInput = document.getElementById('income');
    const amount = parseFloat(incomeInput.value);
    budgetTracker.setIncome(amount);
    updateDOM();
}

// Function to handle adding an expense
function handleAddExpense() {
    const dateInput = document.getElementById('date');
    const expenseInput = document.getElementById('expense');
    const categoryInput = document.getElementById('category');
    const amount = parseFloat(expenseInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (!date) {
        alert("Please select a date");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Expense must be a positive number");
        return;
    }

    if (!category) {
        alert("Please select a category");
        return;
    }

    budgetTracker.addExpense(amount, date, category);
    updateDOM();
    updateHistoryDOM();
}

// Function to handle clearing the expense history
function handleClearHistory() {
    if (confirm("Are you sure you want to clear the expense history?")) {
        budgetTracker.clearHistory();
        updateDOM();
        updateHistoryDOM();
    }
}

// Initialize the DOM with existing budget data
updateDOM();
updateHistoryDOM();

// Add event listeners
document.getElementById('incomeBtn').addEventListener('click', handleSetIncome);
document.getElementById('expenseBtn').addEventListener('click', handleAddExpense);
document.getElementById('clearHistoryButton').addEventListener('click', handleClearHistory);
