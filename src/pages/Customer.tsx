import React, { useState, useMemo } from 'react';
import {
  Users, Phone, MapPin, Building2, Calendar, Star, MessageSquare, TrendingUp, Crown, Award, Target, UserPlus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, getCustomerLevelColor, maskPhone } from '@/utils/formatters';

const Customer: React.FC = () => {
  const { customers, orders, contactLogs, getOrdersByCustomer } = useStore();
  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const totalCustomers = customers.length;
  const vipCount = customers.filter(c => c.level === 'VIP').length;
  const totalOrderValue = customers.reduce((s, c) => s + c.totalAmount, 0);
  const potentialCount = customers.filter(c => c.level === '潜在').length;

  const typeDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    customers.forEach(c => { dist[c.type] = (dist[c.type] || 0) + 1; });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const topCustomers = useMemo(() => {
    return [...customers].sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 6).map(c => ({
      name: c.name.length > 8 ? c.name.slice(0, 8) + '...' : c.name,
      订单数: c.totalOrders,
      交易额: Number((c.totalAmount / 10000).toFixed(0)),
    }));
  }, [customers]);

  const TYPE_COLORS = ['#2D5A3D', '#7CB342', '#4FC3F7', '#F59E0B', '#8D6E63'];

  const contactTypeIcons: Record<string, React.ElementType> = {
    '电话': Phone,
    '拜访': Users,
    '微信': MessageSquare,
    '邮件': MessageSquare,
    '会议': Users,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="客户总数" value={`${totalCustomers}家`} subValue={`VIP客户${vipCount}家`} color="forest" trend={{ value: '+3家', positive: true }} />
        <StatCard icon={Crown} label="VIP客户占比" value={`${((vipCount / totalCustomers) * 100).toFixed(0)}%`} subValue={`${vipCount}家重点客户`} color="amber" />
        <StatCard icon={TrendingUp} label="累计交易额" value={formatCurrency(totalOrderValue)} subValue={`共${orders.length}笔订单`} color="leaf" trend={{ value: '+25.6%', positive: true }} />
        <StatCard icon={Target} label="潜在客户" value={`${potentialCount}家`} subValue="重点跟进转化" color="sky" />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'profiles', label: '客户档案', icon: <Building2 className="w-4 h-4" />, count: customers.length },
          { key: 'orders', label: '订单管理', icon: <BarChart className="w-4 h-4" />, count: orders.length },
          { key: 'contacts', label: '联系记录', icon: <MessageSquare className="w-4 h-4" />, count: contactLogs.length },
        ]}
      />

      {activeTab === 'profiles' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map((c, idx) => (
              <div
                key={c.id}
                onClick={() => setSelectedCustomer(c.id)}
                className={`rounded-2xl bg-white shadow-card border overflow-hidden hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in-up ${selectedCustomer === c.id ? 'border-forest-400 ring-2 ring-forest-400/20' : 'border-sand-100'}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="relative h-24 bg-gradient-to-br from-forest-500 via-forest-600 to-forest-700 overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white" />
                    <div className="absolute right-16 bottom-0 w-16 h-16 rounded-full bg-white" />
                  </div>
                  <div className="relative h-full px-5 pt-4 flex items-start justify-between">
                    <div>
                      <Badge variant="custom" customClass={getCustomerLevelColor(c.level)}>
                        <Crown className="w-3 h-3 mr-1" />{c.level}
                      </Badge>
                    </div>
                    <Badge variant="custom" customClass="bg-white/20 text-white border-white/30 backdrop-blur">{c.type}</Badge>
                  </div>
                </div>
                <div className="p-5 -mt-10 relative">
                  <div className="flex items-end justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-leaf-400 to-forest-500 border-4 border-white shadow-lg flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">累计合作</div>
                      <div className="text-xl font-bold text-earth-600">{formatCurrency(c.totalAmount)}</div>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{c.name}</h3>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2"><UserPlus className="w-3.5 h-3.5 text-forest-500" /><span className="font-medium text-gray-600">{c.contact}</span><span className="text-gray-400">·</span><span>{maskPhone(c.phone)}</span></div>
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /><span className="line-clamp-1">{c.address}</span></div>
                    <div className="flex items-center gap-4 pt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />入驻{formatDate(c.registerDate)}</span>
                      <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" />共{c.totalOrders}笔订单</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-5">
            <Card title="客户类型分布" subtitle="按业务类型统计占比" icon={<PieChart className="w-5 h-5" />}>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name }) => name}>
                      {typeDistribution.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="交易额TOP6客户" subtitle="按累计交易额排名（万元）" icon={<TrendingUp className="w-5 h-5" />}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCustomers} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip />
                    <Bar dataKey="交易额" fill="#2D5A3D" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customers.map((c, cIdx) => {
            const custOrders = getOrdersByCustomer(c.id);
            if (custOrders.length === 0) return null;
            return (
              <Card
                key={c.id}
                title={c.name}
                subtitle={`${c.contact} · ${maskPhone(c.phone)} · 共${custOrders.length}笔订单`}
                icon={<Building2 className="w-5 h-5" />}
                extra={<Badge variant="custom" customClass={getCustomerLevelColor(c.level)}>{c.level}</Badge>}
              >
                <div className="overflow-x-auto -mx-5 -mb-5">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-sand-50 to-forest-50/30">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">订单号</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">项目名称</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">下单日期</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">苗木品种</th>
                        <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">总数量</th>
                        <th className="px-4 py-3 text-right text-xs font-bold text-forest-800 uppercase tracking-wider">订单金额</th>
                        <th className="px-5 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">订单状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sand-100">
                      {custOrders.map((o, idx) => (
                        <tr key={o.id} className="hover:bg-forest-50/30 transition-colors" style={{ animationDelay: `${(cIdx * 3 + idx) * 20}ms` }}>
                          <td className="px-5 py-4 font-mono text-sm font-bold text-forest-700">{o.orderNo}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">{o.projectName || '-'}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{formatDate(o.orderDate)}</td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {o.items.slice(0, 3).map(item => (
                                <Badge key={item.speciesId} variant="info" className="border">{item.speciesName}</Badge>
                              ))}
                              {o.items.length > 3 && <Badge variant="default" className="border">+{o.items.length - 3}</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-bold text-gray-700">{o.items.reduce((s, i) => s + i.quantity, 0).toLocaleString()}株</td>
                          <td className="px-4 py-4 text-right font-bold text-earth-600 text-lg">{formatCurrency(o.amount)}</td>
                          <td className="px-5 py-4 text-center">
                            <Badge variant={o.status === '已完成' || o.status === '已验收' ? 'success' : o.status === '待确认' ? 'warning' : 'info'} className="border">{o.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'contacts' && (
        <Card title="客户联系记录" subtitle="销售跟进与沟通日志" icon={<MessageSquare className="w-5 h-5" />}>
          <div className="relative">
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-forest-200 via-leaf-300 to-earth-300" />
            <div className="space-y-5">
              {contactLogs.map((log, idx) => {
                const cust = customers.find(c => c.id === log.customerId);
                const TypeIcon = contactTypeIcons[log.type] || MessageSquare;
                return (
                  <div key={log.id} className="relative pl-14 animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                    <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-white border-2 border-forest-100 shadow-md flex items-center justify-center z-10">
                      <TypeIcon className="w-5 h-5 text-forest-600" />
                    </div>
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-sand-50/80 to-white border border-sand-100 hover:shadow-soft transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-forest-600" />
                            <span className="font-bold text-forest-800">{cust?.name}</span>
                          </div>
                          <Badge variant="info" className="border">{log.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(log.date)}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{log.operator}</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-sand-100 mb-3">
                        <p className="text-sm text-gray-700 leading-relaxed">{log.content}</p>
                      </div>
                      {log.followUp && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2">
                          <Target className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-amber-700 mb-0.5">📌 后续跟进</div>
                            <p className="text-sm text-gray-700">{log.followUp}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Customer;
