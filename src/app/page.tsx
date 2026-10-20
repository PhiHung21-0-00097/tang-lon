"use client";

import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0); // 0: chờ, 1: hộp quà, 2: mở hộp, 3: thiệp, 4: nhiều quà nhỏ, 5: lời chúc cuối
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => setStep(1), 600);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  };

  // Cánh hoa rơi
  useEffect(() => {
    if (!started || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const petals: any[] = [];
    const colors = ["#ff9ec7", "#ff6b9d", "#ff4d8d", "#ffb6c1", "#ff85a2", "#f9a8d4", "#f472b6"];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 13 + 7,
        speed: Math.random() * 1.3 + 0.5,
        sway: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.4 + 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((p) => {
        p.y += p.speed;
        p.x += Math.sin(p.y * p.sway) * 1.5;
        p.angle += 0.02;
        if (p.y > canvas.height + 30) {
          p.y = -30;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.55, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [started]);

  const openBigGift = () => {
    setStep(2);
    setTimeout(() => setStep(3), 1200);
  };

  const openCard = () => {
    setStep(4);
  };

  const openSmallGift = (id: number) => {
    if (openedGifts.includes(id)) return;
    setOpenedGifts((prev) => [...prev, id]);
    if (openedGifts.length + 1 >= 4) {
      setTimeout(() => setShowFinal(true), 800);
    }
  };

  const gifts = [
    { id: 1, emoji: "🎁", title: "Món quà 1", message: "Chúc Bé Lon luôn xinh đẹp và cười thật nhiều em nhé." },
    { id: 2, emoji: "💝", title: "Món quà 2", message: "Cảm ơn em đã mang đến những khoảnh khắc đáng nhớ cho anh." },
    { id: 3, emoji: "🌹", title: "Món quà 3", message: "Anh mong em luôn được yêu thương và che chở." },
    { id: 4, emoji: "✨", title: "Món quà 4", message: "Thưn Thưn." },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#10010e] text-white">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-10" />

      {/* Nền glow */}
      <div className="fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-pink-600/20 blur-[110px]" />
        <div className="absolute bottom-20 right-0 h-[350px] w-[350px] rounded-full bg-rose-500/15 blur-[90px]" />
      </div>

      {/* ========== MÀN HÌNH CHỜ ========== */}
      {!started && (
        <div
          onClick={handleStart}
          className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center bg-black/55 backdrop-blur-md"
        >
          <div className="animate-pulse text-center px-6">
            <div className="mb-6 text-7xl">🎁</div>
            <p className="text-2xl font-light text-pink-100">Chạm để mở quà</p>
            <p className="mt-2 text-sm text-pink-200/70">Dành riêng cho Bé Lon</p>
          </div>
        </div>
      )}

      {/* ========== BƯỚC 1: HỘP QUÀ LỚN ========== */}
      {started && step === 1 && (
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5">
          <p className="mb-8 text-lg text-pink-200/90">Có một món quà đang chờ em…</p>
          <button
            onClick={openBigGift}
            className="group relative transition-transform active:scale-95"
          >
            <div className="text-9xl drop-shadow-[0_0_30px_rgba(255,105,180,0.6)] transition-all group-hover:scale-105">
              🎁
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-pink-500/20 px-5 py-2 text-sm text-pink-100 backdrop-blur-sm">
              Chạm để mở
            </div>
          </button>
        </div>
      )}

      {/* ========== BƯỚC 2: HIỆU ỨNG MỞ HỘP ========== */}
      {step === 2 && (
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center">
          <div className="animate-bounce text-8xl">✨</div>
          <p className="mt-6 text-xl text-pink-100">Đang mở quà…</p>
        </div>
      )}

      {/* ========== BƯỚC 3: THIỆP ========== */}
      {step === 3 && (
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-5">
          <p className="mb-6 text-pink-200">Một tấm thiệp dành cho em</p>
          <button
            onClick={openCard}
            className="w-full max-w-sm rounded-3xl border border-pink-400/40 bg-gradient-to-b from-pink-500/20 to-rose-600/10 p-1 shadow-[0_0_40px_rgba(255,105,180,0.3)] transition-all active:scale-95"
          >
            <div className="rounded-[22px] bg-[#1a0a18]/80 px-6 py-10 text-center backdrop-blur-md">
              <div className="mb-4 text-5xl">💌</div>
              <p className="text-lg font-medium text-pink-100">Chạm để mở thiệp</p>
              <p className="mt-2 text-sm text-pink-300/70">Từ anh gửi đến Bé Lon</p>
            </div>
          </button>
        </div>
      )}

      {/* ========== BƯỚC 4: NHIỀU HỘP QUÀ NHỎ ========== */}
      {step >= 4 && (
        <div className="relative z-20 min-h-screen px-5 pb-24 pt-16">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="mb-2 text-2xl font-semibold text-pink-100 sm:text-3xl">
              Những món quà nhỏ
            </h2>
            <p className="mb-10 text-sm text-pink-300/80">
              Chạm vào từng hộp để mở nhé
            </p>

            <div className="grid grid-cols-2 gap-5">
              {gifts.map((gift) => {
                const isOpen = openedGifts.includes(gift.id);
                return (
                  <button
                    key={gift.id}
                    onClick={() => openSmallGift(gift.id)}
                    className={`relative overflow-hidden rounded-3xl border transition-all duration-500 active:scale-95 ${
                      isOpen
                        ? "border-pink-400/50 bg-pink-500/20"
                        : "border-pink-400/25 bg-white/5"
                    }`}
                  >
                    <div className="flex min-h-[160px] flex-col items-center justify-center p-4">
                      {!isOpen ? (
                        <>
                          <div className="text-5xl transition-transform duration-300">
                            {gift.emoji}
                          </div>
                          <p className="mt-3 text-sm text-pink-200">{gift.title}</p>
                          <p className="mt-1 text-xs text-pink-400/70">Chạm để mở</p>
                        </>
                      ) : (
                        <div className="animate-fade-in text-center">
                          <div className="mb-2 text-3xl">{gift.emoji}</div>
                          <p className="text-sm leading-relaxed text-pink-50">
                            {gift.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hiện khi đã mở hết 4 quà */}
            {showFinal && (
              <div className="mt-14 animate-fade-in">
                <div className="rounded-3xl border border-pink-300/30 bg-gradient-to-b from-pink-500/15 to-transparent px-6 py-8 backdrop-blur-md shadow-[0_0_50px_rgba(255,105,180,0.25)]">
                  <div className="mb-4 text-5xl">💕</div>
                  <h3 className="mb-4 text-xl font-semibold text-pink-100">
                    Lời chúc cuối cùng
                  </h3>
                  <p className="text-base leading-relaxed text-pink-50">
                    Cức yêu dấu,
                    <br /><br />
                    20/10 anh có món quá tinh thần dành cho em
                    <br /><br />
                    Món quà này tuy đơn giản nhưng anh hứa với em chỉ có 1 và duy nhất trên thế giới vì toàn bộ đều làm = code từng dòng chữ anh bấm, chứ tk đéo nào bấm
                    <br /><br />
                    Sẽ ko có bản lời chúc nào tương tự như vậy cả, vì anh có làm bản thứ 2 đâu mà coá keke
                          <br /><br />
                    Cảm ơn em đã làm 1 phần đặc biệt xuất hiện 
                    trong cuộc đời anh
                    <br /><br />
                    <span className="font-medium text-pink-200">
                      Iu Iu 🌸
                    </span>
                  </p>
                </div>

                <div className="mt-10 flex justify-center gap-4 text-3xl">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>🌸</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>💐</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>🌹</span>
                  <span className="animate-bounce" style={{ animationDelay: "450ms" }}>🌺</span>
                </div>

                <p className="mt-8 text-xs tracking-widest text-pink-300/50">
                  Dành riêng cho Bé Lon • 20.10
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audio */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/mylove.mp3" type="audio/mpeg" />
      </audio>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}