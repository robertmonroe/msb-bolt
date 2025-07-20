// MySearchBot™ Simple Standalone Implementation
class SimpleMySearchBot {
  constructor() {
    this.state = {
      theme: 'light',
      selectedEngines: ['google', 'bing', 'duckduckgo'],
      currentCategory: 'general',
      columns: 3,
      currentQuery: ''
    };

    this.engines = [
      { id: 'google', name: 'Google', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIyLjU2IDEyLjI1QzIyLjU2IDExLjQ3IDIyLjQ5IDEwLjcyIDIyLjM2IDEwSDE2VjE0LjI1SDIwLjA5QzE5Ljg5IDE1LjMgMTkuMjcgMTYuMTUgMTguMzggMTYuNzVWMTkuNTlIMjAuNjFDMjEuODEgMTguNDMgMjIuNTYgMTUuNiAyMi41NiAxMi4yNVoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTE2IDIyQzE4LjQzIDIyIDIwLjQ5IDIxLjE5IDIxLjg0IDE5LjU5TDE5LjYxIDE2Ljc1QzE4Ljg4IDE3LjMgMTcuODYgMTcuNjYgMTYgMTcuNjZDMTMuNjUgMTcuNjYgMTEuNjcgMTYuMDkgMTAuOTYgMTRIMTAuNzZWMTYuODRDMTIuMTEgMTkuNTMgMTMuOTIgMjIgMTYgMjJaIiBmaWxsPSIjMzRBODUzIi8+CjxwYXRoIGQ9Ik0xMC45NiAxNEMxMC42NSAxMy4wOSAxMC42NSAxMC45MSAxMC45NiAxMFY3LjE2SDguNzZDNy42MSA5LjQ5IDcuNjEgMTQuNTEgOC43NiAxNi44NEwxMC45NiAxNFoiIGZpbGw9IiNGQkJDMDQiLz4KPHBhdGggZD0iTTE2IDYuMzRDMTcuOTYgNi4zNCAxOS43OCA3LjE2IDIxLjI5IDguNjFMMjMuMjEgNi42OUMyMC40OSA0LjEzIDE4LjQzIDIgMTYgMkMxMy45MiAyIDEyLjExIDQuNDcgMTAuNzYgNy4xNkwxMi45NiAxMEMxMy42NyA3LjkxIDE1LjY1IDYuMzQgMTYgNi4zNFoiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+', color: '#ea4335' },
      { id: 'bing', name: 'Bing', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMkwxMyAyMEw3IDEyTDEyIDJaIiBmaWxsPSIjMDA3OEQ0Ii8+Cjwvc3ZnPg==', color: '#0078d4' },
      { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNERTU4MzMiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNiIgZmlsbD0iI0ZGRiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiBmaWxsPSIjREU1ODMzIi8+Cjwvc3ZnPg==', color: '#de5833' },
      { id: 'yahoo', name: 'Yahoo', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTYgOEwxMiAxNEw4IDhMMTIgMloiIGZpbGw9IiM3QjY4RUUiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxOCIgcj0iMiIgZmlsbD0iIzdCNjhFRSIvPgo8L3N2Zz4=', color: '#7b68ee' },
      { id: 'brave', name: 'Brave', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTggNkwxNiAxMkwxMiAyMkw4IDEyTDYgNkwxMiAyWiIgZmlsbD0iI0ZCNTQyQiIvPgo8L3N2Zz4=', color: '#fb542b' },
      { id: 'mojeek', name: 'Mojeek', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMxNkEzNEEiLz4KPHBhdGggZD0iTTggOEwxNiAxNk04IDE2TDE2IDgiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPg==', color: '#16a34a' }
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

    // Mock search results with thumbnails
    this.mockResults = {
      google: [
        {
          title: "Understanding AI and Machine Learning in 2024",
          url: "https://example.com/ai-ml-2024",
          snippet: "Comprehensive guide to artificial intelligence and machine learning trends, covering neural networks, deep learning, and practical applications in various industries.",
          thumbnail: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "2 days ago"
        },
        {
          title: "Top 10 Machine Learning Frameworks for Developers",
          url: "https://example.com/ml-frameworks",
          snippet: "Explore the most popular machine learning frameworks including TensorFlow, PyTorch, and Scikit-learn with practical examples and use cases.",
          thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "1 week ago"
        },
        {
          title: "AI Ethics and Responsible Machine Learning",
          url: "https://example.com/ai-ethics",
          snippet: "Important considerations for ethical AI development, bias prevention, and responsible deployment of machine learning systems in production.",
          thumbnail: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "3 days ago"
        }
      ],
      bing: [
        {
          title: "Machine Learning Applications in Healthcare",
          url: "https://example.com/ml-healthcare",
          snippet: "How artificial intelligence and machine learning are revolutionizing medical diagnosis, drug discovery, and patient care in modern healthcare systems.",
          thumbnail: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "5 days ago"
        },
        {
          title: "Natural Language Processing Breakthroughs",
          url: "https://example.com/nlp-breakthroughs",
          snippet: "Latest advances in natural language processing, including transformer models, BERT, GPT, and their applications in real-world scenarios.",
          thumbnail: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "1 day ago"
        },
        {
          title: "Computer Vision and Image Recognition Trends",
          url: "https://example.com/computer-vision",
          snippet: "Exploring the latest developments in computer vision, object detection, facial recognition, and autonomous vehicle technology.",
          thumbnail: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "4 days ago"
        }
      ],
      duckduckgo: [
        {
          title: "Open Source AI Tools and Libraries",
          url: "https://example.com/open-source-ai",
          snippet: "Comprehensive list of open-source artificial intelligence tools, libraries, and frameworks for developers and researchers.",
          thumbnail: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "6 days ago"
        },
        {
          title: "Machine Learning for Beginners: Complete Guide",
          url: "https://example.com/ml-beginners",
          snippet: "Step-by-step introduction to machine learning concepts, algorithms, and practical implementation for newcomers to the field.",
          thumbnail: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "1 week ago"
        },
        {
          title: "AI in Business: ROI and Implementation Strategies",
          url: "https://example.com/ai-business",
          snippet: "How businesses are implementing AI solutions, measuring return on investment, and overcoming common challenges in AI adoption.",
          thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=120&h=80&fit=crop",
          timestamp: "2 weeks ago"
        }
      ]
    };

    this.init();
  }

  init() {
    this.loadTheme();
    this.setupEventListeners();
    this.renderEngineSelection();
    this.renderCategoryTabs();
    this.startPlaceholderRotation();
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

  handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (!query || this.state.selectedEngines.length === 0) return;

    this.state.currentQuery = query;
    
    this.showResultsSection();
    this.showStatusBar();
    this.renderSearchResults();
    this.generateAISummary();
    
    // Simulate completion after a short delay
    setTimeout(() => {
      this.updateStatusComplete();
    }, 1500);
  }

  showResultsSection() {
    document.getElementById('results-section').classList.remove('hidden');
  }

  showStatusBar() {
    const statusBar = document.getElementById('status-bar');
    statusBar.classList.remove('hidden');
    
    document.getElementById('status-text').textContent = 'Search Complete';
    document.getElementById('status-progress').textContent = `${this.state.selectedEngines.length}/${this.state.selectedEngines.length}`;
  }

  updateStatusComplete() {
    document.getElementById('status-bar').classList.add('hidden');
  }

  renderSearchResults() {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    container.className = `search-results grid-${this.state.columns}`;

    this.state.selectedEngines.forEach(engineId => {
      const engine = this.engines.find(e => e.id === engineId);
      const results = this.mockResults[engineId] || [];

      const containerDiv = document.createElement('div');
      containerDiv.className = `search-container ${engineId}`;
      containerDiv.innerHTML = `
        <div class="search-header">
          <div class="search-header-left">
            <img src="${engine.icon}" alt="${engine.name}">
            <h3>${engine.name}</h3>
          </div>
          <div class="search-header-right">
            <span class="result-count">${results.length} results</span>
          </div>
        </div>
        <div class="search-content">
          ${this.renderResults(results)}
        </div>
      `;

      container.appendChild(containerDiv);
    });
  }

  renderResults(results) {
    if (results.length === 0) {
      return `
        <div class="no-results">
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

  generateAISummary() {
    const content = document.getElementById('ai-summary-content');
    
    // Show loading state
    content.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #635BFF;">
        <div style="display: inline-block; width: 1rem; height: 1rem; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 0.5rem;"></div>
        <span>Generating AI summary...</span>
      </div>
    `;

    // Simulate AI processing delay
    setTimeout(() => {
      this.renderAISummary();
    }, 2000);
  }

  renderAISummary() {
    const content = document.getElementById('ai-summary-content');
    
    const summary = `Based on the search results for "${this.state.currentQuery}", artificial intelligence and machine learning continue to be transformative technologies across multiple industries. The field is experiencing rapid advancement in areas such as natural language processing, computer vision, and healthcare applications. Key trends include the democratization of AI tools, increased focus on ethical AI development, and the growing importance of open-source frameworks for developers and researchers.`;

    const keyPoints = [
      'AI and ML are revolutionizing healthcare with improved diagnosis and drug discovery',
      'Natural language processing has seen major breakthroughs with transformer models',
      'Computer vision applications are expanding in autonomous vehicles and security',
      'Open-source AI tools are making the technology more accessible to developers',
      'Ethical AI considerations are becoming increasingly important in development',
      'Business adoption of AI is growing with measurable ROI in many sectors'
    ];

    const sources = this.state.selectedEngines;

    content.innerHTML = `
      <div class="ai-summary-text">
        <p>${summary}</p>
      </div>
      
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
          ${keyPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
      </div>
      
      <div class="sources">
        <h4>
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Sources
        </h4>
        <div class="source-tags">
          ${sources.map(source => `<span class="source-tag">${source}</span>`).join('')}
        </div>
      </div>
    `;
  }

  refreshAISummary() {
    if (!this.state.currentQuery) return;
    this.generateAISummary();
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

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SimpleMySearchBot();
});