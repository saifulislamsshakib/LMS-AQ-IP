// import React, { useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// // const RichTextEditor = (input, setInput) => {
// const RichTextEditor = (input, setInput) => {
//   //   const [value, setValue] = useState("");
//   const handleChange = (content) => {
//     setInput({ ...input, description: content });
//   };
//   return (
//     <ReactQuill
//       theme="snow"
//       value={input.description}
//       onChange={handleChange}
//     />
//   );
// };
// export default RichTextEditor;

import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput((prev) => ({
      ...prev,
      description: content,
    }));
  };

  return (
    <ReactQuill
      theme="snow"
      value={input.description}
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;
