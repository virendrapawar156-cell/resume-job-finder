/**
 * File Upload Handler - Advanced file upload with preview
 */

class FileUploadHandler {
  constructor() {
    this.currentFile = null;
    this.setupDropZone();
  }

  setupDropZone() {
    const fileInput = document.getElementById('resume');
    if (!fileInput) return;

    const container = fileInput.parentElement;

    // Create drop zone
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.innerHTML = `
      <div class="drop-zone-content">
        <span class="drop-icon">📄</span>
        <p class="drop-text">Drag and drop your resume here or click to browse</p>
        <small>PDF or DOCX • Max 10MB</small>
      </div>
    `;

    // Insert drop zone before file input
    fileInput.style.display = 'none';
    container.insertBefore(dropZone, fileInput);

    // Click to open file picker
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and drop
    dropZone.addEventListener('dragover', (e) => this.handleDragOver(e, dropZone));
    dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e, dropZone));
    dropZone.addEventListener('drop', (e) => this.handleDrop(e, dropZone, fileInput));

    // File input change
    fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
  }

  handleDragOver(e, dropZone) {
    e.preventDefault();
    dropZone.classList.add('dragging');
  }

  handleDragLeave(e, dropZone) {
    e.preventDefault();
    dropZone.classList.remove('dragging');
  }

  handleDrop(e, dropZone, fileInput) {
    e.preventDefault();
    dropZone.classList.remove('dragging');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      this.handleFileSelect({ target: fileInput });
    }
  }

  handleFileSelect(e) {
    const input = e.target;
    const file = input.files?.[0];

    if (!file) return;

    this.currentFile = file;
    this.showFilePreview(file, input);
    this.validateFile(file, input);
  }

  showFilePreview(file, input) {
    const dropZone = input.previousElementSibling;
    const container = input.parentElement;

    // Remove existing preview
    const existingPreview = container.querySelector('.file-preview');
    if (existingPreview) {
      existingPreview.remove();
    }

    // Create preview
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    preview.innerHTML = `
      <div class="preview-item">
        <span class="file-icon">📄</span>
        <div class="file-info">
          <p class="file-name">${this.escapeHtml(file.name)}</p>
          <small>${this.formatFileSize(file.size)}</small>
          <div class="file-progress">
            <div class="progress-bar"></div>
          </div>
        </div>
        <button type="button" class="remove-file">✕</button>
      </div>
    `;

    container.insertBefore(preview, dropZone);
    dropZone.style.display = 'none';

    // Remove button
    preview.querySelector('.remove-file').addEventListener('click', () => {
      input.value = '';
      preview.remove();
      dropZone.style.display = 'block';
      this.currentFile = null;
    });
  }

  validateFile(file, input) {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      this.showFileError(input, '❌ Only PDF and DOCX files are allowed');
      input.value = '';
      return;
    }

    if (file.size > maxSize) {
      this.showFileError(input, '❌ File size must be less than 10MB');
      input.value = '';
      return;
    }

    this.showFileSuccess(input, `✓ ${file.name} ready to upload`);
  }

  showFileError(input, message) {
    this.clearFileStatus(input);
    const status = document.createElement('div');
    status.className = 'file-status error-status';
    status.textContent = message;
    input.parentElement?.appendChild(status);
  }

  showFileSuccess(input, message) {
    this.clearFileStatus(input);
    const status = document.createElement('div');
    status.className = 'file-status success-status';
    status.textContent = message;
    input.parentElement?.appendChild(status);
  }

  clearFileStatus(input) {
    const status = input.parentElement?.querySelector('.file-status');
    if (status) {
      status.remove();
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
