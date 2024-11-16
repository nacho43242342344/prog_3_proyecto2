import React, { Component } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebase/config';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            esvalido: false,
            errorMessage: ''
        };
    }

    validarForm = () => {
        const { email, username, password } = this.state;
        if (email && username && password) {
            this.setState({ esvalido: true, errorMessage: '' });
        } else {
            this.setState({ esvalido: false });
        }
    };

    handleRegister = () => {
        const { email, username, password } = this.state;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userData => {
                const user = userData.user;

                db.collection("users").doc(user.uid).set({
                    username: username,
                    email: email
                })
                .then(() => {
                    this.props.navigation.navigate('Login');
                })
                .catch(error => {
                    this.setState({ errorMessage: error.message });
                    Alert.alert('Error al guardar en Firestore', error.message);
                });
            })
            .catch(error => {
                this.setState({ errorMessage: error.message });
                Alert.alert('Error de autenticación', error.message);
            });
    };

    handleChange = (field, value) => {
        this.setState({ [field]: value }, this.validateForm);
    };

    render() {
        const { email, username, password, esvalido, errorMessage } = this.state;

        return (
            <View style={styles.container}>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => this.handleChange('email', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    value={username}
                    onChangeText={(text) => this.handleChange('username', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => this.handleChange('password', text)}
                />
                
                <TouchableOpacity 
                    style={[styles.button, { backgroundColor: esvalido ? '#007bff' : '#ccc' }]} 
                    onPress={this.handleRegister} 
                    disabled={!esvalido}
                >
                    <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5
    },
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    link: {
        marginTop: 15,
        color: '#007bff'
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    }
});

export default Register;
