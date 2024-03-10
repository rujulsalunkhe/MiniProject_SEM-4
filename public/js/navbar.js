// navbar.js

// Function to add 'active' class to the current link based on the URL
function setActiveLink() {
    console.log("setActiveLink function is executed!");
    // Get the current URL path
    var path = window.location.pathname;

    // Get all links in the navbar
    var links = document.querySelectorAll('.item');

    // Loop through each link
    links.forEach(function (link) {
        // Remove 'active' class from all links
        link.classList.remove('active');

        // Check if the current URL path matches the link's href
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
}

// Call setActiveLink function when the page loads
window.addEventListener('DOMContentLoaded', setActiveLink);
