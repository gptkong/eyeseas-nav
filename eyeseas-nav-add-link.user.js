// ==UserScript==
// @name         EyeSeas Nav - 快速添加链接
// @namespace    https://github.com/eyeseas-nav
// @version      1.2.3
// @description  将当前页面快速添加到 EyeSeas Nav 导航系统
// @author       EyeSeas
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧭</text></svg>
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  // ╔════════════════════════════════════════════════════════════════════════════╗
  // ║                           ⚙️ 用户配置区域                                    ║
  // ║                     请在下方填写你的服务器地址和密码                            ║
  // ╚════════════════════════════════════════════════════════════════════════════╝

  const CONFIG = {
    // 服务器地址，例如: 'https://nav.example.com'
    SERVER_URL: '',

    // 管理后台密码
    ADMIN_PASSWORD: '',
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // 以下代码无需修改
  // ═══════════════════════════════════════════════════════════════════════════════

  // Token 存储键名
  const TOKEN_KEYS = {
    JWT_TOKEN: 'eyeseas_jwt_token',
    TOKEN_EXPIRES: 'eyeseas_token_expires',
  };

  // ========== 样式注入 ==========
  GM_addStyle(`
    .eyeseas-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999998;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .eyeseas-overlay.show {
      opacity: 1;
    }
    
    .eyeseas-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(99, 102, 241, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.05);
      z-index: 999999;
      width: 480px;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .eyeseas-modal.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    
    .eyeseas-header {
      padding: 20px 24px 16px;
      background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .eyeseas-header-icon {
      font-size: 28px;
      line-height: 1;
    }
    .eyeseas-header-title {
      font-size: 18px;
      font-weight: 600;
      color: #f1f5f9;
      letter-spacing: -0.02em;
    }
    .eyeseas-header-subtitle {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .eyeseas-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .eyeseas-close:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    
    .eyeseas-body {
      padding: 20px 24px;
      flex: 1;
      overflow-y: auto;
      min-height: 0;
    }
    .eyeseas-body::-webkit-scrollbar {
      width: 6px;
    }
    .eyeseas-body::-webkit-scrollbar-track {
      background: transparent;
    }
    .eyeseas-body::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.3);
      border-radius: 3px;
    }
    
    .eyeseas-form-group {
      margin-bottom: 16px;
    }
    .eyeseas-label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #cbd5e1;
      margin-bottom: 6px;
      letter-spacing: 0.01em;
    }
    .eyeseas-label .required {
      color: #f87171;
      margin-left: 2px;
    }
    .eyeseas-input, .eyeseas-textarea, .eyeseas-select {
      width: 100%;
      padding: 10px 14px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .eyeseas-input:focus, .eyeseas-textarea:focus, .eyeseas-select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .eyeseas-input::placeholder, .eyeseas-textarea::placeholder {
      color: #64748b;
    }
    .eyeseas-textarea {
      resize: vertical;
      min-height: 80px;
    }
    .eyeseas-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 40px;
    }
    .eyeseas-select option {
      background: #1e293b;
      color: #f1f5f9;
    }
    
    .eyeseas-row {
      display: flex;
      gap: 12px;
    }
    .eyeseas-row > .eyeseas-form-group {
      flex: 1;
    }
    
    .eyeseas-tags-input {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 12px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 10px;
      min-height: 44px;
      cursor: text;
      transition: all 0.2s;
    }
    .eyeseas-tags-input:focus-within {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
    .eyeseas-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: white;
    }
    .eyeseas-tag-remove {
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
      font-size: 14px;
      line-height: 1;
    }
    .eyeseas-tag-remove:hover {
      opacity: 1;
    }
    .eyeseas-tag-input {
      flex: 1;
      min-width: 80px;
      border: none;
      background: transparent;
      color: #f1f5f9;
      font-size: 14px;
      outline: none;
      padding: 4px 0;
    }
    .eyeseas-tag-input::placeholder {
      color: #64748b;
    }
    
    .eyeseas-available-tags {
      margin-top: 8px;
    }
    .eyeseas-available-tags-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .eyeseas-available-tags-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .eyeseas-available-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 6px;
      font-size: 12px;
      color: #a5b4fc;
      cursor: pointer;
      transition: all 0.2s;
    }
    .eyeseas-available-tag:hover {
      background: rgba(99, 102, 241, 0.3);
      border-color: rgba(99, 102, 241, 0.5);
      color: #c7d2fe;
    }
    .eyeseas-available-tag.selected {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-color: transparent;
      color: white;
    }
    .eyeseas-available-tag-count {
      font-size: 10px;
      opacity: 0.7;
    }
    .eyeseas-tags-loading {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
    }
    
    .eyeseas-footer {
      padding: 16px 24px 20px;
      background: rgba(15, 23, 42, 0.5);
      border-top: 1px solid rgba(99, 102, 241, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .eyeseas-footer-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .eyeseas-footer-right {
      display: flex;
      gap: 12px;
    }
    .eyeseas-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 22px;
    }
    .eyeseas-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .eyeseas-switch-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(100, 116, 139, 0.5);
      border-radius: 22px;
      transition: all 0.3s;
    }
    .eyeseas-switch-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s;
    }
    .eyeseas-switch input:checked + .eyeseas-switch-slider {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
    }
    .eyeseas-switch input:checked + .eyeseas-switch-slider:before {
      transform: translateX(18px);
    }
    .eyeseas-switch-label {
      font-size: 13px;
      color: #94a3b8;
    }
    .eyeseas-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .eyeseas-btn-primary {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .eyeseas-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
    }
    .eyeseas-btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .eyeseas-btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .eyeseas-btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
    }
    
    .eyeseas-message {
      padding: 12px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .eyeseas-message-success {
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
    }
    .eyeseas-message-error {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
    }
    .eyeseas-message-info {
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
    }
    
    .eyeseas-loading {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: eyeseas-spin 0.8s linear infinite;
    }
    @keyframes eyeseas-spin {
      to { transform: rotate(360deg); }
    }
    
    .eyeseas-preview {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(15, 23, 42, 0.5);
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .eyeseas-preview-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      object-fit: cover;
      background: rgba(99, 102, 241, 0.2);
    }
    .eyeseas-preview-info {
      flex: 1;
      min-width: 0;
    }
    .eyeseas-preview-title {
      font-size: 14px;
      font-weight: 500;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .eyeseas-preview-url {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `);

  // ========== 工具函数 ==========
  function getCurrentPageInfo() {
    const url = window.location.href;
    const title = document.title || '';
    
    // 获取页面描述
    let description = '';
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (metaDesc) description = metaDesc.getAttribute('content') || '';
    else if (ogDesc) description = ogDesc.getAttribute('content') || '';
    
    // 获取 favicon
    let favicon = '';
    const iconLink = document.querySelector('link[rel="icon"]') ||
                     document.querySelector('link[rel="shortcut icon"]') ||
                     document.querySelector('link[rel="apple-touch-icon"]');
    if (iconLink) {
      favicon = iconLink.getAttribute('href') || '';
      // 处理相对路径
      if (favicon && !favicon.startsWith('http')) {
        if (favicon.startsWith('//')) {
          favicon = window.location.protocol + favicon;
        } else if (favicon.startsWith('/')) {
          favicon = window.location.origin + favicon;
        } else {
          favicon = new URL(favicon, window.location.href).href;
        }
      }
    }
    if (!favicon) {
      favicon = window.location.origin + '/favicon.ico';
    }
    
    return { url, title, description, favicon };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  // ========== API 请求 ==========
  function apiRequest(method, endpoint, data = null, token = null) {
    return new Promise((resolve, reject) => {
      if (!CONFIG.SERVER_URL) {
        reject(new Error('请在脚本中配置 SERVER_URL'));
        return;
      }

      const url = CONFIG.SERVER_URL.replace(/\/$/, '') + endpoint;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log(`[EyeSeas] 请求: ${method} ${url}`);

      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data: data ? JSON.stringify(data) : null,
        onload: (response) => {
          console.log(`[EyeSeas] 响应状态: ${response.status}, 类型: ${response.responseHeaders?.match(/content-type:\s*([^\r\n;]+)/i)?.[1] || 'unknown'}`);
          
          // 检查响应是否为空
          if (!response.responseText || response.responseText.trim() === '') {
            console.error('[EyeSeas] 响应为空');
            reject(new Error(`服务器返回空响应 (状态码: ${response.status})`));
            return;
          }

          // 检查是否为 HTML 响应（可能是错误页面）
          const contentType = response.responseHeaders?.toLowerCase() || '';
          if (contentType.includes('text/html') && !response.responseText.trim().startsWith('{')) {
            console.error('[EyeSeas] 收到 HTML 响应而非 JSON:', response.responseText.substring(0, 200));
            reject(new Error(`服务器返回 HTML 而非 JSON (状态码: ${response.status})，请检查 SERVER_URL 配置`));
            return;
          }

          try {
            const result = JSON.parse(response.responseText);
            if (response.status >= 200 && response.status < 300) {
              resolve(result);
            } else {
              reject(new Error(result.error || result.message || `请求失败: ${response.status}`));
            }
          } catch (e) {
            console.error('[EyeSeas] JSON 解析失败:', response.responseText.substring(0, 500));
            reject(new Error(`解析响应失败: ${e.message}，响应内容: ${response.responseText.substring(0, 100)}...`));
          }
        },
        onerror: (error) => {
          console.error('[EyeSeas] 网络错误:', error);
          reject(new Error('网络请求失败，请检查服务器地址和网络连接'));
        },
        ontimeout: () => {
          console.error('[EyeSeas] 请求超时');
          reject(new Error('请求超时，请检查服务器是否可访问'));
        },
        timeout: 15000, // 15秒超时
      });
    });
  }

  async function login() {
    if (!CONFIG.ADMIN_PASSWORD) {
      throw new Error('请在脚本中配置 ADMIN_PASSWORD');
    }

    const result = await apiRequest('POST', '/api/auth/login', { password: CONFIG.ADMIN_PASSWORD });
    if (result.success && result.data?.session) {
      const token = result.data.session;
      GM_setValue(TOKEN_KEYS.JWT_TOKEN, token);
      // Token 有效期 24 小时，提前 1 小时刷新
      GM_setValue(TOKEN_KEYS.TOKEN_EXPIRES, Date.now() + 23 * 60 * 60 * 1000);
      return token;
    }
    throw new Error(result.error || '登录失败');
  }

  async function getValidToken() {
    const token = GM_getValue(TOKEN_KEYS.JWT_TOKEN, '');
    const expires = GM_getValue(TOKEN_KEYS.TOKEN_EXPIRES, 0);
    
    if (token && expires > Date.now()) {
      return token;
    }
    
    return await login();
  }

  async function fetchCategories() {
    try {
      const result = await apiRequest('GET', '/api/categories');
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
      return [];
    } catch (e) {
      console.error('获取分类失败:', e);
      return [];
    }
  }

  async function fetchTags() {
    try {
      const result = await apiRequest('GET', '/api/tags');
      if (result.success && Array.isArray(result.data)) {
        // API 返回 { tag: string, count: number }[]
        return result.data;
      }
      return [];
    } catch (e) {
      console.error('获取标签失败:', e);
      return [];
    }
  }

  async function createLink(linkData) {
    const token = await getValidToken();
    return await apiRequest('POST', '/api/links', linkData, token);
  }

  // ========== UI 组件 ==========
  let modalContainer = null;
  let currentTags = []; // 使用独立变量存储标签，避免 DOM 属性不稳定

  function createModal() {
    // 检查配置
    if (!CONFIG.SERVER_URL || !CONFIG.ADMIN_PASSWORD) {
      alert('⚠️ 请先在脚本源码中配置 SERVER_URL 和 ADMIN_PASSWORD');
      return;
    }

    if (modalContainer) {
      modalContainer.remove();
    }

    const pageInfo = getCurrentPageInfo();

    modalContainer = document.createElement('div');
    modalContainer.innerHTML = `
      <div class="eyeseas-overlay"></div>
      <div class="eyeseas-modal">
        <div class="eyeseas-header">
          <span class="eyeseas-header-icon">🧭</span>
          <div>
            <div class="eyeseas-header-title">添加到导航</div>
            <div class="eyeseas-header-subtitle">EyeSeas Nav</div>
          </div>
          <button class="eyeseas-close" data-action="close">×</button>
        </div>
        <div class="eyeseas-body">
          <div class="eyeseas-message-container"></div>
          
          <div class="eyeseas-preview">
            <img class="eyeseas-preview-icon" src="${pageInfo.favicon}" 
                 onerror="this.style.display='none'">
            <div class="eyeseas-preview-info">
              <div class="eyeseas-preview-title">${escapeHtml(pageInfo.title)}</div>
              <div class="eyeseas-preview-url">${escapeHtml(pageInfo.url)}</div>
            </div>
          </div>
          
          <div class="eyeseas-form-group">
            <label class="eyeseas-label">标题 <span class="required">*</span></label>
            <input type="text" class="eyeseas-input" id="eyeseas-title" 
                   value="${escapeHtml(pageInfo.title)}" 
                   placeholder="输入链接标题">
          </div>
          
          <div class="eyeseas-row">
            <div class="eyeseas-form-group">
              <label class="eyeseas-label">内网地址 <span class="required">*</span></label>
              <input type="url" class="eyeseas-input" id="eyeseas-internal-url" 
                     value="${escapeHtml(pageInfo.url)}" 
                     placeholder="内网访问地址">
            </div>
            <div class="eyeseas-form-group">
              <label class="eyeseas-label">外网地址 <span class="required">*</span></label>
              <input type="url" class="eyeseas-input" id="eyeseas-external-url" 
                     value="${escapeHtml(pageInfo.url)}" 
                     placeholder="外网访问地址">
            </div>
          </div>
          
          <div class="eyeseas-form-group">
            <label class="eyeseas-label">描述 <span class="required">*</span></label>
            <textarea class="eyeseas-textarea" id="eyeseas-description" 
                      placeholder="输入链接描述">${escapeHtml(pageInfo.description)}</textarea>
          </div>
          
          <div class="eyeseas-row">
            <div class="eyeseas-form-group">
              <label class="eyeseas-label">分类</label>
              <select class="eyeseas-select" id="eyeseas-category">
                <option value="">加载中...</option>
              </select>
            </div>
            <div class="eyeseas-form-group">
              <label class="eyeseas-label">图标</label>
              <input type="text" class="eyeseas-input" id="eyeseas-icon" 
                     placeholder="例如: 🌐 或 mdi:home">
            </div>
          </div>
          
          <div class="eyeseas-form-group">
            <label class="eyeseas-label">Favicon URL</label>
            <input type="url" class="eyeseas-input" id="eyeseas-favicon" 
                   value="${escapeHtml(pageInfo.favicon)}" 
                   placeholder="网站图标地址">
          </div>
          
          <div class="eyeseas-form-group">
            <label class="eyeseas-label">标签</label>
            <div class="eyeseas-tags-input" id="eyeseas-tags-container">
              <input type="text" class="eyeseas-tag-input" id="eyeseas-tags-input" 
                     placeholder="输入标签后按 Enter 添加">
            </div>
            <div class="eyeseas-available-tags">
              <div class="eyeseas-available-tags-label">
                <span>📌 已有标签（点击选择）：</span>
              </div>
              <div class="eyeseas-available-tags-list" id="eyeseas-available-tags">
                <span class="eyeseas-tags-loading">加载中...</span>
              </div>
            </div>
          </div>
        </div>
        <div class="eyeseas-footer">
          <div class="eyeseas-footer-left">
            <label class="eyeseas-switch">
              <input type="checkbox" id="eyeseas-is-active" checked>
              <span class="eyeseas-switch-slider"></span>
            </label>
            <span class="eyeseas-switch-label">启用</span>
          </div>
          <div class="eyeseas-footer-right">
            <button class="eyeseas-btn eyeseas-btn-secondary" data-action="close">取消</button>
            <button class="eyeseas-btn eyeseas-btn-primary" data-action="submit">
              ✨ 添加链接
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalContainer);

    // 添加动画
    requestAnimationFrame(() => {
      modalContainer.querySelector('.eyeseas-overlay').classList.add('show');
      modalContainer.querySelector('.eyeseas-modal').classList.add('show');
    });

    // 绑定事件
    bindModalEvents();

    // 加载分类
    loadCategories();
    initTagsInput();
  }

  async function loadCategories() {
    const select = document.getElementById('eyeseas-category');
    if (!select) return;

    try {
      const categories = await fetchCategories();
      select.innerHTML = '<option value="">未分类</option>';
      categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = `${cat.icon || '📁'} ${cat.name}`;
        select.appendChild(option);
      });
    } catch (e) {
      select.innerHTML = '<option value="">获取分类失败</option>';
    }
  }

  function initTagsInput() {
    const container = document.getElementById('eyeseas-tags-container');
    const input = document.getElementById('eyeseas-tags-input');
    const availableTagsContainer = document.getElementById('eyeseas-available-tags');
    if (!container || !input) return;

    // 重置标签数组
    currentTags = [];
    let availableTags = []; // 远程获取的标签列表

    container.addEventListener('click', (e) => {
      // 处理删除标签
      if (e.target.classList.contains('eyeseas-tag-remove')) {
        const index = parseInt(e.target.dataset.index);
        currentTags.splice(index, 1);
        renderTags();
        updateAvailableTagsUI();
      } else {
        input.focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const tag = input.value.trim();
        if (tag && !currentTags.includes(tag)) {
          currentTags.push(tag);
          renderTags();
          updateAvailableTagsUI();
        }
        input.value = '';
      } else if (e.key === 'Backspace' && !input.value && currentTags.length > 0) {
        currentTags.pop();
        renderTags();
        updateAvailableTagsUI();
      }
    });

    // 支持粘贴多个标签（用逗号分隔）
    input.addEventListener('paste', (e) => {
      setTimeout(() => {
        const pastedText = input.value;
        if (pastedText.includes(',')) {
          const tags = pastedText.split(',').map(t => t.trim()).filter(t => t && !currentTags.includes(t));
          currentTags.push(...tags);
          input.value = '';
          renderTags();
          updateAvailableTagsUI();
        }
      }, 0);
    });

    function renderTags() {
      const existingTags = container.querySelectorAll('.eyeseas-tag');
      existingTags.forEach(t => t.remove());

      currentTags.forEach((tag, index) => {
        const tagEl = document.createElement('span');
        tagEl.className = 'eyeseas-tag';
        tagEl.innerHTML = `${escapeHtml(tag)}<span class="eyeseas-tag-remove" data-index="${index}">×</span>`;
        container.insertBefore(tagEl, input);
      });
    }

    // 更新可选标签的 UI 状态
    function updateAvailableTagsUI() {
      if (!availableTagsContainer) return;
      const tagElements = availableTagsContainer.querySelectorAll('.eyeseas-available-tag');
      tagElements.forEach(el => {
        const tagName = el.dataset.tag;
        if (currentTags.includes(tagName)) {
          el.classList.add('selected');
        } else {
          el.classList.remove('selected');
        }
      });
    }

    // 渲染可选标签列表
    function renderAvailableTags() {
      if (!availableTagsContainer) return;
      
      if (availableTags.length === 0) {
        availableTagsContainer.innerHTML = '<span class="eyeseas-tags-loading">暂无已有标签</span>';
        return;
      }

      availableTagsContainer.innerHTML = availableTags.map(item => {
        const isSelected = currentTags.includes(item.tag);
        return `<span class="eyeseas-available-tag${isSelected ? ' selected' : ''}" data-tag="${escapeHtml(item.tag)}">
          ${escapeHtml(item.tag)}
          <span class="eyeseas-available-tag-count">(${item.count})</span>
        </span>`;
      }).join('');

      // 绑定点击事件
      availableTagsContainer.querySelectorAll('.eyeseas-available-tag').forEach(el => {
        el.addEventListener('click', () => {
          const tag = el.dataset.tag;
          if (currentTags.includes(tag)) {
            // 取消选择
            currentTags = currentTags.filter(t => t !== tag);
          } else {
            // 添加标签
            currentTags.push(tag);
          }
          renderTags();
          updateAvailableTagsUI();
        });
      });
    }

    // 加载远程标签
    async function loadAvailableTags() {
      try {
        availableTags = await fetchTags();
        renderAvailableTags();
      } catch (e) {
        if (availableTagsContainer) {
          availableTagsContainer.innerHTML = '<span class="eyeseas-tags-loading">获取标签失败</span>';
        }
      }
    }

    // 初始化时加载远程标签
    loadAvailableTags();
  }

  function bindModalEvents() {
    const overlay = modalContainer.querySelector('.eyeseas-overlay');

    // 关闭按钮
    modalContainer.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // 点击遮罩关闭
    overlay.addEventListener('click', closeModal);

    // ESC 关闭
    document.addEventListener('keydown', handleEscKey);

    // 提交按钮
    modalContainer.querySelector('[data-action="submit"]').addEventListener('click', handleSubmit);
  }

  function handleEscKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function closeModal() {
    if (!modalContainer) return;

    const overlay = modalContainer.querySelector('.eyeseas-overlay');
    const modal = modalContainer.querySelector('.eyeseas-modal');

    overlay.classList.remove('show');
    modal.classList.remove('show');

    setTimeout(() => {
      modalContainer.remove();
      modalContainer = null;
      // 重置标签数组
      currentTags = [];
    }, 300);

    document.removeEventListener('keydown', handleEscKey);
  }

  function showMessage(type, text) {
    const container = modalContainer?.querySelector('.eyeseas-message-container');
    if (!container) return;

    container.innerHTML = `
      <div class="eyeseas-message eyeseas-message-${type}">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${text}
      </div>
    `;
  }

  async function handleSubmit() {
    const submitBtn = modalContainer.querySelector('[data-action="submit"]');
    const originalText = submitBtn.innerHTML;

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="eyeseas-loading"></span> 添加中...';

      const title = document.getElementById('eyeseas-title')?.value.trim();
      const internalUrl = document.getElementById('eyeseas-internal-url')?.value.trim();
      const externalUrl = document.getElementById('eyeseas-external-url')?.value.trim();
      const description = document.getElementById('eyeseas-description')?.value.trim();
      const categoryId = document.getElementById('eyeseas-category')?.value;
      const icon = document.getElementById('eyeseas-icon')?.value.trim();
      const favicon = document.getElementById('eyeseas-favicon')?.value.trim();
      const isActive = document.getElementById('eyeseas-is-active')?.checked;
      // 使用模块级变量获取标签
      const tags = [...currentTags];

      // 验证必填字段
      if (!title) {
        showMessage('error', '请输入标题');
        return;
      }
      if (!internalUrl) {
        showMessage('error', '请输入内网地址');
        return;
      }
      if (!externalUrl) {
        showMessage('error', '请输入外网地址');
        return;
      }
      if (!description) {
        showMessage('error', '请输入描述');
        return;
      }

      const linkData = {
        title,
        internalUrl,
        externalUrl,
        description,
        isActive,
      };

      if (categoryId) linkData.categoryId = categoryId;
      if (icon) linkData.icon = icon;
      if (favicon) linkData.favicon = favicon;
      if (tags.length > 0) linkData.tags = tags;

      await createLink(linkData);
      showMessage('success', '链接添加成功！');
      setTimeout(closeModal, 1500);

    } catch (error) {
      showMessage('error', error.message || '添加失败，请重试');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  // ========== 菜单注册 ==========
  GM_registerMenuCommand('📝 添加当前页面', createModal);

  // 快捷键支持 (Alt + A)
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'a') {
      e.preventDefault();
      createModal();
    }
  });

  console.log('🧭 EyeSeas Nav 油猴脚本已加载');
})();

