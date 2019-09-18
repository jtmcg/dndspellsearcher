import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
} from 'react-native';
import ReactDOM from 'react-dom';
import SpellCard from './spellcard';

const styles = StyleSheet.create({
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

})

class SpellList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      spellList: [],
      url: this.props.url,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.url !== state.url) {
      return {
        url: props.url,
      };
    }

    return null
  }

  componentDidMount() {
    fetch(this.state.url)
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
    console.log(this.state.spellList[0])
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
    const {error, isLoaded, spellList } = this.state
    console.log(this.state.url)
    if (error) {
      return <div>Error, {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (spellList) {
      var i;
      var listData = [];
      console.log('loading spell data...')
      for (i=0; i<spellList.length; i++) {
        listData.push(this.renderSpell(i))
        }
      console.log('data loaded... displaying list')
      return (
        (
          <View style={styles.Wrapper}>
            <View style={styles.Container}>{listData}</View>
          </View>
        )
      )
    }
  }

}

export default SpellList
