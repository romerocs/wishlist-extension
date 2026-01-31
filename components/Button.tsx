

import styled from 'styled-components'

const StyledButton = styled.button<{ $disabled?: boolean, $saved?: boolean }>`
  color: var(--gray-1);
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  display: inline-block;
  width: var(--btn-width, auto);
  padding: 0 var(--s0);
  height: 36px;
  position: relative;
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

  ${props => props.$disabled && `
    background: var(--gray-15);
    pointer-events: none;
  `}

  ${props => props.$saved && `
    pointer-events: none;
  `}

`;


export default StyledButton;