const slider = document.querySelector('.slider');

function activate(e) {
  const items = document.querySelectorAll('.item');
  e.target.matches('.next') && slider.append(items[0])
  e.target.matches('.prev') && slider.prepend(items[items.length-1]);
}

document.addEventListener('click',activate,false);

const eventsData = [
  {
    id: 1,
    title: "AKUMS Health Week 2025",
    subtitle: "Empowering student-led healthcare innovation",
    date: "2025-03-12",
    time: "9:00 AM – 5:00 PM",
    location: "Main Hall, Kenyatta University",
    organizer: "AKUMS Exec",
    description: "A three-day program combining hands-on workshops, research showcases, and community outreach. Expect keynote speakers, student poster sessions, practical skills labs, and a community screening drive. Ideal for students interested in clinical skills, public health, and research collaboration.",
    image: "/assets/images/eventsample2.jpg",
    status: "upcoming",
    category: "conference",
    chips: ["🎤 Guest Speakers", "🧪 Research Showcase", "🤝 Networking", "📜 Certificates"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 2,
    title: "Social Mixer 2025",
    subtitle: "Networking and fun activities",
    date: "2025-04-10",
    time: "4:00 PM – 8:00 PM",
    location: "Student Lounge, KU",
    organizer: "AKUMS Social Team",
    description: "Casual gathering for students to connect, relax, and enjoy interactive games and activities.",
    image: "/assets/images/placeholder.png",
    status: "coming-soon",
    category: "social",
    chips: ["🍹 Refreshments", "🎶 Music", "🤝 Meet Peers"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 3,
    title: "Leadership Bootcamp",
    subtitle: "Developing future medical leaders",
    date: "2025-05-05",
    time: "10:00 AM – 4:00 PM",
    location: "Conference Room A, KU",
    organizer: "AKUMS Leadership Team",
    description: "Intensive training on leadership, decision-making, and project management for student leaders.",
    image: "/assets/images/placeholder.png",
    status: "next-up",
    category: "leadership",
    chips: ["📚 Workshops", "🗣️ Speaker Panels", "📝 Skill Development"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 4,
    title: "Clinical Skills Workshop",
    subtitle: "Hands-on patient care techniques",
    date: "2025-03-25",
    time: "9:00 AM – 2:00 PM",
    location: "Medical Skills Lab, KU",
    organizer: "AKUMS Academic Team",
    description: "Practice essential clinical skills including vitals, injections, and patient communication in a guided workshop.",
    image: "/assets/images/placeholder.png",
    status: "hot",
    category: "workshop",
    chips: ["🩺 Practical Skills", "👩‍⚕️ Expert Mentors", "📜 Certificates"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 5,
    title: "Mental Health & Wellness Day",
    subtitle: "Fun, fitness, and relaxation",
    date: "2025-06-01",
    time: "8:00 AM – 3:00 PM",
    location: "Sports Complex, KU",
    organizer: "AKUMS Wellness Team",
    description: "Outdoor fitness, yoga, mindfulness sessions, and interactive games to promote student wellbeing.",
    image: "/assets/images/placeholder.png",
    status: "coming-soon",
    category: "fun",
    chips: ["🧘 Yoga", "🏃‍♂️ Fitness Challenges", "🎨 Creative Workshops"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 6,
    title: "Past Research Symposium 2024",
    subtitle: "Showcasing last year’s student research",
    date: "2024-11-20",
    time: "10:00 AM – 4:00 PM",
    location: "Auditorium, KU",
    organizer: "AKUMS Research Team",
    description: "Highlights from student research projects, poster presentations, and expert discussions.",
    image: "/assets/images/placeholder.png",
    status: "past",
    category: "conference",
    chips: ["📜 Certificates", "📊 Research Posters", "🎤 Presentations"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: true
  },
  {
    id: 7,
    title: "Public Health Outreach",
    subtitle: "Community screening and education",
    date: "2025-07-15",
    time: "8:00 AM – 12:00 PM",
    location: "Local Health Center",
    organizer: "AKUMS Outreach Team",
    description: "Volunteering for health screenings, awareness campaigns, and educational activities in the community.",
    image: "/assets/images/placeholder.png",
    status: "upcoming",
    category: "outreach",
    chips: ["🩺 Screenings", "📚 Education", "🤝 Volunteering"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 8,
    title: "Medical Quiz Night",
    subtitle: "Test your knowledge in a fun way",
    date: "2025-04-20",
    time: "5:00 PM – 8:00 PM",
    location: "Student Lounge, KU",
    organizer: "AKUMS Social Team",
    description: "Join teams and compete in a quiz covering medical trivia, current research, and problem-solving.",
    image: "/assets/images/placeholder.png",
    status: "hot",
    category: "fun",
    chips: ["🧠 Trivia", "🎁 Prizes", "🎶 Music"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 9,
    title: "Board Governance Training",
    subtitle: "For student leaders",
    date: "2025-05-22",
    time: "9:00 AM – 3:00 PM",
    location: "Meeting Room 2, KU",
    organizer: "AKUMS Leadership Team",
    description: "Training student leaders on board management, governance, and team coordination.",
    image: "/assets/images/placeholder.png",
    status: "next-up",
    category: "leadership",
    chips: ["📜 Policies", "🗂️ Case Studies", "🤝 Networking"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 10,
    title: "Telemedicine Workshop",
    subtitle: "Virtual patient care techniques",
    date: "2025-03-30",
    time: "10:00 AM – 1:00 PM",
    location: "Computer Lab, KU",
    organizer: "AKUMS Academic Team",
    description: "Hands-on training on telemedicine platforms and remote consultations.",
    image: "/assets/images/placeholder.png",
    status: "coming-soon",
    category: "workshop",
    chips: ["💻 Virtual Clinics", "🩺 Patient Simulations", "📜 Certificates"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 11,
    title: "Spring Social Bash",
    subtitle: "Fun and games with peers",
    date: "2025-05-18",
    time: "6:00 PM – 10:00 PM",
    location: "Student Lounge, KU",
    organizer: "AKUMS Social Team",
    description: "Games, dance, music, and refreshments for students to unwind and connect.",
    image: "/assets/images/placeholder.png",
    status: "next-up",
    category: "social",
    chips: ["🎶 Music", "🎲 Games", "🍕 Snacks"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  },
  {
    id: 12,
    title: "Annual Cardiology Conference",
    subtitle: "Advances in cardiology",
    date: "2025-06-10",
    time: "9:00 AM – 5:00 PM",
    location: "Conference Hall, KU",
    organizer: "AKUMS Exec",
    description: "Discussing new research, treatments, and collaborations in cardiology.",
    image: "/assets/images/placeholder.png",
    status: "coming-soon",
    category: "conference",
    chips: ["🎤 Keynote Speakers", "📝 Workshops", "🤝 Networking"],
    brochure: "/assets/docs/healthweek-brochure.pdf",
    isPast: false
  }
];


function renderEvents(filter = 'all') {
  const container = document.getElementById('events-container-entry');
  if (!container) return;
  container.innerHTML = '';

  let filtered = eventsData;
  if (filter !== 'all') {
    filtered = eventsData.filter(
      event => event.status === filter || event.category === filter
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = '<p>No events found.</p>';
    return;
  }

  filtered.forEach(event => {
    const card = document.createElement('article');
    card.className = 'event-card-entry';
    card.innerHTML = `
      <!-- IMAGE -->
      <div class="event-static-image">
        <img src="${event.image}" alt="${event.title}" loading="lazy" style="width:100%; height:auto; border-radius:12px; object-fit:cover;">
      </div>

      <!-- BODY -->
      <div class="event-body">
        <header class="event-header">
          <h3 class="event-title">${event.title}</h3>
          <p class="event-subtitle">${event.subtitle || ''}</p>
        </header>

        <ul class="event-info">
          <li><strong>${new Date(event.date).toLocaleDateString()}</strong><small> • ${event.time || ''}</small></li>
          <li><strong>${event.location}</strong></li>
          <li><strong>${event.organizer}</strong></li>
        </ul>

        <p class="event-desc">${event.description}</p>

        <div class="event-chips">
          ${event.chips.map(chip => `<span class="chip">${chip}</span>`).join('')}
        </div>

        <div class="event-cta">
          ${event.brochure ? `<a href="${event.brochure}" class="btn ghost" download>Download Brochure</a>` : ''}
        </div>
      </div>

      <div class="event-footer">
        <span class="status ${event.status}">${event.status.replace('-', ' ').toUpperCase()}</span>
        <div class="tiny-sponsors">
          <img src="/assets/images/IFMSA_logo_horizontal_blue.webp" alt="IFMSA logo" class="tiny-logo" loading="lazy">
          <img src="/assets/images/msakelogo.png" alt="Kenyatta University logo" class="tiny-logo" loading="lazy">
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Initialize navigation buttons
function initEventButtons() {
  const navButtons = document.querySelectorAll('.nav-btn');
  if (!navButtons) return;

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-category');
      renderEvents(filter);
    });
  });

  // Initial render
renderEvents('next-up');
}

// Export a single init function
export function init() {
  initEventButtons();
}

