/**
 * Notoow Influencer Finder - Notoow AI Agent MCP Assistant Drawer
 * 
 * Slide-over drawer providing interactive MCP Agent chat workflow for instant domain insights.
 */

import { escapeHTML, refreshLucideIcons } from './render.js';

export function initAgentDrawer() {
  const toggleBtn = document.getElementById('mcpAgentToggleBtn');
  const drawer = document.getElementById('mcpAgentDrawer');
  const closeBtn = document.getElementById('mcpAgentCloseBtn');
  const sendBtn = document.getElementById('mcpSendBtn');
  const input = document.getElementById('mcpInput');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
      refreshLucideIcons();
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => handleMcpMessage());
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleMcpMessage();
    });
  }
}

function handleMcpMessage() {
  const input = document.getElementById('mcpInput');
  const chatBody = document.getElementById('mcpChatMessages');
  if (!input || !chatBody) return;

  const text = input.value.trim();
  if (!text) return;

  // Add User Message
  const userMsg = document.createElement('div');
  userMsg.className = 'mcp-msg user';
  userMsg.innerHTML = `<div class="msg-bubble">${escapeHTML(text)}</div>`;
  chatBody.appendChild(userMsg);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Simulate AI Agent Processing
  setTimeout(() => {
    const agentMsg = document.createElement('div');
    agentMsg.className = 'mcp-msg agent';
    agentMsg.innerHTML = `
      <div class="msg-bubble">
        <span class="mcp-badge">NOTOOW AI ENGINE</span>
        <p style="margin: 4px 0 0;">
          '<strong>${escapeHTML(text)}</strong>' 요청을 Notoow Multimodal AI Data API로 처리했습니다.
          Supabase 및 실시간 인스타그램 릴스에서 관련 타겟 인플루언서 <strong>12명</strong>을 추출하여 피드에 업데이트했습니다!
        </p>
      </div>
    `;
    chatBody.appendChild(agentMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    refreshLucideIcons();
  }, 700);
}
