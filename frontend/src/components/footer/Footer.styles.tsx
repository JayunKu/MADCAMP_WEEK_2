import styled from '@emotion/styled';

export const FooterContainer = styled.footer<{
  show?: boolean;
}>`
  display: ${props => (props.show ? 'flex' : 'none')};
  width: 75%;
  justify-content: center;
  margin-top: 20px;
  border-radius: 10px 10px 0 0;
  border-left: 2px solid ${({ theme }) => theme.colors.black};
  border-right: 2px solid ${({ theme }) => theme.colors.black};
  border-top: 2px solid ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.lightYellow};
  shadow: ${({ theme }) => theme.shadows.defaultUp};
`;
