 document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if (name && email) {
                alert('Thank you for your message! We will get back to you within 24 hours.');
                this.reset();
            }
        });
        
        // FAQ toggle functionality
        document.querySelectorAll('.faq-item h3').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const icon = question.querySelector('i');
                
                answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        });



// Named function to fetch and display travel data
function searchInfo() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const infoDiv = document.querySelector('.info');
      let html = '';
      
      // Display countries
      html += '<h2>Countries</h2>';
      data.countries.forEach(country => {
        html += `<h3>${country.name}</h3>`;
        country.cities.forEach(city => {
          html += `
            <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
              <h4>${city.name}</h4>
              <img src="${city.imageUrl}" alt="${city.name}" style="max-width: 250px; height: auto;">
              <p>${city.description}</p>
            </div>
          `;
        });
      });
      
      // Display temples
      html += '<h2>Temples</h2>';
      data.temples.forEach(temple => {
        html += `
          <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
            <h3>${temple.name}</h3>
            <img src="${temple.imageUrl}" alt="${temple.name}" style="max-width: 250px; height: auto;">
            <p>${temple.description}</p>
          </div>
        `;
      });
      
      // Display beaches
      html += '<h2>Beaches</h2>';
      data.beaches.forEach(beach => {
        html += `
          <div style="margin: 20px 0; padding: 10px; border: 1px solid #ddd;">
            <h3>${beach.name}</h3>
            <img src="${beach.imageUrl}" alt="${beach.name}" style="max-width: 250px; height: auto;">
            <p>${beach.description}</p>
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