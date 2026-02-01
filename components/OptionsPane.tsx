import styled from 'styled-components';

const StyledDiv = styled.div`
    padding: var(--s6);
    border-radius: var(--border-radius-2x);
    background: var(--white);
    box-shadow: 0 0 9px 0px hsl(333 93% 83% / 1);
`;

interface OptionsPaneProps {
  children: React.ReactNode;
}

const OptionsPane: React.FC<OptionsPaneProps> = ({ children }) => {
  return (
    <StyledDiv>
      {children}
    </StyledDiv>

  );
};

export default OptionsPane;