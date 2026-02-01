import styled from 'styled-components';

const StyledMain = styled.main`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  display: grid;
  place-content: center;
  background-color: var(--hotpink-90);
`;

interface MainContainerProps {
  children: React.ReactNode;
}

const OptionsWrapper: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <StyledMain>
      {children}
    </StyledMain>
  );
};

export default OptionsWrapper;