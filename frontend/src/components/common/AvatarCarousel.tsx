import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { AvatarFrame } from './AvatarFrame';
import { AvatarType } from '../../types/avatarType';

const AVATAR_LIST: AvatarType[] = [
  AvatarType.AVATAR_GREEN,
  AvatarType.AVATAR_RED,
  AvatarType.AVATAR_BROWN,
  AvatarType.AVATAR_GRAY,
  AvatarType.AVATAR_YELLOW,
];

export const AvatarCarousel = ({
  value,
  onChange,
}: {
  value: AvatarType;
  onChange: (type: AvatarType) => void;
}) => {
  const currentIdx = AVATAR_LIST.indexOf(value);

  const [slideIdx, setSlideIdx] = useState(currentIdx);
  const [animating, setAnimating] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    timeoutRef.current = setTimeout(() => {
      const newIdx = (slideIdx - 1 + AVATAR_LIST.length) % AVATAR_LIST.length;
      setSlideIdx(newIdx);
      onChange(AVATAR_LIST[newIdx]);
      setAnimating(false);
    }, 250);
  };

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    timeoutRef.current = setTimeout(() => {
      const newIdx = (slideIdx + 1) % AVATAR_LIST.length;
      setSlideIdx(newIdx);
      onChange(AVATAR_LIST[newIdx]);
      setAnimating(false);
    }, 250);
  };

  useEffect(() => {
    setSlideIdx(currentIdx);
  }, [currentIdx]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <CarouselWrapper>
      <ArrowButton onClick={handlePrev}>&lt;</ArrowButton>
      <SlideWindow>
        <SlideTrack $length={AVATAR_LIST.length} $slideIdx={slideIdx}>
          {AVATAR_LIST.map((avatar, idx) => (
            <SlideItem key={avatar}>
              <AvatarFrame size="big" avatarType={avatar} />
            </SlideItem>
          ))}
        </SlideTrack>
      </SlideWindow>
      <ArrowButton onClick={handleNext}>&gt;</ArrowButton>
    </CarouselWrapper>
  );
};

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.darkGray};
  padding: 0 8px;
  user-select: none;
`;

const SlideWindow = styled.div`
  width: 80px;
  height: 120px;
  overflow: hidden;
  position: relative;
`;

const SlideTrack = styled.div<{
  $length: number;
  $slideIdx: number;
}>`
  display: flex;
  width: ${({ $length }) => `calc(${80 * $length}px + ${8 * ($length - 1)}px)`};
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ $slideIdx }) => `translateX(calc(-88px * ${$slideIdx}))`};
`;

const SlideItem = styled.div`
  flex: 0 0 80px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;
