import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { db, doc, onSnapshot } from '../firebase';

export default function About() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'main'), (doc) => {
      if (doc.exists()) setContent(doc.data());
    });
    return () => unsub();
  }, []);

  const defaultHistory = [
    { year: '2024', event: '호텔 전기공사 부문 우수 기업 선정' },
    { year: '2022', event: '스마트 호텔 제어 시스템 특허 등록' },
    { year: '2018', event: '주식회사 이엔전력 법인 설립' },
    { year: '2015', event: '이엔전기설비 창업' },
  ];

  const defaultValues = [
    { title: '전문성', desc: '수십 년간 축적된 호텔 특화 시공 노하우' },
    { title: '안전', desc: '타협 없는 안전 기준과 철저한 법규 준수' },
    { title: '혁신', desc: '최신 스마트 제어 기술의 적극적인 도입' },
  ];

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">ABOUT US</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-12 whitespace-pre-line">
            {content?.aboutHeadline || '신뢰와 기술로 빚어내는\n전기공사의 새로운 기준'}
          </h2>
          
          <div className="aspect-[21/9] overflow-hidden mb-16">
            <img
              src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070"
              alt="Team working"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
            <div>
              <h3 className="text-2xl font-bold mb-6">우리의 비전</h3>
              <p className="text-foreground/60 leading-relaxed whitespace-pre-line">
                {content?.aboutVision || `주식회사 이엔전력은 단순한 전기 시공을 넘어, 공간의 목적과 가치를 깊이 이해합니다. 
                특히 호텔 및 모텔 산업의 특수성을 고려한 맞춤형 설계를 통해 
                투숙객에게는 최상의 경험을, 운영자에게는 효율적인 관리 환경을 제공하는 것을 목표로 합니다.`}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-6">핵심 가치</h3>
              <ul className="space-y-4 text-foreground/60">
                {(content?.aboutValues || defaultValues).map((val: any, i: number) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="font-bold text-foreground">0{i + 1}. {val.title}:</span>
                    <span>{val.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-foreground/10 pt-24">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-12 text-center">COMPANY HISTORY</h3>
            <div className="space-y-12">
              {(content?.aboutHistory || defaultHistory).map((item: any, i: number) => (
                <div key={i} className="flex items-center space-x-12">
                  <span className="text-3xl font-bold text-foreground/20 w-24">{item.year}</span>
                  <div className="h-px flex-grow bg-foreground/10" />
                  <span className="text-xl font-medium text-foreground/80">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
