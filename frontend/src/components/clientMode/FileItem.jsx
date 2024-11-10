import PropTypes from 'prop-types';

const FileItem = ({ file }) => {
  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="py-3 px-4">{file.name}</td>
      <td className="py-3 px-4">{file.lastEdited}</td>
      <td className="py-3 px-4">{file.server}</td>
      <td className="py-3 px-4">{file.duration}</td>
      <td className="py-3 px-4">{file.size}</td>
    </tr>
  );
};

FileItem.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    lastEdited: PropTypes.string.isRequired,
    server: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
  }).isRequired,
};

export default FileItem;
