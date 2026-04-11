import * as React from 'react';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from '../firebase';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '신축 공사 문의',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      toast.success('문의가 성공적으로 접수되었습니다. 곧 연락드리겠습니다.');
      setFormData({
        name: '',
        phone: '',
        email: '',
        type: '신축 공사 문의',
        message: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'inquiries');
      toast.error('문의 접수에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">CONTACT US</h1>
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-8">
            귀하의 프로젝트를 위한<br />
            최상의 파트너가 되겠습니다
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-foreground/40">연락처 정보</h3>
              <ul className="space-y-6">
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">전화번호</p>
                    <p className="text-lg font-medium">02-1234-5678</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">이메일</p>
                    <p className="text-lg font-medium">info@enpower.co.kr</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">주소</p>
                    <p className="text-lg font-medium leading-tight">서울특별시 강남구 테헤란로 123, 4층</p>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-1">영업시간</p>
                    <p className="text-lg font-medium">평일 09:00 - 18:00 (주말 휴무)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="aspect-square w-full bg-secondary/20 border border-foreground/10 flex items-center justify-center text-foreground/40 text-sm italic">
              Google Maps Integration Placeholder
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="p-10 border border-foreground/10 bg-secondary/5">
              <h3 className="text-2xl font-bold mb-8">온라인 문의</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">성함 / 업체명</label>
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      placeholder="홍길동" 
                      className="rounded-none border-foreground/10 bg-transparent focus:border-foreground" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">연락처</label>
                    <Input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required 
                      placeholder="010-0000-0000" 
                      className="rounded-none border-foreground/10 bg-transparent focus:border-foreground" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">이메일</label>
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required 
                    type="email" 
                    placeholder="example@email.com" 
                    className="rounded-none border-foreground/10 bg-transparent focus:border-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">문의 유형</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full h-10 px-3 py-2 text-sm border border-foreground/10 bg-transparent focus:outline-none focus:border-foreground rounded-none"
                  >
                    <option className="bg-background">신축 공사 문의</option>
                    <option className="bg-background">리노베이션 문의</option>
                    <option className="bg-background">유지보수 문의</option>
                    <option className="bg-background">기타 문의</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-foreground/60">문의 내용</label>
                  <Textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required 
                    placeholder="프로젝트에 대한 상세 내용을 입력해주세요." 
                    className="min-h-[200px] rounded-none border-foreground/10 bg-transparent focus:border-foreground" 
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-none py-8 text-lg font-bold"
                >
                  {isSubmitting ? '전송 중...' : '문의 보내기'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
