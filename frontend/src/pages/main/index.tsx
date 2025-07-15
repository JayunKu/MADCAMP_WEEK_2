import { useState, useRef, useEffect } from 'react';
import { Footer } from '../../components/Footer';
import { Sketchbook } from '../../components/sketchbook/Sketchbook';
import { Spacer } from '../../components/Spacer';
import { useAuth } from '../../context/AuthContext';
import { LobbyPage } from './LobbyPage';
import { UserPage } from './UserPage';
import { RoomPage } from './RoomPage';
import { useUI } from '../../context/UIContext';

const MainPage = () => {
  const { player } = useAuth();
  const { showFooter } = useUI();

  const [showSketchbook, setShowSketchbook] = useState(true);
  const [pageIdx, setPageIdx] = useState(0);
  const [flipping, setFlipping] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flipToPage = (targetIdx: number) => {
    setFlipping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPageIdx(targetIdx);
      setFlipping(false);
    }, 500);
  };

  const toggleSketchbook = (callback: () => void = () => {}) => {
    setShowSketchbook(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, 500);
  };

  return !player ? null : (
    <>
      <Spacer y={40} />
      <Sketchbook
        show={showSketchbook}
        flipping={flipping}
        height="600px"
        width="380px"
        ringCount={11}
      >
        {
          [
            // 0: 로비 페이지
            <LobbyPage flipToPage={flipToPage} />,
            // 1: 방 생성 및 입장 페이지
            <UserPage flipToPage={flipToPage} />,
            // 2: 게임 준비 페이지
            <RoomPage
              flipToPage={flipToPage}
              toggleSketchbook={toggleSketchbook}
            />,
          ][pageIdx]
        }
      </Sketchbook>
      <Footer show={showFooter} />
    </>
  );
};

export default MainPage;
