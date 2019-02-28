const { Component, h } = window.preact;
const { bindActionCreators } = window.Redux;
const { connect } = window.preactRedux;
const htm = window.htm;

import { fetchDetail } from '../actions/conferenceDetailActions.js';
import { fetchList } from '../actions/conferenceListActions.js';
import Navigation from '../components/Navigation.js';
import ConferenceListItem from '../components/ConferenceListItem.js';
import ConferenceDetailItem from "../components/ConferenceDetailItem.js";
import GitHubLink from "../components/GitHubLink.js";
import LoadingSpinner from "../components/LoadingSpinner.js";
import ErrorMessage from "../components/ErrorMessage.js";
import { updateMetaUrls, updateMetaTitles, updateMetaDescriptions, updateMetaImages } from "../utils/head.js";

const html = htm.bind(h);

class ConferenceDetail extends Component {

  componentDidMount() {
    this.props.fetchList();
    this.props.fetchDetail(this.props.conferenceId);

    window.scrollTo(0, 0);
  }

  render(props) {
    let { conferenceId, conferenceDetails, conferenceList } = props;
    let conferenceData = conferenceList.data.find(item => item.id === props.conferenceId);

    if (conferenceData) {
      updateMetaUrls(`https://confpad.io/${conferenceData.id}`);
      updateMetaTitles(`${conferenceData.name} | ConfPad`);
      updateMetaDescriptions(conferenceData.description);
      updateMetaImages('https://confpad.io/img/logo.png');
    }

    return html`
      <main class="mt4">
        ${conferenceList.isFetching && html`
          <${LoadingSpinner} />
        `}
        
        ${conferenceData && html`
            <div>
              <${Navigation} conferenceData=${conferenceData} />
              <${ConferenceListItem} ...${conferenceData} />
              <${GitHubLink} conferenceId=${conferenceId} />
            </div>
         `}
        
        ${conferenceList.error && !conferenceData && html`
          <${ErrorMessage} message="${conferenceList.error}">
        `}
        
        ${conferenceDetails.isFetching && html`
          <${LoadingSpinner} />
        `}
        
        ${conferenceDetails.data && html`
          <ul class="list ma0 pa0">
            ${conferenceDetails.data.map(data => html`
              <${ConferenceDetailItem} ...${data} conferenceId=${props.conferenceId} />
            `)}
          </ul>
        `}
        
        ${conferenceDetails.error && html`
          <${ErrorMessage} message="${conferenceDetails.error}" />
        `}
      </main>
    `;
  }

}

const mapStateToProps = state => {
  return {
    conferenceList: state.conferenceList,
    conferenceDetails: state.conferenceDetails,
  }
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ fetchList, fetchDetail }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceDetail);
