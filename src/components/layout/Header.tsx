import React from 'react';
import { Bell, Calendar, Leaf, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';
import { formatCurrency } from '@/utils/formatters';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  ledger: { title: '苗木台账', subtitle: '品种档案 · 规格分级 · 库存统计' },
  seedling: { title: '育苗管理', subtitle: '播种批次 · 成活率统计 · 养护指导' },
  grafting: { title: '嫁接记录', subtitle: '嫁接组合 · 操作日志 · 成活分析' },
  pest: { title: '病虫防治', subtitle: '病虫害图鉴 · 防治排期 · 用药记录' },
  sales: { title: '出圃销售', subtitle: '出圃检疫 · 工程供苗 · 销售台账' },
  customer: { title: '客户管理', subtitle: '客户档案 · 订单管理 · 联系记录' },
  trace: { title: '溯源查询', subtitle: '编号查询 · 生命周期 · 去向追踪' },
};

const Header: React.FC = () => {
  const { currentPage, orders, customers, inventories, schedules } = useStore();
  const pageInfo = pageTitles[currentPage] || pageTitles.ledger;
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  const totalInventory = inventories.reduce((sum, i) => sum + i.quantity, 0);
  const totalOrderAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingSchedules = schedules.filter(s => s.status === '待办').length;
  const vipCustomers = customers.filter(c => c.level === 'VIP').length;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-sand-200 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-2xl font-bold text-forest-800 leading-tight">{pageInfo.title}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              {today}
              <span className="mx-2 text-gray-300">|</span>
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3">
            <QuickStat icon={<Leaf className="w-4 h-4" />} label="在库苗木" value={`${totalInventory.toLocaleString()}株`} color="forest" />
            <QuickStat icon={<TrendingUp className="w-4 h-4" />} label="销售总额" value={formatCurrency(totalOrderAmount)} color="leaf" />
            <QuickStat icon={<Bell className="w-4 h-4" />} label="待办任务" value={`${pendingSchedules}项`} color="amber" badge={pendingSchedules} />
            <QuickStat icon={<span className="text-xs font-bold">VIP</span>} label="VIP客户" value={`${vipCustomers}家`} color="earth" />
          </div>

          <button className="relative w-10 h-10 rounded-xl bg-sand-50 hover:bg-sand-100 flex items-center justify-center text-gray-600 transition-colors group">
            <Bell className="w-5 h-5 group-hover:text-forest-600 transition-colors" />
            {pendingSchedules > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-pulse-slow">
                {pendingSchedules}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

interface QuickStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'forest' | 'leaf' | 'earth' | 'amber';
  badge?: number;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon, label, value, color }) => {
  const colorClasses: Record<string, string> = {
    forest: 'bg-forest-50 text-forest-600 border-forest-100',
    leaf: 'bg-leaf-400/10 text-leaf-600 border-leaf-400/20',
    earth: 'bg-earth-400/10 text-earth-600 border-earth-400/20',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${colorClasses[color]} hover:shadow-soft transition-all duration-300 cursor-default`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="leading-tight">
        <div className="text-xs opacity-75">{label}</div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
};

export default Header;
