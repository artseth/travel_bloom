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



document.addEventListener('DOMContentLoaded', function searchInfo() {
  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const infoDiv = document.querySelector('.glass-search-button');
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
      document.querySelector('.glass-search-button').innerHTML = '<p>Unable to load travel recommendations.</p>';
    });
});