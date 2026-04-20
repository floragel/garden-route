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
 * Manual Route Selection Logic
 */
const routeBtns = document.querySelectorAll(".route-btn");
const mapPaths = document.querySelectorAll(".map-path");
const mapMarkers = document.querySelectorAll(".map-marker");

const updateRoute = function(routeId) {
  // Update Buttons
  routeBtns.forEach(btn => {
    if (btn.getAttribute("data-route") === routeId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update Paths
  mapPaths.forEach(path => {
    path.classList.remove("active");
    if (routeId === "all" || path.id === `route-${routeId}`) {
      path.classList.add("active");
    }
  });

  // Update Markers
  mapMarkers.forEach(marker => {
    const place = marker.getAttribute("data-place");
    marker.classList.remove("highlight");
    
    if (routeId === "all" || 
       (routeId === "wilderness" && (place === "George" || place === "Wilderness")) ||
       (routeId === "knysna" && (place === "George" || place === "Wilderness" || place === "Knysna"))) {
      marker.classList.add("highlight");
    }
  });
}

routeBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    updateRoute(this.getAttribute("data-route"));
  });
});

// Initialize with Overview
window.addEventListener("load", () => updateRoute("all"));


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
    title: "THE WILDERNESS ESCAPE: COZY COASTAL BLISS",
    details: `
      <div class="modal-section" style="margin-bottom: 30px; text-align: center;">
        <p><em>Experience a refined journey where nature meets luxury in the heart of the Garden Route.</em></p>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <p class="timeline-day">Day 01</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/Garden-Route-Suedafrika-13.jpg" class="timeline-img" alt="Coastal Road">
            <h5><strong>Arrival & Coastal Sunset</strong></h5>
            <p>Direct flight to George Airport followed by a private transfer to <a href="https://www.viewshotel.co.za/" target="_blank"><strong>Views Boutique Hotel & Spa</strong></a>. Relax with signature welcome drinks as you overlook the dolphin-active bay.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 02</p>
          <div class="timeline-content">
             <img src="./assets/images-south_africa/images-2.jpeg" class="timeline-img" alt="Canoeing">
            <h5><strong>Adventure & Cultural Feast</strong></h5>
            <p>Morning <em>Guided Canoeing</em> on the <a href="https://www.visitknysna.co.za/kaaimans-river/" target="_blank">Kaaimans River</a> through ancient riverbeds. In the evening, enjoy a <strong>Traditional South African Braai</strong> featuring boerewors and authentic local side-dishes.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 03</p>
          <div class="timeline-content">
             <img src="./assets/images-south_africa/image.handler.php.jpeg" class="timeline-img" alt="River Hike">
            <h5><strong>Nature Hike & Departure</strong></h5>
            <p>Guided exploration of the <strong>Kingfisher Trail</strong> and its hidden waterfalls. Gourmet farewell lunch in Wilderness village before your shuttle to George Airport.</p>
          </div>
        </div>
      </div>

      <div class="modal-section" style="margin-top:20px; text-align:center; padding: 20px; background: var(--gunmetal); color: white; border-radius: 15px;">
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Exclusive Rate</p>
        <p style="font-size: 24px; font-weight: 800; color: #fff;">$350 USD <span style="font-size: 16px; font-weight: 400;">/ person</span></p>
      </div>
    `
  },
  "Knysna": {
    title: "KNYSNA LAGOON LUXURY & MARINE SAFARI",
    details: `
      <div class="modal-section" style="margin-bottom: 30px; text-align: center;">
        <p><em>A sophisticated immersion into the artistic wonders and wildlife of Knysna.</em></p>
      </div>

      <div class="timeline">
        <div class="timeline-item">
          <p class="timeline-day">Day 01</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/view-from-rim-flow-pool.jpg" class="timeline-img" alt="Knysna Lagoon">
            <h5><strong>Lagoon Living</strong></h5>
            <p>Arrive at <a href="https://kanonkop.co.za/" target="_blank"><strong>Kanonkop House</strong></a>. Embark on a sunset yacht cruise through the iconic <em>Knysna Heads</em>, paired with fresh local oysters and premium wine.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 02</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/beautiful-coastal-landscape-garden-route-south-africa-408813550.jpg.webp" class="timeline-img" alt="Marine Safari">
            <h5><strong>Ocean Majesty: Marine Safari</strong></h5>
            <p>A full-day <strong>Ocean Quest</strong> to witness Bottlenose Dolphins and visiting whales in the crystal-clear ocean. This exclusive experience is now part of our signature Knysna itinerary.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 03</p>
          <div class="timeline-content">
            <img src="./assets/images-south_africa/image.handler.php.jpeg" class="timeline-img" alt="Forest Walk">
            <h5><strong>Ancient Forests & Island Mornings</strong></h5>
            <p>A morning walking tour of the <strong>Knysna Forest</strong>, home to elusive elephants. Afternoon spent exploring the shops and cafes of <em>Thesen Islands</em>.</p>
          </div>
        </div>

        <div class="timeline-item">
          <p class="timeline-day">Day 04</p>
          <div class="timeline-content">
             <img src="./assets/images-south_africa/Garden-Route-Suedafrika-13.jpg" class="timeline-img" alt="Panoramic Knysna">
            <h5><strong>Nature Reserve & Panoramic Departure</strong></h5>
            <p>4x4 excursion to <a href="https://www.featherbednature.co.za/" target="_blank"><strong>Featherbed Nature Reserve</strong></a> before your luxury shuttle departure.</p>
          </div>
        </div>
      </div>

      <div class="modal-section" style="margin-top:20px; text-align:center; padding: 20px; background: var(--gunmetal); color: white; border-radius: 15px;">
        <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Executive Rate</p>
        <p style="font-size: 24px; font-weight: 800; color: #fff;">$480 USD <span style="font-size: 16px; font-weight: 400;">/ person</span></p>
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