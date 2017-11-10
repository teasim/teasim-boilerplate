import React from "react";
import PropTypes from "prop-types";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { selectLocaleLanguage } from "app/actions/locale/index";

class LanguageProvider extends React.PureComponent {
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}
      >
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

LanguageProvider.propTypes = {
  locale: PropTypes.string,
  messages: PropTypes.object,
  children: PropTypes.element.isRequired
};

const mapStateToProps = createSelector(selectLocaleLanguage(), locale => ({
  locale
}));

export default connect(mapStateToProps)(LanguageProvider);