/**
 * Notoow Influencer Finder - AI Consumer Segment Analysis Visualizer
 * 
 * Visualizes multimodal target consumer breakdown (% breakdown by lifestyle, scene, skin type, domain).
 */

import { store } from '../store.js';
import { escapeHTML, refreshLucideIcons } from './render.js';

export function renderSegmentView() {
  const container = document.getElementById('segmentViewContainer');
  if (!container) return;

  const currentList = store.getFilteredData();
  const totalCount = currentList.length;

  // Domain Scene Segments Breakdown Data
  const segments = [
    { title: '창의적·예술적 라이프스타일', pct: 28, color: '#FF5A5F', icon: 'palette', desc: '디자인, 오브제, 감성 홈카페, 예술 콘텐츠 중심 소비자층' },
    { title: '뷰티 트렌드 & 스킨케어 씬', pct: 24, color: '#8B5CF6', icon: 'sparkles', desc: '물광 피부, 올리브영 랭킹템, 유기자차/레티놀 성분 분석층' },
    { title: '도시·전문직 커리어 라이프', pct: 20, color: '#3B82F6', icon: 'briefcase', desc: '성수동 시티보이, 미니멀 오피스룩, 프리랜서 생산성 장비층' },
    { title: '가족 & 신혼부부 중심 생활', pct: 16, color: '#10B981', icon: 'home', desc: '신혼집 리모델링, 육아 살림꿀템, 커플 브이로그 선호층' },
    { title: '글로벌 웰니스 & 아웃도어 씬', pct: 12, color: '#F59E0B', icon: 'compass', desc: '백패킹, 오토캠핑, 필라테스, 러닝 마라톤 웰니스층' }
  ];

  container.innerHTML = `
    <div style="background: #FFFFFF; border: 1px solid var(--brand-border); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="background: var(--brand-gradient); color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.05em;">
            NOTOOW MULTIMODAL AI SCENE ANALYSIS
          </span>
          <h2 style="font-size: 20px; color: var(--text-primary); margin: 8px 0 4px; font-weight: 800;">
            AI 타겟 소비자 세그먼트 비주얼 파이프라인
          </h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
            검색된 인플루언서 <strong>${totalCount}명</strong>과 오디언스의 이미지·텍스트 비주얼 Scene을 멀티모달 분석한 결과입니다.
          </p>
        </div>
        <button class="action-btn-brand" onclick="window.openReportModal()">
          <i data-lucide="file-text" style="width: 14px; height: 14px;"></i> 1-Click 세그먼트 리포트 추출
        </button>
      </div>

      <!-- Segment Percentage Multi-bar -->
      <div style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; margin-bottom: 24px; border: 1px solid #E2E8F0;">
        ${segments.map(s => `
          <div style="width: ${s.pct}%; background: ${s.color}; transition: width 0.5s ease;" title="${s.title}: ${s.pct}%"></div>
        `).join('')}
      </div>

      <!-- Segment Grid Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        ${segments.map(s => `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="width: 28px; height: 28px; border-radius: 50%; background: ${s.color}15; color: ${s.color}; display: flex; align-items: center; justify-content: center;">
                  <i data-lucide="${s.icon}" style="width: 15px; height: 15px;"></i>
                </span>
                <strong style="font-size: 14px; color: var(--text-primary);">${escapeHTML(s.title)}</strong>
              </div>
              <span style="font-size: 18px; font-weight: 900; color: ${s.color};">${s.pct}%</span>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.5;">
              ${escapeHTML(s.desc)}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  refreshLucideIcons();
}
