import React, {Component} from 'react';
import SpellCard from './spellcard';
import axios from 'axios';

// import {
//   StyleSheet,
//   View,
//   Image,
//   TouchableHighlight,
// } from 'react-native';
//import ReactDOM from 'react-dom';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      detailsLoaded: false,
      error: null,
      selectedClass: '',          //used as the class filter, i.e. Wizard
      selectedLevels: [                   //used as the level select filter
        { level: 0, selected: true } ,
        { level: 1, selected: true } ,
        { level: 2, selected: true } ,
        { level: 3, selected: true } ,
        { level: 4, selected: true } ,
        { level: 5, selected: true } ,
        { level: 6, selected: true } ,
        { level: 7, selected: true } ,
        { level: 8, selected: true } ,
        { level: 9, selected: true } ,
      ],
      selectedType: '',                   //used as the spell school filter, i.e. Transmutation
      spellList: [],              //used to store the list of active spells based on filters
      spellData: [],              //used to store the data of each spell in the active spell list
      url: 'http://www.dnd5eapi.co/api/spells/',
    }

    this._changeClass = this._changeClass.bind(this);
    this._toggleLevel = this._toggleLevel.bind(this);
    this._changeType = this._changeType.bind(this);
  }

  componentDidMount() {
    this.createSpellList();
  }

  async createSpellList() {
    const spells = await this.getSpells();
    const spellList = await this.getSpellDetails(spells);
	  this.setState({ isLoaded: true, spellList, detailsLoaded: true });
  }

  async getSpells() {
	  const url = this.state.url + this.state.selectedClass;
	  const { data } = await axios.get(url);
	  return data.results;
  }

  async getSpellDetails(spells) {
    const spellPromises = spells.map(spell => axios.get(spell.url));
    const spellDetails = await Promise.all(spellPromises);
    const spellList = spells.map((spell, idx) => ({ ...spell, ...spellDetails[idx].data }));
    return spellList;
  }

  _changeClass(classChangeEvent) {
    const newClass = classChangeEvent.target.value;
	  // TODO :: need to use updated info to filter spellList into new prop of filteredSpells
    this.setState({ selectedClass: newClass });
  }

  _toggleLevel(levelChangeEvent) {
    //event.target.value contains the level of the state.levels[i] that was changed. This is just an integer, so use it as the selector of the levels list
    const toggledLevel = levelChangeEvent.target.value;
    const levels = this.state.selectedLevels;
    levels[toggledLevel].selected = !levels[toggledLevel].selected;
    // TODO :: need to use updated info to filter spellList into new prop of filteredSpells
    this.setState({ selectedLevels: levels });
  }

  _changeType(typeChangeEvent) {
    const newType = typeChangeEvent.target.value;
	  // TODO :: need to use updated info to filter spellList into new prop of filteredSpells
    this.setState({ selectedType: newType });
  }

  render() {
    const { error, isLoaded, detailsLoaded } = this.state;

    if (error) return <div>Error: {error.message}</div>;
    if (!(isLoaded && detailsLoaded)) return <div>Loading...</div>;

    const spellCards = this.state.spellList.map(spell => <SpellCard details={spell}/>);

    return(
      <div className="app-container">
        <div className="filter-bar">
          <ClassSelector
            selectedClass={this.state.selectedClass}
            changeClass={(classChangeEvent) => this._changeClass(classChangeEvent)}
            key="classSelector"
          />
          <LevelToggle
            selectedLevels={this.state.selectedLevels}
            toggleLevel={(levelChangeEvent) => this._toggleLevel(levelChangeEvent)}
            key="levelToggle"
          />
          <TypeSelector
            selectedType={this.state.selectedType}
            changeType={(typeChangeEvent) => this._changeType(typeChangeEvent)}
            key="typeSelector"
          />
          </div>

        <div className="spell-list">
          <ListTitle
            selectedClass={this.state.selectedClass}
            selectedLevels={this.state.selectedLevels}
            selectedType={this.state.selectedType}
          />
          {spellCards}
        </div>
      </div>
    )
  }
}

function ClassSelector(props) {
  return(
    <form>
      <label>
      Filter by Class:
        <select value={props.selectedClass} onChange={props.changeClass}>
          <option value=''>All</option>
          <option value='barbarian'>Barbarian</option>
          <option value='bard'>Bard</option>
          <option value='cleric'>Cleric</option>
          <option value='druid'>Druid</option>
          <option value='fighter'>Fighter</option>
          <option value='monk'>Monk</option>
          <option value='paladin'>Paladin</option>
          <option value='ranger'>Ranger</option>
          <option value='sorcerer'>Sorcerer</option>
          <option value='warlock'>Warlock</option>
          <option value='wizard'>Wizard</option>
        </select>
      </label>
    </form>
  )
}

function LevelToggle(props) {
  var radioButtons = []
  const selectedLevels = props.selectedLevels

  for (var i=0; i<selectedLevels.length; i++) {
    const currentLevel = selectedLevels[i];
    let levelName = currentLevel.level
    if (currentLevel.level === 0) {
      levelName = "Cantrip"
    }

    radioButtons.push(
      <label key={i}>
        <input type="checkbox" value={currentLevel.level} defaultChecked={currentLevel.selected} onClick={props.toggleLevel}/>
          {levelName}
      </label>
    )
  }

  return(
    <form>
      {radioButtons}
    </form>
  )
}

function TypeSelector(props) {
  return (
    <form>
      <label>
      Filter by Spell School (Type):
        <select value={props.selectedType} onChange={props.changeType}>
          <option value=''>All</option>
          <option value='abjuration'>Abjuration</option>
          <option value='conjuration'>Conjuration</option>
          <option value='divination'>Divination</option>
          <option value='enchantment'>Enchantment</option>
          <option value='evocation'>Evocation</option>
          <option value='illusion'>Illusion</option>
          <option value='necromancy'>Necromancy</option>
          <option value='transmutation'>Transmutation</option>
          <option value='universal'>Universal (Wizards only)</option>
        </select>
      </label>
    </form>
  )
}

function ListTitle(props) {
  var levelsString = ""
  const selectedLevels = props.selectedLevels
  for (var i=0; i<selectedLevels.length; i++) {
    var currentLevel = selectedLevels[i]
    if (currentLevel.selected) {
      var level = currentLevel.level
      level.toString()
      if (level === "0") {
        level = "Cantrip"
      }
      levelsString.concat(level, ", ")
    }
  }

  return (
    <h1>Showing spells from class: {props.selectedClass}, levels: {levelsString}, and type: {props.selectedType}</h1>
  )
}


export default App
