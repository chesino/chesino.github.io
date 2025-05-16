document.addEventListener('DOMContentLoaded', () => {

    // --- Expanded and Varied Sample Data (Giữ nguyên) ---
    const jsonData = [
        { "datetime": "13:10:29 17/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Nguyễn Hồng Nhi", "cashier": "Chủ tiệm", "items": ["Nhuộm tóc dài (1)"], "payment": "Tiền mặt", "discount": null, "total": 800000 },
        { "datetime": "14:36:18 17/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "c.Thư", "cashier": "Chủ tiệm", "items": ["Cắt Nhuộm tóc dài (1)", "Uốn phồng chân + làm phồng đỉnh (1)"], "payment": "Tiền mặt", "discount": null, "total": 1300000 },
        { "datetime": "21:58:06 17/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Khách lẻ", "cashier": "Chủ tiệm", "items": ["Cắt Nhuộm tóc dài (1)", "Uốn phồng chân + Xả uốn phồng chân (1)", "Phục hồi Keratin (1)"], "payment": "Tiền mặt", "discount": "-100.000đ", "total": 2000000 },
        { "datetime": "09:05:11 18/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Khách lẻ", "cashier": "Nhân viên A", "items": ["Cắt tóc nữ (1)", "Gội đầu (1)"], "payment": "Chuyển khoản", "discount": null, "total": 250000 },
        { "datetime": "10:15:30 18/12/2024", "branch": "Mai Tây Chi Nhánh 2", "customer": "Anh Long", "cashier": "Nhân viên B", "items": ["Cắt tóc nam (1)", "Gội đầu (1)", "Vuốt sáp (1)"], "payment": "Tiền mặt", "discount": null, "total": 200000 },
        { "datetime": "11:40:00 18/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Chị Hương", "cashier": "Chủ tiệm", "items": ["Nhuộm highlight (1)", "Phục hồi tóc (1)"], "payment": "Thẻ", "discount": "-50.000đ", "total": 1500000 },
        { "datetime": "13:00:00 18/12/2024", "branch": "Mai Tây Chi Nhánh 2", "customer": "Khách lẻ", "cashier": "Nhân viên A", "items": ["Uốn lạnh (1)", "Cắt tóc nữ (1)"], "payment": "Tiền mặt", "discount": null, "total": 900000 },
        { "datetime": "14:10:20 19/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Nguyễn Hồng Nhi", "cashier": "Nhân viên B", "items": ["Gội đầu (1)", "Sấy tạo kiểu (1)"], "payment": "Tiền mặt", "discount": null, "total": 150000 },
        { "datetime": "15:55:00 19/12/2024", "branch": "Mai Tây Chi Nhánh 2", "customer": "c.Thư", "cashier": "Chủ tiệm", "items": ["Cắt tỉa (1)", "Gội đầu (1)"], "payment": "Chuyển khoản", "discount": null, "total": 250000 },
        { "datetime": "17:30:00 19/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Khách lẻ", "cashier": "Nhân viên A", "items": ["Nhuộm tóc ngắn (1)", "Cắt tóc nữ (1)"], "payment": "Tiền mặt", "discount": null, "total": 700000 },
        { "datetime": "18:45:00 19/12/2024", "branch": "Mai Tây Chi Nhánh 2", "customer": "Anh Long", "cashier": "Nhân viên B", "items": ["Cắt tóc nam (1)"], "payment": "Thẻ", "discount": null, "total": 150000 },
         { "datetime": "10:00:00 20/12/2024", "branch": "Mai Tây Chi Nhánh 1", "customer": "Chị Hương", "cashier": "Chủ tiệm", "items": ["Phục hồi Keratin (2)"], "payment": "Tiền mặt", "discount": "-80.000đ", "total": 1800000 },
        { "datetime": "11:30:00 20/12/2024", "branch": "Mai Tây Chi Nhánh 2", "customer": "Khách lẻ", "cashier": "Nhân viên A", "items": ["Gội đầu (1)", "Massage đầu (1)"], "payment": "Tiền mặt", "discount": null, "total": 200000 }
    ];


    // --- Helper Functions (Giữ nguyên hoặc cập nhật nếu cần) ---

    function formatCurrency(number) {
        if (number === null || number === undefined) {
            return '0đ';
        }
         if (typeof number === 'string' && number.includes('đ')) {
             const cleanNumberString = number.replace(/[^0-9-]/g, '').replace('.', '');
             const num = parseInt(cleanNumberString);
             if (!isNaN(num)) {
                  return num.toLocaleString('vi-VN') + 'đ';
             }
            return number;
         }
        return number.toLocaleString('vi-VN') + 'đ';
    }

    function parseDiscount(discountString) {
        if (discountString === null || discountString === undefined) {
            return 0;
        }
        if (typeof discountString === 'string') {
             const cleanNumberString = discountString.replace(/[^0-9-]/g, '').replace('.', '');
             const num = parseInt(cleanNumberString);
             return isNaN(num) ? 0 : Math.abs(num);
        }
        return 0;
     }

     function parseDateTime(datetimeString) {
         if (!datetimeString) return null;
         const parts = datetimeString.split(' ');
         if (parts.length !== 2) return null;
         const timePart = parts[0];
         const datePart = parts[1];

         const [day, month, year] = datePart.split('/').map(Number);
         const [hour, minute, second] = timePart.split(':').map(Number);

         // Validate date components before creating Date object
         if (isNaN(day) || isNaN(month) || isNaN(year) || month < 1 || month > 12 || day < 1 || day > 31) {
              console.warn("Invalid date parts:", datePart);
              return null;
         }
          // Month is 0-indexed in JS Date (month - 1)
         const date = new Date(year, month - 1, day, hour || 0, minute || 0, second || 0); // Add default time if missing
         // Check if the created Date object is valid (e.g., accounts for invalid day/month combinations)
         if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
             console.warn("Invalid date created for input:", datetimeString);
             return null;
         }
         return date;
     }

     function formatDate(date) {
         if (!date || isNaN(date.getTime())) return '';
         const day = date.getDate().toString().padStart(2, '0');
         const month = (date.getMonth() + 1).toString().padStart(2, '0');
         const year = date.getFullYear();
         return `${day}/${month}/${year}`;
     }

     function formatYearMonth(date) {
         if (!date || isNaN(date.getTime())) return '';
         const year = date.getFullYear();
         const month = (date.getMonth() + 1).toString().padStart(2, '0');
         return `${year}-${month}`;
     }


    // --- Data Processing Functions (Đã làm cho mạnh mẽ hơn) ---

    function analyzeTransactions(transactions) {
        let totalRevenue = 0;
        let totalDiscountValue = 0;
        const paymentMethods = {};
        const cashiers = {};
        const services = {};
        const revenueByDate = {};

        // Use try...catch to handle potential errors during processing
        try {
            // Ensure transactions is an array
            if (!Array.isArray(transactions)) {
                 console.error("analyzeTransactions received non-array data:", transactions);
                 return { // Return default empty summary object
                     totalRevenue: 0, transactionsCount: 0, avgTransactionValue: 0, totalDiscountValue: 0,
                     paymentMethods: {}, cashiers: {}, serviceTransactionCounts: {}, revenueByDate: {}
                 };
            }

            transactions.forEach((transaction, index) => {
                // Basic check for transaction object validity
                if (!transaction || typeof transaction !== 'object') {
                    console.warn("Skipping invalid transaction entry at index:", index, transaction);
                    return; // Skip this iteration
                }

                // Use default 0 if total is missing or not a number
                const transactionTotal = typeof transaction.total === 'number' ? transaction.total : 0;
                totalRevenue += transactionTotal;

                const discountValue = parseDiscount(transaction.discount);
                totalDiscountValue += discountValue;

                const payment = transaction.payment || 'Không rõ';
                paymentMethods[payment] = (paymentMethods[payment] || 0) + transactionTotal;

                const cashier = transaction.cashier || 'Không rõ';
                cashiers[cashier] = (cashiers[cashier] || 0) + 1;

                // Process items: check if it's a non-empty array of strings
                if (Array.isArray(transaction.items) && transaction.items.length > 0) {
                     transaction.items.forEach((item, itemIndex) => {
                         if (typeof item === 'string' && item.trim() !== '') {
                              const serviceName = item.replace(/\s*\(\d+\)$/, '').trim();
                              if (serviceName) {
                                  if (!services[serviceName]) {
                                      services[serviceName] = new Set();
                                  }
                                  // Use a combination of datetime and total as a unique transaction identifier for the Set
                                 services[serviceName].add(`${transaction.datetime}-${transactionTotal}`);
                             }
                         } else {
                             console.warn(`Skipping invalid item format at index ${itemIndex} in transaction ${index}:`, item);
                         }
                     });
                } else if (transaction.items !== null && transaction.items !== undefined) {
                     console.warn(`'items' property is present but not a non-empty array for transaction ${index}:`, transaction.items);
                }

                // Process date for revenueByDate
                const date = parseDateTime(transaction.datetime);
                if (date && !isNaN(date.getTime())) { // Check if parseDateTime returned a valid Date object
                     const dateKey = formatDate(date);
                     revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + transactionTotal;
                } else {
                     console.warn(`Could not parse or validate date for transaction ${index}:`, transaction.datetime);
                }
            });

        } catch (error) {
            console.error("An unexpected error occurred during transaction analysis:", error);
            // Return a default empty summary object in case of any unexpected error
            return {
                 totalRevenue: 0, transactionsCount: 0, avgTransactionValue: 0, totalDiscountValue: 0,
                 paymentMethods: {}, cashiers: {}, serviceTransactionCounts: {}, revenueByDate: {}
             };
        }


        // --- Post-processing (These steps are generally safe if data structure is consistent) ---

        const serviceTransactionCounts = {};
        for (const serviceName in services) {
             serviceTransactionCounts[serviceName] = services[serviceName].size;
        }

         const sortedDates = Object.keys(revenueByDate).sort((a, b) => {
            const [d1, m1, y1] = a.split('/').map(Number);
            const [d2, m2, y2] = b.split('/').map(Number);
            // Robust date comparison
             const dateA = new Date(y1, m1 - 1, d1);
             const dateB = new Date(y2, m2 - 1, d2);
             if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                  console.warn("Invalid date key found during sorting:", a, b);
                  return 0; // Treat invalid dates as equal for sorting purposes
             }
             return dateA - dateB;
         });
         const sortedRevenueByDate = {};
         sortedDates.forEach(date => {
             sortedRevenueByDate[date] = revenueByDate[date];
         });

        // This return statement is guaranteed to be reached if no error was caught and re-thrown
        // or if the catch block returned
        return {
            totalRevenue,
            transactionsCount: transactions.length, // Use original length if input was array
            avgTransactionValue: transactions.length > 0 ? totalRevenue / transactions.length : 0,
            totalDiscountValue,
            paymentMethods,
            cashiers,
            serviceTransactionCounts,
            revenueByDate: sortedRevenueByDate
        };
    }

    // Populates the detailed transaction table (Giữ nguyên)
    function populateTransactionTable(transactions) {
        const tableBody = document.getElementById('transactionTableBody');
        tableBody.innerHTML = '';

        if (!Array.isArray(transactions) || transactions.length === 0) {
             tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Không tìm thấy giao dịch nào phù hợp với bộ lọc.</td></tr>';
             return;
        }

        const labels = [
            "Thời gian", "Chi nhánh", "Khách hàng", "Nhân viên",
            "Dịch vụ", "Thanh toán", "Chiết khấu", "Tổng tiền"
        ];

        transactions.forEach(transaction => {
            const row = tableBody.insertRow();

            const cellsContent = [
                transaction.datetime || 'N/A',
                transaction.branch || 'N/A',
                transaction.customer || 'Khách lẻ',
                transaction.cashier || 'N/A',
                null,
                transaction.payment || 'Không rõ',
                transaction.discount ? formatCurrency(transaction.discount) : 'Không có',
                formatCurrency(transaction.total)
            ];

             cellsContent.forEach((cellContent, index) => {
                 const cell = row.insertCell(index);
                 cell.setAttribute('data-label', labels[index]);

                 if (index === 4) {
                     const itemsCell = cell;
                     if (Array.isArray(transaction.items) && transaction.items.length > 0) {
                        const ul = document.createElement('ul');
                         transaction.items.forEach(item => {
                             const li = document.createElement('li');
                             li.textContent = item;
                             ul.appendChild(li);
                         });
                         itemsCell.appendChild(ul);
                     } else {
                         itemsCell.textContent = 'Không có dịch vụ';
                     }
                     itemsCell.classList.add('items-list');
                 } else {
                      cell.textContent = cellContent;
                 }
             });
        });
    }

     // --- Chart Rendering Functions (Giữ nguyên các hàm renderChart) ---
     let paymentMethodChartInstance = null;
     let cashierChartInstance = null;
     let serviceTransactionCountChartInstance = null;
     let revenueOverTimeChartInstance = null;

     function renderPaymentMethodChart(paymentData) {
        if (paymentMethodChartInstance) { paymentMethodChartInstance.destroy(); }
        const ctx = document.getElementById('paymentMethodChart').getContext('2d');
        const labels = Object.keys(paymentData);
        const data = Object.values(paymentData);
        paymentMethodChartInstance = new Chart(ctx, { /* ... chart config ... */ type: 'pie', data: { labels, datasets: [{ data, backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(201, 203, 207, 0.6)', 'rgba(255, 159, 64, 0.6)'], borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(201, 203, 207, 1)', 'rgba(255, 159, 64, 1)'], borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', }, tooltip: { callbacks: { label: function(context) { const label = context.label || ''; const value = context.raw; const total = context.dataset.data.reduce((sum, val) => sum + val, 0); const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0; return `${label}: ${formatCurrency(value)} (${percentage}%)`; } } } } } });
    }

    function renderCashierChart(cashierData) {
        if (cashierChartInstance) { cashierChartInstance.destroy(); }
        const ctx = document.getElementById('cashierChart').getContext('2d');
        const labels = Object.keys(cashierData);
        const data = Object.values(cashierData);
        cashierChartInstance = new Chart(ctx, { /* ... chart config ... */ type: 'bar', data: { labels, datasets: [{ label: 'Số lượng giao dịch', data, backgroundColor: 'rgba(153, 102, 255, 0.6)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Số lượng giao dịch' }, ticks: { stepSize: 1 } }, x: { title: { display: true, text: 'Nhân viên' } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { const value = context.raw; return `Giao dịch: ${value}`; } } } } } });
    }

     function renderServiceTransactionCountChart(serviceData) {
         if (serviceTransactionCountChartInstance) { serviceTransactionCountChartInstance.destroy(); }
         const ctx = document.getElementById('serviceTransactionCountChart').getContext('2d');
         const labels = Object.keys(serviceData);
         const data = Object.values(serviceData);
         serviceTransactionCountChartInstance = new Chart(ctx, { /* ... chart config ... */ type: 'bar', data: { labels, datasets: [{ label: 'Giao dịch chứa dịch vụ này', data, backgroundColor: 'rgba(255, 159, 64, 0.6)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Số lượng giao dịch' }, ticks: { stepSize: 1 } }, x: { title: { display: true, text: 'Dịch vụ' } } }, plugins: { legend: { display: true }, tooltip: { callbacks: { label: function(context) { const value = context.raw; return `Giao dịch: ${value}`; } } } } } });
     }

    function renderRevenueOverTimeChart(revenueByDateData) {
         if (revenueOverTimeChartInstance) { revenueOverTimeChartInstance.destroy(); }
         const ctx = document.getElementById('revenueOverTimeChart').getContext('2d');
         const labels = Object.keys(revenueByDateData);
         const data = Object.values(revenueByDateData);
         revenueOverTimeChartInstance = new Chart(ctx, { /* ... chart config ... */ type: 'line', data: { labels, datasets: [{ label: 'Tổng Doanh Thu', data, borderColor: 'rgba(75, 192, 192, 1)', backgroundColor: 'rgba(75, 192, 192, 0.2)', tension: 0.3, fill: true }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, title: { display: true, text: 'Doanh Thu (VND)' }, ticks: { callback: function(value) { return formatCurrency(value).replace('đ', ''); } } }, x: { title: { display: true, text: 'Ngày' } } }, plugins: { legend: { display: true }, tooltip: { callbacks: { label: function(context) { const label = context.dataset.label || ''; const value = context.raw; return `${label}: ${formatCurrency(value)}`; } } } } } });
     }


    // --- Filter Logic (Giữ nguyên populateFilters, toggleDateFilters, filterData) ---
    function populateFilters(data) { /* ... */ }
    function toggleDateFilters(selectedType) { /* ... */ }
    function filterData(data) { /* ... */ }


    // --- Main Rendering Function ---
    function renderDashboard(dataToRender) {
        // Ensure dataToRender is an array before passing to analyzeTransactions
        const transactionsArray = Array.isArray(dataToRender) ? dataToRender : [];

        // Call analyzeTransactions; it's now designed to return a valid object even if errors occur
        const summary = analyzeTransactions(transactionsArray);

        // Access properties on the returned summary object (guaranteed not to be undefined now)
        document.getElementById('totalRevenue').textContent = formatCurrency(summary.totalRevenue);
        document.getElementById('transactionsCount').textContent = summary.transactionsCount;
        document.getElementById('avgTransactionValue').textContent = formatCurrency(summary.avgTransactionValue);
        document.getElementById('totalDiscount').textContent = formatCurrency(summary.totalDiscountValue);

        // Only render charts if the charts section is visible
        const chartsSection = document.querySelector('.charts-section');
         if (!chartsSection.classList.contains('hidden')) {
            renderRevenueOverTimeChart(summary.revenueByDate);
            renderPaymentMethodChart(summary.paymentMethods);
            renderCashierChart(summary.cashiers);
            renderServiceTransactionCountChart(summary.serviceTransactionCounts);
         } else {
             // Destroy existing chart instances if switching to basic view
             if (revenueOverTimeChartInstance) revenueOverTimeChartInstance.destroy();
             if (paymentMethodChartInstance) paymentMethodChartInstance.destroy();
             if (cashierChartInstance) cashierChartInstance.destroy();
             if (serviceTransactionCountChartInstance) serviceTransactionCountChartInstance.destroy();
         }

        // Pass the potentially empty array to populateTransactionTable
        populateTransactionTable(transactionsArray);
    }


    // --- Initial Load & Event Listeners ---

    // Get the chart toggle switch and charts section
    const chartToggle = document.getElementById('chartToggle');
    const chartsSection = document.querySelector('.charts-section');


    // Populate filters based on the full dataset when the page loads
    populateFilters(jsonData);

    // Initial render of the dashboard with all data (charts are initially visible)
    // Make sure jsonData is passed as an array
    renderDashboard(jsonData);

     // Add event listener to the date filter type select
     document.getElementById('dateFilterType').addEventListener('change', (event) => {
         toggleDateFilters(event.target.value);
     });

     // Initially hide date filters based on the default 'all' selection
     toggleDateFilters('all');


    // Add event listener to the Apply Filters button
    document.getElementById('applyFilters').addEventListener('click', () => {
        const filteredData = filterData(jsonData); // filterData returns an array
        renderDashboard(filteredData); // renderDashboard will handle chart visibility
    });

    // Add event listener to the Reset Filters button
    document.getElementById('resetFilters').addEventListener('click', () => {
        // Reset date filters
        document.getElementById('dateFilterType').value = 'all';
        toggleDateFilters('all'); // Hide and clear date inputs

        // Reset other filters
        document.getElementById('filterBranch').value = '';
        document.getElementById('filterCashier').value = '';
        document.getElementById('filterCustomerInput').value = ''; // Text input
        document.getElementById('filterPayment').value = '';
        document.getElementById('filterService').value = '';

        // Reset chart toggle to default (checked - show charts)
        chartToggle.checked = true;
        chartsSection.classList.remove('hidden');


        // Re-render with the original full data
        renderDashboard(jsonData); // Pass the original array
    });

    // Add event listener for the chart toggle switch
    chartToggle.addEventListener('change', () => {
        if (chartToggle.checked) {
            // Switch is ON, show charts
            chartsSection.classList.remove('hidden');
            // Re-render the dashboard to draw the charts (using currently filtered data if any)
            // Get the currently filtered data before rendering
            const currentFilteredData = filterData(jsonData);
            renderDashboard(currentFilteredData); // This call will now render charts
             console.log("Charts shown.");

        } else {
            // Switch is OFF, hide charts
            chartsSection.classList.add('hidden');
            // Destroy chart instances to free memory and clear canvases
            if (revenueOverTimeChartInstance) revenueOverTimeChartInstance.destroy();
            if (paymentMethodChartInstance) paymentMethodChartInstance.destroy();
            if (cashierChartInstance) cashierChartInstance.destroy();
            if (serviceTransactionCountChartInstance) serviceTransactionCountChartChartInstance.destroy(); // Corrected variable name
             console.log("Charts hidden.");
        }
    });

    // Make sure charts are shown by default on initial load
    chartToggle.checked = true; // Ensure the checkbox is checked initially
    chartsSection.classList.remove('hidden'); // Ensure the section is visible
    // Initial renderDashboard(jsonData) already handles drawing charts if not hidden.

});