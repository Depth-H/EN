import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Image, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  LogIn, 
  X,
  Users,
  MessageSquare,
  TrendingUp,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  User as UserIcon,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  logout, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

type Tab = 'dashboard' | 'portfolios' | 'services' | 'news' | 'settings';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Data States
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    companyName: '주식회사 이엔전력',
    address: '',
    phone: '',
    email: '',
    businessNumber: '',
    ceo: '',
    aboutHeadline: '',
    aboutVision: '',
    aboutValues: [],
    aboutHistory: []
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Real-time Data Fetching
  useEffect(() => {
    if (!user) return;

    const unsubPortfolios = onSnapshot(query(collection(db, 'portfolios'), orderBy('createdAt', 'desc')), (snapshot) => {
      setPortfolios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('order', 'asc')), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubNews = onSnapshot(query(collection(db, 'news'), orderBy('createdAt', 'desc')), (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubInquiries = onSnapshot(query(collection(db, 'inquiries'), orderBy('createdAt', 'desc')), (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSettings = onSnapshot(doc(db, 'settings', 'main'), (doc) => {
      if (doc.exists()) setSiteSettings(doc.data());
    });

    return () => {
      unsubPortfolios();
      unsubServices();
      unsubNews();
      unsubInquiries();
      unsubSettings();
    };
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('관리자 모드로 로그인되었습니다.');
    } catch (error: any) {
      toast.error(`로그인 실패: ${error.code || '알 수 없는 에러'}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  // CRUD Handlers
  const openModal = (type: 'portfolios' | 'news' | 'services', item?: any) => {
    setEditingId(item?.id || null);
    if (type === 'portfolios') {
      setFormData(item ? { ...item } : { title: '', category: '', image: '', description: '' });
    } else if (type === 'news') {
      setFormData(item ? { ...item } : { title: '', content: '', image: '' });
    } else if (type === 'services') {
      setFormData(item ? { ...item } : { title: '', description: '', iconName: 'Zap', features: [], order: services.length });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const collectionName = activeTab === 'portfolios' ? 'portfolios' : (activeTab === 'news' ? 'news' : 'services');
    try {
      const data = {
        ...formData,
        authorUid: user.uid,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), data);
        toast.success('수정되었습니다.');
      } else {
        await addDoc(collection(db, collectionName), {
          ...data,
          createdAt: serverTimestamp()
        });
        toast.success('등록되었습니다.');
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, collectionName);
    }
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
    }
  };

  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'settings', 'main'), siteSettings);
      toast.success('사이트 설정이 저장되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/main');
    }
  };

  const addValue = () => {
    const values = [...(siteSettings.aboutValues || []), { title: '', desc: '' }];
    setSiteSettings({ ...siteSettings, aboutValues: values });
  };

  const updateValue = (index: number, field: string, value: string) => {
    const values = [...siteSettings.aboutValues];
    values[index] = { ...values[index], [field]: value };
    setSiteSettings({ ...siteSettings, aboutValues: values });
  };

  const removeValue = (index: number) => {
    const values = siteSettings.aboutValues.filter((_: any, i: number) => i !== index);
    setSiteSettings({ ...siteSettings, aboutValues: values });
  };

  const addHistory = () => {
    const history = [...(siteSettings.aboutHistory || []), { year: '', event: '' }];
    setSiteSettings({ ...siteSettings, aboutHistory: history });
  };

  const updateHistory = (index: number, field: string, value: string) => {
    const history = [...siteSettings.aboutHistory];
    history[index] = { ...history[index], [field]: value };
    setSiteSettings({ ...siteSettings, aboutHistory: history });
  };

  const removeHistory = (index: number) => {
    const history = siteSettings.aboutHistory.filter((_: any, i: number) => i !== index);
    setSiteSettings({ ...siteSettings, aboutHistory: history });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background">로딩 중...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <Card className="w-full max-w-md border-luxury bg-secondary/5 rounded-none">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tighter">ADMIN LOGIN</CardTitle>
            <p className="text-sm text-foreground/60">주식회사 이엔전력 관리자 시스템</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Button onClick={handleLogin} className="w-full rounded-none py-6 text-lg flex items-center justify-center">
              <LogIn className="mr-2 h-5 w-5" /> Google로 로그인
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-foreground/10 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-foreground/10">
          <span className="text-xl font-bold tracking-tighter">EN <span className="text-foreground/60 font-light">ADMIN</span></span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="대시보드" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Image} label="포트폴리오 관리" active={activeTab === 'portfolios'} onClick={() => setActiveTab('portfolios')} />
          <SidebarItem icon={Zap} label="사업 분야 관리" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <SidebarItem icon={FileText} label="소식 관리" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <SidebarItem icon={SettingsIcon} label="사이트 설정" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <p className="text-xs text-foreground/40 truncate px-4 mb-2">{user.email}</p>
          <Button variant="ghost" className="w-full justify-start rounded-none text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" /> 로그아웃
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-8">대시보드</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard icon={Image} label="총 포트폴리오" value={portfolios.length} color="text-blue-500" />
                <StatCard icon={Zap} label="사업 분야" value={services.length} color="text-yellow-500" />
                <StatCard icon={MessageSquare} label="새로운 문의" value={inquiries.length} color="text-green-500" />
                <StatCard icon={FileText} label="등록된 소식" value={news.length} color="text-purple-500" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-none border-foreground/10">
                  <CardHeader><CardTitle className="text-lg">최근 문의 내역</CardTitle></CardHeader>
                  <CardContent>
                    {inquiries.length === 0 ? (
                      <p className="text-foreground/40 text-center py-8">문의 내역이 없습니다.</p>
                    ) : (
                      <div className="space-y-4">
                        {inquiries.slice(0, 5).map((inq) => (
                          <div key={inq.id} className="flex justify-between items-center p-4 bg-secondary/5 border border-foreground/5">
                            <div>
                              <p className="font-bold">{inq.name}</p>
                              <p className="text-xs text-foreground/60">{inq.type} | {inq.phone}</p>
                            </div>
                            <span className="text-xs text-foreground/40">{inq.createdAt?.toDate().toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="rounded-none border-foreground/10">
                  <CardHeader><CardTitle className="text-lg">최근 포트폴리오</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {portfolios.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center space-x-4 p-2 bg-secondary/5">
                          <img src={p.image} className="w-12 h-12 object-cover" />
                          <div>
                            <p className="text-sm font-bold">{p.title}</p>
                            <p className="text-xs text-foreground/60">{p.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {(activeTab === 'portfolios' || activeTab === 'news' || activeTab === 'services') && (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">
                    {activeTab === 'portfolios' ? '포트폴리오 관리' : (activeTab === 'news' ? '소식 관리' : '사업 분야 관리')}
                  </h1>
                  <p className="text-foreground/60">
                    {activeTab === 'portfolios' ? '웹사이트에 표시될 시공 사례를 관리합니다.' : (activeTab === 'news' ? '회사 공지사항 및 새로운 소식을 관리합니다.' : '회사의 주요 사업 분야 및 서비스 항목을 관리합니다.')}
                  </p>
                </div>
                <Button className="rounded-none px-8 py-6 bg-luxury hover:bg-luxury/90" onClick={() => openModal(activeTab as any)}>
                  <Plus className="mr-2 h-4 w-4" /> {activeTab === 'portfolios' ? '새 프로젝트 추가' : (activeTab === 'news' ? '새 소식 작성' : '새 사업 분야 추가')}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(activeTab === 'portfolios' ? portfolios : (activeTab === 'news' ? news : services)).map((item) => (
                  <Card key={item.id} className="rounded-none border-foreground/10 bg-secondary/5 hover:bg-secondary/10 transition-colors">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {item.image && <img src={item.image} className="w-20 h-20 object-cover border border-foreground/10" />}
                        <div>
                          <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                          <div className="flex space-x-4 text-sm text-foreground/60">
                            {activeTab === 'portfolios' && <span>카테고리: {item.category}</span>}
                            {activeTab === 'services' && <span>순서: {item.order}</span>}
                            <span>등록일: {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : '방금 전'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" className="rounded-none border-foreground/10" onClick={() => openModal(activeTab as any, item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-none border-foreground/10 text-destructive hover:text-destructive" onClick={() => handleDelete(activeTab, item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 className="text-4xl font-bold tracking-tight mb-8">사이트 설정 및 콘텐츠 관리</h1>
              <form onSubmit={handleSettingsSave} className="space-y-12">
                {/* Basic Info */}
                <Card className="rounded-none border-foreground/10">
                  <CardHeader className="border-b border-foreground/5"><CardTitle className="text-lg">기본 정보 (연락처 등)</CardTitle></CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingsField label="회사명" icon={Building2} value={siteSettings.companyName} onChange={(v) => setSiteSettings({...siteSettings, companyName: v})} />
                      <SettingsField label="대표자명" icon={UserIcon} value={siteSettings.ceo} onChange={(v) => setSiteSettings({...siteSettings, ceo: v})} />
                      <SettingsField label="대표 전화" icon={Phone} value={siteSettings.phone} onChange={(v) => setSiteSettings({...siteSettings, phone: v})} />
                      <SettingsField label="대표 이메일" icon={Mail} value={siteSettings.email} onChange={(v) => setSiteSettings({...siteSettings, email: v})} />
                      <SettingsField label="사업자 번호" icon={CreditCard} value={siteSettings.businessNumber} onChange={(v) => setSiteSettings({...siteSettings, businessNumber: v})} />
                      <SettingsField label="회사 주소" icon={MapPin} value={siteSettings.address} onChange={(v) => setSiteSettings({...siteSettings, address: v})} />
                    </div>
                  </CardContent>
                </Card>

                {/* About Content */}
                <Card className="rounded-none border-foreground/10">
                  <CardHeader className="border-b border-foreground/5"><CardTitle className="text-lg">회사 소개 페이지 콘텐츠</CardTitle></CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">소개 헤드라인</label>
                      <Input value={siteSettings.aboutHeadline || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutHeadline: e.target.value})} placeholder="예: 신뢰와 기술로 빚어내는 전기공사의 새로운 기준" className="rounded-none border-foreground/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">비전 설명</label>
                      <Textarea value={siteSettings.aboutVision || ''} onChange={(e) => setSiteSettings({...siteSettings, aboutVision: e.target.value})} className="rounded-none border-foreground/20 min-h-[120px]" />
                    </div>

                    {/* Values */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground/60">핵심 가치</label>
                        <Button type="button" variant="outline" size="sm" onClick={addValue} className="rounded-none"><Plus className="h-3 w-3 mr-1" /> 추가</Button>
                      </div>
                      <div className="space-y-4">
                        {(siteSettings.aboutValues || []).map((val: any, i: number) => (
                          <div key={i} className="flex gap-4 items-start p-4 bg-secondary/5 border border-foreground/5">
                            <div className="flex-grow space-y-4">
                              <Input value={val.title} onChange={(e) => updateValue(i, 'title', e.target.value)} placeholder="가치 제목 (예: 전문성)" className="rounded-none border-foreground/20" />
                              <Textarea value={val.desc} onChange={(e) => updateValue(i, 'desc', e.target.value)} placeholder="상세 설명" className="rounded-none border-foreground/20 min-h-[80px]" />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeValue(i)} className="text-destructive"><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* History */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-foreground/60">회사 연혁</label>
                        <Button type="button" variant="outline" size="sm" onClick={addHistory} className="rounded-none"><Plus className="h-3 w-3 mr-1" /> 추가</Button>
                      </div>
                      <div className="space-y-4">
                        {(siteSettings.aboutHistory || []).map((hist: any, i: number) => (
                          <div key={i} className="flex gap-4 items-center p-4 bg-secondary/5 border border-foreground/5">
                            <Input value={hist.year} onChange={(e) => updateHistory(i, 'year', e.target.value)} placeholder="연도 (예: 2024)" className="w-32 rounded-none border-foreground/20" />
                            <Input value={hist.event} onChange={(e) => updateHistory(i, 'event', e.target.value)} placeholder="내용" className="flex-grow rounded-none border-foreground/20" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeHistory(i)} className="text-destructive"><X className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end sticky bottom-8">
                  <Button type="submit" className="rounded-none px-16 py-8 text-lg bg-luxury hover:bg-luxury/90 shadow-2xl">모든 설정 저장하기</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Universal Modal for Portfolio, News, Services */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl bg-background border-luxury rounded-none p-0 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="p-8 border-b border-foreground/10">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {editingId ? '수정하기' : (activeTab === 'portfolios' ? '새 프로젝트 추가' : (activeTab === 'news' ? '새 소식 작성' : '새 사업 분야 추가'))}
                </DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">제목</label>
                  <Input required value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="rounded-none border-foreground/20" />
                </div>
                {activeTab === 'portfolios' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">카테고리</label>
                    <Input required value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="호텔, 모텔, 상가 등" className="rounded-none border-foreground/20" />
                  </div>
                )}
                {activeTab === 'services' && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">아이콘 이름 (Lucide)</label>
                      <Input value={formData.iconName || 'Zap'} onChange={(e) => setFormData({...formData, iconName: e.target.value})} placeholder="Lightbulb, Zap, Shield 등" className="rounded-none border-foreground/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground/60">표시 순서</label>
                      <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="rounded-none border-foreground/20" />
                    </div>
                  </div>
                )}
                {(activeTab === 'portfolios' || activeTab === 'news') && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">이미지 URL</label>
                    <Input type="url" value={formData.image || ''} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="rounded-none border-foreground/20" />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">
                    {activeTab === 'portfolios' ? '상세 설명' : (activeTab === 'news' ? '내용' : '서비스 설명')}
                  </label>
                  <Textarea required value={formData.description || formData.content || ''} onChange={(e) => setFormData({...formData, [activeTab === 'news' ? 'content' : 'description']: e.target.value})} className="rounded-none border-foreground/20 min-h-[200px]" />
                </div>
              </div>
              <DialogFooter className="p-8 bg-secondary/5 border-t border-foreground/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-none">취소</Button>
                <Button type="submit" className="rounded-none px-12 bg-luxury hover:bg-luxury/90">저장하기</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <Button 
      variant="ghost" 
      className={`w-full justify-start rounded-none transition-all ${active ? 'bg-luxury/10 text-luxury font-bold border-r-2 border-luxury' : 'hover:bg-secondary/20'}`} 
      onClick={onClick}
    >
      <Icon className={`mr-3 h-4 w-4 ${active ? 'text-luxury' : ''}`} /> {label}
    </Button>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  return (
    <Card className="rounded-none border-foreground/10 bg-secondary/5">
      <CardContent className="p-6 flex items-center space-x-4">
        <div className={`p-3 bg-background border border-foreground/5 ${color}`}><Icon className="h-6 w-6" /></div>
        <div>
          <p className="text-sm text-foreground/60">{label}</p>
          <p className="text-3xl font-bold tracking-tighter">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsField({ label, icon: Icon, value, onChange }: { label: string, icon: any, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/60 flex items-center">
        <Icon className="mr-2 h-3 w-3" /> {label}
      </label>
      <Input 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)} 
        className="rounded-none border-foreground/20 focus:border-luxury" 
      />
    </div>
  );
}
