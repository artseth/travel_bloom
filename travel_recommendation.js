



// Named function to fetch and display travel data
function searchInfo() {
  console.log('fetching JSON data')

  const background = document.getElementById('background') || document.body;
  background.classList.add('blur-background');
  fetch('./travel_recommendation_api.json')
    .then(response => {
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const infoDiv = document.querySelector('.info');
      let html = '';
      
      // Display countries
      html += '<h2 style="color:white">Countries</h2>';
      data.countries.forEach(country => {
        html += `<h3 style="color:white">${country.name}</h3>`;
        country.cities.forEach(city => {
          html += `
            <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
              <h4 style="color:white">${city.name}</h4>
              <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 250px; height: auto;">
              <p style="color:white">${city.description}</p>
            </div>
          `;
        });
      });
      
      // Display temples
      html += '<h2 style="color:white">Temples</h2>';
      data.temples.forEach(temple => {
        html += `
          <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
            <h3 style="color:white">${temple.name}</h3>
            <img src="${temple.imageUrl}" alt="${temple.name}" style="max-width: 250px; height: auto;">
            <p style="color:white">${temple.description}</p>
          </div>
        `;
      });
      
      // Display beaches
      html += '<h2 style="color:white">Beaches</h2>';
      data.beaches.forEach(beach => {
        html += `
          <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
            <h3 style="color:white">${beach.name}</h3>
            <img src="${beach.imageUrl}" alt="${beach.name}" style="max-width: 250px; height: auto;">
            <p style="color:white">${beach.description}</p>
          </div>
        `;
      });
      
      infoDiv.innerHTML = html;
    })
    .catch(error => {
      console.error('Error:', error);
      document.querySelector('.info').innerHTML = '<p>Unable to load travel recommendations.</p>';
    });
}

// Set up event listener for when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Optionally display recommendations on page load
  // displayAllTravelRecommendations(); // Uncomment if you want to show on load
  
  // Set up event listener for submit button
  const submitButton = document.getElementById("searchBtn");
  if (submitButton) {
    submitButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent form submission if it's in a form
      searchInfo();
    });
  }
});



//TASK 7



// Load and store the travel data
let travelData = {
    countries: [],
    temples: [],
    beaches: []
};

// Fetch the JSON data
async function loadTravelData() {
    try {
        const response = await fetch('./travel_recommendation_api.json'); 
        travelData = await response.json();
    } catch (error) {
        console.error('Error loading travel data:', error);
    }
}

// Define keyword mappings with variations
const keywordMap = {
    'beach': ['beach', 'beaches', 'beachs', 'shore', 'coast'],
    'temple': ['temple', 'temples', 'shrine', 'pagoda', 'sanctuary'],
    'country': ['country', 'countries', 'nation', 'state', 'land']
};

// Country names for direct matching
const countryNames = ['australia', 'japan', 'brazil', 'cambodia', 'india', 'french polynesia'];

// Function to normalize and categorize search input
function normalizeKeyword(input) {
    const normalized = input.toLowerCase().trim();
    
    // First check if it's a direct country name
    if (countryNames.includes(normalized)) {
        return { type: 'country-name', value: normalized };
    }
    
    // Check for category keywords
    for (const [category, variations] of Object.entries(keywordMap)) {
        if (variations.includes(normalized)) {
            return { type: 'category', value: category };
        }
    }
    
    // Check if input contains any keywords
    const words = normalized.split(/\s+/);
    for (const word of words) {
        for (const [category, variations] of Object.entries(keywordMap)) {
            if (variations.includes(word)) {
                return { type: 'category', value: category };
            }
        }
        
        // Check for country names in multi-word searches
        if (countryNames.includes(word) || countryNames.some(country => country.includes(word))) {
            return { type: 'country-name', value: word };
        }
    }
    
    return { type: 'general', value: normalized };
}

// Function to perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const userInput = searchInput.value;
    
    if (!userInput.trim()) {
        alert('Please enter a search term');
        return;
    }
    
    // Normalize the keyword
    const keyword = normalizeKeyword(userInput);
    
    // Search through data based on keyword type
    let results = [];
    
    switch (keyword.type) {
        case 'category':
            results = searchByCategory(keyword.value);
            break;
        case 'country-name':
            results = searchByCountryName(keyword.value);
            break;
        case 'general':
            results = searchAllCategories(keyword.value);
            break;
    }
    
    // Display results
    displaySearchResults(results, userInput);
}

// Search by category (beach, temple, country)
function searchByCategory(category) {
    const results = [];
    
    switch (category) {
        case 'beach':
            // Add all beaches
            results.push(...travelData.beaches.map(beach => ({
                ...beach,
                type: 'beach'
            })));
            break;
            
        case 'temple':
            // Add all temples
            results.push(...travelData.temples.map(temple => ({
                ...temple,
                type: 'temple'
            })));
            break;
            
        case 'country':
            // Add all countries and their cities
            travelData.countries.forEach(country => {
                // Add country as a result
                results.push({
                    id: `country-${country.id}`,
                    name: country.name,
                    type: 'country',
                    description: `Explore destinations in ${country.name}`,
                    imageUrl: country.cities[0]?.imageUrl || './images/default.jpg'
                });
                
                // Add all cities in this country
                country.cities.forEach(city => {
                    results.push({
                        id: `city-${country.id}-${city.name}`,
                        name: city.name,
                        type: 'city',
                        description: city.description,
                        imageUrl: city.imageUrl,
                        country: country.name
                    });
                });
            });
            break;
    }
    
    return results;
}

// Search by specific country name
function searchByCountryName(countryName) {
    const results = [];
    const searchTerm = countryName.toLowerCase();
    
    // Find matching countries
    travelData.countries.forEach(country => {
        if (country.name.toLowerCase().includes(searchTerm)) {
            // Add country
            results.push({
                id: `country-${country.id}`,
                name: country.name,
                type: 'country',
                description: `Explore destinations in ${country.name}`,
                imageUrl: country.cities[0]?.imageUrl || './images/default.jpg'
            });
            
            // Add all cities in this country
            country.cities.forEach(city => {
                results.push({
                    id: `city-${country.id}-${city.name}`,
                    name: city.name,
                    type: 'city',
                    description: city.description,
                    imageUrl: city.imageUrl,
                    country: country.name
                });
            });
        }
    });
    
    // Also search for beaches/temples in this country
    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(searchTerm)) {
            results.push({
                ...beach,
                type: 'beach'
            });
        }
    });
    
    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(searchTerm)) {
            results.push({
                ...temple,
                type: 'temple'
            });
        }
    });
    
    return results;
}

// Search across all categories
function searchAllCategories(searchTerm) {
    const results = [];
    const term = searchTerm.toLowerCase();
    
    // Search beaches
    travelData.beaches.forEach(beach => {
        if (beach.name.toLowerCase().includes(term) || 
            beach.description.toLowerCase().includes(term)) {
            results.push({
                ...beach,
                type: 'beach'
            });
        }
    });
    
    // Search temples
    travelData.temples.forEach(temple => {
        if (temple.name.toLowerCase().includes(term) || 
            temple.description.toLowerCase().includes(term)) {
            results.push({
                ...temple,
                type: 'temple'
            });
        }
    });
    
    // Search countries and cities
    travelData.countries.forEach(country => {
        const countryName = country.name.toLowerCase();
        
        // Check country name
        if (countryName.includes(term)) {
            results.push({
                id: `country-${country.id}`,
                name: country.name,
                type: 'country',
                description: `Explore destinations in ${country.name}`,
                imageUrl: country.cities[0]?.imageUrl || './images/default.jpg'
            });
        }
        
        // Check cities in this country
        country.cities.forEach(city => {
            if (city.name.toLowerCase().includes(term) || 
                city.description.toLowerCase().includes(term)) {
                results.push({
                    id: `city-${country.id}-${city.name}`,
                    name: city.name,
                    type: 'city',
                    description: city.description,
                    imageUrl: city.imageUrl,
                    country: country.name
                });
            }
        });
    });
    
    return results;
}

// Display search results
function displaySearchResults(results, originalQuery) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No results found for "${originalQuery}"</h3>
                <p>Try searching for: beach, temple, country, or specific locations like "Japan", "Bora Bora"</p>
            </div>
        `;
        return;
    }
    
    // Group results by type for better organization
    const groupedResults = {
        country: [],
        city: [],
        beach: [],
        temple: []
    };
    
    results.forEach(result => {
        groupedResults[result.type].push(result);
    });
    
    let html = `<h3>Found ${results.length} results for "${originalQuery}"</h3>`;
    
    // Display countries
    if (groupedResults.country.length > 0) {
        html += `<h4>Countries</h4><div class="results-grid">`;
        groupedResults.country.forEach(country => {
            html += createResultCard(country);
        });
        html += `</div>`;
    }
    
    // Display cities
    if (groupedResults.city.length > 0) {
        html += `<h4>Cities</h4><div class="results-grid">`;
        groupedResults.city.forEach(city => {
            html += createResultCard(city);
        });
        html += `</div>`;
    }
    
    // Display beaches
    if (groupedResults.beach.length > 0) {
        html += `<h4>Beaches</h4><div class="results-grid">`;
        groupedResults.beach.forEach(beach => {
            html += createResultCard(beach);
        });
        html += `</div>`;
    }
    
    // Display temples
    if (groupedResults.temple.length > 0) {
        html += `<h4>Temples</h4><div class="results-grid">`;
        groupedResults.temple.forEach(temple => {
            html += createResultCard(temple);
        });
        html += `</div>`;
    }
    
    resultsContainer.innerHTML = html;
}

// Create HTML for a result card
function createResultCard(item) {
    return `
        <div class="result-card" data-type="${item.type}">
            <img src="${item.imageUrl}" alt="${item.name}" class="result-image">
            <div class="result-content">
                <h5>${item.name}</h5>
                ${item.country ? `<p class="country">${item.country}</p>` : ''}
                <p class="description">${item.description}</p>
                <span class="badge">${item.type.toUpperCase()}</span>
            </div>
        </div>
    `;
}

// Initialize search functionality
async function initializeSearch() {
    // Load data first
    await loadTravelData();
    
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchButton || !searchInput) {
        console.error('Search elements not found');
        return;
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeSearch);