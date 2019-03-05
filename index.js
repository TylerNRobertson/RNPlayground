import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import { Navigation } from 'react-native-navigation'
import App from './App'

Navigation.registerComponent(`navigation.playground.screen`, () => gestureHandlerRootHOC(App))

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'navigation.playground.screen'
      }
    }
  })
})
