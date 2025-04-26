// customer js
// Scroll Effect Script
document.addEventListener("DOMContentLoaded", function () {
    let navbar = document.querySelector(".navbar");
    let topbar = document.querySelector(".topbar");
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY;

        if (scrollTop > lastScrollTop) {
            // Scrolling down: Hide topbar & move navbar up
            topbar.style.transform = "translateY(-100%)";
            navbar.classList.add("scrolled");
        } else {
            // Scrolling up: Show topbar & restore navbar
            topbar.style.transform = "translateY(0)";
            navbar.classList.remove("scrolled");
        }

        lastScrollTop = scrollTop;
    });
});

/* mobile menu hide show */
document.addEventListener("DOMContentLoaded", function () {
    let navLinks = document.querySelectorAll(".navbar-nav a");
    let navbarCollapse = document.querySelector(".navbar-collapse");
    let dropdownMenu = document.querySelectorAll(".dropdown-menu");

    // Hide menu when any normal link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navbarCollapse.classList.remove("show");
        });
    });

    // Prevent dropdown menu from closing when clicked inside
    dropdownMenu.forEach(menu => {
        menu.addEventListener("click", function (event) {
            event.stopPropagation(); // Stops the click from bubbling up and closing the menu
        });
    });
});

// Sequential Video Playback
document.addEventListener("DOMContentLoaded", function () {
    const videoElement = document.getElementById("backgroundVideo");
    const videoSource = document.getElementById("videoSource");

    // List of videos to play in sequence
    const videos = ["assets/videos/plumbing_1.mp4", "assets/videos/plumbing_3.mp4", "assets/videos/plumbing_4.mp4", "assets/videos/plumbing_5.mp4"];
    let currentIndex = 0;

    videoElement.addEventListener("ended", function () {
        // Start fade out effect
        videoElement.classList.add("fade-out");

        setTimeout(() => {
            // Change video source
            currentIndex = (currentIndex + 1) % videos.length;
            videoSource.src = videos[currentIndex];
            videoElement.load(); // Reload video source

            // Start fade-in effect after switching
            videoElement.play();
            videoElement.classList.remove("fade-out");
            videoElement.classList.add("fade-in");

            setTimeout(() => {
                videoElement.classList.remove("fade-in"); // Remove fade-in after effect
            }, 1000);
        }, 1000); // 1s delay for fade transition
    });
});

/* Testimonial slider */
var swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
});

/* Scroll to top button */
document.addEventListener("DOMContentLoaded", function () {
    let goTopBtn = document.getElementById("goTopBtn");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            goTopBtn.classList.add("show");
        } else {
            goTopBtn.classList.remove("show");
        }
    });

    goTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

/* Sticky contact */
// document.addEventListener("DOMContentLoaded", function () {
//     let stickyContact = document.getElementById("sticky-contact");

//     window.addEventListener("scroll", function () {
//         if (window.scrollY > 200) {
//             stickyContact.style.display = "block";
//         } else {
//             stickyContact.style.display = "none";
//         }
//     });
// });

/* language dropdown */
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".translate").forEach(function (element) {
        element.addEventListener("click", function (e) {
            e.preventDefault();
            var lang = this.getAttribute("data-lang");

            // Wait until Google Translate is loaded
            var interval = setInterval(function () {
                var select = document.querySelector(".goog-te-combo");
                if (select) {
                    select.value = lang;  // Set language
                    select.dispatchEvent(new Event("change")); // Apply translation
                    select.dispatchEvent(new Event("change")); // Apply translation
                    clearInterval(interval); // Stop checking once applied
                }
            }, 500); // Check every 500ms
        });
    });
});

  // Initialize the map at a midpoint between Laval and Montreal
  var map = L.map('map').setView([45.5542, -73.6399], 10);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add a marker at the location
  L.marker([45.5542, -73.6399]).addTo(map);
    // .bindPopup('Midpoint between Laval and Montreal')
    // .openPopup();

    /* change map icon */
    function changeMapIcon(lang) {
        const flagImg = document.getElementById("languageFlag");
    
        if (lang === "fr") {
            flagImg.src = "assets/flags/fr.svg";
        } else {
            flagImg.src = "assets/flags/gb.svg";
        }
    
        // existing translation logic...
    }
       
/* stripe button checkout */
const stripe = Stripe('pk_test_51RHi4lSD9MXPIidLtOBZ3iIbFPFT0s0eHxxvCnpu98tR4wyFhM2qehismkoOoKjazC4SUCVyGgxdyWJOuCGvWroJ00WzJe0TnN');

function checkout(amount, plan) {
  fetch('https://debouchagetest.onrender.com/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, plan })
  })
  .then(res => res.json())
  .then(data => stripe.redirectToCheckout({ sessionId: data.id }));
}



