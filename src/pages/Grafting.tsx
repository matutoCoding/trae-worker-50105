import React, { useState, useMemo } from 'react';
import {
  Scissors, GitBranch, TrendingUp, Users, Star, Calendar, Clock
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { formatPercent, formatDate } from '@/utils/formatters';

const Grafting: React.FC = () => {
  const { graftings, batches, species } = useStore();
  const [activeTab, setActiveTab] = useState('records');

  const totalGrafted = graftings.reduce((s, g) => s + g.quantity, 0);
  const totalSurvived = graftings.reduce((s, g) => s + g.survived, 0);
  const avgSurvival = totalGrafted > 0 ? ((totalSurvived / totalGrafted) * 100).toFixed(1) : '0';
  const combos = new Set(graftings.map(g => `${g.rootstock}+${g.scion}`)).size;

  const affinityColors: Record<string, string> = {
    '优': 'bg-gradient-to-r from-leaf-500 to-forest-500 text-white',
    '良': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white',
    '中': 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
    '差': 'bg-gradient-to-r from-red-400 to-red-500 text-white',
  };

  const methodColors: Record<string, string> = {
    '枝接': 'bg-forest-100 text-forest-700 border-forest-200',
    '芽接': 'bg-sky-100 text-sky-700 border-sky-200',
    '切接': 'bg-amber-100 text-amber-700 border-amber-200',
    '劈接': 'bg-purple-100 text-purple-700 border-purple-200',
  };

  const methodChartData = useMemo(() => {
    const methods = ['枝接', '芽接', '切接', '劈接'];
    return methods.map(m => {
      const data = graftings.filter(g => g.method === m);
      return {
        name: m,
        数量: data.reduce((s, g) => s + g.quantity, 0),
        成活数: data.reduce((s, g) => s + g.survived, 0),
        成活率: data.length > 0 ? Number(((data.reduce((s, g) => s + g.survived, 0) / data.reduce((s, g) => s + g.quantity, 0)) * 100).toFixed(1)) : 0,
      };
    });
  }, [graftings]);

  const comboRadarData = useMemo(() => {
    return graftings.slice(0, 5).map(g => ({
      subject: `${g.scion.slice(0, 4)}`,
      A: g.affinity === '优' ? 95 : g.affinity === '良' ? 82 : g.affinity === '中' ? 65 : 45,
      fullMark: 100,
    }));
  }, [graftings]);

  const monthlyData = useMemo(() => {
    return [
      { month: '1月', 枝接: 0, 芽接: 0, 切接: 0, 劈接: 0 },
      { month: '2月', 枝接: 200, 芽接: 0, 切接: 150, 劈接: 100 },
      { month: '3月', 枝接: 800, 芽接: 0, 切接: 500, 劈接: 300 },
      { month: '4月', 枝接: 500, 芽接: 300, 切接: 0, 劈接: 100 },
      { month: '5月', 枝接: 100, 芽接: 500, 切接: 0, 劈接: 0 },
      { month: '6月', 枝接: 0, 芽接: 200, 切接: 0, 劈接: 0 },
    ];
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Scissors} label="总嫁接数量" value={`${totalGrafted.toLocaleString()}株`} subValue={`${graftings.length}次操作`} color="forest" trend={{ value: '+18%', positive: true }} />
        <StatCard icon={GitBranch} label="成活数量" value={`${totalSurvived.toLocaleString()}株`} subValue={`平均成活率${avgSurvival}%`} color="leaf" trend={{ value: '+3.5%', positive: true }} />
        <StatCard icon={Star} label="嫁接组合" value={`${combos}种`} subValue="砧木+接穗配对" color="sky" />
        <StatCard icon={TrendingUp} label="成活率最高" value="93.6%" subValue="米叶罗汉松枝接" color="amber" />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'records', label: '嫁接操作日志', icon: <Scissors className="w-4 h-4" />, count: graftings.length },
          { key: 'combos', label: '嫁接组合档案', icon: <GitBranch className="w-4 h-4" />, count: combos },
          { key: 'analysis', label: '成活分析', icon: <TrendingUp className="w-4 h-4" /> },
        ]}
      />

      {activeTab === 'records' && (
        <div className="space-y-4">
          {graftings.map((g, idx) => {
            const batch = batches.find(b => b.id === g.batchId);
            const sp = species.find(s => s.id === batch?.speciesId);
            const rate = g.quantity > 0 ? (g.survived / g.quantity) * 100 : 0;
            return (
              <div
                key={g.id}
                className="rounded-2xl bg-white shadow-card border border-sand-100 p-5 hover:shadow-hover transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-100 to-leaf-400/20 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden">
                      <div className="absolute inset-0">
                        <img src={sp?.image} alt="" className="w-full h-full object-cover opacity-30" />
                      </div>
                      <Scissors className="w-8 h-8 text-forest-600 relative z-10" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif font-bold text-lg text-forest-800">{sp?.name} 嫁接</h3>
                        <Badge variant="custom" customClass={methodColors[g.method]}>{g.method}</Badge>
                        <Badge variant="custom" customClass={affinityColors[g.affinity]}>亲和性：{g.affinity}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(g.operationDate)}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{g.operator}</span>
                        <span className="font-mono bg-sand-50 px-2 py-0.5 rounded">关联批次：{batch?.batchNo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">成活率</div>
                    <div className={`text-3xl font-bold ${rate >= 90 ? 'text-leaf-600' : rate >= 80 ? 'text-forest-600' : 'text-amber-600'}`}>{rate.toFixed(1)}%</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                        <GitBranch className="w-4 h-4 text-sky-600" />
                      </div>
                      <span className="text-xs font-bold text-sky-700">砧木选择</span>
                    </div>
                    <div className="font-bold text-gray-800">{g.rootstock}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-leaf-400/10 to-forest-50 border border-leaf-400/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-leaf-400/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-leaf-600" />
                      </div>
                      <span className="text-xs font-bold text-leaf-600">接穗品种</span>
                    </div>
                    <div className="font-bold text-gray-800">{g.scion}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-xs font-bold text-amber-700">操作数据</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div><span className="text-sm text-gray-500">嫁接</span><div className="font-bold text-gray-800">{g.quantity}株</div></div>
                      <div className="text-amber-400 text-lg">→</div>
                      <div><span className="text-sm text-gray-500">成活</span><div className="font-bold text-leaf-600">{g.survived}株</div></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-sand-50 border border-sand-100">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-600">成活进度</span>
                      <span className="text-xs font-bold text-forest-700">{g.survived} / {g.quantity} 株</span>
                    </div>
                    <div className="h-3 rounded-full bg-white overflow-hidden border border-sand-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 via-forest-500 to-forest-600 transition-all duration-1000" style={{ width: `${rate}%` }} />
                    </div>
                  </div>
                </div>

                {g.notes && (
                  <div className="mt-4 pt-4 border-t border-sand-100">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-earth-500 mt-0.5 whitespace-nowrap">📝 技术备注：</span>
                      <p className="text-sm text-gray-600 leading-relaxed">{g.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'combos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {graftings.map((g, idx) => (
            <div
              key={g.id}
              className="rounded-2xl bg-white shadow-card border border-sand-100 p-5 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <Badge variant="custom" customClass={affinityColors[g.affinity]}>
                  <Star className="w-3 h-3 mr-1" />亲和性 {g.affinity}
                </Badge>
                <Badge variant="custom" customClass={methodColors[g.method]}>{g.method}</Badge>
              </div>

              <div className="flex items-center justify-between mb-5 px-2">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 border-2 border-sky-200 flex items-center justify-center mb-2 shadow-md">
                    <GitBranch className="w-10 h-10 text-sky-600" />
                  </div>
                  <div className="text-xs text-sky-600 font-medium mb-1">砧木</div>
                  <div className="font-bold text-gray-800">{g.rootstock}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-500 to-leaf-500 flex items-center justify-center shadow-lg shadow-forest-500/30 -mx-8 z-10">
                    <Scissors className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2">嫁接组合</div>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-leaf-400/20 to-forest-50 border-2 border-leaf-400/30 flex items-center justify-center mb-2 shadow-md">
                    <Star className="w-10 h-10 text-leaf-600" />
                  </div>
                  <div className="text-xs text-leaf-600 font-medium mb-1">接穗</div>
                  <div className="font-bold text-gray-800">{g.scion}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-sand-100">
                <div className="text-center p-2 rounded-lg bg-forest-50/50">
                  <div className="text-xs text-gray-500">嫁接数</div>
                  <div className="font-bold text-forest-700">{g.quantity}株</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-leaf-400/10">
                  <div className="text-xs text-gray-500">成活数</div>
                  <div className="font-bold text-leaf-600">{g.survived}株</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-amber-50">
                  <div className="text-xs text-gray-500">成活率</div>
                  <div className="font-bold text-amber-600">{formatPercent(g.survived, g.quantity)}</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-earth-400/10 to-amber-50 border border-earth-400/20">
                <div className="text-xs font-bold text-earth-600 mb-1">💡 技术要点</div>
                <p className="text-xs text-gray-600 leading-relaxed">{g.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="按嫁接方法对比分析" subtitle="数量、成活数、成活率对比" icon={<BarChart className="w-5 h-5" />} className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={methodChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="数量" fill="#2D5A3D" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="left" dataKey="成活数" fill="#7CB342" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="成活率" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="月度嫁接操作趋势" subtitle="各方法月度分布统计" icon={<LineChart className="w-5 h-5" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="枝接" stroke="#2D5A3D" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="芽接" stroke="#4FC3F7" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="切接" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="劈接" stroke="#8D6E63" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="嫁接组合亲和性评估" subtitle="各组合综合评分雷达图" icon={<RadarChart className="w-5 h-5" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={comboRadarData}>
                  <PolarGrid stroke="#ECE9E2" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="亲和性评分" dataKey="A" stroke="#2D5A3D" fill="#2D5A3D" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="嫁接成活率KPI分析" subtitle="各项指标达成情况" icon={<TrendingUp className="w-5 h-5" />}>
            <div className="space-y-5 pt-3">
              {[
                { label: '枝接平均成活率', current: 91.2, target: 90, color: 'from-forest-500 to-forest-600' },
                { label: '芽接平均成活率', current: 88.5, target: 88, color: 'from-sky-400 to-sky-500' },
                { label: '切接平均成活率', current: 89.8, target: 90, color: 'from-amber-400 to-amber-500' },
                { label: '劈接平均成活率', current: 85.3, target: 85, color: 'from-earth-400 to-earth-500' },
                { label: '综合平均成活率', current: Number(avgSurvival), target: 88, color: 'from-leaf-500 to-forest-500' },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700">{kpi.label}</span>
                    <span className="text-sm"><b className="text-forest-700">{kpi.current}%</b> <span className="text-gray-400 mx-1">/</span> <span className="text-gray-500">目标{kpi.target}%</span></span>
                  </div>
                  <div className="h-2.5 rounded-full bg-sand-100 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${kpi.color} transition-all duration-1000`} style={{ width: `${Math.min((kpi.current / 100) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Grafting;
