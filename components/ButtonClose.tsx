
import styled, { css } from 'styled-components';

const StyledButtonClose = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
`;

export default function ButtonClose(props: React.ButtonHTMLAttributes<HTMLButtonElement>): React.JSX.Element {
  return (
    <StyledButtonClose {...props}>
      <svg style={{ display: 'block' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    </StyledButtonClose>
  )
}