import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Zap, Target, Rss, ArrowRight, Dices, RotateCw, Smartphone, Terminal } from "lucide-react";
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
  "右にしか曲がれない", "スマホのナビ禁止", "信号待ち中に必ず一枚撮影", 
  "5分ごとに立ち止まって空を見上げる", "商店街に入ったら全店を確認するまで出られない", 
  "階段を見たら必ず登る", "自販機を見たら必ず何か買う", "猫を見たら10分観察", 
  "路地を見たら全部入る", "会話した人数をカウントする", "歩行者信号を必ず待つ (走らない)", 
  "飲食店のメニューを必ず写真に撮る"
];

const EVENTS = [
  "突然の通り雨 → 軒先で雨宿り10分", "謎の行列発見 → 最後尾に並んで確認", 
  "猫登場 → 写真を撮るまで追いかける", "工事で通行止め → 迂回ルートを自分で見つける", 
  "空腹警報 → 最寄りの飲食店に即入店", "気になる路地発見 → 5分間だけ探索", 
  "おばあちゃんに話しかけられる → 話を聞く", "謎の神社発見 → お参りする", 
  "電池30%警報 → 省電力モードで続行", "靴紐がほどける → 縁起を占う", 
  "商店街くじ引き発見 → 引く", "謎の店が閉店中 → 次回の楽しみにメモ", 
  "廃墟発見 → 外観だけ観察5分", "夕暮れ時刻 → ゴールデンアワー撮影タイム15分", 
  "迷子 → GPSなしで元の道に戻る"
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
    
    // Slot machine effect
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
    <div className="min-h-[100dvh] w-full bg-background text-foreground font-mono flex flex-col p-4 sm:p-6 lg:p-8 pt-[env(safe-area-inset-top)] pb-[calc(env(safe-area-inset-bottom)+1rem)] overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      
      {/* BACKGROUND NOISE / SCANLINES */}
      <div className="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" 
           style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 120%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)' }}>
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full">
        {!result ? (
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center space-y-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-center space-y-4">
              <Terminal className="w-16 h-16 mx-auto text-primary mb-6 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-primary drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                東京ランダム<br/>散歩OS
              </h1>
              <p className="text-muted-foreground text-sm max-w-[280px] mx-auto leading-relaxed border-t border-border pt-4">
                予測不可能な東京探索プロトコルを起動します。
              </p>
            </div>

            <Button 
              size="lg" 
              className="w-full h-16 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,255,0.3)] border border-primary/50"
              onClick={handleRoll}
              data-testid="button-start"
            >
              <Zap className="w-5 h-5 mr-2" />
              散歩プロトコル起動
            </Button>
            
            <div className="flex items-center text-xs text-muted-foreground mt-auto pt-12">
              <Smartphone className="w-4 h-4 mr-2 opacity-50" />
              ホーム画面に追加してアプリとして使えます
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col space-y-6 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <header className="flex items-center justify-between py-2 border-b border-border">
              <h2 className="text-sm font-bold text-primary flex items-center">
                <Terminal className="w-4 h-4 mr-2" />
                散歩OS // RESULT
              </h2>
              <span className="text-[10px] text-muted-foreground">v1.0.0</span>
            </header>

            <div className="space-y-4">
              <ResultCard 
                title="エリア" 
                icon={<Map className="w-5 h-5 text-secondary" />} 
                content={displayedResult?.area} 
                isAnimating={isAnimating}
                color="secondary"
              />
              
              <ResultCard 
                title="テーマ" 
                icon={<Target className="w-5 h-5 text-chart-3" />} 
                content={displayedResult?.theme} 
                isAnimating={isAnimating}
                color="chart-3"
              />
              
              <ResultCard 
                title="特殊ルール" 
                icon={<Zap className="w-5 h-5 text-destructive" />} 
                content={
                  <ul className="space-y-2">
                    {displayedResult?.rules.map((r, i) => (
                      <li key={i} className="flex items-start">
                        <ArrowRight className="w-4 h-4 mr-2 mt-0.5 shrink-0 opacity-50" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                }
                isAnimating={isAnimating}
                color="destructive"
              />
              
              <ResultCard 
                title="途中イベント" 
                icon={<Rss className="w-5 h-5 text-chart-4" />} 
                content={
                  <ul className="space-y-3">
                    {displayedResult?.events.map((e, i) => {
                      const [event, action] = e.split(" → ");
                      return (
                        <li key={i} className="bg-background/50 p-3 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-1 font-bold">CONDITION {i+1}</div>
                          <div className="font-bold mb-1">{event}</div>
                          <div className="text-sm text-chart-4 flex items-center">
                            <ArrowRight className="w-3 h-3 mr-1" />
                            {action}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                }
                isAnimating={isAnimating}
                color="chart-4"
                action={
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs ml-auto border-chart-4/50 text-chart-4 hover:bg-chart-4/10"
                    onClick={handleReRollEvents}
                    disabled={isAnimating}
                    data-testid="button-reroll-events"
                  >
                    <RotateCw className={`w-3 h-3 mr-1 ${isAnimating ? 'animate-spin' : ''}`} />
                    イベント再抽選
                  </Button>
                }
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <div className="max-w-lg mx-auto">
                <Button 
                  size="lg" 
                  className="w-full h-14 font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleRoll}
                  disabled={isAnimating}
                  data-testid="button-reroll-all"
                >
                  <Dices className={`w-5 h-5 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
                  全プロトコル再起動
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
    <div className="bg-card border border-border p-4 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: `var(--color-${color})` }} />
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {icon}
          <h3 className="ml-2 font-bold text-sm tracking-widest">{title}</h3>
        </div>
        {action}
      </div>
      
      <div className={`transition-opacity duration-75 ${isAnimating ? 'opacity-50' : 'opacity-100'} font-sans`}>
        {content}
      </div>
    </div>
  );
}