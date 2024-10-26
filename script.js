// Function to fetch and read the CSV file
async function fetchCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

// Function to parse CSV data into an array of objects
function parseCSV(data) {
    const lines = data.split('\n').filter(line => line);
    const headers = lines[0].split(',');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');
        headers.forEach((header, index) => {
            obj[header.trim()] = currentLine[index].trim();
        });
        results.push(obj);
    }
    return results;
}

// Function to search for the customer in the data
function searchCustomer(data, query) {
    const lowerCaseQuery = query.toLowerCase();
    return data.filter(item => 
        item.Customer.toLowerCase().includes(lowerCaseQuery) ||
        item.Contact.toLowerCase().includes(lowerCaseQuery)
    );
}

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value;
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = '';

    if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a name or contact number.</p>";
        return;
    }

    // Fetch the CSV data
    const csvData = await fetchCSV('data.csv'); // Adjust the path to your CSV file
    const parsedData = parseCSV(csvData);
    const results = searchCustomer(parsedData, query);

    // Display results
    if (results.length > 0) {
        results.forEach(item => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result';
            resultDiv.innerHTML = `
                <strong>Customer Number:</strong> ${item.CN}<br>
                <strong>Name:</strong> ${item.Customer}<br>
                <strong>Address:</strong> ${item.Address}<br>
                <strong>Contact Number:</strong> ${item.Contact}<br>
                <strong>COD:</strong> ${item.COD}<br>
                <strong>Status:</strong> ${item.Status}<br>
            `;
            resultsDiv.appendChild(resultDiv);
        });
    } else {
        resultsDiv.innerHTML = "<p>No results found. Please try again.</p>";
    }
});