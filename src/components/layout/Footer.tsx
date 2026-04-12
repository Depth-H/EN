import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db, doc, onSnapshot } from '../../firebase';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'main'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <footer className="bg-background border-t border-foreground/10 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-luxury mb-6 block">
              EN <span className="text-foreground/60 font-light">POWER</span>
            </Link>
            <p className="text-foreground/60 text-sm leading-relaxed mb-6">
              {settings?.companyName || '주식회사 이엔전력'}은 호텔 및 모텔 전문 전기공사 기업으로, 
              최고의 기술력과 신뢰를 바탕으로 공간의 가치를 높입니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/40 hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/40 hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">메뉴</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-foreground/60 hover:text-foreground text-sm transition-colors">회사소개</Link></li>
              <li><Link to="/services" className="text-foreground/60 hover:text-foreground text-sm transition-colors">사업분야</Link></li>
              <li><Link to="/portfolio" className="text-foreground/60 hover:text-foreground text-sm transition-colors">포트폴리오</Link></li>
              <li><Link to="/contact" className="text-foreground/60 hover:text-foreground text-sm transition-colors">문의하기</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">사업분야</h4>
            <ul className="space-y-4">
              <li className="text-foreground/60 text-sm">호텔/모텔 특화 조명 설계</li>
              <li className="text-foreground/60 text-sm">전기 설비 및 동력 공사</li>
              <li className="text-foreground/60 text-sm">소방 전기 및 안전 시스템</li>
              <li className="text-foreground/60 text-sm">스마트 홈/호텔 제어 시스템</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">고객센터</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-foreground/40 shrink-0" />
                <span className="text-foreground/60 text-sm">{settings?.address || '서울특별시 강남구 테헤란로 123, 4층'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-foreground/40 shrink-0" />
                <span className="text-foreground/60 text-sm">{settings?.phone || '02-1234-5678'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-foreground/40 shrink-0" />
                <span className="text-foreground/60 text-sm">{settings?.email || 'info@enpower.co.kr'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-foreground/40 text-xs">
            © 2026 {settings?.companyName || '주식회사 이엔전력'}. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-foreground/40 hover:text-foreground text-xs transition-colors">개인정보처리방침</Link>
            <Link to="/terms" className="text-foreground/40 hover:text-foreground text-xs transition-colors">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
