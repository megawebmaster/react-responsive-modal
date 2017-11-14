import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Portal from 'react-minimalist-portal';
import CSSTransition from 'react-transition-group/CSSTransition';
import cx from 'classnames';
import injectSheet from 'react-jss';
import noScroll from 'no-scroll';
import styles from './styles';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPortal: props.open,
    };
  }

  componentDidMount() {
    if (this.props.closeOnEsc) {
      document.addEventListener('keydown', this.handleKeydown);
    }
    // Block scroll when initial prop is open
    if (this.props.open) {
      this.blockScroll();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.open && nextProps.open) {
      this.setState(
        {
          showPortal: true,
        },
        () => {
          this.blockScroll();
        }
      );
    }
  }

  componentWillUnmount() {
    if (this.props.closeOnEsc) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
    this.unblockScroll();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onClickOverlay = e => {
    const { classes, closeOnOverlayClick } = this.props;
    if (!closeOnOverlayClick || typeof e.target.className !== 'string') {
      return;
    }
    const className = e.target.className.split(' ');
    if (className.indexOf(classes.overlay) !== -1) {
      e.stopPropagation();
      this.props.onClose();
    }
  };

  onClickCloseIcon = e => {
    e.stopPropagation();
    this.props.onClose();
  };

  handleKeydown = e => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  handleExited = () => {
    this.setState({ showPortal: false });
    this.unblockScroll();
  };

  // eslint-disable-next-line class-methods-use-this
  blockScroll() {
    noScroll.on();
  }

  unblockScroll = () => {
    const openedModals = document.getElementsByClassName(
      this.props.classes.modal
    );
    if (openedModals.length === 1) {
      noScroll.off();
    }
  };

  render() {
    const {
      open,
      little,
      classes,
      overlayClassName,
      modalClassName,
      closeIconClassName,
      overlayStyle,
      modalStyle,
      showCloseIcon,
      closeIconSize,
      animationDuration,
    } = this.props;
    const { showPortal } = this.state;
    if (!showPortal) return null;
    return (
      <Portal>
        <CSSTransition
          in={open}
          appear
          classNames={{
            appear: classes.transitionEnter,
            appearActive: classes.transitionEnterActive,
            enter: classes.transitionEnter,
            enterActive: classes.transitionEnterActive,
            exit: classes.transitionExit,
            exitActive: classes.transitionExitActive,
          }}
          timeout={animationDuration}
          onExited={this.handleExited}
        >
          <div
            className={cx(
              classes.overlay,
              little ? classes.overlayLittle : null,
              overlayClassName
            )}
            onMouseDown={this.onClickOverlay}
            style={overlayStyle}
          >
            <div
              className={cx(classes.modal, modalClassName)}
              style={modalStyle}
            >
              {showCloseIcon ? (
                <svg
                  className={cx(classes.closeIcon, closeIconClassName)}
                  onClick={this.onClickCloseIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  width={closeIconSize}
                  height={closeIconSize}
                  viewBox="0 0 36 36"
                >
                  <path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z" />
                </svg>
              ) : null}
              {this.props.children}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    );
  }
}

Modal.propTypes = {
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  overlayClassName: PropTypes.string,
  modalClassName: PropTypes.string,
  closeIconClassName: PropTypes.string,
  overlayStyle: PropTypes.object,
  modalStyle: PropTypes.object,
  children: PropTypes.node,
  classes: PropTypes.object.isRequired,
  little: PropTypes.bool,
  showCloseIcon: PropTypes.bool,
  closeIconSize: PropTypes.number,
  animationDuration: PropTypes.number,
};

Modal.defaultProps = {
  closeOnEsc: true,
  closeOnOverlayClick: true,
  showCloseIcon: true,
  closeIconSize: 28,
  overlayClassName: null,
  modalClassName: null,
  closeIconClassName: null,
  overlayStyle: null,
  modalStyle: null,
  children: null,
  little: false,
  animationDuration: 500,
};

export default injectSheet(styles)(Modal);
