 // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) link.classList.add('active');
      });
    });

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Counter animation
    function animateCounter(el) {
      const target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 30);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + '+';
        if (count >= target) clearInterval(timer);
      }, 40);
    }

    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.stat-number').forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) statsObserver.observe(statsSection);

    // Form submit
    function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.textContent = 'Message Sent! ✓';
      btn.style.background = '#2d7a3a';
      setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; e.target.reset(); }, 3000);
    }

    // Settings — accent color
    function setAccent(color, dim) {
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--accent-dim', dim);
    }

    // Settings — dark/light toggle
    const themeToggle = document.getElementById('themeToggle');
    const toggleThumb = document.getElementById('toggleThumb');
    if (themeToggle) {
      themeToggle.addEventListener('change', function() {
        if (!this.checked) {
          document.documentElement.style.setProperty('--bg', '#f5f5f5');
          document.documentElement.style.setProperty('--surface', '#ebebeb');
          document.documentElement.style.setProperty('--card', '#ffffff');
          document.documentElement.style.setProperty('--text', '#111111');
          document.documentElement.style.setProperty('--muted', '#666666');
          document.documentElement.style.setProperty('--border', '#dddddd');
          toggleThumb.style.transform = 'translateX(0)';
        } else {
          document.documentElement.style.setProperty('--bg', '#0d0d0d');
          document.documentElement.style.setProperty('--surface', '#151515');
          document.documentElement.style.setProperty('--card', '#181818');
          document.documentElement.style.setProperty('--text', '#f0f0f0');
          document.documentElement.style.setProperty('--muted', '#888888');
          document.documentElement.style.setProperty('--border', '#222222');
          toggleThumb.style.transform = 'translateX(20px)';
        }
      });
    }

    // Settings — reduce animations
    const animToggle = document.getElementById('animToggle');
    const animThumb = document.getElementById('animThumb');
    const animTrack = document.getElementById('animTrack');
    if (animToggle) {
      animToggle.addEventListener('change', function() {
        if (this.checked) {
          document.querySelectorAll('.reveal').forEach(el => el.style.transition = 'none');
          animThumb.style.transform = 'translateX(20px)';
          animTrack.style.background = 'var(--accent)';
        } else {
          document.querySelectorAll('.reveal').forEach(el => el.style.transition = '');
          animThumb.style.transform = 'translateX(0)';
          animTrack.style.background = 'var(--border)';
        }
      });
    }

    // ── FEEDBACK STAR PICKER ──
    let selectedRating = 0;
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= +star.dataset.val));
      });
      star.addEventListener('mouseout', () => {
        stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= selectedRating));
      });
      star.addEventListener('click', () => {
        selectedRating = +star.dataset.val;
        stars.forEach(s => s.classList.toggle('active', +s.dataset.val <= selectedRating));
      });
    });

    function submitFeedback() {
      const name = document.getElementById('fbName').value.trim();
      const role = document.getElementById('fbRole').value.trim();
      const text = document.getElementById('fbText').value.trim();
      if (!name || !text || selectedRating === 0) {
        alert('Please fill in your name, feedback, and rating!');
        return;
      }
      const starStr = '★'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);
      const initial = name.charAt(0).toUpperCase();

      const card = document.createElement('div');
      card.className = 'fcard reveal visible';
      card.style.animation = 'fadeInUp 0.4s ease forwards';
      card.innerHTML = `
        <div class="fcard-stars">${starStr}</div>
        <p class="fcard-text">"${text}"</p>
        <div class="fcard-author">
          <div class="fcard-avatar">${initial}</div>
          <div>
            <p class="fcard-name">${name}</p>
            <p class="fcard-role">${role || 'Visitor'}</p>
          </div>
        </div>`;

      document.getElementById('feedbackList').appendChild(card);

      // Reset form
      document.getElementById('fbName').value = '';
      document.getElementById('fbRole').value = '';
      document.getElementById('fbText').value = '';
      selectedRating = 0;
      stars.forEach(s => s.classList.remove('active'));

      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }