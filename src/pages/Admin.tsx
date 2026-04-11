import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Image, FileText, Settings, LogOut, Plus, Edit, Trash2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  handleFirestoreError,
  OperationType
} from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<any[]>([]);

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
    } catch (error) {
      toast.error('로그인에 실패했습니다.');
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
          <Button className="rounded-none px-8 py-6" onClick={() => toast.info('추가 기능 준비 중')}>
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
                        <span>등록일: {item.createdAt?.toDate().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-none border-foreground/10" onClick={() => toast.info('수정 기능 준비 중')}>
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
      </main>
    </div>
  );
}
