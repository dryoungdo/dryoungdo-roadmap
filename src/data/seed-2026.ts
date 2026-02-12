import type { RoadmapItem } from '../types';

export const SEED_ITEMS: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // EXPANSION - P0 Projects
  {
    title: 'สาขา 3 - สำรวจและเปิดสาขาใหม่',
    subtitle: 'ขยายสาขาที่ 3 ในกรุงเทพ',
    department: 'expansion',
    priority: 'P0',
    status: 'in_progress',
    owner: 'CEO',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    progress: 35,
    milestones: [
      { id: 'ms-1', title: 'เซ็นสัญญาเช่า', date: '2026-03-31', completed: false },
      { id: 'ms-2', title: 'ตกแต่งและติดตั้งอุปกรณ์', date: '2026-05-31', completed: false },
      { id: 'ms-3', title: 'เปิดสาขา', date: '2026-06-30', completed: false }
    ],
    dependencies: [],
    notes: 'เป้าหมาย: เปิดสาขาที่ 3 ภายในครึ่งปีแรก'
  },
  {
    title: 'สาขา 4 - ขยายสาขาที่ 4',
    subtitle: 'วางแผนขยายสาขาใหม่',
    department: 'expansion',
    priority: 'P1',
    status: 'planned',
    owner: 'CEO',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    progress: 0,
    milestones: [
      { id: 'ms-4', title: 'สำรวจทำเล', date: '2026-08-31', completed: false },
      { id: 'ms-5', title: 'เจรจาสัญญา', date: '2026-10-31', completed: false },
      { id: 'ms-6', title: 'เปิดสาขา', date: '2026-12-31', completed: false }
    ],
    dependencies: [],
    notes: 'รอการวิเคราะห์ผลสาขา 3 ก่อน'
  },
  {
    title: 'สาขา 5 - ขยายสาขาที่ 5',
    subtitle: 'วางแผนระยะยาว',
    department: 'expansion',
    priority: 'P2',
    status: 'planned',
    owner: 'CEO',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    progress: 0,
    milestones: [
      { id: 'ms-7', title: 'จัดทำแผนธุรกิจ', date: '2026-11-30', completed: false },
      { id: 'ms-8', title: 'สำรวจตลาด', date: '2026-12-31', completed: false }
    ],
    dependencies: [],
    notes: 'เตรียมการสำหรับปี 2027'
  },

  // CLINICAL - Medical Services
  {
    title: 'พัฒนาบริการใหม่ - เลเซอร์/สกินแคร์',
    subtitle: 'เพิ่มบริการเลเซอร์และสกินแคร์ขั้นสูง',
    department: 'clinical',
    priority: 'P1',
    status: 'in_progress',
    owner: 'GM',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    progress: 45,
    milestones: [
      { id: 'ms-9', title: 'จัดซื้ออุปกรณ์', date: '2026-03-31', completed: true },
      { id: 'ms-10', title: 'อบรมแพทย์และพยาบาล', date: '2026-05-15', completed: false },
      { id: 'ms-11', title: 'เปิดให้บริการ', date: '2026-06-30', completed: false }
    ],
    dependencies: [],
    notes: 'เน้นเลเซอร์ลบรอยสัก, กระ, และฝ้า'
  },
  {
    title: 'เพิ่มแพทย์ประจำ 3 คน',
    subtitle: 'รองรับการขยายสาขา',
    department: 'clinical',
    priority: 'P0',
    status: 'on_track',
    owner: 'shared',
    startDate: '2026-01-01',
    endDate: '2026-09-30',
    progress: 30,
    milestones: [
      { id: 'ms-12', title: 'จ้างแพทย์คนที่ 1', date: '2026-03-31', completed: true },
      { id: 'ms-13', title: 'จ้างแพทย์คนที่ 2', date: '2026-06-30', completed: false },
      { id: 'ms-14', title: 'จ้างแพทย์คนที่ 3', date: '2026-09-30', completed: false }
    ],
    dependencies: [],
    notes: 'สำคัญสำหรับรองรับสาขาใหม่'
  },

  // MARKETING - Sales & Marketing
  {
    title: 'แผนการตลาดดิจิทัล 2026',
    subtitle: 'Facebook, TikTok, Google Ads',
    department: 'marketing',
    priority: 'P1',
    status: 'on_track',
    owner: 'GM',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    progress: 15,
    milestones: [
      { id: 'ms-15', title: 'Q1 Campaign', date: '2026-03-31', completed: false },
      { id: 'ms-16', title: 'Q2 Campaign', date: '2026-06-30', completed: false },
      { id: 'ms-17', title: 'Q3 Campaign', date: '2026-09-30', completed: false },
      { id: 'ms-18', title: 'Q4 Campaign', date: '2026-12-31', completed: false }
    ],
    dependencies: [],
    notes: 'งบประมาณ 2M THB/ปี'
  },
  {
    title: 'Campaign ครบรอบ Youngdo',
    subtitle: 'โปรโมชั่นพิเศษ',
    department: 'marketing',
    priority: 'P2',
    status: 'planned',
    owner: 'GM',
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    progress: 0,
    milestones: [
      { id: 'ms-19', title: 'วางแผน Campaign', date: '2026-04-30', completed: false },
      { id: 'ms-20', title: 'ออก Campaign', date: '2026-05-15', completed: false }
    ],
    dependencies: [],
    notes: 'เชื่อมโยงกับการเปิดสาขา 3'
  },

  // PEOPLE - Team & HR
  {
    title: 'ระบบ KPI สำหรับ GM',
    subtitle: 'วัดผลและประเมินผล GM แต่ละสาขา',
    department: 'people',
    priority: 'P0',
    status: 'in_progress',
    owner: 'CEO',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    progress: 60,
    milestones: [
      { id: 'ms-21', title: 'กำหนด KPI', date: '2026-02-15', completed: true },
      { id: 'ms-22', title: 'ทดลองใช้', date: '2026-03-15', completed: false },
      { id: 'ms-23', title: 'ปรับปรุงและเริ่มใช้', date: '2026-03-31', completed: false }
    ],
    dependencies: [],
    notes: 'เชื่อมกับ Dashboard CEO-GM'
  },
  {
    title: 'อบรมทีมขาย/แพทย์',
    subtitle: 'เพิ่มทักษะการขายและบริการ',
    department: 'people',
    priority: 'P1',
    status: 'planned',
    owner: 'GM',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    progress: 0,
    milestones: [
      { id: 'ms-24', title: 'รอบที่ 1 - ทีมขาย', date: '2026-03-31', completed: false },
      { id: 'ms-25', title: 'รอบที่ 2 - แพทย์', date: '2026-05-31', completed: false },
      { id: 'ms-26', title: 'รอบที่ 3 - ทบทวน', date: '2026-06-30', completed: false }
    ],
    dependencies: [],
    notes: 'เน้น Customer Service Excellence'
  },
  {
    title: 'จ้าง GM สาขาใหม่',
    subtitle: 'สำหรับสาขา 3',
    department: 'people',
    priority: 'P1',
    status: 'planned',
    owner: 'shared',
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    progress: 0,
    milestones: [
      { id: 'ms-27', title: 'สัมภาษณ์', date: '2026-04-30', completed: false },
      { id: 'ms-28', title: 'จ้างและอบรม', date: '2026-06-30', completed: false }
    ],
    dependencies: [],
    notes: 'ต้องจ้างก่อนเปิดสาขา 3'
  },

  // TECHNOLOGY - Systems & Digital
  {
    title: 'ระบบ Dashboard CEO-GM',
    subtitle: 'Real-time KPI tracking',
    department: 'technology',
    priority: 'P0',
    status: 'in_progress',
    owner: 'shared',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    progress: 40,
    milestones: [
      { id: 'ms-29', title: 'Roadmap App', date: '2026-02-15', completed: false },
      { id: 'ms-30', title: 'KPI Dashboard', date: '2026-03-15', completed: false },
      { id: 'ms-31', title: 'ทดสอบและใช้งาน', date: '2026-03-31', completed: false }
    ],
    dependencies: [],
    notes: 'โปรเจกต์นี้! (yd-roadmap)'
  },
  {
    title: 'อัพเกรดระบบ JERA POS',
    subtitle: 'ปรับปรุง UI/UX และเพิ่มฟีเจอร์',
    department: 'technology',
    priority: 'P2',
    status: 'planned',
    owner: 'GM',
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    progress: 0,
    milestones: [
      { id: 'ms-32', title: 'วิเคราะห์ปัญหา', date: '2026-05-31', completed: false },
      { id: 'ms-33', title: 'พัฒนาและทดสอบ', date: '2026-08-31', completed: false },
      { id: 'ms-34', title: 'Deploy', date: '2026-09-30', completed: false }
    ],
    dependencies: [],
    notes: 'เน้นความเร็วและใช้งานง่าย'
  },
  {
    title: 'ระบบ CRM ลูกค้า',
    subtitle: 'ติดตามและดูแลลูกค้า',
    department: 'technology',
    priority: 'P1',
    status: 'planned',
    owner: 'GM',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    progress: 0,
    milestones: [
      { id: 'ms-35', title: 'เลือกระบบ/พัฒนาเอง', date: '2026-06-30', completed: false },
      { id: 'ms-36', title: 'ทดลองใช้สาขาหลัก', date: '2026-09-30', completed: false },
      { id: 'ms-37', title: 'ขยายทุกสาขา', date: '2026-12-31', completed: false }
    ],
    dependencies: [],
    notes: 'เชื่อมกับ LINE OA และ Facebook'
  },

  // FINANCE - Budget & Revenue
  {
    title: 'วางแผนงบประมาณ 2026',
    subtitle: 'งบลงทุนและดำเนินงาน',
    department: 'finance',
    priority: 'P0',
    status: 'completed',
    owner: 'CEO',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    progress: 100,
    milestones: [
      { id: 'ms-38', title: 'อนุมัติงบประมาณ', date: '2026-01-31', completed: true }
    ],
    dependencies: [],
    notes: 'งบลงทุนสาขาใหม่ 15M THB'
  },
  {
    title: 'เป้าหมายรายได้ - 200M THB',
    subtitle: 'รายได้รวมทุกสาขา',
    department: 'finance',
    priority: 'P0',
    status: 'on_track',
    owner: 'shared',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    progress: 12,
    milestones: [
      { id: 'ms-39', title: 'รายได้ Q1 - 50M', date: '2026-03-31', completed: false },
      { id: 'ms-40', title: 'รายได้ Q2 - 100M', date: '2026-06-30', completed: false },
      { id: 'ms-41', title: 'รายได้ Q3 - 150M', date: '2026-09-30', completed: false },
      { id: 'ms-42', title: 'รายได้ Q4 - 200M', date: '2026-12-31', completed: false }
    ],
    dependencies: [],
    notes: 'เป้าเติบโต 25% จากปี 2025'
  }
];
