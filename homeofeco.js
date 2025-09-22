// Section navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.content-section');
  
  // Get hamburger elements
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  // Function to switch sections
  function switchSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
  
  // Add click event listeners to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.dataset.section;
      switchSection(sectionId);
    });
  });
  
  // Add click event listener to hamburger menu
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  
  // Add entrance animation for text elements in all sections
  function animateTextElements() {
    const allTextElements = document.querySelectorAll('h1, h2, p');
    
    allTextElements.forEach(function(element, index) {
      // Apply initial styles for animation
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      
      // Stagger the animations
      setTimeout(function() {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 300 + (index * 100));
    });
  }
  
  // Run text animations for the initially visible section
  animateTextElements();
  
  // Re-run text animations when switching sections
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(animateTextElements, 100);
    });
  });
  
  // Initialize overlay background
  const overlayBackground = document.querySelector('.overlay-background');
  if (overlayBackground) {
    overlayBackground.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
  }
});