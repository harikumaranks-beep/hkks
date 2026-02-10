document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts first
    Charts.init();

    // Seed data if empty
    if (Storage.seedData()) {
        Charts.updateCharts();
    }

    // Initialize UI
    UI.init();

    console.log('Expense Tracker Application Initialized');
});
