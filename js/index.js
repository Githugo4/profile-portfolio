document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state handling
    const navLinks = document.querySelectorAll('.tab-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Set active class based on scroll position
    function setActiveLink() {
      let index = sections.length;
      
      while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
      
      navLinks.forEach(link => link.classList.remove('active'));
      
      if (navLinks[index]) {
        navLinks[index].classList.add('active');
      }
    }
    
    // Initial check on page load
    setActiveLink();
    
    // Check active section during scroll
    window.addEventListener('scroll', setActiveLink);
    
    // Also set active class when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Display sending indicator
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Get form values
        const formData = {
          name: document.getElementById('name').value,
          email: document.getElementById('email').value,
          subject: document.getElementById('subject').value || "Contact Form Submission",
          message: document.getElementById('message').value
        };
        
        // Send data to the Python backend
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
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
          } else {
            alert('Sorry, there was an error sending your message. Please try again later.');
            console.error(data.message);
          }
        })
        .catch(error => {
          // Reset button
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
          
          console.error('Error:', error);
          alert('Sorry, there was an error sending your message. Please try again later.');
        });
      });
    }
  });