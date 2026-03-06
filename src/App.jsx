import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  UserPlus, Info, Share2, QrCode, X, Search, 
  ZoomIn, ZoomOut, Maximize, UserCircle, ChevronRight, 
  ChevronDown, MessageSquare, MapPin, Heart, Edit3, Type, List,
  Download, Upload, Settings,
  RefreshCcw, Edit2
} from 'lucide-react';

// ==========================================
// 1. 初始模擬資料 (Initial Data)
// ==========================================
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_MEMBERS = {
  'g1_m1': { id: 'g1_m1', name: '王天明', gender: 'M', birthday: '1942-03-15', parents: [], children: ['m1', 'g2_m2'], spouses: ['g1_f1'], bio: '家族開創者，當年白手起家。', posts: [], claimed: false },
  'g1_f1': { id: 'g1_f1', name: '李玉蘭', gender: 'F', birthday: '1945-08-02', parents: [], children: ['m1', 'g2_m2'], spouses: ['g1_m1'], bio: '溫柔堅毅，持家有道。', posts: [], claimed: false },
  'm1': { id: 'm1', name: '王大川', gender: 'M', birthday: '1968-01-20', parents: ['g1_m1', 'g1_f1'], children: ['m3', 'm4'], spouses: ['m2'], bio: '家族大家長，熱愛書法與園藝。', posts: [{ id: 'p1', date: '2025-10-10', text: '今天在後院種下了一棵櫻花樹，希望子孫滿堂。' }], claimed: true },
  'm2': { id: 'm2', name: '林美麗', gender: 'F', birthday: '1970-11-05', parents: ['wg_m', 'wg_f'], children: ['m3', 'm4'], spouses: ['m1'], bio: '慈祥的祖母，拿手好菜是紅燒肉。', posts: [], claimed: false },
  'wg_m': { id: 'wg_m', name: '林國棟', gender: 'M', birthday: '1943-06-10', parents: [], children: ['m2'], spouses: ['wg_f'], bio: '退休公務員，喜歡下棋。', posts: [], claimed: false },
  'wg_f': { id: 'wg_f', name: '張秀英', gender: 'F', birthday: '1946-12-25', parents: [], children: ['m2'], spouses: ['wg_m'], bio: '溫和慈祥，擅長裁縫。', posts: [], claimed: false },
  'g2_m2': { id: 'g2_m2', name: '王二川', gender: 'M', birthday: '1972-06-18', parents: ['g1_m1', 'g1_f1'], children: ['g3_m3'], spouses: ['g2_f2'], bio: '大川的弟弟，長居南部。', posts: [], claimed: false },
  'g2_f2': { id: 'g2_f2', name: '周惠', gender: 'F', birthday: '1974-04-12', parents: [], children: ['g3_m3'], spouses: ['g2_m2'], bio: '賢內助，廚藝極佳。', posts: [], claimed: false },
  'm3': { id: 'm3', name: '王建國', gender: 'M', birthday: '1993-05-09', parents: ['m1', 'm2'], children: ['m5', 'g4_f1'], spouses: ['m6'], bio: '長子，目前在科技業擔任工程師。', posts: [], claimed: true },
  'm6': { id: 'm6', name: '陳淑芬', gender: 'F', birthday: '1994-09-21', parents: ['yf_m', 'yf_f'], children: ['m5', 'g4_f1'], spouses: ['m3'], bio: '溫柔體貼，喜歡烹飪。', posts: [], claimed: false },
  'yf_m': { id: 'yf_m', name: '陳志明', gender: 'M', birthday: '1965-02-28', parents: [], children: ['m6', 'xjz', 'xyz'], spouses: ['yf_f'], bio: '經營小吃店，熱情豪爽。', posts: [], claimed: false },
  'yf_f': { id: 'yf_f', name: '黃麗華', gender: 'F', birthday: '1967-07-14', parents: [], children: ['m6', 'xjz', 'xyz'], spouses: ['yf_m'], bio: '社區志工，樂於助人。', posts: [], claimed: false },
  'xjz': { id: 'xjz', name: '陳柏翰', gender: 'M', birthday: '1997-11-03', parents: ['yf_m', 'yf_f'], children: ['xjz_c'], spouses: ['xjz_w'], bio: '淑芬的弟弟，在銀行上班。', posts: [], claimed: false },
  'xjz_w': { id: 'xjz_w', name: '蔡雅婷', gender: 'F', birthday: '1998-05-20', parents: [], children: ['xjz_c'], spouses: ['xjz'], bio: '護理師，個性開朗。', posts: [], claimed: false },
  'xjz_c': { id: 'xjz_c', name: '陳宇竭', gender: 'M', birthday: '2024-06-12', parents: ['xjz', 'xjz_w'], children: [], spouses: [], bio: '活潑可愛的小男孩。', posts: [], claimed: false },
  'xyz': { id: 'xyz', name: '陳佳琪', gender: 'F', birthday: '1999-08-15', parents: ['yf_m', 'yf_f'], children: ['xyz_c'], spouses: ['xyz_h'], bio: '淑芬的妹妹，幼稚園老師。', posts: [], claimed: false },
  'xyz_h': { id: 'xyz_h', name: '劉承恩', gender: 'M', birthday: '1996-04-09', parents: [], children: ['xyz_c'], spouses: ['xyz'], bio: '軟體工程師，喜歡登山。', posts: [], claimed: false },
  'xyz_c': { id: 'xyz_c', name: '劉小雨', gender: 'F', birthday: '2025-01-28', parents: ['xyz', 'xyz_h'], children: [], spouses: [], bio: '剛出生的小寶貝。', posts: [], claimed: false },
  'm4': { id: 'm4', name: '王心凌', gender: 'F', birthday: '1996-02-14', parents: ['m1', 'm2'], children: ['g4_m1'], spouses: ['g3_m1'], bio: '小女兒，自由撰稿人。', posts: [{ id: 'p2', date: '2026-01-05', text: '剛完成了一本新書的初稿！' }], claimed: false },
  'g3_m1': { id: 'g3_m1', name: '李大為', gender: 'M', birthday: '1992-12-01', parents: [], children: ['g4_m1'], spouses: ['m4'], bio: '攝影師，喜歡四處旅遊。', posts: [], claimed: false },
  'g3_m3': { id: 'g3_m3', name: '王志強', gender: 'M', birthday: '1995-07-30', parents: ['g2_m2', 'g2_f2'], children: ['g4_m2'], spouses: ['g3_f2'], bio: '建國的堂弟，從事貿易。', posts: [], claimed: false },
  'g3_f2': { id: 'g3_f2', name: '吳梅', gender: 'F', birthday: '1996-10-10', parents: [], children: ['g4_m2'], spouses: ['g3_m3'], bio: '高中教師。', posts: [], claimed: false },
  'm5': { id: 'm5', name: '王小明', gender: 'M', birthday: '2018-03-03', parents: ['m3', 'm6'], children: ['g5_m1'], spouses: ['g4_f2'], bio: '活潑好動，目前是公司主管。', posts: [], claimed: false },
  'g4_f2': { id: 'g4_f2', name: '張欣', gender: 'F', birthday: '2019-01-17', parents: [], children: ['g5_m1'], spouses: ['m5'], bio: '銀行職員，心思細膩。', posts: [], claimed: false },
  'g4_f1': { id: 'g4_f1', name: '王曉華', gender: 'F', birthday: '2020-07-08', parents: ['m3', 'm6'], children: ['g5_f1'], spouses: ['g4_m3'], bio: '設計師，充滿創意。', posts: [], claimed: false },
  'g4_m3': { id: 'g4_m3', name: '林俊傑', gender: 'M', birthday: '2019-09-28', parents: [], children: ['g5_f1'], spouses: ['g4_f1'], bio: '建築師。', posts: [], claimed: false },
  'g4_m1': { id: 'g4_m1', name: '李子豪', gender: 'M', birthday: '2021-05-26', parents: ['m4', 'g3_m1'], children: [], spouses: [], bio: '大學生，熱愛籃球。', posts: [], claimed: false },
  'g4_m2': { id: 'g4_m2', name: '王宇', gender: 'M', birthday: '2022-08-14', parents: ['g3_m3', 'g3_f2'], children: [], spouses: [], bio: '留學海外中。', posts: [], claimed: false },
  'g5_m1': { id: 'g5_m1', name: '王星', gender: 'M', birthday: '2023-04-22', parents: ['m5', 'g4_f2'], children: [], spouses: [], bio: '剛滿三歲，全家的開心果。', posts: [], claimed: false },
  'g5_f1': { id: 'g5_f1', name: '林芸', gender: 'F', birthday: '2024-02-11', parents: ['g4_f1', 'g4_m3'], children: [], spouses: [], bio: '小學一年級。', posts: [], claimed: false },
};

const LOCAL_STORAGE_KEY = 'familytree.autosave.v1';
const SHARE_HASH_KEY = '#share=';
const MAX_SHARE_URL_LENGTH = 6000;

const encodeSharePayload = (payload) => {
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const decodeSharePayload = (token) => {
  try {
    const normalized = token.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '==='.slice((normalized.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed?.treeName || !parsed?.members || !parsed?.meId) return null;
    return parsed;
  } catch {
    return null;
  }
};

const readSavedTree = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.treeName || !parsed.members || !parsed.meId) return null;
    if (typeof parsed.members !== 'object' || Object.keys(parsed.members).length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

const normalizeMembers = (membersMap) => {
  const source = membersMap || {};
  return Object.fromEntries(
    Object.entries(source).map(([id, member]) => [
      id,
      {
        ...member,
        birthday: member?.birthday || '',
      },
    ])
  );
};

const getTimestampFromBirthday = (birthday) => {
  if (!birthday || typeof birthday !== 'string') return null;
  const ts = Date.parse(birthday);
  return Number.isNaN(ts) ? null : ts;
};

const getOlderLabel = (isOlder, olderLabel, youngerLabel, fallbackLabel) => {
  if (isOlder === null) return fallbackLabel;
  return isOlder ? olderLabel : youngerLabel;
};

const compareBirthdayOrder = (aBirthday, bBirthday) => {
  const aTs = getTimestampFromBirthday(aBirthday);
  const bTs = getTimestampFromBirthday(bBirthday);
  if (aTs === null || bTs === null || aTs === bTs) return null;
  return aTs < bTs;
};

const TANG_BROTHER_PATTERNS = new Set(['F,F,S,S', 'F,M,S,S']);
const TANG_SISTER_PATTERNS = new Set(['F,F,S,D', 'F,M,S,D']);
const BIAO_BROTHER_PATTERNS = new Set([
  'F,F,D,S', 'F,M,D,S',
  'M,F,S,S', 'M,M,S,S',
  'M,F,D,S', 'M,M,D,S',
]);
const BIAO_SISTER_PATTERNS = new Set([
  'F,F,D,D', 'F,M,D,D',
  'M,F,S,D', 'M,M,S,D',
  'M,F,D,D', 'M,M,D,D',
]);

const getCousinTypeByPath = (path) => {
  if (path.length !== 4) return null;
  const p = path.join(',');
  if (TANG_BROTHER_PATTERNS.has(p) || TANG_SISTER_PATTERNS.has(p)) return 'tang';
  if (BIAO_BROTHER_PATTERNS.has(p) || BIAO_SISTER_PATTERNS.has(p)) return 'biao';

  // Fallback: 父系叔伯的子女 = 堂, 其餘 = 表
  if (p.startsWith('F,F,S,') || p.startsWith('F,M,S,')) return 'tang';
  if (p.startsWith('M,F,') || p.startsWith('M,M,') || p.startsWith('F,F,D,') || p.startsWith('F,M,D,')) return 'biao';
  return null;
};

const resolveSiblingKinship = (fromId, toId, members, path, targetGender) => {
  if (path.length !== 2) return null;
  if (!['F', 'M'].includes(path[0]) || !['S', 'D'].includes(path[1])) return null;

  const from = members[fromId];
  const to = members[toId];
  if (!from || !to) return null;

  const sharedParent = (from.parents || []).some(pid => (to.parents || []).includes(pid));
  if (!sharedParent) return null;

  const fromTs = getTimestampFromBirthday(from.birthday);
  const toTs = getTimestampFromBirthday(to.birthday);
  if (fromTs === null || toTs === null || fromTs === toTs) {
    return targetGender === 'M' ? '兄弟' : '姊妹';
  }

  const isOlder = toTs < fromTs;
  if (targetGender === 'M') return isOlder ? '哥哥' : '弟弟';
  return isOlder ? '姊姊' : '妹妹';
};

const resolveAgeAwareKinship = (fromId, toId, members, path) => {
  const from = members[fromId];
  const to = members[toId];
  if (!from || !to) return null;

  const siblingKinship = resolveSiblingKinship(fromId, toId, members, path, to.gender);
  if (siblingKinship) return siblingKinship;

  // 伯/叔、姑媽/姑姑、大舅/小舅、姨媽/阿姨
  // path[1] must be 'F' or 'M' (going up to grandparent) to distinguish from
  // nephew/niece paths like F,D,S (外甥) or F,S,S (姪子) where path[1] is 'S'/'D'.
  if (path.length === 3 && (path[2] === 'S' || path[2] === 'D') && (path[0] === 'F' || path[0] === 'M') && (path[1] === 'F' || path[1] === 'M')) {
    const referenceParent = (from.parents || []).find(pid => members[pid] && (path[0] === 'F' ? members[pid].gender === 'M' : members[pid].gender === 'F'));
    const isOlderThanParent = referenceParent ? compareBirthdayOrder(to.birthday, members[referenceParent].birthday) : null;

    if (path[0] === 'F' && path[2] === 'S') {
      return getOlderLabel(isOlderThanParent, '伯伯', '叔叔', '伯伯/叔叔');
    }
    if (path[0] === 'F' && path[2] === 'D') {
      return getOlderLabel(isOlderThanParent, '姑媽', '姑姑', '姑姑');
    }
    if (path[0] === 'M' && path[2] === 'S') {
      return getOlderLabel(isOlderThanParent, '大舅', '小舅', '舅舅');
    }
    if (path[0] === 'M' && path[2] === 'D') {
      return getOlderLabel(isOlderThanParent, '姨媽', '阿姨', '阿姨');
    }
  }

  // 兄弟的妻子 (嫂嫂/弟妹)、姊妹的丈夫 (姊夫/妹夫)
  if (path.length === 3 && (path[0] === 'F' || path[0] === 'M') && (path[1] === 'S' || path[1] === 'D') && (path[2] === 'W' || path[2] === 'H')) {
    // 找到中間的兄弟姊妹：to 的配偶中，跟 from 共享父母的那個
    const sibling = (to.spouses || []).map(sid => members[sid]).find(sp => sp && (from.parents || []).some(pid => (sp.parents || []).includes(pid)));
    if (sibling) {
      const isOlderThanMe = compareBirthdayOrder(sibling.birthday, from.birthday);
      if (path[1] === 'S' && path[2] === 'W') return getOlderLabel(isOlderThanMe, '嫂嫂', '弟妹', '嫂嫂/弟妹');
      if (path[1] === 'D' && path[2] === 'H') return getOlderLabel(isOlderThanMe, '姊夫', '妹夫', '姊夫/妹夫');
    }
  }

  // 伯母/嬸嬸 (伯伯叔叔的妻子)、姑丈、舅媽、姨丈
  if (path.length === 4 && (path[0] === 'F' || path[0] === 'M') && (path[1] === 'F' || path[1] === 'M') && (path[2] === 'S' || path[2] === 'D') && (path[3] === 'W' || path[3] === 'H')) {
    const uncle = (to.spouses || []).map(sid => members[sid]).find(Boolean);
    if (path[0] === 'F' && path[2] === 'S' && path[3] === 'W' && uncle) {
      const referenceParent = (from.parents || []).find(pid => members[pid] && members[pid].gender === 'M');
      const isOlderThanParent = referenceParent ? compareBirthdayOrder(uncle.birthday, members[referenceParent].birthday) : null;
      return getOlderLabel(isOlderThanParent, '伯母', '嬸嬸', '伯母/嬸嬸');
    }
    if (path[0] === 'F' && path[2] === 'D' && path[3] === 'H') return '姑丈';
    if (path[0] === 'M' && path[2] === 'S' && path[3] === 'W') return '舅媽';
    if (path[0] === 'M' && path[2] === 'D' && path[3] === 'H') return '姨丈';
  }

  // 大舅子/小舅子、大姨子/小姨子 (妻子的兄弟姊妹，依對方與妻子的生日比較)
  if (path.length === 3 && (path[0] === 'W' || path[0] === 'H') && (path[1] === 'F' || path[1] === 'M') && (path[2] === 'S' || path[2] === 'D')) {
    // 找到配偶本人
    const spouse = (from.spouses || []).map(sid => members[sid]).find(sp => sp && sp.gender === (path[0] === 'W' ? 'F' : 'M'));
    const isOlderThanSpouse = spouse ? compareBirthdayOrder(to.birthday, spouse.birthday) : null;

    if (path[0] === 'W' && path[2] === 'S') return getOlderLabel(isOlderThanSpouse, '大舅子', '小舅子', '大舅子/小舅子');
    if (path[0] === 'W' && path[2] === 'D') return getOlderLabel(isOlderThanSpouse, '大姨子', '小姨子', '大姨子/小姨子');
    if (path[0] === 'H' && path[2] === 'S') return getOlderLabel(isOlderThanSpouse, '大伯', '小叔', '大伯/小叔');
    if (path[0] === 'H' && path[2] === 'D') return getOlderLabel(isOlderThanSpouse, '大姑', '小姑', '大姑/小姑');
  }

  // 舅嫂/弟媳、襟兄/襟弟、妯娌、姑爺 (配偶兄弟姊妹的配偶，依生日判斷)
  if (path.length === 4 && (path[0] === 'W' || path[0] === 'H') && (path[1] === 'F' || path[1] === 'M') && (path[2] === 'S' || path[2] === 'D') && (path[3] === 'W' || path[3] === 'H')) {
    const mySpouse = (from.spouses || []).map(sid => members[sid]).find(sp => sp && sp.gender === (path[0] === 'W' ? 'F' : 'M'));
    // 中間的兄弟姊妹 = to 的配偶
    const sibling = (to.spouses || []).map(sid => members[sid]).find(Boolean);
    const isOlderThanSpouse = (mySpouse && sibling) ? compareBirthdayOrder(sibling.birthday, mySpouse.birthday) : null;

    if (path[0] === 'W' && path[2] === 'S' && path[3] === 'W') return getOlderLabel(isOlderThanSpouse, '舅嫂', '弟媳', '舅嫂/弟媳');
    if (path[0] === 'W' && path[2] === 'D' && path[3] === 'H') return getOlderLabel(isOlderThanSpouse, '襟兄', '襟弟', '襟兄/襟弟');
    if (path[0] === 'H' && path[2] === 'S' && path[3] === 'W') return getOlderLabel(isOlderThanSpouse, '大嫂', '弟媳', '妯娌');
    if (path[0] === 'H' && path[2] === 'D' && path[3] === 'H') return getOlderLabel(isOlderThanSpouse, '大姑爺', '小姑爺', '姑爺');
  }

  // 堂/表 + 哥弟姊妹
  if (path.length === 4 && (path[path.length - 1] === 'S' || path[path.length - 1] === 'D')) {
    const cousinType = getCousinTypeByPath(path);
    if (cousinType) {
      const isOlderThanMe = compareBirthdayOrder(to.birthday, from.birthday);
      const prefix = cousinType === 'tang' ? '堂' : '表';

      if (to.gender === 'M') {
        return getOlderLabel(isOlderThanMe, `${prefix}哥`, `${prefix}弟`, `${prefix}兄弟`);
      }
      return getOlderLabel(isOlderThanMe, `${prefix}姊`, `${prefix}妹`, `${prefix}姊妹`);
    }
  }

  // 堂/表兄弟姊妹的配偶
  if (path.length === 5 && (path[path.length - 1] === 'W' || path[path.length - 1] === 'H')) {
    const cousinPath = path.slice(0, 4);
    const cousinType = getCousinTypeByPath(cousinPath);
    if (cousinType) {
      const cousin = (to.spouses || []).map(sid => members[sid]).find(sp => sp && (from.parents || []).some(pid => {
        // Check if cousin shares ancestor
        return true; // simplified — fallback to birthday comparison
      }));
      const isOlderThanMe = cousin ? compareBirthdayOrder(cousin.birthday, from.birthday) : null;
      const prefix = cousinType === 'tang' ? '堂' : '表';
      if (path[path.length - 1] === 'W') return getOlderLabel(isOlderThanMe, `${prefix}嫂`, `${prefix}弟妹`, `${prefix}嫂/弟妹`);
      if (path[path.length - 1] === 'H') return getOlderLabel(isOlderThanMe, `${prefix}姊夫`, `${prefix}妹夫`, `${prefix}姊夫/妹夫`);
    }
  }

  return null;
};

// ==========================================
// 2. 稱謂計算系統 (Kinship Calculator)
// ==========================================
const translatePath = (path, targetGender) => {
  const p = path.join(',');
  const map = {
    'F': '父親', 'M': '母親', 'S': '兒子', 'D': '女兒', 'H': '丈夫', 'W': '妻子',
    'F,F': '祖父(爺爺)', 'F,M': '祖母(奶奶)', 'M,F': '外祖父(外公)', 'M,M': '外祖母(外婆)',
    'F,F,F': '曾祖父', 'F,F,M': '曾祖母', 'F,M,F': '曾祖父', 'F,M,M': '曾祖母',
    'M,F,F': '外曾祖父', 'M,F,M': '外曾祖母', 'M,M,F': '外曾祖父', 'M,M,M': '外曾祖母',
    'F,S': '兄弟', 'M,S': '兄弟', 'F,D': '姊妹', 'M,D': '姊妹',
    'F,F,S': '伯伯/叔叔', 'F,M,S': '伯伯/叔叔', 'F,F,D': '姑姑', 'F,M,D': '姑姑',
    'M,F,S': '舅舅', 'M,M,S': '舅舅', 'M,F,D': '阿姨', 'M,M,D': '阿姨',
    'F,S,S': '姪子', 'M,S,S': '姪子', 'F,S,D': '姪女', 'M,S,D': '姪女',
    'F,D,S': '外甥', 'M,D,S': '外甥', 'F,D,D': '外甥女', 'M,D,D': '外甥女',
    'S,S': '孫子', 'S,D': '孫女', 'D,S': '外孫', 'D,D': '外孫女',
    'S,W': '媳婦', 'D,H': '女婿',
    'S,S,S': '曾孫', 'S,S,D': '曾孫女', 'S,D,S': '曾孫', 'S,D,D': '曾孫女',
    'D,S,S': '外曾孫', 'D,S,D': '外曾孫女', 'D,D,S': '外曾孫', 'D,D,D': '外曾孫女',
    'S,S,W': '孫媳婦', 'S,D,H': '孫女婿', 'D,S,W': '外孫媳婦', 'D,D,H': '外孫女婿',
    'H,F': '公公', 'H,M': '婆婆', 'W,F': '岳父', 'W,M': '岳母',
    'H,S': '繼子', 'W,S': '繼子', 'H,D': '繼女', 'W,D': '繼女',
    'F,S,W': '嫂嫂/弟妹', 'F,D,H': '姊夫/妹夫', 'M,S,W': '嫂嫂/弟妹', 'M,D,H': '姊夫/妹夫',
    'H,F,S': '大伯/小叔', 'H,M,S': '大伯/小叔', 'H,F,D': '大姑/小姑', 'H,M,D': '大姑/小姑',
    'W,F,S': '大舅子/小舅子', 'W,M,S': '大舅子/小舅子', 'W,F,D': '大姨子/小姨子', 'W,M,D': '大姨子/小姨子',
    'F,F,S,W': '伯母/嬸嬸', 'F,M,S,W': '伯母/嬸嬸', 'F,F,D,H': '姑丈', 'F,M,D,H': '姑丈',
    'M,F,S,W': '舅媽', 'M,M,S,W': '舅媽', 'M,F,D,H': '姨丈', 'M,M,D,H': '姨丈',
    'F,S,S,W': '姪媳婦', 'F,S,D,H': '姪女婿', 'M,S,S,W': '姪媳婦', 'M,S,D,H': '姪女婿',
    'F,D,S,W': '外甥媳婦', 'F,D,D,H': '外甥女婿', 'M,D,S,W': '外甥媳婦', 'M,D,D,H': '外甥女婿',
    'W,F,S,W': '舅嫂/弟媳', 'W,M,S,W': '舅嫂/弟媳', 'W,F,D,H': '襟兄/襟弟', 'W,M,D,H': '襟兄/襟弟',
    'H,F,S,W': '妯娌', 'H,M,S,W': '妯娌', 'H,F,D,H': '姑爺', 'H,M,D,H': '姑爺',
    // 小舅子/大舅子的子女
    'W,F,S,S': '妻舅姪', 'W,M,S,S': '妻舅姪', 'W,F,S,D': '妻舅姪女', 'W,M,S,D': '妻舅姪女',
    // 小姨子/大姨子的子女
    'W,F,D,S': '妻姨甥', 'W,M,D,S': '妻姨甥', 'W,F,D,D': '妻姨甥女', 'W,M,D,D': '妻姨甥女',
    // 大伯/小叔的子女
    'H,F,S,S': '夫姪', 'H,M,S,S': '夫姪', 'H,F,S,D': '夫姪女', 'H,M,S,D': '夫姪女',
    // 大姑/小姑的子女
    'H,F,D,S': '夫甥', 'H,M,D,S': '夫甥', 'H,F,D,D': '夫甥女', 'H,M,D,D': '夫甥女',
  };
  if (map[p]) return map[p];

  // 堂/表兄弟姊妹
  const cousinType = getCousinTypeByPath(path);
  if (cousinType) {
    if (p.endsWith(',S')) return cousinType === 'tang' ? '堂兄弟' : '表兄弟';
    if (p.endsWith(',D')) return cousinType === 'tang' ? '堂姊妹' : '表姊妹';
    if (p.endsWith(',W')) return cousinType === 'tang' ? '堂嫂/堂弟妹' : '表嫂/表弟妹';
    if (p.endsWith(',H')) return cousinType === 'tang' ? '堂姊夫/堂妹夫' : '表姊夫/表妹夫';
  }

  // 堂/表兄弟姊妹的子女 (path like F,F,S,S,S / F,F,S,D,S etc.)
  if (path.length === 5) {
    // Check if first 4 steps match a cousin pattern
    const parentPath = path.slice(0, 4);
    const parentCousinType = getCousinTypeByPath(parentPath);
    if (parentCousinType) {
      const prefix = parentCousinType === 'tang' ? '堂' : '表';
      const lastStep = path[4];
      if (lastStep === 'S') return `${prefix}姪子`;
      if (lastStep === 'D') return `${prefix}姪女`;
      if (lastStep === 'W') return `${prefix}姪媳婦`;
      if (lastStep === 'H') return `${prefix}姪女婿`;
    }
  }

  return '親戚';
};

const calculateKinship = (fromId, toId, members) => {
  if (fromId === toId) return '自己 (Me)';
  let queue = [{ id: fromId, path: [] }];
  let visited = new Set([fromId]);
  while (queue.length > 0) {
    let { id, path } = queue.shift();
    if (path.length > 5) continue;
    let current = members[id];
    if (!current) continue;
    if (id === toId) {
      const ageAwareKinship = resolveAgeAwareKinship(fromId, toId, members, path);
      if (ageAwareKinship) return ageAwareKinship;
      return translatePath(path, members[toId].gender);
    }

    current.parents.forEach(pid => {
      if (!visited.has(pid) && members[pid]) { visited.add(pid); queue.push({ id: pid, path: [...path, members[pid].gender === 'M' ? 'F' : 'M'] }); }
    });
    current.children.forEach(cid => {
      if (!visited.has(cid) && members[cid]) { visited.add(cid); queue.push({ id: cid, path: [...path, members[cid].gender === 'M' ? 'S' : 'D'] }); }
    });
    current.spouses.forEach(sid => {
      if (!visited.has(sid) && members[sid]) { visited.add(sid); queue.push({ id: sid, path: [...path, members[sid].gender === 'M' ? 'H' : 'W'] }); }
    });
  }
  return '遠親';
};

// ==========================================
// 3. 主應用程式組件
// ==========================================
export default function App() {
  const [treeName, setTreeName] = useState('王家大族譜'); // 新增：族譜名稱狀態
  const [editingTreeName, setEditingTreeName] = useState(false);
  const [treeNameDraft, setTreeNameDraft] = useState('');
  const [members, setMembers] = useState(() => normalizeMembers(INITIAL_MEMBERS));
  const [meId, setMeId] = useState('m3');
  const [selectedId, setSelectedId] = useState(null);
  const [isStartOpen, setIsStartOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchFocusId, setSearchFocusId] = useState(null);
  const [searchFocusKey, setSearchFocusKey] = useState(0);
  const [searchHighlightId, setSearchHighlightId] = useState(null);
  const [suppressProfilePanel, setSuppressProfilePanel] = useState(false);
  const [hasSavedLocalData, setHasSavedLocalData] = useState(false);
  
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [qaContext, setQaContext] = useState(null); 
  const [isQROpen, setIsQROpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false); 
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showInLaws, setShowInLaws] = useState(true);
  const [autoSelectNew, setAutoSelectNew] = useState(false);
  const fileInputRef = useRef(null);
  const savedTreeRef = useRef(null);

  const selectedMember = selectedId ? members[selectedId] : null;
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return Object.values(members)
      .filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
      .map(m => ({ ...m, kinship: calculateKinship(meId, m.id, members) }))
      .slice(0, 8);
  }, [searchQuery, members, meId]);

  useEffect(() => {
    if (!searchHighlightId) return;
    const timer = setTimeout(() => setSearchHighlightId(null), 4000);
    return () => clearTimeout(timer);
  }, [searchHighlightId]);

  useEffect(() => {
    const saved = readSavedTree();
    if (!saved) return;
    savedTreeRef.current = saved;
    setHasSavedLocalData(true);
  }, []);

  useEffect(() => {
    if (!window.location.hash.startsWith(SHARE_HASH_KEY)) return;
    const token = window.location.hash.slice(SHARE_HASH_KEY.length);
    const shared = decodeSharePayload(token);
    if (!shared) return;

    setTreeName(shared.treeName);
    setMembers(normalizeMembers(shared.members));
    setMeId(shared.meId);
    setSelectedId(null);
    setSuppressProfilePanel(false);
    setIsStartOpen(false);
  }, []);

  useEffect(() => {
    if (isStartOpen) return;
    try {
      const payload = {
        treeName,
        members,
        meId,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      savedTreeRef.current = payload;
      setHasSavedLocalData(true);
    } catch {
      // Ignore localStorage write errors (quota/privacy mode).
    }
  }, [treeName, members, meId, isStartOpen]);

  const handleUpdateMembers = (newMembersMap, targetId) => {
    setMembers(normalizeMembers(newMembersMap));
    if (autoSelectNew) setSelectedId(targetId);
    setIsQAOpen(false);
  };

  const handleUpdateMember = (id, updates) => {
    setMembers(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleDeleteMember = (id, direction = 'down') => {
    if (!members[id]) return;
    if (Object.keys(members).length <= 1) {
      alert('至少需要保留一位成員。');
      return;
    }

    const toDelete = new Set([id]);
    const queue = [id];
    while (queue.length > 0) {
      const currentId = queue.shift();
      const current = members[currentId];
      if (!current) continue;
      if (direction === 'down') {
        current.children.forEach(cid => {
          if (!toDelete.has(cid)) { toDelete.add(cid); queue.push(cid); }
        });
      } else {
        current.parents.forEach(pid => {
          if (!toDelete.has(pid)) { toDelete.add(pid); queue.push(pid); }
        });
      }
    }

    if (toDelete.size >= Object.keys(members).length) {
      alert('刪除後將沒有成員，請至少保留一位成員。');
      return;
    }

    const draft = JSON.parse(JSON.stringify(members));
    Object.values(draft).forEach(m => {
      m.parents = m.parents.filter(pid => !toDelete.has(pid));
      m.children = m.children.filter(cid => !toDelete.has(cid));
      m.spouses = m.spouses.filter(sid => !toDelete.has(sid));
    });
    toDelete.forEach(delId => delete draft[delId]);

    const nextIds = Object.keys(draft);
    if (selectedId && toDelete.has(selectedId)) setSelectedId(null);
    if (meId && toDelete.has(meId)) setMeId(nextIds[0] || null);
    setMembers(normalizeMembers(draft));
  };

  const handleAddPost = (text) => {
    if (!selectedId) return;
    const newPost = { id: generateId(), date: new Date().toISOString().split('T')[0], text };
    setMembers({ ...members, [selectedId]: { ...members[selectedId], posts: [newPost, ...members[selectedId].posts] } });
  };

  const handleSelectFromSearch = (id) => {
    if (!members[id]) return;
    const isMobileViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
    setSelectedId(id);
    setSuppressProfilePanel(isMobileViewport);
    setSearchFocusId(id);
    setSearchFocusKey(prev => prev + 1);
    setSearchHighlightId(id);
    setSearchQuery(members[id].name);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  const handleCanvasSelect = (id) => {
    setSuppressProfilePanel(false);
    setSelectedId(id);
  };

  const handleLoadLastData = () => {
    const saved = savedTreeRef.current || readSavedTree();
    if (!saved) {
      alert('找不到上次資料。');
      return;
    }
    setTreeName(saved.treeName);
    setMembers(normalizeMembers(saved.members));
    setMeId(saved.meId);
    setSelectedId(null);
    setSuppressProfilePanel(false);
    setIsStartOpen(false);
  };

  const handleClearSavedData = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // Ignore localStorage errors.
    }
    savedTreeRef.current = null;
    setHasSavedLocalData(false);
  };

  const handleShareLink = async () => {
    const payload = { treeName, members, meId };
    const token = encodeSharePayload(payload);
    const shareUrl = `${window.location.origin}${window.location.pathname}${SHARE_HASH_KEY}${token}`;

    if (shareUrl.length > MAX_SHARE_URL_LENGTH) {
      alert('資料量較大，分享連結會過長。請改用「儲存」匯出 JSON 檔案後再分享。');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: treeName,
          text: '這是我分享的家族族譜',
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled; fall back to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('已複製分享連結');
    } catch {
      prompt('請複製此分享連結', shareUrl);
    }
  };

  // 匯出 JSON (包含族譜名稱、成員資料及視角)
  const handleExportJSON = () => {
    const exportData = { treeName, members, meId };
    const jsonText = JSON.stringify(exportData, null, 2);
    const fileName = `${treeName}.json`;
    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });

    // Detect mobile vs desktop
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // On mobile, prefer native share sheet if it supports files.
    if (isMobile && navigator.share && typeof File !== 'undefined') {
      const file = new File([blob], fileName, { type: 'application/json' });
      const shareData = { files: [file], title: treeName, text: '族譜資料匯出' };
      if (navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).catch(() => { /* user cancelled */ });
        return;
      }
    }

    // Desktop & fallback: direct file download
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', blobUrl);
    downloadAnchorNode.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  // 載入 JSON (支援新版含名稱/meId格式，與舊版純成員格式)
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.treeName && json.members) {
          setTreeName(json.treeName);
          setMembers(normalizeMembers(json.members));
          // 還原視角: 優先用存檔中的 meId，否則用第一位成員
          const ids = Object.keys(json.members);
          setMeId(json.meId && ids.includes(json.meId) ? json.meId : ids[0]);
        } else {
          setTreeName('載入的族譜');
          setMembers(normalizeMembers(json));
          setMeId(Object.keys(json)[0]);
        }
        setSelectedId(null);
        setSuppressProfilePanel(false);
        setIsStartOpen(false);
      } catch (err) {
        alert("檔案格式錯誤，無法載入。");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex h-[100dvh] w-full bg-[#F5F5F0] overflow-hidden font-sans text-gray-800 relative">
      <div className="relative flex-1 h-full">
        <CanvasTree 
          members={members}
          showInLaws={showInLaws}
          selectedId={selectedId}
          onSelect={handleCanvasSelect}
          meId={meId}
          focusId={searchFocusId}
          focusKey={searchFocusKey}
          searchHighlightId={searchHighlightId}
          onQuickAdd={() => {
            setQaContext({ relativeId: selectedId || meId, relationType: 'child' });
            setIsQAOpen(true);
          }}
          onOpenMobileSearch={() => setIsMobileSearchOpen(true)}
        />
        
        {/* 手機版與桌面版相容的頂部控制列 */}
        <div className="absolute top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 flex justify-between items-start pointer-events-none z-20">
          <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-2 md:px-6 md:py-3 flex flex-col gap-1.5 md:gap-2 pointer-events-auto border border-gray-100 max-w-[78%] md:max-w-none">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                <Share2 size={18} className="md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                {editingTreeName ? (
                  <input
                    autoFocus
                    type="text"
                    value={treeNameDraft}
                    onChange={e => setTreeNameDraft(e.target.value)}
                    onBlur={() => { if (treeNameDraft.trim()) setTreeName(treeNameDraft.trim()); setEditingTreeName(false); }}
                    onKeyDown={e => { if (e.key === 'Enter') { if (treeNameDraft.trim()) setTreeName(treeNameDraft.trim()); setEditingTreeName(false); } if (e.key === 'Escape') setEditingTreeName(false); }}
                    className="text-base md:text-xl font-bold text-gray-800 tracking-wide bg-white border border-emerald-400 rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                  />
                ) : (
                  <h1
                    className="text-base md:text-xl font-bold text-gray-800 tracking-wide truncate cursor-pointer hover:text-emerald-600 transition"
                    onClick={() => { setTreeNameDraft(treeName); setEditingTreeName(true); }}
                    title="點擊修改族譜名稱"
                  >
                    {treeName}
                  </h1>
                )}
                <div className="text-[11px] md:text-xs text-gray-500 flex items-center gap-1 font-medium mt-0.5 md:mt-1">
                  <span>視角: </span>
                  <select 
                    className="bg-transparent font-bold text-emerald-600 outline-none cursor-pointer max-w-[80px] md:max-w-none truncate"
                    value={meId}
                    onChange={(e) => setMeId(e.target.value)}
                  >
                    {Object.values(members).map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <span className="text-gray-300 hidden sm:inline">|</span>
                  <span className="text-gray-600 font-bold hidden sm:inline">總人數：{Object.keys(members).length}</span>
                  <span className="text-gray-600 font-bold sm:hidden ml-1">{Object.keys(members).length}人</span>
                </div>
              </div>
            </div>
            
            {/* 手機版/桌面版 操作列 (使用 flex-wrap 適應小螢幕) */}
            <div className="flex flex-wrap items-center gap-1 md:gap-2 text-[11px] md:text-sm text-gray-500 mt-0.5 md:mt-0">
              <button onClick={handleExportJSON} className="hover:text-emerald-600 flex items-center gap-1 transition p-1 bg-gray-50/50 rounded">
                <Download size={14}/> <span className="hidden sm:inline">儲存</span>
              </button>
              <button onClick={handleShareLink} className="hover:text-emerald-600 flex items-center gap-1 transition p-1 bg-gray-50/50 rounded">
                <Share2 size={14}/> <span className="hidden sm:inline">分享</span>
              </button>
              <label className="hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition p-1 bg-gray-50/50 rounded">
                <Upload size={14}/> <span className="hidden sm:inline">載入</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} ref={fileInputRef}/>
              </label>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <button onClick={() => setIsSettingsOpen(true)} className="hover:text-emerald-600 flex items-center gap-1 transition p-1 bg-gray-50/50 rounded">
                <Settings size={14}/> <span className="hidden sm:inline">設定</span>
              </button>
              <span className="text-gray-300 hidden sm:inline">|</span>
              <button onClick={() => setIsResetOpen(true)} className="hover:text-red-500 text-red-400 flex items-center gap-1 transition p-1 bg-gray-50/50 rounded">
                <RefreshCcw size={14}/> <span className="hidden sm:inline">重新開始</span>
              </button>
            </div>

            <div className="relative mt-1 hidden md:block">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
                <Search size={15} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 120)}
                  placeholder="搜尋姓名或 ID..."
                  className="w-full bg-transparent outline-none text-sm text-gray-700"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {isSearchOpen && searchQuery.trim() && (
                <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {searchResults.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-400">找不到符合的人物</div>
                  ) : (
                    searchResults.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectFromSearch(m.id)}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-700 truncate">{m.name}</div>
                          <div className="text-xs text-emerald-600 font-semibold truncate">{m.kinship}</div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">{m.id}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 快速新增按鈕：手機版改為右下角懸浮 (Floating Action Button) */}
        <button 
          onClick={() => { setQaContext({ relativeId: selectedId || meId, relationType: 'child' }); setIsQAOpen(true); }}
          className={`hidden md:flex absolute md:left-auto md:bottom-4 md:top-auto ${selectedMember ? 'md:right-[25rem]' : 'md:right-4'} bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl md:shadow-lg rounded-full md:rounded-2xl p-4 md:px-5 md:py-3 items-center gap-2 pointer-events-auto transition-transform hover:scale-105 z-40`}
        >
          <UserPlus size={24} className="md:w-5 md:h-5" />
          <span className="font-semibold hidden md:inline">快速新增</span>
        </button>
      </div>

      <div className={`w-[92vw] sm:w-96 bg-white shadow-2xl z-30 flex flex-col transition-transform duration-500 ease-in-out absolute right-0 h-full ${selectedMember && !suppressProfilePanel ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedMember && (
          <ProfilePanel 
            member={selectedMember} 
            kinship={calculateKinship(meId, selectedId, members)}
            meId={meId}
            onClose={() => {
              setSuppressProfilePanel(false);
              setSelectedId(null);
            }}
            onSetViewpoint={(id) => setMeId(id)}
            onAddRelative={(type) => {
              setQaContext({
                relativeId: selectedId,
                relationType: type,
                preferredTab: 'form',
              });
              setIsQAOpen(true);
            }}
            onAddByText={(relText) => {
              setQaContext({
                relativeId: selectedId,
                relationType: 'child',
                preferredTab: 'text',
                prefillRelText: relText,
              });
              setIsQAOpen(true);
            }}
            onShowQR={() => setIsQROpen(true)}
            onAddPost={handleAddPost}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}
      </div>

      {isQAOpen && (
        <QAModal 
          context={qaContext} 
          members={members} 
          onClose={() => setIsQAOpen(false)} 
          onSubmit={handleUpdateMembers} 
        />
      )}

      {isQROpen && selectedMember && (
        <QRCodeModal 
          member={selectedMember} 
          onClose={() => setIsQROpen(false)} 
          onClaim={() => {
            setMembers({ ...members, [selectedId]: { ...selectedMember, claimed: true } });
            setIsQROpen(false);
          }}
        />
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setIsSettingsOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Settings size={20} className="text-emerald-600"/> 設定</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">顯示姻親家族（岳家／婆家等）</span>
                <button 
                  type="button"
                  role="switch"
                  aria-checked={showInLaws}
                  onClick={() => setShowInLaws(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${showInLaws ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${showInLaws ? 'translate-x-5' : ''}`}/>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">新增後自動選取新成員</span>
                <button 
                  type="button"
                  role="switch"
                  aria-checked={autoSelectNew}
                  onClick={() => setAutoSelectNew(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${autoSelectNew ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoSelectNew ? 'translate-x-5' : ''}`}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isResetOpen && (
        <ResetModal 
          onClose={() => setIsResetOpen(false)}
          onReset={(newName, newGender, newTreeName, newBirthday) => {
            const newId = generateId();
            const newMember = {
              id: newId, name: newName, gender: newGender,
              parents: [], children: [], spouses: [], bio: '族譜建立者', posts: [], claimed: true, birthday: newBirthday || '', deathDate: ''
            };
            setTreeName(newTreeName);
            setMembers({ [newId]: newMember });
            setMeId(newId);
            setSelectedId(newId);
            setIsStartOpen(false);
            setIsResetOpen(false);
          }}
        />
      )}

      {isStartOpen && (
        <StartModal
          onCreate={() => {
            setIsStartOpen(false);
            setIsResetOpen(true);
          }}
          onLoadTemplate={() => {
            setTreeName('王家大族譜');
            setMembers(normalizeMembers(INITIAL_MEMBERS));
            setMeId('m3');
            setSelectedId(null);
            setIsStartOpen(false);
          }}
          hasSavedData={hasSavedLocalData}
          onLoadLastData={handleLoadLastData}
          onClearSavedData={handleClearSavedData}
        />
      )}

      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-sm p-4 md:hidden">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">搜尋人物</h3>
              <button
                onClick={() => setIsMobileSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={16} className="text-gray-400" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="輸入姓名或 ID"
                className="w-full bg-transparent outline-none text-sm text-gray-700"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="mt-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              {searchQuery.trim() ? (
                searchResults.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-gray-400">找不到符合的人物</div>
                ) : (
                  searchResults.map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleSelectFromSearch(m.id)}
                      className="w-full text-left px-3 py-3 hover:bg-emerald-50 flex items-center justify-between border-b border-gray-50 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">{m.name}</div>
                        <div className="text-xs text-emerald-600 font-semibold truncate">{m.kinship}</div>
                      </div>
                      <span className="text-xs text-gray-400 ml-2">{m.id}</span>
                    </button>
                  ))
                )
              ) : (
                <div className="px-3 py-3 text-sm text-gray-400">輸入關鍵字開始搜尋</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] md:text-xs text-gray-500/80 pointer-events-none z-10 whitespace-nowrap">
        Copyright © 禾軒有限公司 2026
      </div>
    </div>
  );
}

// ==========================================
// 4. Canvas 互動族譜樹核心組件 (重寫版平滑物理引擎)
// ==========================================
const CanvasTree = ({ members, showInLaws = true, selectedId, onSelect, meId, focusId, focusKey, searchHighlightId, onQuickAdd, onOpenMobileSearch }) => {
  const canvasRef = useRef(null);
  const dprRef = useRef(typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1);
  const suppressMouseUntilRef = useRef(0);
  
  const engineRef = useRef({
    nodes: [],
    links: [],
    families: [],
    transform: { x: 0, y: 0, scale: 0.8 },
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    collapsedNodes: new Set(),
    pinchStartDist: null,  // 新增：雙指縮放紀錄
    pinchStartScale: 1
  });

  const collectHiddenNodes = useCallback((nodes, collapsedNodes) => {
    const hiddenNodes = new Set();
    const queue = [...collapsedNodes];

    while (queue.length > 0) {
      const pid = queue.shift();
      const parentNode = nodes.find(n => n.id === pid);
      if (!parentNode || !parentNode.data.children) continue;
      parentNode.data.children.forEach(cid => {
        if (!hiddenNodes.has(cid)) {
          hiddenNodes.add(cid);
          queue.push(cid);
        }
      });
    }

    nodes.forEach(n => {
      if (hiddenNodes.has(n.id)) {
        n.data.spouses.forEach(sid => hiddenNodes.add(sid));
      }
    });

    return hiddenNodes;
  }, []);

  const computeLayoutTargets = useCallback((engine, hiddenNodes) => {
    const { nodes, links, families } = engine;
    const rowSpacing = 230;
    const unitGap = 160;    // gap between sibling units (child+spouse)
    const spouseGap = 130;  // gap between spouses within a couple

    // --- Mark hidden ---
    const genMap = new Map();
    nodes.forEach(n => {
      n.isHidden = hiddenNodes.has(n.id);
      if (!n.isHidden) {
        if (!genMap.has(n.gen)) genMap.set(n.gen, []);
        genMap.get(n.gen).push(n);
      }
    });

    const nodeById = {};
    nodes.forEach(n => { nodeById[n.id] = n; });

    // --- Identify blood relatives vs married-in ---
    // Blood = has parents OR is a root ancestor with children
    const isBlood = (n) => {
      if (n.data.parents.length > 0) return true;
      // Root ancestors (no parents but have children) are blood
      if (n.data.children.length > 0) return true;
      return false;
    };

    // --- Build subtree width (bottom-up) ---
    // A "unit" = blood member + their spouse(s). Units are the atomic positioning blocks.
    // Width of a unit = spouseGap * numSpouses (or just one node width if no spouse)
    // Width of a parent unit = max(own width, sum of children unit widths + gaps)

    const unitWidth = {}; // id -> total width needed for this person's subtree

    const getSpouses = (id) => {
      const n = nodeById[id];
      if (!n || n.isHidden) return [];
      return (n.data.spouses || [])
        .map(sid => nodeById[sid])
        .filter(sp => sp && !sp.isHidden);
    };

    const getBloodChildren = (id) => {
      const n = nodeById[id];
      if (!n) return [];
      // Children that are blood (have this node as parent)
      // For each child, find their spouses to form units
      return (n.data.children || [])
        .map(cid => nodeById[cid])
        .filter(c => c && !c.isHidden && c.data.parents.includes(id));
    };

    // Deduplicate: children shared between two parents should only be counted once
    // Use families to get unique child sets
    const familyChildren = {}; // familyKey -> [childIds]
    families.forEach(fam => {
      const key = fam.id;
      familyChildren[key] = fam.childIds.filter(cid => nodeById[cid] && !nodeById[cid].isHidden);
    });

    // Calculate unit width bottom-up
    // Unit = person + spouse side by side. Subtree = unit + all descendant subtrees below.
    const calcWidth = (id, visited) => {
      if (visited.has(id)) return unitWidth[id] || spouseGap;
      visited.add(id);

      const n = nodeById[id];
      if (!n || n.isHidden) { unitWidth[id] = 0; return 0; }

      const spouses = getSpouses(id);
      const ownWidth = spouses.length > 0 ? spouseGap * spouses.length : 0;

      // Find children (unique, not double-counted between co-parents)
      const childIds = [];
      const seen = new Set();
      (n.data.children || []).forEach(cid => {
        if (!seen.has(cid) && nodeById[cid] && !nodeById[cid].isHidden) {
          seen.add(cid);
          childIds.push(cid);
        }
      });

      // Only count children whose primary parent is this node
      // (to avoid double counting between co-parents)
      const myChildren = childIds.filter(cid => {
        const c = nodeById[cid];
        // Primary parent: the one with parents themselves, or first in list
        const bloodParents = c.data.parents.filter(pid => nodeById[pid] && !nodeById[pid].isHidden && nodeById[pid].data.parents.length > 0);
        if (bloodParents.length > 0) return bloodParents[0] === id;
        return c.data.parents[0] === id;
      });

      if (myChildren.length === 0) {
        unitWidth[id] = Math.max(ownWidth, spouseGap);
        return unitWidth[id];
      }

      let childrenTotalWidth = 0;
      myChildren.forEach((cid, i) => {
        const cSpouses = getSpouses(cid);
        const childSubtreeW = calcWidth(cid, visited);
        // Each child unit includes the child + their spouses
        const childUnitOwnW = cSpouses.length > 0 ? spouseGap * cSpouses.length : 0;
        const childW = Math.max(childSubtreeW, childUnitOwnW, spouseGap);
        childrenTotalWidth += childW;
        if (i > 0) childrenTotalWidth += unitGap - spouseGap; // gap between child units
      });

      unitWidth[id] = Math.max(ownWidth, childrenTotalWidth, spouseGap);
      return unitWidth[id];
    };

    // Find root nodes (topmost generation)
    const sortedGens = [...genMap.keys()].sort((a, b) => a - b);
    const visited = new Set();

    // Calculate widths starting from root generation
    if (sortedGens.length > 0) {
      const rootGen = sortedGens[0];
      const rootRow = genMap.get(rootGen) || [];
      // Start from blood roots (not married-in)
      const bloodRoots = rootRow.filter(n => isBlood(n));
      const rootsToCalc = bloodRoots.length > 0 ? bloodRoots : rootRow;
      rootsToCalc.forEach(n => calcWidth(n.id, visited));
      // Also calc for any not yet visited
      nodes.forEach(n => { if (!visited.has(n.id) && !n.isHidden) calcWidth(n.id, visited); });
    }

    // --- Top-down positioning ---
    const positioned = new Set();

    const positionSubtree = (id, centerX, gen) => {
      const n = nodeById[id];
      if (!n || n.isHidden || positioned.has(id)) return;
      positioned.add(id);

      n.targetX = centerX;
      n.targetY = gen * rowSpacing;

      // Place spouses
      const spouses = getSpouses(id);
      spouses.forEach((sp, i) => {
        if (positioned.has(sp.id)) return;
        positioned.add(sp.id);
        sp.targetX = centerX + spouseGap * (i + 1);
        sp.targetY = gen * rowSpacing;
      });

      // Adjust: center the couple
      if (spouses.length > 0) {
        const coupleWidth = spouseGap * spouses.length;
        const coupleLeft = centerX - coupleWidth / 2;
        n.targetX = coupleLeft;
        spouses.forEach((sp, i) => {
          sp.targetX = coupleLeft + spouseGap * (i + 1);
        });
      }

      // Position children
      const childIds = [];
      const seen = new Set();
      (n.data.children || []).forEach(cid => {
        if (!seen.has(cid) && nodeById[cid] && !nodeById[cid].isHidden && !positioned.has(cid)) {
          // Only if this node is primary parent
          const c = nodeById[cid];
          const bloodParents = c.data.parents.filter(pid => nodeById[pid] && !nodeById[pid].isHidden && nodeById[pid].data.parents.length > 0);
          const primaryParent = bloodParents.length > 0 ? bloodParents[0] : c.data.parents[0];
          if (primaryParent === id) {
            seen.add(cid);
            childIds.push(cid);
          }
        }
      });

      if (childIds.length === 0) return;

      // Calculate each child's subtree width
      const childWidths = childIds.map(cid => {
        const cSpouses = getSpouses(cid);
        const subtreeW = unitWidth[cid] || spouseGap;
        const ownW = cSpouses.length > 0 ? spouseGap * cSpouses.length : 0;
        return Math.max(subtreeW, ownW, spouseGap);
      });

      const totalChildrenWidth = childWidths.reduce((s, w) => s + w, 0) + (childIds.length - 1) * (unitGap - spouseGap);

      // Center the couple pair
      const coupleCenterX = spouses.length > 0
        ? (n.targetX + spouses[spouses.length - 1].targetX) / 2
        : centerX;

      let childCursor = coupleCenterX - totalChildrenWidth / 2;

      childIds.forEach((cid, i) => {
        const w = childWidths[i];
        const childCenterX = childCursor + w / 2;
        positionSubtree(cid, childCenterX, gen + 1);
        childCursor += w + (unitGap - spouseGap);
      });
    };

    // Position from roots
    if (sortedGens.length > 0) {
      const rootGen = sortedGens[0];
      const rootRow = genMap.get(rootGen) || [];
      const bloodRoots = rootRow.filter(n => isBlood(n) && !positioned.has(n.id));

      // Calculate total width of all root subtrees
      const rootWidths = bloodRoots.map(n => unitWidth[n.id] || spouseGap);
      const totalRootWidth = rootWidths.reduce((s, w) => s + w, 0) + Math.max(0, (bloodRoots.length - 1)) * unitGap;

      let cursor = -totalRootWidth / 2;
      bloodRoots.forEach((n, i) => {
        const w = rootWidths[i];
        positionSubtree(n.id, cursor + w / 2, rootGen);
        cursor += w + unitGap;
      });
    }

    // --- Position remaining unpositioned nodes (in-law parents, disconnected) ---
    // Phase A: unpositioned "parent couples" whose children are already positioned
    //          → place them as a couple to the right of the main tree
    const unpositioned = nodes.filter(n => !n.isHidden && !positioned.has(n.id));
    const handled = new Set();
    const parentFamilies = [];

    unpositioned.forEach(n => {
      if (handled.has(n.id)) return;
      const posChildIds = (n.data.children || []).filter(cid => positioned.has(cid));
      if (posChildIds.length === 0) return;

      const familyMembers = [n.id];
      handled.add(n.id);
      (n.data.spouses || []).forEach(sid => {
        if (!positioned.has(sid) && !handled.has(sid) && nodeById[sid]) {
          familyMembers.push(sid);
          handled.add(sid);
        }
      });
      const childCenterX = posChildIds.reduce((s, cid) => s + nodeById[cid].targetX, 0) / posChildIds.length;
      parentFamilies.push({ members: familyMembers, childCenterX });
    });

    // Find the rightmost positioned node to place secondary families beyond it
    let maxPositionedX = -Infinity;
    nodes.forEach(n => {
      if (positioned.has(n.id) && !n.isHidden && n.targetX > maxPositionedX) maxPositionedX = n.targetX;
    });
    if (!isFinite(maxPositionedX)) maxPositionedX = 0;

    let secondaryCursor = maxPositionedX + unitGap * 1.5;
    parentFamilies.forEach(fam => {
      const mems = fam.members;
      const cx = secondaryCursor;
      mems.forEach((mid, i) => {
        const mn = nodeById[mid];
        positioned.add(mid);
        mn.targetX = cx + i * spouseGap - ((mems.length - 1) * spouseGap) / 2;
        mn.targetY = mn.gen * rowSpacing;
      });
      secondaryCursor += mems.length * spouseGap + unitGap;
    });

    // Phase B: unpositioned spouses of positioned nodes → snap next to spouse
    nodes.forEach(n => {
      if (n.isHidden || positioned.has(n.id)) return;
      const posSpouseId = (n.data.spouses || []).find(sid => positioned.has(sid));
      if (posSpouseId) {
        const sp = nodeById[posSpouseId];
        n.targetX = sp.targetX + spouseGap;
        n.targetY = sp.targetY;
        positioned.add(n.id);
      }
    });

    // Phase C: anything truly disconnected
    nodes.forEach(n => {
      if (n.isHidden || positioned.has(n.id)) return;
      n.targetX = secondaryCursor;
      n.targetY = n.gen * rowSpacing;
      secondaryCursor += unitGap;
      positioned.add(n.id);
    });

    // --- Final overlap fix (light pass, never splits couples) ---
    sortedGens.forEach(gen => {
      const row = (genMap.get(gen) || []).filter(n => !n.isHidden).sort((a, b) => a.targetX - b.targetX);
      for (let pass = 0; pass < 5; pass++) {
        for (let i = 1; i < row.length; i++) {
          const prev = row[i - 1], curr = row[i];
          const isCouple = prev.data.spouses.includes(curr.id) || curr.data.spouses.includes(prev.id);
          const minGap = isCouple ? 120 : 145;
          const gap = curr.targetX - prev.targetX;
          if (gap < minGap) {
            // If one of them is part of a couple with its neighbour, push the outsider away
            const fix = minGap - gap;
            if (isCouple) {
              // Couple too close — symmetric push
              prev.targetX -= fix / 2;
              curr.targetX += fix / 2;
            } else {
              // Non-couple overlap — push the one that is further from a coupled partner outward
              const prevIsCoupled = i >= 2 && (row[i - 2].data.spouses.includes(prev.id) || prev.data.spouses.includes(row[i - 2].id));
              const currIsCoupled = i + 1 < row.length && (curr.data.spouses.includes(row[i + 1].id) || row[i + 1].data.spouses.includes(curr.id));
              if (prevIsCoupled && !currIsCoupled) {
                curr.targetX += fix;
              } else if (!prevIsCoupled && currIsCoupled) {
                prev.targetX -= fix;
              } else {
                prev.targetX -= fix / 2;
                curr.targetX += fix / 2;
              }
            }
          }
        }
      }
    });

    // --- Hidden nodes collapse toward parent ---
    nodes.forEach(n => {
      if (!n.isHidden) return;
      const parent = nodes.find(p => n.data.parents.includes(p.id));
      if (parent) {
        n.targetX = parent.x;
        n.targetY = parent.y;
      }
    });
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    let nodeMap = {};
    let newNodes = [];
    let newLinks = [];
    let familiesMap = {};

    // --- Filter in-law families if showInLaws is off ---
    // Patrilineal approach:
    // Step 1: From meId go UP — add all parents but only recurse upward through male parents (父系)
    // Step 2: From all discovered ancestors, go DOWN through all children → blood descendants
    // Step 3: Add direct spouses of blood members (keep them, but not their parents/siblings)
    let effectiveMembers = members;
    if (!showInLaws) {
      // Step 1: patrilineal ancestors
      const ancestors = new Set();
      ancestors.add(meId);
      const upQ = [meId];
      while (upQ.length > 0) {
        const cur = upQ.shift();
        const cm = members[cur];
        if (!cm) continue;
        cm.parents.forEach(pid => {
          if (!ancestors.has(pid) && members[pid]) {
            ancestors.add(pid);
            // Only continue upward through male parent (patrilineal line)
            if (members[pid].gender === 'M') {
              upQ.push(pid);
            }
          }
        });
      }

      // Step 2: from all ancestors, go DOWN through children
      const blood = new Set(ancestors);
      const downQ = [...ancestors];
      while (downQ.length > 0) {
        const cur = downQ.shift();
        const cm = members[cur];
        if (!cm) continue;
        cm.children.forEach(cid => {
          if (!blood.has(cid) && members[cid]) { blood.add(cid); downQ.push(cid); }
        });
      }

      // Step 3: add direct spouses of blood members
      const keepSet = new Set(blood);
      blood.forEach(bid => {
        const bm = members[bid];
        if (bm) bm.spouses.forEach(sid => keepSet.add(sid));
      });

      // Filter
      effectiveMembers = {};
      Object.keys(members).forEach(id => {
        if (keepSet.has(id)) {
          const m = { ...members[id] };
          m.parents = m.parents.filter(pid => keepSet.has(pid));
          m.children = m.children.filter(cid => keepSet.has(cid));
          m.spouses = m.spouses.filter(sid => keepSet.has(sid));
          effectiveMembers[id] = m;
        }
      });
    }

    const memberIds = Object.keys(effectiveMembers);
    const isReset = memberIds.length === 1;

    // 計算世代 (簡單 BFS)
    let generations = {};
    const rootId = memberIds[0];
    if (rootId) {
      generations[rootId] = 0;
      let queue = [rootId];
      let visited = new Set([rootId]);
      while (queue.length > 0) {
        let curr = queue.shift();
        let curGen = generations[curr];
        let m = effectiveMembers[curr];
        
        m.children.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen + 1; queue.push(id); } });
        m.spouses.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen; queue.push(id); } });
        m.parents.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen - 1; queue.push(id); } });
      }
    }

    Object.values(effectiveMembers).forEach(m => {
      const existing = engine.nodes.find(n => n.id === m.id);
      
      // 優化出生點：如果是新成員，盡量出生在親戚附近，避免節點從遠方彈射
      let initX = 0, initY = 0;
      if (existing) {
         initX = existing.x; initY = existing.y;
      } else if (!isReset) {
         let relNode = engine.nodes.find(n => m.parents.includes(n.id) || m.children.includes(n.id) || m.spouses.includes(n.id));
         if (relNode) {
             initX = relNode.x + (Math.random() * 60 - 30);
             initY = relNode.y + (Math.random() * 60 - 30);
         } else {
             initX = Math.random() * 200 - 100;
         }
      }

      const node = {
        id: m.id, name: m.name, gender: m.gender,
        gen: generations[m.id] || 0,
        isViewpoint: m.id === meId,
        kinship: calculateKinship(meId, m.id, members),
        x: initX, y: initY,
        targetX: existing ? existing.targetX : initX,
        targetY: existing ? existing.targetY : initY,
        vx: existing ? existing.vx : 0, vy: existing ? existing.vy : 0,
        radius: 45, 
        hasChildren: m.children.length > 0,
        data: m
      };
      nodeMap[m.id] = node;
      newNodes.push(node);
    });

    Object.values(effectiveMembers).forEach(m => {
      m.spouses.forEach(sid => {
        if (m.id < sid && nodeMap[m.id] && nodeMap[sid]) {
          newLinks.push({ source: nodeMap[m.id], target: nodeMap[sid], type: 'spouse' });
        }
      });
      if (m.parents.length > 0) {
        let pKey = [...m.parents].sort().join(',');
        if (!familiesMap[pKey]) { familiesMap[pKey] = { id: pKey, parentIds: m.parents, childIds: [] }; }
        familiesMap[pKey].childIds.push(m.id);
      }
    });

    const existingSpousePairs = new Set(
      newLinks
        .filter(l => l.type === 'spouse')
        .map(l => [l.source.id, l.target.id].sort().join('|'))
    );

    Object.values(familiesMap).forEach(fam => {
      const visibleParents = fam.parentIds.filter(pid => nodeMap[pid]);
      for (let i = 0; i < visibleParents.length; i++) {
        for (let j = i + 1; j < visibleParents.length; j++) {
          const a = visibleParents[i];
          const b = visibleParents[j];
          const key = [a, b].sort().join('|');
          if (!existingSpousePairs.has(key)) {
            newLinks.push({ source: nodeMap[a], target: nodeMap[b], type: 'spouse' });
            existingSpousePairs.add(key);
          }
        }
      }
    });

    engine.nodes = newNodes;
    engine.links = newLinks;
    engine.families = Object.values(familiesMap);

    const hiddenNodes = collectHiddenNodes(engine.nodes, engine.collapsedNodes);
    computeLayoutTargets(engine, hiddenNodes);
    
    // 清空重置時，強制置中視角
    if (isReset) {
      engine.transform.x = window.innerWidth / 2;
      engine.transform.y = window.innerHeight / 2;
      engine.transform.scale = 1;
      engine.collapsedNodes.clear();
    } else if (newNodes.length > 0 && engine.transform.scale === 0.8 && engine.transform.x === 0) {
      // 第一次載入多筆資料時的初始視角
      engine.transform.x = window.innerWidth / 2;
      engine.transform.y = window.innerHeight / 4;
    }
  }, [members, meId, showInLaws]);

  useEffect(() => {
    if (!focusId) return;
    const engine = engineRef.current;
    // Ensure searched member is visible even if it is under a collapsed branch.
    engine.collapsedNodes = new Set();
    const node = engine.nodes.find(n => n.id === focusId);
    const canvas = canvasRef.current;
    if (!node || !canvas) return;

    const targetScale = Math.max(0.75, engine.transform.scale);
    const recenter = () => {
      const currentNode = engine.nodes.find(n => n.id === focusId);
      if (!currentNode || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      engine.transform.scale = targetScale;
      engine.transform.x = rect.width / 2 - currentNode.x * targetScale;
      engine.transform.y = rect.height / 2 - currentNode.y * targetScale;
    };

    recenter();

    // Desktop sidebar and layout transitions can shift viewport after first center.
    const t1 = setTimeout(recenter, 120);
    const t2 = setTimeout(recenter, 380);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [focusId, focusKey, members]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      const cssWidth = canvas.parentElement.clientWidth;
      const cssHeight = canvas.parentElement.clientHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      dprRef.current = dpr;

      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
    };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const engine = engineRef.current;
      const { nodes, links, transform, collapsedNodes, families } = engine;

      const hiddenNodes = collectHiddenNodes(nodes, collapsedNodes);
      computeLayoutTargets(engine, hiddenNodes);

      nodes.forEach(n => {
        n.isHidden = hiddenNodes.has(n.id);
        if (n.isHidden) {
          const parent = nodes.find(p => n.data.parents.includes(p.id));
          if (parent) {
            n.x += (parent.x - n.x) * 0.25;
            n.y += (parent.y - n.y) * 0.25;
          }
          n.vx *= 0.6;
          n.vy *= 0.6;
          return;
        }

        n.vx = n.vx * 0.72 + (n.targetX - n.x) * 0.16;
        n.vy = n.vy * 0.72 + (n.targetY - n.y) * 0.16;
        n.x += n.vx;
        n.y += n.vy;

        // Snap to target when nearly settled to stop micro-oscillation.
        if (
          Math.abs(n.targetX - n.x) < 0.8
          && Math.abs(n.targetY - n.y) < 0.8
          && Math.abs(n.vx) < 0.4
          && Math.abs(n.vy) < 0.4
        ) {
          n.x = n.targetX;
          n.y = n.targetY;
          n.vx = 0;
          n.vy = 0;
        }
      });

      // Visible node collision pass.
      const visibleNodes = nodes.filter(n => !n.isHidden);
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < visibleNodes.length; i++) {
          for (let j = i + 1; j < visibleNodes.length; j++) {
            const a = visibleNodes[i];
            const b = visibleNodes[j];
            const isSpouse = a.data.spouses.includes(b.id);
            const sameGen = a.gen === b.gen;

            if (sameGen) {
              // Same generation: push horizontally only — keep rows stable.
              let dx = b.x - a.x;
              if (dx === 0) dx = 1;
              const absDx = Math.abs(dx);
              // Use minDist <= layout minGap (160) to avoid spring-collision fight.
              const minDist = isSpouse ? 115 : 150;
              if (absDx < minDist) {
                const fix = (minDist - absDx) * 0.35;
                const sign = dx > 0 ? 1 : -1;
                a.x -= sign * fix;
                b.x += sign * fix;
              }
            } else {
              // Cross-generation: use radial push (rare with good layout).
              let dx = b.x - a.x;
              let dy = b.y - a.y;
              if (dx === 0 && dy === 0) { dx = 1; dy = 0; }
              const dist = Math.hypot(dx, dy);
              const minDist = 120;
              if (dist < minDist) {
                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;
                a.x -= nx * overlap * 0.3;
                a.y -= ny * overlap * 0.15;
                b.x += nx * overlap * 0.3;
                b.y += ny * overlap * 0.15;
              }
            }
          }
        }
      }

      const dpr = dprRef.current;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      // 繪製配偶連線
      ctx.lineWidth = 3;
      links.forEach(l => {
        if (l.type === 'spouse' && !l.source.isHidden && !l.target.isHidden) {
          const midX = (l.source.x + l.target.x) / 2;
          const archY = Math.min(l.source.y, l.target.y) - 24;
          ctx.beginPath();
          ctx.strokeStyle = '#fca5a5';
          ctx.setLineDash([6, 6]);
          ctx.moveTo(l.source.x, l.source.y + 4);
          ctx.quadraticCurveTo(midX, archY, l.target.x, l.target.y + 4);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);

      // 繪製親子連線與收合按鈕
      const familyItems = families.map(fam => {
        const parents = fam.parentIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);
        const children = fam.childIds.map(id => nodes.find(n => n.id === id)).filter(Boolean);
        return { fam, parents, children };
      }).filter(item => item.parents.length > 0 && item.children.length > 0);

      // Route families on separate lanes only when their horizontal spans overlap.
      const laneTracker = {};

      familyItems.forEach(item => {
        const visibleParents = item.parents.filter(p => !p.isHidden);
        const visibleChildren = item.children.filter(c => !c.isHidden);
        const parentGen = visibleParents.length > 0
          ? Math.round(visibleParents.reduce((sum, p) => sum + p.gen, 0) / visibleParents.length)
          : Math.round(item.parents.reduce((sum, p) => sum + p.gen, 0) / item.parents.length);

        const xCandidates = [
          ...visibleParents.map(p => p.x),
          ...visibleChildren.map(c => c.x),
        ];

        const minX = xCandidates.length > 0 ? Math.min(...xCandidates) : 0;
        const maxX = xCandidates.length > 0 ? Math.max(...xCandidates) : 0;

        item.parentGen = parentGen;
        item.rangeMinX = minX - 16;
        item.rangeMaxX = maxX + 16;
      });

      familyItems
        .sort((a, b) => {
          const aCenter = a.parents.reduce((sum, p) => sum + p.x, 0) / a.parents.length;
          const bCenter = b.parents.reduce((sum, p) => sum + p.x, 0) / b.parents.length;
          const aGen = a.parentGen;
          const bGen = b.parentGen;
          if (aGen !== bGen) return aGen - bGen;
          return aCenter - bCenter;
        })
        .forEach(item => {
          const key = String(item.parentGen);
          if (!laneTracker[key]) laneTracker[key] = [];

          let chosenLane = 0;
          while (true) {
            const conflict = laneTracker[key].some(placed => {
              if (placed.lane !== chosenLane) return false;
              return !(item.rangeMaxX < placed.rangeMinX || item.rangeMinX > placed.rangeMaxX);
            });
            if (!conflict) break;
            chosenLane += 1;
          }

          item.lane = chosenLane;
          laneTracker[key].push({
            lane: chosenLane,
            rangeMinX: item.rangeMinX,
            rangeMaxX: item.rangeMaxX,
          });
        });

      familyItems.forEach(({ fam, parents, children, lane }) => {
        if (parents.length === 0 || children.length === 0) return;
        if (parents.every(p => p.isHidden)) return;

        const visibleParents = parents.filter(p => !p.isHidden);
        const visibleChildren = children.filter(c => !c.isHidden);
        if (visibleParents.length === 0) return;

        const pX = visibleParents.reduce((sum, p) => sum + p.x, 0) / visibleParents.length;
        const pMaxY = Math.max(...visibleParents.map(p => p.y + p.radius));
        const parentJointY = pMaxY + 14;
        let midY = pMaxY + 32 + lane * 18;

        const isCollapsed = fam.parentIds.some(pid => collapsedNodes.has(pid));
        if (!isCollapsed && visibleChildren.length > 0) {
          const minChildTop = Math.min(...visibleChildren.map(c => c.y - c.radius));
          midY = Math.min(midY, minChildTop - 28);
          midY = Math.max(midY, pMaxY + 20);
        }

        ctx.beginPath();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3;

        visibleParents.forEach(parent => {
          const parentBottomY = parent.y + parent.radius;
          ctx.moveTo(parent.x, parentBottomY);
          ctx.lineTo(parent.x, parentJointY);
          if (Math.abs(parent.x - pX) > 1) {
            ctx.lineTo(pX, parentJointY);
          }
        });

        ctx.moveTo(pX, parentJointY);
        ctx.lineTo(pX, midY);

        if (!isCollapsed && visibleChildren.length > 0) {
          const sortedChildren = visibleChildren.slice().sort((a, b) => a.x - b.x);
          const minX = Math.min(pX, sortedChildren[0].x);
          const maxX = Math.max(pX, sortedChildren[sortedChildren.length - 1].x);
          ctx.moveTo(minX, midY);
          ctx.lineTo(maxX, midY);

          sortedChildren.forEach(c => {
            const childTopY = c.y - c.radius;
            const elbowY = Math.min(childTopY - 10, midY + 18);
            ctx.moveTo(c.x, midY);
            ctx.quadraticCurveTo(c.x, elbowY, c.x, childTopY);
          });
        }
        ctx.stroke();

        fam.buttonX = pX;
        fam.buttonY = midY;
        
        ctx.beginPath();
        ctx.arc(pX, midY, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isCollapsed ? '+' : '-', pX, midY + 1);
      });

      // 繪製節點
      nodes.forEach(n => {
        if (n.isHidden && Math.abs(n.vx) < 0.1 && Math.abs(n.vy) < 0.1) return;
        
        ctx.globalAlpha = n.isHidden ? 0 : 1;
        const isSelected = n.id === selectedId;
        const isViewpoint = n.isViewpoint;
        const isSearchHit = n.id === searchHighlightId;

        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 8;

        if (isSearchHit && !n.isHidden) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 15, 0, Math.PI * 2);
          ctx.lineWidth = 3;
          ctx.strokeStyle = '#f59e0b';
          ctx.stroke();
        }

        if (isViewpoint && !n.isHidden) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isViewpoint ? '#ecfdf5' : (isSelected ? '#fff' : (n.gender === 'M' ? '#eff6ff' : '#fdf2f8'));
        ctx.fill();
        
        ctx.lineWidth = isViewpoint ? 5 : (isSelected ? 4 : 2);
        ctx.strokeStyle = isViewpoint ? '#059669' : (isSelected ? '#10b981' : (n.gender === 'M' ? '#3b82f6' : '#ec4899'));
        ctx.stroke();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = isSelected ? '#059669' : '#64748b';
        ctx.font = '13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.kinship, n.x, n.y - 14);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(n.name, n.x, n.y + 10);

        if (isViewpoint) {
          ctx.beginPath();
          ctx.arc(n.x - n.radius * 0.72, n.y - n.radius * 0.72, 11, 0, Math.PI * 2);
          ctx.fillStyle = '#059669';
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('我', n.x - n.radius * 0.72, n.y - n.radius * 0.72 + 1);
        }

        if (n.data.claimed) {
           ctx.beginPath();
           ctx.arc(n.x + n.radius * 0.7, n.y - n.radius * 0.7, 10, 0, Math.PI * 2);
           ctx.fillStyle = '#10b981';
           ctx.fill();
           ctx.fillStyle = '#fff';
           ctx.font = 'bold 12px sans-serif';
           ctx.fillText('✓', n.x + n.radius * 0.7, n.y - n.radius * 0.7 + 1);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedId, members]);

  const handleMouseDown = (e, options = {}) => {
    const { fromTouch = false } = options;
    if (!fromTouch && Date.now() < suppressMouseUntilRef.current) return;

    // 支援 MouseEvent 或 Touch 傳遞來的物件
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const engine = engineRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    const realX = (mouseX - engine.transform.x) / engine.transform.scale;
    const realY = (mouseY - engine.transform.y) / engine.transform.scale;

    let clickedNode = null;
    let clickedFamilyBtn = null;

    for (let fam of engine.families) {
      if (fam.buttonX !== undefined) {
        let dx = realX - fam.buttonX;
        let dy = realY - fam.buttonY;
        if (Math.sqrt(dx*dx + dy*dy) < 18) {
          clickedFamilyBtn = fam;
          break;
        }
      }
    }

    if (clickedFamilyBtn) {
       let pid = clickedFamilyBtn.parentIds[0]; 
       const newSet = new Set(engine.collapsedNodes);
       if (newSet.has(pid)) newSet.delete(pid);
       else newSet.add(pid);
       engine.collapsedNodes = newSet;
       return;
    }

    for (let i = engine.nodes.length - 1; i >= 0; i--) {
      let n = engine.nodes[i];
      if (n.isHidden) continue;
      let dx = realX - n.x;
      let dy = realY - n.y;
      if (Math.sqrt(dx*dx + dy*dy) < n.radius) {
        clickedNode = n;
        break;
      }
    }

    if (clickedNode) {
      onSelect(clickedNode.id);
    } else {
      engine.isDragging = true;
      engine.dragStart = { x: mouseX - engine.transform.x, y: mouseY - engine.transform.y };
      onSelect(null);
    }
  };

  const handleMouseMove = (e) => {
    const clientX = e.clientX;
    const clientY = e.clientY;
    
    const engine = engineRef.current;
    if (engine.isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      engine.transform.x = mouseX - engine.dragStart.x;
      engine.transform.y = mouseY - engine.dragStart.y;
    }
  };

  const handleMouseUp = () => { engineRef.current.isDragging = false; };
  const handleWheel = (e) => {
    e.preventDefault();
    const engine = engineRef.current;
    const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;
    let newScale = engine.transform.scale * zoomAmount;
    newScale = Math.max(0.1, Math.min(newScale, 4)); 
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    engine.transform.x = mouseX - (mouseX - engine.transform.x) * (newScale / engine.transform.scale);
    engine.transform.y = mouseY - (mouseY - engine.transform.y) * (newScale / engine.transform.scale);
    engine.transform.scale = newScale;
  };

  // --- 新增：行動裝置觸控事件 (Touch Events) ---
  const handleTouchStart = (e) => {
    suppressMouseUntilRef.current = Date.now() + 700;

    if (e.touches.length === 1) {
      handleMouseDown(
        { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY },
        { fromTouch: true }
      );
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      engineRef.current.pinchStartDist = dist;
      engineRef.current.pinchStartScale = engineRef.current.transform.scale;
    }
  };

  const handleTouchMove = (e) => {
    suppressMouseUntilRef.current = Date.now() + 700;

    if (e.touches.length === 1 && engineRef.current.isDragging) {
      handleMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
    } else if (e.touches.length === 2 && engineRef.current.pinchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDiff = dist / engineRef.current.pinchStartDist;
      let newScale = engineRef.current.pinchStartScale * scaleDiff;
      newScale = Math.max(0.1, Math.min(newScale, 4));
      engineRef.current.transform.scale = newScale;
    }
  };

  const handleTouchEnd = () => {
    suppressMouseUntilRef.current = Date.now() + 700;
    handleMouseUp();
    engineRef.current.pinchStartDist = null;
  };

  return (
    <div className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-hidden touch-none">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
           
      <canvas 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full block"
      />
      
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] left-4 md:bottom-6 md:left-6 flex flex-col gap-2 pointer-events-auto z-30">
           <button
             onClick={onQuickAdd}
             className="md:hidden p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700"
             aria-label="快速新增"
           >
             <UserPlus size={20}/>
           </button>
           <button
             onClick={onOpenMobileSearch}
             className="md:hidden p-3 bg-white rounded-full shadow-lg hover:bg-gray-50"
             aria-label="搜尋"
           >
             <Search size={20}/>
           </button>
         <button onClick={() => engineRef.current.transform.scale *= 1.2} className="p-3 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"><ZoomIn size={20}/></button>
         <button onClick={() => engineRef.current.transform.scale *= 0.8} className="p-3 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"><ZoomOut size={20}/></button>
         <button onClick={() => {
             engineRef.current.transform.x = window.innerWidth / 2;
             engineRef.current.transform.y = Object.keys(members).length === 1 ? window.innerHeight / 2 : window.innerHeight / 4;
             engineRef.current.transform.scale = Object.keys(members).length === 1 ? 1 : 0.8;
           }} className="p-3 md:p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"><Maximize size={20}/></button>
      </div>
    </div>
  );
};

// ==========================================
// 5. 側邊欄 - 個人資料面板
// ==========================================
const ProfilePanel = ({ member, kinship, meId, onClose, onSetViewpoint, onAddRelative, onAddByText, onShowQR, onAddPost, onUpdateMember, onDeleteMember }) => {
  const [postText, setPostText] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(member.name);
  const [quickRelText, setQuickRelText] = useState('');

  useEffect(() => {
    setEditName(member.name);
    setIsEditingName(false);
  }, [member.id]);

  const handleSaveName = () => {
    if (editName.trim() && editName !== member.name) {
      onUpdateMember(member.id, { name: editName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <div className="flex flex-col h-full bg-stone-50 overflow-hidden">
      <div className="relative bg-emerald-600 text-white p-6 pb-8 rounded-b-[40px] shadow-lg shrink-0">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
          <X size={20} />
        </button>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50 backdrop-blur-sm shadow-inner">
            <UserCircle size={40} className="opacity-90" />
          </div>
          <div>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  autoFocus
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); }}
                  className="text-gray-900 px-2 py-1 rounded text-xl font-bold w-32 outline-none"
                />
                <button onClick={handleSaveName} className="bg-white/20 px-3 py-1 rounded text-sm hover:bg-white/40 font-bold transition">儲存</button>
              </div>
            ) : (
              <h2 className="text-3xl font-bold flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
                {member.name}
                <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/20 rounded">
                  <Edit2 size={16} />
                </button>
              </h2>
            )}
            <div className="flex items-center gap-2 mt-1 opacity-90">
              <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-medium tracking-widest">{kinship}</span>
              {member.gender === 'M' ? <span className="text-blue-200 font-bold">♂ 男</span> : <span className="text-pink-200 font-bold">♀ 女</span>}
            </div>
            <div className="mt-2">
              {meId === member.id ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-500/25 px-2 py-1 rounded-lg">目前視角</span>
              ) : (
                <button
                  onClick={() => onSetViewpoint(member.id)}
                  className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition"
                >
                  切換成此視角
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between bg-black/10 p-3 rounded-xl border border-white/10">
           <div className="flex items-center gap-2 text-sm">
              <QrCode size={16} />
              {member.claimed ? '已綁定數位身分' : '尚未綁定身分'}
           </div>
           {!member.claimed && (
             <button onClick={onShowQR} className="px-3 py-1 bg-white text-emerald-700 text-sm font-bold rounded-lg shadow hover:bg-gray-100 transition">
               掃碼綁定
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2"><UserPlus size={16}/> 新增親屬</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onAddRelative('parent')} className="py-2 border border-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium">父母</button>
            <button onClick={() => onAddRelative('spouse')} className="py-2 border border-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium">配偶</button>
            <button onClick={() => onAddRelative('child')} className="py-2 border border-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium">子女</button>
            <button onClick={() => onAddRelative('sibling')} className="py-2 border border-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-50 text-sm font-medium">兄弟姊妹</button>
          </div>
          <div className="mt-3">
            <label className="block text-xs text-gray-400 mb-1">或輸入關係描述快速建立</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例：姑姑的小孩、小姨子"
                value={quickRelText}
                onChange={e => setQuickRelText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && quickRelText.trim()) {
                    onAddByText(quickRelText.trim());
                    setQuickRelText('');
                  }
                }}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => { if (quickRelText.trim()) { onAddByText(quickRelText.trim()); setQuickRelText(''); } }}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shrink-0"
              >建立</button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                const ok = window.confirm(`確定要刪除「${member.name}」及其所有後代嗎？此操作無法復原。`);
                if (ok) onDeleteMember(member.id, 'down');
              }}
              className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-semibold"
            >
              刪除此人與後代 ↓
            </button>
            <button
              onClick={() => {
                const ok = window.confirm(`確定要刪除「${member.name}」及其所有祖先嗎？此操作無法復原。`);
                if (ok) onDeleteMember(member.id, 'up');
              }}
              className="flex-1 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-xs font-semibold"
            >
              刪除此人與祖先 ↑
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Info size={16}/> 個人事蹟</h3>
          <div className="mb-3">
            <label className="block text-xs font-bold text-gray-500 mb-1">生日</label>
            <input
              type="date"
              value={member.birthday || ''}
              onChange={(e) => onUpdateMember(member.id, { birthday: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {member.deathDate ? (
            <div className="mb-3">
              <label className="block text-xs font-bold text-gray-500 mb-1">忌日</label>
              <input
                type="date"
                value={member.deathDate || ''}
                onChange={(e) => onUpdateMember(member.id, { deathDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => onUpdateMember(member.id, { deathDate: '' })}
                className="mt-1 text-[11px] text-gray-400 hover:text-red-400 transition"
              >移除忌日</button>
            </div>
          ) : (
            <button
              onClick={() => onUpdateMember(member.id, { deathDate: ' ' })}
              className="mb-3 text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1"
            >
              <span className="text-base leading-none">＋</span> 新增忌日
            </button>
          )}
          <p className="text-gray-700 leading-relaxed text-sm">
            {member.bio || '尚未留下個人簡介。'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-[300px]">
          <div className="p-4 border-b border-gray-50 bg-gray-50/50 rounded-t-2xl">
             <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2"><Heart size={16} className="text-pink-500"/> 生活分享</h3>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {member.posts.length === 0 ? (
              <div className="text-center text-gray-400 py-6 text-sm">還沒有分享生活點滴喔！</div>
            ) : (
              member.posts.map(p => (
                <div key={p.id} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="text-xs text-gray-400 mb-1">{p.date}</div>
                  <div className="text-gray-700 text-sm">{p.text}</div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex gap-2">
             <input 
               type="text" 
               className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
               placeholder="分享今天發生的事..."
               value={postText}
               onChange={(e) => setPostText(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && postText.trim()) {
                   onAddPost(postText);
                   setPostText('');
                 }
               }}
             />
             <button 
               onClick={() => { if(postText.trim()){ onAddPost(postText); setPostText(''); } }}
               className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
             >
               <Edit3 size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StartModal = ({ onCreate, onLoadTemplate, hasSavedData, onLoadLastData, onClearSavedData }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-2xl font-black text-gray-800">歡迎使用 Family Tree</h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          請先選擇要從空白建立新族譜，或直接載入系統範本開始編輯。
        </p>

        <div className="mt-6 grid gap-3">
          <button
            onClick={onCreate}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
          >
            建立新族譜
          </button>
          {hasSavedData && (
            <>
              <button
                onClick={onLoadLastData}
                className="w-full py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold hover:bg-amber-100 transition"
              >
                載入上次資料
              </button>
              <button
                onClick={onClearSavedData}
                className="w-full py-3 rounded-xl bg-white border border-red-200 text-red-600 font-bold hover:bg-red-50 transition"
              >
                清除上次資料
              </button>
            </>
          )}
          <button
            onClick={onLoadTemplate}
            className="w-full py-3 rounded-xl bg-white border border-emerald-200 text-emerald-700 font-bold hover:bg-emerald-50 transition"
          >
            載入範本
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. 雙模式新增成員 Modal
// ==========================================
const QAModal = ({ context, members, onClose, onSubmit }) => {
  const [tab, setTab] = useState(context?.preferredTab || 'text'); 
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setTab(context?.preferredTab || 'text');
  }, [context]);

  const [formData, setFormData] = useState({
    name: '', gender: 'M', birthday: '', deathDate: '',
    relativeId: context?.relativeId || Object.keys(members)[0],
    relationType: context?.relationType || 'child'
  });

  const [textData, setTextData] = useState({
    name: '', gender: 'M', birthday: '', deathDate: '',
    relativeId: context?.relativeId || Object.keys(members)[0],
    relationText: context?.prefillRelText || ''
  });

  const [showDeathDateForm, setShowDeathDateForm] = useState(false);
  const [showDeathDateText, setShowDeathDateText] = useState(false);

    const linkNodes = (draft, id1, id2, relType) => {
      const addUnique = (arr, value) => {
      if (!arr.includes(value)) arr.push(value);
      };

      const linkAsSpouse = (aId, bId) => {
      if (!draft[aId] || !draft[bId] || aId === bId) return;
      addUnique(draft[aId].spouses, bId);
      addUnique(draft[bId].spouses, aId);
      };

      let n1 = draft[id1]; let n2 = draft[id2];
      if (relType === 'parent') {
        addUnique(n2.children, id1);
        addUnique(n1.parents, id2);

        // Auto-link co-parents as spouses.
        n1.parents
          .filter(pid => pid !== id2 && draft[pid])
          .forEach(pid => linkAsSpouse(id2, pid));

        // New parent also becomes parent of existing siblings (children who share the same other parent).
        n1.parents.filter(pid => pid !== id2 && draft[pid]).forEach(coParentId => {
          (draft[coParentId].children || []).forEach(sibId => {
            if (sibId !== id1 && draft[sibId]) {
              addUnique(draft[sibId].parents, id2);
              addUnique(n2.children, sibId);
            }
          });
        });
      } else if (relType === 'child') {
        addUnique(n2.parents, id1);
        addUnique(n1.children, id2);
        // All spouses of n1 also become parents of the new child.
        (n1.spouses || []).forEach(spId => {
          if (draft[spId]) {
            addUnique(n2.parents, spId);
            addUnique(draft[spId].children, id2);
          }
        });
      } else if (relType === 'spouse') {
        linkAsSpouse(id1, id2);
        // 新配偶自動成為現有子女的父/母
        (n1.children || []).forEach(cid => {
          if (draft[cid]) {
            addUnique(draft[cid].parents, id2);
            addUnique(n2.children, cid);
          }
        });
        // 反向：n2 的現有子女也關聯到 n1
        (n2.children || []).forEach(cid => {
          if (draft[cid] && !n1.children.includes(cid)) {
            addUnique(draft[cid].parents, id1);
            addUnique(n1.children, cid);
          }
        });
      } else if (relType === 'sibling') {
        if (n1.parents.length === 0) {
          let dummyF = generateId();
          draft[dummyF] = { id: dummyF, name: '未知(父親)', gender: 'M', birthday: '', deathDate: '', parents: [], children: [id1, id2], spouses: [], bio: '', posts: [], claimed: false };
          addUnique(n1.parents, dummyF);
          addUnique(n2.parents, dummyF);
        } else {
          n1.parents.forEach(pid => {
            if (draft[pid]) {
              addUnique(draft[pid].children, id2);
              addUnique(n2.parents, pid);
            }
          });
        }
      }
    };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let draft = JSON.parse(JSON.stringify(members));
    let newId = generateId();
    draft[newId] = { id: newId, name: formData.name, gender: formData.gender, birthday: formData.birthday || '', deathDate: formData.deathDate || '', parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
    linkNodes(draft, formData.relativeId, newId, formData.relationType);
    onSubmit(draft, newId);
  };

  const findExistingRelation = (draft, id, relType, gender) => {
      let n = draft[id];
      if (relType === 'parent') return n.parents.find(pid => draft[pid].gender === gender);
      if (relType === 'child') return n.children.find(cid => draft[cid].gender === gender);
      if (relType === 'spouse') return n.spouses.find(sid => draft[sid].gender === gender);
      if (relType === 'sibling') {
          for (let pid of n.parents) {
              let sib = draft[pid].children.find(cid => cid !== id && draft[cid].gender === gender);
              if (sib) return sib;
          }
      }
      return null;
  };

  const handleTextSubmit = (e) => {
      e.preventDefault();
      setErrorMsg('');
      let draft = JSON.parse(JSON.stringify(members));
      let currentId = textData.relativeId;
      const steps = textData.relationText.split(/的|之/).filter(Boolean);
      if (steps.length === 0) { setErrorMsg('請輸入關係描述，例如「媽媽的哥哥」。'); return; }

      try {
          for (let i = 0; i < steps.length; i++) {
              let step = steps[i].trim();
              let isLast = i === steps.length - 1;
              let relType = ''; let gender = 'M';
              
              if (['爸爸', '父親', '爸', '公公', '岳父'].includes(step)) { relType = 'parent'; gender = 'M'; }
              else if (['媽媽', '母親', '媽', '婆婆', '岳母'].includes(step)) { relType = 'parent'; gender = 'F'; }
              else if (['兒子', '子', '男'].includes(step)) { relType = 'child'; gender = 'M'; }
              else if (['女兒', '女'].includes(step)) { relType = 'child'; gender = 'F'; }
              else if (['小孩', '孩子'].includes(step)) { relType = 'child'; gender = textData.gender; }
              else if (['老公', '丈夫', '夫', '配偶'].includes(step)) { relType = 'spouse'; gender = 'M'; }
              else if (['老婆', '妻子', '妻'].includes(step)) { relType = 'spouse'; gender = 'F'; }
              else if (['哥哥', '弟弟', '兄', '弟', '兄弟'].includes(step)) { relType = 'sibling'; gender = 'M'; }
              else if (['姊姊', '妹妹', '姊', '姐', '妹', '姊妹', '姐妹'].includes(step)) { relType = 'sibling'; gender = 'F'; }
              // 複合親屬：自動展開為多步驟
              else if (['大嫂', '嫂嫂', '嫂'].includes(step)) { steps.splice(i, 1, '哥哥', '老婆'); i--; continue; }
              else if (['弟媳', '弟妹'].includes(step)) { steps.splice(i, 1, '弟弟', '老婆'); i--; continue; }
              else if (['姊夫', '姐夫'].includes(step)) { steps.splice(i, 1, '姊姊', '老公'); i--; continue; }
              else if (['妹夫'].includes(step)) { steps.splice(i, 1, '妹妹', '老公'); i--; continue; }
              else if (['媳婦'].includes(step)) { steps.splice(i, 1, '兒子', '老婆'); i--; continue; }
              else if (['女婿'].includes(step)) { steps.splice(i, 1, '女兒', '老公'); i--; continue; }
              else if (['大舅子', '小舅子', '舅子', '內兄', '內弟'].includes(step)) { steps.splice(i, 1, '老婆', '兄弟'); i--; continue; }
              else if (['大姨子', '小姨子', '姨子'].includes(step)) { steps.splice(i, 1, '老婆', '姊妹'); i--; continue; }
              else if (['大伯', '小叔', '大伯子', '小叔子'].includes(step)) { steps.splice(i, 1, '老公', '兄弟'); i--; continue; }
              else if (['大姑', '小姑', '大姑子', '小姑子'].includes(step)) { steps.splice(i, 1, '老公', '姊妹'); i--; continue; }
              else if (['連襟', '襟兄', '襟弟'].includes(step)) { steps.splice(i, 1, '老婆', '姊妹', '老公'); i--; continue; }
              else if (['妯娌'].includes(step)) { steps.splice(i, 1, '老公', '兄弟', '老婆'); i--; continue; }
              else if (['叔叔', '伯伯', '叔', '伯'].includes(step)) { steps.splice(i, 1, '爸爸', '兄弟'); i--; continue; }
              else if (['嬸嬸', '伯母'].includes(step)) { steps.splice(i, 1, '爸爸', '兄弟', '老婆'); i--; continue; }
              else if (['姑姑', '姑', '姑媽'].includes(step)) { steps.splice(i, 1, '爸爸', '姊妹'); i--; continue; }
              else if (['姑丈', '姑父'].includes(step)) { steps.splice(i, 1, '爸爸', '姊妹', '老公'); i--; continue; }
              else if (['舅舅', '舅'].includes(step)) { steps.splice(i, 1, '媽媽', '兄弟'); i--; continue; }
              else if (['舅媽', '舅母'].includes(step)) { steps.splice(i, 1, '媽媽', '兄弟', '老婆'); i--; continue; }
              else if (['阿姨', '姨', '姨媽'].includes(step)) { steps.splice(i, 1, '媽媽', '姊妹'); i--; continue; }
              else if (['姨丈', '姨父'].includes(step)) { steps.splice(i, 1, '媽媽', '姊妹', '老公'); i--; continue; }
              else if (['爺爺', '祖父', '阿公'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸'); i--; continue; }
              else if (['奶奶', '祖母', '阿嬤', '阿罵', '阿婆'].includes(step)) { steps.splice(i, 1, '爸爸', '媽媽'); i--; continue; }
              else if (['外公', '外祖父'].includes(step)) { steps.splice(i, 1, '媽媽', '爸爸'); i--; continue; }
              else if (['外婆', '外祖母'].includes(step)) { steps.splice(i, 1, '媽媽', '媽媽'); i--; continue; }
              else if (['叔公', '叔祖父'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '兄弟'); i--; continue; }
              else if (['伯公', '伯祖父'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '兄弟'); i--; continue; }
              else if (['嬸婆'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '兄弟', '老婆'); i--; continue; }
              else if (['姑婆'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '姊妹'); i--; continue; }
              else if (['阿祖', '曾祖父'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '爸爸'); i--; continue; }
              else if (['曾祖母'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '媽媽'); i--; continue; }
              else if (['阿泰', '高祖父'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '爸爸', '爸爸'); i--; continue; }
              else if (['高祖母'].includes(step)) { steps.splice(i, 1, '爸爸', '爸爸', '爸爸', '媽媽'); i--; continue; }
              else if (['孫子'].includes(step)) { steps.splice(i, 1, '兒子', '兒子'); i--; continue; }
              else if (['孫女'].includes(step)) { steps.splice(i, 1, '兒子', '女兒'); i--; continue; }
              else if (['外孫'].includes(step)) { steps.splice(i, 1, '女兒', '兒子'); i--; continue; }
              else if (['外孫女'].includes(step)) { steps.splice(i, 1, '女兒', '女兒'); i--; continue; }
              else if (['姪子', '侄子'].includes(step)) { steps.splice(i, 1, '兄弟', '兒子'); i--; continue; }
              else if (['姪女', '侄女'].includes(step)) { steps.splice(i, 1, '兄弟', '女兒'); i--; continue; }
              else if (['外甥'].includes(step)) { steps.splice(i, 1, '姊妹', '兒子'); i--; continue; }
              else if (['外甥女'].includes(step)) { steps.splice(i, 1, '姊妹', '女兒'); i--; continue; }
              else if (['堂哥', '堂弟', '堂兄'].includes(step)) { steps.splice(i, 1, '爸爸', '兄弟', '兒子'); i--; continue; }
              else if (['堂姊', '堂妹', '堂姐'].includes(step)) { steps.splice(i, 1, '爸爸', '兄弟', '女兒'); i--; continue; }
              else if (['表哥', '表弟', '表兄'].includes(step)) { steps.splice(i, 1, '媽媽', '兄弟', '兒子'); i--; continue; }
              else if (['表姊', '表妹', '表姐'].includes(step)) { steps.splice(i, 1, '媽媽', '兄弟', '女兒'); i--; continue; }
              else { setErrorMsg(`無法識別關鍵字: "${step}"`); return; }

              if (isLast) {
                  let newId = generateId();
                  draft[newId] = { id: newId, name: textData.name || `新成員`, gender: textData.gender, birthday: textData.birthday || '', deathDate: textData.deathDate || '', parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
                  linkNodes(draft, currentId, newId, relType);
                  currentId = newId;
              } else {
                  let nextId = findExistingRelation(draft, currentId, relType, gender);
                  if (!nextId) {
                      nextId = generateId();
                      draft[nextId] = { id: nextId, name: `未知(${step})`, gender: gender, birthday: '', deathDate: '', parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
                      linkNodes(draft, currentId, nextId, relType);
                  }
                  currentId = nextId;
              }
          }
          onSubmit(draft, currentId);
      } catch (err) { setErrorMsg("解析錯誤。"); }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        <div className="bg-emerald-600 p-5 md:p-6 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2"><UserPlus size={24}/> 新增家族成員</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-5 md:p-8 overflow-y-auto">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
             <button onClick={() => setTab('text')} className={`flex-1 py-2 font-bold text-sm rounded-lg flex justify-center items-center gap-2 transition ${tab === 'text' ? 'bg-white shadow text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}><Type size={16}/> 文字連續描述</button>
             <button onClick={() => setTab('form')} className={`flex-1 py-2 font-bold text-sm rounded-lg flex justify-center items-center gap-2 transition ${tab === 'form' ? 'bg-white shadow text-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}><List size={16}/> 基本表單選擇</button>
          </div>

          {errorMsg && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">{errorMsg}</div>}

          {tab === 'text' ? (
              <form onSubmit={handleTextSubmit} className="space-y-5">
                  <div className="space-y-2">
                     <label className="block text-sm font-bold text-gray-700">1. 從誰開始找？(基準點)</label>
                     <select value={textData.relativeId} onChange={e => setTextData({...textData, relativeId: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 font-medium">
                        {Object.values(members).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="block text-sm font-bold text-gray-700">2. 關係描述 (用「的」連接)</label>
                     <input type="text" required placeholder="例如：媽媽的爸爸的女兒的兒子" value={textData.relationText} onChange={e => setTextData({...textData, relationText: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                     <label className="block text-sm font-bold text-gray-700">3. 新成員姓名與性別</label>
                     <input type="text" required placeholder="輸入最終這位新成員的姓名" value={textData.name} onChange={e => setTextData({...textData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none mb-2" />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">生日</label>
                        <input type="date" value={textData.birthday} onChange={e => setTextData({...textData, birthday: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      {showDeathDateText ? (
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">忌日</label>
                          <input type="date" value={textData.deathDate} onChange={e => setTextData({...textData, deathDate: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                      ) : (
                        <button type="button" onClick={() => setShowDeathDateText(true)} className="self-end mb-1 text-xs text-gray-400 hover:text-gray-600 transition whitespace-nowrap">＋ 忌日</button>
                      )}
                    </div>
                     <div className="flex gap-4">
                       <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${textData.gender === 'M' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="M" className="hidden" onChange={() => setTextData({...textData, gender: 'M'})} /> ♂ 男性</label>
                       <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${textData.gender === 'F' ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="F" className="hidden" onChange={() => setTextData({...textData, gender: 'F'})} /> ♀ 女性</label>
                     </div>
                  </div>
                  <button type="submit" className="w-full mt-4 bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition">解析並建立節點</button>
              </form>
          ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="space-y-2">
                     <label className="block text-sm font-bold text-gray-700">1. 他/她是誰的誰？</label>
                     <div className="flex gap-2 items-center">
                        <select value={formData.relativeId} onChange={e => setFormData({...formData, relativeId: e.target.value})} className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 font-medium">
                          {Object.values(members).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <span className="text-gray-500 font-bold">的</span>
                        <select value={formData.relationType} onChange={e => setFormData({...formData, relationType: e.target.value})} className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-700 bg-emerald-50">
                          <option value="parent">父母</option><option value="spouse">配偶</option><option value="child">子女</option><option value="sibling">兄弟姊妹</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                     <label className="block text-sm font-bold text-gray-700">2. 基本資料</label>
                     <input autoFocus type="text" required placeholder="輸入姓名" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 text-lg focus:ring-2 focus:ring-emerald-500 outline-none mb-2" />
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">生日</label>
                        <input type="date" value={formData.birthday} onChange={e => setFormData({...formData, birthday: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      {showDeathDateForm ? (
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">忌日</label>
                          <input type="date" value={formData.deathDate} onChange={e => setFormData({...formData, deathDate: e.target.value})} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                        </div>
                      ) : (
                        <button type="button" onClick={() => setShowDeathDateForm(true)} className="self-end mb-1 text-xs text-gray-400 hover:text-gray-600 transition whitespace-nowrap">＋ 忌日</button>
                      )}
                    </div>
                     <div className="flex gap-4">
                       <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${formData.gender === 'M' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="M" className="hidden" onChange={() => setFormData({...formData, gender: 'M'})} /> ♂ 男性</label>
                       <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${formData.gender === 'F' ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="F" className="hidden" onChange={() => setFormData({...formData, gender: 'F'})} /> ♀ 女性</label>
                     </div>
                  </div>
                  <button type="submit" className="w-full mt-4 bg-emerald-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition">確認建立節點</button>
              </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. QR Code 綁定 Modal
// ==========================================
const QRCodeModal = ({ member, onClose, onClaim }) => {
  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto text-center relative p-6 md:p-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={24}/></button>
        <h2 className="text-2xl font-black text-gray-800 mb-2 mt-4 md:mt-0">身分認證綁定</h2>
        <p className="text-gray-500 text-sm mb-6">請使用手機掃描下方 QR Code，<br/>接管 <strong className="text-emerald-600">{member.name}</strong> 的族譜數位分身。</p>
        <div className="inline-block p-4 bg-white border-4 border-gray-100 rounded-2xl shadow-inner mb-6 relative">
           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=FamilyTree_Bind_${member.id}&margin=10`} alt="QR Code" className="w-48 h-48 rounded-lg" />
           <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400/50 shadow-[0_0_10px_2px_#34d399] animate-[scan_2s_ease-in-out_infinite]" />
        </div>
        <button onClick={onClaim} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl shadow hover:bg-gray-800 transition flex justify-center items-center gap-2">
           <Search size={18}/> 模擬手機已掃描完成
        </button>
      </div>
      <style>{`@keyframes scan { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(220px); opacity: 0; } }`}</style>
    </div>
  );
};

// ==========================================
// 8. 重置與建立自己 Modal (加入族譜名稱)
// ==========================================
const ResetModal = ({ onClose, onReset }) => {
  const [treeName, setTreeName] = useState('我的家族族譜');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('M');
  const [birthday, setBirthday] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && treeName.trim()) {
      onReset(name.trim(), gender, treeName.trim(), birthday);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden transform transition-all">
        <div className="bg-red-500 p-5 md:p-6 text-white flex justify-between items-center shrink-0">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2"><RefreshCcw size={24}/> 清空並重新開始</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-5 md:p-8 overflow-y-auto">
          <p className="text-gray-600 mb-6 font-medium text-sm md:text-base">
            這將會<strong className="text-red-500">清空所有現有資料</strong>。請輸入基本資料，作為新族譜的起點：
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-700">新族譜名稱</label>
               <input autoFocus type="text" required placeholder="例如：李家大族譜" value={treeName} onChange={e => setTreeName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
               <label className="block text-sm font-bold text-gray-700">您的姓名</label>
               <input type="text" required placeholder="請輸入您的姓名" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 text-lg focus:ring-2 focus:ring-red-500 outline-none" />
            </div>
            
            <div className="space-y-2">
               <label className="block text-sm font-bold text-gray-700">您的性別</label>
               <div className="flex gap-4">
                 <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${gender === 'M' ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="M" className="hidden" onChange={() => setGender('M')} /> ♂ 男性</label>
                 <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${gender === 'F' ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold' : 'border-gray-200 text-gray-500'}`}><input type="radio" value="F" className="hidden" onChange={() => setGender('F')} /> ♀ 女性</label>
               </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">您的生日 (選填)</label>
              <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-red-500 outline-none" />
            </div>

            <button type="submit" className="w-full mt-4 bg-red-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-red-600 transition">確認清空並建立</button>
          </form>
        </div>
      </div>
    </div>
  );
};