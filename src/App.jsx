import React, { useState, useRef, useEffect } from 'react';
import EntryGate from './components/EntryGate.jsx';
import IntroVideo from './components/IntroVideo.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import HeroSection from './components/HeroSection.jsx';
import ScratchReveal from './components/ScratchReveal.jsx';
import CountdownSection from './components/CountdownSection.jsx';
import StorySection from './components/StorySection.jsx';
import EventSection from './components/EventSection.jsx';
import VenueSection from './components/VenueSection.jsx';
import GallerySection from './components/GallerySection.jsx';
import RSVPSection from './components/RSVPSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [stage, setStage] = useState('gate'); // gate | intro | invitation
  const [scratchUnlocked, setScratchUnlocked] = useState(false);
  const audioRef = useRef(null);

  const handleOpen = () => {
    setStage('intro');
    if (audioRef.current) {
      audioRef.current.tryPlay();
    }
  };

  const handleIntroComplete = () => {
    setStage('invitation');
  };

  useEffect(() => {
    if (stage === 'invitation') {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [stage]);

  return (
    <div className="app-root">
      <AudioPlayer ref={audioRef} visible={stage !== 'gate'} />

      {stage === 'gate' && <EntryGate onOpen={handleOpen} />}

      {stage === 'intro' && <IntroVideo onComplete={handleIntroComplete} />}

      {stage === 'invitation' && (
        <main className="invitation">
          <HeroSection />
          <ScratchReveal onAllRevealed={() => setScratchUnlocked(true)} />
          <CountdownSection unlocked={scratchUnlocked} />
          <StorySection />
          <EventSection />
          <VenueSection />
          <GallerySection />
          <RSVPSection />
          <Footer />
        </main>
      )}
    </div>
  );
}
