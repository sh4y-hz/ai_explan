// AI_explan Content Script
// 对话式交互界面

let sidebarInjected = false;
let currentSelectedText = '';
let currentContext = {};
let currentPanelWidth = 400;
let outsideClickListener = null;
let conversationHistory = [];
let isProcessing = false;

function formatMarkdown(text) {
  if (!text) return '';
  
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-size: 0.9em;">$1</code>')
    .replace(/^###?\s*(.+)$/gm, '<strong style="font-size: 1.1em;">$1</strong>')
    .replace(/^\*\s+(.+)$/gm, '• $1')
    .replace(/^-\s+(.+)$/gm, '• $1')
    .replace(/^\d+\.\s+(.+)$/gm, '$1')
    .replace(/\n\n/g, '</p><p style="margin: 8px 0;">')
    .replace(/\n/g, '<br>');
}

const ContextParser = {
  extractContext(element, paragraphsBefore = 3, paragraphsAfter = 3) {
    const context = {
      before: [],
      after: [],
      element: element.textContent || ''
    };

    let currentElement = element;
    while (currentElement && currentElement.parentNode) {
      currentElement = currentElement.parentNode;

      if (currentElement.nodeType === Node.ELEMENT_NODE) {
        let prevSibling = currentElement.previousSibling;
        let beforeCount = 0;
        while (prevSibling && beforeCount < paragraphsBefore) {
          if (prevSibling.nodeType === Node.TEXT_NODE && prevSibling.textContent.trim()) {
            context.before.unshift(prevSibling.textContent.trim());
            beforeCount++;
          } else if (prevSibling.nodeType === Node.ELEMENT_NODE) {
            const textContent = prevSibling.textContent.trim();
            if (textContent) {
              context.before.unshift(textContent);
              beforeCount++;
            }
          }
          prevSibling = prevSibling.previousSibling;
        }

        let nextSibling = currentElement.nextSibling;
        let afterCount = 0;
        while (nextSibling && afterCount < paragraphsAfter) {
          if (nextSibling.nodeType === Node.TEXT_NODE && nextSibling.textContent.trim()) {
            context.after.push(nextSibling.textContent.trim());
            afterCount++;
          } else if (nextSibling.nodeType === Node.ELEMENT_NODE) {
            const textContent = nextSibling.textContent.trim();
            if (textContent) {
              context.after.push(textContent);
              afterCount++;
            }
          }
          nextSibling = nextSibling.nextSibling;
        }

        break;
      }
    }

    context.before = context.before.slice(-paragraphsBefore);
    context.after = context.after.slice(0, paragraphsAfter);

    return context;
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'openSidebar':
      currentSelectedText = request.selectedText;
      conversationHistory = [];

      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedElement = range.commonAncestorContainer;

        chrome.storage.local.get(['contextDepth', 'panelWidth'], (result) => {
          const contextDepth = result.contextDepth || 3;
          currentPanelWidth = result.panelWidth || 400;

          currentContext = ContextParser.extractContext(
            selectedElement,
            contextDepth,
            contextDepth
          );

          injectSidebar();
          sendResponse({ success: true });
        });
      } else {
        chrome.storage.local.get(['panelWidth'], (result) => {
          currentPanelWidth = result.panelWidth || 400;
          injectSidebar();
          sendResponse({ success: true });
        });
      }
      return true;

    case 'closeSidebar':
      closeSidebar();
      sendResponse({ success: true });
      return true;

    default:
      console.log('Unknown message received in content script:', request);
  }
});

function injectSidebar() {
  if (document.getElementById('ai-explan-sidebar-container')) {
    clearChat();
    showSidebar();
    startNewConversation();
    return;
  }

  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'ai-explan-sidebar-container';

  sidebarContainer.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: ${currentPanelWidth}px;
    height: 100vh;
    background-color: #ffffff;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    z-index: 1000000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.3s ease;
    transform: translateX(100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
  `;

  const header = document.createElement('div');
  header.id = 'ai-explan-sidebar-header';
  header.style.cssText = `
    padding: 12px 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  `;

  const titleDiv = document.createElement('div');
  titleDiv.innerHTML = '<strong>AI_explan</strong>';
  titleDiv.style.fontSize = '16px';

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    background: rgba(255,255,255,0.2);
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    line-height: 1;
  `;
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.3)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';

  header.appendChild(titleDiv);
  header.appendChild(closeBtn);

  const chatContainer = document.createElement('div');
  chatContainer.id = 'ai-explan-chat-container';
  chatContainer.style.cssText = `
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background: #f8f9fa;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const inputArea = document.createElement('div');
  inputArea.id = 'ai-explan-input-area';
  inputArea.style.cssText = `
    padding: 12px 15px;
    background: #ffffff;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 10px;
    flex-shrink: 0;
  `;

  const inputField = document.createElement('input');
  inputField.id = 'ai-explan-input';
  inputField.type = 'text';
  inputField.placeholder = '输入问题继续对话...';
  inputField.style.cssText = `
    flex: 1;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  `;
  inputField.onfocus = () => inputField.style.borderColor = '#667eea';
  inputField.onblur = () => inputField.style.borderColor = '#ddd';

  const sendBtn = document.createElement('button');
  sendBtn.id = 'ai-explan-send-btn';
  sendBtn.textContent = '发送';
  sendBtn.style.cssText = `
    padding: 10px 18px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: opacity 0.2s;
  `;
  sendBtn.onmouseover = () => sendBtn.style.opacity = '0.9';
  sendBtn.onmouseout = () => sendBtn.style.opacity = '1';

  inputArea.appendChild(inputField);
  inputArea.appendChild(sendBtn);

  sidebarContainer.appendChild(header);
  sidebarContainer.appendChild(chatContainer);
  sidebarContainer.appendChild(inputArea);

  document.body.appendChild(sidebarContainer);

  closeBtn.addEventListener('click', closeSidebar);

  outsideClickListener = (event) => {
    if (!sidebarContainer.contains(event.target)) {
      closeSidebar();
    }
  };
  document.addEventListener('click', outsideClickListener);

  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  setTimeout(() => {
    sidebarContainer.style.transform = 'translateX(0)';
  }, 10);

  startNewConversation();
}

function startNewConversation() {
  const formattedContext = {
    before: currentContext.before ? currentContext.before.join(' ') : '',
    element: currentContext.element || '',
    after: currentContext.after ? currentContext.after.join(' ') : ''
  };

  addMessage('user', `请解释一下"${currentSelectedText}"是什么意思？`);
  
  const contextPreview = formattedContext.element.substring(0, 100);
  if (contextPreview) {
    addSystemMessage(`选中内容: "${currentSelectedText}" | 上下文: ${contextPreview}...`);
  }

  requestAIResponse(`请解释一下"${currentSelectedText}"是什么意思？如果提供了上下文，请结合上下文来解释。`, formattedContext);
}

function addMessage(role, content) {
  const chatContainer = document.getElementById('ai-explan-chat-container');
  if (!chatContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;
  
  if (role === 'user') {
    messageDiv.style.cssText = `
      align-self: flex-end;
      max-width: 80%;
      padding: 10px 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 18px 18px 4px 18px;
      word-wrap: break-word;
    `;
    messageDiv.textContent = content;
  } else {
    messageDiv.style.cssText = `
      align-self: flex-start;
      max-width: 85%;
      padding: 12px 14px;
      background: #ffffff;
      color: #333;
      border-radius: 18px 18px 18px 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      word-wrap: break-word;
      line-height: 1.6;
    `;
    messageDiv.innerHTML = formatMarkdown(content);
  }

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  conversationHistory.push({ role, content });
}

function addSystemMessage(content) {
  const chatContainer = document.getElementById('ai-explan-chat-container');
  if (!chatContainer) return;

  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    align-self: center;
    max-width: 90%;
    padding: 6px 12px;
    background: #e8e8e8;
    color: #666;
    border-radius: 12px;
    font-size: 12px;
    text-align: center;
  `;
  messageDiv.textContent = content;

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addLoadingMessage() {
  const chatContainer = document.getElementById('ai-explan-chat-container');
  if (!chatContainer) return;

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'ai-explan-loading';
  loadingDiv.style.cssText = `
    align-self: flex-start;
    padding: 12px 14px;
    background: #ffffff;
    border-radius: 18px 18px 18px 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  `;
  loadingDiv.innerHTML = '<span style="animation: pulse 1s infinite;">正在思考中...</span>';

  const style = document.createElement('style');
  style.textContent = '@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }';
  document.head.appendChild(style);

  chatContainer.appendChild(loadingDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoadingMessage() {
  const loadingDiv = document.getElementById('ai-explan-loading');
  if (loadingDiv) loadingDiv.remove();
}

async function sendMessage() {
  const inputField = document.getElementById('ai-explan-input');
  if (!inputField) return;

  const message = inputField.value.trim();
  if (!message || isProcessing) return;

  inputField.value = '';
  addMessage('user', message);

  const formattedContext = {
    before: currentContext.before ? currentContext.before.join(' ') : '',
    element: currentContext.element || '',
    after: currentContext.after ? currentContext.after.join(' ') : ''
  };

  requestAIResponse(message, formattedContext);
}

async function requestAIResponse(userMessage, context) {
  isProcessing = true;
  addLoadingMessage();

  try {
    const messages = conversationHistory
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    messages.push({ role: 'user', content: userMessage });

    const response = await chrome.runtime.sendMessage({
      action: 'chat',
      messages: messages,
      context: context,
      selectedText: currentSelectedText
    });

    removeLoadingMessage();

    if (response && response.success) {
      addMessage('assistant', response.content);
    } else {
      const errorMsg = response?.error || '请求失败，请检查 API 配置';
      addMessage('assistant', `抱歉，出现了错误：${errorMsg}`);
    }
  } catch (error) {
    removeLoadingMessage();
    console.error('Error in chat:', error);
    addMessage('assistant', `抱歉，出现了错误：${error.message}`);
  } finally {
    isProcessing = false;
  }
}

function clearChat() {
  const chatContainer = document.getElementById('ai-explan-chat-container');
  if (chatContainer) {
    chatContainer.innerHTML = '';
  }
  conversationHistory = [];
}

function showSidebar() {
  const container = document.getElementById('ai-explan-sidebar-container');
  if (container) {
    container.style.transform = 'translateX(0)';
  }
}

function closeSidebar() {
  const container = document.getElementById('ai-explan-sidebar-container');
  if (container) {
    container.style.transform = 'translateX(100%)';

    if (outsideClickListener) {
      document.removeEventListener('click', outsideClickListener);
    }

    setTimeout(() => {
      container.remove();
    }, 300);
  }
}

document.addEventListener('mouseup', () => {
  setTimeout(() => {
    const selectedText = window.getSelection().toString().trim();

    chrome.runtime.sendMessage({
      action: 'textSelectionChanged',
      hasSelection: selectedText.length > 0
    }).catch(() => {});
  }, 1);
});
