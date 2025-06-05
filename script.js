// Replace this URL with your published Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbzq7h5ecKaiHXCToXWzsMLWxlYGf5Nl8kRai57nO2GnYw4NQOap_v7kE6pcy-IJTObh9w/exec';

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.error) {
            document.getElementById('error').textContent = 'Error: ' + data.error;
            return;
        }

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('error').textContent = 'No data found.';
            return;
        }

        createTable(data);
    } catch (error) {
        document.getElementById('error').textContent = 'Failed to fetch data: ' + error.message;
    }
}

function createTable(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = ''; // Clear existing table content

    // Create header row
    const headers = Object.keys(data[0]);
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach(rowData => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = rowData[header];
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
}

// Fetch data on page load
// fetchData(); // This will be called from index.html

// Admin login logic (moved from admin.html for better separation)
document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('admin-login-form');
    const addRecordForm = document.getElementById('add-record-form');
    const updateRecordForm = document.getElementById('update-record-form');
    const deleteRecordForm = document.getElementById('delete-record-form');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const loginError = document.getElementById('login-error');
            const adminDashboard = document.getElementById('admin-dashboard');

            if (username === 'Admin' && password === 'Admin') {
                adminLoginForm.classList.add('hidden');
                adminDashboard.classList.remove('hidden');
                loginError.classList.add('hidden');
            } else {
                loginError.classList.remove('hidden');
            }
        });
    }

    // Handle Add Record Form Submission
    if (addRecordForm) {
        addRecordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(addRecordForm);
            // Remove duplicate formData declaration since it's already declared above
            const data = Object.fromEntries(formData.entries());
            console.log('Add Data:', data);
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'add', data: data })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert('Record added successfully!');
                    addRecordForm.reset();
                } else {
                    alert('Error adding record: ' + result.message);
                }
            } catch (error) {
                alert('Failed to add record: ' + error.message);
            }
        });
    }

    // Handle Update Record Form Submission
    if (updateRecordForm) {
        updateRecordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
           
            const formData = new FormData(updateRecordForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Update Data:', data);
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'update', data: data })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert('Record updated successfully!');
                    updateRecordForm.reset();
                } else {
                    alert('Error updating record: ' + result.message);
                }
            } catch (error) {
                alert('Failed to update record: ' + error.message);
            }
        });
    }

    // Handle Delete Record Form Submission
    if (deleteRecordForm) {
        deleteRecordForm.addEventListener('submit', async function(event) {
            event.preventDefault();
      
            const formData = new FormData(deleteRecordForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Delete Data:', data);
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ action: 'delete', data: data })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert('Record deleted successfully!');
                    deleteRecordForm.reset();
                } else {
                    alert('Error deleting record: ' + result.message);
                }
            } catch (error) {
                alert('Failed to delete record: ' + error.message);
            }
        });
    }
});