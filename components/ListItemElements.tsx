import styled, { css } from 'styled-components';


const StyledItemNameURLPriceRegion = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--gutter);
`;

const StyledListItemURL = styled.div`
  font-size: var(--s0);
  color: var(--gray-50);
`;

const StyledPriceInput = styled.div`
  position: relative;
  margin-bottom: auto;
  
  > * {
    padding-left: calc(16px + 8px);
  }
  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: var(--padding-input);
    translate: 0 -50%;
    width: 12px;
    height: 12px;
    background-image: var(--icon-dollar-sign);
    opacity: 0.5;
    background-size: cover;
  }
`;

const StyledListItemNameBaseStyles = css`
  font-size: var(--s2);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
  padding: 0;
  text-box: normal;
`;

const StyledListItemNameToggleBtn = styled.button`
  text-box: normal;
  display: flex;
  border-radius: 3px;
  padding: 4px;
  box-shadow: 0 0 0 0px var(--color-hollow-button-border);
  transition-property: opacity, background-color, scale, box-shadow;
  transition-duration: 250ms;
  transition-timing-function: linear;
  position: relative;

  &:hover {
    box-shadow: 0 0 0 1px var(--color-hollow-button-border);
    transition-duration: 0ms;

    > * {
      opacity: 0.1;
      filter: blur(1.5px);
      scale: 0.98;
    }

    &:after {
      opacity: 1;
      filter: invert(0.6);
    }
  }

  &:after {
    content: "";
    pointer-events: none;
    position: absolute;
    inset: 50% 0 0 50%;
    translate: -50% -50%;
    width: 100%;
    height: 100%;
    background-image: var(--icon-pencil);
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function: linear;
  }
`

const StyledListItemNameH1 = styled.h1`
  ${StyledListItemNameBaseStyles}
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden; 
  transition: all 250ms;
`;

export {
  StyledPriceInput,
  StyledItemNameURLPriceRegion,
  StyledListItemNameH1,
  StyledListItemURL,
  StyledListItemNameToggleBtn
};