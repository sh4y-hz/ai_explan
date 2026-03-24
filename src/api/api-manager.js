/**
 * API Manager for AI_explan Extension
 * Manages communication with different AI services (Qwen, Kimi, OpenAI-compatible)
 */

class ApiManager {
  constructor() {
    this.currentApi = 'qwen'; // Default API
    this.apiConfigs = {};
    this.apiClients = {};
  }

  /**
   * Initialize API clients with configuration
   * @param {Object} config - Configuration object containing API keys and settings
   */
  async initialize(config) {
    // Initialize API configs with provided configuration
    this.apiConfigs = {
      qwen: {
        apiKey: config.qwenApiKey || null,
        baseUrl: config.qwenBaseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        model: config.qwenModel || 'qwen-max'
      },
      kimi: {
        apiKey: config.kimiApiKey || null,
        baseUrl: config.kimiBaseUrl || 'https://api.moonshot.cn/v1',
        model: config.kimiModel || 'moonshot-v1-8k'
      },
      openai: {
        apiKey: config.openaiApiKey || null,
        baseUrl: config.openaiBaseUrl || 'https://api.openai.com/v1',
        model: config.openaiModel || 'gpt-4o'
      },
      anthropic: {
        apiKey: config.anthropicApiKey || null,
        baseUrl: config.anthropicBaseUrl || 'https://api.anthropic.com/v1',
        model: config.anthropicModel || 'claude-3-5-sonnet-20241022'
      }
    };

    // Set current API based on user preference or default
    if (config.preferredApi) {
      this.currentApi = config.preferredApi;
    }

    console.log(`API Manager initialized. Using ${this.currentApi} as primary API`);
  }

  /**
   * Request explanation from AI service
   * @param {string} term - The term to explain
   * @param {Object} context - Context around the term
   * @returns {Promise<Object>} Formatted explanation response
   */
  async requestExplanation(term, context) {
    if (!this.apiConfigs) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }

    // Format the request for the AI service
    const requestData = {
      term: term,
      context: context,
      format: 'three_part_explanation' // Definition, Contextual Function, Reasoning
    };

    try {
      let response;

      // Try the preferred/current API first
      switch(this.currentApi) {
        case 'qwen':
          response = await this.requestFromQwen(requestData);
          break;
        case 'kimi':
          response = await this.requestFromKimi(requestData);
          break;
        case 'openai':
          response = await this.requestFromOpenAI(requestData);
          break;
        case 'anthropic':
          response = await this.requestFromAnthropic(requestData);
          break;
        default:
          // Fallback to Qwen if unknown API specified
          response = await this.requestFromQwen(requestData);
          this.currentApi = 'qwen';
      }

      return this.formatResponse(response, this.currentApi);
    } catch (error) {
      console.error(`Primary API (${this.currentApi}) request failed:`, error);

      // Try fallback API if failover is enabled
      if (this.apiConfigs[this.currentApi]?.failoverEnabled || true) {
        const fallbackApi = this.getFallbackApi(this.currentApi);
        console.log(`Attempting fallback to ${fallbackApi} API`);

        try {
          let fallbackResponse;
          switch(fallbackApi) {
            case 'qwen':
              fallbackResponse = await this.requestFromQwen(requestData);
              break;
            case 'kimi':
              fallbackResponse = await this.requestFromKimi(requestData);
              break;
            case 'openai':
              fallbackResponse = await this.requestFromOpenAI(requestData);
              break;
            case 'anthropic':
              fallbackResponse = await this.requestFromAnthropic(requestData);
              break;
          }

          // Switch current API to the working one
          this.currentApi = fallbackApi;
          return this.formatResponse(fallbackResponse, fallbackApi);
        } catch (fallbackError) {
          console.error(`Fallback API (${fallbackApi}) also failed:`, fallbackError);
          throw new Error(`All API services unavailable. Primary: ${error.message}, Fallback: ${fallbackError.message}`);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * Get fallback API for the given primary API
   * @param {string} primaryApi - The primary API
   * @returns {string} Fallback API name
   */
  getFallbackApi(primaryApi) {
    const fallbackMap = {
      'qwen': 'openai',
      'kimi': 'qwen',
      'openai': 'anthropic',
      'anthropic': 'qwen'
    };

    return fallbackMap[primaryApi] || 'qwen';
  }

  /**
   * Request explanation from Qwen API
   * @param {Object} requestData - Formatted request data
   * @returns {Promise<Object>} Raw API response
   */
  async requestFromQwen(requestData) {
    const config = this.apiConfigs.qwen;
    if (!config.apiKey) {
      throw new Error('Qwen API key not configured');
    }

    // Simulate API delay if in demo mode
    if (!config.baseUrl.includes('dashscope.aliyuncs.com')) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Demo response
      return {
        id: "demo-qwen-response",
        term: requestData.term,
        explanation: {
          definition: `The term "${requestData.term}" refers to a cognitive system that retains and recalls past experiences, concepts, or information. In the context of artificial intelligence, it typically describes a system's capacity to store and retrieve information over time.`,
          contextual_function: `In the provided context, "${requestData.term}" functions as a descriptor for an AI system's ability to retain information across multiple conversations or sessions. This suggests the AI system has persistent memory capabilities.`,
          reasoning: `The use of "${requestData.term}" in this context likely highlights a significant capability of the AI system - its ability to maintain continuity by remembering previous interactions, which is essential for coherent long-term engagement.`
        },
        model_used: config.model,
        timestamp: new Date().toISOString()
      };
    }

    // Actual API call using DashScope compatible mode
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'AI_explan/1.0'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: this.buildPrompt(requestData)
        }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Qwen API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.processApiResponse(data, 'qwen');
  }

  /**
   * Request explanation from Kimi API
   * @param {Object} requestData - Formatted request data
   * @returns {Promise<Object>} Raw API response
   */
  async requestFromKimi(requestData) {
    const config = this.apiConfigs.kimi;
    if (!config.apiKey) {
      throw new Error('Kimi API key not configured');
    }

    // Simulate API delay if in demo mode
    if (!config.baseUrl.includes('moonshot.cn')) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Demo response
      return {
        id: "demo-kimi-response",
        term: requestData.term,
        explanation: {
          definition: `The term "${requestData.term}" represents a computational mechanism that stores and retrieves information across multiple interactions or sessions. In AI systems, it indicates persistent knowledge retention capabilities.`,
          contextual_function: `Within the provided context, "${requestData.term}" serves as a feature descriptor indicating that the AI system maintains persistent state across different user sessions, enabling continuity of interaction.`,
          reasoning: `The inclusion of "${requestData.term}" in this context emphasizes a valuable characteristic of the AI system - its capacity for sustained engagement through the preservation of learned information, which enhances personalization and contextual awareness.`
        },
        model_used: config.model,
        timestamp: new Date().toISOString()
      };
    }

    // Actual API call
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'AI_explan/1.0'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: this.buildPrompt(requestData)
        }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Kimi API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.processApiResponse(data, 'kimi');
  }

  /**
   * Request explanation from OpenAI-compatible API
   * @param {Object} requestData - Formatted request data
   * @returns {Promise<Object>} Raw API response
   */
  async requestFromOpenAI(requestData) {
    const config = this.apiConfigs.openai;
    if (!config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Simulate API delay if in demo mode
    if (!config.baseUrl.includes('openai.com')) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Demo response
      return {
        id: "demo-openai-response",
        term: requestData.term,
        explanation: {
          definition: `The term "${requestData.term}" denotes a system's capability to retain and recall information over time. In artificial intelligence, this refers to a model's ability to maintain state and remember previous interactions.`,
          contextual_function: `In this context, "${requestData.term}" indicates that the AI system has persistent memory functionality, allowing it to retain information across different conversations or sessions.`,
          reasoning: `The presence of "${requestData.term}" in this description highlights an important feature of the AI system - its ability to maintain continuity by storing and retrieving relevant information from past interactions.`
        },
        model_used: config.model,
        timestamp: new Date().toISOString()
      };
    }

    // Actual API call
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'AI_explan/1.0'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: this.buildPrompt(requestData)
        }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.processApiResponse(data, 'openai');
  }

  /**
   * Request explanation from Anthropic API
   * @param {Object} requestData - Formatted request data
   * @returns {Promise<Object>} Raw API response
   */
  async requestFromAnthropic(requestData) {
    const config = this.apiConfigs.anthropic;
    if (!config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Simulate API delay if in demo mode
    if (!config.baseUrl.includes('anthropic.com')) {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // Demo response
      return {
        id: "demo-anthropic-response",
        term: requestData.term,
        explanation: {
          definition: `The term "${requestData.term}" signifies an AI system's capacity to preserve and access historical information. This enables continuity across separate interactions or sessions.`,
          contextual_function: `Here, "${requestData.term}" describes a capability of the AI where it can remember and reference past exchanges or information, enhancing its contextual understanding.`,
          reasoning: `The mention of "${requestData.term}" underscores the AI's advanced functionality to maintain persistent knowledge states, which significantly improves user experience by avoiding repetitive information requests.`
        },
        model_used: config.model,
        timestamp: new Date().toISOString()
      };
    }

    // Actual API call
    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'User-Agent': 'AI_explan/1.0'
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{
          role: 'user',
          content: this.buildPrompt(requestData)
        }],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.processApiResponse(data, 'anthropic');
  }

  /**
   * Process API response based on provider
   * @param {Object} data - Raw API response data
   * @param {string} provider - API provider name
   * @returns {Object} Processed response
   */
  processApiResponse(data, provider) {
    let rawContent = '';

    switch(provider) {
      case 'qwen':
      case 'kimi':
      case 'openai':
        rawContent = data.choices?.[0]?.message?.content || '';
        break;

      case 'anthropic':
        rawContent = data.content?.[0]?.text || '';
        break;

      default:
        rawContent = '';
    }

    const parsed = this.parseExplanationContent(rawContent);

    return {
      id: data.id,
      explanation: {
        definition: parsed.definition || 'Definition not available',
        contextual_function: parsed.contextualFunction || 'Contextual function not available',
        reasoning: parsed.reasoning || 'Reasoning not available'
      },
      model_used: data.model || 'unknown',
      timestamp: new Date().toISOString(),
      raw_content: rawContent
    };
  }

  parseExplanationContent(content) {
    const result = {
      definition: '',
      contextualFunction: '',
      reasoning: ''
    };

    if (!content) return result;

    const definitionMatch = content.match(/(?:###?\s*)?(?:1\.\s*)?Definition[:\s]*([\s\S]*?)(?=(?:###?\s*)?(?:2\.\s*)?Contextual|###?\s*Contextual|$)/i);
    const contextualMatch = content.match(/(?:###?\s*)?(?:2\.\s*)?Contextual\s*Function[:\s]*([\s\S]*?)(?=(?:###?\s*)?(?:3\.\s*)?Reasoning|###?\s*Reasoning|$)/i);
    const reasoningMatch = content.match(/(?:###?\s*)?(?:3\.\s*)?Reasoning[:\s]*([\s\S]*?)(?=(?:###?\s*)?(?:4\.\s*)?|$)/i);

    if (definitionMatch) {
      result.definition = definitionMatch[1].trim();
    }
    if (contextualMatch) {
      result.contextualFunction = contextualMatch[1].trim();
    }
    if (reasoningMatch) {
      result.reasoning = reasoningMatch[1].trim();
    }

    if (!result.definition && !result.contextualFunction && !result.reasoning) {
      result.definition = content.trim();
    }

    return result;
  }

  /**
   * Build a prompt for the AI service
   * @param {Object} requestData - Request data containing term and context
   * @returns {string} Formatted prompt
   */
  buildPrompt(requestData) {
    // Combine context into a single string for the prompt
    let contextString = '';
    if (requestData.context) {
      if (typeof requestData.context === 'string') {
        contextString = requestData.context;
      } else if (typeof requestData.context === 'object') {
        const { before = '', element = '', after = '' } = requestData.context;
        contextString = [before, element, after].filter(Boolean).join(' ');
      }
    }

    const prompt = `
Please provide a three-part explanation for the term "${requestData.term}":

1. Definition: What does this term mean in general usage?
2. Contextual Function: How does this term function in the provided context?
3. Reasoning: Why might this term be used in this particular context?

Context: ${contextString || 'No specific context provided'}

Provide the explanation in a structured format with clear separation between the three parts.`;

    return prompt;
  }

  /**
   * Format the API response to match our extension's needs
   * @param {Object} rawResponse - Raw response from AI service
   * @param {string} apiUsed - Which API was used
   * @returns {Object} Formatted response
   */
  formatResponse(rawResponse, apiUsed) {
    // Standardize the response format regardless of which API was used
    return {
      term: rawResponse.term || 'unknown',
      explanation: {
        definition: rawResponse.explanation?.definition || rawResponse.choices?.[0]?.message?.content || 'Definition not available',
        contextualFunction: rawResponse.explanation?.contextual_function || rawResponse.explanation?.contextualFunction || 'Contextual function not available',
        reasoning: rawResponse.explanation?.reasoning || 'Reasoning not available'
      },
      source: apiUsed,
      modelUsed: rawResponse.model_used || rawResponse.model || 'unknown',
      timestamp: rawResponse.timestamp || new Date().toISOString(),
      rawResponse: rawResponse // Keep raw response for debugging if needed
    };
  }

  /**
   * Test API connectivity
   * @returns {Promise<Object>} Test results
   */
  async testApis() {
    const results = {};

    // Test each configured API
    for (const [apiName, config] of Object.entries(this.apiConfigs)) {
      results[apiName] = { connected: false, error: null };

      if (!config.apiKey) {
        results[apiName].error = 'API key not configured';
        continue;
      }

      try {
        // For demo purposes, just check if API key is set
        // In a real implementation, we would make a lightweight API call
        if (config.apiKey.startsWith('demo_') || config.baseUrl.includes('example.com')) {
          results[apiName].connected = true;
        } else {
          // Make a lightweight test request (would be implemented based on each API's test endpoint)
          results[apiName].connected = true; // Placeholder
        }
      } catch (error) {
        results[apiName].error = error.message;
      }
    }

    return results;
  }

  async chat(messages, context = null, selectedText = null) {
    if (!this.apiConfigs) {
      throw new Error('API Manager not initialized. Call initialize() first.');
    }

    const config = this.apiConfigs[this.currentApi];
    if (!config || !config.apiKey) {
      throw new Error(`${this.currentApi} API key not configured`);
    }

    const systemPrompt = this.buildSystemPrompt(context, selectedText);
    
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    try {
      let response;
      
      switch(this.currentApi) {
        case 'qwen':
          response = await this.chatWithOpenAICompatible(config, formattedMessages, 'qwen');
          break;
        case 'kimi':
          response = await this.chatWithOpenAICompatible(config, formattedMessages, 'kimi');
          break;
        case 'openai':
          response = await this.chatWithOpenAICompatible(config, formattedMessages, 'openai');
          break;
        case 'anthropic':
          response = await this.chatWithAnthropic(config, formattedMessages);
          break;
        default:
          response = await this.chatWithOpenAICompatible(config, formattedMessages, 'qwen');
      }

      return {
        success: true,
        content: response,
        source: this.currentApi,
        modelUsed: config.model
      };
    } catch (error) {
      console.error(`Chat API (${this.currentApi}) failed:`, error);
      
      const fallbackApi = this.getFallbackApi(this.currentApi);
      const fallbackConfig = this.apiConfigs[fallbackApi];
      
      if (fallbackConfig && fallbackConfig.apiKey) {
        console.log(`Attempting fallback to ${fallbackApi}`);
        try {
          let fallbackResponse;
          if (fallbackApi === 'anthropic') {
            fallbackResponse = await this.chatWithAnthropic(fallbackConfig, formattedMessages);
          } else {
            fallbackResponse = await this.chatWithOpenAICompatible(fallbackConfig, formattedMessages, fallbackApi);
          }
          
          return {
            success: true,
            content: fallbackResponse,
            source: fallbackApi,
            modelUsed: fallbackConfig.model
          };
        } catch (fallbackError) {
          console.error(`Fallback API (${fallbackApi}) also failed:`, fallbackError);
          throw new Error(`所有 API 服务不可用。主服务: ${error.message}`);
        }
      }
      
      throw error;
    }
  }

  buildSystemPrompt(context, selectedText) {
    let systemPrompt = `你是一个智能助手，帮助用户理解和解释文本内容。请用中文回答问题，保持回答简洁、准确、有帮助。`;

    if (selectedText) {
      systemPrompt += `\n\n用户当前选中的文本是："${selectedText}"`;
    }

    if (context && (context.element || context.before || context.after)) {
      let contextStr = '';
      if (context.before) contextStr += context.before + ' ';
      if (context.element) contextStr += context.element + ' ';
      if (context.after) contextStr += context.after;
      
      if (contextStr.trim()) {
        systemPrompt += `\n\n相关上下文：${contextStr.trim()}`;
      }
    }

    return systemPrompt;
  }

  async chatWithOpenAICompatible(config, messages, provider) {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'User-Agent': 'AI_explan/1.0'
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`${provider} API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '无法获取响应';
  }

  async chatWithAnthropic(config, messages) {
    const systemMessage = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const response = await fetch(`${config.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 1000,
        system: systemMessage?.content || '',
        messages: chatMessages.map(m => ({
          role: m.role,
          content: m.content
        }))
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Anthropic API 请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text || '无法获取响应';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiManager;
} else if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Initialize API manager for extension use
  // Only assign to window if it's available in the current context
  if (typeof window !== 'undefined') {
    window.ApiManager = ApiManager;
  } else {
    // For service worker context, make it globally available differently
    globalThis.ApiManager = ApiManager;
  }
}