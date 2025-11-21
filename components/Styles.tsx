import styled, { css } from 'styled-components';

const inputBorder = '1px solid var(--gray-25)';
const inputBorderRadius = '4px';

const baseInputStylesObject = {
  border: inputBorder,
  padding: 'var(--padding-input)',
  borderRadius: inputBorderRadius,
  width: '100%',
  display: 'block',
};

const baseInputStyles = css(() => (baseInputStylesObject));

const StyledTextInput = styled.input`
  ${baseInputStyles}
`

const StyledTextArea = styled.textarea`
  ${baseInputStyles}
`

const StyledSelect = {
  border: inputBorder,
  borderRadius: inputBorderRadius
};

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

const StyledPopupWrapper = styled.div`
  width: 350px;
  padding: var(--vertical-rhythm-2x) var(--gutter-2x);
`;

const StyledItemNameURLPriceRegion = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--gutter);
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
  border-radius: 3px;z
  padding: 4px;
  box-shadow: 0 0 0 0px var(--hotpink-70);
  transition: box-shadow 250ms;

  &:hover {
    box-shadow: 0 0 0 1px var(--hotpink-70);
  }
`

const StyledListItemNameH1 = styled.h1`
  ${StyledListItemNameBaseStyles}
`;

const StyledListItemNameTextArea = styled.textarea<{ $height: number }>`
  ${StyledListItemNameBaseStyles}

    ${props => props.$height && `
      height: ${props.$height}px;
    `}
`;

const StyledListItemURL = styled.div`
  font-size: var(--s0);
  color: var(--gray-50);
`;


export {
  StyledTextInput,
  StyledTextArea,
  StyledSelect,
  StyledPriceInput,
  StyledPopupWrapper,
  StyledItemNameURLPriceRegion,
  StyledListItemNameH1,
  StyledListItemNameTextArea,
  StyledListItemURL,
  StyledListItemNameToggleBtn
};