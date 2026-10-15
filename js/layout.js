document.addEventListener('DOMContentLoaded', () => {
      const sidebar = document.getElementById('sidebar');
      const toggleBtn = document.getElementById('toggleSidebar');
      const menuBtns = document.querySelectorAll('.has-sub > .menu-btn');

      // 1. 아코디언 메뉴 클릭 로직
      menuBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();

          if (sidebar.classList.contains('collapsed')) return;

          const parentLi = btn.parentElement;
          const subMenu = parentLi.querySelector(':scope > .sub-menu');

          if (parentLi.classList.contains('open')) {
            parentLi.classList.remove('open');
            slideUp(subMenu);
          } else {
            const siblings = parentLi.parentElement.children;
            Array.from(siblings).forEach(sibling => {
              if (sibling !== parentLi && sibling.classList.contains('open')) {
                sibling.classList.remove('open');
                const siblingSubMenu = sibling.querySelector(':scope > .sub-menu');
                if (siblingSubMenu) slideUp(siblingSubMenu);
              }
            });

            parentLi.classList.add('open');
            slideDown(subMenu);
          }
        });
      });

      // 2. 사이드바 접기/펼치기 토글 버튼
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');

        if (sidebar.classList.contains('collapsed')) {
          document.querySelectorAll('.has-sub.open').forEach(item => {
            item.classList.remove('open');
          });
          document.querySelectorAll('.sub-menu').forEach(sub => {
            sub.style.display = '';
            sub.style.height = '';
          });
        }
      });

      // 3. 슬라이드 애니메이션 함수
      function slideDown(element) {
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.transition = 'height 0.25s ease';

        requestAnimationFrame(() => {
          element.style.height = height + 'px';
        });

        setTimeout(() => {
          element.style.height = '';
          element.style.overflow = '';
          element.style.transition = '';
        }, 250);
      }

      function slideUp(element) {
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = 'height 0.25s ease';

        requestAnimationFrame(() => {
          element.style.height = '0px';
        });

        setTimeout(() => {
          element.style.display = 'none';
          element.style.height = '';
          element.style.overflow = '';
          element.style.transition = '';
        }, 250);
      }

      // 4. Chart.js 시각화
      const ctxSales = document.getElementById('salesChart').getContext('2d');
      new Chart(ctxSales, {
        type: 'line',
        data: {
          labels: ['월', '화', '수', '목', '금', '토', '일'],
          datasets: [{
            label: '매출액 (만원)',
            data: [420, 590, 510, 680, 840, 910, 845],
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            fill: true,
            tension: 0.35
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

      const ctxTraffic = document.getElementById('trafficChart').getContext('2d');
      new Chart(ctxTraffic, {
        type: 'doughnut',
        data: {
          labels: ['검색 엔진', '직접 방문', '소셜 미디어', '기타'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#0284c7', '#38bdf8', '#fbbf24', '#cbd5e1']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    });