import { useState } from 'react';
import { Footer } from '../../components/footer/Footer';
import styled from '@emotion/styled';
import { Sketchbook } from '../../components/common/sketchbook/Sketchbook';

const MainPage = () => {
  const [showFooter, setShowFooter] = useState(true);

  return (
    <MainContainer>
      <Sketchbook>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
        <h1>Welcome to the Game Hub</h1>
      </Sketchbook>
      <Footer show={showFooter} />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding: 0 15px;
  width: 412px;
  background: #ededed;
  box-sizing: border-box;
`;

export default MainPage;
