import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Footprints, Camera, Sparkles, BookOpen, RotateCw, Smartphone, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

const AREAS = [
  "下町エリア (浅草・向島・千住)", "商店街エリア (戸越銀座・十条・武蔵小山)", 
  "工場地帯エリア (大田区・品川・江東区)", "静かな住宅街 (世田谷・杉並・練馬)", 
  "カオスな繁華街 (新宿・渋谷・上野)", "川沿いエリア (隅田川・荒川・目黒川)", 
  "寺社仏閣エリア (谷中・根津・千駄木)", "再開発エリア (豊洲・台場・新木場)", 
  "坂道エリア (文京区・港区・牛込)", "市場周辺 (築地・豊洲・大田市場)", 
  "路地裏エリア (四谷・神楽坂・麻布)", "公園エリア (上野・代々木・井の頭)"
];

const THEMES = [
  "猫を探せ", "昭和の残り香を探せ", "インスタ映えゼロを探せ", 
  "地元民だけが知る店を探せ", "謎の看板を収集せよ", "消えゆく景色を記録せよ", 
  "絶滅寸前グルメを食べよ", "工事中の隙間を観察せよ", "捨てられたものを記録せよ", 
  "路地の行き止まりを全部確認せよ", "今日だけの特別営業を探せ", "空と建物の隙間だけを見て歩け"
];

const SPECIAL_RULES = [
  "右にしか曲がれない",
  "スマホのナビ禁止",
  "信号待ちのたびに空を見上げる",
  "5分ごとに立ち止まって周りを観察する",
  "気になった路地は必ず入る",
  "階段を見たら登る",
  "飲食店のメニューを必ず読む",
  "猫を見たら10分は観察する",
  "誰かに道を聞く",
  "歩行者信号を必ず待つ",
  "一本だけ知らない路地に入る",
  "コーヒーか飲み物を一つ買って歩く",
];

const EVENTS = [
  // 写真ミッション
  "洗濯物が印象的な風景を一枚撮る",
  "影が面白い路地を探して撮る",
  "夕方が一番きれいな道を見つけて撮る",
  "住みたくなった場所を記録する",
  "電線と空の組み合わせが好きな場所を撮る",
  "誰かの生活を感じるものを一つ撮る",
  // 音探索
  "一番落ち着く音のする場所に3分いる",
  "気になる音を追いかけて路地を曲がる",
  "川や水の音を探して聴く",
  "商店街のBGMを最後まで聴く",
  "静かすぎる路地を見つける",
  // 匂い探索
  "パン屋か焙煎コーヒーの匂いを追う",
  "懐かしい匂いがする場所に立ち止まる",
  "雨上がりの匂いを探して路地に入る",
  "夕飯の匂いがする住宅街の一角を探す",
  // 生活観察・体験
  "地元の人しかいない喫茶店に入る",
  "気になる路地を制限時間なしで歩く",
  "商店街の一番古そうな店を探す",
  "看板を読むだけで時間を使う",
  "立ち止まって空を5分見る",
  "立ち食いそばかうどんを食べる",
  "猫を見つけたら写真を撮る",
  "気になる神社があればお参りする",
  "地図なしで30分歩いてから現在地を確認する",
  "夕暮れ時に同じ場所を2回歩く",
];

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

interface WalkResult {
  area: string;
  theme: string;
  rules: string[];
  events: string[];
}

export function Home() {
  const [result, setResult] = useState<WalkResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedResult, setDisplayedResult] = useState<WalkResult | null>(null);

  const generateFullResult = () => ({
    area: getRandomItem(AREAS),
    theme: getRandomItem(THEMES),
    rules: getRandomItems(SPECIAL_RULES, Math.floor(Math.random() * 2) + 1),
    events: getRandomItems(EVENTS, 3)
  });

  const generateEventsOnly = (currentResult: WalkResult) => ({
    ...currentResult,
    events: getRandomItems(EVENTS, 3)
  });

  const handleRoll = () => {
    setIsAnimating(true);
    const finalResult = generateFullResult();
    setResult(finalResult);
    
    let cycles = 0;
    const maxCycles = 15;
    const interval = setInterval(() => {
      setDisplayedResult(generateFullResult());
      cycles++;
      if (cycles >= maxCycles) {
        clearInterval(interval);
        setDisplayedResult(finalResult);
        setIsAnimating(false);
      }
    }, 100);
  };

  const handleReRollEvents = () => {
    if (!result) return;
    setIsAnimating(true);
    const finalResult = generateEventsOnly(result);
    setResult(finalResult);
    
    let cycles = 0;
    const maxCycles = 10;
    const interval = setInterval(() => {
      setDisplayedResult(generateEventsOnly(result));
      cycles++;
      if (cycles >= maxCycles) {
        clearInterval(interval);
        setDisplayedResult(finalResult);
        setIsAnimating(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground font-sans flex flex-col p-4 sm:p-6 lg:p-8 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1rem)] overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      
      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full">
        {!result ? (
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center space-y-16 py-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-8">
                <Footprints className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-foreground">
                東京ランダム散歩OS
              </h1>
              <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed pt-2">
                今日はどこへ行こうか。<br/>東京のどこかが、あなたを待っている。
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-2xl transition-all active:scale-[0.98]"
              onClick={handleRoll}
              data-testid="button-start"
            >
              <Compass className="w-5 h-5 mr-2" />
              今日の散歩を決める
            </Button>
            
            <div className="flex items-center text-xs text-muted-foreground mt-auto pt-16">
              <Smartphone className="w-4 h-4 mr-2 opacity-50" />
              ホーム画面に追加してアプリとして使えます
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col space-y-6 pb-24"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <header className="flex items-center justify-center py-4">
              <h2 className="text-sm font-bold text-muted-foreground tracking-widest">
                今日の散歩
              </h2>
            </header>

            <div className="space-y-4">
              <ResultCard 
                title="エリア" 
                icon={<MapPin className="w-5 h-5 text-secondary" />} 
                content={displayedResult?.area} 
                isAnimating={isAnimating}
                color="secondary"
              />
              
              <ResultCard 
                title="テーマ" 
                icon={<Camera className="w-5 h-5 text-chart-3" />} 
                content={displayedResult?.theme} 
                isAnimating={isAnimating}
                color="chart-3"
              />
              
              <ResultCard 
                title="特殊ルール" 
                icon={<Sparkles className="w-5 h-5 text-destructive" />} 
                content={
                  <ul className="space-y-3 mt-1">
                    {displayedResult?.rules.map((r, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive/50 mt-2 mr-3 shrink-0" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                }
                isAnimating={isAnimating}
                color="destructive"
              />
              
              <ResultCard 
                title="途中のできごと" 
                icon={<BookOpen className="w-5 h-5 text-chart-4" />} 
                content={
                  <ol className="space-y-3 mt-1">
                    {displayedResult?.events.map((e, i) => (
                      <li key={i} className="flex items-start bg-background/50 rounded-lg p-3 border border-border/40 text-sm">
                        <span className="font-bold text-chart-4/70 mr-3 mt-0.5">{i + 1}.</span>
                        <span className="leading-relaxed">{e}</span>
                      </li>
                    ))}
                  </ol>
                }
                isAnimating={isAnimating}
                color="chart-4"
                action={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs ml-auto border-chart-4/30 text-chart-4 hover:bg-chart-4/10 rounded-full"
                    onClick={handleReRollEvents}
                    disabled={isAnimating}
                    data-testid="button-reroll-events"
                  >
                    <RotateCw className={`w-3 h-3 mr-1 ${isAnimating ? 'animate-spin' : ''}`} />
                    できごとを引き直す
                  </Button>
                }
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <div className="max-w-lg mx-auto">
                <Button 
                  size="lg" 
                  className="w-full h-14 font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-md transition-all active:scale-[0.98]"
                  onClick={handleRoll}
                  disabled={isAnimating}
                  data-testid="button-reroll-all"
                >
                  <RotateCw className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
                  もう一度引き直す
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ title, icon, content, isAnimating, color, action }: { title: string, icon: React.ReactNode, content: React.ReactNode, isAnimating: boolean, color: string, action?: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-5 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-1.5 h-full opacity-60" style={{ backgroundColor: `var(--color-${color})` }} />
      
      <div className="flex items-center justify-between mb-3 pl-2">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2.5 font-bold text-sm tracking-widest text-muted-foreground">{title}</h3>
        </div>
        {action}
      </div>
      
      <div className={`transition-opacity duration-300 pl-2 ${isAnimating ? 'opacity-40' : 'opacity-100'} font-sans`}>
        {content}
      </div>
    </div>
  );
}
