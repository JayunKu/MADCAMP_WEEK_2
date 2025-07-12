import {
  SketchbookContainer,
  SketchbookBinding,
  SketchbookRing,
  SketchbookPage,
} from './Sketchbook.styles';

export const Sketchbook = (props: { children: React.ReactNode }) => {
  const rings = Array.from({ length: 11 }, (_, i) => (
    <SketchbookRing key={i} />
  ));

  return (
    <SketchbookContainer>
      <SketchbookBinding>{rings}</SketchbookBinding>
      <SketchbookPage>{props.children}</SketchbookPage>
    </SketchbookContainer>
  );
};
