import React, { useState, useMemo } from 'react';
import {
  Bug, AlertTriangle, Shield, Calendar, Clock, Users, ChevronLeft, ChevronRight, Pill, Droplets, Scissors as _Scissors, Search as _Search, CheckCircle, Filter, ListTodo, CheckCheck, X, MapPin as _MapPin
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { formatDate, getStatusColor } from '@/utils/formatters';
import type { ScheduleItem } from '@/types';

const PestControl: React.FC = () => {
  const { pestInfos, pestTreatments, schedules } = useStore();
  const [activeTab, setActiveTab] = useState('pedia');
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 5, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2024, 5, 17));
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'pending' | 'done'>('all');
  const [showDayModal, setShowDayModal] = useState(false);

  const totalTreatments = pestTreatments.length;
  const completedTreatments = pestTreatments.filter(t => t.status === '已完成').length;
  const pendingTreatments = pestTreatments.filter(t => t.status === '待执行').length;
  const diseaseCount = pestInfos.filter(p => p.type === '病害').length;
  const pestCount = pestInfos.filter(p => p.type === '虫害').length;

  const severityColors: Record<string, string> = {
    '轻度': 'bg-leaf-400/20 text-leaf-600 border-leaf-400/30',
    '中度': 'bg-amber-100 text-amber-700 border-amber-200',
    '重度': 'bg-red-100 text-red-700 border-red-200',
  };

  const typeColors: Record<string, string> = {
    '病害': 'bg-gradient-to-r from-red-400 to-rose-500 text-white',
    '虫害': 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white',
  };

  const scheduleTypeColors: Record<string, string> = {
    '喷药': 'bg-red-100 text-red-700 border-red-200',
    '施肥': 'bg-leaf-400/20 text-leaf-600 border-leaf-400/30',
    '修剪': 'bg-earth-400/20 text-earth-600 border-earth-400/30',
    '浇水': 'bg-sky-100 text-sky-700 border-sky-200',
    '检查': 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const scheduleTypeIcons: Record<string, React.ElementType> = {
    '喷药': Pill,
    '施肥': Droplets,
    '修剪': _Scissors,
    '浇水': Droplets,
    '检查': _Search,
  };

  const severityDistribution = useMemo(() => {
    return ['轻度', '中度', '重度'].map(s => ({
      name: s,
      value: pestInfos.filter(p => p.severity === s).length
    })).filter(d => d.value > 0);
  }, [pestInfos]);

  const PIE_COLORS = ['#9CCC65', '#FBBF24', '#EF4444'];

  const treatmentByMonth = useMemo(() => [
    { month: '1月', 病害: 2, 虫害: 1, 预防: 3 },
    { month: '2月', 病害: 1, 虫害: 0, 预防: 2 },
    { month: '3月', 病害: 3, 虫害: 2, 预防: 5 },
    { month: '4月', 病害: 5, 虫害: 4, 预防: 6 },
    { month: '5月', 病害: 8, 虫害: 6, 预防: 8 },
    { month: '6月', 病害: 6, 虫害: 5, 预防: 7 },
  ], []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Array<{ date: Date; events: typeof schedules }> = [];

    const startOffset = firstDay.getDay();
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, events: [] });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().slice(0, 10);
      const evts = schedules.filter(s => s.date === dateStr);
      days.push({ date: d, events: evts });
    }

    while (days.length % 7 !== 0) {
      const lastDate = days[days.length - 1].date;
      const d = new Date(lastDate);
      d.setDate(d.getDate() + 1);
      days.push({ date: d, events: [] });
    }
    return days;
  }, [currentMonth, schedules]);

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Bug} label="病虫害种类" value={`${pestInfos.length}种`} subValue={`病害${diseaseCount} · 虫害${pestCount}`} color="purple" />
        <StatCard icon={Shield} label="防治记录" value={`${totalTreatments}次`} subValue={`已完成${completedTreatments}次`} color="forest" trend={{ value: '+12次', positive: true }} />
        <StatCard icon={AlertTriangle} label="待防治任务" value={`${pendingTreatments}项`} subValue="近期需处理" color="amber" />
        <StatCard icon={Calendar} label="本月排期" value={`${schedules.filter(s => s.date.startsWith('2024-06')).length}项`} subValue={`待办${schedules.filter(s => s.date.startsWith('2024-06') && s.status === '待办').length}项`} color="sky" />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'pedia', label: '病虫害图鉴', icon: <Bug className="w-4 h-4" />, count: pestInfos.length },
          { key: 'schedule', label: '防治排期日历', icon: <Calendar className="w-4 h-4" /> },
          { key: 'treatment', label: '用药记录追踪', icon: <Pill className="w-4 h-4" />, count: pestTreatments.length },
        ]}
      />

      {activeTab === 'pedia' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pestInfos.map((p, idx) => (
            <div
              key={p.id}
              className="group rounded-2xl bg-white shadow-card border border-sand-100 overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge variant="custom" customClass={typeColors[p.type]}>{p.type}</Badge>
                  <Badge variant="custom" customClass={severityColors[p.severity]}>
                    <AlertTriangle className="w-3 h-3 mr-1" />{p.severity}危害
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-serif font-bold text-2xl text-white leading-tight">{p.name}</h3>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-amber-700 mb-1">识别症状</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.symptoms}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-forest-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-forest-700 mb-1">防治方案</div>
                      <p className="text-sm text-gray-700 leading-relaxed">{p.treatment}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card
              className="xl:col-span-2"
              title={`${currentMonth.getFullYear()}年${monthNames[currentMonth.getMonth()]}`}
              subtitle="防治排期日历 · 点击日期查看当天全部安排"
              icon={<Calendar className="w-5 h-5" />}
              extra={
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 rounded-lg hover:bg-sand-100 transition-colors"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
                  <button onClick={() => { setCurrentMonth(new Date(2024, 5, 1)); setSelectedDate(new Date(2024, 5, 17)); }} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-forest-50 text-forest-700 hover:bg-forest-100 transition-colors">今天</button>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 rounded-lg hover:bg-sand-100 transition-colors"><ChevronRight className="w-4 h-4 text-gray-600" /></button>
                </div>
              }
            >
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="text-center text-xs font-bold text-gray-500 py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(({ date, events }, idx) => {
                  const isToday = date.toDateString() === new Date(2024, 5, 17).toDateString();
                  const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const filteredEvts = events.filter(e => {
                    if (scheduleFilter === 'all') return true;
                    if (scheduleFilter === 'pending') return e.status === '待办';
                    return e.status === '已完成';
                  });
                  const pendingCount = events.filter(e => e.status === '待办').length;
                  return (
                    <button
                      key={idx}
                      onClick={() => { setSelectedDate(date); setShowDayModal(true); }}
                      className={`min-h-[88px] p-1.5 rounded-xl border text-left transition-all duration-200 group ${
                        isCurrentMonth ? 'bg-white border-sand-100 hover:border-forest-400 hover:bg-forest-50/50 hover:shadow-soft' : 'bg-sand-50/50 border-transparent opacity-50 cursor-not-allowed'
                      } ${isToday ? 'ring-2 ring-forest-500 ring-offset-1 bg-gradient-to-br from-forest-50 to-leaf-400/10' : ''} ${
                        isSelected && !isToday ? 'ring-2 ring-leaf-400 ring-offset-1 bg-leaf-400/10 border-leaf-300' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isToday ? 'text-forest-700' : isCurrentMonth ? 'text-gray-700 group-hover:text-forest-700' : 'text-gray-400'}`}>{date.getDate()}</span>
                        {pendingCount > 0 && isCurrentMonth && (
                          <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center animate-pulse-slow">
                            {pendingCount}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        {filteredEvts.slice(0, 2).map(evt => {
                          const Icon = scheduleTypeIcons[evt.type];
                          return (
                            <div
                              key={evt.id}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate border ${scheduleTypeColors[evt.type]} ${evt.status === '已完成' ? 'opacity-50 line-through' : ''}`}
                            >
                              {Icon && <Icon className="w-2.5 h-2.5 flex-shrink-0" />}
                              <span className="truncate">{evt.title.slice(0, 7)}</span>
                            </div>
                          );
                        })}
                        {filteredEvts.length > 2 && <div className="text-[10px] text-gray-400 font-medium">+{filteredEvts.length - 2}项安排</div>}
                        {filteredEvts.length === 0 && events.length > 0 && scheduleFilter !== 'all' && (
                          <div className="text-[10px] text-gray-300 italic">无符合项</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-sand-100">
                <div className="flex flex-wrap items-center gap-3">
                  {Object.entries(scheduleTypeColors).map(([type, cls]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded border ${cls}`} />
                      <span className="text-xs text-gray-600">{type}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-1 rounded-xl bg-sand-50 border border-sand-100">
                  {[
                    { k: 'all', label: '全部', icon: Filter },
                    { k: 'pending', label: '待办', icon: ListTodo },
                    { k: 'done', label: '已完成', icon: CheckCheck },
                  ].map(f => {
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.k}
                        onClick={() => setScheduleFilter(f.k as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          scheduleFilter === f.k
                            ? 'bg-white text-forest-700 shadow-sm border border-forest-100'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            <div className="space-y-5">
              <Card
                title={selectedDate ? `${formatDate(selectedDate.toISOString().slice(0,10))} · 日程安排` : '近期待办任务'}
                subtitle={selectedDate ? `点击日历中的日期切换` : '按日期排序的近期任务'}
                icon={<ListTodo className="w-5 h-5" />}
                extra={selectedDate ? (
                  <button onClick={() => setShowDayModal(true)} className="text-xs font-medium text-forest-600 hover:text-forest-800 flex items-center gap-1">
                    查看全部 <ChevronRight className="w-3 h-3" />
                  </button>
                ) : null}
              >
                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {(() => {
                    let list: ScheduleItem[] = [];
                    if (selectedDate) {
                      const ds = selectedDate.toISOString().slice(0, 10);
                      list = schedules.filter(s => s.date === ds);
                      if (scheduleFilter !== 'all') {
                        list = list.filter(s => scheduleFilter === 'pending' ? s.status === '待办' : s.status === '已完成');
                      }
                    } else {
                      list = schedules
                        .filter(s => scheduleFilter === 'all' ? true : scheduleFilter === 'pending' ? s.status === '待办' : s.status === '已完成')
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(0, 10);
                    }
                    if (list.length === 0) {
                      return (
                        <div className="py-10 text-center">
                          <CheckCircle className="w-10 h-10 text-forest-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-400">暂无{scheduleFilter === 'pending' ? '待办' : scheduleFilter === 'done' ? '已完成' : ''}日程</div>
                        </div>
                      );
                    }
                    return list.map((s, idx) => {
                      const Icon = scheduleTypeIcons[s.type];
                      return (
                        <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-sand-50 transition-colors group animate-fade-in border border-transparent hover:border-sand-100" style={{ animationDelay: `${idx * 30}ms` }}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${scheduleTypeColors[s.type]}`}>
                            {Icon && <Icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-sm font-bold ${s.status === '已完成' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{s.title}</span>
                              {s.batchNo && <span className="text-[10px] bg-sand-100 text-gray-500 px-1.5 py-0.5 rounded font-mono flex-shrink-0">{s.batchNo}</span>}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />{formatDate(s.date)}
                              <span className="mx-1 text-gray-300">·</span>
                              <Clock className="w-3 h-3" />{s.type}
                            </div>
                          </div>
                          <Badge variant="custom" customClass={s.status === '待办' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-forest-50 text-forest-700 border border-forest-200'}>
                            {s.status === '待办' ? <ListTodo className="w-3 h-3 mr-0.5 inline" /> : <CheckCircle className="w-3 h-3 mr-0.5 inline" />}
                            {s.status}
                          </Badge>
                        </div>
                      );
                    });
                  })()}
                </div>
              </Card>

              <Card title="严重程度分布" subtitle="病虫害严重度占比" icon={<PieChart className="w-5 h-5" />}>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={severityDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" label={({ name, value }) => `${name}${value}`}>
                        {severityDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {showDayModal && selectedDate && (
            <DayDetailModal
              date={selectedDate}
              events={schedules.filter(s => s.date === selectedDate.toISOString().slice(0, 10))}
              onClose={() => setShowDayModal(false)}
              typeColors={scheduleTypeColors}
              typeIcons={scheduleTypeIcons}
              filter={scheduleFilter}
            />
          )}
        </div>
      )}

      {activeTab === 'treatment' && (
        <div className="space-y-5">
          <Card title="月度防治情况统计" subtitle="病害、虫害、预防性防治对比" icon={<BarChart className="w-5 h-5" />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treatmentByMonth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="病害" fill="#EF4444" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="虫害" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="预防" fill="#2D5A3D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="用药记录明细" subtitle="所有防治操作的详细追踪记录" icon={<Pill className="w-5 h-5" />}>
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sand-50 to-forest-50/30">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">防治日期</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">防治对象</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">农药名称</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">用量配比</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">关联批次</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">安全间隔</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">操作人员</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {pestTreatments.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-forest-50/30 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-forest-500" />
                          <span className="text-sm font-medium text-gray-700">{formatDate(t.applyDate)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Badge variant={t.pestName.includes('病') ? 'danger' : t.pestName.includes('虫') ? 'info' : 'warning'} className="border">
                            {t.pestName}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-earth-500" />
                          <span className="text-sm font-medium text-gray-700">{t.pesticide}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 font-mono">{t.dosage}</td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-mono bg-sand-50 px-2 py-1 rounded text-gray-600">{t.batchId === 'b1' ? 'YX-2024-03-A' : t.batchId === 'b2' ? 'YX-2024-04-B' : t.batchId === 'b3' ? 'SS-2024-02-A' : t.batchId === 'b4' ? 'GT-2024-03-A' : t.batchId === 'b5' ? 'HDS-2023-10-A' : 'JSN-2024-01-A'}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {t.safeInterval}天
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{t.operator}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <Badge variant="custom" customClass={getStatusColor(t.status)}>{t.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

interface DayDetailModalProps {
  date: Date;
  events: ScheduleItem[];
  onClose: () => void;
  typeColors: Record<string, string>;
  typeIcons: Record<string, React.ElementType>;
  filter: 'all' | 'pending' | 'done';
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ date, events, onClose, typeColors, typeIcons, filter }) => {
  const [localFilter, setLocalFilter] = useState(filter);
  const filtered = events.filter(e => {
    if (localFilter === 'all') return true;
    return localFilter === 'pending' ? e.status === '待办' : e.status === '已完成';
  });
  const pending = events.filter(e => e.status === '待办').length;
  const done = events.filter(e => e.status === '已完成').length;
  const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-6 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-leaf-400/20" />
          <div className="absolute -left-8 bottom-0 w-32 h-32 rounded-full bg-sky-400/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs text-forest-100/80 mb-1">日程详情 · {weekdayNames[date.getDay()]}</div>
              <h3 className="font-serif text-3xl font-bold">{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-forest-100/90">
                <span className="flex items-center gap-1"><ListTodo className="w-4 h-4" />待办 {pending}项</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" />已完成 {done}项</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />总计 {events.length}项</span>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative mt-5 flex gap-1 p-1 rounded-2xl bg-white/10 backdrop-blur border border-white/20 w-fit">
            {[
              { k: 'all', label: '全部安排' },
              { k: 'pending', label: '仅看待办' },
              { k: 'done', label: '仅看已完成' },
            ].map(f => (
              <button
                key={f.k}
                onClick={() => setLocalFilter(f.k as any)}
                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  localFilter === f.k ? 'bg-white text-forest-800 shadow-md' : 'text-forest-100/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 max-h-[55vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle className="w-16 h-16 text-forest-200 mx-auto mb-3" />
              <h4 className="font-serif text-xl font-bold text-gray-800 mb-1">本日暂无{localFilter === 'pending' ? '待办' : localFilter === 'done' ? '已完成' : ''}安排</h4>
              <p className="text-sm text-gray-500">
                {localFilter === 'all' ? '这一天没有排期，可以好好休息一下' : '切换筛选条件查看其他安排'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((evt, idx) => {
                const Icon = typeIcons[evt.type];
                return (
                  <div
                    key={evt.id}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-sand-100 bg-gradient-to-br from-white to-sand-50/50 hover:shadow-soft hover:border-forest-100 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${typeColors[evt.type]}`}>
                      {Icon && <Icon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant="custom" customClass={typeColors[evt.type]}>{evt.type}</Badge>
                        {evt.batchNo && <span className="text-[10px] font-mono bg-sand-100 text-gray-500 px-2 py-0.5 rounded">{evt.batchNo}</span>}
                        <Badge variant="custom" customClass={evt.status === '待办' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-forest-50 text-forest-700 border border-forest-200'}>
                          {evt.status === '待办' ? <ListTodo className="w-3 h-3 mr-0.5 inline" /> : <CheckCircle className="w-3 h-3 mr-0.5 inline" />}
                          {evt.status}
                        </Badge>
                      </div>
                      <h5 className={`font-bold text-lg ${evt.status === '已完成' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{evt.title}</h5>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-sky-500" />建议时段：上午 {['喷药', '检查'].includes(evt.type) ? '8:00-10:00' : '浇水'.includes(evt.type) ? '9:00-11:00' : '10:00-12:00'}</span>
                        {evt.type === '喷药' && <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />安全间隔：7天</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-sand-50 border-t border-sand-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            提示：点击日历中任意日期可查看对应日程
          </div>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-gradient-to-r from-forest-500 to-leaf-500 text-white font-medium hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default PestControl;
