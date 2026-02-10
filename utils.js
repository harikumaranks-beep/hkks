const Utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR' // Assuming India based on request context (Petrol/Groceries often grouped this way), but can be generic.
        }).format(amount);
    },

    // Format date as DD/MM/YYYY
    formatDate: (dateString) => {
        const d = new Date(dateString);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    },

    // Generate numeric ID
    generateId: () => {
        return Date.now().toString();
    },

    // Get color for category
    getCategoryColor: (category) => {
        const colors = {
            'Petrol': '#F59E0B',
            'Groceries': '#10B981',
            'Household': '#3B82F6',
            'Miscellaneous': '#9CA3AF',
            'Income': '#4F46E5',
            'Salary': '#4F46E5',
            'default': '#6366F1'
        };
        return colors[category] || colors['default'];
    }
};
