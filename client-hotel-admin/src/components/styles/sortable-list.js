import styled from "styled-components";

export const StyledDeleteButton = styled.button`
cursor: pointer; padding: 10; color: red; border: red 1px solid; background: rgba(219, 112, 147,0.1);
`

export const StyledGalleryImage = styled.img`
width: 130px;
cursor:grab;
@media only screen and (min-width: 500px) {
      width: 200px;
  }
`

export const StyledInnerItem = styled.div`
height: 100px;
display: flex;
max-width: 100%;
max-height: 100%;
align-items: center;
flex-direction: row;
justify-content: center;
@media only screen and (min-width: 500px) {
      height: 130px;
  }
`
export const StyledItem = styled.div`
display: flex;
padding: 16px;
position: relative;
max-width: 50%;
flex-basis: 100%;
border-radius: 2px;
flex-direction: column;
@media only screen and (min-width: 700px) {
      max-width: 33%;
  }
`
export const StyledAdminGalleryContainer = styled.div`
display: flex;
flex-wrap: wrap;
width: 100%;
margin: auto;
padding: 24px 12px 64px;
max-width: 720px;
min-height: 332px;
overflow-y: auto;
`