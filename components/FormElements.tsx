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

export {
  StyledTextInput,
  StyledTextArea,
  StyledSelect
};