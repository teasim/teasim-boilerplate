/**
 * RepoListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { FormattedNumber } from "react-intl";

import { makeSelectCurrentUser } from "app/actions/home/selectors";

import ListItem from "app/components/ListItem";

export class RepoListItem extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const item = this.props.item;
    let nameprefix = "";

    // If the repository is owned by a different person than we got the data for
    // it's a fork and we should show the name of the owner
    if (item.owner.login !== this.props.currentUser) {
      nameprefix = `${item.owner.login}/`;
    }

    // Put together the content of the repository
    const content = (
      <div>
        <a href={item.html_url} target="_blank">
          {nameprefix + item.name}
        </a>
        <a href={`${item.html_url}/issues`} target="_blank">
          <FormattedNumber value={item.open_issues_count} />
        </a>
      </div>
    );

    // Render the content into a list item
    return <ListItem key={`repo-list-item-${item.full_name}`} item={content} />;
  }
}

RepoListItem.propTypes = {
  item: PropTypes.object,
  currentUser: PropTypes.string
};

export default connect(
  createStructuredSelector({
    currentUser: makeSelectCurrentUser()
  })
)(RepoListItem);