/**
 * Notoow Influencer Finder - 1-Click Executive AI Report Modal
 * 
 * Generates instant executive-ready Markdown/HTML research reports with 1-click share links.
 */

import { store } from '../store.js';
import { escapeHTML, refreshLucideIcons } from './render.js';

export function openReportModal() {
  const modal = document.getElementById('reportModal');
  const body = document.getElementById('reportModalBody');
  if (!modal || !body) return;

  const currentList = store.getFilteredData();
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  body.innerHTML = `
    <div style="padding: 10px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--brand-primary); padding-bottom: 12px; margin-bottom: 16px;">
        <div>
          <span style="font-size: 11px; font-weight: 800; color: var(--brand-dark); letter-spacing: 0.05em;">NOTOOW MULTIMODAL AI REPORT</span>
          <h2 style="font-size: 20px; color: var(--text-primary); margin: 4px 0 0; font-weight: 900;">
            인플루언서 발굴 & 세그먼트 분석 경영진 보고서
          </h2>
        </div>
        <span style="font-size: 12px; color: var(--text-muted);">${dateStr}</span>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: var(--radius-md); margin-bottom: 16px; font-size: 13px; color: var(--text-secondary);">
        <strong>Executive Summary:</strong> Notoow AI Data API 파이프라인으로 타겟 뷰티·패션·라이프스타일 인플루언서 총 <strong>${currentList.length}명</strong>을 정밀 추출하였습니다.
      </div>

      <h4 style="font-size: 14px; color: var(--brand-dark); margin: 0 0 8px;">Top 5 추천 인플루언서 목록</h4>
      <div style="margin-bottom: 16px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #F1F5F9; text-align: left; color: var(--text-secondary);">
              <th style="padding: 8px;">핸들</th>
              <th style="padding: 8px;">이름</th>
              <th style="padding: 8px;">국가</th>
              <th style="padding: 8px;">팔로워</th>
              <th style="padding: 8px;">Score</th>
            </tr>
          </thead>
          <tbody>
            ${currentList.slice(0, 5).map(item => `
              <tr style="border-bottom: 1px solid #E2E8F0;">
                <td style="padding: 8px; font-weight: 700; color: var(--brand-dark);">@${escapeHTML(item.handle)}</td>
                <td style="padding: 8px;">${escapeHTML(item.name)}</td>
                <td style="padding: 8px;">${item.country === 'KR' ? '🇰🇷 KR' : '🇺🇸 US'}</td>
                <td style="padding: 8px;">${(item.followers / 1000).toFixed(1)}K</td>
                <td style="padding: 8px; font-weight: 800;">${item.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="action-btn-brand" onclick="copyReportShareLink()">
          <i data-lucide="share-2" style="width: 14px; height: 14px;"></i> 1-Click 공유 링크 복사
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  refreshLucideIcons();
}

export function closeReportModal() {
  const modal = document.getElementById('reportModal');
  if (modal) modal.classList.remove('active');
}

export function copyReportShareLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    alert('✅ 1-Click 리포트 공유 링크가 클립보드에 복사되었습니다!');
  }).catch(() => {
    alert('공유 링크: ' + url);
  });
}
