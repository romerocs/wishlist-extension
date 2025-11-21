

import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  showWhen: boolean;
  duration: number;
}

const rotateAnimation = keyframes`
  to {
    rotate: 360deg;
  }`;

const StyledLoadingSpinnerWrapper = styled.div<{ $fadeout: boolean; $duration: number }>`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: var(--hotpink-90);
    opacity: 1;
    transition: opacity ${props => props.$duration}ms linear;

    ${props => props.$fadeout && `
      opacity: 0;
    `}
`;

const StyledLoadingSpinner = styled.div`
  position: absolute;
  width: 35px;
  aspect-ratio: 1 / 1;
  inset: 50%;
  translate: -50% -50%;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background-image: var(--icon-loading-spinner);
    background-size: contain;
    background-position: center;
    animation-name: ${rotateAnimation};
    animation-duration: 750ms;
    animation-fill-mode: alternate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    z-index: 2;
  }

  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0 0 0 / 0.15) ;
    border-radius: 100%;
    scale: 1.5;
    z-index: 1;
  }`;

export default function LoadingSpinner({ showWhen, duration }: LoadingSpinnerProps) {
  return <StyledLoadingSpinnerWrapper $fadeout={!showWhen} $duration={duration}><StyledLoadingSpinner /></StyledLoadingSpinnerWrapper>;
};

