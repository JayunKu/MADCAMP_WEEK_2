import styled from '@emotion/styled';
import githubLogo from '../assets/images/github-logo.png';

export const Footer = (props: { show: boolean }) => {
  return (
    <FooterContainer show={props.show}>
      <p style={{ fontSize: '12px' }}>
        Developed by 몰입캠프 &nbsp;
        <a href="https://github.com/JayunKu/MADCAMP_WEEK_2">
          <img
            src={githubLogo}
            alt="GitHub"
            style={{
              width: '16px',
              height: '16px',
              marginRight: '8px',
              verticalAlign: 'middle',
            }}
          />
        </a>
      </p>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer<{ show?: boolean }>`
  width: 75%;
  justify-content: center;
  border-radius: 10px 10px 0 0;
  border-left: 2px solid ${({ theme }) => theme.colors.black};
  border-right: 2px solid ${({ theme }) => theme.colors.black};
  border-top: 2px solid ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.lightYellow};
  padding: 10px;
  box-shadow: ${({ theme }) => theme.shadows.defaultUp};
  display: flex;
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateY(${props => (props.show ? '0' : '60px')});
  pointer-events: ${props => (props.show ? 'auto' : 'none')};
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.21, -0.49, 0.83, 1.36);
`;
