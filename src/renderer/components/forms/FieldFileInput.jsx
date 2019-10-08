import React from 'react';
const ipc = require('electron-better-ipc');

import ipcConstants from '../../../constants/ipc';

export default class FieldFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  async getEncryptedBase64(file) {
    const resp = await ipc.callMain(ipcConstants.GET_ENCRYPTED_PHOTO, {
      name: file.name,
      path: file.path,
      type: file.type,
    });
    return resp;
  }

  async onChange(e) {
    const { input: { onChange } } = this.props;
    const targetFile = e.target.files[0];
    if (targetFile) {
      const val = await this.getEncryptedBase64(targetFile);
      console.log(val);
      onChange(val);
    } else {
      onChange(null);
    }
  }

  render() {
    console.log(this.props);
    const { input: { value } } = this.props;
    const { input, label, required, meta, } = this.props;
    return (
      <div>
        <label>{label}</label>
        <div>
          <input
            accept='.jpg, .png, .jpeg'
            onChange={this.onChange}
            type='file'
          />
        </div>
      </div>
    );
  }
}
