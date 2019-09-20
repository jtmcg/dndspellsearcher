import React, {Component} from 'react';
// import {
//   StyleSheet,
// } from 'react-native';
import './index.css';

// const styles = StyleSheet.create({
//
//   ExpandButton: {
//     backgroundColor: 'white',
//     padding: 10,
//     alignSelf: 'center',
//     borderTopLeftRadius: '5px',
//     borderTopRightRadius: '5px',
//     borderBottomLeftRadius: '50px',
//     borderBottomRightRadius: '50px',
//     minWidth: '100%',
//   },
//
// })

class SpellCard extends Component {

  higherLevel() {
    if (this.props.details.higher_level != null) {
      //console.log("higher level detected for "+this.state.spellData.name)
      return (
        <React.Fragment>
          <p><i>At Higher Levels:</i><br/>
          {this.props.details.higher_level}</p>
        </React.Fragment>
      )
    } else {
      return
    }
  }

  checkSchool() {
    if (this.props.details.school != null) {
      return this.props.details.school.name
    } else {
      return
    }
  }

  formatSchoolAndLevel() {
    const school = this.checkSchool();
    let string;
    if (this.props.details.level === 0){
      string = (school+' Cantrip');
    } else {
      string = ('Level '+this.props.details.level+' '+school);
    }

    if (this.props.details.ritual !== 'no') {
      string.concat(' (ritual)');
    }
    return string
  }

  makeClassList() {
    const classes = this.props.details.classes
    var classList = ""
    for (var i=0; i<classes.length; i++) {
      if (classList !== ""){
        classList = classList.concat(', ')
      }
      classList = classList.concat(classes[i].name)
    }
    return classList
  }

  returnImage() {
    const assets = require.context('./assets', true);
    const source = "./school-of-"+this.props.details.school.name+".png"
    const image = assets(source)
    return <img src={image} className="spell-school-image"/>
  }

  createLineBreakFlourish() {
    const assets = require.context('./assets', true);
    const source = "./"+this.props.details.school.name+"-flourish.png"
    const image = assets(source)
    return (
      <React.Fragment>
        <img src={assets('./line-break-flourish-left.png')} className="line-break-flourish-left"/>
        <img src={image} className="line-break-flourish-image"/>
        <img src={assets('./line-break-flourish-right.png')} className="line-break-flourish-right"/>
      </React.Fragment>
        )
  }

  render() {
    let spellData = this.props.details
    return (
      <div className="spell-card-container">
        <div className="spell-card-container-header">
          <div className="spell-school-image-div">
            {this.returnImage()}
          </div>
          <div className="spell-stats-inline">
            <div>
              <h2>{spellData.name}</h2>
              <p className="spell-level-and-school">{this.formatSchoolAndLevel()}</p>
            </div>
            <div>
              <p><b>Casting Time: </b>{spellData.casting_time}<br/>
              <b>Range: </b>{spellData.range}<br/>
              <b>Components: </b>{spellData.components} ({spellData.material})<br/>
              <b>Duration: </b>{spellData.duration}</p>
            </div>
          </div>
        </div>
        <div className="line-break-flourish">
          {this.createLineBreakFlourish()}
        </div>
        <div className="spell-details">
          <div>
            <p><b>Description: </b>{spellData.desc}</p>
          </div>
          <div>
            {this.higherLevel()}
          </div>
        </div>
      </div>

    )
  }
}

export default SpellCard
