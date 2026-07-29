/* ============================================================
   UI 현지화 (한국어 / 영어) - Word Roots 프로젝트와 같은 패턴
   -------------------------------------------------------------
   사용법:
     HTML: <span data-i18n="startStt">STT 시작</span>
     JS:   SttI18N.t('startStt') -> 현재 UI 언어 문자열
           SttI18N.applyUILang('en') -> 문서 전체 [data-i18n] 갱신 + 저장
   ============================================================ */
(function (global) {
  const UI_LANG_KEY = 'speakilllisten_ui_lang';

  const DICT = {
    // ---- 탭 ----
    tabYoutube: { ko: '유튜브', en: 'YouTube' },
    tabLocal: { ko: '로컬 파일', en: 'Local File' },
    tabText: { ko: '텍스트 붙여넣기', en: 'Paste Text' },
    tabMic: { ko: '마이크로 말하기', en: 'Speak into Mic' },
    tabDoc: { ko: '문서(DOC/TXT/PDF)', en: 'Document (DOC/TXT/PDF)' },
    helpBtn: { ko: '도움말', en: 'Help' },
    pasteTextPlaceholder: {
      ko: '여기에 텍스트를 붙여넣으세요. 문장 단위로 자동으로 나눠서 자막처럼 오른쪽에 쌓입니다.',
      en: 'Paste text here. It will be split into sentences and added to the caption feed on the right.'
    },

    // ---- 진단 패널 ----
    diagOnresultLabel: { ko: 'onresult 호출', en: 'onresult calls' },
    diagOnendLabel: { ko: 'onend 호출', en: 'onend calls' },
    diagStartfailLabel: { ko: 'start()실패', en: 'start() failures' },
    diagLastTextLabel: { ko: '마지막 인식 텍스트', en: 'Last recognized text' },
    diagLastErrorLabel: { ko: '마지막 에러', en: 'Last error' },
    diagNone: { ko: '(없음)', en: '(none)' },

    // ---- 캡션 헤더 ----
    captionFeedTitle: { ko: '실시간 자막 피드', en: 'Live Caption Feed' },
    phrasebookBtn: { ko: '회화DB', en: 'Phrasebook' },
    statusIdle: { ko: '대기 중', en: 'Idle' },
    disclaimerText: {
      ko: '실시간 자막은 AI가 즉시 생성한 결과입니다. 일부 인식 오류가 있을 수 있으며, 녹음 파일을 Whisper로 후처리하면 더 정확한 자막을 얻을 수 있습니다.',
      en: 'Live captions are generated instantly by AI. Some recognition errors may occur — post-processing the recording with Whisper can produce more accurate captions.'
    },

    // ---- 컨트롤 버튼 ----
    startStt: { ko: 'STT 시작', en: 'Start STT' },
    stopStt: { ko: 'STT 중지', en: 'Stop STT' },
    recordOnlyStart: { ko: '🔴 녹음만 시작 (STT 없이)', en: '🔴 Record Only (No STT)' },
    recordOnlyStop: { ko: '⏹ 녹음 중지', en: '⏹ Stop Recording' },
    clearBtn: { ko: '비우기', en: 'Clear' },
    micTestBtn: { ko: '🎚 마이크 테스트', en: '🎚 Mic Test' },
    micTestStop: { ko: '🎚 테스트 중지', en: '🎚 Stop Test' },
    exportExcelBtn: { ko: '📊 엑셀 내보내기', en: '📊 Export Excel' },
    loadYoutubeBtn: { ko: '유튜브 로드', en: 'Load YouTube' },
    selectDocBtn: { ko: '문서 파일 선택', en: 'Choose Document' },
    selectMediaBtn: { ko: '영상/오디오 파일 선택', en: 'Choose Video/Audio File' },
    submitTextBtn: { ko: '자막으로 변환 ▶', en: 'Convert to Captions ▶' },

    // ---- 라벨 ----
    srcLangLabel: { ko: '🎙 src-lang', en: '🎙 src-lang' },
    tgtLangLabel: { ko: '🌐 tgt-lang', en: '🌐 tgt-lang' },
    ttsSrcLabel: { ko: 'src', en: 'src' },
    ttsTgtLabel: { ko: 'tgt', en: 'tgt' },
    simultRecordLabel: { ko: '🎙 동시 녹음(MP3)', en: '🎙 Record Simultaneously (MP3)' },
    rawAudioLabel: { ko: '🎚 원음 그대로(가상마이크용)', en: '🎚 Raw Audio (for virtual mic)' },
    gainBoostLabel: { ko: '🔊 마이크 증폭', en: '🔊 Mic Gain Boost' },
    playbackGainLabel: { ko: '🔊 재생 볼륨 증폭', en: '🔊 Playback Volume Boost' },
    recordDeviceDefault: { ko: '녹음 장치: 기본값', en: 'Recording Device: Default' },

    // ---- 단어 현황 패널 ----
    wordStatsTitle: { ko: '📊 단어 현황', en: '📊 Word Stats' },
    wordCountSuffix: { ko: '개', en: '' },
    cloudViewBtn: { ko: '☁ 워드클라우드', en: '☁ Word Cloud' },
    listViewBtn: { ko: '📋 리스트 보기', en: '📋 List View' },
    sortFreq: { ko: '빈도순', en: 'By Frequency' },
    sortAbc: { ko: '가나다순', en: 'Alphabetical' },

    // ---- 마이크/문서 전용 패널 ----
    micOnlyTitle: { ko: '영상/파일 없이, 마이크에 대고 바로 말씀하세요', en: 'No video or file needed — just speak into your mic' },
    docOnlyTitle: { ko: 'DOCX / TXT / PDF 파일을 올리면<br>문장 단위로 나눠서 자막처럼 쌓여요', en: 'Upload a DOCX / TXT / PDF file and<br>it will be split into sentences and added as captions' },

    // ---- 회화DB 모달 ----
    phrasebookModalTitle: { ko: '📖 나의 회화DB', en: '📖 My Phrasebook' },
    phrasebookSearchPh: { ko: '🔍 검색...', en: '🔍 Search...' },
    phrasebookClearBtn: { ko: '🗑 회화DB 전체 삭제', en: '🗑 Clear All' },

    // ---- 남은 세부 문구 (일괄 정리) ----
    waveformLoading: { ko: '파형 분석 중...', en: 'Analyzing waveform...' },
    inputSignalLabel: { ko: '입력 신호:', en: 'Input signal:' },
    guideLabel: { ko: '안내', en: 'Guide' },
    liveLabel: { ko: '실시간...', en: 'Live...' },
    systemLabel: { ko: '시스템', en: 'System' },
    dupCountLabel0: { ko: '중복 제거: 0건', en: 'Duplicates removed: 0' },
    duplicatesRemovedLabel: { ko: '중복 제거', en: 'Duplicates removed' },
    countUnitSuffix: { ko: '건', en: '' },
    guideMessage: {
      ko: '유튜브 URL / 로컬 파일 / 텍스트 붙여넣기 중 하나를 고른 뒤 시작하세요.',
      en: 'Choose YouTube URL / Local File / Paste Text, then get started.'
    },
    dictNotFoundNaver: { ko: '영어가 아닌 단어는 자동 사전 조회를 지원하지 않아요.', en: "Automatic lookup isn't supported for non-English words." },
    dictSearchNaver: { ko: '네이버 사전에서 찾아보기 →', en: 'Look it up on Naver Dictionary →' },
    dictNotFound: { ko: '사전에서 찾지 못했어요.', en: "Couldn't find it in the dictionary." },
    dictSearchMW: { ko: 'Merriam-Webster에서 찾아보기 →', en: 'Look it up on Merriam-Webster →' },
    dictSearching: { ko: '검색 중...', en: 'Searching...' },
    homonymNote: { ko: '이 단어는 뜻이 서로 다른 어원을 가진 동철이의어예요', en: 'This word has multiple unrelated meanings (homonym)' },
    entryLabel: { ko: '항목', en: 'Entry' },
    mobileTip: {
      ko: '📱 모바일 테스트 팁: HTTPS 접속 확인 · "동시 녹음" 체크 해제하고 STT만 먼저 테스트 · 위 진단정보에서 onresult가 오르는지 확인',
      en: '📱 Mobile testing tip: confirm HTTPS · uncheck "Record simultaneously" and test STT alone first · check whether onresult increments above'
    },
    micOnlyStatusDefault: { ko: '🎚 "마이크 테스트"를 눌러 신호를 먼저 확인해보세요', en: '🎚 Tap "Mic Test" to check the signal first' },
    micSignalDetected: { ko: '🎙 신호가 감지되고 있어요', en: '🎙 Signal detected' },
    micSignalNone: { ko: '⚠ 소리가 감지되지 않아요 - 마이크를 확인해주세요', en: '⚠ No sound detected — check your microphone' },
    micOffConfirm: { ko: '🎤 마이크 종료됨', en: '🎤 Microphone turned off' },
  };

  function t(key) {
    const lang = getUILang();
    const entry = DICT[key];
    return entry ? (entry[lang] || entry.ko) : key;
  }

  function getUILang() {
    try { return localStorage.getItem(UI_LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }

  function applyUILang(lang) {
    if (lang !== 'ko' && lang !== 'en') lang = 'en';
    try { localStorage.setItem(UI_LANG_KEY, lang); } catch (e) { /* ignore */ }
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (DICT[key]) el.textContent = DICT[key][lang] || DICT[key].ko;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      if (DICT[key]) el.innerHTML = DICT[key][lang] || DICT[key].ko;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (DICT[key]) el.setAttribute('placeholder', DICT[key][lang] || DICT[key].ko);
    });
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent('uilangchange', { detail: { lang } }));
  }

  global.SttI18N = { t, getUILang, applyUILang, DICT };
})(typeof window !== 'undefined' ? window : globalThis);
