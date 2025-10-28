document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const updateIcons = (isDark) => { if (isDark) { themeToggleLightIcon.classList.remove('hidden'); themeToggleDarkIcon.classList.add('hidden'); } else { themeToggleDarkIcon.classList.remove('hidden'); themeToggleLightIcon.classList.add('hidden'); } };
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isCurrentlyDark;
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) { document.documentElement.classList.add('dark'); isCurrentlyDark = true; } else { document.documentElement.classList.remove('dark'); isCurrentlyDark = false; }
    updateIcons(isCurrentlyDark);
    themeToggleBtn.addEventListener('click', () => { const isDark = document.documentElement.classList.toggle('dark'); updateIcons(isDark); localStorage.setItem('theme', isDark ? 'dark' : 'light'); });
    
    const typingText = document.getElementById('typing-text');
    const textToType = "Sujith";
    let charIndex = 0;
    typingText.textContent = '';
    function type() { if (charIndex < textToType.length) { typingText.textContent += textToType.charAt(charIndex); charIndex++; setTimeout(type, 150); } }
    type();
    
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { navLinks.forEach(link => link.classList.remove('active')); const sectionId = entry.target.id; const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`); if (activeLink) activeLink.classList.add('active'); } }); }, { threshold: 0.1 });
    sections.forEach(section => observer.observe(section));
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => { if (window.scrollY > 400) { scrollToTopBtn.classList.remove('opacity-0', 'invisible'); } else { scrollToTopBtn.classList.add('opacity-0', 'invisible'); } });

    const projectsData = [
        { title: "Job Search App", image: "images/job-search.jpeg", description: "A dynamic application to search for job opportunities across Sweden, fetching data from arbetsformedlingen search API.", tags: ["React", "JavaScript", "API"], date: "2025-05-20", liveLink: "https://purple-island-003ff5e10.6.azurestaticapps.net/", repoLink: "https://github.com/sujithmu/Job-Search-App" },
        { title: "FPL-Player-Guru", image: "images/fpl-guru.png", description: "A Fantasy Premier League player performance analytics app.", tags: ["Nextjs", "React", "Analytics"], date: "2025-06-10", liveLink: "https://brave-bush-0589df31e.6.azurestaticapps.net/", repoLink: "https://github.com/sujithmu/FPL-Player-Guru" },
        { title: "Portfolio Website", image: "images/portfolio.png", description: "My personal portfolio website built with modern web technologies, featuring a clean UI and dynamic content.", tags: ["JavaScript", "HTML", "CSS", "Tailwind"], date: "2025-06-09", liveLink: "https://portfolio-ebon-gamma-ohtl61ezmu.vercel.app/", repoLink: "https://github.com/sujithmu/portfolio" },
        { title: "Travel-Itinerary-Plus", image: "images/travel-itinerary.png", description: "A Gemini AI Powered Travel Intinerary app.", tags: ["TypeScript", "Nextjs", "HTML", "CSS", "Tailwind"], date: "2025-06-05", liveLink: "https://zealous-hill-011decf1e.6.azurestaticapps.net/", repoLink: "https://github.com/sujithmu/Travel-Itinerary-Plus" },
         { title: "Premier League Match Predictor", image: "images/Premier-League-Predictor-Pro.png", description: "A Streamlit web app using ML to predict Premier League match outcomes, deployed on Render.", tags: ["Python", "Streamlit"], date: "2025-10-06", liveLink: "https://premier-league-predictor-app.onrender.com/", repoLink: "" },
    ];
    
    let currentProjects = [...projectsData];
    let sortAscending = false;

    const projectsGrid = document.getElementById('projects-grid');
    const noResultsDiv = document.getElementById('no-results');

    const renderProjects = (projects) => {
        projectsGrid.innerHTML = '';
        if (projects.length === 0) { noResultsDiv.classList.remove('hidden'); } else { noResultsDiv.classList.add('hidden'); }
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group';
            
            const repoLinkHTML = project.repoLink 
                ? `<a href="${project.repoLink}" target="_blank" class="font-bold text-sm text-gray-700 dark:text-gray-300 hover:underline">GitHub</a>`
                : '';

            projectCard.innerHTML = `
                <div class="relative">
                    <img src="${project.image}" alt="${project.title}" class="project-image-toggle w-full h-48 object-cover cursor-pointer" data-hover-src="${project.image}">
                    
                    <!-- === FIX IS HERE === -->
                    <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        
                        <div class="text-center text-white p-4">
                            <h4 class="font-bold text-lg">${project.title}</h4>
                            <div class="mt-2 flex flex-wrap gap-2 justify-center">
                                ${project.tags.map(tag => `<span class="bg-gray-700 text-xs font-semibold px-2 py-1 rounded">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <p class="project-description text-gray-600 dark:text-gray-400 text-sm">${project.description}</p>
                    <div class="flex justify-between items-center mt-4">
                        <a href="${project.liveLink}" target="_blank" class="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">Live Demo</a>
                        ${repoLinkHTML}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    };

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.dataset.filter;
            if (filter === 'all') { currentProjects = [...projectsData]; } else { currentProjects = projectsData.filter(project => project.tags.includes(filter)); }
            renderProjects(currentProjects);
        });
    });

    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', () => {
        sortAscending = !sortAscending;
        currentProjects.sort((a, b) => { const dateA = new Date(a.date); const dateB = new Date(b.date); return sortAscending ? dateA - dateB : dateB - a; }); // Typo fix: b.date
        renderProjects(currentProjects);
    });

    projectsGrid.addEventListener('click', (e) => {
        const imageToggle = e.target.closest('.project-image-toggle');
        if (imageToggle) {
            const card = imageToggle.closest('.project-card');
            if (card) {
                const description = card.querySelector('.project-description');
                if (description) {
                    description.classList.toggle('expanded');
                }
            }
        }
    });
    renderProjects(projectsData);

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const object = {};
        formData.forEach((value, key) => {
            object[key] = value;
        });
        const json = JSON.stringify(object);
        formStatus.innerHTML = "Sending...";
        formStatus.classList.remove('text-green-500', 'text-red-500');

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                formStatus.innerHTML = jsonResponse.message || "Form submitted successfully!";
                formStatus.classList.add('text-green-500');
            } else {
                formStatus.innerHTML = jsonResponse.message || "Something went wrong.";
                formStatus.classList.add('text-red-500');
            }
        })
        .catch(error => {
            console.log(error);
            formStatus.innerHTML = "Something went wrong.";
            formStatus.classList.add('text-red-500');
        })
        .then(function () {
            contactForm.reset();
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        });
    });

    const sectionPopupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeSection = entry.target;

                document.querySelectorAll('.page-section').forEach(section => {
                    section.classList.remove('section-active');
                });

                activeSection.classList.add('section-active');
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.page-section').forEach(section => {
        sectionPopupObserver.observe(section);
    });

    // ===== FULLSCREEN CV LOGIC =====
    const cvContainer = document.getElementById('cv-container');
    const fullscreenBtn = document.getElementById('fullscreen-cv-btn');
    const maximizeIcon = document.getElementById('maximize-icon');
    const minimizeIcon = document.getElementById('minimize-icon');

    // Check if the elements exist on the page before adding listeners
    if (cvContainer && fullscreenBtn) {
        
        // Function to enter fullscreen
        const openFullscreen = (elem) => {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
        };
        
        // Function to exit fullscreen
        const closeFullscreen = () => {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        };

        // Click event for the button
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                openFullscreen(cvContainer);
            } else {
                closeFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                maximizeIcon.classList.add('hidden');
                minimizeIcon.classList.remove('hidden');
            } else {
                minimizeIcon.classList.add('hidden');
                maximizeIcon.classList.remove('hidden');
            }
        });
    }

    // ===== CHATBOT LOGIC =====
    const chatWindow = document.getElementById('chat-window');
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggleBtn && chatWindow && chatCloseBtn) {
        const openChat = () => chatWindow.classList.remove('hidden');
        const closeChat = () => chatWindow.classList.add('hidden');

        // Toggle and Close button events
        chatToggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('hidden');
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
            }
        });
        chatCloseBtn.addEventListener('click', closeChat);

        const sendMessage = async () => {
            const message = chatInput.value.trim();
            if (message === '') return;

            const userMsgHtml = `<div class="flex justify-end"><span class="bg-blue-500 text-white text-sm px-3 py-2 rounded-lg max-w-xs">${message}</span></div>`;
            chatMessages.innerHTML += userMsgHtml;
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const typingIndicatorHtml = `<div id="typing-indicator" class="flex justify-start"><span class="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-2 rounded-lg">Sujith is typing...</span></div>`;
            chatMessages.innerHTML += typingIndicatorHtml;
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                });

                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }

                const data = await response.json();
                const botReply = data.reply || "Sorry, I couldn't understand that.";

                document.getElementById('typing-indicator').remove();
                const botMsgHtml = `<div class="flex justify-start"><span class="bg-gray-200 dark:bg-gray-700 text-sm px-3 py-2 rounded-lg max-w-xs">${botReply}</span></div>`;
                chatMessages.innerHTML += botMsgHtml;
                chatMessages.scrollTop = chatMessages.scrollHeight;

            } catch (error) {
                console.error("Chat error:", error);
                document.getElementById('typing-indicator')?.remove();
                const errorMsgHtml = `<div class="flex justify-start"><span class="bg-red-500 text-white text-sm px-3 py-2 rounded-lg max-w-xs">Error: Could not connect.</span></div>`;
                chatMessages.innerHTML += errorMsgHtml;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

});