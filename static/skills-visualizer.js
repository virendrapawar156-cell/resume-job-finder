/**
 * Skills Visualizer - Interactive skills visualization and filtering
 */

class SkillsVisualizer {
  constructor() {
    this.skills = [];
    this.skillCategories = {
      'languages': ['python', 'javascript', 'java', 'c++', 'c#', 'ruby', 'php', 'golang', 'rust', 'kotlin', 'swift'],
      'frameworks': ['react', 'vue', 'angular', 'django', 'flask', 'express', 'spring', 'laravel', 'rails'],
      'databases': ['sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra'],
      'tools': ['docker', 'kubernetes', 'jenkins', 'git', 'jira', 'aws', 'azure', 'gcp'],
      'other': []
    };
    this.selectedSkills = new Set();
    this.init();
  }

  init() {
    this.enhanceSkillChips();
    this.createSkillsChart();
    this.setupSkillFilters();
  }

  enhanceSkillChips() {
    const chips = document.querySelectorAll('.chip');
    chips.forEach((chip, index) => {
      const skill = chip.textContent.toLowerCase();
      const category = this.categorizeSkill(skill);

      chip.className = `chip chip-${category}`;
      chip.setAttribute('data-skill', skill);
      chip.setAttribute('data-category', category);
      chip.setAttribute('data-index', index);

      // Add click to filter
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSkillFilter(chip);
      });

      // Add hover tooltip
      this.addSkillTooltip(chip, skill, category);

      this.skills.push(skill);
    });

    this.updateSkillsCount();
  }

  categorizeSkill(skill) {
    for (const [category, items] of Object.entries(this.skillCategories)) {
      if (items.some(item => skill.includes(item.toLowerCase()))) {
        return category;
      }
    }
    return 'other';
  }

  addSkillTooltip(chip, skill, category) {
    const tooltip = document.createElement('div');
    tooltip.className = 'skill-tooltip';
    tooltip.textContent = `Click to filter by ${category}`;
    chip.appendChild(tooltip);
  }

  toggleSkillFilter(chip) {
    const skill = chip.getAttribute('data-skill');

    if (this.selectedSkills.has(skill)) {
      this.selectedSkills.delete(skill);
      chip.classList.remove('selected');
    } else {
      this.selectedSkills.add(skill);
      chip.classList.add('selected');
    }

    this.applySkillFilters();
    this.saveFilterState();
  }

  applySkillFilters() {
    if (this.selectedSkills.size === 0) {
      // Show all
      document.querySelectorAll('.chip').forEach(chip => {
        chip.style.opacity = '1';
      });
      document.querySelectorAll('li').forEach(li => {
        li.style.display = '';
      });
    } else {
      // Filter by selected skills
      document.querySelectorAll('li').forEach(li => {
        let hasSkill = false;
        this.selectedSkills.forEach(skill => {
          if (li.textContent.toLowerCase().includes(skill.toLowerCase())) {
            hasSkill = true;
          }
        });
        li.style.display = hasSkill ? '' : 'none';
      });
    }

    this.updateSkillsCount();
  }

  updateSkillsCount() {
    const total = this.skills.length;
    const selected = this.selectedSkills.size;

    let countElement = document.querySelector('.skills-count');
    if (!countElement) {
      countElement = document.createElement('div');
      countElement.className = 'skills-count';
      document.querySelector('.chips')?.insertAdjacentElement('afterend', countElement);
    }

    if (selected > 0) {
      countElement.textContent = `Showing ${selected} of ${total} skills`;
      countElement.style.display = 'block';
    } else {
      countElement.style.display = 'none';
    }
  }

  createSkillsChart() {
    const chartContainer = document.querySelector('[data-skills-chart]');
    if (!chartContainer) return;

    const categories = this.getSkillsByCategory();
    const labels = Object.keys(categories);
    const data = Object.values(categories).map(skills => skills.length);

    // Simple HTML chart
    const chart = document.createElement('div');
    chart.className = 'skills-chart';
    chart.innerHTML = `
      <h3>Skills Distribution</h3>
      <div class="chart-bars">
        ${labels.map((label, i) => `
          <div class="chart-bar">
            <div class="bar-label">${label}</div>
            <div class="bar-container">
              <div class="bar-fill" style="width: ${(data[i] / Math.max(...data)) * 100}%"></div>
              <span class="bar-value">${data[i]}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    chartContainer.appendChild(chart);
  }

  getSkillsByCategory() {
    const result = {
      'languages': 0,
      'frameworks': 0,
      'databases': 0,
      'tools': 0,
      'other': 0
    };

    this.skills.forEach(skill => {
      const category = this.categorizeSkill(skill);
      result[category]++;
    });

    return result;
  }

  setupSkillFilters() {
    const filterContainer = document.querySelector('[data-skill-filters]');
    if (!filterContainer) return;

    const filterBtns = document.createElement('div');
    filterBtns.className = 'skill-filter-buttons';
    filterBtns.innerHTML = `
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="languages">Languages</button>
      <button class="filter-btn" data-filter="frameworks">Frameworks</button>
      <button class="filter-btn" data-filter="databases">Databases</button>
      <button class="filter-btn" data-filter="tools">Tools</button>
    `;

    filterContainer.appendChild(filterBtns);

    filterBtns.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        this.filterByCategory(filter);
      });
    });
  }

  filterByCategory(category) {
    document.querySelectorAll('.chip').forEach(chip => {
      if (category === 'all') {
        chip.style.display = '';
      } else {
        chip.style.display = chip.getAttribute('data-category') === category ? '' : 'none';
      }
    });
  }

  saveFilterState() {
    const filters = Array.from(this.selectedSkills);
    localStorage.setItem('skillFilters', JSON.stringify(filters));
  }

  loadFilterState() {
    const filters = localStorage.getItem('skillFilters');
    if (filters) {
      const skills = JSON.parse(filters);
      skills.forEach(skill => {
        const chip = document.querySelector(`[data-skill="${skill}"]`);
        if (chip) {
          this.selectedSkills.add(skill);
          chip.classList.add('selected');
        }
      });
      this.applySkillFilters();
    }
  }
}
