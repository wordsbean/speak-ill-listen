// 공통 실시간 번역 모듈 (구글 무료 번역 엔드포인트, TOPIK 앱과 동일한 방식)
// 사용법: const ko = await WordrootTranslate.translate("hello", "ko", "en");
const WordrootTranslate = (() => {
  const CACHE_PREFIX = 'wordroot_tr_';
  const THROTTLE_MS = 220; // 캐시에 없어서 실제로 API를 부를 때만 적용되는 최소 간격 (rate-limit 방지)
  let lastCallAt = 0;

  function cacheKey(text, target, source) {
    // 텍스트가 길 수 있어 간단한 해시로 키 축약
    let hash = 0;
    for (let i = 0; i < text.length; i++) { hash = (hash * 31 + text.charCodeAt(i)) | 0; }
    return CACHE_PREFIX + source + '_' + target + '_' + hash;
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function fetchTranslation(text, target, source) {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
      source + '&tl=' + target + '&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    // data[0]는 [번역문, 원문, ...] 세그먼트 배열
    return data[0].map(seg => seg[0]).join('');
  }

  // 여러 문장을 구분자로 이어붙여서 한 번의 요청으로 번역 (호출 횟수를 크게 줄여 rate-limit 회피)
  const BATCH_SEP = '\n@@@\n';

  async function translateBatch(texts, target, source) {
    source = source || 'en';
    const results = new Array(texts.length).fill('');
    const toFetch = []; // { idx, text }

    texts.forEach((text, idx) => {
      if (!text || target === source) { results[idx] = text || ''; return; }
      const key = cacheKey(text, target, source);
      const cached = localStorage.getItem(key);
      if (cached !== null) { results[idx] = cached; return; }
      toFetch.push({ idx, text });
    });

    if (toFetch.length === 0) return results;

    // 실제 API 호출일 때만 최소 간격 확보
    const wait = THROTTLE_MS - (Date.now() - lastCallAt);
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();

    const combined = toFetch.map(t => t.text).join(BATCH_SEP);
    try {
      const translatedCombined = await fetchTranslation(combined, target, source);
      const parts = translatedCombined.split(BATCH_SEP.trim()); // 번역 결과에서 구분자 주변 공백이 달라질 수 있어 trim 버전으로 분리
      toFetch.forEach((t, i) => {
        const val = (parts[i] || '').trim() || t.text;
        results[t.idx] = val;
        localStorage.setItem(cacheKey(t.text, target, source), val);
      });
    } catch (e) {
      // 배치 실패 시 한 번 더 재시도, 그래도 안 되면 원문으로 채움
      try {
        await sleep(600);
        lastCallAt = Date.now();
        const translatedCombined = await fetchTranslation(combined, target, source);
        const parts = translatedCombined.split(BATCH_SEP.trim());
        toFetch.forEach((t, i) => {
          const val = (parts[i] || '').trim() || t.text;
          results[t.idx] = val;
          localStorage.setItem(cacheKey(t.text, target, source), val);
        });
      } catch (e2) {
        console.warn('배치 번역 실패:', e2);
        toFetch.forEach(t => { results[t.idx] = t.text; });
      }
    }
    return results;
  }

  async function translate(text, target, source) {
    source = source || 'en';
    if (!text || target === source) return text;

    const key = cacheKey(text, target, source);
    const cached = localStorage.getItem(key);
    if (cached !== null) return cached; // 캐시 있으면 지연 없이 즉시 반환

    // 실제 API 호출일 때만 최소 간격 확보 (rate-limit로 대량 실패하는 것 방지)
    const wait = THROTTLE_MS - (Date.now() - lastCallAt);
    if (wait > 0) await sleep(wait);
    lastCallAt = Date.now();

    try {
      const translated = await fetchTranslation(text, target, source);
      localStorage.setItem(key, translated);
      return translated;
    } catch (e) {
      // rate-limit 등으로 실패하면 한 번만 잠깐 쉬었다가 재시도
      try {
        await sleep(600);
        lastCallAt = Date.now();
        const translated = await fetchTranslation(text, target, source);
        localStorage.setItem(key, translated);
        return translated;
      } catch (e2) {
        console.warn('번역 실패(재시도 포함):', e2);
        return text; // 그래도 실패하면 원문 그대로 반환 (화면이 비지 않도록)
      }
    }
  }

  return { translate, translateBatch };
})();
window.WordrootTranslate = WordrootTranslate; // 최상위 const는 window에 자동으로 안 걸리므로 명시적으로 붙임
