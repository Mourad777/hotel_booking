import React from 'react'
import styled, { keyframes } from 'styled-components';

const StyledLoaderWrapper = styled.div`
position: fixed; z-index: 5; top: 50%; left: 50%; transform: translateX(-50%) ;
`

const rotate = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`

const StyledLoader= styled.div`
  display: inline-block;
  width: 80px;
  height: 80px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #3f51b5;
    border-color: #3f51b5 transparent #3f51b5 transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
  
`

const Loader = () => (<StyledLoaderWrapper ><StyledLoader /></StyledLoaderWrapper>);

export default Loader