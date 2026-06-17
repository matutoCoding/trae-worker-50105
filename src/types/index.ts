export interface Species {
  id: string;
  name: string;
  alias: string;
  family: string;
  origin: string;
  habit: string;
  image: string;
  rarity: '国家一级' | '国家二级' | '省级保护' | '珍稀名优' | '常规品种';
  growthCycle: string;
}

export interface Batch {
  id: string;
  speciesId: string;
  batchNo: string;
  sowingDate: string;
  quantity: number;
  germinated: number;
  survived: number;
  location: string;
  operator: string;
  status: '播种期' | '发芽期' | '幼苗期' | '成苗期' | '移栽期' | '已完成';
  stage: string;
}

export interface GraftingRecord {
  id: string;
  batchId: string;
  rootstock: string;
  scion: string;
  method: '枝接' | '芽接' | '切接' | '劈接';
  operationDate: string;
  quantity: number;
  survived: number;
  operator: string;
  affinity: '优' | '良' | '中' | '差';
  notes: string;
}

export interface PestInfo {
  id: string;
  name: string;
  type: '病害' | '虫害';
  symptoms: string;
  image: string;
  treatment: string;
  severity: '轻度' | '中度' | '重度';
}

export interface PestTreatment {
  id: string;
  batchId: string;
  pestName: string;
  pesticide: string;
  applyDate: string;
  dosage: string;
  operator: string;
  safeInterval: number;
  status: '待执行' | '进行中' | '已完成';
}

export interface ScheduleItem {
  id: string;
  date: string;
  title: string;
  type: '喷药' | '施肥' | '修剪' | '浇水' | '检查';
  status: '待办' | '已完成';
  batchNo?: string;
}

export interface Inventory {
  id: string;
  speciesId: string;
  grade: '精品级' | '一级' | '二级' | '三级';
  dbh: number;
  height: number;
  crown: number;
  quantity: number;
  area: string;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  type: '绿化工程' | '房地产' | '市政单位' | '苗木经销商' | '个人客户';
  level: 'VIP' | '重要' | '普通' | '潜在';
  contact: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalAmount: number;
  registerDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  orderNo: string;
  orderDate: string;
  amount: number;
  status: '待确认' | '已确认' | '备货中' | '已发货' | '已验收' | '已完成' | '已取消';
  items: OrderItem[];
  paidAmount: number;
  invoiceStatus: '未开票' | '部分开票' | '已开票';
  projectName?: string;
}

export interface OrderItem {
  speciesId: string;
  speciesName: string;
  spec: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Outbound {
  id: string;
  orderId: string;
  inspectionNo: string;
  outboundDate: string;
  result: '合格' | '不合格' | '复检';
  certificate: string;
  operator: string;
  driver?: string;
  vehicleNo?: string;
}

export interface ProjectDelivery {
  id: string;
  projectName: string;
  customerId: string;
  customer: string;
  location: string;
  startDate: string;
  endDate: string;
  totalQuantity: number;
  deliveredQuantity: number;
  progress: number;
  status: '待供苗' | '供苗中' | '已完成';
  image?: string;
}

export interface TraceRecord {
  id: string;
  traceNo: string;
  speciesId: string;
  speciesName: string;
  batchNo: string;
  lifecycle: LifecycleNode[];
  destination: string;
  customer: string;
  plantLocation: string;
  grade: string;
  spec: string;
}

export interface LifecycleNode {
  stage: string;
  date: string;
  description: string;
  operator?: string;
  location?: string;
  result?: string;
}

export interface ContactLog {
  id: string;
  customerId: string;
  date: string;
  type: '电话' | '拜访' | '微信' | '邮件' | '会议';
  content: string;
  followUp?: string;
  operator: string;
}
