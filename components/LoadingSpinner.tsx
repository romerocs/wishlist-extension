import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  to {
    rotate: 360deg;
  }`;


interface LoadingSpinnerProps {
  size?: number;
  bgStrokeColor?: string;
  spinnerStrokeColor?: string
}

const StyledCircle = styled.circle`
  animation-name: ${rotateAnimation};
  animation-duration: 750ms;
  animation-iteration-count: infinite;
  animation-fill-mode: alternate;
  animation-timing-function: linear;
  transform-box: border-box;
  transform-origin: center;
`;

const StyledSVG = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
`;

export default function LoadingSpinner({ size = 50, spinnerStrokeColor = "gray", bgStrokeColor = "black" }: LoadingSpinnerProps): React.JSX.Element {
  return (
    <StyledSVG width={size} height={size} viewBox="0 0 50 50">
      <circle stroke={bgStrokeColor} fill="none" cx="25" cy="25" r="15" strokeWidth="5" />
      <StyledCircle
        stroke={spinnerStrokeColor}
        fill="none"
        cx="25"
        cy="25"
        r="15"
        strokeWidth="5"
        strokeDasharray="50,20"
        strokeLinecap="round"
      />
    </StyledSVG>
  )
}

