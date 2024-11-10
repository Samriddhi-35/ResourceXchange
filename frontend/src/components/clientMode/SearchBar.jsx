import PropTypes from 'prop-types';

const SearchBar = ({
  searchValue,
  onSearchChange,
  filter1Text,
  onFilter1Toggle,
  filter2Text,
  onFilter2Toggle,
}) => {
  return (
    <div className="flex space-x-4 mb-8">
      <div className="w-full max-w-[998px] flex items-center bg-[#E8E8E7] rounded-lg shadow-sm px-3 py-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          className="text-[#163C4C] mr-2"
        >
          <path
            d="M28.7075 27.2925L22.4487 21.035C24.2628 18.8571 25.1673 16.0637 24.9743 13.2359C24.7812 10.4081 23.5054 7.76355 21.4122 5.85244C19.319 3.94134 16.5695 2.9108 13.7359 2.9752C10.9022 3.0396 8.20243 4.19398 6.19821 6.19821C4.19398 8.20243 3.0396 10.9022 2.9752 13.7359C2.9108 16.5695 3.94134 19.319 5.85244 21.4122C7.76355 23.5054 10.4081 24.7812 13.2359 24.9743C16.0637 25.1673 18.8571 24.2628 21.035 22.4487L27.2925 28.7075C27.3854 28.8004 27.4957 28.8741 27.6171 28.9244C27.7385 28.9747 27.8686 29.0005 28 29.0005C28.1314 29.0005 28.2615 28.9747 28.3829 28.9244C28.5043 28.8741 28.6146 28.8004 28.7075 28.7075C28.8004 28.6146 28.8741 28.5043 28.9244 28.3829C28.9747 28.2615 29.0005 28.1314 29.0005 28C29.0005 27.8686 28.9747 27.7385 28.9244 27.6171C28.8741 27.4957 28.8004 27.3854 28.7075 27.2925ZM4.99998 14C4.99998 12.2199 5.52782 10.4799 6.51675 8.99985C7.50569 7.51981 8.91129 6.36625 10.5558 5.68506C12.2004 5.00388 14.01 4.82565 15.7558 5.17291C17.5016 5.52018 19.1053 6.37735 20.3639 7.63602C21.6226 8.89469 22.4798 10.4983 22.8271 12.2442C23.1743 13.99 22.9961 15.7996 22.3149 17.4441C21.6337 19.0887 20.4802 20.4943 19.0001 21.4832C17.5201 22.4721 15.78 23 14 23C11.6138 22.9973 9.3262 22.0483 7.63894 20.361C5.95169 18.6738 5.00263 16.3861 4.99998 14Z"
            fill="#163C4C"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)} 
          placeholder="Search clients, folders..."
          className="w-full h-[59px] p-1 bg-transparent text-[#163C4C] outline-none"
        />
      </div>

      {/* Filters */}
      <div className="space-x-4">
        <button
          onClick={onFilter1Toggle}
          className="text-[#163C4C] hover:underline"
        >
          {filter1Text || "Filter 1"}
        </button>
        <button
          onClick={onFilter2Toggle}
          className="text-[#163C4C] hover:underline"
        >
          {filter2Text || "Filter 2"}
        </button>
      </div>
    </div>
  );
};

// PropTypes validation
SearchBar.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filter1Text: PropTypes.string,
  onFilter1Toggle: PropTypes.func.isRequired,
  filter2Text: PropTypes.string,
  onFilter2Toggle: PropTypes.func.isRequired,
};

export default SearchBar;
