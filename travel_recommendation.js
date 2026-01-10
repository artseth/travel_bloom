



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