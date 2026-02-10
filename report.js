const Report = {
    generatePDF: () => {
        const monthInput = document.getElementById('report-month').value;
        if (!monthInput) {
            alert('Please select a month first!');
            return;
        }

        const [year, month] = monthInput.split('-');
        const transactions = Storage.getAll().filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() == year && d.getMonth() + 1 == month;
        });

        if (transactions.length === 0) {
            alert('No transactions found for this month.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("Monthly Expense Report", 14, 20);

        doc.setFontSize(12);
        doc.setFontSize(12);
        doc.text(`Period: ${month}/${year}`, 14, 30);
        doc.text(`Generated on: ${Utils.formatDate(new Date())}`, 14, 36);

        // Calculate Totals for this month
        let totalInc = 0;
        let totalExp = 0;
        transactions.forEach(t => {
            if (t.type === 'income') totalInc += parseFloat(t.amount);
            else totalExp += parseFloat(t.amount);
        });

        doc.text(`Total Income: ${Utils.formatCurrency(totalInc)}`, 14, 45);
        doc.text(`Total Expense: ${Utils.formatCurrency(totalExp)}`, 14, 51);
        doc.text(`Net Balance: ${Utils.formatCurrency(totalInc - totalExp)}`, 14, 57);

        // Table
        const tableData = transactions.map(t => [
            Utils.formatDate(t.date),
            t.category,
            t.type.toUpperCase(),
            t.note || '-',
            Utils.formatCurrency(t.amount)
        ]);

        doc.autoTable({
            startY: 65,
            head: [['Date', 'Category', 'Type', 'Note', 'Amount']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] },
        });

        doc.save(`report-${monthInput}.pdf`);
    }
};
