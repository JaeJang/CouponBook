import React from 'react';
import { connect } from 'react-redux';
import { CirclesLoader } from 'react-native-indicator';
const Loader = ({ ...props }) => {
  return props.isProcessing === true ? <CirclesLoader /> : null;
};

const mapStateToProps = state => {
  return { isProcessing: state.processing.isProcessing };
};
export default connect(mapStateToProps, null)(Loader);
