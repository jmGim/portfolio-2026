import React, { useState } from 'react';
import { Search, Terminal, Cpu, HardDrive, AlertTriangle, BookOpen, ChevronRight, Github, Linkedin, ExternalLink, Clock } from 'lucide-react';

// Mock Data for Blog Posts
const BLOG_POSTS = [
  {
    id: 1,
    title: "FreeRTOS 우선순위 역전(Priority Inversion) 현상 분석 및 Mutex를 통한 해결",
    excerpt: "STM32F411 환경에서 MPU6050 센서 데이터를 수집하는 중 발생한 RTOS Task 병목 현상을 오실로스코프로 분석하고 Mutex로 동기화한 트러블슈팅 기록입니다.",
    category: "RTOS / OS",
    level: "Advanced",
    date: "2026. 07. 15",
    readTime: "8 min read",
    tags: ["FreeRTOS", "STM32", "Debugging", "Mutex"]
  },
  {
    id: 2,
    title: "DMA를 활용한 I2C 통신 최적화: CPU 점유율 90%에서 5%로 낮추기",
    excerpt: "Polling 방식의 I2C 통신의 한계를 분석하고, DMA(Direct Memory Access)와 하드웨어 인터럽트를 도입하여 실시간 제어기의 응답성을 극대화하는 방법을 다룹니다.",
    category: "Firmware",
    level: "Expert",
    date: "2026. 06. 28",
    readTime: "12 min read",
    tags: ["DMA", "I2C", "Optimization", "Hardware"]
  },
  {
    id: 3,
    title: "임베디드 리눅스 Yocto Project 시작하기: Custom BSP 빌드 A to Z",
    excerpt: "Raspberry Pi 4를 타겟으로 Yocto Project를 사용하여 나만의 최소 경량화 리눅스 이미지를 빌드하고 Device Tree를 수정하는 기초 가이드입니다.",
    category: "Linux BSP",
    level: "Intermediate",
    date: "2026. 06. 10",
    readTime: "15 min read",
    tags: ["Yocto", "Linux", "BSP", "Raspberry Pi"]
  },
  {
    id: 4,
    title: "Edge AI 최적화: OpenCV C++ 멀티스레딩으로 FPS 3배 향상시키기",
    excerpt: "제한된 자원을 가진 Edge 디바이스에서 영상 캡처와 추론(Inference) 프로세스를 분리하여 지연(Latency)을 최소화하는 구조적 접근법.",
    category: "Edge AI",
    level: "Advanced",
    date: "2026. 05. 22",
    readTime: "10 min read",
    tags: ["C++", "OpenCV", "Multi-threading", "AI"]
  },
  {
    id: 5,
    title: "C언어 메모리 누수(Memory Leak) 추적 기법과 정적 할당의 중요성",
    excerpt: "자동차/방산 도메인(MISRA-C)에서 동적 할당(malloc)을 극도로 지양해야 하는 이유와 메모리 맵(Map) 파일을 분석하는 방법.",
    category: "Architecture",
    level: "Intermediate",
    date: "2026. 05. 05",
    readTime: "6 min read",
    tags: ["C/C++", "Memory", "MISRA-C"]
  }
];

const CATEGORIES = ["All", "Troubleshooting", "Firmware", "RTOS / OS", "Linux BSP", "Edge AI", "Architecture"];

export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || 
                           (activeCategory === "Troubleshooting" && post.level !== "Intermediate") || // Mock logic for Troubleshooting
                           post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0F1117] text-gray-300 font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#0F1117]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight cursor-pointer">
            <Terminal className="text-blue-500" size={24} />
            <span>Dev<span className="text-blue-500">.Embedded</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Series</a>
            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <AlertTriangle size={16} />
              Troubleshooting
            </a>
            <a href="#" className="hover:text-white transition-colors">Snippets</a>
            <a href="#" className="hover:text-white transition-colors">About Me</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github size={20}/></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin size={20}/></a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
            Deep Dive into <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Low-Level Systems
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
            하드웨어의 밑바닥 전기적 특성부터 상위 OS의 아키텍처까지.<br />
            직감에 의존하지 않고 데이터시트와 오실로스코프로 검증하는 임베디드 SW 엔지니어링 기록입니다.
          </p>
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Search posts, tags, or errors (e.g. FreeRTOS, I2C, DMA...)"
              className="w-full bg-[#1A1D24] border border-gray-700 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar / Categories */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Categories</h3>
            <ul className="space-y-1">
              {CATEGORIES.map(category => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                      activeCategory === category 
                        ? 'bg-blue-500/10 text-blue-400' 
                        : 'text-gray-400 hover:bg-[#1A1D24] hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {category === "Troubleshooting" && <AlertTriangle size={16} className={activeCategory === category ? "text-blue-400" : "text-yellow-500/70"}/>}
                      {category === "Firmware" && <Cpu size={16}/>}
                      {category === "Linux BSP" && <HardDrive size={16}/>}
                      {category === "Architecture" && <BookOpen size={16}/>}
                      {category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Post Feed */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-white">
              {activeCategory === "All" ? "Latest Posts" : activeCategory}
            </h2>
            <span className="text-sm text-gray-500">{filteredPosts.length} posts found</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gray-700 rounded-2xl">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <article key={post.id} className="group bg-[#1A1D24] border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-gray-700 transition-all cursor-pointer">
                
                {/* Meta */}
                <div className="flex items-center gap-4 text-xs font-medium mb-4">
                  <span className={`px-2.5 py-1 rounded-md ${
                    post.level === 'Expert' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    post.level === 'Advanced' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {post.level}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1"><Clock size={14}/> {post.readTime}</span>
                  <span className="text-gray-500 hidden md:inline">{post.date}</span>
                </div>

                {/* Title & Excerpt */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-400 mb-6 line-clamp-2 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Tags & Read More */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-400 bg-[#0F1117] px-2.5 py-1 rounded-md border border-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-blue-500 group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    Read Article <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#0F1117] py-12 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <p>© 2026 Embedded Dev Blog. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Portfolio</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Resume</a>
          </div>
        </div>
      </footer>
    </div>
  );
}