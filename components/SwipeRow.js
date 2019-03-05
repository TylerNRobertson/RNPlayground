import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler'
import Animated, { Easing } from 'react-native-reanimated'

const {
  set,
  cond,
  eq,
  add,
  multiply,
  lessThan,
  spring,
  startClock,
  stopClock,
  clockRunning,
  sub,
  defined,
  Value,
  Clock,
  event,
  greaterThan,
  debug,
  block,
  and,
  interpolate,
  timing
} = Animated

const ROW_HEIGHT = 60
const PHONE_WIDTH = Dimensions.get('window').width

export default class SwipeRow extends Component {
  constructor(props) {
    super(props)
    const TOSS_SEC = 0.2
    const dragVX = new Value(0)
    const dragX = new Value(0)
    const prevDragX = new Value(0)
    const state = new Value(-1)
    const transX = new Value()
    const clock = new Clock()
    const snapPoint = cond(lessThan(add(transX, multiply(TOSS_SEC, dragVX)), -50), -164, 0)
    this.onGestureEvent = event([ { nativeEvent: { translationX: dragX, velocityX: dragVX, state: state } } ])
    this.transX = cond(
      eq(state, State.ACTIVE),
      [
        stopClock(clock),
        set(transX, add(transX, sub(dragX, prevDragX))),
        set(prevDragX, dragX),
        cond(greaterThan(transX, 0), set(transX, 0), cond(lessThan(transX, -200), set(transX, -200))),
        transX
      ],
      [
        set(prevDragX, 0),
        set(transX, cond(and(defined(transX),lessThan(transX, 0)), cond(
          eq(snapPoint, 0),
          runTiming(clock, transX, dragVX, snapPoint),
          runSpring(clock, transX, dragVX, snapPoint)
        ), 0))
      ]
    )
    this.onSingleTap = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {

      }
    }
    this.dynamic_width = {
      width: interpolate(this.transX, {
        inputRange:[-100, 0],
        outputRange:[100, 0]
      })
    }
    this.dynamic = {
      flex: 1,
      maxHeight: 60,
      backgroundColor: 'white',
      justifyContent: 'center',
      transform: [
        { translateX: this.transX }
      ],
      shadowColor: 'black',
      shadowOffset: { height: 2, width: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 2
    }
    this.dynamic_font = {
      fontWeight: 'bold',
      color: 'white',
      transform: [
        { scaleY: interpolate(this.transX, {
            inputRange: [-200, -160, -120, -80, -60, -20, 0],
            outputRange: [ 1.2, 1, 0.7, 0.5, 0.3, 0.2, 0.1]
          })
        },
        { scaleX: interpolate(this.transX, {
            inputRange: [-200, -160, -120, -80, -60, -20, 0],
            outputRange: [ 1.2, 1, 0.7, 0.5, 0.3, 0.2, 0.1]
          })
        }
      ],
    }
    this.button2 = {
      opacity: interpolate(this.transX, {
        inputRange: [-100, -80, -60, 0],
        outputRange: [1, 0.75, 0.5, 0.25]
      }),
      transform: [
        { scaleY: interpolate(this.transX, {
            inputRange: [-500, -164, -0],
            outputRange: [1, 1, 0.75]
          })
        }
      ],
      backgroundColor: 'red'
    }
    this.button1 = {
      opacity: interpolate(this.transX, {
        inputRange: [-100, -80, -60, 0],
        outputRange: [1, 0.75, 0.5, 0.25]
      }),
      transform: [
        { scaleY: interpolate(this.transX, {
            inputRange: [-500, -164, -0],
            outputRange: [1, 1, 0.75]
          })
        }
      ],
      backgroundColor: 'blue'
    }
  }
  render() {
    const { onDeletePress, onEditPress, children } = this.props
    return (
      <View style={styles.row}>
        <PanGestureHandler maxPointers={1} onGestureEvent={this.onGestureEvent} onHandlerStateChange={this.onGestureEvent}>
          <Animated.View style={this.dynamic}>
            <TapGestureHandler onHandlerStateChange={this.onSingleTap} numberOfTaps={1}>
              <View style={{ flex: 1, backgroundColor: 'red' }}>

              </View>
            </TapGestureHandler>
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={[styles.static, this.dynamic_width]}>
          <View style={styles.staticContainer}>
            <TouchableWithoutFeedback onPress={onEditPress}>
              <Animated.View style={[styles.button, this.button1]}>
                <Animated.Text numberOfLines={1} style={this.dynamic_font}>EDIT</Animated.Text>
              </Animated.View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={onDeletePress}>
              <Animated.View style={[styles.button, this.button2]}>
                <Animated.Text numberOfLines={1} style={this.dynamic_font}>DELETE</Animated.Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT
  },
  static: {
    height: ROW_HEIGHT,
    right: 0,
    position: 'absolute'
  },
  staticContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }
  const config = {
    damping: 10,
    mass: 0.5,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  }
  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

function runTiming(clock, value, velocity, dest) {
  const distance = value - dest
  const duration = distance / velocity
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };
  const config = {
    duration: 225,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };
  return block([
    cond(clockRunning(clock), [
        set(config.toValue, dest),
    ], [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
}
