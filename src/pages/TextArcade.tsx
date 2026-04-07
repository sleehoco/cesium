import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type ArcadeMode = 'asteroids' | 'pacman';

interface Vec2 {
  x: number;
  y: number;
}

interface AsteroidsWord {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

interface Ship {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

interface AsteroidsState {
  ship: Ship;
  bullets: Bullet[];
  words: AsteroidsWord[];
  score: number;
  lives: number;
  gameOver: boolean;
}

interface PacmanWord {
  id: number;
  text: string;
  x: number;
  y: number;
  eaten: boolean;
}

interface Ghost {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface PacmanState {
  player: Vec2;
  direction: Vec2;
  mouthOpen: boolean;
  words: PacmanWord[];
  ghosts: Ghost[];
  score: number;
  lives: number;
  gameOver: boolean;
}

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 520;
const SHIP_RADIUS = 16;
const PLAYER_RADIUS = 18;

const random = (min: number, max: number) => Math.random() * (max - min) + min;
const wrap = (value: number, limit: number) => {
  if (value < 0) return value + limit;
  if (value > limit) return value - limit;
  return value;
};

const createAsteroidsWords = (phrases: string[]): AsteroidsWord[] =>
  phrases.map((text, index) => ({
    id: index + 1,
    text,
    x: random(60, CANVAS_WIDTH - 60),
    y: random(60, CANVAS_HEIGHT - 60),
    vx: random(-0.6, 0.6),
    vy: random(-0.6, 0.6),
    radius: Math.max(28, text.length * 6.5),
  }));

const createPacmanWords = (phrases: string[]): PacmanWord[] =>
  phrases.map((text, index) => ({
    id: index + 1,
    text,
    x: 120 + (index % 4) * 180,
    y: 110 + Math.floor(index / 4) * 95,
    eaten: false,
  }));

const createAsteroidsState = (phrases: string[]): AsteroidsState => ({
  ship: {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
  },
  bullets: [],
  words: createAsteroidsWords(phrases),
  score: 0,
  lives: 3,
  gameOver: false,
});

const createPacmanState = (phrases: string[]): PacmanState => ({
  player: { x: 100, y: 100 },
  direction: { x: 0, y: 0 },
  mouthOpen: true,
  words: createPacmanWords(phrases),
  ghosts: [
    { id: 1, x: 760, y: 110, vx: -1.1, vy: 0.8, color: '#ff5c8a' },
    { id: 2, x: 760, y: 390, vx: -1.2, vy: -0.9, color: '#5de2ff' },
  ],
  score: 0,
  lives: 3,
  gameOver: false,
});

const drawBackground = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = '#07090f';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  for (let i = 0; i < 90; i += 1) {
    const x = (i * 137) % CANVAS_WIDTH;
    const y = (i * 83) % CANVAS_HEIGHT;
    ctx.fillStyle = `rgba(255,255,255,${0.12 + (i % 5) * 0.05})`;
    ctx.fillRect(x, y, 2, 2);
  }
};

const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.rotate(ship.angle + Math.PI / 2);
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(12, 14);
  ctx.lineTo(0, 8);
  ctx.lineTo(-12, 14);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
};

const drawAsteroidsWord = (ctx: CanvasRenderingContext2D, word: AsteroidsWord) => {
  ctx.save();
  ctx.translate(word.x, word.y);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
  ctx.fillStyle = 'rgba(10, 12, 18, 0.86)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, word.radius, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8f5ec';
  ctx.font = '600 18px "Space Grotesk"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word.text, 0, 1);
  ctx.restore();
};

const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
  ctx.fillStyle = '#fff5c2';
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
  ctx.fill();
};

const drawPacmanWord = (ctx: CanvasRenderingContext2D, word: PacmanWord) => {
  if (word.eaten) {
    return;
  }

  ctx.save();
  ctx.translate(word.x, word.y);
  ctx.fillStyle = 'rgba(12, 15, 22, 0.92)';
  ctx.strokeStyle = 'rgba(255, 230, 102, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-58, -22, 116, 44, 18);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8f5ec';
  ctx.font = '600 18px "Space Grotesk"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(word.text, 0, 1);
  ctx.restore();
};

const drawGhost = (ctx: CanvasRenderingContext2D, ghost: Ghost) => {
  ctx.save();
  ctx.translate(ghost.x, ghost.y);
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.arc(0, -4, 16, Math.PI, 0);
  ctx.lineTo(16, 16);
  ctx.lineTo(8, 10);
  ctx.lineTo(0, 16);
  ctx.lineTo(-8, 10);
  ctx.lineTo(-16, 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-6, -6, 4, 0, Math.PI * 2);
  ctx.arc(6, -6, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(-5, -5, 1.8, 0, Math.PI * 2);
  ctx.arc(7, -5, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawPacman = (ctx: CanvasRenderingContext2D, state: PacmanState) => {
  const angle = Math.atan2(state.direction.y, state.direction.x || 0.0001);
  const mouth = state.mouthOpen ? 0.36 : 0.14;
  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.rotate(angle);
  ctx.fillStyle = '#ffd84d';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, PLAYER_RADIUS, mouth, Math.PI * 2 - mouth);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const TextArcade = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<ArcadeMode>('asteroids');
  const [seedText, setSeedText] = useState('Zero-Day Firewall Packet Cipher Ghost Kernel Beacon');
  const [asteroidsState, setAsteroidsState] = useState<AsteroidsState>(() =>
    createAsteroidsState(['Zero-Day', 'Firewall', 'Packet', 'Cipher', 'Ghost', 'Kernel', 'Beacon']),
  );
  const [pacmanState, setPacmanState] = useState<PacmanState>(() =>
    createPacmanState(['Token', 'Patch', 'Proxy', 'Shield', 'Socket', 'Vector', 'Daemon', 'Orbit']),
  );
  const keysRef = useRef<Set<string>>(new Set());
  const bulletIdRef = useRef(1);

  const phraseList = useMemo(
    () =>
      seedText
        .split(/\s+/)
        .map((word) => word.trim())
        .filter(Boolean)
        .slice(0, 10),
    [seedText],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(event.key)) {
        event.preventDefault();
      }

      keysRef.current.add(event.key.toLowerCase());
      if (event.key === ' ') {
        setAsteroidsState((current) => {
          if (mode !== 'asteroids' || current.gameOver) {
            return current;
          }

          const bulletSpeed = 5.5;
          const newBullet: Bullet = {
            id: bulletIdRef.current += 1,
            x: current.ship.x + Math.cos(current.ship.angle) * 18,
            y: current.ship.y + Math.sin(current.ship.angle) * 18,
            vx: Math.cos(current.ship.angle) * bulletSpeed + current.ship.vx,
            vy: Math.sin(current.ship.angle) * bulletSpeed + current.ship.vy,
            life: 60,
          };

          return { ...current, bullets: [...current.bullets, newBullet] };
        });
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode]);

  useEffect(() => {
    let animationFrame = 0;

    const loop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (canvas && ctx) {
        drawBackground(ctx);

        if (mode === 'asteroids') {
          setAsteroidsState((current) => {
            if (current.gameOver) {
              return current;
            }

            const nextShip = { ...current.ship };
            const keys = keysRef.current;
            if (keys.has('arrowleft') || keys.has('a')) nextShip.angle -= 0.07;
            if (keys.has('arrowright') || keys.has('d')) nextShip.angle += 0.07;
            if (keys.has('arrowup') || keys.has('w')) {
              nextShip.vx += Math.cos(nextShip.angle) * 0.14;
              nextShip.vy += Math.sin(nextShip.angle) * 0.14;
            }

            nextShip.vx *= 0.992;
            nextShip.vy *= 0.992;
            nextShip.x = wrap(nextShip.x + nextShip.vx, CANVAS_WIDTH);
            nextShip.y = wrap(nextShip.y + nextShip.vy, CANVAS_HEIGHT);

            const bullets = current.bullets
              .map((bullet) => ({
                ...bullet,
                x: wrap(bullet.x + bullet.vx, CANVAS_WIDTH),
                y: wrap(bullet.y + bullet.vy, CANVAS_HEIGHT),
                life: bullet.life - 1,
              }))
              .filter((bullet) => bullet.life > 0);

            let score = current.score;
            let lives = current.lives;

            const words = current.words
              .map((word) => ({
                ...word,
                x: wrap(word.x + word.vx, CANVAS_WIDTH),
                y: wrap(word.y + word.vy, CANVAS_HEIGHT),
              }))
              .filter((word) => {
                const hitByBullet = bullets.some((bullet) => {
                  const dx = bullet.x - word.x;
                  const dy = bullet.y - word.y;
                  return Math.sqrt(dx * dx + dy * dy) < word.radius;
                });

                if (hitByBullet) {
                  score += word.text.length * 10;
                  return false;
                }

                return true;
              });

            const shipCrash = words.some((word) => {
              const dx = nextShip.x - word.x;
              const dy = nextShip.y - word.y;
              return Math.sqrt(dx * dx + dy * dy) < word.radius + SHIP_RADIUS * 0.7;
            });

            if (shipCrash) {
              lives -= 1;
              nextShip.x = CANVAS_WIDTH / 2;
              nextShip.y = CANVAS_HEIGHT / 2;
              nextShip.vx = 0;
              nextShip.vy = 0;
            }

            const nextState = {
              ship: nextShip,
              bullets: bullets.filter((bullet) =>
                !current.words.some((word) => {
                  const dx = bullet.x - word.x;
                  const dy = bullet.y - word.y;
                  return Math.sqrt(dx * dx + dy * dy) < word.radius;
                }),
              ),
              words,
              score,
              lives,
              gameOver: lives <= 0 || words.length === 0,
            };

            drawShip(ctx, nextState.ship);
            nextState.bullets.forEach((bullet) => drawBullet(ctx, bullet));
            nextState.words.forEach((word) => drawAsteroidsWord(ctx, word));

            return nextState;
          });
        } else {
          setPacmanState((current) => {
            if (current.gameOver) {
              return current;
            }

            const keys = keysRef.current;
            const direction = { ...current.direction };
            if (keys.has('arrowleft') || keys.has('a')) {
              direction.x = -1;
              direction.y = 0;
            }
            if (keys.has('arrowright') || keys.has('d')) {
              direction.x = 1;
              direction.y = 0;
            }
            if (keys.has('arrowup') || keys.has('w')) {
              direction.x = 0;
              direction.y = -1;
            }
            if (keys.has('arrowdown') || keys.has('s')) {
              direction.x = 0;
              direction.y = 1;
            }

            const player = {
              x: clamp(current.player.x + direction.x * 2.8, PLAYER_RADIUS, CANVAS_WIDTH - PLAYER_RADIUS),
              y: clamp(current.player.y + direction.y * 2.8, PLAYER_RADIUS, CANVAS_HEIGHT - PLAYER_RADIUS),
            };

            let score = current.score;
            const words = current.words.map((word) => {
              if (word.eaten) {
                return word;
              }

              const dx = player.x - word.x;
              const dy = player.y - word.y;
              if (Math.sqrt(dx * dx + dy * dy) < 48) {
                score += word.text.length * 8;
                return { ...word, eaten: true };
              }

              return word;
            });

            let lives = current.lives;
            const ghosts = current.ghosts.map((ghost) => {
              let nextX = ghost.x + ghost.vx;
              let nextY = ghost.y + ghost.vy;

              if (nextX < 24 || nextX > CANVAS_WIDTH - 24) ghost.vx *= -1;
              if (nextY < 24 || nextY > CANVAS_HEIGHT - 24) ghost.vy *= -1;

              nextX = clamp(ghost.x + ghost.vx, 24, CANVAS_WIDTH - 24);
              nextY = clamp(ghost.y + ghost.vy, 24, CANVAS_HEIGHT - 24);

              return { ...ghost, x: nextX, y: nextY };
            });

            const touchedGhost = ghosts.some((ghost) => {
              const dx = player.x - ghost.x;
              const dy = player.y - ghost.y;
              return Math.sqrt(dx * dx + dy * dy) < 26;
            });

            const nextPlayer = touchedGhost ? { x: 100, y: 100 } : player;
            if (touchedGhost) {
              lives -= 1;
            }

            const nextState = {
              player: nextPlayer,
              direction,
              mouthOpen: !current.mouthOpen,
              words,
              ghosts,
              score,
              lives,
              gameOver: lives <= 0 || words.every((word) => word.eaten),
            };

            nextState.words.forEach((word) => drawPacmanWord(ctx, word));
            nextState.ghosts.forEach((ghost) => drawGhost(ctx, ghost));
            drawPacman(ctx, nextState);

            return nextState;
          });
        }

        ctx.fillStyle = 'rgba(255,255,255,0.82)';
        ctx.font = '500 14px "IBM Plex Mono"';
        ctx.textAlign = 'left';
        ctx.fillText(mode === 'asteroids' ? 'Asteroids Text Blaster' : 'Pac-Man Text Muncher', 18, 28);
      }

      animationFrame = window.requestAnimationFrame(loop);
    };

    animationFrame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [mode]);

  const resetGames = () => {
    const fallbackAsteroids = ['Zero-Day', 'Firewall', 'Packet', 'Cipher', 'Ghost', 'Kernel', 'Beacon'];
    const fallbackPacman = ['Token', 'Patch', 'Proxy', 'Shield', 'Socket', 'Vector', 'Daemon', 'Orbit'];
    setAsteroidsState(createAsteroidsState(phraseList.length > 0 ? phraseList : fallbackAsteroids));
    setPacmanState(createPacmanState(phraseList.length > 0 ? phraseList : fallbackPacman));
  };

  useEffect(() => {
    resetGames();
  }, [seedText]);

  const activeState = mode === 'asteroids' ? asteroidsState : pacmanState;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Text Arcade | CesiumCyber</title>
        <meta
          name="description"
          content="Play Asteroids-style and Pac-Man-style mini-games where your text becomes the target."
        />
      </Helmet>

      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Arcade Lab</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Turn text into targets.</h1>
            <p className="text-lg text-muted-foreground">
              Type words, then blast them with a starship or chew through them in a Pac-Man-style maze run.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seed Text</CardTitle>
              <CardDescription>
                Enter the words you want to destroy. Separate them with spaces.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <Input
                value={seedText}
                onChange={(event) => setSeedText(event.target.value)}
                placeholder="Zero-Day Firewall Packet Cipher"
              />
              <Button onClick={resetGames}>Respawn Words</Button>
            </CardContent>
          </Card>

          <Tabs value={mode} onValueChange={(value) => setMode(value as ArcadeMode)} className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="asteroids">Asteroids</TabsTrigger>
              <TabsTrigger value="pacman">Pac-Man</TabsTrigger>
            </TabsList>

            <TabsContent value="asteroids">
              <Card>
                <CardHeader>
                  <CardTitle>Asteroids Text Blaster</CardTitle>
                  <CardDescription>
                    Rotate with left/right, thrust with up, and press space to shoot words out of orbit.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="pacman">
              <Card>
                <CardHeader>
                  <CardTitle>Pac-Man Text Muncher</CardTitle>
                  <CardDescription>
                    Move with arrow keys or WASD, eat every word, and avoid the roaming ghosts.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="overflow-hidden border-[#d4af37]/20">
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full h-auto bg-[#07090f] block"
              />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Score</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{activeState.score}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lives</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-bold">{activeState.lives}</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="text-lg font-medium">
                {activeState.gameOver ? 'Game over. Respawn to play again.' : 'Live'}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TextArcade;
