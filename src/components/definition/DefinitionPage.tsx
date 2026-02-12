import { motion } from 'framer-motion';
import {
  TrendingUp,
  Zap,
  Circle,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  CircleCheck,
  Stethoscope,
  Building2,
  Megaphone,
  Users,
  Cpu,
  DollarSign,
  Crown,
  Briefcase,
  UserCog,
  BookOpen,
} from 'lucide-react';

export function DefinitionPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section
      className="min-h-screen p-6 md:p-8 lg:p-12"
      aria-label="คำอธิบายศัพท์และคำจำกัดความ"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-emerald-400" />
            <h1 className="font-thai text-4xl md:text-5xl font-bold text-white">
              คู่มือคำศัพท์
            </h1>
          </div>
          <p className="font-thai text-lg text-white/60 max-w-2xl mx-auto">
            คำอธิบายระดับความสำคัญ สถานะ แผนก และบทบาทต่างๆ ในระบบ Roadmap
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Priority Levels Section */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-emerald-400" />
                <h2 className="font-thai text-2xl font-bold text-white">
                  ระดับความสำคัญ (Priority Levels)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* P0 - Critical */}
                <div className="bg-white/5 border border-red-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-500/20"></div>
                    <div>
                      <span className="font-thai text-lg font-bold text-red-400">
                        P0 - วิกฤต
                      </span>
                      <span className="ml-2 font-thai text-sm text-white/40">
                        (Critical)
                      </span>
                    </div>
                  </div>
                  <p className="font-thai text-sm text-white/70 mb-2">
                    ต้องแก้ไขทันที ปัญหาที่หยุดการดำเนินธุรกิจ
                  </p>
                  <p className="font-thai text-xs text-white/50">
                    ตัวอย่าง: กำหนดเวลากฎหมาย, ระบบล่ม, วิกฤตฉุกเฉิน
                  </p>
                </div>

                {/* P1 - High */}
                <div className="bg-white/5 border border-orange-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></div>
                    <div>
                      <span className="font-thai text-lg font-bold text-orange-400">
                        P1 - สูง
                      </span>
                      <span className="ml-2 font-thai text-sm text-white/40">
                        (High)
                      </span>
                    </div>
                  </div>
                  <p className="font-thai text-sm text-white/70 mb-2">
                    แก้ไขภายในไตรมาสนี้ สำคัญต่อการเติบโต
                  </p>
                  <p className="font-thai text-xs text-white/50">
                    ตัวอย่าง: เปิดสาขาใหม่, จ้างงานตำแหน่งสำคัญ
                  </p>
                </div>

                {/* P2 - Medium */}
                <div className="bg-white/5 border border-yellow-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-yellow-500/20"></div>
                    <div>
                      <span className="font-thai text-lg font-bold text-yellow-400">
                        P2 - กลาง
                      </span>
                      <span className="ml-2 font-thai text-sm text-white/40">
                        (Medium)
                      </span>
                    </div>
                  </div>
                  <p className="font-thai text-sm text-white/70 mb-2">
                    วางแผนภายในครึ่งปี ดีที่จะมี
                  </p>
                  <p className="font-thai text-xs text-white/50">
                    ตัวอย่าง: แคมเปญการตลาด, อัพเกรดระบบ
                  </p>
                </div>

                {/* P3 - Low */}
                <div className="bg-white/5 border border-gray-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gray-500 ring-4 ring-gray-500/20"></div>
                    <div>
                      <span className="font-thai text-lg font-bold text-gray-400">
                        P3 - ต่ำ
                      </span>
                      <span className="ml-2 font-thai text-sm text-white/40">
                        (Low)
                      </span>
                    </div>
                  </div>
                  <p className="font-thai text-sm text-white/70 mb-2">
                    Backlog ทำเมื่อมีทรัพยากร
                  </p>
                  <p className="font-thai text-xs text-white/50">
                    ตัวอย่าง: เครื่องมือภายใน, เอกสารประกอบ
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Definitions Section */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <h2 className="font-thai text-2xl font-bold text-white">
                  สถานะของงาน (Status)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Planned */}
                <div className="bg-white/5 border border-gray-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Circle className="w-5 h-5 text-gray-400" />
                    <span className="font-thai text-base font-bold text-gray-300">
                      วางแผน
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Planned)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    อยู่ในขั้นวางแผน ยังไม่เริ่มงาน
                  </p>
                </div>

                {/* In Progress */}
                <div className="bg-white/5 border border-blue-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <PlayCircle className="w-5 h-5 text-blue-400" />
                    <span className="font-thai text-base font-bold text-blue-300">
                      กำลังดำเนินการ
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (In Progress)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    กำลังทำงานอยู่อย่างต่อเนื่อง
                  </p>
                </div>

                {/* On Track */}
                <div className="bg-white/5 border border-green-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-thai text-base font-bold text-green-300">
                      ตามแผน
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (On Track)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    ดำเนินไปตามที่คาดหวัง ตามกำหนดเวลา
                  </p>
                </div>

                {/* At Risk */}
                <div className="bg-white/5 border border-yellow-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span className="font-thai text-base font-bold text-yellow-300">
                      เสี่ยงล่าช้า
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (At Risk)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    ช้ากว่าแผน หรือเจออุปสรรค
                  </p>
                </div>

                {/* Blocked */}
                <div className="bg-white/5 border border-red-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="font-thai text-base font-bold text-red-300">
                      ติดขัด
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Blocked)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    ไม่สามารถดำเนินการต่อได้ ต้องแก้ไข
                  </p>
                </div>

                {/* Completed */}
                <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <CircleCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-thai text-base font-bold text-emerald-300">
                      เสร็จสิ้น
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Completed)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    ทำเสร็จแล้ว ส่งมอบเรียบร้อย
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Departments Section */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-emerald-400" />
                <h2 className="font-thai text-2xl font-bold text-white">
                  แผนกต่างๆ (Departments)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Clinical */}
                <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Stethoscope className="w-5 h-5 text-emerald-400" />
                    <span className="font-thai text-base font-bold text-emerald-300">
                      การแพทย์/คลินิก
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Clinical)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    บริการทางการแพทย์ การรักษา ปฏิบัติการคลินิก
                  </p>
                </div>

                {/* Expansion */}
                <div className="bg-white/5 border border-amber-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span className="font-thai text-base font-bold text-amber-300">
                      ขยายสาขา
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Expansion)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    เปิดสาขาใหม่ หาทำเลที่ตั้ง
                  </p>
                </div>

                {/* Marketing */}
                <div className="bg-white/5 border border-amber-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Megaphone className="w-5 h-5 text-amber-400" />
                    <span className="font-thai text-base font-bold text-amber-300">
                      การตลาด/ขาย
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Marketing)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    แคมเปญการตลาด ขาย แบรนด์
                  </p>
                </div>

                {/* People */}
                <div className="bg-white/5 border border-pink-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-pink-400" />
                    <span className="font-thai text-base font-bold text-pink-300">
                      ทีมงาน/บุคลากร
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (People)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    HR จ้างงาน ฝึกอบรม วัฒนธรรม
                  </p>
                </div>

                {/* Technology */}
                <div className="bg-white/5 border border-blue-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu className="w-5 h-5 text-blue-400" />
                    <span className="font-thai text-base font-bold text-blue-300">
                      ระบบ/เทคโนโลยี
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Technology)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    ระบบ IT ซอฟต์แวร์ โครงสร้างพื้นฐาน
                  </p>
                </div>

                {/* Finance */}
                <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span className="font-thai text-base font-bold text-emerald-300">
                      การเงิน/ลงทุน
                    </span>
                  </div>
                  <p className="font-thai text-xs text-white/50 mb-1">
                    (Finance)
                  </p>
                  <p className="font-thai text-sm text-white/70">
                    งบประมาณ การลงทุน วางแผนการเงิน
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Owner Roles Section */}
          <motion.div variants={cardVariants}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <UserCog className="w-6 h-6 text-emerald-400" />
                <h2 className="font-thai text-2xl font-bold text-white">
                  บทบาทผู้รับผิดชอบ (Owner Roles)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CEO */}
                <div className="bg-white/5 border border-amber-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <span className="font-thai text-lg font-bold text-amber-300">
                      CEO
                    </span>
                  </div>
                  <p className="font-thai text-sm text-white/70 leading-relaxed">
                    ตัดสินใจเชิงกลยุทธ์ วิสัยทัศน์ กำกับดูแลระดับสูง
                  </p>
                </div>

                {/* GM */}
                <div className="bg-white/5 border border-blue-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                    <span className="font-thai text-lg font-bold text-blue-300">
                      GM
                    </span>
                  </div>
                  <p className="font-thai text-sm text-white/70 leading-relaxed">
                    ปฏิบัติการประจำวัน ดำเนินการ บริหารทีม
                  </p>
                </div>

                {/* Shared */}
                <div className="bg-white/5 border border-emerald-500/30 rounded-lg p-5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="w-6 h-6 text-emerald-400" />
                    <span className="font-thai text-lg font-bold text-emerald-300">
                      Shared (CEO + GM)
                    </span>
                  </div>
                  <p className="font-thai text-sm text-white/70 leading-relaxed">
                    รับผิดชอบร่วมกัน ต้องประสานงานและตกลงร่วม
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="font-thai text-sm text-white/40">
            คู่มือนี้อธิบายคำศัพท์และคำจำกัดความที่ใช้ในระบบ Roadmap ของ
            Dr.Do Roadmap
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
