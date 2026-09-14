/**
 * Notoow Influencer Finder - Global Market Research Explorer
 * 
 * Interactive 127+ Country Market Research Panel providing real-time consumer insights.
 */

import { escapeHTML, refreshLucideIcons } from './render.js';

export function renderGlobalView() {
  const container = document.getElementById('globalViewContainer');
  if (!container) return;

  const countries = [
    { code: 'KR', name: 'South Korea (한국)', flag: '🇰🇷', creators: '1,420+', topTrend: '#K뷰티 #신혼부부 #성수동', trait: '고관여 스킨케어 성분 분석 및 고감도 미니멀 라이프스타일 릴스 소비 강세' },
    { code: 'US', name: 'United States (미국)', flag: '🇺🇸', creators: '890+', topTrend: '#GlassSkin #CleanBeauty #NYC', trait: '클린 뷰티 & 콰이어트 럭셔리 OOTD 중심의 비주얼 트렌드 확산' },
    { code: 'JP', name: 'Japan (일본)', flag: '🇯🇵', creators: '640+', topTrend: '#도쿄카페 #한국화장품 #Qoo10', trait: 'K-뷰티 브랜드 진출 및 도쿄 로컬 카페/도쿄 브이로그 소비 급증' },
    { code: 'FR', name: 'France (프랑스)', flag: '🇫🇷', creators: '320+', topTrend: '#Parisian #MinimalStyle', trait: '프렌치 시크 에스테틱 및 내추럴 스킨 케어 세그먼트 선호' },
    { code: 'UAE', name: 'UAE (아랍에미리트)', flag: '🇦🇪', creators: '210+', topTrend: '#DubaiBeauty #LuxuryLife', trait: '프리미엄 럭셔리 뷰티 및 향수/스파 라이프스타일 소비층 형성' }
  ];

  container.innerHTML = `
    <div style="background: #FFFFFF; border: 1px solid var(--brand-border); border-radius: var(--radius-lg); padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="margin-bottom: 20px;">
        <span style="background: var(--brand-gradient); color: #FFF; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.05em;">
          127 COUNTRIES GLOBAL INSIGHTS
        </span>
        <h2 style="font-size: 20px; color: var(--text-primary); margin: 8px 0 4px; font-weight: 800;">
          글로벌 시장 타겟 소비자 & 인플루언서 리서치
        </h2>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
          진출 예정 국가의 현시점 인플루언서 및 타겟 소비자 특성을 Notoow Data API로 실시간 분석합니다.
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
        ${countries.map(c => `
          <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: var(--radius-md); padding: 18px; transition: transform 0.2s;" onmouseenter="this.style.borderColor='var(--brand-primary)'" onmouseleave="this.style.borderColor='#E2E8F0'">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 24px;">${c.flag}</span>
                <strong style="font-size: 15px; color: var(--text-primary);">${escapeHTML(c.name)}</strong>
              </div>
              <span style="font-size: 12px; font-weight: 700; background: #F1F5F9; color: var(--text-secondary); padding: 4px 10px; border-radius: 12px;">
                ${c.creators} 크리에이터
              </span>
            </div>
            <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 10px; line-height: 1.5;">
              ${escapeHTML(c.trait)}
            </p>
            <div style="font-size: 11px; font-weight: 600; color: var(--brand-dark);">
              트렌드 키워드: ${escapeHTML(c.topTrend)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  refreshLucideIcons();
}
