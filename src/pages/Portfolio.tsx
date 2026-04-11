import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

const categories = ['전체', '호텔', '모텔', '상업시설', '조명특화'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'portfolios'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portfolios');
    });

    return () => unsubscribe();
  }, []);

  const filteredProjects = activeCategory === '전체' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  if (loading) {
    return <div className="pt-32 pb-24 text-center">로딩 중...</div>;
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/40 mb-6">PORTFOLIO</h1>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12">시공 사례</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className="rounded-none px-8 border-luxury"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-foreground/40 italic">
            해당 카테고리의 프로젝트가 아직 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden mb-6">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">{project.category}</span>
                      <h4 className="text-xl font-bold text-white mb-6">{project.title}</h4>
                      <Button variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black">자세히 보기</Button>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-center md:hidden">{project.title}</h4>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
