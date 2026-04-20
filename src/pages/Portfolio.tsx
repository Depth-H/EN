import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, handleFirestoreError, OperationType } from '../firebase';

const categories = ['전체', '호텔', '모텔', '상업시설', '조명특화'];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Gallery state
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const openGallery = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedProject?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const prevImage = () => {
    if (!selectedProject?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

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
          <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-12">시공 사례</h2>
          
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
                  onClick={() => openGallery(project)}
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
                      <h4 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">{project.title}</h4>
                      <Button variant="outline" className="rounded-none border-white text-white hover:bg-white hover:text-black">상세 사진 보기</Button>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-center md:hidden">{project.title}</h4>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Gallery Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-5xl bg-black border-luxury rounded-none p-0 overflow-hidden h-[90vh] flex flex-col">
          <DialogHeader className="p-6 bg-background border-b border-luxury/20 shrink-0">
            <div className="flex justify-between items-center pr-8">
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight text-luxury">{selectedProject?.title}</DialogTitle>
                <DialogDescription className="text-foreground/60">{selectedProject?.category}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-grow relative flex items-center justify-center bg-black p-4">
            {selectedProject?.images && selectedProject.images.length > 0 ? (
              <>
                <img 
                  src={selectedProject.images[currentImageIndex]} 
                  className="max-w-full max-h-full object-contain"
                  alt={`Slide ${currentImageIndex + 1}`}
                />
                
                {selectedProject.images.length > 1 && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={prevImage}
                      className="absolute left-4 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <ChevronLeft className="h-8 w-8" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={nextImage}
                      className="absolute right-4 rounded-full bg-white/10 hover:bg-white/20 text-white"
                    >
                      <ChevronRight className="h-8 w-8" />
                    </Button>
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_: any, i: number) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-luxury w-4' : 'bg-white/30'}`} 
                        />
                      ))}
                    </div>
                    
                    <div className="absolute bottom-6 right-6 text-white/50 text-sm font-mono">
                      {currentImageIndex + 1} / {selectedProject.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
               <img 
                src={selectedProject?.image} 
                className="max-w-full max-h-full object-contain"
                alt={selectedProject?.title}
              />
            )}
          </div>
          
          <div className="p-8 bg-background border-t border-luxury/20 shrink-0">
            <h4 className="text-sm font-bold uppercase tracking-widest text-luxury mb-2">PROJECT DESCRIPTION</h4>
            <div className="text-foreground/80 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto pr-4 custom-scrollbar">
              {selectedProject?.description}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
