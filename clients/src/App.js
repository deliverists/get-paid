import React from "react";
import { View, Text, Animated, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { Router, Switch, Link, Route } from './Routing';
import InvoiceScreen from './components/Invoice';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    Home = (rotationStyle) => {
        return (
            <View style={{ alignItems: 'center', flex: 3 }}>
                <Link to={'/invoice'} component={TouchableOpacity} >
                    <Text style={styles.appIntro}>
                    Invoice
                    </Text>
                </Link>
            </View>
        );
    }
    render() {
        return (
            <View style={styles.app}>
                <Router>
                    <Switch hideNavBar={true}>
                        <Route exact path="/" component={this.Home} />
                        <Route path="/invoice" component={InvoiceScreen} />
                    </Switch>
                </Router>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    app: {
        flex: 1
    },
    appHeader: {
        flex: 1,
        backgroundColor: "#222",
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    headerImage: {
        width: 200,
        height: 200,
        flex: 3
    },
    appTitle: {
        flex: 1,
        fontSize: 16,
        color: "white"
    },
    appSubtitle: {
        color: "white"
    },
    appIntro: {
        flex: 3,
        fontSize: 30,
        textAlign: "center"
    }
});
