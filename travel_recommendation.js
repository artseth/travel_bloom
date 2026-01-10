



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




// Store travel data globally
let travelData = null;

// Keyword mappings with variations
const keywordMap = {
    'beach': ['beach', 'beaches', 'shore', 'coast', 'seaside', 'ocean'],
    'temple': ['temple', 'temples', 'shrine', 'pagoda', 'sanctuary', 'monastery'],
    'country': ['country', 'countries', 'nation', 'state', 'land']
};

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load the travel data
    fetch('./travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {
            travelData = data;
        })
        .catch(error => {
            console.error('Error loading travel data:', error);
        });

    // Set up event listeners
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(event) {
            event.preventDefault();
            searchInfo();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchInfo();
            }
        });
    }
});

// Main search function
function searchInfo() {
    const searchInput = document.getElementById('searchInput');
    const userInput = searchInput.value.trim();
    
    if (!userInput) {
        alert('Please enter a search term');
        return;
    }
    
    // Add blur effect to background
    const background = document.getElementById('background') || document.body;
    background.classList.add('blur-background');
    
    if (!travelData) {
        // Load data if not already loaded
        fetch('./travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                travelData = data;
                performSearch(userInput, data);
            })
            .catch(error => {
                console.error('Error:', error);
                document.querySelector('.info').innerHTML = '<p style="color:white">Unable to load travel recommendations.</p>';
            });
    } else {
        performSearch(userInput, travelData);
    }
}

// Perform the actual search
function performSearch(userInput, data) {
    const normalizedInput = userInput.toLowerCase().trim();
    const infoDiv = document.querySelector('.info');
    
    // Clear previous results
    infoDiv.innerHTML = '';
    
    // Determine what to search for based on keywords
    const searchResult = determineSearchType(normalizedInput);
    
    let html = '';
    
    switch(searchResult.type) {
        case 'beach':
            html = searchBeaches(data, normalizedInput);
            break;
        case 'temple':
            html = searchTemples(data, normalizedInput);
            break;
        case 'country':
            html = searchCountries(data, normalizedInput);
            break;
        case 'mixed':
            // Show all categories
            html = searchAll(data, normalizedInput);
            break;
        default:
            // General search across all fields
            html = searchAll(data, normalizedInput);
    }
    
    if (html === '') {
        html = '<h3 style="color:white; text-align:center;">No results found. Try searching for "beach", "temple", "country", or specific locations.</h3>';
    }
    
    infoDiv.innerHTML = html;
}

// Determine what type of search to perform
function determineSearchType(input) {
    // Check for beach keywords
    for (const keyword of keywordMap.beach) {
        if (input === keyword || input.includes(keyword)) {
            return { type: 'beach' };
        }
    }
    
    // Check for temple keywords
    for (const keyword of keywordMap.temple) {
        if (input === keyword || input.includes(keyword)) {
            return { type: 'temple' };
        }
    }
    
    // Check for country keywords
    for (const keyword of keywordMap.country) {
        if (input === keyword || input.includes(keyword)) {
            return { type: 'country' };
        }
    }
    
    // If multiple keywords or general search
    const words = input.split(' ');
    let typesFound = [];
    
    words.forEach(word => {
        if (keywordMap.beach.includes(word)) typesFound.push('beach');
        if (keywordMap.temple.includes(word)) typesFound.push('temple');
        if (keywordMap.country.includes(word)) typesFound.push('country');
    });
    
    if (typesFound.length > 1) {
        return { type: 'mixed' };
    } else if (typesFound.length === 1) {
        return { type: typesFound[0] };
    }
    
    return { type: 'general' };
}

// Search beaches
function searchBeaches(data, searchTerm) {
    let html = '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Beaches</h2>';
    let hasResults = false;
    
    if (data.beaches && data.beaches.length > 0) {
        data.beaches.forEach(beach => {
            // Check if beach matches search term (if it's not just "beach")
            if (searchTerm === 'beach' || searchTerm === 'beaches' || 
                beach.name.toLowerCase().includes(searchTerm) || 
                beach.description.toLowerCase().includes(searchTerm)) {
                
                html += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: rgba(255,255,255,0.1);">
                        <h3 style="color:white; margin-top: 0;">${beach.name}</h3>
                        <img src="${beach.imageUrl}" alt="${beach.name}" style="max-width: 300px; height: auto; border-radius: 5px;">
                        <p style="color:white; margin-top: 10px;">${beach.description}</p>
                    </div>
                `;
                hasResults = true;
            }
        });
    }
    
    return hasResults ? html : '';
}

// Search temples
function searchTemples(data, searchTerm) {
    let html = '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Temples</h2>';
    let hasResults = false;
    
    if (data.temples && data.temples.length > 0) {
        data.temples.forEach(temple => {
            if (searchTerm === 'temple' || searchTerm === 'temples' || 
                temple.name.toLowerCase().includes(searchTerm) || 
                temple.description.toLowerCase().includes(searchTerm)) {
                
                html += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: rgba(255,255,255,0.1);">
                        <h3 style="color:white; margin-top: 0;">${temple.name}</h3>
                        <img src="${temple.imageUrl}" alt="${temple.name}" style="max-width: 300px; height: auto; border-radius: 5px;">
                        <p style="color:white; margin-top: 10px;">${temple.description}</p>
                    </div>
                `;
                hasResults = true;
            }
        });
    }
    
    return hasResults ? html : '';
}

// Search countries
function searchCountries(data, searchTerm) {
    let html = '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Countries</h2>';
    let hasResults = false;
    
    if (data.countries && data.countries.length > 0) {
        data.countries.forEach(country => {
            const countryNameLower = country.name.toLowerCase();
            
            // Check if we're searching for countries in general or a specific country
            if (searchTerm === 'country' || searchTerm === 'countries' || 
                countryNameLower.includes(searchTerm)) {
                
                html += `<h3 style="color:white; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">${country.name}</h3>`;
                
                country.cities.forEach(city => {
                    html += `
                        <div style="margin: 15px 0 15px 20px; padding: 15px; border-left: 3px solid #ddd; background: rgba(255,255,255,0.05);">
                            <h4 style="color:white; margin-top: 0;">${city.name}</h4>
                            <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 280px; height: auto; border-radius: 5px;">
                            <p style="color:white; margin-top: 10px;">${city.description}</p>
                        </div>
                    `;
                });
                hasResults = true;
            }
        });
    }
    
    return hasResults ? html : '';
}

// Search all categories
function searchAll(data, searchTerm) {
    let html = '';
    let foundResults = false;
    
    // Search countries and cities
    if (data.countries) {
        data.countries.forEach(country => {
            const countryNameLower = country.name.toLowerCase();
            
            if (countryNameLower.includes(searchTerm)) {
                if (!foundResults) {
                    html += '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Search Results</h2>';
                    foundResults = true;
                }
                
                html += `<h3 style="color:white; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px;">${country.name}</h3>`;
                
                country.cities.forEach(city => {
                    html += `
                        <div style="margin: 15px 0 15px 20px; padding: 15px; border-left: 3px solid #ddd; background: rgba(255,255,255,0.05);">
                            <h4 style="color:white; margin-top: 0;">${city.name}</h4>
                            <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 280px; height: auto; border-radius: 5px;">
                            <p style="color:white; margin-top: 10px;">${city.description}</p>
                        </div>
                    `;
                });
            }
            
            // Check individual cities
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchTerm) || 
                    city.description.toLowerCase().includes(searchTerm)) {
                    
                    if (!foundResults) {
                        html += '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Search Results</h2>';
                        foundResults = true;
                    }
                    
                    html += `
                        <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: rgba(255,255,255,0.1);">
                            <h3 style="color:white; margin-top: 0;">${city.name}</h3>
                            <p style="color:white; margin-bottom: 10px;"><em>In ${country.name}</em></p>
                            <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 300px; height: auto; border-radius: 5px;">
                            <p style="color:white; margin-top: 10px;">${city.description}</p>
                        </div>
                    `;
                }
            });
        });
    }
    
    // Search beaches
    if (data.beaches) {
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchTerm) || 
                beach.description.toLowerCase().includes(searchTerm)) {
                
                if (!foundResults) {
                    html += '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Search Results</h2>';
                    foundResults = true;
                }
                
                html += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: rgba(255,255,255,0.1);">
                        <h3 style="color:white; margin-top: 0;">${beach.name}</h3>
                        <img src="${beach.imageUrl}" alt="${beach.name}" style="max-width: 300px; height: auto; border-radius: 5px;">
                        <p style="color:white; margin-top: 10px;">${beach.description}</p>
                    </div>
                `;
            }
        });
    }
    
    // Search temples
    if (data.temples) {
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchTerm) || 
                temple.description.toLowerCase().includes(searchTerm)) {
                
                if (!foundResults) {
                    html += '<h2 style="color:white; border-bottom: 2px solid white; padding-bottom: 10px;">Search Results</h2>';
                    foundResults = true;
                }
                
                html += `
                    <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: rgba(255,255,255,0.1);">
                        <h3 style="color:white; margin-top: 0;">${temple.name}</h3>
                        <img src="${temple.imageUrl}" alt="${temple.name}" style="max-width: 300px; height: auto; border-radius: 5px;">
                        <p style="color:white; margin-top: 10px;">${temple.description}</p>
                    </div>
                `;
            }
        });
    }
    
    return html;
}



//Task 9 - Creating The Clear Button


function clearResults() {

    const infoDiv = document.querySelector('.info');
    if (infoDiv) {
        infoDiv.innerHTML = '';
    }
    
  
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    

    const background = document.getElementById('background');
    if (background) {
        background.classList.remove('blur-background');
    }
}

// event listener to set up the clear button
document.addEventListener('DOMContentLoaded', function() {
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(event) {
            event.preventDefault(); 
            clearResults();
        });
    }
});

