gsap.registerPlugin(ScrollTrigger, SplitText);

/* Logo Reveal Loader */
function initLogoRevealLoader() {
  const heroSection = document.querySelector('.section_hero');
  const heroContainer = document.querySelector('.hero-container');
  const nav = document.querySelector('.progress-nav');
  const heading = document.querySelector('.hero-h1');
  const button = document.querySelector('[data-button-hero]');
  const marquee = document.querySelector('.hero-marquee');
  const schedule = document.querySelector('.schedule-block');

  // Split text once
  const splitHeading = SplitText.create(heading, {
    type: "lines",
    autoSplit: true,
    mask: "lines"
  });

  // Detect mobile/tablet
  const isMobileOrTablet = window.matchMedia("(max-width: 991px)").matches;

  // Main loader timeline
  const loadTimeline = gsap.timeline({
    defaults: { ease: "expo.inOut", duration: 1.75 }
  });

  // Animate hero section and container only on desktop
  if (!isMobileOrTablet) {
    loadTimeline
      .set(heroSection, { padding: 0 })
      .set(heroContainer, { borderRadius: 0 })
      .to(heroSection, { padding: "1.25em" })
      .to(heroContainer, { borderRadius: "0.75em" }, "<");
  }

  // Heading and element animations
  loadTimeline
    .add("headingStart", "<+0.75")
    .from(splitHeading.lines, {
      duration: 1,
      yPercent: 110,
      stagger: 0.1,
      ease: "power2.inOut"
    }, "headingStart")

    .fromTo(nav, { yPercent: -100, opacity: 0 }, {
      duration: 0.75,
      yPercent: 0,
      opacity: 1,
      ease: "expo.Out"
    }, "headingStart")

    .fromTo(marquee, { yPercent: 100, opacity: 0 }, {
      duration: 0.75,
      yPercent: 0,
      opacity: 1,
      ease: "expo.Out"
    }, "headingStart");

    
  if (!isMobileOrTablet) {
    // Desktop: slide in + fade
    loadTimeline.fromTo(schedule, { xPercent: 100, opacity: 0 }, {
      duration: 0.75,
      xPercent: 0,
      opacity: 1,
      ease: "expo.Out"
    }, "headingStart");
  } else {
    // Mobile: fade only
    loadTimeline.fromTo(schedule, { opacity: 0 }, {
      duration: 0.75,
      opacity: 1,
      ease: "expo.Out"
    }, "headingStart");
  }

  // Button animation
  loadTimeline.fromTo(button, { yPercent: 100, opacity: 0 }, {
    duration: 0.5,
    yPercent: 0,
    opacity: 1,
    ease: "expo.Out"
  }, "headingStart");
}

initLogoRevealLoader();


/* Reload on resize */
function reloadOnResize(threshold = 25, delay = 300) {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  let resizeTimer;

  // Scroll to top on page load
  window.scrollTo(0, 0);

if (window.matchMedia('(min-width: 991px)').matches) {
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      const widthDiff = Math.abs(window.innerWidth - lastWidth);
      const heightDiff = Math.abs(window.innerHeight - lastHeight);

      if (widthDiff >= threshold || heightDiff >= threshold) {
        // Ensure scroll to top before reload
        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        };
        location.reload();
      }

      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
    }, delay);
  });
}

reloadOnResize();

}

/* Menu */
function initProgressNavigation() {
  // Cache the parent container
  let navProgress = document.querySelector('[data-progress-nav-list]');

  // Create or select the moving indicator
  let indicator = navProgress.querySelector('.progress-nav__indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'progress-nav__indicator';
    navProgress.appendChild(indicator);
  }
  
  // Function to update the indicator based on the active nav link
  function updateIndicator(activeLink) {
    let parentWidth = navProgress.offsetWidth;
    let parentHeight = navProgress.offsetHeight;
    
    // Get the active link's position relative to the parent
    let parentRect = navProgress.getBoundingClientRect();
    let linkRect = activeLink.getBoundingClientRect();
    let linkPos = {
      left: linkRect.left - parentRect.left,
      top: linkRect.top - parentRect.top
    };
    
    let linkWidth = activeLink.offsetWidth;
    let linkHeight = activeLink.offsetHeight;
    
    // Calculate percentage values relative to parent dimensions
    let leftPercent = (linkPos.left / parentWidth) * 100;
    let topPercent = (linkPos.top / parentHeight) * 100;
    let widthPercent = (linkWidth / parentWidth) * 100;
    let heightPercent = (linkHeight / parentHeight) * 100;
       
    // Update the indicator with a smooth CSS transition (set in your CSS)
    indicator.style.left = leftPercent + '%';
    indicator.style.top = topPercent + '%';
    indicator.style.width = widthPercent + '%';
    indicator.style.height = heightPercent + '%';
  }
  
  // Get all anchor sections
  let progressAnchors = gsap.utils.toArray('[data-progress-nav-anchor]');

  progressAnchors.forEach((progressAnchor) => {
    let anchorID = progressAnchor.getAttribute('id');
    
    ScrollTrigger.create({
      trigger: progressAnchor,
      start: '0% 50%',
      end: '100% 50%',
      onEnter: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' + anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      },
      onEnterBack: () => {
        let activeLink = navProgress.querySelector('[data-progress-nav-target="#' + anchorID + '"]');
        activeLink.classList.add('is--active');
        // Remove 'is--active' class from sibling links
        let siblings = navProgress.querySelectorAll('[data-progress-nav-target]');
        siblings.forEach((sib) => {
          if (sib !== activeLink) {
            sib.classList.remove('is--active');
          }
        });
        updateIndicator(activeLink);
      }
    });
  });
}

// Initialize One Page Progress Navigation
initProgressNavigation();

/* Marquee Animation */
function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  const marquees = document.querySelectorAll('[data-css-marquee]');
  
  // Duplicate each [data-css-marquee-list] element inside its container
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      const duplicate = list.cloneNode(true);
      marquee.appendChild(duplicate);
    });
  });

  // Create an IntersectionObserver to check if the marquee container is in view
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.querySelectorAll('[data-css-marquee-list]').forEach(list => 
        list.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
      );
    });
  }, { threshold: 0 });
  
  // Calculate the width and set the animation duration accordingly
  marquees.forEach(marquee => {
    marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
      list.style.animationDuration = (list.offsetWidth / pixelsPerSecond) + 's';
      list.style.animationPlayState = 'paused';
    });
    observer.observe(marquee);
  });
}

// Initialize CSS Marquee
initCSSMarquee();

/* Activities scrolling cards */
if (window.matchMedia('(min-width: 991px)').matches) {
function initActivitiesAnimation() {

  gsap.utils.toArray(".activities-item").forEach((item, index) => {
    const topOffset = 10 + index * 10;
    gsap.set(item, { top: `${topOffset}%` });

    gsap.to(item, {
      scale: 0.75,
      ease: "none",
      scrollTrigger: {
        trigger: ".activities-list",
        start: "top 10%",
        end: "bottom 10%",
        scrub: true,
      }
    });
  });
}

initActivitiesAnimation();
}

/* Aniv Marquee with scroll direction */
function initMarqueeScrollDirection() {
  document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
    // Query marquee elements
    const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
    const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
    if (!marqueeContent || !marqueeScroll) return;

    // Get data attributes
    const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;

    // Convert data attributes to usable types
    const marqueeSpeedAttr = parseFloat(speed);
    const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
    const duplicateAmount = parseInt(duplicate || 0);
    const scrollSpeedAttr = parseFloat(scrollSpeed);
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

    let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

    // Precompute styles for the scroll container
    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;

    // Duplicate marquee content
    if (duplicateAmount > 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < duplicateAmount; i++) {
        fragment.appendChild(marqueeContent.cloneNode(true));
      }
      marqueeScroll.appendChild(fragment);
    }

    // GSAP animation for marquee content
    const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
    const animation = gsap.to(marqueeItems, {
      xPercent: -100, // Move completely out of view
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    // Initialize marquee in the correct direction
    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr); // Set correct direction
    animation.play(); // Start animation immediately

    // Set initial marquee status
    marquee.setAttribute('data-marquee-status', 'normal');

    // ScrollTrigger logic for direction inversion
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1; // Scrolling down
        const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;

        // Update animation direction and marquee status
        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
        
      }
    });

    // Extra speed effect on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
  });
}

// Initialize Marquee with Scroll Direction
  initMarqueeScrollDirection();


/* Hide Schedule on scroll */
if (window.matchMedia('(min-width: 991px)').matches) {
const scheduleAnim = gsap.to(".schedule-block", {
    x: "23.1em",
    ease: "power2.inOut",
    duration: 1,
    paused: true
});

ScrollTrigger.create({
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        if (self.direction === 1) {
            scheduleAnim.play();
        } else {
            scheduleAnim.reverse();
        }
    }
});

// Extra ScrollTrigger to hide when hitting footer
ScrollTrigger.create({
    trigger: ".footer",
    start: "top bottom", // when footer starts to enter viewport from the bottom
    onEnter: () => gsap.set(".schedule-block", { display: "none" }),
    onLeaveBack: () => gsap.set(".schedule-block", { display: "flex" })
});

}

// if (window.matchMedia('(max-width: 991px)').matches) {

// function hideScheduleOnScroll() {
//   const heroSection = document.querySelector('.section_hero');
//   const schedule = document.querySelector('.schedule-block');

//   if (!heroSection || !schedule) return;

//   // Create the timeline
//   const tl = gsap.timeline({
//     scrollTrigger: {
//       trigger: heroSection,
//       start: "bottom bottom",   // when hero bottom hits viewport bottom
//       end: "bottom+=30% bottom", // adjust for how far you want fade to extend
//       scrub: true,               // smooth fade tied to scroll
//       toggleActions: "play none none reverse",
//     }
//   });

//   // Animate opacity
//   tl.to(schedule, {
//     opacity: 0,
//     ease: "none",
//   });

//   // When fully faded out, hide it completely
//   ScrollTrigger.create({
//     trigger: heroSection,
//     start: "bottom+=30% bottom",
//     onEnter: () => gsap.set(schedule, { display: "none" }),
//     onLeaveBack: () => gsap.set(schedule, { display: "flex" })
//   });
// }

// hideScheduleOnScroll();

// }

/* Hide Menu on scroll */
if (window.matchMedia('(min-width: 991px)').matches) {
const menuHide = gsap.to(".progress-nav", {
    y: "-20em",
    ease: "power2.inOut",
    duration: 1,
    paused: true
});

ScrollTrigger.create({
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
        // When scrolling down (direction is 1), play the animation forward.
        // When scrolling up (direction is -1), reverse the animation.
        if (self.direction === 1) {
            menuHide.play();
        } else {
            menuHide.reverse();
        }
    }
});
}

/* Events */
if (window.matchMedia('(min-width: 991px)').matches) {
  document.querySelectorAll(".events-item").forEach(item => {
    const bottomContent = item.querySelector(".events-item-bottom");

  gsap.set(bottomContent, {
    maxHeight: 0,
    opacity: 0
  });

    item.addEventListener("mouseenter", () => {
      gsap.to(bottomContent, {
        maxHeight: 300, // adjust this to fit your actual content
        opacity: 1,
        duration: 0.5,
        ease: "power3.out"
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(bottomContent, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut"
      });
    });
  });
}

/* FAQ */
function initAccordionCSS() {
  document.querySelectorAll('[data-accordion-css-init]').forEach((accordion) => {
    const closeSiblings = accordion.getAttribute('data-accordion-close-siblings') === 'true';

    accordion.addEventListener('click', (event) => {
      const toggle = event.target.closest('[data-accordion-toggle]');
      if (!toggle) return; // Exit if the clicked element is not a toggle

      const singleAccordion = toggle.closest('[data-accordion-status]');
      if (!singleAccordion) return; // Exit if no accordion container is found

      const isActive = singleAccordion.getAttribute('data-accordion-status') === 'active';
      singleAccordion.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      
      // When [data-accordion-close-siblings="true"]
      if (closeSiblings && !isActive) {
        accordion.querySelectorAll('[data-accordion-status="active"]').forEach((sibling) => {
          if (sibling !== singleAccordion) sibling.setAttribute('data-accordion-status', 'not-active');
        });
      }
    });
  });
}

// Initialize Accordion CSS
initAccordionCSS();

/* Modals */
function initModalBasic() {

  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');
  const body = document.querySelector('body');

  // Open modal
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');

      // Close all modals first
      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
      modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

      // Activate clicked modal
      document.querySelector(`[data-modal-target="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');
      document.querySelector(`[data-modal-name="${modalTargetName}"]`).setAttribute('data-modal-status', 'active');

      // Set group to active
      if (modalGroup) {
        modalGroup.setAttribute('data-modal-group-status', 'active');
      }

      updateScrollState();
    });
  });

  // Close modal
  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      closeAllModals();
      updateScrollState();
    });
  });

  // Close modal on `Escape` key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllModals();
      updateScrollState();
    }
  });

  // Function to close all modals
  function closeAllModals() {
    modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
    modals.forEach((modal) => modal.setAttribute('data-modal-status', 'not-active'));

    if (modalGroup) {
      modalGroup.setAttribute('data-modal-group-status', 'not-active');
    }
  }

  // Function to check modal state and control scroll
  function updateScrollState() {
    const isAnyModalActive = [...modals].some(modal => modal.getAttribute('data-modal-status') === 'active');

    if (isAnyModalActive) {
      body.classList.add('stop-scroll');
      if (typeof lenis !== 'undefined') lenis.stop();
    } else {
      body.classList.remove('stop-scroll');
      if (typeof lenis !== 'undefined') lenis.start();
    }
  }
}

initModalBasic();

/* Animate Stars on Scroll */
function animateStarsOnScroll() {
  const stars = document.querySelectorAll(".star-svg");

  stars.forEach((star, i) => {
    gsap.from(star, {
      y: -500 - i * 120,
      ease: "expo.out",
      scrollTrigger: {
        trigger: ".section_events",
        start: "top 65%",
        end: "85% 65%",
        scrub: true,
      }
    });
  });
}

animateStarsOnScroll();

/* Blob scale on scroll */
const blobs = document.querySelectorAll(".blob-wrap");
blobs.forEach((blob) => {
  gsap.from(blob, {
    scale: 0.7,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: blob,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

/* Filter FAQS */
function initFilterBasic() {
  // Find all filter groups on the page
  const groups = document.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300; // Delay for transition effect (in milliseconds)

    // Function to update the status and accessibility attributes of items
    const updateStatus = (element, shouldBeActive) => {
      // If the item should be active, set it to "active", otherwise "not-active"
      element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
      element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
    };

    // Function to handle filtering logic when a button is clicked
    const handleFilter = (target) => {
      // Loop through all items and ensure every item transitions out first
      items.forEach((item) => {
        const shouldBeActive = target === 'all' || item.getAttribute('data-filter-name') === target;
        const currentStatus = item.getAttribute('data-filter-status');

        // Only transition items currently visible (status: active)
        if (currentStatus === 'active') {
          item.setAttribute('data-filter-status', 'transition-out');
          // After the transition delay, set the final status
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          // For items not currently visible, simply update their status after the delay
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      // Update the active status for all buttons
      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false'); // Accessibility: indicate active state
      });
    };

    // Attach click event listeners to each button
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');

        // If the button is already active, do nothing
        if (button.getAttribute('data-filter-status') === 'active') return;

        // Trigger the filter logic with the selected target
        handleFilter(target);
      });
    });
  });
}

initFilterBasic();

/* Pricing Filter */
function initPricingFilter() {
  const wrapper = document.querySelector('.pricing-wrapper');
  if (!wrapper) return;

  const tabs = wrapper.querySelectorAll('.tabs');
  const desktopItems = wrapper.querySelectorAll('.price-item');
  const modals = wrapper.querySelectorAll('.price-modal-cms');

  const mobileItems = wrapper.querySelectorAll('.accordion-css__item.is--modal');

  const isMobileLayout = () => window.matchMedia('(max-width: 767px)').matches;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      tabs.forEach(t => t.setAttribute('data-filter-status', 'not-active'));
      tab.setAttribute('data-filter-status', 'active');
      // DESKTOP behavior
      if (!isMobileLayout()) {
        desktopItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          const isMatch = itemCat === category;
          item.setAttribute('data-filter-status', isMatch ? 'active' : 'not-active');
        });

        modals.forEach(modal => modal.setAttribute('data-filter-status', 'not-active'));

        desktopItems.forEach(item => item.classList.remove('is-active'));

        const defaultItem = wrapper.querySelector(`.price-item[data-category="${category}"][data-filter-status="active"]`);
        if (defaultItem) {
          const itemName = defaultItem.getAttribute('data-item');
          defaultItem.classList.add('is-active');
          const defaultModal = wrapper.querySelector(`.price-modal-cms[data-item="${itemName}"]`);
          if (defaultModal) defaultModal.setAttribute('data-filter-status', 'active');
        }
      }
      // MOBILE behavior
      else {
        mobileItems.forEach(acc => {
          const itemCat = acc.getAttribute('data-category');
          const isMatch = itemCat === category;
          acc.setAttribute('data-filter-status', isMatch ? 'active' : 'not-active');
        });
      }
    });
  });

  desktopItems.forEach(item => {
    item.addEventListener('click', () => {
      if (isMobileLayout()) return;
      const itemName = item.getAttribute('data-item');

      desktopItems.forEach(i => i.classList.remove('is-active'));
      item.classList.add('is-active');

      modals.forEach(modal => {
        const modalName = modal.getAttribute('data-item');
        modal.setAttribute('data-filter-status', modalName === itemName ? 'active' : 'not-active');
      });
    });
  });

  const defaultTab = wrapper.querySelector('.tabs[data-filter-status="active"]') || tabs[0];
  if (defaultTab) defaultTab.click();

  window.addEventListener('resize', () => {
    const activeTab = wrapper.querySelector('.tabs[data-filter-status="active"]');
    if (activeTab) activeTab.click();
  });
}

initPricingFilter();


/* Testimonials Slider */
function initSwiperSlider() {  
  const swiperSliderGroups = document.querySelectorAll("[data-swiper-group]");
  
  swiperSliderGroups.forEach((swiperGroup) => {
    const swiperSliderWrap = swiperGroup.querySelector("[data-swiper-wrap]");
    if(!swiperSliderWrap) return;
    
    const prevButton = swiperGroup.querySelector("[data-swiper-prev]");
    const nextButton = swiperGroup.querySelector("[data-swiper-next]");
    
    const swiper = new Swiper(swiperSliderWrap, {
      slidesPerView: 1.25,
      speed: 600,
      mousewheel: false,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 3500,
      },
      breakpoints: {
        // when window width is >= 480px
        480: {
          slidesPerView: 1.5,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 2.25,
        }
      },
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },    
      keyboard: {
        enabled: true,
        onlyInViewport: false,
      },      
    });    
    
  });
}

initSwiperSlider();
