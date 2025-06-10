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
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { navLinks.forEach(link => link.classList.remove('active')); const sectionId = entry.target.id; const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`); if (activeLink) activeLink.classList.add('active'); } }); }, { threshold: 0.1 }); // Adjusted threshold for long sections
    sections.forEach(section => observer.observe(section));
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => { if (window.scrollY > 400) { scrollToTopBtn.classList.remove('opacity-0', 'invisible'); } else { scrollToTopBtn.classList.add('opacity-0', 'invisible'); } });

    const projectsData = [
        {
            title: "Job Search App",
            image: "images/job-search.jpeg",
            description: "A dynamic application to search for job opportunities across Sweden, fetching data from arbetsformedlingen search API.",
            tags: ["React", "JavaScript", "API"],
            date: "2025-05-20",
            liveLink: "https://purple-island-003ff5e10.6.azurestaticapps.net/",
            repoLink: "https://github.com/sujithmu/Job-Search-App"
        },
        {
            title: "FPL-Player-Guru",
            image: "images/fpl-guru.png",
            description: "A Fantasy Premier League player performance analytics app.",
            tags: ["Nextjs", "React", "Analytics"],
            date: "2025-06-10",
            liveLink: "https://brave-bush-0589df31e.6.azurestaticapps.net/",
            repoLink: "https://github.com/sujithmu/FPL-Player-Guru"
        },
        {
            title: "Portfolio Website",
            image: "images/portfolio.png",
            description: "My personal portfolio website built with modern web technologies, featuring a clean UI and dynamic content.",
            tags: ["JavaScript", "HTML", "CSS", "Tailwind"],
            date: "2025-06-09",
            liveLink: "https://portfolio-ebon-gamma-ohtl61ezmu.vercel.app/",
            repoLink: "https://github.com/sujithmu/portfolio"
        },
        {
            title: "Travel-Itinerary-Plus",
            image: "images/travel-itinerary.png",
            description: "A Gemini AI Powered Travel Intinerary app.",
            tags: ["TypeScript", "Nextjs", "HTML", "CSS", "Tailwind"],
            date: "2025-06-05",
            liveLink: "https://zealous-hill-011decf1e.6.azurestaticapps.net/",
            // repoLink: "https://github.com/sujithmu/portfolio"
        }
    ];
    
    let currentProjects = [...projectsData];
    let sortAscending = false;

    const projectsGrid = document.getElementById('projects-grid');
    const noResultsDiv = document.getElementById('no-results');

    const renderProjects = (projects) => {
        projectsGrid.innerHTML = '';
        if (projects.length === 0) {
            noResultsDiv.classList.remove('hidden');
        } else {
            noResultsDiv.classList.add('hidden');
        }
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group';
            projectCard.innerHTML = `
                <div class="relative">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover" data-hover-src="${project.image}">
                    <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="text-center text-white p-4">
                            <h4 class="font-bold text-lg">${project.title}</h4>
                            <div class="mt-2 flex flex-wrap gap-2 justify-center">
                                ${project.tags.map(tag => `<span class="bg-gray-700 text-xs font-semibold px-2 py-1 rounded">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-6">
                    <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">${project.description}</p>
                    <div class="flex justify-between items-center">
                        <a href="${project.liveLink}" target="_blank" class="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline">Live Demo</a>
                        <a href="${project.repoLink}" target="_blank" class="font-bold text-sm text-gray-700 dark:text-gray-300 hover:underline">GitHub</a>
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
            if (filter === 'all') {
                currentProjects = [...projectsData];
            } else {
                currentProjects = projectsData.filter(project => project.tags.includes(filter));
            }
            renderProjects(currentProjects);
        });
    });

    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', () => {
        sortAscending = !sortAscending;
        currentProjects.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortAscending ? dateA - dateB : dateB - dateA;
        });
        renderProjects(currentProjects);
    });

    const hoverContainer = document.getElementById('hover-image-container');
    const hoverImage = document.getElementById('hover-image');

    projectsGrid.addEventListener('mousemove', (e) => {
        if (e.target.closest('.project-card img')) {
             hoverContainer.style.left = `${e.clientX}px`;
             hoverContainer.style.top = `${e.clientY}px`;
        }
    });

    projectsGrid.addEventListener('mouseover', (e) => {
        const img = e.target.closest('.project-card img');
        if (img) {
            hoverImage.src = img.dataset.hoverSrc;
            hoverContainer.classList.remove('opacity-0');
        }
    });

    projectsGrid.addEventListener('mouseout', (e) => {
        if (e.target.closest('.project-card img')) {
            hoverContainer.classList.add('opacity-0');
        }
    });
    
    renderProjects(projectsData);
});