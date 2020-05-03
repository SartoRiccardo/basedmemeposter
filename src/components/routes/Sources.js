import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import Source from "../ui/Source";
import SourcePlaceholder from "../ui/placeholders/SourcePlaceholder";
import { connect } from "react-redux";
import { fetchSources } from "../../storage/actions/source";

class Sources extends React.Component {
  constructor(props) {
    super(props);

    const { status, fetchSources } = this.props;
    if(!status.initialized) {
      fetchSources();
    }
    this.reloadTimeout = null;

    document.title = `Sources - ${process.env.REACT_APP_TITLE}`;
  }

  componentDidUpdate(prevProps) {
    const { status, fetchSources } = this.props;

    const isLoading = this.reloadTimeout || status.actions.some(
      action => action.type === "SET_SOURCES"
    );
    if(!isLoading && !status.initialized) {
      console.count("Reload");
      this.reloadTimeout = setTimeout(
        () => {
          fetchSources();
          this.reloadTimeout = null;
        }, 5000
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.reloadTimeout);
  }

  render() {
    const { sources, status } = this.props;

    let sourceUi = [];
    if(status.initialized) {
      let sourcesByPlatform = {};
      for(const source of sources) {
        if(sourcesByPlatform[source.platform]) {
          sourcesByPlatform[source.platform] = [
            ...sourcesByPlatform[source.platform],
            source,
          ];
        }
        else {
          sourcesByPlatform[source.platform] = [ source ];
        }
      }

      let lastHrId = -1;
      sourceUi = Object.entries(sourcesByPlatform).map(
        ([ platform, platformSources ]) => (
          <MDBRow key={platform} className="mt-5">
            {
              platformSources.map(source => (
                <MDBCol className="px-1 py-1" key={source.id} size="12" md="6" lg="4">
                  <Source source={source} />
                </MDBCol>
              ))
            }
          </MDBRow>
        )
      );
    }
    else {
      const platforms = 3;
      const sourcesPerPlatform = 12;
      for(let i = 0; i < platforms; i++) {
        let platformSources = [];
        for(let j = 0; j < sourcesPerPlatform; j++) {
          platformSources.push(
            <MDBCol className="px-1 py-1" key={j} size="12" md="6" lg="4">
              <SourcePlaceholder />
            </MDBCol>
          );
        }

        sourceUi.push(
          <MDBRow key={i} className="mt-5">
            {platformSources}
          </MDBRow>
        )
      }
    }

    return (
      <MDBContainer>
        <MDBRow>
          <MDBCol className="text-center">
            <h1 className="mt-3 mb-1">Sources</h1>
            <hr className="mt-0" />
          </MDBCol>
        </MDBRow>

        {sourceUi}
      </MDBContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.source,
    status: state.status.source,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSources: () => dispatch(fetchSources()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sources);
