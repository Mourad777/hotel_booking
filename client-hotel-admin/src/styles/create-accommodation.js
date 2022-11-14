import styled from "styled-components"
import { Button } from "semantic-ui-react"
import Dropzone from '../components/dropzone';


export const StyledMainTitle = styled.h1`text-align:center;`

export const StyledDropzone = styled(Dropzone)`
    border: 2px #e2e2e2 dashed;
`

export const StyledSubmitButton = styled(Button)`
    width: 100%; margin: 20px;
`
export const StyledDropzoneContainer = styled.div`
    margin: 20px;
`
