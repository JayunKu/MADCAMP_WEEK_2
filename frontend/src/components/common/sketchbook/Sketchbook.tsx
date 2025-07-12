import React, { useState } from 'react';
import {
  SketchbookContainer,
  SketchbookBinding,
  SketchbookRing,
  SketchbookPage,
  SketchbookPageWrapper,
} from './Sketchbook.styles';

export const Sketchbook = (props: { children: React.ReactNode }) => {
  const [flipping, setFlipping] = useState(false);

  const handleFlip = () => {
    setFlipping(true);
    setTimeout(() => {
      //   setFlipping(false);
    }, 700);
  };

  const rings = Array.from({ length: 11 }, (_, i) => (
    <SketchbookRing key={i} />
  ));

  return (
    <SketchbookContainer>
      <SketchbookBinding>{rings}</SketchbookBinding>
      <SketchbookPageWrapper>
        <SketchbookPage flipping={flipping}>{props.children}</SketchbookPage>
      </SketchbookPageWrapper>
      {/* <div style={{ position: 'absolute', bottom: 20, right: 20 }}>
        <button onClick={handleFlip}>위로 넘기기</button>
      </div> */}
    </SketchbookContainer>
  );
};
