import React, {Component} from 'react';
import SpellCard from './spellcard';
import './index.css';
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
      filteredSpells: [],              //used to store the data of each spell in the active spell list
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
	  this.setState({ isLoaded: true, spellList: spellList, filteredSpells: spellList, detailsLoaded: true });
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
          <FilteredSpellList
            spellList={this.state.spellList}
            selectedClass={this.state.selectedClass}
            selectedLevels={this.state.selectedLevels}
            selectedType={this.state.selectedType}
          />
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
          <option value='Barbarian'>Barbarian</option>
          <option value='Bard'>Bard</option>
          <option value='Cleric'>Cleric</option>
          <option value='Druid'>Druid</option>
          <option value='Fighter'>Fighter</option>
          <option value='Monk'>Monk</option>
          <option value='Paladin'>Paladin</option>
          <option value='Ranger'>Ranger</option>
          <option value='Sorcerer'>Sorcerer</option>
          <option value='Warlock'>Warlock</option>
          <option value='Wizard'>Wizard</option>
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
          <option value='Abjuration'>Abjuration</option>
          <option value='Conjuration'>Conjuration</option>
          <option value='Divination'>Divination</option>
          <option value='Enchantment'>Enchantment</option>
          <option value='Evocation'>Evocation</option>
          <option value='Illusion'>Illusion</option>
          <option value='Necromancy'>Necromancy</option>
          <option value='Transmutation'>Transmutation</option>
          <option value='Universal'>Universal (Wizards only)</option>
        </select>
      </label>
    </form>
  )
}

function FilteredSpellList(props) {
  var levelsString = "";
  var selectedClass = props.selectedClass;
  var selectedType = props.selectedType;
  var filteredSpells = props.spellList;
  const selectedLevels = props.selectedLevels.filter(level => level.selected).map(level => level.level);

  for (var i=0; i<selectedLevels.length; i++) {
    var level = selectedLevels[i]
    if (level === 0) {
      level = "Cantrip"
    } else {
      level = level.toString()
    }
    levelsString = levelsString.concat(level+', ')
  }

  if (selectedClass !== '') {
    filteredSpells = filteredSpells.filter(spell => spell.classes.map(classes => classes.name).includes(selectedClass))
  } else {
    selectedClass = "All";
  }
  if (selectedType !== '') {
    filteredSpells = filteredSpells.filter(spell => spell.school.name === selectedType)
  } else {
    selectedType = "All";
  }

  filteredSpells = filteredSpells.filter(spell => selectedLevels.includes(spell.level))

  const spellCards = filteredSpells.map(spell => <SpellCard details={spell}/>);

  return (
    <div>
      <div>
        <h1>Showing spells from class: {selectedClass}, levels: {levelsString} and type: {selectedType}</h1>
      </div>
      {spellCards}
    </div>
  )
}


export default App
