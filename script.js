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
    cityCards.forEach(card => {
        card.addEventListener('click', () => {
            cityCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const mood = card.dataset.mood;
            setMood(mood);
        });
    });

    // OPEN-METEO API INTEGRATION
    const candidates = [
        { name: "Zurich", lat: 47.37, lon: 8.54 },
        { name: "Helsinki", lat: 60.16, lon: 24.93 },
        { name: "New York", lat: 40.71, lon: -74.00 },
        { name: "Tokyo", lat: 35.67, lon: 139.65 },
        { name: "Delhi", lat: 28.61, lon: 77.20 },
        { name: "Beijing", lat: 39.90, lon: 116.40 },
        { name: "Santiago", lat: -33.44, lon: -70.66 },
        { name: "Sydney", lat: -33.86, lon: 151.20 },
        { name: "London", lat: 51.50, lon: -0.12 }
    ];

    async function fetchLiveAQI() {
        try {
            // Build query params
            const lats = candidates.map(c => c.lat).join(',');
            const lons = candidates.map(c => c.lon).join(',');
            const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lats}&longitude=${lons}&current=us_aqi`;

            const response = await fetch(url);
            const data = await response.json();

            let results = [];
            if (Array.isArray(data)) {
                results = data.map((d, i) => ({
                    name: candidates[i].name,
                    aqi: d.current.us_aqi
                }));
            } else {
                // Single result (fallback)
                results = [{ name: candidates[0].name, aqi: data.current.us_aqi }];
            }

            // Sort by AQI
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
