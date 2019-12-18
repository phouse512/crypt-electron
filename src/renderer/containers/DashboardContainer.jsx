import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { viewsEnum } from '../constants';
import { newPhotoMetadata } from '../actions/forms.actions';
import { 
  fetchAlbums, 
  fetchItems,
  postAlbumRequest,
  postItemRequest,
} from '../actions/items.actions';
import {
  changeAlbumModalState,
  changePhotoModalState,
  changePhotoView,
  changeView,
  displayMetadata,
  removePhotoFilter,
} from '../actions/views.actions';

import AddAlbumModal from '../components/modals/AddAlbumModal';
import AddPhotoModal from '../components/modals/AddPhotoModal';
import AlbumsDash from '../components/AlbumsDash';
import ManageDash from '../components/ManageDash';
import Navbar from '../components/Navbar';
import PhotosDash from '../components/PhotosDash';
import PhotoViewModal from '../components/modals/PhotoViewModal';
import SearchBar from '../components/SearchBar';


export class DashboardContainer extends React.Component {
  componentWillMount() {
    // fetch albums
    this.props.fetchAlbums(true);
  }

  render() {
    let viewComponent;
    switch(this.props.views.currentView) {
      case viewsEnum.ALBUMS:
        viewComponent = <AlbumsDash
          albums={this.props.albums}
          goToAlbum={this.props.goToAlbum}
          items={this.props.items}
        />;
        break;
      case viewsEnum.MANAGE:
        viewComponent = <ManageDash />;
        break;
      case viewsEnum.PHOTOS:
        viewComponent = <PhotosDash
          albums={this.props.albumMap}
          openPhotoView={(item) => this.props.changePhotoViewModal(true, item)}
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
            openAlbumModal={() => this.props.changeAlbumModal(true)}
            openPhotoModal={() => this.props.changePhotoModal(true)}
          />
          {viewComponent}
        </div>
        <AddPhotoModal
          addMetadata={this.props.addNewPhotoMetadata}
          albums={this.props.albums}
          closeHandler={() => this.props.changePhotoModal(false)}
          isOpen={this.props.views.photoModalState}
          mukObj={this.props.mukObj}
          openHandler={() => console.log('open handler')}
          saveImageRequest={this.props.saveImageRequest}
        />
        <AddAlbumModal
          closeHandler={() => this.props.changeAlbumModal(false)}
          isOpen={this.props.views.albumModalState}
          openHandler={() => console.log('album open handler')}
          saveAlbumRequest={this.props.saveAlbumRequest}
        />
        <PhotoViewModal
          changeViewMetadata={this.props.changePhotoViewMetadata}
          closeHandler={() => this.props.changePhotoViewModal(false, {})}
          currentItem={this.props.views.photoViewParams.currentItem}
          isOpen={this.props.views.photoViewModalState}
          openHandler={() => console.log('photo view open handler')}
          viewMetadata={this.props.views.photoViewParams.viewMetadata}
        />
      </div>
    );
  }
}

DashboardContainer.propTypes = {};

const mapStateToProps = (state) => ({
  albums: state.items.albumIds.map(id => state.items.albums[id]),
  albumMap: state.items.albums,
  items: state.items.itemIds.map(id => state.items.items[id]),
  mukObj: state.login.mukData,
  views: state.views,
});

const mapDispatchToProps = dispatch => ({
  addNewPhotoMetadata: (metadata) => dispatch(newPhotoMetadata(metadata)),
  changeView: (view) => dispatch(changeView({ view })),
  fetchAlbums: (fetchItems) => dispatch(fetchAlbums({ fetchItems })),
  fetchItems: (albumId) => dispatch(fetchItems({ albumId })),
  goToAlbum: (albumId) => dispatch(changeView({
    params: {album: [albumId]},
    view: viewsEnum.PHOTOS,
  })),
  changeAlbumModal: (newState) => dispatch(changeAlbumModalState({ newState })),
  changePhotoModal: (newState) => dispatch(changePhotoModalState({ newState })),
  changePhotoViewModal: (newState, item) => dispatch(changePhotoView({ newState, item })),
  changePhotoViewMetadata: () => dispatch(displayMetadata()),
  removePhotoFilter: (filter, value) => dispatch(removePhotoFilter({ filter, value })),
  saveAlbumRequest: ({ description, name }) => dispatch(postAlbumRequest({ description, name })),
  saveImageRequest: ({ albumId, itemData, itemDataHash, itemMetadata, itemMetadataHash}) => dispatch(postItemRequest({ 
      albumId, itemData, itemDataHash, itemMetadata, itemMetadataHash })),
});

const DashboardWrapper = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default DashboardWrapper;