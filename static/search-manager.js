/**
 * Search Manager - AJAX search and filtering without page reloads
 */

class SearchManager {
  constructor() {
    this.filters = {};
    this.results = [];
    this.debounceTimer = null;
    this.setupSearch();
  }

  setupSearch() {
    // Search boxes on different pages
    const searchInputs = document.querySelectorAll('input[data-search-type], input[placeholder*="Search"]');
    
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.handleSearch(e);
      });
    });

    // Filter buttons
    document.querySelectorAll('[data-filter-btn]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.toggleFilter(e.target);
      });
    });
  }

  handleSearch(e) {
    const query = e.target.value.trim();
    const searchType = e.target.getAttribute('data-search-type') || 'general';

    clearTimeout(this.debounceTimer);

    if (query.length === 0) {
      this.clearSearch();
      return;
    }

    // Debounce search
    this.debounceTimer = setTimeout(() => {
      this.performSearch(query, searchType);
    }, 300);
  }

  performSearch(query, searchType) {
    const searchableElements = document.querySelectorAll('[data-searchable]');
    let matchCount = 0;

    searchableElements.forEach(element => {
      const text = element.textContent.toLowerCase();
      const matches = text.includes(query.toLowerCase());

      if (matches) {
        element.style.display = '';
        this.highlightText(element, query);
        matchCount++;
      } else {
        element.style.display = 'none';
      }
    });

    this.showSearchResults(matchCount, query);
  }

  highlightText(element, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    const text = element.textContent;
    
    if (text.match(regex)) {
      element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    }
  }

  clearSearch() {
    document.querySelectorAll('[data-searchable]').forEach(element => {
      element.style.display = '';
      element.innerHTML = element.textContent;
    });

    const resultMsg = document.querySelector('.search-results-message');
    if (resultMsg) {
      resultMsg.remove();
    }
  }

  showSearchResults(count, query) {
    let resultMsg = document.querySelector('.search-results-message');
    
    if (!resultMsg) {
      resultMsg = document.createElement('div');
      resultMsg.className = 'search-results-message';
      document.body.insertBefore(resultMsg, document.body.firstChild);
    }

    resultMsg.textContent = `Found ${count} result${count !== 1 ? 's' : ''} for "${query}"`;
    resultMsg.style.display = count > 0 ? 'block' : 'none';
  }

  toggleFilter(btn) {
    btn.classList.toggle('active');
    const filterName = btn.getAttribute('data-filter-btn');
    const filterValue = btn.getAttribute('data-filter-value');

    if (btn.classList.contains('active')) {
      this.filters[filterName] = filterValue;
    } else {
      delete this.filters[filterName];
    }

    this.applyFilters();
    this.saveFilters();
  }

  applyFilters() {
    const items = document.querySelectorAll('[data-filterable]');
    let visibleCount = 0;

    items.forEach(item => {
      let visible = true;

      for (const [filterName, filterValue] of Object.entries(this.filters)) {
        const itemValue = item.getAttribute(`data-filter-${filterName}`);
        if (itemValue && !itemValue.includes(filterValue)) {
          visible = false;
          break;
        }
      }

      item.style.display = visible ? '' : 'none';
      if (visible) visibleCount++;
    });

    if (visibleCount === 0) {
      this.showNoResults();
    } else {
      this.hideNoResults();
    }
  }

  showNoResults() {
    let noResults = document.querySelector('.no-results-message');
    if (!noResults) {
      noResults = document.createElement('div');
      noResults.className = 'no-results-message';
      noResults.innerHTML = '<p>No results match your filters.</p>';
      document.body.appendChild(noResults);
    }
  }

  hideNoResults() {
    const noResults = document.querySelector('.no-results-message');
    if (noResults) {
      noResults.remove();
    }
  }

  saveFilters() {
    localStorage.setItem('searchFilters', JSON.stringify(this.filters));
  }

  loadFilters() {
    const saved = localStorage.getItem('searchFilters');
    if (saved) {
      this.filters = JSON.parse(saved);
    }
  }

  // AJAX job search (async search without page reload)
  async ajaxSearch(endpoint, params) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${endpoint}?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.results = data.results || [];
      this.renderAjaxResults(data);
      
      return data;
    } catch (error) {
      console.error('Search error:', error);
      this.showSearchError(error.message);
      return null;
    }
  }

  renderAjaxResults(data) {
    const container = document.querySelector('[data-ajax-results]');
    if (!container) return;

    if (!data.results || data.results.length === 0) {
      container.innerHTML = '<p>No results found.</p>';
      return;
    }

    container.innerHTML = data.results.map(result => `
      <div class="result-item" data-filterable data-filter-type="${result.type || 'job'}">
        <h3>${this.escapeHtml(result.title)}</h3>
        <p>${this.escapeHtml(result.description || '')}</p>
        ${result.url ? `<a href="${result.url}" target="_blank" rel="noopener">View Details</a>` : ''}
      </div>
    `).join('');
  }

  showSearchError(message) {
    const container = document.querySelector('[data-ajax-results]');
    if (container) {
      container.innerHTML = `<div class="error-message">Error: ${this.escapeHtml(message)}</div>`;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
