import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { viewsEnum } from '../constants';
import { 
  fetchAlbums, 
  fetchItems,
  postItemRequest,
} from '../actions/items.actions';
import { 
  changePhotoModalState, 
  changeView, 
  removePhotoFilter,
} from '../actions/views.actions';

import AddPhotoModal from '../components/modals/AddPhotoModal';
import AlbumsDash from '../components/AlbumsDash';
import ManageDash from '../components/ManageDash';
import Navbar from '../components/Navbar';
import PhotosDash from '../components/PhotosDash';
import SearchBar from '../components/SearchBar';


export class DashboardContainer extends React.Component {
  componentWillMount() {
    // fetch albums

    // fetch items]
    this.props.fetchAlbums();
    this.props.fetchItems(1);
  }

  render() {
    let viewComponent;
    switch(this.props.views.currentView) {
      case viewsEnum.ALBUMS:
        viewComponent = <AlbumsDash
          albums={this.props.albums}
          goToAlbum={this.props.goToAlbum}
        />;
        break;
      case viewsEnum.MANAGE:
        viewComponent = <ManageDash />;
        break;
      case viewsEnum.PHOTOS:
        viewComponent = <PhotosDash
          params={this.props.views.params}
          photos={this.props.items}
          removePhotoFilter={this.props.removePhotoFilter}
        />;
        break;
      default:
        viewComponent = <div />;
    }

    return (
      <div className="app-container">
        <div className="app-nav">
          <Navbar
            changeView={this.props.changeView}
            currentView={this.props.views.currentView}
          />
        </div>
        <div className="app-body">
          <SearchBar
            openPhotoModal={() => this.props.changePhotoModal(true)}
          />
          {viewComponent}
        </div>
        <AddPhotoModal
          closeHandler={() => this.props.changePhotoModal(false)}
          isOpen={this.props.views.photoModalState}
          mukObj={this.props.mukObj}
          openHandler={() => console.log('open handler')}
          saveImageRequest={this.props.saveImageRequest}
        />
      </div>
    );
  }
}

DashboardContainer.propTypes = {};

const mapStateToProps = (state) => ({
  albums: state.items.albumIds.map(id => state.items.albums[id]),
  items: state.items.itemIds.map(id => state.items.itemIds[id]),
  mukObj: state.login.mukData,
  views: state.views,
});

const mapDispatchToProps = dispatch => ({
  changeView: (view) => dispatch(changeView({ view })),
  fetchAlbums: () => dispatch(fetchAlbums()),
  fetchItems: (albumId) => dispatch(fetchItems({ albumId })),
  goToAlbum: (albumId) => dispatch(changeView({
    params: {album: [albumId]},
    view: viewsEnum.PHOTOS,
  })),
  changePhotoModal: (newState) => dispatch(changePhotoModalState({ newState })),
  removePhotoFilter: (filter, value) => dispatch(removePhotoFilter({ filter, value })),
  saveImageRequest: ({ albumId, itemData, itemDataHash, itemMetadata, itemMetadataHash}) => dispatch(postItemRequest({ 
      albumId, itemData, itemDataHash, itemMetadata, itemMetadataHash })),
});

const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default DashboardWrapper;