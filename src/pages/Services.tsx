import { motion } from 'motion/react';
import { Lightbulb, Zap, Shield, Building2, Cpu, Wrench } from 'lucide-react';

const services = [
  {
    icon: Lightbulb,
    title: '호텔/모텔 특화 조명 설계',
    desc: '공간의 분위기를 결정짓는 감성 조명 설계부터 에너지 효율을 고려한 LED 교체 공사까지, 호텔 브랜드 이미지에 맞는 최적의 조명 환경을 구축합니다.',
    features: ['객실 무드 조명 시스템', '로비/연회장 대형 조명 시공', '경관 조명 및 사인물 전기 공사']
  },
  {
    icon: Zap,
    title: '전기 설비 및 동력 공사',
    desc: '안정적인 전력 공급을 위한 수변전 설비부터 각 층별 분전반 설치, 비상 발전기 시스템 구축 등 건물의 심장부와 같은 전기 인프라를 완벽하게 시공합니다.',
    features: ['수변전 설비 신설 및 증설', '동력 배선 및 제어반 공사', 'UPS 및 비상 전원 시스템']
  },
  {
    icon: Shield,
    title: '소방 전기 및 안전 시스템',
    desc: '투숙객의 안전은 타협할 수 없는 가치입니다. 최신 소방법규를 준수하는 화재 감지 시스템과 비상 방송, 유도등 설비를 통해 완벽한 안전망을 구축합니다.',
    features: ['자동화재탐지설비 시공', '비상방송 및 유도등 시스템', '소방 점검 및 유지보수']
  },
  {
    icon: Building2,
    title: '스마트 호텔 제어 시스템',
    desc: 'IoT 기술을 접목하여 객실 내 조명, 냉난방, 커튼 등을 통합 제어하는 시스템을 구축합니다. 운영 효율성을 높이고 고객에게 차별화된 편의를 제공합니다.',
    features: ['객실 관리 시스템(RMS) 연동', '에너지 절감 자동 제어', '모바일 앱 통합 제어 솔루션']
  },
  {
    icon: Cpu,
    title: '통신 및 네트워크 인프라',
    desc: '고속 인터넷, Wi-Fi 6, IPTV 시스템 등 현대 호텔의 필수 인프라인 통신 설비를 안정적으로 구축하여 끊김 없는 디지털 환경을 제공합니다.',
    features: ['광케이블 및 LAN 선로 공사', '전 층 Wi-Fi 음영 지역 해소', '서버실 및 랙 장비 구성']
  },
  {
    icon: Wrench,
    title: '정기 점검 및 유지보수',
    desc: '시공 후에도 지속적인 관리를 통해 사고를 예방합니다. 24시간 긴급 출동 서비스와 정기적인 전기 안전 점검으로 비즈니스의 연속성을 보장합니다.',
    features: ['전기 안전 법정 점검 대행', '노후 설비 진단 및 개보수', '24/7 긴급 복구 서비스']
  }
];

export default function Services() {
  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">OUR SERVICES</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-8">
            공간의 가치를 높이는<br />
            전문 전기 솔루션
          </h2>
          <p className="text-xl text-foreground/60 leading-relaxed">
            주식회사 이엔전력은 기획부터 설계, 시공, 유지보수까지 
            전기 공사의 전 과정을 아우르는 원스톱 서비스를 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 border border-foreground/5 bg-secondary/10 hover:bg-secondary/20 transition-all flex flex-col"
            >
              <service.icon className="h-12 w-12 mb-8 text-foreground/40" />
              <h3 className="text-2xl font-bold mb-6">{service.title}</h3>
              <p className="text-foreground/60 leading-relaxed mb-8 flex-grow">
                {service.desc}
              </p>
              <ul className="space-y-3 border-t border-foreground/10 pt-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="text-sm text-foreground/80 flex items-center space-x-2">
                    <div className="w-1 h-1 bg-foreground/40 rounded-full" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
