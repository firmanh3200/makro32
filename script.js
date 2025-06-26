// This file can be used for any interactive features or dynamic data loading.
// For now, it's just a placeholder to demonstrate the setup.

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard script loaded!');

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active'); // Toggle class on button for 'X' animation

        // Handle overlay
        if (navLinks.classList.contains('active')) {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.classList.add('menu-overlay');
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.remove();
            });
        } else {
            const existingOverlay = document.querySelector('.menu-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
        }
    });

    // Close menu if a link is clicked (for single page apps with hash links)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                const existingOverlay = document.querySelector('.menu-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
            }
        });
    });

    // Example: You could add functionality here to update card values dynamically
    // or fetch data from an API.

    // const updateMetrics = () => {
    //     // Simulate fetching new data
    //     const newSales = (Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    //     const newUsers = Math.floor(Math.random() * 2000);
    //     const activeProjects = Math.floor(Math.random() * 100);
    //     const supportTickets = Math.floor(Math.random() * 20);

    //     document.querySelector('.metric-card:nth-child(1) .card-value').textContent = `Rp ${newSales}`;
    //     document.querySelector('.metric-card:nth-child(2) .card-value').textContent = newUsers;
    //     document.querySelector('.metric-card:nth-child(3) .card-value').textContent = activeProjects;
    //     document.querySelector('.metric-card:nth-child(4) .card-value').textContent = supportTickets;
    // };

    // // Update metrics every 5 seconds (for demonstration)
    // setInterval(updateMetrics, 5000);
    // updateMetrics(); // Initial update
});
