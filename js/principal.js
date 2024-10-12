let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const cards = document.querySelectorAll('.card');

        function showSlide(n) {

            slides[currentSlide].classList.remove('active');

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
        }

        setInterval(() => showSlide(currentSlide + 1), 5000);

        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        document.addEventListener('DOMContentLoaded', function() {
            const exploreLink = document.getElementById('exploreLink');
            const exploreDropdown = document.getElementById('exploreDropdown');
            const searchBar = document.getElementById('searchBar');
            const btn = document.getElementById('campaignBtn');
            const logo = document.getElementById('logo');
            const loginLink = document.getElementById('loginLink');
        
            function openDropdown() {
                exploreDropdown.style.display = 'block';
                searchBar.classList.add('active');
                btn.classList.add('active');
                logo.classList.add('active');
                exploreLink.classList.add('active');
                loginLink.classList.add('active');
                document.querySelector('header').classList.add('active');
            }
        
            exploreLink.addEventListener('click', function(e) {
                e.preventDefault();
                openDropdown();
            });
        
            searchBar.addEventListener('click', function() {
                openDropdown();
            });
        
            window.addEventListener('click', function(e) {
                if (!exploreLink.contains(e.target) && !exploreDropdown.contains(e.target) && !searchBar.contains(e.target)) {
                    exploreDropdown.style.display = 'none';
                    searchBar.classList.remove('active');
                    btn.classList.remove('active');
                    logo.classList.remove('active');
                    exploreLink.classList.remove('active');
                    loginLink.classList.remove('active');
                    document.querySelector('header').classList.remove('active');
                }
            });
        });
