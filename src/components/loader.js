import React from 'react';
import { connect } from 'react-redux';
import Loader from '@components/react-native-multi-loader';

// https://github.com/dharmen1901/react-native-multi-loader
const CustomLoader = ({ ...props }) => {
  return (
    <Loader
      visible={props.isProcessing}
      loaderType=""
      textType="characterGrow"
      colorText="#fff"
      textLoader="LOADING"
      sizeText={30}
    />
  );
};

const mapStateToProps = state => {
  return { isProcessing: state.processing.isProcessing };
};
export default connect(mapStateToProps, null)(CustomLoader);
