const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('search')?.toLowerCase();

if (searchTerm) {
    let matchCount = 0;
    document.querySelectorAll('.col-4').forEach(product => {
        const productName = product.querySelector('h4').innerText.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = "block";
            matchCount++;
        } else {
            product.style.display = "none";
        }
    });

    // If nothing matched, show a message
    if (matchCount === 0) {
        document.querySelector('.title').innerText = "No results found for: " + searchTerm;
    } else {
        document.querySelector('.title').innerText = "Search Results for: " + searchTerm;
    }
}