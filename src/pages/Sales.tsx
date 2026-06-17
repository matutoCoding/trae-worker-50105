import React, { useState, useMemo } from 'react';
import {
  Truck, FileCheck, Building2, Receipt, Calendar, Users, MapPin, DollarSign, CreditCard, FileText, CheckCircle2, AlertCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStore } from '@/store';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/formatters';

const Sales: React.FC = () => {
  const { orders, outbounds, projectDeliveries, customers } = useStore();
  const [activeTab, setActiveTab] = useState('ledger');

  const totalAmount = orders.reduce((s, o) => s + o.amount, 0);
  const totalPaid = orders.reduce((s, o) => s + o.paidAmount, 0);
  const pendingOrders = orders.filter(o => ['待确认', '已确认', '备货中'].includes(o.status)).length;
  const completedProjects = projectDeliveries.filter(p => p.status === '已完成').length;

  const monthlySales = useMemo(() => [
    { month: '1月', 销售额: 185, 回款额: 172 },
    { month: '2月', 销售额: 126, 回款额: 118 },
    { month: '3月', 销售额: 342, 回款额: 310 },
    { month: '4月', 销售额: 458, 回款额: 420 },
    { month: '5月', 销售额: 528, 回款额: 485 },
    { month: '6月', 销售额: 391, 回款额: 180 },
  ], []);

  const orderStatusBadge: Record<string, string> = {
    '待确认': 'bg-amber-100 text-amber-700 border-amber-200',
    '已确认': 'bg-sky-100 text-sky-700 border-sky-200',
    '备货中': 'bg-purple-100 text-purple-700 border-purple-200',
    '已发货': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '已验收': 'bg-leaf-400/20 text-leaf-600 border-leaf-400/30',
    '已完成': 'bg-forest-100 text-forest-700 border-forest-200',
    '已取消': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Receipt} label="销售总额" value={formatCurrency(totalAmount)} subValue={`${orders.length}笔订单`} color="forest" trend={{ value: '+18.5%', positive: true }} />
        <StatCard icon={CreditCard} label="已回款金额" value={formatCurrency(totalPaid)} subValue={`回款率${((totalPaid / totalAmount) * 100).toFixed(0)}%`} color="leaf" trend={{ value: '+12.3%', positive: true }} />
        <StatCard icon={AlertCircle} label="进行中订单" value={`${pendingOrders}笔`} subValue="待确认/备货中" color="amber" />
        <StatCard icon={Building2} label="工程项目" value={`${projectDeliveries.length}个`} subValue={`已完成${completedProjects}个`} color="sky" />
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        tabs={[
          { key: 'ledger', label: '销售台账', icon: <Receipt className="w-4 h-4" />, count: orders.length },
          { key: 'inspection', label: '出圃检疫', icon: <FileCheck className="w-4 h-4" />, count: outbounds.length },
          { key: 'projects', label: '绿化工程供苗', icon: <Building2 className="w-4 h-4" />, count: projectDeliveries.length },
        ]}
      />

      {activeTab === 'ledger' && (
        <div className="space-y-5">
          <Card title="月度销售趋势" subtitle="2024年上半年销售额与回款对比（单位：万元）" icon={<AreaChart className="w-5 h-5" />}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A3D" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2D5A3D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7CB342" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7CB342" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECE9E2" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="销售额" stroke="#2D5A3D" strokeWidth={2} fillOpacity={1} fill="url(#salesGrad)" />
                  <Area type="monotone" dataKey="回款额" stroke="#7CB342" strokeWidth={2} fillOpacity={1} fill="url(#paidGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="订单明细台账" subtitle="所有订单的详细记录与状态追踪" icon={<FileText className="w-5 h-5" />}>
            <div className="overflow-x-auto -mx-5 -mb-5">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-sand-50 to-forest-50/30">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">订单编号</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">客户/项目</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-forest-800 uppercase tracking-wider">下单日期</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">苗木数量</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-forest-800 uppercase tracking-wider">订单金额</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-forest-800 uppercase tracking-wider">已回款</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">发票</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-forest-800 uppercase tracking-wider">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100">
                  {orders.map((o, idx) => {
                    const cust = customers.find(c => c.id === o.customerId);
                    const totalQty = o.items.reduce((s, i) => s + i.quantity, 0);
                    return (
                      <tr key={o.id} className="hover:bg-forest-50/30 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                        <td className="px-5 py-4">
                          <div className="font-mono text-sm font-bold text-forest-700">{o.orderNo}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-gray-800">{cust?.name}</div>
                          {o.projectName && <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Building2 className="w-3 h-3" />{o.projectName}</div>}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar className="w-3.5 h-3.5 text-forest-500" />{formatDate(o.orderDate)}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="font-bold text-gray-700">{totalQty.toLocaleString()}</span>
                          <span className="text-xs text-gray-500 ml-1">株</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="font-bold text-earth-600 text-lg">{formatCurrency(o.amount)}</div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="font-bold text-leaf-600">{formatCurrency(o.paidAmount)}</div>
                          <div className="mt-1 h-1.5 rounded-full bg-sand-100 overflow-hidden w-24 ml-auto">
                            <div className="h-full rounded-full bg-gradient-to-r from-leaf-400 to-forest-500" style={{ width: `${o.amount > 0 ? (o.paidAmount / o.amount) * 100 : 0}%` }} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Badge variant="custom" customClass={getStatusColor(o.invoiceStatus)}>{o.invoiceStatus}</Badge>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge variant="custom" customClass={orderStatusBadge[o.status]}>
                            {o.status === '已完成' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {o.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'inspection' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {outbounds.map((ob, idx) => {
            const order = orders.find(o => o.id === ob.orderId);
            const cust = customers.find(c => c.id === order?.customerId);
            return (
              <div
                key={ob.id}
                className="rounded-2xl bg-white shadow-card border border-sand-100 overflow-hidden hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="bg-gradient-to-r from-forest-600 via-forest-500 to-leaf-500 p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-5 h-5" />
                      <span className="font-serif font-bold">出圃检疫证书</span>
                    </div>
                    <Badge variant="custom" customClass="bg-white/20 text-white border-white/30 backdrop-blur">{ob.result}</Badge>
                  </div>
                  <div className="font-mono text-xs opacity-90">{ob.inspectionNo}</div>
                  <div className="font-serif text-xl font-bold mt-1">{ob.certificate}</div>
                </div>
                <div className="p-5 space-y-3">
                  <InfoRow icon={Truck} label="出圃日期" value={formatDate(ob.outboundDate)} />
                  <InfoRow icon={Users} label="检验员" value={ob.operator} />
                  <InfoRow icon={Building2} label="收货客户" value={cust?.name || '-'} />
                  <InfoRow icon={FileText} label="关联订单" value={order?.orderNo || '-'} />
                  {ob.driver && <InfoRow icon={Users} label="承运司机" value={ob.driver} />}
                  {ob.vehicleNo && <InfoRow icon={Truck} label="运输车辆" value={ob.vehicleNo} />}
                </div>
                <div className="mx-5 mb-5 p-4 rounded-xl bg-gradient-to-br from-forest-50 to-leaf-400/10 border border-forest-100">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-forest-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-forest-700 mb-0.5">检验结论</div>
                      <div className="text-sm text-gray-700">该批次苗木经检验，符合国家苗木出圃标准，无检疫性病虫害，准予出圃。</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-5">
          {projectDeliveries.map((p, idx) => (
            <div
              key={p.id}
              className="rounded-2xl bg-white shadow-card border border-sand-100 p-5 hover:shadow-hover transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 border-2 border-white shadow-md flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-sky-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-bold text-xl text-forest-800">{p.projectName}</h3>
                      <Badge variant="custom" customClass={getStatusColor(p.status)}>{p.status}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.customer}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(p.startDate)} ~ {formatDate(p.endDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">供苗进度</div>
                  <div className="text-3xl font-bold text-forest-700">{p.progress}%</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                  <div className="text-xs text-sky-600 font-medium mb-1">计划供苗总量</div>
                  <div className="text-2xl font-bold text-gray-800">{p.totalQuantity.toLocaleString()}<span className="text-sm ml-1 text-gray-500">株</span></div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-leaf-400/10 to-forest-50 border border-leaf-400/20">
                  <div className="text-xs text-leaf-600 font-medium mb-1">已交付数量</div>
                  <div className="text-2xl font-bold text-gray-800">{p.deliveredQuantity.toLocaleString()}<span className="text-sm ml-1 text-gray-500">株</span></div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                  <div className="text-xs text-amber-600 font-medium mb-1">剩余待交付</div>
                  <div className="text-2xl font-bold text-gray-800">{(p.totalQuantity - p.deliveredQuantity).toLocaleString()}<span className="text-sm ml-1 text-gray-500">株</span></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sand-50 border border-sand-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">整体交付进度</span>
                  <span className="text-sm font-bold text-forest-700">{p.deliveredQuantity.toLocaleString()} / {p.totalQuantity.toLocaleString()} 株</span>
                </div>
                <div className="h-4 rounded-full bg-white border border-sand-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${p.progress === 100 ? 'bg-gradient-to-r from-leaf-500 to-forest-500' : 'bg-gradient-to-r from-sky-400 via-forest-400 to-leaf-500'}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-sand-50 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-gray-500" />
    </div>
    <div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-medium text-gray-700">{value}</div>
    </div>
  </div>
);

export default Sales;
