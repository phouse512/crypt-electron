import React from 'react';

export default class FieldFileInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { input: { onChange } } = this.props;
    onChange(e.target.files[0]);
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
