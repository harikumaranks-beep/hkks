const Storage = {
    key: 'expenscee_data',

    // Get all transactions
    getAll: () => {
        const data = localStorage.getItem(Storage.key);
        return data ? JSON.parse(data) : [];
    },

    // Save transaction
    save: (transaction) => {
        const transactions = Storage.getAll();
        transactions.push(transaction);
        localStorage.setItem(Storage.key, JSON.stringify(transactions));
    },

    // Delete transaction
    delete: (id) => {
        let transactions = Storage.getAll();
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem(Storage.key, JSON.stringify(transactions));
    },

    // Reset all data
    crmReset: () => {
        localStorage.removeItem(Storage.key);
        localStorage.setItem('expenscee_cleared', 'true');
    },

    // Get totals
    getTotals: () => {
        const transactions = Storage.getAll();
        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            if (t.type === 'income') income += parseFloat(t.amount);
            else expense += parseFloat(t.amount);
        });

        return { income, expense, balance: income - expense };
    },

    // Seed Example Data
    seedData: () => {
        // Check if user has explicitly cleared data
        if (localStorage.getItem('expenscee_cleared') === 'true') {
            return false;
        }

        const data = [
            { id: '1', type: 'income', category: 'Salary', amount: '50000', date: '2023-10-01', note: 'Monthly Salary' },
            { id: '2', type: 'expense', category: 'Rent', amount: '15000', date: '2023-10-02', note: 'House Rent' },
            { id: '3', type: 'expense', category: 'Groceries', amount: '2500', date: '2023-10-05', note: 'Supermarket' },
            { id: '4', type: 'expense', category: 'Petrol', amount: '3000', date: '2023-10-06', note: 'Car Fuel' },
            { id: '5', type: 'income', category: 'Freelance', amount: '12000', date: '2023-10-10', note: 'Website Project' },
            { id: '6', type: 'expense', category: 'Entertainment', amount: '1500', date: '2023-10-12', note: 'Movie Night' },
            { id: '7', type: 'expense', category: 'Miscellaneous', amount: '800', date: '2023-10-15', note: 'Repairs' },
            { id: '8', type: 'expense', category: 'Household', amount: '4000', date: '2023-10-20', note: 'New Furniture' }
        ];

        if (Storage.getAll().length === 0) {
            localStorage.setItem(Storage.key, JSON.stringify(data));
            console.log('Example data seeded');
            return true;
        }
        return false;
    }
};
