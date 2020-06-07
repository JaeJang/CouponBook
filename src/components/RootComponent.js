import React, { Component } from 'react';
import Sibling from 'react-native-root-siblings';
import PropTypes from 'prop-types';

class RootComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.visible) {
      this.createModal();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.createModal();
      }
    }
    if (this.sibling) {
      this.updateModal();
    }
  }

  componentWillUnmount() {
    if (this.sibling) {
      this.sibling.destroy();
      this.sibling = null;
    }
  }

  createModal = () => {
    if (!this.sibling) {
      this.sibling = new Sibling(this.renderModal());
    }
  };

  updateModal = () => {
    this.sibling.update(this.renderModal());
  };

  onDismiss = () => {
    if (this.sibling) {
      this.sibling.destroy();
    }
    this.sibling = null;
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  };

  renderModal = () => {
    const RenderComponent = this.props.renderComponent;
    return <RenderComponent {...this.props} onDismiss={this.onDismiss} />;
  };

  render() {
    return null;
  }
}

RootComponent.propTypes = {
  visible: PropTypes.bool.isRequired,
  renderComponent: PropTypes.func.isRequired,
  onDismiss: PropTypes.func
};

export default RootComponent;
