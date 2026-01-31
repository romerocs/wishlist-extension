import styled from "styled-components"
import { IconCheckmark } from "./IconCheckmark"
import "./index"; //layout components

const FadeText = styled.span<{ $shouldFadeIn: boolean, $saved?: boolean }>`
  animation: ${(props) => (props.$shouldFadeIn ? "fadeIn" : "fadeOut")} 0.5s ease-in-out forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

interface SaveTextProps {
  shoudFadeIn: boolean,
  saved: boolean
}

export const SaveText: React.FC<SaveTextProps> = ({ shoudFadeIn, saved }) => {
  const text = saved ? 'Saved' : 'Save';

  return <FadeText $shouldFadeIn={shoudFadeIn} $saved={saved}>
    <cluster-l justify='center' align="center" space="4px">
      {saved && <IconCheckmark />}
      {text}
    </cluster-l>
  </FadeText>
}
