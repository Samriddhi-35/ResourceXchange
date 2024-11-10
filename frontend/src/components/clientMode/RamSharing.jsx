import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor'; // Import the new CodeEditor component
import ServerRunning from './ServerRunning';

const RamSharing = () => {
  const [code, setCode] = useState('// Start coding here');
  const [output, setOutput] = useState('');
  const [servers, setServers] = useState([
    { id: 1, name: 'Server 1', status: 'Running' },
    { id: 2, name: 'Server 2', status: 'Running' },
    { id: 3, name: 'Server 3', status: 'Idle' },
  ]);

  // Handle code change from CodeEditor
  const handleCodeChange = (value) => {
    setCode(value);
  };

  const executeCode = () => {
    setOutput(`Executed output of:\n${code}`);
  };

  useEffect(() => {
    executeCode();
  }, [code]);

  return (
    <div className="flex h-screen">
      {/* Left Pane - Code Editor */}
      <div className="w-2/3 p-4">
        <CodeEditor code={code} onCodeChange={handleCodeChange} />
      </div>

      {/* Right Pane - Output & Servers */}
      <div className="w-1/3 flex flex-col space-y-4 p-4">

        {/* Servers Section */}
        <ServerRunning servers={servers} />
      </div>
    </div>
  );
};

export default RamSharing;