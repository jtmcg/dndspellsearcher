import React, {Component} from 'react';

class ClassFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {currentClass: ''}

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({currentClass: event.target.value});
    this.props.onChangeClass(event.target.value);
  }

  render() {
    return(
      <form>
        <label>
          Filter By Class:
          <select value={this.state.currentClass} onChange={this.handleChange}>
            <option value=''>All</option>
            <option value='bard'>Bard</option>
            <option value='cleric'>Cleric</option>
            <option value='druid'>Druid</option>
            <option value='paladin'>Paladin</option>
            <option value='ranger'>Ranger</option>
            <option value='sorcerer'>Sorcerer</option>
            <option value='warlock'>Warlock</option>
            <option value='wizard'>Wizard</option>
          </select>
        </label>
      </form>
    );
  }
}

export default ClassFilter
