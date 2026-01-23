document.addEventListener('DOMContentLoaded', () => {
    const eyes = document.querySelectorAll('.eye');
    const face = document.querySelector('.face');
    const faceContainer = document.querySelector('.face-container');

    // MOUSE TRACKING
    document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of the face
        const rect = face.getBoundingClientRect();
        const faceCenterX = rect.left + rect.width / 2;
        const faceCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(e.clientY - faceCenterY, e.clientX - faceCenterX);

        // Limit the movement distance so eyes stay within "sockets"
        // The further the mouse, the more they look, but cappped.
        const distance = Math.min(10, Math.hypot(e.clientX - faceCenterX, e.clientY - faceCenterY) / 20);

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        eyes.forEach(eye => {
            eye.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // BLINKING LOOP
    function blink() {
        eyes.forEach(eye => eye.classList.add('blink'));

        setTimeout(() => {
            eyes.forEach(eye => eye.classList.remove('blink'));
        }, 200); // Blink duration matched to CSS

        // Random next blink between 2s and 6s
        const nextBlink = Math.random() * 4000 + 2000;
        setTimeout(blink, nextBlink);
    }

    // Initial blink start
    setTimeout(blink, 2000);

    // 3D TILT EFFECT FOR BOX
    faceContainer.addEventListener('mousemove', (e) => {
        const rect = faceContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPct = x / rect.width - 0.5;
        const yPct = y / rect.height - 0.5;

        // Tilt amount
        const tiltX = yPct * -25; // Rotate X axis (up/down)
        const tiltY = xPct * 25;  // Rotate Y axis (left/right)

        faceContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    faceContainer.addEventListener('mouseleave', () => {
        faceContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
    });

    // MOBILE MENU
    const hamburger = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));

    // NAVBAR SCROLL BEHAVIOR
    let lastScrollY = window.scrollY;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // If scrolling down & past a threshold, hide nav
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            header.classList.add('nav-hidden');
        } else {
            // Scrolling up
            header.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
    });

    // CITY PRESET CONTROLS & LIVE DATA
    const cityCards = document.querySelectorAll('.city-card');

    function setMood(mood) {
        eyes.forEach(eye => {
            eye.classList.remove('happy', 'sad');
            if (mood === 'happy') eye.classList.add('happy');
            if (mood === 'sad') eye.classList.add('sad');
        });
    }

    // Interactive Click
    // Interactive Click & Hover
    cityCards.forEach(card => {
        ['click', 'mouseenter'].forEach(evt => {
            card.addEventListener(evt, () => {
                // Set active state for both click and hover
                cityCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Update the mood
                const mood = card.dataset.mood;
                setMood(mood);
            });
        });
    });

    // OPEN-METEO API INTEGRATION
    // Extended list of 50 major global cities for variety
    const allCities = [
        { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
        { name: "Delhi", lat: 28.7041, lon: 77.1025 },
        { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
        { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
        { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
        { name: "Cairo", lat: 30.0444, lon: 31.2357 },
        { name: "Mumbai", lat: 19.0760, lon: 72.8777 },
        { name: "Beijing", lat: 39.9042, lon: 116.4074 },
        { name: "Dhaka", lat: 23.8103, lon: 90.4125 },
        { name: "Osaka", lat: 34.6937, lon: 135.5022 },
        { name: "New York", lat: 40.7128, lon: -74.0060 },
        { name: "Karachi", lat: 24.8607, lon: 67.0011 },
        { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
        { name: "Istanbul", lat: 41.0082, lon: 28.9784 },
        { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
        { name: "Lagos", lat: 6.5244, lon: 3.3792 },
        { name: "Manila", lat: 14.5995, lon: 120.9842 },
        { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
        { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
        { name: "Moscow", lat: 55.7558, lon: 37.6173 },
        { name: "Lahore", lat: 31.5498, lon: 74.3436 },
        { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
        { name: "Paris", lat: 48.8566, lon: 2.3522 },
        { name: "Jakarta", lat: -6.2088, lon: 106.8456 },
        { name: "London", lat: 51.5074, lon: -0.1278 },
        { name: "Chicago", lat: 41.8781, lon: -87.6298 },
        { name: "Bangkok", lat: 13.7563, lon: 100.5018 },
        { name: "Seoul", lat: 37.5665, lon: 126.9780 },
        { name: "Santiago", lat: -33.4489, lon: -70.6693 },
        { name: "Madrid", lat: 40.4168, lon: -3.7038 },
        { name: "Sydney", lat: -33.86, lon: 151.20 },
        { name: "Toronto", lat: 43.6532, lon: -79.3832 },
        { name: "Berlin", lat: 52.5200, lon: 13.4050 },
        { name: "Singapore", lat: 1.3521, lon: 103.8198 },
        { name: "Baghdad", lat: 33.3152, lon: 44.3661 },
        { name: "Hanoi", lat: 21.0285, lon: 105.8542 },
        { name: "Lima", lat: -12.0464, lon: -77.0428 },
        { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
        { name: "Riyadh", lat: 24.7136, lon: 46.6877 },
        { name: "Tehran", lat: 35.6892, lon: 51.3890 },
        { name: "Dubai", lat: 25.2048, lon: 55.2708 },
        { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
        { name: "Barcelona", lat: 41.3851, lon: 2.1734 },
        { name: "Vancouver", lat: 49.2827, lon: -123.1207 },
        { name: "Melbourne", lat: -37.8136, lon: 144.9631 },
        { name: "Johannesburg", lat: -26.2041, lon: 28.0473 },
        { name: "Taipei", lat: 25.0330, lon: 121.5654 },
        { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
        { name: "Milan", lat: 45.4642, lon: 9.1900 },
        { name: "Zurich", lat: 47.3769, lon: 8.5417 }
    ];

    async function fetchLiveAQI() {
        try {
            // Randomly shuffle the cities and pick 20
            const shuffled = allCities.sort(() => 0.5 - Math.random());
            const selectedCities = shuffled.slice(0, 20);

            // Build query params for the selected batch
            const lats = selectedCities.map(c => c.lat).join(',');
            const lons = selectedCities.map(c => c.lon).join(',');
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi`;

            const response = await fetch(url);
            const data = await response.json();

            let results = [];
            if (Array.isArray(data)) {
                results = data.map((d, i) => ({
                    name: selectedCities[i].name,
                    aqi: d.current.us_aqi
                }));
            } else {
                // Fallback if API returns single object (unlikely with >1 city but safely handled)
                results = [{ name: selectedCities[0].name, aqi: data.current.us_aqi }];
            }

            // Sort by AQI (Cleanest -> Dirtiest)
            results.sort((a, b) => a.aqi - b.aqi);

            // Select Best, Median, Worst
            const best = results[0];
            const median = results[Math.floor(results.length / 2)];
            const worst = results[results.length - 1];

            updateCard(cityCards[0], best, 'clean');
            updateCard(cityCards[1], median, 'neutral');
            updateCard(cityCards[2], worst, 'polluted');

            // Auto-click the median one initially for "Neutral" start
            cityCards[1].click();

        } catch (error) {
            console.error("Failed to fetch AQI:", error);
        }
    }

    function updateCard(card, cityData, type) {
        const nameEl = card.querySelector('.city-name');
        const valEl = card.querySelector('.aqi-val');
        const indicator = card.querySelector('.indicator');

        nameEl.textContent = cityData.name;
        valEl.textContent = `AQI ${cityData.aqi}`;

        // Determine Mood & Indication
        let mood = 'neutral';
        let colorClass = 'neutral';

        if (cityData.aqi <= 50) {
            mood = 'happy';
            colorClass = 'clean';
        } else if (cityData.aqi > 100) {
            mood = 'sad';
            colorClass = 'polluted';
        }

        // Update data attribute for the click handler
        card.dataset.mood = mood;

        // Reset indicator classes
        indicator.className = 'indicator';
        indicator.classList.add(colorClass);
    }

    // Init fetch
    fetchLiveAQI();

});
