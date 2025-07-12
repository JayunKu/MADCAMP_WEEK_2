import { FooterContainer } from './Footer.styles';
import githubLogo from '../../assets/images/github-logo.png';

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
