/**
 * Notification System - Toast notifications and alerts
 */

class NotificationSystem {
  constructor() {
    this.container = null;
    this.createContainer();
    this.defaultDuration = 5000; // 5 seconds
  }

  createContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
  }

  show(message, type = 'info', duration = this.defaultDuration) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
      'success': '✓',
      'error': '✕',
      'warning': '⚠',
      'info': 'ℹ'
    };

    notification.innerHTML = `
      <span class="notification-icon">${icons[type] || 'ℹ'}</span>
      <span class="notification-message">${this.escapeHtml(message)}</span>
      <button class="notification-close">×</button>
    `;

    this.container.appendChild(notification);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration);
    }

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration || 7000);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  showError(message) {
    return this.error(message);
  }

  showSuccess(message) {
    return this.success(message);
  }

  remove(notification) {
    notification.classList.add('removing');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }

  clear() {
    this.container.innerHTML = '';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Loading indicator
  showLoading(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.id = 'global-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="spinner"></div>
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
    document.body.appendChild(loader);
    return loader;
  }

  hideLoading() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 300);
    }
  }
}
