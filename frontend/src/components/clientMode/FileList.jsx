import PropTypes from 'prop-types';

function FileList({ files }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b bg-gray-50 text-gray-600 uppercase text-sm">
            <th className="py-3 px-4">File Name</th>
            <th className="py-3 px-4">Last Edited On</th>
            <th className="py-3 px-4">Server</th>
            <th className="py-3 px-4">Storage Duration</th>
            <th className="py-3 px-4">Size</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => (
            <tr key={index} className="border-b hover:bg-gray-100">
              <td className="py-3 px-4">{file.name}</td>
              <td className="py-3 px-4">{file.lastEdited}</td>
              <td className="py-3 px-4">{file.server}</td>
              <td className="py-3 px-4">{file.duration}</td>
              <td className="py-3 px-4">{file.size}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FileList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lastEdited: PropTypes.string.isRequired,
      server: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FileList;
