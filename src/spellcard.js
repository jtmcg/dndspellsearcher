import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';


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
  }

})

class SpellCard extends Component {

  higherLevel() {
    if (this.props.higher_level != null) {
      //console.log("higher level detected for "+this.state.spellData.name)
      return (
        <React.Fragment>
          <Text style={{fontStyle: 'italic', fontFamily: 'arial'}}>At Higher Levels:</Text>
          <Text>{this.props.higher_level}</Text>
        </React.Fragment>
      )
    } else {
      return
    }
  }

  checkSchool() {
    if (this.props.school != null) {
      return this.props.school.name
    } else {
      return
    }
  }

  formatSchoolAndLevel() {
    const school = this.checkSchool();
    let string;
    if (this.props.level === 0){
      string = (school+' Cantrip');
    } else {
      string = ('Level '+this.props.level+' '+school);
    }

    if (this.props.ritual !== 'no') {
      string.concat(' (ritual)');
    }
    return string
  }

  expandedInfo() {
    return null
  //   if (this.state.expanded) {
  //     var classList = this.makeClassList()
  //     var source = this.getSource()
  //     return(
  //       <React.Fragment>
  //         <View style={styles.BlockSpacing}>
  //           <Text><b>Eligible Classes: </b>{classList}</Text>
  //           <Text><b>Source: </b>{source}</Text>
  //         </View>
  //       </React.Fragment>
  //     )
  //   } else {
  //     return
  //   }
  }

  getSource() {
    var source = this.props.page
    if (source.includes('phb')) {
      source = source.replace('phb', "Player's Handbook, pg.")
    } else if (source.includes('xge')) {
      source = source.replace('xge', "Xanathar's Guide to Everything, pg.")
    }
    return source
  }

  makeClassList() {
    const classes = this.props.classes
    var classList = ""
    for (var i=0; i<classes.length; i++) {
      if (classList !== ""){
        classList = classList.concat(', ')
      }
      classList = classList.concat(classes[i].name)
    }
    return classList
  }

  expand() {
    return null
  //   const expanded = (this.state.expanded) ? false : true;
  //   this.setState({
  //     expanded: expanded
  //   })
  }

  render() {
    let spellData = this.props.details
    return (
      <View style={styles.SpellCardContainer}>
        <View style={styles.BlockSpacing}>
          <Text style={{fontWeight: 'bold', fontSize: 24}}>{spellData.name}</Text>
          <Text style={{fontStyle: 'italic', fontSize: 12}}>{this.formatSchoolAndLevel()}</Text>
        </View>
        <View style={styles.BlockSpacing}>
          <Text><b>Casting Time: </b>{spellData.casting_time}</Text>
          <Text><b>Range: </b>{spellData.range}</Text>
          <Text><b>Components: </b>{spellData.components} ({spellData.material})</Text>
          <Text><b>Duration: </b>{spellData.duration}</Text>
        </View>
        <View style={styles.BlockSpacing}>
          <Text>{spellData.desc}</Text>
        </View>
        <View style={styles.BlockSpacing}>
          {this.higherLevel()}
        </View>
        {this.expandedInfo()}
        <TouchableHighlight onPress={() => {this.expand()}} underlayColor='#E7D9BC'>
          <View style={styles.ExpandButton}>
          </View>
        </TouchableHighlight>
      </View>

    )
  }
}

export default SpellCard
