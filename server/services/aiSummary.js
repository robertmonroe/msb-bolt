import fetch from 'node-fetch';

class AISummaryService {
  constructor() {
    // Use multiple AI services as fallbacks
    this.services = [
      {
        name: 'openai-gpt4o-mini',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      },
      {
        name: 'huggingface',
        endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    ];
  }

  async generateSummary(query, searchResults) {
    try {
      // Combine all search results into a single text
      const allResults = Object.values(searchResults).flat();
      if (allResults.length === 0) {
        return this.generateFallbackSummary(query, searchResults);
      }

      const combinedText = allResults
        .map(result => `${result.title}: ${result.snippet}`)
        .join('\n\n')
        .slice(0, 4000);

      console.log(`🤖 Generating AI summary for ${allResults.length} results`);

      // Always generate a good rule-based summary first
      const enhancedSummary = this.generateEnhancedSummary(query, searchResults, combinedText);
      
      // Try AI services for enhancement, but don't fail if they don't work
      for (const service of this.services) {
        try {
          if (!this.hasValidApiKey(service)) {
            console.log(`⚠️ ${service.name}: No valid API key configured`);
            continue;
          }
          
          console.log(`🔄 Trying ${service.name} for AI enhancement...`);
          const aiSummary = await this.tryService(service, query, combinedText, searchResults);
          if (aiSummary && aiSummary.summary && aiSummary.summary.length > 50) {
            console.log(`✅ ${service.name}: AI summary generated successfully`);
            // Merge AI summary with enhanced rule-based summary
            return {
              summary: aiSummary.summary,
              keyPoints: enhancedSummary.keyPoints,
              sources: enhancedSummary.sources
            };
          }
        } catch (error) {
          console.error(`❌ ${service.name} failed:`, error.message);
          continue;
        }
      }

      console.log(`🔄 Using enhanced rule-based summary`);
      return enhancedSummary;

    } catch (error) {
      console.error('AI Summary generation error:', error);
      return this.generateFallbackSummary(query, searchResults);
    }
  }

  hasValidApiKey(service) {
    if (service.name === 'huggingface') {
      return process.env.HUGGINGFACE_API_KEY && 
             process.env.HUGGINGFACE_API_KEY !== 'your_huggingface_token_here' &&
             process.env.HUGGINGFACE_API_KEY.length > 10;
    }
    if (service.name === 'openai-gpt4o-mini') {
      return process.env.OPENAI_API_KEY && 
             process.env.OPENAI_API_KEY !== 'your_openai_api_key_here' &&
             process.env.OPENAI_API_KEY.length > 10;
    }
    return false;
  }

  async tryService(service, query, combinedText, searchResults) {
    if (service.name === 'openai-gpt4o-mini') {
      return await this.tryOpenAI(service, query, combinedText, searchResults);
    } else if (service.name === 'huggingface') {
      return await this.tryHuggingFace(service, query, combinedText, searchResults);
    }
    return null;
  }

  async tryOpenAI(service, query, combinedText, searchResults) {
    try {
      if (!this.hasValidApiKey(service)) {
        throw new Error('Invalid or missing OpenAI API key');
      }

      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers: service.headers,
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes search results. Provide concise, informative summaries that capture the key information and insights from the search results. Focus on the most important and relevant information.'
            },
            {
              role: 'user',
              content: `Please summarize these search results for the query "${query}":\n\n${combinedText}\n\nProvide a comprehensive but concise summary (2-3 sentences) that highlights the main points and key information found across all search results.`
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        }),
        timeout: 15000
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error response:', errorData);
        
        if (response.status === 401) {
          throw new Error('OpenAI API key is invalid or expired. Please check your API key in the .env file.');
        } else if (response.status === 429) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        } else if (response.status === 403) {
          throw new Error('OpenAI API access forbidden. Please check your API key permissions.');
        } else {
          throw new Error(`OpenAI API error: HTTP ${response.status} - ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      const summary = data.choices?.[0]?.message?.content?.trim();
      
      if (summary && summary.length > 20) {
        return {
          summary,
          keyPoints: this.extractKeyPoints(combinedText, query),
          sources: Object.keys(searchResults).filter(engine => searchResults[engine].length > 0)
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error.message);
      throw error;
    }
    
    return null;
  }

  async tryHuggingFace(service, query, combinedText, searchResults) {
    try {
      if (!this.hasValidApiKey(service)) {
        throw new Error('Invalid or missing HuggingFace API key');
      }

      const prompt = `Summarize the following search results for the query "${query}":\n\n${combinedText}\n\nProvide a concise summary:`;
      
      const response = await fetch(service.endpoint, {
        method: 'POST',
        headers: service.headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 250,
            min_length: 50,
            temperature: 0.7,
            do_sample: true,
            repetition_penalty: 1.1
          }
        }),
        timeout: 20000
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('HuggingFace API error response:', errorData);
        
        if (response.status === 401) {
          throw new Error('HuggingFace API key is invalid. Please check your API key in the .env file.');
        } else if (response.status === 429) {
          throw new Error('HuggingFace API rate limit exceeded. Please try again later.');
        } else if (response.status === 503) {
          throw new Error('HuggingFace model is currently loading. Please try again in a few moments.');
        } else {
          throw new Error(`HuggingFace API error: HTTP ${response.status} - ${response.statusText}`);
        }
      }
      
      const data = await response.json();
      let summary = '';
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        summary = data[0].generated_text.replace(prompt, '').trim();
      } else if (data.generated_text) {
        summary = data.generated_text.replace(prompt, '').trim();
      }
      
      if (summary && summary.length > 20) {
        return {
          summary,
          keyPoints: this.extractKeyPoints(combinedText, query),
          sources: Object.keys(searchResults).filter(engine => searchResults[engine].length > 0)
        };
      }
    } catch (error) {
      console.error('HuggingFace API error:', error.message);
      throw error;
    }
    
    return null;
  }

  generateEnhancedSummary(query, searchResults, combinedText) {
    const allResults = Object.values(searchResults).flat();
    const sources = Object.keys(searchResults).filter(engine => searchResults[engine].length > 0);
    
    // Check ratio of real vs fallback results
    const hasFallbackResults = allResults.some(result => result.isFallback);
    const realResults = allResults.filter(result => !result.isFallback);
    const fallbackResults = allResults.filter(result => result.isFallback);
    
    if (realResults.length === 0) {
      return {
        summary: `Direct search results for "${query}" are currently limited due to search engine anti-bot protections. However, direct search links to ${sources.length} search engines are provided, along with reliable alternative sources like Wikipedia and Reddit to help you find comprehensive information.`,
        keyPoints: [
          'Search engines have anti-bot protection that blocks automated scraping',
          'Direct search links provided for manual access to all engines',
          'Wikipedia and Reddit links offer reliable alternative information',
          'DuckDuckGo and Mojeek are generally more accessible for automated searches',
          'Real-time results available by clicking the direct search links',
          'This is normal behavior for search engines protecting against bots'
        ],
        sources: sources
      };
    } else if (realResults.length < allResults.length / 2) {
      return {
        summary: `Search results for "${query}" include ${realResults.length} real results from search engines, supplemented with direct search links. Some search engines are blocking automated access, but comprehensive information is still available through the provided links and alternative sources.`,
        keyPoints: [
          `Found ${realResults.length} real search results from accessible engines`,
          `${fallbackResults.length} direct search links provided for blocked engines`,
          'Mix of real scraped content and direct access links available',
          'Wikipedia and community sources provide additional reliable information',
          'Click direct search links for complete results from all engines',
          'Search engine blocking is common and expected behavior'
        ],
        sources: sources
      };
    }
    
    // Generate contextual summary based on query analysis
    let summary = '';
    const queryLower = query.toLowerCase();
    
    if (queryLower.includes('how to') || queryLower.includes('tutorial') || queryLower.includes('guide')) {
      summary = `Search results for "${query}" provide step-by-step guidance and practical instructions from ${sources.length} search engines. `;
    } else if (queryLower.includes('what is') || queryLower.includes('definition') || queryLower.includes('meaning')) {
      summary = `Search results for "${query}" offer comprehensive definitions and explanations from multiple authoritative sources. `;
    } else if (queryLower.includes('best') || queryLower.includes('top') || queryLower.includes('review')) {
      summary = `Search results for "${query}" present various recommendations and comparative analyses from different perspectives. `;
    } else if (queryLower.includes('news') || queryLower.includes('latest') || queryLower.includes('recent')) {
      summary = `Recent search results for "${query}" show current developments and latest information from various sources. `;
    } else {
      summary = `Search results for "${query}" from ${sources.length} engines provide comprehensive information on this topic. `;
    }
    
    if (realResults.length > 0) {
      summary += `Successfully retrieved ${realResults.length} real search results with detailed information and multiple perspectives.`;
    } else {
      summary += `Direct search links and reliable alternative sources are provided for comprehensive information access.`;
    }

    // Generate intelligent key points
    const keyPoints = this.generateIntelligentKeyPoints(query, allResults, sources);

    return {
      summary,
      keyPoints,
      sources
    };
  }

  generateIntelligentKeyPoints(query, results, sources) {
    const keyPoints = [];
    const realResults = results.filter(r => !r.isFallback);
    
    // Result statistics
    if (realResults.length > 0) {
      keyPoints.push(`Successfully scraped ${realResults.length} real results from ${sources.length} search engines`);
      keyPoints.push(`Real results provide current information and comprehensive coverage`);
    } else {
      keyPoints.push(`Search engines are blocking automated access (normal anti-bot behavior)`);
      keyPoints.push(`Direct search links provided for manual access to all engines`);
    }
    
    // Query-specific insights
    const queryLower = query.toLowerCase();
    if (queryLower.includes('compare') || queryLower.includes('vs') || queryLower.includes('versus')) {
      keyPoints.push('Results provide comparative analysis and different perspectives');
    } else if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('buy')) {
      keyPoints.push('Results include pricing information and purchasing options');
    } else if (queryLower.includes('review') || queryLower.includes('rating')) {
      keyPoints.push('Results include user reviews and expert evaluations');
    } else if (queryLower.includes('tutorial') || queryLower.includes('how to')) {
      keyPoints.push('Results provide step-by-step instructions and practical guidance');
    }
    
    // Source reliability
    if (sources.includes('duckduckgo') || sources.includes('mojeek')) {
      keyPoints.push('Results include privacy-focused and independent search engines');
    }
    
    // Fallback guidance
    if (results.some(r => r.isFallback)) {
      keyPoints.push('Click direct search links for complete real-time results');
      keyPoints.push('Wikipedia and Reddit links provide reliable supplementary information');
    }
    
    return keyPoints.slice(0, 6);
  }

  extractKeyPoints(text, query) {
    // Enhanced key point extraction
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Score sentences based on multiple factors
    const scoredSentences = sentences.map(sentence => {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      
      // Query relevance
      queryWords.forEach(word => {
        if (lowerSentence.includes(word)) score += 3;
      });
      
      // Important keywords
      const importantWords = ['important', 'key', 'main', 'primary', 'significant', 'major', 'essential', 'critical', 'vital'];
      importantWords.forEach(word => {
        if (lowerSentence.includes(word)) score += 2;
      });
      
      // Action words
      const actionWords = ['provides', 'offers', 'includes', 'features', 'enables', 'allows', 'helps'];
      actionWords.forEach(word => {
        if (lowerSentence.includes(word)) score += 1;
      });
      
      // Sentence position (earlier sentences often more important)
      const position = sentences.indexOf(sentence);
      score += Math.max(0, 15 - position);
      
      // Length preference (not too short, not too long)
      const length = sentence.trim().length;
      if (length > 40 && length < 250) score += 2;
      
      return { sentence: sentence.trim(), score };
    });

    // Return top scored sentences as key points
    return scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.sentence)
      .filter(sentence => sentence.length > 15);
  }

  generateFallbackSummary(query, searchResults) {
    const allResults = Object.values(searchResults).flat();
    const sources = Object.keys(searchResults).filter(engine => searchResults[engine].length > 0);
    
    return {
      summary: `Search results for "${query}" include direct access links to ${sources.length} search engines. While automated scraping is limited due to anti-bot protections, you can access comprehensive real-time results by clicking the provided search links for each engine.`,
      keyPoints: [
        'Search engines use anti-bot protection to prevent automated scraping',
        'Direct search links provided for real-time access to all engines',
        'Wikipedia and Reddit links offer reliable supplementary information',
        'This behavior is normal and expected for search engine protection',
        'Click any search link to get complete current results',
        'Multiple engines provided to ensure comprehensive coverage'
      ],
      sources: sources.length > 0 ? sources : ['fallback']
    };
  }
}

export const aiSummaryService = new AISummaryService();