const Charts = {
    pieInstance: null,
    barInstance: null,

    init: () => {
        Charts.initPieChart();
        Charts.initBarChart();
        Charts.updateCharts();
    },

    initPieChart: () => {
        const ctx = document.getElementById('expense-pie-chart').getContext('2d');
        Charts.pieInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444', '#8B5CF6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#9CA3AF' } }
                }
            }
        });
    },

    initBarChart: () => {
        const ctx = document.getElementById('monthly-bar-chart').getContext('2d');
        Charts.barInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Income', data: [], backgroundColor: '#10B981', borderRadius: 4 },
                    { label: 'Expense', data: [], backgroundColor: '#EF4444', borderRadius: 4 }
                ]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                scales: {
                    x: { ticks: { color: '#9CA3AF' }, grid: { display: false } },
                    y: { ticks: { color: '#9CA3AF' }, grid: { color: '#374151' } }
                },
                plugins: { legend: { labels: { color: '#9CA3AF' } } }
            }
        });
    },

    updateCharts: () => {
        const transactions = Storage.getAll();

        // Process Pie Data (Expenses by Category)
        const categories = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + parseFloat(t.amount);
        });

        Charts.pieInstance.data.labels = Object.keys(categories);
        Charts.pieInstance.data.datasets[0].data = Object.values(categories);
        Charts.pieInstance.update();

        // Process Bar Data (Monthly Income vs Expense)
        const monthlyIncome = new Array(12).fill(0);
        const monthlyExpense = new Array(12).fill(0);

        transactions.forEach(t => {
            const month = new Date(t.date).getMonth();
            if (t.type === 'income') monthlyIncome[month] += parseFloat(t.amount);
            else monthlyExpense[month] += parseFloat(t.amount);
        });

        Charts.barInstance.data.datasets[0].data = monthlyIncome;
        Charts.barInstance.data.datasets[1].data = monthlyExpense;
        Charts.barInstance.update();
    }
};
