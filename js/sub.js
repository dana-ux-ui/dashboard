// 회원 목록 체크박스 및 인터랙션 처리
document.addEventListener('DOMContentLoaded', () => {
  const checkAll = document.getElementById('checkAll');
  const userChecks = document.querySelectorAll('.user-check');

  // 검색 토글 
  const btnToggleDetail = document.getElementById('btnToggleDetail');
  const filterGrid = document.querySelector('.filter-grid');
  let isExpanded = true;


  // 전체 선택/해제
  if (checkAll) {
    checkAll.addEventListener('change', (e) => {
      userChecks.forEach(chk => {
        chk.checked = e.target.checked;
      });
    });
  }

  // 선택 삭제 예시 이벤트
  const btnBatchDelete = document.getElementById('btnBatchDelete');
  if (btnBatchDelete) {
    btnBatchDelete.addEventListener('click', () => {
      const selected = Array.from(userChecks).filter(chk => chk.checked);
      if (selected.length === 0) {
        alert('삭제할 회원을 선택해주세요.');
        return;
      }
      if (confirm(`선택한 ${selected.length}명의 회원을 삭제하시겠습니까?`)) {
        selected.forEach(chk => {
          chk.closest('tr').remove();
        });
        alert('삭제되었습니다.');
      }
    });
  }

  // 검색 토글
 if (btnToggleDetail && filterGrid) {
    // 버튼 초기 텍스트 및 화살표 상태 설정 (기본이 펼쳐진 상태이므로)
    const btnText = btnToggleDetail.querySelector('span:first-child');
    const toggleIcon = btnToggleDetail.querySelector('.toggle-icon');
    
    if (btnText) btnText.textContent = '상세검색 접기';
    if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';

    // 1. 라인 계산 및 숨김/노출 처리 함수
    function updateFilterVisibility() {
      const items = filterGrid.querySelectorAll('.filter-group');
      if (items.length === 0) return;

      // 첫 번째 항목의 Y축 높이 위치 (첫 번째 줄의 기준점)
      const firstRowTop = items[0].offsetTop;

      items.forEach((item) => {
        // 첫 번째 줄보다 아래에 위치한 항목들 (두 번째 줄 이하)
        if (item.offsetTop > firstRowTop + 10) {
          if (isExpanded) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        } else {
          // 첫 번째 줄 항목은 항상 노출
          item.style.display = 'flex';
        }
      });
    }

    // 초기 실행 (기본적으로 펼쳐진 상태 유지)
    updateFilterVisibility();

    // 2. 버튼 클릭 이벤트 (접기 / 펼치기)
    btnToggleDetail.addEventListener('click', () => {
      isExpanded = !isExpanded;

      // 버튼 텍스트 및 화살표 상태 토글
      if (btnText) btnText.textContent = isExpanded ? '상세검색 접기' : '상세검색 펼치기';
      if (toggleIcon) toggleIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';

      updateFilterVisibility();
    });

    // 3. 브라우저 리사이즈 대응 (화면 너비 변화에 따른 줄바꿈 재계산)
    window.addEventListener('resize', () => {
      updateFilterVisibility();
    });
  }





  // 3. 신규 회원 등록 모달 동작
  const userRegisterModal = document.getElementById('userRegisterModal');
  const btnOpenUserModal = document.getElementById('btnOpenUserModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const registerUserForm = document.getElementById('registerUserForm');
  const userTableBody = document.getElementById('userTableBody');

  function closeModal() {
    if (userRegisterModal) {
      userRegisterModal.classList.remove('is-open');
    }
    if (registerUserForm) {
      registerUserForm.reset();
    }
  }

  // 등록 버튼 클릭 시 모달 열기
  if (btnOpenUserModal && userRegisterModal) {
    btnOpenUserModal.addEventListener('click', () => {
      userRegisterModal.classList.add('is-open');
    });
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (userRegisterModal) {
    userRegisterModal.addEventListener('click', (e) => {
      if (e.target === userRegisterModal) closeModal();
    });
  }

  // 폼 제출 이벤트 (테이블에 새 회원 행 추가)
  if (registerUserForm) {
    registerUserForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('regName').value;
      const email = document.getElementById('regEmail').value;
      const phone = document.getElementById('regPhone').value;
      const status = document.getElementById('regStatus').value;

      const today = new Date().toISOString().split('T')[0];
      const userCode = `USR-2026-${Math.floor(Math.random() * 900 + 100)}`;
      const statusBadge = status === 'active' 
        ? '<span class="status-badge success">정상</span>' 
        : '<span class="status-badge pending">승인대기</span>';

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td style="text-align: center;"><input type="checkbox" class="user-check" value="${userCode}"></td>
        <td class="font-mono">${userCode}</td>
        <td class="font-bold">${name}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${today}</td>
        <td>${statusBadge}</td>
        <td style="text-align: center;"><button class="btn btn-xs btn-outline">상세</button></td>
      `;

      if (userTableBody) {
        userTableBody.insertBefore(newRow, userTableBody.firstChild);
      }

      alert(`${name} 회원이 등록되었습니다.`);
      closeModal();
    });
  }



});



