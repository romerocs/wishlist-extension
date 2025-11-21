

import styled from 'styled-components'
import type { MouseEventHandler } from '~node_modules/@types/react';

type ButtonTypes = {
  children: React.ReactNode,
  disabled: boolean,
  callback: MouseEventHandler
}

const StyledButton = styled.button`
  color: var(--gray-1);
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  width: var(--btn-width, auto);
  padding: var(--s-1) var(--s0);
  background: linear-gradient(
    90deg,
    hsl(90deg 100% 44%) 0%,
    hsl(88deg 100% 44%) 21%,
    hsl(87deg 100% 44%) 30%,
    hsl(86deg 100% 44%) 39%,
    hsl(84deg 100% 44%) 46%,
    hsl(83deg 100% 44%) 54%,
    hsl(82deg 100% 44%) 61%,
    hsl(80deg 100% 44%) 69%,
    hsl(79deg 100% 44%) 79%,
    hsl(78deg 100% 44%) 100%
  );
  border-radius: var(--border-radius-button);
  `;

function Button({ children, disabled = false, callback }: ButtonTypes): React.JSX.Element {

  return (
    <StyledButton onClick={callback} disabled={disabled}>{children}</StyledButton>
  );
}

export default Button;