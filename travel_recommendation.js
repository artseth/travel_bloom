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