import React from 'react';
const ipc = require('electron-better-ipc');

import ipcConstants from '../../../constants/ipc';

export default class FieldMetadataInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.addField = this.addField.bind(this);
    this.state = {
      data: [{ key: 'name', value: ''}],
    };
  }

  async getEncryptedMetadata(metadata) {
    const resp = await ipc.callMain(ipcConstants.GET_ENCRYPTED_METADATA, {
      metadata,
      muk: this.props.mukObj,
    });
    return resp;
  }

  async onChange(e) {
    const { input: { onChange } } = this.props;
    console.log(e);
  }

  addField() {
    const existingData = this.state.data;
    existingData.push({key: '', value: ''});
    this.setState({ data: existingData });
  }

  render() {
    const { input, label, required, meta, } = this.props;
    return (
      <div>
        <label>{label}</label>
        <div>
          {this.state.data.map((item, key) => {
            return (
              <div>
                <input
                  onChange={this.onChange}
                  type='text'
                />
                <input
                  onChange={this.onChange}
                  type='text'
                />
              </div>
            );
          })}
          <div
            onClick={this.addField}
          >Add Keypair</div>
        </div>
      </div>
    )
  }
}