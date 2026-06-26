import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const AudioPlayer = forwardRef(function AudioPlayer({ visible }, ref) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    tryPlay: async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.55;
          await audioRef.current.play();
          setPlaying(true);
        }
      } catch (_) {
        setPlaying(false);
      }
    }
  }));

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch (_) {
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    return () => {
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/assets/music-placeholder.mp3" loop preload="auto" />
      {visible && (
        <button
          className={`audio-fab ${playing ? 'is-playing' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Pause music' : 'Play music'}
        >
          <span className="audio-ring" />
          <span className="audio-ring audio-ring-2" />
          {playing ? <FaPause /> : <FaPlay style={{ marginLeft: 2 }} />}
        </button>
      )}
      <style>{css}</style>
    </>
  );
});

const css = `
.audio-fab {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 80;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff5e6;
  background: linear-gradient(135deg, var(--deep), var(--rose));
  box-shadow: 0 12px 30px rgba(138, 79, 76, 0.35);
  font-size: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.audio-fab:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 18px 38px rgba(138, 79, 76, 0.45);
}
.audio-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.55);
  opacity: 0;
  pointer-events: none;
}
.audio-fab.is-playing .audio-ring {
  animation: audioPulse 1.8s ease-out infinite;
}
.audio-fab.is-playing .audio-ring-2 {
  animation-delay: 0.9s;
}
@keyframes audioPulse {
  0% { transform: scale(0.85); opacity: 0.9; }
  100% { transform: scale(1.6); opacity: 0; }
}
@media (max-width: 600px) {
  .audio-fab { right: 16px; bottom: 16px; width: 48px; height: 48px; }
}
`;

export default AudioPlayer;
