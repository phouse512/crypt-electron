import React from 'react';
const ipc = require('electron-better-ipc');

import ipcConstants from '../../../constants/ipc';

export default class FieldMetadataInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.addField = this.addField.bind(this);
    this.state = {
      count: 1,
      data: {key1: '', value1: ''},
    };
  }

  async getEncryptedMetadata(metadata) {
    const resp = await ipc.callMain(ipcConstants.GET_ENCRYPTED_METADATA, {
      metadata,
      muk: this.props.mukObj,
    });
    return resp;
  }

  onChange(key, val) {
    const { input: { onChange } } = this.props;
    const updatedObj = {};
    updatedObj[key] = val.target.value;
    this.setState({
      data: Object.assign({}, this.state.data, updatedObj),
    }, () => {
      onChange(this.state.data);
    });
  }

  addField() {
    const newCount = this.state.count + 1;
    const newObj = {};
    newObj[`key${newCount}`] = '';
    newObj[`value${newCount}`] = '';
    this.setState({ 
      count: newCount,
      data: Object.assign({}, this.state.data, newObj),
    });
  }

  render() {
    let contents = [];
    for (var i=1; i <= this.state.count; i++) {
      const keyKey = `key${i}`;
      const valueKey = `value${i}`;
      contents.push(
        <div>
          <input
            onChange={(e) => this.onChange(keyKey, e)}
            type='text'
            value={this.state.data[keyKey]}
          />
          <input
            onChange={(e) => this.onChange(valueKey, e)}
            type='text'
            value={this.state.data[valueKey]}
          />        
        </div>
      );
    }

    const { input, label, required, meta, } = this.props;
    return (
      <div>
        <label>{label}</label>
        <div>
          {contents}
          <div
            onClick={this.addField}
          >Add Keypair</div>
        </div>
      </div>
    )
  }
}