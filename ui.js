const UI = {
    init: () => {
        UI.renderDashboard();
        UI.renderTable();
        UI.setupEventListeners();
    },

    setupEventListeners: () => {
        // Navigation
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

                item.classList.add('active');
                const target = item.getAttribute('data-tab');
                document.getElementById(`${target}-view`).classList.add('active');

                // Update header title
                document.getElementById('page-title').textContent = item.innerText.trim();
            });
        });

        // Modal
        const modal = document.getElementById('modal-overlay');
        document.getElementById('add-transaction-btn').addEventListener('click', () => modal.classList.remove('hidden'));
        document.getElementById('close-modal-btn').addEventListener('click', () => modal.classList.add('hidden'));

        // Form Submit
        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.querySelector('input[name="type"]:checked').value;
            const category = document.getElementById('t-category').value;
            const date = document.getElementById('t-date').value;
            const amount = document.getElementById('t-amount').value;
            const note = document.getElementById('t-note').value;

            const transaction = {
                id: Utils.generateId(),
                type, category, date, amount, note
            };

            Storage.save(transaction);
            UI.renderDashboard();
            UI.renderTable();
            Charts.updateCharts();
            modal.classList.add('hidden');
            e.target.reset();
        });

        // Dynamic Categories
        const typeRadios = document.querySelectorAll('input[name="type"]');
        typeRadios.forEach(radio => {
            radio.addEventListener('change', UI.populateCategories);
        });
        UI.populateCategories(); // Init

        // Reset Data
        document.getElementById('reset-data-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                Storage.crmReset();
                location.reload();
            }
        });

        // Report
        document.getElementById('download-pdf-btn').addEventListener('click', Report.generatePDF);

        // Filter
        document.getElementById('filter-type').addEventListener('change', UI.renderTable);
        document.getElementById('search-input').addEventListener('input', UI.renderTable);
    },

    populateCategories: () => {
        const type = document.querySelector('input[name="type"]:checked').value;
        const select = document.getElementById('t-category');
        select.innerHTML = '';

        const expenseCats = ['Petrol', 'Groceries', 'Household', 'Miscellaneous', 'Food', 'Entertainment', 'Transport'];
        const incomeCats = ['Salary', 'Freelance', 'Business', 'Gift', 'Other'];

        const list = type === 'expense' ? expenseCats : incomeCats;
        list.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.innerText = cat;
            select.appendChild(option);
        });
    },

    renderDashboard: () => {
        const { income, expense, balance } = Storage.getTotals();
        document.getElementById('total-income-display').innerText = Utils.formatCurrency(income);
        document.getElementById('total-expense-display').innerText = Utils.formatCurrency(expense);
        document.getElementById('balance-display').innerText = Utils.formatCurrency(balance);
    },

    renderTable: () => {
        const tbody = document.querySelector('#transactions-table tbody');
        tbody.innerHTML = '';

        let data = Storage.getAll();

        // Filters
        const filterType = document.getElementById('filter-type').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        if (filterType !== 'all') {
            data = data.filter(t => t.type === filterType);
        }
        if (searchTerm) {
            data = data.filter(t => t.note.toLowerCase().includes(searchTerm) || t.category.toLowerCase().includes(searchTerm));
        }

        // Sort by date desc
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        data.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${Utils.formatDate(t.date)}</td>
                <td><span style="color: ${Utils.getCategoryColor(t.category)}">${t.category}</span></td>
                <td>${t.note}</td>
                <td style="color: ${t.type === 'income' ? 'var(--secondary)' : 'var(--danger)'}">
                    ${t.type === 'income' ? '+' : '-'}${Utils.formatCurrency(t.amount)}
                </td>
                <td>${t.type.toUpperCase()}</td>
                <td>
                    <button class="btn-danger-outline" style="padding: 0.2rem 0.5rem;" onclick="UI.deleteItem('${t.id}')">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    deleteItem: (id) => {
        if (confirm('Delete this transaction?')) {
            Storage.delete(id);
            UI.renderDashboard();
            UI.renderTable();
            Charts.updateCharts();
        }
    }
};

// Make UI global for inline event handlers
window.UI = UI;
