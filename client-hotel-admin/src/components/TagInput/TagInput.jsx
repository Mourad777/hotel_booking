import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import './TagInput.css'
const TagInput = ({ label, values, onChange }) => {
    return (<div>
        <span>{label}</span>
        <div>
            <TagsInput inputProps={{ placeholder: "Add tag" }} value={values} onChange={onChange} />
        </div>
    </div>)

}

export default TagInput