import PropTypes from "prop-types";

const UploadButton = ({ onClick }) => {
  return (
    <button
      className="fixed bottom-12 right-12 text-lg font-bold px-6 py-4 bg-[#2D7797] text-[#ffffff] rounded-lg shadow-md hover:bg-[#D4E7F0] hover:text-[#2D7797] transition-all"
      onClick={onClick}
    >
      + Upload
    </button>
  );
};

// Define prop types
UploadButton.propTypes = {
  onClick: PropTypes.func.isRequired, 
};

export default UploadButton;
