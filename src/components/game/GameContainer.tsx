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
import { AchievementNotification } from './AchievementNotification';
import { AnimatedBackground } from './AnimatedBackground';
import { FloatingParticles } from './FloatingParticles';
import { TutorialWalkthrough } from './TutorialWalkthrough';
import { DailyChallengesModal } from './DailyChallengesModal';

export const GameContainer: React.FC = () => {
  const { 
    currentScreen, 
    currentLevelId,
    pendingAchievement, 
    clearPendingAchievement,
    player,
    showTutorial,
    setShowTutorial,
    completeTutorial,
    showDailyChallenges,
    setShowDailyChallenges,
    checkDailyLogin
  } = useGameStore();

  // Check daily login when entering office hub
  useEffect(() => {
    if (currentScreen === 'office-hub' && player) {
      checkDailyLogin();
      
      // Show tutorial for first-time players
      if (!player.hasSeenTutorial) {
        setShowTutorial(true);
      }
    }
  }, [currentScreen, player, checkDailyLogin, setShowTutorial]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'office-hub':
        return <OfficeHub />;
      case 'room':
        return <RoomView />;
      case 'level': {
        // Check if it's a canvas-based creative level
        const level = GAME_LEVELS.find(l => l.id === currentLevelId);
        if (level?.taskType === 'canvas') {
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
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <FloatingParticles count={25} />
      {renderScreen()}
      
      {/* Achievement notification */}
      <AchievementNotification
        achievement={pendingAchievement}
        onComplete={clearPendingAchievement}
      />

      {/* Tutorial for first-time players */}
      <TutorialWalkthrough
        isOpen={showTutorial}
        onComplete={completeTutorial}
        onSkip={completeTutorial}
      />

      {/* Daily challenges modal */}
      <DailyChallengesModal
        isOpen={showDailyChallenges && !showTutorial}
        onClose={() => setShowDailyChallenges(false)}
      />
    </div>
  );
};
