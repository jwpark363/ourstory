import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import reset from "styled-reset";
import { createGlobalStyle } from 'styled-components';
import { ConfirmProvider } from './components/use-confirm__.tsx';

const GlobalStyle = createGlobalStyle`
  ${reset}
  *{
    box-sizing: border-box;
  }
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
  }
`;
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalStyle />
    <ConfirmProvider>
      <App />
    </ConfirmProvider>
  </StrictMode>,
)
