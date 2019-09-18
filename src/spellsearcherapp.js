import React, {Component} from 'react';
import SpellCard from './spellcard';
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

//handle the api calls. First we request a list of spells, which only contains
//spell names and urls to spell details in the api. Then, after we have the list
//we call the api again for each spell to get a list of the details.
  componentDidMount() {
    const url = this.state.url+this.state.selectedClass;
    fetch(url) //This is the call to the api requesting a list of urls for the next set of api calls
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            spellList: result.results
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
      .then(() => this.loadSpellData()) //this is where I call the api again to get the details not in the previous list
      .then(
        (result) => {
          this.setState({  //I think the problem is here with the asynchronicity of setState
            spellData: result,
            detailsLoaded: true,
          });
        });
  }

//method to load individual spell data through an api call.
//the url is contained in this.state.spellList[i].url
//which was populated by the previous api call
  async loadSpellData() {
    const spellList = this.state.spellList;
    var spellData = [];

    for (var i=0; i<spellList.length; i++) {
      fetch(spellList[i].url)
        .then(res => res.json())
        .then(
          (result) => {
            spellData.push(result)
          });
      }
    return spellData
  }

//prop method to change selectedClass in state
  _changeClass(classChangeEvent) {
    const newClass = classChangeEvent.target.value
    this.setState({
      selectedClass: newClass,
    });
  }

//prop method to toggle selected in this.state.levels[i]
  _toggleLevel(levelChangeEvent) {
    //event.target.value contains the level of the state.levels[i] that was changed. This is just an integer, so use it as the selector of the levels list
    const toggledLevel = levelChangeEvent.target.value;
    var levels = this.state.selectedLevels;
    levels[toggledLevel].selected = !levels[toggledLevel].selected;
    this.setState({
      selectedLevels: levels
    });
  }

//prop method to change selectedType in state
  _changeType(typeChangeEvent) {
    const newType = typeChangeEvent.target.value
    this.setState({
      selectedType: newType,
    });
  }

  render() {
    const error = this.state.error;
    const isLoaded = this.state.isLoaded;
    const detailsLoaded = this.state.detailsLoaded;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!(isLoaded && detailsLoaded)) {
      return <div>Loading...</div>;
    } else {

      var spellCards = []
      const spellData = this.state.spellData;

      for (var j=0; j<this.state.spellData.length; j++) {
        var spellCard = <SpellCard details={this.state.spellData[j]}/>
        spellCards.push(spellCard)
      }
    }

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
