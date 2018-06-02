import React from 'react'
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import { common, COLORS } from './styles'
class Button extends React.Component {
  animations = {
    border: new Animated.Value(0),
    text: new Animated.Value(0),
    background: new Animated.Value(0)
  }

  constructor() {
    super()
    this.handleOnPress = this.handleOnPress.bind(this)
    this.animateButton = this.animateButton.bind(this)
    this.basicInterpolation = this.basicInterpolation.bind(this)
  }

  componentDidMount() {
    // console.log('component did mount')
  }

  animateButton() {
    Animated.parallel([
      Animated.timing(this.animations.background, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.text, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      }),
      Animated.timing(this.animations.border, {
        toValue: this.props.isEnabled? 100 : 0,
        duration: 200
      })
    ]).start()
  }

  handleOnPress() {
    console.log('pressed!')
    this.props.isEnabled && this.props.onPress && this.props.onPress()
  }

  basicInterpolation(colors) {
    return {
      inputRange: [0, 100],
      outputRange: colors
    }
  }

  render() {
    const defaultBackgroundColors = [COLORS.gray0, COLORS.orange]
    const defaultBorderColors = [COLORS.gray3, COLORS.orange]
    const defaultTextColors = [COLORS.gray3, COLORS.gray10]
    const animations = {
      background: this.animations.background.interpolate(
        this.basicInterpolation(defaultBackgroundColors)
      ),
      border: this.animations.border.interpolate(
        this.basicInterpolation(defaultBorderColors)
      ),
      text: this.animations.text.interpolate(
        this.basicInterpolation(defaultTextColors)
      )
    }
    this.animateButton()

    return (
      <TouchableWithoutFeedback onPress={this.handleOnPress}>
        <Animated.View style={[styleButton(animations), this.props.style]}>
          <Animated.Text style={{fontSize: 24, fontFamily: 'rubik-medium', color: animations.text, textAlign: 'center'}}>
            { this.props.value }
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }
}

function styleButton(animations) {
  return {
    backgroundColor: animations.background,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: animations.border,
    borderBottomColor: animations.border,
    borderLeftColor: animations.border,
    borderRightColor: animations.border,
    padding: 10,
    alignSelf: 'flex-start' // critical to create view width of contents
  }
}

const styles = StyleSheet.create({
  border: {
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
  bordered: {
    backgroundColor: COLORS.white,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopColor: COLORS.gray10,
    borderBottomColor: COLORS.gray10,
    borderLeftColor: COLORS.gray10,
    borderRightColor: COLORS.gray10,
  },
})

export default Button
