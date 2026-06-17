import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, QrCode, MapPin, Calendar, Users, Sprout, Truck, ShieldCheck, Leaf, Scissors, TreeDeciduous, ArrowRight, FileCheck, Package, AlertCircle, CheckCircle2,
  History, Map as MapIcon, Building2, ChevronRight, Clock, X
} from 'lucide-react';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, getRarityColor } from '@/utils/formatters';

interface RecentQuery {
  id: string;
  traceId: string;
  traceNo: string;
  speciesName: string;
  time: Date;
  keyword: string;
}

const Trace: React.FC = () => {
  const { traceRecords, species, customers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrace, setSelectedTrace] = useState<string | null>('tr1');
  const [hasSearched, setHasSearched] = useState(false);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const [searchMode, setSearchMode] = useState<'all' | 'no' | 'species' | 'batch'>('all');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trace_recent_queries');
      if (saved) setRecentQueries(JSON.parse(saved));
    } catch {}
  }, []);

  const persistRecent = (list: RecentQuery[]) => {
    try {
      localStorage.setItem('trace_recent_queries', JSON.stringify(list.slice(0, 8)));
    } catch {}
  };

  const addToRecent = (traceId: string, keyword: string) => {
    const rec = traceRecords.find(t => t.id === traceId);
    if (!rec) return;
    const item: RecentQuery = {
      id: `${traceId}-${Date.now()}`,
      traceId,
      traceNo: rec.traceNo,
      speciesName: rec.speciesName,
      time: new Date(),
      keyword: keyword || rec.traceNo,
    };
    setRecentQueries(prev => {
      const filtered = prev.filter(p => p.traceId !== traceId);
      const next = [item, ...filtered].slice(0, 8);
      persistRecent(next);
      return next;
    });
  };

  const clearRecent = () => {
    setRecentQueries([]);
    persistRecent([]);
  };

  const removeRecent = (id: string) => {
    setRecentQueries(prev => {
      const next = prev.filter(p => p.id !== id);
      persistRecent(next);
      return next;
    });
  };

  const doSearch = (term: string, mode: typeof searchMode = searchMode) => {
    setHasSearched(true);
    const keyword = term.trim();
    if (!keyword) {
      setSelectedTrace(null);
      return;
    }
    const kw = keyword.toLowerCase();
    const found = traceRecords.find(t => {
      const matchNo = mode === 'all' || mode === 'no' ? t.traceNo.toLowerCase().includes(kw) : false;
      const matchSpecies = mode === 'all' || mode === 'species' ? t.speciesName.includes(keyword) : false;
      const matchBatch = mode === 'all' || mode === 'batch' ? t.batchNo.toLowerCase().includes(kw) : false;
      return matchNo || matchSpecies || matchBatch;
    });
    if (found) {
      setSelectedTrace(found.id);
      addToRecent(found.id, keyword);
    } else {
      setSelectedTrace(null);
    }
  };

  const handleSearch = () => doSearch(searchTerm);

  const quickPick = (keyword: string, mode: 'no' | 'species' | 'batch') => {
    setSearchTerm(keyword);
    setSearchMode(mode);
    doSearch(keyword, mode);
  };

  const openFromRecent = (r: RecentQuery) => {
    setSearchTerm(r.keyword);
    setSelectedTrace(r.traceId);
    setHasSearched(true);
    setRecentQueries(prev => {
      const filtered = prev.filter(p => p.id !== r.id);
      const next = [{ ...r, time: new Date(), id: `${r.traceId}-${Date.now()}` }, ...filtered].slice(0, 8);
      persistRecent(next);
      return next;
    });
  };

  const trace = traceRecords.find(t => t.id === selectedTrace);
  const sp = species.find(s => s.id === trace?.speciesId);

  const allSpeciesNames = useMemo(() => species.slice(0, 6).map(s => s.name), [species]);

  const stageIcons: Record<string, React.ElementType> = {
    '播种': Sprout,
    '发芽': Sprout,
    '移栽': Package,
    '定植': TreeDeciduous,
    '病虫防治': ShieldCheck,
    '修剪造型': Scissors,
    '出圃检疫': FileCheck,
    '销售配送': Truck,
    '砧木培育': Sprout,
    '嫁接': Scissors,
    '成活检查': CheckCircle2,
  };

  const stageColors: Record<string, string> = {
    '播种': 'from-sky-400 to-blue-500',
    '发芽': 'from-sky-400 to-cyan-400',
    '移栽': 'from-leaf-400 to-green-400',
    '定植': 'from-forest-400 to-forest-600',
    '病虫防治': 'from-amber-400 to-orange-500',
    '修剪造型': 'from-earth-400 to-earth-600',
    '出圃检疫': 'from-purple-400 to-indigo-500',
    '销售配送': 'from-forest-500 to-leaf-600',
    '砧木培育': 'from-sky-400 to-blue-500',
    '嫁接': 'from-purple-400 to-forest-500',
    '成活检查': 'from-leaf-400 to-forest-500',
  };

  const timeAgo = (d: Date) => {
    const diff = Date.now() - new Date(d).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return '刚刚';
    if (min < 60) return `${min}分钟前`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}小时前`;
    return `${Math.floor(hr / 24)}天前`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={History} label="可溯源苗木" value={`${traceRecords.length + 86}株`} subValue="已关联溯源编号" color="forest" trend={{ value: '+12株', positive: true }} />
        <StatCard icon={MapIcon} label="覆盖城市" value="18个" subValue="全国苗木流向追踪" color="sky" />
        <StatCard icon={QrCode} label="溯源查询次数" value="2,386次" subValue="本月查询428次" color="leaf" trend={{ value: '+18%', positive: true }} />
        <StatCard icon={ShieldCheck} label="检疫合格率" value="100%" subValue="出圃苗木全部合格" color="amber" />
      </div>

      <Card className="bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-leaf-400" />
          <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-sky-400 -translate-y-1/3 translate-x-1/3" />
        </div>
        <div className="relative py-4">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-3">
              <QrCode className="w-4 h-4" />
              <span className="text-sm">苗木全生命周期溯源查询工作台</span>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-2">多维度查询 · 一键追踪苗木档案</h2>
            <p className="text-forest-100/80 text-sm">支持溯源编号、品种名称、批次号任意查询</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-1 p-1 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-3 w-fit mx-auto">
              {[
                { k: 'all', label: '全部' },
                { k: 'no', label: '溯源编号' },
                { k: 'species', label: '苗木品种' },
                { k: 'batch', label: '批次号' },
              ].map(m => (
                <button
                  key={m.k}
                  onClick={() => setSearchMode(m.k as any)}
                  className={`px-4 py-1.5 rounded-xl text-sm transition-all ${searchMode === m.k ? 'bg-white text-forest-800 font-bold shadow-md' : 'text-forest-100/80 hover:text-white hover:bg-white/10'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={
                    searchMode === 'no' ? '请输入溯源编号，如 TRYX2021S001286...'
                    : searchMode === 'species' ? '请输入苗木品种名称，如 银杏、水杉...'
                    : searchMode === 'batch' ? '请输入批次号，如 YX-2021-03-A...'
                    : '输入溯源编号 / 品种 / 批次号...'
                  }
                  className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-leaf-400/50 text-base shadow-xl"
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); setSelectedTrace(null); setHasSearched(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-leaf-400 to-leaf-500 text-forest-900 font-bold hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all duration-200 shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                查询溯源
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-forest-100/70">快速查询：</span>
              <button onClick={() => quickPick('TRYX2021S001286', 'no')} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-1">
                <QrCode className="w-3 h-3" />TRYX2021S001286
              </button>
              {allSpeciesNames.slice(0, 4).map(n => (
                <button key={n} onClick={() => quickPick(n, 'species')} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-1">
                  <TreeDeciduous className="w-3 h-3" />{n}
                </button>
              ))}
              <button onClick={() => quickPick('YX-2021-03-A', 'batch')} className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors flex items-center gap-1">
                <Leaf className="w-3 h-3" />YX-2021-03-A
              </button>
            </div>
          </div>
        </div>
      </Card>

      {recentQueries.length > 0 && (
        <Card
          title="最近查询记录"
          subtitle="快速回访已查询的苗木去向"
          icon={<Clock className="w-5 h-5" />}
          extra={
            <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1">
              <X className="w-3 h-3" />清空记录
            </button>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recentQueries.map(r => (
              <div key={r.id} className="relative group">
                <button
                  onClick={() => openFromRecent(r)}
                  className="w-full p-4 rounded-2xl bg-gradient-to-br from-forest-50 to-sand-50 border border-forest-100 hover:shadow-hover hover:-translate-y-0.5 hover:border-forest-300 transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-leaf-500 flex items-center justify-center flex-shrink-0">
                      <TreeDeciduous className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-800 truncate">{r.speciesName}</div>
                      <div className="text-[10px] text-forest-600 font-mono truncate">{r.traceNo}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(r.time)} · {r.keyword.length > 10 ? r.keyword.slice(0, 10) + '...' : r.keyword}
                  </div>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); removeRecent(r.id); }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white text-gray-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {hasSearched && !trace && (
        <Card className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">未找到溯源记录</h3>
          <p className="text-gray-500 mb-6">请检查关键词是否正确，或尝试其他方式进行查询</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {traceRecords.slice(0, 3).map(t => (
              <button
                key={t.id}
                onClick={() => quickPick(t.traceNo, 'no')}
                className="p-4 rounded-xl bg-gradient-to-br from-forest-50 to-sand-50 border border-forest-100 hover:shadow-hover hover:-translate-y-0.5 transition-all text-left"
              >
                <div className="text-xs text-forest-600 font-mono mb-1">{t.traceNo}</div>
                <div className="font-bold text-gray-800">{t.speciesName}</div>
                <div className="text-xs text-gray-500 mt-1">{t.spec}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {trace && sp && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 animate-scale-in">
          <Card className="xl:col-span-2" title="全生命周期溯源时间线" subtitle={`${trace.speciesName} · 从培育到种植的完整记录`} icon={<History className="w-5 h-5" />}>
            <div className="relative">
              <div className="sticky top-0 z-10 p-4 mb-4 rounded-2xl bg-gradient-to-r from-forest-50 via-leaf-400/10 to-forest-50 border border-forest-100 flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-forest-100 flex-shrink-0">
                  <img src={sp.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-2xl font-bold text-forest-800">{trace.speciesName}</h3>
                    <Badge variant="custom" customClass={getRarityColor(sp.rarity)}>{sp.rarity}</Badge>
                    <Badge variant="success" className="border">{trace.grade}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 font-mono text-forest-600 font-bold bg-white px-2 py-0.5 rounded">{trace.traceNo}</span>
                    <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{trace.spec}</span>
                    <span className="text-gray-500 flex items-center gap-1"><Leaf className="w-4 h-4" />批次：{trace.batchNo}</span>
                  </div>
                </div>
              </div>

              <div className="relative pl-8 pb-4">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-sky-300 via-forest-300 via-leaf-400 to-forest-500 rounded-full" />
                {trace.lifecycle.map((node, idx) => {
                  const Icon = stageIcons[node.stage] || Sprout;
                  const isLast = idx === trace.lifecycle.length - 1;
                  return (
                    <div key={idx} className="relative mb-6 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                      <div className={`absolute left-[-26px] top-0 w-7 h-7 rounded-full bg-gradient-to-br ${stageColors[node.stage] || 'from-forest-400 to-forest-600'} border-4 border-white shadow-lg flex items-center justify-center z-10 ${isLast ? 'ring-4 ring-leaf-400/30 animate-pulse-slow' : ''}`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className={`p-4 rounded-2xl border ${isLast ? 'bg-gradient-to-br from-forest-50 to-leaf-400/10 border-leaf-400/30 shadow-soft' : 'bg-white border-sand-100 hover:shadow-soft hover:border-forest-100'} transition-all`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-800">{node.stage}</h4>
                            {isLast && <Badge variant="success" className="border"><CheckCircle2 className="w-3 h-3 mr-1" />当前状态</Badge>}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />{formatDate(node.date)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">{node.description}</p>
                        {node.result && (
                          <div className="text-xs mb-2 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest-500" />
                            <span className="text-forest-700 font-medium">结果：{node.result}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-2 border-t border-sand-100">
                          {node.operator && <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-forest-500" />{node.operator}</span>}
                          {node.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-earth-500" />{node.location}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <div className="space-y-5">
            <Card title="苗木基本信息" subtitle="品种档案与规格详情" icon={<TreeDeciduous className="w-5 h-5" />}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
                    <img src={sp.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-lg text-forest-800">{sp.name}</h4>
                      <Badge variant="custom" customClass={getRarityColor(sp.rarity)}>{sp.rarity}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">{sp.alias}</div>
                  </div>
                </div>
                <div className="space-y-2.5 pt-2">
                  <InfoRow label="科属分类" value={sp.family} />
                  <InfoRow label="原产地" value={sp.origin} />
                  <InfoRow label="生长习性" value={sp.habit} />
                  <InfoRow label="规格等级" value={trace.grade} highlight />
                  <InfoRow label="苗木规格" value={trace.spec} highlight />
                </div>
              </div>
            </Card>

            <Card title="去向追踪" subtitle="苗木最终种植位置" icon={<MapPin className="w-5 h-5" />} className="overflow-hidden">
              <div className="h-40 -mx-5 -mt-5 mb-4 bg-gradient-to-br from-sky-100 via-forest-50 to-leaf-400/20 relative">
                <div className="absolute inset-0 opacity-40">
                  <svg className="w-full h-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                    <path d="M50,80 Q100,40 150,70 T250,60 T350,80" stroke="#2D5A3D" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                    <circle cx="50" cy="80" r="8" fill="#4FC3F7" />
                    <circle cx="200" cy="65" r="6" fill="#7CB342" />
                    <circle cx="350" cy="80" r="10" fill="#2D5A3D" className="animate-pulse" />
                  </svg>
                </div>
                <div className="absolute left-4 bottom-3 flex items-center gap-1.5 text-xs bg-white/80 backdrop-blur px-2 py-1 rounded-full text-sky-700">
                  <div className="w-2 h-2 rounded-full bg-sky-500" />种植基地
                </div>
                <div className="absolute right-4 bottom-3 flex items-center gap-1.5 text-xs bg-white/80 backdrop-blur px-2 py-1 rounded-full text-forest-700">
                  <MapPin className="w-3 h-3" />{trace.destination.split('市')[0]}市
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-gradient-to-br from-forest-50 to-leaf-400/10 border border-leaf-400/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <Building2 className="w-5 h-5 text-forest-600" />
                    </div>
                    <div>
                      <div className="text-xs text-forest-600 font-medium mb-0.5">种植项目</div>
                      <div className="font-bold text-gray-800">{trace.destination}</div>
                    </div>
                  </div>
                </div>
                <InfoRow icon={<Building2 className="w-4 h-4 text-forest-500" />} label="客户单位" value={trace.customer} />
                <InfoRow icon={<MapPin className="w-4 h-4 text-earth-500" />} label="种植地址" value={trace.plantLocation} />
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-forest-500 to-leaf-500 text-white font-medium hover:shadow-lg hover:scale-[1.01] active:scale-100 transition-all flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  查看地图定位
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card>

            <Card title="相关证书" subtitle="出圃检验检疫文件" icon={<ShieldCheck className="w-5 h-5" />}>
              <div className="space-y-3">
                {['苗木检验检疫合格证', '产地检验证书', '苗木质量等级证书'].map((cert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 hover:shadow-soft transition-all cursor-pointer group">
                    <div className="w-10 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FileCheck className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{cert}</div>
                      <div className="text-xs text-gray-500">编号：JY202406{i + 10}{i.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-forest-500 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {!hasSearched && (
        <Card title="最近可溯源记录" subtitle="近期出圃的可溯源苗木列表 · 点击快速查询" icon={<History className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {traceRecords.map((t, idx) => {
              const s = species.find(sp => sp.id === t.speciesId);
              return (
                <button
                  key={t.id}
                  onClick={() => quickPick(t.traceNo, 'no')}
                  className="p-5 rounded-2xl bg-gradient-to-br from-white to-sand-50 border border-sand-100 hover:shadow-hover hover:-translate-y-1 transition-all text-left group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
                      <img src={s?.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-forest-600 mb-0.5">{t.traceNo}</div>
                      <div className="font-serif font-bold text-lg text-gray-800">{t.speciesName}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2"><Leaf className="w-3.5 h-3.5 text-leaf-500" />{t.grade} · {t.spec}</div>
                    <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-sky-500" />{t.destination.slice(0, 14)}...</div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-sand-100">
                    <Badge variant="info" className="border">{t.lifecycle.length}个节点</Badge>
                    <span className="text-xs font-bold text-forest-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                      查看详情 <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string; highlight?: boolean; icon?: React.ReactNode }> = ({ label, value, highlight, icon }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="mt-0.5">{icon}</div>}
    <div className="flex-1 min-w-0">
      <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-sm ${highlight ? 'font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded inline-block' : 'text-gray-700'}`}>{value}</div>
    </div>
  </div>
);

export default Trace;
