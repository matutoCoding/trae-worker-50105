export const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const toLocalDateStr = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const formatPercent = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
};

export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    '播种期': 'bg-sky-100 text-sky-700 border-sky-200',
    '发芽期': 'bg-amber-100 text-amber-700 border-amber-200',
    '幼苗期': 'bg-leaf-400/20 text-leaf-600 border-leaf-400/30',
    '成苗期': 'bg-forest-100 text-forest-700 border-forest-200',
    '移栽期': 'bg-earth-400/20 text-earth-600 border-earth-400/30',
    '已完成': 'bg-forest-600/10 text-forest-700 border-forest-600/20',
    '待执行': 'bg-amber-100 text-amber-700 border-amber-200',
    '进行中': 'bg-sky-100 text-sky-700 border-sky-200',
    '已完成_': 'bg-forest-100 text-forest-700 border-forest-200',
    '待确认': 'bg-amber-100 text-amber-700 border-amber-200',
    '已确认': 'bg-sky-100 text-sky-700 border-sky-200',
    '备货中': 'bg-purple-100 text-purple-700 border-purple-200',
    '已发货': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '已验收': 'bg-leaf-400/20 text-leaf-600 border-leaf-400/30',
    '已取消': 'bg-red-100 text-red-700 border-red-200',
    '未开票': 'bg-amber-100 text-amber-700 border-amber-200',
    '部分开票': 'bg-sky-100 text-sky-700 border-sky-200',
    '已开票': 'bg-forest-100 text-forest-700 border-forest-200',
    '合格': 'bg-forest-100 text-forest-700 border-forest-200',
    '不合格': 'bg-red-100 text-red-700 border-red-200',
    '复检': 'bg-amber-100 text-amber-700 border-amber-200',
    '待供苗': 'bg-amber-100 text-amber-700 border-amber-200',
    '供苗中': 'bg-sky-100 text-sky-700 border-sky-200',
    '待办': 'bg-amber-100 text-amber-700 border-amber-200',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-700 border-gray-200';
};

export const getRarityColor = (rarity: string): string => {
  const colorMap: Record<string, string> = {
    '国家一级': 'bg-red-500 text-white',
    '国家二级': 'bg-amber-500 text-white',
    '省级保护': 'bg-sky-500 text-white',
    '珍稀名优': 'bg-purple-500 text-white',
    '常规品种': 'bg-gray-500 text-white',
  };
  return colorMap[rarity] || 'bg-gray-500 text-white';
};

export const getCustomerLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    'VIP': 'bg-gradient-to-r from-amber-400 to-amber-500 text-white',
    '重要': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white',
    '普通': 'bg-gradient-to-r from-gray-400 to-gray-500 text-white',
    '潜在': 'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
  };
  return colorMap[level] || 'bg-gray-400 text-white';
};

export const maskPhone = (phone: string): string => {
  if (phone.length < 11) return phone;
  return phone.replace(/(\d{3})\*{4}(\d{4})/, '$1****$2');
};
