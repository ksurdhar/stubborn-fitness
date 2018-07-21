import React from 'react'
import {
  Dimensions,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Text
} from 'react-native'
import { Entypo, Feather } from '@expo/vector-icons'
import Swipeout from 'react-native-swipeout'

import { common, COLORS } from './common'
class ExpandingCard extends React.Component {
  animations = {
    height: new Animated.Value(0),
  }

  constructor() {
    super()

    this.state = {
      expanded: false
    }
  }

  animateExpansion() {
    Animated.timing(this.animations.height, {
      toValue: this.state.expanded? 100 : 0,
      duration: 350
    }).start()
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  handleOnPress = () => {
    console.log('toggling expand!', this.state.expanded)
    this.setState({
      expanded: !this.state.expanded
    })
  }

  renderFooter = () => {
    if (this.props.footer) {
      return (
        <View style={{
          borderTopColor: COLORS.gray1,
          borderTopWidth: 1,
          marginTop: 20, paddingLeft: 16,
          paddingRight: 16, paddingBottom: 16
        }}>
          { this.props.footer }
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    const { width } = Dimensions.get('window')

    // this needs serious work
    const cardHeight = this.animations.height.interpolate({
      inputRange: [0, 100],
      outputRange: this.props.cardHeights ? this.props.cardHeights : [90, 800]
    })

    this.animateExpansion()

    const deleteButton = (
      <View style={[common.row, {paddingTop: 16}]}>
        <Feather name={"trash"} size={28} color={COLORS.white}/>
      </View>
    )

    const swipeoutBtns = [
      {
        component: deleteButton,
        backgroundColor: COLORS.orange,
        onPress: this.props.deleteHandler
      }
    ]

    return (
      <View style={styleCard(width)}>
        <View style={{borderBottomColor: COLORS.gray1, borderBottomWidth: 1}}>
          <Swipeout disabled={this.props.swipeable ? false : true} right={swipeoutBtns} backgroundColor={COLORS.white}>
            <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16}}>
              { this.props.subHeader
                ? (<Text style={[common.tajawal3, {fontSize: 18, color: COLORS.gray8}]}>
                    {this.props.subHeader}
                  </Text>)
                : null
              }
              <Text style={[common.tajawal5, {fontSize: 26, color: COLORS.gray10}]}>
                {this.props.header}
              </Text>
            </View>
          </Swipeout>
        </View>
        <View style={{paddingTop: 10, paddingLeft: 16, paddingRight: 16}}>
          <Animated.View style={styleExpand(cardHeight)}>
            { this.props.children }
          </Animated.View>
          { this.props.expandable
            ? (<View style={[common.row, {marginTop: 10}]}>
                <TouchableWithoutFeedback onPress={this.handleOnPress}>
                  <Entypo name={this.state.expanded ? "chevron-up" : "chevron-down"} size={22} color={COLORS.gray3}/>
                </TouchableWithoutFeedback>
              </View>)
            : null
          }
        </View>
        { this.renderFooter() }
      </View>
    )
  }
}

function styleExpand(cardHeight, expanded) {
  if (expanded) {
    return {}
  } else {
    return {
      maxHeight: cardHeight,
      overflow: 'hidden',
    }
  }
}

function styleCard(width) {
  return {
    width: width - 30,
    backgroundColor: COLORS.white,
    marginBottom: 16,
    marginLeft: 6,
    shadowColor: COLORS.gray10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    paddingBottom: 8,
  }
}

export default ExpandingCard
