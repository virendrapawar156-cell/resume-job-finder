/**
 * Form Validator - Advanced form validation and UX
 */

class FormValidator {
  constructor() {
    this.errors = {};
    this.validators = {
      'profile_name': this.validateProfileName.bind(this),
      'resume': this.validateFile.bind(this),
      'email': this.validateEmail.bind(this),
      'search_query': this.validateSearchQuery.bind(this),
    };
    this.setupValidation();
  }

  setupValidation() {
    // Real-time validation on input
    document.querySelectorAll('input[data-validate], textarea[data-validate]').forEach(field => {
      field.addEventListener('blur', (e) => this.validateField(e.target));
      field.addEventListener('input', (e) => {
        if (this.errors[e.target.name]) {
          this.validateField(e.target);
        }
      });
    });
  }

  validateForm(form) {
    this.errors = {};
    let isValid = true;

    form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!field.hasAttribute('required') && !field.hasAttribute('data-validate')) return;

      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const name = field.name;
    const value = field.value.trim();
    const type = field.type;

    // Clear previous error
    this.clearFieldError(field);

    if (field.hasAttribute('required') && !value) {
      this.setFieldError(field, 'This field is required');
      return false;
    }

    // Custom validator
    if (this.validators[name]) {
      const error = this.validators[name](value, field);
      if (error) {
        this.setFieldError(field, error);
        return false;
      }
    }

    // Type-based validation
    switch (type) {
      case 'email':
        if (!this.validateEmail(value)) {
          this.setFieldError(field, 'Please enter a valid email');
          return false;
        }
        break;
      case 'url':
        if (!this.validateUrl(value)) {
          this.setFieldError(field, 'Please enter a valid URL');
          return false;
        }
        break;
    }

    return true;
  }

  validateProfileName(value) {
    if (!value) return null;
    if (value.length < 2) return 'Profile name must be at least 2 characters';
    if (value.length > 100) return 'Profile name must be less than 100 characters';
    return null;
  }

  validateFile(value, field) {
    if (!field.files || field.files.length === 0) {
      return 'Please select a file';
    }

    const file = field.files[0];
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF and DOCX files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    return null;
  }

  validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  validateUrl(value) {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  validateSearchQuery(value) {
    if (!value) return null;
    if (value.length < 2) return 'Search query must be at least 2 characters';
    if (value.length > 200) return 'Search query must be less than 200 characters';
    return null;
  }

  setFieldError(field, message) {
    field.classList.add('error');
    this.errors[field.name] = message;

    // Create or update error message
    let errorMsg = field.parentElement?.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      field.parentElement?.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
  }

  clearFieldError(field) {
    field.classList.remove('error');
    delete this.errors[field.name];

    const errorMsg = field.parentElement?.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.style.display = 'none';
    }
  }
}
