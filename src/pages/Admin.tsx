import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Image, FileText, Settings, LogOut, Plus, Edit, Trash2, LogIn, X } from 'lucide-react';
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
  serverTimestamp,
  handleFirestoreError,
  OperationType
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortfolios(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portfolios');
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('관리자 모드로 로그인되었습니다.');
    } catch (error: any) {
      console.error('Login Error:', error);
      const errorMessage = error.code || error.message || '알 수 없는 에러';
      toast.error(`로그인 실패: ${errorMessage}`);
      
      if (error.code === 'auth/unauthorized-domain') {
        toast.info('Firebase 콘솔에서 이 도메인을 승인해야 합니다.');
      }
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

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', category: '', image: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const data = {
        ...formData,
        authorUid: user.uid,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'portfolios', editingId), data);
        toast.success('포트폴리오가 수정되었습니다.');
      } else {
        await addDoc(collection(db, 'portfolios'), {
          ...data,
          createdAt: serverTimestamp()
        });
        toast.success('새 포트폴리오가 등록되었습니다.');
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'portfolios');
      toast.error('저장에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'portfolios', id));
      toast.success('삭제되었습니다.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `portfolios/${id}`);
      toast.error('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <Card className="w-full max-w-md border-luxury bg-secondary/5 rounded-none">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tighter">ADMIN LOGIN</CardTitle>
            <p className="text-sm text-foreground/60">주식회사 이엔전력 관리자 시스템</p>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center text-foreground/60 mb-8">
              관리자 권한이 있는 Google 계정으로 로그인해 주세요.
            </p>
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
      <aside className="w-64 border-r border-foreground/10 flex flex-col">
        <div className="p-8 border-b border-foreground/10">
          <span className="text-xl font-bold tracking-tighter">EN <span className="text-foreground/60 font-light">ADMIN</span></span>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start rounded-none" onClick={() => toast.info('대시보드 준비 중')}>
            <LayoutDashboard className="mr-3 h-4 w-4" /> 대시보드
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-none bg-secondary/20">
            <Image className="mr-3 h-4 w-4" /> 포트폴리오 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-none" onClick={() => toast.info('소식 관리 준비 중')}>
            <FileText className="mr-3 h-4 w-4" /> 소식 관리
          </Button>
          <Button variant="ghost" className="w-full justify-start rounded-none" onClick={() => toast.info('설정 준비 중')}>
            <Settings className="mr-3 h-4 w-4" /> 사이트 설정
          </Button>
        </nav>
        <div className="p-4 border-t border-foreground/10">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-foreground/40 truncate">{user.email}</p>
          </div>
          <Button variant="ghost" className="w-full justify-start rounded-none text-destructive hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4" /> 로그아웃
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">포트폴리오 관리</h1>
            <p className="text-foreground/60">웹사이트에 표시될 시공 사례를 관리합니다.</p>
          </div>
          <Button className="rounded-none px-8 py-6" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" /> 새 프로젝트 추가
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {portfolios.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-foreground/10 text-foreground/40">
              등록된 포트폴리오가 없습니다.
            </div>
          ) : (
            portfolios.map((item) => (
              <Card key={item.id} className="rounded-none border-foreground/10 bg-secondary/5">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover" />
                    <div>
                      <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                      <div className="flex space-x-4 text-sm text-foreground/60">
                        <span>카테고리: {item.category}</span>
                        <span>등록일: {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : '방금 전'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-none border-foreground/10" onClick={() => openEditModal(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-none border-foreground/10 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl bg-background border-luxury rounded-none p-0 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <DialogHeader className="p-8 border-b border-foreground/10">
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {editingId ? '프로젝트 수정' : '새 프로젝트 추가'}
                </DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">프로젝트 제목</label>
                  <Input 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="예: OO호텔 전면 리모델링 전기공사"
                    className="rounded-none border-foreground/20 focus:border-luxury"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">카테고리</label>
                    <Input 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="예: 호텔, 모텔, 상가 등"
                      className="rounded-none border-foreground/20 focus:border-luxury"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/60">이미지 URL</label>
                    <Input 
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                      className="rounded-none border-foreground/20 focus:border-luxury"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/60">상세 설명</label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="시공 내용 및 특징을 입력하세요."
                    className="rounded-none border-foreground/20 focus:border-luxury min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter className="p-8 bg-secondary/5 border-t border-foreground/10">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-none px-8">
                  취소
                </Button>
                <Button type="submit" className="rounded-none px-12 bg-luxury hover:bg-luxury/90">
                  {editingId ? '수정 완료' : '등록하기'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
