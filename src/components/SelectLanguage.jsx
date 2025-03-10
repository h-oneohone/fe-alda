import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import languageCodes from '../AldaService/languageCodea';

const SelectLanguage = ({ onLanguageSelect }) => {
  // Set the initial state to the code for Vietnamese "vi-VN" "en-US"
  const [language, setLanguage] = useState('en-US');

  const handleChange = (event) => {
    setLanguage(event.target.value);
    onLanguageSelect(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
      <Select
        labelId='language-select-label'
        id='language-select'
        value={language}
        onChange={handleChange}
        displayEmpty
        sx={{
          color: 'white', // Set text color to white
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Set border color to white
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Ensure border color remains white when focused
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Set hover border color to white
          },
          '& .MuiSvgIcon-root': {
            // This targets the dropdown icon
            color: 'white', // Set the dropdown icon color to white
          },
        }}
      >
        {Object.entries(languageCodes).map(([code, details]) => (
          <MenuItem key={code} value={code}>
            {details.nativeName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectLanguage;
