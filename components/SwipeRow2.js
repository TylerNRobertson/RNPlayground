import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, Animated, TouchableWithoutFeedback, Easing } from 'react-native'
import { TapGestureHandler, State } from 'react-native-gesture-handler'

const ROW_HEIGHT = 76
const PHONE_WIDTH = Dimensions.get('window').width

export default class SwipeRow2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.height = new Animated.Value(ROW_HEIGHT)
  }
  onTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      this.setState({ open: !this.state.open })
      Animated.parallel([
        Animated.timing(this.height, {
          toValue: this.state.open ? ROW_HEIGHT : 400,
          duration: 250
        }),
      ], { useNativeDriver: true }).start()
    }
  }
  close = () => {
    Animated.parallel([
      Animated.timing(this.height, {
        toValue: ROW_HEIGHT,
        duration: 250
      }),
    ], { useNativeDriver: true }).start()
  }
  open = () => {
    Animated.parallel([
      Animated.timing(this.height, {
        toValue: 400,
        duration: 250
      }),
    ], { useNativeDriver: true }).start()
  }
  render() {
    const anim_style = {
      height: this.height
    }
    const margin = this.height.interpolate({
      inputRange: [ROW_HEIGHT, 300],
      outputRange: [8, 16],
      extrapolate: 'clamp'
    })
    const profile_anim = {
      width: this.height.interpolate({
        inputRange: [ROW_HEIGHT, 300],
	      outputRange: [60, 100],
	      extrapolate: 'clamp'
      }),
      height: this.height.interpolate({
        inputRange: [ROW_HEIGHT, 300],
	      outputRange: [60, 100],
	      extrapolate: 'clamp'
      }),
      margin
    }
    const header_anim = {
      height: this.height.interpolate({
        inputRange: [ROW_HEIGHT, 300],
	      outputRange: [ROW_HEIGHT, 132],
	      extrapolate: 'clamp'
      })
    }
    return (
      <TapGestureHandler numberOfTaps={1} onHandlerStateChange={this.onTap}>
        <Animated.View style={[styles.main, anim_style]}>
          <Animated.View style={[styles.header, header_anim]}>
            <Animated.View style={[styles.profile, profile_anim]}>
            </Animated.View>
            <View>
              <Text style={styles.text}>Tyler Robertson</Text>
            </View>
          </Animated.View>
          <Animated.View style={{ padding: margin }}>
            <Text style={styles.headText}>About Me</Text>
            <Text style={styles.text}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu purus porta,
              dictum erat eget, fringilla sem. Curabitur ornare laoreet urna, id vestibulum sapien.
              Quisque vel erat quam. Mauris laoreet velit dui, nec mattis sapien mollis ut. Sed
              pretium suscipit porta. Fusce interdum convallis diam eu vulputate. Cras at cursus
              lacus. Ut maximus at ante sollicitudin rutrum.
            </Text>
          </Animated.View>
        </Animated.View>
      </TapGestureHandler>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'red',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
  },
  profile: {
    backgroundColor: 'blue'
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  headText: {
    fontSize: 20,
    paddingBottom: 16,
    color: 'white',
    textAlign: 'center',
  }
})
