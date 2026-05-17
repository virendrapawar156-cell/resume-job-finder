/**
 * Resume Job Finder - Main Application
 * Advanced JavaScript features: Form validation, AJAX, Skills visualization, File preview
 */

class ResumeJobFinder {
  constructor() {
    this.init();
    this.setupEventListeners();
    this.loadSavedState();
  }

  init() {
    console.log('🚀 Resume Job Finder initialized');
    this.formValidator = new FormValidator();
    this.fileUploadHandler = new FileUploadHandler();
    this.skillsVisualizer = new SkillsVisualizer();
    this.searchManager = new SearchManager();
    this.notificationSystem = new NotificationSystem();
  }

  setupEventListeners() {
    // Form submissions
    const uploadForm = document.querySelector('form[action="/analyze"]');
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // File input changes
    const fileInput = document.getElementById('resume');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.fileUploadHandler.handleFileSelect(e));
    }

    // Search functionality
    const searchInputs = document.querySelectorAll('[data-search-type]');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => this.searchManager.handleSearch(e));
    });

    // Skills filtering
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('skill-filter')) {
        this.skillsVisualizer.toggleSkillFilter(e.target);
      }
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    const form = e.target;
    if (!this.formValidator.validateForm(form)) {
      this.notificationSystem.showError('Please fix the errors in the form');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '⏳ Analyzing resume...';

    try {
      // Submit form (standard form submission for file upload)
      // Form will handle the submission, but we can add AJAX here if needed
      form.submit();
    } catch (error) {
      this.notificationSystem.showError('Error uploading resume: ' + error.message);
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  loadSavedState() {
    // Load user preferences from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedSearchFilters = localStorage.getItem('searchFilters');
    if (savedSearchFilters) {
      this.searchManager.filters = JSON.parse(savedSearchFilters);
    }
  }

  static getInstance() {
    if (!window.appInstance) {
      window.appInstance = new ResumeJobFinder();
    }
    return window.appInstance;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ResumeJobFinder.getInstance();
});
