// MySearchBot™ Plain JavaScript Implementation
class MySearchBot {
  constructor() {
    this.state = {
      theme: 'light',
      selectedEngines: ['google', 'bing', 'duckduckgo'],
      currentCategory: 'general',
      columns: 3,
      engineOrder: ['google', 'bing', 'duckduckgo', 'yahoo', 'brave', 'mojeek'],
      searchResults: {},
      currentQuery: '',
      isSearching: false,
      aiSummary: null,
      apiHealthy: true
    };

    this.engines = [
      { id: 'google', name: 'Google', icon: '/google.png', color: '#ea4335' },
      { id: 'bing', name: 'Bing', icon: '/bing.png', color: '#0078d4' },
      { id: 'duckduckgo', name: 'DuckDuckGo', icon: '/duckduckgo.png', color: '#de5833' },
      { id: 'yahoo', name: 'Yahoo', icon: '/yahoo.png', color: '#7b68ee' },
      { id: 'brave', name: 'Brave', icon: '/brave.png', color: '#fb542b' },
      { id: 'mojeek', name: 'Mojeek', icon: '/mojeek.png', color: '#16a34a' }
    ];

    this.categories = [
      { id: 'general', name: 'General', icon: 'search' },
      { id: 'images', name: 'Images', icon: 'image' },
      { id: 'videos', name: 'Videos', icon: 'video' },
      { id: 'news', name: 'News', icon: 'newspaper' },
      { id: 'map', name: 'Map', icon: 'map-pin' },
      { id: 'music', name: 'Music', icon: 'music' },
      { id: 'shopping', name: 'Shopping', icon: 'shopping-bag' },
      { id: 'social media', name: 'Social Media', icon: 'users' }
    ];

    this.sampleQueries = [
      "AI and machine learning trends",
      "Climate change solutions", 
      "Space exploration updates",
      "Healthy cooking recipes",
      "Digital marketing strategies",
      "Renewable energy innovations"
    ];

    this.mockImages = [
      {
        url: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Image 1',
        source: 'Pexels'
      },
      {
        url: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Image 2',
        source: 'Pexels'
      },
      {
        url: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Image 3',
        source: 'Pexels'
      },
      {
        url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Image 4',
        source: 'Pexels'
      }
    ];

    this.mockVideos = [
      {
        thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Video 1',
        duration: '5:23',
        source: 'YouTube'
      },
      {
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Video 2',
        duration: '8:45',
        source: 'YouTube'
      },
      {
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Video 3',
        duration: '12:10',
        source: 'Vimeo'
      },
      {
        thumbnail: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop',
        title: 'Related Video 4',
        duration: '3:56',
        source: 'YouTube'
      }
    ];

    this.init();
  }

  init() {
    this.loadTheme();
    this.setupEventListeners();
    this.renderEngineSelection();
    this.renderCategoryTabs();
    this.startPlaceholderRotation();
    this.checkApiHealth();
    this.setupAISummaryResize();
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.state.theme = savedTheme;
    document.body.className = `${savedTheme}-theme`;
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
      this.toggleTheme();
    });

    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetLayout();
    });

    // Search form
    document.getElementById('search-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSearch();
    });

    // Column selector
    document.querySelectorAll('.column-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setColumns(parseInt(e.target.dataset.columns));
      });
    });

    // AI Summary refresh
    document.getElementById('refresh-summary').addEventListener('click', () => {
      this.refreshAISummary();
    });

    // Download buttons
    document.querySelectorAll('.dropdown-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.downloadSummary(e.target.dataset.format);
      });
    });
  }

  toggleTheme() {
    this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
    document.body.className = `${this.state.theme}-theme`;
    localStorage.setItem('theme', this.state.theme);
    
    // Update theme toggle icons
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (this.state.theme === 'dark') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }

  resetLayout() {
    this.state.engineOrder = ['google', 'bing', 'duckduckgo', 'yahoo', 'brave', 'mojeek'];
    this.state.selectedEngines = ['google', 'bing', 'duckduckgo'];
    this.state.columns = 3;
    this.state.currentCategory = 'general';
    
    this.renderEngineSelection();
    this.renderCategoryTabs();
    this.setColumns(3);
    this.updateSelectedCount();
  }

  renderEngineSelection() {
    const container = document.getElementById('engine-grid');
    container.innerHTML = '';

    this.engines.forEach(engine => {
      const isSelected = this.state.selectedEngines.includes(engine.id);
      
      const engineItem = document.createElement('label');
      engineItem.className = `engine-item ${isSelected ? 'selected' : ''}`;
      engineItem.innerHTML = `
        <input type="checkbox" ${isSelected ? 'checked' : ''} data-engine="${engine.id}">
        <img src="${engine.icon}" alt="${engine.name}" class="engine-icon">
        <span class="engine-name">${engine.name}</span>
      `;

      engineItem.addEventListener('click', () => {
        this.toggleEngine(engine.id);
      });

      container.appendChild(engineItem);
    });

    this.updateSelectedCount();
  }

  toggleEngine(engineId) {
    if (this.state.selectedEngines.includes(engineId)) {
      this.state.selectedEngines = this.state.selectedEngines.filter(id => id !== engineId);
    } else {
      this.state.selectedEngines.push(engineId);
    }
    
    this.renderEngineSelection();
  }

  updateSelectedCount() {
    document.getElementById('selected-count').textContent = this.state.selectedEngines.length;
  }

  renderCategoryTabs() {
    const container = document.getElementById('category-tabs');
    container.innerHTML = '';

    this.categories.forEach(category => {
      const isActive = this.state.currentCategory === category.id;
      
      const tab = document.createElement('button');
      tab.className = `category-tab ${isActive ? 'active' : ''}`;
      tab.innerHTML = `
        ${this.getIconSVG(category.icon)}
        <span>${category.name}</span>
      `;

      tab.addEventListener('click', () => {
        this.setCategory(category.id);
      });

      container.appendChild(tab);
    });
  }

  setCategory(categoryId) {
    this.state.currentCategory = categoryId;
    this.renderCategoryTabs();
  }

  setColumns(columns) {
    this.state.columns = columns;
    
    // Update active button
    document.querySelectorAll('.column-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.columns) === columns);
    });

    // Update grid class
    const resultsGrid = document.getElementById('search-results');
    if (resultsGrid) {
      resultsGrid.className = `search-results grid-${columns}`;
    }
  }

  startPlaceholderRotation() {
    let index = 0;
    const input = document.getElementById('search-input');
    
    setInterval(() => {
      input.placeholder = this.sampleQueries[index];
      index = (index + 1) % this.sampleQueries.length;
    }, 3000);
  }

  async checkApiHealth() {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      this.state.apiHealthy = data.status === 'OK';
    } catch (error) {
      this.state.apiHealthy = false;
    }

    const apiStatus = document.getElementById('api-status');
    if (!this.state.apiHealthy) {
      apiStatus.classList.remove('hidden');
    } else {
      apiStatus.classList.add('hidden');
    }
  }

  async handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query || this.state.selectedEngines.length === 0) return;

    if (!this.state.apiHealthy) {
      alert('API server is not available. Please check your connection and try again.');
      return;
    }

    this.state.currentQuery = query;
    this.state.isSearching = true;
    this.state.searchResults = {};

    this.showResultsSection();
    this.showStatusBar();
    this.updateSearchStatus();
    this.renderSearchContainers();

    try {
      const results = await this.performSearch(query, this.state.selectedEngines, this.state.currentCategory);
      this.state.searchResults = results;
      this.state.isSearching = false;
      
      this.renderSearchResults();
      this.updateSearchStatus();
      this.generateAISummary();
      
    } catch (error) {
      console.error('Search failed:', error);
      this.state.isSearching = false;
      this.updateSearchStatus();
      alert('Search failed. Please check your connection and try again.');
    }
  }

  async performSearch(query, engines, category) {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, engines, category })
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async generateAISummary() {
    if (!this.state.currentQuery || Object.keys(this.state.searchResults).length === 0) return;

    this.showAISummaryLoading();

    try {
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: this.state.currentQuery,
          results: this.state.searchResults
        })
      });

      if (!response.ok) {
        throw new Error(`AI Summary failed: ${response.statusText}`);
      }

      const summary = await response.json();
      this.state.aiSummary = summary;
      this.renderAISummary();
      
    } catch (error) {
      console.error('AI Summary failed:', error);
      this.showAISummaryError();
    }
  }

  showResultsSection() {
    document.getElementById('results-section').classList.remove('hidden');
  }

  showStatusBar() {
    document.getElementById('status-bar').classList.remove('hidden');
  }

  updateSearchStatus() {
    const statusText = document.getElementById('status-text');
    const statusProgress = document.getElementById('status-progress');
    const statusDetails = document.getElementById('status-details');
    const progressFill = document.getElementById('progress-fill');
    const statusIcon = document.querySelector('.status-icon');

    const completed = Object.keys(this.state.searchResults).length;
    const total = this.state.selectedEngines.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;

    if (this.state.isSearching) {
      statusText.textContent = 'Searching...';
      statusIcon.classList.add('searching');
      statusIcon.classList.remove('complete');
      progressFill.classList.remove('complete');
      statusDetails.textContent = `${total - completed} searches in progress`;
      statusDetails.classList.remove('hidden');
    } else {
      statusText.textContent = 'Search Complete';
      statusIcon.classList.remove('searching');
      statusIcon.classList.add('complete');
      progressFill.classList.add('complete');
      statusDetails.classList.add('hidden');
    }

    statusProgress.textContent = `${completed}/${total}`;
    progressFill.style.width = `${progress}%`;
  }

  renderSearchContainers() {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    container.className = `search-results grid-${this.state.columns}`;

    const orderedEngines = this.state.engineOrder.filter(engine => 
      this.state.selectedEngines.includes(engine)
    );

    orderedEngines.forEach(engineId => {
      const engine = this.engines.find(e => e.id === engineId);
      const results = this.state.searchResults[engineId] || [];
      const isLoading = this.state.isSearching && !this.state.searchResults[engineId];

      const containerDiv = document.createElement('div');
      containerDiv.className = `search-container ${engineId}`;
      containerDiv.draggable = true;
      containerDiv.innerHTML = `
        <div class="search-header">
          <div class="search-header-left">
            <img src="${engine.icon}" alt="${engine.name}">
            <h3>${engine.name}</h3>
          </div>
          <div class="search-header-right">
            <span class="result-count">${isLoading ? 'Loading...' : `${results.length} results`}</span>
            <svg class="icon drag-handle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="12" r="1"/>
              <circle cx="9" cy="5" r="1"/>
              <circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="12" r="1"/>
              <circle cx="15" cy="5" r="1"/>
              <circle cx="15" cy="19" r="1"/>
            </svg>
          </div>
        </div>
        <div class="search-content" id="content-${engineId}">
          ${isLoading ? this.renderLoadingState() : this.renderResults(results, engine)}
        </div>
      `;

      this.setupDragAndDrop(containerDiv, engineId);
      container.appendChild(containerDiv);
    });
  }

  renderSearchResults() {
    const orderedEngines = this.state.engineOrder.filter(engine => 
      this.state.selectedEngines.includes(engine)
    );

    orderedEngines.forEach(engineId => {
      const engine = this.engines.find(e => e.id === engineId);
      const results = this.state.searchResults[engineId] || [];
      const contentDiv = document.getElementById(`content-${engineId}`);
      
      if (contentDiv) {
        contentDiv.innerHTML = this.renderResults(results, engine);
        
        // Update result count
        const countSpan = contentDiv.parentElement.querySelector('.result-count');
        if (countSpan) {
          countSpan.textContent = `${results.length} results`;
        }
      }
    });
  }

  renderLoadingState() {
    return `
      <div class="loading">
        <div class="loading-spinner"></div>
        <span>Searching...</span>
      </div>
      <div style="margin-top: 1rem;">
        ${Array(3).fill(0).map(() => `
          <div style="margin-bottom: 1rem;">
            <div class="loading-skeleton" style="height: 1rem; margin-bottom: 0.5rem;"></div>
            <div class="loading-skeleton" style="height: 0.75rem; width: 75%; margin-bottom: 0.5rem;"></div>
            <div class="loading-skeleton" style="height: 0.75rem; width: 50%;"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderResults(results, engine) {
    if (results.length === 0) {
      return `
        <div class="no-results">
          <img src="${engine.icon}" alt="${engine.name}">
          <p>No results found</p>
        </div>
      `;
    }

    return results.map(result => `
      <div class="search-result" onclick="window.open('${result.url}', '_blank')">
        <div class="result-header">
          ${result.thumbnail ? `<img src="${result.thumbnail}" alt="" class="result-thumbnail" onerror="this.style.display='none'">` : ''}
          <div class="result-content">
            <div class="result-title">
              <h4>${result.title}</h4>
              <svg class="icon external-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </div>
            <p class="result-snippet">${result.snippet}</p>
            ${result.timestamp ? `
              <div class="result-meta">
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                <span>${result.timestamp}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  setupDragAndDrop(element, engineId) {
    element.addEventListener('dragstart', (e) => {
      element.classList.add('dragging');
      e.dataTransfer.setData('text/plain', engineId);
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });

    element.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    element.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedEngineId = e.dataTransfer.getData('text/plain');
      this.reorderEngines(draggedEngineId, engineId);
    });
  }

  reorderEngines(draggedEngineId, targetEngineId) {
    if (draggedEngineId === targetEngineId) return;

    const newOrder = [...this.state.engineOrder];
    const draggedIndex = newOrder.indexOf(draggedEngineId);
    const targetIndex = newOrder.indexOf(targetEngineId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedEngineId);

    this.state.engineOrder = newOrder;
    this.renderSearchContainers();
    this.renderSearchResults();
  }

  showAISummaryLoading() {
    const content = document.getElementById('ai-summary-content');
    const actions = document.getElementById('ai-summary-actions');
    
    actions.classList.add('hidden');
    content.innerHTML = `
      <div class="loading" style="padding: 2rem; text-align: center;">
        <div class="loading-spinner"></div>
        <span>Analyzing search results and generating summary...</span>
      </div>
    `;
  }

  showAISummaryError() {
    const content = document.getElementById('ai-summary-content');
    content.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
        <p>AI summary generation is currently unavailable. Please try again later.</p>
      </div>
    `;
  }

  renderAISummary() {
    if (!this.state.aiSummary) return;

    const content = document.getElementById('ai-summary-content');
    const actions = document.getElementById('ai-summary-actions');
    
    actions.classList.remove('hidden');
    
    content.innerHTML = `
      <div class="ai-summary-main">
        <div class="ai-summary-text">
          <p>${this.state.aiSummary.summary}</p>
          
          ${this.state.aiSummary.keyPoints && this.state.aiSummary.keyPoints.length > 0 ? `
            <div class="key-points">
              <h4>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 11H1l6-6 6 6"/>
                  <path d="M9 17l3 3 3-3"/>
                  <path d="M22 12h-7"/>
                </svg>
                Key Points
              </h4>
              <ul>
                ${this.state.aiSummary.keyPoints.map(point => `<li>${point}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          ${this.state.aiSummary.sources && this.state.aiSummary.sources.length > 0 ? `
            <div class="sources">
              <h4>
                <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                Sources
              </h4>
              <div class="source-tags">
                ${this.state.aiSummary.sources.slice(0, 3).map(source => `
                  <span class="source-tag">${source}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="ai-summary-media">
        <div class="media-section">
          <div class="media-header">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <h4>Related Images</h4>
          </div>
          <div class="media-grid">
            ${this.mockImages.map(image => `
              <div class="media-item">
                <img src="${image.url}" alt="${image.title}">
                <p>${image.title}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="media-section">
          <div class="media-header">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
            <h4>Related Videos</h4>
          </div>
          <div class="media-grid">
            ${this.mockVideos.map(video => `
              <div class="media-item video-item">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="video-overlay">
                  <svg class="icon" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
                <div class="video-duration">${video.duration}</div>
                <p>${video.title}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  async refreshAISummary() {
    if (!this.state.currentQuery || Object.keys(this.state.searchResults).length === 0) return;
    await this.generateAISummary();
  }

  downloadSummary(format) {
    if (!this.state.aiSummary) return;

    const { summary, keyPoints, sources } = this.state.aiSummary;
    const date = new Date().toISOString().split('T')[0];

    if (format === 'text') {
      const content = `
AI SUMMARY REPORT
==================

Summary:
${summary}

Key Points:
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

Sources:
${sources.join(', ')}

Generated by MySearchBot™
Date: ${new Date().toLocaleDateString()}
      `.trim();

      this.downloadFile(content, `ai-summary-${date}.txt`, 'text/plain');
    } else if (format === 'html') {
      const content = `
<!DOCTYPE html>
<html>
<head>
  <title>AI Summary Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    h1 { color: #635BFF; border-bottom: 2px solid #635BFF; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; }
    .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .key-points { margin: 20px 0; }
    .key-points li { margin: 8px 0; }
    .sources { background: #e9ecef; padding: 15px; border-radius: 8px; }
    .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <h1>AI Summary Report</h1>
  
  <h2>Summary</h2>
  <div class="summary">${summary}</div>
  
  <h2>Key Points</h2>
  <ul class="key-points">
    ${keyPoints.map(point => `<li>${point}</li>`).join('')}
  </ul>
  
  <h2>Sources</h2>
  <div class="sources">${sources.join(', ')}</div>
  
  <div class="footer">
    Generated by MySearchBot™<br>
    Date: ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
      `;

      this.downloadFile(content, `ai-summary-${date}.html`, 'text/html');
    } else if (format === 'pdf') {
      const content = `
<!DOCTYPE html>
<html>
<head>
  <title>AI Summary Report - PDF</title>
  <style>
    @page { margin: 1in; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      margin: 0; 
      line-height: 1.6; 
      color: #333;
    }
    .header { 
      text-align: center; 
      border-bottom: 3px solid #635BFF; 
      padding-bottom: 20px; 
      margin-bottom: 30px; 
    }
    .header h1 { 
      color: #635BFF; 
      font-size: 28px; 
      margin: 0; 
      font-weight: 700;
    }
    .header .subtitle { 
      color: #666; 
      font-size: 14px; 
      margin-top: 5px; 
    }
    .section { 
      margin-bottom: 25px; 
      page-break-inside: avoid; 
    }
    .section h2 { 
      color: #635BFF; 
      font-size: 18px; 
      border-left: 4px solid #635BFF; 
      padding-left: 15px; 
      margin-bottom: 15px; 
    }
    .summary-box { 
      background: #f8f9fa; 
      padding: 20px; 
      border-radius: 8px; 
      border-left: 4px solid #635BFF; 
      margin: 15px 0; 
    }
    .key-points { 
      margin: 15px 0; 
      padding-left: 0; 
    }
    .key-points li { 
      margin: 10px 0; 
      padding-left: 20px; 
      position: relative; 
    }
    .key-points li::before { 
      content: "•"; 
      color: #635BFF; 
      font-weight: bold; 
      position: absolute; 
      left: 0; 
    }
    .sources-box { 
      background: #e9ecef; 
      padding: 15px; 
      border-radius: 8px; 
      border: 1px solid #dee2e6; 
    }
    .footer { 
      margin-top: 40px; 
      text-align: center; 
      color: #666; 
      font-size: 12px; 
      border-top: 1px solid #dee2e6; 
      padding-top: 20px; 
    }
    .metadata { 
      display: flex; 
      justify-content: space-between; 
      font-size: 12px; 
      color: #666; 
      margin-bottom: 10px; 
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>AI Summary Report</h1>
    <div class="subtitle">Generated by MySearchBot™ - AI-Enhanced Multi-Engine Search Platform</div>
  </div>
  
  <div class="metadata">
    <span>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span>
    <span>Sources: ${sources.length} search engines</span>
  </div>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <div class="summary-box">${summary}</div>
  </div>
  
  <div class="section">
    <h2>Key Insights</h2>
    <ul class="key-points">
      ${keyPoints.map(point => `<li>${point}</li>`).join('')}
    </ul>
  </div>
  
  <div class="section">
    <h2>Data Sources</h2>
    <div class="sources-box">
      <strong>Search Engines Analyzed:</strong> ${sources.join(', ')}
    </div>
  </div>
  
  <div class="footer">
    <div><strong>MySearchBot™</strong> - Search It Your Way™</div>
    <div>AI-Enhanced Multi-Engine Search Platform</div>
    <div style="margin-top: 10px;">This report was automatically generated using advanced AI analysis of search results from multiple search engines.</div>
  </div>
</body>
</html>
      `;

      this.downloadFile(content, `ai-summary-pdf-${date}.html`, 'text/html');
    }
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  setupAISummaryResize() {
    const resizeHandle = document.getElementById('resize-handle');
    const aiSummary = document.getElementById('ai-summary');
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = parseInt(window.getComputedStyle(aiSummary).height, 10);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    });

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(200, startHeight + deltaY);
      aiSummary.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }

  getIconSVG(iconName) {
    const icons = {
      search: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
      image: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
      video: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
      newspaper: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
      'map-pin': '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      music: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
      'shopping-bag': '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
      users: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    };
    return icons[iconName] || icons.search;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MySearchBot();
});