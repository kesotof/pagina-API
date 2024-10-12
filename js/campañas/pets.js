let slideIndex = 0;
        const slides = document.getElementsByClassName("main-image");
        const thumbnails = document.getElementsByClassName("thumbnail");

        function showSlide(n) {
            if (n >= slides.length) slideIndex = 0;
            if (n < 0) slideIndex = slides.length - 1;
            
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove("active");
                thumbnails[i].classList.remove("active-thumbnail");
            }
            
            slides[slideIndex].classList.add("active");
            thumbnails[slideIndex].classList.add("active-thumbnail");
        }

        function changeSlide(n) {
            showSlide(slideIndex += n);
        }

        function currentSlide(n) {
            showSlide(slideIndex = n);
        }
        
        showSlide(slideIndex);