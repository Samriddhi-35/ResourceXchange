import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { saveAs } from "file-saver";
import axios from "axios";

const CodeEditor = ({ code, onCodeChange }) => {
  const [output, setOutput] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      onCodeChange(e.target.result);
    };
    reader.readAsText(uploadedFile);
  };

  const executeCode = async () => {
    if (!fileName || !code) {
      setOutput("File name and code content are required to run the code.");
      return;
    }

    try {
      console.log("Sending request to backend...");

      // Make a POST request to the backend
      const response = await axios.post("http://127.0.0.1:5000/run_code", {
        file_name: fileName,
        code_content: code,
      });

      // Handle the response
      console.log("Response received:", response.data);
      const { status, output } = response.data;
      if (status === "success") {
        setOutput(output);
      } else {
        setOutput(`Error: ${output}`);
      }
    } catch (error) {
      console.error("Failed to run code:", error);
      setOutput(`Failed to run code: ${error.message}`);
    }
  };

  // Handle saving the modified file
  const saveFile = () => {
    if (!file) {
      alert("No file uploaded to save!");
      return;
    }
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(blob, fileName);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h2 className="text-2xl font-semibold">Code Editor with File Upload</h2>

      {/* File Upload */}
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".py"
        className="mb-2 p-2 border border-gray-300 rounded-md"
      />

      {/* Code Editor */}
      <CodeMirror
        value={code}
        extensions={[python()]}
        onChange={(value) => onCodeChange(value)}
        theme="dark"
        height="400px"
        className="w-full border border-[#60AACA] rounded-md"
      />

      {/* Buttons for Execute and Save */}
      <div className="flex space-x-4">
        <button
          onClick={executeCode}
          className="text-lg font-bold px-6 py-2 bg-[#2D7797] text-[#ffffff] rounded-lg shadow-md hover:bg-[#D4E7F0] hover:text-[#2D7797] transition-all"
        >
          Run Code
        </button>
        <button
          onClick={saveFile}
          className="text-lg font-bold px-6 py-2 bg-[#4CAF50] text-white rounded-lg shadow-md hover:bg-[#45A049] transition-all"
        >
          Save File
        </button>
      </div>

      {/* Output Display */}
      {output && (
        <div className="mt-4 w-full p-4 border border-gray-300 rounded-md bg-gray-100">
          <h3 className="text-lg font-semibold">Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;