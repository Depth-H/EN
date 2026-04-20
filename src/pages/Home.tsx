import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Lightbulb, Building2, Cpu, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../firebase';

const iconMap: Record<string, any> = {
  Lightbulb, Zap, Shield, Building2, Cpu, Wrench
};

export default function Home() {
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const qPortfolios = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'), limit(2));
    const unsubPortfolios = onSnapshot(qPortfolios, (snapshot) => {
      setPortfolios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qServices = query(collection(db, 'services'), orderBy('order', 'asc'), limit(4));
    const unsubServices = onSnapshot(qServices, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubPortfolios();
      unsubServices();
    };
  }, []);

  const defaultServices = [
    { icon: Lightbulb, title: '조명 설계 및 시공', desc: '호텔 분위기를 결정짓는 최적의 조명 솔루션' },
    { icon: Zap, title: '동력 및 배선 공사', desc: '안정적인 전력 공급을 위한 정밀한 전기 설비' },
    { icon: Shield, title: '소방 및 안전 시스템', desc: '철저한 법규 준수와 완벽한 안전 시스템 구축' },
    { icon: Building2, title: '스마트 제어 시스템', desc: '효율적인 관리를 위한 최첨단 자동화 시스템' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2070"
            alt="Luxury Hotel Lighting"
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-heading font-bold tracking-tighter text-luxury mb-6">
              빛으로 완성되는<br />
              <span className="text-foreground/60 italic font-light">공간의 품격</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              <strong>이엔전력</strong>은 호텔 및 <strong>모텔전기공사</strong> 전문 솔루션을 통해 
              고객님의 비즈니스 공간에 최상의 가치를 더하는 모텔 전문 전기공사 업체입니다.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-none px-10 py-7 text-lg" render={<Link to="/portfolio" />} nativeButton={false}>
                포트폴리오 보기
              </Button>
              <Button size="lg" variant="outline" className="rounded-none px-10 py-7 text-lg border-luxury" render={<Link to="/contact" />} nativeButton={false}>
                상담 신청하기
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-foreground/20" />
        </div>
      </section>

      {/* Services Summary */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-4">OUR SERVICES</h2>
              <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">전문적인 기술력으로<br />공간을 혁신합니다</h3>
            </div>
            <Link to="/services" className="group flex items-center space-x-2 text-foreground/60 hover:text-foreground transition-colors">
              <span>전체 서비스 보기</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(services.length > 0 ? services : defaultServices).map((item, i) => {
              const Icon = (item as any).icon || iconMap[(item as any).iconName] || Zap;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-foreground/5 hover:border-foreground/20 transition-all group"
                >
                  <Icon className="h-10 w-10 mb-6 text-foreground/40 group-hover:text-foreground transition-colors" />
                  <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                  <p className="text-foreground/60 leading-relaxed">{(item as any).description || (item as any).desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-4">PORTFOLIO</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">주요 시공 사례</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {(portfolios.length > 0 ? portfolios : [
              { 
                title: '그랜드 하얏트 서울 조명 리노베이션', 
                category: 'Hotel / Lighting',
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000'
              },
              { 
                title: '부티크 호텔 L 전기 설비 신축 공사', 
                category: 'Boutique Hotel / Electrical',
                image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1000'
              },
            ]).map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden mb-6">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black">자세히 보기</Button>
                  </div>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-2">{project.category}</p>
                <h4 className="text-2xl font-bold group-hover:underline underline-offset-8 decoration-1">{project.title}</h4>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" className="rounded-none px-12 py-6 border-luxury" render={<Link to="/portfolio" />} nativeButton={false}>
              모든 프로젝트 보기
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069"
            alt="Office"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-8">당신의 비즈니스에<br />최상의 에너지를 더하세요</h2>
          <p className="text-lg text-foreground/60 max-w-xl mx-auto mb-12">
            전문가와의 상담을 통해 귀하의 프로젝트에 가장 적합한 
            전기 설비 솔루션을 제안받으세요.
          </p>
          <Button size="lg" className="rounded-none px-12 py-8 text-xl" render={<Link to="/contact" />} nativeButton={false}>
            지금 상담하기
          </Button>
        </div>
      </section>
    </div>
  );
}
