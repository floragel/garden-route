'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }
}

navToggleEvent(navElemArr);
navToggleEvent(navLinks);



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

  if (window.scrollY >= 200) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }

});

/**
 * Search functionality - Live Filtering
 */
const searchOpenBtn = document.querySelector("[data-search-open-btn]");
const searchContainer = document.querySelector("[data-search-container]");
const searchCloseBtn = document.querySelector("[data-search-close-btn]");
const searchInput = document.querySelector(".search-input");

if (searchOpenBtn && searchContainer && searchCloseBtn) {
  searchOpenBtn.addEventListener("click", function () {
    searchContainer.classList.add("active");
    searchInput.focus();
  });

  searchCloseBtn.addEventListener("click", function () {
    searchContainer.classList.remove("active");
    searchInput.value = "";
    filterCards(""); // Reset filters
  });
}

const filterCards = function (query) {
  const cards = document.querySelectorAll(".popular-card, .package-card");
  query = query.toLowerCase().trim();

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const parentLi = card.closest("li");
    if (text.includes(query)) {
      if (parentLi) parentLi.style.display = "block";
      card.style.display = "block";
    } else {
      if (parentLi) parentLi.style.display = "none";
      card.style.display = "none";
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("input", function () {
    filterCards(this.value);
  });
}

/**
 * Reveal on Scroll - Scroll Animations
 */
const revealElements = document.querySelectorAll("[data-reveal]");

const reveal = function () {
  for (let i = 0; i < revealElements.length; i++) {
    const elementIsInViewport = revealElements[i].getBoundingClientRect().top < window.innerHeight / 1.15;

    if (elementIsInViewport) {
      revealElements[i].classList.add("active");
    }
  }
}

window.addEventListener("scroll", reveal);
window.addEventListener("load", reveal);


/**
 * Leaflet Interactive Satellite Map Logic
 */
const routeBtns = document.querySelectorAll(".route-btn");
let map;
let activePolyline = null;
let activeMarkers = [];

// Base coordinates for markers
const locations = {
  george: [-34.005, 22.381],
  mossel_bay: [-34.183, 22.146],
  oudtshoorn: [-33.585, 22.201],
  wilderness: [-33.996, 22.574],
  knysna: [-34.035, 23.048],
  plett: [-34.058, 23.371],
  tsitsikamma: [-33.972, 23.883]
};

// Custom Leaflet Icon
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: var(--bright-navy-blue); width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);'></div>",
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

// Initialize Map only when the DOM is fully loaded and map container exists
window.addEventListener("load", () => {
  const mapElement = document.getElementById('leaflet-map');
  if (mapElement) {
    // Initialize Leaflet Map
    map = L.map('leaflet-map', {
      scrollWheelZoom: false // Disable scroll zoom for better website UX
    }).setView(locations.wilderness, 10);

    // Add Esri World Imagery (High-Res Satellite)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 17
    }).addTo(map);

    // Function to draw route and zoom
    const updateRoute = function(routeId) {
      // Clear previous routes/markers
      if (activePolyline) map.removeLayer(activePolyline);
      activeMarkers.forEach(m => map.removeLayer(m));
      activeMarkers = [];
      
      // Update Buttons UI
      routeBtns.forEach(btn => {
        if (btn.getAttribute("data-route") === routeId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      let routeCoords = [];
      let markersToShow = [];
      
      if (routeId === "all") {
        routeCoords = [...routeData.wilderness, ...routeData.knysna]; 
        markersToShow = [
          { coord: locations.george, label: "George (GRJ)" },
          { coord: locations.mossel_bay, label: "Mossel Bay" },
          { coord: locations.oudtshoorn, label: "Oudtshoorn" },
          { coord: locations.wilderness, label: "Wilderness" },
          { coord: locations.plett, label: "Plettenberg Bay" },
          { coord: locations.tsitsikamma, label: "Tsitsikamma" }
        ];
      } else if (routeId === "wilderness") { // The Wild Spirit
        routeCoords = routeData.wilderness;
        markersToShow = [
          { coord: locations.george, label: "George" },
          { coord: locations.wilderness, label: "Wilderness" },
          { coord: locations.plett, label: "Robberg (Plett)" },
          { coord: locations.tsitsikamma, label: "Storms River" }
        ];
      } else if (routeId === "knysna") { // Heritage & Memory
        routeCoords = routeData.knysna;
        markersToShow = [
          { coord: locations.george, label: "George" },
          { coord: locations.mossel_bay, label: "Mossel Bay" },
          { coord: locations.knysna, label: "Knysna" },
          { coord: locations.oudtshoorn, label: "Oudtshoorn" }
        ];
      }

      // Draw Polyline
      activePolyline = L.polyline(routeCoords, {
        color: '#0d6efd', // var(--bright-navy-blue)
        weight: 5,
        opacity: 0.8,
        lineJoin: 'round'
      }).addTo(map);

      // Add Markers
      markersToShow.forEach(m => {
        const marker = L.marker(m.coord, { icon: customIcon }).addTo(map);
        marker.bindTooltip(m.label, { permanent: true, direction: "top", offset: [0, -10], className: 'map-tooltip' });
        activeMarkers.push(marker);
      });

      // Animate Camera to fit bounds
      map.flyToBounds(activePolyline.getBounds(), {
        padding: [50, 50],
        duration: 2.5,
        easeLinearity: 0.25
      });
    };

    // Attach click listeners to UI buttons
    routeBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        updateRoute(this.getAttribute("data-route"));
      });
    });

    // Start with wilderness
    // Add small delay to ensure container dims are computed
    setTimeout(() => updateRoute("wilderness"), 500); 
  }
});


/**
 * View Itinerary - Smooth Scroll
 */
const viewItineraryBtn = document.querySelector("[data-view-itinerary]");
if (viewItineraryBtn) {
  viewItineraryBtn.addEventListener("click", function () {
    const packageSection = document.querySelector("#package");
    if (packageSection) {
      packageSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}


/**
 * Modal functionality for packages - Premium Timeline Itineraries
 */
const modal = document.querySelector("[data-modal]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalDetails = document.querySelector("[data-modal-details]");
const packageBtns = document.querySelectorAll("[data-package-btn]");

const packageData = {
  "Wilderness": {
    title: "THE WILD SPIRIT PACKAGE",
    details: `
      <div class="modal-section" style="margin-bottom: 30px; text-align: center;">
        <p><em>This 3-day trip is for anyone who wants an adrenaline rush and raw landscapes. From towering cliffs to winding rivers, experience the sheer ecological power of the Garden Route.</em></p>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <p class="timeline-day">Day 01</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/images-2.jpeg" class="timeline-img" alt="Wilderness Canoeing">
            <h5><strong>Wilderness & The Sky</strong></h5>
            <p>Your journey begins the moment you touch down. We start with a serene morning of canoeing on the dark, tannin-rich waters of the Touw River, surrounded by dense indigenous birdlife. In the afternoon, the pace shifts dramatically as we go paragliding from the spectacular <a href="https://wildernessresort.co.za/map-of-africa/" target="_blank" style="text-decoration:underline;">"Map of Africa" viewpoint</a>, soaring over the coastline.</p>
            <p style="margin-top: 10px; font-size: 13px; color: var(--bright-navy-blue);">🍽️ <strong>We'll eat at</strong> <a href="https://www.tripadvisor.com/" target="_blank" style="text-decoration:underline;">Beejha Eats</a> for some organic, farm-to-table food sourced directly from the surrounding valleys.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 02</p>
          <div class="timeline-content">
             <img src="./assets/images-south_africa/beautiful-coastal-landscape-garden-route-south-africa-408813550.jpg.webp" class="timeline-img" alt="Robberg">
            <h5><strong>Robberg Marine Safari</strong></h5>
            <p>We head to Plettenberg Bay to hike the rugged <a href="https://www.capenature.co.za/reserves/robberg-nature-reserve" target="_blank" style="text-decoration:underline;">Robberg Peninsula</a>. This World Heritage site offers a demanding but rewarding 9km loop. If you look down from the dramatic sandstone cliffs, you can actually see great white sharks patrolling the waters and massive colonies of Cape fur seals basking on the rocks below.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 03</p>
          <div class="timeline-content">
             <img src="./assets/images-south_africa/360_F_118127079_vJqA2O84o7BasDhf6naYZ2mdg4eUDwTz.jpg" class="timeline-img" alt="Tsitsikamma">
            <h5><strong>Tsitsikamma Adrenaline</strong></h5>
            <p>We’ll visit the iconic <a href="https://www.sanparks.org/parks/garden-route/camps/storms-river" target="_blank" style="text-decoration:underline;">Storms River Mouth</a> to walk the swaying suspension bridge that spans the crashing ocean waves. For the truly brave, we go "Blackwater Tubing" down the narrow, towering gorge.</p>
            <div style="background: rgba(0,0,0,0.05); padding: 10px; border-left: 3px solid var(--bright-navy-blue); margin-top: 10px;">
              <p style="font-size: 13px; margin:0;"><strong>📚 History Note:</strong> You’ll learn how these majestic ancient forests were almost destroyed by the 19th-century timber rush before they were fiercely protected to become a sanctuary for biodiversity.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-section" style="margin-top:20px; text-align:center; padding: 20px; background: var(--gunmetal); color: white; border-radius: 15px;">
        <p style="font-size: 14px; text-transform: uppercase;">Accommodation: <a href="https://www.viewshotel.co.za/" target="_blank" style="color:var(--bright-navy-blue); font-weight:800; text-decoration:underline; pointer-events: auto;">Views Boutique Hotel & Spa</a></p>
        <p style="font-size: 24px; font-weight: 800; color: #fff;">$3,300 CAD <span style="font-size: 16px; font-weight: 400;">/ person (inc. flights)</span></p>
        <a href="https://www.aircanada.com/" target="_blank" class="btn btn-primary" style="margin-top:15px; margin-inline:auto; display:inline-block; pointer-events: auto;">Check Flights from YUL</a>
      </div>
    `
  },
  "Knysna": {
    title: "HERITAGE & MEMORY PACKAGE",
    details: `
      <div class="modal-section" style="margin-bottom: 30px; text-align: center;">
        <p><em>This package focuses on cultural roots, colonial history, and the profound path to reconciliation in modern South Africa.</em></p>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <p class="timeline-day">Day 01</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/image.handler.php.jpeg" class="timeline-img" alt="Mossel Bay">
            <h5><strong>Mossel Bay – The First Encounter</strong></h5>
            <p>We’ll visit the <a href="https://www.diasmuseum.co.za/" target="_blank" style="text-decoration:underline;">Bartolomeu Dias Museum</a>, where you can see a life-size replica of the original caravel ship that survived the Cape of Storms.</p>
            <div style="background: rgba(0,0,0,0.05); padding: 10px; border-left: 3px solid var(--bright-navy-blue); margin-top: 10px; margin-bottom: 10px;">
              <p style="font-size: 13px; margin:0;"><strong>📚 History Note:</strong> This is where Portuguese explorers first landed in 1488 and met the indigenous Khoikhoi people. It’s basically the "Big Bang" of modern South African history, setting off centuries of complex global trade and colonization.</p>
            </div>
             <p style="font-size: 13px; color: var(--bright-navy-blue);">🍽️ <strong>Eat:</strong> <a href="https://kaai4.co.za/" target="_blank" style="text-decoration:underline;">Kaai 4 Braai Restaurant</a> (Experience authentic, traditional open-fire cooking right on the beach).</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 02</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/view-from-rim-flow-pool.jpg" class="timeline-img" alt="Knysna Timber">
            <h5><strong>Knysna – Timber & Toil</strong></h5>
            <p>We’ll explore the dramatic <a href="https://www.visitknysna.co.za/explore/knysna-heads/" target="_blank" style="text-decoration:underline;">Knysna Heads</a>, two massive sandstone cliffs guarding the entrance to the lagoon, infamous for shipwrecks.</p>
            <div style="background: rgba(0,0,0,0.05); padding: 10px; border-left: 3px solid var(--bright-navy-blue); margin-top: 10px;">
              <p style="font-size: 13px; margin:0;"><strong>📚 History Note:</strong> We'll learn how the 19th-century timber industry shaped the economy but also created strict social hierarchies. We’ll stay at The Turbine Hotel, which is an old power plant that was brilliantly reclaimed as a cultural hub, blending industrial history with luxury.</p>
            </div>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 03</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/Garden-Route-Suedafrika-13.jpg" class="timeline-img" alt="Oudtshoorn">
            <h5><strong>Oudtshoorn – The Ostrich Palaces</strong></h5>
            <p>We’ll drive inland through the breathtaking Outeniqua Pass, leaving the lush coast for the arid Little Karoo. Here, we'll see the lavish "Ostrich Palaces" built by wealthy feather barons during the fashion boom in the 1800s. We'll also visit the <a href="https://www.cpnelmuseum.co.za/" target="_blank" style="text-decoration:underline;">CP Nel Museum</a> to understand the unique intertwining of Jewish and Afrikaans heritage in this isolated region.</p>
          </div>
        </div>
      </div>

      <div class="modal-section" style="margin-top:20px; text-align:center; padding: 20px; background: var(--gunmetal); color: white; border-radius: 15px;">
        <p style="font-size: 14px; text-transform: uppercase;">Accommodation: <a href="https://turbinehotel.co.za/" target="_blank" style="color:var(--bright-navy-blue); font-weight:800; text-decoration:underline; pointer-events:auto;">The Turbine Hotel & Spa</a></p>
        <p style="font-size: 24px; font-weight: 800; color: #fff;">$3,100 CAD <span style="font-size: 16px; font-weight: 400;">/ person (inc. flights)</span></p>
         <a href="https://www.aircanada.com/" target="_blank" class="btn btn-primary" style="margin-top:15px; margin-inline:auto; display:inline-block; pointer-events:auto;">Check Flights from YUL</a>
      </div>
    `
  }
};

if (modal && modalCloseBtn) {
  packageBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const type = this.getAttribute("data-package-type");
      if (packageData[type]) {
        modalTitle.textContent = packageData[type].title;
        modalDetails.innerHTML = packageData[type].details;
        modal.classList.add("active");
        modal.scrollTop = 0; // Reset scroll position
      }
    });
  });

  modalCloseBtn.addEventListener("click", function () {
    modal.classList.remove("active");
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}