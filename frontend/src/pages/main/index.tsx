import { useState } from 'react';
import { Footer } from '../../components/footer/Footer';
import styled from '@emotion/styled';
import { Sketchbook } from '../../components/common/sketchbook/Sketchbook';
import { LargeButton } from '../../components/common/Button';
import { useTheme } from '@emotion/react';
import mainLogo from '../../assets/images/main-logo.png';
import gameAbstract from '../../assets/images/game-abstract.png';

const MainPage = () => {
  const theme = useTheme();
  const [showFooter, setShowFooter] = useState(true);

  return (
    <MainContainer>
      <Sketchbook>
        <img
          src={mainLogo}
          alt="MalGreem"
          style={{
            width: '80%',
          }}
        />
        <img
          src={gameAbstract}
          alt="Game Abstract"
          style={{
            width: '90%',
            marginTop: '20px',
            marginBottom: '30px',
          }}
        />
        <LargeButton backgroundColor={theme.colors.lightYellow}>
          Google로 로그인
        </LargeButton>
        <GameAsNonMemberButton>비회원으로 게임하기</GameAsNonMemberButton>
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

const GameAsNonMemberButton = styled.button`
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.darkGray};
  text-decoration: underline;
  text-underline-offset: 4px;
`;

export default MainPage;
