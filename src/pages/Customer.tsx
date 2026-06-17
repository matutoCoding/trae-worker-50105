import React, { useState, useMemo } from 'react';
import {
  Users, Phone, MapPin, Building2, Calendar, Star, MessageSquare, TrendingUp, Crown, Award, Target, UserPlus,
  X, ChevronRight, FileCheck, Truck, Package, Receipt, CreditCard
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, getCustomerLevelColor, maskPhone, getStatusColor } from '@/utils/formatters';
import type { Customer as CustomerType, Order, Outbound, ProjectDelivery } from '@/types';

const Customer: React.FC = () => {
  const { customers, orders, contactLogs, getOrdersByCustomer, outbounds, projectDeliveries } = useStore();
  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null);

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

  const mainContent = (
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
                onClick={() => { setSelectedCustomer(c.id); setDetailCustomerId(c.id); }}
                className={`group rounded-2xl bg-white shadow-card border overflow-hidden hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer animate-fade-in-up relative ${selectedCustomer === c.id ? 'border-forest-400 ring-2 ring-forest-400/20' : 'border-sand-100'}`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur text-xs font-bold text-forest-700 shadow-sm border border-forest-100 flex items-center gap-1">
                    查看详情 <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
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

  if (detailCustomerId) {
    const detailCustomer = customers.find(c => c.id === detailCustomerId);
    if (detailCustomer) {
      const custOrders = getOrdersByCustomer(detailCustomerId);
      const custOrderIds = custOrders.map(o => o.id);
      const custOutbounds = outbounds.filter(ob => custOrderIds.includes(ob.orderId));
      const custProjects = projectDeliveries.filter(p => p.customerId === detailCustomerId);
      const totalPaid = custOrders.reduce((s, o) => s + o.paidAmount, 0);
      const totalOrderAmount = custOrders.reduce((s, o) => s + o.amount, 0);
      const unpaid = totalOrderAmount - totalPaid;
      const paidRate = totalOrderAmount > 0 ? (totalPaid / totalOrderAmount) * 100 : 0;

      return (
        <>
          {mainContent}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setDetailCustomerId(null)}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-forest-600 via-forest-500 to-leaf-500 text-white">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white" />
                  <div className="absolute right-40 bottom-0 w-40 h-40 rounded-full bg-white" />
                </div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-5">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-4 border-white/30 flex items-center justify-center shadow-xl">
                        <Building2 className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-serif font-bold text-2xl">{detailCustomer.name}</h2>
                          <Badge variant="custom" customClass={getCustomerLevelColor(detailCustomer.level)}>
                            <Crown className="w-3 h-3 mr-1" />{detailCustomer.level}
                          </Badge>
                          <Badge variant="custom" customClass="bg-white/20 text-white border-white/30 backdrop-blur">{detailCustomer.type}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                          <span className="flex items-center gap-1.5"><UserPlus className="w-4 h-4" />{detailCustomer.contact}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{maskPhone(detailCustomer.phone)}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{detailCustomer.address}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />入驻{formatDate(detailCustomer.registerDate)}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setDetailCustomerId(null)} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                      <div className="text-xs text-white/80 mb-1">累计订单</div>
                      <div className="text-2xl font-bold">{custOrders.length}<span className="text-sm ml-1 text-white/70">笔</span></div>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                      <div className="text-xs text-white/80 mb-1">订单总额</div>
                      <div className="text-2xl font-bold">¥{(totalOrderAmount / 10000).toFixed(1)}<span className="text-sm ml-1 text-white/70">万</span></div>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                      <div className="text-xs text-white/80 mb-1">已回款</div>
                      <div className="text-2xl font-bold text-leaf-200">¥{(totalPaid / 10000).toFixed(1)}<span className="text-sm ml-1 text-white/70">万</span></div>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20">
                      <div className="text-xs text-white/80 mb-1">回款进度</div>
                      <div className="text-2xl font-bold">{paidRate.toFixed(0)}<span className="text-sm ml-1 text-white/70">%</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)] space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card title="订单明细" subtitle={`共${custOrders.length}笔订单记录`} icon={<Receipt className="w-5 h-5" />}>
                    {custOrders.length === 0 ? (
                      <div className="py-10 text-center text-gray-400 text-sm">暂无订单记录</div>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto -mr-2 pr-2">
                        {custOrders.map(o => {
                          const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                          return (
                            <div key={o.id} className="p-4 rounded-xl bg-sand-50/50 border border-sand-100 hover:bg-forest-50/30 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="font-mono text-sm font-bold text-forest-700">{o.orderNo}</div>
                                  {o.projectName && <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Building2 className="w-3 h-3" />{o.projectName}</div>}
                                </div>
                                <Badge variant={o.status === '已完成' || o.status === '已验收' ? 'success' : o.status === '待确认' ? 'warning' : 'info'} className="border text-xs">{o.status}</Badge>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(o.orderDate)}</span>
                                <span>{totalQty.toLocaleString()}株</span>
                                <span className="font-bold text-earth-600">{formatCurrency(o.amount)}</span>
                              </div>
                              <div className="mt-2 pt-2 border-t border-sand-100">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-gray-500 flex items-center gap-1"><CreditCard className="w-3 h-3" />回款进度</span>
                                  <span className="font-bold text-leaf-600">{formatCurrency(o.paidAmount)} / {formatCurrency(o.amount)}</span>
                                </div>
                                <div className="h-2 rounded-full bg-white overflow-hidden border border-sand-100">
                                  <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-forest-500" style={{ width: `${o.amount > 0 ? (o.paidAmount / o.amount) * 100 : 0}%` }} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>

                  <Card title="出圃检疫" subtitle={`共${custOutbounds.length}份检疫证书`} icon={<FileCheck className="w-5 h-5" />}>
                    {custOutbounds.length === 0 ? (
                      <div className="py-10 text-center text-gray-400 text-sm">暂无出圃检疫记录</div>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto -mr-2 pr-2">
                        {custOutbounds.map(ob => {
                          const order = custOrders.find(o => o.id === ob.orderId);
                          return (
                            <div key={ob.id} className="p-4 rounded-xl bg-gradient-to-br from-forest-50 to-leaf-400/10 border border-forest-100">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="font-serif font-bold text-forest-800">{ob.certificate}</div>
                                  <div className="font-mono text-xs text-gray-500 mt-0.5">{ob.inspectionNo}</div>
                                </div>
                                <Badge variant={ob.result === '合格' ? 'success' : 'warning'} className="text-xs border">{ob.result}</Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-forest-500" />出圃：{formatDate(ob.outboundDate)}</span>
                                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-forest-500" />检验员：{ob.operator}</span>
                              </div>
                              {order && <div className="mt-2 pt-2 border-t border-forest-100/50 text-xs text-gray-500 flex items-center gap-1"><Receipt className="w-3 h-3" />关联订单：<span className="font-mono font-medium text-forest-600">{order.orderNo}</span></div>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Card>
                </div>

                <Card title="绿化工程供苗进度" subtitle={`共${custProjects.length}个工程项目`} icon={<Building2 className="w-5 h-5" />}>
                  {custProjects.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 text-sm">暂无关联工程项目</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {custProjects.map(p => (
                        <div key={p.id} className="p-5 rounded-2xl bg-white border border-sand-100 shadow-soft">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-lg text-forest-800">{p.projectName}</h4>
                                <Badge variant="custom" customClass={getStatusColor(p.status)} className="text-xs">{p.status}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                                <span>·</span>
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.startDate)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">进度</div>
                              <div className="text-2xl font-bold text-forest-700">{p.progress}%</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="text-center p-2 rounded-lg bg-sky-50 border border-sky-100">
                              <div className="text-[10px] text-sky-600">总量</div>
                              <div className="font-bold text-gray-800 text-sm">{p.totalQuantity.toLocaleString()}</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-leaf-400/10 border border-leaf-400/20">
                              <div className="text-[10px] text-leaf-600">已交付</div>
                              <div className="font-bold text-gray-800 text-sm">{p.deliveredQuantity.toLocaleString()}</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-amber-50 border border-amber-100">
                              <div className="text-[10px] text-amber-600">剩余</div>
                              <div className="font-bold text-gray-800 text-sm">{(p.totalQuantity - p.deliveredQuantity).toLocaleString()}</div>
                            </div>
                          </div>
                          <div className="h-3 rounded-full bg-sand-50 border border-sand-100 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${p.progress === 100 ? 'bg-gradient-to-r from-leaf-500 to-forest-500' : 'bg-gradient-to-r from-sky-400 via-forest-400 to-leaf-500'}`} style={{ width: `${p.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card title="开票与回款概览" icon={<CreditCard className="w-5 h-5" />}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-leaf-400/10 to-forest-50 border border-leaf-400/20">
                          <div className="text-xs text-leaf-700 font-medium mb-1">已回款金额</div>
                          <div className="text-2xl font-bold text-forest-700">{formatCurrency(totalPaid)}</div>
                        </div>
                        <div className={`p-4 rounded-xl border ${unpaid > 0 ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100' : 'bg-gradient-to-br from-gray-50 to-sand-50 border-gray-100'}`}>
                          <div className={`text-xs font-medium mb-1 ${unpaid > 0 ? 'text-amber-700' : 'text-gray-500'}`}>待回款金额</div>
                          <div className={`text-2xl font-bold ${unpaid > 0 ? 'text-amber-700' : 'text-gray-500'}`}>{formatCurrency(unpaid)}</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">整体回款率</span>
                          <span className="text-sm font-bold text-forest-700">{paidRate.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 rounded-full bg-white border border-sand-200 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-forest-500 transition-all duration-1000" style={{ width: `${paidRate}%` }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {custOrders.filter(o => o.paidAmount < o.amount).length > 0 && (
                          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                            <div className="text-xs font-bold text-amber-700 mb-1">📋 待回款订单</div>
                            <div className="space-y-1">
                              {custOrders.filter(o => o.paidAmount < o.amount).map(o => (
                                <div key={o.id} className="flex items-center justify-between text-xs text-gray-600">
                                  <span className="font-mono">{o.orderNo}</span>
                                  <span className="font-medium text-amber-700">{formatCurrency(o.amount - o.paidAmount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card title="订单苗木品种统计" icon={<Package className="w-5 h-5" />}>
                    {(() => {
                      const speciesMap: Record<string, { name: string; quantity: number; amount: number }> = {};
                      custOrders.forEach(o => {
                        o.items.forEach(item => {
                          if (!speciesMap[item.speciesId]) {
                            speciesMap[item.speciesId] = { name: item.speciesName, quantity: 0, amount: 0 };
                          }
                          speciesMap[item.speciesId].quantity += item.quantity;
                          speciesMap[item.speciesId].amount += item.quantity * item.unitPrice;
                        });
                      });
                      const speciesList = Object.values(speciesMap).sort((a, b) => b.quantity - a.quantity);
                      const maxQty = Math.max(...speciesList.map(s => s.quantity), 1);
                      return speciesList.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">暂无苗木数据</div>
                      ) : (
                        <div className="space-y-3">
                          {speciesList.map(s => (
                            <div key={s.name} className="p-3 rounded-xl bg-sand-50/50 border border-sand-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-800">{s.name}</span>
                                <span className="text-xs text-gray-500">{s.quantity.toLocaleString()}株 · {formatCurrency(s.amount)}</span>
                              </div>
                              <div className="h-2 rounded-full bg-white overflow-hidden border border-sand-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-forest-400 via-leaf-400 to-leaf-500" style={{ width: `${(s.quantity / maxQty) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </Card>
                </div>
              </div>

              <div className="p-4 bg-sand-50 border-t border-sand-100 flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>累计合作 {detailCustomer.totalOrders} 笔订单，交易额 {formatCurrency(detailCustomer.totalAmount)}</span>
                </div>
                <button onClick={() => setDetailCustomerId(null)} className="px-5 py-2 rounded-xl bg-gradient-to-r from-forest-600 to-leaf-500 text-white font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  关闭 <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </>
      );
    }
  }

  return mainContent;
};

export default Customer;
