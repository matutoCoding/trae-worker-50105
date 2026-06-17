import {
  Species, Batch, GraftingRecord, PestInfo, PestTreatment,
  ScheduleItem, Inventory, Customer, Order, Outbound,
  ProjectDelivery, TraceRecord, ContactLog
} from '@/types';

const IMG_BASE = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?image_size=square';

export const speciesList: Species[] = [
  {
    id: 's1', name: '银杏', alias: '白果树、公孙树', family: '银杏科银杏属',
    origin: '中国特产', habit: '喜光，耐寒，深根性，对土壤要求不严',
    image: `${IMG_BASE}&prompt=beautiful%20ginkgo%20biloba%20tree%20with%20golden%20leaves%20in%20autumn%20garden`,
    rarity: '国家一级', growthCycle: '实生苗20年结果，嫁接苗5-8年结果'
  },
  {
    id: 's2', name: '水杉', alias: '活化石', family: '杉科水杉属',
    origin: '中国四川、湖北、湖南', habit: '喜光，耐水湿，生长快',
    image: `${IMG_BASE}&prompt=metasequoia%20glyptostroboides%20dawn%20redwood%20tree%20tall%20straight%20forest`,
    rarity: '国家一级', growthCycle: '速生树种，年高生长量可达1-1.5米'
  },
  {
    id: 's3', name: '珙桐', alias: '鸽子树', family: '蓝果树科珙桐属',
    origin: '中国西南地区', habit: '喜半阴，喜温凉湿润气候',
    image: `${IMG_BASE}&prompt=dove%20tree%20davidia%20involucrata%20with%20white%20bracts%20flowers%20blooming`,
    rarity: '国家一级', growthCycle: '实生苗需10年以上开花'
  },
  {
    id: 's4', name: '红豆杉', alias: '紫杉、赤柏松', family: '红豆杉科红豆杉属',
    origin: '中国南北各地', habit: '耐阴，喜湿润，生长缓慢',
    image: `${IMG_BASE}&prompt=chinese%20yew%20taxus%20chinensis%20tree%20with%20red%20arils%20berries`,
    rarity: '国家一级', growthCycle: '生长极慢，直径年增长仅0.3-0.5cm'
  },
  {
    id: 's5', name: '金丝楠', alias: '桢楠', family: '樟科楠木属',
    origin: '中国四川、贵州、湖北', habit: '耐阴，喜温暖湿润',
    image: `${IMG_BASE}&prompt=phoebe%20zhennan%20golden%20camphor%20tree%20lush%20green%20leaves%20forest`,
    rarity: '国家二级', growthCycle: '珍贵用材树种，需50年以上成材'
  },
  {
    id: 's6', name: '鹅掌楸', alias: '马褂木', family: '木兰科鹅掌楸属',
    origin: '中国长江流域以南', habit: '喜光，喜温暖湿润',
    image: `${IMG_BASE}&prompt=liriodendron%20chinense%20tulip%20tree%20chinese%20tuliptree%20yellow%20flowers`,
    rarity: '国家二级', growthCycle: '速生，15-20年可开花结实'
  },
  {
    id: 's7', name: '红枫', alias: '红叶羽毛枫', family: '槭树科槭树属',
    origin: '中国长江流域', habit: '喜温暖湿润，耐半阴',
    image: `${IMG_BASE}&prompt=japanese%20red%20maple%20acer%20palmatum%20atropurpureum%20crimson%20leaves`,
    rarity: '珍稀名优', growthCycle: '嫁接苗3年成型，5年可出圃'
  },
  {
    id: 's8', name: '罗汉松', alias: '土杉', family: '罗汉松科罗汉松属',
    origin: '中国长江以南', habit: '喜温暖湿润，耐修剪',
    image: `${IMG_BASE}&prompt=podocarpus%20macrophyllus%20buddhist%20pine%20yew%20plum%20pine%20tree`,
    rarity: '珍稀名优', growthCycle: '造型苗需5-10年培育'
  },
];

export const batchList: Batch[] = [
  { id: 'b1', speciesId: 's1', batchNo: 'YX-2024-03-A', sowingDate: '2024-03-15', quantity: 5000, germinated: 4320, survived: 4150, location: 'A区温室1号', operator: '张工', status: '幼苗期', stage: '发芽后45天' },
  { id: 'b2', speciesId: 's1', batchNo: 'YX-2024-04-B', sowingDate: '2024-04-02', quantity: 3000, germinated: 2650, survived: 2580, location: 'A区温室2号', operator: '张工', status: '发芽期', stage: '发芽后20天' },
  { id: 'b3', speciesId: 's2', batchNo: 'SS-2024-02-A', sowingDate: '2024-02-20', quantity: 8000, germinated: 7520, survived: 7380, location: 'B区大苗区', operator: '李工', status: '成苗期', stage: '苗高30-45cm' },
  { id: 'b4', speciesId: 's3', batchNo: 'GT-2024-03-A', sowingDate: '2024-03-08', quantity: 1500, germinated: 1080, survived: 920, location: 'C区阴棚1号', operator: '王工', status: '幼苗期', stage: '发芽后50天' },
  { id: 'b5', speciesId: 's4', batchNo: 'HDS-2023-10-A', sowingDate: '2023-10-12', quantity: 2000, germinated: 1620, survived: 1450, location: 'D区驯化区', operator: '赵工', status: '移栽期', stage: '准备移栽至营养钵' },
  { id: 'b6', speciesId: 's5', batchNo: 'JSN-2024-01-A', sowingDate: '2024-01-25', quantity: 1200, germinated: 980, survived: 910, location: 'A区温室3号', operator: '张工', status: '幼苗期', stage: '发芽后70天' },
  { id: 'b7', speciesId: 's7', batchNo: 'HF-2024-05-A', sowingDate: '2024-05-10', quantity: 2500, germinated: 0, survived: 0, location: 'A区温室1号', operator: '李工', status: '播种期', stage: '催芽中' },
  { id: 'b8', speciesId: 's8', batchNo: 'LHS-2023-12-A', sowingDate: '2023-12-08', quantity: 3500, germinated: 3120, survived: 2980, location: 'B区造型区', operator: '王工', status: '成苗期', stage: '造型修剪第二期' },
];

export const graftingList: GraftingRecord[] = [
  { id: 'g1', batchId: 'b8', rootstock: '罗汉松实生苗', scion: '米叶罗汉松', method: '枝接', operationDate: '2024-03-20', quantity: 500, survived: 468, operator: '刘师傅', affinity: '优', notes: '春季枝接，套袋保湿' },
  { id: 'g2', batchId: 'b8', rootstock: '罗汉松实生苗', scion: '雀舌罗汉松', method: '芽接', operationDate: '2024-04-15', quantity: 300, survived: 272, operator: '刘师傅', affinity: '优', notes: 'T形芽接，成活率良好' },
  { id: 'g3', batchId: 'b7', rootstock: '青枫', scion: '日本红枫', method: '切接', operationDate: '2024-03-10', quantity: 800, survived: 732, operator: '陈师傅', affinity: '良', notes: '早春切接，接蜡封口' },
  { id: 'g4', batchId: 'b7', rootstock: '鸡爪槭', scion: '中国红枫', method: '劈接', operationDate: '2024-03-25', quantity: 400, survived: 336, operator: '陈师傅', affinity: '优', notes: '劈接深度适中，绑扎严密' },
  { id: 'g5', batchId: 'b3', rootstock: '普通水杉', scion: '金叶水杉', method: '枝接', operationDate: '2024-04-05', quantity: 1200, survived: 1056, operator: '李工', affinity: '良', notes: '金叶品种嫁接，注意遮阴' },
];

export const pestInfoList: PestInfo[] = [
  { id: 'p1', name: '炭疽病', type: '病害', symptoms: '叶片出现圆形或椭圆形褐色病斑，中央灰白色，边缘红褐色', image: `${IMG_BASE}&prompt=plant%20anthracnose%20disease%20brown%20spots%20on%20leaves%20botanical`, treatment: '清除病叶销毁，喷施多菌灵800倍液或百菌清600倍液，7-10天一次，连续2-3次', severity: '中度' },
  { id: 'p2', name: '根腐病', type: '病害', symptoms: '根部腐烂，表皮脱落，木质部变褐，植株萎蔫黄化', image: `${IMG_BASE}&prompt=plant%20root%20rot%20disease%20decayed%20brown%20roots%20seedling`, treatment: '改善排水，拔除病株，土壤消毒用恶霉灵，灌根处理', severity: '重度' },
  { id: 'p3', name: '蚜虫', type: '虫害', symptoms: '嫩叶嫩梢聚集，刺吸汁液，叶片卷曲，分泌蜜露', image: `${IMG_BASE}&prompt=aphids%20greenfly%20plant%20lice%20on%20leaf%20macro%20photography`, treatment: '喷施吡虫啉1500倍液，或啶虫脒2000倍液，保护天敌瓢虫', severity: '轻度' },
  { id: 'p4', name: '红蜘蛛', type: '虫害', symptoms: '叶片背面出现黄白色小点，严重时叶片枯黄脱落', image: `${IMG_BASE}&prompt=red%20spider%20mite%20tetranychus%20damage%20on%20leaf%20microscope`, treatment: '喷施阿维菌素3000倍液或哒螨灵2000倍液，叶背重点喷施', severity: '中度' },
  { id: 'p5', name: '天牛', type: '虫害', symptoms: '树干蛀孔，排出木屑虫粪，枝条枯死', image: `${IMG_BASE}&prompt=longhorn%20beetle%20cerambycidae%20borer%20insect%20on%20tree%20trunk`, treatment: '人工捕杀成虫，钩杀幼虫，注射敌敌畏药液封堵蛀孔', severity: '重度' },
  { id: 'p6', name: '立枯病', type: '病害', symptoms: '幼苗茎基部变褐收缩，幼苗倒伏死亡', image: `${IMG_BASE}&prompt=damping%20off%20seedling%20blight%20disease%20wilted%20young%20plants`, treatment: '土壤消毒，控制湿度，喷施代森锰锌600倍液或恶霉灵', severity: '重度' },
];

export const pestTreatmentList: PestTreatment[] = [
  { id: 't1', batchId: 'b1', pestName: '蚜虫', pesticide: '10%吡虫啉可湿性粉剂', applyDate: '2024-05-10', dosage: '1500倍液喷雾', operator: '王师傅', safeInterval: 14, status: '已完成' },
  { id: 't2', batchId: 'b4', pestName: '炭疽病', pesticide: '50%多菌灵可湿性粉剂', applyDate: '2024-05-15', dosage: '800倍液喷雾', operator: '王师傅', safeInterval: 21, status: '已完成' },
  { id: 't3', batchId: 'b3', pestName: '红蜘蛛', pesticide: '1.8%阿维菌素乳油', applyDate: '2024-06-05', dosage: '3000倍液喷雾', operator: '李师傅', safeInterval: 14, status: '已完成' },
  { id: 't4', batchId: 'b6', pestName: '立枯病', pesticide: '70%恶霉灵可湿性粉剂', applyDate: '2024-06-18', dosage: '1500倍液灌根', operator: '张师傅', safeInterval: 28, status: '进行中' },
  { id: 't5', batchId: 'b5', pestName: '根腐病', pesticide: '50%多菌灵可湿性粉剂', applyDate: '2024-06-22', dosage: '600倍液灌根', operator: '赵师傅', safeInterval: 21, status: '待执行' },
  { id: 't6', batchId: 'b2', pestName: '蚜虫', pesticide: '10%吡虫啉可湿性粉剂', applyDate: '2024-06-20', dosage: '1500倍液喷雾', operator: '王师傅', safeInterval: 14, status: '待执行' },
];

export const scheduleList: ScheduleItem[] = [
  { id: 'sc1', date: '2024-06-17', title: 'A区温室浇水', type: '浇水', status: '已完成' },
  { id: 'sc2', date: '2024-06-18', title: 'B区喷药防治红蜘蛛', type: '喷药', status: '已完成', batchNo: 'SS-2024-02-A' },
  { id: 'sc3', date: '2024-06-19', title: 'C区阴棚检查温度', type: '检查', status: '待办' },
  { id: 'sc4', date: '2024-06-20', title: 'D区移栽苗浇水', type: '浇水', status: '待办', batchNo: 'HDS-2023-10-A' },
  { id: 'sc5', date: '2024-06-20', title: 'A区蚜虫防治', type: '喷药', status: '待办', batchNo: 'YX-2024-04-B' },
  { id: 'sc6', date: '2024-06-21', title: 'B区施缓释肥', type: '施肥', status: '待办' },
  { id: 'sc7', date: '2024-06-22', title: 'C区炭疽病喷药', type: '喷药', status: '待办', batchNo: 'GT-2024-03-A' },
  { id: 'sc8', date: '2024-06-22', title: 'E区根腐病灌根', type: '喷药', status: '待办', batchNo: 'HDS-2023-10-A' },
  { id: 'sc9', date: '2024-06-24', title: '造型苗修剪', type: '修剪', status: '待办', batchNo: 'LHS-2023-12-A' },
  { id: 'sc10', date: '2024-06-25', title: '全园区巡查', type: '检查', status: '待办' },
  { id: 'sc11', date: '2024-06-26', title: '嫁接苗解绑检查', type: '检查', status: '待办' },
  { id: 'sc12', date: '2024-06-28', title: '温室通风降温', type: '浇水', status: '待办' },
];

export const inventoryList: Inventory[] = [
  { id: 'i1', speciesId: 's1', grade: '精品级', dbh: 12, height: 450, crown: 280, quantity: 120, area: '东区-精品园', price: 6800 },
  { id: 'i2', speciesId: 's1', grade: '一级', dbh: 8, height: 320, crown: 200, quantity: 350, area: '东区-A块', price: 2200 },
  { id: 'i3', speciesId: 's1', grade: '二级', dbh: 5, height: 220, crown: 140, quantity: 680, area: '东区-B块', price: 580 },
  { id: 'i4', speciesId: 's2', grade: '一级', dbh: 10, height: 600, crown: 220, quantity: 200, area: '西区-大道树', price: 1800 },
  { id: 'i5', speciesId: 's2', grade: '二级', dbh: 6, height: 400, crown: 150, quantity: 880, area: '西区-B块', price: 360 },
  { id: 'i6', speciesId: 's3', grade: '精品级', dbh: 8, height: 350, crown: 220, quantity: 45, area: '南区-珍稀园', price: 12000 },
  { id: 'i7', speciesId: 's4', grade: '一级', dbh: 4, height: 180, crown: 120, quantity: 320, area: '南区-药用区', price: 980 },
  { id: 'i8', speciesId: 's5', grade: '精品级', dbh: 10, height: 400, crown: 240, quantity: 60, area: '南区-名木区', price: 8500 },
  { id: 'i9', speciesId: 's7', grade: '精品级', dbh: 6, height: 200, crown: 180, quantity: 150, area: '北区-彩叶区', price: 1680 },
  { id: 'i10', speciesId: 's8', grade: '精品级', dbh: 8, height: 250, crown: 200, quantity: 80, area: '北区-造型园', price: 3800 },
  { id: 'i11', speciesId: 's8', grade: '一级', dbh: 5, height: 180, crown: 140, quantity: 420, area: '北区-B块', price: 680 },
  { id: 'i12', speciesId: 's6', grade: '一级', dbh: 7, height: 380, crown: 230, quantity: 180, area: '东区-C块', price: 1450 },
];

export const customerList: Customer[] = [
  { id: 'c1', name: '绿源市政园林工程有限公司', type: '市政单位', level: 'VIP', contact: '王总', phone: '138****6688', address: '北京市朝阳区建国路88号', totalOrders: 28, totalAmount: 3280000, registerDate: '2020-03-15' },
  { id: 'c2', name: '恒大地产集团绿化部', type: '房地产', level: 'VIP', contact: '李经理', phone: '139****5566', address: '广州市天河区黄埔大道西78号', totalOrders: 15, totalAmount: 5680000, registerDate: '2021-06-20' },
  { id: 'c3', name: '绿城景观设计工程公司', type: '绿化工程', level: '重要', contact: '张工', phone: '137****2233', address: '杭州市西湖区文三路259号', totalOrders: 42, totalAmount: 2180000, registerDate: '2019-08-10' },
  { id: 'c4', name: '苏州园林发展股份有限公司', type: '绿化工程', level: '重要', contact: '陈总', phone: '136****8899', address: '苏州市姑苏区东北街202号', totalOrders: 18, totalAmount: 4560000, registerDate: '2020-11-05' },
  { id: 'c5', name: '华东苗木批发中心', type: '苗木经销商', level: '重要', contact: '刘老板', phone: '135****7788', address: '常州市武进区夏溪镇花木市场', totalOrders: 65, totalAmount: 1890000, registerDate: '2018-05-22' },
  { id: 'c6', name: '深圳万科物业景观部', type: '房地产', level: '普通', contact: '周经理', phone: '138****1122', address: '深圳市盐田区大梅沙环梅路33号', totalOrders: 8, totalAmount: 580000, registerDate: '2023-02-18' },
  { id: 'c7', name: '上海迪士尼度假区绿化部', type: '绿化工程', level: 'VIP', contact: '吴总监', phone: '139****3344', address: '上海市浦东新区申迪西路753号', totalOrders: 12, totalAmount: 8900000, registerDate: '2022-04-30' },
  { id: 'c8', name: '成都私人别墅庭院', type: '个人客户', level: '潜在', contact: '赵先生', phone: '136****9900', address: '成都市双流区牧马山别墅区', totalOrders: 2, totalAmount: 128000, registerDate: '2024-03-12' },
];

export const orderList: Order[] = [
  { id: 'o1', customerId: 'c7', orderNo: 'DD20240615001', orderDate: '2024-06-15', amount: 1280000, status: '备货中', paidAmount: 384000, invoiceStatus: '未开票', projectName: '迪士尼扩建区景观绿化', items: [
    { speciesId: 's1', speciesName: '银杏', spec: '地径12cm，精品级', quantity: 80, unitPrice: 6800, subtotal: 544000 },
    { speciesId: 's3', speciesName: '珙桐', spec: '地径8cm，精品级', quantity: 20, unitPrice: 12000, subtotal: 240000 },
    { speciesId: 's5', speciesName: '金丝楠', spec: '地径10cm，精品级', quantity: 50, unitPrice: 8500, subtotal: 425000 },
    { speciesId: 's8', speciesName: '罗汉松', spec: '地径8cm，造型精品', quantity: 10, unitPrice: 7100, subtotal: 71000 },
  ]},
  { id: 'o2', customerId: 'c2', orderNo: 'DD20240612002', orderDate: '2024-06-12', amount: 680000, status: '已发货', paidAmount: 408000, invoiceStatus: '部分开票', projectName: '恒大御景半岛三期', items: [
    { speciesId: 's2', speciesName: '水杉', spec: '地径10cm，一级', quantity: 150, unitPrice: 1800, subtotal: 270000 },
    { speciesId: 's1', speciesName: '银杏', spec: '地径8cm，一级', quantity: 120, unitPrice: 2200, subtotal: 264000 },
    { speciesId: 's6', speciesName: '鹅掌楸', spec: '地径7cm，一级', quantity: 100, unitPrice: 1460, subtotal: 146000 },
  ]},
  { id: 'o3', customerId: 'c4', orderNo: 'DD20240610003', orderDate: '2024-06-10', amount: 560000, status: '已验收', paidAmount: 560000, invoiceStatus: '已开票', projectName: '苏州古城保护景观提升', items: [
    { speciesId: 's7', speciesName: '红枫', spec: '地径6cm，精品级', quantity: 200, unitPrice: 1680, subtotal: 336000 },
    { speciesId: 's8', speciesName: '罗汉松', spec: '地径5cm，一级', quantity: 300, unitPrice: 680, subtotal: 204000 },
    { speciesId: 's1', speciesName: '银杏', spec: '地径5cm，二级', quantity: 35, unitPrice: 571, subtotal: 20000 },
  ]},
  { id: 'o4', customerId: 'c1', orderNo: 'DD20240608004', orderDate: '2024-06-08', amount: 890000, status: '备货中', paidAmount: 267000, invoiceStatus: '未开票', projectName: '朝阳公园扩建工程', items: [
    { speciesId: 's2', speciesName: '水杉', spec: '地径6cm，二级', quantity: 500, unitPrice: 360, subtotal: 180000 },
    { speciesId: 's1', speciesName: '银杏', spec: '地径8cm，一级', quantity: 200, unitPrice: 2200, subtotal: 440000 },
    { speciesId: 's6', speciesName: '鹅掌楸', spec: '地径7cm，一级', quantity: 180, unitPrice: 1500, subtotal: 270000 },
  ]},
  { id: 'o5', customerId: 'c3', orderNo: 'DD20240605005', orderDate: '2024-06-05', amount: 320000, status: '待确认', paidAmount: 0, invoiceStatus: '未开票', projectName: '杭州西溪湿地景观带', items: [
    { speciesId: 's7', speciesName: '红枫', spec: '地径6cm，精品级', quantity: 100, unitPrice: 1680, subtotal: 168000 },
    { speciesId: 's2', speciesName: '水杉', spec: '地径10cm，一级', quantity: 80, unitPrice: 1800, subtotal: 144000 },
    { speciesId: 's8', speciesName: '罗汉松', spec: '地径5cm，一级', quantity: 12, unitPrice: 667, subtotal: 8000 },
  ]},
  { id: 'o6', customerId: 'c5', orderNo: 'DD20240602006', orderDate: '2024-06-02', amount: 180000, status: '已完成', paidAmount: 180000, invoiceStatus: '已开票', items: [
    { speciesId: 's4', speciesName: '红豆杉', spec: '地径4cm，一级', quantity: 150, unitPrice: 980, subtotal: 147000 },
    { speciesId: 's1', speciesName: '银杏', spec: '地径5cm，二级', quantity: 50, unitPrice: 660, subtotal: 33000 },
  ]},
];

export const outboundList: Outbound[] = [
  { id: 'ob1', orderId: 'o3', inspectionNo: 'JY20240612001', outboundDate: '2024-06-12', result: '合格', certificate: '苗木检验检疫合格证-2024-0612-001', operator: '王检验员', driver: '张师傅', vehicleNo: '苏E·A8888' },
  { id: 'ob2', orderId: 'o2', inspectionNo: 'JY20240614002', outboundDate: '2024-06-14', result: '合格', certificate: '苗木检验检疫合格证-2024-0614-002', operator: '王检验员', driver: '李师傅', vehicleNo: '粤A·B6666' },
  { id: 'ob3', orderId: 'o6', inspectionNo: 'JY20240605003', outboundDate: '2024-06-05', result: '合格', certificate: '苗木检验检疫合格证-2024-0605-003', operator: '李检验员', driver: '王师傅', vehicleNo: '苏D·C9999' },
];

export const projectDeliveryList: ProjectDelivery[] = [
  { id: 'pd1', projectName: '上海迪士尼扩建区景观绿化', customer: '上海迪士尼度假区绿化部', location: '上海市浦东新区', startDate: '2024-06-10', endDate: '2024-07-20', totalQuantity: 160, deliveredQuantity: 65, progress: 40, status: '供苗中' },
  { id: 'pd2', projectName: '恒大御景半岛三期景观', customer: '恒大地产集团绿化部', location: '广州市天河区', startDate: '2024-06-08', endDate: '2024-06-25', totalQuantity: 370, deliveredQuantity: 370, progress: 100, status: '已完成' },
  { id: 'pd3', projectName: '苏州古城保护景观提升', customer: '苏州园林发展股份有限公司', location: '苏州市姑苏区', startDate: '2024-06-05', endDate: '2024-06-12', totalQuantity: 535, deliveredQuantity: 535, progress: 100, status: '已完成' },
  { id: 'pd4', projectName: '朝阳公园扩建工程', customer: '绿源市政园林工程有限公司', location: '北京市朝阳区', startDate: '2024-06-12', endDate: '2024-07-15', totalQuantity: 880, deliveredQuantity: 120, progress: 14, status: '供苗中' },
  { id: 'pd5', projectName: '杭州西溪湿地景观带', customer: '绿城景观设计工程公司', location: '杭州市西湖区', startDate: '2024-06-15', endDate: '2024-07-10', totalQuantity: 192, deliveredQuantity: 0, progress: 0, status: '待供苗' },
];

export const contactLogList: ContactLog[] = [
  { id: 'cl1', customerId: 'c7', date: '2024-06-15', type: '拜访', content: '现场踏勘迪士尼扩建区域，确认苗木选型和种植点位，客户重点关注珙桐和金丝楠的供应时间', followUp: '6月20日前提交详细供苗计划', operator: '张经理' },
  { id: 'cl2', customerId: 'c2', date: '2024-06-14', type: '电话', content: '确认三期项目第二批苗木发货时间，客户要求提前2天通知', followUp: '安排6月18日发车', operator: '李经理' },
  { id: 'cl3', customerId: 'c4', date: '2024-06-12', type: '微信', content: '苏州项目验收完成，对红枫和罗汉松质量非常满意，追加20棵精品红枫询价', followUp: '已报价1680元/棵，等客户确认', operator: '王经理' },
  { id: 'cl4', customerId: 'c1', date: '2024-06-10', type: '会议', content: '朝阳公园项目启动会，确定苗木分三批供应，首批6月18日', followUp: '准备检疫文件和装车方案', operator: '张经理' },
  { id: 'cl5', customerId: 'c3', date: '2024-06-08', type: '电话', content: '西溪湿地项目初定方案，预算约35万，等客户内部审批', followUp: '6月18日跟进审批进度', operator: '李经理' },
];

export const traceRecordList: TraceRecord[] = [
  {
    id: 'tr1', traceNo: 'TRYX2021S001286', speciesId: 's1', speciesName: '银杏',
    batchNo: 'YX-2021-03-A', grade: '精品级', spec: '地径12cm，高度4.5m',
    lifecycle: [
      { stage: '播种', date: '2021-03-15', description: '温室播种，种子5000粒', operator: '张工', location: 'A区温室1号' },
      { stage: '发芽', date: '2021-04-20', description: '发芽4320株，发芽率86.4%', operator: '张工', location: 'A区温室1号' },
      { stage: '移栽', date: '2021-07-10', description: '移栽至营养钵，成活4150株', operator: '李工', location: 'A区练苗区' },
      { stage: '定植', date: '2022-03-20', description: '大田定植，株行距2x3m', operator: '李工', location: '东区-精品园' },
      { stage: '病虫防治', date: '2022-06-15', description: '喷施多菌灵防治炭疽病', operator: '王师傅', location: '东区-精品园' },
      { stage: '修剪造型', date: '2023-11-20', description: '冬季修剪整形，培育精品树形', operator: '刘师傅', location: '东区-精品园' },
      { stage: '出圃检疫', date: '2024-06-12', result: '' as any, description: '检疫合格，取得检疫证书', operator: '王检验员', location: '检疫站' },
      { stage: '销售配送', date: '2024-06-13', description: '发往苏州古城保护项目', operator: '调度中心', location: '基地装车' },
    ],
    destination: '苏州古城保护景观提升工程',
    customer: '苏州园林发展股份有限公司',
    plantLocation: '苏州市姑苏区平江历史街区'
  },
  {
    id: 'tr2', traceNo: 'TRSS2022S003521', speciesId: 's2', speciesName: '水杉',
    batchNo: 'SS-2022-02-A', grade: '一级', spec: '地径10cm，高度6.0m',
    lifecycle: [
      { stage: '播种', date: '2022-02-20', description: '温室沙床播种，种子8000粒', operator: '李工', location: 'B区温室' },
      { stage: '发芽', date: '2022-03-28', description: '发芽7520株，发芽率94%', operator: '李工', location: 'B区温室' },
      { stage: '移栽', date: '2022-05-15', description: '移栽至大田，株行距1x1.5m', operator: '王工', location: '西区-育苗区' },
      { stage: '病虫防治', date: '2023-05-20', description: '喷施阿维菌素防治红蜘蛛', operator: '李师傅', location: '西区-育苗区' },
      { stage: '移栽', date: '2023-11-10', description: '扩距移栽至2x3m大苗区', operator: '李工', location: '西区-大道树' },
      { stage: '出圃检疫', date: '2024-06-14', result: '' as any, description: '检疫合格，取得检疫证书', operator: '王检验员', location: '检疫站' },
      { stage: '销售配送', date: '2024-06-15', description: '发往恒大御景半岛项目', operator: '调度中心', location: '基地装车' },
    ],
    destination: '恒大御景半岛三期景观工程',
    customer: '恒大地产集团绿化部',
    plantLocation: '广州市天河区御景半岛小区'
  },
  {
    id: 'tr3', traceNo: 'TRHF2022G001085', speciesId: 's7', speciesName: '红枫',
    batchNo: 'HF-2022-JJ-A', grade: '精品级', spec: '地径6cm，高度2.0m',
    lifecycle: [
      { stage: '砧木培育', date: '2021-05-10', description: '青枫砧木播种育苗', operator: '陈师傅', location: '北区育苗区' },
      { stage: '嫁接', date: '2022-03-15', description: '日本红枫切接，数量800株', operator: '陈师傅', location: '北区嫁接区' },
      { stage: '成活检查', date: '2022-04-25', description: '成活732株，成活率91.5%', operator: '陈师傅', location: '北区嫁接区' },
      { stage: '移栽', date: '2022-10-20', description: '移栽至大苗区，株行距1.5x2m', operator: '王工', location: '北区-彩叶区' },
      { stage: '修剪造型', date: '2023-12-10', description: '定干整形，培育自然圆头形', operator: '刘师傅', location: '北区-彩叶区' },
      { stage: '病虫防治', date: '2024-04-20', description: '喷施吡虫啉防治天牛', operator: '王师傅', location: '北区-彩叶区' },
      { stage: '出圃检疫', date: '2024-06-10', result: '' as any, description: '检疫合格，取得检疫证书', operator: '李检验员', location: '检疫站' },
      { stage: '销售配送', date: '2024-06-11', description: '发往苏州古城保护项目', operator: '调度中心', location: '基地装车' },
    ],
    destination: '苏州古城保护景观提升工程',
    customer: '苏州园林发展股份有限公司',
    plantLocation: '苏州市姑苏区拙政园周边'
  },
];
