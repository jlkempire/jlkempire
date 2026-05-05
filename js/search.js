// 1. DATA: This is your "Source of Truth." 
// Add every product you want to be searchable here.
const productDatabase = [
    { title: "Tecno Spark 10 Pro", img: "Pictures/p1.png" },
    { title: "Apple iPhone 17 Pro", img: "Pictures/p2.png" },
    { title: "Apple iPhone 12 Pro Max", img: "Pictures/p3.png" },
    { title: "Apple iPhone 15 Pro Max", img: "Pictures/p4.png" },
    { title: "Apple iPhone 15 Pro", img: "Pictures/p5.png" },
    { title: "Apple iPhone 15 Pro", img: "Pictures/p6.png" },
    { title: "Tecno Spark 20", img: "Pictures/p7.png" },
    { title: "Samsung Galaxy S24 Ultra", img: "Pictures/p8.png" },
    { title: "Infinix Note 40 Pro", img: "Pictures/p9.png" },
    { title: "Apple iPhone 15 Pro", img: "Pictures/p10.png" },
    { title: "Tecno Spark 40", img: "Pictures/p11.png" },
    { title: "Samsung Galaxy A07", img: "Pictures/p12.png" },
    { title: "Xiaomi Redmi 15C", img: "Pictures/p13.png" },
    { title: "Nokia G42 5G", img: "Pictures/p14.png" },
    { title: "Poco C85", img: "Pictures/p15.png" },
    { title: "HP Pavilion 15", img: "Pictures/p16.png" },
    { title: "Dell Latitude 3420", img: "Pictures/p17.png" },
    { title: "HP Elitebook 1040 G9", img: "Pictures/p18.png" },
    { title: "Asus Vivobook 15", img: "Pictures/p19.png" },
    { title: "Samsung Galaxy Book5 Pro", img: "Pictures/p20.png" },
    { title: "PlayStation 5 (PS5)", img: "Pictures/p21.png" },
    { title: "Starlink Standard Kit", img: "Pictures/p22.png" },
    { title: "Harman Kardon Onyx 9", img: "Pictures/p23.png" },
    { title: "MTN Broadband Router", img: "Pictures/p24.png" },
    { title: "Lenovo IdeaPad Slim 3", img: "Pictures/p25.png" }
];

// 2. Function to handle the search redirect + "Not Found" check
function performSearch() {
    const searchInput = document.getElementById('mainSearchInput');
    const queryValue = searchInput.value.trim();
    const queryLow = queryValue.toLowerCase();

    if (queryLow) {
        // Check if the query matches ANY title in our database
        const exists = productDatabase.some(product => 
            product.title.toLowerCase().includes(queryLow)
        );

        if (exists) {
            // Product exists! Go to the results page
            window.location.href = `results.html?search=${encodeURIComponent(queryValue)}`;
        } else {
            // Product doesn't exist! 
            // We stop the redirect and inform the user.
            alert(`Sorry, we don't have "${queryValue}" in our store yet.`);
            
            // Clean up the UI
            document.getElementById('searchSuggestions').style.display = 'none';
        }
    }
}

// 3. Trigger search on clicking the icon
const searchIcon = document.getElementById('searchIconBtn');
if(searchIcon) {
    searchIcon.addEventListener('click', performSearch);
}

const mainInput = document.getElementById('mainSearchInput');
const suggestionsBox = document.getElementById('searchSuggestions');

// 4. Listen for typing to show the Live Dropdown
mainInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    suggestionsBox.innerHTML = ''; 

    if (query.length > 0) {
        // Filter matches from the database array
        const matches = productDatabase.filter(p => 
            p.title.toLowerCase().includes(query)
        );
        
        if (matches.length > 0) {
            matches.slice(0, 10).forEach(product => {
                const div = document.createElement('div');
                div.classList.add('suggestion-item');
                
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedTitle = product.title.replace(regex, '<strong>$1</strong>');

                div.innerHTML = `
                    <img src="${product.img}" alt="${product.title}">
                    <span class="suggestion-text">${highlightedTitle}</span>
                `;

                div.onclick = () => {
                    mainInput.value = product.title;
                    suggestionsBox.style.display = 'none';
                    performSearch(); 
                };

                suggestionsBox.appendChild(div);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    } else {
        suggestionsBox.style.display = 'none';
    }
});

// 5. Trigger search on pressing "Enter" key
mainInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// 6. Hide dropdown if user clicks outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        suggestionsBox.style.display = 'none';
    }
});