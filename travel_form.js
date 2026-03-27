
        
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



