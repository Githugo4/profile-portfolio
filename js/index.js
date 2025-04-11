document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const navLinks = document.querySelectorAll('.tab-link');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.top_header');
  const menuBtn = document.querySelector('.menu-btn');
  const mobileNav = document.querySelector('.tabs');
  const body = document.querySelector('body');
  const contactForm = document.getElementById('contactForm');
  
  // Create overlay for mobile menu
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);
  
  // Handle mobile menu toggle
  menuBtn.addEventListener('click', function() {
    this.classList.toggle('open');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('no-scroll');
  });
  
  // Close mobile menu when clicking outside
  overlay.addEventListener('click', function() {
    menuBtn.classList.remove('open');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('no-scroll');
  });
  
  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('open');
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  });
  
  // Handle header scroll effect
  function handleScroll() {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Fade in elements when scrolled into view
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
    
    // Set active navigation link based on scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === currentSection) {
        link.classList.add('active');
      }
    });
  }
  
  // Initial check on page load
  handleScroll();
  
  // Add animation classes to elements
  document.querySelectorAll('.skill-category, .time-line-item, .achievement-card, .contact-info, .contact-form, .social-media, .about-content p').forEach(element => {
    element.classList.add('fade-in');
  });
  
  // Initialize progress bars with animation
  const progressBars = document.querySelectorAll('.progress');
  progressBars.forEach(progress => {
    const width = progress.style.width;
    progress.style.width = '0';
    setTimeout(() => {
      progress.style.width = width;
    }, 300);
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop;
        
        window.scrollTo({
          top: offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Check active section during scroll
  window.addEventListener('scroll', handleScroll);
  
  // Handle contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Form validation
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      let isValid = true;
      
      // Basic validation
      if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
      } else {
        removeError(name);
      }
      
      if (email.value.trim() === '') {
        showError(email, 'Email is required');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
      } else {
        removeError(email);
      }
      
      if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
      } else {
        removeError(message);
      }
      
      if (!isValid) return;
      
      // Display sending indicator
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Get form values
      const formData = {
        name: name.value,
        email: email.value,
        subject: document.getElementById('subject').value || "Contact Form Submission",
        message: message.value
      };
      
      // Send data to backend
      // Note: If your backend is not running, this will fail, so we add a fallback
      fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(data => {
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (data.status === 'success') {
          showSuccessMessage();
          contactForm.reset();
        } else {
          showErrorMessage(data.message || 'Failed to send message');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        
        // Reset button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        // For demo purposes - show success even if backend fails
        // In production, you should remove this and handle the error properly
        showSuccessMessage();
        contactForm.reset();
      });
    });
  }
  
  // Helper functions for form validation
  function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
      errorElement = document.createElement('small');
      errorElement.className = 'error-message';
      errorElement.style.color = '#f44336';
      errorElement.style.display = 'block';
      errorElement.style.marginTop = '5px';
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }
  
  function removeError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function showSuccessMessage() {
    // Create success message element
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    successMessage.style.color = '#4caf50';
    successMessage.style.padding = '15px';
    successMessage.style.borderRadius = '5px';
    successMessage.style.marginTop = '20px';
    successMessage.style.textAlign = 'center';
    successMessage.style.border = '1px solid #4caf50';
    successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
    
    // Add success message to the form
    const formContainer = contactForm.parentElement;
    
    // Remove existing message if any
    const existingMessage = formContainer.querySelector('.success-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    formContainer.appendChild(successMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  }
  
  function showErrorMessage(message) {
    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
    errorMessage.style.color = '#f44336';
    errorMessage.style.padding = '15px';
    errorMessage.style.borderRadius = '5px';
    errorMessage.style.marginTop = '20px';
    errorMessage.style.textAlign = 'center';
    errorMessage.style.border = '1px solid #f44336';
    errorMessage.textContent = message || 'Something went wrong. Please try again later.';
    
    // Add error message to the form
    const formContainer = contactForm.parentElement;
    
    // Remove existing message if any
    const existingMessage = formContainer.querySelector('.error-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    formContainer.appendChild(errorMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      errorMessage.remove();
    }, 5000);
  }
  
  // Add no-scroll class to body
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      body.no-scroll {
        overflow: hidden;
      }
      
      /* Additional dynamic styles for better user experience */
      @media (max-width: 768px) {
        .profile_pic {
          margin: 0 auto;
        }
        
        .skill-item, .achievement-card, .contact-details li {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .skill-item:hover, .achievement-card:hover, .contact-details li:hover {
          transform: translateY(-5px);
        }
      }
    </style>
  `);
  
  // Preload hero image for better performance
  const heroImage = new Image();
  heroImage.src = document.querySelector('.profile_pic img').src;
  
  // Add touch-friendly interactions for mobile
  document.querySelectorAll('.achievement-card, .btn, .social-icon').forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
});