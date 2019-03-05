import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Dimensions } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { Easing } from 'react-native-reanimated'

import SwipeRow from './components/SwipeRow'
import SwipeRow2 from './components/SwipeRow2'

const {
  divide,
  greaterThan,
  set,
  cond,
  startClock,
  stopClock,
  clockRunning,
  block,
  timing,
  add,
  debug,
  Value,
  Clock,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 250,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      // If the clock isn't running we reset all the animation params and start the clock
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      toggle: false,
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.clock = new Clock()
    this.finalVal = this.state.toggle ? 0 : 150
    this.startVal = this.state.toggle ? 150 : 0
    if (nextState.toggle !== this.state.toggle) {
      this.trans = runTiming(this.clock, this.startVal, this.finalVal)
    }
    return true
  }
  onEditPress = () => {
    this.setState({ toggle: true })
    this.swipe.open()
  }
  onDeletePress = () => {
    this.setState({ toggle: false })
    this.swipe.close()
  }
  render() {
    const transition = {
      width: this.trans,
      height: this.trans,
      backgroundColor: 'red',
      margin: 16,
    }
    return (
      <View style={styles.container}>
        <View style={styles.rowsContainers}>
          <SwipeRow
            onEditPress={this.onEditPress}
            onDeletePress={this.onDeletePress}
          />
        </View>
        <View style={styles.rowsContainers}>
          <SwipeRow2
            ref={(r) => this.swipe = r}
            onEditPress={this.onEditPress}
            onDeletePress={this.onDeletePress}
          />
        </View>
        <View style={styles.boxContainer}>
          <Animated.View style={transition}>

          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    paddingTop: 100,
  },
  boxContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowsContainers: {
    padding: 8,
    justifyContent: 'flex-end',
  }
})
