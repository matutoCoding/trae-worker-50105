import React, { useState, useMemo } from 'react';
import {
  Sprout, Calendar, Users, TrendingUp, Droplets, Sun, Thermometer, Clock, Trees
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { getStatusColor, formatPercent, formatDate } from '@/utils/formatters';

const Seedling: React.FC = () => {
  const { batches, species } = useStore();
  const [activeTab, setActiveTab] = useState('batches');

  const totalSown = batches.reduce((s, b) => s + b.quantity, 0);
  const totalGerminated = batches.reduce((s, b) => s + b.germinated, 0);
  const totalSurvived = batches.reduce((s, b) => s + b.survived, 0);
  const avgGermRate = totalSown > 0 ? ((totalGerminated / totalSown) * 100).toFixed(1) : '0';
  const avgSurvRate = totalGerminated > 0 ? ((totalSurvived / totalGerminated) * 100).toFixed(1) : '0';

  const survivalChartData = useMemo(() => {
    return batches.slice().reverse().map(b => ({
      name: b.batchNo.split('-').slice(0, 2).join('-'),
      发芽率: b.quantity > 0 ? Number(((b.germinated / b.quantity) * 100).toFixed(1)) : 0,
      成活率: b.germinated > 0 ? Number(((b.survived / b.germinated) * 100).toFixed(1)) : 0,
    }));
  }, [batches]);

  const statusDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    batches.forEach(b => { dist[b.status] = (dist[b.status] || 0) + 1; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [batches]);

  const STATUS_COLORS = ['#4FC3F7', '#FBBF24', '#9CCC65', '#2D5A3D', '#8D6E63', '#78909C'];

  const careGuides = [
    { stage: '播种催芽期', days: '1-15天', temp: '20-25℃', humidity: '80-90%', light: '遮阴', water: '每日喷雾2次', fertilize: '不需施肥', tips: '保持基质湿润，注意通风防止霉变', icon: Sprout },
    { stage: '发芽展叶期', days: '15-45天', temp: '18-28℃', humidity: '70-80%', light: '散射光', water: '每日浇水1次', fertilize: '稀液肥1000倍', tips: '逐步增加光照，预防立枯病', icon: Sprout },
    { stage: '幼苗生长期', days: '45-90天', temp: '15-30℃', humidity: '60-75%', light: '全日照', water: '见干见湿', fertilize: '每周薄肥1次', tips: '及时间苗，注意蚜虫防治', icon: Trees },
    { stage: '成苗练苗期', days: '90-180天', temp: '自然温度', humidity: '50-70%', light: '全日照', water: '2-3天1次', fertilize: '半月1次缓释肥', tips: '控水控肥，提高抗逆性', icon: Sun },
    { stage: '移栽定植期', days: '180天+', temp: '春秋最佳', humidity: '60-80%', light: '全日照', water: '定植后浇透', fertilize: '基肥+追肥', tips: '带土球移栽，遮阴缓苗', icon: Droplets },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Sprout} label="总播种量" value={`${totalSown.toLocaleString()}粒`} subValue={`${batches.length}个批次`} color="forest" trend={{ value: '+12%', positive: true }} />
        <StatCard icon={TrendingUp} label="平均发芽率" value={`${avgGermRate}%`} subValue={`发芽${totalGerminated.toLocaleString()}株`} color="leaf" trend={{ value: '+2.3%', positive: true }} />
        <StatCard icon={Users} label="平均成活率" value={`${avgSurvRate}%`} subValue={`成活${totalSurvived.toLocaleString()}株`} color="sky" />
        <StatCard icon={Calendar} label="本月新批次" value="3个" subValue="播种11,500粒" color="amber" trend={{ value: '计划2个', positive: true }} />
      </div>

      <div className="flex items-center justify-between">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: 'batches', label: '播种批次', icon: <Calendar className="w-4 h-4" />, count: batches.length },
            { key: 'stats', label: '成活率统计', icon: <LineChart className="w-4 h-4" /> },
            { key: 'guide', label: '移栽养护指导', icon: <Sprout className="w-4 h-4" /> },
          ]}
        />
      </div>

      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            {batches.map((b, idx) => {
              const sp = species.find(s => s.id === b.speciesId);
              const germRate = b.quantity > 0 ? (b.germinated / b.quantity) * 100 : 0;
              const survRate = b.germinated > 0 ? (b.survived / b.germinated) * 100 : 0;
              return (
                <div
                  key={b.id}
                  className="rounded-2xl bg-white shadow-card border border-sand-100 p-5 hover:shadow-hover transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
                        <img src={sp?.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif font-bold text-lg text-forest-800">{sp?.name}</h3>
                          <Badge variant="custom" customClass={getStatusColor(b.status)}>{b.status}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-mono bg-sand-50 px-2 py-0.5 rounded">{b.batchNo}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(b.sowingDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">当前阶段</div>
                      <div className="text-sm font-bold text-forest-700">{b.stage}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 mb-4">
                    <MetricCard label="播种量" value={`${b.quantity.toLocaleString()}`} unit="粒" color="bg-forest-50 text-forest-700" />
                    <MetricCard label="已发芽" value={b.germinated > 0 ? b.germinated.toLocaleString() : '-'} unit="株" color="bg-sky-50 text-sky-700" />
                    <MetricCard label="已成活" value={b.survived > 0 ? b.survived.toLocaleString() : '-'} unit="株" color="bg-leaf-400/10 text-leaf-600" />
                    <MetricCard label="发芽率" value={b.germinated > 0 ? formatPercent(b.germinated, b.quantity) : '-'} unit="" color="bg-amber-50 text-amber-700" />
                    <MetricCard label="成活率" value={b.survived > 0 ? formatPercent(b.survived, b.germinated) : '-'} unit="" color="bg-purple-50 text-purple-700" />
                  </div>

                  <div className="space-y-2">
                    <ProgressBar label="发芽进度" value={germRate} color="from-sky-400 to-sky-500" />
                    {b.germinated > 0 && <ProgressBar label="成活进度" value={survRate} color="from-leaf-400 to-forest-500" />}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-sand-100 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{b.operator}</div>
                    <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{b.location}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-5">
            <Card title="批次状态分布" subtitle="当前各阶段批次数量" icon={<PieChart className="w-5 h-5" />}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" label={({ name }) => name}>
                      {statusDistribution.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="养护环境监控" subtitle="温室实时环境数据" icon={<Thermometer className="w-5 h-5" />}>
              <div className="space-y-3">
                <EnvSensor icon={Thermometer} label="A区温室温度" value="24.5℃" range="20-25℃" status="正常" percent={75} color="from-red-400 to-orange-400" />
                <EnvSensor icon={Droplets} label="A区温室湿度" value="72%" range="70-80%" status="正常" percent={72} color="from-sky-400 to-blue-500" />
                <EnvSensor icon={Sun} label="光照强度" value="18,500Lux" range="适宜" status="良好" percent={65} color="from-amber-400 to-yellow-500" />
                <EnvSensor icon={Sprout} label="基质EC值" value="1.2mS/cm" range="1.0-1.5" status="适宜" percent={60} color="from-leaf-400 to-forest-500" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="各批次发芽率与成活率趋势" subtitle="按批次时间顺序排列" icon={<LineChart className="w-5 h-5" />} className="lg:col-span-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={survivalChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="发芽率" stroke="#4FC3F7" strokeWidth={3} dot={{ r: 5, fill: '#4FC3F7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="成活率" stroke="#2D5A3D" strokeWidth={3} dot={{ r: 5, fill: '#2D5A3D', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="按品种成活率对比" subtitle="柱状图对比分析" icon={<BarChart className="w-5 h-5" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batches.map(b => ({ name: species.find(s => s.id === b.speciesId)?.name, 成活率: b.germinated > 0 ? Number(((b.survived / b.germinated) * 100).toFixed(1)) : 0, 发芽率: b.quantity > 0 ? Number(((b.germinated / b.quantity) * 100).toFixed(1)) : 0 }))} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="发芽率" fill="#7CB342" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="成活率" fill="#2D5A3D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="育苗KPI达标情况" subtitle="本月关键指标达成" icon={<TrendingUp className="w-5 h-5" />}>
            <div className="space-y-5 pt-2">
              {[
                { label: '综合发芽率达标', current: Number(avgGermRate), target: 80, unit: '%' },
                { label: '综合成活率达标', current: Number(avgSurvRate), target: 88, unit: '%' },
                { label: '壮苗率达标', current: 82.5, target: 85, unit: '%' },
                { label: '按时移栽率', current: 95, target: 90, unit: '%' },
              ].map((kpi, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{kpi.label}</span>
                    <div className="text-sm">
                      <span className="font-bold text-forest-700">{kpi.current}{kpi.unit}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-gray-500">目标{kpi.target}{kpi.unit}</span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full bg-sand-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${kpi.current >= kpi.target ? 'bg-gradient-to-r from-leaf-500 to-forest-500' : 'bg-gradient-to-r from-amber-400 to-orange-400'}`}
                      style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="space-y-5">
          <Card title="苗木分阶段养护指南" subtitle="从播种到出圃的完整养护流程" icon={<Sprout className="w-5 h-5" />}>
            <div className="relative">
              <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-forest-300 via-leaf-400 to-earth-400" />
              <div className="space-y-6">
                {careGuides.map((guide, idx) => (
                  <div key={idx} className="relative flex gap-5 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-100 to-leaf-400/20 border-2 border-white shadow-lg flex items-center justify-center flex-shrink-0">
                      <guide.icon className="w-8 h-8 text-forest-600" />
                    </div>
                    <div className="flex-1 p-5 rounded-2xl bg-gradient-to-br from-sand-50 to-forest-50/30 border border-sand-100 hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-serif font-bold text-lg text-forest-800">{guide.stage}</h4>
                          <p className="text-xs text-earth-600 font-medium">时间周期：{guide.days}</p>
                        </div>
                        <Badge variant="success">第{idx + 1}阶段</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="p-3 rounded-xl bg-white/70 border border-sand-100">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" />温度</div>
                          <div className="text-sm font-bold text-gray-700">{guide.temp}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/70 border border-sand-100">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3" />湿度</div>
                          <div className="text-sm font-bold text-gray-700">{guide.humidity}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/70 border border-sand-100">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Sun className="w-3 h-3" />光照</div>
                          <div className="text-sm font-bold text-gray-700">{guide.light}</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/70 border border-sand-100">
                          <div className="text-xs text-gray-500 mb-1">水肥</div>
                          <div className="text-sm font-bold text-gray-700 truncate">{guide.water}</div>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold text-xs mt-0.5">💡 关键要点</span>
                          <p className="text-sm text-gray-700 flex-1">{guide.tips}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <div className={`p-3 rounded-xl ${color} text-center`}>
    <div className="text-[10px] opacity-75 mb-0.5">{label}</div>
    <div className="text-sm font-bold">{value}<span className="text-xs ml-0.5 opacity-75">{unit}</span></div>
  </div>
);

const ProgressBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-bold text-gray-700">{value.toFixed(1)}%</span>
    </div>
    <div className="h-2 rounded-full bg-sand-100 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const EnvSensor: React.FC<{ icon: React.ElementType; label: string; value: string; range: string; status: string; percent: number; color: string }> = ({ icon: Icon, label, value, range, status, percent, color }) => (
  <div className="p-3 rounded-xl bg-sand-50 border border-sand-100">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
      <Badge variant="success">{status}</Badge>
    </div>
    <div className="flex items-end justify-between mb-2">
      <span className="text-xl font-bold text-gray-800">{value}</span>
      <span className="text-[10px] text-gray-400">{range}</span>
    </div>
    <div className="h-1.5 rounded-full bg-sand-200 overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

export default Seedling;
