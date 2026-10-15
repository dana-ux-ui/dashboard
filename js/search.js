/* =========================================================
   1. 데이터셋 정의
   ========================================================= */
const REGION_DATA = [
  { id: "seoul", name: "서울", sub: ["서울 전체", "강남구", "서초구", "송파구", "마포구", "영등포구"] },
  { id: "gyeonggi", name: "경기", sub: ["경기 전체", "수원시", "성남시", "부천시", "화성시", "용인시", "안양시"] },
  { id: "incheon", name: "인천", sub: ["인천 전체", "강화군", "검단구", "계양구", "남동구"] },
  { id: "busan", name: "부산", sub: ["부산 전체", "해운대구", "부산진구", "동래구"] },
  { id: "daegu", name: "대구", sub: ["대구 전체", "수성구", "달서구", "중구"] }
];

const DONG_DATA_MAP = {
  "강남구": ["강남구 전체", "역삼동", "개포동", "청담동", "삼성동", "대치동", "신사동", "논현동", "압구정동"],
  "서초구": ["서초구 전체", "서초동", "잠원동", "반포동", "방배동", "양재동"],
  "송파구": ["송파구 전체", "잠실동", "신천동", "문정동", "가락동", "방이동"],
  "마포구": ["마포구 전체", "공덕동", "아현동", "도화동", "망원동", "상암동"],
  "영등포구": ["영등포구 전체", "여의도동", "당산동", "문래동", "영등포동"],
  "계양구": ["계양구 전체", "계산동", "계양동", "작전동", "작전서운동", "효성동"],
  "강화군": ["강화군 전체", "강화읍", "선원면"],
  "남동구": ["남동구 전체", "구월동", "논현동", "간석동"],
  "검단구": ["검단구 전체", "당하동", "원당동"]
};

const JOB_DATA = [
  {
    id: "food",
    name: "외식·음료",
    sub: ["외식·음료 전체", "바리스타", "홀서빙", "주방보조", "조리사", "매장관리"]
  },
  {
    id: "office",
    name: "사무직",
    sub: [
      "사무직 전체", "사무보조", "문서작성·자료조사", "데이터수집·가공",
      "비서", "경리·회계보조", "기획·인사·총무", "재고·구매·자재관리"
    ]
  },
  {
    id: "production",
    name: "생산·건설·노무",
    sub: ["생산·건설 전체", "제조·조립", "품질검사", "물류·포장", "단순노무", "설비기사"]
  },
  {
    id: "hospital",
    name: "병원·간호·연구",
    sub: ["병원·간호 전체", "간호조무사", "치과위생사", "물리치료사", "원무행정"]
  },
  {
    id: "store",
    name: "매장관리·판매",
    sub: ["매장관리 전체", "의류판매", "편의점", "마트·슈퍼", "화장품판매"]
  }
];

const BENEFITS_ITEMS = [
  "국민연금", "건강보험", "고용보험", "산재보험", "퇴직금",
  "야근수당", "휴일수당", "정기보너스", "인센티브제", "연차", "주5일근무"
];

// 상태 관리
const state = {
  isOpen: false,
  currentView: null,
  isDetailOpen: false,

  activeSidoId: 'seoul',
  activeSigunguName: null,
  activeJobId: 'food',

  selectedTags: [],
  selectedBenefits: []
};

let tempSelectedItems = new Set();

// DOM 캐싱
const filterCard = document.getElementById('filter-card');
const tabRegion = document.getElementById('tab-region');
const tabJob = document.getElementById('tab-job');
const tabTime = document.getElementById('tab-time');
const btnDetailToggle = document.getElementById('btn-detail-toggle');
const detailBtnText = document.getElementById('detail-btn-text');
const detailBtnIcon = document.getElementById('detail-btn-icon');

const viewRegion = document.getElementById('view-region');
const viewJob = document.getElementById('view-job');
const viewTime = document.getElementById('view-time');
const viewDetail = document.getElementById('view-detail');

const countRegionTab = document.getElementById('count-region-tab');
const countJobTab = document.getElementById('count-job-tab');
const countTimeTab = document.getElementById('count-time-tab');

const regionDepth1List = document.getElementById('region-depth1-list');
const regionDepth2List = document.getElementById('region-depth2-list');
const regionDepth3Checkboxes = document.getElementById('region-depth3-checkboxes');

const jobDepth1List = document.getElementById('job-depth1-list');
const jobDepth2Checkboxes = document.getElementById('job-depth2-checkboxes');

const selectedTagsContainer = document.getElementById('selected-tags-container');
const btnResetAll = document.getElementById('btn-reset-all');
const btnSubmitSearch = document.getElementById('btn-submit-search');

const topKeywordInput = document.getElementById('top-keyword-input');
const btnApplyKeyword = document.getElementById('btn-apply-keyword');
const toastMsg = document.getElementById('toast-msg');

const chkTimeCustom = document.getElementById('chk-time-custom');
const selTimeStart = document.getElementById('sel-time-start');
const selTimeEnd = document.getElementById('sel-time-end');
const payTypeRadios = document.querySelectorAll('input[name="payType"]');
const payInputAmount = document.getElementById('input-pay-amount');

const optionModalOverlay = document.getElementById('option-modal-overlay');
const modalItemsContainer = document.getElementById('modal-items-container');
const btnModalClose = document.getElementById('btn-modal-close');
const btnModalConfirm = document.getElementById('btn-modal-confirm');
const btnOpenBenefits = document.getElementById('btn-open-benefits');
const benefitsTagsContainer = document.getElementById('benefits-tags-container');

function showToast(message) {
  toastMsg.textContent = message;
  toastMsg.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 2000);
}

/* =========================================================
   2. 패널 제어
   ========================================================= */
function toggleView(viewName) {
  if (state.isOpen && state.currentView === viewName) {
    closeFilter();
  } else {
    openView(viewName);
  }
}

function closeFilter() {
  state.isOpen = false;
  state.currentView = null;
  state.isDetailOpen = false;

  filterCard.classList.add('is-collapsed');
  [tabRegion, tabJob, tabTime].forEach(tab => tab.classList.remove('active'));
  btnDetailToggle.classList.remove('active');
  detailBtnText.textContent = '상세조건';
  detailBtnIcon.textContent = '+';

  viewRegion.style.display = 'none';
  viewJob.style.display = 'none';
  viewTime.style.display = 'none';
  viewDetail.style.display = 'none';
}

function openView(viewName) {
  state.isOpen = true;
  state.currentView = viewName;

  filterCard.classList.remove('is-collapsed');
  [tabRegion, tabJob, tabTime].forEach(tab => tab.classList.remove('active'));

  if (viewName === 'detail') {
    state.isDetailOpen = true;
    btnDetailToggle.classList.add('active');
    detailBtnText.textContent = '상세조건';
    detailBtnIcon.textContent = '✕';
  } else {
    state.isDetailOpen = false;
    btnDetailToggle.classList.remove('active');
    detailBtnText.textContent = '상세조건';
    detailBtnIcon.textContent = '+';
    const targetTab = document.querySelector(`.tab-item[data-view="${viewName}"]`);
    if (targetTab) targetTab.classList.add('active');
  }

  viewRegion.style.display = (viewName === 'region') ? 'block' : 'none';
  viewJob.style.display = (viewName === 'job') ? 'block' : 'none';
  viewTime.style.display = (viewName === 'time') ? 'block' : 'none';
  viewDetail.style.display = (viewName === 'detail') ? 'block' : 'none';
}

[tabRegion, tabJob, tabTime].forEach(tab => {
  tab.addEventListener('click', () => toggleView(tab.dataset.view));
});

btnDetailToggle.addEventListener('click', () => toggleView('detail'));

/* =========================================================
   3. 1번 탭: 지역 렌더링
   ========================================================= */
function renderRegionDepth1() {
  regionDepth1List.innerHTML = '';
  REGION_DATA.forEach(sido => {
    const isSelected = (sido.id === state.activeSidoId);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-item-btn ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span>${sido.name}</span>
      ${isSelected ? `<svg class="arrow-right" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>` : ''}
    `;
    btn.addEventListener('click', () => {
      state.activeSidoId = sido.id;
      state.activeSigunguName = null;
      renderRegionDepth1();
      renderRegionDepth2();
      renderRegionDepth3();
    });
    regionDepth1List.appendChild(btn);
  });
}

function renderRegionDepth2() {
  regionDepth2List.innerHTML = '';
  if (!state.activeSidoId) return;

  const activeSido = REGION_DATA.find(s => s.id === state.activeSidoId);
  if (!activeSido) return;

  activeSido.sub.forEach(sigungu => {
    const isSelected = (sigungu === state.activeSigunguName);
    const isAllItem = sigungu.endsWith(' 전체');
    const isTagSelected = state.selectedTags.some(t => t.type === 'region' && t.label === sigungu);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-item-btn ${isSelected ? 'selected' : ''} ${isTagSelected ? 'checked' : ''}`;
    
    btn.innerHTML = `
      <span>${sigungu}</span>
      ${isAllItem && isTagSelected ? `
        <svg class="check-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      ` : !isAllItem ? `
        <svg class="arrow-right" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      ` : ''}
    `;

    btn.addEventListener('click', () => {
      state.activeSigunguName = sigungu;

      if (isAllItem) {
        if (isTagSelected) {
          removeTagDirect('region', sigungu);
          renderTags();
        } else {
          state.selectedTags = state.selectedTags.filter(t => !(t.type === 'region' && t.sidoId === activeSido.id));
          addTag('region', sigungu, 5, { sidoId: activeSido.id, sigungu: sigungu });
        }
      }

      renderRegionDepth2();
      renderRegionDepth3();
    });

    regionDepth2List.appendChild(btn);
  });
}

function renderRegionDepth3() {
  regionDepth3Checkboxes.innerHTML = '';

  if (!state.activeSigunguName) {
    regionDepth3Checkboxes.innerHTML = '<div class="empty-guide-box" style="grid-column: 1 / -1;">구/군을 선택해주세요</div>';
    return;
  }

  if (state.activeSigunguName.endsWith(' 전체')) {
    regionDepth3Checkboxes.innerHTML = `
      <div class="empty-guide-box" style="grid-column: 1 / -1;">
        하위 읍/면/동이 없는 전체 선택 지역입니다.
      </div>
    `;
    return;
  }

  const activeSido = REGION_DATA.find(s => s.id === state.activeSidoId);
  const dongs = DONG_DATA_MAP[state.activeSigunguName] || [
    `${state.activeSigunguName} 전체`,
    `${state.activeSigunguName} 1동`,
    `${state.activeSigunguName} 2동`
  ];

  dongs.forEach(dong => {
    const isChecked = state.selectedTags.some(t => t.type === 'region' && t.label === dong);
    const label = document.createElement('label');
    label.className = 'custom-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;

    checkbox.addEventListener('change', () => {
      handleDongCheck(activeSido, state.activeSigunguName, dong, dongs, checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + dong));
    regionDepth3Checkboxes.appendChild(label);
  });
}

function handleDongCheck(activeSido, sigunguName, dong, allDongs, isChecked) {
  const isAll = dong.endsWith(' 전체');
  const sidoAllName = `${activeSido.name} 전체`;

  if (isChecked) {
    removeTagDirect('region', sidoAllName);

    if (isAll) {
      allDongs.forEach(d => {
        if (d !== dong) removeTagDirect('region', d);
      });
      addTag('region', dong, 5, { sidoId: activeSido.id, sigungu: sigunguName });
    } else {
      const sigunguAllName = `${sigunguName} 전체`;
      removeTagDirect('region', sigunguAllName);
      addTag('region', dong, 5, { sidoId: activeSido.id, sigungu: sigunguName });
    }
  } else {
    removeTagDirect('region', dong);
    renderTags();
  }

  renderRegionDepth2();
  renderRegionDepth3();
}

/* =========================================================
   4. 2번 탭: 업직종 렌더링
   ========================================================= */
function renderJobDepth1() {
  jobDepth1List.innerHTML = '';
  JOB_DATA.forEach(category => {
    const isSelected = (category.id === state.activeJobId);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-item-btn ${isSelected ? 'selected' : ''}`;
    btn.innerHTML = `
      <span>${category.name}</span>
      ${isSelected ? `<svg class="arrow-right" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>` : ''}
    `;
    btn.addEventListener('click', () => {
      state.activeJobId = category.id;
      renderJobDepth1();
      renderJobDepth2();
    });
    jobDepth1List.appendChild(btn);
  });
}

function renderJobDepth2() {
  jobDepth2Checkboxes.innerHTML = '';
  if (!state.activeJobId) return;

  const activeCat = JOB_DATA.find(c => c.id === state.activeJobId);
  if (!activeCat) return;

  activeCat.sub.forEach(subItem => {
    const isChecked = state.selectedTags.some(t => t.type === 'job' && t.label === subItem);
    const label = document.createElement('label');
    label.className = 'custom-check';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isChecked;

    checkbox.addEventListener('change', () => {
      handleJobCheck(activeCat, subItem, checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + subItem));
    jobDepth2Checkboxes.appendChild(label);
  });
}

function handleJobCheck(category, subItem, isChecked) {
  const allItemName = `${category.name} 전체`;
  const isAll = (subItem === allItemName);

  if (isChecked) {
    if (isAll) {
      category.sub.forEach(item => {
        if (item !== allItemName) {
          removeTagDirect('job', item);
        }
      });
      addTag('job', subItem, 5, { categoryId: category.id });
    } else {
      removeTagDirect('job', allItemName);
      addTag('job', subItem, 5, { categoryId: category.id });
    }
  } else {
    removeTagDirect('job', subItem);
    renderTags();
  }

  renderJobDepth2();
}

/* =========================================================
   5. 3번 탭 & 상세조건 필터
   ========================================================= */
function initTimeFilters() {
  const workTimeCheckboxes = document.querySelectorAll('input[name="workTime"]:not(#chk-time-custom)');
  workTimeCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        addTag('time', cb.value, 5, { category: 'workTime', value: cb.value });
      } else {
        removeTagDirect('time', cb.value);
        renderTags();
      }
    });
  });

  function syncCustomTimeTag() {
    const start = selTimeStart.value;
    const end = selTimeEnd.value;
    const existingIdx = state.selectedTags.findIndex(t => t.type === 'time' && t.category === 'workTimeCustom');

    if (chkTimeCustom.checked) {
      const displayLabel = (start || end) ? `시간: ${start || '00:00'}~${end || '24:00'}` : '시간: 직접선택';
      
      if (existingIdx > -1) {
        state.selectedTags[existingIdx].label = displayLabel;
      } else {
        if (state.selectedTags.filter(t => t.type === 'time').length >= 5) {
          showToast('시간별 조건은 최대 5개까지 선택 가능합니다.');
          chkTimeCustom.checked = false;
          selTimeStart.value = '';
          selTimeEnd.value = '';
          return;
        }
        state.selectedTags.push({
          type: 'time',
          label: displayLabel,
          category: 'workTimeCustom',
          value: '직접선택'
        });
      }
      renderTags();
    } else {
      if (existingIdx > -1) {
        state.selectedTags.splice(existingIdx, 1);
        selTimeStart.value = '';
        selTimeEnd.value = '';
        renderTags();
      }
    }
  }

  chkTimeCustom.addEventListener('change', syncCustomTimeTag);
  selTimeStart.addEventListener('change', () => {
    chkTimeCustom.checked = true;
    syncCustomTimeTag();
  });
  selTimeEnd.addEventListener('change', () => {
    chkTimeCustom.checked = true;
    syncCustomTimeTag();
  });

  const workTimeOptionCheckboxes = document.querySelectorAll('input[name="workTimeOption"]');
  workTimeOptionCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        addTag('time', cb.value, 5, { category: 'workTimeOption', value: cb.value });
      } else {
        removeTagDirect('time', cb.value);
        renderTags();
      }
    });
  });

  const workDayRadios = document.querySelectorAll('input[name="workDay"]');
  workDayRadios.forEach(rb => {
    rb.addEventListener('change', () => {
      if (rb.checked) {
        state.selectedTags = state.selectedTags.filter(t => !(t.type === 'time' && t.category === 'workDay'));
        state.selectedTags.push({
          type: 'time',
          label: rb.value,
          category: 'workDay',
          value: rb.value
        });
        renderTags();
      }
    });
  });

  const workPeriodCheckboxes = document.querySelectorAll('input[name="workPeriod"]');
  workPeriodCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        addTag('time', cb.value, 5, { category: 'workPeriod', value: cb.value });
      } else {
        removeTagDirect('time', cb.value);
        renderTags();
      }
    });
  });
}

function syncTimeFilterUI(tag) {
  if (tag.category === 'workTime') {
    const cb = document.querySelector(`input[name="workTime"][value="${tag.value}"]`);
    if (cb) cb.checked = false;
  } else if (tag.category === 'workTimeCustom') {
    chkTimeCustom.checked = false;
    selTimeStart.value = '';
    selTimeEnd.value = '';
  } else if (tag.category === 'workTimeOption') {
    const cb = document.querySelector(`input[name="workTimeOption"][value="${tag.value}"]`);
    if (cb) cb.checked = false;
  } else if (tag.category === 'workDay') {
    const rb = document.querySelector(`input[name="workDay"][value="${tag.value}"]`);
    if (rb) rb.checked = false;
  } else if (tag.category === 'workPeriod') {
    const cb = document.querySelector(`input[name="workPeriod"][value="${tag.value}"]`);
    if (cb) cb.checked = false;
  }
}

payTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const selected = document.querySelector('input[name="payType"]:checked');
    if (!selected || selected.value === '회사내규') {
      payInputAmount.disabled = true;
      payInputAmount.value = '';
    } else {
      payInputAmount.disabled = false;
      payInputAmount.focus();
    }
  });
});

payInputAmount.addEventListener('input', (e) => {
  const rawValue = e.target.value.replace(/[^0-9]/g, '');
  e.target.value = rawValue ? Number(rawValue).toLocaleString() : '';
});

btnOpenBenefits.addEventListener('click', () => {
  tempSelectedItems = new Set(state.selectedBenefits);
  modalItemsContainer.innerHTML = '';

  BENEFITS_ITEMS.forEach(item => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `btn-option-pill ${tempSelectedItems.has(item) ? 'selected' : ''}`;
    btn.textContent = item;
    btn.addEventListener('click', () => {
      if (tempSelectedItems.has(item)) tempSelectedItems.delete(item);
      else tempSelectedItems.add(item);
      btn.classList.toggle('selected');
    });
    modalItemsContainer.appendChild(btn);
  });

  optionModalOverlay.classList.add('show');
});

btnModalClose.addEventListener('click', () => optionModalOverlay.classList.remove('show'));
btnModalConfirm.addEventListener('click', () => {
  state.selectedBenefits = Array.from(tempSelectedItems);
  benefitsTagsContainer.innerHTML = '';
  state.selectedBenefits.forEach(item => {
    const chip = document.createElement('div');
    chip.className = 'chip-item';
    chip.innerHTML = `<span>${item}</span><button type="button" class="btn-remove-chip">✕</button>`;
    chip.querySelector('.btn-remove-chip').addEventListener('click', () => {
      state.selectedBenefits = state.selectedBenefits.filter(i => i !== item);
      chip.remove();
    });
    benefitsTagsContainer.appendChild(chip);
  });
  optionModalOverlay.classList.remove('show');
});

/* =========================================================
   6. 태그 바 및 초기화 로직
   ========================================================= */
function renderTags() {
  selectedTagsContainer.innerHTML = '';

  state.selectedTags.forEach((tag, index) => {
    const tagEl = document.createElement('div');
    let badgeClass = 'tag-badge';
    if (tag.type === 'region') badgeClass += ' tag-region';
    else if (tag.type === 'job') badgeClass += ' tag-job';
    else if (tag.type === 'time') badgeClass += ' tag-time';
    else if (tag.type === 'keyword') badgeClass += ' tag-keyword';

    tagEl.className = badgeClass;
    tagEl.innerHTML = `
      <span>${tag.label}</span>
      <button type="button" class="btn-remove-tag" data-index="${index}">✕</button>
    `;

    selectedTagsContainer.appendChild(tagEl);
  });

  updateCounts();
}

function updateCounts() {
  const regionCount = state.selectedTags.filter(t => t.type === 'region').length;
  const jobCount = state.selectedTags.filter(t => t.type === 'job').length;
  const timeCount = state.selectedTags.filter(t => t.type === 'time').length;

  countRegionTab.textContent = `${regionCount}/5`;
  countJobTab.textContent = `${jobCount}/5`;
  if (countTimeTab) countTimeTab.textContent = `${timeCount}/5`;
}

function addTag(type, label, maxLimit = 5, extraData = {}) {
  const currentCount = state.selectedTags.filter(t => t.type === type).length;
  if (currentCount >= maxLimit) {
    showToast(`최대 ${maxLimit}개까지 선택 가능합니다.`);
    renderRegionDepth2();
    renderRegionDepth3();
    renderJobDepth2();
    return;
  }

  if (!state.selectedTags.some(t => t.type === type && t.label === label)) {
    state.selectedTags.push({ type, label, ...extraData });
    renderTags();
  }
}

function removeTagDirect(type, label) {
  const idx = state.selectedTags.findIndex(t => t.type === type && t.label === label);
  if (idx > -1) {
    const removed = state.selectedTags.splice(idx, 1)[0];
    if (removed.type === 'time') syncTimeFilterUI(removed);
    return true;
  }
  return false;
}

selectedTagsContainer.addEventListener('click', (e) => {
  const removeBtn = e.target.closest('.btn-remove-tag');
  if (removeBtn) {
    const index = parseInt(removeBtn.dataset.index, 10);
    const removedTag = state.selectedTags.splice(index, 1)[0];
    if (removedTag && removedTag.type === 'time') syncTimeFilterUI(removedTag);
    
    renderTags();
    renderRegionDepth2();
    renderRegionDepth3();
    renderJobDepth2();
  }
});

btnResetAll.addEventListener('click', () => {
  state.selectedTags = [];
  state.activeSigunguName = null;
  topKeywordInput.value = '';
  
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
  document.querySelectorAll('select').forEach(sel => sel.selectedIndex = 0);
  
  if (payInputAmount) {
    payInputAmount.value = '';
    payInputAmount.disabled = true;
  }

  state.selectedBenefits = [];
  benefitsTagsContainer.innerHTML = '';

  renderTags();
  renderRegionDepth1();
  renderRegionDepth2();
  renderRegionDepth3();
  renderJobDepth1();
  renderJobDepth2();
  showToast('모든 조건이 초기화되었습니다.');
});

btnApplyKeyword.addEventListener('click', () => {
  const val = topKeywordInput.value.trim();
  if (!val) {
    showToast('검색할 키워드를 입력해주세요.');
    return;
  }

  if (!state.selectedTags.some(t => t.type === 'keyword' && t.label === val)) {
    state.selectedTags.push({ type: 'keyword', label: val });
    renderTags();
    topKeywordInput.value = '';
  }
});

topKeywordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btnApplyKeyword.click();
});

btnSubmitSearch.addEventListener('click', () => {
  const labels = state.selectedTags.map(t => t.label);
  showToast(labels.length > 0 ? `[${labels.join(', ')}] 검색을 진행합니다.` : '선택된 조건으로 검색합니다.');
});

// 초기 실행
renderRegionDepth1();
renderRegionDepth2();
renderRegionDepth3();
renderJobDepth1();
renderJobDepth2();
initTimeFilters();
renderTags();