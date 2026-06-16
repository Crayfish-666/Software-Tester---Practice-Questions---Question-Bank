import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Star, Eye, EyeOff, ChevronLeft, ArrowUpToLine, ArrowDownToLine, FileText, LayoutList, LayoutTemplate, ArrowRight } from 'lucide-react';

export default function Browse() {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllAnswers, setShowAllAnswers] = useState(true);
  const [visibleAnswers, setVisibleAnswers] = useState(new Set());
  const [favorites, setFavorites] = useState(new Set());

  // New layout state
  const [viewMode, setViewMode] = useState('list'); // 'card' | 'list'
  const [splitPaneMode, setSplitPaneMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/api/questions?paper_id=${paperId}`).then(res => res.json()),
      fetch(`http://localhost:3001/api/favorites`).then(res => res.json())
    ]).then(([qData, fData]) => {
      setQuestions(qData);
      setLoading(false);
      
      if (showAllAnswers) {
          setVisibleAnswers(new Set(qData.map(q => q.id)));
      }
      
      if (Array.isArray(fData)) {
          setFavorites(new Set(fData.map(f => f.question_id)));
      }
    });
  }, [paperId]);

  const toggleGlobalAnswers = () => {
      const newVal = !showAllAnswers;
      setShowAllAnswers(newVal);
      if (newVal) {
          setVisibleAnswers(new Set(questions.map(q => q.id)));
      } else {
          setVisibleAnswers(new Set());
      }
  };

  const toggleSingleAnswer = (id) => {
      setVisibleAnswers(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
      });
  };

  const toggleFavorite = (qId) => {
      const isFav = favorites.has(qId);
      if (isFav) {
          fetch(`http://localhost:3001/api/favorite/${qId}`, { method: 'DELETE' })
            .then(() => setFavorites(prev => { const next = new Set(prev); next.delete(qId); return next; }));
      } else {
          fetch(`http://localhost:3001/api/favorite`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question_id: qId, paper_id: paperId })
          }).then(() => setFavorites(prev => { const next = new Set(prev); next.add(qId); return next; }));
      }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin text-blue-500" size={48} />
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center py-20 text-slate-400 text-xl">该试卷暂无题目。</div>
  );

  const optionChars = ['A', 'B', 'C', 'D', 'E', 'F'];

  const groups = [];
  let currentGroup = null;
  questions.forEach(q => {
      if (currentGroup && currentGroup.group_id === q.group_id && currentGroup.content === q.group_content) {
          currentGroup.questions.push(q);
      } else {
          currentGroup = {
              group_id: q.group_id,
              content: q.group_content,
              questions: [q]
          };
          groups.push(currentGroup);
      }
  });

  const renderQuestionCard = (q, idxOverride) => {
      const idx = idxOverride !== undefined ? idxOverride : questions.findIndex(xq => xq.id === q.id);
      const isVisible = visibleAnswers.has(q.id);
      const isFav = favorites.has(q.id);
      const options = Array.isArray(q.options) ? q.options : [];

      return (
          <div id={`question-${q.id}`} key={q.id} className="glass rounded-[2rem] p-10 border-t border-slate-600/50 shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none text-9xl font-black">
                Q{idx + 1}
              </div>

              <div className="absolute top-8 right-8 flex gap-3 z-20">
                  {viewMode === 'list' && q.group_content && (
                      <button onClick={() => {
                          const el = document.getElementById(`group-content-${q.group_id}`);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }} className="p-3 rounded-xl glass text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-lg group relative" title="回到题干">
                          <FileText size={24} />
                          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              回到题干
                          </div>
                      </button>
                  )}
                  <button onClick={() => toggleSingleAnswer(q.id)} className="p-3 rounded-xl glass hover:bg-slate-700 text-slate-400 hover:text-blue-400 transition-all shadow-lg group relative" title="切换此题答案显示">
                      {isVisible ? <EyeOff size={24}/> : <Eye size={24}/>}
                      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          切换答案显示
                      </div>
                  </button>
                  <button onClick={() => toggleFavorite(q.id)} className={`p-3 rounded-xl transition-all shadow-lg group relative ${isFav ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'glass text-slate-400 hover:text-yellow-400 hover:border-yellow-500/30'}`} title="收藏此题">
                      <Star size={24} fill={isFav ? 'currentColor' : 'none'} />
                      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {isFav ? '取消收藏' : '收藏此题'}
                      </div>
                  </button>
              </div>

              <div className="flex items-center gap-3 mb-8 relative z-10 pr-32">
                  <span className="px-4 py-1.5 text-sm font-bold tracking-widest text-indigo-300 uppercase bg-indigo-500/20 rounded-full border border-indigo-500/30 shadow-inner">
                    {q.type === 'choice' ? '单选题' : q.type === 'multi_choice' ? '多选题' : q.type === 'boolean' ? '判断题' : q.type}
                  </span>
                  <span className="text-slate-400 font-medium text-sm">分值: {q.score} 分</span>
              </div>

              <h3 className="text-2xl font-medium leading-relaxed text-slate-100 relative z-10 mb-8" dangerouslySetInnerHTML={{__html: q.content}}></h3>

              <div className="space-y-4 relative z-10 mb-8">
                {q.type === 'choice' || q.type === 'multi_choice' || q.type === 'boolean' ? (
                  options.map((opt, i) => {
                      const char = optionChars[i];
                      const isCorrect = String(q.correct_answer).includes(char);
                      
                      let boxClass = "p-5 rounded-2xl border-2 flex items-center gap-6 transition-all text-lg ";
                      if (isVisible && isCorrect) {
                          boxClass += "border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                      } else {
                          boxClass += "border-slate-700/50 glass opacity-80";
                      }

                      return (
                          <div key={i} className={boxClass}>
                              <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl font-bold text-base ${isVisible && isCorrect ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                  {char}
                              </div>
                              <span className={isVisible && isCorrect ? 'text-green-100 font-medium' : 'text-slate-300'} dangerouslySetInnerHTML={{__html: opt}}></span>
                          </div>
                      )
                  })
                ) : null}

                {q.type === 'text' && (
                    <div className="relative z-10">
                        <textarea 
                            disabled
                            placeholder="（此为主观文字题，当前为查阅模式）"
                            className="w-full min-h-[200px] p-6 rounded-2xl border-2 border-slate-700/50 bg-slate-900/50 text-slate-500 text-lg transition-all font-mono resize-y cursor-not-allowed italic"
                        />
                    </div>
                )}

                {q.type === 'file' && (
                    <div className="relative z-10">
                        <div className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/20 text-slate-500 transition-all">
                            <span className="font-medium text-lg">（此为主观文件上传题，当前为查阅模式）</span>
                        </div>
                    </div>
                )}
              </div>

              <div className={`transition-all duration-300 overflow-hidden ${isVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  {q.type === 'choice' || q.type === 'multi_choice' || q.type === 'boolean' ? (
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                          <div className="font-bold text-emerald-400 text-lg">正确答案：</div>
                          <div className="text-emerald-300 font-black text-2xl">{q.correct_answer}</div>
                      </div>
                  ) : (
                      <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5">
                          <div className="font-bold text-blue-400 text-lg mb-4">参考答案 (需人工批阅)：</div>
                          {q.type === 'text' ? (
                             <pre className="p-4 rounded-xl bg-slate-900/80 text-green-300 font-mono text-sm whitespace-pre-wrap overflow-x-auto border border-slate-700">
                                 {q.correct_answer || '（暂无标准参考代码）'}
                             </pre>
                          ) : (
                             <div className="text-slate-400 italic">
                                 {q.correct_answer || '请提交文件以供批阅。'}
                             </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen w-full relative flex">
      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 z-50">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-xl font-medium">
          <ChevronLeft size={20} /> 返回大厅
        </button>
      </div>

      {/* Right Toolbar */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50 flex flex-col gap-4">
        <div className="glass p-4 rounded-2xl flex flex-col items-center shadow-2xl border border-blue-500/20 text-center w-20">
            <div className="text-xs text-blue-300 font-medium mb-1 uppercase tracking-wider opacity-80">题数</div>
            <div className="text-xl font-black text-blue-400">{questions.length}</div>
        </div>

        <button onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')} className="p-4 rounded-2xl glass hover:bg-slate-700 text-slate-400 hover:text-white transition-all shadow-xl group relative">
            {viewMode === 'card' ? <LayoutList size={24}/> : <LayoutTemplate size={24}/>}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {viewMode === 'card' ? '切换长列表模式' : '切换单题卡片模式'}
            </div>
        </button>

        <button onClick={() => setSplitPaneMode(!splitPaneMode)} className={`p-4 rounded-2xl transition-all shadow-xl group relative ${splitPaneMode ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'glass text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            <LayoutList size={24} className={splitPaneMode ? "rotate-90" : ""} />
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {splitPaneMode ? '关闭分屏吸附' : '开启分屏吸附 (左右布局)'}
            </div>
        </button>

        <button onClick={toggleGlobalAnswers} className={`p-4 rounded-2xl transition-all shadow-xl group relative ${showAllAnswers ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'glass text-slate-400 hover:text-white hover:bg-slate-700'}`}>
            {showAllAnswers ? <Eye size={24}/> : <EyeOff size={24}/>} 
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {showAllAnswers ? '隐藏全部答案' : '显示全部答案'}
            </div>
        </button>

        {viewMode === 'list' && (
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-700/50">
                <button onClick={() => document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' })} className="p-4 rounded-2xl glass hover:bg-slate-700 text-slate-400 hover:text-white transition-all shadow-xl group relative">
                    <ArrowUpToLine size={24}/>
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">回到顶部</div>
                </button>
                <button onClick={() => {
                    const c = document.getElementById('main-scroll-container');
                    if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
                }} className="p-4 rounded-2xl glass hover:bg-slate-700 text-slate-400 hover:text-white transition-all shadow-xl group relative">
                    <ArrowDownToLine size={24}/>
                    <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">滑到底部</div>
                </button>
            </div>
        )}
      </div>

      <div className="flex-1 px-8 md:px-24 pt-24 pb-32 max-w-[1400px] mx-auto w-full">
          {viewMode === 'list' && (
              <div className="space-y-16">
                  {groups.map((g, gIdx) => {
                      const isSplit = splitPaneMode && g.content;
                      return (
                          <div key={gIdx} className={`relative ${isSplit ? 'flex items-start gap-8' : 'block'}`}>
                              {g.content && (
                                  <div id={`group-content-${g.group_id}`} className={`${isSplit ? 'w-1/2 sticky top-8 max-h-[90vh] overflow-y-auto custom-scrollbar' : 'mb-8'}`}>
                                      <div className="p-8 bg-slate-800/80 border border-slate-600/50 rounded-3xl text-slate-300 prose prose-invert prose-lg max-w-none shadow-xl" dangerouslySetInnerHTML={{__html: g.content}}></div>
                                  </div>
                              )}
                              
                              <div className={`${isSplit ? 'w-1/2 space-y-8' : 'space-y-8'}`}>
                                  {g.questions.map(q => renderQuestionCard(q))}
                              </div>
                          </div>
                      )
                  })}
              </div>
          )}

          {viewMode === 'card' && (
              <div className="relative">
                  {(() => {
                      const q = questions[currentIndex];
                      const isSplit = splitPaneMode && q.group_content;

                      return (
                          <div className={`transition-all ${isSplit ? 'flex gap-8 items-start' : 'max-w-4xl mx-auto'}`}>
                              {isSplit && (
                                  <div className="w-1/2 sticky top-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                      <div className="p-8 bg-slate-800/80 border border-slate-600/50 rounded-3xl text-slate-300 prose prose-invert prose-lg max-w-none shadow-xl" dangerouslySetInnerHTML={{__html: q.group_content}}></div>
                                  </div>
                              )}

                              <div className={`${isSplit ? 'w-1/2' : 'w-full'}`}>
                                  {!isSplit && q.group_content && (
                                      <div className="mb-8 p-8 bg-slate-800/80 border border-slate-600/50 rounded-3xl text-slate-300 prose prose-invert prose-lg max-w-none shadow-xl" dangerouslySetInnerHTML={{__html: q.group_content}}></div>
                                  )}
                                  {renderQuestionCard(q, currentIndex)}
                              </div>
                          </div>
                      );
                  })()}
              </div>
          )}
      </div>

      {/* Floating Bottom Action Bar (Card mode only) */}
      {viewMode === 'card' && (
          <div className="fixed bottom-8 z-50 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 glass rounded-[2rem] border border-slate-700/50 shadow-2xl">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} 
                disabled={currentIndex === 0}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-all shadow-md">
                  <ArrowLeft size={24} />
              </button>
              
              <div className="px-6 font-bold text-xl text-slate-300 min-w-[120px] text-center">
                  {currentIndex + 1} <span className="text-slate-500 mx-1">/</span> {questions.length}
              </div>

              <button 
                onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))} 
                disabled={currentIndex === questions.length - 1}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-all shadow-md">
                  <ArrowRight size={24} />
              </button>
          </div>
      )}
    </div>
  );
}
