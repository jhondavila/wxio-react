import React from 'react';
import "./ToolsForm.scss"; 

export const PdfReadIframe = ({url}) => {
  return (
    <iframe src={url} />

  );
}