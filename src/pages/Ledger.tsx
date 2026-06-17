import React, { useState, useMemo } from 'react';
import {
  Trees, Ruler, BarChart3, Layers, Search, Filter, MapPin, Tag
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { getRarityColor, formatCurrency } from '@/utils/formatters';

const Ledger: React.FC = () => {
  const { species, inventories, getInventoryBySpecies } = useStore();
  const [activeTab, setActiveTab] = useState('species');
  const [searchTerm, setSearchTerm] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const filteredSpecies = useMemo(() => {
    return species.filter(s => {
      const matchSearch = s.name.includes(searchTerm) || s.alias.includes(searchTerm) || s.family.includes(searchTerm);
      const matchRarity = rarityFilter === 'all' || s.rarity === rarityFilter;
      return matchSearch && matchRarity;
    });
  }, [species, searchTerm, rarityFilter]);

  const totalValue = inventories.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const totalSpecies = species.length;
  const protectedSpecies = species.filter(s => s.rarity === '国家一级' || s.rarity === '国家二级').length;
  const gradeDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    inventories.forEach(i => { dist[i.grade] = (dist[i.grade] || 0) + i.quantity; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [inventories]);

  const speciesInventoryData = useMemo(() => {
    return species.slice(0, 6).map(s => {
      const inv = getInventoryBySpecies(s.id);
      return {
        name: s.name,
        精品级: inv.filter(i => i.grade === '精品级').reduce((s, i) => s + i.quantity, 0),
        一级: inv.filter(i => i.grade === '一级').reduce((s, i) => s + i.quantity, 0),
        二级: inv.filter(i => i.grade === '二级').reduce((s, i) => s + i.quantity, 0),
      };
    });
  }, [species, getInventoryBySpecies]);

  const PIE_COLORS = ['#2D5A3D', '#7CB342', '#8D6E63', '#4FC3F7'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Trees} label="苗木品种总数" value={`${totalSpecies}种`} subValue={`其中国家保护${protectedSpecies}种`} color="forest" trend={{ value: '+2种', positive: true }} />
        <StatCard icon={Layers} label="在库苗木总量" value={inventories.reduce((s, i) => s + i.quantity, 0).toLocaleString() + '株'} subValue={`${inventories.length}个库存批次`} color="leaf" trend={{ value: '+5.2%', positive: true }} />
        <StatCard icon={BarChart3} label="库存总价值" value={formatCurrency(totalValue)} subValue="按参考单价估算" color="amber" trend={{ value: '+12.8%', positive: true }} />
        <StatCard icon={MapPin} label="种植区域" value="4大区" subValue="东区/西区/南区/北区" color="earth" trend={{ value: '新增造型园', positive: true }} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabs={[
            { key: 'species', label: '品种档案', icon: <Trees className="w-4 h-4" />, count: species.length },
            { key: 'inventory', label: '规格分级', icon: <Ruler className="w-4 h-4" />, count: inventories.length },
            { key: 'stats', label: '库存统计', icon: <PieChart className="w-4 h-4" /> },
          ]}
        />
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索品种名称、科属..."
              className="pl-10 pr-4 py-2.5 rounded-xl bg-white border border-sand-200 text-sm focus:outline-none focus:border-forest-400 focus:ring-2 focus:ring-forest-400/20 w-64 transition-all"
            />
          </div>
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-4 text-sand-600 pointer-events-none" />
            <select
              value={rarityFilter}
              onChange={(e) => setRarityFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-xl bg-white border border-sand-200 text-sm focus:outline-none focus:border-forest-400 appearance-none"
            >
              <option value="all">全部保护级别</option>
              <option value="国家一级">国家一级</option>
              <option value="国家二级">国家二级</option>
              <option value="省级保护">省级保护</option>
              <option value="珍稀名优">珍稀名优</option>
              <option value="常规品种">常规品种</option>
            </select>
          </div>
        </div>
      </div>

      {activeTab === 'species' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSpecies.map((s, idx) => {
            const inv = getInventoryBySpecies(s.id);
            const totalQty = inv.reduce((sum, i) => sum + i.quantity, 0);
            const totalVal = inv.reduce((sum, i) => sum + i.quantity * i.price, 0);
            return (
              <div
                key={s.id}
                className="group rounded-2xl bg-white shadow-card border border-sand-100 overflow-hidden hover:shadow-hover hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="relative h-44 overflow-hidden bg-gradient-to-br from-forest-100 to-leaf-400/20">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className={`${getRarityColor(s.rarity)} px-2.5 py-1 rounded-full text-xs font-bold shadow-md`}>{s.rarity}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-xl leading-tight">{s.name}</h3>
                    <p className="text-xs opacity-90">{s.alias}</p>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{s.family}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{s.habit}</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sand-100">
                    <div className="text-center">
                      <div className="text-base font-bold text-forest-700">{totalQty.toLocaleString()}</div>
                      <div className="text-[10px] text-gray-500">在库株数</div>
                    </div>
                    <div className="text-center border-x border-sand-100">
                      <div className="text-base font-bold text-leaf-600">{formatCurrency(totalVal)}</div>
                      <div className="text-[10px] text-gray-500">库存价值</div>
                    </div>
                    <div className="text-center">
                      <div className="text-base font-bold text-earth-500">{inv.length}</div>
                      <div className="text-[10px] text-gray-500">规格数</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'inventory' && (
        <Card title="苗木规格分级台账" subtitle="按品种、等级、规格详细记录" icon={<Ruler className="w-5 h-5" />}>
          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sand-50 to-forest-50/30">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">品种</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">等级</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">地径(cm)</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">高度(cm)</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">冠幅(cm)</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">数量</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-forest-800 uppercase tracking-wider">单价</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">所在区域</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {inventories.map((inv, idx) => {
                  const sp = species.find(s => s.id === inv.speciesId);
                  const gradeColors: Record<string, string> = {
                    '精品级': 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
                    '一级': 'bg-gradient-to-r from-forest-500 to-forest-600 text-white',
                    '二级': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white',
                    '三级': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
                  };
                  return (
                    <tr key={inv.id} className="hover:bg-forest-50/30 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 20}ms` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-forest-100 flex-shrink-0">
                            <img src={sp?.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{sp?.name}</div>
                            <div className="text-xs text-gray-500">{sp?.family}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="custom" customClass={gradeColors[inv.grade]}>{inv.grade}</Badge>
                      </td>
                      <td className="px-4 py-4 text-center font-mono text-sm font-medium text-gray-700">{inv.dbh.toFixed(1)}</td>
                      <td className="px-4 py-4 text-center font-mono text-sm font-medium text-gray-700">{inv.height}</td>
                      <td className="px-4 py-4 text-center font-mono text-sm font-medium text-gray-700">{inv.crown}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-forest-700">{inv.quantity.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">株</span>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-earth-600">{formatCurrency(inv.price)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-forest-500" />
                          {inv.area}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card title="规格等级分布" subtitle="按等级统计在库数量" icon={<PieChart className="w-5 h-5" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={gradeDistribution} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {gradeDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="各品种库存明细" subtitle="按等级分类统计" icon={<BarChart3 className="w-5 h-5" />}>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={speciesInventoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="精品级" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="一级" fill="#2D5A3D" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="二级" fill="#4FC3F7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="区域库存价值TOP5" subtitle="按种植区域统计" icon={<MapPin className="w-5 h-5" />} className="lg:col-span-2">
            <div className="grid grid-cols-5 gap-4">
              {['东区-精品园', '西区-大道树', '南区-珍稀园', '北区-造型园', '东区-A块'].map((area, idx) => {
                const areaInv = inventories.filter(i => i.area.includes(area.split('-')[0]));
                const value = areaInv.reduce((s, i) => s + i.quantity * i.price, 0);
                const qty = areaInv.reduce((s, i) => s + i.quantity, 0);
                const max = 10000000;
                return (
                  <div key={area} className="p-4 rounded-xl bg-gradient-to-br from-sand-50 to-forest-50/30 border border-sand-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                      <MapPin className="w-4 h-4 text-forest-500" />
                    </div>
                    <div className="font-serif font-bold text-sm text-forest-800 mb-2">{area}</div>
                    <div className="text-2xl font-bold text-forest-700 mb-1">{formatCurrency(value)}</div>
                    <div className="text-xs text-gray-500 mb-3">{qty.toLocaleString()}株苗木</div>
                    <div className="h-2 rounded-full bg-sand-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-forest-500 to-leaf-500 rounded-full transition-all duration-1000" style={{ width: `${(value / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Ledger;
