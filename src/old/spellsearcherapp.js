import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import ReactDOM from 'react-dom';
//import ClassFilter from './classfilter';
import SpellCard from './spellcard';


const styles = StyleSheet.create({
  SpellCardContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 10,
    margin: '2%',
    alignSelf: 'center',
    borderRadius: '8px',
    minWidth: '100%',
  },

  BlockSpacing: {
    marginBottom: '0.8em'
  },

  ExpandButton: {
    backgroundColor: 'white',
    padding: 10,
    alignSelf: 'center',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    borderBottomLeftRadius: '50px',
    borderBottomRightRadius: '50px',
    minWidth: '100%',
  },

  Wrapper: {
    backgroundImage: './images/spellpage.jpg',
  },

  Container: {
    maxWidth: '80%',
    minWidth: '80%',
    maxHeight: '100%',
    marginTop: '5%',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: '15px',
    alignSelf: 'center',
  },

});

// function ClassFilter(props) {
//   const currentClass = props.classFilter;
//   var value
//
//   return(
//     <form>
//       <label>
//         Filter By Class:
//         <select value={currentClass} onChange={props.onChangeClass(value)}>
//           <option value=''>All</option>
//           <option value='bard'>Bard</option>
//           <option value='cleric'>Cleric</option>
//           <option value='druid'>Druid</option>
//           <option value='paladin'>Paladin</option>
//           <option value='ranger'>Ranger</option>
//           <option value='sorcerer'>Sorcerer</option>
//           <option value='warlock'>Warlock</option>
//           <option value='wizard'>Wizard</option>
//         </select>
//       </label>
//     </form>
//     )
// }

class SpellSearcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classFilter: '',
      error: null,
      isLoaded: false,
      spellList: [],
      levelFilter: {
        '0' : true,
        '1' : true,
        '2' : true,
        '3' : true,
        '4' : true,
        '5' : true,
        '6' : true,
        '7' : true,
        '8' : true,
        '9' : true,
      },
      classUpdated: true,
      typeFilter: 'all',
      url: 'http://www.dnd5eapi.co/api/spells/',
    };
  }

  _handleChange(event) {
    const newClass = event.target.value
    this.setState({
      classFilter: newClass,
      classUpdated: true,
    },
     () => {this.updateAPICall(this.state.url+newClass);}
    );
  }

  componentDidMount() {
    if (this.state.classUpdated) {
      const url = this.state.url+this.state.classFilter
      this.updateAPICall(url);
    }
  }

  updateAPICall(url) {
    console.log('calling api: '+url)
    fetch(url)
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
      this.setState({
        classUpdated: false,
      })
  }

  renderSpell(i) {
    return (
      <SpellCard
        name={this.state.spellList[i].name}
        url={this.state.spellList[i].url}
        key={i}/>
    )
  }

  render() {
    const spellList = this.state.spellList;
    const classFilter = this.state.classFilter;
    var listData = [];
    for (var i=0; i<spellList.length; i++) {
      listData.push(
        this.renderSpell(i)
        )
      }

    console.log(listData)

    return(
      <View>
        <ClassFilter
          classFilter={classFilter}
          handleChange={(newClass) => this._handleChange(newClass)}/>
          <View style={styles.Wrapper}>
            <View style={styles.Container}>{listData}</View>
          </View>
      </View>
      )
    }
}

function ClassFilter(props) {
  return(
    <form>
      <label>
        Filter By Class:
        <select value={props.classFilter} onChange={props.handleChange}>
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

export default SpellSearcher
