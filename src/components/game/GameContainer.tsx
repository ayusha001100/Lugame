import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { GAME_LEVELS } from '@/data/levels';
import { SplashScreen } from './SplashScreen';
import { CharacterCreation } from './CharacterCreation';
import { OfficeHub } from './OfficeHub';
import { RoomView } from './RoomView';
import { LevelPlay } from './LevelPlay';
import { CreativeLevelPlay } from './CreativeLevelPlay';
import { EvaluationScreen } from './EvaluationScreen';
import { PortfolioView } from './PortfolioView';
import { SettingsView } from './SettingsView';
import { NoLivesScreen } from './NoLivesScreen';
import { PremiumScreen } from './PremiumScreen';
import { LeaderboardView } from './LeaderboardView';
import { AchievementsView } from './AchievementsView';
import { SimulationView } from './SimulationView';
import { CertificationView } from './CertificationView';
import { AIAssistant } from './AIAssistant';
import { BackgroundMusic } from './BackgroundMusic';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthView } from './AuthView';

export const GameContainer: React.FC = () => {
  const {
    currentScreen,
    currentLevelId,
    player,
    setScreen,
    tick,
    setFirebaseUser,
    fetchPlayerProfile
  } = useGameStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        fetchPlayerProfile(user.uid);
      }
    });
    return () => unsubscribe();
  }, [setFirebaseUser, fetchPlayerProfile]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        // Force a regeneration check when the user returns to the tab
        useGameStore.getState().checkStaminaRegen();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      tick();
    }, 1000); // 1 second real time = 1 minute game time
    return () => clearInterval(interval);
  }, [player, tick]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthView />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'office-hub':
        return <OfficeHub />;
      case 'room':
        return <RoomView />;
      case 'level': {
        const level = GAME_LEVELS.find(l => l.id === currentLevelId);
        if (level?.taskType === 'creative-canvas') {
          return <CreativeLevelPlay />;
        }
        return <LevelPlay />;
      }
      case 'evaluation':
        return <EvaluationScreen />;
      case 'portfolio':
        return <PortfolioView />;
      case 'settings':
        return <SettingsView />;
      case 'no-lives':
        return <NoLivesScreen />;
      case 'premium':
        return <PremiumScreen />;
      case 'leaderboard':
        return <LeaderboardView />;
      case 'achievements':
        return <AchievementsView />;
      case 'simulation':
        return <SimulationView />;
      case 'certification':
        return <CertificationView />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen relative bg-background">
      <BackgroundMusic />
      {renderScreen()}
      {player && (currentScreen === 'office-hub' || currentScreen === 'room' || currentScreen === 'level') && (
        <AIAssistant
          levelId={currentLevelId || (player.completedLevels.length + 1)}
          taskPrompt={GAME_LEVELS.find(l => l.id === currentLevelId)?.taskPrompt || "Strategic consultation requested."}
        />
      )}
    </div>
  );
};
