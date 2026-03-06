import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  UserPlus, Info, Share2, QrCode, X, Search, 
  ZoomIn, ZoomOut, Maximize, UserCircle, ChevronRight, 
  ChevronDown, MessageSquare, MapPin, Heart, Edit3, Type, List,
  Download, Upload,
  RefreshCcw, Edit2
} from 'lucide-react';

// ==========================================
// 1. 初始模擬資料 (Initial Data)
// ==========================================
const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_MEMBERS = {
  'g1_m1': { id: 'g1_m1', name: '王天明', gender: 'M', parents: [], children: ['m1', 'g2_m2'], spouses: ['g1_f1'], bio: '家族開創者，當年白手起家。', posts: [], claimed: false },
  'g1_f1': { id: 'g1_f1', name: '李玉蘭', gender: 'F', parents: [], children: ['m1', 'g2_m2'], spouses: ['g1_m1'], bio: '溫柔堅毅，持家有道。', posts: [], claimed: false },
  'm1': { id: 'm1', name: '王大川', gender: 'M', parents: ['g1_m1', 'g1_f1'], children: ['m3', 'm4'], spouses: ['m2'], bio: '家族大家長，熱愛書法與園藝。', posts: [{ id: 'p1', date: '2025-10-10', text: '今天在後院種下了一棵櫻花樹，希望子孫滿堂。' }], claimed: true },
  'm2': { id: 'm2', name: '林美麗', gender: 'F', parents: [], children: ['m3', 'm4'], spouses: ['m1'], bio: '慈祥的祖母，拿手好菜是紅燒肉。', posts: [], claimed: false },
  'g2_m2': { id: 'g2_m2', name: '王二川', gender: 'M', parents: ['g1_m1', 'g1_f1'], children: ['g3_m3'], spouses: ['g2_f2'], bio: '大川的弟弟，長居南部。', posts: [], claimed: false },
  'g2_f2': { id: 'g2_f2', name: '周惠', gender: 'F', parents: [], children: ['g3_m3'], spouses: ['g2_m2'], bio: '賢內助，廚藝極佳。', posts: [], claimed: false },
  'm3': { id: 'm3', name: '王建國', gender: 'M', parents: ['m1', 'm2'], children: ['m5', 'g4_f1'], spouses: ['m6'], bio: '長子，目前在科技業擔任工程師。', posts: [], claimed: true },
  'm6': { id: 'm6', name: '陳淑芬', gender: 'F', parents: [], children: ['m5', 'g4_f1'], spouses: ['m3'], bio: '溫柔體貼，喜歡烹飪。', posts: [], claimed: false },
  'm4': { id: 'm4', name: '王心凌', gender: 'F', parents: ['m1', 'm2'], children: ['g4_m1'], spouses: ['g3_m1'], bio: '小女兒，自由撰稿人。', posts: [{ id: 'p2', date: '2026-01-05', text: '剛完成了一本新書的初稿！' }], claimed: false },
  'g3_m1': { id: 'g3_m1', name: '李大為', gender: 'M', parents: [], children: ['g4_m1'], spouses: ['m4'], bio: '攝影師，喜歡四處旅遊。', posts: [], claimed: false },
  'g3_m3': { id: 'g3_m3', name: '王志強', gender: 'M', parents: ['g2_m2', 'g2_f2'], children: ['g4_m2'], spouses: ['g3_f2'], bio: '建國的堂弟，從事貿易。', posts: [], claimed: false },
  'g3_f2': { id: 'g3_f2', name: '吳梅', gender: 'F', parents: [], children: ['g4_m2'], spouses: ['g3_m3'], bio: '高中教師。', posts: [], claimed: false },
  'm5': { id: 'm5', name: '王小明', gender: 'M', parents: ['m3', 'm6'], children: ['g5_m1'], spouses: ['g4_f2'], bio: '活潑好動，目前是公司主管。', posts: [], claimed: false },
  'g4_f2': { id: 'g4_f2', name: '張欣', gender: 'F', parents: [], children: ['g5_m1'], spouses: ['m5'], bio: '銀行職員，心思細膩。', posts: [], claimed: false },
  'g4_f1': { id: 'g4_f1', name: '王曉華', gender: 'F', parents: ['m3', 'm6'], children: ['g5_f1'], spouses: ['g4_m3'], bio: '設計師，充滿創意。', posts: [], claimed: false },
  'g4_m3': { id: 'g4_m3', name: '林俊傑', gender: 'M', parents: [], children: ['g5_f1'], spouses: ['g4_f1'], bio: '建築師。', posts: [], claimed: false },
  'g4_m1': { id: 'g4_m1', name: '李子豪', gender: 'M', parents: ['m4', 'g3_m1'], children: [], spouses: [], bio: '大學生，熱愛籃球。', posts: [], claimed: false },
  'g4_m2': { id: 'g4_m2', name: '王宇', gender: 'M', parents: ['g3_m3', 'g3_f2'], children: [], spouses: [], bio: '留學海外中。', posts: [], claimed: false },
  'g5_m1': { id: 'g5_m1', name: '王星', gender: 'M', parents: ['m5', 'g4_f2'], children: [], spouses: [], bio: '剛滿三歲，全家的開心果。', posts: [], claimed: false },
  'g5_f1': { id: 'g5_f1', name: '林芸', gender: 'F', parents: ['g4_f1', 'g4_m3'], children: [], spouses: [], bio: '小學一年級。', posts: [], claimed: false },
};

// ==========================================
// 2. 稱謂計算系統 (Kinship Calculator)
// ==========================================
const translatePath = (path, targetGender) => {
  const p = path.join(',');
  const map = {
    'F': '父親', 'M': '母親', 'S': '兒子', 'D': '女兒', 'H': '丈夫', 'W': '妻子',
    'F,F': '祖父(爺爺)', 'F,M': '祖母(奶奶)', 'M,F': '外祖父(外公)', 'M,M': '外祖母(外婆)',
    'F,F,F': '曾祖父', 'F,F,M': '曾祖母', 'M,M,M': '外曾祖母', 'M,M,F': '外曾祖父',
    'F,M,F': '外曾祖父', 'F,M,M': '外曾祖母', 
    'F,S': '兄弟', 'M,S': '兄弟', 'F,D': '姊妹', 'M,D': '姊妹',
    'F,F,S': '伯伯/叔叔', 'F,M,S': '伯伯/叔叔', 'F,F,D': '姑姑', 'F,M,D': '姑姑',
    'M,F,S': '舅舅', 'M,M,S': '舅舅', 'M,F,D': '阿姨', 'M,M,D': '阿姨',
    'F,S,S': '姪子', 'M,S,S': '姪子', 'F,S,D': '姪女', 'M,S,D': '姪女',
    'F,D,S': '外甥', 'M,D,S': '外甥', 'F,D,D': '外甥女', 'M,D,D': '外甥女',
    'S,S': '孫子', 'S,D': '孫女', 'D,S': '外孫', 'D,D': '外孫女',
    'S,S,S': '曾孫', 'S,S,D': '曾孫女', 'D,S,S': '外曾孫', 'D,D,D': '外曾孫女',
    'H,F': '公公', 'H,M': '婆婆', 'W,F': '岳父', 'W,M': '岳母',
    'H,S': '繼子', 'W,S': '繼子', 'H,D': '繼女', 'W,D': '繼女',
  };
  if (map[p]) return map[p];
  if (p.includes('F,F,') || p.includes('F,M,') || p.includes('M,F,') || p.includes('M,M,')) {
     if (p.endsWith('S')) return '堂/表兄弟';
     if (p.endsWith('D')) return '堂/表姊妹';
  }
  return '親戚';
};

const calculateKinship = (fromId, toId, members) => {
  if (fromId === toId) return '自己 (Me)';
  let queue = [{ id: fromId, path: [] }];
  let visited = new Set([fromId]);
  while (queue.length > 0) {
    let { id, path } = queue.shift();
    if (path.length > 4) continue;
    let current = members[id];
    if (!current) continue;
    if (id === toId) return translatePath(path, members[toId].gender);

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
  const [members, setMembers] = useState(INITIAL_MEMBERS);
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
  
  const [isQAOpen, setIsQAOpen] = useState(false);
  const [qaContext, setQaContext] = useState(null); 
  const [isQROpen, setIsQROpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false); 
  const fileInputRef = useRef(null);

  const selectedMember = selectedId ? members[selectedId] : null;
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return Object.values(members)
      .filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q))
      .slice(0, 8);
  }, [searchQuery, members]);

  useEffect(() => {
    if (!searchHighlightId) return;
    const timer = setTimeout(() => setSearchHighlightId(null), 4000);
    return () => clearTimeout(timer);
  }, [searchHighlightId]);

  const handleUpdateMembers = (newMembersMap, targetId) => {
    setMembers(newMembersMap);
    setSelectedId(targetId);
    setIsQAOpen(false);
  };

  const handleUpdateMember = (id, updates) => {
    setMembers(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleDeleteMember = (id) => {
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
      current.children.forEach(cid => {
        if (!toDelete.has(cid)) {
          toDelete.add(cid);
          queue.push(cid);
        }
      });
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
    setMembers(draft);
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
      const handleCanvasSelect = (id) => {
        setSuppressProfilePanel(false);
        setSelectedId(id);
      };

    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
  };

  // 匯出 JSON (包含族譜名稱與成員資料)
  const handleExportJSON = () => {
    const exportData = { treeName, members };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${treeName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // 載入 JSON (支援新版含名稱格式，與舊版純成員格式)
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.treeName && json.members) {
           setTreeName(json.treeName);
           setMembers(json.members);
        } else {
           setTreeName('載入的族譜');
           setMembers(json);
        }
        setMeId(Object.keys(json.members || json)[0]); // 重設視角
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
                <h1 className="text-base md:text-xl font-bold text-gray-800 tracking-wide truncate">
                  {treeName}
                </h1>
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
              <label className="hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition p-1 bg-gray-50/50 rounded">
                <Upload size={14}/> <span className="hidden sm:inline">載入</span>
                <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} ref={fileInputRef}/>
              </label>
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
                        <span className="text-sm font-medium text-gray-700">{m.name}</span>
                        <span className="text-xs text-gray-400">{m.id}</span>
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

      {isResetOpen && (
        <ResetModal 
          onClose={() => setIsResetOpen(false)}
          onReset={(newName, newGender, newTreeName) => {
            const newId = generateId();
            const newMember = {
              id: newId, name: newName, gender: newGender,
              parents: [], children: [], spouses: [], bio: '族譜建立者', posts: [], claimed: true
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
            setMembers(INITIAL_MEMBERS);
            setMeId('m3');
            setSelectedId(null);
            setIsStartOpen(false);
          }}
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
                      <span className="text-sm font-medium text-gray-700">{m.name}</span>
                      <span className="text-xs text-gray-400">{m.id}</span>
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
const CanvasTree = ({ members, selectedId, onSelect, meId, focusId, focusKey, searchHighlightId, onQuickAdd, onOpenMobileSearch }) => {
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
    const colSpacing = 170;
    const spouseGap = 130;

    const genMap = new Map();
    nodes.forEach(n => {
      n.isHidden = hiddenNodes.has(n.id);
      if (!n.isHidden) {
        if (!genMap.has(n.gen)) genMap.set(n.gen, []);
        genMap.get(n.gen).push(n);
      }
    });

    const sortedGens = [...genMap.keys()].sort((a, b) => a - b);

    sortedGens.forEach(gen => {
      const row = genMap.get(gen);
      row.sort((a, b) => {
        const aFamily = a.data.parents.length ? [...a.data.parents].sort().join(',') : a.id;
        const bFamily = b.data.parents.length ? [...b.data.parents].sort().join(',') : b.id;
        if (aFamily !== bFamily) return aFamily.localeCompare(bFamily);
        const aSpouseKey = a.data.spouses.slice().sort().join(',');
        const bSpouseKey = b.data.spouses.slice().sort().join(',');
        if (aSpouseKey !== bSpouseKey) return aSpouseKey.localeCompare(bSpouseKey);
        return a.id.localeCompare(b.id);
      });

      let cursor = -((row.length - 1) * colSpacing) / 2;
      row.forEach(n => {
        if (typeof n.targetX !== 'number') n.targetX = n.x;
        n.targetX = cursor;
        n.targetY = n.gen * rowSpacing;
        cursor += colSpacing;
      });
    });

    // Keep spouse nodes adjacent to reduce long crossing links.
    links.forEach(link => {
      if (link.type !== 'spouse') return;
      const a = link.source;
      const b = link.target;
      if (a.isHidden || b.isHidden) return;
      const centerX = (a.targetX + b.targetX) / 2;
      a.targetX = centerX - spouseGap / 2;
      b.targetX = centerX + spouseGap / 2;
    });

    // Anchor children near their parent group center.
    families.forEach(fam => {
      const parents = fam.parentIds.map(id => nodes.find(n => n.id === id)).filter(Boolean).filter(n => !n.isHidden);
      const children = fam.childIds.map(id => nodes.find(n => n.id === id)).filter(Boolean).filter(n => !n.isHidden);
      if (parents.length === 0 || children.length === 0) return;

      const parentCenterX = parents.reduce((sum, p) => sum + p.targetX, 0) / parents.length;
      const childSpacing = 145;
      const totalWidth = (children.length - 1) * childSpacing;
      const left = parentCenterX - totalWidth / 2;

      children
        .slice()
        .sort((a, b) => a.targetX - b.targetX)
        .forEach((child, index) => {
          child.targetX = left + index * childSpacing;
        });
    });

    // Final overlap resolver per generation.
    sortedGens.forEach(gen => {
      const row = (genMap.get(gen) || []).slice().sort((a, b) => a.targetX - b.targetX);
      for (let i = 1; i < row.length; i++) {
        const prev = row[i - 1];
        const curr = row[i];
        const related = prev.data.spouses.includes(curr.id) || curr.data.spouses.includes(prev.id);
        const minGap = related ? 125 : 150;
        const gap = curr.targetX - prev.targetX;
        if (gap < minGap) {
          curr.targetX = prev.targetX + minGap;
        }
      }

      if (row.length > 0) {
        const centerShift = (row[0].targetX + row[row.length - 1].targetX) / 2;
        row.forEach(n => {
          n.targetX -= centerShift;
        });
      }
    });

    // Hidden nodes collapse toward nearest parent to keep transitions smooth.
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

    const memberIds = Object.keys(members);
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
        let m = members[curr];
        
        m.children.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen + 1; queue.push(id); } });
        m.spouses.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen; queue.push(id); } });
        m.parents.forEach(id => { if (!visited.has(id)) { visited.add(id); generations[id] = curGen - 1; queue.push(id); } });
      }
    }

    Object.values(members).forEach(m => {
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

    Object.values(members).forEach(m => {
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
  }, [members, meId]);

  useEffect(() => {
    if (!focusId) return;
    const engine = engineRef.current;
    // Ensure searched member is visible even if it is under a collapsed branch.
    engine.collapsedNodes = new Set();
    const node = engine.nodes.find(n => n.id === focusId);
    const canvas = canvasRef.current;
    if (!node || !canvas) return;

    const targetScale = Math.max(0.75, engine.transform.scale);
    const rect = canvas.getBoundingClientRect();
    engine.transform.scale = targetScale;
    engine.transform.x = rect.width / 2 - node.x * targetScale;
    engine.transform.y = rect.height / 2 - node.y * targetScale;
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
      });

      // Visible node collision pass.
      const visibleNodes = nodes.filter(n => !n.isHidden);
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < visibleNodes.length; i++) {
          for (let j = i + 1; j < visibleNodes.length; j++) {
            const a = visibleNodes[i];
            const b = visibleNodes[j];
            let dx = b.x - a.x;
            let dy = b.y - a.y;
            if (dx === 0 && dy === 0) {
              dx = 1;
              dy = 0;
            }
            const dist = Math.hypot(dx, dy);
            const isSpouse = a.data.spouses.includes(b.id);
            const isSibling = a.data.parents.some(pid => b.data.parents.includes(pid));
            const isParentChild = a.data.parents.includes(b.id) || b.data.parents.includes(a.id);
            const sameGenUnrelated = a.gen === b.gen && !isSpouse && !isSibling && !isParentChild;
            const minDist = isSpouse ? 118 : (sameGenUnrelated ? 168 : 136);

            if (dist < minDist) {
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              a.x -= nx * overlap * 0.5;
              a.y -= ny * overlap * 0.3;
              b.x += nx * overlap * 0.5;
              b.y += ny * overlap * 0.3;
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
    e.preventDefault();

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
const ProfilePanel = ({ member, kinship, meId, onClose, onSetViewpoint, onAddRelative, onShowQR, onAddPost, onUpdateMember, onDeleteMember }) => {
  const [postText, setPostText] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(member.name);

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
          <button
            onClick={() => {
              const ok = window.confirm(`確定要刪除「${member.name}」及其所有後代嗎？此操作無法復原。`);
              if (ok) onDeleteMember(member.id);
            }}
            className="w-full mt-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-semibold"
          >
            刪除此人物與後代
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Info size={16}/> 個人事蹟</h3>
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

const StartModal = ({ onCreate, onLoadTemplate }) => {
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
    name: '', gender: 'M',
    relativeId: context?.relativeId || Object.keys(members)[0],
    relationType: context?.relationType || 'child'
  });

  const [textData, setTextData] = useState({
    name: '', gender: 'M',
    relativeId: context?.relativeId || Object.keys(members)[0],
    relationText: ''
  });

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

        // If the child already has another parent, auto-link co-parents as spouses.
        n1.parents
        .filter(pid => pid !== id2 && draft[pid])
        .forEach(pid => linkAsSpouse(id2, pid));
      } else if (relType === 'child') {
        addUnique(n2.parents, id1);
        addUnique(n1.children, id2);
        if (n1.spouses.length > 0) {
          let spId = n1.spouses[0];
          addUnique(n2.parents, spId);
          addUnique(draft[spId].children, id2);
          linkAsSpouse(id1, spId);
        }
      } else if (relType === 'spouse') {
        linkAsSpouse(id1, id2);
      } else if (relType === 'sibling') {
        if (n1.parents.length === 0) {
          let dummyF = generateId();
          draft[dummyF] = { id: dummyF, name: '未知(父親)', gender: 'M', parents: [], children: [id1, id2], spouses: [], bio: '', posts: [], claimed: false };
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
    draft[newId] = { id: newId, name: formData.name, gender: formData.gender, parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
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
              else if (['老公', '丈夫', '夫', '配偶'].includes(step)) { relType = 'spouse'; gender = 'M'; }
              else if (['老婆', '妻子', '妻'].includes(step)) { relType = 'spouse'; gender = 'F'; }
              else if (['哥哥', '弟弟', '兄', '弟'].includes(step)) { relType = 'sibling'; gender = 'M'; }
              else if (['姊姊', '妹妹', '姊', '姐', '妹'].includes(step)) { relType = 'sibling'; gender = 'F'; }
              else { setErrorMsg(`無法識別關鍵字: "${step}"`); return; }

              if (isLast) {
                  let newId = generateId();
                  draft[newId] = { id: newId, name: textData.name || `新成員`, gender: textData.gender, parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
                  linkNodes(draft, currentId, newId, relType);
                  currentId = newId;
              } else {
                  let nextId = findExistingRelation(draft, currentId, relType, gender);
                  if (!nextId) {
                      nextId = generateId();
                      draft[nextId] = { id: nextId, name: `未知(${step})`, gender: gender, parents: [], children: [], spouses: [], bio: '', posts: [], claimed: false };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && treeName.trim()) {
      onReset(name.trim(), gender, treeName.trim());
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

            <button type="submit" className="w-full mt-4 bg-red-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-red-600 transition">確認清空並建立</button>
          </form>
        </div>
      </div>
    </div>
  );
};