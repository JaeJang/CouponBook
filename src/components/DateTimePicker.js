import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useDarkMode } from 'react-native-dark-mode';

const DateTimePicker_Custom = ({ ...props }) => {
  const isDarkModeEnabled = useDarkMode();

  return <DateTimePicker {...props} isDarkModeEnabled={isDarkModeEnabled} />;
};

export default DateTimePicker_Custom;
