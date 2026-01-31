

import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

interface LoadingSpinnerProps {
  showWhen: boolean;
  duration: number;
}

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
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  width: 50px;
  height: 50px;
  `;

export default function LoadingScreen({ showWhen, duration }: LoadingSpinnerProps) {
  return <StyledLoadingSpinnerWrapper $fadeout={!showWhen} $duration={duration}>
    <StyledLoadingSpinner>
      <LoadingSpinner bgStrokeColor='var(--hotpink-80)' spinnerStrokeColor='var(--hotpink-70)' />
    </StyledLoadingSpinner>
  </StyledLoadingSpinnerWrapper>;
};

